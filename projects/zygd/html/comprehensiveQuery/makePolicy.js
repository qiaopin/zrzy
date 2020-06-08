var layuitable = null;
var layuiform = null;
var layuielement = null;
$(function(){
	// initmap();
    layui.use(['form', 'element', 'laydate', 'table', 'laypage', 'slider', 'ljfBase', 'serverCenter', 'LayerManager', 'NULayer', 'bluebird'], function () {
        $(".niceScroll").niceScroll({cursorborder:"",cursorcolor:"#297FBA",boxzoom:false});
	    layuiform = layui.form;
	    layuielement = layui.element;

        ljfBase = layui.ljfBase;
        var LayerManager = layui.LayerManager;
        var center = [114.48, 38.03];
        layerManager = new LayerManager("map", center, 12);
        _mapObject = layerManager._mapObject;

        ljfBase.post(ljfBase.https.BaseMapManagerService + "/GetAllBaseMap", {sprid: sessionStorage.sprid}, function (xml) {
            var resArr = $.parseJSON(xml);
            if (resArr.length == 0) {
                location.reload();
            }
            layerManager.loadBaseMap(resArr, "矢量");
            $('.maptab ul li').click(function () {
                $('.maptab ul li').removeClass("active");
                $(this).addClass("active");
                var type = $(this).find('a').attr('type');
                layerManager.hideBaseMap();
                layerManager.loadBaseMap(resArr, type);
            });
        });
	    
	    
	    layuielement.on('tab(tbody2-div)', function(data){
            baseCTJC1.setVisible(false);
            baseCTJC2.setVisible(false);
            baseCTJC3.setVisible(false);
		    if(data.index==0){
		   	    baseCTJC2.setVisible(true);
		    }else if(data.index==1){
		   	    baseCTJC1.setVisible(true);
		    }else if(data.index==2){
		   	    baseCTJC3.setVisible(true);
		    }
		});

        var str = "";
	    for (var i=0;i<config.item1.length;i++) {
	    	str+="<option>"+config.item1[i].name+"</option>";
	    }
	    $("#TDXZDL").html(str).change();
	    layuiform.render('select')
	    layuiform.on('select(TDXZDL)', function(data){
		  	$("#TDXZDL").val(data.value).change();
		});
	    
        layuiform.render('radio');
		layuiform.on('radio(radio1)', function(data){
		   if(data.value=="导入文件"){
		   	    $("#leading-in").show();
		   	    $("#mapdraw").hide();
		   }else{
		   	    $("#leading-in").hide();
		   	    $("#mapdraw").show();
		   }
		});
		layuiform.on('radio(radio2)', function(data){
		   if(data.value=="导入文件"){
		   	    $("#leading-in2").show();
		   	    $("#mapdraw2").hide();
		   }else{
		   	    $("#leading-in2").hide();
		   	    $("#mapdraw2").show();
		   }
		});
	
	   // GetAllXZQ();
	});
});

$("#TDXZDL").change(function(){
	var TDXZDL = $(this).val();
	var str = "";
    for (var i=0;i<config.item1.length;i++) {
    	if(config.item1[i].name==TDXZDL){
    		for (var j=0;j<config.item1[i].items.length;j++) {
    			str+="<option>"+config.item1[i].items[j].name+"</option>";
    		}
    	}
    }
    $("#TDXZZL").html(str);
    layuiform.render('select')
});
//获取所镇和村名称
function GetAllXZQ(){
    layer.loadIndex = layer.load(0, {shade: 0.1});
	$.ajax({
        type: "post", //请求方式
        url: config.GTService +"/GetAllXZQ",
        data: {}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
		    if($(xml).text().indexOf("false")>-1){
//          	layer.alert("未找到任何部件")
            	layer.close(layer.loadIndex);
            	var resjosn = [];
            }else{
            	var resjosn = $.parseJSON($(xml).text());
            }
            smalltowns = resjosn;
            var str = "";
		    for (var i=0;i<smalltowns.length;i++) {
		    	if((i+1)==smalltowns.length){
		    		str+="<tr>";
			    	str+="<td><input type='checkbox' name='checkbox'  value='"+smalltowns[i].ZMC+"' /><span>"+smalltowns[i].ZMC+"</span></td>";
			    	str+="</tr>";
		    	}else{
		    		str+="<tr>";
			    	str+="<td><input type='checkbox' name='checkbox'  value='"+smalltowns[i].ZMC+"' /><span>"+smalltowns[i].ZMC+"</span></td>";
			    	str+="<td><input type='checkbox' name='checkbox'  value='"+smalltowns[(i+1)].ZMC+"' /><span>"+smalltowns[(i+1)].ZMC+"</span></td>";
			    	str+="</tr>";
		    	}
		    	i++;
		    }

		    $("#tbody").html(str);
			  layer.close(layer.loadIndex);
	    },
        error: function (res) {
        	layer.alert('访问服务器失败!');
        }
    });
}


$("#allsel").change(function(){
	if($(this).prop('checked')){
		$("#tbody tr td input[type='checkbox']").prop('checked',true);
	}else{
		$("#tbody tr td input[type='checkbox']").prop('checked',false);
	}
});


$("#analyse").click(function(){
	var str = "";
	var checkArr = $("#tbody tr td input[name='checkbox']:checkbox:checked").each(function(i,v){
		if(str!=""){
			str+=",";
		}
		str+=$(this).val();
	});
	if(str==""){
		layer.alert("请选择乡镇!");
		return;
	}
	var type = $(".find-type-btn button[class='active']").val();
	if(type=="0"){
		
		var year = $(".find-msg-box input[name='radio']:checked").val()
		
		$("#table thead").addClass('hide');
		$("#table thead[value='0']").removeClass('hide');
		TDLYQuery(year+"|"+str+"|"+type);
	}else{
		var year = $(".find-msg-box input[name='radio1']:checked").val()
		$("#table thead").addClass('hide');
		$("#table thead[value='1']").removeClass('hide');
		TDLYQuery1(year+"|"+str+"|"+type);
	}
});

//分析
function TDLYQuery(str){
    layer.loadIndex = layer.load(0, {shade: 0.1});
	$.ajax({
        type: "post", //请求方式
        url: config.GTService +"/TDLYQuery",
        data: {'str':str}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            if($(xml).text().indexOf("false")>-1){
            	layer.close(layer.loadIndex);
            	var resjosn = [];
            }else{
            	var resjosn = $.parseJSON($(xml).text());
            }
            var str = "";
            var data = [];
 			for (var i=0;i<resjosn.length;i++) {
				str+="<tr>";
				str+="<td>"+resjosn[i]['镇名称']+"</td><td>"+resjosn[i]["'农用地'"]+"</td><td>"+resjosn[i]["'建设用地'"]+"</td><td>"+resjosn[i]["'未利用地'"]+"</td>";
				str+="</tr>";
			    data.push({
			    	"name":resjosn[i]['镇名称'],
			    	"data":[resjosn[i]["'农用地'"],resjosn[i]["'建设用地'"],resjosn[i]["'未利用地'"]]
			    })
			}
			$(".result-find-box").show();
			$("#tbody1").html(str);
			charts(data,0);
			layer.close(layer.loadIndex);
	    },
        error: function (res) {
        	layer.alert('访问服务器失败!');
        }
    });
}

//八大类
function TDLYQuery1(str){
    layer.loadIndex = layer.load(0, {shade: 0.1});
	$.ajax({
        type: "post", //请求方式
        url: config.GTService +"/TDLYQuery",
        data: {'str':str}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            if($(xml).text().indexOf("false")>-1){
            	layer.close(layer.loadIndex);
            	var resjosn = [];
            }else{
            	var resjosn = $.parseJSON($(xml).text());
            }
            var str = "";
            var data = [];
 			for (var i=0;i<resjosn.length;i++) {
 				var td1 = resjosn[i]["'耕地'"]==null || resjosn[i]["'耕地'"]==undefined?0:resjosn[i]["'耕地'"];
 				var td2 = resjosn[i]["'园地'"]==null || resjosn[i]["'园地'"]==undefined?0:resjosn[i]["'园地'"];
 				var td3 = resjosn[i]["'林地'"]==null || resjosn[i]["'林地'"]==undefined?0:resjosn[i]["'林地'"];
 				var td4 = resjosn[i]["'草地'"]==null || resjosn[i]["'草地'"]==undefined?0:resjosn[i]["'草地'"];
 				var td5 = resjosn[i]["'城镇村及工矿用地'"]==null || resjosn[i]["'城镇村及工矿用地'"]==undefined?0:resjosn[i]["'城镇村及工矿用地'"];
 				var td6 = resjosn[i]["'交通运输用地'"]==null || resjosn[i]["'交通运输用地'"]==undefined?0:resjosn[i]["'交通运输用地'"];
 				var td7 = resjosn[i]["'水域及水利设施用地'"]==null || resjosn[i]["'水域及水利设施用地'"]==undefined?0:resjosn[i]["'水域及水利设施用地'"];
 				var td8 = resjosn[i]["'其他土地'"]==null || resjosn[i]["'其他土地'"]==undefined?0:resjosn[i]["'其他土地'"];
 				str+="<tr>";
				str+="<td>"+resjosn[i]['镇名称']+"</td><td>"+td1+"</td><td>"+td2+"</td><td>"+td3+"</td>";
				str+="<td>"+td4+"</td><td>"+td5+"</td><td>"+td6+"</td><td>"+td7+"</td><td>"+td8+"</td>";
				str+="</tr>";
			    data.push({
			    	"name":resjosn[i]['镇名称'],
			    	"data":[
			    	   td1,td2,td3,td4,td5,td6,td7,td8
			    	]
			    })
			}
			$(".result-find-box").show();
			$("#tbody1").html(str);
			charts(data,1);
			layer.close(layer.loadIndex);
	    },
        error: function (res) {
        	layer.alert('访问服务器失败!');
        }
    });
}

function charts(data,type){
	if(type==0){
		var categories = ['农用地面积','建设用地面积','未利用地面积']
	}else{
		var categories = ['耕地','园地','林地','草地','城镇村及工矿用地','交通运输用地','水域及水利设施用地','其他土地']
	}
	var chart = Highcharts.chart('container',{
	    chart: {
	        type: 'column'
	    },
	   title: {
            text: ""
        },
        subtitle: {
            text: ''
        },
        credits: {
				enabled : false
			},
	    xAxis: {
	        categories: categories,
	        crosshair: true
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '面积',
	            enabled:false
	        },
	       
	    },
	    tooltip: {
	        // head + 每个 point + footer 拼接成完整的 table
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	        '<td style="padding:0"><b>{point.y:.1f}平方米</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
	        column: {
	            borderWidth: 0
	        }
	    },
	    series:data
	});
}



$('.find-type-btn button').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var idx = $(this).index('.find-type-btn button');
    $('.find-msg-box').eq(idx).show();
    $('.find-msg-box').not($('.find-msg-box').eq(idx)).hide(); 
});

$(".close-btn").click(function(){
	$(".result-find-box").hide();
});

$(".item1").click(function(){
	$(".item1").removeClass('active3');
	$(this).addClass('active3');
	var cid = $(this).attr('id');
	$(".msg-tab-box").hide();
	$("div[cid='"+cid+"']").show();
	$(".result-find-box2,.result-find-box1,.ctfxfwmj").hide();
	baseCTJC0.setVisible(false);
	baseCTJC1.setVisible(false);
    baseCTJC2.setVisible(false);
    baseCTJC3.setVisible(false);
	mapclear();
});

$(".mapdraw li").click(function(){
	$(".mapdraw li").removeClass('active');
	$(this).addClass('active');
});

$("#selectFile").click(function(){
	$("#SelectFiled").click();
});

function SelectFiled(){
	var selectedFile = document.getElementById('SelectFiled').files[0];
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    var reader = new FileReader();//这是核心,读取操作就是由它完成.
    var tex = reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
    reader.onload = function () {
        $("#FiledPath").val(this.result);
        readCoordinatesstr(this.result)
    }
}

//导出
$("#export").click(function(){
	var table = document.getElementById("table2");
    if (getExplorer() == "Chrome") {
        tableToExcelChrome(table);
    } else {
        setTableToExcel(table);
    }
    
    var table = document.getElementById("table2_TG");
    if (getExplorer() == "Chrome") {
        tableToExcelChrome(table);
    } else {
        setTableToExcel(table);
    }
    
    var table = document.getElementById("table2_ZDXM");
    if (getExplorer() == "Chrome") {
        tableToExcelChrome(table);
    } else {
        setTableToExcel(table);
    }
    
    var table = document.getElementById("table2-detailed");
    if (getExplorer() == "Chrome") {
        tableToExcelChrome(table);
    } else {
        setTableToExcel(table);
    }
});

$("#selectFile1").click(function(){
	$("#SelectFiled1").click();
});
function SelectFiled1(){
	var selectedFile = document.getElementById('SelectFiled1').files[0];
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    var reader = new FileReader();//这是核心,读取操作就是由它完成.
    var tex = reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
    reader.onload = function () {
        $("#FiledPath1").val(this.result); 
        readCoordinatesstr(this.result)
    }
}

function readCoordinatesstr(COORDINATE){
	var COORDINATE = COORDINATE.split(';');
	var Coordinatesstr = "POLYGON((";
	for (var i=0;i<COORDINATE.length;i++) {
			var lon = COORDINATE[i].split(',')[0];
			var lat = COORDINATE[i].split(',')[1];
			if(i!=0){
	    		Coordinatesstr+=","
	    	}
	    	Coordinatesstr+=lon+" "+lat;
	}
	Coordinatesstr+="))";
	source = new ol.source.Vector();
	vector.setSource(source);
	var feature = _wktParser.readFeature(Coordinatesstr);
	source.addFeature(feature);
	_mapView.fit(source.getExtent(),_mapObject.getSize());
	_mapObject.addLayer(_vector);
	
	scope = feature.getGeometry();
	var flatCoordinates = scope.flatCoordinates;
	var points1 = getPoints(flatCoordinates);
    var area1 = PolygonArea(points1,points1.length-1);
    $(".ctfxfwmj").html("项目范围面积"+(area1/1000000).toFixed(2)+"km²").show();
}

//合规审查
var complianceExamine =  {
	detailedObj:{"01":null,"02":null,"03":null},
	hgscCheck:function(){
		var ydlx = $("#YDLX").val();
		
	    if(!scope){
			layer.alert("请绘制检查范围!") 
			return
		}
		this.query(scope,ydlx)
	},
	query:function(scope,ydlx){
		var extent = scope.getExtent();
		var flatCoordinates = scope.flatCoordinates;
		var points1 = getPoints(flatCoordinates);
	    var area1 = PolygonArea(points1,points1.length-1);
		var queryurl = querylayerUrl.CTJC+"/2/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
	    layer.loadIndex = layer.load(0, {shade: 0.1});
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
	            if(resjosn.features.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            queryFruit = resjosn.features;
	            var str = "";
	            var length = 0;
	            var cylx01 = {length:0,areaTotal:0,detailed:[]};
	            var areaTotal = 0;
	            if(resjosn.features){
	            	for (var i=0;i<resjosn.features.length;i++) {
	            		var ZL = resjosn.features[i].attributes.ZL;
	            		if(config.hgsc[ydlx].CG.indexOf(ZL)==-1){
	            			var area = 0;
	            			var area3 = 0
		            		for(var m = 0;m<resjosn.features[i].geometry.rings.length;m++){
				            	var pointArr = resjosn.features[i].geometry.rings[m];
				            	var points = [];
				            	for (var j=0;j<pointArr.length;j++) {
				            		var point = {
				            			x:pointArr[j][0],
				            			y:pointArr[j][1]
				            		}
			                        point = BL2XY(point);
				            		points.push(point);
				            	}
				            	var points11 = getPoints(flatCoordinates);
				            	var areaTemp = PolygonArea(points,points.length-1);
				            	var area2= SPIA(points11,points,points11.length-1,points.length - 1);
				            	area2 = Math.abs(area2);
				            	if(m==0){
				            		area = area2;
				            		area3+=areaTemp;
				            	}
				            	else{
				            		area -= area2;
				            		area3-=areaTemp;
				            	}
				            	
				            	
			            	}
		            		if(area>area3){
		            			area = area3;
		            		}
		            		area = Math.abs(area);
		            		area3 = Math.abs(area3);
		            		var obj = {
		            			CTMJ:area,
		            			DKMJ:area3,
		            			RINGS:resjosn.features[i].geometry.rings
		            		}
		            		
		            		cylx01.detailed.push(obj);
		            		cylx01.length++
		            		cylx01.areaTotal+=area;
	            		}
		            }
	            	str+="<tr><td></td><td>0</td><td>"+cylx01.areaTotal.toFixed(2)+"</td><td>"+(cylx01.areaTotal*100/area1).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=complianceExamine.detailed('01')>地块详情</a></td></tr>"
	            	
	            	
	            }
	            complianceExamine.detailedObj["01"]=cylx01;
	            $("#tbody2").html(str);
	            $("#result-title-text").html("项目合规性审查结果");
	            $("#tbody2-div").show();$("#tbody2-detailed-div").hide();
//	            $("#result-fzxz").hide();
                $("#result-ctfx,#result-fzxz").hide();
	            $(".result-find-box2,.result-find-box1,#result-hgsc,.ctfxfwmj").show();
	            $("#resnav1").html("<a href='javascript:;'>分析结果</a>>");
	            baseCTJC2.setVisible(true);
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');
	        	
	        }
	    });
	    
	    var queryurl = querylayerUrl.CTJC+"/1/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
		$.ajax({//土规
	        type: "post", //请求方式
	        url: queryurl,
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON(xml);
	            if(resjosn.features.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            queryFruit = resjosn.features;
	            var str = "";
	            var length = 0;
	            var cylx02 = {length:0,areaTotal:0,detailed:[]};
	            var areaTotal = 0;
	            if(resjosn.features){
	            	for (var i=0;i<resjosn.features.length;i++) {
	            		var GHDLMC = resjosn.features[i].attributes.GHDLMC;
	            		if(config.hgsc[ydlx].TG.indexOf(GHDLMC)==-1){
	            			var area=0;
	            			var area3 = 0
	            			var DKMJ = 0;
		            		for(var m = 0;m<resjosn.features[i].geometry.rings.length;m++){
				            	var pointArr = resjosn.features[i].geometry.rings[m];
				            	var points = [];
				            	for (var j=0;j<pointArr.length;j++) {
				            		var point = {
				            			x:pointArr[j][0],
				            			y:pointArr[j][1]
				            		}
			                        point = BL2XY(point);
				            		points.push(point);
				            	}
			                    var points11 = getPoints(flatCoordinates);
			                    var areaTemp = PolygonArea(points,points.length-1);
				            	var area2= SPIA(points11,points,points11.length - 1,points.length - 1);
				            	DKMJ += Math.abs(PolygonArea(points,points.length - 1));
				            	area2 = Math.abs(area2);
				            	if(m==0){
				            		area = area2;
				            		area3+=areaTemp
				            	}
				            	else{
				            		area -= area2;
				            		area3-=areaTemp
				            	}
			            	}
		            		if(area>area3){
		            			area = area3;
		            		}
		            		area = Math.abs(area);
		            		area3 = Math.abs(area3);
		            		var obj = {
		            			CTMJ:area,
		            			DKMJ:area3,
		            			RINGS:resjosn.features[i].geometry.rings
		            		}
		            		cylx02.detailed.push(obj);
		            		cylx02.length++
		            		cylx02.areaTotal+=area;
	            		}
		            }
	            	str+="<tr><td></td><td>0</td><td>"+cylx02.areaTotal.toFixed(2)+"</td><td>"+(cylx02.areaTotal*100/area1).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=complianceExamine.detailed('02')>地块详情</a></td></tr>"
	            	
	            	
	            }
	            complianceExamine.detailedObj["02"]=cylx02;
	            $("#tbody2_TG").html(str);
	            $("#result-title-text").html("项目合规性审查结果");
	            $("#tbody2-div").show();$("#tbody2-detailed-div").hide();
//	            $("#result-fzxz").hide();
                $("#result-ctfx,#result-fzxz").hide();
	            $(".result-find-box2,.result-find-box1,#result-hgsc,.ctfxfwmj").show();
	            $("#resnav1").html("<a href='javascript:;'>分析结果</a>>");
	            baseCTJC2.setVisible(true);
	            
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');
	        	
	        }
	    });
	    
	    var queryurl = querylayerUrl.CTJC+"/3/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
		$.ajax({//重点项目
	        type: "post", //请求方式
	        url: queryurl,
	        data: {}, //参数
	        dataType: "text", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	            var resjosn = $.parseJSON(xml);
	            if(resjosn.features.length<1){
	            	layer.close(layer.loadIndex);
	            	return;
	            }
	            queryFruit = resjosn.features;
	            var str = "";
	            var length = 0;
	            var cylx03 = {length:0,areaTotal:0,detailed:[]};
	            var areaTotal = 0;
	            if(resjosn.features){
	            	for (var i=0;i<resjosn.features.length;i++) {
	            		var area=0;
            			var DKMJ = 0;
            			var area3 = 0;
	            		for(var m = 0;m<resjosn.features[i].geometry.rings.length;m++){
			            	var pointArr = resjosn.features[i].geometry.rings[m];
			            	var points = [];
			            	for (var j=0;j<pointArr.length;j++) {
			            		var point = {
			            			x:pointArr[j][0],
			            			y:pointArr[j][1]
			            		}
		                        point = BL2XY(point);
			            		points.push(point);
			            	}
		                    
		                    var points11 = getPoints(flatCoordinates);
			            	var area2= SPIA(points11,points,points11.length - 1,points.length - 1);
			            	DKMJ += Math.abs(PolygonArea(points,points.length - 1));
			            	area2 = Math.abs(area2);
			            	if(m==0){
				            		area = area2;
				            		area3+=PolygonArea(points,points.length-1);
				            	}
				            	else{
				            		area -= area2;
				            		area3-=PolygonArea(points,points.length-1);
				            	}
		            	}
	            		if(area>area3){
	            			area = area3;
	            		}
	            		var obj = {
	            			CTMJ:area,
	            			DKMJ:area3,
	            			RINGS:resjosn.features[i].geometry.rings
	            		}
	            		cylx03.detailed.push(obj);
	            		cylx03.length++
	            		cylx03.areaTotal+=area;
		            }
	            	str+="<tr><td></td><td>0</td><td>"+cylx03.areaTotal.toFixed(2)+"</td><td>"+(cylx03.areaTotal*100/area1).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=complianceExamine.detailed('03')>地块详情</a></td></tr>"
	            	
	            	
	            }
	            complianceExamine.detailedObj["03"]=cylx03;
	            $("#tbody2_ZDXM").html(str);
	            $("#result-title-text").html("项目合规性审查结果");
	            $("#tbody2-div").show();$("#tbody2-detailed-div").hide();
//	            $("#result-fzxz").hide();
                $("#result-ctfx,#result-fzxz").hide();
	            $(".result-find-box2,.result-find-box1,#result-hgsc,.ctfxfwmj").show();
	            $("#resnav1").html("<a href='javascript:;'>分析结果</a>>");
	            baseCTJC2.setVisible(true);
	            
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');
	        	
	        }
	    });
	    layer.close(layer.loadIndex);
	},
	detailed:function(index){
		$("#tbody2-div").hide();$("#tbody2-detailed-div").show();
		$("#resnav1").html("<a id='ret1' href='javascript:;'>分析结果</a>>");
		$("#ret1").click(function(){
			$("#tbody2-div").show();$("#tbody2-detailed-div").hide();
			$("#resnav").html("<a id='ret1' href='javascript:;'>分析结果</a>>");
		})
		var detailed = this.detailedObj[index].detailed;
		var str = "";
		for (var i=0;i<detailed.length;i++) {
			str+="<tr ondblclick=complianceExamine.lightPolygon('"+i+"','"+index+"')><td>"+(i+1)+"</td><td>"+detailed[i].CTMJ.toFixed(2)+"</td><td>"+detailed[i].DKMJ.toFixed(2)+"</td></tr>"
		}
		$("#tbody2-detailed").html(str);
	},
	lightPolygon:function(i,index){
		if(_vector){
	    	_mapObject.removeLayer(_vector);
	    }
		var RINGS = this.detailedObj[index].detailed[i].RINGS[0];
		var Coordinatesstr = "POLYGON((";
	    for (var i=0;i<RINGS.length;i++) {
	    	if(i!=0){
	    		Coordinatesstr+=","
	    	}
	    	Coordinatesstr+=RINGS[i][0]+" "+RINGS[i][1];
	    }
	    Coordinatesstr+="))";
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
		var feature = _wktParser.readFeature(Coordinatesstr);
		_source.addFeature(feature);
		_mapView.fit(_source.getExtent(),_mapObject.getSize());
		_mapObject.addLayer(_vector);
		_vector.setVisible(true);
	}
}

//冲突分析

$("#ctfx-check").click(function(){
	if(!scope){
		layer.alert("请绘制检查范围!") 
		return
	}
	query(scope);
})
var queryFruit = [];
var detailedObj = {};
function query(scope){
    baseCTJC0.setVisible(true);
	var extent = scope.getExtent();
	var flatCoordinates = scope.flatCoordinates;
	var points1 = getPoints(flatCoordinates);
    var area1 = PolygonArea(points1,points1.length-1);
	var queryurl = querylayerUrl.CTJC+"/0/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
    layer.loadIndex = layer.load(0, {shade: 0.1});
	$.ajax({
        type: "post", //请求方式
        url: queryurl,
        data: {}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: true,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            var resjosn = $.parseJSON(xml);
            if(resjosn.features.length<1){
            	layer.close(layer.loadIndex);
            	return;
            }
            queryFruit = resjosn.features;
            var str = "";
            var length = 0;
            var cylx01 = {length:0,areaTotal:0,detailed:[]};
            var cylx02 = {length:0,areaTotal:0,detailed:[]};
            var cylx03 = {length:0,areaTotal:0,detailed:[]};
            var cylx04 = {length:0,areaTotal:0,detailed:[]};
            var areaTotal = 0;
            if(resjosn.features){
            	for (var i=0;i<resjosn.features.length;i++) {
            		var CYLX = resjosn.features[i].attributes.CYLX;
            		var area=0;
            		for(var m = 0;m<resjosn.features[i].geometry.rings.length;m++){
		            	var pointArr = resjosn.features[i].geometry.rings[m];
	            	    
		            	var points = [];
		            	for (var j=0;j<pointArr.length;j++) {
		            		var point = {
		            			x:pointArr[j][0],
		            			y:pointArr[j][1]
		            		}
	                        point = BL2XY(point);
		            		points.push(point);
		            	}
		            	var points11 = getPoints(flatCoordinates);
	                    var area2= SPIA(points11,points,points11.length-1,points.length - 1);
//		            	var area2= SPIA(,points);
		            	//if(area==0){
		            	//	area = SPIA(points,points1);
		            	//}
		            	area2 = Math.abs(area2);
		            	if(m==0){
		            		area = area2;
		            	}
		            	else{
		            		area -= area2;
		            	}
	            	}
            		var obj = {
            			CTMJ:area,
            			DKMJ:resjosn.features[i].attributes.DKMJ,
            			CGDL:resjosn.features[i].attributes.CGYDXZ,
            			TGDL:resjosn.features[i].attributes.TGYDXZ,
            			RINGS:resjosn.features[i].geometry.rings
            		}
	            	if(CYLX=="01"){
	            		cylx01.detailed.push(obj);
	            		cylx01.length++
	            		cylx01.areaTotal+=area;
	            	}else if(CYLX=="02"){
	            		cylx02.detailed.push(obj);
	            		cylx02.length++
	            		cylx02.areaTotal+=area;
	            	}else if(CYLX=="03"){
	            		cylx03.detailed.push(obj);
	            		cylx03.length++
	            		cylx03.areaTotal+=area;
	            	}else if(CYLX=="04"){
	            		cylx04.detailed.push(obj);
	            		cylx04.length++
	            		cylx04.areaTotal+=area;
	            	}
	            }
            	var _areaTotal = cylx01.areaTotal+cylx02.areaTotal+cylx03.areaTotal+cylx04.areaTotal;
            	str+="<tr><td><i class='legend1' style='background: #FFFF00;'></i></td><td title='二规均为非建设用地'>二规均为非建设用地</td><td>"+cylx01.length+"</td><td title='"+cylx01.areaTotal.toFixed(2)+"'>"+cylx01.areaTotal.toFixed(2)+"</td><td>"+(cylx01.areaTotal*100/_areaTotal).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=detailed('01','二规均为非建设用地')>地块详情</a></td></tr>"
            	str+="<tr><td><i class='legend1' style='background: #00FF00;'></i></td><td title='二规均为建设用地'>二规均为建设用地</td><td>"+cylx02.length+"</td><td title='"+cylx02.areaTotal.toFixed(2)+"'>"+cylx02.areaTotal.toFixed(2)+"</td><td>"+(cylx02.areaTotal*100/_areaTotal).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=detailed('02','二规均为非建设用地')>地块详情</a></td></tr>"
            	str+="<tr><td><i class='legend1' style='background: #EE7600;'></i></td><td title='土规建设用地、城规非建设用地'>土规建设用地、城规非建设用地</td><td>"+cylx03.length+"</td><td title='"+cylx03.areaTotal.toFixed(2)+"'>"+cylx03.areaTotal.toFixed(2)+"</td><td>"+(cylx03.areaTotal*100/_areaTotal).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=detailed('03','土规建设用地、城规非建设用地')>地块详情</a></td></tr>"
            	str+="<tr><td><i class='legend1' style='background: #8E8E38;'></i></td><td title='土规非建设用地、城规建设用地'>土规非建设用地、城规建设用地</td><td>"+cylx04.length+"</td><td title='"+cylx04.areaTotal.toFixed(2)+"'>"+cylx04.areaTotal.toFixed(2)+"</td><td>"+(cylx04.areaTotal*100/_areaTotal).toFixed(2)+"%</td><td><a class='info' href='javascript:;' onclick=detailed('04','土规非建设用地、城规建设用地')>地块详情</a></td></tr>"
            	
            }
            detailedObj["01"]=cylx01;
            detailedObj["02"]=cylx02;
            detailedObj["03"]=cylx03;
            detailedObj["04"]=cylx04;
            $("#tbody3").html(str);
            $("#result-title-text").html("项目合规性审查结果");
            $("#tbody3-div").show();$("#tbody3-detailed-div").hide();
            $("#result-fzxz,#result-hgsc").hide();
            $(".result-find-box2,.result-find-box1,#result-ctfx,.ctfxfwmj").show();
            $("#resnav").html("<a href='javascript:;'>分析结果</a>>");
            layer.close(layer.loadIndex);
        },
        error: function (res) {
        	layer.alert('访问服务器失败!');
        	
        }
    });
    
    
};

function getPoints(flatCoordinates){
	var points1 = [];
    for (var i=0;i<flatCoordinates.length;i=i+2) {
    	var lon = flatCoordinates[i];
    	var lat = flatCoordinates[i+1];
        var point = {
			x:Number(lon),
			y:Number(lat)
		}
        point = BL2XY(point);		
		points1.push(point);
          
    }
    return points1;
}
//地块详情
function detailed(index,title){
	$("#tbody3-div").hide();$("#tbody3-detailed-div").show();
	$("#resnav").html("<a id='ret' href='javascript:;'>分析结果</a>>"+title);
	$("#ret").click(function(){
		$("#tbody3-div").show();$("#tbody3-detailed-div").hide();
		$("#resnav").html("<a id='ret' href='javascript:;'>分析结果</a>>");
	})
	var detailed = detailedObj[index].detailed;
	var str = "";
	for (var i=0;i<detailed.length;i++) {
		str+="<tr ondblclick=lightPolygon('"+i+"','"+index+"')><td>"+(i+1)+"</td><td>"+detailed[i].CTMJ.toFixed(2)+"</td><td>"+detailed[i].DKMJ.toFixed(2)+"</td><td>"+detailed[i].TGDL+"</td><td>"+detailed[i].CGDL+"</td></tr>"
	}
	$("#tbody3-detailed").html(str);
}
//双击高亮
function lightPolygon(i,index){
	if(_vector){
    	_mapObject.removeLayer(_vector);
    }
	var RINGS = detailedObj[index].detailed[i].RINGS[0];
	var Coordinatesstr = "POLYGON((";
    for (var i=0;i<RINGS.length;i++) {
    	if(i!=0){
    		Coordinatesstr+=","
    	}
    	Coordinatesstr+=RINGS[i][0]+" "+RINGS[i][1];
    }
    Coordinatesstr+="))";
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
	var feature = _wktParser.readFeature(Coordinatesstr);
	_source.addFeature(feature);
	_mapView.fit(_source.getExtent(),_mapObject.getSize());
	_mapObject.addLayer(_vector);
	_vector.setVisible(true);
}

$("#up").click(function(){
	$(".result-find-box1,.result-find-box2").hide(1000);
})


//辅助选址

var assistSiteSelection = {
	result:[],
	geometry:[],
	siteSelection:function(){
	    var minArea =  $("#minArea").val();
	    if(minArea==""){
	   	    layer.alert('请输入项目用地面积!');
	   	    return;
	    }
	    var maxArea =  $("#maxArea").val();
	    if(maxArea==""){
	   	    layer.alert('请输入最大项目用地面积!');
	   	    return;
	    }
	    var TDXZZL = $("#TDXZZL").val();
	    this.query(TDXZZL,Number(minArea),Number(maxArea))
	},
	query:function(TDXZZL,minArea,maxArea){
		baseCTJC2.setVisible(true);
		var geturl=encodeURI(querylayerUrl.CTJC+"/find");
		$.ajax({
	        type: "post", //请求方式
	        url: geturl,
	        data: {"searchText":TDXZZL,"searchFields":"TDSYXZMC","layers":"2","returnGeometry":true,"f":"json"}, //参数
	        dataType: "json", //返回文本
	        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
	        async: true,
	        cache: false,
	        global: false,
	        //请求成功后的回调函数
	        success: function (xml) {
	        	if(xml.results.length>0){
	        		var resultstr="";
	        		var length = 2;
	        		var sortArr = [];
	        		for (var i=0;i<xml.results.length;i++) {
	        			var result=xml.results[i];
	        			var attributes=result.attributes;
	        			var geometry=result.geometry.rings;
	        		    var DKMJ = attributes["DKMJ"];
	        		    if(DKMJ>=minArea&&DKMJ<=maxArea){
	        		       sortArr.push(xml.results[i])
	        		    }
	        			
	        		}
	        		
	        		for(var m=0;m<sortArr.length-1;m++)
	            	{
	            		var temp1 = sortArr[m];
	            		for(var n=m+1;n<sortArr.length;n++)
	            		{
	            		    var temp2 = sortArr[n];
	            		    if(Number(temp1.attributes['DKMJ']) > Number(temp2.attributes['DKMJ']))
	            		    {
	            		    	sortArr[n]=temp1;
	            		    	sortArr[m]=temp2;
	            		    	temp1 = temp2;
	            		    }
	            		}
	            	}
	        		
	        		
//	        		sortArr.sort();
	        		resultstr+="<li onclick=assistSiteSelection.lightPolygon('"+(sortArr.length-1)+"')><p class='order'>1.<span class='recommend'>推荐</span></p><p><span class='right5'>土地面积:</span>"+sortArr[sortArr.length-1].attributes['DKMJ']+"平方米</p>"
	        		resultstr+="<p><span class='right5'>规划利用类型:</span>"+TDXZZL+"</p></li>"
	        		for (var i=0;i<sortArr.length-1;i++) {
	        			resultstr+="<li onclick=assistSiteSelection.lightPolygon('"+i+"')><p class='order'>"+length+".</p><p><span class='right5'>土地面积:</span>"+sortArr[i].attributes['DKMJ']+"平方米</p>"
//	        		    resultstr+="<li><p class='order'>1.<span class='recommend'>推荐</span></p><p><span class='right5'>土地面积:</span>281233.44平方米</p>"
	        		    resultstr+="<p><span class='right5'>规划利用类型:</span>"+TDXZZL+"</p></li>"
	        		    length++
	        			
	        		}
	        		assistSiteSelection.result = sortArr;
	        		$("#result-title-text").html("选址结果");
	        		$('#result-fzxz-ul').html(resultstr);
	        		$("#result-ctfx,#result-hgsc,.ctfxfwmj").hide();
	        		$(".result-find-box2,.result-find-box1,#result-fzxz").show();
	        	}else{
	        	     layer.alert('未查询到结果!');
	        	}
	           
	        },
	        error: function (res) {
	        	layer.alert('访问服务器失败!');
	        }
	    });
	},
	lightPolygon:function(i){
		if(_vector){
	    	_mapObject.removeLayer(_vector);
	    }
		var RINGS = this.result[i].geometry.rings[0];
		var Coordinatesstr = "POLYGON((";
	    for (var i=0;i<RINGS.length;i++) {
	    	if(i!=0){
	    		Coordinatesstr+=","
	    	}
	    	Coordinatesstr+=RINGS[i][0]+" "+RINGS[i][1];
	    }
	    Coordinatesstr+="))";
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
		var feature = _wktParser.readFeature(Coordinatesstr);
		_source.addFeature(feature);
		_mapView.fit(_source.getExtent(),_mapObject.getSize());
		_mapObject.addLayer(_vector);
		_vector.setVisible(true);
	}
}

