var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MainTopOtherType;
(function (MainTopOtherType) {
    MainTopOtherType[MainTopOtherType["LEFT"] = 1] = "LEFT";
    MainTopOtherType[MainTopOtherType["RIGHT"] = 2] = "RIGHT";
})(MainTopOtherType || (MainTopOtherType = {}));
var com_main;
(function (com_main) {
    var MainTopOther = /** @class */ (function (_super_1) {
        __extends(MainTopOther, _super_1);
        function MainTopOther() {
            var _this = _super_1.call(this) || this;
            /**上边图标列表 */
            _this.m_pTIcons = [];
            /**右边图标列表 */
            _this.m_pRIcons = [];
            /**右边图标列表 */
            _this.m_pRIconSecs = [];
            /**下边图标列表 */
            _this.m_pBIcons = [];
            /**隐藏按钮 */
            _this.m_pHideIcons = [];
            _this.maxCout = 0; //活动一排最大数
            _this.name = MainTopOther.NAME;
            _this.initApp("top_new/top_other.exml");
            return _this;
        }
        MainTopOther.prototype.childrenCreated = function () {
            Utils.toStageBestScaleHeigt(this);
            // this.width = egret.MainContext.instance.stage.stageWidth;
            // this.height = egret.MainContext.instance.stage.stageHeight;
            this.touchEnabled = false;
            this.m_conTop.width = this.width - 530;
            this.maxCout = Math.floor((this.m_conTop.width + 25) / (com_main.FunctionActiWidget.WIDTH + 25));
            this.initFunctionIcon();
            this.initActivityIcon();
            this.refreshSceneView();
            this.initEvent();
            this.validateNow();
            if (GameConfig.getIsNotchScreen()) {
                this.m_pMissionTipsViewRoot.left += GameConfig.notchPixel;
                this.m_pMoreBtn.right += GameConfig.notchPixel;
                this.m_conMoreRoot.right += GameConfig.notchPixel;
                this.m_conRight.right += GameConfig.notchPixel;
                this.m_sceneGroup.right += GameConfig.notchPixel;
                this.m_conBottom.right += GameConfig.notchPixel;
            }
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        /**
         * 销毁方法
         */
        MainTopOther.prototype.onDestroy = function () {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_conMoreRoot);
            if (this.m_pBIcons) {
                this.clearIconByList(this.m_pBIcons);
                this.m_pBIcons = null;
            }
            if (this.m_pTIcons) {
                this.clearIconByList(this.m_pTIcons);
                this.m_pTIcons = null;
            }
            if (this.m_pRIcons) {
                this.clearIconByList(this.m_pRIcons);
                this.m_pRIcons = null;
            }
            if (this.m_pRIconSecs) {
                this.clearIconByList(this.m_pRIconSecs);
                this.m_pRIconSecs = null;
            }
            if (this.m_pHideIcons) {
                this.clearIconByList(this.m_pHideIcons);
                this.m_pHideIcons = null;
            }
            Utils.removeFromParent(this);
        };
        /**清理按钮 */
        MainTopOther.prototype.clearIconByList = function (list) {
            if (list) {
                while (list.length > 0) {
                    var icon = list.pop();
                    if (icon.onDestroy && typeof icon.onDestroy == "function") {
                        icon.onDestroy();
                    }
                    if (icon.parent) {
                        Utils.removeFromParent(icon);
                    }
                    else {
                        //没有父节点 不会触发移除场景方法回调 红点未移除
                        RedPointModel.RemoveInfoListenerByCode(icon.m_pConIcon.hashCode);
                    }
                }
            }
        };
        /**初始化 功能按钮 */
        MainTopOther.prototype.initFunctionIcon = function () {
            var funcList = FunctionModel.getOpenFunctionList();
            var icons = {};
            for (var i = 0; i < funcList.length; i++) {
                var ft = funcList[i];
                var cfg = FunctionModel.getFunctionCfgById(ft);
                if (cfg == null)
                    continue;
                var btnCfg = C.FunctionBtnConfig[cfg.btnType];
                if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE)
                    continue;
                if (!icons[btnCfg.id])
                    icons[btnCfg.id] = [];
                icons[btnCfg.id].push(ft);
            }
            for (var key in icons) {
                var iconId = Number(key);
                this.createFuncIcon(iconId, icons[key]);
            }
        };
        /**创建功能按钮 */
        MainTopOther.prototype.createFuncIcon = function (iconId, ft) {
            var widget = this.getWidgetByBtnId(iconId);
            if (!widget) {
                widget = FunctionModel.createFuncIconWidget(iconId);
                var btnCfg = C.FunctionBtnConfig[iconId];
                this.addChildIcon(widget);
            }
            widget.addItemId(ft);
        };
        /**初始化活动按钮 */
        MainTopOther.prototype.initActivityIcon = function () {
            var activityList = ActivityModel.getCurActivityList();
            //id:number - 活动类型[]
            var icons = {};
            for (var i = 0; i < activityList.length; i++) {
                var info = activityList[i];
                if (!info.isOpenIcon())
                    continue;
                var btnCfg = C.FunctionBtnConfig[info.btnId];
                ;
                if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE)
                    continue;
                if (!icons[btnCfg.id])
                    icons[btnCfg.id] = [];
                icons[btnCfg.id].push(info.viewType);
            }
            for (var key in icons) {
                var iconId = Number(key);
                var widget = this.getWidgetByBtnId(iconId);
                if (!widget) {
                    widget = FunctionModel.createActivityIconWidget(iconId);
                    this.addChildIcon(widget);
                }
                widget.addItemId(icons[key]);
            }
        };
        /**添加按钮 */
        MainTopOther.prototype.addChildIcon = function (widget) {
            if (widget == null)
                return;
            if (widget.pos == FunctionPosType.FPT_TOP && widget.scene != 0 && widget.scene != SceneManager.getCurrScene()) {
                this.hideIcon(widget);
                return;
            }
            var layer;
            var list;
            switch (widget.pos) {
                case FunctionPosType.FPT_RIGHT: {
                    list = this.m_pRIcons;
                    layer = this.m_conRight;
                    break;
                }
                case FunctionPosType.FPT_RIGHT_II: {
                    list = this.m_pRIconSecs;
                    layer = this.m_conRightSec;
                    break;
                }
                case FunctionPosType.FPT_BOTTOM: {
                    list = this.m_pBIcons;
                    layer = this.m_conBottom;
                    break;
                }
                default: {
                    list = this.m_pTIcons;
                    layer = this.m_conTop;
                    break;
                }
            }
            if (!list)
                return;
            if (this.getWidgetInListByBtnId(list, widget.btnId))
                return;
            //移除隐藏按钮
            this.removeIconInList(this.m_pHideIcons, widget);
            list.push(widget);
            // Utils.addChild(layer, widget);
            var isInsert = true;
            for (var i = 0; i < layer.numElements; i++) {
                var ele = layer.getElementAt(i);
                if (widget.posPriority < ele.posPriority) {
                    isInsert = false;
                    layer.addChildAt(widget, i);
                    break;
                }
            }
            if (isInsert) {
                layer.addChild(widget);
            }
            if (layer == this.m_conTop)
                this.sortTopIcon();
            layer.validateNow();
        };
        /**顶栏元素再次排序 */
        MainTopOther.prototype.sortTopIcon = function () {
            var layer = this.m_conTop;
            var topRight = []; //顶栏固定节点
            for (var i = 0; i < layer.numElements; i++) {
                var ele = layer.getElementAt(i);
                if (ele.isInId(AcViewType.FIRST_RECHARGE) || ele.isInId(AcViewType.NEW_GEN_VIS)) {
                    topRight.push(ele);
                }
            }
            topRight.sort(function (a, b) {
                return b.posPriority - a.posPriority;
            });
            for (var i = 0; i < topRight.length; i++) {
                layer.setChildIndex(topRight[i], this.maxCout - topRight.length);
            }
        };
        /**保证首充按钮在第一行末尾 */
        // public updateFirstPos(layer: eui.Group, list: FunctionWidgetBase[]) {
        // 	let calcuLen = list.length * FunctionActiWidget.WIDTH + (list.length - 1) * 25;
        // 	if (this.maxActWidth > calcuLen) return;//一排摆的下不需要处理
        // 	let numE: number = layer.numElements;
        // 	if (this.maxCout >= numE) return;
        // 	for (let i = 0; i < numE; i++) {
        // 		let ele = layer.getElementAt(i) as FunctionWidgetBase;
        // 		if (ele.isInId(AcViewType.FIRST_RECHARGE)) {
        // 			if (i != this.maxCout - 1) layer.setChildIndex(ele, this.maxCout - 1)
        // 			break;
        // 		}
        // 	}
        // }
        /**移除按钮 */
        MainTopOther.prototype.removeIcon = function (widget) {
            if (widget == null)
                return;
            Utils.removeFromParent(widget);
            /**顶部  一般活动按钮*/
            var index = this.m_pTIcons.indexOf(widget);
            if (index >= 0) {
                this.m_pTIcons.splice(index, 1);
                this.sortTopIcon();
                return;
            }
            /**右侧 */
            index = this.m_pRIcons.indexOf(widget);
            if (index >= 0) {
                this.m_pRIcons.splice(index, 1);
                return;
            }
            /**右侧2 */
            index = this.m_pRIconSecs.indexOf(widget);
            if (index >= 0) {
                this.m_pRIconSecs.splice(index, 1);
                return;
            }
            /**底部 */
            index = this.m_pBIcons.indexOf(widget);
            if (index >= 0) {
                this.m_pBIcons.splice(index, 1);
                return;
            }
            /**隐藏按钮 */
            index = this.m_pHideIcons.indexOf(widget);
            if (index >= 0) {
                this.m_pHideIcons.splice(index, 1);
                return;
            }
        };
        /**根据功能按钮类型获取相应的部件 */
        MainTopOther.prototype.getWidgetByBtnId = function (id) {
            var cfg = C.FunctionBtnConfig[id];
            if (!cfg)
                return null;
            switch (cfg.pos) {
                case FunctionPosType.FPT_RIGHT: {
                    return this.getWidgetInListByBtnId(this.m_pRIcons, id);
                }
                case FunctionPosType.FPT_RIGHT_II: {
                    return this.getWidgetInListByBtnId(this.m_pRIconSecs, id);
                }
                case FunctionPosType.FPT_BOTTOM: {
                    return this.getWidgetInListByBtnId(this.m_pBIcons, id);
                }
                case FunctionPosType.FPT_TOP: {
                    return this.getWidgetInListByBtnId(this.m_pTIcons, id);
                }
            }
            return this.getWidgetInListByBtnId(this.m_pHideIcons, id);
        };
        /**判断按钮是否存在于队里中 */
        MainTopOther.prototype.getWidgetInListByBtnId = function (list, btnId) {
            if (list && list.length) {
                for (var i = 0; i < list.length; i++) {
                    var widget = list[i];
                    if (widget.btnId == btnId) {
                        return widget;
                    }
                }
            }
        };
        /**获取背包按钮 */
        MainTopOther.getBagViewIcon = function () {
            var obj = this.getClass();
            if (obj) {
                return obj.m_conBottom.getElementAt(4);
            }
        };
        MainTopOther.prototype.onFirstStateChange = function (type) {
            var vo = ActivityModel.getActivityVo(type);
            if (vo == null)
                return;
            var widget = this.getWidgetByBtnId(vo.btnId);
            if (widget)
                widget.updateIncon();
        };
        /**活动改变 */
        MainTopOther.prototype.onActivityStateChange = function (type) {
            var vo = ActivityModel.getActivityVo(type);
            if (vo == null)
                return;
            var isOpen = vo.isOpenIcon();
            var widget = this.getWidgetByBtnId(vo.btnId);
            /**活动关闭 */
            if (isOpen == false) {
                /**移除关联活动id */
                if (widget) {
                    widget.removeItemId(type);
                    if (widget.isActiviyEnd()) {
                        this.removeIcon(widget);
                    }
                }
            }
            else {
                if (!widget) {
                    var btnCfg = C.FunctionBtnConfig[vo.btnId];
                    if (!btnCfg)
                        return;
                    widget = FunctionModel.createActivityIconWidget(btnCfg.id);
                    this.addChildIcon(widget);
                }
                widget.addItemId([type]);
            }
        };
        /**场景状态改变 */
        MainTopOther.prototype.refreshSceneView = function () {
            this.visible = true;
            switch (SceneManager.getCurrScene()) {
                case SceneEnums.WORLD_XIANGYANG_CITY: {
                    this.currentState = "xiangyang";
                    break;
                }
                case SceneEnums.MAIN_CITY: {
                    this.currentState = 'scene';
                    break;
                }
                case SceneEnums.WORLD_CITY: {
                    this.currentState = 'world';
                    break;
                }
                case SceneEnums.AUTO_BATTLE_MAP: {
                    this.currentState = 'hang';
                    break;
                }
                default: {
                    this.currentState = 'base';
                    break;
                }
            }
            this.refreshIconInScene();
        };
        /**按钮显示 */
        MainTopOther.prototype.refreshIconInScene = function () {
            this.refreshIconInList(this.m_pTIcons);
            this.refreshIconInList(this.m_pHideIcons);
        };
        /**判断按钮是否存在于队里中 */
        MainTopOther.prototype.refreshIconInList = function (list) {
            if (list && list.length) {
                for (var i = list.length - 1; i >= 0; i--) {
                    var widget = list[i];
                    this.addChildIcon(widget);
                }
            }
        };
        /**隐藏按钮 */
        MainTopOther.prototype.hideIcon = function (widget) {
            if (this.getWidgetInListByBtnId(this.m_pHideIcons, widget.btnId))
                return;
            Utils.removeFromParent(widget);
            this.removeIconInList(this.m_pTIcons, widget);
            this.m_pHideIcons.push(widget);
        };
        /**移除按钮 */
        MainTopOther.prototype.removeIconInList = function (list, widget) {
            //移除隐藏按钮
            for (var i = 0; i < list.length; i++) {
                if (list[i].btnId == widget.btnId) {
                    list.splice(i, 1);
                    widget.initRedPointEvt();
                    return;
                }
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainTopOther.prototype.initEvent = function () {
            var _this = this;
            //挂机
            com_main.EventManager.addTouchScaleListener(this.m_pHangBtn, this, function () {
                SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
            });
            //世界
            com_main.EventManager.addTouchScaleListener(this.m_pWorldBtn, this, function () {
                WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
            });
            //主城市
            com_main.EventManager.addTouchScaleListener(this.m_pSceneBtn, this, function () {
                if (FunctionModel.isFunctionOpenWithWarn(FunctionType.MAIN_MAP)) {
                    SceneManager.enterScene(SceneEnums.MAIN_CITY);
                }
                ;
            });
            //更多按钮
            com_main.EventManager.addTouchScaleListener(this.m_pMoreBtn, this, function () {
                egret.Tween.removeTweens(_this.m_conMoreRoot);
                var tw = egret.Tween.get(_this.m_conMoreRoot);
                if (_this.m_conMoreRoot.visible) {
                    tw.to({ scaleX: 0, scaleY: 0, alpha: 0.3 }, 300, Ease.quadOut);
                    tw.call(function () {
                        _this.m_conMoreRoot.visible = false;
                    }, _this);
                }
                else {
                    _this.m_conMoreRoot.visible = true;
                    _this.m_conMoreRoot.alpha = 0.3;
                    NodeUtils.setScale(_this.m_conMoreRoot, 0);
                    tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, Ease.quadOut);
                }
            });
            com_main.EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.onActivityStateChange, this);
            com_main.EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.onFirstStateChange, this);
            com_main.EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
            com_main.EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this.removeFunc, this);
            com_main.EventMgr.addEvent(FunctionEvent.NEW_FUNC_OPEN, this.onNewFunc, this);
            // EventMgr.addEvent(FunctionEvent.NEW_PRE_FUNC_OPEN, this.onNewPreFunc, this);
            //挂机按钮红点监听
            RedPointModel.AddInfoListener(this.m_pHangBtn, { x: 63, y: 4, scale: 0.78 }, [RedEvtType.PATROL, RedEvtType.BOSS_RANK, RedEvtType.BOSS_SINGLE, RedEvtType.BOSS_WORLD], 2);
            //更多按钮红点监听
            RedPointModel.AddInfoListener(this.m_pMoreBtn, { x: 50, y: 4, scale: 0.78 }, [RedEvtType.CORN, RedEvtType.CORN_AWARD, RedEvtType.MAIL, RedEvtType.FIGHT_RANK_WORSHIP], 2);
            //主城红点监听
            RedPointModel.AddInfoListener(this.m_pSceneBtn, { x: 63, y: 4, scale: 0.78 }, [RedEvtType.PASS_WAR, RedEvtType.PVP_ARENA, RedEvtType.MATER_WAR, RedEvtType.HEAD_QUATER, RedEvtType.HISTORY_WAR], 2);
            //主城建筑队列红点监听
            RedPointModel.AddInfoListener(this.m_mrp, { x: 0, y: 0, scale: 1 }, [RedEvtType.QUE_BUILD], 5);
            //世界警报红点
            RedPointModel.AddInfoListener(this.m_pWorldRed, { x: 0, y: 0, scale: 1 }, [RedEvtType.WARN], 6);
            //世界红点
            RedPointModel.AddInfoListener(this.m_pWorldBtn, { x: 63, y: 4, scale: 0.78 }, [RedEvtType.EXPLOIT, RedEvtType.TASK_COUNTRY], 2, { countryState: 1, countryWorld: true });
        };
        MainTopOther.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this);
            com_main.EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
            com_main.EventMgr.removeEventByObject(FunctionEvent.NEW_FUNC_OPEN, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this);
        };
        MainTopOther.prototype.removeFunc = function (ft) {
            var funcCfg = FunctionModel.getFunctionCfgById(ft);
            if (!funcCfg)
                return 0;
            var btnCfg = C.FunctionBtnConfig[funcCfg.btnType];
            if (!btnCfg)
                return;
            var widget = MainTopOther.getWidgetByBtnId(btnCfg.id);
            this.removeIcon(widget);
        };
        /**新功能开启 */
        MainTopOther.prototype.onNewFunc = function (data) {
            var funcCfg = C.FunctionConfig[data.funcId];
            if (!funcCfg)
                return;
            var btnCfg = C.FunctionBtnConfig[funcCfg.btnType];
            if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE)
                return;
            var widget = this.getWidgetByBtnId(btnCfg.id);
            if (widget)
                return;
            this.createFuncIcon(btnCfg.id, [data.funcId]);
            widget = this.getWidgetByBtnId(btnCfg.id);
            if (widget)
                widget.visible = data.show;
        };
        /**场景状态改变 */
        MainTopOther.prototype.onChangeScene = function () {
            this.refreshSceneView();
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**检查新手引导面板条件 */
        MainTopOther.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_OTHER);
        };
        /**=====================================================================================
         * 静态对象 begin
         * =====================================================================================
         */
        /**根据功能号获得按钮 */
        MainTopOther.getWidgetByBtnId = function (btnId) {
            var obj = this.getClass();
            if (obj)
                return obj.getWidgetByBtnId(btnId);
        };
        /**全局获取静态对象 */
        MainTopOther.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MENU, MainTopOther.NAME);
            return obj;
        };
        MainTopOther.NAME = 'MainTopOther';
        return MainTopOther;
    }(com_main.CView));
    com_main.MainTopOther = MainTopOther;
})(com_main || (com_main = {}));
