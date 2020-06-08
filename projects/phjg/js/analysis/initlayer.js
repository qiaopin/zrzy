var LDL;//绿地率
var sourceXZQ,vectorXZQ,sourceXZQ1,vectorXZQ1;
var source,vector,_source,_vector;
var baseCTJC0,baseCTJC1,baseCTJC2;//冲突检测
function initTileLayers(_mapObject){
    baseCTJC0 = new ol.layer.Tile({  
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'2','name':'二规差异斑块'},
                url:esrilayerUrl.CTJC,
                projection:"EPSG:4326"
                
            })
    });
    baseCTJC0.layertype = "CTJC";
    baseCTJC0.layername = "二规差异斑块";
    baseCTJC0.layerindex = "22";
    //1111111
    baseCTJC1 = new ol.layer.Tile({  
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'1','name':'土规'},
                url:esrilayerUrl.CTJC,
                projection:"EPSG:4326"
                
            })
    });
    baseCTJC1.layertype = "CTJC";
    baseCTJC1.layername = "土规";
    baseCTJC1.layerindex = "22";
    //2222222
    baseCTJC2 = new ol.layer.Tile({  
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'城规'},
                url:esrilayerUrl.CTJC,
                projection:"EPSG:4326"
                
            })
    });
    baseCTJC2.layertype = "CTJC";
    baseCTJC2.layername = "城规";
    baseCTJC2.layerindex = "22";
    //3333333
   
    _mapObject.addLayer(baseCTJC0);
    _mapObject.addLayer(baseCTJC1);
    _mapObject.addLayer(baseCTJC2);
    
    baseCTJC0.setVisible(false);
	baseCTJC1.setVisible(false);
	baseCTJC2.setVisible(false);
	
    source = new ol.source.Vector();
	vector = new ol.layer.Vector({
		source: source,
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
	_source = new ol.source.Vector({
	    features: []
	});
	_vector = new ol.layer.Vector({//临时高亮图层
	    name: "高亮图层",
	    source: _source,
	    style: function(feature, resolution){
		    var a = new ol.style.Style({
	            stroke: new ol.style.Stroke({
	                color: "#4384DB",
	                width: 5
	            })
	        });
		    return a;
	    }
	});
	
	_mapObject.addLayer(_vector);
	_mapObject.addLayer(vector);
	
	
	LDL = new ol.layer.Tile({
        source: new ol.source.TileArcGISRest({
            params: {'LAYERS': 'show:0'},
            projection: "EPSG:4326",
            url: esrilayerUrl.LDL
        })
    });
    sourceXZQ = new ol.source.Vector({
	    features: []
	});
	var _districtRegionStyle = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,165,0,0.1)'
            }),
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(110, 110, 110,1)',
                width: 1,
                //lineDash: [10, 10],
            }),
        }),
    ];
	vectorXZQ = new ol.layer.Vector({//临时高亮图层
	    name: "LDL",
	    source: sourceXZQ,
	    style: _districtRegionStyle

	});
	
	
	sourceXZQ1 = new ol.source.Vector({
	    features: []
	});
	vectorXZQ1 = new ol.layer.Vector({//临时高亮图层
	    name: "高亮图层",
	    source: sourceXZQ1,
	    style: function(feature, resolution){
		    return new ol.style.Style({
	            stroke: new ol.style.Stroke({
	                color: 'rgba(212, 181, 12,1)',
	                width: 1
	            }),
	            fill: new ol.style.Fill({
	                color: 'rgba(212, 181, 12,1)',
	            }),
	            
	        });
	    }
	});
	_mapObject.addLayer(vectorXZQ);
	_mapObject.addLayer(LDL);
	_mapObject.addLayer(vectorXZQ1);
	
	vectorXZQ.setVisible(false);
	LDL.setVisible(false);
}

function getStateByFeature(feature) {
    var state = 0;
    if (feature.get("PHOTOS")) {
        if (feature.get("AUDIT") == -1) {
            state = 3;//已调查未提交
        } else {
            state = 4;//已经提交
        }
    } else {
        if (!feature.get("RY")) {
            state = 1;//未分配
        } else {
            state = 2;//已分配未调查
        }
    }
    return state;
}

function setStylebyState(state) {
    var resColorRgb;
    var colorRedRgb = "255, 0, 0";
    var colorGreenRgb = "26,250,41";
    var colorYellowRgb = "244, 234, 42";
    var colorDarkBlueRgb = "19, 34, 122";
    var colorBlueRgb = "18, 150, 219";
    var colorPinkRgb = "159, 0, 154";
    switch (state) {
        case 1://未分配
            resColorRgb = colorRedRgb;
            break;
        case 2:
            resColorRgb = colorGreenRgb;
            break;
        case 3:
            resColorRgb = colorPinkRgb;
            break;
        case 4:
            resColorRgb = colorBlueRgb;
            break;
    }
    return resColorRgb;
}

function initdlfx() {
    sourceClues = new ol.source.Vector();
    vectorClues = new ol.layer.Vector({
        source: sourceClues,
        style: function (feature, resolution) {
            //未分配红色 已分配绿色 未上传照片黄色  已调查蓝色
            var BH = feature.get("BH");
            var resColorRgb = setStylebyState(getStateByFeature(feature));
            var fillColor = "rgba(" + resColorRgb + ",0.5)";
            var strokeColor = "rgb(" + resColorRgb + ")";
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
                    }),
                }),
                text: new ol.style.Text({
                    textAlign: 'center', //位置
                    textBaseline: 'middle', //基准线
                    font: 'normal 14px 微软雅黑',  //文字样式
                    text: BH,  //文本内容
                    fill: new ol.style.Fill({color: '#aa3300'}), //文本填充样式（即文字颜色）
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2})
                })
            });
        },
        zIndex: 3,
        name: "采集的面信息"
    });
    _mapObject.addLayer(vectorClues);
    // GetPolygonClues("/GetPolygonClues", {});//获取采集的面信息
}

function GetPolygonClues(resjosn) {
    var str1 = "<option value='全部'>全部</option>";
    var features = [];
    sourceClues.clear();
    for (var i = 0; i < resjosn.length; i++) {
        var BH = resjosn[i].BH;
        if(resjosn[i].ZP){
            resjosn[i]["PHOTOS"] = resjosn[i].ZP;
        }
        str1 += "<option value='" + BH + "'>" + BH + "</option>";
        var ZB = resjosn[i].ZB;
        if (ZB) {
            var feature = maptool._wktParser.readFeature(ZB);
            $.each(resjosn[i], function (s, k) {
                feature.set(s, k);
            });
            features.push(feature);
        }
    }
    sourceClues.addFeatures(features);
    $("#DLBH").html(str1);
    layuiform.render('select');
}
