var _vecLayer;
var _vecLabelLayer;
var _imgLayer;
var _imgLabelLayer;
var basemap1,basemap2,basemap3,basemap4;//交通底图
var gcsl;//故城矢量
var _resolutions;
var _matrixIds;
var _defaultCenter = [115.87034540802743,37.72967179180566];//115.960,37.346//106.2393,38.434
var _defaultZoom = 9;
var _mapView;
var _activeTool = "map.pan";
var _mapObject;
var _wktParser = new ol.format.WKT();
var _predefinedColors = ["#f62962", "#e8801f", "#fc674f", "#0574fc", "#aab630", "#5bbc49", "#a6f87c", "#5cd5c4", "#b62df5", "#3ebda0", "#e929d4", "#93c30f", "#dd4b94", "#6a7e01", "#3bfaeb"];
var _myPousePositionControl;
var gcsllable;//故城矢量标注
var gcyx;//故城影像
var gcyxlable;//故城影像标注
var hssl;//衡水矢量
var hsyx;//衡水影像
var hsyxlable;//衡水影像标注
var baseWATER0,baseWATER1,baseWATER2,baseWATER3,baseWATER4,baseWATER5,baseWATER6,baseWATER7,baseWATER8;//引江水线路
var baseJBNT0;//基本农田
var baseQYJLS0;//千亿斤粮食
var baseNFBGBZ0;//农发办高标准
var baseGTGBZ0;//全市国土高标准
var baseXCZ0;//小曹庄机井
var baseXZQ0,baseXZQ1,baseXZQ2,baseXZQ3;//行政区
var source1,vector1;
var sourceXZQ,vectorXZQ;
var sourceQX,vectorQX,styleQX;
var _source,_vector;
var hsbj;
styleQX = {};

function initMousePositionControl() {
    _myPousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(5),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('map'),//element
        undefinedHTML: '&nbsp;'
    });
    _mapObject.addControl(_myPousePositionControl);
}

function initMapOptions()
{
    //EPSG:3857（官方） = Web Mercator (+ wgs84?) = 900913（非官方，但是使用较多）
    //EPSG:4326 = wgs84
    var size = 1.40625;
    var mZoom = 21;
    _resolutions = new Array(mZoom);
    _matrixIds = new Array(mZoom);
    for (var z = 0; z < mZoom; z++) {
        _resolutions[z] = size / Math.pow(2, z);
        _matrixIds[z] = z;
    }
}
function initTileLayers() {
	hsbj = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':''},
                url:esrilayerUrl.HSBJ,
                projection:"EPSG:4326"

            }),
//          name:""
    });
    _vecLayer = new ol.layer.Tile({
        name: "全球1:100万矢量图",
        visible: true,
        source: new ol.source.WMTS({
//          crossOrigin: 'anonymous',
            url: "http://t{0-2}.tianditu.com/vec_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
            layer: "vec",
            format: "tiles",
            style: "default",
            matrixSet: "c",
            tileGrid: new ol.tilegrid.WMTS({
                origin: [-180, 90],
                resolutions: _resolutions,
                matrixIds: _matrixIds,
            }),
            projection: "EPSG:4326",
        })
    });

    _vecLabelLayer = new ol.layer.Tile({
        name: "全球矢量图标注",
        visible: true,
        source: new ol.source.WMTS({
//          crossOrigin: 'anonymous',
            url: "http://t{0-2}.tianditu.com/cva_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
            layer: "cva",
            format: "tiles",
            style: "default",
            matrixSet: "c",
            tileGrid: new ol.tilegrid.WMTS({
                origin: [-180, 90],
                resolutions: _resolutions,
                matrixIds: _matrixIds,
            }),
            projection: "EPSG:4326",
        })
    });

    _imgLayer = new ol.layer.Tile({
        name: "全球1:100万影像图",
        visible: false,
        source: new ol.source.WMTS({
//          crossOrigin: 'anonymous',
            url: "http://t{0-2}.tianditu.com/img_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
            layer: "img",
            format: "tiles",
            style: "default",
            matrixSet: "c",
            tileGrid: new ol.tilegrid.WMTS({
                origin: [-180, 90],
                resolutions: _resolutions,
                matrixIds: _matrixIds,
            }),
            projection: "EPSG:4326",
        })
    });

    _imgLabelLayer = new ol.layer.Tile({
        name: "全球影像图标注",
        visible: false,
        source: new ol.source.WMTS({
//          crossOrigin: 'anonymous',
            url: "http://t{0-2}.tianditu.com/cia_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
            layer: "cia",
            format: "tiles",
            style: "default",
            matrixSet: "c",
            tileGrid: new ol.tilegrid.WMTS({
                origin: [-180, 90],
                resolutions: _resolutions,
                matrixIds: _matrixIds,
            }),
            projection: "EPSG:4326",
        })
    });

    basemap1 = new ol.layer.Tile({  //交通底图
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'3'},
                projection:"EPSG:4326",
                url:esrilayerUrl.basemap
            })
    });
    basemap2 = new ol.layer.Tile({  //交通底图
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'2'},
                projection:"EPSG:4326",
                url:esrilayerUrl.basemap
            })
    });
    basemap3 = new ol.layer.Tile({  //交通底图
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'1'},
                projection:"EPSG:4326",
                url:esrilayerUrl.basemap
            })
    });
    basemap4 = new ol.layer.Tile({  //交通底图
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
                url:esrilayerUrl.basemap
            })
    });


    gcsl = new ol.layer.Tile({  //故城矢量18-20
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
                url:"http://124.205.115.26:6080/arcgis/services/WY/WYVector/MapServer/WMSServer"
            })
    });
    gcsllable = new ol.layer.Tile({  //故城矢量标注18-20
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
                url:"http://124.205.115.26:6080/arcgis/services/WY/WYVectorNote/MapServer/WMSServer"
            })
    });
    gcyx = new ol.layer.Tile({  //故城影像18-20
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
//              url:"http://124.205.115.26:6080/arcgis/services/WY/WYRaster/MapServer/WMSServer"
                url:"http://124.205.115.26:6080/arcgis/services/WY/WYRaster1000/MapServer/WMSServer"


            })
    });
    gcyxlable = new ol.layer.Tile({  //故城影像标注18-20
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
                url:"http://124.205.115.26:6080/arcgis/services/WY/WYRasterNote/MapServer/WMSServer"
            })
    });


    hssl = new ol.layer.Tile({  //衡水矢量8-17
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0'},
                projection:"EPSG:4326",
                url:"http://124.205.115.26:6080/arcgis/services/HS/HSVector/MapServer/WMSServer"
            })
    });
    hsyx = new ol.layer.Tile({  //衡水影像8-17
//          source:new ol.source.TileWMS({
//              params:{'LAYERS':'0'},
//              projection:"EPSG:4326",
//              url:"http://124.205.115.26:6080/arcgis/services/HS/HSRaster/MapServer/WMSServer"
//          })
            source:new ol.source.XYZ({
//          	crossOrigin: 'anonymous',
            	params:{'LAYERS':'0'},
	            url:'http://124.205.115.26:6080/arcgis/rest/services/HS/HSRaster/MapServer' + '/tile/{z}/{y}/{x}',
	            projection:"EPSG:4326"
	        })

    });
    hsyxlable = new ol.layer.Tile({  //衡水影像标注8-17
//          source:new ol.source.TileWMS({
//              params:{'LAYERS':'0'},
//              projection:"EPSG:4326",
//              url:"http://124.205.115.26:6080/arcgis/services/HS/HSRasterNote/MapServer/WMSServer"
//          })
            source:new ol.source.XYZ({
//          	crossOrigin: 'anonymous',
            	params:{'LAYERS':'0'},
	            url:'http://124.205.115.26:6080/arcgis/rest/services/HS/HSRasterNote/MapServer' + '/tile/{z}/{y}/{x}',
	            projection:"EPSG:4326"
	        })
    });
    source1 = new ol.source.Vector({
	    features: []
	});
	vector1 = new ol.layer.Vector({
	    name: "监测点图层",
	    source: source1,
	    style: function(feature, resolution){
//	    	var color = feature.get("color");
//		    if (kkIsUNE(color)) {
//		        color = "#52A8D2";
//		    }
		    var color = "#4384DB";
		    var a = new ol.style.Style({
	            stroke: new ol.style.Stroke({
	                color: hexToRgba(color, 1),
	                width: 5
	            })
	        });
		    return a;
	    }
	});
	_source = new ol.source.Vector({
	    features: []
	});
	_vector = new ol.layer.Vector({//临时高亮图层
	    name: "高亮图层",
	    source: _source,
	    style: function(feature, resolution){
		    var color = "#4384DB";
		    var a = new ol.style.Style({
	            stroke: new ol.style.Stroke({
	                color: hexToRgba(color, 1),
	                width: 5
	            })
	        });
		    return a;
	    }
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
                color: 'rgba(255,200,0,1)',
                width: 10,
                //lineDash: [10, 10],
            }),
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255,165,0,1)',
                width: 3,
                lineDash: [6, 6]
            })
        }),
    ];
	vectorXZQ = new ol.layer.Vector({//临时高亮图层
	    name: "行政区范围",
	    source: sourceXZQ,
	    style: _districtRegionStyle

	});

	sourceQX = new ol.source.Vector({
	    features: []
	});

	vectorQX = new ol.layer.Vector({//临时高亮图层
	    name: "行政区范围",
	    source: sourceQX,
	    style: function(feature, resolution){
	    	var color = feature.get("color");
            if(!styleQX[color]){
            	var r=Math.floor(Math.random()*256);
		        var g=Math.floor(Math.random()*256);
		        var b=Math.floor(Math.random()*256);
	            var color = "rgba("+r+','+g+','+b+','+'0.8'+")";
	            feature.set("color",color);
            	styleQX[color] = [
			        new ol.style.Style({
			            fill: new ol.style.Fill({
			                color: color
			            }),
			        }),
			        new ol.style.Style({
			            stroke: new ol.style.Stroke({
			                color: 'rgba(255,200,0,1)',
			                width: 10,
			                //lineDash: [10, 10],
			            }),
			        }),
			        new ol.style.Style({
			            stroke: new ol.style.Stroke({
			                color: 'rgba(255,165,0,1)',
			                width: 3,
			                lineDash: [6, 6]
			            })
			        }),
			    ];
            }


		    return styleQX[color];
	    }

	});


	//引江水线路
	baseWATER0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'10','name':'口门'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER1 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'7,9','name':'地表水厂（县）'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER2 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'6,8','name':'连村取水水厂'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER3 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'5','name':'衡水南水北调水厂以上输水管道'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER4 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'4','name':'2016_2018年水源置换已建成通水项目'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER5 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'3','name':'2016_2018年水源置换已建成未通水项目'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER6 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'2','name':'2016_2018年水源置换在建项目'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER7 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'1','name':'2019年拟建实施农村生活用水置换'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });
    baseWATER8 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'2020年规划实施农村生活用水置换'},
                url:esrilayerUrl.WATER,
                projection:"EPSG:4326"

            }),
            name:"引江水线路"
    });


    //基本农田
    baseJBNT0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'基本农田'},
                url:esrilayerUrl.JBNT,
                projection:"EPSG:4326"
             }),
             name:"基本农田"
    });

    //行政区
    baseXZQ0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28','name':'行政区'},
                url:esrilayerUrl.XZQ,
                projection:"EPSG:4326"

            })
    });

    //千亿斤粮食
    baseQYJLS0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'千亿斤粮食'},
                url:esrilayerUrl.QYJLS,
                projection:"EPSG:4326"

            })
    });

    //农发办高标准
    baseNFBGBZ0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'农发办高标准'},
                url:esrilayerUrl.NFBGBZ,
                projection:"EPSG:4326"

            })
    });

    //全市国土高标准
    baseGTGBZ0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'全市国土高标准'},
                url:esrilayerUrl.GTGBZ,
                projection:"EPSG:4326"

            })
    });

    //小曹庄机井
    baseXCZ0 = new ol.layer.Tile({
            source:new ol.source.TileWMS({
//          	crossOrigin: 'anonymous',
                params:{'LAYERS':'0','name':'小曹庄机井'},
                url:esrilayerUrl.XCZ,
                projection:"EPSG:4326"

            }),
            name:"小曹庄机井",

    });

}




