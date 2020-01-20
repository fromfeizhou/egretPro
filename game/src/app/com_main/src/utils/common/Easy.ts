function Po(x: number, y: number): com_main.Point {
	return new com_main.Point(x, y);
}

function fontSize(size: number) {
	return size / 1.44;
}

function __pri_log(message?: any, ...optionalParams: any[]) {
	if (optionalParams) {
		egret.log("[LOG]", message, ...optionalParams);
	} else {
		egret.log("[LOG]", message);
	}
}

var debug = (message?: any, ...optionalParams: any[]) =>{
	__pri_log(message, ...optionalParams);
}

/**忽略输出协议号 */
let debugPbOffs = [1, 2, 5305, 5306, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513];
var debugPb = (protocol: number, message?: any, ...optionalParams: any[]) =>{
	if (debugPbOffs.indexOf(protocol) >= 0) return;
	__pri_log(message, ...optionalParams);
}

var debugBatt = (message?: any, ...optionalParams: any[]) =>{
	__pri_log(message, ...optionalParams);
}

var debugSkill = (message?: any, ...optionalParams: any[]) =>{
	__pri_log(message, ...optionalParams);
}

var debugGui = (message?: any, ...optionalParams: any[]) =>{
	__pri_log(message, ...optionalParams);
}

var error = (message?: any, ...optionalParams: any[]) => {
	egret.error("[LOG]", message, ...optionalParams);
}

var warn = (message?: any, ...optionalParams: any[]) => {
	if (!Utils.DebugUtils.isDebug) return;
	egret.warn("[LOG]", message, ...optionalParams);
}

// /**
//  * 动态开启,或关闭打印
//  */
// function open(){

// }

/**格式替换 从{1}开始 */
function format(...args: any[]) {
	if (args.length == 0)
		return null;
	let str = args[0];
	for (let i = 1; i < args.length; i++) {
		// let re = new RegExp('\\\\{' + (i - 1) + '\\\\}', 'gm');
		let re = new RegExp("({)" + i + "(})", "g");
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
function hasParent(child: egret.DisplayObjectContainer) {
	return !isNull(child.parent);
}

/**数组是否为空 */
function isEmptyArray(data: any[]) {
	if (data.length > 0) {
		return false;
	}
	for (let key in data) {
		return false;
	}
	return true;
}

/**是否是空节点 */
function isEmptyObject(data: Object) {
	for (let key in data) {
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