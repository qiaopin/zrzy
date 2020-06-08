/**
 * 显示底图、违法图斑、县界
 * @type {null}
 */

var ljfBase = null;
var slider = null;
var layuiform = null;
var layuitable = null;
var layerManager = null;
var Industryresjosn = [];//专题图层数组
var sourceClues = null;//采集的面信息
var vectorClues = null;//采集的面图层
var _mapObject, _mapView, _wktParser = null;
var smc = "";//市名称
var xmc = "";//县名称
var _quart = "";
var _year = "";
var selectedXZQDM;//当前选择区县的行政区代码

var userInfo = JSON.parse(sessionStorage.userInfo);
if (userInfo.XZJB == "县级" && userInfo.SFLLY == "是") {
    $("body").addClass("xj");
}

function fullScreen(){//全屏显示地图
    if($("#fullBtn").hasClass("active")){//取消全屏
        $(".left").show();
        $(".right").attr("style","");
    }else{//全屏
        $(".left").hide();
        $(".right").attr("style","width:100%;left:0;height:100vh;top:0;");
    }
    _mapObject.updateSize();
    $("#fullBtn").toggleClass("active");
}

if (top.tbType == "xf") {//下发图斑
    var initdlfx = function () {
        sourceClues = new ol.source.Vector();
        vectorClues = new ol.layer.Vector({
            source: sourceClues,
            style: function (feature, resolution) {
                var fillColor = "rgba(226, 25, 24,0.5)";
                var strokeColor = "#E21918";

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
    }
};

layui.use(['form', 'element', 'laydate', 'table', 'slider', 'ljfBase', 'serverCenter', 'LayerManager', 'NULayer', 'bluebird'], function () {
    $("body").attr('class', $("body", parent.document).attr('class'));
    $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    layuiform = layui.form;
    layuitable = layui.table;
    slider = layui.slider;
    ljfBase = layui.ljfBase;
    var xml2json = layui.xml2json;
    var serverCenter = layui.serverCenter;
    var LayerManager = layui.LayerManager;
    var NULayer = layui.NULayer;
    var url = ljfBase.https.BaseMapConfigManagerService + "/GetAllBaseMapConfig";
    ljfBase.post(url, {userid: sessionStorage.sprid}, function (res) {
        var baseMapConfig = JSON.parse(res)[0];
        var center = [];
        // center.push(baseMapConfig.CENTERX);
        // center.push(baseMapConfig.CENTERY);
        center = [114.48, 38.03];
        layerManager = new LayerManager("map", center,12);
        ljfBase.post(ljfBase.https.BaseMapManagerService + "/GetAllBaseMap", {sprid: sessionStorage.sprid}, function (xml) {
            var resArr = $.parseJSON(xml);
            layerManager.loadBaseMap(resArr, "矢量");
            $('.maptab ul li').click(function () {
                $('.maptab ul li').removeClass("active");
                $(this).addClass("active");
                var type = $(this).find('a').attr('type');
                layerManager.hideBaseMap();
                layerManager.loadBaseMap(resArr, type);
            });
            initdlfx();
        });
        initMapQuery();
        _mapObject.on('click', function (evt) {
            var mapZoom = _mapObject.getView().getZoom();
            var mapCenter = _mapObject.getView().getCenter();
            var layername = "";
            var feature = _mapObject.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    return feature;
                }, {
                    layerFilter: function (layer) {
                        if (layer.get('name') == "采集的面信息") {
//		                		layername = "采集的面信息";
                            return layer.get('name') === '采集的面信息';
                        }
                    }
                }
            );
            if (feature) {
                showFeatureInfo(feature);
                var BH = feature.get('BH');
                $("#DLBH").val(BH);
                layuiform.render('select');
            }
        });
    });

    GetMyThemeByIndustry();//获取专题数据

    //切换专题
    layuiform.on('select(selectTheme)', function (res) {
        sessionStorage.dataZTValue = res.value;//记录当前选择的专题
        var data = res.value.split("-");
        top.year = data[0];
        top.quart = data[1];
        var year = top.year;
        var month = top.quart;
        _year = year;
        _quart = month;
        StatisticTBInfobyCity();
    });
});

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
        if(resjosn.length==0){
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
            StatisticTBInfobyCity();
            $("#export,#export1,#export2,#export3").removeClass('layui-btn-disabled');
            $("#export,#export1,#export2,#export3").attr('disabled', false);
        }
        parent.layer.close(parent.layer.loadIndex);
    });
}

//获取时间
function GetWorkTime() {
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    WorkManagerService("/GetWorkTime", {}, false, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未获取到年份季度!");
            parent.layer.close(parent.layer.loadIndex);
        } else {
            parent.layer.close(parent.layer.loadIndex);
            var time = resjson.trim();
            time = time.split(',');
            $("#year").html("<option>" + time[0] + "</option>");
            $("#quart").html("<option>" + time[1] + "</option>");
            StatisticTBbyCity();
        }
    });
}

function StatisticTBRecordsMap(smc, xmc) {
    var NUSource1 = NUSourceLayer1.getSource();
    NUSource1.clear();
    var year = top.year;
    var quart = top.quart;
    $("#indexCity").html(smc + "/" + xmc);
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    var cityName = smc;
    var url = "";
    if (top.tbType == "xf") {
        // url = "/StatisticTBInfoRecords";
        url = "/StatisticTBRecords";
    } else if (top.tbType == "jc") {
        url = "/StatisticTBRecords";
    } else if (top.tbType == "ny") {
        url = "/StatisticTBRecords";
    }
    JCTBStatisticsManagerService(url, {
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
        GetPolygonClues(resjosn);
        parent.layer.close(parent.layer.loadIndex);
    });

    //获取行政区坐标
    JCTBStatisticsManagerService("/GetCityZbByCityName", {SMC: cityName, XMC: xmc}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        if (!resjosn.ZB) {
//          parent.layer.alert("未查询到行政区坐标!");
            return;
        }
        var feature = _wktParser.readFeature(resjosn.ZB);
        feature.setStyle(function (feature, resolution) {
            return _districtRegionStyle = [
                new ol.style.Style({
                    // stroke: new ol.style.Stroke({
                    //     color: "rgba(255, 50, 124,0.9)",
                    //     width: 5,
                    // }),
                    stroke: new ol.style.Stroke({
                        color: "rgba(66, 62, 63,1)",
                        width: 3,
                        lineDash: [25, 10, 1, 10],//县
                    }),
                }),
            ]
        });
        var NUSource1 = NUSourceLayer1.getSource();
        NUSource1.addFeature(feature);

        _mapView.fit(NUSource1.getExtent(), _mapObject.getSize());

        parent.layer.close(parent.layer.loadIndex);
    });
}

function StatisticTBInfobyCity() {
    var year = top.year;
    var quart = top.quart;
    $("._year").html(year);
    if (quart == "0") {
        $("._quart").html("");
    } else {
        $("._quart").html("第" + quart + "季度");
    }
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});

    var staticData = {
        nd: year, jd: quart
    };
    staticData.xzqdm = sessionStorage.userXZQDM;
    var url = "";
    if (top.tbType == "xf") {
        // url = "/StatisticTBInfobyCityPower";
        url = "/StatisticTBbyCity3";
    } else if (top.tbType == "jc") {
        url = "/StatisticTBbyCity2XC";
    } else if (top.tbType == "ny") {
        url = "/StatisticTBbyCity2QT";
    }

    JCTBStatisticsManagerService(url, staticData, true, function (resjson) {
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
            cols: [[ //表头
                {type: 'radio'},
                {field: 'Name', title: '行政区名称'},
                {field: 'Count', title: '图斑个数'},
                {field: 'Area', title: '图斑面积(亩)'},
            ]],
            data: resjosn
        });
        layuitable.on('radio(table1)', function (obj) {
            var data = obj.data;
            var checkStatus = layuitable.checkStatus("table1");
            smc = checkStatus.data[0].Name;
            StatisticTBInfobyCounty(checkStatus.data[0].Name);
        });
        parent.layer.close(parent.layer.loadIndex);
        var checkStatus = layuitable.checkStatus("table1");
        if (resjosn.length > 0) {
            smc = checkStatus.data[0].Name;
            StatisticTBInfobyCounty(checkStatus.data[0].Name);
        } else {
            StatisticTBInfobyCounty("");
        }
    });
}


function StatisticTBInfobyCounty(smc) {
    $(".smc").html(smc);
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});

    var url = "";
    if (top.tbType == "xf") {
        url = "/StatisticTBbyCounty2";
    } else if (top.tbType == "jc") {
        url = "/StatisticTBbyCounty2XC";
    } else if (top.tbType == "ny") {
        url = "/StatisticTBbyCounty2QT";
    }

    JCTBStatisticsManagerService(url, {
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
        }
        if (resjosn.length > 0) {
            resjosn[0].LAY_CHECKED = true;

        }
        var height = $(".table2_div").height();
        layuitable.render({
            elem: '#table2',
            limit: resjosn.length,
            height: height - 40,
            page: false, //开启分页
            cols: [[ //表头
                {type: 'radio'},
                {field: 'Name', title: '行政区名称'},
                {field: 'Count', title: '图斑个数'},
                {field: 'Area', title: '图斑面积(亩)'},
            ]],
            data: resjosn
        });
        layuitable.on('radio(table2)', function (obj) {
            var data = obj.data;
            var checkStatus = layuitable.checkStatus("table2");
            xmc = checkStatus.data[0].Name;
            $(".xmc").html(xmc);
            StatisticTBInfoRecords(smc, checkStatus.data[0].Name);
        });
        parent.layer.close(parent.layer.loadIndex);
        var checkStatus = layuitable.checkStatus("table2");
        if (resjosn.length > 0) {
            xmc = checkStatus.data[0].Name;
            StatisticTBInfoRecords(smc, checkStatus.data[0].Name);
        } else {
            StatisticTBInfoRecords("", "");
        }
    });
}

function StatisticTBInfoRecords(smc, xmc) {
    $(".xmc").html(xmc);
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    var cols = [];
    var url = "";

    var userInfo = $.parseJSON(sessionStorage.userInfo);
    if (top.tbType == "xf") {
        cols = [[ //表头
            {type: 'numbers', width: 50},
            {field: 'BH', title: '监测编号', width: 200},
            {field: 'JCMJ', title: '监测面积', width: 80},
            {field: 'TBLX', title: '图斑类型', width: 150},
            {field: 'NYDMJ', title: '农用地面积'},
            {field: 'JSYDMJ', title: '建设用地面积'},
            {field: 'YXJSQLMJ', title: '允许建设区面积'},
            {field: 'XZJSQNMJ', title: '限制建设区面积'},
            {field: 'JZJSQNMJ', title: '禁止建设区面积'},
            {field: 'JBNTMJ', title: '基本农田面积'},
            {
                fixed: 'right', title: '操作', templet: function (d) {
                    var str = '<a class="layui-btn layui-btn-xs layui-btn-skyblue" lay-event="details"></i>详情</a>';
                    var zt = 0;
                    if (userInfo.XZJB == "县级") {
                        if (d.AUDIT == 0 || d.AUDIT == 1 || d.AUDIT == 3) {
                            zt = 0;
                        } else {
                            zt = 1;
                        }
                    } else if (userInfo.XZJB == "市级") {
                        if (d.AUDIT == 2 || d.AUDIT == 5) {
                            zt = 0;
                        } else {
                            zt = 1;
                        }
                    } else if (userInfo.XZJB == "省级") {
                        if (d.AUDIT == 4) {
                            zt = 0;
                        } else {
                            zt = 1;
                        }
                    }
                    // if (zt == 0) {
                    //     str += '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="audit"></i>审核</a>';
                    // } else {
                    //     str += '<a class="layui-btn layui-btn-xs layui-btn-danger layui-btn-disabled" disabled="disabled" lay-event="audit"></i>审核</a>';
                    // }
                    str += '<a class="layui-btn layui-btn-xs layui-btn-skyblue" lay-event="auditDetails"></i>审核详情</a>';
                    return str;
                }, align: 'center', width: 200
            }
        ]];
        url = "/StatisticTBInfoRecords";
        // url = "/StatisticTBRecords";
    } else if (top.tbType == "jc") {
        url = "/StatisticTBRecords";
        cols = [[ //表头
            {type: 'numbers', width: 50},
            {field: 'BH', title: '监测编号', width: 200},
            {field: 'SMC', title: '市名称'},
            {field: 'XMC', title: '县名称'},
            {field: 'JCMJ', title: '监测面积', width: 80},
            {field: 'TBLX', title: '图斑类型', width: 150},
            {field: 'BM', title: '调查部门'},
            {field: 'RY', title: '调查人员'},
            // {
            //     field: 'SFWF', title: '是否已调查', templet: function (d) {
            //         var isDC = "";
            //         if (d.ZP) {
            //             isDC = "<span style='color:red;'>已调查</span>";
            //         } else {
            //             isDC = "<span style='color:red;'>未调查</span>";
            //         }
            //         return isDC;
            //     }
            // },
        ]];

    } else if (top.tbType == "ny") {
        url = "/StatisticTBInfoRecords";
        cols = [[ //表头
            cols = [[ //表头
                {type: 'numbers', width: 50},
                {field: 'BH', title: '监测编号', width: 200},
                {field: 'SMC', title: '市名称'},
                {field: 'XMC', title: '县名称'},
                {field: 'JCMJ', title: '监测面积', width: 80},
                {field: 'TBLX', title: '图斑类型', width: 150},
                {field: 'BM', title: '调查部门'},
                {field: 'RY', title: '调查人员'},
                // {
                //     field: 'SFWF', title: '是否已调查', templet: function (d) {
                //         var isDC = "";
                //         if (d.ZP) {
                //             isDC = "<span style='color:red;'>已调查</span>";
                //         } else {
                //             isDC = "<span style='color:red;'>未调查</span>";
                //         }
                //         return isDC;
                //     }
                // },
            ]]
        ]];
    }

    JCTBStatisticsManagerService(url, {
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
            if (resjosn.length > 0) {
                selectedXZQDM = resjosn[0].XZQDM;
            } else {
                parent.layer.close(parent.layer.loadIndex);
            }
        }
        var height = $(".table3_div").height();
        layuitable.render({
            elem: '#table3',
            limit: resjosn.length,
            height: height - 5,
            page: false, //开启分页
            cols: cols,
            data: resjosn
        });
        layuitable.on('tool(table3)', function (obj) {
            var data = obj.data;
            if (obj.event === 'details') {//详情
                parent.layer.year = $("#year").val();
                parent.layer.data = data;
                parent.layer.openIndex = parent.layer.open({
                    type: 2,
                    title: "详情",
                    closeBtn: 1, //不显示关闭按钮
                    shade: [0],
                    skin: 'layui-layer-lan',
                    area: ['700px', '700px'],
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: ['details.html', 'no'], //这里content是一个普通的String
                });
            } else if (obj.event === 'audit') {//审核
                parent.layer.data = data;
                parent.layer.window = window;
                parent.layer.openIndex = parent.layer.open({
                    type: 2,
                    title: "审核",
                    closeBtn: 1, //不显示关闭按钮
                    shade: [0],
                    skin: 'layui-layer-lan',
                    area: ['350px', '530px'],
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: ['audit.html', 'no'], //这里content是一个普通的String
                });

            } else if (obj.event === 'auditDetails') {
                parent.layer.data = data;
                parent.layer.window = window;
                parent.layer.openIndex = parent.layer.open({
                    type: 2,
                    title: "审核详情",
                    closeBtn: 1, //不显示关闭按钮
                    shade: [0],
                    skin: 'layui-layer-lan',
                    area: ['1000px', '440px'],
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: ['auditDetails.html', 'no'], //这里content是一个普通的String
                });
            }
        });
        parent.layer.close(parent.layer.loadIndex);
        StatisticTBRecordsMap(smc, xmc);//显示地图
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });
}