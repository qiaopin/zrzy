var layuiform = null;
var layuiupload = null;
var userInfo = JSON.parse(sessionStorage.JFZD)[0];
layui.use(['form', 'element', 'laydate', 'table', 'slider', 'upload'], function () {

    layuiform = layui.form;
    var layuidate = layui.laydate;
    layuidate.render({
        elem: '#PZRQ'
    });
    layuidate.render({
        elem: '#JFSJ'
    });

    layuiupload = layui.upload;
    layuiupload.render({//上传
        elem: '#update'
        , auto: false
        , accept: 'file' //普通文件
        , exts: 'jpg|png' //只允许上传压缩文件
        , choose: function (obj) {
            var files = obj.pushFile();
            obj.preview(function (index, file, result) {
                delete files[index];
                parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
                RurallandService("/AddRuralFJLR", {
                    xzqdm: parent.layer.data.XZQDM,
                    fwbh: parent.layer.data.FWBH,
                    content: result,
                    fjlrname: file.name
                }, true, function (resjson) {
                    if (resjson.indexOf("ok") > -1) {
                        parent.layer.alert("上传成功!");
                        GetRuralFJLRPath();

                    } else {
                        parent.layer.alert("上传失败!")
                    }
                    parent.layer.close(parent.layer.loadIndex);
                });
            });
        }
    });

    //查询该条数据有无错误
    RurallandStatisticsService("/TestCheck2", {fwbh: parent.layer.data.FWBH}, true, function (resjosn) {
        var resjosn = $.parseJSON(resjosn);
        if (resjosn.length > 0) {
            layer.alert(resjosn.join(";"));
        }
    });

    RurallandService("/GetRurallandInfoByID", {id: parent.layer.data.FWBH}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            parent.layer.data = resjosn[0];
            GetRuralFJLRPath();
            GetRuralPhotoPath();
            init();
            if (parent.layer.look) {
                $("input,a,select").attr('disabled', true);
                $("#ok").addClass('layui-btn-disabled').attr('disabled', true);
            }
        }
    });
});

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

function init() {
    if (parent.layer.data.JFSJ.indexOf("1980-01-01") > -1) {
        parent.layer.data.JFSJ = "";
    }
    if (parent.layer.data.PZRQ.indexOf("1980-01-01") > -1) {
        parent.layer.data.PZRQ = "";
    }
    $("#ID").val(parent.layer.data.ID);
    $("#FWBH").val(parent.layer.data.FWBH);//房屋编号
    $("#FWJSZTMC").val(parent.layer.data.FWJSZTMC);//房屋建设主体名称
    $("#JSQYSFZDM").val(parent.layer.data.JSQYSFZDM);//建房企业（个人身份证/统一社会信用代码）
    $("#JSQYSHTYDM").val(parent.layer.data.JSQYSHTYDM);//建房企业社会信用代码（社会统一代码）
    $("#FWXZ").val(parent.layer.data.FWXZ);//房屋性质
    $("#FWWZ").val(parent.layer.data.FWWZ);//房屋位置
    $("#JZMJ").val(parent.layer.data.JZMJ);//建筑面积（平方米）
    $("#LXFS").val(parent.layer.data.LXFS);//联系方式
    $("#SMC").val(parent.layer.data.SMC);//市名称
    $("#XMC").val(parent.layer.data.XMC);//县名称
    $("#XZMC").val(parent.layer.data.XZMC);//乡镇名称

    getCList(parent.layer.data.XZMC);
    $("#CSQMC").val(parent.layer.data.CSQMC);//村（社区）名称


    $("#XZQDM").val(parent.layer.data.XZQDM);//行政区代码
    $("#FWZB").val(parent.layer.data.FWZB);//房屋坐标
    $("#TBRQ").val(parent.layer.data.TBRQ);//填表日期

    $("#ZYGDMJ").val(parent.layer.data.ZYGDMJ);//占用耕地总面积（亩）
    $("#SFYFBL").val(parent.layer.data.SFYFBL);//是否已经依法办理土地审批手续
    $("#YGDMJ").val(parent.layer.data.YGDMJ);//原耕地面积
    $("#PZYDDW").val(parent.layer.data.PZYDDW);//批准用地单位
    $("#PZWH").val(parent.layer.data.PZWH);//批准文号
    $("#PZRQ").val(parent.layer.data.PZRQ);//批准时间
    $("#WBLZYGDMJ").val(parent.layer.data.WBLZYGDMJ);//占用耕地面积（亩）
    $("#JBNT").val(parent.layer.data.JBNT);//（所占地类）基本农田_亩
    $("#YBGD").val(parent.layer.data.YBGD);//（所占地类）一般耕地_亩
    $("#JFSJ").val(parent.layer.data.JFSJ);//建房时间
    $("#JFZT").val(parent.layer.data.JFZT);//建房状态
    $("#ZZORXS").val(parent.layer.data.ZZORXS);//房屋使用方式

    $("#ZATS").val(parent.layer.data.ZATS);//住宅套数
    $("#XSTS").val(parent.layer.data.XSTS);//销售套数
    $("#XSBCMS").val(parent.layer.data.XSBCMS);//销售给本村村民__套
    $("#XSWCMS").val(parent.layer.data.XSWCMS);//销售给外村村民__套
    $("#XSCZJMS").val(parent.layer.data.XSCZJMS);//销售给城镇居民__套
    $("#TBR").val(parent.layer.data.TBR);//填报人,用户id
    $("#DCR").val(parent.layer.data.DCR);//填报人
    $("#FZR").val(parent.layer.data.FZR);//两委主要负责人
    $("#XZFZR").val(parent.layer.data.XZFZR);//乡镇党政主要负责人
    $("#SZDGTFZR").val(parent.layer.data.SZDGTFZR);//所在地国土管理所主要负责人
    $("#PHOTOS").val(parent.layer.data.PHOTOS);//实际照片
    $("#PHOTOINFO").val(parent.layer.data.PHOTOINFO);//实际照片信息
    $("#FJLR").val(parent.layer.data.FJLR);//附件内容

    $("#SFYFBL").change();

    $("#FWXZ").change();

    if (parent.layer.data.ZATS == "0") {
        $("#ZZORXS").val("自住");
    } else {
        $("#ZZORXS").val("销售");
    }
    $("#ZZORXS").change();
    $("#SFBCJF").val(parent.layer.data.SFBCJF);//是否本村村民建房
    $("#SFBCJF").change();
    $("#SFFHTJ").val(parent.layer.data.SFFHTJ);//本村村民建房是否符条件
    $("#SFFHTJ").change();
    $("#SFCMJ").val(parent.layer.data.SFCMJ);//符合“一户一宅”条件宅基地是否超面积
    $("#SFCMJ").change();
    $("#CCMJ").val(parent.layer.data.CCMJ);//超出面积(平方米)

    if ($("#FWXZ").val() != "居住用房") {
        $("#ZZORXS").attr('disabled', true);
        $("#SFBCJF").attr('disabled', true);
        $("#SFFHTJ").attr('disabled', true).val("");
        $("#SFCMJ").attr('disabled', true).val("");
        $("#XSBCMS").attr('disabled', true);
        $("#XSWCMS").attr('disabled', true);
        $("#XSCZJMS").attr('disabled', true);
        $("#XSTS").attr('disabled', true);
        $("#ZATS").attr('disabled', true);
        $("#CCMJ").attr('disabled', true);
    }

    if ($("#SFFHTJ").val() == "否") {
        $("#SFCMJ").attr('disabled', true).val("");
        $("#CCMJ").attr('disabled', true).val("0");
    } else if ($("#SFFHTJ").val() == "是") {
        $("#SFCMJ").attr('disabled', false);
        $("#CCMJ").attr('disabled', false);
    }
}

function afterSubmit() {
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
        FWZB: $("#FWZB").val(),
        TBRQ: $("#TBRQ").val(),//填表日期
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
        SHZT: parent.layer.data.SHZT,//审核状态
        FJLR: parent.layer.data.FJLR,//附件内容
    };
    var postStr = JSON.stringify(data);

    RurallandService("/UpdateRuralland2", {userid: userInfo.ID, record: postStr}, true, function (resjson) {
        if (resjson.indexOf("true") > -1) {
            parent.layer.alert("编辑成功!");
            parent.GetRurallandnByXzqdm();
            parent.layer.close(parent.layer.openIndex);
        } else {
            parent.layer.alert("编辑失败!")
        }

    });
}