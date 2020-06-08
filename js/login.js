$(function () {
    //记住密码
    if (sessionStorage.keepPassword) {
        $('.keepPassword i').attr('class', sessionStorage.keepPassword);
    }

    if (sessionStorage.userInfo) {
        var userInfo = JSON.parse(sessionStorage.userInfo)[0];
        $("#sprid").html("用户：" + userInfo.USERNAME);
    }
});
sessionStorage.clickMoudle = "";
layui.use(['form', 'element', 'jquery', 'table'], function () {
    var $ = layui.jquery;
    //首页
    $("#homepage").click(function () {
        $("iframe").attr("src", "module.html");
    });

    //关于我们
    $("#about").click(function () {
        layer.open({
            type: 2,
            title: "",
            closeBtn: 1, //不显示关闭按钮
            skin: 'layui-layer-lan',
            area: ['1000px', '475px'],
            anim: 2,//弹出动画
            shade: 0.2,//遮盖层
            content: ['support.html'], //这里content是一个普通的String
        });
    });

    //使用帮助
    $("#support").click(function () {
        layer.open({
            type: 2,
            title: "",
            closeBtn: 1, //不显示关闭按钮
            skin: 'layui-layer-lan',
            area: ['800px', '505px'],
            anim: 2,//弹出动画
            shade: 0.2,//遮盖层
            content: ['projects/zygd/html/videoShow.html'], //这里content是一个普通的String
        });
    });

    //联系我们
    $("#phoneOur").click(function () {
        layer.open({
            type: 2,
            title: "",
            closeBtn: 1, //不显示关闭按钮
            skin: 'layui-layer-lan',
            area: ['610px', '130px'],
            anim: 2,//弹出动画
            shade: 0.2,//遮盖层
            content: ['phoneOur.html'], //这里content是一个普通的String
        });
    });

    //手机端下载
    $("#androidDownload").click(function () {
        layer.open({
            type: 2,
            title: "",
            closeBtn: 1, //不显示关闭按钮
            skin: 'layui-layer-lan',
            area: ['360px', '330px'],
            anim: 2,//弹出动画
            shade: 0.2,//遮盖层
            content: ['html/androidDownload.html'], //这里content是一个普通的String
        });
    });

    //登录
    $("#openLogin").click(function () {
        sessionStorage.clickMoudle = "";
        showLoginLayer();
    });

    window.showLoginLayer = function () {
        layer.open({
            type: 1,
            title: "",
            closeBtn: 1, //不显示关闭按钮
            skin: 'layui-layer-lan',
            area: ['312px', '275px'],
            anim: 2,//弹出动画
            shade: 0.2,//遮盖层
            content: $('#loginBox') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    };

    window.goToMoudle = function () {
        var clickMoudle = sessionStorage.clickMoudle;
        var url = "";
        sessionStorage.JFZD = JSON.parse(sessionStorage.userInfos).JFZD || "";
        sessionStorage.JCFX = JSON.parse(sessionStorage.userInfos).JCFX || "";
        sessionStorage.userInfo = sessionStorage.JCFX;
        if (clickMoudle == "wphc") {//卫片核查
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/index.html";
            window.location.href = url;
        } else if (clickMoudle == "gdbh") {//占用耕地
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JFZD;
            url = "projects/zygd/index.html";
            window.location.href = url;
        } else if (clickMoudle == "phjg") {//占用耕地
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JFZD;
            url = "projects/phjg/index.html";
            window.location.href = url;
        } else if (clickMoudle == "zyjgyzt") {//资源监管一张图 数据中心
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/html/Apicture.html";
        } else if (clickMoudle == "hzfx") {//汇总分析
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/html/monitorAnalysis.html";
        } else if (clickMoudle == "dtjc") {//动态监测
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            // url= "projects/wpzf/html/monitor.html";
            url = "html/dtjc.html";
        } else if (clickMoudle == "wfxs") {//违法线索
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/html/supervise.html";
        } else if (clickMoudle == "yhgl") {//用户管理
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/html/personnelManage/personnelManage.html";
        } else if (clickMoudle == "zzzy") {//正在作业
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/wpzf/html/dynamic/dynamic.html";
        } else if (clickMoudle == "xzgl") {//销账管理
            sessionStorage.userInfo = JSON.parse(sessionStorage.userInfos).JCFX;
            url = "projects/zygd/html/dataReview/changeTab.html";
        }

        if (sessionStorage.userInfo) {
            var userInfo = JSON.parse(sessionStorage.userInfo)[0];
            $("#sprid").html("用户：" + userInfo.USERNAME);
            sessionStorage.userXZQDM = userInfo.XZQDM;
        }

        if (!clickMoudle) {
            $("iframe").attr("src", "module.html");
            return false;
        }

        if (url) {
            // window.location.href = url;
            $("iframe").attr("src", url);
        } else {
            layer.alert("模块开发中！");
        }
    };

    //登录
    $("#loginBtn").click(function () {
        //登录
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
                    if (res.JCFX.indexOf('false') > -1 && res.JFZD.indexOf('false') > -1) {

                        if (res.JCFX == "false:2" || res.JFZD == "false:2") {
                            parent.layer.alert("用户审核未通过，请联系管理人员！");
                            return;
                        }
                        if (res.JCFX == "false:0" || res.JFZD == "false:0") {
                            parent.layer.alert("用户属于待审核状态，请联系管理人员！");
                            return;
                        }
                        if (res.JCFX == "false:-2" || res.JFZD == "false:-2") {
                            parent.layer.alert("密码错误，请重新输入密码！");
                            return;
                        }
                        if (res.JCFX == "false:-1" || res.JFZD == "false:-1") {
                            parent.layer.alert("手机号码未注册！");
                            return;
                        }
                        if (res.JCFX == "false:-3" || res.JFZD == "false:-3") {
                            parent.layer.alert("手机号码不规范或手机号码未注册！");
                            return;
                        }
                    } else {
                        layer.closeAll();
                        sessionStorage.sprid = username;
                        sessionStorage.pasd = $.md5(pwd);
                        sessionStorage.userInfos = $(xml).text().trim();
                        // window.location.href = "nav.html";
                        goToMoudle();
                    }
                },
                error: function (res) {
                    parent.layer.alert('访问服务器失败!');
                }
            });
        }
    })
});
