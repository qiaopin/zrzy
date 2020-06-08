

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
	    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
	    
	    ajaxPost(queryurl,{},false,function(xml){
	    	if(xml.indexOf("false")>-1){
            	parent.layer.alert("访问服务器失败");
            	parent.layer.close(parent.layer.loadIndex);
            	return;
            }
	    	var resjosn = $.parseJSON(xml);
            if(resjosn.features.length<1){
            	parent.layer.close(parent.layer.loadIndex);
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
	    
	    })
	    
	    var queryurl = querylayerUrl.CTJC+"/1/query?f=json&outFields=*&where=1=1&returnGeometry=true&esriGeometryEnvelope&geometry=";
	    queryurl+= extent[0]+","+extent[1]+","+extent[2]+","+extent[3];
	    ajaxPost(queryurl,{},false,function(xml){
	    	if(xml.indexOf("false")>-1){
            	parent.layer.alert("访问服务器失败");
            	parent.layer.close(parent.layer.loadIndex);
            	return;
            }
	    	var resjosn = $.parseJSON(xml);
            if(resjosn.features.length<1){
            	parent.layer.close(parent.layer.loadIndex);
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
	    })
		
	    
	   
	    parent.layer.close(parent.layer.loadIndex);
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
			str+="<tr ondblclick=complianceExamine.lightPolygon('"+i+"','"+index+"')><td style='width:50px;'>"+(i+1)+"</td><td style='width:240px;'>"+detailed[i].CTMJ.toFixed(2)+"</td><td>"+detailed[i].DKMJ.toFixed(2)+"</td></tr>"
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

		            	area2 = Math.abs(area2);
		            	if(m==0){
		            		area = area2;
		            	}
		            	else{
		            		area -= area2;
		            	}
	            	}
            		area = Math.abs(area);
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
		str+="<tr ondblclick=lightPolygon('"+i+"','"+index+"')><td style='width:50px;'>"+(i+1)+"</td><td style='width:90px;'>"+detailed[i].CTMJ.toFixed(2)+"</td><td style='width:90px;'>"+detailed[i].DKMJ.toFixed(2)+"</td><td style='width:90px;'>"+detailed[i].TGDL+"</td><td>"+detailed[i].CGDL+"</td></tr>"
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
	_mapView.fit(_source.getExtent(),_mapObject.getSize());
	_mapObject.addLayer(_vector);
	_vector.setVisible(true);
}


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
	        		    DKMJ = Number(DKMJ);
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
		_mapView.fit(_source.getExtent(),_mapObject.getSize());
		_mapObject.addLayer(_vector);
		_vector.setVisible(true);
	}
};

$('.find-type-btn button').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var idx = $(this).index('.find-type-btn button');
    $('.find-msg-box').eq(idx).show();
    $('.find-msg-box').not($('.find-msg-box').eq(idx)).hide(); 
});

$(".close-btn").click(function(){
	$(".result-find-box").hide();
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
    $(this).attr("disabled",true).addClass("layui-btn-disabled");
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
})


$("#selectFile1").click(function(){
	$("#SelectFiled1").click();
})
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

$("#up").click(function(){
	$(".result-find-box1,.result-find-box2").hide(1000);
});

function GetGreenLandDatas(){
	ConfigManagerServices("/GetGreenLandDatas",{},true,function(resjson){
		if(resjson.indexOf("false")>-1){
        	parent.layer.alert("未查询到结果!");
        	parent.layer.close(parent.layer.loadIndex);
        	var resjosn = [];
        }else{
        	var resjosn = $.parseJSON(resjson);
        }
        var features = [];
        var str = "";
        for (var i=0;i<resjosn.length;i++) {
        	var XZQMC = resjosn[i].XZQMC;
        	var LDL = resjosn[i].LDL;
        	var GEOMETRY = resjosn[i].GEOMETRY;
        	str+="<tr><td>"+(i+1)+"</td><td>"+XZQMC+"</td><td>"+LDL+"</td></tr>"
        	var feature = _wktParser.readFeature(GEOMETRY);
        	feature.set("XZQMC",XZQMC);
        	feature.set("LDL",LDL);
        	feature.set("GEOMETRY",GEOMETRY);
            features.push(feature);
        }
        $("#greenstaticTbody").html(str);
        sourceXZQ.addFeatures(features);
	});
}