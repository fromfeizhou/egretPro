function Po(x, y) {
    return new com_main.Point(x, y);
}
function fontSize(size) {
    return size / 1.44;
}
function __pri_log(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (optionalParams) {
        egret.log.apply(egret, ["[LOG]", message].concat(optionalParams));
    }
    else {
        egret.log("[LOG]", message);
    }
}
var debug = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    __pri_log.apply(void 0, [message].concat(optionalParams));
};
/**忽略输出协议号 */
var debugPbOffs = [1, 2, 5305, 5306, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513];
var debugPb = function (protocol, message) {
    var optionalParams = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        optionalParams[_i - 2] = arguments[_i];
    }
    if (debugPbOffs.indexOf(protocol) >= 0)
        return;
    __pri_log.apply(void 0, [message].concat(optionalParams));
};
var debugBatt = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    __pri_log.apply(void 0, [message].concat(optionalParams));
};
var debugSkill = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    __pri_log.apply(void 0, [message].concat(optionalParams));
};
var debugGui = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    __pri_log.apply(void 0, [message].concat(optionalParams));
};
var error = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    egret.error.apply(egret, ["[LOG]", message].concat(optionalParams));
};
var warn = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (!Utils.DebugUtils.isDebug)
        return;
    egret.warn.apply(egret, ["[LOG]", message].concat(optionalParams));
};
// /**
//  * 动态开启,或关闭打印
//  */
// function open(){
// }
/**格式替换 从{1}开始 */
function format() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length == 0)
        return null;
    var str = args[0];
    for (var i = 1; i < args.length; i++) {
        // let re = new RegExp('\\\\{' + (i - 1) + '\\\\}', 'gm');
        var re = new RegExp("({)" + i + "(})", "g");
        str = str.replace(re, args[i]);
    }
    return str;
}
/** 函数用于检查其参数是否是空值 */
function isNull(arg) {
    return arg == undefined || arg == null;
}
/**不为空 */
function unNull(arg) {
    return !isNull(arg);
}
/**是否有父对象 */
function hasParent(child) {
    return !isNull(child.parent);
}
/**数组是否为空 */
function isEmptyArray(data) {
    if (data.length > 0) {
        return false;
    }
    for (var key in data) {
        return false;
    }
    return true;
}
/**是否是空节点 */
function isEmptyObject(data) {
    for (var key in data) {
        return false;
    }
    return true;
}
// function reloadScript() {
// 	location.reload(true);
// 	reloadAbleJSFn("Main", "bin-debug/Main.js");
// 	reloadAbleJSFn("agame", "libs/modules/agame/agame.js");
// 	reloadAbleJSFn("com_main", "libs/modules/com_main/com_main.js");
// }
// function reloadAbleJSFn(id, newjs) {
// 	removeElement(id);
// 	let scriptObj = document.createElement("script");
// 	scriptObj.id = id;
// 	scriptObj.src = newjs;
// 	scriptObj.type = "text/javascript";
// 	document.getElementsByTagName("head")[0].appendChild(scriptObj);
// 	// document.write(format("<script src='{1}'><\/script>", newjs));
// }
// function removeElement(id: string) {
// 	let ele = document.getElementById(id);
// 	if (ele) ele.parentNode.removeChild(ele);
// }
