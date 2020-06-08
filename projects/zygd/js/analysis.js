var detailedObj = {};
var extent, flatCoordinates, points1, area1;
var geometry;
var NYDlist = ["011","012","013","021","022","023","031","032","033","041","042","104","114","117","122","123"];
var JSYDlist = ["051","052","053","054","061","062","063","071","072","081","082","083","084","085","086","087","088","091","092","093","094",
"095","101","102","103","105","106","107","113","118","121","201","202","203","204","205"];
var WLYDlist = ["111","112","115","116","119","043","124","125","126","127"];
						
function query(scope) {
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

	DBwftb();
	DBcgtb();
	DBtgtb();
};

function DBwftb(extent) {
	var _mapView = _mapObject.getView();
	_mapView.fit(extent,_mapObject.getSize());
	//对比违法地类图斑建设用地非建设用地占有率
	var geometry = extent[0] + "," + extent[1] + "," + extent[2] + "," + extent[3];
	var queryurl_tb = querylayerUrl.WYDLTB + "/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	queryurl_tb += geometry;
	$(".detaileddiv").addClass('hide');
	$("#tbody_tb").html("");
	$("#tb_detailed").html("");
	$("#tbody_summarizing").html("");
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
		success: function(xml) {
			var resjosn = $.parseJSON(xml);
			if(resjosn.features.length < 1) {
				layer.close(layer.loadIndex);
				return;
			}
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
			var areaTotal = 0;

			if(resjosn.features) {
				for(var i = 0; i < resjosn.features.length; i++) {
					var area = getZYLarea(resjosn.features[i]);
					if(area > 0) {
						var obj = {
							CTMJ: area,
							TBMJ: resjosn.features[i].attributes.TBMJ,
							DLMC: resjosn.features[i].attributes.DLMC,
							QSDWMC: resjosn.features[i].attributes.QSDWMC,
							RINGS: resjosn.features[i].geometry.rings
						}
						var isNYD = false;
						var isJSYD = false;
						var isWLYD = false;
						var DLBM = resjosn.features[i].attributes.DLBM;
						//先按大类筛选一下
						
						isNYD = getNYD(DLBM);
						if(!isNYD){
							isJSYD = getJSYD(DLBM);
						}
                        
                        if(!isJSYD){
							isWLYD = getWLYD(DLBM);
						}
                        
                        
						if(isNYD) {
							cylx01.detailed.push(obj);
							cylx01.length++;
							cylx01.areaTotal += area;
						}
						
						if(isJSYD){
							cylx02.detailed.push(obj);
							cylx02.length++;
							cylx02.areaTotal += area;
						}
						
						if(isWLYD){
							cylx03.detailed.push(obj);
							cylx03.length++;
							cylx03.areaTotal += area;
						}
					}
				}
				var _areaTotal = cylx01.areaTotal + cylx02.areaTotal + cylx03.areaTotal;
				if(_areaTotal==0){
					var _cylx01 = 0;
	                var _cylx02 = 0;
	                var _cylx03 = 0;
	                var _cylx04 = 0;
				}else{
					var _cylx01 = (cylx01.areaTotal * 100 / _areaTotal).toFixed(2);
	                var _cylx02 = (cylx02.areaTotal * 100 / _areaTotal).toFixed(2);
	                var _cylx03 = (cylx03.areaTotal * 100 / _areaTotal).toFixed(2);
	                var _cylx04 = ((cylx03.areaTotal+cylx01.areaTotal) * 100 / _areaTotal).toFixed(2);
				}
                
                
                
//				str += "<tr><td colspan='4' style='color:#333;'>占地分析：</td><tr>";
				str += "<tr><td>农用地(" + cylx01.length + "):</td><td>" +
					cylx01.areaTotal.toFixed(2) + "</td><td>" +
					_cylx01 + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('tb_nyd','农用地')>详情</a></td></tr>";
				str += "<tr><td>建设用地(" + cylx02.length + "):</td><td>" +
					cylx02.areaTotal.toFixed(2) + "</td><td>" +
					_cylx02 + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('tb_jsyd','建设用地')>详情</a></td></tr>";
					
				str += "<tr><td>未利用地(" + cylx03.length + "):</td><td>" +
					cylx03.areaTotal.toFixed(2) + "</td><td>" +
					_cylx03 + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('tb_wlyd','未利用地')>详情</a></td></tr>";
					
				str += "<tr><td colspan='4'>违法比例:"+_cylx04+"</td></tr>";	
					
					
			}
			detailedObj["tb_nyd"] = cylx01;
			detailedObj["tb_jsyd"] = cylx02;
			detailedObj["tb_wlyd"] = cylx03;
			$("#tbody_tb").html(str);
			
			layer.close(layer.loadIndex);
		},
		error: function(res) {
			layer.alert('访问服务器失败!');
		}
	});
}

function DBcgtb() {
	//对比城规图斑
	var queryurl_cg = esrilayerUrl.CTJC + "/2/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	queryurl_cg += geometry;
	$.ajax({
		type: "post", //请求方式
		url: queryurl_cg,
		data: {}, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: true,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			var resjosn = $.parseJSON(xml);
			if(resjosn.features.length < 1) {
				layer.close(layer.loadIndex);
				return;
			}
			var str = "";
			var length = 0;
			var cylx01 = { //建设用地
				length: 0,
				areaTotal: 0,
				detailed: []
			};
			var cylx02 = { //非建设用地
				length: 0,
				areaTotal: 0,
				detailed: []
			};
			var areaTotal = 0;

			if(resjosn.features) {
				for(var i = 0; i < resjosn.features.length; i++) {
					var area = getZYLarea(resjosn.features[i]);
					if(area > 0) {
						var obj = {
							CTMJ: area,
							TBMJ: resjosn.features[i].attributes.DKMJ,
							DLMC: resjosn.features[i].attributes.TDSYXZMC,
							RINGS: resjosn.features[i].geometry.rings
						}

						var isJSYD = false;
						var ZL = resjosn.features[i].attributes.ZL;
						var firstCode = ZL.substring(0, 1); //ZL首字母
						if(firstCode == "E") {
							isJSYD = false;
						} else {
							isJSYD = true;
						}

						if(isJSYD) {
							cylx01.detailed.push(obj);
							cylx01.length++;
							cylx01.areaTotal += area;
						} else {
							cylx02.detailed.push(obj);
							cylx02.length++;
							cylx02.areaTotal += area;
						}
					}
				}
				var _areaTotal = cylx01.areaTotal + cylx02.areaTotal;

				str += "<tr><td colspan='4' style='color:#333;'>占用城规图斑：</td><tr>";
				str += "<tr><td>建设用地(" + cylx01.length + ")：</td><td>" +
					cylx01.areaTotal.toFixed(2) + "</td><td>" +
					(cylx01.areaTotal * 100 / _areaTotal).toFixed(2) + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('cg_jsyd','建设用地')>详情</a></td></tr>";
				str += "<tr><td>非建设用地(" + cylx02.length + ")：</td><td>" +
					cylx02.areaTotal.toFixed(2) + "</td><td>" +
					(cylx02.areaTotal * 100 / _areaTotal).toFixed(2) + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('cg_fjsyd','非建设用地')>详情</a></td></tr>";
			}
			detailedObj["cg_jsyd"] = cylx01;
			detailedObj["cg_fjsyd"] = cylx02;
			$("#tbody_cg").html(str);
			layer.close(layer.loadIndex);
		},
		error: function(res) {
			layer.alert('访问服务器失败!');
		}
	});
}

function DBtgtb() {
	//对比土规图斑
	var queryurl_tg = esrilayerUrl.CTJC + "/1/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	queryurl_tg += geometry;
	$.ajax({
		type: "post", //请求方式
		url: queryurl_tg,
		data: {}, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: true,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			var resjosn = $.parseJSON(xml);
			if(resjosn.features.length < 1) {
				layer.close(layer.loadIndex);
				return;
			}
			var str = "";
			var length = 0;
			var cylx01 = { //建设用地
				length: 0,
				areaTotal: 0,
				detailed: []
			};
			var cylx02 = { //非建设用地
				length: 0,
				areaTotal: 0,
				detailed: []
			};
			var areaTotal = 0;

			if(resjosn.features) {
				for(var i = 0; i < resjosn.features.length; i++) {

					var area = getZYLarea(resjosn.features[i]);
					if(area > 0) {
						var obj = {
							CTMJ: area,
							TBMJ: resjosn.features[i].attributes.mpArea,
							DLMC: resjosn.features[i].attributes.GHDLMC,
							RINGS: resjosn.features[i].geometry.rings
						}

						var isJSYD = false;
						var JSYDTB = resjosn.features[i].attributes.JSYDTB;
						if(JSYDTB == "0") {
							isJSYD = true;
						} else {
							isJSYD = false;
						}

						if(isJSYD) {
							cylx01.detailed.push(obj);
							cylx01.length++;
							cylx01.areaTotal += area;
						} else {
							cylx02.detailed.push(obj);
							cylx02.length++;
							cylx02.areaTotal += area;
						}
					}

				}
				var _areaTotal = cylx01.areaTotal + cylx02.areaTotal;

				str += "<tr><td colspan='4' style='color:#333;'>占用土规图斑：</td><tr>";
				str += "<tr><td>建设用地(" + cylx01.length + ")：</td><td>" +
					cylx01.areaTotal.toFixed(2) + "</td><td>" +
					(cylx01.areaTotal * 100 / _areaTotal).toFixed(2) + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('tg_jsyd','建设用地')>详情</a></td></tr>";
				str += "<tr><td>非建设用地(" + cylx02.length + ")：</td><td>" +
					cylx02.areaTotal.toFixed(2) + "</td><td>" +
					(cylx02.areaTotal * 100 / _areaTotal).toFixed(2) + "%</td>" +
					"<td><a class='info' href='javascript:;' onclick=detailed('tg_fjsyd','非建设用地')>详情</a></td></tr>";
			}
			detailedObj["tg_jsyd"] = cylx01;
			detailedObj["tg_fjsyd"] = cylx02;
			$("#tbody_tg").html(str);
			layer.close(layer.loadIndex);
		},
		error: function(res) {
			layer.alert('访问服务器失败!');
		}
	});
}

//获取冲突面积
function getZYLarea(feature) {
	var area = 0;
	for(var m = 0; m < feature.geometry.rings.length; m++) {
		var pointArr = feature.geometry.rings[m];
		var points = [];
		for(var j = 0; j < pointArr.length; j++) {
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
		if(m == 0) {
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
	if(detailed.length == 0) {
		$("#" + index.split("_")[0] + "_detailed").html("");
	} else {
		
		var str = "";
		for(var i = 0; i < detailed.length; i++) {
			str += "<tr onclick=lightPolygon('" + i + "','" + index + "')><td style='width:40px;'>" + (i + 1) + "</td>";
			str += "<td>" + detailed[i].CTMJ.toFixed(2) + "</td>";
			str += "<td>" + detailed[i].TBMJ.toFixed(2) + "</td>";
			str += "<td>" + detailed[i].DLMC + "</td></tr>";
		}
		$("#" + index.split("_")[0] + "_detailed").html(str);
	}
    
    $(".detaileddiv").addClass('hide');
    $(".detaileddiv").eq(0).removeClass('hide');
    
}

//双击高亮
function lightPolygon(i, index) {
	if(_vector) {
		_mapObject.removeLayer(_vector);
	}
	var RINGS = detailedObj[index].detailed[i].RINGS[0];
	var Coordinatesstr = "POLYGON((";
	for(var i = 0; i < RINGS.length; i++) {
		if(i != 0) {
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
		style: function(feature, resolution) {
			var a = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: "#4384DB",
					width: 5
				})
			});
			return a;
		}
	});
	var feature = maptool._wktParser.readFeature(Coordinatesstr);
	_source.addFeature(feature);
	_mapView.fit(_source.getExtent(), _mapObject.getSize());
	_mapObject.addLayer(_vector);
	_vector.setVisible(true);
}


function getNYD(dlbh){
	for(var i = 0; i < NYDlist.length; i++) {
	    if(NYDlist[i].indexOf(dlbh)>-1){
	   	  return true;
	    }
	}
	return false;
}

function getJSYD(dlbh){
	for(var i = 0; i < JSYDlist.length; i++) {
	    if(JSYDlist[i].indexOf(dlbh)>-1){
	   	  return true;
	    }
	}
	return false;
}

function getWLYD(dlbh){
	for(var i = 0; i < WLYDlist.length; i++) {
	    if(WLYDlist[i].indexOf(dlbh)>-1){
	   	   return true;
	    }
	}
	return false;
}


function showFeatureInfo(feature) {
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
        var jjzp = feature.get('PHOTOS').split(",");
        str += "<tr><td>照片</td><td><a href='javascript:;' onclick=lookimg('" + feature.get('PHOTOS') + "','" + feature.get('GUID') + "','照片')>查看图片(" + (jjzp.length) + "张)</a></td></tr>";
    }
    str += "</table>";
    str += "</div>";
    str += "<i id='closeAlertInfo' class='layui-icon layui-icon-close'></i>";
    str += "</div>";
    document.getElementById("alertinfodiv").innerHTML = str;
    if (marker) {
        _mapObject.removeOverlay(marker);
    }
    var posi = getPointsCenter(feature.get("POINTS"));
    marker = new ol.Overlay({
        element: document.getElementById('alertinfo'),
        position: posi,
        positioning: 'left-left',
        offset: [-35, 35]
    });
    _mapObject.addOverlay(marker);
    $("#closeAlertInfo").click(function () {
        _mapObject.removeOverlay(marker);
    });
    $(".niceScroll").niceScroll({cursorborder: "", cursorcolor: "#214868", boxzoom: false});
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
        area: ['450px', '70%'],
        //			  offset: 'rb', //右下角弹出
        anim: 2,//弹出动画
        shade: 0.2,//遮盖层
        content: ['images1.html', 'no'], //这里content是一个普通的String
        end: function () {


        }
    });
}