
//配置管理
function ConfigManagerServices(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.ConfigManagerServices + WebServerurl,
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

//用户管理
function SurveyUserManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.SurveyUserManagerService + WebServerurl,
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

//用户管理2
function SurveyUserManagerService2(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.SurveyUserManagerService2 + WebServerurl,
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


//日志管理
function LogManagerServices(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.LogManagerServices + WebServerurl,
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

//地图服务管理
function MapResourceManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.MapResourceManagerService + WebServerurl,
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

//数据服务管理
function DataResourceManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.DataResourceManagerService + WebServerurl,
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

//文档服务管理
function DocResourceManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.DocResourceManagerService + WebServerurl,
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


//地图服务管理
function MapResourceManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.MapResourceManagerService + WebServerurl,
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


function MonitorManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.MonitorManagerService + WebServerurl,
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

//监测图斑
function JCTBStatisticsManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.JCTBStatisticsManagerService + WebServerurl,
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

//监测图斑
function JCTBManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.JCTBManagerService + WebServerurl,
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

//上传图斑
function JKTBSummaryManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.JKTBSummaryManagerService + WebServerurl,
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


//任务分配
function WorkManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.WorkManagerService2 + WebServerurl,
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


//获取用户坐标
function LocationMonitorManager(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.LocationMonitorManager + WebServerurl,
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


//历史轨迹
function OrbitWebService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.OrbitWebService + WebServerurl,
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

//角色管理
function RoleManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.RoleManagerService + WebServerurl,
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

function ajaxPost(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: WebServerurl,
        data: data, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: async,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            return success(xml);
        },
        error: function (res) {
//      	layer.alert('访问服务器失败!');
            return success("false");
        }
    });
}

//资源管理
function ResourceManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.ResourceManagerService + WebServerurl,
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
            return success("false");
        }
    });
}

function JudgeManagerService(WebServerurl,data,async,success) {
    $.ajax({
        type: "post", //请求方式
        url: config.JudgeManagerService + WebServerurl,
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
            return success("false");
        }
    });
}

function addlog(MAKER, MAKETIME, MAKECONTENT, LOGGERTYPE) {
    var restext;
    var data = {
        'MAKER': MAKER,
        'MAKETIME': MAKETIME,
        'MAKECONTENT': MAKECONTENT,
        'LOGGERTYPE': LOGGERTYPE,
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "post", //请求方式
        url: config.LogManagerServcie + "/AddNewJTLog",
        data: {'data': data}, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: false,
        cache: false,
        global: false,
        //请求成功后的回调函数
        success: function (xml) {
            restext = $(xml).text();
        },
        error: function (res) {
            restext = false;
            parent.layer.alert('添加日志失败!');
        }
    });
    if (!restext) {
        return;
    } else {
        return restext;
    }
}

function gettime() {
    var MyDate = new Date();
    var Year = MyDate.getFullYear();
    var Month = MyDate.getMonth() + 1;
    var dat = MyDate.getDate();
    var time = MyDate.toLocaleTimeString()
    var mytime = Year + "-" + Month + "-" + dat;
    return mytime;
}

function newfso() {
    var fso;
    try {
        fso = new ActiveXObject("Scripting.FileSystemObject");
        return fso;
    } catch (e) {
//		alert("当前浏览器不支持ActiveXObject");
        return null;
    }
}

function newguid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * 输入验证
 * @type {{}}
 */
var verification = {
    /*姓名身份证，手机号提交*/
    isChinaName: function (name) {
        var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
        return pattern.test(name);
    },
// 验证身份证
    isCardNo: function (card) {
        var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return pattern.test(card);
    },
// 验证手机号 或 座机号
    isPhoneNo: function (phone) {
        var rex = /^1[3-9]+\d{9}$/;
        var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (rex.test(phone) || rex2.test(phone)) {
            return true;
        } else {
            return false;
        }
    },
    // 验证邮箱格式
    isEmail:function(email){
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return pattern.test(email);
    }
};


//获取中文对照
function getContrastByChinese(layername,layerid,field){
	var fieldArr = window.fieldArr;
	for (var i=0;i<fieldArr.length;i++) {
		var layid = fieldArr[i].MAPID +"_"+ fieldArr[i].LAYERINDEX;
		if(fieldArr[i].LAYERNAME==layername&&layid==layerid){
			if(fieldArr[i].LAYERFIELDS==""){
				return false;
			}else{
				var LAYERFIELDS = fieldArr[i].LAYERFIELDS;
				LAYERFIELDS = LAYERFIELDS.split(';');
				var is = false;
				for (var j=0;j<LAYERFIELDS.length;j++){
					if(LAYERFIELDS[j].split(',')[0]==field){
						is = true;
						return LAYERFIELDS[j].split(',')[1];
					}
				}
				if(!is){
					return false;
				}
			}
		}
	}
	return false;
}

//读取本地txt文件
function uploadTxt(input) {
    //支持chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function () {
            console.log(this.result);
            return this.result;
        };
        reader.readAsText(file);
    }
    //支持IE 7 8 9 10
    else if (typeof window.ActiveXObject != 'undefined') {
        var xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        console.log(xmlDoc.xml);
        return xmlDoc.xml;
    }
    //支持FF
    else if (document.implementation && document.implementation.createDocument) {
        var xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        console.log(xmlDoc.xml);
        return xmlDoc.xml;
    } else {
        alert('导入文件出错error');
    }
}