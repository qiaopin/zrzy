
//工具条
var maptool = {
	layerManager:null,
	source:null,
	vector:null,
	mapObj:null,
	draw:null,
	wgs84Sphere:null,
	measureTooltip:null,
	marker:null,
	measureTooltipElement:null,
	sketch:null,//当前绘制的要素
	_wktParser:null,
	init:function(layerManager){
		this.layerManager = layerManager;
		this.mapObj = layerManager._mapObject;
		this.wgs84Sphere = new ol.Sphere(6378137);
		this._wktParser = new ol.format.WKT();
	},
	measure:function(obj){
		if(!this.vector){
			this.source = new ol.source.Vector();
			this.vector = new ol.layer.Vector({
		        source: maptool.source,
		        style: new ol.style.Style({
		            fill: new ol.style.Fill({
		                color: "rgba(255,255,255,0.2)"
		            }),
		            stroke: new ol.style.Stroke({
		                color: "#ffcc33",
		                width: 2
		            }),
		            image: new ol.style.Circle({
		                radius: 7,
		                fill: new ol.style.Fill({
		                    color: "#ffcc33"
		                })
		            })
		        }),
		    });
		    this.mapObj.addLayer(this.vector);
		}
		
		$("#map").css("cursor", "default");
	    //移除交互事件
	    if(maptool.draw){
	    	maptool.mapObj.removeInteraction(maptool.draw);
	    }
	    var type = (obj == "area" ? "Polygon" : "LineString");
	    maptool.draw = new ol.interaction.Draw({
	        source: maptool.source, //测量绘制层数据源
	        type: (type), //几何图形类型
	       
	    });
	    maptool.mapObj.addInteraction(maptool.draw);
	    //创建测量提示工具
	    this.createMeasureTooltip();
	    var listener;
	    //绑定交互绘制工具开始绘制事件
	    maptool.draw.on("drawstart", function (evt) {
	        maptool.sketch = evt.feature; //绘制的要素
	        var tooltipCoord = evt.coordinate; //绘制的坐标
	        //绑定change事件，根据绘制几何类型得到测量长度或面积
	        //并将其设置到测量工具提示框中进行显示
	        listener = maptool.sketch.getGeometry().on("change", function (evt) {
	            var geom = evt.target;
	            var output;
	            if (geom instanceof ol.geom.Polygon) {
	                //输出面积
	                output = maptool.formatArea(geom);
	                tooltipCoord = geom.getInteriorPoint().getCoordinates();
	            } else if (geom instanceof ol.geom.LineString) {
	                //输出长度
	                output = maptool.formatLength(geom);
	                tooltipCoord = geom.getLastCoordinate();
	            }
	            //将测量值设置到测量工具提示框中进行显示
	            maptool.measureTooltipElement.innerHTML = output;
	            //设置测量工具提示框的显示位置
	            maptool.measureTooltip.setPosition(tooltipCoord);
	        }, this);
	    });
	    //绑定交互绘制工具结束绘制束事件
	    maptool.draw.on("drawend", function (evt) {
	        var geom = evt.feature.getGeometry();
	        maptool.measureTooltipElement.className = "tooltipbar tooltipbar-static";
	        maptool.measureTooltip.setOffset([0, -7]);
	        maptool.sketch = null;
	        maptool.measureTooltipElement = null;
	        maptool.createMeasureTooltip();
	        ol.Observable.unByKey(listener);
	    }, this);
	},
	createMeasureTooltip:function(){
		if (maptool.measureTooltipElement) {
	        maptool.measureTooltipElement.parentNode.removeChild(maptool.measureTooltipElement);
	    }
	    maptool.measureTooltipElement = document.createElement("div");
	    maptool.measureTooltipElement.className = "tooltipbar tooltipbar-measure";
	    this.measureTooltip = new ol.Overlay({
	        element: maptool.measureTooltipElement,
	        offset: [0, -15],
	        positioning: "bottom-center"
	    });
	    this.mapObj.addOverlay(maptool.measureTooltip);
	},
	formatArea:function(polygon) {
	    var area;
	    //地图数据源投影坐标系
	    var sourceProj = maptool.mapObj.getView().getProjection();
	    //将多边形要素坐标投影为EPSG:4326
	    var geom = (polygon.clone().transform(sourceProj, "EPSG:4326"));
	    //解析多边形的坐标值
	    var coordinates = geom.getLinearRing(0).getCoordinates();
	    //计算面积
	    area = Math.abs(maptool.wgs84Sphere.geodesicArea(coordinates));
	    var output;
	    if (area > 1000000) {
	        //换算成平方千米
	        output = (Math.round(area / 1000000 * 100) / 100) + "平方千米";
	    } else {
	        output = (Math.round(area * 100) / 100) + "平方米";
	    }
	    return output;
	},
	formatLength:function(line) {
	    var length;
	    //解析线的坐标
	    var coordinates = line.getCoordinates();
	    length = 0;
	    //地图数据源投影坐标系
	    var sourceProj = maptool.mapObj.getView().getProjection();
	    //通过遍历坐标计算两点之间的距离，进而得到整条线的长度
	    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
	        var c1 = ol.proj.transform(coordinates[i], sourceProj, "EPSG:4326");
	        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");
	        length += maptool.wgs84Sphere.haversineDistance(c1, c2);
	    }
	    var output;
	    if (length > 1000) {
	        //换算成千米
	        output = (Math.round(length / 1000 * 100) / 100) + "千米";
	    } else {
	        output = (Math.round(length * 100) / 100) + "米";
	    }
	    return output;
	},
	clear:function(){
		if(this.vector){
			this.source.clear();
			this.mapObj.removeLayer(this.vector);
			this.vector = null;
		}
		
		maptool.mapObj.removeInteraction(maptool.draw);
	    if (maptool.marker) {
	        maptool.mapObj.removeOverlay(maptool.marker);
	    }
	    $(".tooltipbar").html(""); //清除测量文字
	    if(_vector) {
			maptool.mapObj.removeLayer(_vector);
		}
	},
	allover:function(){
		var lon = this.layerManager.center[0];
		var lat = this.layerManager.center[1];
		var zoom = this.layerManager.zoom;
        var Extent = [lon,lat];
        var _mapView = maptool.mapObj.getView();
		_mapView.setCenter(Extent);//单点定位
	    _mapView.setZoom(zoom);
	}
};

function initMapQuery(){
    _mapObject = layerManager._mapObject;
    _mapView = _mapObject.getView();
    _wktParser = new ol.format.WKT();
    var isquery = false;
    $("#query").click(function () {
        if (isquery) {
            $("#map").css('cursor', 'default');
            $(this).attr("title", "查询");
            isquery = false;
        } else {
            $("#map").css('cursor', 'pointer');
            $(this).attr("title", "取消查询");
            isquery = true;
        }
    });
    _mapObject.on('singleclick', function (evt) {
        if (isquery) {
            NULayers = layerManager.NULayers;
            layersel = "";
            for (var i = 0; i < NULayers.length; i++) {
                if (!NULayers[i].isBaseMap) {
                    var _layer = NULayers[i].layer;
                    var mapUrl = NULayers[i].mapUrl;
                    var layerId = NULayers[i].layerId;
                    var layerName = NULayers[i].layerName;
                    layersel += "<option value='" + layerId + "'>" + layerName + "</option>";
                }
            }
            if (layersel != "") {
                initlayerinfo(layersel, evt.coordinate);
            }
        }
    });
    maptool.init(layerManager);
}

function initlayerinfo(sellayer, coordinate) {
    var str = "<div id='alertinfo'>";
    str += "<div class='layui-layer-title'>详细信息</div>";
    str += "<div class='layersel'>图层:<select id='layersel'>" + sellayer + "</select></div>";
    str += "<div class='layui-layer-content'>";
    str += "<table id='layerinfotable'>";

    str += "</table>";
    str += "</div>";
    str += "<i id='closeAlertInfo' class='layui-icon layui-icon-close'></i>";
    str += "</div>";
    document.getElementById("alertinfodiv").innerHTML = str;
    if (layerManager.marker) {
        _mapObject.removeOverlay(layerManager.marker);
        layerManager.marker = null;
    }
    layerManager.marker = new ol.Overlay({
        element: document.getElementById('alertinfo'),
        position: [coordinate[0], coordinate[1]],
        positioning: 'left-left',
        offset: [-35, 35]
    });
    _mapObject.addOverlay(layerManager.marker);
    $("#closeAlertInfo").click(function () {
        _mapObject.removeOverlay(layerManager.marker);
        layerManager.marker = null;
    });

    $("#layersel").change(function () {
        var layerId = $(this).val();
        for (var i = 0; i < NULayers.length; i++) {
            if (NULayers[i].layerId == layerId) {
                var mapUrl = NULayers[i].mapUrl;
                var maptype = ljfBase.getServiceTypeByUrl(mapUrl);
                var layers = NULayers[i].layers;
                var bbox = (coordinate[0] - 0.0001) + "," + (coordinate[1] - 0.0001) + "," + (coordinate[0] + 0.0001) + "," + (coordinate[1] + 0.0001);
                if (maptype == "MapServer") {
                    mapUrl += "/" + layers + "/query";
                    var data = {
                        f: "json",
                        outFields: "*",
                        where: "1=1",
                        returnGeometry: true,
                        esriGeometryEnvelope: "",
                        geometry: bbox,
                    }
                } else if (maptype == "GeoServer") {
                    var data = {
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: bbox,
                        SERVICE: "WMS",
                        INFO_FORMAT: "text/plain",
                        QUERY_LAYERS: layers,
                        FEATURE_COUNT: 50,
                        Layers: layers,
                        WIDTH: 579,
                        HEIGHT: 330,
                        format: "image/png",
                        styles: "",
                        srs: "EPSG:4326",
                        version: "1.1.1",
                        x: 315,
                        y: 147,
                    }
                } else if (maptype == "WMS") {
                    var data = {
                        version: "1.1.1",
                        request: "GetFeatureInfo",
                        layers: layers,
                        styles: "default",
                        SRS: "EPSG:4326",
                        bbox: bbox,
                        width: 1044,
                        height: 906,
                        format: "text/html",
                        X: 500,
                        Y: 400,
                        query_layers: layers
                    }
                } else if (maptype == "WMTS") {

                }
                $.ajax({
                    type: 'get',
                    url: mapUrl,
                    data: data,
                    success: function (xml) {
                        var str = "";
                        if (maptype == "MapServer") {
                            var resjosn = $.parseJSON(xml);
                            var resjosn = $.parseJSON(xml);
                            if (resjosn.features.length > 0) {
                                var feature = resjosn.features[0];
                                for (var i in feature["attributes"]) {
                                    str += "<tr><td>" + i + "</td><td>" + feature["attributes"][i] + "</td></tr>";
                                }
                            }
                        } else if (maptype == "GeoServer") {
                            var files = xml.trim().split('\n');
                            for (var i = 0; i < files.length; i++) {
                                var filedname = files[i].split('=')[0];
                                var value = files[i].split('=')[1];
                                if (value && filedname.trim() != "the_geom") {
                                    str += "<tr><td>" + filedname + "</td><td>" + value + "</td></tr>";
                                }
                            }
                        } else if (maptype == "WMS") {
                            var resjson = xml2json(xml);
                            if (resjson["FIELDS"]) {
                                for (var i in resjson["FIELDS"]) {
                                    str += "<tr><td>" + i.replace("@", "") + "</td><td>" + resjson["FIELDS"][i] + "</td></tr>";
                                }
                            }
                        }
                        if (str == "") {
                            str = "<tr><td>没有查询到属性信息！</td></tr>"
                        }
                        $("#layerinfotable").html(str);
                    },
                    error: function () {
                        parent.alert('执行失败');
                    }
                })
            }
        }
    }).change();
}

