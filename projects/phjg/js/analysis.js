var detailedObj = {};
var extent, flatCoordinates, points1, area1;
var geometry;

var beforeUlrl = "http://" + location.href.split("/")[2] + "/" + location.href.split("/")[3] + "/";
var editData;//要编辑的data
var editFeature;//要编辑的feature
var sourceClues;//违法图斑图层

var NYDlist = ["011", "012", "013", "021", "022", "023", "031", "032", "033", "041", "042", "104", "114", "117", "122", "123"];
var JSYDlist = ["051", "052", "053", "054", "061", "062", "063", "071", "072", "081", "082", "083", "084", "085", "086", "087", "088", "091", "092", "093", "094",
    "095", "101", "102", "103", "105", "106", "107", "113", "118", "121", "201", "202", "203", "204", "205"];
var WLYDlist = ["111", "112", "115", "116", "119", "043", "124", "125", "126", "127"];

function query(scope, type, mapUrl) {
    var h = document.body.clientHeight;
    $("#alertinfo").attr("style", "max-height:" + h + "px");

    extent = scope.getExtent();
    flatCoordinates = scope.flatCoordinates;
    points1 = getPoints(flatCoordinates);
    area1 = PolygonArea(points1, points1.length - 1);
    layer.loadIndex = layer.load(0, {
        shade: 0.1
    });
    geometry = extent[0] + "," + extent[1] + "," + extent[2] + "," + extent[3];

    var url = mapUrl;
    var queryurl_tb = url +
        "/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
    queryurl_tb += geometry;
    DBdltb(type, queryurl_tb);
};

//按地类查询
function DBdltb(type, queryurl_tb) {

    getMapInfo(queryurl_tb, function (resArr, totalArea) {
        var str = "";
        var queryMC;
        $('#totalAreaTd').html(totalArea.toFixed(3) + "（亩）");
        if (type == "dl") { //按地类查询
            queryMC = "地类名称";
            var dlObject = {};
            $.each(resArr, function (i, v) {
                if (dlObject[v.dlbm]) { //如果存在相同的地类名称
                    dlObject[v.dlbm].area += v.area;
                } else {
                    dlObject[v.dlbm] = {
                        dlmc: v.dlmc,
                        area: v.area
                    }
                }
            });
            $.each(dlObject, function (i, v) {
                str += '<tr>';
                str += ' <td>' + v.dlmc + '-' + i + '</td>';

                if(v.area>=0.001){
                    str += ' <td>' + v.area.toFixed(3) + '（亩）</td>';
                }else{
                    str += ' <td>' + v.area + '（亩）</td>';
                }

                str += '</tr>';
            });
        } else if (type == "qs") { //按权属分类查询
            queryMC = "权属单位名称";
            var dlObject = {};
            $.each(resArr, function (i, v) {
                if (dlObject[v.qsdwdm]) { //如果存在相同的地类名称
                    dlObject[v.qsdwdm].area += v.area;
                } else {
                    dlObject[v.qsdwdm] = {
                        qsdwmc: v.qsdwmc,
                        qsxz: v.qsxz,
                        area: v.area
                    }
                }
            });
            $.each(dlObject, function (i, v) {
                str += '<tr>';
                str += ' <td>' + v.qsdwmc + v.qsxz + '</td>';
                str += ' <td>' + v.area.toFixed(3) + '（亩）</td>';
                str += '</tr>';
            });
        } else if (type == "nt") { //按是否农田分类

            queryMC = "类型";
            var nyydArea = 0;
            $.each(resArr, function (i, v) {
                if (v.ydfl == "nyyd") {
                    nyydArea += v.area;
                }
            });
            var fnyydArea = totalArea - nyydArea;//非农业用地
                str += '<tr>';
                str += ' <td>基本农田</td>';
                str += ' <td>' + nyydArea.toFixed(3) + '（亩）</td>';
                str += '</tr>';
                str += '<tr>';
                str += ' <td>非基本农田</td>';
                str += ' <td>' + fnyydArea.toFixed(3) + '（亩）</td>';
                str += '</tr>';
        } else if (type == "gh") { //按是否建设用地查询
            queryMC = "类型";
            var jsydArea = 0;
            $.each(resArr, function (i, v) {
                if (v.ydfl == "jsyd") {
                    jsydArea += v.area;
                }
            });
            var fjsydArea = totalArea - jsydArea;//非
            str += '<tr>';
            str += ' <td>建设用地</td>';
            str += ' <td>' + jsydArea.toFixed(3) + '（亩）</td>';
            str += '</tr>';
            str += '<tr>';
            str += ' <td>非建设用地</td>';
            str += ' <td>' + fjsydArea.toFixed(3) + '（亩）</td>';
            str += '</tr>';
        }
        layer.close(layer.loadIndex);
        $('#queryMC').html(queryMC);
        $('#tbody_tb').html(str);
    })
}

function getMapInfo(queryurl_tb, res) {
    $.ajax({
        type: "post", //请求方式
        url: queryurl_tb,
        data: {}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            var resjosn = $.parseJSON(xml);
            if (resjosn.features.length < 1) {
                layer.alert("图斑范围内没有可以比对的数据");
                layer.close(layer.loadIndex);
                return;
            }
            var resArr = [];
            var totalArea = 0;
            if (resjosn.features) {
                if(resjosn.features.length>0) {
                    for (var i = 0; i < resjosn.features.length; i++) {
                        var area = getZYLarea(resjosn.features[i]) * 0.0015;
                        if (area > 0) {
                            totalArea += area;
                            var obj = {
                                area: area, //冲突面积
                                tbmj: resjosn.features[i].attributes.TBMJ * 0.0015, //图斑面积
                                dlmc: resjosn.features[i].attributes.DLMC, //地类名称
                                dlbm: resjosn.features[i].attributes.DLBM, //地类编码
                                qsdwmc: resjosn.features[i].attributes.QSDWMC, //权属单位名称
                                qsdwdm: resjosn.features[i].attributes.QSDWDM, //权属单位代码
                                qsxz: resjosn.features[i].attributes.QSXZ, //权属性质
                                rings: resjosn.features[i].geometry.rings,
                                tbbh: resjosn.features[i].attributes.TBBH, //图斑编号
                            }
                            //判断是否是基本农田 判断是否是建设用地
                            var DLBM = obj.dlbm;
                            var nyydArr = [ //农业用地
                                "011", "012", "013", "021", "022", "023",
                                "031", "032", "033", "041", "042", , "104", "114",
                                "117", "122", "123"
                            ];
                            var jsydArr = [ //建设用地
                                "051", "052", "053", "054",
                                "061", "062", "063",
                                "071", "072",
                                "081", "082", "083", "084", "085", "086", "087", "088",
                                "091", "092", "093", "094", "095",
                                "101", "102", "103", "105", "106", "107",
                                "113", "118", "121",
                                "201", "202", "203", "204", "205"
                            ];
                            var wlydArr = [ //未利用地
                                "111", "112", "115", "116", "119",
                                "043",
                                "124", "125", "126", "127"
                            ];
                            if (nyydArr.indexOf(DLBM) > -1) {
                                obj.ydfl = "nyyd";
                            } else if (jsydArr.indexOf(DLBM) > -1) {
                                obj.ydfl = "jsyd";
                            } else if (wlydArr.indexOf(DLBM) > -1) {
                                obj.ydfl = "wlyd";
                            }
                            resArr.push(obj);
                        }
                    }
                }
            }
            return res && res(resArr, totalArea);
        },
        error: function (res) {
            layer.alert('访问服务器失败!');
        }
    });
}

function DBwftb(mapUrl) {
    //对比违法地类图斑建设用地非建设用地占有率
    $.ajax({
        type: "post", //请求方式
        url: queryurl_tb,
        data: {}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            var resjosn = $.parseJSON(xml);
            if (resjosn.features.length < 1) {
                layer.close(layer.loadIndex);
                return;
            }
            $("#tbody_tb").html(str);
            $("#tbody_tb").show();
            layer.close(layer.loadIndex);
        },
        error: function (res) {
            layer.alert('访问服务器失败!');
        }
    });
}


//获取冲突面积
function getZYLarea(feature) {
    var area = 0;
    for (var m = 0; m < feature.geometry.rings.length; m++) {
        var pointArr = feature.geometry.rings[m];
        var points = [];
        for (var j = 0; j < pointArr.length; j++) {
            var point = {
                x: pointArr[j][0],
                y: pointArr[j][1]
            }
            point = BL2XY(point);
            points.push(point);
        }
        var points11 = getPoints(flatCoordinates);
        var area2 = SPIA(points11, points, points11.length - 1, points.length - 1);

        area2 = Math.abs(area2);
        if (m == 0) {
            area = area2;
        } else {
            area -= area2;
        }
    }
    area = Math.abs(area);
    return area;
}

//地块详情
function detailed(index, title) {
    var detailed = detailedObj[index].detailed;
    if (detailed.length == 0) {
        $("#" + index.split("_")[0] + "_detailed").html("");
    } else {
        var str = "<tr><td>地类名称</td><td>占用面积</td><td>地块面积</td></tr>";
        for (var i = 0; i < detailed.length; i++) {
            var TBBH = detailed[i].TBBH || "";
            str += "<tr onclick=lightPolygon('" + i + "','" + index + "')>";
            str += "<td>" + detailed[i].DLMC + "-" + TBBH + "</td>";
            str += "<td>" + detailed[i].CTMJ.toFixed(3) + "(亩)</td>";
            str += "<td>" + detailed[i].TBMJ.toFixed(3) + "(亩)</td>";
            str += "</tr>";
        }
        $("#" + index.split("_")[0] + "_detailed").html(str);
        $("#" + index.split("_")[0] + "_detailed").show();
    }

}

//双击高亮
function lightPolygon(i, index) {
    if (_vector) {
        _mapObject.removeLayer(_vector);
    }
    var RINGS = detailedObj[index].detailed[i].RINGS[0];
    var Coordinatesstr = "POLYGON((";
    for (var i = 0; i < RINGS.length; i++) {
        if (i != 0) {
            Coordinatesstr += ","
        }
        Coordinatesstr += RINGS[i][0] + " " + RINGS[i][1];
    }
    Coordinatesstr += "))";
    _source = new ol.source.Vector({
        features: []
    });
    _vector = new ol.layer.Vector({ //临时高亮图层
        name: "高亮图层",
        source: _source,
        style: function (feature, resolution) {
            var a = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "#4384DB",
                    width: 5
                })
            });
            return a;
        }
    });
    var feature = _wktParser.readFeature(Coordinatesstr);
    _source.addFeature(feature);
    _mapView.fit(_source.getExtent(), _mapObject.getSize());
    _mapObject.addLayer(_vector);
    _vector.setVisible(true);
}

function showFeatureInfo(feature) {
    var polygon = feature.getGeometry();
    var flatCoordinates = polygon.flatCoordinates;
    var Extent = polygon.getExtent();
    var centerlon = (Extent[0] + Extent[2]) / 2;
    var centerlat = (Extent[1] + Extent[3]) / 2;
    var str = "<div id='alertinfo'>";

    var data = {};
    $.each(feature.getKeys(), function (i, v) {
        data[v] = feature.get(v);
    });
    editFeature = feature;
    editData = data;
    str += "<div class='san'></div><div class='layui-layer-title'>详细信息</div>";
    str += "<div class='layui-layer-content niceScroll'>";
    str += "<table class='table table-bordered'>";
    str += "<tr><td>监测编号:</td><td>" + data.BH + "</td></tr>";
    str += "<tr><td>图斑类型:</td><td>" + data.TBLX + "</td></tr>";
    str += "<tr><td>实地现状:</td><td>" + data.SDXZ + "</td></tr>";
    str += "<tr><td>用地单位:</td><td>" + data.YDDW + "</td></tr>";
    str += "<tr><td>项目名称:</td><td>" + data.XMMC + "</td></tr>";
    str += "<tr><td>道路类型:</td><td>" + data.DLLX + "</td></tr>";
    str += "<tr><td>道路名称:</td><td>" + data.DLMC + "</td></tr>";
    str += "<tr><td>道路宽度:</td><td>" + data.DLKD + "</td></tr>";
    str += "<tr><td>是否违法:</td><td>" + data.SFWF + "</td></tr>";
    str += "<tr><td>地类名称1:</td><td>" + data.TDFL1 + "</td></tr>";
    str += "<tr><td>地类名称2:</td><td>" + data.TDFL2 + "</td></tr>";
    str += "<tr><td>调查人员:</td><td>" + data.RY + "</td></tr>";
    str += "<tr><td>工作单位:</td><td>" + data.BM + "</td></tr>";
//	    str += "<tr><td>照片:</td><td>" + data.ZP + "</td></tr>";
    if (!data.PHOTOS) {
        str += "<tr><td>照片</td><td></td></tr>";
    } else {
        var jjzp = data.PHOTOS.split(",");
        str += "<tr><td>照片</td><td><a href='javascript:;' onclick=lookimg('" + data.PHOTOS + "','" + data.XZQDM + "','" + data.BH + "')>查看图片(" + (jjzp.length) + "张)</a></td></tr>";
    }
    str += "</table>";
    str += "</div>";
    str += "<i id='closeAlertInfo' class='layui-icon layui-icon-close'></i>";
    if(top.isShowEditBox){
        str += "<div class=\"editBox\">\n" +
            "        <div onclick='editAttr()' class=\"layui-btn layui-btn-sm layui-btn-warm editAttrBtn\">编辑属性</div>\n" +
            "        <div onclick='saveNode()' class=\"layui-btn layui-btn-sm saveNodeBtn\">保存节点</div>\n" +
            "    </div>";
        str += "</div>";
    }
    document.getElementById("alertinfodiv").innerHTML = str;
    if (marker) {
        _mapObject.removeOverlay(marker);
    }

    var posi = getFeatureCenter(feature);
    // layerManager.setCenter(posi);
    _mapObject.getView().animate({center: posi});
    // layerManager.setZoom(16);
    if (Extent) {
        _mapObject.getView().fit(Extent, _mapObject.getSize());
        //map.getView().set('extent' ,extent );
    }
    marker = new ol.Overlay({
        element: document.getElementById('alertinfo'),
        position: [centerlon, centerlat],
        positioning: 'left-left',
        offset: [-35, 35]
    });
    _mapObject.addOverlay(marker);
    $("#closeAlertInfo").click(function () {
        _mapObject.removeOverlay(marker);
    });
//	    $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#214868", boxzoom: false});
}

function getFeatureCenter(feature) {
    var extent = ol.extent.boundingExtent(feature.getGeometry().getCoordinates()[0]); //获取一个坐标数组的边界，格式为[minx,miny,maxx,maxy]
    var center = ol.extent.getCenter(extent);
    return center;
}

function getNYD(dlbh) {
    for (var i = 0; i < NYDlist.length; i++) {
        if (NYDlist[i].indexOf(dlbh) > -1) {
            return true;
        }
    }
    return false;
}

function getJSYD(dlbh) {
    for (var i = 0; i < JSYDlist.length; i++) {
        if (JSYDlist[i].indexOf(dlbh) > -1) {
            return true;
        }
    }
    return false;
}

function getWLYD(dlbh) {
    for (var i = 0; i < WLYDlist.length; i++) {
        if (WLYDlist[i].indexOf(dlbh) > -1) {
            return true;
        }
    }
    return false;
}

//查看图片
function lookimg(ZP, XZQDM, BH) {
    parent.layer.imgurl = ZP;
    parent.layer.XZQDM = XZQDM;
    parent.layer.BH = BH;
    parent.layer.openIndex = parent.layer.open({
        type: 2,
        title: "查看照片",
        fixed: false, //不固定
        maxmin: true,
        closeBtn: 1, //不显示关闭按钮
        shade: [0],
        skin: 'layui-layer-lan',
        area: ['70%', '90%'],
        //			  offset: 'rb', //右下角弹出
        anim: 2,//弹出动画
        shade: 0.2,//遮盖层
        content: [beforeUlrl + 'html/lookdata/images.html', 'no'], //这里content是一个普通的String
        end: function () {
        }
    });
}

/**
 * 编辑属性
 */
function editAttr() {
    layer.openIndex = layer.open({
        type: 2,
        title: "编辑属性",
        fixed: false, //不固定
        maxmin: true,
        closeBtn: 1, //不显示关闭按钮
        shade: [0],
        skin: 'layui-layer-lan',
        area: ['540px', '580px'],
        anim: 2,//弹出动画
        shade: 0.2,//遮盖层
        content: [beforeUlrl + 'html/lookdata/editAttr.html?type=edit', 'no'], //这里content是一个普通的String
        end: function () {
        }
    });
}

/**
 * 保存编辑后的图斑节点信息
 */
function saveNode() {
    var BH = editFeature.get("BH");
    var pointarr = editFeature.getGeometry().flatCoordinates;
    var pointstr = "POLYGON((";
    $.each(pointarr, function (i, v) {
        pointstr += v;
        var last = "";
        if (i % 2 == 1) {
            last = ",";
        } else {
            last = " ";
        }
        pointstr += last;
    });
    if (pointstr[pointstr.length - 1] == ",") {
        pointstr = pointstr.substr(0, pointstr.length - 1);
    }
    pointstr += "))";
    $.ajax({
        type: "post", //请求方式
        url: sessionStorage.baseUrl + "JCTBManagerService.asmx/UpdateJctbCoordByBh",
        data: {
            BH: BH,
            COORD: pointstr,
            sprid: sessionStorage.sprid
        }, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            var res = $(xml).text().trim();
            console.log(res);
            layer.msg("保存节点成功");
        },
        error: function (res) {
            layer.alert('访问服务器失败!');
        }
    });
    console.log(pointstr);
}

function changePostData(data) {
    var postData = {
        smc: data.SMC,
        xmc: data.XMC,
        xzqdm: data.XZQDM,
        tblx: data.TBLX,
        jcbh: data.BH,
        sdxz: data.SDXZ,
        yddw: data.YDDW,
        type: data.TYPE,
        xmmc: data.XMMC,
        dllx: data.DLLX,
        dlmc: data.DLMC,
        dlkd: data.DLKD || 0,
        zblx: data.ZBLX,
        photos: data.PHOTOS,
        bm: data.BM,
        ry: data.RY,
        fxsj: data.FXSJ,
        xcsj: data.XCSJ,
        bz: data.BZ,
        sfwf: data.SFWF,
        hsfs: data.HSFS,
        tdfl1: data.TDFL1,
        tdfl2: data.TDFL2,
        photo_info: data.PHOTOINFO,
        sfzygdjf: data.SFZYGDJF
    };
    return postData;
}

function SurveyWebService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: sessionStorage.baseUrl + "JCTBManagerService.asmx" + WebServerurl,
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

var fieldArr = ["BM", "RY", "BH", "BZ", "PHOTOS", "POINTS",
    "SDXZ",
    "YDDW",
    "XMMC",
    "DLLX",
    "DLMC",
    "DLKD",
    "FXSJ",
    "TBLX",
    "XCSJ",
    "ZBLX",
    "SMC",
    "XMC",
    "XZQDM",
    "HSFS",
    "SFWF",
    "YJDLMC",
    "EJDLMC",
    "TDFL1",
    "TDFL2",
    "PHOTOINFO",
    "SFZYGDJF",
];

//监听弹窗页面点击了保存后进行数据处理
window.layerSubmit = function (type, data) {
    layer.closeAll();
    if (type == "editPoint") {
        var postData = changePostData(data);
        SurveyWebService("/UpdateMonitor", postData, true, function (res) {
            if (res.trim() == "ok") {
                var feature = editFeature;
                $.each(fieldArr, function (i, v) {
                    feature.set(v, data[v]);
                });
                _mapObject.removeOverlay(marker);
                _mapObject.render();
                layer.msg("编辑成功");
            } else {
                layer.alert(res);
            }
        })
    }
};
