var colorArr = ["#1890ff","#FC548B","#17D89E","#4A90E2","#17D89E","#919EF2","#F7598C","#17D89E","#F7598C","#FF5722","#DD5145","#009688","#2C4D83"];
var activationClick = false;
var ztreeObj = null;
var username = "";
$(function(){
//	var user = config.getCookie('userName');
//	if(!user){
//  	window.location.href = "login.html";
//  	return;
//	}else{
//      $("#username").html(user);
//	}
	layui.use(['form', 'layedit', 'laydate','element'], function(){
	   layer.loadIndex = layer.load(0, {shade: 0.1});
	   var form = layui.form;
	   form.on('select(echartsType)', function(data){
		 query.inichars();
	   });
	   form.on('select(layerstype)', function(data){

	   });
	   //工具条抽屉
		$(".tip-dropDown").click(function(){
			var tipid = $(this).attr('id');
			if(tipid){
				var $tipContent = $(".tip-container[index='"+tipid+"']").find('.tip-content');
			    if($tipContent.css('display')=="none"){
			    	if(tipid=="tip2"){
//			    		$(".tip-container[index='tip3']").animate({width:'570px'});
			    		$(".tip-container[index='tip3']").find('.tip-content').slideUp();
			    		$("#tip3").find('img').attr("src","images/icon/展开.png");
			    	}
			    	if(tipid=="tip3"){
//			    		$(".tip-container[index='tip3']").animate({width:'570px'});
			    		$(".tip-container[index='tip2']").find('.tip-content').slideUp();
			    		$("#tip2").find('img').attr("src","images/icon/展开.png");
			    	}
			    	$tipContent.slideDown();
			    	$(this).find("img").attr("src","images/icon/收起.png");

			    }else{
			    	$tipContent.slideUp();
			    	$(this).find("img").attr("src","images/icon/展开.png");


			    }
			}

		});
	   var zNodes = [
	      {id:1,pId:0,name:"图层控制",open:true,icon:"js/zTreeStyle/img/diy/node3.png"},
	       {id:11,pId:1,name:"引江水线路",checked:true,open:true,icon:"js/zTreeStyle/img/diy/node2.png"},
	        {id:111,pId:11,name:"口门",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:112,pId:11,name:"地表水厂（县）",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:113,pId:11,name:"连村取水水厂",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:114,pId:11,name:"衡水南水北调水厂以上输水管道",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:115,pId:11,name:"2016_2018年水源置换已建成通水项目",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:116,pId:11,name:"2016_2018年水源置换已建成未通水项目",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:117,pId:11,name:"2016_2018年水源置换在建项目",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:118,pId:11,name:"2019年拟建实施农村生活用水置换",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	        {id:119,pId:11,name:"2020年规划实施农村生活用水置换",checked:true,type:"引江水线路",icon:"js/zTreeStyle/img/diy/node1.png"},
	       {id:12,pId:1,name:"基本农田",icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:13,pId:1,name:"千亿斤粮食",icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:14,pId:1,name:"农发办高标准",icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:15,pId:1,name:"全市国土高标准",icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:16,pId:1,name:"行政区",checked:true,icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:17,pId:1,name:"小曹庄机井",icon:"js/zTreeStyle/img/diy/node2.png"},
	       {id:18,pId:1,name:"机井",checked:true,icon:"js/zTreeStyle/img/diy/node2.png"},
	   ];
	   ztreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	   $(".niceScroll").niceScroll({cursorborder: "",cursorcolor: "#214868",boxzoom: false});
	   initmap();
//	   analyse.query();
	   query.LocationCity();
	   _mapObject.on('click',function (evt) {
	   	    var mapZoom = _mapObject.getView().getZoom();
		    var mapCenter = _mapObject.getView().getCenter();
			if(activationClick){

				source1.clear();
				var layername = "";
				var feature = _mapObject.forEachFeatureAtPixel(evt.pixel,
		            function (feature) {
		                return feature;
		            },{
		                layerFilter: function (layer) {
		                    if(layer.get('name')=="聚合"){
		                		layername = "聚合";
		                		return layer.get('name') === '聚合';
		                	}

		                	if(layer.get('name')=="引江水线路"){
		                		layername = "引江水线路";
		                		return layer.get('name') === '引江水线路';
		                	}
		                	if(layer.get('name')=="基本农田"){
		                		layername = "基本农田";
		                		return layer.get('name') === '基本农田';
		                	}
		                	if(layer.get('name')=="小曹庄机井"){
		                		layername = "小曹庄机井";
		                		return layer.get('name') === '小曹庄机井';
		                	}
		                }
		            }
		        );
		        if(feature){

		        	if(layername=="聚合"){
		        		var feature = feature.get('features')[0];
		        		var ID = feature.get('ID');
		        		var restext = QueryService("/GetJJ",{"id":ID},false);
		        		restext = $.parseJSON(restext);
		        		restext = restext[0];
		                var str = "<div id='alertinfo'>";
						str+="<div class='san'></div><div class='layui-layer-title'>详细信息</div>";
						str+="<div class='layui-layer-content'>";
						str+="<table class='table table-bordered'>";
						str+="<tr><td>区县</td><td>"+restext.QX+"</td></tr>";
						str+="<tr><td>乡镇</td><td>"+restext.XZ+"</td></tr>";
						str+="<tr><td>村委会</td><td>"+restext.CWH+"</td></tr>";
						str+="<tr><td>机井编号</td><td>"+restext.JJBH+"</td></tr>";
						str+="<tr><td>机井深度</td><td>"+restext.JJSD+"</td></tr>";
						str+="<tr><td>机泵型号</td><td>"+restext.JBXH+"</td></tr>";
						str+="<tr><td>机井用途</td><td>"+restext.JJYT+"</td></tr>";
						str+="<tr><td>产权单位</td><td>"+restext.CQDW+"</td></tr>";
						str+="<tr><td>使用单位</td><td>"+restext.SYDW+"</td></tr>";
						str+="<tr><td>打井时间</td><td>"+restext.DJSJ+"</td></tr>";
						str+="<tr><td>审批单位</td><td>"+restext.SPDW+"</td></tr>";
						str+="<tr><td>资金来源</td><td>"+restext.ZJLY+"</td></tr>";
						str+="<tr><td>是否废弃</td><td>"+restext.SFFQ+"</td></tr>";
						str+="<tr><td>本村总机井数</td><td>"+restext.JJZS+"</td></tr>";
						if(restext.SFFQ=="是"){
							str+="<tr><td>封停措施</td><td>"+restext.FTCS+"</td></tr>";
							str+="<tr><td>封停联系人</td><td>"+restext.FTLXR+"</td></tr>";
							str+="<tr><td>封停联系人电话</td><td>"+restext.LXDH+"</td></tr>";
							str+="<tr><td>机泵功率（千瓦）</td><td>"+restext.JBGL+"</td></tr>";
						}

						str+="<tr><td>备注</td><td>"+restext.BZ+"</td></tr>";
						str+="</table>";
						str+="</div>";
						str+="<span class='layui-layer-setwin'><a id='closeAlertInfo' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:;'></a></span>";
						str+="</div>";
						document.getElementById("alertinfodiv").innerHTML = str;
		//				var feature = new ol.Feature(new ol.geom.Point([x,y]))
						source1.addFeature(feature);
						vector1.setVisible(true);
		//				_mapView.fit(source1.getExtent(),_mapObject.getSize());
						if(marker){
							_mapObject.removeOverlay(marker);
						}
						marker = new ol.Overlay({
					        element: document.getElementById('alertinfo'),
					        position: [feature.get('X'),feature.get('Y')],
					        positioning: 'left-left',
					        offset:[-35,35]
					    });
					    _mapObject.addOverlay(marker);
					    $("#closeAlertInfo").click(function(){
					    	source1.clear();
					    	_mapObject.removeOverlay(marker);
					    })
		        	}


		        }else{
		        	var lon = evt.coordinate[0];
					var lat = evt.coordinate[1];
		        	var nodes = ztreeObj.getNodesByParam("level", "1", null);
					if(nodes.length>0){
						for (var i=0;i<nodes.length;i++) {
							if(nodes[i].checked){
								if(nodes[i].name=="引江水线路"){
									layername = "引江水线路";
									var queryurl = querylayerUrl.WATER+"/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
						            queryurl+= (lon-0.005)+","+(lat-0.005)+","+(lon+0.005)+","+(lat+0.005);
								}else if(nodes[i].name=="基本农田"){
									layername = "基本农田";
									var queryurl = querylayerUrl.JBNT+"/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
						            queryurl+= lon+","+lat+","+lon+","+lat;
								}else if(nodes[i].name=="小曹庄机井"){
									layername = "小曹庄机井";
									var queryurl = querylayerUrl.XCZ+"/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
						            queryurl+= (lon-0.0001)+","+(lat-0.0001)+","+(lon+0.0001)+","+(lat+0.0001);
								}
								$.ajax({//城规
							        type: "post", //请求方式
							        url: queryurl,
							        data: {}, //参数
							        dataType: "text", //返回文本
							        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
							        async: false,
							        cache: false,
							        global: false,
							        //请求成功后的回调函数
							        success: function (xml) {
							            var resjosn = $.parseJSON(xml);
							            if(resjosn.features.length>0){
							            	fixed(resjosn.features[0],layername,lon,lat);
							            }

							        },
							        error: function (res) {
//							        	layer.alert('访问服务器失败!');

							        }
							    });

							    if(nodes[i].name=="引江水线路"){
							    	layername = "引江水线路";
							    	var queryurl = querylayerUrl.WATER+"/1/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
									queryurl+= (lon-0.005)+","+(lat-0.005)+","+(lon+0.005)+","+(lat+0.005);
							    	$.ajax({//城规
								        type: "post", //请求方式
								        url: queryurl,
								        data: {}, //参数
								        dataType: "text", //返回文本
								        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
								        async: false,
								        cache: false,
								        global: false,
								        //请求成功后的回调函数
								        success: function (xml) {
								            var resjosn = $.parseJSON(xml);
								            if(resjosn.features.length>0){
								            	fixed(resjosn.features[0],layername,lon,lat);
								            }

								        },
								        error: function (res) {
//								        	layer.alert('访问服务器失败!');

								        }
								    });

								    layername = "引江水线路";
							    	var queryurl = querylayerUrl.WATER+"/2/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
									queryurl+= (lon-0.005)+","+(lat-0.005)+","+(lon+0.005)+","+(lat+0.005);
							    	$.ajax({//城规
								        type: "post", //请求方式
								        url: queryurl,
								        data: {}, //参数
								        dataType: "text", //返回文本
								        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
								        async: false,
								        cache: false,
								        global: false,
								        //请求成功后的回调函数
								        success: function (xml) {
								            var resjosn = $.parseJSON(xml);
								            if(resjosn.features.length>0){
								            	fixed(resjosn.features[0],layername,lon,lat);
								            }

								        },
								        error: function (res) {
//								        	layer.alert('访问服务器失败!');

								        }
								    });
							    }
							}


						}


					}
		        }


			}

	    });
	});

});
//激活点选
$("#activationClick").click(function(){
	if(draw){
    	_mapObject.removeInteraction(draw);//移除交互事件
    }
	if(activationClick){
		$("#map").css('cursor','Default');
		$(".activationClick").html("激活点选");
		activationClick = false;
	}else{
		$("#map").css('cursor','Pointer');
		$(".activationClick").html("取消点选");
		activationClick = true;
	}
});

//图例控制
$("#legendControl").click(function(){
	if($("#legendExplain").hasClass('hide')){
		$("#legendExplain").removeClass('hide');
	}else{
		$("#legendExplain").addClass('hide');
	}
});
//全图
$("#quanfu").click(function(){
	var Extent = [115.87034540802743,37.72967179180566];
//	_mapView.fit(Extent,9);
	_mapView.setCenter(Extent);//单点定位
    _mapView.setZoom(9);设置级别
});


$(".current-city-closed").click(function(){
	$(".current-city-wrap").hide();
});
$(".fruit-item-title .tab").click(function(){
	var index = $(this).attr('index');
	$(this).parent().find('.tab').removeClass('tabhover');
	$(this).addClass('tabhover');
	$(this).parent().parent().parent().find('.fruit-item-content>div').hide();
	$(this).parent().parent().parent().find('.fruit-item-content>div').eq(index).show();
});



var analyse =  {
	queryFruit:[],
	statistics:[],
	layerALL:[],
	sourceAll:[],
	clusterSourceAll:[],
	features:[],
	query:function(){
		var nodes = ztreeObj.getNodesByParam("name", "机井", null);
		analyse.queryFruit = [];
//      analyse.statistics = [];
        var features1 = [];
        var features2 = [];
        var features3 = [];
        var features4 = [];
        var features5 = [];
        var features6 = [];
        var features7 = [];
        var features8 = [];
        var features9 = [];
		var resjosn = {};
		var loadindex = 0;
		if(parent.resjosndata.length>0){
//			setTimeout(function(){
//				resjosn.features = parent.resjosndata;
//              loaddata();
//          },2000);
//
		}else{
//			var queryurl = querylayerUrl.JJ+"/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	//	    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
			$.ajax({//
		        type: "post", //请求方式
		        url: config.QueryService +"/GetAllQX",
		        data: {}, //参数
		        dataType: "text", //返回文本
		        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		        async: true,
		        cache: false,
		        global: false,
		        //请求成功后的回调函数
		        success: function (xml) {
//		            resjosn = $.parseJSON(xml);
		            resjosn = $.parseJSON($(xml).text());

		            if(resjosn.length<1){
		            	layer.close(layer.loadIndex);
		            	return;
		            }
		            for (var j=0;j<resjosn.length;j++) {
		            	var QX = resjosn[j].Name;
		            	ztreeObj.addNodes(nodes[0], {name:QX,checked:false,type:"机井",icon:"js/zTreeStyle/img/diy/8.png"});
		            	$.ajax({//城规
					        type: "post", //请求方式
					        url: config.QueryService +"/GetAllJJ",
					        data: {'qx':QX}, //参数
					        dataType: "text", //返回文本
					        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
					        async: true,
					        cache: false,
					        global: false,
					        //请求成功后的回调函数
					        success: function (xml) {
					        	loadindex++;
					            var resjosn1 = $.parseJSON($(xml).text());
					            if(resjosn1.length<1){
					            	layer.close(layer.loadIndex);
					            	return;
					            }
					            analyse.queryFruit.push(resjosn1);
					            for (var i=0;i<resjosn1.length;i++) {
					            	var ID = resjosn1[i].ID;
					            	var X = resjosn1[i].X;
					        		var Y = resjosn1[i].Y;
					        		var JJYT = resjosn1[i].JJYT;
					        		var SFFQ = resjosn1[i].SFFQ;
					        		var FQNF = resjosn1[i].FQNF;
					        		var QX1 = resjosn1[i].QX;
					        		var feature = new ol.Feature(new ol.geom.Point([X,Y]));
					        		feature.set("ID",ID);
					        		feature.set("QX",QX1);
					        		feature.set("JJYT",JJYT);
					        		feature.set("FQNF",SFFQ);
					        		feature.set("X",X);
					        		feature.set("Y",Y);

									if(SFFQ=="是"&&FQNF!="2019"){
										feature.set("color","#000");
										if(JJYT=="工业"){
					                        feature.set("form","circular");
					                        features1.push(feature);
										}else if(JJYT=="生活"){
											feature.set("form","rhombus");
											features2.push(feature);
										}else if(JJYT=="农业"){
											feature.set("form","square");
											features3.push(feature);
										}
									}
									if(SFFQ=="是"&&FQNF=="2019"){
										feature.set("color","#FF3B30");
										if(JJYT=="工业"){
					                        feature.set("form","circular");
					                        features4.push(feature);
										}else if(JJYT=="生活"){
											feature.set("form","rhombus");
											features5.push(feature);
										}else if(JJYT=="农业"){
											feature.set("form","square");
											features6.push(feature);
										}
									}
									if(SFFQ=="否"){
										feature.set("color","#16A05D");
										if(JJYT=="工业"){
					                        feature.set("form","circular");
					                        features7.push(feature);
										}else if(JJYT=="生活"){
											feature.set("form","rhombus");
											features8.push(feature);
										}else if(JJYT=="农业"){
											feature.set("form","square");
											features9.push(feature);
										}
									}

					            }
					            if(loadindex==resjosn.length){
					            	addclusters(features1,0);
						        	addclusters(features2,0);
						        	addclusters(features3,0);
						        	addclusters(features4,0);
						        	addclusters(features5,0);
						        	addclusters(features6,0);
						        	addclusters(features7,0);
						        	addclusters(features8,0);
						        	addclusters(features9,0);
						        	Statistic.initHighcharts();
						        	Statistic.initHighcharts1();
						        	Statistic.initHighcharts2();
						        	Statistic.initHighcharts3();
							        layer.close(layer.loadIndex);
					            }
					        },
					        error: function (res) {
					        	layer.alert('访问服务器失败!');

					        }
					    });
		            }

//		            parent.resjosndata = resjosn.features;
//			    	loaddata();
		        },
		        error: function (res) {
		        	layer.alert('访问服务器失败!');

		        }
		    });


		}
	},


};

function addclusters(features,type){
//	var count = 10000;
//  var features = new Array(count);
//  var e = 4500000;
//  for (var i = 0; i < count; ++i) {
//      var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
//      features[i] = new ol.Feature(new ol.geom.Point(coordinates));
//  }


    //矢量要素数据源

    var source = new ol.source.Vector({
        features: features,
    });
    //聚合标注数据源
    var clusterSource = new ol.source.Cluster({
    	attributions:"",
        distance: 40,
        source: source
    });
    //加载聚合标注的矢量图层
    var styleCache = {};
    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature, resolution) {
            var size = feature.get('features').length;
            var color = feature.get('features')[0].get('color');
            var form = feature.get('features')[0].get('form');
            var style = styleCache[size];
            if(form=="circular"){
	            if (!style) {
	                style = [new ol.style.Style({
	                    image: new ol.style.Circle({
	                        radius: 10,
	                        stroke: new ol.style.Stroke({
	                            color: '#fff'
	                        }),
	                        fill: new ol.style.Fill({
	                            color: color
	                        })
	                    }),
	                    text: new ol.style.Text({
	                        text: size.toString(),
	                        fill: new ol.style.Fill({
	                            color: '#fff'
	                        })
	                    })
	                })];
	                styleCache[size] = style;
	            }
            }else if(form=="rhombus"){
            	if(color=="#000"){
            		var imgsrc = "images/legend/black22.png"
            	}else if(color=="#FF3B30"){
            		var imgsrc = "images/legend/red22.png"
            	}else if(color=="#16A05D"){
            		var imgsrc = "images/legend/green22.png"
            	}
            	if (!style) {
	                style = [new ol.style.Style({
					     stroke: new ol.style.Stroke({
			                color: hexToRgba(color, 1),
			                width: 5
			            }),
			            image: new ol.style.Icon(({
					        src: imgsrc,
//					        anchor:[0.5,0.75]
					    })),
	                    text: new ol.style.Text({
	                        text: size.toString(),
	                        fill: new ol.style.Fill({
	                            color: '#fff'
	                        })

	                    })
	                })];
	                styleCache[size] = style;
	            }
            }else if(form=="square"){
   		        if (!style) {
	                style = [new ol.style.Style({
	                    image: new ol.style.RegularShape({
					      fill: new ol.style.Fill({
	                            color: color,
	                            size:20,
	                            radius:20,
	                      }),
					      stroke: new ol.style.Stroke({
	                            color: '#fff'
	                      }),
					      points: 4,
					      radius: 14,
					      angle: Math.PI / 4
					    }),
	                    text: new ol.style.Text({
	                        text: size.toString(),
	                        fill: new ol.style.Fill({
	                            color: '#fff'
	                        })
	                    })
	                })];
	                styleCache[size] = style;
	            }
            }



            return style;
        },
        name:"聚合"
    });
    query.layerList.push(clusters);
//  analyse.sourceAll.push(source);
//  analyse.clusterSourceAll.push(clusterSource);
//  analyse.features.push(features);
    clusters.setVisible(true);
    _mapObject.addLayer(clusters);

}

var Statistic = {
	fruit:[],
	fruit1:[],
	fruit2:[],
	fruit3:[],
	getfruit:function(){
		$.ajax({//城规
	        type: "post", //请求方式
	        url: config.QueryService +"/StatisticAll",
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON($(xml).text());
	            if(resjosn.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            Statistic.fruit = resjosn;
	            Statistic.initHighcharts();
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');

	        }
	    });

	},
	getfruit1:function(){
	    $.ajax({//获取正在运行的机井井数据统计数据
	        type: "post", //请求方式
	        url: config.QueryService +"/StatisticAllValid",
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON($(xml).text());
	            if(resjosn.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            Statistic.fruit1 = resjosn;
	            Statistic.initHighcharts1();
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');

	        }
	    });


	},
	getfruit2:function(){
	    $.ajax({//获取已经关停机井数据统计数据
	        type: "post", //请求方式
	        url: config.QueryService +"/StatisticFT",
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON($(xml).text());
	            if(resjosn.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            Statistic.fruit2 = resjosn;
	            Statistic.initHighcharts2();
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');

	        }
	    });


	},
	getfruit3:function(){
	    $.ajax({//获取计划关停机井数据统计数据
	        type: "post", //请求方式
	        url: config.QueryService +"/StatisticFTCurrent",
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON($(xml).text());
	            if(resjosn.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            Statistic.fruit3 = resjosn;
	            Statistic.initHighcharts3();
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');

	        }
	    });


	},
	initHighcharts:function(){
		if(Statistic.fruit.length>0){
			var HighchartsType = $("#HighchartsType").val();
			var str = "";
		    var GYtotal = 0;
		    var SHtotal = 0;
		    var NYtotal = 0;
			var chartdata = [];
			var chartdata1 = [];
			var categories = [];
		    for (var i=0;i<Statistic.fruit.length;i++) {
		    	var QX = Statistic.fruit[i].QX;
		    	var GY = Statistic.fruit[i].GY;
		    	var SH = Statistic.fruit[i].SH;
		    	var NY = Statistic.fruit[i].NY;
		    	GYtotal+=GY;
		    	SHtotal+=SH;
		    	NYtotal+=NY;
		    	var data = {
				  	name:QX,
				  	value:(GY+SH+NY),
				};
		    	categories.push(QX);
				chartdata.push(data);
				chartdata1.push(GY+SH+NY);
		    	str+="<tr><td>"+QX+"</td><td>"+GY+"</td><td>"+SH+"</td><td>"+NY+"</td><td>"+(GY+SH+NY)+"</td></tr>";
		    }
		    str+="<tr><td>合计</td><td>"+GYtotal+"</td><td>"+SHtotal+"</td><td>"+NYtotal+"</td><td>"+(GYtotal+SHtotal+NYtotal)+"</td></tr>";
	        $("#tbody").html(str);
	        if(HighchartsType=="pie"){
				echarts.init(document.getElementById('container'),'dark').setOption({
					backgroundColor: 'transparent',
		            title: {
				        text: '总量:'+(GYtotal+SHtotal+NYtotal),
				        left: 'center',
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        },
				        show:false
				    },
				    legend: {
				        bottom: 10,
				        left: 'center',
				        data: [],
				        show:false
				    },
				    series : [
				        {
				            type: HighchartsType,
				            radius : '65%',
				            center: ['50%', '50%'],
				            selectedMode: 'single',
				            data:chartdata

				        }
				    ]

				},true);
			}else{

				echarts.init(document.getElementById('container'),'dark').setOption({
					backgroundColor: 'transparent',
					color:colorArr,
		            title: {
				        text: '总量:'+(GYtotal+SHtotal+NYtotal),
				        left: 'center',
				    },
				    tooltip: {
				        trigger: 'axis',
				        formatter:""
				    },
				    legend: {
				        data:[],
				        show:false
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        },
				        show:false
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: categories
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [
				        {
				            name:'数量',
				            type:HighchartsType,
				            stack: '数量',
				            data:chartdata1
				        },

				    ]

				},true);


			}
		}else{
			Statistic.getfruit();
		}
	},
	initHighcharts1:function(){
		if(Statistic.fruit1.length>0){
			Statistic._echarts("container3",Statistic.fruit1,"运行","#tbody3");
		}else{
			Statistic.getfruit1();
		}
	},
	initHighcharts2:function(){
		if(Statistic.fruit2.length>0){
			Statistic._echarts("container1",Statistic.fruit2,"2018年底已关停","#tbody1");
		}else{
			Statistic.getfruit2();
		}
	},
	initHighcharts3:function(){
		if(Statistic.fruit3.length>0){
			Statistic._echarts("container2",Statistic.fruit3,"2019年6月计划关停","#tbody2");
		}else{
			Statistic.getfruit3();
		}
	},
	_echarts:function(containerID,fruit,titleText,tableID){
		var HighchartsType = $("#HighchartsType").val();
		if(HighchartsType=="pie"){
			return;
		}
		var str = "";
	    var GYtotal = 0;
	    var SHtotal = 0;
	    var NYtotal = 0;
		var chartdata = [];
		var chartdata1 = [];
		var categories = [];
		var data1 = [];
		var data2 = [];
		var data3 = [];
	    for (var i=0;i<fruit.length;i++) {
	    	var QX = fruit[i].QX;
	    	var GY = fruit[i].GY;
	    	var SH = fruit[i].SH;
	    	var NY = fruit[i].NY;
	    	GYtotal+=GY;
	    	SHtotal+=SH;
	    	NYtotal+=NY;
	    	var data = {
			  	name:QX,
			  	value:(GY+SH+NY),
			};
	    	data1.push(GY);
	    	data2.push(SH);
	    	data3.push(NY);
	    	categories.push(QX);
			chartdata.push(data);
			chartdata1.push(GY+SH+NY);
	    	str+="<tr><td>"+QX+"</td><td>"+GY+"</td><td>"+SH+"</td><td>"+NY+"</td><td>"+(GY+SH+NY)+"</td></tr>";
	    }
	    str+="<tr><td>合计</td><td>"+GYtotal+"</td><td>"+SHtotal+"</td><td>"+NYtotal+"</td><td>"+(GYtotal+SHtotal+NYtotal)+"</td></tr>";
	    $(tableID).html(str);
	    echarts.init(document.getElementById(containerID),'dark').setOption({
			backgroundColor: 'transparent',
			color:colorArr,
            title: {
		        text: titleText+":"+(GYtotal+SHtotal+NYtotal),
//		        subtext: '虚构数据',
		        left: 'center',
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:[],
		        show:false
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        },
		        show:false
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: categories
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name:'工业',
		            type:HighchartsType,
		            stack: '工业',
		            data:data1
		        },
		        {
		            name:'生活',
		            type:HighchartsType,
		            stack: '生活',
		            data:data2
		        },
		        {
		            name:'农业',
		            type:HighchartsType,
		            stack: '农业',
		            data:data3
		        },
		    ]

		},true);
	}

};



function initdetailedHighcharts(){
	var HighchartsType = $("#HighchartsType").val();
	if(HighchartsType!="pie"){
		var chartdata = [];
		var categories = [];
		var GYarr = [];//工业
		var SHarr = [];//生活
		var NYarr = [];//农业
		var GYarr1 = [];//工业
		var SHarr1 = [];//生活
		var NYarr1 = [];//农业
		var GYarr2 = [];//工业
		var SHarr2 = [];//生活
		var NYarr2 = [];//农业
		for (var i=0;i<analyse.statistics.length;i++) {
			categories.push(analyse.statistics[i].QX);
			var features = analyse.statistics[i].features;
			var GY = 0;
			var SH = 0;
			var NY = 0;
			var GY1 = 0;
			var SH1 = 0;
			var NY1 = 0;
			var GY2 = 0;
			var SH2 = 0;
			var NY2 = 0;
			for (var j=0;j<features.length;j++) {
				var JJYT = features[j].attributes.JJYT;
				if(features[j].attributes.SFFQ=="是"&&features[j].attributes.FQNF!="2019"){
					if(JJYT=="工业"){
						GY++
					}else if(JJYT=="生活"){
						SH++
					}else if(JJYT=="农业"){
						NY++
					}
				}
				if(features[j].attributes.SFFQ=="是"&&features[j].attributes.FQNF=="2019"){
					if(JJYT=="工业"){
						GY1++
					}else if(JJYT=="生活"){
						SH1++
					}else if(JJYT=="农业"){
						NY1++
					}
				}
				if(features[j].attributes.SFFQ=="否"){
					if(JJYT=="工业"){
						GY2++
					}else if(JJYT=="生活"){
						SH2++
					}else if(JJYT=="农业"){
						NY2++
					}
				}


			}
			var marker = {
				lineWidth: 0,
				lineColor: 'red',
				fillColor: 'red',
				enabled: false,
			};
			GYarr.push(GY);
			SHarr.push(SH);
			NYarr.push(NY);
			GYarr1.push(GY1);
			SHarr1.push(SH1);
			NYarr1.push(NY1);
			GYarr2.push(GY2);
			SHarr2.push(SH2);
			NYarr2.push(NY2);
		}

		function _Highcharts(HighchartID,data1,data2,data3,color,titletext,tbodyID){
			var str = "";
			var total1 = 0;
			var total2 = 0;
			var total3 = 0;
			for (var i=0;i<categories.length;i++) {
				var total = data1[i]+data2[i]+data3[i];
				total1+=data1[i];
				total2+=data2[i];
				total3+=data3[i];
				str+="<tr><td>"+categories[i]+"</td><td>"+data1[i]+"</td><td>"+data2[i]+"</td><td>"+data3[i]+"</td><td>"+total+"</td></tr>"
			}
			str+="<tr><td>合计</td><td>"+total1+"</td><td>"+total2+"</td><td>"+total3+"</td><td>"+(total1+total2+total3)+"</td></tr>";
			$(tbodyID).html(str);




		}

	}
}




function fixed(result,layername,centerlon,centerlat){
//	$("#queryFruit li").removeClass('active')
//	$("#queryFruit li").eq(index).addClass('active');



	var str = "<div id='alertinfo'>";
	str+="<div class='san'></div><div class='layui-layer-title'>详细信息</div>";
	str+="<div class='layui-layer-content'>";
	str+="<table class='table table-bordered'>";
	if(layername=="地表水厂（县）"){
		str+="<p>名称&nbsp;:&nbsp;&nbsp;"+result.attributes["名称"]+"</p>";
        str+="<p>属性1&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性2&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性3&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性4&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性5&nbsp;:&nbsp;&nbsp;</p>";

	}else if(layername=="引江水线路"){
		if(result.attributes["名称"]){
			str+="<p>名称&nbsp;:&nbsp;&nbsp;"+result.attributes["名称"]+"</p>";
			str+="<p>2017-2018规划分水量&nbsp;:&nbsp;&nbsp;"+result.attributes["规划分水量1"]+"</p>";
			str+="<p>2017-2018省定40%指标水量&nbsp;:&nbsp;&nbsp;"+result.attributes["省定指标1"]+"</p>";
			str+="<p>2017-2018利用江水总量&nbsp;:&nbsp;&nbsp;"+result.attributes["利用江水量"]+"</p>";
			str+="<p>2017-2018城镇生活及工业利用江水实际利用水量&nbsp;:&nbsp;&nbsp;"+result.attributes["城镇生活及工业实际利用水量"]+"</p>";
			str+="<p>2017-2018生态及农业利用江水生态及农业水量&nbsp;:&nbsp;&nbsp;"+result.attributes["生态及农业实际利用水量"]+"</p>";
			str+="<p>2018-2019规划分水量&nbsp;:&nbsp;&nbsp;"+result.attributes["规划分水量2"]+"</p>";
			str+="<p>2018-2019利用江水确保数（50%指标水量）&nbsp;:&nbsp;&nbsp;"+result.attributes["利用江水确保数"]+"</p>";
			str+="<p>2018-2019确保数占规划水量百分比&nbsp;:&nbsp;&nbsp;"+(result.attributes["占规划数量百分比"]*100)+"</p>";
			str+="<p>2018-2019城镇生活及工业利用江水量&nbsp;:&nbsp;&nbsp;"+result.attributes["城镇生活及工业利用江水量"]+"</p>";
			str+="<p>2018-2019农村生活水源置换利用江水量&nbsp;:&nbsp;&nbsp;"+result.attributes["农村生活水源置换利用江水量"]+"</p>";
			str+="<p>2018-2019生态及农业利用水确保数&nbsp;:&nbsp;&nbsp;"+result.attributes["生态及农业利用水确保数"]+"</p>";
			str+="<p>2018-2019利用江水争取数&nbsp;:&nbsp;&nbsp;"+result.attributes["利用江水争取数"]+"</p>";

		}else{
			if(result.attributes["MC"]){
				str+="<p>名称&nbsp;:&nbsp;&nbsp;"+result.attributes["MC"]+"</p>";
				str+="<p>描述&nbsp;:&nbsp;&nbsp;"+result.attributes["MS"]+"</p>";
			}else{
				str+="<p>名称&nbsp;:&nbsp;&nbsp;"+result.attributes["mc"]+"</p>";

			}

		}
		if(!result.attributes["名称"]){

			str+="<p>属性2&nbsp;:&nbsp;&nbsp;</p>";
			str+="<p>属性3&nbsp;:&nbsp;&nbsp;</p>";
			str+="<p>属性4&nbsp;:&nbsp;&nbsp;</p>";
			str+="<p>属性5&nbsp;:&nbsp;&nbsp;</p>";
		}

	}else if(layername=="基本农田"){
		str+="<p>土地用途区类型代码&nbsp;:&nbsp;&nbsp;"+result.attributes["TDYTQLXDM"]+"</p>";
		str+="<p>行政区代码&nbsp;:&nbsp;&nbsp;"+result.attributes["XZQDM"]+"</p>";
		str+="<p>属性1&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性2&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性3&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性4&nbsp;:&nbsp;&nbsp;</p>";
		str+="<p>属性5&nbsp;:&nbsp;&nbsp;</p>";
	}else if(layername=="小曹庄机井"){
		var jjzp = result.attributes["JJZP"].split(';');
		var ddzp = result.attributes["DBZP"].split(';');
        str+="<tr><td>区县</td><td>"+result.attributes["QX"]+"</td><td>打井时间</td><td>"+result.attributes["DJSJ"]+"</td></tr>";
		str+="<tr><td>乡镇</td><td>"+result.attributes["XZ"]+"</td><td>审批单位</td><td>"+result.attributes["SPDW"]+"</td></tr>";
		str+="<tr><td>村</td><td>"+result.attributes["CWH"]+"</td><td>资金来源</td><td>"+result.attributes["ZJLY"]+"</td></tr>";
		str+="<tr><td>机井编号</td><td>"+result.attributes["JJBH"]+"</td><td>是否封停</td><td>"+result.attributes["SFFT"]+"</td></tr>";
		str+="<tr><td>机井深度</td><td>"+result.attributes["JJSD"]+"</td><td>封停时间</td><td>"+result.attributes["FTSJ"]+"</td></tr>";
		str+="<tr><td>井泵型号</td><td>"+result.attributes["JBXH"]+"</td><td>是否自备</td><td>"+result.attributes["SFZB"]+"</td></tr>";
		str+="<tr><td>井泵功率</td><td>"+result.attributes["JBGL"]+"</td><td>出水量</td><td>"+result.attributes["CSL"]+"</td></tr>";
		str+="<tr><td>经度</td><td>"+result.attributes["X"]+"</td><td>采集坐标情况</td><td>"+result.attributes["ZBQK"]+"</td></tr>";
		str+="<tr><td>纬度</td><td>"+result.attributes["Y"]+"</td><td>机井照片名称</td><td><a href='javascript:;' onclick=lookimg('"+result.attributes["JJZP"]+"','机井照片')>查看图片("+(jjzp.length-1)+"张)</a></td></tr>";
		str+="<tr><td>机井用途</td><td>"+result.attributes["JJYT"]+"</td><td>电表照片名称</td><td><a href='javascript:;' onclick=lookimg('"+result.attributes["DBZP"]+"','电表照片')>查看图片("+(ddzp.length-1)+"张)</a></td></tr>";
		str+="<tr><td>产权单位</td><td>"+result.attributes["CQDW"]+"</td><td>电表编号</td><td>"+result.attributes["DBBH"]+"</td></tr>";
		str+="<tr><td>使用单位</td><td>"+result.attributes["SYDW"]+"</td></tr>";

	}

	str+="</table>";
	str+="</div>";
	str+="<span class='layui-layer-setwin'><i id='closeAlertInfo' class='layui-icon layui-icon-close'></i></span>";
	str+="</div>";
	document.getElementById("alertinfodiv").innerHTML = str;
	if(layername!="地表水厂（县）"&&layername!="小曹庄机井"&&layername!="引江水线路"){
		if(layername==""){
			var lines = result.geometry.paths[0];
		}else{
			var lines = result.geometry.rings[0];
		}

		var LINESTRING = "LINESTRING(";
		var lonArr = [];
		var latArr = [];
		for (var i=0;i<lines.length;i++) {
			var lon = lines[i][0];
			var lat = lines[i][1];
			if(i!=0){
				LINESTRING+=",";
			}
			LINESTRING+=lon+" "+lat;
			lonArr.push(lon);
			latArr.push(lat);
		}
		LINESTRING+=")";
		var feature = _wktParser.readFeature(LINESTRING);
		source1.addFeature(feature);
		vector1.setVisible(true);
		_mapView.fit(source1.getExtent(),_mapObject.getSize());
	}
	if(marker){
		_mapObject.removeOverlay(marker);
	}
	marker = new ol.Overlay({
        element: document.getElementById('alertinfo'),
        position: [centerlon,centerlat],
        positioning: 'left-left',
        offset:[-35,35]
    });
    _mapObject.addOverlay(marker);
    $("#closeAlertInfo").click(function(){
    	source1.clear();
    	_mapObject.removeOverlay(marker);
    })
}


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
		onClick: function(event, treeId, node) {
			if(node.type==0){
				selnode = null;
			}else{
				selnode = node;
			}

		},
		onRightClick: function(event, treeId, node){
			var node1 = node;
		},
		onDblClick: function(event, treeId, node) {
			var node1 = node;
        },
		onCheck: function(event, treeId, node) {
			var nodes = ztreeObj.getNodesByParam("level", "1", null);
			if(nodes.length>0){
				for (var i=0;i<nodes.length;i++) {
					if(nodes[i].name=="引江水线路"){
						if(nodes[i].checked){
							$("#legend").removeClass('hide');
						}else{
							$("#legend").addClass('hide');

						}
					}else if(nodes[i].name=="基本农田"){
						baseJBNT0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="行政区"){
						baseXZQ0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="千亿斤粮食"){
						baseQYJLS0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="农发办高标准"){
						baseNFBGBZ0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="全市国土高标准"){
						baseGTGBZ0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="小曹庄机井"){
						baseXCZ0.setVisible(nodes[i].checked);
					}
				}


			}

            var nodes = ztreeObj.getNodesByParam("type", "引江水线路", null);
			if(nodes.length>0){

				for (var i=0;i<nodes.length;i++) {
					if(nodes[i].name=="口门"){
						baseWATER0.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="地表水厂（县）"){
						baseWATER1.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="连村取水水厂"){
						baseWATER2.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="衡水南水北调水厂以上输水管道"){
						baseWATER3.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="2016_2018年水源置换已建成通水项目"){
						baseWATER4.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="2016_2018年水源置换已建成未通水项目"){
						baseWATER5.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="2016_2018年水源置换在建项目"){
						baseWATER6.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="2019年拟建实施农村生活用水置换"){
						baseWATER7.setVisible(nodes[i].checked);
					}else if(nodes[i].name=="2020年规划实施农村生活用水置换"){
						baseWATER8.setVisible(nodes[i].checked);
					}
				}


			}


			var nodes = ztreeObj.getNodesByParam("type", "机井", null);
			if(nodes.length>0){
				for (var i=0;i<nodes.length;i++){
					query.layerList[nodes[i].index].setVisible(nodes[i].checked);
				}

			}
		},
	}
};

//查看图片
function lookimg(imgurl,title){
	layer.imgurl = imgurl;
	layer.openType = 0;
	layer.openIndex = layer.open({
		  type: 2,
		  title:title,
		  fixed: false, //不固定
		  maxmin: true,
		  closeBtn: 1, //不显示关闭按钮
		  shade: [0],
		  skin: 'layui-layer-lan',
		  area: ['450px', '642px'],
	//			  offset: 'rb', //右下角弹出
		  anim: 2,//弹出动画
		  shade: 0.2,//遮盖层
		  content: ['html/images.html', 'no'], //这里content是一个普通的String
		  end:function(){


		  }
	});
}

//获取所有区县
var query = {
	index:0,
	indexCity:"",
	restext:[],
	chartitle:"",
	xAxisdata:[],
	charsdata:[],
	querylayerRestext:[],
	layerList:[],
	LocationCity:function(){
		var restext = QueryService("/LocationCity",{},false);
		restext = $.parseJSON(restext);
		var cityName = restext[0].Name;
		var Range = restext[0].Range;
		var JJCount = restext[0].JJCount;
		var DM = restext[0].DM;
		this.indexCity = cityName;
		$("#indexCity").html(cityName+"["+JJCount+"]").click(function(){
			query.loadjjdata(DM,Range,"0",cityName);
//			query.loadjjclusterData("0",cityName);
		}).click();
		$("#indexCity").dblclick(function(){
			query.loadjjclusterData(DM,"0",cityName)
		});
		$.ajax({
	        type: "post", //请求方式
	        url: config.QueryService +"/LocationQX",
	        data: {'cityName':cityName}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var restext = $(xml).text();
	            restext = $.parseJSON(restext);
	            query.restext = restext;
	            var str = "";
				for (var i=0;i<restext.length;i++) {
					var QXname =  restext[i].Name;
					var Range = restext[i].Range;
					var JJCount = restext[i].JJCount;
					var Parts = restext[i].Parts;
					var DM = restext[i].DM;
					str+="<li  onclick=query.citybyXZ('"+DM+"','"+Range+"','1','"+cityName+"','"+QXname+"') ondblclick=query.loadjjclusterData('"+DM+"','1','"+cityName+"','"+QXname+"') ><a href='javascript:;'  >"+QXname+"["+JJCount+"]</a></li>"

				}
				$("#every-city").html(str);
				$("#every-city li").click(function(){
					$("#every-city li").removeClass('active');
					$(this).addClass('active');
				});
				$("#every-city li").eq(0).click();

	            layer.close(layer.loadIndex);
	        },
	        error: function (res) {
	        	restext = false;
	        	parent.layer.alert('访问服务器失败!');

	        }
	    });
	},
	citybyXZ:function(DM,citycoordinate,servertype,cityName,QXname){//加载村数据
//		query.index++;
		var restext = this.restext;
		for (var i=0;i<restext.length;i++) {
			var XZname =  restext[i].Name;
			if(QXname==XZname){
				var Range = restext[i].Range;
				var JJCount = restext[i].JJCount;
				var Parts = restext[i].Parts;
				var str  = "";
				for (var j=0;j<Parts.length;j++){
					var XZname =  Parts[j].Name;
					var Range = Parts[j].Range;
					var JJCount = Parts[j].JJCount;
					var Parts1 = Parts[j].Parts;
					var DM1 = Parts[j].DM;
					str+="<p onclick=query.citybyCWH('"+DM1+"','"+Range+"','2','"+cityName+"','"+QXname+"','"+XZname+"') ondblclick=query.loadjjclusterData('"+DM1+"','2','"+cityName+"','"+QXname+"','"+XZname+"') class='cityXZ'>"+XZname+"["+JJCount+"]</p>"
				}
				$(".list-XZ").html(str);
				$(".cityXZ").click(function(){
					$(".cityXZ").removeClass('active');
					$(this).addClass('active');
				});
				break;
			}
		}
		this.loadjjdata(DM,citycoordinate,servertype,cityName,QXname);


	},
	citybyCWH:function(DM,citycoordinate,servertype,cityName,QXname,XZname){//加载村数据
		var restext = this.restext;
		for (var i=0;i<restext.length;i++) {
			var _QXname =  restext[i].Name;
			if(QXname==_QXname){
				var Parts = restext[i].Parts;
				for (var j=0;j<Parts.length;j++){
					var _XZname =  Parts[j].Name;
					var Parts1 = Parts[j].Parts;
					if(XZname==_XZname){
						var str  = "";
						for (var k=0;k<Parts1.length;k++){
							var CWHName =  Parts1[k].Name;
							var CWHRange = Parts1[k].Range;
							var CWHJJCount = Parts1[k].JJCount;
							var DM1 = Parts1[k].DM;
							str+="<a class='cityCWH' onclick=query.loadjjdata('" + DM1 + "','" + CWHRange + "','3','" + cityName + "','" + QXname + "','" + XZname + "','" + CWHName + "') ondblclick=query.loadjjclusterData('" + DM1 + "','3','" + cityName + "','" + QXname + "','" + XZname + "','" + CWHName + "') href='javascript:'>" + CWHName + "[" + CWHJJCount + "]</a>"
						}
						$(".list-CWH").html(str);
						$(".cityCWH").click(function(){
							$(".cityCWH").removeClass('active');
							$(this).addClass('active');
						});
						break;
					}


				}


			}
		}
		this.loadjjdata(DM,citycoordinate,servertype,cityName,QXname,XZname);
	},
	loadjjdata:function(DM,citycoordinate,servertype,cityName,QXname,XZname,CWHname){
		this.cityfixed(citycoordinate);
		this.loadScope(DM);
		if(servertype=="0"){
			var data = {
				'cityName':cityName
			};
			var serverName = "GetCountInfobyCity";
			var title = cityName;
		}else if(servertype=="1"){
			var data = {
				'cityName':cityName,
				'qx':QXname
			};
			var serverName = "GetCountInfobyQX";
			var title = cityName+QXname;
		}else if(servertype=="2"){
			var data = {
				'cityName':cityName,
				'qx':QXname,
				'xz':XZname
			};
			var serverName = "GetCountInfobyXZ";
			var title = cityName+QXname+XZname;
		}else if(servertype=="3"){
			var data = {
				'cityName':cityName,
				'qx':QXname,
				'xz':XZname,
				'cwh':CWHname
			};
			var serverName = "GetCountInfobyCWH";
			var title = cityName+QXname+XZname+CWHname;
		}
		$.ajax({
	        type: "post", //请求方式
	        url: config.QueryService +"/"+serverName,
	        data: data, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var restext = $(xml).text();
	            if(restext=="false"){
	            	return;
	            }
	            restext = $.parseJSON(restext);

	            var xAxisdata = [];
	            var charsdata = [];
	            for (var i=0;i<restext.length;i++) {
	            	xAxisdata.push(restext[i].Name);
	            	charsdata.push(restext[i].Count);
	            }
	            query.xAxisdata = xAxisdata;
	            query.charsdata = charsdata;
	            query.chartitle = title;
	            query.inichars();
//	            layer.close(layer.loadIndex);
	        },
	        error: function (res) {
	        	restext = false;
	        	parent.layer.alert('访问服务器失败!');

	        }
	    });
	},
	loadjjclusterData:function(DM,servertype,cityName,QXname,XZname,CWHname){
		layer.loadIndex = layer.load(0, {shade: 0.1});
		this.clearlayer();
		this.loadScope(DM);
		if(servertype=="0"){
			var data = {
				'cityName':cityName
			};
			var serverName = "GetAllJJbyCityName";
		}else if(servertype=="1"){
			var data = {
				'cityName':cityName,
				'qx':QXname
			};
			var serverName = "GetAllJJbyQX";
		}else if(servertype=="2"){
			var data = {
				'cityName':cityName,
				'qx':QXname,
				'xz':XZname
			};
			var serverName = "GetAllJJbyXZ";
		}else if(servertype=="3"){
			var data = {
				'cityName':cityName,
				'qx':QXname,
				'xz':XZname,
				'cwh':CWHname
			};
			var serverName = "GetAllJJbyCWH";
		}
		$.ajax({
	        type: "post", //请求方式
	        url: config.QueryService +"/"+serverName,
	        data: data, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var restext = $(xml).text();
	            restext = $.parseJSON(restext);
	            var features1 = [];
				var features2 = [];
				var features3 = [];
				var features4 = [];
				var features5 = [];
				var features6 = [];
				var features7 = [];
				var features8 = [];
				var features9 = [];
				var MyDate = new Date();
                var year = MyDate.getFullYear();
	            for (var i=0;i<restext.length;i++) {
	            	var ID = restext[i].ID;
	            	var X = restext[i].X;
	        		var Y = restext[i].Y;
	        		var SFFQ = restext[i].SFFQ;//是否废弃
	        		var FQNF = restext[i].FQNF;//废弃年份
	        		var QX = restext[i].QX;//区县
	        		var JJYT = restext[i].JJYT;//机井用途
	        		var feature = new ol.Feature(new ol.geom.Point([X,Y]));
	        		feature.set("ID",ID);

	        		feature.set("X",X);
	        		feature.set("Y",Y);
	        		feature.set("SFFQ",SFFQ);
	        		feature.set("FQNF",FQNF);
	        		feature.set("QX",QX);
	        		feature.set("JJYT",JJYT);
	        		if(SFFQ=="是"&&FQNF!=year.toString()){//
						feature.set("color","#000");
						if(JJYT=="工业"){
	                        feature.set("form","circular");
	                        features1.push(feature);
						}else if(JJYT=="生活"){
							feature.set("form","rhombus");
							features2.push(feature);
						}else if(JJYT=="农业"){
							feature.set("form","square");
							features3.push(feature);
						}
					}
					if(SFFQ=="是"&&FQNF==year.toString()){
						feature.set("color","#FF3B30");
						if(JJYT=="工业"){
	                        feature.set("form","circular");
	                        features4.push(feature);
						}else if(JJYT=="生活"){
							feature.set("form","rhombus");
							features5.push(feature);
						}else if(JJYT=="农业"){
							feature.set("form","square");
							features6.push(feature);
						}
					}
					if(SFFQ=="否"){
						feature.set("color","#16A05D");
						if(JJYT=="工业"){
	                        feature.set("form","circular");
	                        features7.push(feature);
						}else if(JJYT=="生活"){
							feature.set("form","rhombus");
							features8.push(feature);
						}else if(JJYT=="农业"){
							feature.set("form","square");
							features9.push(feature);
						}
					}

	            }
                addclusters(features1,0);
	        	addclusters(features2,0);
	        	addclusters(features3,0);
	        	addclusters(features4,0);
	        	addclusters(features5,0);
	        	addclusters(features6,0);
	        	addclusters(features7,0);
	        	addclusters(features8,0);
	        	addclusters(features9,0);

	        	var nodes = ztreeObj.getNodesByParam("type", "机井", null);
	        	for (var i=0;i<nodes.length;i++) {
	        		ztreeObj.removeNode(nodes[i]);
	        	}
	        	var nodes = ztreeObj.getNodesByParam("name", "机井", null);
//	        	for (var i=0;i<query.layerList.length;i++) {
//
//	        	}
	        	ztreeObj.addNodes(nodes[0], {name:"已经关停工业",checked:true,type:'机井',index:0,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"已经关停生活",checked:true,type:'机井',index:1,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"已经关停农业",checked:true,type:'机井',index:2,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"计划关停工业",checked:true,type:'机井',index:3,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"计划关停生活",checked:true,type:'机井',index:4,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"计划关停农业",checked:true,type:'机井',index:5,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"正在运行工业",checked:true,type:'机井',index:6,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"正在运行生活",checked:true,type:'机井',index:7,icon:"js/zTreeStyle/img/diy/node1.png"});
	        	ztreeObj.addNodes(nodes[0], {name:"正在运行农业",checked:true,type:'机井',index:8,icon:"js/zTreeStyle/img/diy/node1.png"});
	            layer.close(layer.loadIndex);
	        },
	        error: function (res) {
	        	restext = false;
	        	parent.layer.alert('访问服务器失败!');

	        }
	    });
	},
	loadScope:function(DM){//加载行政区范围
		sourceXZQ.clear();
		$.ajax({
	        type: "post", //请求方式
	        url: config.QueryService +"/getGeometry",
	        data: {'xzqdm':DM}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: false,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var restext = $(xml).text();
	            if(restext=="false"){
	            	return;
	            }
	            restext = $.parseJSON(restext);
	            for (var i=0;i<restext.length;i++) {
	            	var Geometry =  restext[i].Geometry;
	            	var feature = _wktParser.readFeature(Geometry);
	            	sourceXZQ.addFeature(feature);
	            }

//	            layer.close(layer.loadIndex);
	        },
	        error: function (res) {
	        	restext = false;
	        	parent.layer.alert('访问服务器失败!');

	        }
	    });
	},
	cityfixed:function(citycoordinate){
		citycoordinate = citycoordinate.split(';');
		var lon1 = citycoordinate[0].split(',')[0];
		var lat1 = citycoordinate[0].split(',')[1];
		var lon2 = citycoordinate[1].split(',')[0];
		var lat2 = citycoordinate[1].split(',')[1];
		_mapView.fit([Number(lon1),Number(lat1),Number(lon2),Number(lat2)],_mapObject.getSize());
	},
	inichars:function(){

		var echartsType = $("#echartsType").val();
		if(echartsType=="pie"){
			var chartdata = [];
			for (var i=0;i<this.charsdata.length;i++) {
				var data = {
					name:query.xAxisdata[i],
					value:query.charsdata[i]
				};
				chartdata.push(data);
			}
			echarts.init(document.getElementById('chart'),'dark').setOption({
				backgroundColor: 'transparent',
				color:colorArr,
	            title: {
			        text: query.chartitle+'机井数量分布情况',
			        left: 10,
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{b} : {c} ({d}%)"
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        },
			        show:false
			    },
			    legend: {
			        bottom: 10,
			        left: 'center',
			        data: [],
			        show:true
			    },
			    series : [
			        {
			            type: echartsType,
			            radius : '65%',
			            center: ['50%', '50%'],
			            selectedMode: 'single',
			            data:chartdata

			        }
			    ]

			},true);
		}else{
			echarts.init(document.getElementById('chart'),'dark').setOption({
				backgroundColor: 'transparent',
				color:colorArr,
	            title: {
			        text: query.chartitle+'机井数量分布情况',
			        left: 10,
			    },
			    tooltip: {
			        trigger: 'axis',
			        formatter:""
			    },
			    legend: {
			        data:[],
			        show:false
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        },
			        show:false
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data:query.xAxisdata
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [
			        {
			            name:'数量',
			            type:echartsType,
			            stack: '数量',
			            data: query.charsdata
			        },

			    ]

			},true);
		}

	},
	querylayer:function(){//图层查询
		if(marker){
			_mapObject.removeOverlay(marker);
		}
		$(".queryfruitDiv").removeClass('hide');
//		var layername = $(" ").val();
		var layername = $("#layerstype input[type='radio']:checked").val();
		if(layername=="口门"){
			var layerstype = "GetKMbyCity";
		}else if(layername=="地表水厂（县）"){
			var layerstype = "GetDSSCbyCity";
		}else if(layername=="连村取水水厂"){
			var layerstype = "GetLCSCbyCity";
		}else if(layername=="加压泵站"){
			var layerstype = "GetBZbyCity";
		}
		$.ajax({
	        type: "post", //请求方式
	        url: config.QueryService +"/"+layerstype,
	        data: {'cityName':query.indexCity}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var restext = $(xml).text();
	            if(restext=="false"){
	            	return;
	            }
	            restext = $.parseJSON(restext);
	            query.querylayerRestext = restext;
	            addhtml(layername)

//	            layer.close(layer.loadIndex);
	        },
	        error: function (res) {
	        	restext = false;
	        	parent.layer.alert('访问服务器失败!');

	        }
	    });
	    function addhtml(layername){
	    	var str = "";
	    	for (var i=0;i<query.querylayerRestext.length;i++) {
                str+="<li layername='"+layername+"' index='"+i+"'>";
                str+="<p class='order'>"+(i+1)+".</p>";
            	if(layername=="口门"){
		 			str+="<p><span class='right5'>类型:</span>"+query.querylayerRestext[i].LX+"</p>";
		 			str+="<p><span class='right5'>名称:</span>"+query.querylayerRestext[i].NAME+"</p>";
				}else if(layername=="地表水厂（县）"){
					str+="<p><span class='right5'>名称:</span>"+query.querylayerRestext[i].NAME+"</p>";
				}else if(layername=="连村取水水厂"){
					str+="<p><span class='right5'>名称:</span>"+query.querylayerRestext[i].NAME+"</p>";
				}else if(layername=="加压泵站"){
					str+="<p><span class='right5'>名称:</span>"+query.querylayerRestext[i].NAME+"</p>";
				}
            	str+= "</li>"
            }
            $("#result-ul").html(str);
            $("#result-ul li").click(function(){
            	$("#result-ul li").removeClass('active');
            	$(this).addClass('active');
            	var layername = $(this).attr('layername');
            	var index = $(this).attr('index');
            	var X = query.querylayerRestext[index].X;
            	var Y = query.querylayerRestext[index].Y;
            	var str = "<div id='alertinfo'>";
				str+="<div class='san'></div><div class='layui-layer-title'>详细信息</div>";
				str+="<div class='layui-layer-content'>";
            	if(layername=="口门"){
		 			str+="<p>类型&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].LX+"</p>";
					str+="<p>名称&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].NAME+"</p>";
					str+="<p>描述&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].MS+"</p>"
				}else if(layername=="地表水厂（县）"){
					var Attributes = query.querylayerRestext[index].Attributes;
					for (var i=0;i<Attributes.length;i++) {
						str+="<p>"+Attributes[i].NAME+"&nbsp;:&nbsp;&nbsp;"+Attributes[i].VALUE+"</p>";
					}
				}else if(layername=="连村取水水厂"){
					str+="<p>名称&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].NAME+"</p>";
					str+="<p>覆盖范围&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].FGFW+"</p>"
				}else if(layername=="加压泵站"){
					str+="<p>名称&nbsp;:&nbsp;&nbsp;"+query.querylayerRestext[index].NAME+"</p>"
				}
				str+="</div>";
				str+="<span class='layui-layer-setwin'><i id='closeAlertInfo' class='layui-icon layui-icon-close'></i></span>";
				str+="</div>";
				document.getElementById("alertinfodiv").innerHTML = str;

				if(marker){
					_mapObject.removeOverlay(marker);
				}
				marker = new ol.Overlay({
			        element: document.getElementById('alertinfo'),
			        position: [X,Y],
			        positioning: 'left-left',
			        offset:[-35,35]
			    });
			    _mapObject.addOverlay(marker);
			    $("#closeAlertInfo").click(function(){
			    	source1.clear();
			    	_mapObject.removeOverlay(marker);
			    });

            	_mapView.setCenter([X,Y]);
            	_mapView.setZoom(15);
            })
		}
	},
	clear:function(){
		if(marker){
			_mapObject.removeOverlay(marker);
		}
		$(".queryfruitDiv").addClass('hide');
	},
	clearlayer:function(){
	    for (var i=0;i<this.layerList.length;i++) {
			_mapObject.removeLayer(this.layerList[i]);
		}
	    this.layerList = [];

	}

};
