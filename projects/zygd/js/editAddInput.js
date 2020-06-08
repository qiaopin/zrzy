//返回
$("#return").click(function () {
    parent.layer.close(parent.layer.openIndex);
});

$("#ZZORXS").change(function () {//自住/销售
    if ($(this).val() == "自住") {
        $("#SFBCJF").attr('disabled', false).val("是");
        $("#SFFHTJ").attr('disabled', false).val("");
        $("#SFCMJ").attr('disabled', false).val("");
        $("#CCMJ").attr('disabled', false).val("0");

        $("#ZATS").attr('disabled', true).val("0");
        $("#XSTS").attr('disabled', true).val("0");
        $("#XSBCMS").attr('disabled', true).val("0");
        $("#XSWCMS").attr('disabled', true).val("0");
        $("#XSCZJMS").attr('disabled', true).val("0");
    } else {
        $("#SFBCJF").attr('disabled', true).val("否");
        $("#SFFHTJ").attr('disabled', true).val("");
        $("#SFCMJ").attr('disabled', true).val("");
        $("#CCMJ").attr('disabled', true).val("0");
        $("#ZATS").attr('disabled', false);
        $("#XSTS").attr('disabled', false);
        $("#XSBCMS").attr('disabled', false);
        $("#XSWCMS").attr('disabled', false);
        $("#XSCZJMS").attr('disabled', false);
    }
});

$("#SFBCJF").change(function () {//是否本村村民建房
    if ($(this).val() == "否") {
        $("#SFFHTJ").val("").attr('disabled', true);
        $("#SFCMJ").val("").attr('disabled', true);
        $("#CCMJ").attr('disabled', true).val("0");
    } else {
        $("#SFFHTJ").attr('disabled', false);
        $("#SFCMJ").attr('disabled', false);
        $("#CCMJ").attr('disabled', false);
    }
});

$("#SFFHTJ").change(function () {//是否符合条件
    if ($(this).val() == "否") {
        $("#SFCMJ").attr('disabled', true).val("");
        $("#CCMJ").attr('disabled', true).val("0");
    } else if ($(this).val() == "是") {
        $("#SFCMJ").attr('disabled', false);
        $("#CCMJ").attr('disabled', false);
    }
});

$("#SFCMJ").change(function () {//是否超面积
    if ($(this).val() == "否") {
        $("#CCMJ").attr('disabled', true).val("0");
    } else if ($(this).val() == "是") {
        $("#CCMJ").attr('disabled', false);
    }
});

$("#SFYFBL").change(function () {
    if ($(this).val() == "否") {
        $("#YGDMJ").val("0").attr("disabled", true);//原耕地面积
        $("#PZYDDW").val("").attr("disabled", true);//批准用地单位
        $("#PZWH").val("").attr("disabled", true);//批准文号
        $("#PZRQ").attr("disabled", true);//批准日期
    } else {
        $("#YGDMJ").attr("disabled", false);//原耕地面积
        $("#PZYDDW").attr("disabled", false);//批准用地单位
        $("#PZWH").attr("disabled", false);//批准文号
        $("#PZRQ").attr("disabled", false);//批准日期
    }
});
//房屋性质
$("#FWXZ").change(function () {
    if ($(this).val() != "居住用房") {
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
        $("#XSBCMS").val("0");
        $("#XSWCMS").val("0");
        $("#XSCZJMS").val("0");
        $("#XSTS").val("0");
        $("#ZATS").val("0");
        $("#CCMJ").val("0");
    } else {
        $("#ZZORXS").attr('disabled', false);
        $("#SFBCJF").attr('disabled', false);
        $("#SFFHTJ").attr('disabled', false);
        $("#SFCMJ").attr('disabled', false);
        $("#XSBCMS").attr('disabled', false);
        $("#XSWCMS").attr('disabled', false);
        $("#XSCZJMS").attr('disabled', false);
        $("#XSTS").attr('disabled', false);
        $("#ZATS").attr('disabled', false);
        $("#CCMJ").attr('disabled', false);
    }
});

//获取附件信息
function GetRuralFJLRPath() {
    var xzqh, fwbh;
    if (parent.layer.data) {
        xzqh = parent.layer.data.XZQDM;
        fwbh = parent.layer.data.FWBH
    } else {
        xzqh = userInfo.XZQDM;
        fwbh = $("#FWBH").val();
    }
    RurallandService("/GetRuralFJLRPath", {
        xzqh: xzqh,
        fwbh: fwbh
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            var str = "";
            var photoVal = [];
            for (var i = 0; i < resjosn.length; i++) {
                var name = resjosn[i].split('/');
                photoVal.push(name[name.length - 1]);
                var allName = name[name.length - 1];
                name = allName.split('.')[0];
                str += "<a  class='download' href='avascript:;' onclick=window.open('" + resjosn[i] + "') >" + name + "</a><i class='layui-icon layui-icon-close' data-allName='" + allName + "' name='" + name + "' ></i>";
            }
            $("#fjList").html(str);
            $("#fjList .layui-icon-close").click(function () {
                var name = $(this).attr('name');
                var allName = $(this).attr("data-allName");
                RurallandService("/DeleteRuralFjlr", {
                    xzqdm: xzqh,
                    fwbh: fwbh,
                    fjlrname: allName
                }, true, function (resjson) {
                    layer.msg("删除附件成功");
                    GetRuralFJLRPath();
                });
            });
            parent.layer.data.FJLR = photoVal.join(",");
        }
    });
}

//获取照片信息
function GetRuralPhotoPath() {
    var xzqh, fwbh;
    if (parent.layer.data) {
        xzqh = parent.layer.data.XZQDM;
        fwbh = parent.layer.data.FWBH
    } else {
        xzqh = userInfo.XZQDM;
        fwbh = $("#FWBH").val();
    }
    RurallandService("/GetRuralPhotoPath", {
        xzqdm: xzqh,
        fwbh: fwbh
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            var str = "";
            for (var i = 0; i < resjosn.length; i++) {
                str += "<img src='" + resjosn[i] + "'>"
            }
            $(".imgList").html(str);
            $(".imgList img").click(function () {
                layer.imgurl = $(this).attr('src');
                layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 1, //不显示关闭按钮
                    shade: [0],
                    skin: 'layui-layer-lan',
                    area: ['80%', '80%'],
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: ['img.html', 'no'], //这里content是一个普通的String
                });
            })
        }
    });
}

$("#ok").click(function () {
    var okBtn = $(this);
    okBtn.attr("disabled", true);
    if ($("#XZMC").val() == "") {
        parent.layer.alert("乡镇名称不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#CSQMC").val() == "") {
        parent.layer.alert("村社区名称不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#FWJSZTMC").val() == "") {
        parent.layer.alert("房屋建设主体名称不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#JSQYSFZDM").val().length < 15 || $("#JSQYSFZDM").val().length > 18) {
        parent.layer.alert("建房企业/个人号码必须在15到18位!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#FWXZ").val() == "") {
        parent.layer.alert("房屋性质不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#FWWZ").val() == "") {
        parent.layer.alert("房屋位置不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    var JZMJ = Number($("#JZMJ").val());
    if (Number($("#JZMJ").val()) <= 0) {
        parent.layer.alert("建筑面积必须大于0!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#LXFS").val() == "") {
        parent.layer.alert("联系方不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#LXFS").val().length != 11) {
        parent.layer.alert("联系方式必须11位!");
        okBtn.attr("disabled", false);
        return;
    }

    var YGDMJ = Number($("#YGDMJ").val());
    var WBLZYGDMJ = Number($("#WBLZYGDMJ").val());
    var ZYGDMJ = Number($("#ZYGDMJ").val());
    var JBNT = Number($("#JBNT").val() || 0);
    var YBGD = Number($("#YBGD").val() || 0);

    var max = 50000;
    if (YBGD > max || WBLZYGDMJ > max || ZYGDMJ > max || JBNT > max || YBGD > max) {
        parent.layer.alert("面积数不可超过" + max);
        return;
    }

    if (ZYGDMJ <= 0) {
        parent.layer.alert("占用耕地总面积必须大于0!");
        okBtn.attr("disabled", false);
        return;
    }
    if ($("#JFSJ").val() == "") {
        parent.layer.alert("建房时间不能为空!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#JFZT").val() == "") {
        parent.layer.alert("建房状态不能为空!");
        okBtn.attr("disabled", false);
        return;
    }
    if ($("#SFYFBL").val() == "是") {

        if ($("#PZYDDW").val() == "") {
            parent.layer.alert("批准用地单位不能为空!");
            okBtn.attr("disabled", false);
            return;
        }
        if ($("#PZWH").val() == "") {
            parent.layer.alert("批准文号不能为空!");
            okBtn.attr("disabled", false);
            return;
        }
        if ($("#PZRQ").val() == "") {
            parent.layer.alert("批准时间 不能为空!");
            okBtn.attr("disabled", false);
            return;
        }
        if ((YGDMJ + WBLZYGDMJ).toFixed(2) != ZYGDMJ.toFixed(2)) {
            parent.layer.alert("原耕地面积+占用耕地面积必须等于占用耕地总面积!");
            okBtn.attr("disabled", false);
            return;
        }
    } else {
        if (WBLZYGDMJ.toFixed(2) != ZYGDMJ.toFixed(2)) {
            parent.layer.alert("占用耕地面积必须等于占用耕地总面积!");
            okBtn.attr("disabled", false);
            return;
        }
    }
    if (JBNT + YBGD - ZYGDMJ > 0.001) {
        parent.layer.alert("基本农田面积+一般耕地面积必须小于等于占用耕地总面积!");
        okBtn.attr("disabled", false);
        return;
    }

    if ($("#FWXZ").val() == "居住用房") {

        if ($("#ZZORXS").val() != "自住") {//销售
            $("#SFBCJF").val("");//如果是销售 置空这个值
            var ZATS = Number($("#ZATS").val());
            var XSTS = Number($("#XSTS").val());
            var XSBCMS = Number($("#XSBCMS").val());
            var XSWCMS = Number($("#XSWCMS").val());
            var XSCZJMS = Number($("#XSCZJMS").val());

            if (ZATS <= 0) {
                parent.layer.alert("住宅套数必须大于0!");
                okBtn.attr("disabled", false);
                return;
            }

            if (XSTS > ZATS) {
                parent.layer.alert("销售套数小于等于住宅套数!");
                okBtn.attr("disabled", false);
                return;
            }
            if ((XSCZJMS + XSWCMS + XSBCMS) != XSTS) {
                parent.layer.alert("销售给本村村民套数+销售给外村村民套数+销售给城镇居民套数必须等于销售套数!");
                okBtn.attr("disabled", false);
                return;
            }

        } else {//自住
            var CCMJ = Number($("#CCMJ").val());

            if ($("#SFBCJF").val() == "是") {//本村村名建房
                if ($("#SFFHTJ").val() == "") {
                    parent.layer.alert("本村村民建房是否符条件不能为空!");
                    okBtn.attr("disabled", false);
                    return;
                }
                if ($("#SFFHTJ").val() == "是") {//建房符合条件
                    if ($("#SFCMJ").val() == "") {
                        parent.layer.alert("符合“一户一宅”条件宅基地是否超面积不能为空!");
                        okBtn.attr("disabled", false);
                        return;
                    }
                    if ($("#SFCMJ").val() == "是") {//超面积
                        if (CCMJ * 0.0015 > ZYGDMJ) {
                            parent.layer.alert("超出面积*0.0015不能大于占用耕地总面积!");
                            okBtn.attr("disabled", false);
                            return;
                        }
                        // if (CCMJ > JZMJ) {
                        //     parent.layer.alert("超出面积不能大于建筑面积!");
                        //     okBtn.attr("disabled", false);
                        //     return;
                        // }
                        if (CCMJ <= 0) {
                            parent.layer.alert("超出面积必须大于0!");
                            okBtn.attr("disabled", false);
                            return;
                        }
                    }
                }
            }
        }
    }

    if ($("#SFCMJ").val() == "否") {
        if (CCMJ > 0) {
            parent.layer.alert("符合`一户一宅'要求面积未超出规定，超出面积数应为0");
            okBtn.attr("disabled", false);
            return;
        }
    }

    if ($("#SFYFBL").val() == "否") {
        $("#YGDMJ").val("0");
    }

    var starttime = $('#JFSJ').val();
    var endtime = "2004-10-21";
    var start = new Date(starttime.replace("-", "/").replace("-", "/"));
    var end = new Date(endtime.replace("-", "/").replace("-", "/"));

    if (start < end) {
        layer.confirm("建房时间在2004年10月21日之前的数据不能提交", {btn: ["继续保存", "取消"]}, function (index) {
            layer.close(index);
            isZYGDMJTooLarge(ZYGDMJ);
        }, function (index) {
            layer.close(index);
            okBtn.attr("disabled", false);
        });
    } else {
        isZYGDMJTooLarge(ZYGDMJ)
    }
});

function isZYGDMJTooLarge(ZYGDMJ) {
    if (ZYGDMJ > 1000) {
        layer.confirm("是否确定占用耕地总面积超过1000亩", {btn: ["是", "否"]}, function (index) {
            layer.close(index);
            afterSubmit();
        }, function (index) {
            layer.close(index);
            okBtn.attr("disabled", false);
        });
    } else {
        afterSubmit();
    }
}