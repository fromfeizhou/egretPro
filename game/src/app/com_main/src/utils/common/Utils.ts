class Utils {
	// /**
	//  * Http请求
	//  * @type {Http}
	//  */
	// public static get Http():Http {
	//     return Http.getInstance();
	// }

	// /**
	//  * Socket请求
	//  * @type {null}
	//  */
	// public static get Socket():Socket {
	//     return Socket.getInstance();
	// }

	// /**
	//  * 模块管理类
	//  * @type {ControllerManager}
	//  */
	// public static get ControllerManager():ControllerManager {
	//     return ControllerManager.getInstance();
	// }

	// /**
	//  * View管理类
	//  * @type {ViewManager}
	//  */
	// public static get ViewManager():ViewManager {
	//     return ViewManager.getInstance();
	// }

	// /**
	//  * 场景管理类
	//  * @type {SceneManager}
	//  */
	// public static get SceneManager():SceneManager {
	//     return SceneManager.getInstance();
	// }

	/**
	 * 调试工具
	 * @type {DebugUtils}
	 */
	public static get DebugUtils(): DebugUtils {
		return DebugUtils.getInstance();
	}

	public static GetResName(name: string, defName: string = ""): string {
		if (RES.hasRes(name))
			return name;
		return defName;
	}

	// /**
	//  * 服务器返回的消息处理中心
	//  * @type {MessageCenter}
	//  */
	// public static get MessageCenter():MessageCenter {
	//     return MessageCenter.getInstance(0);
	// }

	/**
	 * 统一的计时器和帧刷管理类
	 * @type {TimerManager}
	 */
	public static get TimerManager(): TimerManager {
		return TimerManager.getInstance();
	}

	/**
	 * 日期工具类
	 * @type {DateUtils}
	 */
	public static get DateUtils(): DateUtils {
		return DateUtils.getInstance();
	}

	/**
	 * 数学计算工具类
	 * @type {MathUtils}
	 */
	public static get MathUtils(): MathUtils {
		return MathUtils.getInstance();
	}

	/**
	 * 随机数工具类
	 * @type {RandomUtils}
	 */
	public static get RandomUtils(): RandomUtils {
		return RandomUtils.getInstance();
	}

	/**
	 * 显示对象工具类
	 * @type {DisplayUtils}
	 */
	public static get DisplayUtils(): DisplayUtils {
		return DisplayUtils.getInstance();
	}

	/*
	 * 图片合成数字工具类
	 * */
	public static get BitmapNumber(): BitmapNumber {
		return BitmapNumber.getInstance();
	}

	// /**
	//  * 引导工具类
	//  */
	// public static get GuideUtils(): GuideUtils {
	//     return GuideUtils.getInstance();
	// }

	/**
	 * Stage操作相关工具类
	 */
	public static get StageUtils(): StageUtils {
		return StageUtils.getInstance();
	}

	// /**
	//  * Effect工具类
	//  */
	// public static get EffectUtils(): EffectUtils {
	//     return EffectUtils.getInstance();
	// }

	/**
	 * 字符串工具类
	 */
	public static get StringUtils(): StringUtils {
		return StringUtils.getInstance();
	}

	/**
	 * 通过工具类
	 */
	public static get CommonUtils(): CommonUtils {
		return CommonUtils.getInstance();
	}

	// /**
	//  * 音乐管理类
	//  */
	// public static get SoundManager(): SoundManager {
	// 	return SoundManager.getInstance();
	// }

	/**
	 * 设备工具类
	 */
	public static get DeviceUtils(): DeviceUtils {
		return DeviceUtils.getInstance();
	}

	/**
	 * 引擎扩展类
	 */
	public static get EgretExpandUtils(): EgretExpandUtils {
		return EgretExpandUtils.getInstance();
	}

	// /**
	//  * 键盘操作工具类
	//  */
	// public static get KeyboardUtils(): KeyboardUtils {
	// 	return KeyboardUtils.getInstance();
	// }

	// /**
	//  * 摇杆操作工具类
	//  */
	// public static get RockerUtils(): RockerUtils {
	// 	return RockerUtils.getInstance();
	// }

	/**
	 * 震动类
	 */
	public static get ShockUtils(): ShockUtils {
		return ShockUtils.getInstance();
	}

	/**
	 * 资源加载工具类
	 */
	public static get ResourceUtils(): ResourceUtils {
		return ResourceUtils.getInstance();
	}

	/**
	 * RenderTextureManager
	 */
	public static get RenderTextureManager(): RenderTextureManager {
		return RenderTextureManager.getInstance();
	}

	/**
	 * TextFlow
	 */
	public static get TextFlowMaker(): TextFlowMaker {
		return TextFlowMaker.getInstance();
	}

	// /**
	//  * 消息通知中心
	//  */
	// private static _notificationCenter: MessageCenter;

	// public static get NotificationCenter(): MessageCenter {
	//     if (App._notificationCenter == null) {
	//         App._notificationCenter = new MessageCenter(1);
	//     }
	//     return App._notificationCenter;
	// }


	/**
	 * 分帧处理类
	 * @returns {any}
	 * @constructor
	 */
	public static get DelayOptManager(): DelayOptManager {
		return DelayOptManager.getInstance();
	}

	/**
	 * 数组工具类
	 * @returns {any}
	 * @constructor
	 */
	public static get ArrayUtils(): ArrayUtils {
		return ArrayUtils.getInstance();
	}

	// /**
	//  * 通用Loading动画
	//  * @returns {any}
	//  * @constructor
	//  */
	// public static get EasyLoading(): EasyLoading {
	//     return EasyLoading.getInstance();
	// }

	/**
	 * 单一资源通过版本号加载管理类
	 */
	public static get ResVersionManager(): ResVersionManager {
		return ResVersionManager.getInstance();
	}

	// /**
	//  * DragonBones工厂类
	//  * @returns {any}
	//  * @constructor
	//  */
	// public static get DragonBonesFactory(): DragonBonesFactory {
	//     return DragonBonesFactory.getInstance();
	// }

	// /**
	//  * StarlingSwf工厂类
	//  * @returns {StarlingSwfFactory}
	//  * @constructor
	//  */
	// public static get StarlingSwfFactory(): StarlingSwfFactory {
	//     return StarlingSwfFactory.getInstance();
	// }

	// =======================================================================================================================================
	// =======================================================================================================================================
	// =======================================================================================================================================
	// =======================================================================================================================================
	/**配最佳缩放 复杂元素
	 * 屏幕宽高比 最小缩放比 
	 * */
	public static toStageBestScale(element: egret.DisplayObject) {
		let scale = GameConfig.getBestScale();
		if (element && scale != 1) {
			element.scaleX = scale;
			element.scaleY = scale;
		}
	}

	/**配最佳缩放 动态表单常用
	 * 屏幕宽高比 最小缩放比 高度自动适配
	 * */
	public static toStageBestScaleHeigt(element: egret.DisplayObject) {
		let width = egret.MainContext.instance.stage.stageWidth - (CONTENT_WIDTH - element.width);
		let scale = width / element.width
		//设配
		if (scale < 1) {
			NodeUtils.setScale(element, scale);
			let height = egret.MainContext.instance.stage.stageHeight - (CONTENT_HEIGHT - element.height);
			element.height = Math.floor(height / scale);
		} else {
			element.width = Math.floor(width);
		}
	}

	/**最大比例缩放 背景图常用 */
	public static toStageMaxScale(element: egret.DisplayObject) {
		//高度适配 高度固定 最大宽度比
		let width = egret.MainContext.instance.stage.stageWidth;
		let scale = Math.max(1, width / CONTENT_WIDTH);
		element.scaleX = scale;
		element.scaleY = scale;
	}




	/**tile布局元素居中
	 * 默认水平布局
	 */
	public static tileGroupToCenter(group: eui.Group, itemSize: number, isHorizontal: boolean = true) {
		let tileLayout = group.layout as eui.TileLayout;
		if (!tileLayout) return;
		let totalSize;
		let gap;
		if (isHorizontal) {
			totalSize = group.width;
			gap = tileLayout.horizontalGap;
		} else {
			totalSize = group.height;
			gap = tileLayout.verticalGap;
		}
		let itemLen = Math.floor((totalSize + gap) / (itemSize + gap));
		let size = itemSize * itemLen + gap * (itemLen - 1);
		let padding = (totalSize - size) / 2;
		if (tileLayout) {
			if (isHorizontal) {
				tileLayout.paddingLeft = padding;
			} else {
				tileLayout.paddingTop = padding;
			}
		}
	}

	/**分辨率等比例缩小
	 * @param ,按照高低缩小
	 * @param 
	 */
	public static setScaleXY(container: any, height: any) {
		let scaleY = (height - GameConfig.getSub()) / height;
		container.scaleX = scaleY;
		container.scaleY = scaleY;
	}

	public static objectLenght(elem: Object): number {
		//zb
		// if(!elem)
		// {
		// 	return;
		// }
		var keys: any[] = Object.keys(elem);
		return keys.length;
	}

	public static number2int(num: number): any {
		return parseInt(Utils.number2str(num));
	}

	public static number2str(num: number): string {
		return <string><any>num;
	}

	public static getAppSkin(skinName) {
		return Utils.getSkinName('app/' + skinName);
	}

	public static getComSkin(skinName) {
		return Utils.getSkinName('components/' + skinName);
	}

	public static getSkinName(skinName) {
		return "resource/skins/" + skinName;
	}

	public static setAnchorCenter(component: egret.DisplayObject) {
		component.anchorOffsetX = component.width / 2;
		component.anchorOffsetY = component.height / 2;
	}

	/**
	 * 拷贝一个字典
	 */
	public static copyDict(dict, isDeepCopy?) {
		if (!dict) {
			return dict;
		}
		var newDict = (dict instanceof Array) ? [] : {};
		for (var i in dict) {
			if (typeof dict[i] == "function") {
				continue;
			}
			// newDict[i] = dict[i];
			if (isDeepCopy) {
				newDict[i] = (typeof dict[i] == "object") ? Utils.copyDict(dict[i]) : dict[i];
			} else {
				newDict[i] = dict[i];
			}
		}
		return newDict;
	}

	/**
	 * 将所有views整体居中
	 * @param views
	 * @param span
	 * @param y
	 */
	public static setViewCenter(views, span = 0, isAnchorCenter = false, y = -10000) {
		var view_num = views.length;
		var parent_view = views[0].parent;

		var view_all_width = 0;
		for (var i = 0; i < view_num; i++) {
			var view = views[i];
			view_all_width += view.width;
			if (isAnchorCenter) {
				view.anchorOffsetX = view.width / 2;
				view.anchorOffsetY = view.height / 2;
			}
		}
		view_all_width = view_all_width + (view_num - 1) * span;

		var offect_x = isAnchorCenter ? views[0].width / 2 : 0;
		var start_x = (parent_view.width - view_all_width) / 2 + offect_x;
		for (var i = 0; i < view_num; i++) {
			var view = views[i];
			view.x = start_x;
			if (y != -10000) {
				view.y = y;
			}
			start_x += view.width + span;
		}
	}

	public static setViewLink(views, span = 0, start_x = -10000) {
		var view_num = views.length;
		if (view_num < 2) return;
		var base_view = views[0];
		var base_x = start_x != -10000 ? start_x : base_view.x;
		var view_num = views.length;
		for (var i = 0; i < view_num; i++) {
			var view = views[i];
			view.x = base_x;
			base_x += view.width + span;
		}
	}

	/**
	 * 替换第一个匹配到的字符串
	 * str 原字符串
	 * search_str 需要查找的字符串
	 * replace_str 需要替换的字符串
	 */
	public static replace_first_str(str: string, search_str: string, replace_str: string): string {

		var index = str.indexOf(search_str);
		if (index != -1)
			str = str.substring(0, index) + replace_str + str.substring(index + 3, str.length);

		return str;
	}

	public static formatstr(source: string, search: string, ...params: string[]) {
		/**替换占位符*/
		if (params) {
			let len = params.length;
			for (let i = 0; i < len; i++) {
				source = Utils.replace_first_str(source, search, params[i]);
			}
			// debug('Utils:format--->> source:', source);
		}
		return source;
	}

	public static formatstr_(source: string, search: string, params: string[]) {
		/**替换占位符*/
		if (params) {
			let len = params.length;
			for (let i = 0; i < len; i++) {
				source = Utils.replace_first_str(source, search, params[i]);
			}
		}
		return source;
	}

	public static isNullOrEmpty(str: string): boolean {
		if (str == null || str.length == 0)
			return true;
		return false;
	}

	// public static formatstr_1(source: string, search: string, ...params: string[]) {
	// 	/**替换占位符,针对除了<...={x}>的*/
	// 	if (params) {
	// 		let len = params.length;
	// 		let index = 0;
	// 		for (let i = 0; i < len; i++) {
	// 			index = source.indexOf(search, index);
	// 			if (index == -1) {
	// 				break;
	// 			} else if (source[index - 1] != "=" && source[index + 1] != ">") {
	// 				source = source.substring(0, index) + params[i] + source.substring(index + 3, source.length);
	// 			} else {
	// 				index = index + 3;
	// 				i--;
	// 			}
	// 		}
	// 	}
	// 	return source;
	// }

	public static clone(source: any): any {
		function copy(target: any) {
			let data = {};
			for (let key in target) {
				if (typeof target[key] == "object") {
					data[key] = copy(target[key]);
				} else {
					data[key] = target[key];
				}
			}
			return data;
		}
		let cloneObj = copy(source);
		return cloneObj;
	}

	/**
	 * ===================================================================================================================================
	 * 涉及频繁在Stage添加移除对象并且不关心ADDEDTOSTAGE与REMOVEDFROMSTAGE事件时，可以进行addChild和removeChild优化，减少逻辑判定。
	 */

	/**
	 * addChild 的高效实现，慎用 
	 * @param container
	 * @param child
	 */
	public static addChild(container: egret.DisplayObjectContainer, child: egret.DisplayObject): void {

		container.addChild(child);

		// if (child.$parent != container) {
		// 	if (child.$parent)
		// 		Utils.removeFromParent(child);
		// 	container.$children.push(child);
		// 	child.$setParent(container);

		// 	var stage = container.$stage;
		// 	if (stage) {
		// 		child.$onAddToStage(stage, container.$nestLevel + 1);
		// 	}

		// 	var displayList = container.$displayList || container.$parentDisplayList;
		// 	Utils.assignParentDisplayList(child, displayList, displayList);
		// 	child.$propagateFlagsDown(1648 /* DownOnAddedOrRemoved */);
		// 	container.$propagateFlagsUp(4 /* InvalidBounds */);
		// 	container.$childAdded(child, container.$children.length);
		// }
	}

	/**
	 * addChildAt 的高效实现，慎用
	 * @param container
	 * @param child
	 * @param index
	 */
	public static addChildAt(container: egret.DisplayObjectContainer, child: egret.DisplayObject, index: number): void {
		container.addChildAt(child, index);
		// if (child.$parent != container) {
		// 	if (child.$parent)
		// 		Utils.removeFromParent(child);
		// 	container.$children.splice(index, 0, child);
		// 	child.$setParent(container);

		// 	var stage = container.$stage;
		// 	if (stage) {
		// 		child.$onAddToStage(stage, container.$nestLevel + 1);
		// 	}

		// 	var displayList = container.$displayList || container.$parentDisplayList;
		// 	Utils.assignParentDisplayList(child, displayList, displayList);
		// 	child.$propagateFlagsDown(1648 /* DownOnAddedOrRemoved */);
		// 	container.$propagateFlagsUp(4 /* InvalidBounds */);
		// 	container.$childAdded(child, container.$children.length);
		// }
	}

	public static assignParentDisplayList(child: egret.DisplayObject, parentCache: any, newParent: any) {
		child.$parentDisplayList = newParent;
		// child.$setFlags(512 /* DirtyChildren */);
		var displayList = child.$displayList;
		if ((child.$renderNode || displayList) && parentCache) {
			parentCache.markDirty(displayList || child);
		}
		if (displayList) {
			return;
		}
		var children = child.$children;
		if (children) {
			for (var i = children.length - 1; i >= 0; i--) {
				Utils.assignParentDisplayList(children[i], parentCache, newParent);
			}
		}
	}

	/**
	 * removeFromParent 的高效实现，慎用
	 * @param child
	 */
	public static removeFromParent(child: egret.DisplayObject): void {
		if (child && child.parent) {
			child.parent.removeChild(child);
		}
		// if (child && child.$parent) {
		// var index = child.parent.$children.indexOf(child);
		// child.$parent.$children.splice(index, 1);
		// child.$setParent(null);
		// }
	}

	/**
	 * removeChildAt 的高效实现，慎用
	 * @param container
	 * @param index
	 */
	public static removeChildAt(container: egret.DisplayObjectContainer, index: number): void {
		container.removeChildAt(index);
		// var child: egret.DisplayObject = container.$children[index];
		// if (child) {
		// 	container.$children.splice(index, 1);
		// 	child.$setParent(null);
		// 	child.$setVisible(false);

		// 	var displayList = container.$displayList || container.$parentDisplayList;
		// 	Utils.assignParentDisplayList(child, displayList, null);
		// 	child.$propagateFlagsDown(1648 /* DownOnAddedOrRemoved */);
		// 	container.$propagateFlagsUp(4 /* InvalidBounds */);
		// }
	}

	/**
	 * removeAllChild 的高效实现，慎用
	 * @param container
	 */
	public static removeAllChild(container: egret.DisplayObjectContainer): void {
		while (container.$children.length) {
			Utils.removeChildAt(container, 0);
		}
	}

	/**解析html标签 */
	public static htmlParser(text: string) {
		return new egret.HtmlTextParser().parser(text);
	}

	/**
	 * 设置富文本label
	 */
	public static setRichLabel(label: eui.Label, text: string) {
		text = Utils.parseLanRich(text);
		text = Utils.parseClickRich(text);
		text = text.replace(/<br>/ig, "\n");
		if (label) label.textFlow = Utils.htmlParser(text);
	}

	/**
	  * 解析带有颜色标签的text
	  */
	public static parseLanRich(str) {
		var patt1 = new RegExp("(.*)<color=(.*?)>(.*?)<\/color>(.*)");
		var dstText = "";
		var result = null;
		do {
			result = patt1.exec(str);
			if (result) {
				var color = RegExp.$2;
				if (color.indexOf("#") == -1) {
					color = "#" + color.substr(0, 6);
				} else {
					color = color.substr(0, 7);
				}
				var newStr = RegExp.$1 + "<font color='" + color + "'>" + RegExp.$3 + "</font>" + RegExp.$4;
				str = newStr;
			}
		} while (result != null);

		return str;
	}

	/**
	  * 解析Lan标签
	  */
	public static parseLan(str) {
		var patt1 = new RegExp("(.*)<lan=(.*?)>(.*)");
		var dstText = "";
		var result = null;
		do {
			result = patt1.exec(str);
			if (result) {
				var code = RegExp.$2;

				var newStr = RegExp.$1 + this.parseLanParam(code) + RegExp.$3;
				str = newStr;
			}
		} while (result != null);

		return str;
	}

	/**解析Lan标签参数 */
	public static parseLanParam(param: string): string {
		let arr = param.split('_');
		let str = '';
		if (arr.length > 1) {
			let type = parseInt(arr[0]);
			let val = arr[1];
			let code = '';

			switch (type) {
				case LanParamType.Default: {//默认读取语言包
					code = val;
					break;
				}
				case LanParamType.Country: {//国家id
					// let cfg = C.CountryConfig[val];
					// if (cfg) {
					// 	code = cfg.name;
					// }
					return this.getCountryName(Number(val));
				}
				case LanParamType.Prop: {//道具ID
					let cfg = C.ItemConfig[val];
					if (cfg) {
						code = cfg.name;
					}
					break;
				}
				case LanParamType.General: {//武将ID
					let cfg = C.GeneralConfig[val];
					if (cfg) {
						code = cfg.name;
					}
					break;
				}
				case LanParamType.CityBuild: {//世界地图建筑id
					let cfg = C.WorldMapConfig[val];
					if (cfg) {
						code = cfg.name;
					}
					break;
				}
				// case LanParamType.Tactics: {//读取战法
				// 	let cfg = C.SpellConfig[val];
				// 	if (cfg) {
				// 		code = cfg.name;
				// 	}
				// 	break;
				// }
				default: {
					error('Lan标签参数错误:', param);
					return '';
				}
			}

			str = GLan(code);
		} else {
			error('Lan标签参数错误:', param);
		}

		return str;
	}

	/**
	   * 解析带有事件点击标签的text
	   */
	public static parseClickRich(str) {
		var patt1 = new RegExp("(.*)<clk=(.*?)>(.*?)<\/clk>(.*)");
		var dstText = "";
		var result = null;
		do {
			result = patt1.exec(str);
			if (result) {
				var event = RegExp.$2;
				var newStr = RegExp.$1 + "<u><a href='event:" + event + "'>" + RegExp.$3 + "</a></u>" + RegExp.$4;
				str = newStr;
			}
		} while (result != null);

		return str;
	}

	/**
	   * 把自身对象和孩子的tween移除
	   */
	public static removeAllTween(view: any, isRoot: boolean = false) {
		egret.Tween.removeTweens(view);
		for (var i = 0; i < view.numChildren; i++) {
			var ch = view.getChildAt(i);
			egret.Tween.removeTweens(ch);
			if (ch instanceof egret.DisplayObjectContainer) {
				this.removeAllTween(ch);
			}
		}
	}


	/**
	 * 获取app目录下的exml地址
	 */
	public static getAppExml(dir: string, fileName: string) {
		return "resource/skins/app/" + dir + "/" + fileName;
	}

	/**快速打开面板 */
	public static open_view(name: any, body?: any, type?: string) {
		// debug("Utils:open_view--->>", name);
		let view: com_main.GuideTouchTips = SceneManager.getClass(LayerEnums.TOP, com_main.GuideTouchTips.NAME);
		if (view) view.closeView();
		AGame.R.notifyView(name, body, type);
	}

	/**是否变灰 */
	public static isGray(flag: boolean, bitmap: egret.DisplayObject) {
		if (bitmap) {
			//颜色矩阵数组
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			bitmap.filters = flag ? [colorFlilter] : [];
		}
	}

	public static isBlack(flag: boolean, bitmap: egret.DisplayObject) {
		if (bitmap) {
			//颜色矩阵数组
			var colorMatrix = [
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			bitmap.filters = flag ? [colorFlilter] : [];
		}
	}

	/**是否发光 */
	public static isGlow(flag: boolean, bitmap: egret.DisplayObject, color: number = 0xFFD000, value: number = 1) {
		if (bitmap) {
			// var color: number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
			var alpha: number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
			var blurX: number = 30 * value;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
			var blurY: number = 30 * value;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
			var strength: number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
			var quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
			var inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
			var knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
			var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
				strength, quality, inner, knockout);
			bitmap.filters = flag ? [glowFilter] : [];
		}
	}

	/**是否变亮 */
	public static isHighlight(flag: boolean, bitmap: egret.DisplayObject) {
		if (bitmap) {
			//颜色矩阵数组
			var colorMatrix = [
				1, 0, 0, 0, 100,
				0, 1, 0, 0, 100,
				0, 0, 1, 0, 100,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			bitmap.filters = flag ? [colorFlilter] : [];
		}
	}

	/**是否变亮 */
	public static isLowlight(flag: boolean, bitmap: egret.DisplayObject) {
		if (bitmap) {
			//颜色矩阵数组
			var colorMatrix = [
				0.7, 0, 0, 0, 0,
				0, 0.7, 0, 0, 0,
				0, 0, 0.7, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			bitmap.filters = flag ? [colorFlilter] : [];
		}
	}

	/**亮度调节  */
	public static setLight(light: number, bitmap: egret.DisplayObject) {
		if (bitmap) {
			//颜色矩阵数组
			var colorMatrix = [
				1 * light, 0, 0, 0, 0,
				0, 1 * light, 0, 0, 0,
				0, 0, 1 * light, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			bitmap.filters = [colorFlilter];
		}
	}



	/**
	 * 根据城池ID获取城池名字图片的资源名
	 */
	public static getBuildNameSource(buildId: number): string {
		return 'font_build_' + buildId + '_png';
	}

	/**
	 * 根据城池规模获取城池图片的资源名
	 */
	public static getBuildTypeSource(type: number): string {
		return 'map_build_' + type + '_png';
	}

	/**
	 * 根据城池地形获取地形背景图片的资源名
	 */
	public static getBuildTerrainSource(terrain: number): string {
		return 'map_build_bg_json.map_build_bg_' + terrain;
	}

	/**
	 * 根据资源名设置图片
	 */
	public static setImageFromSource(obj: com_main.CImage, source: string) {
		if (source && source != "") {
			let texture: egret.Texture = RES.getRes(source);
			if (texture) {
				obj.source = texture;
				obj.width = texture.textureWidth;
				obj.height = texture.textureHeight;
			}
		}
	}

	/**获取 */
	public static getPopTitleIcon(type: number) {
		let tempId = 1;
		switch (type) {
			case PopTitleIconType.TREASRE_UP:
			case PopTitleIconType.UPGRADE: {
				tempId = 1;
				break;
			}
			case PopTitleIconType.BUBINGYING:
			case PopTitleIconType.QIBINGYING:
			case PopTitleIconType.GONGBINGYING: {
				tempId = 17;
				break;
			}
			case PopTitleIconType.TREASRE_COM: {//合成
				tempId = 15;
				break;
			}
			case PopTitleIconType.TAVERN: {//酒馆
				tempId = 3;
				break;
			}
			case PopTitleIconType.MILITARY_TASK: {//聚宝盆
				tempId = 13;
				break;
			}
			default: {
				tempId = 2;
			}
		}

		let img_url = "rk_icon_" + tempId + "_png";
		var texture = RES.getRes(img_url);
		// if(texture== null||texture == undefined ){
		// 	img_url = "rk_icon_1_png";
		// 	texture = RES.getRes(img_url);
		// }
		return texture;
	}


	// /**获取玩家出生点旗帜 effectid */
	// public static getPlayerFlagEffectId(country: CountryType, faction: FactionType) {
	// 	let owncountry: CountryType = RoleData.countryId;
	// 	let ownfaction: FactionType = BattleModel.getOwnFaction();
	// 	let battleinfo: BattleInfoVo = BattleModel.getBattleInfo();

	// 	let effect_red: number = 11; //红
	// 	let effect_blue: number = 13; //蓝
	// 	let effect_greed: number = 12; //绿

	// 	let effectid: number;
	// 	if (country != undefined) {
	// 		effectid = country == owncountry ? effect_blue : effect_red
	// 	} else if (faction != undefined) {
	// 		effectid = faction == ownfaction ? effect_blue : effect_red
	// 	}
	// 	debug("Utils:getPlayerFlagEffectId--->>effectid:", effectid);
	// 	return effectid;
	// }

	/**
	 * 获取方阵旗帜 effectid
	 * 1 : 红,敌方 
	 * 2 : 绿,友方
	 * 3 : 蓝,己方
	 */
	//zb
	// public static getUnitFlagEffectId(faction: FactionType, playerId: Long) {
	// public static getUnitFlagEffectId(faction: FactionType, playerId: number) {
	// 	let ownfaction = BattleModel.getOwnFaction();
	// 	if (ownfaction == faction) {
	// 		//zb
	// 		// if (RoleData.playerId.eq(playerId))
	// 		if (RoleData.playerId == (playerId))
	// 			return 3;
	// 		else
	// 			return 2;
	// 	} else {
	// 		return 1;
	// 	}
	// }

	/**获取数组里的随机值 */
	public static getRandomObject(list: any[]) {
		if (list && list.length > 0) {
			let random = Math.floor(Math.random() * list.length);
			let obj = list[random];

			return obj;
		} else {
			return null;
		}
	}

	/**
	 * 构建格子的坐标key值
	 * @param x
	 * @param y
	 * @return
	 */
	public static buildCellkey(x: number, y: number): string {
		return x + "_" + y;
	}

	// private static m_pGlobalPoint: egret.Point = egret.Point.create(0, 0);
	// public static isInStage(obj: egret.DisplayObjectContainer) {
	// 	this.m_pGlobalPoint.x = 0;
	// 	this.m_pGlobalPoint.y = 0;
	// 	if (obj.parent) {
	// 		this.m_pGlobalPoint = obj.parent.localToGlobal(obj.x, obj.y, this.m_pGlobalPoint);
	// 	}
	// 	// if (obj instanceof com_main.CSquare) {
	// 	// 	debug(format("Utils:isInStage--->>舞台坐标uid:{1} x y:{2}_{3}", obj.getId(), this.m_pGlobalPoint.x, this.m_pGlobalPoint.y));
	// 	// }
	// 	let stagerect: egret.Rectangle = Utils.StageUtils.getStageRect();
	// 	return stagerect.contains(this.m_pGlobalPoint.x, this.m_pGlobalPoint.y)
	// }

	/**
	 * 根据国家ID获取国家旗帜图片
	 */
	public static getCountyFlagById(countyId: number): string {
		// 国家标识图片
		switch (countyId) {
			case CountryType.WEI:
				return "login_country_1_png";
			case CountryType.SHU:
				return "login_country_2_png";
			case CountryType.WU:
				return "login_country_3_png";
			default:
				return "";
		}
	}
	/**根据国家id得到国家 */
	public static getCountyPSourceById(countyId: number, type): string {
		// 国家标识图片
		switch (countyId) {
			case CountryType.WEI:
				let cityWEISource: string = ""
				if (type == CityLevel.CAPITAL) {
					cityWEISource = "dt_data_blue_png"
				} else if (type == CityLevel.TOWN) {
					cityWEISource = "dt_xiaota_blue_png"
				} else if (type == CityLevel.COUNTY) {
					cityWEISource = "dt_dian_blue_png"
				}
				return cityWEISource;
			case CountryType.SHU:
				let citySHUSource: string = ""
				if (type == CityLevel.CAPITAL) {
					citySHUSource = "dt_data_green_png"
				} else if (type == CityLevel.TOWN) {
					citySHUSource = "dt_xiaota_green_png"
				} else if (type == CityLevel.COUNTY) {
					citySHUSource = "dt_dian_green_png"
				}
				return citySHUSource;
			case CountryType.WU:
				let cityWUSource: string = ""
				if (type == CityLevel.CAPITAL) {
					cityWUSource = "dt_data_red_png"
				} else if (type == CityLevel.TOWN) {
					cityWUSource = "dt_xiaota_red_png"
				} else if (type == CityLevel.COUNTY) {
					cityWUSource = "dt_dian_red_png"
				}
				return cityWUSource;
			default:
				let cityZLSource: string = ""
				if (type == CityLevel.CAPITAL) {
					cityZLSource = "dt_data_gray_png"
				} else if (type == CityLevel.TOWN) {
					cityZLSource = "dt_xiaota_gray_png"
				} else if (type == CityLevel.COUNTY) {
					cityZLSource = "dt_dian_gray_png"
				}
				return cityZLSource;
		}
	}
	/**获取国家名称 */
	public static getCountryName(countryId: CountryType, defStr: string = '') {
		switch (countryId) {
			case CountryType.WEI:
				return GCode(CLEnum.STATE_WEI);
			case CountryType.SHU:
				return GCode(CLEnum.STATE_SHU);
			case CountryType.WU:
				return GCode(CLEnum.STATE_WU);
			case CountryType.QUN:
				return GCode(CLEnum.STATE_QUN);
			case CountryType.HUANG:
				return GCode(CLEnum.STATE_HUANGJIN);
			default:
				if (defStr != '') return defStr;
				return GCode(CLEnum.STATE_YE);
		}
	}
	/**获取兵种名字 */
	public static getSoilderTypeName(type: SoldierMainType) {
		let str: string = ""
		switch (type) {
			case SoldierMainType.FOOTSOLDIER: {
				str = GCode(CLEnum.GEN_TAB_BB)
				break;
			}
			case SoldierMainType.RIDESOLDIER: {
				str = GCode(CLEnum.GEN_TAB_QB)
				break;
			}
			case SoldierMainType.ARROWSOLDIER: {
				str = GCode(CLEnum.GEN_TAB_GB)
				break;
			}
			case SoldierMainType.PIKEMAN: {
				str = GCode(CLEnum.GEN_TAB_QB1)
				break;
			}
		}
		return str;
	}
	/**获取国家名称颜色 */
	public static getCountryColor(countryId: CountryType) {
		switch (countryId) {
			case CountryType.WEI:
				return 0x44d0f3;
			case CountryType.SHU:
				return 0x70f145;
			case CountryType.WU:
				return 0xff3f3f;
			default:
				return 0xe9e9e6;
		}
	}

	/**获取国家名称颜色1 */
	public static getCountryColor1(countryId: CountryType) {
		switch (countryId) {
			case CountryType.WEI:
				return '#44d0f3';
			case CountryType.SHU:
				return '#70f145';
			case CountryType.WU:
				return '#ff3f3f';
			default:
				return '#e9e9e6';
		}
	}


	/**获取小图背景 */
	public static getCountyMiniFlagById(countyId: number): string {
		switch (countyId) {
			case CountryType.WEI:
				return "common_country2_1_png";
			case CountryType.SHU:
				return "common_country2_2_png";
			case CountryType.WU:
				return "common_country2_3_png";
			default:
				return "common_country2_4_png";
		}
	}
	/**获取大图背景 */
	public static getCountyBigiFlagById(countyId: number): string {
		switch (countyId) {
			case CountryType.WEI:
				return "common_country5_1_png";
			case CountryType.SHU:
				return "common_country5_2_png";
			case CountryType.WU:
				return "common_country5_3_png";
			default:
				return "common_country5_4_png";
		}
	}

	/**
	 * 根据道具ID获取道具的名称
	 */
	public static getItemName(itemId: number): string {
		let itemCfg = C.ItemConfig[itemId];
		if (itemCfg) {
			let nameId = itemCfg.name;
			return GLan(nameId);
			//return nameId;
		}
		return "";
	}

	/**
	 * 构造一个消耗配置数据
	 */
	public static makeComsume(idValue: number, countValue: number): IItemInfo {
		return IItemInfoPool.create(idValue, countValue);
	}

	/**获得掉落表奖励结构 */
	public static parseCommonItemJsonInDrop(dropJson: any, isMerge: boolean = false): Array<IItemInfo> {
		let itemList: Array<IItemInfo> = [];

		let tmpList: any[] = JSON.parse(dropJson);
		for (let i = 0; i < tmpList.length; i++) {
			if (C.DropConfigDic.hasOwnProperty(tmpList[i])) {
				let dropCfgs = C.DropConfigDic[tmpList[i]];
				for (let key in dropCfgs) {
					let dropCfg: DropConfig = dropCfgs[key];
					if (dropCfg != null && dropCfg != undefined) {
						itemList = itemList.concat(this.parseCommonItemJson(dropCfg.rewards));
					}
				}
			}
		}
		//自动合并(概率掉落显示  无数量)
		if (isMerge) {
			let res = [];
			for (let i = 0; i < itemList.length; i++) {
				if (res.indexOf(itemList[i].itemId) == -1) {
					res.push(itemList[i].itemId);
				}
			}
			itemList = [];
			while (itemList.length > 0) {
				IItemInfoPool.release(itemList.pop());
			}
			for (let i = 0; i < res.length; i++) {
				itemList.push(IItemInfoPool.create(res[i], 0));
			}
		}
		return itemList;
	}

	/**
	 * 解释奖励配置，以数组的形式返回
	 * @param itemString 1_100,2_100
	 * @return 返回对象数组，每个对象的数据为 { type: xxx, itemId: yyy, count: zzz }
	 */
	public static parseCommonItemJson(itemString: string): Array<IItemInfo> {
		let itemList: Array<IItemInfo> = [];
		if (itemString && itemString != "") {
			let tmpList = StringUtils.keyValsToNumberArray(itemString);
			for (let i = 0; i < tmpList.length; i++) {
				let data = tmpList[i];
				let reward = Utils.makeComsume(data.key, data.value);
				itemList.push(reward);
			}
		}

		return itemList;
	}

	/**
	 * 解释服务器奖励配置，以数组的形式返回
	 */
	public static parseCommonItemServ(list: gameProto.ITuple[]): Array<IItemInfo> {
		let itemList: Array<IItemInfo> = [];
		for (let i = 0; i < list.length; i++) {
			itemList.push(Utils.makeComsume(list[i].key, list[i].value));
		}
		return itemList;
	}
	/**解析单个物品 */
	public static parseCommonItemServSingle(data: gameProto.ITuple): IItemInfo {
		return Utils.makeComsume(data.key, data.value)
	}


	/**
	 * 获取奖励描述字符串
	 * @param @param itemJson json字符串 格式形如：[[1(对应type),2(对应itemId),3(对应数量count)]，[...]]
	 * @param isConsume 是否是消耗，如果是消耗，返回的数量前面会有一个负号，否则是加号
	 * @return 返回字符串数组，元素字符串为: 物品名称 +/-数字
	 */
	public static getRewardDesc(itemJson: any, isConsume: boolean): string[] {
		let data: any = Utils.parseCommonItemJson(itemJson);
		let desc: string[] = Utils.converReward2String(data, isConsume);
		return desc;
	}

	/**
	 * 把奖励数据转换成字符描述
	 * @param data 应该是 parseCommonItemJson 返回的数据或相同的结构类型
	 * @return 返回字符串数组，元素字符串为: 物品名称 +/-数字
	 */
	public static converReward2String(data: any[], isConsume: boolean): string[] {
		let desc: string[] = [];
		for (let i = 0; i < data.length; i++) {
			let reward = data[i];
			let symbol: string = isConsume ? "-" : "+";
			let cfg = C.ItemConfig[reward.itemId];
			let itemName = "itemID ";
			if (cfg) {
				itemName = GLan(cfg.name);
			}
			desc.push(itemName + " " + symbol + reward.count);
		}
		return desc;
	}

	/**
	* 随机
	* @param min
	* @param max
	* @returns {any}
	*/
	public static random(min, max) {
		var rand = Math.floor(Math.random() * (max - min + 1)) + min;
		return rand;
	}

	/**去除所有空格 */
	public static trim(str: string): string {
		var result;
		result = str.replace(/(^\s+)|(\s+$)/g, "");
		result = result.replace(/\s/g, "");
		return result;
	}

	/**    
      * 过滤特殊字符
      **/
	public static filterStr(str: string): string {
		var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；�：”“'。，、？%+]");
		var specialStr = "";
		for (var i = 0; i < str.length; i++) {
			specialStr += str.substr(i, 1).replace(pattern, '');
		}
		return specialStr;
	}
	/**
	 * 输入的是否emoji表情
	 */
	public static isEmojiCharacter(substring: string) {
		if (substring) {
			for (var i = 0; i < substring.length; i++) {
				var hs = substring.charCodeAt(i);
				if (0xd800 <= hs && hs <= 0xdbff) {
					if (substring.length > 1) {
						var ls = substring.charCodeAt(i + 1);
						var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
						if (0x1d000 <= uc && uc <= 0x1f77f) {
							return true;
						}
					}
				} else if (substring.length > 1) {
					var ls = substring.charCodeAt(i + 1);
					if (ls == 0x20e3) {
						return true;
					}
				} else {
					if (0x2100 <= hs && hs <= 0x27ff) {
						return true;
					} else if (0x2B05 <= hs && hs <= 0x2b07) {
						return true;
					} else if (0x2934 <= hs && hs <= 0x2935) {
						return true;
					} else if (0x3297 <= hs && hs <= 0x3299) {
						return true;
					} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
						|| hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
						|| hs == 0x2b50) {
						return true;
					}
				}
			}
		}
		return false;
	};

	/**设置道具的等级 */
	public static setPropLabLv(id: number, target: eui.Label) {
		let cfg = PropModel.getCfg(id);
		if (cfg) {
			target.text = GCodeFromat(CLEnum.LEVEL1, cfg.level);
			this.setLabColorByQuality(target, cfg.quality);
		}
	}

	/**设置道具名字 */
	public static setPropLabName(id: number, target: eui.Label) {
		let cfg = PropModel.getCfg(id);
		if (cfg) {
			target.text = GLan(cfg.name);
			this.setLabColorByQuality(target, cfg.quality);
		}
	}

	/**获得道具名字 */
	public static getPropName(id: number) {
		let cfg = PropModel.getCfg(id);
		if (cfg) {
			return GLan(cfg.name);
		}
		return "";
	}

	/**设置品质文本 */
	public static setLabColorByQuality(target: eui.Label, quality: number) {
		target.textColor = this.getColorOfQuality(quality);
	}


	/**获取寺庙图片路径 */
	public static getTempleItemTexture(maintype: number): egret.Texture {
		let url = 'temple_item' + maintype + '_png';
		let texture = RES.getRes(url);
		if (texture) {
			return texture;
		} else {
			return RES.getRes('temple_item1_png');
		}
	}





	// /**获取世界事件图片路径 */
	// public static getWorldEventIconName(type: WorldEvent): string {
	// 	return 'map_main_build' + type + '_png';
	// }

	// /**获取世界事件图片纹理 */
	// public static getWorldEventIconTexture(type: WorldEvent): egret.Texture {
	// 	let url = this.getWorldEventIconName(type);
	// 	let texture = RES.getRes(url);
	// 	return texture;
	// }

	/**获取主城建筑图片名 */
	public static getMainBuildName(type: BuildingType): string {
		let url = type + '';
		return 'map_main_build' + url + '_png';
	}
	/**获取主城建筑图片纹理 */
	public static getMainBuildTexture(type: BuildingType): egret.Texture {
		let url = this.getMainBuildName(type);
		let texture = RES.getRes(url);
		return texture;
	}

	/**获取主城建筑图片名 */
	public static getOtherBuildName(type): string {
		let url = type + '';
		return 'map_build_mask_' + url + '_png';
	}
	/**获取其他建筑图片纹理 */
	public static getOtherBuildTexture(type): egret.Texture {
		let url = this.getOtherBuildName(type);
		let texture = RES.getRes(url);
		return texture;
	}

	/**获取主城建筑面板标题文字 */
	public static getMainBuildTitle(type: BuildingType): string {
		let url = type + '';
		return '';
	}

	/**是否是武将 */
	public static isGeneral(type: UnitType) {
		return type == UnitType.GENERAL;
	}

	/**是否是武将或小兵 */
	public static isGeneralOrSoldier(type: UnitType) {
		return (type == UnitType.GENERAL || type == UnitType.SOLDIER);
	}

	/**是否是武将对象 */
	public static isGeneralObj(obj: any) {
		return obj instanceof com_main.CSquare;
	}

	/**是否是建筑 */
	public static isBuild(type: UnitType) {
		return (type == UnitType.BUILDING_WALL || type == UnitType.BUILDING_BARTIZAN);
	}

	// /**是否是建筑 */
	// public static isBuildObj(obj: any) {
	// 	return (obj instanceof com_main.BBuild
	// 		|| obj instanceof com_main.BBuildPart);
	// }

	// public static isPlayerFlagObj(obj: any) {
	// 	return (obj instanceof com_main.PlayerFlag
	// 		|| obj instanceof com_main.PlayerNPC);
	// }

	/**获得玩家头像 */
	public static getPlayerHeadSource(type: number, url: string) {
		let source = '';
		switch (type) {
			case 0: {	//角色id
				source = this.getPlayerHeadImg(Number(url))
				break;
			}
			case 1: {	//武将id
				let cfg = C.GeneralConfig[Number(url)];
				source = GeneralModel.getSoldierLogo(cfg.role);
				break;
			}
			case 2: {	//http 地址
				break;
			}
		}
		return source;
	}

	/**获得玩家头像 */
	public static getPlayerBigHeadSource(type: number, url: string) {
		let source = '';
		switch (type) {
			case 0: {	//角色id
				source = this.getPalyerBodyImg(Number(url))
				break;
			}
			case 1: {	//武将id
				let cfg = C.GeneralConfig[Number(url)];
				source = GeneralModel.getSoldierBigLogo(cfg.role);
				break;
			}
			case 2: {	//http 地址
				break;
			}
		}
		return source;
	}

	/**获取玩家头像 */
	public static getPlayerHeadImg(headId: number) {
		return "role_" + headId + "_png";
	}

	/**获取玩家的半身像 */
	public static getPalyerBodyImg(headId: number) {
		return "roleBig_" + headId + "_png";

	}


	/**
	 * 从语言表中设置内容
	 */
	public static setTextByLanguageKey(key: any, target: eui.Label, defaultDesc: string = "") {
		let desc = GLan(key);
		//let desc = key;
		if (desc && desc != "") {
			target.text = desc;
		} else {
			target.text = defaultDesc;
		}
	}

	/**
	 * 战斗单位图层排序
	 */
	public static sortChildrens(obj: egret.DisplayObjectContainer): void {
		function sortY(d1: egret.DisplayObject, d2: egret.DisplayObject): number {
			let dy1 = d1.y;
			let dy2 = d2.y;
			// let dy1 = 0;
			// let dy2 = 0;
			// if (d1 instanceof com_main.CSquare) {
			// 	dy1 = Math.floor( d1.y - d1.maxHeight / 2 + 200);
			// 	// } else if (Utils.isPlayerFlagObj(d1)) {
			// 	// 	dy1 = d1.y + MapConfig.halfTileHeight;
			// } else {
			// 	dy1 = Math.floor(d1.y);
			// 	// dy1 = d1.y - d1.height / 2;
			// }
			// if (d2 instanceof com_main.CSquare) {
			// 	dy2 = Math.floor(d2.y - d2.maxHeight / 2 + 200);
			// 	// } else if (Utils.isPlayerFlagObj(d2)) {
			// 	// 	dy2 = d2.y + MapConfig.halfTileHeight;
			// } else {
			// 	dy2 = Math.floor(d2.y);
			// 	debugBatt("对象不是 CSquare")
			// 	// dy2 = d2.y - d2.height / 2;
			// }
			if (dy1 > dy2) {
				return 1;
			} else if (dy1 < dy2) {
				return -1;
			} else {
				return 0;
			}
		}
		obj.$children.sort(sortY);
	}

	/**json解释器包装 */
	public static JsonParseWrap(jsonStr: string): any {
		if (jsonStr == "") {
			return null;
		}
		return JSON.parse(jsonStr);
	}

	/**
	 * 获取官职名
	 */
	public static getGovernmentPosName(posId: number) {
		let cfg = C.JobConfig[posId];
		if (cfg) {
			//玩家官职
			return GLan(cfg.name);
		}
		return "";
	}

	/**取反阵营 */
	public static getContraryFactionType(faction: FactionType) {
		let contrary: FactionType;
		if (faction == FactionType.ATK) {
			contrary = FactionType.DEF;
		} else if (faction == FactionType.DEF) {
			contrary = FactionType.ATK;
		}
		return contrary;
	}

	/**取得城池当前血量的模拟百分比 */
	// public static getVirtualBlood(x) {/** x:当前血除以总血 */
	// 	// let temp = this.currentHp / this.maxHp;
	// 	if (x == 0) {
	// 		return 0;
	// 	}
	// 	let sum = 0;
	// 	let i;
	// 	for (i = C.CityBloodConfig.length - 1; i >= 1; i--) {
	// 		let config = C.CityBloodConfig[i];
	// 		if (x <= config.level_end) {
	// 			if (x <= config.level_start) {
	// 				sum = sum + (config.level_end - config.level_start) * config.param;
	// 			} else if (x > config.level_start) {
	// 				sum = sum + (config.level_end - x) * config.param;
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return 1 - sum;
	// }

	/**获取功能未开启的TIPS说明 */
	public static getFunctionNotOpenTips(): string {
		return GLan(500079);
	}

	/**检测资源名 */
	public static isContainsName(datas: any[], child: string) {
		for (let key in datas) {
			if (datas.hasOwnProperty(key)) {
				let element: string = datas[key][0];
				if (child == element) return true;
			}
		}
		return false;
	}

	public static getBuildingPopTitleIconType(buildType: number) {
		let popType = PopTitleIconType.GENERAL_INFO;
		switch (buildType) {
			case 0: {
				popType = PopTitleIconType.GENERAL_INFO;
				break;
			}
			case 1: {
				popType = PopTitleIconType.FARMLAND;
				break;
			}
			case 2: {
				popType = PopTitleIconType.MARK;
				break;
			}
			case 3: {
				//popType = 
				break;
			}
			case 4: {
				//popType = 
				break;
			}
			case 5: {
				popType = PopTitleIconType.TAVERN;
				break;
			}
			case 6: {
				popType = PopTitleIconType.SM;
				break;
			}
			case 7: {
				popType = PopTitleIconType.GEM;
				break;
			}
			case 8: {
				popType = PopTitleIconType.ZC
				break;
			}
			case 9: {
				popType = PopTitleIconType.KJ;
				break;
			}
			case 10: {
				popType = PopTitleIconType.BF;
				break;
			}
			case 12: {
				popType = PopTitleIconType.LTG;
				break;
			}
			case 13: {
				//popType = 
				break;
			}
		}
		return this.getNewViewIcon(popType);
	}

	/**获取半屏面板图标 */
	public static getNewViewIcon(type: PopTitleIconType) {
		return "common_pop_icon_" + type + "_png";
	}

	/**获取技能名称图片 不带png*/
	public static getSkillNameImage(skillid: number): string {
		let config = SkillData.getSkillConfig(skillid);
		if (config && config.skillNameImage) {
			return config.skillNameImage + "";
		}
		return "lb_skill_01";
	}


	/**秒数 转化成 如 1天10:10:10 */
	public static changeSecondToDay(sceond: number): string {
		let endSceond = sceond % 60;
		let min = Math.floor(sceond / 60);
		let endMin = min % 60;
		let hour = Math.floor(min / 60);
		let endHour = hour % 24;
		let day = Math.floor(hour / 24);
		let str = "";
		if (day > 0) {
			str = day + GCode(CLEnum.DAY);
		}

		if (endHour > 0) {
			str = str + endHour + ":"
		}
		let minStr = endMin + "";
		if (endMin < 10) {
			minStr = "0" + minStr;
		}
		let sceondStr = endSceond + "";
		if (endSceond < 10) {
			sceondStr = "0" + sceondStr;
		}
		str = str + minStr + ":" + sceondStr;
		return str;
	}
	//类似str = "累计登录 %s/%s天"
	public static getLanguageFormat(str: string, ...args: any[]) {
		if (!str) return '##Not Exist##';
		str = str.replace(/%%/g, "%");
		for (var i in args) {
			var arg = args[i];
			if (L.SD_REG.test(str)) {
				str = str.replace(RegExp.$1, arg);
			}
		}
		return str;
	}

	//根据秒换元宝
	public static TimeGold(time: number): number {
		// if (time <= 0)
		// 	return 0;
		// let interval = 5 * 60 * 1000;//五分钟
		// let integer = Math.floor(time / interval);
		// let remainder = time % interval;
		// if (remainder != 0)
		// 	integer++;
		// return integer;

		if (time <= 0)
			return 0;
		let interval = 0;// 2 * 60 * 1000;//2分钟
		let poor = time - interval;//Math.floor(interval);
		// poor = Math.ceil((poor * 0.001));
		poor = Math.ceil(poor / 60);
		return poor;
	}

	//根据品质刷新道具框
	public static initPropkuang(obj: any, itemId: number) {
		let png = PropModel.getqualityPngByItemId(itemId);
		obj.source = png;
	}

	//更加品质获得颜色
	public static getColorOfQuality(quality) {
		let color;
		switch (quality) {
			case 1:
				color = GameConfig.TextColors.quality1;
				break;
			case 2:
				color = GameConfig.TextColors.quality2;
				break;
			case 3:
				color = GameConfig.TextColors.quality3;
				break;
			case 4:
				color = GameConfig.TextColors.quality4;
				break;
			case 5:
				color = GameConfig.TextColors.quality5;
				break;
			default:
				color = GameConfig.TextColors.quality0;
				break;
		}
		return color;
	}

	/**循环播放 exml编辑动画 */
	public static playAnimation(target: egret.tween.TweenGroup, isLoop: boolean): void {
		if (isLoop) {
			for (var key in target.items) {
				target.items[key].props = { loop: true };
			}
		}
		target.play();
	}


	/**设置红字进度文本(带万字) */
	public static setRedProcessText(label: eui.Label, curNum: number, maxNum: number) {
		if (!label) return;
		if (curNum < maxNum) {
			label.textFlow = Utils.htmlParser(`<font color=#ff0000>${CommonUtils.numOutLenght(curNum)}</font>/${maxNum}`)
		} else {
			label.textFlow = [];
			label.text = `${CommonUtils.numOutLenght(curNum)}/${maxNum}`;
		}
	}
	/**设置红字 需求量文本 */
	public static setRedNeedText(label: eui.Label, curNum: number, needNum: number) {
		if (!label) return;
		if (curNum < needNum) {
			label.textFlow = Utils.htmlParser(`<font color=#ff0000>${needNum}</font>`)
		} else {
			label.textFlow = [];
			label.text = `${needNum}`;
		}
	}


	//以下函数排序属性并未写死，可直接拿去用自定义属性up  升，down 降,
	/**
	 * return Utils.SortByProps(a, b, { "name": "up", "age": "down" });
	 */
	public static SortByProps(item1, item2, obj) {
		var props = [];
		if (obj) {
			props.push(obj)
		}
		var cps = []; // 存储排序属性比较结果。
		// 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
		// 记录下两个排序项按照各个排序属性进行比较得到的结果    
		var asc = true;
		if (props.length < 1) {
			let item1pNum: number;
			let item2pNum: number;
			for (var p in item1) {
				// if (item1[p] instanceof Long) {
				// 	item1pNum = Long.fromValue(item1[p]).toNumber();
				// 	item2pNum = Long.fromValue(item2[p]).toNumber();
				// } else {
				item1pNum = item1[p];
				item2pNum = item2[p];
				// }
				if (item1pNum > item2pNum) {
					cps.push(1);
					break; // 大于时跳出循环。
				} else if (item1pNum === item2pNum) {
					cps.push(0);
				} else {
					cps.push(-1);
					break; // 小于时跳出循环。
				}
			}
		}
		else {
			for (var i = 0; i < props.length; i++) {
				var prop = props[i];
				let item1Num: number;
				let item2Num: number;
				for (var o in prop) {
					asc = prop[o] === "up";
					// if (item1[o] instanceof Long) {
					// 	item1Num = Long.fromValue(item1[o]).toNumber();
					// 	item2Num = Long.fromValue(item2[o]).toNumber();
					// } else {
					item1Num = item1[o];
					item2Num = item2[o];
					// }
					if (item1Num > item2Num) {
						cps.push(asc ? 1 : -1);
						break; // 大于时跳出循环。
					} else if (item1Num === item2Num) {
						cps.push(0);
					} else {
						cps.push(asc ? -1 : 1);
						break; // 小于时跳出循环。
					}
				}
			}
		}

		// 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
		for (var j = 0; j < cps.length; j++) {
			if (cps[j] === 1 || cps[j] === -1) {
				return cps[j];
			}
		}
		return false;
	}
	/*方法二：推荐，速度最快
	  * 判断是否为整数 
	  * @param str 传入的字符串 
	  * @return 是整数返回true,否则返回false 
	*/

	//验证字符串是否是数字
	public static checkNumber(theObj) {
		var reg = /^[0-9]+.?[0-9]*$/;
		if (reg.test(theObj)) {
			return true;
		}
		return false;
	}

	/**获得属性值 */
	public static getAttriValByType(attriList: { [key: number]: number }, type: AttriType): number {
		if (attriList[type]) return attriList[type];
		return 0;
	}

	/**
	 * 获得属性格式
	 * @param opera 是否添加加号
	 * @param 格式  '%s<font color=#00ff00>%s</font>'        '%s：%s'          '%s：<font color=#00ff00>%s</font>'
	 * */
	public static getAttriFormat(data: IKeyVal, opera: boolean = true, format: string = '%s<font color=#00ff00>%s</font>', ...arg): string {
		let name = this.getAttriNameByType(data.key);
		let val = this.getAttriFormatVal(data)
		//添加加号
		if (opera) {
			val = data.value > 0 ? `+${val}` : val;
		}
		return StringUtils.stringFormat(format, name, val);
	}

	/*获得属性值转换*/
	public static getAttriFormatVal(data: IKeyVal) {
		let cfg = C.AttributeConfig[data.key];
		//万分比转换
		if (cfg && cfg.type == 1) {
			return data.value / 100 + '%';
		} else {
			return data.value.toString();
		}
	}

	/*获得属性名字*/
	public static getAttriNameByType(type: number) {
		let cfg = C.AttributeConfig[type];
		return cfg ? cfg.name : '';
	}

	/**属性排序 */
	public static attriSortIds: { [key: number]: number } = {
		[AttriType.POWER]: 1,
		[AttriType.INTELLIGENCE]: 2,
		[AttriType.LEADERSHIP]: 3,
		[AttriType.SOLDIER]: 4,
		[AttriType.ATK]: 5,
		[AttriType.DEF]: 6,
		[AttriType.HP]: 7,
	};
	public static sortAttriList(list: IKeyVal[]) {
		list.sort((a: IKeyVal, b: IKeyVal) => {
			let akey = Utils.attriSortIds[a.key] || (a.key + 100);
			let bkey = Utils.attriSortIds[b.key] || (b.key + 100);
			return akey - bkey;
		})
	}

	/*获得属性图标*/
	public static getAttriIcon(type: number) {
		switch (type) {
			case AttriType.POWER:
				return 'common_pow_png';
			case AttriType.INTELLIGENCE:
				return 'common_intell_png';
			case AttriType.LEADERSHIP:
				return 'common_leader_png';
			case AttriType.ATK:
				return 'common_att_png';
			case AttriType.DEF:
				return 'common_defense_png';
			case AttriType.HP:
				return 'common_blood_png';
			case AttriType.SOLDIER:
				return 'common_armyhp_png';
			default:
				return 'common_pow_png';
		}
	}

	/**计算战斗力[武将]
	 * @param attriList  属性字典
	 * @param 加成系数
	*/
	public static calculateFight(attriList: { [key: number]: number }, armyType: SoldierMainType): number {
		let coeff = 0.0001;
		let _critrate = this.getAttriValByType(attriList, AttriType.CRITICAL) * coeff; //暴击率
		let _crit = this.getAttriValByType(attriList, AttriType.CRIT) * coeff;	//暴击加成
		let _dodge = this.getAttriValByType(attriList, AttriType.DODGE) * coeff;	//闪避率
		let _damageReduction = this.getAttriValByType(attriList, AttriType.DAMAGE_RED) * coeff;	//伤害减免
		let _damageAff = this.getAttriValByType(attriList, AttriType.DAMAGE_AFFIX) * coeff;	//伤害加深
		let _atk = this.getAttriValByType(attriList, AttriType.ATK);	//攻击
		let _def = this.getAttriValByType(attriList, AttriType.DEF);	//防御力
		let _armyHp = this.getAttriValByType(attriList, AttriType.SOLDIER);	//兵力
		let _hp = this.getAttriValByType(attriList, AttriType.HP);	//血量

		let grade = TeamModel.getTroopsInfo(armyType) ? TeamModel.getTroopsInfo(armyType).level : 0;
		let armyCfg = MainMapModel.getSoldierLvCfg(armyType);
		let gradeCfg = C.ArmyProgressConfigDic[armyType][grade] as ArmyProgressConfig;
		let _armyFight = armyCfg.score + gradeCfg.score;

		let _fight = (_atk * (1 - _critrate) + _atk * _critrate * _crit) * (1 + _damageAff) * 10 + (_def * 20 + _hp) / (1 - _dodge) / (1 - _damageReduction) + _armyFight;
		_fight = Math.floor(_fight);
		return _fight;
	}

	/**计算战斗力[通用]
	 * @param attriList  属性字典
	 * @param 加成系数
	*/
	public static calculateNorFight(attriList: { [key: number]: number }): number {
		let _pow = this.getAttriValByType(attriList, AttriType.POWER); //武力
		let _intell = this.getAttriValByType(attriList, AttriType.INTELLIGENCE); //智力
		let _leader = this.getAttriValByType(attriList, AttriType.LEADERSHIP); //统御

		let _critrate = this.getAttriValByType(attriList, AttriType.CRITICAL); //暴击率
		let _crit = this.getAttriValByType(attriList, AttriType.CRIT);	//暴击加成
		let _dodge = this.getAttriValByType(attriList, AttriType.DODGE);	//闪避率
		let _damageReduction = this.getAttriValByType(attriList, AttriType.DAMAGE_RED);	//伤害减免
		let _damageAff = this.getAttriValByType(attriList, AttriType.DAMAGE_AFFIX);	//伤害加深
		let _atk = this.getAttriValByType(attriList, AttriType.ATK);	//攻击
		let _def = this.getAttriValByType(attriList, AttriType.DEF);	//防御力
		let _armyHp = this.getAttriValByType(attriList, AttriType.SOLDIER);	//兵力
		let _hp = this.getAttriValByType(attriList, AttriType.HP);	//血量


		let _fight = (_pow + _intell + _leader) * 3000 + _atk * 10.5 + _def * 20 + _armyHp * 1.1
			+ _hp * 1.1 + _critrate * 15 + _crit * 3 + _dodge * 50 + _damageAff * 30 + _damageReduction * 50;
		_fight = Math.floor(_fight);
		return _fight;
	}

	/** 贝塞尔曲线（1个控制点） */
	public static BezierCurve(scrPoint: egret.Point, dstPoint: egret.Point, ctrlPoint: egret.Point, lerp: number): egret.Point {
		let x = (1 - lerp) * (1 - lerp) * scrPoint.x + 2 * lerp * (1 - lerp) * ctrlPoint.x + lerp * lerp * dstPoint.x;
		let y = (1 - lerp) * (1 - lerp) * scrPoint.y + 2 * lerp * (1 - lerp) * ctrlPoint.y + lerp * lerp * dstPoint.y;
		return egret.Point.create(x, y);
	}

	/**询问框
	 * @param style 皮肤类型（style1 - 无限制,style2 - 本日不再提示 style3 - 本周不再提示)
	 * @param [ LocalModel ] noticeType 通告类型（style1 传递空字符串  其他传递 LocalModel.DAY_NOTICE_BUILD 等预定义类型）
	 */
	public static showConfirmPop(content: string, callback?: any, thisObj?: any, style: string = 'style1', noticeType?: string) {
		if (noticeType && GuideModel.hasGuideTrigger()) {
			callback.call(thisObj);
			return;
		}
		if (noticeType && noticeType != '') {
			if (LocalModel.isNeedNotice(noticeType)) {
				com_main.ConfirmPop.getInstance().show(content, style, noticeType, callback, null, thisObj);
			} else {
				callback.call(thisObj);
			}
		} else {
			com_main.ConfirmPop.getInstance().show(content, style, noticeType, callback, null, thisObj);
		}
	}

	/**提升vip询问框 */
	public static showVipUpConfim() {
		if (platform.isHidePayFunc()) return;
		com_main.ConfirmPop.getInstance().show(GCode(CLEnum.QUA_FI_BUY_MAX), null, null, () => {
			Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
		}, null, this);
	}


	/**显示错误码
	 * @param content
	 */
	public static showErrorCode(errorCode: number) {
		let config = C.ErrorCodeConfig[errorCode];
		if (config) {
			/**替换占位符*/
			let error_msg = GLan(config.name);//读配置
			EffectUtils.showTips(error_msg, 5, true);
		}
	}

	/**
	 * 转换服务器数据
	 * @param obj 目标对象
	 * @param body 转换服务器数据
	 * @param keys 赋值key列表
	 * @param offKey long转换Number 忽略key
	 *  */
	public static voParsePbData(obj: any, body: any, keys: Array<string>, offKey: string[] = []) {
		for (var ind in keys) {
			var key = keys[ind];
			if (body[key] != null && body[key] != undefined) {
				/**Long 转number */
				// if (Long.isLong(body[key]) && offKey.indexOf(key) == -1) {
				// 	obj[key] = Long.fromValue(body[key]).toNumber();
				// } else {
				obj[key] = body[key];
				// }
			}
		}
	}

	/**
	 * 打乱数组
	 *  */
	public static disorderArr(arr: any[] = []) {
		for (let i = 0; i < arr.length; i++) {
			let random = RandomUtils.getInstance().limitInteger(0, arr.length - 1);

			let temp = arr[i];
			arr[i] = arr[random];
			arr[random] = temp;
		}
	}
	////////////////////////////////////////////////////////////////////
	//pb数据流保存
	////////////////////////////////////////////////////////////////////
	/**Uint8Array转字符串 */
	public static Uint8ArrayToString(fileData: Uint8Array) {
		var dataString = "";
		for (var i = 0; i < fileData.length; i++) {
			dataString += String.fromCharCode(fileData[i]);
		}
		return dataString
	}

	/**字符串转Uint8Array */
	public static stringToUint8Array(str: string) {
		var arr = [];
		for (var i = 0, j = str.length; i < j; ++i) {
			arr.push(str.charCodeAt(i));
		}
		var tmpUint8Array = new Uint8Array(arr);
		return tmpUint8Array
	}

	/**关闭触摸检测 保存起来*/
	public static closeHitTestFunc(obj: egret.DisplayObjectContainer) {
		if (!obj["$hitTest1"]) {
			obj["$hitTest1"] = obj["$hitTest"];
		}
		obj["$hitTest"] = () => { return null };
	}

	/**恢复触摸检测 */
	public static recoverHitTestFunc(obj: egret.DisplayObjectContainer) {
		if (obj["$hitTest1"]) {
			obj["$hitTest"] = obj["$hitTest1"];
		}
	}

}