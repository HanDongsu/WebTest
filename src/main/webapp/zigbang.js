var winH = $(window).height();
var textTest = "123123";
var roomAddr;
console.log("roomAddr1: "+roomAddr);
$(document).ready(function(){
	getData();
	console.log("doc Ready");
	console.log("roomAddr2: "+roomAddr);
});
console.log("roomAddr3: "+roomAddr);
function getData() {
	$.getJSON("items.json", function(data){
		console.log(data);
		var jsonArray = new Array();
		var result = new Array();
		for(var i = 0; i < data.datas.length;i++) {
			jsonArray[i] = data.datas[i];
		}
		result[0] = jsonArray[0].building;
		result[1] = jsonArray[0].agent_Info;
		result[2] = jsonArray[0].inquiry;
		result[3] = jsonArray[1].cost_Info;
		result[4] = jsonArray[1].room_Info;
		result[5] = jsonArray[1].others;
		result[6] = jsonArray[1].detail_Desc;
		console.log(result[4].room_img[1]);
		console.log(result[4].room_img.length);
		console.log("addr1:" +result[4].address1);
		console.log("addr2:" +result[4].address2);
		var images = "";
		for(var i = 0; i< result[4].room_img.length;i++) {
			images += "<li class='img_li' data-index='"+i+"'><img class='r_img "+"r_img_"+i+"' id='room_img"+i+"' src='"+result[4].room_img[i].img+"'"+
			"alt='roomInside"+i+"' style='margin: 0; width: 360px; height: 360px;'/></li>"
		}
		$("#office_img").attr("src", result[0].img);
		$("#office_name").text(result[0].name);
		$("#office_addr").text(result[0].address1+" "+result[0].address2+" "+result[0].address3);
		$("#office_floor").text(result[0].floor);
		$("#office_rooms").text(result[0].rooms);
		$("#office_est").text(result[0].established);
		$(".agent_name").text(result[1].name);
		$(".agent_img").attr("src",result[1].img);
		$(".agent_email").text(result[1].email);
		$(".agent_tel").text(result[1].tel);
		$(".tel_Btn").attr("href","tel:"+result[1].tel);
		$("#office_address").text(result[1].address+", "+result[1].office+" ("+result[1].owner+")");
		$("#office_call>span").text(result[1].office_tel);
		$(".agent_word").html(result[1].agent_word);
		$(".inquiry_office").text(result[2].office +"("+result[2].owner+")");
		$(".inquiry_agent").text(result[2].position+"("+result[2].agent+")");
		$(".inquiry_tel").text(result[2].tel);
		$(".r_deposit>strong").text(result[3].deposit);
		$(".r_rentsCost>strong").text(result[3].rentsCost);
		$(".r_id").text(result[3].id);
		$(".r_address,.r_addr").text(result[4].address1+" "+result[4].address2);
		roomAddr = result[4].address1+" "+result[4].address2;
		$(".r_nearStation").text(result[4].nearStation1 + " " + result[4].nearStation2);
//		$(".r_img").attr("src",result[4].room_img1);
		$("#imgSlider").html(images);
		$(".r_floor").text(result[4].floor+"층/"+result[4].b_floor+"층");
		$(".r_size").text(result[4].size1+" "+result[4].size2+" "+result[4].size3);
		$(".r_structure").text(result[4].structure);
		$(".r_form").text(result[4].form);
		$(".r_intro").text(result[4].intro);
		$(".r_option").text(result[5].options);
		$(".r_maintenance").text(result[5].maintenance);
		$(".r_maintenanceAdd").text(result[5].maintenanceAdd);
		$(".r_parking").text(result[5].parking);
		$(".r_elevator").text(result[5].elevator);
		$(".r_date").text(result[5].date);
		$(".r_desc").html(result[6].description);
//		console.log("getJSON");
		console.log("roomAddr.getJSON: "+roomAddr)
		$(".img_li").on("click",function(event){
			console.log("clcicicicivcivcv");
			$("#Modal-Wrap").css({"display":"block"});
			$("#Modal-Wrap").css({"height":winH+"px"});
			var imgH = $(".modal-img").height();
			$(".modal-conts").css({"margin-top":((winH-imgH)/2-50)+"px"});
		});
		$("#Modal-Wrap").on("click",function(event) {
			$("#Modal-Wrap").css({"display":"none"});
		});
		var imgWid = $(".img_li").width();
		$("#back").on("click", function(event) {
			var slider_index = parseInt($("#imgSlider").attr("data-index"));
			console.log("back");
			if(slider_index != 0) {
				var slider_move = imgWid*(slider_index-1);
				$("#imgSlider").css({"transform":"translate3d(-"+slider_move+"px,0px,0px)"});
				$("#imgSlider").attr("data-index",slider_index-1);
			}
			console.log("BackBtn_data-index: "+ slider_index)
		});
		$("#next").on("click", function(event) {
			var slider_index = parseInt($("#imgSlider").attr("data-index"));
			console.log("next");
			if(slider_index < result[4].room_img.length-1) {
				var slider_move = imgWid*(slider_index+1);
				$("#imgSlider").css({"transform":"translate3d(-"+slider_move+"px,0px,0px)"});
				$("#imgSlider").attr("data-index",slider_index+1);
			}
			console.log("PrevBtn_data-index: "+ slider_index)
			console.log(result[4].room_img.length)
		});
	});
}
