var colorArr = ["#1890ff", "#FC548B", "#17D89E", "#4A90E2", "#17D89E", "#919EF2", "#F7598C", "#17D89E", "#F7598C", "#FF5722", "#DD5145", "#009688", "#2C4D83"];
var activationClick = false;
var ztreeObj = null;
var username = "";
var pointsource, clusters;
var features = [];
var tableList = [];
$(function () {
    layui.use(['form', 'layedit', 'laydate', 'element'], function () {

        var form = layui.form;
        $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#214868", boxzoom: false});
        //工具条抽屉
        $(".tip-dropDown").click(function () {
            var tipid = $(this).attr('id');
            if (tipid) {
                var $tipContent = $(".tip-container[index='" + tipid + "']").find('.tip-content');
                if ($tipContent.css('display') == "none") {

                    $tipContent.slideDown();
                    $(this).find("img").attr("src", "../images/icon/收起.png");

                } else {
                    $tipContent.slideUp();
                    $(this).find("img").attr("src", "../images/icon/展开.png");


                }
            }

        });

        initmap();
        pointsource = new ol.source.Vector({
            features: [],
        });
        var styleCache = {};
        clusters = new ol.layer.Vector({
            source: pointsource,
            style: function (feature, resolution) {
                var BH = feature.get('BH');
                var type = feature.get('TYPE');
                var style = null;
                if (type == "point") {
                    style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            stroke: new ol.style.Stroke({
                                color: '#ff0000'
                            }),
                            fill: new ol.style.Fill({
                                color: "#ff0000"
                            })
                        }),
                        text: new ol.style.Text({
                            font: '14px Calibri,sans-serif',
                            text: BH,
                            fill: new ol.style.Fill({
                                color: '#16A05D'
                            }),
                        })
                    })];
                } else {
                    style = [
                        new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgba(255,0,0,1)',
                                width: 5
                                //lineDash: [10, 10],
                            }),
                            text: new ol.style.Text({
                                font: '14px Calibri,sans-serif',
                                text: BH,
                                fill: new ol.style.Fill({
                                    color: '#16A05D'
                                })
                            })
                        })
                    ];
                }

                return style;
            },
            name: "聚合"
        });
        _mapObject.addLayer(clusters);


        layer.loadIndex = layer.load(0, {shade: 0.1});

        var url = "/GetSurveyerInfos";
        SurveyWebService(url, {}, true, function (resjson) {
            if (resjson.indexOf("false") > -1) {
                parent.layer.alert("未查询到结果!");
                parent.layer.close(parent.layer.loadIndex);
                var resjosn = [];
            } else {
                var resjosn = $.parseJSON(resjson);
            }
            var zNodes = [];
            for (var i = 0; i < resjosn.length; i++) {
                var name = resjosn[i].DCDW;
                var CJRYS = resjosn[i].CJRYS;
                var data = {
                    name: name,
                    checked: false,
                    open: true,
                    icon: "../js/zTreeStyle/img/diy/node2.png",
                    children: []
                };
                for (var j = 0; j < CJRYS.length; j++) {
                    data.children.push({
                        name: CJRYS[j],
                        DCDW: name,
                        checked: false,
                        icon: "../js/zTreeStyle/img/diy/node1.png"
                    })
                }
                zNodes.push(data);
            }
            ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            layer.close(layer.loadIndex);
        });


        _mapObject.on('click', function (evt) {
            if (!activationClick) {
                return;
            }
            var mapZoom = _mapObject.getView().getZoom();
            var mapCenter = _mapObject.getView().getCenter();
            source1.clear();
            var layername = "";
            var feature = _mapObject.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    return feature;
                }, {
                    layerFilter: function (layer) {
                        if (layer.get('name') == "聚合") {
                            layername = "聚合";
                            return layer.get('name') === '聚合';
                        }
                    }
                }
            );
            if (feature) {
                showFeatureInfo(feature);
            }
        });
    });

});

function SurveyWebService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: "http://124.205.115.26:8089/gtkjghTest/MonitorManagerService.asmx" + WebServerurl,
        data: data, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: async,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            return success($(xml).text());
        },
        error: function (res) {
//      	layer.alert('访问服务器失败!');
            return success("false");
        }
    });
}

function showFeatureInfo(feature) {
    source1.clear();
    var str = "<div id='alertinfo'>";
    str += "<div class='san'></div><div class='layui-layer-title'>详细信息</div>";
    str += "<div class='layui-layer-content niceScroll'>";
    str += "<table class='table table-bordered'>";
    str += "<tr><td>编号:</td><td>" + feature.get('BH') + "</td></tr>";
    str += "<tr><td>违法类型:</td><td>" + feature.get('WFLX') + "</td></tr>";
    str += "<tr><td>违法信息:</td><td>" + feature.get('INFO') + "</td></tr>";
    str += "<tr><td>是否违法:</td><td>" + feature.get('SFWF') + "</td></tr>";
    str += "<tr><td>备注:</td><td>" + feature.get('BZ') + "</td></tr>";
    if (feature.get('PHOTOS') == "") {
        str += "<tr><td>机井照片</td><td></td></tr>";
    } else {
        var jjzp = feature.get('PHOTOS').split(";");
        str += "<tr><td>照片</td><td><a href='javascript:;' onclick=lookimg('" + feature.get('PHOTOS') + "','" + feature.get('GUID') + "','照片')>查看图片(" + (jjzp.length - 1) + "张)</a></td></tr>";
    }
    str += "</table>";
    str += "</div>";
    str += "<i id='closeAlertInfo' class='layui-icon layui-icon-close'></i>";
    str += "</div>";
    document.getElementById("alertinfodiv").innerHTML = str;
    source1.addFeature(feature);
    vector1.setVisible(true);
    if (marker) {
        _mapObject.removeOverlay(marker);
    }
    marker = new ol.Overlay({
        element: document.getElementById('alertinfo'),
        position: getPointsCenter(feature.get("POINTS")),
        positioning: 'left-left',
        offset: [-35, 35]
    });
    _mapObject.addOverlay(marker);
    $("#closeAlertInfo").click(function () {
        source1.clear();
        _mapObject.removeOverlay(marker);
    });
    $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#214868", boxzoom: false});
}

//激活点选
$("#activationClick").click(function () {
    if (draw) {
        _mapObject.removeInteraction(draw);//移除交互事件
    }
    if (activationClick) {
        $("#map").css('cursor', 'Default');
        $(".activationClick").html("激活点选");
        activationClick = false;
    } else {
        $("#map").css('cursor', 'Pointer');
        $(".activationClick").html("取消点选");
        activationClick = true;
    }
});


//全图
$("#quanfu").click(function () {
    var Extent = [115.87034540802743, 37.72967179180566];
//	_mapView.fit(Extent,9);
    _mapView.setCenter(Extent);//单点定位
    _mapView.setZoom(9);
});


var setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: function (event, treeId, node) {
            if (node.type == 0) {
                selnode = null;
            } else {
                selnode = node;
            }

        },
        onRightClick: function (event, treeId, node) {
            var node1 = node;
        },
        onDblClick: function (event, treeId, node) {
            var node1 = node;
        },
        onCheck: function (event, treeId, node) {
            var nodes = ztreeObj.getNodesByParam("level", "1", null);
            features = [];
            tableList = [];
            source1.clear();
            pointsource.clear();
            if (nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        var CJRY = nodes[i].name;
                        var DCDW = nodes[i].DCDW;
                        SurveyWebService("/GetCluesbyRY", {bm: DCDW, ry: CJRY}, false, function (resjson) {
                            if (resjson.indexOf("false") > -1) {
                                parent.layer.alert("未查询到结果!");
                                parent.layer.close(parent.layer.loadIndex);
                                var resjosn = [];
                            } else {
                                var resjosn = $.parseJSON(resjson);
                            }
                            for (var j = 0; j < resjosn.length; j++) {
                                var BH = resjosn[j].BH;
                                var WFLX = resjosn[j].WFLX;
                                var INFO = resjosn[j].WFMS;
                                var BZ = resjosn[j].BZ;
                                var points = resjosn[j].ZB;
                                var featureType = resjosn[j].TXLX;
                                var PHOTOS = resjosn[j].ZP;
                                var SFWF = resjosn[j].SFWF;
                                var GUID = resjosn[j].ID;

                                var feature;
                                if (featureType == "point") {//点
                                    var X = points.split(",")[0];
                                    var Y = points.split(",")[1];
                                    feature = new ol.Feature(new ol.geom.Point([X, Y]));
                                } else {//线 或 面
                                    var pointArr = points.split(";");
                                    if(featureType == "polyline"){
                                    	var LINESTRING = "LINESTRING(";
                                    }else{
                                    	var LINESTRING = "POLYGON((";
                                    }
                                    
                                    var lonArr = [];
                                    var latArr = [];
                                    for (var i = 0; i < pointArr.length; i++) {
                                        var lon = pointArr[i].split(",")[0];
                                        var lat = pointArr[i].split(",")[1];
                                        if (i != 0) {
                                            LINESTRING += ",";
                                        }
                                        LINESTRING += lon + " " + lat;
                                        lonArr.push(lon);
                                        latArr.push(lat);
                                    }
                                   
                                    if(featureType == "polyline"){
                                    	 LINESTRING += ")";
                                    }else{
                                    	 LINESTRING += "))";
                                    }
                                    feature = _wktParser.readFeature(LINESTRING);
                                }

                                feature.set("GUID", GUID);
                                feature.set("BH", BH);
                                feature.set("WFLX", WFLX);
                                feature.set("INFO", INFO);
                                feature.set("BZ", BZ);
                                feature.set("POINTS", points);
                                feature.set("TYPE", featureType);
                                feature.set("PHOTOS", PHOTOS);
                                feature.set("SFWF", SFWF);
                                features.push(feature);

                                var data = {
                                    BH: BH,
                                    WFLX: WFLX,
                                    INFO: INFO
                                };
                                tableList.push(data);
                            }

                        })
                    }
                }
                pointsource.addFeatures(features);
                showTable(tableList);
            }
        },
    }
};


function showTable() {
    var html = "<ul>";
    $.each(tableList, function (i, v) {
        html += "<li onclick='showInfoByIndex(" + i + ")'>" +
            "<div>编号：" + v.BH + "</div>" +
            "<div>违法类型：" + v.WFLX + "</div>" +
            "<div>违法信息：" + v.INFO + "</div>" +
            "</li>";
    });
    html + "</ul>";
    $(".pointList").html(html);
}

function showInfoByIndex(index) {
    var feature = features[index];
    var points = feature.get("POINTS");
    _mapObject.getView().setCenter(getPointsCenter(points));
    showFeatureInfo(feature);
}

function getPointsCenter(points) {
    var pointsArr = points.split(";");
    var minX = parseFloat(pointsArr[0].split(",")[0]);
    var minY = parseFloat(pointsArr[0].split(",")[1]);
    var maxX = parseFloat(pointsArr[0].split(",")[0]);
    var maxY = parseFloat(pointsArr[0].split(",")[1]);
    for (var i = 0; i < pointsArr.length; i++) {
        var nx = parseFloat(pointsArr[i].split(",")[0]);
        var ny = parseFloat(pointsArr[i].split(",")[1]);
        if (nx > maxX) {
            maxX = nx;
        }
        if (ny > maxY) {
            maxY = ny;
        }
        if (nx < minX) {
            minX = nx;
        }
        if (ny < minY) {
            minY = ny;
        }
    }
    var centerX = (minX + maxX) / 2;
    var centerY = (minY + maxY) / 2;
    return [centerX, centerY];
}

function addclusters(features) {


}


//查看图片
function lookimg(imgurl, guid, title) {
    layer.imgurl = imgurl;
    layer.guid = guid;
    layer.openType = 0;
    layer.openIndex = layer.open({
        type: 2,
        title: title,
        fixed: false, //不固定
        maxmin: true,
        closeBtn: 1, //不显示关闭按钮
        shade: [0],
        skin: 'layui-layer-lan',
        area: ['450px', '642px'],
        //			  offset: 'rb', //右下角弹出
        anim: 2,//弹出动画
        shade: 0.2,//遮盖层
        content: ['images1.html', 'no'], //这里content是一个普通的String
        end: function () {


        }
    });
}
