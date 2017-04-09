$("#loginMember").on("click",function(){
	var loginInfo = {
		memberEmail : $("#member_Email").val(),
		memberPWD : $("#member_PWD").val()
	}
	console.log(loginInfo);
	ajaxLogin(loginInfo);
})
function ajaxLogin(user) {
	$.ajax({
		url:serverAddr+"/hMember/login.json",
		type:"POST",
		dataType:"json",
		data: user,
		success: function(obj) {
			var result = obj.jsonResult
			if (result.state != "success") {
				alert("로그인 실패");
				return
			}
			alert("로그인 성공");
			window.location.href ="../hMain/mainpage.html";
		}
	})
	
}
function init() {
	var cookieMap = bit.cookieToObject()
	if ("memberEmail" in cookieMap) { // cookieMap 객체에 email 이라는 이름의 프로퍼티가 있는가?
		if("memberPWD" in cookieMap) {
//			$("#member_Email").val(cookieMap["memberEmail"]);
//			$("#member_PWD").val(cookieMap["memberPWD"]);
//			window.location.href ="../hMain/mainpage.html";
			console.log("비번있");
//			memberInfo(cookieMap["memberEmail"]);
		}
		console.log("멤버들어있")
	}
}
function memberInfo(email) {
	$.ajax({
		url:serverAddr+"/hMember/login.json",
		type:"GET",
		dataType:"json",
		data: user,
		success: function(obj) {
			var result = obj.jsonResult
			if (result.state != "success") {
			}
		}
	})
}
