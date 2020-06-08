var ljfBase = null;
var slider = null;
var layuiform = null;
var layerManager = null;
var Industryresjosn = [];//专题图层数组
var sourceClues = null;//采集的面信息
var vectorClues = null;//采集的面图层
var ztreeObj = null;
var vector, source = null;
var _mapObject = null;
var _mapView = null;
var layuitable = null;
var _wktParser = null;
var jsonstr = "";
var jsonstr1 = "";
parent.JFZD = JSON.parse(sessionStorage.JFZD)[0];
layui.use(['form', 'element', 'laydate', 'table', 'slider', 'ljfBase', 'serverCenter', 'LayerManager', 'NULayer', 'bluebird'], function () {
    layuiform = layui.form;
    layuitable = layui.table;
    slider = layui.slider;
    ljfBase = layui.ljfBase;
    //隐藏bottom
    toggleBottom(false);
    //判断用户审核状态如果是3， 禁止所有提交
    canSubmit();
    //刷新列表
    statisticInit();
});

//todo 禁止下级用户提交————开始
function StopApproval() {//全部禁止下级提交
    parent.layer.confirm('确定禁止所有下级单位提交数据?', function (index) {
        parent.layer.close(index);
        SurveyUserManagerService3("/StopApproval", {
            userid: parent.JFZD.ID,
        }, true, function (resjson) {
            if (Number(resjson) > -1) {
                parent.layer.alert("操作成功!");
                // statisticInit();
                $(".table1_div .layui-table-body tr").addClass('noPosition');
            } else {
                parent.layer.alert("操作失败!")
            }
        });
    });
}

function StopApproval2() {//单个禁止下级提交
    var checkStatus = layuitable.checkStatus("table1");
    if (!checkStatus.data) {
        layer.alert("请先选择一个下级行政区");
        return false;
    }
    var xzqmc = checkStatus.data[0].XZQMC;
    parent.layer.confirm('确定禁止 ' + xzqmc + " 提交数据?", function (index) {
        parent.layer.close(index);
        SurveyUserManagerService3("/StopApproval2", {
            userid: parent.JFZD.ID,
            xzqmc: xzqmc
        }, true, function (resjson) {
            if (Number(resjson) > -1) {
                parent.layer.alert("操作成功!");
                changeOne(xzqmc, true);
            } else {
                parent.layer.alert("操作失败!")
            }
        });
    });
}

function RestoreApproval() {//全部恢复下级提交
    parent.layer.confirm('确定恢复所有下级单位提交数据?', function (index) {
        parent.layer.close(index);
        SurveyUserManagerService3("/RestoreApproval", {
            userid: parent.JFZD.ID,
        }, true, function (resjson) {
            if (Number(resjson) > -1) {
                parent.layer.alert("操作成功!");
                // statisticInit();
                $(".table1_div .layui-table-body tr").removeClass('noPosition');
            } else {
                parent.layer.alert("操作失败!")
            }
        });
    });
}

function RestroeApproval2() {//单个恢复下级提交
    var checkStatus = layuitable.checkStatus("table1");
    if (!checkStatus.data) {
        layer.alert("请先选择一个下级行政区");
        return false;
    }

    var xzqmc = checkStatus.data[0].XZQMC;
    parent.layer.confirm('确定恢复 ' + xzqmc + " 提交数据?", function (index) {
        parent.layer.close(index);
        SurveyUserManagerService3("/RestroeApproval2", {
            userid: parent.JFZD.ID,
            xzqmc: xzqmc
        }, true, function (resjson) {
            if (Number(resjson) > -1) {
                parent.layer.alert("操作成功!");
                changeOne(xzqmc, false);
            } else {
                parent.layer.alert("操作失败!")
            }
        });
    });
}

//判断哪儿个地区被禁止提交了
function ApprovalStatus2(res) {
    $.each(res, function (i, v) {
        if (v.XZQMC != "汇总") {
            var xzqmc = v.XZQMC;
            var userid = parent.JFZD.ID;
            SurveyUserManagerService3("/ApprovalStatus2", {
                userid: userid,
                xzqmc: xzqmc
            }, true, function (resjson) {
                console.log(resjson);
                if (resjson.indexOf("true") > -1) {
                    $(".table1_div .layui-table-body tr").eq(i).addClass('noPosition');
                }
            });
        }
    })
}

function changeOne(xzqmc, type) {
    var res = JSON.parse(jsonstr);
    $.each(res, function (i, v) {
        if (v.XZQMC == xzqmc) {
            if (type) {
                $(".table1_div .layui-table-body tr").eq(i + 1).addClass('noPosition');
            } else {
                $(".table1_div .layui-table-body tr").eq(i + 1).removeClass('noPosition');
            }
        }
    });
}