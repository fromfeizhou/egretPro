var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
/**场景管理类 */
var SceneManager = /** @class */ (function () {
    function SceneManager() {
    }
    /**根据枚举获取对应层 */
    SceneManager.getLayer = function (enums) {
        var layer = null;
        switch (enums) {
            case LayerEnums.MAP:
                layer = AGame.R.app.mapLevel;
                break;
            case LayerEnums.MENU:
                layer = AGame.R.app.menuLevel;
                break;
            case LayerEnums.POPUP:
                layer = AGame.R.app.popUpLevel;
                break;
            case LayerEnums.TOP:
                layer = AGame.R.app.topLevel;
                break;
            case LayerEnums.GUIDE:
                layer = AGame.R.app.guideLevel;
                break;
            case LayerEnums.NET:
                layer = AGame.R.app.netLevel;
                break;
        }
        return layer;
    };
    /**
     * 获取当前场景对应的层枚举
     */
    SceneManager.getCurrSceneLayers = function () {
        if (!this.m_pSceneLayers) {
            this.m_pSceneLayers = {};
            this.m_pSceneLayers[SceneEnums.NONE_MAP] = [LayerEnums.MAP, LayerEnums.MENU, LayerEnums.TOP, LayerEnums.GUIDE]; //通用
        }
        return this.m_pSceneLayers[this.m_pCScene] ? this.m_pSceneLayers[this.m_pCScene] : this.m_pSceneLayers[SceneEnums.NONE_MAP];
    };
    SceneManager.addChild = function (enums, child, index) {
        var layer = this.getLayer(enums);
        if (!layer) {
            error("LayerEnums：" + enums + " 不存在");
            return;
        }
        if (index != null)
            layer.addChildAt(child, index);
        else
            layer.addChild(child);
    };
    /**
     * 获取当前Scene
     * @returns SceneEnums
     */
    SceneManager.getCurrScene = function () {
        return this.m_pCScene;
    };
    /**获取上一个场景 */
    SceneManager.getLastScene = function () {
        return this.m_pLastScene;
    };
    /**获取某个层的某个类 根据name获取 */
    SceneManager.getClass = function (enums, name) {
        var layer = this.getLayer(enums);
        if (layer) {
            var child = layer.getChildByName(name);
            if (child)
                return child;
        }
        return null;
    };
    SceneManager.checkIsExistsForName = function (enums, name) {
        var layer = this.getLayer(enums);
        if (layer) {
            var child = layer.getChildByName(name);
            if (child)
                return true;
        }
        return false;
    };
    /**
     * 清空处理
     */
    SceneManager.clear = function (scene) {
        var self = this;
        debug("清理场景信息：", self.m_pCScene);
        self.m_pIsComplete = false;
        com_main.UpManager.close();
        var layers_menu = self.getCurrSceneLayers();
        for (var key in layers_menu) {
            if (layers_menu.hasOwnProperty(key)) {
                var emnus = layers_menu[key];
                var layer = self.getLayer(emnus);
                var layers = [].concat(layer.$children);
                while (layers.length > 0) {
                    var element = layers.pop();
                    var flag = this.checkIsCanRemove(element, scene);
                    if (flag) {
                        if (element.onDestroy && typeof (element.onDestroy) == 'function') {
                            element.onDestroy();
                        }
                        if (element.parent) {
                            element.parent.removeChild(element);
                        }
                    }
                    else {
                        debug('scene keep elment:', element.name);
                    }
                }
                layers = null;
            }
        }
        /**10分钟清理一次 */
        var time = TimerUtils.getServerTime();
        if (time - GameConfig.CLEAR_TIME >= 600) {
            GameConfig.CLEAR_TIME = time;
            AnchorUtil.reset();
            ObjectPool.clear();
            NormalMcMgr.clearMc();
            SceneResGroupCfg.clearModelRes([ModuleEnums.FLAGMENT_RES,
                ModuleEnums.KING_BATTLE,
                ModuleEnums.ACTIVITY_UI,
                ModuleEnums.BUILDING_TIPS,
                ModuleEnums.WELFARE_VIEW,
                ModuleEnums.CAMP_VIEW,
                ModuleEnums.EQUIP_VIEW //装备
            ]);
        }
        else {
            NormalMcMgr.clearMc([IETypes.EUI_EqLevelEff, IETypes.EUI_ActivityEffect, IETypes.EUI_GuideTouch]);
        }
        /**切换场景 清理新手条件缓存 */
        GuideModel.clearCondtion();
    };
    /**
     * 释放场景资源
     * @param scene 场景唯一标识
     */
    SceneManager.releaseSceneRes = function (scene) {
        switch (scene) {
            case SceneEnums.NONE_MAP: {
                break;
            }
            case SceneEnums.MAIN_CITY: {
                //清理模块资源
                SceneResGroupCfg.clearModelRes([ModuleEnums.MAIN_CITY]);
                break;
            }
            case SceneEnums.WORLD_CITY: {
                /**清理资源 */
                SceneResGroupCfg.clearModelRes([ModuleEnums.WORLD_CITY]);
                break;
            }
            case SceneEnums.WORLD_XIANGYANG_CITY: {
                /**清理资源 */
                SceneResGroupCfg.clearModelRes([ModuleEnums.WORLD_XIANGYANG_CITY]);
                break;
            }
            case SceneEnums.BATTLE_MAP: {
                com_main.BattleView.getInstance().clearRes();
                SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE, ModuleEnums.BATTLE_MAP_DYNAMICS, ModuleEnums.RESULT_VIEW, ModuleEnums.COUNTRY_UI]);
                break;
            }
            case SceneEnums.TEST_MAP: { //测试地图
                break;
            }
            case SceneEnums.WAIT_BATTLE_MAP: {
                com_main.BattleView.getInstance().clearRes();
                SceneResGroupCfg.setResGroup(ModuleEnums.BATTLE_MAP_DYNAMICS, ['map_battle_' + 1]);
                SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE, ModuleEnums.BATTLE_MAP_DYNAMICS]);
                break;
            }
            case SceneEnums.AUTO_BATTLE_MAP: {
                var map1 = com_main.AwayKeyboardView.getInstance();
                map1.cleanObj();
                SceneResGroupCfg.clearModelRes([ModuleEnums.AKB]);
                break;
            }
            case SceneEnums.CROSS_WAR_MAP: {
                // let map1 = new
                // map1.cleanObj();
                // SceneResGroupCfg.clearModelRes([ModuleEnums.AKB]);
                break;
            }
        }
    };
    //过去上一个场景
    SceneManager.getSceneBefore = function () {
        for (var i = this.m_sceneStack1.length - 2; i >= 0; i--) {
            if (this.m_sceneStack1[i] != SceneEnums.BATTLE_MAP && this.m_sceneStack1[i] != SceneEnums.WAIT_BATTLE_MAP && this.m_sceneStack1[i] != this.m_pCScene) {
                return this.m_sceneStack1[i];
            }
        }
        return SceneEnums.AUTO_BATTLE_MAP;
    };
    /**返回上一个场景 */
    SceneManager.runSceneBefore = function (operateType) {
        if (operateType == SceneOperateEnums.WATCH_WORLD_BATTLE) {
            if (this.m_pCScene != SceneEnums.BATTLE_MAP && this.m_pCScene != SceneEnums.WAIT_BATTLE_MAP) {
                return;
            }
        }
        //不能返回到 城门场景
        var scene = this.getSceneBefore();
        this.enterScene(scene);
    };
    /**
     * 场景入栈
     * @param scene 场景唯一标识
     */
    SceneManager.pushSceneStack = function (scene) {
        //只保留两个场景的资源。
        var maxLen = 2; //堆栈最大长度
        if (this.m_sceneStack.length < maxLen) {
            this.m_sceneStack.push(scene);
        }
        else {
            var index = this.m_sceneStack.indexOf(scene);
            if (index > -1) {
                this.m_sceneStack.splice(index, 1);
            }
            else {
                var lastScene = this.m_sceneStack.splice(0, 1);
                this.releaseSceneRes(lastScene[0]);
            }
            this.m_sceneStack.push(scene);
        }
        //记录场景操作
        var len = 100;
        if (this.m_sceneStack1.length >= len) {
            var lastScene = this.m_sceneStack1.splice(0, 1);
        }
        this.m_sceneStack1.push(scene);
    };
    /**进入场景 */
    SceneManager.enterScene = function (scene, param, isCheck, tipsParam) {
        if (isCheck === void 0) { isCheck = true; }
        if (tipsParam === void 0) { tipsParam = null; }
        //返回襄阳战限制
        if (scene == SceneEnums.WORLD_XIANGYANG_CITY) {
            var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            if (!vo || !vo.isInBattleTime())
                scene = SceneEnums.AUTO_BATTLE_MAP;
        }
        // //返回跨服城门战限制
        if (scene == SceneEnums.CROSS_WALL_WAR_MAP && (CrossModel.crossStatus != 3 /* MATCH_SUC */ && CrossModel.crossStatus != 4 /* WALL_WAR */))
            scene = SceneEnums.AUTO_BATTLE_MAP;
        //返回跨服城池战限制
        if (scene == SceneEnums.CROSS_WAR_MAP && CrossModel.crossStatus != 5 /* CITY_WAR */)
            scene = SceneEnums.AUTO_BATTLE_MAP;
        switch (scene) {
            case SceneEnums.WORLD_CITY:
            case SceneEnums.WORLD_XIANGYANG_CITY: {
                WorldModel.gotoWorldScene(scene);
                break;
            }
            case SceneEnums.CROSS_WALL_WAR_MAP: {
                CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(3);
                break;
            }
            default: {
                this.runScene(scene, param, isCheck, tipsParam);
                break;
            }
        }
    };
    /**跨服战结算界面跳转 */
    SceneManager.crossResultRunScene = function () {
        if (this.m_pCScene == SceneEnums.CROSS_WALL_WAR_MAP || this.m_pCScene == SceneEnums.CROSS_WAR_MAP
            || (this.m_pCScene == SceneEnums.BATTLE_MAP && BattleModel.getCheckPointType() == CheckPointType.CROSS_SERVER)
            || this.m_pCScene == SceneEnums.WAIT_BATTLE_MAP) {
            this.enterScene(SceneEnums.AUTO_BATTLE_MAP);
        }
    };
    /**
     * 切换场景
     * @param scene 场景唯一标识
     * @param isCheck 是否判断场景是否重复(强制切换场景 不检查)
     */
    SceneManager.runScene = function (scene, param, isCheck, tipsParam) {
        if (isCheck === void 0) { isCheck = true; }
        if (tipsParam === void 0) { tipsParam = null; }
        this.m_pIsComplete = false;
        this.m_tTipsParam = tipsParam;
        // if (GuideModel.isGuide && scene == SceneEnums.WORLD_CITY)
        // 	scene = RoleData.countryId > 0 ? SceneEnums.NOVICE_MAP : SceneEnums.MAIN_CITY;
        //登录场景 不过滤
        if (scene == this.m_pCScene && isCheck) {
            error("场景" + scene + "重复调用了！！！！！！！");
            return;
        }
        if (!(scene >= SceneEnums.NONE_MAP && scene < SceneEnums.ALL)) {
            error("场景" + scene + "不存在");
            return;
        }
        this.pushSceneStack(scene);
        this.m_pLastScene = this.m_pCScene;
        // Loading.hide();
        // LoadingResUI.hide();
        this.clear(scene);
        this.m_pCScene = scene;
        this.loadScene(param);
        WorldModel.checkWorldScene();
    };
    SceneManager.loadScene = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug("加载场景资源：", this.m_pCScene);
                        this.m_pIsLoadRes = true;
                        return [4 /*yield*/, SceneResGroupCfg.LaterClearModelRes()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, DragonBonesManager.clearZeroIns()];
                    case 2:
                        _a.sent();
                        if (this.isBattleScene()) {
                            /**释放记录龙骨 */
                            GeneralMCMgr.clearMc();
                        }
                        //加载场景资源
                        LoadingRes.loadGroups(this.m_pCScene, this.onResLoadComplete, this, param);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**加载场景资源完成 */
    SceneManager.onResLoadComplete = function (param) {
        debug("初始化场景信息：", this.m_pCScene);
        this.m_pIsLoadRes = false;
        // com_main.CEffectMgr.getIns().effectTexture = com_main.CResMgr.getIns().getTextureFromGroup("effect");
        //场景资源加载完成打开场景请求
        switch (this.m_pCScene) {
            case SceneEnums.NONE_MAP: {
                //清理场景，返回选服界面
                com_main.Bootstrap.logoutGame();
                break;
            }
            case SceneEnums.MAIN_CITY: {
                Loading.show();
                Utils.open_view(TASK_UI.MAP_MAIN, param);
                break;
            }
            case SceneEnums.WORLD_CITY:
            case SceneEnums.WORLD_XIANGYANG_CITY: {
                Utils.open_view(TASK_UI.MAP_WORLD);
                break;
            }
            case SceneEnums.BATTLE_MAP: {
                Utils.open_view(TASK_UI.MAP_BATTLE);
                break;
            }
            case SceneEnums.NOVICE_MAP: { //新手主城战斗
                break;
            }
            case SceneEnums.TEST_MAP: { //测试地图
                Loading.show();
                Utils.open_view(TestNav.TEST_ANIM);
                break;
            }
            case SceneEnums.ALL: {
                Loading.show();
                break;
            }
            case SceneEnums.WAIT_BATTLE_MAP: {
                Loading.show();
                Utils.open_view(TASK_UI.WAIT_BATTLE_MAP, param);
                break;
            }
            case SceneEnums.AUTO_BATTLE_MAP: {
                Utils.open_view(TASK_UI.AWAY_FROM_KEYBOARD);
                break;
            }
            case SceneEnums.CROSS_WAR_MAP: {
                Utils.open_view(TASK_UI.MAP_CROSS_WAR);
                break;
            }
            case SceneEnums.CROSS_WALL_WAR_MAP: {
                Utils.open_view(TASK_UI.MAP_CROSS_WALL_WAR);
                break;
            }
        }
        com_main.EventMgr.dispatchEvent(SceneEvent.CHANGE_COMPLETE, this.m_pCScene);
        //场景加载完毕
        this.onSceneWndEnter(true);
    };
    SceneManager.isSceneComplete = function () {
        return this.m_pIsComplete;
    };
    /**场景创建完成 */
    SceneManager.sceneCreateComplete = function () {
        this.m_pIsComplete = true;
        debug("SceneManager:sceneCreateComplete--->>场景创建完成");
        Sound.playSceneBG(this.m_pCScene);
        LoadingResUI.hide();
        Loading.hide();
        // /**初始化指引对象 */
        // if (isNull(com_main.GuideUI.getClass())) {
        // 	let view = new com_main.GuideUI();
        // 	this.addChild(LayerEnums.GUIDE, view);
        // }
        //进入场景打开什么UI在这里打开
        switch (this.m_pCScene) {
            case SceneEnums.NONE_MAP: {
                break;
            }
            case SceneEnums.MAIN_CITY: {
                Utils.open_view(TASK_UI.MENU_MAIN_SCENE);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
                break;
            }
            case SceneEnums.WORLD_CITY: {
                Utils.open_view(TASK_UI.MENU_MAIN_WORLD);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
                break;
            }
            case SceneEnums.WORLD_XIANGYANG_CITY: {
                Utils.open_view(TASK_UI.MENU_MAIN_WORLD);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                break;
            }
            case SceneEnums.BATTLE_MAP: {
                Utils.open_view(TASK_UI.MENU_BATTLE_VIEW);
                break;
            }
            case SceneEnums.NOVICE_MAP: { //新手地图
                break;
            }
            case SceneEnums.TEST_MAP: { //测试地图
                break;
            }
            case SceneEnums.WAIT_BATTLE_MAP: { //攻城战排队等候界面
                Utils.open_view(TASK_UI.MENU_BATTLE_VIEW, true);
                break;
            }
            case SceneEnums.AUTO_BATTLE_MAP: {
                Utils.open_view(TASK_UI.MENU_MAIN_HANG);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
                break;
            }
            case SceneEnums.CROSS_WALL_WAR_MAP: {
                Utils.open_view(TASK_UI.MENU_MAIN_CROSS);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                break;
            }
            case SceneEnums.CROSS_WAR_MAP: {
                Utils.open_view(TASK_UI.MENU_MAIN_CROSS);
                Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
                break;
            }
            case SceneEnums.ALL: {
                break;
            }
        }
        if (this.m_tTipsParam) {
            Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, this.m_tTipsParam);
            this.m_tTipsParam = null;
        }
        /**新手引导ui匹配 */
        com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SCENE);
    };
    SceneManager.getView = function (viewName, param) {
        var clazz = egret.getDefinitionByName(viewName);
        var ca = new clazz(param);
        return ca;
    };
    /**
     * 加载资源打开界面
     * viewName: string  显示页面的类名
     * param?: any   显示页面类 构造函数的参数
     * type: SceneEnums | ModuleEnums   需要加载的资源组
     * style: number   显示模式 UpManager.STYLE_UP 普通弹窗,UpManager.STYLE_FULL 全屏显示，不关地图层.UpManager.STYLE_MAIN_FULL 全屏显示，关地图层
     * preVisible：bool  是否显示先前弹窗
     * [废弃字段]isEnterHistory :boolean 是否加入弹窗堆栈,返回显示 (废弃 必加入弹窗队列)
     * showType [未实现]   显示类型等~
     * layer      属于哪个层
     */
    SceneManager.openView = function (viewName, param, type, style, preVisible, isEnterHistory, showType, isShowMask, layer) {
        var _this = this;
        if (style === void 0) { style = com_main.UpManager.STYLE_UP; }
        if (preVisible === void 0) { preVisible = true; }
        if (isEnterHistory === void 0) { isEnterHistory = true; }
        if (showType === void 0) { showType = 0; }
        if (isShowMask === void 0) { isShowMask = true; }
        if (layer === void 0) { layer = LayerEnums.POPUP; }
        debug("SceneManager:openView--->>", viewName);
        var func = function () {
            debug("SceneManager:openView--->> load complete", viewName);
            if (layer == LayerEnums.POPUP) {
                var name_1 = viewName.replace('com_main.', '');
                var view = SceneManager.getClass(LayerEnums.POPUP, name_1);
                if (view) {
                    com_main.UpManager.updateView(view, preVisible, isShowMask);
                }
                else {
                    view = SceneManager.getView(viewName, param);
                    com_main.UpManager.popView(view, style, preVisible, isEnterHistory, showType, isShowMask);
                }
            }
            else if (layer == LayerEnums.GUIDE) {
                var view = SceneManager.getView(viewName, param);
                _this.addChildGuideView(view);
            }
            Loading.hide();
        };
        if (type && SceneResGroupCfg.getResGroup(type).length > 0) {
            //加载场景资源
            LoadingRes.loadGroups(type, func, this, null);
        }
        else {
            func();
        }
    };
    SceneManager.getCurrMap = function () {
        var scene = this.getCurrScene();
        switch (scene) {
            case SceneEnums.MAIN_CITY: {
                return com_main.MainMap.getClass();
            }
            // case SceneEnums.WORLD_CITY: {
            // 	return com_main.WorldMap.getClass();
            // }
            case SceneEnums.BATTLE_MAP: {
                return com_main.BattleMap.getClass();
            }
        }
        return null;
    };
    /**是否登录场景 */
    SceneManager.isLoginScene = function () {
        return this.m_pCScene == SceneEnums.NONE_MAP;
    };
    /**是否是建筑场景 */
    SceneManager.isCityScene = function () {
        return this.m_pCScene == SceneEnums.MAIN_CITY;
    };
    /**是否是世界场景 */
    SceneManager.isWorldScene = function () {
        return this.m_pCScene == SceneEnums.WORLD_CITY;
    };
    /**是否是襄阳场景 */
    SceneManager.isXiangYangScene = function () {
        return this.m_pCScene == SceneEnums.WORLD_XIANGYANG_CITY;
    };
    /**是否是战斗场景 */
    SceneManager.isBattleScene = function () {
        if (this.m_pCScene == SceneEnums.BATTLE_MAP)
            return true;
        return false;
    };
    /**是否挂机场景 */
    SceneManager.isAutoScene = function () {
        if (this.m_pCScene == SceneEnums.AUTO_BATTLE_MAP)
            return true;
        return false;
    };
    /**检查空场景 */
    SceneManager.onSceneWndEnter = function (isRunScene) {
        if (isRunScene === void 0) { isRunScene = false; }
        if (this.m_pIsLoadRes == true)
            return;
        if (ScenePopQueWnd.hasQueWnd()) {
            //检查场景弹窗
            ScenePopQueWnd.checkQueQue();
        }
        else {
            //检测新手引导条件
            SceneManager.sendGuideScene(isRunScene);
        }
    };
    /**===================================================================================================================
     * 引导 begin
     * ===================================================================================================================
     */
    SceneManager.addChildGuideView = function (view) {
        if (view) {
            com_main.UpManager.setScale(view, true);
            SceneManager.addChild(LayerEnums.GUIDE, view);
        }
    };
    //当前是否有引导界面
    SceneManager.hasChildGuideView = function () {
        var layer = this.getLayer(LayerEnums.GUIDE);
        return layer.numChildren != 0;
    };
    //关闭指引面板相关
    SceneManager.closeGuidePanelByName = function (panelName) {
        var panel = SceneManager.getClass(LayerEnums.GUIDE, panelName);
        if (panel) {
            panel.onDestroy();
            if (panel.parent) {
                panel.parent.removeChild(panel);
                panel = null;
            }
            //新手提示ui关闭 检测当前ui条件（场景 或面板）
            this.sendGuideScene();
        }
    };
    /** 发送当前ui条件（场景 或面板） */
    SceneManager.sendGuideScene = function (isRunScene) {
        if (isRunScene === void 0) { isRunScene = false; }
        //有引导界面存在 跳过
        if (this.hasChildGuideView())
            return;
        if (this.sendPanelGuide())
            return;
        com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SCENE);
        //非切换场景调用 （面板关闭等）
        if (!isRunScene) {
            if (this.isCityScene())
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MAIN_BUILD);
            if (this.isWorldScene())
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_RESOURCE);
            this.sendGuideMenu();
        }
    };
    /**发送面板条件 */
    SceneManager.sendPanelGuide = function () {
        var panel = com_main.UpManager.CurrentPanel;
        if (panel && panel.onGuideCondition) {
            panel.onGuideCondition();
            return true;
        }
        return false;
    };
    /**发送菜单条件 */
    SceneManager.sendGuideMenu = function () {
        var layer = this.getLayer(LayerEnums.MENU);
        var layers = [].concat(layer.$children);
        while (layers.length > 0) {
            var element = layers.pop();
            if (element.onGuideCondition && typeof (element.onGuideCondition) == 'function') {
                element.onGuideCondition();
            }
        }
        layers = null;
    };
    /**检测新场景是否有相同的项，是否需要移除 */
    SceneManager.checkIsCanRemove = function (obj, scene) {
        var barList = this.toolBarList[scene];
        if (obj.name == "AwayKeyboardView") {
            // 挂机界面不清
            obj.onDestroy();
            return false;
        }
        if (barList) {
            return barList.indexOf(obj.name) >= 0 ? false : true;
        }
        return true;
    };
    SceneManager.m_pCScene = SceneEnums.NONE_MAP;
    SceneManager.m_pIsLoadRes = false;
    SceneManager.m_sceneStack = []; //场景堆栈（用来保存场景资源 释放场景资源）
    SceneManager.m_sceneStack1 = []; //场景堆栈(用于退回原来场景)
    /**===================================================================================================================
     * 引导 end
     * ===================================================================================================================
     */
    /**===================================================================================================================
     * 工具栏 begin
     * ===================================================================================================================
     */
    SceneManager.toolBarList = (_a = {},
        _a[SceneEnums.MAIN_CITY] = ['MainTopOther', 'MainTopBar', 'MainSceneBar', 'SystemNotice'],
        _a[SceneEnums.WORLD_XIANGYANG_CITY] = ['MainTopOther', 'MainTopBar', 'MainWorldBar', 'SystemNotice'],
        _a[SceneEnums.WORLD_CITY] = ['MainTopOther', 'MainTopBar', 'MainWorldBar', 'SystemNotice'],
        _a[SceneEnums.BATTLE_MAP] = ['SystemNotice'],
        _a[SceneEnums.NOVICE_MAP] = ['MainTopOther', 'SystemNotice'],
        _a[SceneEnums.CROSS_WALL_WAR_MAP] = ['MainTopOther', 'MainCrossBar', 'SystemNotice'],
        _a[SceneEnums.CROSS_WAR_MAP] = ['MainTopOther', 'MainCrossBar', 'SystemNotice'],
        _a[SceneEnums.AUTO_BATTLE_MAP] = ['MainTopOther', 'MainTopBar', 'MainHangBar', 'SystemNotice'],
        _a);
    return SceneManager;
}());
