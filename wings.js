var WingsConsole = {
	log : function(msg){
		try {
			var now = new Date();
			if (window.console && window.console.log) {
				console.log(now.toLocaleTimeString() + " " + now.getMilliseconds() + " : " + msg);
			}
			return now;
		} catch (e) {
		};
	}
};
try {
    document.write('<script type="text/javascript" src="/wingWeb/domain.js"><\/script>');
    document.close();
} catch (e) {};




//封装一个map对象
function Map(){
	this.container = new Object();
};

Map.prototype.put = function(key, value){
	this.container[key] = value;
};

Map.prototype.get = function(key){
	return this.container[key];
};

Map.prototype.remove = function(key){
	delete this.container[key];
};
Map.prototype.size = function(){        
	var count = 0;
    for(var i in this.container) {
        if(this.container.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            count++;
        }
    }
    return count;
};




//公共参数
//var _initData;
var $pageContainer = $pc = {};

window.hideMask = function(){
	if(window.wingsMaskDiv){
		window.wingsMaskDiv.remove();
	};
};

window.showMask = function(content){
	hideMask();
	window.wingsMaskDiv = $('<div style="z-index:2001;position:absolute; background-color: rgba(255, 254, 254, 0.61);left:0px;top:0px;"></div>');
	var width = $(window.top).width();
	var height = $(window.top).height();
	window.wingsMaskDiv.css({'width':width,'height':height});
	var topbody = $(window.top.document).find('body');
	var div;
	if(content){
		div = $('<div class="spinner"><span style="font-weight: 500;font-size:16px;">'+content+'</span></div>');
	}else{
		div = $('<img style="top: 45%; position: absolute;left: 50%;" src="/wings/core/img/loading.gif">');
	};
	window.wingsMaskDiv.append(div);
	topbody.append(window.wingsMaskDiv);
};

function $chk(a) {
    return !!(a || a === 0)
};

// ============= 公共方法  (begin) ==================
//var $wings_SwordPageData = null;

//【重要】从dataNmae 对象里，获得要显示的值 
function $wings_getValByCode(dataName, code){
	
      var codes = [];
      if (code.split(",").length > 1) {
        codes = code.split(",");
      }
      var val = '';
      if ($pc._initData) {
          if ( $pc._initData.data) {
            $.each($pc._initData.data, function(i, a) {
              if (a.sword == "SwordSelect") {
                if (a.dataName == dataName) {
                  $(a.data).each(function(i, e) {
                    if (e.code == code) {
                      val = e.caption;
                    }
                  });
                }
              }else if (a.sword == "SwordTree") {
                if (a.name == dataName) {
                  var wingsTreeDatas = [];
                  $(a.data).each(function(i, e) {
                    swordDataDG(e, wingsTreeDatas);
                  });
                  $(wingsTreeDatas).each(function(i, e) {
                    if (codes.length <= 0) {
                      if (e.code == code) {
                        val = e.caption;
                      }
                    } else {
                      $(codes).each(function(i1, e1) {
                        if (e.code == e1) {
                          val += e.caption + ",";
                        }
                      });
                    }
                  });
                  if (codes.length > 0) {
                    val = val.substring(0, val.length - 1);
                  }
                }
              }
            });
        }
      }
      return val;
}

function swordDataDG(data, wingsTreeDatas) {
      var tree = {
        code: '',
        caption: ''
      };
      tree.code = data.code;
      tree.caption = data.caption;
      wingsTreeDatas.push(tree);
      if (data.children != null) {
        $(data.children).each(function(i, e) {
          return swordDataDG(e, wingsTreeDatas);
        });
      }
    }



//封装on系列时用的方法
function wings_excutefunc(g, b) {
    var f = new Array();
    for (var c = 2; c < arguments.length; c++) {
        f.push(arguments[c]);
    };
    if (typeof(g) == "object") {
        var a = new function(h) {
            g(f);
        };
        return;
    };
    if (b) {
		//arguments => 数组
        var d = Array().slice.call(b);
        f = f.concat(d);
    };
	//语法：apply([thisObj[,argArray]]) 
	//定义：应用某一对象的一个方法，用另一个对象替换当前对象。
    return g.apply(this, f);
};

//过滤封装 on系列
function wings_getFunc(g) {
    if (!g) {
        g = "";
    };
    if (typeof g == "function") {
        g = g.toString();
        var f = g.indexOf("{") + 1;
        if (f > 0) {
            var d = g.lastIndexOf("}");
            g = g.substring(f, d);
        };
    };
    if (g.indexOf("{") != -1) {
        g = g.substring(g.indexOf("{") + 1, g.lastIndexOf("}"))
    };
    var k = g.split(/\s*;\s*/);
    var c = [];
    for (var b = 0; b < k.length; b++) {
        if ($.trim(k[b]) != "") {
			//方法名
            var h = k[b].substring(0, k[b].indexOf("(")) || undefined;
			//参数
            var a = k[b].substring(k[b].indexOf("(") + 1, k[b].indexOf(")")) || undefined;
            if ((a && $.trim(a) == "") || a == undefined) {
                a = "";
            } else {
                a = "," + a;
            }
			//执行完方法后，返回数组里
            c.push(new Function("return wings_excutefunc(" + (h?$.trim(h):undefined) + ",arguments" + a + ")"));
        };
    };
    return c;
};
//设置随机id
function $wings_getRandomUUID(){
    return $wings_uuid(32);
};

$wings_leftPad = function(d, b, c) {
    var a = new String(d);
    if (c == null) {
        c = " "
    }
    while (a.length < b) {
        a = c + a
    }
    return a
};
$wings_escape = function(a) {
    return a.replace(/('|\\)/g, "\\$1")
};
String.prototype.reverse = function() {
    var b = "";
    for (var a = this.length; a > 0; --a) {
        b += this.charAt(a - 1)
    }
    return b
};

function $wings_uuid(a, d) {
    var g = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var c = [],b;
    d = d || g.length;
    if (a) {
        for (b = 0; b < a; b++) {
            c[b] = g[0 | Math.random() * d];
        };
    } else {
        var f;
        c[8] = c[13] = c[18] = c[23] = "-";
        c[14] = "4";
        for (b = 0; b < 36; b++) {
            if (!c[b]) {
                f = 0 | Math.random() * 16;
                c[b] = g[(b == 19) ? (f & 3) | 8 : f];
            }
        }
    }
    return c.join("");
};
//从src中获得ctrl
function $wings_getServerName(b) {
    if (b.indexOf("http") != -1 && b.indexOf("sword") == -1) {
        return "do";
    };
    var f;
    var d;
    if (b.indexOf("tid") != -1) {
        var g = b.substr(b.indexOf("tid"));
        d = g.substr(g.indexOf("=") + 1);
    } else {
        if (b.indexOf("ctrl") != -1) {
            var c = b.substr(b.indexOf("ctrl"));
            d = c.substr(c.indexOf("=") + 1);
        } else {
            if (b.indexOf("sName") != -1) {
                var a = b.substr(b.indexOf("sName"));
                d = a.substr(a.indexOf("=") + 1);
            };
        };
    } if ($chk(d)) {
        if (d.indexOf("&") != -1) {
            f = d.substr(0, d.indexOf("&"));
        } else {
            f = d;
        }
    } else {
        f = b;
    }
    return f;
}
//适应sword对象，为对象添加适当的方法
function $wings_formatObjWtoS(obj){
	if( typeof obj == "object"){
		obj.get = function(name){
			return obj[name];
		}
	}
	
	return obj;
}


//设置默认的保存值，就是在url中追加。。。
function AddBizCode2URL(c, b) {
    if (!c) {
        return ""
    }
    
    var f = _getBizCode_(b);
    for (var d in f) {
        var a = f[d];
        if (a && d != "cxbj") {
            c = (c + ((c.indexOf("?") == -1) ? "?" : "&") + d + "=" + a)
        }
    }
    return c
}

function _getBizCode_(f) {
    var gwxh = _GetParameter_("gwxh", f);
    var gndm = _GetParameter_("gndm", f);
    var zndm = _GetParameter_("zndm", f);
    var gnjdm = _GetParameter_("gnjdm", f);
    var jsdm = _GetParameter_("jsdm", f);
    var gwssswjg = _GetParameter_("gwssswjg", f);
    var cxbj = _GetParameter_("cxbj", f);
    return {
        gwxh: gwxh,
        gndm: gndm,
        zndm: zndm,
        gnjdm: gnjdm,
        jsdm: jsdm,
        gwssswjg: gwssswjg,
        cxbj: cxbj
    }
}

function _GetParameter_from_Res(name, a) {
	if($pc._initData && $pc._initData.data){
		return getAttrFormData($pc._initData.data,name) || "";
	}else{
		return "";
	};
    
}

function _GetParameter_(g, f) {
    var d = window.location.search;
    var a = g.length;
    var c = d.indexOf(g);
    if (c == -1) {
        return _GetParameter_from_Res(g, f)
    }
    c += a + 1;
    var b = d.indexOf("&", c);
    if (b == -1) {
        return d.substring(c)
    } else {
        return d.substring(c, b)
    }
}




	/**
	 * 递归生成树型结构，根据pcode生成children
	 * @param {Object} dateObj
	 */
	function $tersforStrToTreeNodes(dateArr){
		var map = {};
		//【1】准备数据
		$.each(dateArr, function(i, perObj) {
			if(perObj.code){
				map[perObj.code] = perObj;
			};
		});
		//【2】处理数据，思路：依次移动节点，将节点插入其父节点的child属性中
		for(var i=0;i < dateArr.length; i++){
			var code = dateArr[i].code;
			var targetObj = map[code];
			//遍历map
			var hasParent = false;
			for (mapObj in map){
				//找到父节点并将其放到如节点的 children属性中
				hasParent = $p_setObjToFobj(map[mapObj],targetObj);
				if(hasParent){
					break;
				};
			};
			if(hasParent){
				//有父节点，则去掉该节点
				delete map[code];
			};
		};
		//【3】生成数据并返回
		var resultArr =[];
		for (mapObj in map){
			resultArr.push(map[mapObj]);
		};
		return resultArr;
	}
	
	/**
	 * 遍历寻找子页面
	 * @param {Object} mapObj
	 * @param {Object} targetObj
	 * @return {TypeName} 
	 */
	function $p_setObjToFobj(mapObj,targetObj){
		var flag = false;
		if (typeof(mapObj) == "object" && targetObj.pcode && targetObj.pcode != null ){
			if(mapObj.code == targetObj.pcode){
				//装进
				if(!mapObj.children){
					mapObj.children = [];
				};
				mapObj.children.push(targetObj);
				flag = true;
			}else if(mapObj.children){
				//看看是否在子节点中
				$.each(mapObj.children, function(k, s_perObj) {
					flag = $p_setObjToFobj(s_perObj,targetObj);
					if(flag){
						//找到了父节点，终止循环
						return false;
					};
				});
			};
		};
		return flag;
	}
	
	// ============= 公共方法  (end) ==================
	
	// ============= format  (begin) ==================
var sword_fmt = {
    defFmt: {
        "float": "{'type':'number','format':'0.00','style':''}",
        RMB: "{'type':'number','format':'0.00 RMB','style':''}",
        USD: "{'type':'number','format':'$ 0.00','style':''}"
    },
    convertText: function(d, a, b) {
        var c = {};
        var g = "";
        if (!$defined(a)) {
            a = ""
        }
        if (typeof(d) == "object") {
            c.value = a;
            c.realvalue = a;
            c.style = b || "";
            g = d.get("format");
            if (!$chk(g) || !$defined(g)) {
                return c
            }
            if (a == "") {
                var h = eval("(" + g + ")")["default"];
                if ($defined(h)) {
                    c.value = h;
                    c.realvalue = h
                } else {
                    return c
                }
            }
        } else {
            if (typeof(d) == "string") {
                c.value = d;
                c.realvalue = d;
                g = a
            }
        } if (sword_fmt.defFmt[g]) {
            g = sword_fmt.defFmt[g]
        }
        try {
            $.extend(c, eval("(" + g + ")"))
        } catch (f) {}
        return this.builderText(c)
    },
    formatText: function(d, a, b, g) {
        var c = {};
        if (typeof(d) == "object") {
            c.value = a;
            c.realvalue = a;
            c.style = b || "";
            if (a == "") {
                var h = eval("(" + g + ")")["default"];
                return $defined(h) ? {
                    value: h
                } : c
            }
        } else {
            if (typeof(d) == "string") {
                c.value = d;
                c.realvalue = d;
                g = a
            }else if (typeof(d) == "number") {
                c.value = d;
                c.realvalue = d;
                g = a
            }
        } if (sword_fmt.defFmt[g]) {
            g = sword_fmt.defFmt[g]
        }
        try {
            $.extend(c, eval("(" + g + ")"))
        } catch (f) {}
        return this.builderText(c)
    },
    builderItem: function(a) {},
    aptitude: function(a) {},
    builderText: function(a) {
        if (a) {
            if (a.func) {
                var b = sword_getFunc(a.func)[0];
                a.func = b
            }
            if (this[a.type]) {
                $.extend(a, this[a.type].apply(document,[a]));
                if (a.func) {
                    a.func.apply(document,[a])
                }
            }
            return a
        } else {
            return {
                value: "",
                style: ""
            }
        }
    },
    routine: function(a) {},
    datePatterns: ["Y-m-d H:i:s.u", "Y-m-d H:i:s", "Y-m-d", "y-m-d", "m/d/y", "Y/m/d", "y/m/d", "Ymd", "ymd"],
    date: function(a) {
        var c = "";
        var d;
        if (!$chk(a.format)) {
            a.format = Date.patterns.ISO8601Long
        } else {
            if (a.value == "now") {
                d = new Date();
                c = d.dateFormat(a.format)
            } else {
                if (!$chk(a.analysisFormat)) {
                    for (var b = 0; b < sword_fmt.datePatterns.length; b++) {
                        d = Date.parseDate(a.value, sword_fmt.datePatterns[b]);
                        if (d) {
                            break
                        }
                    }
                } else {
                    d = Date.parseDate(a.value, a.analysisFormat)
                } if ($chk(d)) {
                    c = d.dateFormat(a.format)
                } else {
                    c = a.value
                }
            }
        }
        $.extend(a, {
            value: c,
            obj: d
        });
        return a
    },
    number: function(a) {
        var c = a.value;
        if (!$chk(c)) {
            c = 0
        }
        var b = (c / 1).numberFormat(a.format);
        b == Number.prototype.NaNstring ? a.value = (0 / 1).numberFormat(a.format) : a.value = b;
        return a
    },
    money: function(a) {
        alert(JSON.encode(a))
    },
    percent: function(d) {
        var c = d.value + "";
        var b = c.split(".");
        if (b.length > 1) {
            c = "";
            if (b[0].substring(0, 1) != "0") {
                c += b[0]
            }
            if (b[1].length > 2) {
                c += b[1].substring(0, 2);
                c = c.toInt() + "." + b[1].substring(2)
            } else {
                if (b[1].length == 2) {
                    c = (c + b[1].substring(0, 2)).toInt()
                } else {
                    c = (c + (b[1] + "0")).toInt()
                }
            }
        } else {
            c += (c.toInt() == 0) ? "" : "00"
        }
        d.value = c + "%";
        return d
    },
    exceptive: function(a) {},
    customer: function(a) {},
    money_chi: function(b) {
        var a = b.value;
        if (a) {
            b.value = sword_fmt_convertCurrency(a)
        }
        return b
    }
};

function sword_fmt_convertCurrency(y) {
    y = (typeof y == "string") ? y / 1 : y;
    var c = 99999999999.99;
    var C = "零";
    var G = "壹";
    var l = "贰";
    var m = "叁";
    var o = "肆";
    var I = "伍";
    var F = "陆";
    var B = "柒";
    var K = "捌";
    var D = "玖";
    var h = "拾";
    var r = "佰";
    var u = "仟";
    var g = "万";
    var k = "亿";
    var A = "";
    var x = "元";
    var f = "角";
    var v = "分";
    var z = "整";
    var b;
    var N;
    var w;
    var J;
    var L, q, t, s;
    var a;
    var H, E, M;
    var O, n;
    y = y.toString();
    if (y == "") {
        return y
    }
    if (y.match(/[^,.\d]/) != null) {
        alert("输入字符中有不合法字符，请输入数字。");
        return y
    }
    if ((y).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
        alert("输入的格式不合法。");
        return y
    }
    y = y.replace(/,/g, "");
    y = y.replace(/^0+/, "");
    if (Number(y) > c) {
        alert("您输入的超过了最大值：" + c);
        return y
    }
    J = y.split(".");
    if (J.length > 1) {
        b = J[0];
        N = J[1];
        N = N.substr(0, 2)
    } else {
        b = J[0];
        N = ""
    }
    L = new Array(C, G, l, m, o, I, F, B, K, D);
    q = new Array("", h, r, u);
    t = new Array("", g, k);
    s = new Array(f, v);
    w = "";
    if (Number(b) > 0) {
        a = 0;
        for (H = 0; H < b.length; H++) {
            E = b.length - H - 1;
            M = b.substr(H, 1);
            O = E / 4;
            n = E % 4;
            if (M == "0") {
                a++
            } else {
                if (a > 0) {
                    w += L[0]
                }
                a = 0;
                w += L[Number(M)] + q[n]
            } if (n == 0 && a < 4) {
                w += t[O]
            }
        }
        w += x
    }
    if (N != "" && N != "00") {
        for (H = 0; H < N.length; H++) {
            M = N.substr(H, 1);
            if (M != "0") {
                w += L[Number(M)] + s[H]
            } else {
                w += L[Number(M)]
            }
        }
    } else {
        N = ""
    } if (w == "") {
        w = C + x
    }
    if (N == "") {
        w += z
    }
    w = A + w;
    return w
};


function accAdd(f, d) {
    if (f == null) {
        f = 0;
    };
    if (d == null) {
        d = 0;
    };
    var c, b, a;
    try {
        c = f.toString().split(".")[1].length
    } catch (g) {
        c = 0;
    };
    try {
        b = d.toString().split(".")[1].length
    } catch (g) {
        b = 0;
    };
    a = Math.pow(10, Math.max(c, b));
    return (f.multiple(a) + d.multiple(a)) / a;
};
Number.prototype.accAdd = function(a) {
    return parseFloat(accAdd(a, this));
};
String.prototype.accAdd = function(a) {
    return accAdd(a, this);
};

function accSubtr(f, d) {
    if (f == null) {
        f = 0;
    };
    if (d == null) {
        d = 0;
    };
    var c, b, a, h;
    try {
        c = f.toString().split(".")[1].length
    } catch (g) {
        c = 0;
    };
    try {
        b = d.toString().split(".")[1].length
    } catch (g) {
        b = 0;
    };
    a = Math.pow(10, Math.max(c, b));
    h = (c >= b) ? c : b;
    return ((f.multiple(a) - d.multiple(a)) / a).round(h);
};
Number.prototype.subtract = function(a) {
    return parseFloat(accSubtr(this, a));
};
String.prototype.subtract = function(a) {
    return accSubtr(this, a);
};

function accMul(k, g) {
    if (k == null) {
        k = 0
    }
    if (g == null) {
        g = 0
    }
    var d = 0,
        l = k.toString(),
        h = g.toString();
    var f = l.split(".");
    d += f.length > 1 ? f[1].length : 0;
    var c = h.split(".");
    d += c.length > 1 ? c[1].length : 0;
    return Number(l.replace(".", "")) * Number(h.replace(".", "")) / Math.pow(10, d)
};
Number.prototype.multiple = function(a) {
    return parseFloat(accMul(a, this))
};
String.prototype.multiple = function(a) {
    return accMul(a, this)
};

function accDiv(arg1, arg2) {
    if (arg1 == null) {
        arg1 = 0
    }
    if (arg2 == null) {
        arg2 = 0
    }
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1)
    }
}
Number.prototype.divide = function(a) {
    return parseFloat(accDiv(this, a))
};
String.prototype.divide = function(a) {
    return accDiv(this, a)
};

function round(a, c) {
    var b = 1;
    for (; c > 0; b *= 10, c--) {};
    for (; c < 0; b /= 10, c++) {};
    return Math.round(a.multiple(b)) / b;
};
Number.prototype.round = function(a) {
    return parseFloat(round(this, a));
};
String.prototype.round = function(a) {
    return round(this, a);
};
Number.formatFunctions = {
    count: 0
};
String.formatFunctions = {
    count: 0
};
Number.prototype.NaNstring = "NaN";
Number.prototype.posInfinity = "Infinity";
Number.prototype.negInfinity = "-Infinity";
Number.prototype.numberFormat = function(b, a) {
    if (isNaN(this)) {
        return Number.prototype.NaNstring
    } else {
        if (this == +Infinity) {
            return Number.prototype.posInfinity
        } else {
            if (this == -Infinity) {
                return Number.prototype.negInfinity
            } else {
                if (Number.formatFunctions[b] == null) {
                    Number.createNewFormat(b)
                }
            }
        }
    }
    return this[Number.formatFunctions[b]](a)
};
Number.createNewFormat = function(format) {
    var funcName = "format" + Number.formatFunctions.count++;
    Number.formatFunctions[format] = funcName;
    var code = "Number.prototype." + funcName + " = function(context){\n";
    var formats = format.split(";");
    switch (formats.length) {
        case 1:
            code += Number.createTerminalFormat(format);
            break;
        case 2:
            code += 'return (this < 0) ? this.numberFormat("' + $wings_escape(formats[1]) + '", 1) : this.numberFormat("' + $wings_escape(formats[0]) + '", 2);';
            break;
        case 3:
            code += 'return (this < 0) ? this.numberFormat("' + $wings_escape(formats[1]) + '", 1) : ((this == 0) ? this.numberFormat("' + $wings_escape(formats[2]) + '", 2) : this.numberFormat("' + $wings_escape(formats[0]) + '", 3));';
            break;
        default:
            code += "throw 'Too many semicolons in format string';";
            break
    }
    eval(code + "}")
};
Number.createTerminalFormat = function(l) {
    if (l.length > 0 && l.search(/[0#?]/) == -1) {
        return "return '" + $wings_escape(l) + "';\n"
    };
    var a = "var val = (context == null) ? new Number(this) : Math.abs(this);\n";
    var g = false;
    var f = l;
    var h = "";
    var n = 0;
    var o = 0;
    var b = 0;
    var k = false;
    var c = "";
    d = l.match(/\..*(e)([+-]?)(0+)/i);
    if (d) {
        c = d[1];
        k = (d[2] == "+");
        b = d[3].length;
        l = l.replace(/(e)([+-]?)(0+)/i, "")
    };
    var d = l.match(/^([^.]*)\.(.*)$/);
    if (d) {
        f = d[1].replace(/\./g, "");
        h = d[2].replace(/\./g, "")
    };
    if (l.indexOf("%") >= 0) {
        a += "val *= 100;\n"
    };
    d = f.match(/(,+)(?:$|[^0#?,])/);
    if (d) {
        a += "val /= " + Math.pow(1000, d[1].length) + "\n;"
    };
    if (f.search(/[0#?],[0#?]/) >= 0) {
        g = true
    };
    if ((d) || g) {
        f = f.replace(/,/g, "")
    };
    d = f.match(/0[0#?]*/);
    if (d) {
        n = d[0].length
    };
    d = h.match(/[0#?]*/);
    if (d) {
        o = d[0].length
    };
    if (b > 0) {
        a += "var sci = Number.toScientific(val," + n + ", " + o + ", " + b + ", " + k + ");\nvar arr = [sci.l, sci.r];\n"
    } else {
        if (l.indexOf(".") < 0) {
            a += "val = (val > 0&&val.toString().indexOf('.')!=-1&&val.toString().split('.')[1][0]<=4) ? Math.floor(val) : Math.ceil(val);\n"
        };
        a += "var arr = val.round(" + o + ").toFixed(" + o + ").split('.');\n";
        a += "arr[0] = (val < 0 ? '-' : '') + $wings_leftPad((val < 0 ? arr[0].substring(1) : arr[0]), " + n + ", '0');\n"
    } if (g) {
        a += "arr[0] = Number.addSeparators(arr[0]);\n";
    };
    a += "arr[0] = Number.injectIntoFormat(arr[0].reverse(), '" + $wings_escape(f.reverse()) + "', true).reverse();\n";
    if (o > 0) {
        a += "arr[1] = Number.injectIntoFormat(arr[1], '" + $wings_escape(h) + "', false);\n"
    };
    if (b > 0) {
        a += "arr[1] = arr[1].replace(/(\\d{" + o + "})/, '$1" + c + "' + sci.s);\n"
    };
    return a + "return arr.join('.');\n";
};
Number.toScientific = function(c, h, k, b, d) {
    var l = {
        l: "",
        r: "",
        s: ""
    };
    var f = "";
    var g = Math.abs(c).toFixed(h + k + 1).trim("0");
    var a = Math.round(new Number(g.replace(".", "").replace(new RegExp("(\\d{" + (h + k) + "})(.*)"), "$1.$2"))).toFixed(0);
    if (a.length >= h) {
        a = a.substring(0, h) + "." + a.substring(h)
    } else {
        a += "."
    };
    l.s = (g.indexOf(".") - g.search(/[1-9]/)) - a.indexOf(".");
    if (l.s < 0) {
        l.s++
    };
    l.l = (c < 0 ? "-" : "") + $wings_leftPad(a.substring(0, a.indexOf(".")), h, "0");
    l.r = a.substring(a.indexOf(".") + 1);
    if (l.s < 0) {
        f = "-"
    } else {
        if (d) {
            f = "+"
        }
    };
    l.s = f + $wings_leftPad(Math.abs(l.s).toFixed(0), b, "0");
    return l;
};
Number.injectIntoFormat = function(h, g, b) {
    var d = 0;
    var c = 0;
    var a = "";
    var f = h.charAt(h.length - 1) == "-";
    if (f) {
        h = h.substring(0, h.length - 1)
    };
    while (d < g.length && c < h.length && g.substring(d).search(/[0#?]/) >= 0) {
        if (g.charAt(d).match(/[0#?]/)) {
            if (h.charAt(c) != "-") {
                a += h.charAt(c);
            } else {
                a += "0";
            };
            c++;
        } else {
            a += g.charAt(d);
        };
        ++d;
    };
    if (f && c == h.length) {
        a += "-";
    };
    if (c < h.length) {
        if (b) {
            a += h.substring(c);
        };
        if (f) {
            a += "-";
        };
    };
    if (d < g.length) {
        a += g.substring(d);
    };
    return a.replace(/#/g, "").replace(/\?/g, " ");
};
Number.addSeparators = function(a) {
    return a.reverse().replace(/(\d{3})/g, "$1,").reverse().replace(/^(-)?,/, "$1");
};

Date.parseFunctions = {
    count: 0
};
Date.parseRegexes = [];
Date.formatFunctions = {
    count: 0
};
Date.patterns = {
    ISO8601Long: "Y-m-d H:i:s",
    ISO8601Short: "Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
Date.prototype.dateFormat = function(b) {
    if (Date.formatFunctions[b] == null) {
        Date.createNewFormat(b)
    };
    var a = Date.formatFunctions[b];
    return this[a]();
};
Date.prototype.format = Date.prototype.dateFormat;
Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true
        } else {
            if (special) {
                special = false;
                code += "'" + $wings_escape(ch) + "' + "
            } else {
                code += Date.getFormatCode(ch)
            }
        };
    };
    eval(code.substring(0, code.length - 3) + ";}");
};
Date.getFormatCode = function(a) {
    switch (a) {
        case "d":
            return "$wings_leftPad(this.getDate(), 2, '0') + ";
        case "D":
            return "Date.dayNames[this.getDay()].substring(0, 3) + ";
        case "j":
            return "this.getDate() + ";
        case "l":
            return "Date.dayNames[this.getDay()] + ";
        case "S":
            return "this.getSuffix() + ";
        case "w":
            return "this.getDay() + ";
        case "z":
            return "this.getDayOfYear() + ";
        case "W":
            return "this.getWeekOfYear() + ";
        case "F":
            return "Date.monthNames[this.getMonth()] + ";
        case "m":
            return "$wings_leftPad(this.getMonth() + 1, 2, '0') + ";
        case "M":
            return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
        case "n":
            return "(this.getMonth() + 1) + ";
        case "t":
            return "this.getDaysInMonth() + ";
        case "L":
            return "(this.isLeapYear() ? 1 : 0) + ";
        case "Y":
            return "this.getFullYear() + ";
        case "y":
            return "('' + this.getFullYear()).substring(2, 4) + ";
        case "a":
            return "(this.getHours() < 12 ? 'am' : 'pm') + ";
        case "A":
            return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
        case "g":
            return "((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";
        case "G":
            return "this.getHours() + ";
        case "h":
            return "$wings_leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";
        case "H":
            return "$wings_leftPad(this.getHours(), 2, '0') + ";
        case "i":
            return "$wings_leftPad(this.getMinutes(), 2, '0') + ";
        case "s":
            return "$wings_leftPad(this.getSeconds(), 2, '0') + ";
        case "u":
            return "$wings_leftPad(this.getMilliseconds(), 4, '0') + ";
        case "O":
            return "this.getGMTOffset() + ";
        case "T":
            return "this.getTimezone() + ";
        case "Z":
            return "(this.getTimezoneOffset() * -60) + ";
        default:
            return "'" + $wings_escape(a) + "' + ";
    };
};
Date.parseDate = function(a, c) {
    if (Date.parseFunctions[c] == null) {
        Date.createParser(c);
    };
    var b = Date.parseFunctions[c];
    return Date[b](a);
};
Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;
    var code = "Date." + funcName + " = function(input){\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, o, z, v;\nvar d = new Date();\ny = d.getFullYear();" +
    "\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes[" + regexNum + "]);\nif (results && results.length > 0) {";
    var regex = "";
    var special = false;
    var ch = "";
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        } else {
            if (special) {
                special = false;
                regex += $wings_escape(ch)
            } else {
                var obj = Date.formatCodeToRegex(ch, currentGroup);
                currentGroup += obj.g;
                regex += obj.s;
                if (obj.g && obj.c) {
                    code += obj.c;
                };
            };
        };
    };
    code += "if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{v = new Date(y, m, d, h, i, s);}\nelse if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{v = new Date(y, m, d, h, i);}" +
    "\nelse if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n{v = new Date(y, m, d, h);}\nelse if (y >= 0 && m >= 0 && d > 0)\n{v = new Date(y, m, d);}\nelse if (y >= 0 && m >= 0)\n{v = new Date(y, m);}" +
    "\nelse if (y >= 0)\n{v = new Date(y);}\n}return (v && (z || o))?\n    " +
    "((z)? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n;}";
    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
    eval(code);
};
Date.formatCodeToRegex = function(b, a) {
    switch (b) {
        case "D":
            return {
                g: 0,
                c: null,
                s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"
            };
        case "j":
            return {
                g: 1,
                c: "d = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{1,2})"
            };
        case "d":
            return {
                g: 1,
                c: "d = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{2})"
            };
        case "l":
            return {
                g: 0,
                c: null,
                s: "(?:" + Date.dayNames.join("|") + ")"
            };
        case "S":
            return {
                g: 0,
                c: null,
                s: "(?:st|nd|rd|th)"
            };
        case "w":
            return {
                g: 0,
                c: null,
                s: "\\d"
            };
        case "z":
            return {
                g: 0,
                c: null,
                s: "(?:\\d{1,3})"
            };
        case "W":
            return {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            };
        case "F":
            return {
                g: 1,
                c: "m = parseInt(Date.monthNumbers[results[" + a + "].substring(0, 1).toUpperCase() + results[" + a + "].substring(1, 3).toLowerCase()], 10);\n",
                s: "(" + Date.monthNames.join("|") + ")"
            };
        case "M":
            return {
                g: 1,
                c: "m = parseInt(Date.monthNumbers[results[" + a + "].substring(0, 1).toUpperCase() + results[" + a + "].substring(1, 3).toLowerCase()], 10);\n",
                s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
            };
        case "n":
            return {
                g: 1,
                c: "m = parseInt(results[" + a + "], 10) - 1;\n",
                s: "(\\d{1,2})"
            };
        case "m":
            return {
                g: 1,
                c: "m = parseInt(results[" + a + "], 10) - 1;\n",
                s: "(\\d{2})"
            };
        case "t":
            return {
                g: 0,
                c: null,
                s: "\\d{1,2}"
            };
        case "L":
            return {
                g: 0,
                c: null,
                s: "(?:1|0)"
            };
        case "Y":
            return {
                g: 1,
                c: "y = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{4})"
            };
        case "y":
            return {
                g: 1,
                c: "var ty = parseInt(results[" + a + "], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
                s: "(\\d{1,2})"
            };
        case "a":
            return {
                g: 1,
                c: "if (results[" + a + "] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                s: "(am|pm)"
            };
        case "A":
            return {
                g: 1,
                c: "if (results[" + a + "] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                s: "(AM|PM)"
            };
        case "g":
        case "G":
            return {
                g: 1,
                c: "h = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{1,2})"
            };
        case "h":
        case "H":
            return {
                g: 1,
                c: "h = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{2})"
            };
        case "i":
            return {
                g: 1,
                c: "i = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{2})"
            };
        case "s":
            return {
                g: 1,
                c: "s = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{2})"
            };
        case "u":
            return {
                g: 1,
                c: "u = parseInt(results[" + a + "], 10);\n",
                s: "(\\d{4})"
            };
        case "O":
            return {
                g: 1,
                c: ["o = results[", a, "];\n", "var sn = o.substring(0,1);\n", "var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n", "var mn = o.substring(3,5) % 60;\n", "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n", "    (sn + $wings_leftPad(hr, 2, 0) + $wings_leftPad(mn, 2, 0)) : null;\n"].join(""),
                s: "([+-]\\d{4})"
            };
        case "T":
            return {
                g: 0,
                c: null,
                s: "[A-Z]{1,4}"
            };
        case "Z":
            return {
                g: 1,
                c: "z = results[" + a + "];\nz = (-43200 <= z*1 && z*1 <= 50400)? z : null;\n",
                s: "([+-]?\\d{1,5})"
            };
        default:
            return {
                g: 0,
                c: null,
                s: $wings_escape(b)
            };
    };
};
Date.prototype.getTimezone = function() {
    return this.toString().replace(/^.*? ([A-Z]{1,4})[\-+][0-9]{4} .*$/, "$1");
};
Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+") + $wings_leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0") + $wings_leftPad(this.getTimezoneOffset() % 60, 2, "0");
};
Date.prototype.getDayOfYear = function() {
    var a = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var b = 0; b < this.getMonth(); ++b) {
        a += Date.daysInMonth[b];
    };
    return a + this.getDate() - 1;
};
Date.prototype.getWeekOfYear = function() {
    var b = this.getDayOfYear() + (4 - this.getDay());
    var a = new Date(this.getFullYear(), 0, 1);
    var c = (7 - a.getDay() + 4);
    return $wings_leftPad(((b - c) / 7) + 1, 2, "0");
};
Date.prototype.isLeapYear = function() {
    var a = this.getFullYear();
    return ((a & 3) == 0 && (a % 100 || (a % 400 == 0 && a)));
};
Date.prototype.getFirstDayOfMonth = function() {
    var a = (this.getDay() - (this.getDate() - 1)) % 7;
    return (a < 0) ? (a + 7) : a;
};
Date.prototype.getLastDayOfMonth = function() {
    var a = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (a < 0) ? (a + 7) : a;
};
Date.prototype.getFirstDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), 1);
};
Date.prototype.getLastDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
};
Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
};
Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th"
    };
};
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Date.y2kYear = 50;
Date.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};
Date.prototype.clone = function() {
    return new Date(this.getTime());
};
Date.prototype.clearTime = function(a) {
    if (a) {
        return this.clone().clearTime();
    }
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};
Date.MILLI = "ms";
Date.SECOND = "s";
Date.MINUTE = "mi";
Date.HOUR = "h";
Date.DAY = "d";
Date.MONTH = "mo";
Date.YEAR = "y";
Date.prototype.add = function(b, c) {
    var f = this.clone();
    if (!b || c === 0) {
        return f;
    };
    switch (b.toLowerCase()) {
        case Date.MILLI:
            f.setMilliseconds(this.getMilliseconds() + c);
            break;
        case Date.SECOND:
            f.setSeconds(this.getSeconds() + c);
            break;
        case Date.MINUTE:
            f.setMinutes(this.getMinutes() + c);
            break;
        case Date.HOUR:
            f.setHours(this.getHours() + c);
            break;
        case Date.DAY:
            f.setDate(this.getDate() + c);
            break;
        case Date.MONTH:
            var a = this.getDate();
            if (a > 28) {
                a = Math.min(a, this.getFirstDateOfMonth().add("mo", c).getLastDateOfMonth().getDate())
            }
            f.setDate(a);
            f.setMonth(this.getMonth() + c);
            break;
        case Date.YEAR:
            f.setFullYear(this.getFullYear() + c);
            break
    };
    return f;
};
Date.prototype.between = function(c, a) {
    var b = this.getTime();
    return b >= c.getTime() && b <= a.getTime()
};

	// ============= format (end) ==================

	// ============= formula  (begin)计算公式 ==================
/**
 * 计算用公式

 * 
 * @type {}
 */
var gs_caculate;
/**
 * 页面元素缓存
 * 
 * @type {}
 */
var s5_formula_ele = {};
/**
 * 测试用公式

 * 
 * @type {}
 */
/*
var gs_gjj = ["{f1_18}={f1_15}",
		"{f1_25}={f1_18}>20?{f1_21}+{f1_23}+{f1_24}:{f1_21}",
		"{f1_15}={f1_11}+{f1_13}", "{f1_28}={f1_25}/{f1_26}",
		"{f1_35}={f1_31}+{f1_33}+{f1_34}"];
*/
var gs_gjj = null;
/**
 * 需要注册onchange事件的元素

 * 
 * @type {}
 */
var id_need_registed_change = {};
/**
 * 需要注册onfocus事件的元素

 * 
 * @type {}
 */
var id_need_registed_onfocus = {};
/**
 * 默认背景色

 * 
 * @type {String}
 */
var background_default = "";
/**
 * 警告背景色

 * 
 * @type {String}
 */
var background_alarm = "#cc99ff";
/**
 * 提交标记
 * 
 * @type {true:能提交 false:不能提交}
 */
var commit_flag;
/**
 * 初始化

 */
var $init_gs_caculate = function(){
	if (!gs_gjj || gs_gjj.length == 0) {
		return;
	};
	gs_caculate = thgs(gs_gjj); //替换公式
	for (var p in id_need_registed_change) {//公式的每一个变量为页面的div元素，为div注册change事件，
		var obj = $wings_val_ps(p);
		$wings_registerEvent(obj, {
			"change" : [function() {
				try {
					var tid = this[0].id;
					var indexS = tid.lastIndexOf('_');
					var id = tid.substring(0,indexS);
					$wings_caculate(id);   //公式计算
				} catch (e) {
					alert(e);
					this.focus();
				};
			}]
		});
	};
	// 给函数集合注册异常处理事件

	for (var p in id_need_registed_onfocus) {
		var obj = $wings_val_ps(p);
//		$wings_registerEvent(obj, {
//			"focus" : [function() {
//				//alert("111");
//				if (this.value == "Infinity") {
//					for (var pp in id_need_registed_onfocus[this.id]) {
//						if($(pp).hasClass("swordform_item_input_disable")) return;
//						$wings_val_ps(pp).style.background = background_alarm;
//					}
//				}
//			}],
//			"blur" : [function() {
//				//alert("222");
//				for (var pp in id_need_registed_onfocus[this.id]) {
//					if($(pp).hasClass("swordform_item_input_disable")) return;
//					$wings_val_ps(pp).style.background = background_default;
//				};
//			}]
//		});
	};

};
//window.addEvent("domready",$init_gs_caculate);

/**
 * 注册事件
 * 
 * @param {}
 *            obj
 * @param {}
 *            events
 */
//function registerEvent(obj, events) {
//	if(obj){
//		for (var e in events) {
//			var array = events[e];
//			// 使用代理注册事件，能够将this指定到当前元素
//			obj.addEvent(e, delegate(obj, array));
//		};
//	};
//};
function delegate(o, array) {
	return function() {
		for (var i = 0; i < array.length; i++) {
			array[i].call(o);
		};
	};
};

function $wings_registerEvent(obj, events) {
	if(obj){
		for (var type in events) {
			var array = events[type];
			// 使用代理注册事件，能够将this指定到当前元素(jq对象)
//			obj[0].addEventListener(type,delegate(obj, array));
			obj.on(type,delegate(obj, array));
		};
	};
};


/**
 * 替换公式
 * 
 * @param {}
 *            gs
 * @return {}
 */
function thgs(ysgs) {
	var gs = ysgs.join("][");
	gs = "[" + gs + "]";
	var result;
	var map = {};
	for (var loop = 0; loop < ysgs.length; loop++) {
		var iys = ysgs[loop];
		if($chk(iys)){
			var index = iys.indexOf('=');
		var array=[];
		if(index!=-1){
			array[0]=iys.substring(0,index);
			array[1]=iys.substring(index+1);
			
			//var array = String.prototype.split.call(ysgs[loop], "=");//将每个公式按等号分隔
			// map[$.trim(array[0])] = $.trim(array[1]); edit by pushi 2011-05-04
			map[array[0]] = array[1];//将等号左边数与等号右边公式对应存储
		};
		};
	};
	// 从公式组字符串中截取单个公式
	result = gs.replace(/\[{1}[^\[\]]*?\]{1}/g, function(m) {
		// 筛选{y5}={y1}+{y2};这种公式
		var regsep = /\[{1}([^(\[|\])])*?\=[^{]*\{(.+?)\}*[^{]*\]{1}/;
		if (m.match(regsep)) {
			var eq = m.indexOf('=');
			var tmp=[];
			if(eq!=-1){
				tmp[0]=m.substring(1,eq);
				tmp[1]=m.substring(eq+1);
			};
			//var tmp = String.prototype.split.call(m, "=");
			// 当前公式涉及的自变量集合
			var zbl_array = {};
			// 替换公式递归函数
			function thstr(str) {
				// 将等号右边的公式自变量部分的所有自变量筛选出来，如果是伪自变量（即函数作为其他公式的自变量存在）的，进行迭代替换。
				//将 3 = 1 + 2 ， 5 = 3 +4 变成 5 = 1 + 2 + 4 ；但是处理 3 = 1 + 3 这样的有bug 会死循环。
				str = str.replace(/\{(.+?)\}/g, function(x, i) {
					if (map[x]) {  
						x = "(" + thstr(map[x]) + ")";
					};
					// 注册自变量集合

					id_need_registed_change[i] = i;
					zbl_array[i] = i;
					return x;
				});
				return str;
			};
			var tmp_y = new String(tmp[0].substr(1, tmp[0].length));
			tmp_y.replace(/\{(.+?)\}/g, function(x, i) {
				// 注册函数集合
				id_need_registed_onfocus[i] = zbl_array;
				return "";
			});
			m = "[" + tmp[0] + "=" + thstr(tmp[1].substr(0, tmp[1].length - 1)) + "]";
		};
		return m;
	});
	return result;
};

/**
 * 取小数点后两位，如果为负数，置为0
 * 
 * @param {}
 *            s
 * @return {Number}
 */
function pf(s,id) {
	if (!isNaN(parseFloat(s))) {
		var gs=2;
		var el=$(id);
		if($chk(el) && $chk(el.get('gs'))){
			gs = el.get('gs');
		};
		var strInt = s.round(gs);
        if (el && el.format) {
            return sword_fmt.formatText(el, strInt, '', el.format).value;
        } else {
            return parseFloat(strInt);
        };
	} else {
        return 0;
	};
};
/**
 * 填充FROM缓存对象
 */
//function fillform() {
//	var tags = document.getElementsByTagName("input");
//	for (var i = 0; i < tags.length; i++) {
//		if (tags[i].id != "") {
//			s5_formula_ele[tags[i].id] = tags[i];
//		};
//	};
//};
/**
 * 公式引擎--计算方法
 * 
 * @param {}
 *            id
 */
//function caculate(tid) {
//	var indexS = tid.lastIndexOf('_');
//	var id = tid.substring(0,indexS);
//	
//	// 截取自变量变化所影响到的公式
//	var re = new RegExp("\\[{1}[^\\[|\\]]*?\\{" + id + "}.*?\\]{1}", "g");
//	var temp = new String(gs_caculate);
//	var begin = new Date();
//	temp.replace(re, function() {// 筛选出的需要计算的公式[]
//				var s = Array.prototype.slice.call(arguments, 0, 1)[0];
//				var index = s.indexOf("=");
//				// 将自变量的值替换进公式并执行计算
//				var y;// 缓存需要计算公式的y
//				s = String.prototype.slice.call(s, 1, -1).replace(/\{(.+?)\}/g,
//						function(m, i) {// 替换自变量
//							var l = Array.prototype.slice.call(arguments, -2,
//									-1)[0];
//							if (l < index) {
//								y = "s5_formula_ele['" + i + "'].value";
//								return y;
//							} else {
//								var v = val(s5_formula_ele[i].value);
//								if(v<0){
//									v=v+"";
//									var vs = v.split('-');
//									v = "(0).subtract("+vs[1]+")"; //解决负数解析出错
//								};
//								return '('+v+')';
//							};
//
//						});
//				var str = beforeval(s); //原值 回写 替换 + - * / 号
//				eval(str);// 公式计算	//
//                var real = y.replace(/value$/,"set('realvalue'," + y+ ".replace(/[$,%]/g,''))");
//                eval(y + "=pf(" + y+","+y.split("'")[1]+ ")");// 对公式计算结果截取小数点
//				eval(real); //设置realValue
//				if (eval(y + "=='Infinity'")) {
//					throw "除零错误！请检查录入的数据！";
//				};
//				return "";
//			});
//	var end = new Date();
//	
//};
function caculate(id) {
	$wings_caculate(id);
};

function $wings_caculate(id) {
	
	// 截取自变量变化所影响到的公式
	var re = new RegExp("\\[{1}[^\\[|\\]]*?\\{" + id + "}.*?\\]{1}", "g");
	var temp = new String(gs_caculate);
	var begin = new Date();
	temp.replace(re, function() {// 筛选出的需要计算的公式[]
				var s = Array.prototype.slice.call(arguments, 0, 1)[0];
				var index = s.indexOf("=");
				// 将自变量的值替换进公式并执行计算
				var y;// 缓存需要计算公式的y
				s = String.prototype.slice.call(s, 1, -1).replace(/\{(.+?)\}/g,
						function(m, i) {// 替换自变量
							var l = Array.prototype.slice.call(arguments, -2,
									-1)[0];
							if (l < index) {
								//等号前的
								y = "$wings_formula_setValue('" + i + "',";
								return y;
							} else {
								//等号后边的
								var v = $wings_formula_getValue(i);
								if(v<0){
									v=v+"";
									var vs = v.split('-');
									v = "(0).subtract("+vs[1]+")"; //解决负数解析出错
								};
								return '('+v+')';
							};

						});
				var str = beforeval(s); //原值 回写 替换 + - * / 号
				str = str.replace("=","") + ")";
				//"$wings_formula_setValue(\'leiForm_num001\',(23.45578).accAdd(23.45578))";
//				alert(str);
				eval(str);// 公式计算	//
				return "";
			});
	var end = new Date();
	
};

function beforeval(s){
	var re=new RegExp("[\\+\\-*/]+","g");
	s = s.replace(re, function(m) {
				if(m=="+")return ".accAdd";
				else if(m=="-") return ".subtract";
				else if(m=="*") return ".multiple";
				else if(m=="/") return ".divide";
				else return m;
			});
	
	return s;
};

function $wings_formula_tre(id){
	var array =null;
	if($chk(id)){
		var index = id.indexOf('_');
		if(index!=-1){
			array = id.split("_");
//			array[0] = id.substring(0,index);//Form
//			array[1] = id.substring(index+1);//ele
		};
	};
	return array;
};
/**
 * 设置值
 * @param {Object} v
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
function $wings_formula_setValue(id,value){
	var array = $wings_formula_tre(id);
	if(array){
		pName = array[0];//Form
		sName =  array[1];//ele
		var formObj = $.wingsWidget(pName);
		if(formObj&& formObj.opts && formObj.opts.type === 'wingsForm'){
			return formObj.setValue(sName,value,{"noChange":"true"});
		};
	};
};
/**
 * 获得值
 * @param {Object} v
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
function $wings_formula_getValue(id){
	var array = $wings_formula_tre(id);
	if(array){
		pName = array[0];//Form
		sName =  array[1];//ele
		var formObj = $.wingsWidget(pName);
		if(formObj&& formObj.opts && formObj.opts.type === 'wingsForm'){
			return formObj.getValue(sName);
		};
	};
	return id;
	
};



/**
 * 取元素值，没有值按0对待
 * 
 * @param {}
 *            v
 * @return {Number}
 */
//function val(v) {
//	var value = replaceNum(v);
//	if (isNaN(value)) {
//		return 0;
//	};
//	if(new String(value).length>16){
//		return value;
//	}else{
//		return new Number(value);
//	};
//};
/**
 * 替换页面空格
 * 
 * @param {}
 *            Num
 * @return {}
 */
//function replaceNum(Num) {
//	if(new String(Num).length>16){
//		return ("" + Num).replace(/(^\s+)|(\s+$)/g, "").replace(/,/g, "");
//	}else{
//		var nstr = ("" + Num).replace(/(^\s+)|(\s+$)/g, "").replace(/,/g, "");
//		if (nstr.endWith("%")){
//		   return (parseFloat(nstr)/100);
//		}else return parseFloat(nstr);
//	};
//};
/**
 * 根据ID获取界面元素
 * 
 * @param {}
 *            id
 * @return {}
 */
//function val_ps(id) {
//	if (s5_formula_ele[id]) {
//		return s5_formula_ele[id];
//	} else {
//		s5_formula_ele[id] = $(id);//获取页面div元素
//		return s5_formula_ele[id];
//
//	};
//};

function $wings_val_ps(id) {
	//解析ID 获得页面对象用以绑定事件
	var obj = null;
	var array = $wings_formula_tre(id);
	if(array){
		pName = array[0];//Form
		sName =  array[1];//ele
		var pObj = $.wingsWidget(pName);
		if(pObj&& pObj.opts && pObj.opts.type === 'wingsForm'){
			//form组件
			var el_opts = pObj.opts.widgetMap[pObj.opts.name][sName];
			if(el_opts && (el_opts.type === "text")){
				obj = el_opts.selfObj;
			}
		}
	}
	return obj;
}

/**
 * 取绝对值计算。
 * @param val 数值
 * @return
 */
var ABS = function (val){
	return Math.abs(val);
};

/**
 * IF判断计算,如果条件值为真则返回param1,如果条件值为假则返回param2。
 * @param bj 布尔值,param1 真值, param2 假值
 * @return param1/param2 值
 */
var IF = function(bj,param1, param2){
	if(bj){
		return param1;
	}else{
		return param2;
	};
};
/**
 * OR函数。
 * @param 不定参数。参数全部为布尔值
 * @return 当所有参数为假则返回false,否则返回true
 */
var OR = function(){
	var leng = arguments.length;
	for(var i = 0; i < leng; i++){
		if(arguments[i]){
			return true;
		};
	};
	return false;
};
/**
 * AND函数。
 * @param 不定参数。参数全部为布尔值
 * @return 当所有参数为真则返回true,否则返回false
 */
var AND = function(){
	var leng = arguments.length;
	for(var i = 0; i < leng; i++){
		if(!arguments[i]){
			return false;
		};
	};
	return true;
};

	// ============= formula  (end)计算公式 ==================


	
	// ============= WingsSubmit 组件 (begin) ==================
	//封装一个map对象
	function WingsSubmit(){
		this.options = {
			tid:'',
			ctrl : '',
			async : 'false',
			mask:'false',
			data:[],
			postType:'ajax',
			onSubmitAfter:'',
			headers:{},
			bindParam : true
		};
	};
	//(1)setctrl
	WingsSubmit.prototype.setCtrl = function(ctrlStr){
		this.options.ctrl = ctrlStr;
	};
	WingsSubmit.prototype.setMask = function(maskStr){
		this.options.mask = maskStr;
	};
	WingsSubmit.prototype.setHeaders = function(headersStr){
		this.options.headers = headersStr;
	};
	WingsSubmit.prototype.setOptions = function(options){
		this.options = $.extend({}, this.options, options);
		if(typeof this.options.onSuccess == "function" ){
			var keyArr = [];
			keyArr.push(this.options.onSuccess);
			this.options.onSuccess = keyArr;
		};
		if(typeof this.options.onError == "function" ){
			var keyArr = [];
			keyArr.push(this.options.onError);
			this.options.onError = keyArr;
		};
		if(typeof this.options.onException == "function" ){
			var keyArr = [];
			keyArr.push(this.options.onException);
			this.options.onException = keyArr;
		};
		
	};
	
	WingsSubmit.prototype.setFunction = function(onStr,funcStr){
		if(onStr == "onSuccess"){
			this.options.onSuccess = wings_getFunc(funcStr);
		};
		if(onStr == "onError"){
			this.options.onError = wings_getFunc(funcStr);
		};
		if(onStr == "onException"){
			this.options.onException = wings_getFunc(funcStr);
		};
	};
	//是否含有文件
	WingsSubmit.prototype.isHasFile = function(onStr,funcStr){
		return this.options.hasFile;
	};
	//设置要提交的对象 form 和 gird （带文件上传的 只能用这个）
	WingsSubmit.prototype.setDateTarget = function(tarName){
		
	};
	
	WingsSubmit.prototype.setGridExcelInfo = function(tableName){
		var grid = $.wingsWidget(tableName);
		var header = grid.getHeader();
		var headerIndex = {};
		var headerInfo = {};//{"school": {value:"学校"}, "csTime": {value:"日期"}};
		                    //headerIndex = {"0":{value:"school"},"1":{value:"csTime"}};
		$.each(header, function(idx, item){
			headerIndex[item["index"]] = {value:item["name"]}; 
			headerInfo[item["name"]] = {value:item["caption"]};
		});
		this.pushData({name:tableName + '_headerIndex', data: headerIndex, sword:'SwordForm'});
		this.pushData({name:tableName + '_headerInfo', data: headerInfo, sword:'SwordForm'});
		this.pushData(grid.getAllGridShowData());
		this.pushData('tableName', tableName);
	};
	
	WingsSubmit.prototype.pushData = function(key, value){
//		var temp = {"name":key,"value":value,"sword":"attr"}
		//借用sword逻辑
		var temp = [] ;
        if (arguments.length == 2) {
            if (value == null || value == undefined) {
                value = ""
            }
            var f = {
                name: key,
                value: value + ""
            };
            temp.push(f)
        } else {
            if (typeof key == "object") {
                temp.push(key)
            } else {
                if (typeof key == "array") {
                    temp = key
                }
            }
        };
        for (var b = 0; b < temp.length; b++) {
            if (!temp[b]["sword"]) {
                temp[b]["sword"] = "attr"
            }
        };
        $.merge(this.options.data ,temp);
	};
	
	//提交，分form提交 和 ajax提交
	WingsSubmit.prototype.submit = function(){
		//(1)整理data
//		var subDate = '{"name":"lei","value":"123","sword":"attr"}'
//		+ ',{"sword":"SwordForm","name":"queryForm",'
//			+ '	"data":{"nsrsbh1":{"value":"111"},'
//			+ '			"nsrmc1":{"value":"222"},'
//			+ '			"nsrmcgjz1":{"value":"13132132"} '
//			+ '	} '
//			+ '}';
		var postData = '{"tid":"'+ this.options.tid +'","ctrl":"' + AddBizCode2URL(this.options.ctrl) + '",'
	 		+ '"data":' + JSON.stringify(this.options.data) + ','
			+ '"bindParam":'+ this.options.bindParam +'} ' ;
		//处理系统隐藏值
		//AddBizCode2URL
		//(2)区分提交方式
		var postType = this.options.postType;
		if(postType == 'form' || postType.indexOf('form_')!=-1 
				|| this.options.hasFile){ //带有文件上传的，强制 form提交
			var target = '';
			if(this.options.target){
				target = 'target="' + this.options.target + '" ' ;
			};
			if(postType.indexOf('form_')!=-1){
				target =  'target="' + postType.split("_")[1] + '" ' ;
			};
			
			//form提交方式
			//A 追加form标签
			//【lei】改造20180530（begin）
//			var url = '/form.sword?sName='+ this.options.ctrl;
			var url = '';
			if("undefined" == typeof $wings_param_isSwordAction || $wings_param_isSwordAction == 'sword'){
				//sword时（默认）
				url = '/form.sword?sName='+ this.options.ctrl;
			}else{
				//springMVC或其他时
				url = ''+ this.options.ctrl + "?1=1"; //TODO lei20180410
			}
			//【lei】改造20180530（end）
			
			var innerDate = ' <input name="postData" value=\''+ postData +'\' />';
			
			//特殊处理跨系统调用情况
			if(this.options.action){
				url = this.options.action;
				innerDate = this.options.innerHtml;
			};
			var id = "wingsSysFormID" + Math.floor(Math.random()*100) ;
			var innerHtml='<form id="'+id+'" method="post" style="display: none;"  action = "'+ AddBizCode2URL(url) +'" '+target+' >' 
					+ innerDate
					+'</form>' ;
			//B 追加form标签
			$(document.body).append(innerHtml);
			//C 提交
			$('#'+id).submit();
			
			//D 删除form标签
			$('#'+id).remove();
		}else if(postType == 'download'){
			//下载
			var target = '';
			if(this.options.target){
				target = 'target="' + this.options.target + '" ' ;
			};
			if(postType.indexOf('form_')!=-1){
				target =  'target="' + postType.split("_")[1] + '" ' ;
			};
			
			//form提交方式
			//A 追加form标签
			//【lei】改造20180530（begin）
//			var url = '/download.sword?sName='+ this.options.ctrl;
			var url = '';
			if("undefined" == typeof $wings_param_isSwordAction || $wings_param_isSwordAction == 'sword'){
				//sword时（默认）
				url = '/download.sword?sName='+ this.options.ctrl;
			}else{
				//springMVC或其他时
				url = ''+ this.options.ctrl + "?1=1"; //TODO lei20180410
			}
			//【lei】改造20180530（end）
			var innerDate = ' <input name="postData" value=\''+ postData +'\' />';
			
			//特殊处理跨系统调用情况
			if(this.options.action){
				url = this.options.action;
				innerDate = this.options.innerHtml;
			};
			var id = "wingsSysFormID" + Math.floor(Math.random()*100) ;
			var innerHtml='<form id="'+id+'" method="post" style="display: none;"  action = "'+ AddBizCode2URL(url) +'" '+target+' >' 
					+ innerDate
					+'</form>' ;
			//B 追加form标签
			$(document.body).append(innerHtml);
			//C 提交
			$('#'+id).submit();
			
			//D 删除form标签
			$('#'+id).remove();
		}else {
			//默认  ajax
			var opts = this.options;
			//【lei】改造20180530（begin）
//			var url = '/ajax.sword?ctrl='+ this.options.ctrl;
			var url = '';
			if("undefined" == typeof $wings_param_isSwordAction || $wings_param_isSwordAction == 'sword'){
				//sword时（默认）
				url = '/ajax.sword?ctrl='+ this.options.ctrl;
			}else{
				//springMVC或其他时
				url = ''+ this.options.ctrl + "?1=1"; //TODO lei20180410
			}
			//【lei】改造20180530（end）
			
			if(opts.mask == 'true'){
				try{
					wingsPageLoading.show();
				}catch(e){};
			};
			//(3)用ajax 提交
			$.ajax({
				 async:opts.async ,
				 type: 'POST',
				 //url: 'form.sword?sName='+ this.options.ctrl +'',
				 url: AddBizCode2URL(url),
				 wingsSubmitAjax:true,
				 headers:opts.headers?opts.headers:{},
				 wingsHasException:opts.onException?true:false,
				 data: { "postData": postData },
				 success: function (reqData) {
					if(opts.mask == 'true'){
						try{
		 					wingsPageLoading.hide();
						}catch(e){};
					};
			 		if(reqData && reqData.HasException){
			 			//异常
						if(opts.onException ){
							for (var b = 0; b < opts.onException.length; b++) {
					            var  func = eval(opts.onException[b]);
						       	if (typeof func == "function") {
					            	var result = new func(reqData);
						       	}
						    }
						}
			 		}else if(reqData){
			 			//20180208 处理纯js格式
			 			if(reqData.data){
				 			//成功
					 		//加载页面数据
							initWingsPageData(reqData.data);
							var req = new WingsReqData(reqData.data);
					 		//执行onSuccess 方法
							if(opts.onSuccess ){
								for (var b = 0; b < opts.onSuccess.length; b++) {
						            var  func = eval(opts.onSuccess[b]);
							       	if (typeof func == "function") {
						            	var result = new func(req);
							       	}
							    }
							}
			 			}else{
			 				//不是sword标准格式
					 		//执行onSuccess 方法
							if(opts.onSuccess ){
								for (var b = 0; b < opts.onSuccess.length; b++) {
						            var  func = eval(opts.onSuccess[b]);
							       	if (typeof func == "function") {
						            	var result = new func(reqData);
							       	}
							    }
							}
			 			}
				 		
					};
				 },
				 error:function (xhr,status,statusText) {
					if(opts.mask == 'true'){
						try{
		 					wingsPageLoading.hide();
						}catch(e){};
					};
					if(opts.onError ){
						for (var b = 0; b < opts.onError.length; b++) {
				            var  func = eval(opts.onError[b]);
					       	if (typeof func == "function") {
				            	var result = new func(xhr,status,statusText);
					       	}
					    }
					}
				 }
			});
			
		};
		

	};
	
	function WingsReqData(data){
		this.options = {
			data:data
		};
		this.data=data;
	};
	
	//根据名称 获得对象
	WingsReqData.prototype.getAttr = function(name){
		return getAttrFormData(this.options.data,name);
	};
	//根据名称 获得Form
	WingsReqData.prototype.getForm = function(name){
		return getFormData(this.options.data,name);
	};
	//根据名称 获得Grid
	WingsReqData.prototype.getData = function(name){
		return getGridFormData(this.options.data,name);
	};
	
	function getFormData(data,name){
		var temp = '';
		if(data){
			$.each(data, function(i, val) {
				if(val.sword == 'SwordForm'){
					if(val.name == name){
						temp = val.data;
					};
				};
			});
		};
		return temp;
	};
	
	function getAttrFormData(data,name){
		var temp = '';
		if(data){
			$.each(data, function(i, val) {
				if(!val.sword){
					if(val.name == name){
						temp = val.value;
					};
				};
			});
		};
		return temp;
	};
	
	function getGridFormData(data,name){
		var temp;
		if(data){
			$.each(data, function(i, val) {
				if(val.sword == 'SwordGrid'|| val.sword == 'SwordTree'
					|| val.sword == 'SwordSelect' || val.sword == 'SwordCheckBox'
						|| val.sword == 'SwordRadio'){
					if(val.name == name || val.dataName == name){
						temp = val;
					};
				};
			});
		};
		return temp;
	};
	
	// ============= WingsSubmit 组件 (end) ==================
	
	
	// ============= 进度条 组件 (begin) ==================

	var wingsPageLoading_defaults = {
		      lines: 12
		};

//进度条model页面（简单版）
var wingsPageLoading ={
	opt:$.extend({}, wingsPageLoading_defaults, {}),
	setOption:function(options){
		this.opt = $.extend({}, wingsPageLoading_defaults, options);
	},
	show:function(){
		//追加model页面
		var html = '<div class="modal-backdrop fade in wingsPageLoading " style="background-color:#73848c;" >'
				+ ' <div class="wingsPageLoadingDiv" ' 
				+ ' style="color:red;position: absolute;width:400px;height:200px;left:50%;top:50%; margin-left:-200px;margin-top:-100px"> ' 
				+ ' <img src="/wings/core/img/timg_loading.gif">' 
				+ '</div> '
			+ '</div>';
	   	 $(document.body).append(html);
	},
	hide:function(){
		 $(".modal-backdrop.wingsPageLoading").remove();
	}
};
	// ============= 进度条 组件  组件 (end) ==================

	// ============= 弹出窗口适配sword (begin) ==================
//追加隐藏iframe对象的 map
var lei_iframeObjMap = new Object();
var box;
	// ============= 弹出窗口适配sword (end) ==================

$(function(){
	"use strict";
	// ============= 弹出窗口适配sword (begin) ==================
if(window.parent && window.parent.lei_iframeObjMap){
	box = window.parent.lei_iframeObjMap[window.name];
};


$pc._initData = {
        data: []  //设置初始化的值
};

	// ============= 弹出窗口适配sword (end) ==================

		//页面初始化方法
		if($('#SwordPageData')){
			if($('#SwordPageData').attr("data")){
				//给初始化data赋值
				var temp = jQuery.parseJSON($('#SwordPageData').attr("data"));
				if(temp && temp.data){
					$pc._initData = {
			                data: temp.data  //设置初始化的值
			            };
				}else{
					$pc._initData = {
			                data: []  //设置初始化的值
			        };
				};
			};
		}
	
	// ============= 处理内存问题 (begin) ==================
	$(window).unload(function(){
		$.each(mainObjMap.container,function(k,v){
			if(v && v.destroy){
				v.destroy();
			};
			v = null;
		});
		if($pc._initData){
			$pc._initData.data = null;
		}
		$.each($pc,function(k,v){
			v = null;
		});
		$pc._initData = null;
		
	});
	// ============= 处理内存问题 (end) ==================

	//保存全体对象的map
	var mainObjMap = new Map();
	
	//根据name获得组件的公共方法
	$.extend({ 
		wingsWidget:function(name){
			return mainObjMap.get(name);
		}
	});
	
	//保存页面回传值对象的map
	var dataMap = new Map();
	
	//根据name获得组件的公共方法
	$.extend({ 
		wingsGetObjByDataName:function(name){
			return dataMap.get(name);
		}
	});
	
	$.extend({ 
		wingsSetObjByDataName:function(name,obj){
			var arr = dataMap.get(name);
			if(!arr){
				arr = [];
			}
			arr.push(obj);
			dataMap.put(name,arr);
		}
	});
	
	
	/* 兼容ie8 数据没有 indexOf方法*/
	if (!Array.prototype.indexOf){
		Array.prototype.indexOf = function(elt /*, from*/){
		    var len = this.length >>> 0;
		    var from = Number(arguments[1]) || 0;
		    from = (from < 0)? Math.ceil(from): Math.floor(from);
		    if (from < 0){
		      from += len;
		    };
		    for (; from < len; from++){
				if (from in this && this[from] === elt){
		        	return from;
				};
		    };
		    return -1;
	  	};
	};

	// ============= pc 组件 (begin) ==================
	//TODO
	$pc.getResData = function(d, c, a) {
        if (!$chk(a)) {
            a = "name"
        };
        if ($chk(!c)) {
            return;
        };
        var f = c.data;
        if ($chk(!f)) {
            return;
        };
        var b;
        
		$.each(f,function(f,h) {
            var g = h[a];
            if ($chk(!g)) {
                return true;
            };
            if (d == g) {
                b = h;
                return false;
            }
        });
        return b;
    };
    $pc.deleteData = function(c, b, a) {
        if (!$chk(a)) {
            a = "name";
        };
        if ($chk(!b)) {
            return false;
        }
        var d = b.data;
        if ($chk(!d)) {
            return false;
        };
        
		$.each(d,function(f,h) {
            var g = h[a];
            if ($chk(!g)) {
                return true;
            };
            if (c == g) {
                d[f] = {};
                return false;
            };
        });
    };
	$pc.deleteDataByDataName = function(dataName){
        return this.deleteData(dataName, $pc._initData, "dataName");
	};
	$pc.reloadSel = function(dataName, dataObject){
		//处理整理的数据
		$pc.deleteDataByDataName(dataName);
		var b = $pc.getResData(dataName, dataObject, "dataName");
        if (!b) {
            return;
        };
        if (!$pc._initData) {
            $pc._initData = {
                data: []
            };
        };
        $pc._initData.data[$pc._initData.data.length] = b;
        
        //刷新所有的select
		if(b.sword == "SwordSelect"){
			//select初始化
			var selObjArr = $.wingsGetObjByDataName(dataName);
			if(selObjArr){
				$.each(selObjArr,function(i,selObj){
					selObj.initData(b);
				});
			};
		}
        
	};
	$pc.delayMap = new Map();//暂存延时组件
	$pc.delayTime = "800";//延时时间
	$pc.getDelayObj =function(formName){
		return $pc.delayMap.get(formName);
	};
	$pc.setDelayObj = function(name,obj){
		$pc.delayMap.put(name,obj);
	};
	
	// ============= pc 组件 (end) ==================
	
	// ============= wingsForm 组件 (begin) ==================
	$.fn.wingsForm = function(options) {
		
		// 参数赋值
		var opts = $.extend({}, $.fn.wingsForm.defaults, options);
		//保存自己的暂存信息，因为是公用的
		opts.widgetMap[opts.name] = new Object();
		
		// 设置数据方法
		var $formThis = $(this);
		
		$formThis.opts = opts;
		
		opts.delayMap[opts.name] = new Object();
		
		
		//【重要】保存原有的form内部所有信息，为克隆form做准备  clone 2017-10-08 lei
		if(opts.cloneAble == "true"){
//			$formThis.innerHtmlBak = $formThis.html();
//			$formThis.optionsBak = options;
//			$formThis.objBak = $(this);
			$formThis.cloneObj = $(this).clone();
		};
		
		//【设置延时加载机制】//TODO
		if(options.delay === "true"){
			var obj = {
				delayTime:options.delayTime
			};
			$pc.setDelayObj(options.name,obj);
		};
		
		$formThis.delayInit = function(name){
			//处理延时加载的类
			$.each(opts.delayMap[opts.name],function(key,obj){
				var selectObj = $formThis.getWidget(obj.name);
				selectObj.initData();
				if(obj.value){
					selectObj.setValue(obj.value);
				}
			})
		};
		$formThis.setDelayMap = function(key,obj){
			opts.delayMap[opts.name][key] = obj;
		};
		$formThis.getDelayMap = function(key,obj){
			return opts.delayMap[opts.name][key];
		};
		
		
		//保存页面回传值对象的map
		var closeFormDataMap = new Map();
	
		//根据name获得组件的公共方法
		$formThis.getCloseObjByDataName = function(name){
			return closeFormDataMap.get(name);
		};
		$formThis.setCloseObjByDataName =function(name,obj){
			var arr = closeFormDataMap.get(name);
			if(!arr){
				arr = [];
			};
			arr.push(obj);
			closeFormDataMap.put(name,arr);
		};
	
		
		//保存jQuery对象 一般存 新生成的 form中的子对象
		$formThis.setWidget = function(key,obj){
			opts.widgetMap[opts.name][key] = obj;
		};
		//获得jQuery对象
		$formThis.getWidget = function(key){
			var el_opts = opts.widgetMap[opts.name][key];
			return el_opts.selfObj;
		};
		
		//获得jQuery对象 的值
		$formThis.getValue = function(key){
			var returnVal = '';
			var el_opts = opts.widgetMap[opts.name][key];
			if(el_opts.type == 'label' || el_opts.type == 'text'){
				returnVal = el_opts.getValue();
			}else if(el_opts.type == 'select' || el_opts.type == 'radio'
				||el_opts.type == 'checkbox' || el_opts.type =='wingsDate'
				||el_opts.type == 'wingsSuggest'){
				//select radio checkbox 
				returnVal = el_opts.selfObj.getValue();
			}else if(el_opts.type =='pulltree'){
				//pulltree
				var list = el_opts.selfObj.getValue();
				if(list){
					for(var i=0;i<list.length;i++){
						returnVal += ',' + list[i].code;
					};
					if(returnVal!= ''){
						returnVal = returnVal.substring(1,returnVal.length);
					};
				};
			}else{
				//剩下的 hidden text textarea password
				if(el_opts.selfObj){
					returnVal = el_opts.selfObj.val();
				};
			};
			
			return returnVal;
		};
		
		//设置值
		$formThis.setValue = function(key,str,parem){
			var el_opts = opts.widgetMap[opts.name][key];
			if(el_opts && el_opts.selfObj){
				if(el_opts.type == 'label' || el_opts.type == 'text'
					||el_opts.type == 'wingsSuggest'){
					el_opts.setValue(str);
					if(el_opts.type == 'text'){
						//不提供setValue方法触发 计算公式
//						if(parem && parem.noChange == "true"){
//						}else{
//							el_opts.selfObj.trigger("change");
//						}
					}
				}else if(el_opts.type == 'select'|| el_opts.type == 'radio'
					||el_opts.type == 'checkbox' || el_opts.type =='pulltree' || el_opts.type =='wingsDate'){
					//select radio checkbox pulltree
					
					if(el_opts.type == 'select'){
						//TODO  延迟加载
						if(options.delay === "true"){
							var obj = $formThis.getDelayMap(key);
							obj.value = str;
							$formThis.setDelayMap(key,obj);
						}else{
							el_opts.selfObj.setValue(str);
						}
					}else{
						el_opts.selfObj.setValue(str);
					}
				}else{
					//剩下的 hidden textarea password
					el_opts.selfObj.val(str);
				};
			};
		};
		
		//获得全部的提交数据(带格式) 配合 submit组件的 pushData
		$formThis.getSubmitData = function(){
			//{"sword":"SwordForm","name":"student","data":{"xm"：{"value":"王五"},"xh":{"value":"001"}}}
			
			var submitData ={
				name:opts.name,
				data:new Object,
				sword:"SwordForm"
			};
			//遍历form内元素
			$.each(opts.widgetMap[opts.name], function(key, el_opts) {
				submitData.data[key] = {
					value : $formThis.getValue(key)
					};
			});
			return submitData;
		};
		
		//页面form初始化
		$formThis.initData = function(jsonData,keyStr){
			var keyArr = [];
			if(typeof keyStr == 'string'){
				keyArr.push(keyStr);
			}else if(keyStr instanceof Array){
				keyArr = keyStr;
			};
			var dataObj = jQuery.parseJSON(jsonData);
			if(dataObj.data){
				$.each(dataObj.data, function(key, val) {
					for(var i =0;i < keyArr.length;i++){
			    		if(key == keyArr[i]){
			    			return true;
			    		}
			    	};
					$formThis.setValue(key, val.value);
				});
			};
			dataObj = null;
		};

		$formThis.destroy = function(){
			$.each(opts.widgetMap[opts.name],function(k,el_opts){ //TODO
				if(el_opts && el_opts.selfObj && el_opts.selfObj.destroy ){
					el_opts.selfObj.destroy();
				};
				$.each(el_opts,function(j,v){
					v = null;
				});
				el_opts = null;
			});
			
			$.each(opts,function(k,v){
				v = null;
			});
			opts = null;
			
			$.each($formThis,function(k,v){
				v = null;
			});
			$formThis.remove();
			$formThis = null;
		};
		
		//返回dom对象
		$formThis.getFieldEl= function(keyStr){
			var el_opts = opts.widgetMap[opts.name][keyStr];
			var reDom;
			if(el_opts){
				if(el_opts && el_opts.selfObj){
					if(el_opts.type == 'label'){
						reDom = el_opts.selfObj[0];
					}else if(el_opts.type == 'select'|| el_opts.type == 'radio'
						||el_opts.type == 'checkbox' || el_opts.type =='pulltree'
							|| el_opts.type == 'wingsDate'){
						//select radio checkbox pulltree
//						el_opts.selfObj.setDisable();
					}else{
						//剩下的 hidden text textarea password
		  				reDom = el_opts.selfObj[0];
					};
				};
			};
			return reDom;
		};
		
		//设置页面组件disable
		$formThis.disable= function(keyStr){
	    	var keyArr = [];
			if(typeof keyStr == 'string'){
				keyArr.push(keyStr);
			}else if(keyStr instanceof Array){
				keyArr = keyStr;
			};
			if(!keyStr){
				$.each(opts.widgetMap[opts.name], function(key, el_opts) {
					p_setDisable(el_opts);
				});
			}else{
		    	for(var i =0;i < keyArr.length;i++){
		    		//获得对象
		    		var el_opts = opts.widgetMap[opts.name][keyArr[i]];
					p_setDisable(el_opts);
		    	};
			};
	    	function p_setDisable(el_opts){
	    		if(el_opts && el_opts.selfObj){
					if(el_opts.type == 'label'){
						
					}else if(el_opts.type == 'select'|| el_opts.type == 'radio'
						||el_opts.type == 'checkbox' || el_opts.type =='pulltree'
							|| el_opts.type == 'wingsDate' ||el_opts.type == 'wingsSuggest'){
						//select radio checkbox pulltree
						el_opts.selfObj.setDisable();
					}else{
						//剩下的 hidden text textarea password
		  				el_opts.selfObj.attr('disabled',"true");
					};
				};
	    	}
		};
		//设置页面组件enable
		$formThis.enable= function(keyStr){
	    	var keyArr = [];
			if(typeof keyStr == 'string'){
				keyArr.push(keyStr);
			}else if(keyStr instanceof Array){
				keyArr = keyStr;
			};
			if(!keyStr){
				$.each(opts.widgetMap[opts.name], function(key, el_opts) {
					p_setEnable(el_opts);
				});
			}else{
		    	for(var i =0;i < keyArr.length;i++){
		    		//获得对象
		    		var el_opts = opts.widgetMap[opts.name][keyArr[i]];
		    		p_setEnable(el_opts);
		    	};
				
			};
	    	function p_setEnable(el_opts){
				if(el_opts && el_opts.selfObj){
					if(el_opts.type == 'label'){
						
					}else if(el_opts.type == 'select'|| el_opts.type == 'radio'
						||el_opts.type == 'checkbox' || el_opts.type =='pulltree'
							|| el_opts.type == 'wingsDate'||el_opts.type == 'wingsSuggest'){
						//select radio checkbox pulltree
						el_opts.selfObj.setEnable();
						
					}else{
						//剩下的 hidden text textarea password
						el_opts.selfObj.attr('disabled',null);
					};
				};
	    	}
		};
		
		//form 项目清空并设置默认值
		$formThis.clearSetDefValue = function(){
			$.each(opts.widgetMap[opts.name], function(key, el_opts) {
				if(el_opts.defValue){
					$formThis.setValue(key, el_opts.defValue);
				}else{
					$formThis.setValue(key, '');
				};
			});
		};
		
		
		//form resetAll 重新加载（ajax无法加载）
		$formThis.resetAll = function(keyStr){
			//清空值并设置 初始化
			$formThis.clearSetDefValue(keyStr);
			
//			if($('#SwordPageData')){
//				if($('#SwordPageData').attr("data")){
//					var initDate = jQuery.parseJSON($('#SwordPageData').attr("data"));
					if($pc._initData && $pc._initData.data){
						$.each($pc._initData.data, function(i, val) {
							if(val.sword == "SwordForm"){
								//form初始化
								var formObj = $.wingsWidget(val.name);
								if(formObj){
									var temp = {
										data: val.data
									};
									$formThis.initData(JSON.stringify(temp),keyStr);
								};
							};
						});
					};
//				};
//			};
		};
		$formThis.reset = function(){
			$formThis.resetAll();
		};
		
		  				
		//form 追加校验用form
		opts.validFormId = opts.name+"_validFrom_" + Math.floor(Math.random()*100);
		var detail = $('<div id="div_'+ opts.validFormId + '" ></div>');
		$formThis.wrapInner(detail);
		$formThis.wrapInner('<form id="'+opts.validFormId+'"  ></form>');
		
		//追加panel
		if(opts.panel == "true"){
//			$formThis.prepend('<div class="panel-heading" >'+opts.caption+'</div>');
//			$formThis.wrapInner('<div class="panel panel-primary" style="background-color: white;"></div>');
			
			//追加 form的 下拉弹出和隐藏
			var newMessage = $('<div class="panel-heading" >'+opts.caption+'</div>') ;
			var upDownBtn   = $('<span></span>').addClass('shut-down');
			newMessage.append(upDownBtn);
			$formThis.prepend(newMessage);
			$formThis.wrapInner('<div class="panel panel-primary" style="background-color: white;"></div>');
			$(upDownBtn).click(function(){
				if (!upDownBtn.hasClass('shut-up') || upDownBtn.hasClass('shut-down')) {
					upDownBtn.removeClass('shut-down');
					upDownBtn.addClass('shut-up');
					$('#div_' + opts.validFormId).hide()
				} else {
					upDownBtn.removeClass('shut-up');
					upDownBtn.addClass('shut-down');
					$('#div_' + opts.validFormId).show()
				}
			});
			if(opts.collapse == "true"){
				upDownBtn.removeClass('shut-down');
				upDownBtn.addClass('shut-up');
				$('#div_' + opts.validFormId ).hide();
			}
		};
		
		
		//初始化校验的 方法 必须有form才能生效
		$formThis.formValidInit = function() {
			//设置条件
			if($.validator && opts.validFormId){
				opts.valid = $("#"+opts.validFormId).wingsValidate();//校验初始化
			};
		};
		
			
		//form的校验方法 需要 wingsValidate 组件
		$formThis.formValid = function() {
			if(opts.valid){
				//return opts.valid.valid();
				return $("#"+opts.validFormId).valid();
			};
			return true;
		};
		//设置事件，参数：事件名称，对象参数，div对象
		$formThis.setOnFn = function(onfnName,optsObj,divObj){
			//'onchange',el_opts,$(el)
			divObj.attr(onfnName,null);//去掉该属性  'onchange'
			//添加时间
			if(optsObj && optsObj.selfObj){
				var jqFnName = "";
				if(onfnName == "onchange"){
					optsObj.selfObj.on('change',function(){
						if(optsObj.onchange ){
							var tempFn = wings_getFunc(optsObj.onchange);
							if(tempFn){
								for (var b = 0; b < tempFn.length; b++) {
						            var  func = eval(tempFn[b]);
							       	if (typeof func == "function") {
						            	var result = new func();
							       	}
							    }
							}
						}
					});
				}else if(onfnName == "onfocus"){
					optsObj.selfObj.on('focus',function(){
						if(optsObj.onfocus ){
							var tempFn = wings_getFunc(optsObj.onfocus);
							if(tempFn){
								for (var b = 0; b < tempFn.length; b++) {
						            var  func = eval(tempFn[b]);
							       	if (typeof func == "function") {
						            	var result = new func();
							       	}
							    }
							}
						}
					});
				}else if(onfnName == "onblur"){
					optsObj.selfObj.on('blur',function(){
						if(optsObj.onblur ){
							var tempFn = wings_getFunc(optsObj.onblur);
							if(tempFn){
								for (var b = 0; b < tempFn.length; b++) {
						            var  func = eval(tempFn[b]);
							       	if (typeof func == "function") {
						            	var result = new func();
							       	}
							    }
							}
						}
					});
				}
			};
		};
		//
		//【重要】form的克隆  clone 2017-10-08 lei
		$formThis.clone = function(tempOpts) {
			if($formThis.opts.cloneAble !== "true" 
				||!tempOpts ||!tempOpts.newName){
				return;
			}
			//【一】追加 wingsForm 的div
			var $newForm = $formThis.cloneObj.clone();
			var target = tempOpts.targetObj;
			var addType = tempOpts.addType;
			if(!target){
				target = $("body");
			};
			if(!addType){
				addType = 'append';
			};
			
			if(addType == 'prepend'){
				target.prepend($newForm);
			}else if(addType == 'after'){
				target.after($newForm);
			}else if(addType == 'before'){
				target.before($newForm);
			}else{
				target.append($newForm);
			};
			
			//【二】修改名称
			$newForm.attr("name",tempOpts.newName);
			$newForm.attr("cloneAble","false");
			
			//【三】生成wingsForm对象
  			var n_wingsObj = $newForm;
  			//(1)搜集属性
  			var opts = {
  				name:n_wingsObj.attr("name"),
  				panel:n_wingsObj.attr("panel"),
  				caption:n_wingsObj.attr("caption"),
  				cloneAble:'false',//clone出来的from 不能再一次clone了，减轻内存压力
  				validFormId:n_wingsObj.attr("validFormId")
  			};
  			//(3)追加必要html标签
  			
  			//(4)执行jquery初始化方法,创建对象
			var n_fromObj = n_wingsObj.wingsForm(opts);
			
			
			//(5)form的初始化 
			n_fromObj.init({cloneMode:"true"});
			
  			//form校验初始化
  			n_fromObj.formValidInit();
			//(6)将对象以name为key，存入map中
			mainObjMap.put(opts.name,n_fromObj);
			
			//【四】触发data相关
			initWingsCloseFormData(n_fromObj);
		};
		
		
		//【重要】form的初始化 clone 2017-10-08 lei
		$formThis.init = function(initOpts) {
			
				//(5)处理内部的子项目
	  			$formThis.find("div").each(function(j,el){
	  				if(typeof($(el).attr("type"))!="undefined" && typeof($(el).attr("name"))!="undefined"){
		  				 if($(el).attr("type") == "radio"){
		  					//【radio】单选
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"radio",//类型
				  				defValue:$(el).attr("defValue"),
				  				radioDate :[],
				  				colWidth:$(el).attr("colWidth"),
				  				disable:$(el).attr("disable"),
				  				onClickBefore:$(el).attr("onClickBefore"),
				  				onClickAfter:$(el).attr("onClickAfter")
				  				
				  			};
	 	  					//追加标签 并保留其 jq对象
	  						$(el).find("div").each(function(k,el_option){
	  							if($(el_option).attr("code")&& $(el_option).attr("caption")){
	  								var temp_op ={ 
	  									code: $(el_option).attr("code"), 
	  									caption: $(el_option).attr("caption") 
	  									};
	  								el_opts.radioDate.push(temp_op);
	  							};
	  						});
	  						var radioObj = $(el).wingsRadio(el_opts);
		  					el_opts.selfObj = radioObj;//【重要】保存操作对象
		  					//追加属性
		  					if(el_opts.defValue){
		  						el_opts.selfObj.setValue(el_opts.defValue);
		  					};
		  					if(el_opts.disable == "true"){
		  						el_opts.selfObj.setDisable();
		  					};
		  					$formThis.setWidget(el_opts.name,el_opts);
		  					$.wingsSetObjByDataName(el_opts.name,el_opts);
		  					if(initOpts && initOpts.cloneMode=="true"){
		  						$formThis.setCloseObjByDataName(el_opts.name,el_opts);
		  					};
		  				}else if($(el).attr("type") == "checkbox"){
		  					//【checkbox】多选
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"checkbox",//类型
				  				defValue:$(el).attr("defValue"),
				  				checkBoxDate :[],
				  				colWidth:$(el).attr("colWidth"),
				  				disable:$(el).attr("disable"),
				  				onClickBefore:$(el).attr("onClickBefore"),
				  				onClickAfter:$(el).attr("onClickAfter")
				  			};
	 	  					//追加标签 并保留其 jq对象
	  						$(el).find("div").each(function(k,el_option){
	  							if($(el_option).attr("code")&& $(el_option).attr("caption")){
	  								var temp_op ={ 
	  									code: $(el_option).attr("code"), 
	  									caption: $(el_option).attr("caption") 
	  									};
	  								el_opts.checkBoxDate.push(temp_op);
	  							};
	  						});
	  						var checkBoxObj = $(el).wingsCheckBox(el_opts);
		  					el_opts.selfObj = checkBoxObj;//【重要】保存操作对象
		  					//追加属性
		  					if(el_opts.defValue){
		  						el_opts.selfObj.setValue(el_opts.defValue);
		  					};
		  					if(el_opts.disable == "true"){
		  						el_opts.selfObj.setDisable();
		  					};
		  					$formThis.setWidget(el_opts.name,el_opts);
		  					$.wingsSetObjByDataName(el_opts.name,el_opts);
		  					if(initOpts && initOpts.cloneMode=="true"){
		  						$formThis.setCloseObjByDataName(el_opts.name,el_opts);
		  					};
		  				}else if($(el).attr("type") == "label"){
		  					//【label】label
		  					//设置参数
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"label",//类型
		  						
		  						realvalue:'',//真实值
		  						value:'',//显示的值
		  						format:$(el).attr("format"),//format属性
		  						
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue")
				  			};
		  					
	 	  					//追加 label 标签 并保留其 jq对象
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
		  					$(el).append('<span id ="'+new_obj_id+'" ></span>');
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					
		  					
		  					//【核心】追加format
		  					//setValue
		  					el_opts.setValue = function(value){
		  						el_opts.realvalue = value;
		  						var showVal = value;
		  						//追加format
		  						if(el_opts.format){
		  							showVal = sword_fmt.formatText(value, el_opts.format, "", "").value;
		  						};
		  						el_opts.selfObj.html(showVal);
		  					};
		  					//getValue
		  					el_opts.getValue = function(){
		  						return el_opts.realvalue;
		  					};
		  					
		  					//追加属性
		  					if(el_opts.defValue){
		  						el_opts.setValue(el_opts.defValue);
		  					}
		  					if(el_opts.inputClass){
		  						el_opts.selfObj.addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						el_opts.selfObj.attr('style',el_opts.css);
		  					};
		  					if(el_opts.defValue){
		  						el_opts.selfObj.val(el_opts.defValue);
		  					};
		  					
		  					$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "text"){
		  					//【text】文本框
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"text",//类型
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				
		  						realvalue:'',//真实值
		  						value:'',//显示的值
		  						format:$(el).attr("format"),//format属性
		  						
				  				rule:$(el).attr("rule"),
				  				rangelength:$(el).attr("rangelength"),
				  				maxnb:$(el).attr("maxnb"),
				  				minnb:$(el).attr("minnb"),
				  				zdyRule:$(el).attr("zdyRule"),
				  				required:$(el).attr("required"),
				  				disable:$(el).attr("disable"),
				  				readonly:$(el).attr("wingsReadonly"),
				  				onfocus:$(el).attr("onfocus"),
				  				onblur:$(el).attr("onblur"),
				  				tipTitle:$(el).attr("tipTitle"),
				  				onchange: $(el).attr("onchange")
				  				
				  			};
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
		  					$(el).append('<input type="text" name="' + el_opts.name + '" id ="'+new_obj_id+'" class="wingsInput"  />');
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					
		  					//【核心】追加format
		  					//setValue
		  					el_opts.setValue = function(value){
		  						el_opts.realvalue = value;
		  						var showVal = value;
		  						//追加format
		  						if(el_opts.format){
		  							showVal = sword_fmt.formatText(value, el_opts.format, "", "").value;
		  						};
		  						el_opts.selfObj.val(showVal);
		  					};
		  					//getValue
		  					el_opts.getValue = function(){
		  						return el_opts.realvalue;
		  					};
		  					if(el_opts.defValue){
		  						el_opts.setValue(el_opts.defValue);
		  					};
		  					//【核心】获得焦点和失去焦点方法，追加样式，阻止校验事件
		  					var textobj = el_opts.selfObj; 
		  					if(textobj){
			  					textobj.on('focus',function(){
			  						if(el_opts.format){
		  								textobj.val(el_opts.realvalue).select();
			  						}
								});
			  					textobj.on('blur',function(){
			  						//失去焦点时，只负责format
			  						if(el_opts.format){
			  							var showVal = sword_fmt.formatText(el_opts.realvalue, el_opts.format, "", "").value;
			  							el_opts.selfObj.val(showVal);
			  						};
								});
			  					textobj.change(function(){
			  						el_opts.setValue($(this).val());
								});
		  					};
		  					
		  					//为了校验追加 样式
		  					$(el).addClass("wdl");
		  					//追加属性
		  					if(el_opts.inputClass){
		  						el_opts.selfObj.addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.tipTitle){
		  						el_opts.selfObj.attr('title',el_opts.tipTitle);
		  					};
		  					if(el_opts.css){
		  						el_opts.selfObj.attr('style',el_opts.css);
		  					};
		  					if(el_opts.rule){
		  						el_opts.selfObj.attr('rule',el_opts.rule);
		  					};
		  					if(el_opts.rangelength){
		  						el_opts.selfObj.attr('rangelength',el_opts.rangelength);
		  					};
		  					if(el_opts.maxnb){
		  						el_opts.selfObj.attr('maxnb',el_opts.maxnb);
		  					};
		  					if(el_opts.minnb){
		  						el_opts.selfObj.attr('minnb',el_opts.minnb);
		  					};
		  					if(el_opts.zdyRule){
		  						el_opts.selfObj.attr('zdyRule',el_opts.zdyRule);
		  					};
		  					if(el_opts.required){
		  						el_opts.selfObj.attr('required',el_opts.required);
		  					};
		  					//readonly
		  					if(el_opts.readonly && el_opts.readonly == "true"){
		  						el_opts.selfObj.attr('readonly',el_opts.readonly);
		  					}else{
		  						el_opts.selfObj.attr('readonly',null);
		  					};
		  					//disable
		  					if(el_opts.disable && el_opts.disable == "true"){
		  						el_opts.selfObj.attr('disabled',el_opts.disable);
		  					}else{
		  						el_opts.selfObj.attr('disabled',null);
		  					};
		  					
		  					//设置on 事件
		  					if(el_opts.onchange){
		  						$formThis.setOnFn('onchange',el_opts,$(el));
		  					};
		  					if(el_opts.onfocus){
		  						$formThis.setOnFn('onfocus',el_opts,$(el));
		  					};
		  					if(el_opts.onblur){
		  						$formThis.setOnFn('onblur',el_opts,$(el));
		  					};
		  					
		  					$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "wingsPwd"){
		  					//【password】密码框
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"wingsPwd",//类型
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				required:$(el).attr("required"),
				  				rangelength:$(el).attr("rangelength"),
				  				equalTo:$(el).attr("equalTo"),
				  				zdyRule:$(el).attr("zdyRule"),
				  				disable:$(el).attr("disable"),
				  				onfocus:$(el).attr("onfocus"),
				  				onblur:$(el).attr("onblur"),
				  				readonly:$(el).attr("wingsReadonly")
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					$(el).append('<input type="password" name="' + el_opts.name + '" id ="'+new_obj_id+'" class="wingsInput"  />');
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					
		  					//为了校验追加 样式
		  					$(el).addClass("wdl");
		  					//追加属性
		  					if(el_opts.inputClass){
		  						el_opts.selfObj.addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						el_opts.selfObj.attr('style',el_opts.css);
		  					};
		  					if(el_opts.defValue){
		  						el_opts.selfObj.val(el_opts.defValue);
		  					};
		  					//readonly
		  					if(el_opts.readonly && el_opts.readonly == "true"){
		  						el_opts.selfObj.attr('readonly',el_opts.readonly);
		  					}else{
		  						el_opts.selfObj.attr('readonly',null);
		  					};
		  					//disable
		  					if(el_opts.disable && el_opts.disable == "true"){
		  						el_opts.selfObj.attr('disabled',el_opts.disable);
		  					}else{
		  						el_opts.selfObj.attr('disabled',null);
		  					};
		  					
		  					if(el_opts.required){
		  						el_opts.selfObj.attr('required',el_opts.required);
		  					};
		  					if(el_opts.zdyRule){
		  						el_opts.selfObj.attr('zdyRule',el_opts.zdyRule);
		  					};
		  					if(el_opts.rangelength){
		  						el_opts.selfObj.attr('rangelength',el_opts.rangelength);
		  					};
		  					if(el_opts.equalTo){
		  						//与那个一致
		  						var targetPassword = $formThis.getWidget(el_opts.equalTo);
		  						if(targetPassword){
		  							el_opts.selfObj.attr('equalTo',"#" + targetPassword.attr('id'));
		  						}
		  					};
		  					
		  					//设置on 事件
		  					if(el_opts.onfocus){
		  						$formThis.setOnFn('onfocus',el_opts,$(el));
		  					};
		  					if(el_opts.onblur){
		  						$formThis.setOnFn('onblur',el_opts,$(el));
		  					};
		  					
		  					$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "hidden"){
		  					//【hidden】隐藏域
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"hidden",//类型
				  				defValue:$(el).attr("defValue")
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					$(el).append('<input type="hidden" name="' + el_opts.name + '" id ="'+new_obj_id+'"  />');
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					
		  					if(el_opts.defValue){
		  						el_opts.selfObj.val(el_opts.defValue);
		  					};
		  					$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "textarea"){
		  					//【textarea】文本域
		  					var el_opts = {
				  				name:$(el).attr("name"),
				  				selfObj:null,//主要的作用对象
		  						type:"textarea",//类型
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				rule:$(el).attr("rule"),
				  				rangelength:$(el).attr("rangelength"),
				  				maxnb:$(el).attr("maxnb"),
				  				minnb:$(el).attr("minnb"),
				  				zdyRule:$(el).attr("zdyRule"),
				  				required:$(el).attr("required"),
				  				rows:$(el).attr("rows"),
				  				disable:$(el).attr("disable"),
				  				onfocus:$(el).attr("onfocus"),
				  				onblur:$(el).attr("onblur"),
				  				readonly:$(el).attr("wingsReadonly")
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					$(el).append('<textarea name="' + el_opts.name + '" id ="'+new_obj_id+'"  />');
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					
		  					//为了校验追加 样式
		  					$(el).addClass("wdl");
		  					if(el_opts.rows){
		  						el_opts.selfObj.attr('rows',el_opts.rows);
		  					};
		  					if(el_opts.inputClass){
		  						el_opts.selfObj.addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						el_opts.selfObj.attr('style',el_opts.css);
		  					};
		  					if(el_opts.defValue){
		  						el_opts.selfObj.val(el_opts.defValue);
		  					};
		  					if(el_opts.rule){
		  						el_opts.selfObj.attr('rule',el_opts.rule);
		  					};
		  					if(el_opts.rangelength){
		  						el_opts.selfObj.attr('rangelength',el_opts.rangelength);
		  					};
		  					if(el_opts.maxnb){
		  						el_opts.selfObj.attr('maxnb',el_opts.maxnb);
		  					};
		  					if(el_opts.minnb){
		  						el_opts.selfObj.attr('minnb',el_opts.minnb);
		  					};
		  					if(el_opts.zdyRule){
		  						el_opts.selfObj.attr('zdyRule',el_opts.zdyRule);
		  					};
		  					if(el_opts.required){
		  						el_opts.selfObj.attr('required',el_opts.required);
		  					};
		  					//readonly
		  					if(el_opts.readonly && el_opts.readonly == "true"){
		  						el_opts.selfObj.attr('readonly',el_opts.readonly);
		  					}else{
		  						el_opts.selfObj.attr('readonly',null);
		  					};
		  					//disable
		  					if(el_opts.disable && el_opts.disable == "true"){
		  						el_opts.selfObj.attr('disabled',el_opts.disable);
		  					}else{
		  						el_opts.selfObj.attr('disabled',null);
		  					};
		  					
		  					//注册事件
		  					if(el_opts.onfocus){
		  						$formThis.setOnFn('onfocus',el_opts,$(el));
		  					};
		  					if(el_opts.onblur){
		  						$formThis.setOnFn('onblur',el_opts,$(el));
		  					};
		  					
		  					$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "select"){
		  					//【重要】转换onSelect属性为onSelectFn
		  					if($(el).attr("onSelect")){
		  						$(el).attr("onSelectFn",$(el).attr("onSelect"));
		  					//删除属性 这个属性慎用
		  						$(el).attr("onSelect","");
		  					}
		  					
		  					//【select】下拉框
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"select",//类型
				  				dataName:$(el).attr("dataName"),
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				noSearch:$(el).attr("noSearch"),
				  				onSelect:$(el).attr("onSelectFn"),
				  				onChangeFn:$(el).attr("onChangeFn"),
				  				multiple:$(el).attr("multiple"),
				  				disable:$(el).attr("disable"),
				  				handInput:$(el).attr("handInput"),
				  				allowClear:$(el).attr("allowClear"),
				  				placeholder:$(el).attr("placeholder"),
				  				popDisplay:$(el).attr("popDisplay"),
				  				submitcontent:$(el).attr("submitcontent"),
				  				inputDisplay:$(el).attr("inputDisplay"),
				  				required:$(el).attr("required"),
				  				
				  				dataHeight:$(el).attr("dataHeight"),
				  				dataWidth:$(el).attr("dataWidth"),
				  				dataFilter:$(el).attr("dataFilter")
				  				
				  			};
		  					
		  					if(el_opts.onChangeFn){
		  						el_opts.onSelect = el_opts.onChangeFn;
		  					}
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	  						//(3)追加必要html标签
		  					$(el).append('<div id="'+new_obj_id+'"  ></div>');
		  					
		  					if(el_opts.inputClass){
		  						$('#'+new_obj_id).addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						$('#'+new_obj_id).attr('style',el_opts.css);
		  					};
		  					
		  					
				  			//(4)执行jquery初始化方法,创建对象
		  					//(5)处理内部有的 div select option
		  					var data = [];
	  						$(el).find("div").each(function(k,el_option){
	  							if(typeof($(el_option).attr("code"))!="undefined" 
	  								&& typeof($(el_option).attr("caption"))!="undefined"){
	  								var temp_op ={ 
	  									code: $(el_option).attr("code"), 
	  									caption: $(el_option).attr("caption") 
	  									};
	  								data.push(temp_op);
	  							};
	  						});
		  					el_opts.data =data;
							
		  					el_opts.objId=new_obj_id;
							el_opts.delay = options.delay; 
		  					
							var selObj = $('#'+new_obj_id).wingsSelector(el_opts);
							
							if(options.delay === "true"){//TODO 
								var obj = {"name":el_opts.name};
			  					if(el_opts.defValue){
			  						obj.value = el_opts.defValue;
			  					};
								$formThis.setDelayMap(el_opts.name,obj);
							}else{
			  					if(el_opts.defValue){
			  						selObj.setValue(el_opts.defValue);
			  					};
							};
		  					
		  					el_opts.selfObj = selObj;//【重要】保存操作对象
							//(6)将对象以name为key，存入map中
		  					$formThis.setWidget(el_opts.name,el_opts);
		  					if(el_opts.dataName){
		  						$.wingsSetObjByDataName(el_opts.dataName,selObj);
			  					if(initOpts && initOpts.cloneMode=="true"){
			  						$formThis.setCloseObjByDataName(el_opts.dataName,selObj);
			  					};
		  					};
		  					el_opts = null;
		  					selObj = null;
		  					
		  				}else if($(el).attr("type") == "multipleSelect"){
		  					//【重要】转换onSelect属性为onSelectFn
		  					if($(el).attr("onSelect")){
		  						$(el).attr("onSelectFn",$(el).attr("onSelect"));
		  					//删除属性 这个属性慎用
		  						$(el).attr("onSelect","");
		  					}
		  					//【multipleSelect】 全显示下拉框
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"multipleSelect",//类型
				  				dataName:$(el).attr("dataName"),
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				onSelect:$(el).attr("onSelectFn"),
				  				size:$(el).attr("size"),
				  				popDisplay:$(el).attr("popDisplay")
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	  						//(3)追加必要html标签
		  					$(el).append('<select id="'+new_obj_id+'" multiple="multiple"  ></select>');
		  					
		  					if(el_opts.inputClass){
		  						$('#'+new_obj_id).addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						$('#'+new_obj_id).attr('style',el_opts.css);
		  					};
		  					if(el_opts.defValue){
		  						$('#'+new_obj_id).val(el_opts.defValue);
		  					};
		  					if(el_opts.size){
		  						$('#'+new_obj_id).attr('size',el_opts.size);
		  					};
		  					
				  			//(4)执行jquery初始化方法,创建对象
		  					//(5)处理内部有的 div select option
		  					var data = [];
	  						$(el).find("div").each(function(k,el_option){
	  							if(typeof($(el_option).attr("code"))!="undefined" 
	  								&& typeof($(el_option).attr("caption"))!="undefined"){
	  								var temp_op ={ 
	  									code: $(el_option).attr("code"), 
	  									caption: $(el_option).attr("caption") 
	  									};
	  								data.push(temp_op);
	  							};
	  						});
		  					el_opts.data =data;
							
		  					
							var mSelObj = $('#'+new_obj_id).wingsMultipleSelector(el_opts);
		  					el_opts.selfObj = mSelObj;//【重要】保存操作对象
							//(6)将对象以name为key，存入map中
		  					$formThis.setWidget(el_opts.name,el_opts);
		  					if(el_opts.dataName){
		  						var tempObj ={
									type:"multipleSelect",
									obj:mSelObj
								};
		  						$.wingsSetObjByDataName(el_opts.dataName,tempObj);
			  					if(initOpts && initOpts.cloneMode=="true"){
			  						$formThis.setCloseObjByDataName(el_opts.dataName,tempObj);
			  					};
		  					};
		  					
		  				}else if($(el).attr("type") == "pulltree"){
		  					//【pulltree】下拉树
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"pulltree",//类型
	  							treeType:$(el).attr("treeType"),
								//showCheck:true,
				  				//inputClass:$(el).attr("inputClass"),
				  				//css:$(el).attr("css"),
				  				disable:$(el).attr("disable"),
				  				defValue:$(el).attr("defValue"),
		  						onNodeClick:$(el).attr("onNodeClick"),
	  							isJgxzs:$(el).attr("isJgxzs"),
	  							expand:$(el).attr("extendLayer"),
	  							lctrl:$(el).attr("lctrl"),
	  							onLtidBefore:$(el).attr("onLtidBefore"),
	  							onAfterLoadData:$(el).attr("onAfterLoadData"),
	  							onCheckBefore:$(el).attr("onCheckBefore"),
	  							p_obj:$(el),
	  							p_name:opts.name,
	  							onHideBefore: $(el).attr("onHideBefore") ,
	  							onNodeContextMenu: $(el).attr("onNodeContextMenu"),
	  							autoExtendCaption: $(el).attr("autoExtendCaption")
	  							
				  			};
		  					//处理懒加载url
		  					if(el_opts.lctrl){
		  						el_opts.url = AddBizCode2URL("/ajax.sword?ctrl=" + el_opts.lctrl);
		  					};
				  			//(2)处理on事件
				  			if(el_opts.onNodeClick){
				  				el_opts.onNodeClickFn = wings_getFunc(el_opts.onNodeClick);
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					$(el).append('<input id="'+new_obj_id+'" type="text"  class="ztree hide" />');
		  					
							var pulltreeObj = $('#'+new_obj_id).wingsTree(el_opts);
		  					el_opts.selfObj = pulltreeObj;//【重要】保存操作对象
		  					
		  					if(el_opts.disable == "true"){
		  						el_opts.selfObj.setDisable();
		  					}
							//下拉树对象，不在form对象中
							//(6)将对象以name为key，存入map中
		  					$formThis.setWidget(el_opts.name,el_opts);
							mainObjMap.put(el_opts.name,pulltreeObj); 
							//lei 20180201 修改树加载体系
			  				$formThis.setCloseObjByDataName(el_opts.name,pulltreeObj);
							
		  				}else if($(el).attr("type") == "wingsDate" || $(el).attr("wings") == "WingsCalendar" ){
		  					//【date】时间控件
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"wingsDate",//类型
				  				format:$(el).attr("format"),
				  				inputClass:$(el).attr("inputClass"),
				  				css:$(el).attr("css"),
				  				defValue:$(el).attr("defValue"),
				  				required:$(el).attr("required"),
				  				zdyRule:$(el).attr("zdyRule"),
				  				disable:$(el).attr("disable"),
				  				readonly:$(el).attr("wingsReadonly"),
				  				startDate:$(el).attr("startDate"),
				  				endDate:$(el).attr("endDate"),
				  				onShowFn:$(el).attr("onShowFn"),
				  				onHideFn:$(el).attr("onHideFn"),
				  				onDateChange:$(el).attr("onDateChange")
				  			};
		  					var new_obj_id = opts.name+"_"+ el_opts.name + "_" + Math.floor(Math.random()*100);
	 	  					//追加input type= text 标签 并保留其 jq对象
		  					
		  					$(el).addClass("input-group date input-group-wingsTime");
		  					$(el).append('<input id="'+new_obj_id+'" name="'+new_obj_id+'" class="form-control " size="16" type="text" class="wingsInput" >');
		  					$(el).append('<span class="input-group-addon" id = "span_'+new_obj_id+'" ><span class="glyphicon glyphicon-calendar"></span></span>');
		  					
		  					el_opts.selfObj = $('#'+new_obj_id);//【重要】保存操作对象
		  					el_opts.inputId = new_obj_id;
		  					
		  					if(el_opts.inputClass){
		  						el_opts.selfObj.addClass(el_opts.inputClass);
		  					};
		  					if(el_opts.css){
		  						el_opts.selfObj.attr('style',el_opts.css);
		  					};
		  					if(el_opts.defValue){
		  						el_opts.selfObj.val(el_opts.defValue);
		  					};
		  					if(el_opts.zdyRule){
		  						el_opts.selfObj.attr('zdyRule',el_opts.zdyRule);
		  					};
		  					if(el_opts.required){
		  						el_opts.selfObj.attr('required',el_opts.required);
		  					};
		  					//readonly
		  					if(el_opts.readonly && el_opts.readonly == "true"){
		  						el_opts.selfObj.attr('readonly',el_opts.readonly);
		  					}else{
		  						el_opts.selfObj.attr('readonly',null);
		  					};
		  					if(el_opts.startDate){
		  						el_opts.selfObj.attr('startDate',el_opts.startDate);
		  					};
		  					if(el_opts.endDate){
		  						el_opts.selfObj.attr('endDate',el_opts.endDate);
		  					};
		  					
							var timeDivObj = $(el).wingsDatetime(el_opts);
		  					el_opts.selfObj = timeDivObj;
							$formThis.setWidget(el_opts.name,el_opts);
		  				}else if($(el).attr("type") == "wingsSuggest"){
		  					//【重要】转换onSelect属性为onSelectFn
		  					if($(el).attr("onSelect")){
		  						$(el).attr("onSelectFn",$(el).attr("onSelect"));
		  					//删除属性 这个属性慎用
		  						$(el).attr("onSelect","");
		  					}
							//【十三】 wingsSuggest 标签  wingsSuggest
				  			//(1)搜集属性
		  					var el_opts = {
				  				name:$(el).attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"wingsDate",//类型
				  				height:$(el).attr("height"),
				  				width:$(el).attr("width"),
				  				showHeader:$(el).attr("showHeader"),
				  				headerTitles:$(el).attr("headerTitles"),
				  				rowName:$(el).attr("rowName"),
				  				lctrl:$(el).attr("lctrl"),
				  				onSelect:$(el).attr("onSelectFn"),
				  				onLtidBefore:$(el).attr("onLtidBefore"),
				  				keyField:$(el).attr("keyField"),
				  				idField:$(el).attr("idField"),
				  				showBtn:$(el).attr("showBtn")
				  				
				  			};
				  			//(3)追加必要html标签
				  			
				  			//(4)执行jquery初始化方法,创建对象
				  			var suggestObj = $(el).wingsSuggest(el_opts);
		  					el_opts.selfObj = suggestObj;
							$formThis.setWidget(el_opts.name,el_opts);
				  		};
	  				};
	  			});
		};
		
		//返回frameTab对象
		return $formThis;
	};
	
	$.fn.wingsForm.defaults={
		name:'wingsForm',
		type:'wingsForm',
		cloneAble:'false',
		collapse:'false',
		widgetMap:new Object(),
		delayMap:new Object()
	};
	
	// ============= wingsForm 组件 (end) ==================
	// ============= WingsButton 组件 (begin) ==================
	
	$.fn.WingsButton = function(options) { 
		
		// 参数赋值
		var opts = $.extend({}, $.fn.WingsButton.defaults, options);
		var $btObj = $(this);
		var id = $btObj.attr("id");
		if(!id){
			id = opts.name+"_wingsButton_" + Math.floor(Math.random()*100);
			$btObj.attr("id",id);
		};
		opts.id = id;
		opts.obj = $('#'+id);
		
		//追加样式
		$btObj.attr({"type":"button","class":"btn btn-primary btn_new"});
		
		if(opts.caption){
			opts.obj.html(opts.caption);
		};
		$btObj.click(function(){
			
			if(opts.disable!="true" && opts.onClickFn!=null){
	  			//执行前方法
	  			var onClickFn = wings_getFunc(opts.onClickFn);
				for (var b = 0; b < onClickFn.length; b++) {
				   var  func = eval(onClickFn[b]);
					    if (typeof func == "function") {
	        			var result = new func();
		       		};
			    };
			};
		});
		$btObj.setCaption = function(caption){
			if(caption){
				opts.caption = caption;
				opts.obj.html(opts.caption);
			};
		};
		
		$btObj.show=function(){
			opts.obj.show();
		};
		$btObj.hide=function(){
			opts.obj.hide();
		};

		$btObj.disabled = function(){
			opts.obj.addClass('unused_1');
			opts.obj.css("cursor","text");
			opts.disable ="true";
		};
		
		$btObj.enabled = function(){
			opts.obj.css("cursor","pointer");
			opts.obj.removeClass('unused_1');
			opts.disable ="false";
		};
		//触发事件
		$btObj.FireClick = function(){
			opts.obj.click();
		};
		
		$btObj.destroy = function(){
			$.each(opts,function(k,v){
				v = null;
			});
		};
		
		return $btObj;
		
	};
	$.fn.WingsButton.defaults={
		name:'WingsButton',
		type:'WingsButton',
		caption:null
	};
	
	// ============= WingsButton 组件 (end) ==================
	
	// ============= wings标签 封装 (begin) ==================
	//========onBefore方法 (begin)============
	$("div").each(function(i,obj){
		var wingsTag = $(obj).attr("wings");
		if(typeof(wingsTag)!="undefined"){
			if(wingsTag == "PageInit"){
				//【九】 PageInit 标签 页面初始化
	  			var wingsObj = $(obj);
	  			var onBeforeFn;
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				onBefore:wingsObj.attr("onBefore")
	  			};
				if(opts.onBefore){
					//设置onSuccess 调用的方法
					onBeforeFn = wings_getFunc(opts.onBefore);
				};
				
		 		//执行onBeforeFn 方法
				if(onBeforeFn ){
					for (var b = 0; b < onBeforeFn.length; b++) {
			            var  func = eval(onBeforeFn[b]);
				       	if (typeof func == "function") {
							var res = new WingsReqData($pc._initData.data);
			            	var result = new func(res);
				       	}
				    }
				}
				return;
	  		}
		}
	});
		
	//========onBefore方法 (end)============
	
	WingsConsole.log('wings init begin ...');
	//遍历div
	
	$("div[wings]").each(function(i,obj){
		var wingsTag = $(obj).attr("wings");
		WingsConsole.log(wingsTag);
		if(typeof(wingsTag)!="undefined"){
			
			var wingsObj = $(obj);
	  		if(wingsTag == "WingsAccordion"){
	  			WingsConsole.log('Wings init WingsAccordion begin ...');
			//【一】 WingsAccordion 手风琴标签 
	  			var opts = {
	  				id:wingsObj.attr("id"),
	  				name:wingsObj.attr("id"),
	  				openNum:wingsObj.attr("openNum")
	  			};
	  			if(!opts.openNum){
	  				opts.openNum = "0";
	  			};
	  			
	  			//(3)追加必要html标签
	  			wingsObj.addClass("panel-group tab-one");
	  			var id = wingsObj.attr("id");
	  			//处理内部的 WingsAccordionItem
	  			var cols = [];
	  			wingsObj.find(">div").each(function(j,el){
	  				//构建手风琴标题
	  				if($(el).attr("type") == "WingsAccordionItem"){
		  				var sid = "accordion_" + Math.floor(Math.random()*100);
	  					//收集参数
		  				var colOpts ={
		  					num:j,
		  					sid:sid,
		  					iconSrc:$(el).attr("iconSrc"),
		  					iconClass:$(el).attr("iconClass"),
		  					iconStyle:$(el).attr("iconStyle"),
		  					itemAStyle:$(el).attr("itemAStyle"),
		  					onclickFn:$(el).attr("onclickFn")
		  				};
		  				cols.push(colOpts);
	  				
		  				//追加必要的html
	  					$(el).addClass("panel a-panel-default");
	  					//(1)在内部追加两侧的div
	  					if(""+j == opts.openNum){
	  						$(el).wrapInner('<div id="'+sid+'" class="panel-collapse collapse in " ></div>');
	  					}else{
	  						$(el).wrapInner('<div id="'+sid+'" class="panel-collapse collapse" ></div>');
	  					};
	  					
	  					//(2)追加表头
	  					//图标
	  					var iconHtml = "";
	  					if(colOpts.iconSrc){
	  						iconHtml = '<img src="'+colOpts.iconSrc+'" style="'+colOpts.iconStyle+'" class = "'+colOpts.iconClass+'" />' ;
	  					}
	  					var style = "";
	  					if(colOpts.itemAStyle){
	  						style = 'style ="'+colOpts.itemAStyle+'" ';
	  					}
		  				$(el).prepend('<div class="l-panel-header l-accordion-header" ><h4 class="panel-title"><a data-toggle="collapse" '
		  				 + 'id='+ 'a_' + sid+' data-parent="#'+id+'" href="#'+sid+'"  class="xm1" '+style+' >'
		  				 +	iconHtml
		  				 + $(el).attr("caption") + '</a></h4></div>');
		  				
	  				};
	  			});
	  			opts.cols = cols;
	  			
//	  			//(4)执行jquery初始化方法,创建对象
				var accordionObj = $('#'+ id).wingsAccordion(opts);
//				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,accordionObj);
				
	  		}else if(wingsTag == "WingsFrameTab"){
	  			WingsConsole.log('Wings init WingsFrameTab begin ...');
				//【二】 FrameTab 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				iframeHeight:wingsObj.attr("iframeHeight"),
	  				iframeWidth:wingsObj.attr("iframeWidth"),
	  				showTabsWidth:wingsObj.attr("showTabsWidth"),
	  				showTabsNum:wingsObj.attr("showTabsNum"),
	  				maxTabsNum:wingsObj.attr("maxTabsNum"),
	  				holdTabsNum:wingsObj.attr("holdTabsNum"),
	  				hasScroll:wingsObj.attr("hasScroll"),
	  				topHeight:wingsObj.attr("topHeight"),
	  				onRightClick:wingsObj.attr("onRightClick"),
                    onDbClick:wingsObj.attr("onDbClick"),
	  				defaultSelectId:wingsObj.attr("defaultSelectId"),
	  				onActived:wingsObj.attr("onActived"),
	  				onCloseTab:wingsObj.attr("onCloseTab")
	  			};
	  			
	  			//(2)获得要显示窗口属性
	  			var arraySon = [];
	  			wingsObj.find(">div").each(function(j,el){
	  				var temp ={
	  					id:$(el).attr("id"),
	  					title:$(el).attr("title"),
	  					src:$(el).attr("src"),
	  					icon:$(el).attr("icon"),
						tabContentType : 'iframe',
	  					spType:$(el).attr("spType"),
	  					tabItemWidth:$(el).attr("tabItemWidth"),
						isCloseBtn : $(el).attr("isCloseBtn"),
						isShowMenuItem : [ "false", "true", "true", "true" ]
	  					};
	  				if($(el).attr("spType") == 'inUlHtml'){
	  					temp.inUlHtml = $(el).html();
	  				}
	  				arraySon[j] = temp;
	  			});
	  			
	  			//(3)追加必要html标签
	  			var frameTabId = "main-tabs";
	  			wingsObj.append('<ul class="nav1 nav1-tabs background-blue breadcrumbs-fixed "  id="'+ frameTabId +'"></ul>');
	  			wingsObj.append('<div class="tab-content" id="main-tabs-content"></div>');
	  			
	  			//(4)执行jquery初始化方法,创建对象
				var wingsFrameTab1 = $('#'+ frameTabId).wingsFrameTab(opts);
				//(5)创建子类
				for(var k =0;k < arraySon.length;k++){
					var temp = arraySon[k];
					//wingsFrameTab1.newTab(temp.id,temp.title,'',temp.src);
					wingsFrameTab1.addTabItem(temp);
				};
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,wingsFrameTab1);
				
				//(7)增加TAB激活事件
	  			if(opts.onActived){
	  				opts.onActived = wings_getFunc(opts.onActived);
	  			};
				
	  		}else if(wingsTag == "wingsProgressbar"){
	  			WingsConsole.log('Wings init wingsProgressbar begin ...');
				//【三】 FrameTab 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name")
	  			};
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
				var progress = wingsObj.wingsProgressbar();
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,progress);
	  		}else if(wingsTag == "WingsForm"){
	  			WingsConsole.log('Wings init WingsForm begin ...');
				//【四】 From 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				panel:wingsObj.attr("panel"),
	  				caption:wingsObj.attr("caption"),
	  				cloneAble:wingsObj.attr("cloneAble"),
	  				collapse:wingsObj.attr("collapse"),
	  				delay:wingsObj.attr("delay"),//延时加载flag
	  				delayTime:wingsObj.attr("delayTime"),//延时加载时间
	  				validFormId:wingsObj.attr("validFormId")
	  			};
	  			//(3)追加必要html标签
	  			
	  			//(4)执行jquery初始化方法,创建对象
				var fromObj = wingsObj.wingsForm(opts);
				
				
				//(5)form的初始化 
				fromObj.init();
				
	  			//form校验初始化
	  			fromObj.formValidInit();
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,fromObj);
	  		}else if(wingsTag == "wingsTree"){
	  			WingsConsole.log('Wings init wingsTree begin ...');
				//【五】 wingsTree 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				treeType:wingsObj.attr("treeType"),
	  				onNodeClick:wingsObj.attr("onNodeClick"),
	  				expand:wingsObj.attr("extendLayer"),
	  				lctrl:wingsObj.attr("lctrl"),
	  				onLtidBefore:wingsObj.attr("onLtidBefore"),
	  				onCheckBefore:wingsObj.attr("onCheckBefore"),
	  				onAfterLoadData:wingsObj.attr("onAfterLoadData"),
	  				minHeight:wingsObj.attr("minHeight"),
	  				maxHeight:wingsObj.attr("maxHeight"),
	  				topHeight:wingsObj.attr("topHeight"),
	  				height:wingsObj.attr("height"),
	  				menuTree:wingsObj.attr("menuTree"),
	  				onNodeContextMenu:wingsObj.attr("onNodeContextMenu"),
	  				isJgxzs:wingsObj.attr("isJgxzs"),
	  				onJgxzsCheck:wingsObj.attr("onJgxzsCheck"),
	  				autoExtendCaption: wingsObj.attr("autoExtendCaption")
	  			};
  				//处理懒加载url
  				if(opts.lctrl){
  					opts.url = "/ajax.sword?ctrl=" + opts.lctrl;
  				};
	  			//(2)处理on事件
	  			if(opts.onNodeClick){
	  				opts.onNodeClickFn = wings_getFunc(opts.onNodeClick);
	  			};
				if(opts.minHeight){
					wingsObj.css("overflow","auto");
					wingsObj.css("padding","0px 0");
					wingsObj.css("min-height",opts.minHeight);
				}
				if(opts.maxHeight){
					wingsObj.css("overflow","auto");
					wingsObj.css("padding","0px 0");
					wingsObj.css("max-height",opts.maxHeight);
				}
				//根据最上方的高，设置距离
				if(opts.topHeight){
					var winH = $(window).height() - opts.topHeight ;
					wingsObj.css("overflow","auto");
					wingsObj.css("padding","0px 0");
					wingsObj.css("min-height",winH  + "px");
					wingsObj.css("max-height",winH  + "px");
				}
	  			//(3)追加必要html标签
	  			//追加id 否则会有ztree 的小bug
		  		var new_id = opts.name+"_wingsTree_" + Math.floor(Math.random()*100);
				wingsObj.attr("id",new_id);
	  			//(4)执行jquery初始化方法,创建对象
				var treeObj = wingsObj.wingsTree(opts);
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,treeObj);
	  		}else if(wingsTag == "WingsToolBar"){
	  			WingsConsole.log('Wings init WingsToolBar begin ...');
				//【六】 WingsToolBar 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				showType:wingsObj.attr("showType"),
	  				inputClass:wingsObj.attr("inputClass"),
	  				css:wingsObj.attr("css"),
	  				isFixed:wingsObj.attr("isFixed")
	  			};
	  			
  				if(opts.inputClass){
  					wingsObj.addClass(opts.inputClass);
  				};
  				if(opts.css){
  					wingsObj.attr('style',opts.css);
  				};
		  					
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
				var toolBarObj = wingsObj.wingsToolbar(opts);
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,toolBarObj);
	  		}else if(wingsTag == "WingsToolBar2"){
	  			WingsConsole.log('Wings init WingsToolBar2 begin ...');
				//【六.1】 WingsToolBar 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				showType:wingsObj.attr("showType"),
	  				inputClass:wingsObj.attr("inputClass"),
	  				css:wingsObj.attr("css"),
	  				isFixed:wingsObj.attr("isFixed"),
	  				_pageSize:wingsObj.attr("pageSize"),
	  				noUpDown:wingsObj.attr("noUpDown")
	  				
	  			};
	  			
  				if(opts.inputClass){
  					wingsObj.addClass(opts.inputClass);
  				};
  				if(opts.css){
  					wingsObj.attr('style',opts.css);
  				};
		  					
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
				var toolBarObj = wingsObj.wingsToolbar2(opts);
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,toolBarObj);
	  		}else if(wingsTag == "WingsToolBar3"){
	  			WingsConsole.log('Wings init WingsToolBar3 begin ...');
				//【六.2】 WingsToolBar 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				showType:wingsObj.attr("showType"),
	  				inputClass:wingsObj.attr("inputClass"),
	  				css:wingsObj.attr("css"),
	  				isFixed:wingsObj.attr("isFixed"),
	  				_pageSize:wingsObj.attr("pageSize"),
	  				noUpDown:wingsObj.attr("noUpDown")
	  			};
	  			
  				if(opts.inputClass){
  					wingsObj.addClass(opts.inputClass);
  				};
  				if(opts.css){
  					wingsObj.attr('style',opts.css);
  				};
		  					
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
				var toolBarObj = wingsObj.wingsToolbar3(opts);
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,toolBarObj);
	  		}else if(wingsTag == "WingsGrid"){
	  			WingsConsole.log('Wings init WingsGrid begin ...');
				//【七】 WingsGrid 标签 
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				panel:wingsObj.attr("panel"),
	  				caption:wingsObj.attr("caption"),
	  				isAjax:wingsObj.attr("isAjax"),
	  				ordering:wingsObj.attr("ordering"),
	  				selectColor:wingsObj.attr("selectColor"),
	  				lineNumber:wingsObj.attr("lineNumber"),
	  				lineColumnTitle:wingsObj.attr("lineColumnTitle"),
	  				rowSelect:wingsObj.attr("rowSelect"),
	  				paging:wingsObj.attr("paging"),
	  				pagingType:wingsObj.attr("pagingType"),
	  				hideMenu:wingsObj.attr("hideMenu"),
	  				hideMenu_exclude:wingsObj.attr("hideMenu_exclude"),
	  				hideMenu_unhide:wingsObj.attr("hideMenu_unhide"),
	  				scrollY:wingsObj.attr("scrollY"),
	  				pageLength:wingsObj.attr("pageLength"),
	  				striped:wingsObj.attr("striped"),
	  				border:wingsObj.attr("border"),
	  				showHeader:wingsObj.attr("showHeader"),
	  				itemX:wingsObj.attr("itemX"),
	  				defaultAlignment:wingsObj.attr("defaultAlignment"),
	  				contentLen:wingsObj.attr("contentLen"),
	  				onRowClick:wingsObj.attr("onRowClick"),
	  				nowrap:wingsObj.attr("nowrap"),
	  				checkColor:wingsObj.attr("checkColor"),
	  				info:wingsObj.attr("info"),
	  				dataFontSize:wingsObj.attr("dataFontSize"),
	  				dataX:wingsObj.attr("dataX"),
	  				dataY:wingsObj.attr("dataY"),
	  				fixedHead:wingsObj.attr("fixedHead"),
	  				fixedColWidth:wingsObj.attr("fixedColWidth"),
	  				fzbtid:wingsObj.attr("fzbtid"),
	  				rowCheckValidator: wingsObj.attr("rowCheckValidator"),
	  				ptid: wingsObj.attr("ptid"),
	  				onAfterCreateRow: wingsObj.attr("onAfterCreateRow"),
	  				showHJ: wingsObj.attr("showHJ"),
					fenye: wingsObj.attr("fenye"),
					pageSizeInfo: wingsObj.attr("pageSizeInfo"),
                    pageInfo: wingsObj.attr("pageInfo"),
                    runTo: wingsObj.attr("runTo"),
                    lazy: wingsObj.attr("lazy"),
                    wordBreak: wingsObj.attr("wordBreak"),
                    checkMoudle: wingsObj.attr("checkMoudle"),
                    scrollX1:wingsObj.attr("scrollX"),
                    stid:wingsObj.attr("stid"),
                    onRowDbClick:wingsObj.attr("onRowDbClick"),
                    dragWidth:wingsObj.attr("dragWidth"),
                    onRowRightClick:wingsObj.attr("onRowRightClick"),
                    onAfterInitData:wingsObj.attr("onAfterInitData"),
                    lengthMenu:wingsObj.attr("lengthMenu"),
                    pageSizeType: wingsObj.attr("pageSizeType"),
					emptyDataMsg: wingsObj.attr("emptyDataMsg"),
					togglecell:wingsObj.attr("togglecell"),
					tableCopy: wingsObj.attr("tableCopy"),
					dragCol:wingsObj.attr("dragCol"),
					pageFontSize: wingsObj.attr("pageFontSize"),
					showConsole: wingsObj.attr("showConsole")
	  				
	  			};
	  			if(wingsObj.attr("ajax")){
	  				opts.ajax = {url:wingsObj.attr("ajax")};
	  			};
				
	  			//(4)设置参数
	  			//(4.1)处理列标签
				var cols = [];
				wingsObj.find(">div").each(function(j,el){
					var $el = $(el);
	  				//一级div
	  				var col_opts = {
		  				name:$el.attr("name"),
		  				caption:$el.attr("caption"),
		  				type:$el.attr("type"),
		  				html:$el.html(),
		  				wingsOnClick:$el.attr("wingsOnClick"),
	  					x:$el.attr("x"),
	  					alignment:$el.attr("alignment"),
	  					contentLen:$el.attr("contentLen"),
	  					striped:$el.attr("striped"),
	  					format:$el.attr("format"),
	  					isShowCaption:$el.attr("isShowCaption"),
	  					defaultValue:$el.attr("defaultValue"),
		  				wingsmouseover:$el.attr("wingsmouseover"),
		  				wingsmouseenter:$el.attr("wingsmouseenter"),
		  				wingsmouseout:$el.attr("wingsmouseout"),
		  				required: $el.attr("required"),
                        maxnb: $el.attr("maxnb"),
                        minnb: $el.attr("minnb"),
                        equalTo: $el.attr("equalTo"),
                        rangelength: $el.attr("rangelength"),
                        rule: $el.attr("rule"),
                        childonclick:$el.attr("childonclick"),
                        hj:$el.attr("hj"),
                        disable:$el.attr("disable"),
                        allChk:$el.attr("allChk"),
                        sort:$el.attr("sort"),
                        onclick: $el.attr("onclick"),
						allCheckOnclick:$el.attr("allCheckOnclick"),
						hjLabel:$el.attr("hjLabel"),
						wingsOnCellBlur: $el.attr("wingsOnCellBlur"),
						onchange: $el.attr("onchange"),
						onfocus: $el.attr("onfocus"),
						onblur: $el.attr("onblur"),
                        onBeforeCreateCell:$el.attr("onBeforeCreateCell"),
                        console: $el.attr("console"),
                        check: $el.attr("check"),
                        where:  $el.attr("where"),
                        wingsOnCellFocus: $el.attr("wingsOnCellFocus"),
                        wingsOnCellChange:  $el.attr("wingsOnCellChange"),
                        delConfirm: $el.attr("delConfirm")
                        
		  			};
	  				  if ($el.attr("type") == "select") {
		  					//【重要】转换onSelect属性为onSelectFn
		  					if($el.attr("onSelect")){
		  						$el.attr("onSelectFn",$el.attr("onSelect"));
		  					//删除属性 这个属性慎用
		  						$el.attr("onSelect","");
		  					}
                    	var g = {
				  				name:$el.attr("name"),//名称
				  				selfObj:null,//主要的作用对象
		  						type:"select",//类型
				  				dataName:$el.attr("dataName"),
				  				inputClass:$el.attr("inputClass"),
				  				css:$el.attr("css"),
				  				defValue:$el.attr("defValue"),
				  				required:$el.attr("required"),
				  				noSearch:$el.attr("noSearch"),
				  				onSelect:$el.attr("onSelectFn"),
				  				onChangeFn:$el.attr("onChangeFn"),
				  				onBlur:$el.attr("onBlur"),
				  				onBeforeClick:$el.attr("onBeforeClick"),
				  				multiple:$el.attr("multiple"),
				  				handInput:$el.attr("handInput"),
				  				disable:$el.attr("disable"),
				  				allowClear:$el.attr("allowClear"),
				  				placeholder:$el.attr("placeholder"),
				  				popDisplay:$el.attr("popDisplay"),
				  				submitcontent:$el.attr("submitcontent"),
				  				inputDisplay:$el.attr("inputDisplay")
                    	};
                    	if(g.onChangeFn){
                    		g.onSelect = g.onChangeFn;
                    	};
                    	if(g.onBlur){
                    		g.onBeforeClick = g.onBlur;
                    	};
                    	var n = [];
                    	$el.find(">div").each(function(k, a) {
                    		if (typeof($(a).attr("code")) != "undefined" && typeof($(a).attr("caption")) != "undefined") {
                    			var b = {
                    					code: $(a).attr("code"),
                    					caption: $(a).attr("caption")
                    			};
                    			n.push(b);
                    			$(this).remove();
                    		}
                    	});
                    	if(g.dataName == null){
                    		g.data = n;
                    	}
                    	col_opts.selectOption = g;
                    }else if ($el.attr("type") == "pulltree") {
                        var g = {
                            name: $el.attr("dataName"),
                            selfObj: null,
                            type: "pulltree",
                            treeType: $el.attr("treeType"),
                            defValue: $el.attr("defValue"),
                            onNodeClick: $el.attr("onNodeClick"),
                            expand: $el.attr("extendLayer"),
	  						isJgxzs:$el.attr("isJgxzs"),
                            lctrl: $el.attr("lctrl"),
	  						p_name:opts.name,
                            onLtidBefore: $el.attr("onLtidBefore"),
                            onCheckBefore: $el.attr("onCheckBefore"),
                            height: $el.attr("height"),
                            popDisplay: $el.attr("popDisplay"),
                            itemWidth:$el.attr("itemWidth")
                        };
                        if (g.lctrl) {
                            g.url = AddBizCode2URL("/ajax.sword?ctrl=" + g.lctrl)
                        };
                        if (g.onNodeClick) {
                            g.onNodeClickFn = wings_getFunc(g.onNodeClick)
                        };
                        col_opts.treeOption = g;
                    }else if ($el.attr("type") == "wingsDate" || $el.attr("wings") == "WingsCalendar") {
                            var g = {
                                name: $el.attr("name"),
                                selfObj: null,
                                type: "wingsDate",
                                format: $el.attr("format"),
                                inputClass: $el.attr("inputClass"),
                                css: $el.attr("css"),
                                defValue: $el.attr("defValue"),
                                required: $el.attr("required"),
                                zdyRule: $el.attr("zdyRule"),
                                disable: $el.attr("disable"),
                                readonly: $el.attr("wingsReadonly"),
                                startDate: $el.attr("startDate"),
                                endDate:$el.attr("endDate"),
				  				onShowFn:$el.attr("onShowFn"),
				  				onHideFn:$el.attr("onHideFn"),
                                onDateChange: $el.attr("onDateChange")
                            };
                            col_opts.dateOption = g;
                    }else if ($el.attr("type") == "rightMenu") {
                      var g = {
                              name: $el.attr("name"),
                              type: "rightMenu",
                              isRightMenu: "true",
                              onSelect: $el.attr("onSelect"),
                              dataStr: $el.attr("dataStr")
                          };
                          col_opts.rightMenuOption = g
                      };

	  				cols.push(col_opts);
	  				$el.remove();
	  			});
	  			if(cols.length>0){
					opts.columns = cols;
				};
				
	  			//(3)追加必要html标签
		  		var new_table_id = opts.name+"_wingsGrid_" + Math.floor(Math.random()*100);
				if(opts.panel=="true"){
					wingsObj.prepend('<div class="panel-heading" >'+opts.caption+'</div>');
					wingsObj.wrapInner('<div class="panel-primary" style="background-color: white;"></div>');
				};
				wingsObj.append('<table id="'+new_table_id+'" class="display" width="99%"></table>');
				
				//(4.2)加载griddata
//				if($('#SwordPageData')){
//					if($('#SwordPageData').attr("data")){
//						var initDate = jQuery.parseJSON($('#SwordPageData').attr("data"));
//						if(initDate.data){
//							$.each(initDate.data, function(i, val) {
//								 if(val.sword == "SwordGrid" && val.name == opts.name ){
//									//wingsGrid初始化
//									opts.data = val;
//								};
//							});
//						};
//					};
//				};
				//(5)执行jquery初始化方法,创建对象
				var gridObj = $('#'+ new_table_id).wingsDataTables(opts);
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,gridObj);
				
	  		}else if(wingsTag == "WingsSubmit"){
	  			WingsConsole.log('Wings init WingsSubmit begin ...');
				//【八】 WingsSubmit 标签  提交组件
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				btnName:wingsObj.attr("btnName"),
	  				title:wingsObj.attr("title"),
	  				ctrl:wingsObj.attr("ctrl"),
	  				onSuccess:wingsObj.attr("onSuccess")
	  			};
	  			//(3)追加必要html标签
		  		var new_id = opts.name+"_wingsSubmit_" + Math.floor(Math.random()*100);
				wingsObj.prepend('<button type="button" id="'+new_id+'" ' +
					'class="btn btn-sm btn-primary"  >'+opts.btnName+'</button>');
				var obj = $('#'+new_id);
				if(opts.title){
					obj.attr("title",opts.title);
				};
	  			//(4)执行jquery初始化方法,创建对象
				var sub = new WingsSubmit();
				//(5)设置参数
				if(opts.ctrl){
					sub.options.ctrl = opts.ctrl;
				};
				if(opts.onSuccess){
					//设置onSuccess 调用的方法
					sub.options.onSuccess = wings_getFunc(opts.onSuccess);
				};
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,sub);
	  		}else if(wingsTag == "PageInit"){
	  			WingsConsole.log('Wings init PageInit begin ...');
				//【九】 PageInit 标签 页面初始化
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				onSuccess:wingsObj.attr("onSuccess"),
	  				onFinish:wingsObj.attr("onFinish")
	  			};
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
				//(5)设置参数
				if(opts.onSuccess){
					//设置onSuccess 调用的方法
					opts.onSuccessFun = wings_getFunc(opts.onSuccess);
				};
				if(opts.onFinish){
					//设置onFinish 调用的方法
					opts.onFinishFun = wings_getFunc(opts.onFinish);
				};
				//(6)将对象以name为key，存入map中
				mainObjMap.put("wings_PageInit",opts);
	  		}else if(wingsTag == "wingsTab"){
	  			WingsConsole.log('Wings init wingsTab begin ...');
  				//【重要】转换onSelect属性为onSelectFn
  				if(wingsObj.attr("onSelect")){
  					wingsObj.attr("onSelectFn",wingsObj.attr("onSelect"));
  				//删除属性 这个属性慎用
  					wingsObj.attr("onSelect","");
  				}
				//【十】 wingsTab 标签 tab
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				tabTitles:wingsObj.attr("tabTitles"),
	  				tabDivs:wingsObj.attr("tabDivs"),
	  				tabSelectedIndex:wingsObj.attr("tabSelectedIndex"),
	  				inputClass:wingsObj.attr("inputClass"),
	  				titleClass:wingsObj.attr("titleClass"),
	  				titleAClass:wingsObj.attr("titleAClass"),
	  				onselect:wingsObj.attr("onselectFn"),
	  				isColumn:wingsObj.attr("isColumn"),
	  				tabs:[]
	  			};
	  			//(3)追加必要html标签
	  			//(4)执行jquery初始化方法,创建对象
	  			var tabObj = wingsObj.wingsTab(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,tabObj);
	  		}else if(wingsTag == "wingsFramePanel"){
	  			WingsConsole.log('Wings init wingsFramePanel begin ...');
				//【十一】 wingsFramePanel 标签  panel
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				caption:wingsObj.attr("caption"),
	  				height:wingsObj.attr("height"),
	  				width:wingsObj.attr("width")
	  			};
	  			//(3)追加必要html标签
	  			var height = '';
	  			if(opts.height){
	  				height = 'height="'+opts.height+'"';
	  			};
	  			wingsObj.prepend('<div class="panel-heading">'+opts.caption+'</div>');
				wingsObj.wrapInner('<div class="panel-primary" style="background-color: white;" '+height +'  ></div>');
	  			//(4)执行jquery初始化方法,创建对象
	  			var tabObj = wingsObj.wingsTab(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
	  		}else if(wingsTag == "wingsMove"){
	  			WingsConsole.log('Wings init wingsMove begin ...');
				//【十二】 wingsMove 标签  左右选择器
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				left_opts:{},
	  				right_opts:{},
	  				button_opts:{}
	  			};
	  			//(2)收集内部标签信息 并追加标签
		  		var new_wingsMove_id = opts.name+"_wingsMove_" + Math.floor(Math.random()*100);
		  		wingsObj.find("div").each(function(j,el){
	  				if($(el).attr("type") == "wingsMoveLeft"){
	  					//数据绑定
	  					opts.leftDataName = $(el).attr("dataName");
	  					opts.leftShowName = $(el).attr("showName");
	  					opts.leftCodeName = $(el).attr("codeName");
	  					//左侧
	  					 var left_opts = {
	  						size: $(el).attr("size")? $(el).attr("size"):10,
	  						id:new_wingsMove_id + '_left'
	  					};
						$(el).append('<select name="from" id="'+left_opts.id+'" size="'+left_opts.size+'" ' 
							+ ' class="form-control"  multiple="multiple"></select>');
						opts.left_opts = $.extend(true, {}, opts.left_opts, left_opts);
	  				}else if($(el).attr("type") == "wingsMoveRight"){
	  					//数据绑定
	  					opts.rightDataName = $(el).attr("dataName");
	  					opts.rightShowName = $(el).attr("showName");
	  					opts.rightCodeName = $(el).attr("codeName");
	  					//右侧
	  					 var right_opts = {
	  						size: $(el).attr("size")? $(el).attr("size"):10,
	  						id:new_wingsMove_id + '_right'
	  					};
						$(el).append('<select name="from" id="'+right_opts.id+'" size="'+right_opts.size+'" ' 
							+ ' class="form-control"  multiple="multiple"></select>');
						opts.right_opts = $.extend(true, {}, opts.right_opts, right_opts);
	  					
	  				}else if($(el).attr("type") == "wingsMoveButton"){
	  					//按钮
	  					var button_opts = {};
	  					$(el).find("div").each(function(k,el_el){
	  						if($(el_el).attr("type") == "allRight"){
	  							button_opts.allRight_id = new_wingsMove_id + '_button_allRight';
	  							$(el).append('<button type="button" id="'+button_opts.allRight_id+'" class="btn btn-default btn-block">' +
	  								' <i class="glyphicon glyphicon-forward"></i></button>');
	  						}else if($(el_el).attr("type") == "right"){
	  							button_opts.right_id = new_wingsMove_id + '_button_right';
	  							$(el).append('<button type="button" id="'+button_opts.right_id+'" class="btn btn-default btn-block">' +
	  							'<i class="glyphicon glyphicon-chevron-right"></i></button>');
	  						}else if($(el_el).attr("type") == "left"){
	  							button_opts.left_id = new_wingsMove_id + '_button_left';
	  							$(el).append('<button type="button" id="'+button_opts.left_id+'" class="btn btn-default btn-block">' +
	  							'<i class="glyphicon glyphicon-chevron-left"></i></button>');
	  						}else if($(el_el).attr("type") == "allLeft"){
	  							button_opts.allLeft_id = new_wingsMove_id + '_button_allLeft';
	  							$(el).append('<button type="button" id="'+button_opts.allLeft_id+'" class="btn btn-default btn-block">' +
	  							'<i class="glyphicon glyphicon-backward"></i></button>');
	  						}else if($(el_el).attr("type") == "undo"){
	  							button_opts.undo_id = new_wingsMove_id + '_button_undo';
	  							$(el).append('<button type="button" id="'+button_opts.undo_id+'" class="btn btn-primary btn-block">回退</button>');
	  						}else if($(el_el).attr("type") == "redo"){
	  							button_opts.redo_id = new_wingsMove_id + '_button_redo';
	  							$(el).append('<button type="button" id="'+button_opts.redo_id+'" class="btn btn-warning btn-block">前进</button>');
	  						};
	  					});
						opts.button_opts = $.extend(true, {}, opts.button_opts, button_opts);
	  				}
	  			});
	  			//(3)追加必要html标签
	  			
				//设置组件用参数
				opts.leftAll = opts.button_opts.allLeft_id;
				opts.rightAll = opts.button_opts.allRight_id;
				opts.leftSelected = opts.button_opts.left_id;
				opts.rightSelected = opts.button_opts.right_id;
				opts.undo = opts.button_opts.undo_id;
				opts.redo = opts.button_opts.redo_id;
				opts.leftSelId = opts.left_opts.id;
				opts.rightSelId = opts.right_opts.id;
		
	  			//(4)执行jquery初始化方法,创建对象
	  			var moveObj = wingsObj.wingsMove(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
				mainObjMap.put(opts.name,moveObj);
				
				//绑定数据 初始化用
				if(opts.leftDataName){
					var tempObj ={
						type:"wingsMove",
						tagert:"left",
						obj:moveObj
					};
  					$.wingsSetObjByDataName(opts.leftDataName,tempObj);
  				};
				if(opts.rightDataName){
					var tempObj ={
						type:"wingsMove",
						tagert:"right",
						obj:moveObj
					};
  					$.wingsSetObjByDataName(opts.rightDataName,tempObj);
  				};
	  		}else if(wingsTag == "wingsSuggest"){
	  			WingsConsole.log('Wings init wingsSuggest begin ...');
  				//【重要】转换onSelect属性为onSelectFn
  				if(wingsObj.attr("onSelect")){
  					wingsObj.attr("onSelectFn",wingsObj.attr("onSelect"));
  				//删除属性 这个属性慎用
  					wingsObj.attr("onSelect","");
  				}
				//【十三】 wingsSuggest 标签  wingsSuggest
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				height:wingsObj.attr("height"),
	  				width:wingsObj.attr("width"),
	  				showHeader:wingsObj.attr("showHeader"),
	  				headerTitles:wingsObj.attr("headerTitles"),
	  				rowName:wingsObj.attr("rowName"),
	  				lctrl:wingsObj.attr("lctrl"),
				  	onSelect:wingsObj.attr("onSelectFn"),
	  				onLtidBefore:wingsObj.attr("onLtidBefore"),
	  				keyField:wingsObj.attr("keyField"),
	  				idField:wingsObj.attr("idField"),
	  				showBtn:wingsObj.attr("showBtn")
	  				
	  			};
	  			//(3)追加必要html标签
	  			
	  			//(4)执行jquery初始化方法,创建对象
	  			var suggestObj = wingsObj.wingsSuggest(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
	  			mainObjMap.put(opts.name,suggestObj);
	  		}else if(wingsTag == "wingsMenu"){
	  			WingsConsole.log('Wings init wingsMenu begin ...');
  				//【重要】转换onSelect属性为onSelectFn
  				if(wingsObj.attr("onSelect")){
  					wingsObj.attr("onSelectFn",wingsObj.attr("onSelect"));
  				//删除属性 这个属性慎用
  					wingsObj.attr("onSelect","");
  				}
				//【十四】 wingsMenu 标签  菜单   【未完待续】
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				isRightMenu:wingsObj.attr("isRightMenu"),
	  				onSelect:wingsObj.attr("onSelectFn"),
	  				dataStr:wingsObj.attr("dataStr")
	  				
	  			};
	  			//(3)追加必要html标签
	  			
	  			//(4)执行jquery初始化方法,创建对象
	  			var menuObj = wingsObj.wingsMenu(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
	  			mainObjMap.put(opts.name,menuObj);
	  		}else if(wingsTag == "WingsButton"){
	  			WingsConsole.log('Wings init WingsButton begin ...');
				//【十五】 WingsButton 按钮组件
	  			//(1)搜集属性
	  			var opts = {
	  				name:wingsObj.attr("name"),
	  				caption:wingsObj.attr("caption"),
	  				onClickFn:wingsObj.attr("onClickFn")
	  			};
	  			//(3)追加必要html标签
	  			
	  			//(4)执行jquery初始化方法,创建对象
	  			var btObj = wingsObj.WingsButton(opts);
				//(5)设置参数
				//(6)将对象以name为key，存入map中
	  			mainObjMap.put(opts.name,btObj);
	  			btObj = null;
	  		};
	  		
	  		
		};
	});
	
	// ============= wings标签 封装 (end) ==================
	
	// ============= 页面初始化方法 (begin) ==================
	WingsConsole.log('wings initData begin ...');
	{
		var init_PageInit = $.wingsWidget("wings_PageInit");
		var initDataTemp = '';
		
 		//执行onFinish 方法
		if(init_PageInit && init_PageInit.onFinishFun ){
			for (var b = 0; b < init_PageInit.onFinishFun.length; b++) {
	            var  func = eval(init_PageInit.onFinishFun[b]);
		       	if (typeof func == "function") {
					var res = new WingsReqData($pc._initData.data);
	            	var result = new func(res);
		       	}
		    }
		}
			
		//页面初始化方法
		if($('#SwordPageData')){
			if($('#SwordPageData').attr("data")){
//         		$pc._initData.data = jQuery.parseJSON($('#SwordPageData').attr("data"));//重点优化对象
				if($pc._initData.data){
					setTimeout(function(){
						initWingsPageData($pc._initData.data,{"delay":"true"});//初始化页面数据
						hideMask();
						if(init_PageInit && init_PageInit.onSuccessFun ){
							for (var b = 0; b < init_PageInit.onSuccessFun.length; b++) {
					            var  func = eval(init_PageInit.onSuccessFun[b]);
						       	if (typeof func == "function") {
									var res = new WingsReqData($pc._initData.data);
					            	var result = new func(res);
						       	};
						    };
						};
					},1);
				};
			};
		}else{
			if($pc.delayMap.size() > 0){ //TODO
				//处理延时时间
				var delayTime = $pc.delayTime;
				$.each($pc.delayMap.container,function(key,obj){
					if(obj.delayTime && Number(obj.delayTime)> Number(delayTime)){
						delayTime = obj.delayTime;
					};
				});
				
				//有延时操作
				setTimeout(function(){
					//执行延时加载操作
					for(var obj in $pc.delayMap.container) {
						var FormObj = $.wingsWidget(obj);
						FormObj.delayInit();
					};
					//执行onSuccess 方法
					if(init_PageInit && init_PageInit.onSuccessFun ){
						for (var b = 0; b < init_PageInit.onSuccessFun.length; b++) {
							var  func = eval(init_PageInit.onSuccessFun[b]);
							if (typeof func == "function") {
								var res = new WingsReqData($pc._initData.data);
								var result = new func(res);
							};
						};
					};
				},delayTime);
				
			}else{
				
				//执行onSuccess 方法
				if(init_PageInit && init_PageInit.onSuccessFun ){
					for (var b = 0; b < init_PageInit.onSuccessFun.length; b++) {
						var  func = eval(init_PageInit.onSuccessFun[b]);
						if (typeof func == "function") {
							var res = new WingsReqData($pc._initData.data);
							var result = new func(res);
						}
					}
				}
			}
		}
	};
	WingsConsole.log('wings initData end ...');
	// ============= 页面初始化方法 (end) ==================
	
});

	function initWingsPullTree(b, c) {
		if (c.lctrl) {
	        c.url = AddBizCode2URL("/ajax.sword?ctrl=" + c.lctrl);
	    };
	    if (c.onNodeClick) {
	        c.onNodeClickFn = wings_getFunc(c.onNodeClick);
	    };
	    var obj = $('#' + b).wingsTree(c);
	    c.selfObj = obj;
	    
		//记录select 用户重新更新
		$.wingsSetObjByDataName(c.name,obj);
	    if ($('#SwordPageData')) {
	        if ($('#SwordPageData').attr("data")) {
	            if ($pc._initData.data) {
	                $.each($pc._initData.data, function(i, a) {
	                    if (a.sword == "SwordTree") {
	                        if (a.name == c.name) {
	                            if (obj) {
	                                obj.initData(a);
	                            }
	                        }
	                    }
	                })
	            };
	        };
	    };
	//    B.setWidget(g.name, g);
	//    obj.put(g.name, r)
	    return obj;
	};


	function initWingsSelector(selectId,selectOption){
		if (selectOption.inputClass) {
			$('#' + selectId).addClass(selectOption.inputClass);
		}
		if (selectOption.css) {
			$('#' + selectId).attr('style', selectOption.css);
		}
		if (selectOption.defValue) {
			$('#' + selectId).val(selectOption.defValue);
		}
		var obj = $('#' + selectId).wingsSelector(selectOption);
		selectOption.selfObj = obj;
		
		//记录select 用户重新更新
		$.wingsSetObjByDataName(selectOption.dataName,obj);
		  						
		if ($('#SwordPageData')) {
	        if ($('#SwordPageData').attr("data")) {
	            if ($pc._initData.data) {
	            	$.each($pc._initData.data, function(i, a) {
	            		if (a.sword == "SwordSelect") {
	            			if(a.dataName == selectOption.dataName){
	            				if (obj) {
	            					obj.initData(a)
	            				}
	            			}
	                    }
	            	});
	            }
	        }
	    };
	    return obj;
		//    B.setWidget(selectOption.name, selectOption);
		//	if (selectOption.dataName) {
		//		P.put(selectOption.dataName, o)
		//	}
	}

	function initWingsDate(b,c){
	  var o = $('#' + b).wingsDatetime(c);
	  c.selfObj = o;
	  if (c.onDateChange) {
	      c.selfObj.change(function(a) {
	          var m = wings_getFunc(c.onDateChange);
	          for (var b1 = 0; b1 < m.length; b1++) {
	              var d = eval(m[b1]);
	              if (typeof d == "function") {
	                  var e = new d(a.target.value)
	              }
	          }
	      })
	  };
	  if (c.inputClass) {
	      c.selfObj.addClass(c.inputClass)
	  };
	  if (c.css) {
	      c.selfObj.attr('style', c.css)
	  };
	  if (c.defValue) {
	      c.selfObj.val(c.defValue)
	  };
	  if (c.zdyRule) {
	      c.selfObj.attr('zdyRule', c.zdyRule)
	  };
	  if (c.required) {
	      c.selfObj.attr('required', c.required)
	  };
	  if (c.readonly && c.readonly == "true") {
	      c.selfObj.attr('readonly', c.readonly)
	  } else {
	      c.selfObj.attr('readonly', null)
	  }; if (c.disable && c.disable == "true") {
	      c.selfObj.attr('disabled', c.disable)
	  } else {
	      c.selfObj.attr('disabled', null)
	  }; if (c.startDate) {
	      c.selfObj.attr('startDate', c.startDate)
	  };
	  if (c.endDate) {
	      c.selfObj.attr('endDate', c.endDate)
	  };
	  return o;
	}

	// ============= 重载页面特殊数据 (begin) ==================
	
	// ============= 重载页面特殊数据 (end) ==================
	function $reloadSel(dataName,dataObj){
		$.each(dataObj, function(i, val) {
			
		});
	};
	
	// ============= 页面数据 装填 (begin) ==================
	function initWingsPageData(dataObj,parem){
		WingsConsole.log('initWingsPageData begin ...');
		$.each(dataObj, function(i, val) {
			if(val.sword == "SwordTree"){
				//tree初始化
				var treeObj = $.wingsWidget(val.name);
				if(treeObj){
					treeObj.initData(val);
				};
			}else if(val.sword == "SwordCheckBox"){
				//wingsCheckBox初始化
				var checkBoxOptsArr = $.wingsGetObjByDataName(val.name);
				if(checkBoxOptsArr){
					$.each(checkBoxOptsArr,function(i,checkBoxOpts){
						if(checkBoxOpts && checkBoxOpts.selfObj){
							checkBoxOpts.selfObj.initData(val);
						};
					});
				}
			}else if(val.sword == "SwordRadio"){
				//wingsRadio初始化
				var radioOptsArr = $.wingsGetObjByDataName(val.name);
				if(radioOptsArr){
					$.each(radioOptsArr,function(i,radioOpts){
						if(radioOpts && radioOpts.selfObj){
							radioOpts.selfObj.initData(val);
						};
					});
				}
			}else if(val.sword == "SwordGrid"){
				//wingsMove
				var moveObjArr = $.wingsGetObjByDataName(val.name);
				if(moveObjArr){
					$.each(moveObjArr,function(i,moveObj){
						if(moveObj && moveObj.type == "wingsMove"){
							if(moveObj.tagert == "left"){
								//初始化左侧
								moveObj.obj.initLeftForSword(val);
							}else if(moveObj.tagert == "right"){
								//初始化右侧
								moveObj.obj.initRightForSword(val);
							}
						}else if(moveObj && moveObj.type == "multipleSelect"){
							if(moveObj.obj){
								moveObj.obj.initTableData(val);
							}
						}
					});
					
				}
				//wingsGrid初始化
				var gridObj = $.wingsWidget(val.name);
				if(gridObj){
					gridObj.initData(val);
				};
			}
		});
		//select 在grid之后加载，提高页面显示效率
		$.each(dataObj, function(i, val) {
			if(val.sword == "SwordSelect"){
				//select初始化
				var selObjArr = $.wingsGetObjByDataName(val.dataName);
				if(selObjArr){
					$.each(selObjArr,function(i,selObj){
						selObj.initData(val,parem);
					});
				};
			}
		});
		//form 和 grid在初始化其他 下拉&树之后执行
		$.each(dataObj, function(i, val) {
			if(val.sword == "SwordForm"){
				//form初始化
				var formObj = $.wingsWidget(val.name);
				if(formObj){
					var temp = {
						data: val.data
					};
					formObj.initData(JSON.stringify(temp));
				};
			}
		});
		WingsConsole.log('initWingsPageData end ...');
	}
	
	

	//clone 2017-10-08 lei
	function initWingsCloseFormData(formObj){
		var dataObj;
		if($('#SwordPageData')){
			if($('#SwordPageData').attr("data")){
				//给初始化data赋值
				if($pc._initData.data){
					dataObj = $pc._initData.data;
				};
			};
		};
		if(!dataObj){
			return;
		};
		$.each(dataObj, function(i, val) {
			if(val.sword == "SwordTree"){
				//tree初始化
//				var treeObj = $.wingsWidget(val.name);
//				if(treeObj){
//					treeObj.initData(val);
//				};
				//只初始化自己的类
				var selObjArr = formObj.getCloseObjByDataName(val.name);
				if(selObjArr){
					$.each(selObjArr,function(i,treeObj){
						treeObj.initData(val);
					});
				};
			}else if(val.sword == "SwordSelect"){
				//select初始化
				var selObjArr = formObj.getCloseObjByDataName(val.dataName);
				if(selObjArr){
					$.each(selObjArr,function(i,selObj){
						selObj.initData(val);
					});
				};
			}else if(val.sword == "SwordCheckBox"){
				//wingsCheckBox初始化
				var checkBoxOptsArr = formObj.getCloseObjByDataName(val.name);
				if(checkBoxOptsArr){
					$.each(checkBoxOptsArr,function(i,checkBoxOpts){
						if(checkBoxOpts && checkBoxOpts.selfObj){
							checkBoxOpts.selfObj.initData(val);
						};
					});
				}
			}else if(val.sword == "SwordRadio"){
				//wingsRadio初始化
				var radioOptsArr = formObj.getCloseObjByDataName(val.name);
				if(radioOptsArr){
					$.each(radioOptsArr,function(i,radioOpts){
						if(radioOpts && radioOpts.selfObj){
							radioOpts.selfObj.initData(val);
						};
					});
				};
			};
		});
	}
	// ============= 页面数据 装填 (end) ==================
