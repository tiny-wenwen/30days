
$(document).ready(function(){
	com.main();
});

var com = {
	main : function(){
		com.loadBaidu();
	},
	data : {
		user : "",
		url : "http://pt.iyunmai.com/",
		appShare : {  //分享内容
			id : "",
			title : "",
			content : "",
			url : "",
			img : "",
			swich : 0  //0不显示 1显示
		}
	},
	/*
	 * 设置登录信息
	 */
	setUserInfo : function(){
		var num=0;
		
		loads();
		
		function loads(){
			setTimeout(function(){
				if(!com.isCookie(com.data.user)){
					if(num<15){
						num++;
						loads();
					}else{
						if(com.isCookie($.cookie("user"))) com.data.user=eval("("+$.cookie("user")+")");
					}
				};
			},100);
		}
	},
	/*
	 * 统计上报
	 *
	 * 页面类型 : ptype
	 * 页面上的区域名称 : parea
	 * 页面名称 : pname
	 * 行 : place1
	 * 列 : place2
	 * 操作类型打开或点击 ： action
	 * 页面id ： pageid
	 */
	statReport : function(ptype,parea,pname,place1,place2,action,pageid){
		var param=[],systype=2;
		
		if (com.isMobile().ios || com.isMobile().iPhone || com.isMobile().iPad) systype=1;
		
		try{
			param = {
				code : $.cookie("code") || "",
				token : $.cookie("token") || "",
				systype : systype,
				brand : $.cookie("brand") || "",
				mobilemac : $.cookie("mobilemac") || "",
				appver : $.cookie("appver") || "",
				channel : $.cookie("channel") || "",
				optype : $.cookie("optype") || "",
				net : $.cookie("net") || "",
				sysver : $.cookie("sysver") || "",
				userid : com.data.user.id,
				ptype : ptype || "sy",
				parea : parea || "",
				pname : pname || "",
				place1 : place1 || 0,
				place2 : place2 || 0,
				action : action || "show",
				pageid : pageid || 0
			}
			
			com.ajax("","http://log.iyunmai.com/web/log.do",param,"","",function(data){});
		}
		catch(e){}
	},
	/*
	 * ajax封装
	 */
	ajax : function(type,url,param,dataType,jsonp,callback,error,name){
		if (!url) return false;
		if(!name) var name="";
		
		name = $.ajax({
			type : type || 'post',
			url : url,
			traditional : true,
			data : param || '',
			dataType : dataType || 'json',
			jsonp : jsonp,
			cache: true,
			success : callback,
			error : error
		});
	},
	/*  
	 * 自适应
	 */
	resize : function(param,$obj){
		var width=0,ratio=0,wRatio=0,len=0;

		$(window).ready(function(){
			res();
		});
		
		$(window).resize(function(){
			res();
		});
		
		function res(){
			width=$(this).width();
			wRatio=width/320;
			ratio=width<961?width<321?1:wRatio:960/320;
			len=param.length;
			
			for(var i=0;i<len;i++){
				param[i][0].css({"height":getRatioH(param[i][1]),"transform":"scale("+ratio+") rotate(0.0001deg)","transform-origin":"top"});
			}
			
			if($obj) $obj.show();
		}
		
		function getRatioH(h){
			return width<961?width<321?h:wRatio*h:(960/320)*h;
		}
	},
	/*
	 * 设置动画样式
	 */
	animatStyle : function(style,type){
		if(type==1){
			return "animation:"+style+"; -webkit-animation:"+style+";";
		}else{
			return {"animation":style,"-webkit-animation":style}
		}
		
	},
	/*
	 * 获取URL参数
	 */
	queryString : function(key){
		return (document.location.search.match(new RegExp("(?:^\\?|&)"+key+"=(.*?)(?=&|$)"))||['',null])[1];
	},
	/*
	 * 设置Cookie时间
	 * time分钟
	 */
	setCookieTime : function(time){
		var date = new Date();
		date.setTime(date.getTime() + (time * 60 * 1000));
		return date;
	},
	/*
	 * 判断移动设备
	 */
	isMobile : function(){
		var u = navigator.userAgent;

		return {
			mobile : !!u.match(/AppleWebKit.*Mobile.*/),
			ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
			android : u.indexOf('Android') > -1,
			iPhone : u.indexOf('iPhone') > -1,
			iPad : u.indexOf('iPad') > -1,
			mac : u.indexOf('Mac OS X')>0
		};
	},
	/*
	 * 判断android版本号
	 */
	androidVer : function(){
		var u = window.navigator.userAgent,ver=u.substr(u.indexOf('Android') + 8,3);
		
		return ver;
	},
	/*
	 * 判断是否IOS7
	 */
	iosVer_7 : function(){
		if(String(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)).indexOf('OS 7_')>-1) return true;
	},
	/*
	 * 随机数
	 */
	getRandom : function() {
		var Min = 10000,Max = 99999,Range = Max - Min,Rand = Math.random();
		return (Min + Math.round(Rand * Range));
	},
	getRandomNum : function(min,max){
		return (Math.random()*(max-min)+min) | 0;
	},
	/*
	 * 转换时间
	 */
	getLocalTime : function(timestamp){
		var nowDate=new Date(),nowMon=nowDate.getMonth()+1,nowDay=nowDate.getDate(),nowHou=nowDate.getHours(),nowMin=nowDate.getMinutes(),d=new Date(timestamp*1000),mon=d.getMonth()+1,day=d.getDate(),hou=d.getHours(),minu=d.getMinutes(),monHtml,dayHtml,houHtml,minuHtml;
		
		if(mon<9) monHtml="0"+mon;
		else monHtml = mon;
		if(day<9) dayHtml="0"+day;
		else dayHtml = day;
		if(hou<9) houHtml="0"+hou;
		else houHtml = hou;
		if(minu<9) minuHtml="0"+minu;
		else minuHtml = minu;
		
		if(nowMon==mon && nowDay==day){
			if(nowHou==hou && nowMin-minu>-2 && nowMin-minu<1){
				return "刚刚"
			}else{
				return houHtml+':'+minuHtml
			}
		}else{
			return monHtml+"-"+dayHtml+' '+houHtml+':'+minuHtml;
		}
	},
	changeDate : function(date){
		var nowDate=new Date(),nowMon=nowDate.getMonth()+1,nowDay=nowDate.getDate(),nowHou=nowDate.getHours(),nowMin=nowDate.getMinutes(),da=new Date(date),d=new Date(da.getTime()-14*60*60*1000),mon=d.getMonth()+1,day=d.getDate(),hou=d.getHours(),minu=d.getMinutes(),monHtml,dayHtml,houHtml,minuHtml;
		
		if(mon<9) monHtml="0"+mon;
		else monHtml = mon;
		if(day<9) dayHtml="0"+day;
		else dayHtml = day;
		if(hou<9) houHtml="0"+hou;
		else houHtml = hou;
		if(minu<9) minuHtml="0"+minu;
		else minuHtml = minu;
		
		if(nowMon==mon && nowDay==day){
			if(nowHou==hou && nowMin-minu>-2 && nowMin-minu<1){
				return "刚刚"
			}else{
				return houHtml+':'+minuHtml
			}
		}else{
			return monHtml+"-"+dayHtml+' '+houHtml+':'+minuHtml;
		}
	},
	changeTime : function(times){
		var h = parseInt(times/3600),m=parseInt((times%3600)/60),s=times%60;
		
		if(h<9 && h>0) h="0"+h;
		if(h>0) h=h+"'";
		else h="";
		
		if(m<9 && m>0) m="0"+m;
		if(s<9 && s>0) s="0"+s;
		if(s==0) s="00";
		
		return h+m+"' "+s;
	},
	/*
	 * 获取日期
	 */
	getDates : function(){
		var nowDate=new Date(),nowYear=nowDate.getFullYear(),nowMon=nowDate.getMonth()+1,nowDay=nowDate.getDate();
		
		nowMon=nowMon<10?"0"+nowMon:nowMon;
		nowDay=nowDay<10?"0"+nowDay:nowDay;
		
		return nowYear+'-'+nowMon+'-'+nowDay;
	},
	/*
	 * 百度统计
	 */
	loadBaidu : function(){
		$.ajax({
			type : "GET",
			url : "http://hm.baidu.com/h.js?1d85d160f6268ac5ba03f213bdd5d92a",
			dataType : "script",
			cache:true,
			success : function(){}
		});
	},
	/*
	 * 百度统计事件
	 */
	baiduCountEvent : function(name,action,opt_label,opt_value){
		try{
			_hmt.push(['_trackEvent',name,action,opt_label,opt_value]);
        }
        catch(e){}
	},
	/*
	 * 判断COOKIE是否为空
	 */
	isCookie : function(key){
		return (typeof(key)=="undefined" || key==null || key=="undefined" || key=="null" || key=="<null>" || !$.trim(key))?false:true;
	},
    /*
	 * 验证信息
	 */
    checkValue : function(type,value){
    	var regExp="";
    	
    	switch(type){
			case "user": //账号
				regExp=new RegExp("^[\u4e00-\u9fa5A-Za-z0-9-_]*$");
				break;
			case "tel": //手机号
				regExp=new RegExp("^1[2|3|4|5|7|8][0-9]\\d{8,8}$");
				break;
			case "pwd": //密码
				regExp=new RegExp("^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,12}$");
				break;
			case "code": //验证码
				regExp=new RegExp("^[a-zA-Z0-9]+$");
				break;
			case "num": //数字
				regExp=new RegExp("^[\0-9\.]*$");
				break;
			case "mail": //邮箱
				regExp=new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
				break;
			case "zipCode": //邮政编码
				regExp=new RegExp(/^\d{6}$/);
				break;
			case "special": //特殊字符
				regExp=new RegExp(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im);
				break;
			default:
		}
    	
    	return regExp.test(value);
    },
    /*
	 * APP接口
	 * type 1 打卡， 2进入个人中心， 3 进入打卡页面
	 */
	appApi : function(type,id,name,describe){
		if(com.isMobile().ios||com.isMobile().iPhone||com.isMobile().iPad){
			switch(type){
				case 1: //打卡
					window.location.href="objc://checkIn:/activityId:"+id+"/name:"+name+"/describe:"+describe;
					break;
				case 2: //进入个人中心  id为0自己，id不为0别人
					window.location.href="objc://personalCenter:/userId:"+(id||0);
					break;
				case 3: //进入打卡页面
					window.location.href="objc://cardDetails:/cardId:"+id; 
					break;
				default:
			}
		}else if(com.isMobile().android){
			try{
				switch(type){
					case 1: //打卡
						window.yunmai_activity.getActivityInfo(id,name,describe);
						break;
					case 2: //进入个人中心  id为0自己，id不为0别人
						window.yunmai_activity.getPersonalCenter(id||0);
						break;
					case 3: //进入打卡页面
						window.yunmai_activity.getCardDetails(id);
						break;
					default:
				}
			}catch(e){}
		}
	},
    /*
	 * 分享
	 */
	appShare : function(){
		return '{"swich":"'+com.data.appShare.swich+'","id":"'+com.data.appShare.id+'","title":"'+encodeURIComponent(com.data.appShare.title)+'","content":"'+encodeURIComponent(com.data.appShare.content)+'","url":"'+encodeURIComponent(com.data.appShare.url)+'","img":"'+encodeURIComponent(com.data.appShare.img)+'"}';
	}
};

