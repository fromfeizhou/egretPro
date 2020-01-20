var _a;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Object.defineProperty(Utils, "DebugUtils", {
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
        get: function () {
            return DebugUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Utils.GetResName = function (name, defName) {
        if (defName === void 0) { defName = ""; }
        if (RES.hasRes(name))
            return name;
        return defName;
    };
    Object.defineProperty(Utils, "TimerManager", {
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
        get: function () {
            return TimerManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "DateUtils", {
        /**
         * 日期工具类
         * @type {DateUtils}
         */
        get: function () {
            return DateUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "MathUtils", {
        /**
         * 数学计算工具类
         * @type {MathUtils}
         */
        get: function () {
            return MathUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "RandomUtils", {
        /**
         * 随机数工具类
         * @type {RandomUtils}
         */
        get: function () {
            return RandomUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "DisplayUtils", {
        /**
         * 显示对象工具类
         * @type {DisplayUtils}
         */
        get: function () {
            return DisplayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "BitmapNumber", {
        /*
         * 图片合成数字工具类
         * */
        get: function () {
            return BitmapNumber.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "StageUtils", {
        // /**
        //  * 引导工具类
        //  */
        // public static get GuideUtils(): GuideUtils {
        //     return GuideUtils.getInstance();
        // }
        /**
         * Stage操作相关工具类
         */
        get: function () {
            return StageUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "StringUtils", {
        // /**
        //  * Effect工具类
        //  */
        // public static get EffectUtils(): EffectUtils {
        //     return EffectUtils.getInstance();
        // }
        /**
         * 字符串工具类
         */
        get: function () {
            return StringUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "CommonUtils", {
        /**
         * 通过工具类
         */
        get: function () {
            return CommonUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "DeviceUtils", {
        // /**
        //  * 音乐管理类
        //  */
        // public static get SoundManager(): SoundManager {
        // 	return SoundManager.getInstance();
        // }
        /**
         * 设备工具类
         */
        get: function () {
            return DeviceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "EgretExpandUtils", {
        /**
         * 引擎扩展类
         */
        get: function () {
            return EgretExpandUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "ShockUtils", {
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
        get: function () {
            return ShockUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "ResourceUtils", {
        /**
         * 资源加载工具类
         */
        get: function () {
            return ResourceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "RenderTextureManager", {
        /**
         * RenderTextureManager
         */
        get: function () {
            return RenderTextureManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "TextFlowMaker", {
        /**
         * TextFlow
         */
        get: function () {
            return TextFlowMaker.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "DelayOptManager", {
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
        get: function () {
            return DelayOptManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "ArrayUtils", {
        /**
         * 数组工具类
         * @returns {any}
         * @constructor
         */
        get: function () {
            return ArrayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "ResVersionManager", {
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
        get: function () {
            return ResVersionManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
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
    Utils.toStageBestScale = function (element) {
        var scale = GameConfig.getBestScale();
        if (element && scale != 1) {
            element.scaleX = scale;
            element.scaleY = scale;
        }
    };
    /**配最佳缩放 动态表单常用
     * 屏幕宽高比 最小缩放比 高度自动适配
     * */
    Utils.toStageBestScaleHeigt = function (element) {
        var width = egret.MainContext.instance.stage.stageWidth - (CONTENT_WIDTH - element.width);
        var scale = width / element.width;
        //设配
        if (scale < 1) {
            NodeUtils.setScale(element, scale);
            var height = egret.MainContext.instance.stage.stageHeight - (CONTENT_HEIGHT - element.height);
            element.height = Math.floor(height / scale);
        }
        else {
            element.width = Math.floor(width);
        }
    };
    /**最大比例缩放 背景图常用 */
    Utils.toStageMaxScale = function (element) {
        //高度适配 高度固定 最大宽度比
        var width = egret.MainContext.instance.stage.stageWidth;
        var scale = Math.max(1, width / CONTENT_WIDTH);
        element.scaleX = scale;
        element.scaleY = scale;
    };
    /**tile布局元素居中
     * 默认水平布局
     */
    Utils.tileGroupToCenter = function (group, itemSize, isHorizontal) {
        if (isHorizontal === void 0) { isHorizontal = true; }
        var tileLayout = group.layout;
        if (!tileLayout)
            return;
        var totalSize;
        var gap;
        if (isHorizontal) {
            totalSize = group.width;
            gap = tileLayout.horizontalGap;
        }
        else {
            totalSize = group.height;
            gap = tileLayout.verticalGap;
        }
        var itemLen = Math.floor((totalSize + gap) / (itemSize + gap));
        var size = itemSize * itemLen + gap * (itemLen - 1);
        var padding = (totalSize - size) / 2;
        if (tileLayout) {
            if (isHorizontal) {
                tileLayout.paddingLeft = padding;
            }
            else {
                tileLayout.paddingTop = padding;
            }
        }
    };
    /**分辨率等比例缩小
     * @param ,按照高低缩小
     * @param
     */
    Utils.setScaleXY = function (container, height) {
        var scaleY = (height - GameConfig.getSub()) / height;
        container.scaleX = scaleY;
        container.scaleY = scaleY;
    };
    Utils.objectLenght = function (elem) {
        //zb
        // if(!elem)
        // {
        // 	return;
        // }
        var keys = Object.keys(elem);
        return keys.length;
    };
    Utils.number2int = function (num) {
        return parseInt(Utils.number2str(num));
    };
    Utils.number2str = function (num) {
        return num;
    };
    Utils.getAppSkin = function (skinName) {
        return Utils.getSkinName('app/' + skinName);
    };
    Utils.getComSkin = function (skinName) {
        return Utils.getSkinName('components/' + skinName);
    };
    Utils.getSkinName = function (skinName) {
        return "resource/skins/" + skinName;
    };
    Utils.setAnchorCenter = function (component) {
        component.anchorOffsetX = component.width / 2;
        component.anchorOffsetY = component.height / 2;
    };
    /**
     * 拷贝一个字典
     */
    Utils.copyDict = function (dict, isDeepCopy) {
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
            }
            else {
                newDict[i] = dict[i];
            }
        }
        return newDict;
    };
    /**
     * 将所有views整体居中
     * @param views
     * @param span
     * @param y
     */
    Utils.setViewCenter = function (views, span, isAnchorCenter, y) {
        if (span === void 0) { span = 0; }
        if (isAnchorCenter === void 0) { isAnchorCenter = false; }
        if (y === void 0) { y = -10000; }
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
    };
    Utils.setViewLink = function (views, span, start_x) {
        if (span === void 0) { span = 0; }
        if (start_x === void 0) { start_x = -10000; }
        var view_num = views.length;
        if (view_num < 2)
            return;
        var base_view = views[0];
        var base_x = start_x != -10000 ? start_x : base_view.x;
        var view_num = views.length;
        for (var i = 0; i < view_num; i++) {
            var view = views[i];
            view.x = base_x;
            base_x += view.width + span;
        }
    };
    /**
     * 替换第一个匹配到的字符串
     * str 原字符串
     * search_str 需要查找的字符串
     * replace_str 需要替换的字符串
     */
    Utils.replace_first_str = function (str, search_str, replace_str) {
        var index = str.indexOf(search_str);
        if (index != -1)
            str = str.substring(0, index) + replace_str + str.substring(index + 3, str.length);
        return str;
    };
    Utils.formatstr = function (source, search) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        /**替换占位符*/
        if (params) {
            var len = params.length;
            for (var i = 0; i < len; i++) {
                source = Utils.replace_first_str(source, search, params[i]);
            }
            // debug('Utils:format--->> source:', source);
        }
        return source;
    };
    Utils.formatstr_ = function (source, search, params) {
        /**替换占位符*/
        if (params) {
            var len = params.length;
            for (var i = 0; i < len; i++) {
                source = Utils.replace_first_str(source, search, params[i]);
            }
        }
        return source;
    };
    Utils.isNullOrEmpty = function (str) {
        if (str == null || str.length == 0)
            return true;
        return false;
    };
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
    Utils.clone = function (source) {
        function copy(target) {
            var data = {};
            for (var key in target) {
                if (typeof target[key] == "object") {
                    data[key] = copy(target[key]);
                }
                else {
                    data[key] = target[key];
                }
            }
            return data;
        }
        var cloneObj = copy(source);
        return cloneObj;
    };
    /**
     * ===================================================================================================================================
     * 涉及频繁在Stage添加移除对象并且不关心ADDEDTOSTAGE与REMOVEDFROMSTAGE事件时，可以进行addChild和removeChild优化，减少逻辑判定。
     */
    /**
     * addChild 的高效实现，慎用
     * @param container
     * @param child
     */
    Utils.addChild = function (container, child) {
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
    };
    /**
     * addChildAt 的高效实现，慎用
     * @param container
     * @param child
     * @param index
     */
    Utils.addChildAt = function (container, child, index) {
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
    };
    Utils.assignParentDisplayList = function (child, parentCache, newParent) {
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
    };
    /**
     * removeFromParent 的高效实现，慎用
     * @param child
     */
    Utils.removeFromParent = function (child) {
        if (child && child.parent) {
            child.parent.removeChild(child);
        }
        // if (child && child.$parent) {
        // var index = child.parent.$children.indexOf(child);
        // child.$parent.$children.splice(index, 1);
        // child.$setParent(null);
        // }
    };
    /**
     * removeChildAt 的高效实现，慎用
     * @param container
     * @param index
     */
    Utils.removeChildAt = function (container, index) {
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
    };
    /**
     * removeAllChild 的高效实现，慎用
     * @param container
     */
    Utils.removeAllChild = function (container) {
        while (container.$children.length) {
            Utils.removeChildAt(container, 0);
        }
    };
    /**解析html标签 */
    Utils.htmlParser = function (text) {
        return new egret.HtmlTextParser().parser(text);
    };
    /**
     * 设置富文本label
     */
    Utils.setRichLabel = function (label, text) {
        text = Utils.parseLanRich(text);
        text = Utils.parseClickRich(text);
        text = text.replace(/<br>/ig, "\n");
        if (label)
            label.textFlow = Utils.htmlParser(text);
    };
    /**
      * 解析带有颜色标签的text
      */
    Utils.parseLanRich = function (str) {
        var patt1 = new RegExp("(.*)<color=(.*?)>(.*?)<\/color>(.*)");
        var dstText = "";
        var result = null;
        do {
            result = patt1.exec(str);
            if (result) {
                var color = RegExp.$2;
                if (color.indexOf("#") == -1) {
                    color = "#" + color.substr(0, 6);
                }
                else {
                    color = color.substr(0, 7);
                }
                var newStr = RegExp.$1 + "<font color='" + color + "'>" + RegExp.$3 + "</font>" + RegExp.$4;
                str = newStr;
            }
        } while (result != null);
        return str;
    };
    /**
      * 解析Lan标签
      */
    Utils.parseLan = function (str) {
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
    };
    /**解析Lan标签参数 */
    Utils.parseLanParam = function (param) {
        var arr = param.split('_');
        var str = '';
        if (arr.length > 1) {
            var type = parseInt(arr[0]);
            var val = arr[1];
            var code = '';
            switch (type) {
                case LanParamType.Default: { //默认读取语言包
                    code = val;
                    break;
                }
                case LanParamType.Country: { //国家id
                    // let cfg = C.CountryConfig[val];
                    // if (cfg) {
                    // 	code = cfg.name;
                    // }
                    return this.getCountryName(Number(val));
                }
                case LanParamType.Prop: { //道具ID
                    var cfg = C.ItemConfig[val];
                    if (cfg) {
                        code = cfg.name;
                    }
                    break;
                }
                case LanParamType.General: { //武将ID
                    var cfg = C.GeneralConfig[val];
                    if (cfg) {
                        code = cfg.name;
                    }
                    break;
                }
                case LanParamType.CityBuild: { //世界地图建筑id
                    var cfg = C.WorldMapConfig[val];
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
        }
        else {
            error('Lan标签参数错误:', param);
        }
        return str;
    };
    /**
       * 解析带有事件点击标签的text
       */
    Utils.parseClickRich = function (str) {
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
    };
    /**
       * 把自身对象和孩子的tween移除
       */
    Utils.removeAllTween = function (view, isRoot) {
        if (isRoot === void 0) { isRoot = false; }
        egret.Tween.removeTweens(view);
        for (var i = 0; i < view.numChildren; i++) {
            var ch = view.getChildAt(i);
            egret.Tween.removeTweens(ch);
            if (ch instanceof egret.DisplayObjectContainer) {
                this.removeAllTween(ch);
            }
        }
    };
    /**
     * 获取app目录下的exml地址
     */
    Utils.getAppExml = function (dir, fileName) {
        return "resource/skins/app/" + dir + "/" + fileName;
    };
    /**快速打开面板 */
    Utils.open_view = function (name, body, type) {
        // debug("Utils:open_view--->>", name);
        var view = SceneManager.getClass(LayerEnums.TOP, com_main.GuideTouchTips.NAME);
        if (view)
            view.closeView();
        AGame.R.notifyView(name, body, type);
    };
    /**是否变灰 */
    Utils.isGray = function (flag, bitmap) {
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
    };
    Utils.isBlack = function (flag, bitmap) {
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
    };
    /**是否发光 */
    Utils.isGlow = function (flag, bitmap, color, value) {
        if (color === void 0) { color = 0xFFD000; }
        if (value === void 0) { value = 1; }
        if (bitmap) {
            // var color: number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
            var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
            var blurX = 30 * value; /// 水平模糊量。有效值为 0 到 255.0（浮点）
            var blurY = 30 * value; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
            var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
            var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
            var inner = false; /// 指定发光是否为内侧发光，暂未实现
            var knockout = false; /// 指定对象是否具有挖空效果，暂未实现
            var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
            bitmap.filters = flag ? [glowFilter] : [];
        }
    };
    /**是否变亮 */
    Utils.isHighlight = function (flag, bitmap) {
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
    };
    /**是否变亮 */
    Utils.isLowlight = function (flag, bitmap) {
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
    };
    /**亮度调节  */
    Utils.setLight = function (light, bitmap) {
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
    };
    /**
     * 根据城池ID获取城池名字图片的资源名
     */
    Utils.getBuildNameSource = function (buildId) {
        return 'font_build_' + buildId + '_png';
    };
    /**
     * 根据城池规模获取城池图片的资源名
     */
    Utils.getBuildTypeSource = function (type) {
        return 'map_build_' + type + '_png';
    };
    /**
     * 根据城池地形获取地形背景图片的资源名
     */
    Utils.getBuildTerrainSource = function (terrain) {
        return 'map_build_bg_json.map_build_bg_' + terrain;
    };
    /**
     * 根据资源名设置图片
     */
    Utils.setImageFromSource = function (obj, source) {
        if (source && source != "") {
            var texture = RES.getRes(source);
            if (texture) {
                obj.source = texture;
                obj.width = texture.textureWidth;
                obj.height = texture.textureHeight;
            }
        }
    };
    /**获取 */
    Utils.getPopTitleIcon = function (type) {
        var tempId = 1;
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
            case PopTitleIconType.TREASRE_COM: { //合成
                tempId = 15;
                break;
            }
            case PopTitleIconType.TAVERN: { //酒馆
                tempId = 3;
                break;
            }
            case PopTitleIconType.MILITARY_TASK: { //聚宝盆
                tempId = 13;
                break;
            }
            default: {
                tempId = 2;
            }
        }
        var img_url = "rk_icon_" + tempId + "_png";
        var texture = RES.getRes(img_url);
        // if(texture== null||texture == undefined ){
        // 	img_url = "rk_icon_1_png";
        // 	texture = RES.getRes(img_url);
        // }
        return texture;
    };
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
    Utils.getRandomObject = function (list) {
        if (list && list.length > 0) {
            var random = Math.floor(Math.random() * list.length);
            var obj = list[random];
            return obj;
        }
        else {
            return null;
        }
    };
    /**
     * 构建格子的坐标key值
     * @param x
     * @param y
     * @return
     */
    Utils.buildCellkey = function (x, y) {
        return x + "_" + y;
    };
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
    Utils.getCountyFlagById = function (countyId) {
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
    };
    /**根据国家id得到国家 */
    Utils.getCountyPSourceById = function (countyId, type) {
        // 国家标识图片
        switch (countyId) {
            case CountryType.WEI:
                var cityWEISource = "";
                if (type == CityLevel.CAPITAL) {
                    cityWEISource = "dt_data_blue_png";
                }
                else if (type == CityLevel.TOWN) {
                    cityWEISource = "dt_xiaota_blue_png";
                }
                else if (type == CityLevel.COUNTY) {
                    cityWEISource = "dt_dian_blue_png";
                }
                return cityWEISource;
            case CountryType.SHU:
                var citySHUSource = "";
                if (type == CityLevel.CAPITAL) {
                    citySHUSource = "dt_data_green_png";
                }
                else if (type == CityLevel.TOWN) {
                    citySHUSource = "dt_xiaota_green_png";
                }
                else if (type == CityLevel.COUNTY) {
                    citySHUSource = "dt_dian_green_png";
                }
                return citySHUSource;
            case CountryType.WU:
                var cityWUSource = "";
                if (type == CityLevel.CAPITAL) {
                    cityWUSource = "dt_data_red_png";
                }
                else if (type == CityLevel.TOWN) {
                    cityWUSource = "dt_xiaota_red_png";
                }
                else if (type == CityLevel.COUNTY) {
                    cityWUSource = "dt_dian_red_png";
                }
                return cityWUSource;
            default:
                var cityZLSource = "";
                if (type == CityLevel.CAPITAL) {
                    cityZLSource = "dt_data_gray_png";
                }
                else if (type == CityLevel.TOWN) {
                    cityZLSource = "dt_xiaota_gray_png";
                }
                else if (type == CityLevel.COUNTY) {
                    cityZLSource = "dt_dian_gray_png";
                }
                return cityZLSource;
        }
    };
    /**获取国家名称 */
    Utils.getCountryName = function (countryId, defStr) {
        if (defStr === void 0) { defStr = ''; }
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
                if (defStr != '')
                    return defStr;
                return GCode(CLEnum.STATE_YE);
        }
    };
    /**获取兵种名字 */
    Utils.getSoilderTypeName = function (type) {
        var str = "";
        switch (type) {
            case SoldierMainType.FOOTSOLDIER: {
                str = GCode(CLEnum.GEN_TAB_BB);
                break;
            }
            case SoldierMainType.RIDESOLDIER: {
                str = GCode(CLEnum.GEN_TAB_QB);
                break;
            }
            case SoldierMainType.ARROWSOLDIER: {
                str = GCode(CLEnum.GEN_TAB_GB);
                break;
            }
            case SoldierMainType.PIKEMAN: {
                str = GCode(CLEnum.GEN_TAB_QB1);
                break;
            }
        }
        return str;
    };
    /**获取国家名称颜色 */
    Utils.getCountryColor = function (countryId) {
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
    };
    /**获取国家名称颜色1 */
    Utils.getCountryColor1 = function (countryId) {
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
    };
    /**获取小图背景 */
    Utils.getCountyMiniFlagById = function (countyId) {
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
    };
    /**获取大图背景 */
    Utils.getCountyBigiFlagById = function (countyId) {
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
    };
    /**
     * 根据道具ID获取道具的名称
     */
    Utils.getItemName = function (itemId) {
        var itemCfg = C.ItemConfig[itemId];
        if (itemCfg) {
            var nameId = itemCfg.name;
            return GLan(nameId);
            //return nameId;
        }
        return "";
    };
    /**
     * 构造一个消耗配置数据
     */
    Utils.makeComsume = function (idValue, countValue) {
        return IItemInfoPool.create(idValue, countValue);
    };
    /**获得掉落表奖励结构 */
    Utils.parseCommonItemJsonInDrop = function (dropJson, isMerge) {
        if (isMerge === void 0) { isMerge = false; }
        var itemList = [];
        var tmpList = JSON.parse(dropJson);
        for (var i = 0; i < tmpList.length; i++) {
            if (C.DropConfigDic.hasOwnProperty(tmpList[i])) {
                var dropCfgs = C.DropConfigDic[tmpList[i]];
                for (var key in dropCfgs) {
                    var dropCfg = dropCfgs[key];
                    if (dropCfg != null && dropCfg != undefined) {
                        itemList = itemList.concat(this.parseCommonItemJson(dropCfg.rewards));
                    }
                }
            }
        }
        //自动合并(概率掉落显示  无数量)
        if (isMerge) {
            var res = [];
            for (var i = 0; i < itemList.length; i++) {
                if (res.indexOf(itemList[i].itemId) == -1) {
                    res.push(itemList[i].itemId);
                }
            }
            itemList = [];
            while (itemList.length > 0) {
                IItemInfoPool.release(itemList.pop());
            }
            for (var i = 0; i < res.length; i++) {
                itemList.push(IItemInfoPool.create(res[i], 0));
            }
        }
        return itemList;
    };
    /**
     * 解释奖励配置，以数组的形式返回
     * @param itemString 1_100,2_100
     * @return 返回对象数组，每个对象的数据为 { type: xxx, itemId: yyy, count: zzz }
     */
    Utils.parseCommonItemJson = function (itemString) {
        var itemList = [];
        if (itemString && itemString != "") {
            var tmpList = StringUtils.keyValsToNumberArray(itemString);
            for (var i = 0; i < tmpList.length; i++) {
                var data = tmpList[i];
                var reward = Utils.makeComsume(data.key, data.value);
                itemList.push(reward);
            }
        }
        return itemList;
    };
    /**
     * 解释服务器奖励配置，以数组的形式返回
     */
    Utils.parseCommonItemServ = function (list) {
        var itemList = [];
        for (var i = 0; i < list.length; i++) {
            itemList.push(Utils.makeComsume(list[i].key, list[i].value));
        }
        return itemList;
    };
    /**解析单个物品 */
    Utils.parseCommonItemServSingle = function (data) {
        return Utils.makeComsume(data.key, data.value);
    };
    /**
     * 获取奖励描述字符串
     * @param @param itemJson json字符串 格式形如：[[1(对应type),2(对应itemId),3(对应数量count)]，[...]]
     * @param isConsume 是否是消耗，如果是消耗，返回的数量前面会有一个负号，否则是加号
     * @return 返回字符串数组，元素字符串为: 物品名称 +/-数字
     */
    Utils.getRewardDesc = function (itemJson, isConsume) {
        var data = Utils.parseCommonItemJson(itemJson);
        var desc = Utils.converReward2String(data, isConsume);
        return desc;
    };
    /**
     * 把奖励数据转换成字符描述
     * @param data 应该是 parseCommonItemJson 返回的数据或相同的结构类型
     * @return 返回字符串数组，元素字符串为: 物品名称 +/-数字
     */
    Utils.converReward2String = function (data, isConsume) {
        var desc = [];
        for (var i = 0; i < data.length; i++) {
            var reward = data[i];
            var symbol = isConsume ? "-" : "+";
            var cfg = C.ItemConfig[reward.itemId];
            var itemName = "itemID ";
            if (cfg) {
                itemName = GLan(cfg.name);
            }
            desc.push(itemName + " " + symbol + reward.count);
        }
        return desc;
    };
    /**
    * 随机
    * @param min
    * @param max
    * @returns {any}
    */
    Utils.random = function (min, max) {
        var rand = Math.floor(Math.random() * (max - min + 1)) + min;
        return rand;
    };
    /**去除所有空格 */
    Utils.trim = function (str) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        result = result.replace(/\s/g, "");
        return result;
    };
    /**
      * 过滤特殊字符
      **/
    Utils.filterStr = function (str) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；�：”“'。，、？%+]");
        var specialStr = "";
        for (var i = 0; i < str.length; i++) {
            specialStr += str.substr(i, 1).replace(pattern, '');
        }
        return specialStr;
    };
    /**
     * 输入的是否emoji表情
     */
    Utils.isEmojiCharacter = function (substring) {
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
                }
                else if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    if (ls == 0x20e3) {
                        return true;
                    }
                }
                else {
                    if (0x2100 <= hs && hs <= 0x27ff) {
                        return true;
                    }
                    else if (0x2B05 <= hs && hs <= 0x2b07) {
                        return true;
                    }
                    else if (0x2934 <= hs && hs <= 0x2935) {
                        return true;
                    }
                    else if (0x3297 <= hs && hs <= 0x3299) {
                        return true;
                    }
                    else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                        || hs == 0x2b50) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    ;
    /**设置道具的等级 */
    Utils.setPropLabLv = function (id, target) {
        var cfg = PropModel.getCfg(id);
        if (cfg) {
            target.text = GCodeFromat(CLEnum.LEVEL1, cfg.level);
            this.setLabColorByQuality(target, cfg.quality);
        }
    };
    /**设置道具名字 */
    Utils.setPropLabName = function (id, target) {
        var cfg = PropModel.getCfg(id);
        if (cfg) {
            target.text = GLan(cfg.name);
            this.setLabColorByQuality(target, cfg.quality);
        }
    };
    /**获得道具名字 */
    Utils.getPropName = function (id) {
        var cfg = PropModel.getCfg(id);
        if (cfg) {
            return GLan(cfg.name);
        }
        return "";
    };
    /**设置品质文本 */
    Utils.setLabColorByQuality = function (target, quality) {
        target.textColor = this.getColorOfQuality(quality);
    };
    /**获取寺庙图片路径 */
    Utils.getTempleItemTexture = function (maintype) {
        var url = 'temple_item' + maintype + '_png';
        var texture = RES.getRes(url);
        if (texture) {
            return texture;
        }
        else {
            return RES.getRes('temple_item1_png');
        }
    };
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
    Utils.getMainBuildName = function (type) {
        var url = type + '';
        return 'map_main_build' + url + '_png';
    };
    /**获取主城建筑图片纹理 */
    Utils.getMainBuildTexture = function (type) {
        var url = this.getMainBuildName(type);
        var texture = RES.getRes(url);
        return texture;
    };
    /**获取主城建筑图片名 */
    Utils.getOtherBuildName = function (type) {
        var url = type + '';
        return 'map_build_mask_' + url + '_png';
    };
    /**获取其他建筑图片纹理 */
    Utils.getOtherBuildTexture = function (type) {
        var url = this.getOtherBuildName(type);
        var texture = RES.getRes(url);
        return texture;
    };
    /**获取主城建筑面板标题文字 */
    Utils.getMainBuildTitle = function (type) {
        var url = type + '';
        return '';
    };
    /**是否是武将 */
    Utils.isGeneral = function (type) {
        return type == UnitType.GENERAL;
    };
    /**是否是武将或小兵 */
    Utils.isGeneralOrSoldier = function (type) {
        return (type == UnitType.GENERAL || type == UnitType.SOLDIER);
    };
    /**是否是武将对象 */
    Utils.isGeneralObj = function (obj) {
        return obj instanceof com_main.CSquare;
    };
    /**是否是建筑 */
    Utils.isBuild = function (type) {
        return (type == UnitType.BUILDING_WALL || type == UnitType.BUILDING_BARTIZAN);
    };
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
    Utils.getPlayerHeadSource = function (type, url) {
        var source = '';
        switch (type) {
            case 0: { //角色id
                source = this.getPlayerHeadImg(Number(url));
                break;
            }
            case 1: { //武将id
                var cfg = C.GeneralConfig[Number(url)];
                source = GeneralModel.getSoldierLogo(cfg.role);
                break;
            }
            case 2: { //http 地址
                break;
            }
        }
        return source;
    };
    /**获得玩家头像 */
    Utils.getPlayerBigHeadSource = function (type, url) {
        var source = '';
        switch (type) {
            case 0: { //角色id
                source = this.getPalyerBodyImg(Number(url));
                break;
            }
            case 1: { //武将id
                var cfg = C.GeneralConfig[Number(url)];
                source = GeneralModel.getSoldierBigLogo(cfg.role);
                break;
            }
            case 2: { //http 地址
                break;
            }
        }
        return source;
    };
    /**获取玩家头像 */
    Utils.getPlayerHeadImg = function (headId) {
        return "role_" + headId + "_png";
    };
    /**获取玩家的半身像 */
    Utils.getPalyerBodyImg = function (headId) {
        return "roleBig_" + headId + "_png";
    };
    /**
     * 从语言表中设置内容
     */
    Utils.setTextByLanguageKey = function (key, target, defaultDesc) {
        if (defaultDesc === void 0) { defaultDesc = ""; }
        var desc = GLan(key);
        //let desc = key;
        if (desc && desc != "") {
            target.text = desc;
        }
        else {
            target.text = defaultDesc;
        }
    };
    /**
     * 战斗单位图层排序
     */
    Utils.sortChildrens = function (obj) {
        function sortY(d1, d2) {
            var dy1 = d1.y;
            var dy2 = d2.y;
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
            }
            else if (dy1 < dy2) {
                return -1;
            }
            else {
                return 0;
            }
        }
        obj.$children.sort(sortY);
    };
    /**json解释器包装 */
    Utils.JsonParseWrap = function (jsonStr) {
        if (jsonStr == "") {
            return null;
        }
        return JSON.parse(jsonStr);
    };
    /**
     * 获取官职名
     */
    Utils.getGovernmentPosName = function (posId) {
        var cfg = C.JobConfig[posId];
        if (cfg) {
            //玩家官职
            return GLan(cfg.name);
        }
        return "";
    };
    /**取反阵营 */
    Utils.getContraryFactionType = function (faction) {
        var contrary;
        if (faction == FactionType.ATK) {
            contrary = FactionType.DEF;
        }
        else if (faction == FactionType.DEF) {
            contrary = FactionType.ATK;
        }
        return contrary;
    };
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
    Utils.getFunctionNotOpenTips = function () {
        return GLan(500079);
    };
    /**检测资源名 */
    Utils.isContainsName = function (datas, child) {
        for (var key in datas) {
            if (datas.hasOwnProperty(key)) {
                var element = datas[key][0];
                if (child == element)
                    return true;
            }
        }
        return false;
    };
    Utils.getBuildingPopTitleIconType = function (buildType) {
        var popType = PopTitleIconType.GENERAL_INFO;
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
                popType = PopTitleIconType.ZC;
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
    };
    /**获取半屏面板图标 */
    Utils.getNewViewIcon = function (type) {
        return "common_pop_icon_" + type + "_png";
    };
    /**获取技能名称图片 不带png*/
    Utils.getSkillNameImage = function (skillid) {
        var config = SkillData.getSkillConfig(skillid);
        if (config && config.skillNameImage) {
            return config.skillNameImage + "";
        }
        return "lb_skill_01";
    };
    /**秒数 转化成 如 1天10:10:10 */
    Utils.changeSecondToDay = function (sceond) {
        var endSceond = sceond % 60;
        var min = Math.floor(sceond / 60);
        var endMin = min % 60;
        var hour = Math.floor(min / 60);
        var endHour = hour % 24;
        var day = Math.floor(hour / 24);
        var str = "";
        if (day > 0) {
            str = day + GCode(CLEnum.DAY);
        }
        if (endHour > 0) {
            str = str + endHour + ":";
        }
        var minStr = endMin + "";
        if (endMin < 10) {
            minStr = "0" + minStr;
        }
        var sceondStr = endSceond + "";
        if (endSceond < 10) {
            sceondStr = "0" + sceondStr;
        }
        str = str + minStr + ":" + sceondStr;
        return str;
    };
    //类似str = "累计登录 %s/%s天"
    Utils.getLanguageFormat = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!str)
            return '##Not Exist##';
        str = str.replace(/%%/g, "%");
        for (var i in args) {
            var arg = args[i];
            if (L.SD_REG.test(str)) {
                str = str.replace(RegExp.$1, arg);
            }
        }
        return str;
    };
    //根据秒换元宝
    Utils.TimeGold = function (time) {
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
        var interval = 0; // 2 * 60 * 1000;//2分钟
        var poor = time - interval; //Math.floor(interval);
        // poor = Math.ceil((poor * 0.001));
        poor = Math.ceil(poor / 60);
        return poor;
    };
    //根据品质刷新道具框
    Utils.initPropkuang = function (obj, itemId) {
        var png = PropModel.getqualityPngByItemId(itemId);
        obj.source = png;
    };
    //更加品质获得颜色
    Utils.getColorOfQuality = function (quality) {
        var color;
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
    };
    /**循环播放 exml编辑动画 */
    Utils.playAnimation = function (target, isLoop) {
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play();
    };
    /**设置红字进度文本(带万字) */
    Utils.setRedProcessText = function (label, curNum, maxNum) {
        if (!label)
            return;
        if (curNum < maxNum) {
            label.textFlow = Utils.htmlParser("<font color=#ff0000>" + CommonUtils.numOutLenght(curNum) + "</font>/" + maxNum);
        }
        else {
            label.textFlow = [];
            label.text = CommonUtils.numOutLenght(curNum) + "/" + maxNum;
        }
    };
    /**设置红字 需求量文本 */
    Utils.setRedNeedText = function (label, curNum, needNum) {
        if (!label)
            return;
        if (curNum < needNum) {
            label.textFlow = Utils.htmlParser("<font color=#ff0000>" + needNum + "</font>");
        }
        else {
            label.textFlow = [];
            label.text = "" + needNum;
        }
    };
    //以下函数排序属性并未写死，可直接拿去用自定义属性up  升，down 降,
    /**
     * return Utils.SortByProps(a, b, { "name": "up", "age": "down" });
     */
    Utils.SortByProps = function (item1, item2, obj) {
        var props = [];
        if (obj) {
            props.push(obj);
        }
        var cps = []; // 存储排序属性比较结果。
        // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
        // 记录下两个排序项按照各个排序属性进行比较得到的结果    
        var asc = true;
        if (props.length < 1) {
            var item1pNum = void 0;
            var item2pNum = void 0;
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
                }
                else if (item1pNum === item2pNum) {
                    cps.push(0);
                }
                else {
                    cps.push(-1);
                    break; // 小于时跳出循环。
                }
            }
        }
        else {
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                var item1Num = void 0;
                var item2Num = void 0;
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
                    }
                    else if (item1Num === item2Num) {
                        cps.push(0);
                    }
                    else {
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
    };
    /*方法二：推荐，速度最快
      * 判断是否为整数
      * @param str 传入的字符串
      * @return 是整数返回true,否则返回false
    */
    //验证字符串是否是数字
    Utils.checkNumber = function (theObj) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(theObj)) {
            return true;
        }
        return false;
    };
    /**获得属性值 */
    Utils.getAttriValByType = function (attriList, type) {
        if (attriList[type])
            return attriList[type];
        return 0;
    };
    /**
     * 获得属性格式
     * @param opera 是否添加加号
     * @param 格式  '%s<font color=#00ff00>%s</font>'        '%s：%s'          '%s：<font color=#00ff00>%s</font>'
     * */
    Utils.getAttriFormat = function (data, opera, format) {
        if (opera === void 0) { opera = true; }
        if (format === void 0) { format = '%s<font color=#00ff00>%s</font>'; }
        var arg = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            arg[_i - 3] = arguments[_i];
        }
        var name = this.getAttriNameByType(data.key);
        var val = this.getAttriFormatVal(data);
        //添加加号
        if (opera) {
            val = data.value > 0 ? "+" + val : val;
        }
        return StringUtils.stringFormat(format, name, val);
    };
    /*获得属性值转换*/
    Utils.getAttriFormatVal = function (data) {
        var cfg = C.AttributeConfig[data.key];
        //万分比转换
        if (cfg && cfg.type == 1) {
            return data.value / 100 + '%';
        }
        else {
            return data.value.toString();
        }
    };
    /*获得属性名字*/
    Utils.getAttriNameByType = function (type) {
        var cfg = C.AttributeConfig[type];
        return cfg ? cfg.name : '';
    };
    Utils.sortAttriList = function (list) {
        list.sort(function (a, b) {
            var akey = Utils.attriSortIds[a.key] || (a.key + 100);
            var bkey = Utils.attriSortIds[b.key] || (b.key + 100);
            return akey - bkey;
        });
    };
    /*获得属性图标*/
    Utils.getAttriIcon = function (type) {
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
    };
    /**计算战斗力[武将]
     * @param attriList  属性字典
     * @param 加成系数
    */
    Utils.calculateFight = function (attriList, armyType) {
        var coeff = 0.0001;
        var _critrate = this.getAttriValByType(attriList, AttriType.CRITICAL) * coeff; //暴击率
        var _crit = this.getAttriValByType(attriList, AttriType.CRIT) * coeff; //暴击加成
        var _dodge = this.getAttriValByType(attriList, AttriType.DODGE) * coeff; //闪避率
        var _damageReduction = this.getAttriValByType(attriList, AttriType.DAMAGE_RED) * coeff; //伤害减免
        var _damageAff = this.getAttriValByType(attriList, AttriType.DAMAGE_AFFIX) * coeff; //伤害加深
        var _atk = this.getAttriValByType(attriList, AttriType.ATK); //攻击
        var _def = this.getAttriValByType(attriList, AttriType.DEF); //防御力
        var _armyHp = this.getAttriValByType(attriList, AttriType.SOLDIER); //兵力
        var _hp = this.getAttriValByType(attriList, AttriType.HP); //血量
        var grade = TeamModel.getTroopsInfo(armyType) ? TeamModel.getTroopsInfo(armyType).level : 0;
        var armyCfg = MainMapModel.getSoldierLvCfg(armyType);
        var gradeCfg = C.ArmyProgressConfigDic[armyType][grade];
        var _armyFight = armyCfg.score + gradeCfg.score;
        var _fight = (_atk * (1 - _critrate) + _atk * _critrate * _crit) * (1 + _damageAff) * 10 + (_def * 20 + _hp) / (1 - _dodge) / (1 - _damageReduction) + _armyFight;
        _fight = Math.floor(_fight);
        return _fight;
    };
    /**计算战斗力[通用]
     * @param attriList  属性字典
     * @param 加成系数
    */
    Utils.calculateNorFight = function (attriList) {
        var _pow = this.getAttriValByType(attriList, AttriType.POWER); //武力
        var _intell = this.getAttriValByType(attriList, AttriType.INTELLIGENCE); //智力
        var _leader = this.getAttriValByType(attriList, AttriType.LEADERSHIP); //统御
        var _critrate = this.getAttriValByType(attriList, AttriType.CRITICAL); //暴击率
        var _crit = this.getAttriValByType(attriList, AttriType.CRIT); //暴击加成
        var _dodge = this.getAttriValByType(attriList, AttriType.DODGE); //闪避率
        var _damageReduction = this.getAttriValByType(attriList, AttriType.DAMAGE_RED); //伤害减免
        var _damageAff = this.getAttriValByType(attriList, AttriType.DAMAGE_AFFIX); //伤害加深
        var _atk = this.getAttriValByType(attriList, AttriType.ATK); //攻击
        var _def = this.getAttriValByType(attriList, AttriType.DEF); //防御力
        var _armyHp = this.getAttriValByType(attriList, AttriType.SOLDIER); //兵力
        var _hp = this.getAttriValByType(attriList, AttriType.HP); //血量
        var _fight = (_pow + _intell + _leader) * 3000 + _atk * 10.5 + _def * 20 + _armyHp * 1.1
            + _hp * 1.1 + _critrate * 15 + _crit * 3 + _dodge * 50 + _damageAff * 30 + _damageReduction * 50;
        _fight = Math.floor(_fight);
        return _fight;
    };
    /** 贝塞尔曲线（1个控制点） */
    Utils.BezierCurve = function (scrPoint, dstPoint, ctrlPoint, lerp) {
        var x = (1 - lerp) * (1 - lerp) * scrPoint.x + 2 * lerp * (1 - lerp) * ctrlPoint.x + lerp * lerp * dstPoint.x;
        var y = (1 - lerp) * (1 - lerp) * scrPoint.y + 2 * lerp * (1 - lerp) * ctrlPoint.y + lerp * lerp * dstPoint.y;
        return egret.Point.create(x, y);
    };
    /**询问框
     * @param style 皮肤类型（style1 - 无限制,style2 - 本日不再提示 style3 - 本周不再提示)
     * @param [ LocalModel ] noticeType 通告类型（style1 传递空字符串  其他传递 LocalModel.DAY_NOTICE_BUILD 等预定义类型）
     */
    Utils.showConfirmPop = function (content, callback, thisObj, style, noticeType) {
        if (style === void 0) { style = 'style1'; }
        if (noticeType && GuideModel.hasGuideTrigger()) {
            callback.call(thisObj);
            return;
        }
        if (noticeType && noticeType != '') {
            if (LocalModel.isNeedNotice(noticeType)) {
                com_main.ConfirmPop.getInstance().show(content, style, noticeType, callback, null, thisObj);
            }
            else {
                callback.call(thisObj);
            }
        }
        else {
            com_main.ConfirmPop.getInstance().show(content, style, noticeType, callback, null, thisObj);
        }
    };
    /**提升vip询问框 */
    Utils.showVipUpConfim = function () {
        if (platform.isHidePayFunc())
            return;
        com_main.ConfirmPop.getInstance().show(GCode(CLEnum.QUA_FI_BUY_MAX), null, null, function () {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }, null, this);
    };
    /**显示错误码
     * @param content
     */
    Utils.showErrorCode = function (errorCode) {
        var config = C.ErrorCodeConfig[errorCode];
        if (config) {
            /**替换占位符*/
            var error_msg = GLan(config.name); //读配置
            EffectUtils.showTips(error_msg, 5, true);
        }
    };
    /**
     * 转换服务器数据
     * @param obj 目标对象
     * @param body 转换服务器数据
     * @param keys 赋值key列表
     * @param offKey long转换Number 忽略key
     *  */
    Utils.voParsePbData = function (obj, body, keys, offKey) {
        if (offKey === void 0) { offKey = []; }
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
    };
    /**
     * 打乱数组
     *  */
    Utils.disorderArr = function (arr) {
        if (arr === void 0) { arr = []; }
        for (var i = 0; i < arr.length; i++) {
            var random = RandomUtils.getInstance().limitInteger(0, arr.length - 1);
            var temp = arr[i];
            arr[i] = arr[random];
            arr[random] = temp;
        }
    };
    ////////////////////////////////////////////////////////////////////
    //pb数据流保存
    ////////////////////////////////////////////////////////////////////
    /**Uint8Array转字符串 */
    Utils.Uint8ArrayToString = function (fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString;
    };
    /**字符串转Uint8Array */
    Utils.stringToUint8Array = function (str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array;
    };
    /**关闭触摸检测 保存起来*/
    Utils.closeHitTestFunc = function (obj) {
        if (!obj["$hitTest1"]) {
            obj["$hitTest1"] = obj["$hitTest"];
        }
        obj["$hitTest"] = function () { return null; };
    };
    /**恢复触摸检测 */
    Utils.recoverHitTestFunc = function (obj) {
        if (obj["$hitTest1"]) {
            obj["$hitTest"] = obj["$hitTest1"];
        }
    };
    /**属性排序 */
    Utils.attriSortIds = (_a = {},
        _a[AttriType.POWER] = 1,
        _a[AttriType.INTELLIGENCE] = 2,
        _a[AttriType.LEADERSHIP] = 3,
        _a[AttriType.SOLDIER] = 4,
        _a[AttriType.ATK] = 5,
        _a[AttriType.DEF] = 6,
        _a[AttriType.HP] = 7,
        _a);
    return Utils;
}());
