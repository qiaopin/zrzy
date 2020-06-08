/**
 * 显示底图、违法图斑、县界
 * @type {null}
 */

var ljfBase = null;
var slider = null;
var layuiform = null;
var layerManager = null;
var source = null;
var parentSmc = null;//上一个页面传入的smc (从首页传入)
var Industryresjosn = [];//专题图层数组
var sourceClues = null;//采集的面信息
var vectorClues = null;//采集的面图层
var _mapObject, _mapView, _wktParser = null;
var NUSource1 = null;
var checkSource = null;
var zytbArr = [];//当前区县争议图斑

var layuitable = null;
var smc = "";//市名称
var xmc = "";//县名称
var xmcArr = [];//所选中的县的数组
var userInfo = JSON.parse(sessionStorage.userInfo);

function initdlfx() {
    sourceClues = new ol.source.Vector();
    vectorClues = new ol.layer.Vector({
        source: sourceClues,
        style: function (feature, resolution) {
            var fillColor;
            var strokeColor;

            //已分配 未分配
            if (feature.get("RY")) {
                fillColor = "rgba(26,250,41,0.5)";
                strokeColor = "#1afa29";
            } else {
                fillColor = "rgba(226, 25, 24,0.5)";
                strokeColor = "#E21918";
            }
            var stroke = {
                color: strokeColor,
                width: 2
            };
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke(stroke),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: "#E21918"
                    })
                })
            });
        },
        zIndex: 3,
        name: "采集的面信息"
    });
    _mapObject.addLayer(vectorClues);
    // GetPolygonClues("/GetPolygonClues", {});//获取采集的面信息
}

function initdlfx() {
    sourceClues = new ol.source.Vector();
    vectorClues = new ol.layer.Vector({
        source: sourceClues,
        style: function (feature, resolution) {
            var fillColor;
            var strokeColor;
            if (feature.get("RY")) {//已分配
                fillColor = "rgba(26,250,41,0.5)";
                strokeColor = "#1afa29";
            } else {//未分配
                fillColor = "rgba(226, 25, 24,0.5)";
                strokeColor = "#E21918";
            }
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: "#E21918"
                    })
                })
            });
        },
        zIndex: 3,
        name: "采集的面信息"
    });
    _mapObject.addLayer(vectorClues);
    GetPolygonClues("/GetPolygonClues", {});//获取采集的面信息
}

function GetPolygonClues(resjosn) {
    var features = [];
    for (var i = 0; i < resjosn.length; i++) {
        var BH = resjosn[i].BH;
        var ZB = resjosn[i].ZB;
        var XZQDM = resjosn[i].XZQDM;
        var BZ = resjosn[i].BZ;
        var featureType = resjosn[i].TXLX;
        var PHOTOS = resjosn[i].ZP;
        if (ZB) {
            var feature = maptool._wktParser.readFeature(ZB);
            feature.set("BH", BH);
            feature.set("SMC", resjosn[i].SMC);
            feature.set("XMC", resjosn[i].XMC);
            feature.set("ZBLX", resjosn[i].ZBLX);
            feature.set("FXSJ", resjosn[i].FXSJ);
            feature.set("XCSJ", resjosn[i].XCSJ);
            feature.set("XZQDM", XZQDM);
            feature.set("BZ", BZ);
            feature.set("POINTS", resjosn[i].ZB);
            feature.set("TYPE", featureType);
            feature.set("PHOTOS", PHOTOS);
            feature.set("BM", resjosn[i].BM);
            feature.set("RY", resjosn[i].RY);
            feature.set("TBLX", resjosn[i].TBLX);
            feature.set("SDXZ", resjosn[i].SDXZ);
            feature.set("YDDW", resjosn[i].YDDW);
            feature.set("XMMC", resjosn[i].XMMC);
            feature.set("DLLX", resjosn[i].DLLX);
            feature.set("DLMC", resjosn[i].DLMC);
            feature.set("DLKD", resjosn[i].DLKD);
            feature.set("HSFS", resjosn[i].HSFS);
            feature.set("SFWF", resjosn[i].SFWF);
            feature.set("PHOTOINFO", resjosn[i].PHOTOINFO);
            feature.set("TDFL1", resjosn[i].TDFL1);
            feature.set("TDFL2", resjosn[i].TDFL2);
            features.push(feature);
        }
    }
    sourceClues.addFeatures(features);
    layuiform.render('select');
}

//获取专题列表
function GetMyThemeByIndustry() {
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    ResourceManagerService("/GetMyThemeByIndustry2", {'sprid': "sysadmin"}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        if(resjson.length==0){
            GetMyThemeByIndustry();
        }
        Industryresjosn = resjosn;
        var str = "";
        var showZTArr = [];
        if (sessionStorage.showZTStr) {
            showZTArr = sessionStorage.showZTStr.split(",");
        }
        for (var i = 0; i < resjosn.length; i++) {
            var INDUSTRY = resjosn[i].INDUSTRY;
            var RESOURCES = resjosn[i].RESOURCES;
            if (INDUSTRY == "专项数据") {
                for (var j = 0; j < RESOURCES.length; j++) {
                    var THEMENAME = RESOURCES[j].THEMENAME;
                    var THEMEID = RESOURCES[j].THEMEID;
                    if ($.inArray(THEMEID, showZTArr) > -1) {
                        str += "<option value=\"" + RESOURCES[j].ND + "-" + RESOURCES[j].JD + "\">" + THEMENAME + "</option>"
                    }
                }
            }
        }
        $(".selectTheme").html(str);
        layuiform.render();
        if ($(".selectTheme").val()) {
            if (sessionStorage.dataZTValue) {
                $(".selectTheme").val(sessionStorage.dataZTValue);
                layuiform.render();
            }
            var selectThemeVal = $(".selectTheme").val().split("-");
            top.year = selectThemeVal[0];
            top.quart = selectThemeVal[1];

            var year = top.year;
            var month = top.quart;
            _year = year;
            _quart = month;

            //获取所有争议图斑
            JCTBManagerService("/GetAllControversialTBs",
                {
                    nd: top.year,
                    jd: top.quart,
                    xzqdm: sessionStorage.userXZQDM
                },
                true, function (resjson) {
                    if (resjson.indexOf("false") > -1) {
                        parent.layer.alert("未查询到结果!");
                        parent.layer.close(parent.layer.loadIndex);
                        var resjosn = [];
                    } else {
                        var resjosn = $.parseJSON(resjson);
                    }
                    zytbArr = resjosn;
                    isNowTime();
                    StatisticTBbyCity();
                    GetUserByDw();
                });
            $("#export,#export1,#export2,#export3").removeClass('layui-btn-disabled');
            $("#export,#export1,#export2,#export3").attr('disabled', false);
        }
        parent.layer.close(parent.layer.loadIndex);
    });
}

//判断是否是当前季度
function isNowTime() {
    WorkManagerService("/GetWorkTime", {}, false, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未获取到年份季度!");
            parent.layer.close(parent.layer.loadIndex);
        } else {
            var time = resjson.trim();
            time = time.split(',');
            var year = time[0];
            var quart = time[1];
            if (year != top.year || quart != top.quart) {//如果切换的季度不是当前季度 不显示【分配任务】按钮
                $("#task,#task_tb,#task_xz").addClass('hide');
                $(".removeTaskBtn").addClass('hide');
            } else {
                $("#task,#task_tb,#task_xz").removeClass('hide');
                $(".removeTaskBtn").removeClass('hide');
            }
        }
    });
}

function getSFZYStateByData(data){//判断当前图斑是否为争议图斑，争议图斑状态
    $.each(zytbArr,function(i,v){
        if(v.BH==data.BH){
            return true;
        }
    });
    return false;
}

//切换区县
function StatisticTBRecordsMap(smc, xmc) {
    var year = top.year;
    var quart = top.quart;
    $(".indexCity").html(smc + "/" + xmc);
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBStatisticsManagerService("/StatisticTBRecords", {
        smc: smc,
        xmc: xmc,
        nd: year,
        jd: quart
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        var height = $(".layui-tab-content").height();
        layuitable.render({
            elem: '#table5',
            limit: resjosn.length,
            height: height - 80,
            page: false, //开启分页
            cols: [[ //表头
                {type: 'checkbox'}, //checkbox
                {type: 'numbers', width: 50},
                {field: 'BH', title: '监测编号', width: 240},
//	            {field: 'SMC', title: '市名称'},
//	            {field: 'XMC', title: '县名称'},
// 	            {field: 'JCMJ', title: '监测面积', width: 80},
// 	            {field: 'TBLX', title: '图斑类型', width: 150},
                {field: 'RY', title: '已分配人员', width: 90},
                {field: 'BM', title: '调查部门'},
                {fixed: 'right', title: '操作', toolbar: '#barDemo1', align: 'center', width: 240}

            ]],
            data: resjosn
        });
        layuitable.on('tool(table5)', function (obj) {
            var data = obj.data;
            var bh = data.BH;
            var checkStatus1 = layuitable.checkStatus("table3");
            if (obj.event === 'look') {//查看
                var features = sourceClues.getFeatures();
                for (var i = 0; i < features.length; i++) {
                    var bh = features[i].get("BH");
                    if (bh == data.BH) {
                        showFeatureInfo(features[i]);
                        return;
                    }
                }
            } else if (obj.event === 'qzfp') {//强制分配
                // 获取当前选中的部门人员
                if (checkStatus1.data.length > 0) {
                    var gzdw = checkStatus1.data[0].GZDW;
                    var ry = checkStatus1.data[0].USERNAME;
                    parent.layer.confirm("确定分配 " + bh + "给" + ry + "?", {btn: ["确认", "取消"]}, function (index) {
                        JCTBManagerService("/ChangeSurveyRY", {
                            bh: bh,
                            bm: gzdw,
                            ry: ry,
                            nd: year,
                            jd: quart,
                        }, true, function (resjson) {
                            parent.layer.close(parent.layer.loadIndex);
                            if (resjson.indexOf("false") > -1) {
                                parent.layer.alert("分配失败");
                            } else if (resjson.indexOf("true") > -1) {
                                getTasksByUserPhone(checkStatus1.data[0].PHONE);//更新人员分配列表
                                StatisticTBRecordsMap(smc, xmc);
                                parent.layer.alert("分配成功!");
                            } else {
                                parent.layer.alert(resjson);
                            }
                        });
                    });
                } else {
                    parent.layer.alert("请勾选分配人员!");
                }
            } else if (obj.event == "zytb") {
                var url;
                if (userInfo.XZJB == "县级") {
                    url = "/AddCountyControversialTB";
                } else if (userInfo.XZJB == "市级") {
                    url = "/AddCityControversialTB";
                }
                layer.confirm("确定 " + bh + "为争议图斑?", {btn: ["确认", "取消"]}, function (index) {
                    layer.close(index);
                    layer.prompt({
                        formType: 2,
                        value: '',
                        title: '请输入争议描述',
                        area: ['500px', '350px'] //自定义文本域宽高
                    }, function (value, index, elem) {
                        // alert(value); //得到value
                        layer.close(index);
                        var ms = value;
                        JCTBManagerService(url, {
                            bh: bh,
                            bm: userInfo.USERNAME,
                            ry: userInfo.GZDW,
                            nd: year,
                            jd: quart,
                            ms: ms,
                        }, true, function (resjson) {
                            parent.layer.close(parent.layer.loadIndex);
                            if (resjson.indexOf("false") > -1) {
                                parent.layer.alert("提交争议失败");
                            } else if (resjson.indexOf("true") > -1) {
                                if (checkStatus1.data.length > 0) {
                                    getTasksByUserPhone(checkStatus1.data[0].PHONE);//更新人员分配列表
                                }
                                StatisticTBRecordsMap(smc, xmc);
                                parent.layer.alert("提交争议成功!等待上级部门处理");
                            } else {
                                parent.layer.alert(resjson);
                            }
                        });
                    });
                });
            }
        });
        GetPolygonClues(resjosn);
        parent.layer.close(parent.layer.loadIndex);
    });

    //获取行政区坐标
    JCTBStatisticsManagerService("/GetCityZbByCityName", {SMC: smc, XMC: xmc}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        var feature = _wktParser.readFeature(resjosn.ZB);

        feature.setStyle(function (feature, resolution) {
            return _districtRegionStyle = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "rgba(66, 62, 63,1)",
                        width: 3,
                        lineDash: [25, 10, 1, 10],//县
                    }),
                }),
            ]
        });

        NUSource1.addFeature(feature);
        _mapView.fit(NUSource1.getExtent(), _mapObject.getSize());

        parent.layer.close(parent.layer.loadIndex);
    });

    JCTBStatisticsManagerService("/StatisticTBRecords", {
        smc: smc,
        xmc: xmc,
        nd: year,
        jd: quart
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        parent.layer.close(parent.layer.loadIndex);
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });

    _mapObject.removeOverlay(marker);
}

//市区列表
function StatisticTBbyCity() {
    var year = top.year;
    var quart = top.quart;
    $("._year").html(year);
    if (quart == "0") {
        $("._quart").html("");
    } else {
        $("._quart").html("第" + quart + "季度");
    }

    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBStatisticsManagerService("/StatisticTBbyCity3", {
        nd: year,
        jd: quart,
        xzqdm: sessionStorage.userXZQDM
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        if (resjosn.length > 0) {
            resjosn[0].LAY_CHECKED = true;
        }
        var height = $(".table1_div").height();
        layuitable.render({
            elem: '#table1',
            height: height - 5,
            page: false, //开启分页
            limit: resjosn.length,
            //		    limits:[5,10,20],
            cols: [[ //表头
                //		      {type:'numbers'},
                {type: 'radio'},
                {
                    field: 'Name', title: '行政市', templet: function (d) {
                        return d.Name + "(" + d.Count + ")";
                    }
                },
                // {field: 'Count', title: '图斑个数'},
                // {field: 'Area', title: '图斑面积(㎡)'},
            ]],
            data: resjosn
        });
        layuitable.on('radio(table1)', function (obj) {
            var data = obj.data;
            var checkStatus = layuitable.checkStatus("table1");
            smc = checkStatus.data[0].Name;
            StatisticTBbyCounty(checkStatus.data[0].Name);
        });
        parent.layer.close(parent.layer.loadIndex);
        var checkStatus = layuitable.checkStatus("table1");

        if (resjosn.length > 0) {
            smc = checkStatus.data[0].Name;
            StatisticTBbyCounty(checkStatus.data[0].Name);
        } else {
            StatisticTBbyCounty("");
        }
    });
}

//区县列表
function StatisticTBbyCounty(smc) {
    $(".smc").html(smc);
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBStatisticsManagerService("/StatisticTBbyCounty2", {
        smc: smc,
        nd: year,
        jd: quart,
        xzqdm: sessionStorage.userXZQDM
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            if (resjosn.length > 0) {
                resjosn[0].LAY_CHECKED = true;
            }
        }

        var height = $(".table2_div").height();
        layuitable.render({
            elem: '#table2',
            limit: resjosn.length,
            height: height - 5,
            page: false, //开启分页
            cols: [[ //表头
                {type: 'radio'}, //checkbox
                {
                    field: 'Name', title: '区县', templet: function (d) {
                        return d.Name + "(" + d.Count + ")";
                    }
                },
                // {field: 'Count', title: '图斑个数'},
                // {field: 'Area', title: '图斑面积(㎡)'},
            ]],
            data: resjosn
        });
        //监听选中县
        layuitable.on('radio(table2)', function (obj) {
            jtxzX();
        });
        jtxzX();
        parent.layer.close(parent.layer.loadIndex);
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });
}

function jtxzX() {//监听选中区县
    if (layuitable.cache.table7) {
        layuitable.reload('table7', []);
        var height = $(".layui-tab-content").height();
        var resjosn = [];
        layuitable.render({//
            elem: '#table7',
            limit: resjosn.length,
            height: height - 80,
            page: false, //开启分页
            cols: [[ //表头
                //              {type: 'checkbox'}, //checkbox
                {type: 'numbers', width: 50},
                {field: 'BH', title: '监测编号', width: 220},
                {field: 'JCMJ', title: '监测面积', width: 80},
                {field: 'TBLX', title: '图斑类型', width: 150},
                {field: 'BM', title: '调查部门'},
                {field: 'RY', title: '调查人员'},
                {fixed: 'right', title: '操作', toolbar: '#barDemo1', align: 'center', width: 240}
            ]],
            data: resjosn
        });
    }

    xmcArr = layuitable.checkStatus('table2').data;
    xmc = xmcArr[0].Name;
    $(".xmc").html(xmc);
    GetAllTowns();
    showTb();
}


//乡镇列表
function GetAllTowns() {
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBManagerService("/GetAllTowns", {
        smc: smc,
        xmc: xmc,
        nd: year,
        jd: quart,
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        var xzList = [];
        for (var i = 0; i < resjosn.length; i++) {
            xzList.push({
                Name: resjosn[i]
            })
        }

        var height = $(".layui-tab-content").height();
        layuitable.render({
            elem: '#table6',
            limit: resjosn.length,
            height: height - 80,
            page: false, //开启分页
            cols: [[ //表头
                {type: 'radio'}, //checkbox
                {field: 'Name', title: '乡镇名称'},
            ]],
            data: xzList
        });
        //监听选中县
        layuitable.on('radio(table6)', function (obj) {
            var data = layuitable.checkStatus('table6').data;
            GetRecordsByXZMC(data[0].Name)

        });
        parent.layer.close(parent.layer.loadIndex);
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });
}


//乡镇图斑列表
function GetRecordsByXZMC(xzmc) {
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBManagerService("/GetRecordsByXZMC", {
        smc: smc,
        xmc: xmc,
        xzmc: xzmc,
        nd: year,
        jd: quart,
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }


        var height = $(".layui-tab-content").height();
        layuitable.render({
            elem: '#table7',
            limit: resjosn.length,
            height: height - 80,
            page: false, //开启分页
            cols: [[ //表头
//              {type: 'checkbox'}, //checkbox
                {type: 'numbers', width: 50},
                {field: 'BH', title: '监测编号', width: 220},
//	            {field: 'SMC', title: '市名称'},
//	            {field: 'XMC', title: '县名称'},
                {field: 'JCMJ', title: '监测面积', width: 80},
                {field: 'TBLX', title: '图斑类型', width: 150},
                {field: 'BM', title: '调查部门'},
                {field: 'RY', title: '调查人员'},
                {fixed: 'right', title: '操作', toolbar: '#barDemo2', align: 'center', width: 80}
            ]],
            data: resjosn
        });
        //监听选中县
        layuitable.on('radio(table7)', function (obj) {
            var data = layuitable.checkStatus('table6').data;
        });
        layuitable.on('tool(table7)', function (obj) {
            var data = obj.data;
            if (obj.event === 'look') {//查看
                var features = sourceClues.getFeatures()
                for (var i = 0; i < features.length; i++) {
                    var bh = features[i].get("BH");
                    if (bh == data.BH) {
                        showFeatureInfo(features[i]);
                        return;
                    }
                }
            }
        });
        parent.layer.close(parent.layer.loadIndex);
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });
}

//人员列表
function GetUserByDw() {
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    // SurveyUserManagerService2("/SelectUserByDw2", {gzdw: "", xzqdm: sessionStorage.userXZQDM}, true, function (resjson) {
    SurveyUserManagerService2("/SelectTaskUser", {xzqdm: sessionStorage.userXZQDM}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resArr = $.parseJSON(resjson);
            var resjosn = [];
            $.each(resArr, function (i, v) {
                if (v.SFLLY == "否") {
                    resjosn.push(v);
                }
            });
        }

        var height = $(".table3_div").height();
        layuitable.render({
            elem: '#table3',
            height: height,
            page: false, //开启分页
            limit: resjosn.length,
//			    limits:[10,20,100],
            cols: [[ //表头
                {type: 'numbers'},
                {type: 'radio'},
                {field: 'USERNAME', title: '调查人员', width: 80},
                {field: 'GZDW', title: '工作单位'}
            ]],
            data: resjosn
        });
        layuitable.on('radio(table3)', function (obj) {
            var data = obj.data;
            var checkStatus = layuitable.checkStatus("table3");
            // GetWorkUser(data.GZDW, data.USERNAME);
            getTasksByUserPhone(data.PHONE);
        });
        parent.layer.close(parent.layer.loadIndex);
    });
};

function showTb() {
    var xmcArr = layuitable.checkStatus('table2').data;
    NUSource1.clear();
    sourceClues.clear();
    if (xmcArr.length > 0) {
        $.each(xmcArr, function (i, v) {
            StatisticTBRecordsMap(smc, v.Name);//显示地图(smc, checkStatus.data[0].Name);
        })
    }
}

//根据用户手机号查询任务列表
function getTasksByUserPhone(phone) {
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    $.ajax({
        type: 'post',
        url: sessionStorage.baseUrl + "JCTBManagerService.asmx/GetCluesbyUsernameandTime",
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        data: {
            phone: phone,
            nd: top.year,
            jd: top.quart
        },
        success: function (xml) {
            var res = $(xml).text();
            var resjosn = JSON.parse(res);
            showAllTasks(resjosn);
        },
        error: function () {
            parent.layer.close(parent.layer.loadIndex);
            alert('查询任务列表失败');
        }
    });
    showTb();//刷新显示地图
}

//显示用户所有任务
function showAllTasks(resjosn) {
    var height = $(".table4_div").height();
    layuitable.render({
        elem: '#table4',
        height: height,
        limit: resjosn.length,
        page: false,
        // page: {
        //     layout: ['limit', 'count', 'prev', 'page', 'next']//自定义分页布局
        // }, //开启分页
        // limit: 10,
        // limits: [10, 20, 100],

        cols: [[ //表头
            {type: 'checkbox'},
            {
                title: '行政区划', width: 150, templet: function (d) {
                    return d.SMC + "/" + d.XMC;
                }
            },
            {field: 'BH', title: '图斑编号'}
        ]],
        data: resjosn,
        done: function () {
            parent.layer.close(parent.layer.loadIndex);
        }
    });
}

$(".removeTaskBtn").click(function () {
    removeTasks();
});

//解除分配
function removeTasks() {
    var users = layuitable.checkStatus("table3").data;
    if (users.length > 0) {
        var userInfo = users[0];
        var tasks = layuitable.checkStatus("table4").data;
        if (tasks.length > 0) {
            console.log(tasks);
            var bhArr = [];
            $.each(tasks, function (i, v) {
                bhArr.push(v.BH);
            });
            var bh = bhArr.join(",");
            var postData = {
                gzdw: userInfo.GZDW,
                ry: userInfo.USERNAME,
                bh: bh
            };
            $.ajax({
                type: 'post',
                url: sessionStorage.baseUrl + "WorkManagerService.asmx/DeleteWorkUserByBH",
                dataType: "text", //返回文本
                jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                data: postData,
                success: function (xml) {
                    var res = $(xml).text();
                    if (res.trim() == "true") {
                        layer.msg("解除分配成功");
                        getTasksByUserPhone(userInfo.PHONE);
                    }
                },
                error: function () {
                    alert('查询失败');
                }
            })

        } else {
            layer.msg("请先勾选要解除的任务");
        }
    } else {
        layer.msg("请先选择人员");
    }
}

/**
 * 框选图斑图层
 */
function initCheckPolygon() {
    // kx()
    checkSource = window.NUSourceLayer2.getSource();
    window.NUSourceLayer2.setStyle(function (feature, resolution) {
        var strokeColor = 'rgba(255,0,0,1)';
        var fillColor = 'rgba(255,0,0,0.3)';
        style = [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: 2
                    //lineDash: [10, 10],
                }),
            })
        ];
        return style;
    });
}

//开始框选分配
function addInteraction(type) {
    //判断有没有选择市区、分配人员
    var checkStatus = layuitable.checkStatus("table2");
    var data = checkStatus.data;
    if (data.length == 0) {
        parent.layer.alert("请勾选要分配的区县!");
        return false;
    }

    var checkStatus1 = layuitable.checkStatus("table3");
    if (checkStatus1.data.length == 0) {
        parent.layer.alert("请勾选分配人员!");
        return false;
    }
    setDoubleClickZoom(false);//禁止双击地图放大事件

    var value = type;
    if (value !== 'None') {
        //ol.interaction.Draw该类允许用户在地图上绘制一些几何图形，
        // 可以通过构造方法设置type属性来指写是绘制哪种几何图形。目前支持点，线，多边形，圆形。
        checkSource.clear();
        draw = new ol.interaction.Draw({
            source: checkSource,
            type: type
        });
        _mapObject.addInteraction(draw);
        draw.on('drawend', function (evt) { //绘制完成后
            var pointLength = evt.feature.revision_ / 2; //绘制点个数
            _mapObject.removeInteraction(draw);
            if (pointLength > 2) {
                activeFeature = evt.feature;
                var polygon = activeFeature.getGeometry();
                var extent = polygon.getExtent();
                _mapView.fit(extent, _mapObject.getSize());

                //按范围查询违法图斑层数据
                var checkFeatures = [];
                var BH = [];
                sourceClues.forEachFeatureIntersectingExtent(extent, function (feature) {
                    checkFeatures.push(feature);
                    BH.push(feature.get("BH"));
                });

                //分析当前框选区域有多少违法图斑
                parent.layer.confirm("确定分配 " + BH.length + " 个任务给" + checkStatus1.data[0].USERNAME + "?", {btn: ["确认", "取消"]}, function (index) {
                    checkSource.clear();
                    WorkManagerService("/AddWorkUserByTBs", {
                        gzdw: checkStatus1.data[0].GZDW,
                        ry: checkStatus1.data[0].USERNAME,
                        tbbh: BH.join(",")
                    }, false, function (resjson) {
                        if (resjson.indexOf("false") > -1) {
                            parent.layer.alert("分配失败");
                        } else {
                            getTasksByUserPhone(checkStatus1.data[0].PHONE);//更新人员分配列表
                            parent.layer.alert("分配成功!");
                        }
                        //刷新地图服务
                    });
                }, function (index) {
                    checkSource.clear();
                });
            } else {
                alert("绘制点个数小于3");
            }
        })
    }
}

//设置地图禁止双击放大
function setDoubleClickZoom(canSize) {
    var pan;
    _mapObject.getInteractions().forEach(function (element, index, array) {
        if (element instanceof ol.interaction.DoubleClickZoom) {
            pan = element
        }
    });
    pan.setActive(canSize);
}
