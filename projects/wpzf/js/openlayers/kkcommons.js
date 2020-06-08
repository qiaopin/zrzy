/// <reference path="kkcommons.js" />
function hexToRgba(hex, a) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = hex.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "rgba(" + sColorChange.join(",") + "," + a + ")";
    } else {
        return sColor;
    }
}
function obj2str(o) {
	var r = [];
	if (typeof o == "string" || o == null) {
		return o;
	}
	if (typeof o == "object") {
		if (!o.sort) {
			r[0] = "{";
				for (var i in o) {
					r[r.length] = i;
					r[r.length] = ":";
					r[r.length] = obj2str(o[i]);
					r[r.length] = ",";
				}
			r[r.length - 1] = "}"
		} else {
			r[0] = "[";
				for (var i = 0; i < o.length; i++) {
					r[r.length] = obj2str(o[i]);
					r[r.length] = ",";
				}
			r[r.length - 1] = "]"
		}
		return r.join("");
	}
	return o.toString();
}
function kkIsUNE(str){
	if(str == undefined || str == null)
	{
		return true;
	}

	if(str.length ==0){
		return true;
	}

	if ($.trim(str).length ==0)
	{
		return true;
	}

	return false;
}

function kkFormatNullToCookie(val) {
    if (kkIsUNE(val)) {
        return "";
    }

    if ("null" == val) {
        return "";
    }

    return val.toString();
}

function createString4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
function createGuid() {
	return createString4() + createString4() + '-' + createString4() + '-' + createString4() + '-' + createString4() + '-' + createString4() + createString4() + createString4();
}
function createGuid32() {
    return createString4() + createString4()  + createString4() + createString4() + createString4() + createString4() + createString4() + createString4();
}
function testDoTime(func) {
	var start = new Date().getTime();

	func();

	var end = new Date().getTime();

	return (end - start) + "ms";
}


String.prototype.endWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
};

String.prototype.startWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
};

//简单 skkVmBase
var skkVmBase = window.skkVmBase = {
		service: {
			url: '',
			type: 'post',
		},
		busy: false,
		hover: false,
		model: {},
		mouseMove: function () {
			!this.busy && this.set('hover', true);
		},
		mouseLeave: function () {
			!this.busy && this.set('hover', false);
		},
		loadBefore: function (jqXHR) {
		},
		filter: function (data) {
			return data;
		},
		loadError: function (jqXHR, textStatus, errorThrown) {
		},
		loadComplete: function (jqXHR, textStatus) {
		}
};

var skkVmJson = window.skkVmJson = $.extend(true, {}, window.skkVmBase, {
	load: function (args) {
		var self = this;
		var svc = self.service;
		!self.busy && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(args),
					dataType: 'json',
					contentType: "application/json",
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
		if (!data) return;

		//alert(obj2str(data));

		data = this.filter(data);
		for (var d in data) {
			if (this.model.hasOwnProperty(d)) {
				this.model.set(d, data[d]);
			}
		}
	},
});
var skkVmJsonp = window.skkVmJsonp = $.extend(true, {}, window.skkVmBase, {
	service: {
		jsonp: 'callback'
	},
	load: function (args) {
		var self = this;
		var svc = self.service;
		!self.busy && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(args),
					dataType: 'jsonp',
					contentType: "application/json",
					jsonp: svc.jsonp,
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
		if (!data) return;
		data = this.filter(data);
		for (var d in data) {
			if (this.model.hasOwnProperty(d)) {
				this.model.set(d, data[d]);
			}
		}
	},
});

var skkVmHtml = window.skkVmHtml = $.extend(true, {}, window.skkVmBase, {
	model: { Html: '加载中...', },
	load: function (args) {
		var self = this;
		var svc = self.service;
		!self.busy && svc.init() && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(args),
					dataType: 'html',
					contentType: "application/json",
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
		if (!data) return;
		data = this.filter(data);
		this.model.set('Html', data);
	},
});


//复杂 kkVmBase
var kkVmBase = window.kkVmBase = {
		service: {
			url: '',
			type: 'post',
			data: null,
			init: function () { return true; }
		},
		busy: false,
		hover: false,
		model: {},
		mouseMove: function () {
			!this.busy && this.set('hover', true);
		},
		mouseLeave: function () {
			!this.busy && this.set('hover', false);
		},
		init: function () {
			return this;
		},
		loadBefore: function (jqXHR) {
		},
		filter: function (data) {
			return data;
		},
		loadError: function (jqXHR, textStatus, errorThrown) {
		},
		loadComplete: function (jqXHR, textStatus) {
		}
};

var kkVmJson = window.kkVmJson = $.extend(true, {}, window.kkVmBase, {
	load: function () {
		var self = this;
		var svc = self.service;
		!self.busy && svc.init() && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(svc.data),
					dataType: 'json',
					contentType: "application/json",
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
	    if (!data) return;
	    //alert(obj2str(data));
	    data = this.filter(data);
	    for (var d in data) {
	        if (this.model.hasOwnProperty(d)) {
	            this.model.set(d, data[d]);
	        }
	    }
	},
});

var kkVmJsonp = window.kkVmJsonp = $.extend(true, {}, window.kkVmBase, {
	service: {
		jsonp: 'callback'
	},
	load: function () {
		var self = this;
		var svc = self.service;
		!self.busy && svc.init() && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(svc.data),
					dataType: 'jsonp',
					contentType: "application/json",
					jsonp: svc.jsonp,
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
		if (!data) return;
		data = this.filter(data);
		for (var d in data) {
			if (this.model.hasOwnProperty(d)) {
				this.model.set(d, data[d]);
			}
		}
	},
});

var kkVmHtml = window.kkVmHtml = $.extend(true, {}, window.kkVmBase, {
	model: { Html: '加载中...', },
	load: function () {
		var self = this;
		var svc = self.service;
		!self.busy && svc.init() && svc.url && $.ajax(
				svc.url,
				{
					type: svc.type,
					data: JSON.stringify(svc.data),
					dataType: 'html',
					contentType: "application/json",
					cache: false,
					beforeSend: function (jqXHR) { self.set('busy', true); self.set('hover', false); self.loadBefore(jqXHR); },
					success: $.proxy(self.loadSuccess, self),
					error: $.proxy(self.loadError, self),
					complete: function (jqXHR, textStatus) { self.set('busy', false); self.set('hover', false); self.loadComplete(jqXHR, textStatus); }
				}
		);
		return self;
	},
	loadSuccess: function (data, textStatus) {
		if (!data) return;
		data = this.filter(data);
		this.model.set('Html', data);
	},
});

//(function (kendo) {
//	kendo.message = function (newMessage, option) {
//		var $ = kendo.jQuery;
//		var _kendoMessage = kendo['_kendoMessage'];
//		var _kendoMessageDom = kendo['_kendoMessageDom'];
//		var defaultOption = {
//				width: "400px",
//				height: "150px",
//				title: "消息",
//				actions: [
//				          "Close"
//				          ],
//				          modal: true,
//				          button: { text: '&nbsp&nbsp确定&nbsp&nbsp', callback: function (kendoMessage) { kendoMessage.close(); } }
//		};
//		$.extend(defaultOption, option);
//
//		if (_kendoMessage) {
//			_kendoMessageDom.children("#msg").html(newMessage);
//			_kendoMessage.center();
//			_kendoMessage.open();
//		} else {
//
//
//			var html = '<div><div id="msg" style="margin:8px;overflow:hidden;" >' + newMessage + '</div>' +
//			'<div class="k-edit-buttons k-state-default k-window-action" style="text-align:center;margin: 8px;">' +
//			'<a href="#" class="k-button">' + defaultOption.button.text + '</a></div></div>';
//
//
//			_kendoMessageDom = $(html);
//			_kendoMessageDom.kendoWindow(defaultOption);
//			_kendoMessage = _kendoMessageDom.data("kendoWindow");
//			_kendoMessage.center();
//			_kendoMessage.open();
//			_kendoMessageDom.find("a").click(function () { defaultOption.button.callback(_kendoMessage); });
//			kendo['_kendoMessage'] = _kendoMessage;
//			kendo['_kendoMessageDom'] = _kendoMessageDom;
//		}
//	},
//	kendo.confirm = function (newMessage, option) {
//		var $ = kendo.jQuery;
//		var _kendoConfirm = kendo['_kendoConfirm'];
//		var _kendoConfirmDom = kendo['_kendoConfirmDom'];
//		var defaultOption = {
//				width: "400px",
//				height: "150px",
//				title: "消息",
//				resizable: false,
//				actions: [
//				          "Close"
//				          ],
//				          modal: true,
//				          ok: { text: '&nbsp&nbsp确定&nbsp&nbsp', callback: function (kendoConfirm) { kendoConfirm.close(); } },
//				          cancel: { text: '&nbsp&nbsp取消&nbsp&nbsp', callback: function (kendoConfirm) { kendoConfirm.close(); } }
//		};
//		$.extend(defaultOption, option);
//
//		if (_kendoConfirm) {
//			_kendoConfirmDom.children("#msg").html(newConfirm);
//			_kendoConfirm.center();
//			_kendoConfirm.open();
//		} else {
//
//
//			var html = '<div><div id="msg" style="height: 60%;margin:8px;overflow:hidden;" >' + newMessage + '</div>' +
//			'<div class="k-edit-buttons k-state-default k-window-action" style="text-align:center;margin: 8px;">' +
//			'<a href="#" class="k-button" id="confirmOk" style="margin-right:8px;">' + defaultOption.ok.text + '</a>' +
//			'<a href="#" class="k-button" id="confirmCancel">' + defaultOption.cancel.text + '</a></div></div>';
//
//
//			_kendoConfirmDom = $(html);
//			_kendoConfirmDom.kendoWindow(defaultOption);
//			_kendoConfirm = _kendoConfirmDom.data("kendoWindow");
//			_kendoConfirm.center();
//			_kendoConfirm.open();
//			_kendoConfirmDom.find("#confirmOk").click(function () { defaultOption.ok.callback(_kendoConfirm); });
//			_kendoConfirmDom.find("#confirmCancel").click(function () { defaultOption.cancel.callback(_kendoConfirm); });
//			kendo['_kendoConfirm'] = _kendoConfirm;
//			kendo['_kendoConfirmDom'] = _kendoConfirmDom;
//		}
//	}
//})(kendo);
