if (!sessionStorage.userInfo) {
    function getRootPath_web() {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    }
    sessionStorage.rootPath = getRootPath_web() + "/";//项目根目录
    window.location.href = sessionStorage.rootPath + "login.html";
}

//配置管理
function ConfigManagerServices(WebServerurl, data, async, success) {
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
function SurveyUserManagerService(WebServerurl, data, async, success) {
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
function SurveyUserManagerService2(WebServerurl, data, async, success) {
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

//用户管理3
function SurveyUserManagerService3(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: config.SurveyUserManagerService3 + WebServerurl,
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


function QueryRurallandService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: config.QueryRurallandService + WebServerurl,
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

function RurallandStatisticsService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: config.RurallandStatisticsService + WebServerurl,
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

function RurallandOutputExcelService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: config.RurallandOutputExcelService + WebServerurl,
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
function LogManagerServices(WebServerurl, data, async, success) {
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
function MapResourceManagerService(WebServerurl, data, async, success) {
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
function DataResourceManagerService(WebServerurl, data, async, success) {
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
function DocResourceManagerService(WebServerurl, data, async, success) {
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
function MapResourceManagerService(WebServerurl, data, async, success) {
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


function MonitorManagerService(WebServerurl, data, async, success) {
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
function JCTBStatisticsManagerService(WebServerurl, data, async, success) {
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
function JCTBManagerService(WebServerurl, data, async, success) {
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
function JKTBSummaryManagerService(WebServerurl, data, async, success) {
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
function WorkManagerService(WebServerurl, data, async, success) {
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
function LocationMonitorManager(WebServerurl, data, async, success) {
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
function OrbitWebService(WebServerurl, data, async, success) {
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
function RoleManagerService(WebServerurl, data, async, success) {
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


//
function ajaxPost(WebServerurl, data, async, success) {
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
function ResourceManagerService(WebServerurl, data, async, success) {
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


//
function JudgeManagerService(WebServerurl, data, async, success) {
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


function RurallandService(WebServerurl, data, async, success) {
    $.ajax({
        type: "post", //请求方式
        url: config.RurallandService + WebServerurl,
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
    }
//	var data = {
//		'MAKER':'管理员',
//		'MAKETIME':'2018-01-01',
//		'MAKECONTENT':'工程管理',
//		'LOGGERTYPE':'系统日志',
//	}
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
    var time = MyDate.toLocaleTimeString();
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
    isEmail: function (email) {
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return pattern.test(email);
    }
};


//获取中文对照
function getContrastByChinese(layername, layerid, field) {
    var fieldArr = window.fieldArr;
    for (var i = 0; i < fieldArr.length; i++) {
        var layid = fieldArr[i].MAPID + "_" + fieldArr[i].LAYERINDEX;
        if (fieldArr[i].LAYERNAME == layername && layid == layerid) {
            if (fieldArr[i].LAYERFIELDS == "") {
                return false;
            } else {
                var LAYERFIELDS = fieldArr[i].LAYERFIELDS;
                LAYERFIELDS = LAYERFIELDS.split(';');
                var is = false;
                for (var j = 0; j < LAYERFIELDS.length; j++) {
                    if (LAYERFIELDS[j].split(',')[0] == field) {
                        is = true;
                        return LAYERFIELDS[j].split(',')[1];
                    }
                }
                if (!is) {
                    return false;
                }
            }
        }
    }
    return false;
}

function showCityZB(smc) {
    if (window.dwSourceLayer) {
        window.dwSourceLayer.getSource().clear();
    }

    if (cityData) {
        $.each(cityData[0].children, function (i, v) {
            if (v.text == smc) {
                $("#city").val(v.value);
            }
        });
        form.render();
    }
    //获取市级行政区坐标
    JCTBStatisticsManagerService("/GetCityZb", {}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            // parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        $.each(resjosn, function (i, v) {
            if (v.Name == smc) {
                onlyExtent(v.ZB, _mapObject, {name: smc});
            }
        })
    });
}

function showAreaZB(smc, xmc) {
    //获取行政区坐标
    JCTBStatisticsManagerService("/GetCityZbByCityName", {
        SMC: smc,
        XMC: xmc
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            // parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            if (resjosn.ZB) {
                onlyExtent(resjosn.ZB, _mapObject);
            }
        }
    });
}

function showAreaByXZQDM(XZQDM) {
    //获取行政区坐标
    JCTBStatisticsManagerService("/GetCityZbByCode", {
        xzqdm: XZQDM
    }, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            // parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
            if (resjosn.ZB) {
                onlyExtent(resjosn.ZB, _mapObject);
            }
        }
    });
}

//显示所有市
function showBJByUserXZQ(_mapObject) {
    var userInfo = JSON.parse(sessionStorage.JFZD)[0];
    _wktParser = new ol.format.WKT();
    if (NUSourceLayer1) {
        NUSourceLayer1.getSource().clear();
    }

    if (userInfo.USERTYPE == "省厅负责人") {
        //获取所有市的坐标
        var data = {
            nd: 2019,
            jd: 4
        };
        _mapView = _mapObject.getView();
        JCTBStatisticsManagerService("/GetAllCityZbs", {}, true, function (resjson) {
            if (resjson.indexOf("false") > -1) {
                parent.layer.alert("未查询到结果!");
                parent.layer.close(parent.layer.loadIndex);
                var resjosn = [];
            } else {
                var resjosn = $.parseJSON(resjson);
            }
            var features = [];
            for (var i = 0; i < resjosn.length; i++) {
                var Name = resjosn[i].XZQMC;
                var ZB = resjosn[i].ZB;
                if (ZB) {
                    var feature = _wktParser.readFeature(ZB);
                    feature.set("Name", Name);//设置属性
                    feature.set("XZJB", "shen");
                    feature.setStyle(function (feature, resolution) {
                        var Name = feature.get("Name");
                        var opacity = 0.2;
                        var color = 'rgba(182, 82, 82,' + opacity + ')';
                        var featureText = Name;
                        return _districtRegionStyle = [
                            new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: color
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "rgba(182, 82, 82,1)",
                                    width: 1,
                                }),
                            }),
                            new ol.style.Style({
                                text: new ol.style.Text({
                                    text: featureText,
                                    textAlign: 'center', //位置
                                    textBaseline: 'middle', //基准线
                                    font: 'normal 14px 微软雅黑',  //文字样式
//						            fill: new ol.style.Fill({ color: '#aa3300' }), //文本填充样式（即文字颜色）
                                    stroke: new ol.style.Stroke({color: '#0DD5BB', width: 2})
                                })
                            }),
                        ];
                    });
                    features.push(feature);
                }
            }
            var NUSource1 = NUSourceLayer1.getSource();
            NUSource1.clear();
            NUSource1.addFeatures(features);
            _mapView.fit(NUSource1.getExtent(), _mapObject.getSize());
            parent.layer.close(parent.layer.loadIndex);
        });

    } else if (userInfo.USERTYPE == "市局负责人") {//判断如果市级用户，只显示该市级
        var smc = userInfo.XZQ.split(" ")[1];
        //获取市级行政区坐标
        // showCityZB(smc);
        showAllAreaByCity(smc, userInfo.XZQDM);
    } else {//其他级别显示到县级
        var smc = userInfo.XZQ.split(" ")[1];
        var xmc = userInfo.XZQ.split(" ")[2];
        // showAreaZB(smc, xmc);
        showAreaByXZQDM(userInfo.XZQDM);

    }

    //判断是不是在综合查询页面
    var location = window.location.href;
    if (location.indexOf("comprehensiveQuery") > -1) {
        mapdbClick();
        pointermove();
    }
}

//监听地图双击事件
function mapdbClick() {
    _mapObject.on('dblclick', function (evt) {
        var mapZoom = _mapObject.getView().getZoom();
        var mapCenter = _mapObject.getView().getCenter();
        var layername = "";
        var feature = _mapObject.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                return feature;
            }, {
                layerFilter: function (layer) {
                    if (layer.get('name') == "NUSourceLayer1") {
                        layername = "NUSourceLayer1";
                        return layer.get('name') === 'NUSourceLayer1';
                    } else if (layer.get('name') == "NUSourceLayer2") {
                        layername = "NUSourceLayer2";
                        return layer.get('name') === 'NUSourceLayer2';
                    }
                }
            }
        );
        if (feature) {
            var name = feature.get('Name');
            $(".mouseTitle").html("").hide();
            if (layername === 'NUSourceLayer2') {//选择县
                if (window.dwSourceLayer) {
                    window.dwSourceLayer.getSource().clear();
                }
                if (NUSourceLayer4) {
                    NUSourceLayer4.getSource().clear();
                }
                try {
                    showTable([])
                } catch (e) {

                }
                parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
                $.each(cityData[0].children, function (i, v) {
                    if (v.value == $("#city").val()) {
                        $.each(v.children, function (s, k) {
                            if (k.text == name) {
                                $("#area").html("<option value='" + k.value + "'>" + k.text + "</option>");
                                getXZListByDM(k.value);
                                try {
                                    $(".xzqArea").show();
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        })
                    }
                });
                var smc = $("#city option:selected").text();
                var xmc = name;
                form.render();
                parent.layer.close(parent.layer.loadIndex);
                // showAreaZB(smc, xmc);
                showAreaByXZQDM($("#area").val());
            } else {//选择市
                if (window.dwSourceLayer) {
                    window.dwSourceLayer.getSource().clear();
                }
                if (NUSourceLayer4) {
                    NUSourceLayer4.getSource().clear();
                }
                try {
                    showTable([])
                } catch (e) {

                }
                parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
                $.each(cityData[0].children, function (i, v) {
                    if (v.text == name) {
                        // $("#city").val(v.value);
                        $("#city").html("<option value='" + v.value + "'>" + v.text + "</option>");
                        getXianList(v.value);
                        try {
                            $(".xzqArea").hide();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });

                form.render();
                showAllAreaByCity(name, $("#city").val());
            }
        }
    });
}

function pointermove() {//监听指针移动
    var oldName;
    _mapObject.on('pointermove', function (evt) {
        var layername = "";
        var feature = _mapObject.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                return feature;
            }, {
                layerFilter: function (layer) {
                    if (layer.get('name') == "NUSourceLayer1") {
                        layername = "NUSourceLayer1";
                        return layer.get('name') === 'NUSourceLayer1';
                    } else if (layer.get('name') == "NUSourceLayer2") {
                        layername = "NUSourceLayer2";
                        return layer.get('name') === 'NUSourceLayer2';
                    }
                }
            }
        );
        if (feature) {
            var name = feature.get('Name');
            $(".mouseTitle").html("双击选择" + name).show();
            // if (name && name != oldName) {
            //     oldName = name;
            //
            // }
        } else {
            oldName = "";
            $(".mouseTitle").html("").hide();
        }
    });
}

//显示一个市底下的所有县
function showAllAreaByCity(smc, xzqdm) {
    parent.layer.loadIndex = parent.layer.load(0, {shade: 0.1});
    if (window.dwSourceLayer) {
        window.dwSourceLayer.getSource().clear();
    }
    // JCTBStatisticsManagerService("/GetCountyCityZb", {nd: 2019, jd: 4, smc: smc}, true, function (resjson) {
    JCTBStatisticsManagerService("/GetAllCuntyZbs", {xzqdm: xzqdm}, true, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            // parent.layer.alert("未查询到结果!");
            parent.layer.close(parent.layer.loadIndex);
            var resjosn = [];
        } else {
            var resjosn = $.parseJSON(resjson);
        }
        showAreaZBFW(resjosn);
    });
}

function showAreaZBFW(resjosn) {
    _wktParser = new ol.format.WKT();
    var features = [];
    $.each(resjosn, function (i, v) {
        var Name = v.XZQMC;
        var ZB = v.ZB;
        if (ZB) {
            var feature = _wktParser.readFeature(ZB);
            feature.set("Name", Name);//设置属性
            feature.set("XZJB", "shen");
            feature.setStyle(function (feature, resolution) {
                var Name = feature.get("Name");
                var opacity = 0.4;
                var color = 'rgba(182, 82, 82,' + opacity + ')';
                var featureText = Name;
                return _districtRegionStyle = [
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: color
                        }),
                        stroke: new ol.style.Stroke({
                            color: "rgba(182, 82, 82,1)",
                            width: 1,
                        }),
                    }),
                    new ol.style.Style({
                        text: new ol.style.Text({
                            text: featureText,
                            textAlign: 'center', //位置
                            textBaseline: 'middle', //基准线
                            font: 'normal 14px 微软雅黑',  //文字样式
//						            fill: new ol.style.Fill({ color: '#aa3300' }), //文本填充样式（即文字颜色）
                            stroke: new ol.style.Stroke({color: '#aa3300', width: 2})
                        })
                    }),
                ];
            });
            features.push(feature);
        }
    });
    var NUSource2 = NUSourceLayer2.getSource();
    NUSource2.clear();
    NUSource2.addFeatures(features);
    _mapView.fit(NUSource2.getExtent(), _mapObject.getSize());
    parent.layer.close(parent.layer.loadIndex);
}


//只显示一定范围内的地图 遮盖 定位全图
function onlyExtent(ZB, _mapObject, data) {
    _wktParser = new ol.format.WKT();
    //定位全图
    window.dwSourceLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [],
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.8)',
                width: 2,
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.1)',
            })
        }),
        name: "dwSourceLayer",
        zIndex: 3
    });

    _mapObject.addLayer(window.dwSourceLayer);

    var dwSource = window.dwSourceLayer.getSource();
    dwSource.clear();
    var showfeature = _wktParser.readFeature(ZB);
    if (data) {
        showfeature.set("Name", data.name);
    }
    dwSource.addFeature(showfeature);
    _mapObject.getView().fit(window.dwSourceLayer.getSource().getExtent(), _mapObject.getSize());
}

/**
 * 编辑节点
 * @param editSource 要编辑图层的source
 * @param _mapObject 地图对象
 */
function editNode(editSource, _mapObject) {
    // // 创建一个Modify控件
    // modify = new ol.interaction.Modify({
    //     source: editSource
    // });
    //
    // // 将Modify控件加入到Map对象中
    // _mapObject.addInteraction(modify);
    // modify.on('modifyend', function(evt) {
    //     var featrue = evt.features.item(0);
    //     var extent = featrue.getGeometry().getCoordinates();
    //     var zb = extent.join(",");
    //     $.ajax({
    //         type: "post", //请求方式
    //         url: sessionStorage.baseUrl + "RurallandService.asmx/updateRuralByFWZB",
    //         data: {
    //             id: featrue.get("FWBH"),
    //             fwzb: zb
    //         }, //参数
    //         dataType: "text", //返回文本
    //         jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
    //         async: true,
    //         cache: false,
    //         global: false,
    //         //请求成功后的回调函数
    //         success: function(xml) {
    //             var res = $(xml).text().trim();
    //             layer.msg("保存节点成功");
    //             GetRurallandnByXzqdm();
    //         },
    //         error: function(res) {
    //             layer.alert('访问服务器失败!');
    //         }
    //     });
    // });

    // 创建一个Modify控件
    modify = new ol.interaction.Modify({
        source: editSource
    });
    // 将Modify控件加入到Map对象中
    _mapObject.addInteraction(modify);
    modify.on('modifyend', function (evt) {
        var fs = evt.features.array_; //拖动后的数组

        var XZQ = JSON.parse(sessionStorage.JFZD)[0].XZQ.split(" ");
        var smc = XZQ[1];
        var xmc = XZQ[2];
        $.each(fs, function (s, k) {
            var coor = k.getGeometry().getCoordinates();
            if (zbIsInXianArea(smc, xmc, coor, JSON.parse(sessionStorage.JFZD)[0].XZQDM)) {
                $.ajax({
                    type: "post", //请求方式
                    url: sessionStorage.baseUrl + "RurallandService.asmx/updateRuralByFWZB",
                    data: {
                        id: k.get("FWBH"),
                        fwzb: k.getGeometry().getCoordinates().join(",")
                    }, //参数
                    dataType: "text", //返回文本
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    async: false,
                    cache: false,
                    global: false,
                    //请求成功后的回调函数
                    success: function (xml) {
                        var res = $(xml).text().trim();
                        if (res == "true") {
                            // layer.msg("保存节点成功");
                        } else {
                            layer.msg("保存失败");
                            return false;
                        }
                    },
                    error: function (res) {
                        layer.alert('访问服务器失败!');
                    }
                });
            } else {
                return false;
            }
        });
        GetRurallandnByXzqdm();
    });
}

function addPointZB() {
    //监听地图单击事件
    _mapObject.on('singleclick', function (evt) {
        if (!activationClick) {
            return;
        }
        var coor = evt.coordinate;
        layer.pointZB = coor.join(",");
        if (activationClick == "addPointTool") { //新增点
            //判断在不在允许的县界范围内
            var userInfo = JSON.parse(sessionStorage.JFZD)[0];
            var smc = userInfo.XZQ.split(" ")[1];
            var xmc = userInfo.XZQ.split(" ")[2];
            if (!zbIsInXianArea(smc, xmc, coor, userInfo.XZQDM)) {
                layer.msg("不在允许的县界范围内");
                return false;
            }
            activationClick = null;
            $("#inputBtn").removeClass("active");
            layer.openIndex = layer.open({
                type: 2,
                title: false,
                closeBtn: 0, //不显示关闭按钮
                shade: [0],
                skin: 'layui-layer-lan',
                area: ['100%', '100%'],
                anim: 2,//弹出动画
                shade: 0.2,//遮盖层
                content: ['inputData.html', 'no'], //这里content是一个普通的String
            });
        } else if (activationClick == "editPointZB") {
            var userInfo = JSON.parse(sessionStorage.JFZD)[0];
            var smc = userInfo.XZQ.split(" ")[1];
            var xmc = userInfo.XZQ.split(" ")[2];
            var xzqdm = userInfo.XZQDM;
            if (!zbIsInXianArea(smc, xmc, coor, xzqdm)) {
                layer.msg("不在允许的县界范围内");
                return false;
            }
            activationClick = null;
            $("#inputBtn").removeClass("active");
            var fwbh = layer.data.FWBH;
            $.ajax({
                type: "post", //请求方式
                url: sessionStorage.baseUrl + "RurallandService.asmx/updateRuralByFWZB",
                data: {
                    id: fwbh,
                    fwzb: layer.pointZB
                }, //参数
                dataType: "text", //返回文本
                jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                async: true,
                cache: false,
                global: false,
                //请求成功后的回调函数
                success: function (xml) {
                    var res = $(xml).text().trim();
                    layer.msg("保存位置成功");
                    GetRurallandnByXzqdm();
                },
                error: function (res) {
                    layer.alert('访问服务器失败!');
                }
            });
        }
    });
}

function verify(FWBH, res) {//提交前的验证
    RurallandService("/GetRurallandInfoByID", {id: FWBH}, false, function (resjson) {
        if (resjson.indexOf("false") > -1) {
            is = false;
        } else {
            var resjosn = $.parseJSON(resjson);
            var data = resjosn[0];
            data.ZZORXS = "自住";
            if (Number(data.ZATS) > 0) {
                data.ZZORXS = "销售";
            }
            if (data.FWJSZTMC == "") {
                parent.layer.alert("房屋建设主体名称不能为空!");
                return;
            }

            if (data.JSQYSFZDM.length < 15 || data.JSQYSFZDM.length > 18) {
                parent.layer.alert("建房企业/个人号码必须在15到18位!");
                return;
            }

            if (data.FWXZ == "") {
                parent.layer.alert("房屋性质不能为空!");
                return;
            }

            if (data.FWWZ == "") {
                parent.layer.alert("房屋位置不能为空!");
                return;
            }

            var JZMJ = Number(data.JZMJ);
            if (Number(data.JZMJ) <= 0) {
                parent.layer.alert("建筑面积必须大于0!");
                return;
            }

            if (data.LXFS == "") {
                parent.layer.alert("联系方不能为空!");
                return;
            }

            if (data.LXFS.length != 11) {
                parent.layer.alert("联系方式必须11位!");
                return;
            }

            var YGDMJ = Number(data.YGDMJ);
            var WBLZYGDMJ = Number(data.WBLZYGDMJ);
            var ZYGDMJ = Number(data.ZYGDMJ);
            var JBNT = Number(data.JBNT);
            var YBGD = Number(data.YBGD);

            var max = 50000;
            if (YBGD > max || WBLZYGDMJ > max || ZYGDMJ > max || JBNT > max || YBGD > max) {
                parent.layer.alert("面积数不可超过" + max);
                return;
            }

            if (ZYGDMJ <= 0) {
                parent.layer.alert("占用耕地总面积必须大于0!");
                return;
            }
            if (data.JFSJ == "") {
                parent.layer.alert("建房时间不能为空!");
                return;
            }
            if (data.JFZT == "") {
                parent.layer.alert("建房状态不能为空!");
                return;
            }
            if (data.SFYFBL == "是") {

                if (data.PZYDDW == "") {
                    parent.layer.alert("批准用地单位不能为空!");
                    return;
                }
                if (data.PZWH == "") {
                    parent.layer.alert("批准文号不能为空!");
                    return;
                }
                if (data.PZRQ == "") {
                    parent.layer.alert("批准时间 不能为空!");
                    return;
                }
                if ((YGDMJ + WBLZYGDMJ).toFixed(2) != ZYGDMJ.toFixed(2)) {
                    parent.layer.alert("原耕地面积+占用耕地面积必须等于占用耕地总面积!");
                    return;
                }
            } else {
                if (WBLZYGDMJ.toFixed(2) != ZYGDMJ.toFixed(2)) {
                    parent.layer.alert("占用耕地面积必须等于占用耕地总面积!");
                    return;
                }
            }
            if (JBNT + YBGD - ZYGDMJ > 0.001) {
                parent.layer.alert("基本农田面积+一般耕地面积必须小于等于占用耕地总面积!");
                return;
            }

            if (data.FWXZ == "居住用房") {

                if (data.ZZORXS != "自住") {//销售
                    var ZATS = Number(data.ZATS);
                    var XSTS = Number(data.XSTS);
                    var XSBCMS = Number(data.XSBCMS);
                    var XSWCMS = Number(data.XSWCMS);
                    var XSCZJMS = Number(data.XSCZJMS);

                    if (ZATS <= 0) {
                        parent.layer.alert("住宅套数必须大于0!");
                        return;
                    }

                    if (XSTS > ZATS) {
                        parent.layer.alert("销售套数小于等于住宅套数!");
                        return;
                    }
                    if ((XSCZJMS + XSWCMS + XSBCMS) != XSTS) {
                        parent.layer.alert("销售给本村村民套数+销售给外村村民套数+销售给城镇居民套数必须等于销售套数!");
                        return;
                    }

                } else {//自住
                    var CCMJ = Number(data.CCMJ);

                    if (data.SFBCJF == "是") {//本村村名建房
                        if (data.SFFHTJ == "") {
                            parent.layer.alert("本村村民建房是否符条件不能为空!");
                            return;
                        }
                        if (data.SFFHTJ == "是") {//建房符合条件
                            if (data.SFCMJ == "") {
                                parent.layer.alert("符合“一户一宅”条件宅基地是否超面积不能为空!");
                                return;
                            }
                            if (data.SFCMJ == "是") {//超面积
                                if (CCMJ * 0.0015 > ZYGDMJ) {
                                    parent.layer.alert("超出面积*0.0015不能大于占用耕地总面积!");
                                    return;
                                }
                                // if (CCMJ > JZMJ) {
                                //     parent.layer.alert("超出面积不能大于建筑面积!");
                                //     $(this).attr("disabled", false);
                                //     return;
                                // }
                                if (CCMJ <= 0) {
                                    parent.layer.alert("超出面积必须大于0!");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            // 验证无误后可以提交
            return res && res();
        }
    });
}

//人员管理
$("#videoShow").click(function () {
    $("#iframes").attr('src', '../videoShow.html');
});

function getNameBySHZT(SHZT) {
    var str = "";
    switch (SHZT) {
        case "2":
            str = "乡镇";
            break;
        case "3":
            str = "国土所";
            break;
        case "4":
            str = "县级";
            break;
        case "5":
            str = "市级";
            break;
        case "6":
            str = "省级";
            break;
        case "7":
            str = "国家级";
            break;
    }
    return str;
}

//先隐藏第二个table
$(".hideBottomBtn").click(function () {
    toggleBottom(false);
    resetTableSize();
});

function toggleBottom(isShow) {
    if (isShow) {
        $(".top").attr("style", "");
        $(".bottom").attr("style", "");
    } else {
        $(".top").attr("style", "height:calc(100vh - 50px);");
        $(".bottom").attr("style", "height:0px;overflow: hidden;");
    }
}

function resetTableSize() {
    var height1 = $(".table1_div").height() - 5;
    layuitable.reload("table1", {height: height1});
    var height2 = $(".table2_div").height() - 5;
    layuitable.reload("table2", {height: height2});
}

function myIsNaN(value) {
    var res = typeof value === 'number' && !isNaN(value);
    return res;
}

function addTotal(resjosn) {//表格中增加汇总
    if (resjosn.length == 0) {
        return false;
    }
    var res = {};
    $.each(resjosn, function (i, v) {
        $.each(v, function (s, k) {
            res[s] = 0;
        })
    });
    $.each(res, function (i, v) {
        $.each(resjosn, function (s, k) {
            if (myIsNaN(k[i])) {
                var num = k[i];
                res[i] += num;
            }
        });
    });
    res.XZQMC = "汇总";
    res.XZQDM = resjosn[0].XZQDM;
    resjosn.unshift(res);//加到第一行
}

//判断鼠标点击位置在不在几何元素内
function pointIsInArea(feature, coordinate) {
    var geo = feature.getGeometry();//feture是几何元素
    var isIn = geo.intersectsCoordinate(coordinate);
    return isIn
}

function getXianFeature(smc, xmc, xzqdm) {
    //获取行政区坐标
    $.ajax({
        type: "post", //请求方式
        // url: config.JCTBStatisticsManagerService + "/GetCityZbByCityName",
        url: config.JCTBStatisticsManagerService + "/GetCityZbByCode",
        data: {
            // SMC: smc,
            // XMC: xmc
            xzqdm
        }, //参数
        dataType: "text", //返回文本
        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: false,
        //请求成功后的回调函数
        success: function (xml) {
            var resjson = $(xml).text();
            var resjosn = [];
            if (resjson.indexOf("false") > -1) {
                layer.alert('没有获取到县界');
                parent.layer.close(parent.layer.loadIndex);
            } else {
                resjosn = $.parseJSON(resjson);
                if (resjosn.ZB) {
                    _wktParser = new ol.format.WKT();
                    showEditfeature = _wktParser.readFeature(resjosn.ZB);
                }
            }
        },
        error: function (res) {
            layer.alert('获取县界失败!');
        }
    });
}

//判断当前点击位置在不在允许的县域里
function zbIsInXianArea(smc, xmc, coordinate, xzqdm) {
    showEditfeature = null;
    getXianFeature(smc, xmc, xzqdm);
    if (showEditfeature) {
        if (pointIsInArea(showEditfeature, coordinate)) {
            return true;
        } else {
            return false;
        }
    } else {
        alert("缺少县界坐标");
        return false;
    }
}

//显示所有房屋点
function showFWFeature(res) {
    if (NUSourceLayer4) {
        NUSourceLayer4.getSource().clear();
    }
    var NUSource4 = NUSourceLayer4.getSource();  //获取Source
    NUSource4.clear();
    var features = [];
    $.each(res, function (i, v) {
        var data = v;

        var FWZB = data.fwzb || data.ZB;
        if (FWZB) {
            var lon = FWZB.split(',')[0];
            var lat = FWZB.split(',')[1];
            lon = Number(lon);
            lat = Number(lat);
            var name = data.fwjsztmc || data.FWJSZTMC;
            if (lon > 0.1) {
                var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                var Style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: '#00ff00'
                        }),
                        fill: new ol.style.Fill({
                            color: "#00ff00"
                        })
                    }),
                    text: new ol.style.Text({
                        text: (i + 1) + "",
                        // text: (i + 1),
                        textAlign: 'center', //位置
                        textBaseline: 'bottom', //基准线
                        font: 'normal 14px 微软雅黑',  //文字样式
                        stroke: new ol.style.Stroke({color: '#aaaaaa', width: 1})
                    })
                });
                feature.setStyle(Style);
                feature.set("FWJSZTMC", name);
                features.push(feature);
            }
        }
    });

    if (features.length > 0) {
        NUSource4.addFeatures(features);
        // _mapView.fit(NUSource4.getExtent(), _mapObject.getSize());
    }
}

//判断用户是否可以提交
function canSubmit() {
    parent.JFZD = JSON.parse(sessionStorage.JFZD)[0];
    var userSHZT = parent.JFZD.SHZT;
    if (userSHZT == "3") {
        $("#submit").attr({
            "disabled": "disabled",
            "class": "layui-btn layui-btn-xs layui-btn-disabled"
        }).html("上级单位禁止了提交");
        $("#submitOne").hide();
        return false;
    } else {
        return true;
    }
}

//重新获取一下用户的登录信息
function reGetUserInfo() {
    var username = sessionStorage.sprid;
    var pwd = sessionStorage.pasd;
    if (username && pwd) {
        $.ajax({
            type: "post", //请求方式
            url: "http://110.249.159.46:8089/gtkjghTest/SurveyUserManagerService.asmx/Login",
            data: {
                phone: username,
                password: pwd
            },
            dataType: "text", //返回文本
            jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            async: false,
            cache: false,
            global: false,
            //请求成功后的回调函数
            success: function (xml) {
                var res = JSON.parse($(xml).text().trim());
                sessionStorage.JFZD = res.JFZD;
            },
            error: function (res) {
                parent.layer.alert('访问服务器失败!');
            }
        });
    }
}