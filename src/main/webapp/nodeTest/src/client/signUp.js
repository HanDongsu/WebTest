var checkedEmail;
var checkedPassword;
var checkedPassword2;
var checkedNick;
$(document).ready(function(){
//	$("#member_PWD").keyup(function(){
//		var pwd = $("#member_PWD").val();
//		if(pwd.length >= 8) {
//			console.log("pwd: "+isPWD(pwd));
//			if(!isPWD(pwd)) {
//				console.log(pwd)
//				$("#password_alert").html("사용 불가");
//				checkedPassword2 = false;
//			} else {
//				$("#password_alert").html("사용 가능");
//				console.log(pwd)
//				checkedPassword2 = true;
//			}
//		} else {
//			$("#password_alert").html("");
//		}
//	});
	$("#member_PWD").keyup(function(){
		var pwd = $("#member_PWD").val();
		if(pwd.length >= 8) {
			switch(isPWD(pwd)) {
			case 'pwdHighLV':
				$("#password_alert").html(" 보안 높음.");
				$("#password_alert").css({"color":"green"});
				checkedPassword2 = true;
				break;
			case 'pwdMidLV':
				$("#password_alert").html(" 보안 중간.");
				$("#password_alert").css({"color":"yellow"});
				checkedPassword2 = true;
				break;
			case 'pwdLowLV':
				$("#password_alert").html(" 보안 낮음.");
				$("#password_alert").css({"color":"red"});
				checkedPassword2 = true;
				break;
			case 'pwdFailed':
				$("#password_alert").html(" 1한글 및 \$ \; \& \| \% \' \" \= \# ? ＼. 사용 불가");
				$("#password_alert").css({"color":"black"});
				checkedPassword2 = false;
				break;
			case 'pwdRefuse':
				$("#password_alert").html(" 2가지 이상 조합1");
				$("#password_alert").css({"color":"black"});
				checkedPassword2 = false;
				break;
			}
		} else if(isPWD(pwd) == "pwdFailed"){
			$("#password_alert").html(" 2한글 및 \$ \; \& \| \% \' \" \= \# ? ＼. 사용 불가");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) == "pwdRefuse"){
			$("#password_alert").html(" 2가지 이상 조합해주세요");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(pwd.length == 0){
			$("#password_alert").html("");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) == "pwdTooShort"){
			$("#password_alert").html(" 8자 이상 써주세요.");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) =="pwdTooShortandRefuse") {
			$("#password_alert").html(" 8자 이상 2가지 이상 조합해주세요");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		}
	});
	$("#check_member_PWD").keyup(function(){
		var pw1 = $("#member_PWD").val();
		var pw2 = $("#check_member_PWD").val();
		if(pw1.length >= 1) {
			if(pw1 != pw2) {
				$("#check_PWD_msg").html("비번호가 일치하지 않습니다.");
				checkedPassword = false;
			} else {
				$("#check_PWD_msg").html("비번호가 일치합니다.");
				checkedPassword = true;
			}
		} else {
			$("#check_PWD_msg").html("");
		}
	});
	$("#member_Email").keyup(function(){
		var email = $("#member_Email").val();
		if(email.length >= 1) {
			if(!isEmail(email)) {
				$("#check_Email_msg").html("잘못된 이메일 형식입니다.");
				checkedEmail = false;
			} else {
				$.ajax({
					url:serverAddr + "/hMember/checkedEmail.json",
					type: "POST",
					dataType: "json",
					data: {memberEmail:email},
					success: function (obj) {
						var result = obj.jsonResult
						if (result.state != "success") {
							$("#check_Email_msg").html("사용중인 이메일 입니다.");
							checkedEmail = false;
						} else {
							$("#check_Email_msg").html("사용 가능한 이메일 입니다.");
							checkedEmail = true;
						}
					}
				});
			}
		} else {
			$("#check_Email_msg").html("");
		}
	});
	
	$("#member_Nick").keyup(function(){
		var nick = $("#member_Nick").val();
		if(nick.length >= 1) {
			if(!isNick(nick)) {
				$("#check_Nick_msg").html("공백이나 특수문자는 사용할 수 없습니다.");
				checkedNick = false;
			} else {
				$.ajax({
					url:serverAddr + "/hMember/checkedNick.json",
					type: "POST",
					dataType: "json",
					data: {memberNick:nick},
					success: function (obj) {
						var result = obj.jsonResult
						if (result.state != "success") {
							$("#check_Nick_msg").html("사용 불가");
							checkedNick = false;
						} else {
							$("#check_Nick_msg").html("사용 가능");
							checkedNick = true;
						}
					} 
				});
			}
		} else {
			$("#check_Nick_msg").html("");
		}
	});
	
});
$("#submitMember").click(function(event){
	var memberData = {
		memberEmail: $("#member_Email").val(),
		memberPWD: $("#member_PWD").val(),
		memberName: $("#member_Name").val(),
		memberGender: $("#member_Gender").val(),
		memberTel: $("#member_Tel").val(),
		memberNick: $("#member_Nick").val()
	}
	console.log("pass: "+ $("#member_PWD").val())
	ajaxSignup(memberData);
});
// 이메일 유효성
function isEmail(email) {
	var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   
	if(regex.test(email) === false) {
		return false;  
	} else {
		return true;
	}
}
// 닉네임 유효성
function isNick(nick) {
	var regex = /[\s\{\}\[\]\/?.,;:|\)*~`!^\+<>@\#$%&\'\"\\\(\=]/gi;
	if(regex.test(nick) === false){
		return true;
	} else {
		return false;
	}
}
// \w 알파벳+숫자+언더바 
// 패스워드 유효성
function isPWD(pwd) {
	var pwdLowLV_checker = 
		/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[a-z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[A-Z])(?=.*\d))|((?=.*[A-Z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])))/;
	var pwdMidLV_checker =
		/^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[A-Z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[a-z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])))/;
	var pwdHighLV_checker =
		/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))/;
	var exceptions = /[\#\$\;\&\|\%\'\"\=\?\\]/;
	var regexK = /^(?=.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣])/;
	if(!exceptions.test(pwd) && !regexK.test(pwd)) {
		if(pwd.length > 7 && pwdHighLV_checker.test(pwd)){
			return "pwdHighLV";
		} else if(pwd.length > 7 && pwdMidLV_checker.test(pwd)){
			return "pwdMidLV";
		} else if(pwd.length > 7 && pwdLowLV_checker.test(pwd)) {
			return "pwdLowLV";
		} else if(pwd.length < 8){
			if(!pwdHighLV_checker.test(pwd)&&!pwdMidLV_checker.test(pwd)&&!pwdLowLV_checker.test(pwd)) {
				return "pwdTooShortandRefuse";
			} else {
				return "pwdTooShort";
			}
//		} else if(pwd.length > 7){
//			if(!pwdHighLV_checker.test(pwd)&&!pwdMidLV_checker.test(pwd)&&!pwdLowLV_checker.test(pwd)) {
//				return "pwdRefuse";
//			}
		} else {
			return "pwdRefuse";
		}
	} else {
		return "pwdFailed";
	}
}
//	var regexK = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/g; // 한글 /^[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/g;
//	var regexS = /[\s\{\}\[\]\/.,:\)*~`!^\+<>@\#%\(\-\_]/; //특수문자
//	// 특수문자 중 $ ; & | % ' " = # ? ＼ 는 사용하실 수 없습니다.
//	var regexN = /[\d]/; // 숫자
//	var regexL = /[\l]/; // 소문자
//	var regexU = /[\u]/; // 대문자
//	var regex = /^(?=.*[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣])(?=.*[a-z])((?=.*[a-z])|(?=.*[A-Z])|(?=.*\d)|(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])).{8,16}$/;
//	var regex1 = /(?=.*[a-z])/;
//	var regex2 = /(?=.*[A-Z])/;
//	var regex3 = /(?=.*\d)/;
//	var regex4 = /(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])/;
//	if(regex1.test(pwd)===false||regex2.test(pwd)===false||)
function ajaxSignup(user) {
	$.ajax({
		url:serverAddr + "/hMember/joinMember.json",
		type: "POST",
		dataType: "json",
		data: user,
		success: function (obj) {
			var result = obj.jsonResult
			if (result.state != "success"||checkedEmail!=true||checkedPassword!=true||checkedNick!=true||checkedPassword2!=true) {
				alert("가입실패 하였습니다. 정확히 입력 후 재시도 해주세요")
				return
			}
			alert("축하합니다 가입되었습니다.<br>로그인페이지로 이동합니다.")
			location.href = "../hMember/signIn.html"
		}
	});
}

//function maxLengthCheck(object){
//    if (object.value.length > 11){
//        object.value = object.value.slice(0, 11);
//    }    
//}
