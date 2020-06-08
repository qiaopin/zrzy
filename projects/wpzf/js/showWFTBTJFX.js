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

var encoding = "GBK";// UTF-8
var shpData, dbfData;
var map;
var fLayer;
var loadStatus = false;

var fxDataFrom = "tb";//tb卫片图斑 shape数据 txt数据
var shapeFeatures = [];//上传shape文件获取到的features
var txtFeature = null;//上传的txt的文件获取到的feature;暂时只支持上传一个闭合文件
var currentFeatures = [];//当前要分析的features

$("#xzqTool").click(function () {
    if (!$("#topND").val()) {
        layer.alert("请选择年度");
        return false;
    }
    if (!$("#topJD").val()) {
        layer.alert("请选择季度");
        return false;
    }
    $(".xzqSearchBox").toggle();
});

function inputChange(input) {
    txtFeature = null;
    //支持chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function () {
            console.log(this.result);
            var text = "POLYGON((" + this.result + "))";
            _wktParser = new ol.format.WKT();
            txtFeature = _wktParser.readFeature(text);
        };
        reader.readAsText(file);
    } else {
        layer.alert("请切换到谷歌浏览器或360的急速模式下打开");
    }
}

function showTextFeature() {
    if (txtFeature) {
        fLayer.getSource().clear();
        fLayer.getSource().addFeature(txtFeature);
        var extent = fLayer.getSource().getExtent();
        if (extent) {
            map.getView().fit(extent, map.getSize());
        }
    } else {
        layer.alert("没有获取到闭合的坐标数据");
    }
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

//获取市列表
function StatisticTBbyCity() {
    var year = top.year;
    var quart = top.quart;
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    JCTBStatisticsManagerService("/StatisticTBbyCity2", {
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
            str += "<li  onclick=StatisticTBbyCounty('" + smc + "')  ><a href='javascript:;'  >" + smc + "[" + Count + "]</a></li>"

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
            // $("#every-city li").eq(0).click();
        }
        parent.layer.close(parent.layer.loadIndex);
    });
}

function StatisticTBRecordsMap(smc, xmc) {
    var NUSource1 = window.NUSourceLayer1.getSource();
    NUSource1.clear();
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
                    field: 'BH', title: '监测编号', width: 210, templet: function (d) {
                        if (d.ZP != "") {
                            return "<span style='color: #4BB2FF;'>" + d.BH + "</span>";
                        } else {
                            return d.BH;
                        }
                    }
                },
                {
                    field: 'TBLX', title: '图斑类型', templet: function (d) {
                        if (d.ZP != "") {
                            return "<span style='color: #4BB2FF;'>" + d.TBLX + "</span>";
                        } else {
                            return d.TBLX;
                        }
                    }
                },
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
    $("#indexCity").html(smc);
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
        }
        var str = "";
        for (var i = 0; i < resjosn.length; i++) {
            var xmc = resjosn[i].Name;
            var Count = resjosn[i].Count;
            str += "<p class='cityXZ'  onclick=StatisticTBRecordsMap('" + smc + "','" + xmc + "')  >" + xmc + "[" + Count + "]</p>"
        }
        $(".list-XZ").html(str);
        $(".list-XZ p").click(function () {
            $(".list-XZ p").removeClass('active');
            $(this).addClass('active');
            $(".xzqSearchBox").hide();
        });
        // $(".list-XZ p").eq(0).click();

        parent.layer.close(parent.layer.loadIndex);
    });
}

layui.use(['form', 'element', 'laydate', 'table', 'slider', 'ljfBase', 'serverCenter', 'LayerManager', 'NULayer', 'bluebird'], function () {
    $("body").attr('class', $("body", parent.document).attr('class'));
    $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#297FBA", boxzoom: false});
    var element = layui.element;
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
        _mapObject = layerManager._mapObject;
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

        top.year = $("#topND").val();
        top.quart = $("#topJD").val();
        StatisticTBbyCity();

        //切换图斑
        layuiform.on('select(DLBH)', function (data) {
            try {
                $("#closeAlertInfo").click();
            }catch (e) {

            }
            var tbbh = data.value;
            if (tbbh == "全部") {
                _mapObject.getView().fit(sourceClues.getExtent(), _mapObject.getSize());
            } else {
                var features = sourceClues.getFeatures();
                $.each(features, function (i, v) {
                    var bh = v.get("BH");
                    if (bh == tbbh) {
                        showFeatureInfo(v);
                        return;
                    }
                })
            }

        });

        //切换对比数据源
        layuiform.on('select(dataFrom)', function (data) {
            var data = data.value;
            top.dataFormType = data;
            layuiform.render();
        });

        //监听选项卡切换
        element.on('tab(docDemoTabBrief)', function (data) {
            // console.log(data.index); //得到当前Tab的所在下标
            fxDataFrom = this.dataset.type;
        });

        /**
         * TODO 上传shape文件进行分析
         * @type {string}
         */
        map = layerManager._mapObject;
        fLayer = window.NUSourceLayer3;
//弹出dialog封装
        popup = new Popup(map);
        window.doParseShp = function () {
            shpData = null;
            dbfData = null;
            loadStatus = false;
            popup.tooltip(null, null);

            var shpFile = document.getElementById("shpFile").files[0];
            var dbfFile = document.getElementById("dbfFile").files[0];

            // var maxNum = document.getElementById('maxNum').value;
            var maxNum = 111111111111111111;
            if (!maxNum) {
                alert('最大展示条数不能为空');
                return;
            }
            if (!shpFile) {
                alert('shp文件不能为空');
                return;
            }
            if (!dbfFile) {
                alert('DBF文件不能为空');
                return;
            }

            //通过HTML5 读取本地文件数据流
            var readDbf = new FileReader();
            readDbf.readAsArrayBuffer(dbfFile, encoding);//读取文件的内容

            var readShp = new FileReader();
            readShp.readAsArrayBuffer(shpFile, encoding);//读取文件的内容

            //SHP
            readShp.onload = function () {
                shpData = this.result;
                loadData(parseInt(maxNum));
            };
            //DBF
            readDbf.onload = function () {
                dbfData = this.result;
                loadData(parseInt(maxNum));
            }
        };

        function loadData(maxNum) {
            if (!dbfData || !shpData || loadStatus) {
                return;
            }
            loadStatus = true;
            //var shapefile = new shapefile();
            shapeFeatures = [];
            var index = 0;
            shapefile.open(shpData, dbfData, {encoding: encoding}).then(source => source.read().then(
                function next(result) {
                    if (result.done || maxNum == index) {
                        layerReloadFeatures(shapeFeatures);
                        return;
                    }

                    var geometry = result.value.geometry;
                    console.log(JSON.stringify(geometry.coordinates));
                    var propreties = result.value.properties;

                    var f = createFeature(geometry, propreties);
                    if (f) {
                        shapeFeatures.push(f);
                    }
                    index++;
                    return source.read().then(next);
                }
            ))
        }

        function layerReloadFeatures(features) {
            fLayer.getSource().clear();
            fLayer.getSource().addFeatures(features);
            var extent = fLayer.getSource().getExtent();
            if (extent) {
                map.getView().fit(extent, map.getSize());
            }
        }

        /**
         * 根据shp解析出来的数据创建一个ol4 的feature
         */
        function createFeature(geometry, properties) {

            var type = geometry.type;
            var geom;

            if (type == 'Polygon') {
                geom = new ol.geom.Polygon(geometry.coordinates);
            } else if (type == 'Point') {
                geom = new ol.geom.Point(geometry.coordinates);
            } else if (type == 'LineString') {
                geom = new ol.geom.LineString(geometry.coordinates);
            } else if (type == 'MultiPolygon') {
                geom = new ol.geom.MultiPolygon(geometry.coordinates);
            } else if (type == 'MultiPoint') {
                geom = new ol.geom.MultiPoint(geometry.coordinates);
            } else if (type == 'MultiLineString') {
                geom = new ol.geom.MultiLineString(geometry.coordinates);
            }

            if (!geom) return null;
            var feature = new ol.Feature({
                geometry: geom
            });

            //属性
            for (var key in properties) {
                feature.set(key, properties[key]);
            }

            return feature;
        }

        /**
         * TODO 上传shape文件进行分析————————————end
         * @type {string}
         */
    });
});

top.year = "";//年度
top.quart = "";//季度
top.themtype = "";//专题类型

top.dataFormType = "SD";//数据源 三调数据 二调数据
top.fxType = "dl";

function fullScreen() {//全屏显示地图
    if ($("#fullBtn").hasClass("active")) {//取消全屏
        $(".left").show();
        $(".right").attr("style", "");
    } else {//全屏
        $(".left").hide();
        $(".right").attr("style", "width:100%;left:0;");
    }
    _mapObject.updateSize();
    $("#fullBtn").toggleClass("active");
}

//点击分析按钮
$("#analysis").click(function () {
    //清空结果table
    $("#tbody_tb").html("");

    if (fxDataFrom == "tb") {
        var BH = $("#DLBH").val();
        if (BH == "全部") {//分析当前区县的全部图斑

            layer.msg("分析全部图斑");
        } else {
            $("#tbody_tb").html("");
            $("#totalAreaTd").html("");
            var Features = sourceClues.getFeatures();
            for (var i = 0; i < Features.length; i++) {
                if (Features[i].get("BH") == BH) {
                    showFeatureInfo(Features[i]);
                    var polygon = Features[i].getGeometry();
                    var extent = polygon.getExtent();
                    flatCoordinates = polygon.flatCoordinates;
                    // DBwftb(extent);
                    var feature = Features[i];
                    fxByFeature(feature);
                }
            }
        }
    } else if (fxDataFrom == "shape") {
        if (shapeFeatures.length == 0) {
            layer.alert("请先导入shape数据");
        } else if (shapeFeatures.length == 1) {
            var feature = shapeFeatures[0];
            fxByFeature(feature);
        } else {
            // shape数据中包含多个feature;
            var select = new ol.interaction.Select({
                condition: ol.events.condition.click,
                toggleCondition: ol.events.condition.click
            });
            _mapObject.addInteraction(select);
            select.on('select', function (eve) {
                if (eve.deselected.length > 0) {
                    //取消选择
                    var deselectFeature = eve.deselected[0];
                    $.each(currentFeatures, function (i, v) {
                        if (v == deselectFeature) {
                            currentFeatures.splice(i, 1);
                        }
                    })
                } else {
                    //选择
                    var selectFeature = eve.selected[0];
                    var isHave = false;
                    $.each(currentFeatures, function (i, v) {
                        if (v == selectFeature) {
                            isHave = true;
                        }
                    });
                    if (!isHave) {
                        currentFeatures.push(selectFeature);
                    }
                }
                console.log(currentFeatures);
            });

            if (currentFeatures.length == 0) {
                layer.msg("请先点击选择要分析的图斑");
            } else {
                var myCombinedFeature = toMulti(currentFeatures);
                fxByFeature(myCombinedFeature);
            }
        }
    } else if (fxDataFrom == "txt") {
        if (!txtFeature) {
            layer.alert("请先导入txt数据");
        } else {
            var feature = txtFeature;
            fxByFeature(feature)
        }
    }
});

//合并多个polygon到multiPolygon
function toMulti(features) {
    // add Polygons to a MultiPolygon
    var mutil = new ol.geom.MultiPolygon();
    $.each(features, function (i, v) {
        mutil.appendPolygon(v.getGeometry());
    });
    var myCombinedFeature = new ol.Feature({
        geometry: mutil,
        name: 'My MutilPolygon'
    });
    return myCombinedFeature;
}

//根据单个feature 进行分析
function fxByFeature(feature) {
    var scope = feature.getGeometry();
    var mapUrl;
    var layerName;

    if (top.dataFormType == "SD") {
        // mapUrl = "http://110.249.159.46:6080/arcgis/rest/services/DLTB/SD" + feature.get("XZQDM") + "2019/MapServer";
        mapUrl = "http://124.193.79.18:6080/arcgis/rest/services/ZYSJ/SDDLTB2019/MapServer";
    } else if (top.dataFormType == "ED") {
        mapUrl = "http://110.249.159.46:6080/arcgis/rest/services/ZYSJ/DLTBED/MapServer";
    }

    layerName = feature.get("XZQDM");

    $.each(layerManager.NULayers, function (i, v) {
        if (!v.isBaseMap) {
            v.setVisible(false);
        }
    });

    if (mapUrl && ljfBase.isServerRuning(mapUrl)) {
        layerManager.addLayer({
            layerId: mapUrl,
            mapUrl: mapUrl,
            layers: "0",
            zIndex: 2,
            layerName: layerName
        });
        query(scope, top.fxType, mapUrl);
    } else {
        layer.close(layer.loadIndex);
        if (fxDataFrom == "tb") {
            var str = $("select#dataFrom option:selected").text();
            layer.alert($(".indexCity").html() + "暂无对应的 " + str + " 地图服务");
        } else {
            layer.alert("未找到对应的地图服务");
        }
    }
}

//选择分析类型
$(".changeTypeBox").on("click", "button", function () {
    $(".changeTypeBox button").attr("class", "layui-btn layui-btn-primary");
    $(this).attr("class", "layui-btn layui-btn-noraml");
    var type = $(this).attr("data-type");
    top.fxType = type;
});

//汇总
var detailsList = [];
$("#summarizing").click(function () {
    layer.msg("功能暂未实现");
    return;
    $("#totalAreaTd").html("");
    $("#tbody_tb").html("");
    $("#tb_detailed").html("");
    $("#tbody_summarizing").html("");
    var Features = sourceClues.getFeatures();
    var str = "";
    var length = 0;
    var cylx01 = { //农用地
        length: 0,
        areaTotal: 0,
        detailed: []
    };
    var cylx02 = { //建设用地
        length: 0,
        areaTotal: 0,
        detailed: []
    };

    var cylx03 = { //未利用地
        length: 0,
        areaTotal: 0,
        detailed: []
    };
    detailsList = [];
    for (var j = 0; j < Features.length; j++) {
        var polygon = Features[j].getGeometry();
        var BH = Features[j].get("BH");
        var extent = polygon.getExtent();
        flatCoordinates = polygon.flatCoordinates;

        var geometry = extent[0] + "," + extent[1] + "," + extent[2] + "," + extent[3];
        // var queryurl_tb = querylayerUrl.WYDLTB + "/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
        var queryurl_tb = mapUrl + "/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
        queryurl_tb += geometry;
        $.ajax({
            type: "post", //请求方式
            url: queryurl_tb,
            data: {}, //参数
            dataType: "text", //返回文本
            jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            async: false,
            cache: false,
            global: false,
            //请求成功后的回调函数
            success: function (xml) {
                var resjosn = $.parseJSON(xml);
                if (resjosn.features.length < 1) {
                    layer.close(layer.loadIndex);
                    return;
                }
                if (resjosn.features) {
                    var nyd = 0;
                    var jsyd = 0;
                    var wlyd = 0;
                    for (var i = 0; i < resjosn.features.length; i++) {
                        var area = getZYLarea(resjosn.features[i]);
                        if (area > 0) {
                            var obj = {
                                CTMJ: area,
                                TBMJ: resjosn.features[i].attributes.TBMJ,
                                DLMC: resjosn.features[i].attributes.DLMC,
                                QSDWMC: resjosn.features[i].attributes.QSDWMC,
                                RINGS: resjosn.features[i].geometry.rings
                            };
                            var isNYD = false;
                            var isJSYD = false;
                            var isWLYD = false;
                            var DLBM = resjosn.features[i].attributes.DLBM;
                            //先按大类筛选一下

                            isNYD = getNYD(DLBM);
                            if (!isNYD) {
                                isJSYD = getJSYD(DLBM);
                            }

                            if (!isJSYD) {
                                isWLYD = getWLYD(DLBM);
                            }


                            if (isNYD) {
                                cylx01.detailed.push(obj);
                                cylx01.length++;
                                cylx01.areaTotal += area;
                                nyd += area;
                            }

                            if (isJSYD) {
                                cylx02.detailed.push(obj);
                                cylx02.length++;
                                cylx02.areaTotal += area;
                                jsyd += area;
                            }

                            if (isWLYD) {
                                cylx03.detailed.push(obj);
                                cylx03.length++;
                                cylx03.areaTotal += area;
                                wlyd += area;
                            }
                        }
                    }
                    detailsList.push({
                        nyd: nyd,
                        jsyd: jsyd,
                        wlyd: wlyd,
                        bh: BH
                    })
                }
            },
            error: function (res) {
                layer.alert('访问服务器失败!');
            }
        });
    }

    var _areaTotal = cylx01.areaTotal + cylx02.areaTotal + cylx03.areaTotal;
    if (_areaTotal == 0) {
        var _cylx01 = 0;
        var _cylx02 = 0;
        var _cylx03 = 0;
        var _cylx04 = 0;
    } else {
        var _cylx01 = (cylx01.areaTotal * 100 / _areaTotal).toFixed(2);
        var _cylx02 = (cylx02.areaTotal * 100 / _areaTotal).toFixed(2);
        var _cylx03 = (cylx03.areaTotal * 100 / _areaTotal).toFixed(2);
        var _cylx04 = ((cylx03.areaTotal + cylx01.areaTotal) * 100 / _areaTotal).toFixed(2);
    }
    str += "<tr><td>农用地(" + cylx01.length + "):</td><td>" +
        cylx01.areaTotal.toFixed(2) + "</td><td>" +
        _cylx01 + "%</td>" +
        "<td><a class='info' href='javascript:;' onclick=detailed1('nyd','农用地')>详情</a></td></tr>";
    str += "<tr><td>建设用地(" + cylx02.length + "):</td><td>" +
        cylx02.areaTotal.toFixed(2) + "</td><td>" +
        _cylx02 + "%</td>" +
        "<td><a class='info' href='javascript:;' onclick=detailed1('jsyd','建设用地')>详情</a></td></tr>";

    str += "<tr><td>未利用地(" + cylx03.length + "):</td><td>" +
        cylx03.areaTotal.toFixed(2) + "</td><td>" +
        _cylx03 + "%</td>" +
        "<td><a class='info' href='javascript:;' onclick=detailed1('wlyd','未利用地')>详情</a></td></tr>";

    str += "<tr><td>违法比例</td><td>" +
        _areaTotal.toFixed(2) + "</td><td>" +
        _cylx04 + "%</td>" +
        "<td></td></tr>";

    detailedObj["tb_nyd"] = cylx01;
    detailedObj["tb_jsyd"] = cylx02;
    detailedObj["tb_wlyd"] = cylx03;
    $("#tbody_tb").html(str);
    $("#totalAreaTd").html(_areaTotal.toFixed(2));
    layer.close(layer.loadIndex);
});

function detailed1(type, name) {
    $(".detaileddiv").addClass('hide');
    $(".detaileddiv").eq(1).removeClass('hide');
    var str = "";
    for (var i = 0; i < detailsList.length; i++) {
        var nyd = detailsList[i].nyd;
        var jsyd = detailsList[i].jsyd;
        var wlyd = detailsList[i].wlyd;
        var bh = detailsList[i].bh;
        var _areaTotal = nyd + jsyd + wlyd;
        if (_areaTotal == 0) {
            str += "<tr><td>" + bh + "</td><td>" + detailsList[i][type].toFixed(2) + "</td><td>0%</td></tr>";
        } else {
            str += "<tr><td>" + bh + "</td><td>" + detailsList[i][type].toFixed(2) + "</td><td>" + (detailsList[i][type] * 100 / _areaTotal).toFixed(2) + "%</td></tr>";
        }
    }
    $("#tbody_summarizing").html(str);
}