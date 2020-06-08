/**
 * 显示底图、违法图斑、县界
 * @type {null}
 */

var ljfBase = null;
var slider = null;
var layuiform = null;
var layuitable = null;
var layerManager = null;
var source = null;
var parentSmc = null;//上一个页面传入的smc (从首页传入)
var Industryresjosn = [];//专题图层数组
var sourceClues = null;//采集的面信息
var vectorClues = null;//采集的面图层
var _mapObject, _mapView, _wktParser = null;
var modify;//编辑节点

$("#xzqTool").click(function () {
    $(".xzqSearchBox").toggle();
});

function fullScreen(){//全屏显示地图
    if($("#fullBtn").hasClass("active")){//取消全屏
        $(".left").show();
        $(".right").attr("style","");
    }else{//全屏
        $(".left").hide();
        $(".right").attr("style","width:100%;left:0;");
    }
    _mapObject.updateSize();
    $("#fullBtn").toggleClass("active");
}

function showfeature(data) {
    var BH = data.BH;
    var Features = sourceClues.getFeatures();
    for (var i = 0; i < Features.length; i++) {
        if (Features[i].get("BH") == BH) {
            showFeatureInfo(Features[i]);
        }
    }
}

//获取年份季度
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
            top.year = time[0];
            top.quart = time[1];
            $("#year").html("<option>" + time[0] + "</option>");
            $("#quart").html("<option>" + time[1] + "</option>");
            StatisticTBbyCity();
        }
    });
}

//获取市列表
function StatisticTBbyCity() {
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    // JCTBStatisticsManagerService("/StatisticTBbyCity3", {
    JCTBStatisticsManagerService("/RealtimeStatisticTBbyCountybyTime", {
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
        var str = "";
        for (var i = 0; i < resjosn.length; i++) {
            var smc = resjosn[i].Name;
            var Count = resjosn[i].Count;
            var SurveyCount = resjosn[i].SurveyCount;
            str += "<li  onclick=StatisticTBbyCounty('" + smc + "')  ><a href='javascript:;'  >" + smc + "[" + SurveyCount + "/" + Count + "]</a></li>"

        }
        $("#every-city").html(str);
        $("#every-city li").click(function () {
            $("#every-city li").removeClass('active');
            $(this).addClass('active');
        });
        if (parentSmc) {
            StatisticTBbyCounty(parentSmc);
            parentSmc = "";
        } else {
            $("#every-city li").eq(0).click();
        }
        parent.layer.close(parent.layer.loadIndex);
    });
}

function StatisticTBRecordsMap(smc, xmc, SurveyCount, count) {
    var NUSource1 = window.NUSourceLayer1.getSource();
    NUSource1.clear();
    var year = top.year;
    var quart = top.quart;
    var countStr = "[" + SurveyCount + "/" + count + "]";
    $(".indexCity").html(smc + " " + xmc + " " + countStr);
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
        var NUSource1 = window.NUSourceLayer1.getSource();
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
        var height = $(".list-TB").height();
        layuitable.render({
            elem: '#table1',
            height: height - 55,
            limit: resjosn.length,
            page: false, //开启分页
            cols: [[ //表头
                {type: 'numbers', width: 50},
                {
                    field: 'BH', title: '监测编号',templet: function (d) {
                        if (d.ZP != "" && d.AUDIT == 1) {
                            return "<span style='color: #4BB2FF;'>" + d.BH + "</span>";
                        } else {
                            return d.BH;
                        }
                    }
                },
                // {
                //     field: 'TBLX', title: '图斑类型', templet: function (d) {
                //         if (d.ZP != ""  && d.AUDIT == 1) {
                //             return "<span style='color: #4BB2FF;'>" + d.TBLX + "</span>";
                //         } else {
                //             return d.TBLX;
                //         }
                //     }
                // },
            ]],
            data: resjosn
        });
        layuitable.on('rowDouble(table1)', function (obj) {
            $(obj.tr).parent("tbody").find('tr').removeClass('active');
            $(obj.tr).addClass("active");
            showfeature(obj.data);
        });
        parent.layer.close(parent.layer.loadIndex);
        $(".layui-table-body").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    });

    _mapObject.removeOverlay(marker);

}

function StatisticTBbyCounty(smc) {
    // $("#indexCity").html(smc);
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    // JCTBStatisticsManagerService("/StatisticTBbyCounty2", {
    JCTBStatisticsManagerService("/RealtimeStatisticTBbyCounty2byTime", {
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
        var str = "";
        for (var i = 0; i < resjosn.length; i++) {
            var xmc = resjosn[i].Name;
            var Count = resjosn[i].Count;

            var SurveyCount = resjosn[i].SurveyCount;

            str += "<p class='cityXZ'  onclick=StatisticTBRecordsMap('" + smc + "','" + xmc + "'," + SurveyCount + "," + Count + ")  >" + xmc + "[" + SurveyCount + "/" + Count + "]</p>"
        }
        $(".list-XZ").html(str);
        $(".list-XZ p").click(function () {
            $(".list-XZ p").removeClass('active');
            $(this).addClass('active');
        });
        $(".list-XZ p").eq(0).click();

        parent.layer.close(parent.layer.loadIndex);
    });
}

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

    parentSmc = top.name;

    var url = ljfBase.https.BaseMapConfigManagerService + "/GetAllBaseMapConfig";
    ljfBase.post(url, {userid: sessionStorage.sprid}, function (res) {
        var baseMapConfig = JSON.parse(res)[0];
        var center = [];
        center.push(baseMapConfig.CENTERX);
        center.push(baseMapConfig.CENTERY);
        center = [114.48, 38.03];
        layerManager = new LayerManager("map", center, 12);
        ljfBase.post(ljfBase.https.BaseMapManagerService + "/GetAllBaseMap", {sprid: sessionStorage.sprid}, function (xml) {
            var resArr = $.parseJSON(xml);
            layerManager.loadBaseMap(resArr, "矢量");
            $('.maptab ul li a').click(function () {
                $('.maptab ul li a').removeClass("active");
                $(this).addClass("active");
                var type = $(this).attr('type');
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
        GetWorkTime();
    });
});


// function initdlfx() {
//     sourceClues = new ol.source.Vector();
//     vectorClues = new ol.layer.Vector({
//         source: sourceClues,
//         style: function (feature, resolution) {
//             var fillColor;
//             var strokeColor;
//             if (feature.get("PHOTOS")) {
//                 fillColor = "rgba(26,250,41,0.5)";
//                 strokeColor = "#1afa29";
//             } else {
//                 fillColor = "rgba(226, 25, 24,0.5)";
//                 strokeColor = "#E21918";
//             }
//             return new ol.style.Style({
//                 fill: new ol.style.Fill({
//                     color: fillColor
//                 }),
//                 stroke: new ol.style.Stroke({
//                     color: strokeColor,
//                     width: 2
//                 }),
//                 image: new ol.style.Circle({
//                     radius: 7,
//                     fill: new ol.style.Fill({
//                         color: "#E21918"
//                     })
//                 })
//             });
//         },
//         zIndex: 3,
//         name: "采集的面信息"
//     });
//     _mapObject.addLayer(vectorClues);
//     GetPolygonClues("/GetPolygonClues", {});//获取采集的面信息
// }

// function GetPolygonClues(resjosn) {
//     var str1 = "";
//     var features = [];
//     sourceClues.clear();
//     for (var i = 0; i < resjosn.length; i++) {
//         var BH = resjosn[i].BH;
//         var ZB = resjosn[i].ZB;
//         var XZQDM = resjosn[i].XZQDM;
//         var BZ = resjosn[i].BZ;
//         var featureType = resjosn[i].TXLX;
//         var PHOTOS = resjosn[i].ZP;
//
//         str1 += "<option value='" + BH + "'>" + BH + "</option>";
//         if (ZB) {
//             var feature = maptool._wktParser.readFeature(ZB);
//             feature.set("BH", BH);
//             feature.set("SMC", resjosn[i].SMC);
//             feature.set("XMC", resjosn[i].XMC);
//             feature.set("ZBLX", resjosn[i].ZBLX);
//             feature.set("FXSJ", resjosn[i].FXSJ);
//             feature.set("XCSJ", resjosn[i].XCSJ);
//             feature.set("XZQDM", XZQDM);
//             feature.set("BZ", BZ);
//             feature.set("POINTS", resjosn[i].ZB);
//             feature.set("TYPE", featureType);
//             feature.set("PHOTOS", PHOTOS);
//             feature.set("BM", resjosn[i].BM);
//             feature.set("RY", resjosn[i].RY);
//             feature.set("TBLX", resjosn[i].TBLX);
//             feature.set("SDXZ", resjosn[i].SDXZ);
//             feature.set("YDDW", resjosn[i].YDDW);
//             feature.set("XMMC", resjosn[i].XMMC);
//             feature.set("DLLX", resjosn[i].DLLX);
//             feature.set("DLMC", resjosn[i].DLMC);
//             feature.set("DLKD", resjosn[i].DLKD);
//             features.push(feature);
//         }
//     }
//     sourceClues.addFeatures(features);
//     if (top.isShowEditBox) {
//         editNode(sourceClues, _mapObject);//开启编辑节点功能
//     } else {
//         if (modify) {
//             _mapObject.removeInteraction(modify);
//         }
//     }
//     $("#DLBH").html(str1);
//     layuiform.render('select');
// }

/**
 * 编辑节点
 * @param editSource 要编辑图层的source
 * @param _mapObject 地图对象
 */
function editNode(editSource, _mapObject) {
    // 创建一个Modify控件
    modify = new ol.interaction.Modify({
        source: editSource
    });
    // 将Modify控件加入到Map对象中
    _mapObject.addInteraction(modify);
}