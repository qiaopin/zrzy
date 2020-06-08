var util = {
	baseMapArr: [{ //天地图底图
		"MAPURL": "http://t0.tianditu.com/cva_c/wmts?tk=0247d3e7f770fa1ee61333536cf67aca",
		"SERVICETYPE": "WMTS",
		"SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
		"layerId": "01",
		"MAPNAME": "矢量注记",
		"visible": false,
		"TYPE": "sl",
		"isBaseMap": true
	}, {
		"MAPURL": "http://t0.tianditu.com/vec_c/wmts?tk=0247d3e7f770fa1ee61333536cf67aca",
		"SERVICETYPE": "WMTS",
		"SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
		"layerId": "02",
		"MAPNAME": "矢量底图",
		"TYPE": "sl",
		"visible": false,
		"isBaseMap": true
	}, {
		"TYPE": "影像",
		"MAPURL": "http://t{0-2}.tianditu.com/cia_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
		"SERVICETYPE": "WMTS",
		"SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
		"layerId": "11",
		"MAPNAME": "影像注记",
		"TYPE": "yx",
		"visible": false,
		"isBaseMap": true
	}, {
		"TYPE": "影像",
		"MAPURL": "http://t{0-2}.tianditu.com/img_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
		"SERVICETYPE": "WMTS",
		"SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
		"layerId": "12",
		"MAPNAME": "影像底图",
		"TYPE": "yx",
		"visible": false,
		"isBaseMap": true
	}],
	//显示图斑
	showTuban: function(type) {
		var layerParam;
		if (type == "cg") {
			layerParam = {
				mapUrl: "http://124.205.115.26:6080/arcgis/rest/services/WY/CTJC/MapServer",
				layers: "2",
				layerId: "cg",
				zIndex: 2,
				layerName: "城规图斑"
			}
		} else if (type == "tg") {
			layerParam = {
				mapUrl: "http://124.205.115.26:6080/arcgis/rest/services/WY/CTJC/MapServer",
				layers: "1",
				layerId: "tg",
				zIndex: 2,
				layerName: "土规图斑"
			}
		} else if (type == "wydltb") {
			layerParam = {
				mapUrl: "http://124.205.115.26:6080/arcgis/rest/services/WY/WYDLTB/MapServer",
				layerId: "wydltb",
				zIndex: 2,
				layerName: "违法地类图斑"
			}
		} else if (type == "TDLY1302072018") { //唐山市 丰南县地类图斑
			layerParam = {
				mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/DLTB/TDLY1302072018/MapServer",
				layerId: "TDLY1302072018",
				zIndex: 2,
				layerName: "地类图斑"
			}
		} else if(type=="2018年土地利用现状"){
            layerParam = {
                mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/ZYSJ/DLTBED/MapServer",
                layerId: "2018年土地利用现状",
                zIndex: 2,
                layerName: "地类图斑"
            }
		}
		
		var nowlayer = layerManager.getLayerById(layerParam.layerId);
		if(nowlayer){
			layerManager.setVisible(layerParam.layerId, !nowlayer.visible);
		}else{
			layerManager.addLayer(layerParam);
		}
	},
	//切换矢量 影像底图
	changeBaseMap: function(type) {
		$.each(util.baseMapArr, function(i, v) {
			var layerId = v.layerId;
			layerManager.setVisible(layerId, (v.TYPE == type));
		})
	},
	showAllData: function(res) {
		if (pointsource) {
			pointsource.clear();
		}
		features = [];
		var resjosn = JSON.parse(res);
		for (var j = 0; j < resjosn.length; j++) {
			var SMC = resjosn[j].SMC;
			var XMC = resjosn[j].XMC;
			var XZQDM = resjosn[j].XZQDM;
			var BM = resjosn[j].BM;
			var RY = resjosn[j].RY;
			var BH = resjosn[j].BH;
			var BZ = resjosn[j].BZ;
			var PHOTOS = resjosn[j].ZP;
			var SDXZ = resjosn[j].SDXZ; //实地现状
			var YDDW = resjosn[j].YDDW;
			var XMMC = resjosn[j].XMMC;
			var DLLX = resjosn[j].DLLX;
			var DLMC = resjosn[j].DLMC;
			var DLKD = resjosn[j].DLKD;
			var FXSJ = resjosn[j].FXSJ;
			var XCSJ = resjosn[j].XCSJ;
			var TBLX = resjosn[j].TBLX;
			var ZBLX = resjosn[j].ZBLX;
			var ZB = resjosn[j].ZB;
			var SFWF = resjosn[j].SFWF;
			var HSFS = resjosn[j].HSFS;
			var TDFL1 = resjosn[j].TDFL1;
			var TDFL2 = resjosn[j].TDFL2;
			var SFZYGDJF = resjosn[j].SFZYGDJF;
			var PHOTOINFO = resjosn[j].PHOTOINFO;
			var feature;
			if (resjosn[j].ZB) {
				feature = _wktParser.readFeature(ZB);
				if (feature) {
					feature.set("SMC", SMC);
					feature.set("XMC", XMC);
					feature.set("XZQDM", XZQDM);
					feature.set("BM", BM);
					feature.set("RY", RY);
					feature.set("BH", BH);
					feature.set("TYPE", "polygon");
					feature.set("BZ", BZ);
					feature.set("POINTS", ZB);
					feature.set("PHOTOS", PHOTOS);
					feature.set("SDXZ", SDXZ);
					feature.set("YDDW", YDDW);
					feature.set("XMMC", XMMC);
					feature.set("DLLX", DLLX);
					feature.set("DLMC", DLMC);
					feature.set("DLKD", DLKD);
					feature.set("TBLX", TBLX);
					feature.set("ZBLX", ZBLX);
					feature.set("FXSJ", FXSJ);
					feature.set("XCSJ", XCSJ);
					feature.set("HSFS", HSFS);
					feature.set("SFWF", SFWF);
					feature.set("TDFL1", TDFL1);
					feature.set("TDFL2", TDFL2);
					feature.set("PHOTOINFO", PHOTOINFO);
					feature.set("SFZYGDJF", SFZYGDJF);
					features.push(feature);
				}
			}
		}
		$(".taskNum").html(features.length);
		pointsource.addFeatures(features);
	},
	showAllMap: function() { //全图显示违法图层
		if (pointsource.getFeatures().length > 0) {
			var extent = pointsource.getExtent();
			util.setSizeByExtent(extent);
		}
	},
	//根据显示范围设置比例尺
	setSizeByExtent: function(extent) {
		_mapObject.getView().fit(extent, _mapObject.getSize());

		var room = _mapObject.getView().getZoom();
		if (room > 17) {
			layerManager.setZoom(17);
		}
	},
	setOpenlayersRotate: function(canRotate) {
		var pan;
		_mapObject.getInteractions().forEach(function(element, index, array) {
			if (element instanceof ol.interaction.PinchRotate) {
				pan = element
			};
		});
		pan.setActive(canRotate);
	},
	//设置地图拖动 禁止,取消禁止
	setOpenlayersDrag: function(canSize) {
		var pan;
		_mapObject.getInteractions().forEach(function(element, index, array) {
			if (element instanceof ol.interaction.DragPan) {
				pan = element
			};
		});
		pan.setActive(canSize);
	},

	//设置地图拖动 禁止,取消禁止
	setOpenlayersZoom: function(canZoom) {
		//禁止openlayers在手机上旋转
		var zoom = _mapObject.getView().getZoom();
		if (canZoom) {
			_mapObject.getView().setMinZoom(0);
			_mapObject.getView().setMaxZoom(20);
		} else {
			_mapObject.getView().setMinZoom(zoom);
			_mapObject.getView().setMaxZoom(zoom);
		}

	},

	initWFPolygon: function() {
		//初始化违法面图层
		pointsource = window.NUSourceLayer1.getSource();
		window.NUSourceLayer1.setStyle(function(feature, resolution) {
			var BH = feature.get('BH');
			var type = feature.get('TYPE');
			var style = null;
			if (type == "polygon") { //违法面
				var strokeColor = 'rgba(255,0,0,1)';
				var fillColor = 'rgba(255,0,0,0.3)';
				if (feature.get('PHOTOS')) { //已调查
					strokeColor = 'rgba(47,193,132,1)';
					fillColor = 'rgba(47,193,132,0.3)';
				}
				style = [
					new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: strokeColor,
							width: 2
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
		});
	},
	/**
	 * 根据俩点坐标计算俩点距离 单位米
	 * @param {Object} lon1
	 * @param {Object} lat1
	 * @param {Object} lon2
	 * @param {Object} lat2
	 */
	getDist: function(lon1, lat1, lon2, lat2) {
		var wgs84Sphere = new ol.Sphere(6378137);
		var dis = wgs84Sphere.haversineDistance([lon1, lat1], [lon2, lat2]);
		return dis;
	},
	/**
	 * 获取一个面的中心点
	 * @param {Object} feature
	 */
	getFeatureCenter: function(feature) {
		var extent = ol.extent.boundingExtent(feature.getGeometry().getCoordinates()[0]); //获取一个坐标数组的边界，格式为[minx,miny,maxx,maxy]
		var center = ol.extent.getCenter(extent);
		return center;
	},
	/**
	 * 获取当前时间
	 */
	getNowTime: function() {
		function getNow(s) {
			return s < 10 ? '0' + s : s;
		}

		var myDate = new Date();
		var year = myDate.getFullYear(); //获取当前年
		var month = myDate.getMonth() + 1; //获取当前月
		var date = myDate.getDate(); //获取当前日
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds();
		var now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
		return now;
	},
	getNowHour: function() {
		function getNow(s) {
			return s < 10 ? '0' + s : s;
		}

		var myDate = new Date();
		var year = myDate.getFullYear(); //获取当前年
		var month = myDate.getMonth() + 1; //获取当前月
		var date = myDate.getDate(); //获取当前日
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds();

		var now = year + "" + getNow(month) + "" + getNow(date) + "" + getNow(h);
		return now;
	},
	getPreHour: function() {
		function getNow(s) {
			return s < 10 ? '0' + s : s;
		}
		var now = new Date();
		pre = new Date(now.getTime() - 1000 * 60 * 60);

		var year = pre.getFullYear(); //获取当前年
		var month = pre.getMonth() + 1; //获取当前月
		var date = pre.getDate(); //获取当前日
		var h = pre.getHours(); //获取当前小时数(0-23)

		var preH = year + "" + getNow(month) + "" + getNow(date) + "" + getNow(h);
		return preH;
	},
	getNowDate: function() {
		function getNow(s) {
			return s < 10 ? '0' + s : s;
		}

		var myDate = new Date();
		var year = myDate.getFullYear(); //获取当前年
		var month = myDate.getMonth() + 1; //获取当前月
		var date = myDate.getDate(); //获取当前日
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds();
		var now = year + '-' + getNow(month) + "-" + getNow(date);
		return now;
	},
	connectSocket: function() {
		//建立socket连接 准备接听通话请求
		if (io) {
			var socket = io.connect('http://sjz.zcxy.xyz:3000');
			socket.on("fromPc", function(msg) {
				console.log(msg);
				if (msg.trim() == (userInfo.GZDW + "," + userInfo.USERNAME)) {
					var muivideo = mui.confirm('视频请求', '指挥中心发起了视频请求', ['挂断', '接听'], function(e) {
						if (e.index == 1) {
							socket.emit("phoneToPc", "ok"); //同意请求
							util.openTRTC();
							muivideo = false;
						} else {
							socket.emit("phoneToPc", "no"); //拒绝请求
							muivideo = false;
						}
					}, 'div')
				}
			})
		} else {
			setTimeout(function() {
				util.connectSocket();
			}, 2000)
		}
	},
	//打开视频通话
	openTRTC: function() {
		//获取当前Activity
		var userId = userInfo.USERNAME;
		var main = plus.android.runtimeMainActivity();
		//获取java辅助类
		var Helper = plus.android.importClass("com.tencent.liteav.jcfx.Hepler");
		//创建对象实例
		var mHelper = new Helper();
		//调用java中的跳转方法，并且传入当前activity实例
		mHelper.jump(main, userId);
	},

	// //下载
	// downloadTrtcApp: function() {
	// 	var options = {
	// 		method: "GET"
	// 	};
	// 	var apkname = "trtc.apk";

	// 	dtask = plus.downloader.createDownload(sessionStorage.baseUrl+"soft/jcfx/" + apkname,
	// 		options);
	// 	dtask.addEventListener("statechanged", function(task, status) {
	// 		switch (task.state) {
	// 			case 1: // 开始
	// 				mui.toast("开始下载...");
	// 				break;
	// 			case 2: // 已连接到服务器
	// 				// document.getElementById("new_grade_content").innerHTML = "正在下载";
	// 				mui.toast = "正在下载";
	// 				break;
	// 			case 3: // 已接收到数据
	// 				var downloadSize = (task.downloadedSize / 1024 / 1024).toFixed(2) + "M";
	// 				var totalSize = (task.totalSize / 1024 / 1024).toFixed(2) + "M";
	// 				var bfb = ((task.downloadedSize / task.totalSize) * 100).toFixed(2) + "%";
	// 				// document.getElementById("new_grade_content").innerHTML = "文件总大小" + totalSize + "(已下载：" + bfb + ")";
	// 				break;
	// 			case 4: // 下载完成
	// 				mui.toast("下载完成！")
	// 				console.log(task.totalSize)
	// 				plus.io.resolveLocalFileSystemURL(task.filename, function(entry) {
	// 					console.log(entry.toLocalURL()) //绝对地址
	// 					// 如果存在进行安装
	// 					if (entry.isFile) {
	// 						plus.runtime.install(entry.toLocalURL(), {}, function() {
	// 							// //alert("安装成功")
	// 							util.launchApp("com.tencent.trtc");
	// 						}, function() {
	// 							alert("安装失败")
	// 						});
	// 					} else {
	// 						// 不存在
	// 						alert("文件不存在")
	// 					}
	// 				});
	// 				console.log(task.filename) // 显示下载好的文件名称
	// 				break;
	// 		}
	// 	});
	// 	dtask.start();
	// }
}

//任务分配
function WorkManagerService(WebServerurl, data, async, success) {
	$.ajax({
		type: "post", //请求方式
		url: sessionStorage.baseUrl + "WorkManagerService.asmx" + WebServerurl,
		data: data, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: async,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			return success($(xml).text());
		},
		error: function(res) {
			return success("false");
		}
	});
}

//监测图斑
function JCTBStatisticsManagerService(WebServerurl, data, async, success) {
	$.ajax({
		type: "post", //请求方式
		url: sessionStorage.baseUrl + "JCTBStatisticsManagerService.asmx" + WebServerurl,
		data: data, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: async,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			return success($(xml).text());
		},
		error: function(res) {
			return success("false");
		}
	});
}


//用户管理2
function SurveyUserManagerService2(WebServerurl, data, async, success) {
	$.ajax({
		type: "post", //请求方式
		url: sessionStorage.baseUrl + "SurveyUserManagerService2.asmx" + WebServerurl,
		data: data, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: async,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			return success($(xml).text());
		},
		error: function(res) {
			//      	layer.alert('访问服务器失败!');
			return success("false");
		}
	});
}


//获取用户坐标
function LocationMonitorManager(WebServerurl, data, async, success) {
	$.ajax({
		type: "post", //请求方式
		url: sessionStorage.baseUrl + "LocationMonitorManager.asmx" + WebServerurl,
		data: data, //参数
		dataType: "text", //返回文本
		jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		async: async,
		cache: false,
		global: false,
		//请求成功后的回调函数
		success: function(xml) {
			return success($(xml).text());
		},
		error: function(res) {
			//      	layer.alert('访问服务器失败!');
			return success("false");
		}
	});
}
