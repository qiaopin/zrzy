layui.define(['jquery', 'table', 'form', 'bluebird', 'xml2json'], function (exports) {
    var $ = layui.$;
    var table = layui.table;
    var xml2json = layui.xml2json;
    var form = layui.form;
    var baseUrl = sessionStorage.baseUrl;
//  $("body").attr('class', $("body", parent.document).attr('class'));//主题风格
    var ljfBase = {
            baseUrl: baseUrl,
            https: {
                MapResourceManagerService: baseUrl + "MapResourceManagerService.asmx", //服务资源管理
                UserManagerService: baseUrl + "UserManagerService.asmx",//用户管理
                LogManagerServices: baseUrl + "LogManagerServices.asmx",
                ConfigManagerServices: baseUrl + "ConfigManagerService.asmx",
                DataResourceManagerService: baseUrl + "DataResourceManagerService.asmx",//数据资源管理
                DocResourceManagerService: baseUrl + "DocResourceManagerService.asmx",//文档服务管理
                BaseMapManagerService: baseUrl + "BaseMapManagerService.asmx",//地图配置
                ResourceManagerService: baseUrl + "ResourceManagerService.asmx",
                BaseMapConfigManagerService: baseUrl + "BaseMapConfigManagerService.asmx",//地图
                SystemCaseManagerService: baseUrl + "SystemCaseManagerService.asmx",//门户管理
                systemcasemanagerservice: baseUrl + "systemcasemanagerservice.asmx",//应用案例管理
                FunctionsManagerService: baseUrl + "FunctionsManagerService.asmx",//方法管理
                NewsManagerService: baseUrl + "NewsManagerService.asmx",//新闻管理
                NewsPictureUpload: baseUrl + "NewsPictureUpload.ashx",//上传图片
                RoleMassgeService: baseUrl + "RoleManagerService.asmx"//角色管理
            },
            configJson: {
                serviceClass: [//地图服务类型
                    {
                        value: "MapServer",
                        text: "MapServer",
                        lastUrl: '?f=json&pretty=true&callback='
                    },
                    {value: "WMS", text: "WMS", lastUrl: '?request=GetCapabilities&service=WMS'},
                    {value: "GeoServer", text: "GeoServer", lastUrl: '?request=GetCapabilities&service=WMS'},
                    {value: "WMTS", text: "WMTS", lastUrl: '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities'}
                ],
                dataClass://数据类型
                    [
                        {value: "基础数据", text: "基础数据"},
                        {value: "专业数据", text: "专业数据"},
                        {value: "专项数据", text: "专项数据"}
                    ],
                doctype: [//行业
                    {value: "行业标准", text: "行业标准"},
                    {value: "国家标准", text: "国家标准"},
                    {value: "地方标准", text: "地方标准"},
                    {value: "多规成果", text: "多规成果"},
                    {value: "三调成果", text: "三调成果"}
                ],
                roletype: [//角色类型
                    {value: "管理员", text: "管理员"},
                    {value: "门户用户", text: "门户用户"},
                    {value: "运维人员", text: "运维人员"}
                ]
            },
            changeTile: function (tile) {
                //返回新的图片地址
                return ljfBase.baseUrl + tile.split('GTKJGH')[1];
            },
            getServiceTypeByUrl: function (url) {
                //根据服务地址 获取服务类型
                //先判断最后结尾是否是/MapServer /WMSServer
                var arr = url.split('/');
                var last = arr[arr.length - 1];
                if (last == "MapServer") {
                    return "MapServer";
                } else if (arr[3] == "geoserver") {
                    return "GeoServer";
                } else if (last == "WMSServer") {
                    return "WMS";
                } else {
                    //判断是否是 /wmts?
                    if (url.indexOf("/wmts?") > -1) {
                        return "WMTS";
                    }
                }
            },
            /**
             * 随机id
             * @returns {string}
             */
            newguid: function () {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            },
            /**
             * 获取地图服务元数据
             * @param serviceUrl 服务地址
             */
            getServiceData: function (serviceUrl) {
                if (ljfBase.isServerRuning(serviceUrl)) {
                    // 服务可用
                    var serviecType = ljfBase.getServiceTypeByUrl(serviceUrl);
                    var serverJson = {
                        fullExtent: {},//范围
                        layers: [],//图层
                        wkid: '',//坐标系
                    };
                    if (serviecType == "WMTS") {//不判断WMTS的服务
                        return serverJson;
                    }
                    var lastUrl = "";
                    $.each(ljfBase.configJson.serviceClass, function (i, v) {
                        if (v.value == serviecType) {
                            lastUrl = v.lastUrl;
                        }
                    });
                    var mapUrl = serviceUrl + lastUrl;
                    var loading = top.layer.load();
                    // 封装get请求
                    $.ajax({
                        type: "get", //请求方式
                        url: mapUrl,
                        data: {},
                        dataType: "text",
                        async: false,
                        timeout: 1000,//设置请求超时
                        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                        //请求成功后的回调函数
                        success: function (data) {
                            top.layer.close(loading);
                            if (serviecType == "GeoServer" || serviecType == "WMS") {
                                var res = xml2json(data);//xml转json
                                if (res.Capability.Layer) {
                                    var fullExtent;
                                    var crs;
                                    //判断 Layer 是否是一个对象数组
                                    var layers = res.Capability.Layer.Layer;
                                    var isObj = JSON.stringify(layers).indexOf("{");
                                    if (isObj == 0) {
                                        //如果是对象
                                        fullExtent = layers.EX_GeographicBoundingBox;
                                        crs = layers.CRS;
                                        var arr = [{
                                            id: layers.Name,
                                            name: layers.Title
                                        }];
                                        serverJson.layers = arr;
                                    } else {//如果是数组
                                        fullExtent = layers[0].EX_GeographicBoundingBox;
                                        crs = layers[0].CRS;
                                        var arr = [];
                                        $.each(layers, function (i, v) {
                                            var obj = {
                                                id: v.Name,
                                                name: v.Title
                                            };
                                            arr.push(obj);
                                        });
                                        serverJson.layers = arr;
                                    }
                                    serverJson.fullExtent = {
                                        xmin: fullExtent.westBoundLongitude,
                                        xmax: fullExtent.eastBoundLongitude,
                                        ymin: fullExtent.southBoundLatitude,
                                        ymax: fullExtent.northBoundLatitude
                                    };
                                    //判断SRS是否是一个数组
                                    var isArr = JSON.stringify(crs).indexOf("[");
                                    if (isArr == 0) {
                                        serverJson.wkid = crs[crs.length - 1];
                                    } else {
                                        serverJson.wkid = crs;
                                    }
                                }
                            } else if (serviecType == "MapServer") {
                                var res = JSON.parse(data);
                                if (res) {
                                    serverJson.fullExtent = res.fullExtent;
                                    serverJson.layers = res.layers;
                                    serverJson.wkid = "EPSG:" + res.fullExtent.spatialReference.wkid;
                                }
                            }
                        },
                        error: function (e) {
                            top.layer.close(loading);
                        }
                    });
                    return serverJson;
                } else {
                    layer.msg("服务不可用");
                }
            },

            /**
             * 判断当前地图服务是否可用
             * @param serviceUrl 服务地址
             */
            isServerRuning: function (serviceUrl) {
                //判断服务是否可用
                var isRun = false;
                var serviecType = ljfBase.getServiceTypeByUrl(serviceUrl);
                if (serviecType == "WMTS") {//不判断WMTS的服务
                    isRun = true;
                    return isRun;
                }
                var lastUrl = "";
                $.each(ljfBase.configJson.serviceClass, function (i, v) {
                    if (v.value == serviecType) {
                        lastUrl = v.lastUrl;
                    }
                });
                var mapUrl = serviceUrl + lastUrl;
                var loading = top.layer.load();
                // 封装get请求
                $.ajax({
                    type: "get", //请求方式
                    url: mapUrl,
                    data: {},
                    dataType: "text",
                    async: false,
                    timeout: 1000,//设置请求超时
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    //请求成功后的回调函数
                    success: function (data) {
                        top.layer.close(loading);
                        if (serviecType == "WMS" || serviecType == "GeoServer") {
                            var json_obj = xml2json(data);//xml转json
                            if (json_obj.Capability.Layer) {
                                isRun = true;
                            }
                        } else if (serviecType == "MapServer") {
                            if (JSON.parse(data).layers) {
                                isRun = true;
                            }
                        }
                    },
                    error: function (e) {
                        top.layer.close(loading);
                        isRun = false;
                    }
                });
                return isRun;
            },
            /**
             * 获取服务所有图层
             * @param mapUrl
             * @param success
             */
            getServerLayers: function (mapUrl, success) {
                var serviceType = ljfBase.getServiceTypeByUrl(mapUrl);
                var layers = ljfBase.getServiceData(mapUrl).layers;
                $.each(layers, function (i, v) {
                    layers[i].index = i;
                });
                if (serviceType == "WMTS") {
                    layers = [{id: 0, name: ""}];
                }
                if (success) {
                    return success && success(layers);
                } else {
                    return layers;
                }
            },
            //判断是否是瓦片地图
            isTile: function (mapUrl, func) {
                var serviceType = ljfBase.getServiceTypeByUrl(mapUrl);
                if (serviceType == "MapServer") {
                    $.ajax({
                        type: "get", //请求方式
                        url: mapUrl + '?f=pjson',
                        data: {},
                        dataType: "json", //返回json
                        jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                        async: false,
                        cache: false,
                        global: false,
                        //请求成功后的回调函数
                        success: function (res) {
                            var isTileLayer = false;
                            if (res.tileInfo) {
                                isTileLayer = true;
                            }
                            return func && func(isTileLayer);
                        },
                        error: function (res) {
                            // top.layer.alert('访问服务器失败!');
//                          throw res;
                            return func && func(false);
                        }
                    });
                } else {
                    return func && func("notMapServer");
                }
            },
            GetAllIndustryInfo: function (isSelect) {
                if (!$('.industry')) {
                    return;
                }
                //获取所有行业信息
                var elem = ".industry";
                var datatype;
                if($(".datatype")){
                    datatype = $(".datatype").val();
                }
                ljfBase.post(ljfBase.https.ConfigManagerServices + "/GetAllIndustryInfo2", {"datatype":datatype}, function (xml) {
                    var resArr = $.parseJSON(xml);
                    var newArr = [];
                    if (isSelect) {
                        //如果是查询 第一行增加一个全部
                        newArr.push({value: "", text: "全部"});
                    }
                    $.each(resArr, function (i, v) {
                        var obj = {
                            value: v.NAME,
                            text: v.NAME
                        };
                        newArr.push(obj);
                    });
                    ljfBase.refreshSelect(elem, newArr);
                });
            },
            refreshSelect: function (elem, resArr, value, text) {
                //更新select下拉框
                var value = value || "value";
                var text = text || "text";
                var str = "";
                $.each(resArr, function (i, v) {
                    str += "<option value='" + v[value] + "'>" + v[text] + "</option>";
                });
                $(elem).html(str);
                form.render();
            },
            showTableHasToolBar: function (data, cols) {
                //渲染有头部工具条的table
                var height = $(document).height() - $('.head').outerHeight();
                $('.table-content').attr('style', 'height:' + height + 'px;');
                table.render({
                    elem: '#table',
                    height: height,
                    toolbar: '#toolbarDemo',
                    page: true, //开启分页
                    limit: 10,
                    limits: [10, 20, 30],
                    cols: cols,
                    data: data,
                    done: function () {
                        // return success && success();
                    }
                });
            },
            showTable: function (data, cols) {
                //渲染table
                var height = $(document).height() - $('.head').outerHeight();
                $('.table-content').attr('style', 'height:' + height + 'px;');
                table.render({
                    elem: '#table',
                    height: height,
                    page: true, //开启分页
                    limit: 10,
                    limits: [10, 20, 30],
                    cols: cols,
                    data: data,
                    done: function () {
                        // return success && success();
                    }
                });
            },
            layerOpen: function (url, title, area) {
                var title = title || "编辑信息";
                var url = sessionStorage.rootPath + url;
                var area = area || ['740px', '680px'];
                // 打开弹窗
                top.layer.open({
                    type: 2,
                    title: title,
                    closeBtn: 1,
                    skin: 'layui-layer-lan',
                    area: area,
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: [url, 'no'],//这里content是一个普通的String  不出滚动条
                    success: function (layero, index) {
                        // top.layer.iframeAuto(index);//高度自适应
                        var iframeWin = top.window[layero.find('iframe')[0]['name']];//获取子页面
                        iframeWin.parWin = window;//在子页面获取父页面
                        iframeWin.layerIndex = index;//子页面获取弹窗index
                        window.layerIndex = index;//父页面获取弹窗index
                    }
                });
            },
            resetLayerHeight: function () {
                //重设弹出层高度
                var height = $(document).height() + 45 + 'px';
                top.layer.style(window.layerIndex, {
                    height: height
                });
            },
            post: function (url, data, success) {
                // 封装post请求
                var loading = top.layer.load();
                $.ajax({
                    type: "post", //请求方式
                    url: url,
                    data: data,
                    dataType: "text", //返回文本
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    async: true,
                    cache: false,
                    global: false,
                    //请求成功后的回调函数
                    success: function (xml) {
                        top.layer.close(loading);
                        return success && success($(xml).text());
                    },
                    error: function (res) {
                        top.layer.close(loading);
                        throw res;
                    }
                });
            },
            ajax: function (paraObj, success) {
                // 封装ajax请求
                var loading = top.layer.load();
                $.ajax({
                    type: paraObj.type, //请求方式
                    url: paraObj.url,
                    data: paraObj.data,
                    timeout: 10000, // 设置超时时间
                    dataType: paraObj.dataType || "text", //返回文本
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    async: paraObj.async || true,
                    //请求成功后的回调函数
                    success: function (xml) {
                        top.layer.close(loading);
                        return success && success($(xml).text());
                    },
                    error: function (res) {
                        top.layer.close(loading);
                        throw res;
                    }
                });
            },
            getJSON: function (url, data, success) {
                var loading = top.layer.load();
                // 封装get请求
                $.ajax({
                    type: "get", //请求方式
                    url: url,
                    data: data,
                    dataType: "json", //返回json
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    async: true,
                    cache: false,
                    global: false,
                    //请求成功后的回调函数
                    success: function (json) {
                        top.layer.close(loading);
                        return success && success(json);
                    },
                    error: function (res) {
                        top.layer.close(loading);
                        throw res;
                    }
                });
            },
            getParamByUrl: function (name) {
                //截取url中的参数
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            }
        }
    ;

    //输出接口
    exports('ljfBase', ljfBase);
});
