
/**
 * Socket.IO 사용하기
 * 
 * 그룹 채팅하기
 * 
 * 'message' 이벤트 처리할 때 command가 'groupchat'인 경우 해당 room 정보 찾아서 메시지 전송
 * 'room' 이벤트 처리 (command : create, update, delete, list, enter, leave)
 */

//===== 모듈 불러들이기 =====//
var express = require('express')
  , http = require('http')
  , path = require('path');


var config = require('./config/config');
var database = require('./database/database');
var route_loader = require('./routes/route_loader');


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');


//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');


//===== Socket.IO 사용 =====//
var socketio = require('socket.io');

//===== cors 사용 - 클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원 =====//
var cors = require('cors');


//===== Express 서버 객체 만들기 =====//
var app = express();


//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', config.server_port);
app.use('/public', express.static(path.join(__dirname, 'public')));

//===== body-parser, cookie-parser, express-session 사용 설정 =====//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//===== Passport 사용 설정 =====//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());


//===== 라우터 미들웨어 사용 =====//
app.use(app.router);

//라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app);



//===== Passport 관련 라우팅 및 설정 =====//

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

//패스포트 관련 함수 라우팅
var userPassport = require('./routes/user_passport');
userPassport(app, passport);


/*
var isLoggedIn = function(req, res, next) {
	console.log('isLoggedIn 미들웨어 호출됨.');
	
	if (req.isAuthenticated()) {
		return next();
	}
	
	res.redirect('/');
}
*/


//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});



// 로그인 아이디 매핑 (로그인 ID -> 소켓 ID)
var login_ids = {};



// socket.io 서버를 시작합니다.
var io = socketio.listen(server);
console.log('socket.io 요청을 받아들일 준비가 되었습니다.');

// 클라이언트가 연결했을 때의 이벤트 처리
io.sockets.on('connection', function(socket) {
	console.log('connection info :', socket.request.connection._peername);

    // 소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    

    // 'login' 이벤트를 받았을 때의 처리
    socket.on('login', function(login) {
    	console.log('login 이벤트를 받았습니다.');
    	console.dir(login);

        // 기존 클라이언트 ID가 없으면 클라이언트 ID를 맵에 추가
        console.log('접속한 소켓의 ID : ' + socket.id);
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;

        console.log('접속한 클라이언트 ID 갯수 : %d', Object.keys(login_ids).length);

        // 응답 메시지 전송
        sendResponse(socket, 'login', '200', '로그인되었습니다.');
    });

    
    // 'message' 이벤트를 받았을 때의 처리
    socket.on('message', function(message) {
    	console.log('message 이벤트를 받았습니다.');
    	console.dir(message);
    	
        if (message.recepient =='ALL') {
            // 나를 포함한 모든 클라이언트에게 메시지 전달
        	console.dir('나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.')
            io.sockets.emit('message', message);
        } else {
        	// command 속성으로 일대일 채팅과 그룹채팅 구분
        	if (message.command == 'chat') {
	        	// 일대일 채팅 대상에게 메시지 전달
	        	if (login_ids[message.recepient]) {
	        		io.sockets.connected[login_ids[message.recepient]].emit('message', message);
	        		
	        		// 응답 메시지 전송
	                sendResponse(socket, 'message', '200', '메시지를 전송했습니다.');
	        	} else {
	        		// 응답 메시지 전송
	                sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.');
	        	}
        	} else if (message.command == 'groupchat') {
	        	// 방에 들어있는 모든 사용자에게 메시지 전달
	        	io.sockets.in(message.recepient).emit('message', message);
	        		
	        	// 응답 메시지 전송
	            sendResponse(socket, 'message', '200', '방 [' + message.recepient + ']의 모든 사용자들에게 메시지를 전송했습니다.');
        	}
        	
        }
    });
    

    // 'room' 이벤트를 받았을 때의 처리
    socket.on('room', function(room) {
    	console.log('room 이벤트를 받았습니다.');
    	console.dir(room);
    	
        if (room.command === 'create') {

        	if (io.sockets.adapter.rooms[room.roomId]) { // 방이 이미 만들어져 있는 경우
        		console.log('방이 이미 만들어져 있습니다.');
        		
        	} else {
        		console.log('방을 새로 만듭니다.');
        		
        		socket.join(room.roomId);
        		
	            var curRoom = io.sockets.adapter.rooms[room.roomId];
	            curRoom.id = room.roomId;
	            curRoom.name = room.roomName;
	            curRoom.owner = room.roomOwner;
        	}

        } else if (room.command === 'update') {
        	
            var curRoom = io.sockets.adapter.rooms[room.roomId];
            curRoom.id = room.roomId;
            curRoom.name = room.roomName;
            curRoom.owner = room.roomOwner;
             
        } else if (room.command === 'delete') {

            socket.leave(room.roomId);
 
            if (io.sockets.adapter.rooms[room.roomId]) { // 방이  만들어져 있는 경우
            	delete io.sockets.adapter.rooms[room.roomId];
            } else {  // 방이  만들어져 있지 않은 경우
            	console.log('방이 만들어져 있지 않습니다.');
            	
            }
        } else if (room.command === 'join') {  // 방에 입장하기 요청

            socket.join(room.roomId);
         
            // 응답 메시지 전송
            sendResponse(socket, 'room', '200', '방에 입장했습니다.');
        } else if (room.command === 'leave') {  // 방 나가기 요청

            socket.leave(room.roomId);
         
            // 응답 메시지 전송
            sendResponse(socket, 'room', '200', '방에서 나갔습니다.');
        }

        var roomList = getRoomList();
        
        var output = {command:'list', rooms:roomList};
        console.log('클라이언트로 보낼 데이터 : ' + JSON.stringify(output));
        
        io.sockets.emit('room', output);
    });
    
    
    
});

function getRoomList() {
	console.dir(io.sockets.adapter.rooms);
	
    var roomList = [];
    
    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) { // for each room
    	console.log('current room id : ' + roomId);
    	var outRoom = io.sockets.adapter.rooms[roomId];
    	
    	// find default room using all attributes
    	var foundDefault = false;
    	var index = 0;
        Object.keys(outRoom).forEach(function(key) {
        	console.log('#' + index + ' : ' + key + ', ' + outRoom[key]);
        	
        	if (roomId == key) {  // default room
        		foundDefault = true;
        		console.log('this is default room.');
        	}
        	index++;
        });
        
        if (!foundDefault) {
        	roomList.push(outRoom);
        }
    });
    
    console.log('[ROOM LIST]');
    console.dir(roomList);
    
    return roomList;
}

// 응답 메시지 전송 메소드
function sendResponse(socket, command, code, message) {
	var statusObj = {command: command, code: code, message: message};
	socket.emit('response', statusObj);
}


