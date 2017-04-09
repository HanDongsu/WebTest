var express = require('express');
var app = express();
app.get("/", function(req, res) {
	res.send('/nodeTest/fe/chatMain.html');
});
app.get("/", function(req, res) {
	res.send('hello World!');
});
app.listen(8000, function() {
	console.log("connect 8000 port!")
});