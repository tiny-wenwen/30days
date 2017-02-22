$(document).ready(function(){
	web.main();
});

var web={
	main : function(){
		web.init();
		web.getData();
		web.clickBtn();
		web.getRedPackets();
		web.getValue();
		web.getUserHb();
	},
	init : function(){
		this.main_Id=$("#main");
		this.peopleNum_Id=$("#people-num");
		this.timeOut_Id=$("#time-out");
		this.date_Id = $("#date");
		this.textBagFirst_Id = $("#text-bag-first");
		this.textBagSecond_Id = $("#text-bag-second");
		this.textBagThird_Id = $("#text-bag-third");
		this.textBagFourth_Id = $("#text-bag-fourth");
		this.tyoLight_Id = $("#tyo_light");
		this.llightDefault21_Id = $("#light-default-21");
		this.lightBox21_Id = $("#light-box-21");
		this.llightDefault30_Id = $("#light-default-30");
		this.lightBox30_Id = $("#light-box-30");
		this.btnClose_Id = $("#btn_close");
		this.box_Id = $("#box");
		this.btnMoney_Id = $("#btn-money");
		this.redpacketBefore_Id = $("#redpacket-before");
		this.redpacket_Id = $("#redpacket");
		this.textContinuous_Id = $("#text-continuous");
		this.textSign_Id = $("#text-sign");
		this.textAlready_Id = $("#text-already");
		this.textAalreadydays_Id = $("#text-alreadydays");
		this.textCgt_Id = $(".text-cgt");
		this.textGetMoney =$("#text-get-money");
		this.api={
			list_Api : "http://sq.iyunmai.com/bbs/activity/Challenge/get-activity.json",
			signeDates_Api : "http://sq.iyunmai.com/activity/weight-signed/get-user-signe-dates.json",//称重接口
			hbList_Api : "http://sq.iyunmai.com/activity/weight-signed/virtual/get-user-hb-list.json",//领红包接口
			getUserHb_Api: "http://sq.iyunmai.com/activity/weight-signed/virtual/get-user-hb.d"
		}
		this.data={
			day_7 : 0,
			day_14 : 0,
			day_21 : 0,
			day_30 : 0, 
			today :0,
			ifWeight : "", //1 没有称重   2已经称重
			ifLingHb : "",  //1 没有领红包   2已经领红包
			activityId : 114,
			userId :101469698//101469698//100000007//101782744//100856963

		}
	},	
	getData : function(){
		var list = [], param = [],md="";

		param = {
			activityId : activityId
		}

		com.ajax("get",web.api.list_Api,param,"","",function(data){
			web.peopleNum_Id.prepend(''+data.result.entity.cameTotalNum+'人参与');
			//获得剩余时间//秒转时间
			var time = data.result.entity.statusMarkTime;
			var days = parseInt(time/(24*60*60));//天
			var daysrmd = parseInt(time%(24*60*60));//天 余数
			var hours = parseInt(daysrmd/(60*60)); // 小时
			var hoursrmd = parseInt(daysrmd%(60*60)); //小时 余数
			var second = parseInt(hoursrmd/60); //分钟
			web.timeOut_Id.prepend(''+days+'天'+hours+'小时'+second+'分');

			//获得今天日期,添加背景
			web.date_Id.find("li[name='"+web.getTime(data.result.data.cTimestamp*1000)+"']").addClass("li-bg");			
			web.data.today = web.getTime(data.result.data.cTimestamp*1000);
			console.log("今天是："+ web.data.today);
			//称重接口，获取今天日期
			web.getTure();
		});
		
	},	
	//获取红包
	getUserHb :function(){

		var list = [], param = [] ;

		web.btnMoney_Id.click(function(){		
			
			param = {
				userId : web.data.userId,
				activityId : activityId
			}
			com.ajax("post",web.api.getUserHb_Api,param,"","",function(data){
				web.btnMoney_Id.css("animation","redpacket-turn 0.3s infinite");
				setTimeout("web.redpacketBefore_Id.hide();web.redpacket_Id.show();", 1000);
				web.redpacket_Id.append('<p class="text text-explain">获得红包</p>');
				web.redpacket_Id.append('<p class="text-money" id="text-get-money">'+data.result.data.t.money+'<span> 元</span></p>');
				web.redpacket_Id.append('<p class="text text-btnExplain">再签到五天可获得双倍红包</p>');
				web.redpacket_Id.append('<a  class="btn-look">查看我的红包</a>');
			});
		})
	},


	//领红包接口
	getRedPackets :function(){
		var param = [],ifLinHbSwich = true;
		param = {
			userId : web.data.userId,
			activityId : activityId
		}
		//领红包接口
		com.ajax("get",web.api.hbList_Api,param,"","",function(data){
			$.each(data.data.rows,function(i,d){
				if (ifLinHbSwich) {
					console.log("--领红包接口--领红包日期--"+web.getTime(d.createTime))
					console.log("--领红包接口--当天日期--"+web.data.today)
					if(web.getTime(d.createTime) == web.data.today){//领红包时间=当天日期
						web.data.ifLingHb = 2;//已领红包
						console.log("--领红包接口--已领红包")
						ifLinHbSwich = false;
						return false;
				 	}else{
				 		web.data.ifLingHb = 1;//未领红包			
						console.log("--领红包接口--未领红包")
					}
			 	}
			});
		});
	},

	//时间戳转时间
	getTime: function (timestamp){
		var newDate = new Date(timestamp);//时间戳转时间
		var m = newDate.getMonth()+1;//取月份
		var d = newDate.getDate();//取日期

		m=m<10?"0"+m:m;
		d=d<10?"0"+d:d;//个位前面加零

		var num = m.toString() + d.toString();
		return num;
	},

	//已称重打钩
	getTure : function(){
		var param = [],ifWeightSwich=true;
		param = {
			strStartTime : "2016-12-01",
			strEndTime : "2017-01-10",
			userId :  web.data.userId,
			activityId : activityId
		}
		//称重接口  到服务器请求数据需要时间
		com.ajax("get",web.api.signeDates_Api,param,"","",function(data){
			//循环时间戳
			$.each(data.rows.data,function(i,d){
				web.textAalreadydays_Id.text(data.rows.data.length);//显示已称重天数
				web.date_Id.find("li[name='"+web.getTime(d.dateNum)+"']").prepend('<span class="icon-ture"></span>');//显示已称重打钩
				//称重日期等于当天日期显示当天已称重，否则弹出称重提示框	 
				if(ifWeightSwich){
					if (web.getTime(d.dateNum) == web.data.today) {
						web.textAlready_Id.text("今日已称重");
						web.data.ifWeight=2//已称重
						ifWeightSwich=false;
					}else{
						web.data.ifWeight=1;//未称重
					}
				}
			});
			

			//七天红包，14天红包，21天优惠卷，30天红包
			$.each(data.rows.dataUserAwards,function(i,d){
				
				if (d.id==93) {
						getbtnWhite(d,web.data.day_7,web.textBagFirst_Id);
				};

				function getbtnWhite(data,day,btn){
					

					if (data.isSatisfy==false) {//isSatisfy: flase,点击弹出提示
						day=0;
						if(data.userAwards){
							day=2;
							btn.text("已领取").addClass("text-bag-white");
						}
					}

					if (data.isSatisfy==true) {//isSatisfy: true,签到满足条件，改按钮样式
						btn.addClass("text-bag-red");
						day=1;
					}	

				}

				if (d.id==94) {
					if (d.isSatisfy==false) {//isSatisfy: flase,点击弹出提示
						web.data.day_14=0;
						if(d.userAwards){//userAwards!="",显示已领取
							web.data.day_14=2;
							getbtnWhite(web.textBagSecond_Id);
						}
					}
					if (d.isSatisfy==true) {//isSatisfy: true,签到满足条件，改按钮样式
						web.textBagSecond_Id.addClass("text-bag-red");
						web.data.day_14=1;
					}	
				};
				if (d.id==95) {
					if (d.isSatisfy==false) {//isSatisfy: flase,点击弹出提示
						web.data.day_21=0;
						if(d.userAwards){//userAwards!="",显示已领取
							web.data.day_21=2;
							getbtnWhite(web.textBagThird_Id);
						}
					}
					if (d.isSatisfy==true) {//isSatisfy: true,签到满足条件，改按钮样式
						web.textBagThird_Id.addClass("text-bag-red");
						web.data.day_21=1;
					}	
				};
				if (d.id==96) {
					if (d.isSatisfy==false) {//isSatisfy: flase,点击弹出提示
						web.data.day_30=0;
						if(d.userAwards){//userAwards!="",显示已领取
							web.data.day_30=2;
							getbtnWhite(web.textBagFourth_Id);
						}
					}
					if (d.isSatisfy==true) {//isSatisfy: true,签到满足条件，改按钮样式
						web.textBagFourth_Id.addClass("text-bag-red");
						web.data.day_30=1;
					}	
				};
			});

			web.textSign_Id.text('已连续签到'+data.rows.seriesNum+'天');//连续签到

			if (data.rows.seriesNum>=21) {//连续签到等于大于21天，改变样式
				web.llightDefault21_Id.css("display","none");
				web.lightBox21_Id.css("display","block");
			}
			if (data.rows.seriesNum>=30) {//连续签到等于大于30天，改变样式
				web.llightDefault30_Id.css("display","none");
				web.lightBox30_Id.css("display","block");
			}
		});

	},
	getValue:function(){
		//当天没领红包，已称重且打钩，弹出红包
		//ifWeight : "", //1 没有称重   2已经称重
		//ifLingHb : "",  //1 没有领红包   2已经领红包
		load();
		
		function load(){
			setTimeout(function(){
				//領紅包不等于空，称重不等于空，判断其值，其中有一个等于空，重新执行函数，获取值
				if (web.data.ifLingHb && web.data.ifWeight) {
					console.log("領紅包等于空，称重等于空，或者其中一个等于空//"+"ifLingHb="+web.data.ifLingHb+"//ifWeight="+web.data.ifWeight);
					//未称重弹出提示框
				if (web.data.ifWeight==1) {
					web.box_Id.show();
					web.redpacket_Id.show();
					web.textCgt_Id.hide();
					web.redpacket_Id.append('<p class="text text-explain">您今日有一个 红包 待领取<br/>使用好轻称重<br/>或手动添加体重后可领取</p>');
					web.redpacket_Id.append('<a class="btn-go">马上去称重</a>')
				};
				if(web.data.ifLingHb==1 && web.data.ifWeight==2){//领红包等于1，称重等于2
					web.box_Id.show();//弹出领红包提示框
					web.redpacketBefore_Id.show();
				}
				}else{					
					console.log("領紅包不等于空，称重不等于空"+"//ifLingHb="+web.data.ifLingHb+"//ifWeight="+web.data.ifWeight);
					load();
				}
			},100);
		}
	},
	clickBtn:function(){
		web.btnClose_Id.click(function(){//点击关闭按钮
			web.box_Id.hide();
		});

		web.textBagFirst_Id.click(function(){
			if (web.data.day_7==0) {
				setText("连续称重7天才能领取，继续加油吧！");
			}else if(web.data.day_7==1){
				web.box_Id.show();
				web.redpacketBefore_Id.show();
			}else if(web.data.day_7==2){
				setText("7天红包已领取");
			}
		});
		web.textBagSecond_Id.click(function(){
			if (web.data.day_14==0) {
				setText("连续称重14天才能领取，继续加油吧！");
			}else if(web.data.day_14==1){
				web.box_Id.show();
				web.redpacketBefore_Id.show();
			}else if(web.data.day_14==2){
				setText("14天红包已领取");
			}
		});
		web.textBagThird_Id.click(function(){
			if (web.data.day_21==0) {
				setText("连续称重21天才能领取，继续加油吧！");
			}else if(web.data.day_21==1){
				web.box_Id.show();
				web.redpacketBefore_Id.show();
			}else if(web.data.day_21==2){
				setText("21天优惠卷已领取");
			}
		});
		web.textBagFourth_Id.click(function(){
			if (web.data.day_30==0) {
				setText("连续称重30天才能领取，继续加油吧！");
			}else if(web.data.day_30==1){
				web.box_Id.show();
				web.redpacketBefore_Id.show();
			}else if(web.data.day_30==2){
				setText("30天优惠卷已领取");
			}
		});


		function setText(days){
			web.textContinuous_Id.show().text(days);
			setTimeout("web.textContinuous_Id.hide()",1000);
		};

	}
}