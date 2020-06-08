$(function () {
    //记住密码
    if (sessionStorage.keepPassword) {
        $('.keepPassword i').attr('class', sessionStorage.keepPassword);
    }
});
//登录
$('.loginBtn').click(function () {
    var username = $('.username').val();
    var pwd = $('.password').val();
    $.md5(pwd);
    if (!username) {
        layer.alert("请输入用户名");
        return;
    }
    if (!pwd) {
        layer.alert("请输入密码");
        return;
    }
    if (username && pwd) {

        // var url = config.UserManagerService + "/Login";
        var url = "http://110.249.159.46:8089/gtkjghTest/SurveyUserManagerService.asmx/Login";
        var loginData = {
            phone: username,
            password: $.md5(pwd)
        };
        $.ajax({
            type: "post", //请求方式
            url: url,
            data: loginData,
            dataType: "text", //返回文本
            jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            async: true,
            cache: false,
            global: false,
            //请求成功后的回调函数
            success: function (xml) {
            	
            	var res = JSON.parse($(xml).text().trim());
            	if(res.JFZD.indexOf('false')>-1){
            		if(res.JFZD=="false:-1"){
	            		parent.layer.alert("手机号码未注册！");
	            	}else if(res.JFZD=="false:-2"){
	            		parent.layer.alert("密码错误，请重新输入密码！");
	            	}else if(res.JFZD=="false:2"){
	            		parent.layer.alert("用户审核未通过，请联系管理人员！");
	            	}else if(res.JFZD=="false:0"){
	            		parent.layer.alert("用户属于待审核状态，请联系管理人员！");
	            	}
            		return;
            	}else{
            		sessionStorage.sprid = username;
                    sessionStorage.pasd = $.md5(pwd);
            		sessionStorage.JFZD = res.JFZD;
            		window.location.href = "index.html";
            	}
                
            },
            error: function (res) {
                parent.layer.alert('访问服务器失败!');
            }
        });

    }
});
//注册
$(".registerBtn").click(function () {
    layer.openType = 0;
    layer.openIndex = layer.open({
        type: 2,
        title: "用户注册",
        closeBtn: 0, //不显示关闭按钮
        shade: [0],
        skin: 'layui-layer-lan',
        area: ['700px', '620px'],
        anim: 2,//弹出动画
        shade: 0.2,//遮盖层
        content: ['html/register.html', 'no'], //这里content是一个普通的String
        end: function () {

        }
    });
});

//记住密码
$('.keepPassword').click(function () {
    var isChecked = $(this).find('i').hasClass('icon-iconfontcheckboxunchecked');
    var checkclass = isChecked ? "iconfont icon-checkboxchecked" : "iconfont icon-iconfontcheckboxunchecked";
    $(this).find('i').attr('class', checkclass);
    sessionStorage.keepPassword = checkclass;
});
