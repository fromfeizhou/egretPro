/**跳转类型 */
var TurnType;
(function (TurnType) {
    TurnType[TurnType["Function"] = 1] = "Function";
    TurnType[TurnType["MoveToBuild"] = 2] = "MoveToBuild";
    TurnType[TurnType["RunScene"] = 3] = "RunScene";
    TurnType[TurnType["Chat"] = 4] = "Chat";
    TurnType[TurnType["MoveAndOpenBuild"] = 5] = "MoveAndOpenBuild";
    TurnType[TurnType["Panel"] = 6] = "Panel";
    TurnType[TurnType["MoveToFuncBuild"] = 7] = "MoveToFuncBuild";
    TurnType[TurnType["WORLD_EVT"] = 101] = "WORLD_EVT";
    TurnType[TurnType["WORLD_LOCKED"] = 102] = "WORLD_LOCKED";
    TurnType[TurnType["WORLD_RES"] = 103] = "WORLD_RES";
    TurnType[TurnType["WORLD_COL_RES"] = 104] = "WORLD_COL_RES";
    TurnType[TurnType["WORLD_MONSTER"] = 105] = "WORLD_MONSTER";
    TurnType[TurnType["WORLD_CITY"] = 106] = "WORLD_CITY";
})(TurnType || (TurnType = {}));
var FunctionModel = /** @class */ (function () {
    function FunctionModel() {
    }
    FunctionModel.init = function () {
        this.parsePreViewCfg();
        this.openFuncIdList = [];
    };
    FunctionModel.clear = function () {
        this.functionList = null;
        this.functionDic = {};
        this.openFuncIdList = [];
    };
    FunctionModel.delOpenFuncs = function (list) {
        for (var _i = 0, _a = this.offFuncs; _i < _a.length; _i++) {
            var id = _a[_i];
            var index = list.indexOf(id);
            if (index >= 0) {
                //跨服联赛判断日期开放
                if (id == FunctionType.CROSS_SERVER && CrossModel.checkIsOpen()) {
                    continue;
                }
                list.splice(index, 1);
            }
        }
    };
    /**更新功能列表 */
    FunctionModel.updateFunctionList = function (functionList) {
        // 首次收到功能开放列表
        if (this.functionList == null) {
            //过滤自动开放功能
            this.delOpenFuncs(functionList);
            this.functionList = functionList;
            this.requestFuncData(functionList);
        }
        else {
            // 新功能开放
            if (functionList != null && functionList.length > 0) {
                var openList = [];
                var len = functionList.length;
                for (var i = 0; i < len; i++) {
                    var ft = functionList[i];
                    if (this.isFunctionOpen(ft)) {
                        continue;
                    }
                    openList.push(ft);
                    // this.functionList.push(ft);
                    // let cfg = this.getFunctionCfgById(ft);
                    // com_main.EventMgr.dispatchEvent(TASK_EVT.POP_NEW_FUNCTION_OPEN, ft);
                }
                //过滤自动开放功能
                this.delOpenFuncs(openList);
                ScenePopQueWnd.addNewFuctionAnim(openList);
                //请求功能数据
                this.requestFuncData(openList);
            }
        }
    };
    /**功能是否开启 */
    FunctionModel.isFunctionOpen = function (id) {
        if (this.functionList != null) {
            return this.functionList.indexOf(id) >= 0;
        }
        return false;
    };
    /**功能是否开启 */
    FunctionModel.isFunctionOpenWithWarn = function (id) {
        if (FunctionModel.isFunctionOpen(id)) {
            return true;
        }
        else {
            this.showLimitFuncTips(id);
            return false;
        }
    };
    /**添加新的功能号 */
    FunctionModel.addNewFuncClient = function (ft) {
        if (!this.functionList)
            return;
        if (this.functionList.indexOf(ft) >= 0)
            return;
        ScenePopQueWnd.addNewFuctionAnim([ft]);
    };
    /**添加新的功能号 */
    FunctionModel.addNewFunc = function (ft) {
        if (!this.functionList)
            return;
        if (this.functionList.indexOf(ft) >= 0)
            return;
        this.functionList.push(ft);
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_NEW_FUNCTION_OPEN, ft);
        /**激活功能相关新手引导 */
        com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CHECK, null);
    };
    /**获取已经开启的功能号 */
    FunctionModel.getOpenFunctionList = function () {
        var functionList = [];
        if (this.functionList != null && this.functionList.length > 0) {
            var len = this.functionList.length;
            for (var i = 0; i < len; i++) {
                var ft = this.functionList[i];
                functionList.push(ft);
            }
        }
        //测试代码
        // functionList = [];
        // for(let key in C.FunctionConfig){
        // 	if(unNull(C.FunctionConfig[key])){
        // 		functionList.push(Number(key));
        // 	}
        // }
        return functionList;
    };
    /**根据功能号获取所在的位置类型 */
    FunctionModel.getPosByFunctionType = function (ft) {
        var cfgBtn = this.getBtnCfgByFuntionType(ft);
        if (cfgBtn && cfgBtn.pos) {
            return cfgBtn.pos;
        }
        return 0;
    };
    /**获取功能开放等级 */
    FunctionModel.getFunctionOpenLevel = function (ft) {
        var cfg = this.getFunctionCfgById(ft);
        if (cfg) {
            return cfg.openLevel;
        }
        return 999;
    };
    /**根据功能号获取功能配置 */
    FunctionModel.getFunctionCfgById = function (ft) {
        return C.FunctionConfig[ft];
    };
    /**根据功能号获取按钮配置 */
    FunctionModel.getBtnCfgByFuntionType = function (ft) {
        var cfg = this.getFunctionCfgById(ft);
        if (cfg) {
            var cfgBtn = C.FunctionBtnConfig[cfg.btnType];
            return cfgBtn;
        }
    };
    /**根据功能号获取按钮配置 */
    FunctionModel.getBtnSource = function (ft) {
        var cfg = this.getFunctionCfgById(ft);
        if (!cfg)
            return '';
        var btnCfg = C.FunctionBtnConfig[cfg.btnType];
        if (!btnCfg)
            return '';
        return btnCfg.iconName == '' ? '' : btnCfg.iconName + "_png";
    };
    /**功能移除 */
    FunctionModel.removeFunc = function (ft) {
        if (!this.isFunctionOpen(ft))
            return;
        var index = this.functionList.indexOf(ft);
        this.functionList.splice(index, 1);
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_NEW_FUNCTION_CLOSE, ft);
    };
    /**=====================================================================================
     * 请求功能数据 begin
     * =====================================================================================
     */
    /**请求功能数据 */
    FunctionModel.requestFuncData = function (list) {
        for (var i = 0; i < list.length; i++) {
            var ft = list[i];
            switch (ft) {
                case FunctionType.ONLINE: { //在线奖励
                    ActivityProxy.C2S_ONLINE_INFO();
                    break;
                }
                case FunctionType.PATROL: {
                    // case FunctionType.PATROL_BOSS: {	//boss数据嵌入挂机模块
                    PatrolProxy.send_C2S_GET_PATROL();
                    break;
                }
                case FunctionType.MAIL: { //请求邮件信息
                    MailProxy.C2S_MAILBOX_TITLE_LSIT();
                    break;
                }
                case FunctionType.COUNTRY: { //请求国家信息
                    CountryProxy.send_COUNTRY_INFO();
                    break;
                }
                case FunctionType.GUILD: { //联盟
                    LegionProxy.send_GET_GUILD_INFO(false, 0);
                    break;
                }
                case FunctionType.TECHNOLOGY: { //请求科技信息
                    TechnologyProxy.C2S_TECHNOLOGY_VIEW();
                    break;
                }
                case FunctionType.FREE_MONEY: { //聚宝基本信息
                    CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO();
                    break;
                }
                case FunctionType.BOSS: { //发送获得怪物信息
                    BossProxy.C2S_GET_BOSS();
                    break;
                }
                case FunctionType.MATERIAL: { //材料副本
                    MaterialProxy.C2S_MATERIAL_INFO();
                    break;
                }
                case FunctionType.HEAD_QUARTERS: { //章节副本
                    HeadQuartersProxy.send_HQ_GET_INFO();
                    break;
                }
                case FunctionType.HISTORY_WAR: { //章节副本
                    HistoryBattleProxy.C2S_GET_HISTORY_WAR_INFO();
                    break;
                }
                case FunctionType.APK: { //竞技场
                    PvpArenaProxy.send_APK_GET_MY_APK();
                    break;
                }
                case FunctionType.GENERAL_RECRUITMENT: { //酒馆招募
                    TavernProxy.send_TAVERN_INFO();
                    break;
                }
                case FunctionType.ARMEY: {
                    SoldierProxy.send_GET_ARMY();
                    break;
                }
                case FunctionType.WORLD_MAP: {
                    WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId);
                    break;
                }
                case FunctionType.GENERAL_FATE: {
                    /**请求缘分列表 */
                    if (FateModel.isFirstEnter) {
                        FateModel.isFirstEnter = false;
                        FateProxy.C2S_RELATION_LIST();
                    }
                    break;
                }
                case FunctionType.CHAT: { //聊天
                    ChatProxy.C2S_CHAT_RECORD_LIST();
                    ChatProxy.C2S_CHAT_PRIVATE_LIST();
                    ChatProxy.C2S_CHAT_BLACKLIST();
                    break;
                }
            }
        }
    };
    /**=====================================================================================
     * 请求功能数据 end
     * =====================================================================================
     */
    /**=====================================================================================
     * 功能预览 begin
     * =====================================================================================
     */
    /**初始化配置 */
    /**解析功能预览表 */
    FunctionModel.parsePreViewCfg = function () {
        this.preFuncCfgList = [];
        this.funcCfgList = [];
        for (var key in C.FunctionConfig) {
            var cfg = C.FunctionConfig[key];
            if (isNull(cfg))
                continue;
            this.funcCfgList.push(cfg);
            if (cfg.isPreView) {
                this.preFuncCfgList.push(cfg);
            }
        }
        this.preFuncCfgList.sort(function (a, b) {
            return a.openLevel - b.openLevel;
        });
        this.funcCfgList.sort(function (a, b) {
            return a.openLevel - b.openLevel;
        });
    };
    FunctionModel.getLastFuncCfg = function () {
        var level = RoleData.level;
        var len = this.funcCfgList.length;
        for (var index = 0; index < len; index++) {
            if (this.funcCfgList[index].openLevel > level)
                return this.funcCfgList[index];
        }
    };
    /**
     * 获得当前预览下标
     * @return -1没有 返回功能预告列表下标
     *  */
    FunctionModel.getPreViewIndex = function () {
        var index = -1;
        for (var i = 0; i < this.preFuncCfgList.length; i++) {
            var cfg = this.preFuncCfgList[i];
            if (!this.isFunctionOpen(cfg.id)) {
                // if (this.openFuncIdList.indexOf(cfg.id) != -1) {
                // 	index = i;
                // 	break;
                // }
                index = i;
                break;
            }
        }
        return index;
    };
    /**更新功能预览数据 */
    FunctionModel.updateFunction = function (data) {
        // this.openFuncIdList = data.newFunctionId;
        // if (this.openFuncIdList && this.openFuncIdList.length > 0)
        // 	this.handerPreFunc();
    };
    //弹出预览面板的框
    FunctionModel.handerPreFunc = function () {
        if (this.preFlag != 0) {
            this.preFlag--;
            return;
        }
        // let cfg = C.FunctionConfig[this.openFuncIdList[0]]
        // let sceneEnum: SceneEnums = SceneManager.getCurrScene();
        // if (sceneEnum == SceneEnums.MAIN_CITY || sceneEnum == SceneEnums.WORLD_CITY || sceneEnum == SceneEnums.AUTO_BATTLE_MAP) {
        // 	if (!com_main.UpManager.hasPopView() && cfg.isPreView) {
        // 		Utils.open_view(TASK_UI.POP_FUNCITON_NEW_VIEW, cfg.id);
        // 		com_main.EventMgr.dispatchEvent(FunctionEvent.NEW_PRE_FUNC_OPEN, cfg.id);
        // 	}
        // }
        for (var index = 0; index < this.openFuncIdList.length; index++) {
            var cfg = C.FunctionConfig[this.openFuncIdList[index]];
            if (isNull(cfg))
                continue;
            if (cfg.isPreView) {
                this.preFlag++;
                FunctionProxy.C2S_FUNCTION_PREVIEW(this.openFuncIdList[index]);
            }
        }
    };
    /**得到功能预览列表 */
    FunctionModel.getPreFuncList = function () {
        return this.preFuncCfgList;
    };
    /**=====================================================================================
     * 功能预览 end
     * =====================================================================================
     */
    /**功能跳转限制 */
    FunctionModel.funcToLimit = function (limit) {
        if (limit == '')
            return false;
        var res = JSON.parse(limit);
        if (res[0] == 1) {
            if (!FunctionModel.isFunctionOpen(res[1])) {
                this.showLimitFuncTips(res[1]);
                return true;
            }
        }
        else if (res[0] == 2) {
            var vo = MainMapModel.getBuildInfo(res[1]);
            if (!vo || !vo.isActivation()) {
                var cfg = C.BuildingConfig[res[1]];
                if (cfg)
                    EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_BUILD, cfg.name), 1, true);
                return true;
            }
        }
        return false;
    };
    /**功能开放提示 */
    FunctionModel.showLimitFuncTips = function (funcId) {
        var cfg = C.FunctionConfig[funcId];
        if (!cfg)
            return;
        var level = cfg.openLevel;
        var taskId = cfg.openTaskId;
        if (RoleData.level < level) {
            EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LEVEL, level));
            return;
        }
        if (cfg.openTaskId > 0) {
            var taskCfg = C.TaskConditionConfig[cfg.openTaskId];
            if (taskCfg)
                EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_TASK, taskCfg.title), 1, true);
        }
    };
    /**功能跳转 */
    FunctionModel.funcToPanel = function (id) {
        var cfg = C.TurnPanelConfig[id];
        if (cfg) {
            if (this.funcToLimit(cfg.limit)) {
                return;
            }
            var tipsParam = null;
            if (cfg.uiRoot != '' || cfg.uiPath != '') {
                var param = cfg.uiRoot == '' ? [] : JSON.parse(cfg.uiRoot);
                var uiRoot = param.length == 0 ? { layer: 0, name: '' } : { layer: param[0], name: param[1] };
                var uiPath = cfg.uiPath == '' ? [] : JSON.parse(cfg.uiPath);
                tipsParam = { uiRoot: uiRoot, uiPath: uiPath };
            }
            switch (cfg.turnType) {
                case TurnType.Function: {
                    FunctionModel.openFunctionByType(cfg.paramId);
                    break;
                }
                case TurnType.MoveToBuild: {
                    var param = { buildId: cfg.paramId, tipsParam: tipsParam };
                    this.turnCityMap(param);
                    break;
                }
                case TurnType.MoveToFuncBuild: {
                    var param = { funcId: cfg.paramId, tipsParam: tipsParam };
                    this.turnCityMap(param);
                    break;
                }
                case TurnType.RunScene: {
                    com_main.UpManager.close();
                    if (cfg.paramId != SceneManager.getCurrScene()) {
                        SceneManager.enterScene(cfg.paramId, null, true, tipsParam);
                        return;
                    }
                    break;
                }
                case TurnType.Chat: {
                    Utils.open_view(TASK_UI.POP_CHAT_MAIN);
                    break;
                }
                case TurnType.MoveAndOpenBuild: {
                    var param = { buildId: cfg.paramId, buildAc: 1 };
                    this.turnCityMap(param);
                    break;
                }
                case TurnType.Panel: {
                    if (cfg.param != '') {
                        if (TASK_UI.LEGION_MAIN_WND == cfg.paramId) { //判断已有联盟直接进入，否则打开联盟列表
                            if (!this.isFunctionOpen(FunctionType.GUILD)) {
                                EffectUtils.showTips(GCode(CLEnum.FUNC_LOCK), 1, true);
                                return;
                            }
                            if (!LegionModel.getGuildInfo()) {
                                LegionProxy.send_GUILD_LIST_OPEN_VIEW();
                                return;
                            }
                        }
                        if (TASK_UI.SHOP_TREASURE_PANEL == cfg.paramId) { //各个商城跳转
                            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(JSON.parse(cfg.param));
                            return;
                        }
                        Utils.open_view(cfg.paramId, JSON.parse(cfg.param));
                    }
                    else {
                        Utils.open_view(cfg.paramId);
                    }
                    break;
                }
                case TurnType.WORLD_EVT: //事件城池
                case TurnType.WORLD_LOCKED: //解锁城池
                case TurnType.WORLD_RES: //资源收集
                case TurnType.WORLD_COL_RES: //采集
                case TurnType.WORLD_MONSTER: //怪物
                case TurnType.WORLD_CITY: { //城池
                    var param = { type: cfg.turnType, param: cfg.paramId, tips: cfg.param };
                    this.turnWorldMap(param);
                    break;
                }
            }
            if (tipsParam != null) {
                Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, tipsParam);
            }
        }
    };
    /**主城地图跳转 */
    FunctionModel.turnCityMap = function (param) {
        if (!this.isFunctionOpen(FunctionType.MAIN_MAP)) {
            this.showLimitFuncTips(FunctionType.MAIN_MAP);
            return;
        }
        if (SceneManager.isCityScene()) {
            com_main.UpManager.close();
            AGame.R.notifyView(TASK_UI.MAP_MAIN_MOVE, param);
        }
        else {
            SceneManager.enterScene(SceneEnums.MAIN_CITY, param);
        }
    };
    /**世界地图跳转 */
    FunctionModel.turnWorldMap = function (param) {
        if (!this.isFunctionOpen(FunctionType.WORLD_MAP)) {
            this.showLimitFuncTips(FunctionType.WORLD_MAP);
            return;
        }
        if (SceneManager.isWorldScene()) {
            com_main.UpManager.close();
            AGame.R.notifyView(TASK_UI.MAP_WORLD_MOVE, param);
        }
        else {
            //带参数场景切换 不执行指引 等待场景加载完毕
            WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY, param);
            return;
        }
    };
    /**功能跳转 */
    FunctionModel.openFunctionByType = function (ft, param) {
        if (!FunctionModel.isFunctionOpen(ft)) {
            this.showLimitFuncTips(ft);
            return;
        }
        switch (ft) {
            case FunctionType.BUILDING_GRADE: {
                if (MainMapModel.isActivation(param)) {
                    Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, param);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.CITY_BD_LOCK), 1, true);
                }
                break;
            }
            case FunctionType.BUILDING_GRADE_SPEED: {
                MainMapModel.openBuildGradeSpeed(param);
                break;
            }
            case FunctionType.SHOP: {
                ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.GENERAL);
                break;
            }
            /**公告 */
            case FunctionType.ANNOUNCEMENT: {
                EffectUtils.showTips(GCode(CLEnum.FUNC_LOCK), 1, true);
                // NoticeProxy.send_ANNOUNCE_INFO_LIST();
                break;
            }
            /**缩略图 */
            case FunctionType.MINIMAP: {
                Utils.open_view(TASK_UI.POP_WORLD_THUM_VIEW);
                break;
            }
            /**邮件 */
            case FunctionType.MAIL: {
                // if (!MailModel.isInit()) {
                // 	ReportProxy.C2S_MAILBOX_TITLE_LSIT();
                // } else {
                Utils.open_view(TASK_UI.POP_MAIL_LIST_VIEW);
                // }
                break;
            }
            /**排行榜 */
            case FunctionType.RANK: {
                Utils.open_view(TASK_UI.RANK_MAIN_PANEL);
                break;
            }
            /**背包 */
            case FunctionType.PACK: {
                // PropProxy.send_BACKPACK_QUERY(true);
                Utils.open_view(TASK_UI.POP_BAG_LIST_VIEW);
                break;
            }
            /**联盟 */
            case FunctionType.GUILD: {
                if (LegionModel.getGuildInfo()) {
                    LegionProxy.send_GET_GUILD_INFO(true, 0);
                }
                else {
                    LegionProxy.send_GUILD_LIST_OPEN_VIEW();
                }
                break;
            }
            /**任务 */
            case FunctionType.MAIN_TASK: {
                Utils.open_view(TASK_UI.TASK_ACTIVATION_PANEL);
                break;
            }
            /**国家 */
            case FunctionType.COUNTRY: {
                // CountryProxy.send_COUNTRY_INFO_OPEN_VIEW();
                CountryProxy.send_COUNTRY_INFO();
                CountryProxy.C2S_COUNTRY_CITY_INFO();
                Utils.open_view(TASK_UI.COUNTRY_MAIN_PANEL);
                break;
            }
            /**警报 */
            case FunctionType.ALERT: {
                Utils.open_view(TASK_UI.POP_WORLD_BATTLE_VIEW);
                break;
            }
            /**巡营 */
            case FunctionType.PATROL: {
                Utils.open_view(TASK_UI.POS_PARTRO_VIEW);
                break;
            }
            /**血战群雄 */
            case FunctionType.BOSS: {
                BossProxy.C2S_GET_BOSS_OPEN_VIEW();
                break;
            }
            case FunctionType.GENERAL_RECRUITMENT: {
                Utils.open_view(TASK_UI.TAVERN_MAIN_PANEL);
                break;
            }
            case FunctionType.TECHNOLOGY: {
                Utils.open_view(TASK_UI.POP_TECHNOLOGY_VIEW);
                break;
            }
            case FunctionType.FREE_MONEY: {
                CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO_OPEN_VIEW();
                break;
            }
            case FunctionType.TREASURE:
            case FunctionType.TREASURE_UPGRADE_LEVEL:
            case FunctionType.TREASURE_UPGRADE_STAR:
            case FunctionType.TREASURE_ASSEMBLING_GEMSTONE: {
                Utils.open_view(TASK_UI.TREASURE_MAIN, 0);
                break;
            }
            case FunctionType.GEMSTONE_COMPOSE: {
                Utils.open_view(TASK_UI.TREASURE_MAIN, 1);
                break;
            }
            /**在线奖励 */
            case FunctionType.ONLINE: {
                ActivityProxy.C2S_ONLINE_INFO_OPEN_VIEW();
                break;
            }
            /**限时活动 */
            case FunctionType.GIFTBAG: {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTBAG);
                break;
            }
            /**限时商城 */
            case FunctionType.GIFTSHOP: {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP);
                break;
            }
            case FunctionType.GENERAL:
            case FunctionType.GENERAL_LEVELUP:
            case FunctionType.GENERAL_STAR:
            case FunctionType.GENERAL_SKILL:
            case FunctionType.GENERAL_TREASURE:
            case FunctionType.GENERAL_FATE: {
                Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
                break;
            }
            case FunctionType.HEAD_QUARTERS: {
                HeadQuartersProxy.send_HQ_GET_INFO();
                break;
            }
            case FunctionType.HISTORY_WAR: {
                HistoryBattleProxy.C2S_GET_HISTORY_WAR_INFO();
                break;
            }
            case FunctionType.EQUIPMENT:
            case FunctionType.EQUIPMENT_STENG:
            case FunctionType.EQUIPMENT_GRADE:
            case FunctionType.EQUIPMENT_WROUGH: { //锻造
                Utils.open_view(TASK_UI.POP_EQUIP_MAIN_WND);
                break;
            }
            case FunctionType.ARMEY: { //兵备
                Utils.open_view(TASK_UI.ARMS_PANEL);
                break;
            }
            case FunctionType.CAMP: { //布阵
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.NONE });
                break;
            }
            /**重生 */
            case FunctionType.REBIRTH: {
                Utils.open_view(TASK_UI.REBIRTH_WND);
                break;
            }
            /**国战预告 */
            case FunctionType.WORLD_NOTICE: {
                Utils.open_view(TASK_UI.POP_WORLD_NOTICE_VIEW);
                break;
            }
            case FunctionType.CROSS_SERVER: { //跨服赛
                CrossModel.openCrossServerDetail();
                // Utils.open_view(TASK_UI.POP_WORLD_NOTICE_VIEW);
                break;
            }
            case FunctionType.DAILY_SURPRISE: { //每日惊喜
                Utils.open_view(TASK_UI.POP_DAILY_SURPRISE);
                break;
            }
            default: {
            }
        }
    };
    /**活动按钮 */
    FunctionModel.createActivityIconWidget = function (id) {
        var btnCfg = C.FunctionBtnConfig[id];
        if (btnCfg == null)
            return;
        return this.createActivityWidget(id, true);
    };
    /**功能按钮 */
    FunctionModel.createFuncIconWidget = function (btnId, isOpenEvt) {
        if (isOpenEvt === void 0) { isOpenEvt = true; }
        return this.createSingleWidget(btnId, isOpenEvt);
    };
    /**创建通用widget */
    FunctionModel.createSingleWidget = function (btnId, isOpenEvt) {
        if (isOpenEvt === void 0) { isOpenEvt = false; }
        var widget = new com_main.FunctonSimpleWidget();
        widget.initWidget(btnId, isOpenEvt);
        return widget;
    };
    /**创建活动widget */
    FunctionModel.createActivityWidget = function (btnId, isOpenEvt) {
        if (isOpenEvt === void 0) { isOpenEvt = false; }
        var widget = new com_main.FunctionActiWidget();
        widget.initWidget(btnId, isOpenEvt);
        return widget;
    };
    // 功能预告配置
    FunctionModel.preFuncCfgList = null;
    /**功能开放配置 */
    FunctionModel.funcCfgList = null;
    FunctionModel.preFlag = 0; //预览操作计数
    /**
     * 过滤自动开放功能（由协议返回内容决定）
     * 过滤礼包 限时商城 惊喜商城
     *   */
    FunctionModel.offFuncs = [FunctionType.GIFTBAG, FunctionType.GIFTSHOP, FunctionType.DAILY_SURPRISE, FunctionType.CROSS_SERVER];
    return FunctionModel;
}());
