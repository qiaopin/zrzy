var userInfo = JSON.parse(sessionStorage.JFZD)[0];
var fwbh = newguid();
var layuiform = null;
var layuiupload = null;

//获取乡镇列表
function getXZListByDM() {
    var str = "";
    var url = "http://110.249.159.46:8089/gtkjghTest/ConfigManagerService.asmx/GetXZNamesbyXZQDM";
    $.ajax(url, {
        data: {
            xzqdm: userInfo.XZQDM
        },
        dataType: "text", //返回文本
        jsonp: "jsonp",
        async: false,
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function (xml) {
            var resStr = $(xml).text();
            var resArr = JSON.parse(resStr);
            str += "<option value=''></option>";
            $.each(resArr, function (i, v) {
                str += '<option value="' + v + '">';
                str += v;
                str += '</option>';
            });
            $("#XZMC").html(str);
            // getCList(resArr[0]);
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        }
    });
}

//获取村列表
function getCList(xzmc) {
    var str = "";
    var url = "http://110.249.159.46:8089/gtkjghTest/ConfigManagerService.asmx/GetCMCNamesbyXZQDM";
    $.ajax(url, {
        data: {
            xzqdm: userInfo.XZQDM,
            xzmc: xzmc
        },
        dataType: "text", //返回文本
        jsonp: "jsonp",
        async: false,
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        success: function (xml) {
            var resStr = $(xml).text();
            var resArr = JSON.parse(resStr);
            str += "<option value=''></option>";
            $.each(resArr, function (i, v) {
                str += '<option value="' + v + '">';
                str += v;
                str += '</option>';
            });
            $("#CSQMC").html(str);
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        }
    });
}

//切换乡镇
$("#XZMC").change(function () {
    getCList($(this).val());
});

function newguid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function afterSubmit(){
    var data = {
        ID: $("#ID").val(),
        FWBH: $("#FWBH").val(),
        FWJSZTMC: $("#FWJSZTMC").val(),
        JSQYSFZDM: $("#JSQYSFZDM").val(),
        JSQYSHTYDM: $("#JSQYSHTYDM").val(),
        FWXZ: $("#FWXZ").val(),
        FWWZ: $("#FWWZ").val(),
        JZMJ: $("#JZMJ").val(),
        LXFS: $("#LXFS").val(),
        SMC: $("#SMC").val(),
        XMC: $("#XMC").val(),
        XZMC: $("#XZMC").val(),
        CSQMC: $("#CSQMC").val(),
        XZQDM: $("#XZQDM").val(),
        FWZB: parent.layer.pointZB,
        TBRQ: getNowTime(),//填表日期
        ZYGDMJ: $("#ZYGDMJ").val(),//占用耕地总面积（亩）
        SFYFBL: $("#SFYFBL").val(),//是否已经依法办理土地审批手续
        YGDMJ: $("#YGDMJ").val() || 0,//原耕地面积
        PZYDDW: $("#PZYDDW").val(),//批准用地单位
        PZWH: $("#PZWH").val(),//批准文号
        PZRQ: $("#PZRQ").val() || "1980-01-01",//批准时间
        WBLZYGDMJ: $("#WBLZYGDMJ").val() || 0,//占用耕地面积（亩）
        JBNT: $("#JBNT").val() || 0,//（所占地类）基本农田_亩
        YBGD: $("#YBGD").val() || 0,//（所占地类）一般耕地_亩
        JFSJ: $("#JFSJ").val() || "1980-01-01",//建房时间
        JFZT: $("#JFZT").val(),//建房状态
        ZZORXS: $("#ZZORXS").val(),//房屋使用方式
        SFBCJF: $("#SFBCJF").val(),//是否本村村民建房
        SFFHTJ: $("#SFFHTJ").val(),//本村村民建房是否符条件
        SFCMJ: $("#SFCMJ").val(),//符合“一户一宅”条件宅基地是否超面积
        CCMJ: $("#CCMJ").val(),//超出面积(平方米)
        ZATS: $("#ZATS").val(),//住宅套数
        XSTS: $("#XSTS").val(),//销售套数
        XSBCMS: $("#XSBCMS").val(),//销售给本村村民__套
        XSWCMS: $("#XSWCMS").val(),//销售给外村村民__套
        XSCZJMS: $("#XSCZJMS").val(),//销售给城镇居民__套
        TBR: $("#TBR").val(),//填报人,用户id
        DCR: $("#DCR").val(),//填报人
        FZR: $("#FZR").val(),//两委主要负责人
        XZFZR: $("#XZFZR").val(),//乡镇党政主要负责人
        SZDGTFZR: $("#SZDGTFZR").val(),//所在地国土管理所主要负责人
        PHOTOS: $("#PHOTOS").val(),//实际照片
        PHOTOINFO: $("#PHOTOINFO").val(),//实际照片信息
        SHZT: "",//审核状态
        FJLR: "",//附件内容
    };
    var postStr = JSON.stringify(data);

    RurallandService("/AddRuralland", {record: postStr}, true, function (resjson) {
        if (resjson.indexOf("true") > -1) {
            layer.alert("新增成功!");
            // parent.GetRurallandnByXzqdm();
            parent.location.reload();
            parent.layer.close(parent.layer.openIndex);
        } else {
            parent.layer.alert("新增失败!")
        }
    });
}

function getNowTime() {
    function getNow(s) {
        return s < 10 ? '0' + s : s;
    }

    var myDate = new Date();
    var year = myDate.getFullYear(); //获取当前年
    var month = myDate.getMonth() + 1; //获取当前月
    var date = myDate.getDate(); //获取当前日
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    var now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
    return now;
}