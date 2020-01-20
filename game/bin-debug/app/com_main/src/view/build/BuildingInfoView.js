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
var com_main;
(function (com_main) {
    // 城内建筑信息面板
    var BuildingInfoView = /** @class */ (function (_super_1) {
        __extends(BuildingInfoView, _super_1);
        function BuildingInfoView(bId) {
            var _this = _super_1.call(this) || this;
            // 当前打开的建筑id
            _this.m_pBuildingId = -1;
            _this.m_pBuildData = null;
            _this.m_pIsAddCallBack = false;
            _this.m_pCurLvCfg = null;
            _this.m_pNextLvCfg = null;
            _this.m_pInit = false;
            _this.name = BuildingInfoView.NAME;
            //this.initApp("map/build/building_info_view.exml");
            _this.initApp("map/build/building_info_newview.exml");
            _this.m_pBuildingId = Number(bId);
            return _this;
        }
        BuildingInfoView.prototype.onDestroy = function () {
            this.m_pCurLvCfg = null;
            this.m_pNextLvCfg = null;
            this.m_pBuildData = null;
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_FAST_UP_LEVEL, this);
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_REFRESH, this);
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_BUILDPANELID, -1);
            this.removeFromCallBack();
            _super_1.prototype.onDestroy.call(this);
        };
        BuildingInfoView.prototype.onExitPanel = function () {
            var id = MainMapModel.popViewId();
            if (id)
                this.changeView(id);
            else
                com_main.UpManager.history();
        };
        BuildingInfoView.prototype.LeveUpFinished = function () {
            this.updateView();
        };
        /**完成快速升级 */
        BuildingInfoView.prototype.onFastLvUpFinish = function (bId) {
            if (bId == this.m_pBuildingId) {
                com_main.UpManager.history();
            }
        };
        BuildingInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateView();
            this.setBuildIcon();
            this.updateTrun();
            this.InitEvent();
            this.m_pInit = true;
            this.m_pTitle.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_pTitle.setExitCallBack(this.onExitPanel, this);
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_BUILDPANELID, this.m_pBuildingId);
            Utils.toStageBestScale(this.m_pViewRoot);
            this.onGuideCondition();
        };
        BuildingInfoView.prototype.onRefresh = function (body) {
            this.updateView();
        };
        BuildingInfoView.prototype.setBuildIcon = function () {
            var tempType = C.BuildingConfig[this.m_pBuildingId].type;
            this.m_pBuildIcon.source = Utils.getMainBuildName(tempType);
            this.m_pBtnLvUp.setCostImg('icon_time_png');
            //this.m_pBuildIcon.source =Utils.getMainBuildName(C.BuildingConfig[this.m_pBuildingId].type);
            // this.m_pBuildIcon.anchorOffsetX = this.m_pBuildIcon.width * 0.5;
            // this.m_pBuildIcon.anchorOffsetY = this.m_pBuildIcon.height * 0.5;
            Utils.isGlow(true, this.m_pBuildIcon, 274571); //
            //this.m_pBuildIcon_1.x = this.p_mBuildIconRoot.x;
            //this.m_pBuildIcon_1.y = this.p_mBuildIconRoot.y;
        };
        BuildingInfoView.prototype.InitEvent = function () {
            this.m_pBtnLvUp["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.m_pBtnLvUp, this, this.onClickLevelup);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnFastFinis, this, this.onClickFastBtn);
            com_main.EventManager.addTouchScaleListener(this.m_pGoFunc, this, this.onClickFuncBtn);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.onBuildLevelUp, this);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_FAST_UP_LEVEL, this.onFastLvUpFinish, this);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_REFRESH, this.reFlashitem, this);
        };
        /**改变升级id */
        BuildingInfoView.prototype.changeBuildingInfo = function (id) {
            if (this.m_pBuildingId == id)
                return;
            if (id == -1)
                id = this.m_pBuildingId;
            else
                MainMapModel.pushViewId(this.m_pBuildingId);
            this.changeView(id);
        };
        BuildingInfoView.prototype.changeView = function (id) {
            com_main.MainMap.moveToBuild(id);
            this.m_pBuildingId = id;
            this.updateView();
            this.setBuildIcon();
        };
        BuildingInfoView.prototype.onBuildLevelUp = function () {
            this.updateView();
            this.setBuildIcon();
        };
        BuildingInfoView.prototype.updateTrun = function () {
            var trunId = C.BuildingConfig[this.m_pBuildingId].TurnPanel;
            this.m_pGoFunc.visible = trunId !== 0;
            if (isNull(trunId) || trunId == 0)
                return;
            this.m_tTurnCfg = C.TurnPanelConfig[trunId];
            this.m_pGoFunc.visible = this.m_tTurnCfg !== null;
            if (isNull(this.m_tTurnCfg))
                return;
            this.m_pGoFuncImg.source = this.m_tTurnCfg.image + "_png";
        };
        BuildingInfoView.prototype.updateView = function () {
            this.m_pBuildData = MainMapModel.getBuildInfo(this.m_pBuildingId);
            if (this.m_pBuildData != null) {
                this.m_pCurLvCfg = this.getBuildingCfg(this.m_pBuildData.type, this.m_pBuildData.level);
                this.m_pNextLvCfg = this.getBuildingCfg(this.m_pBuildData.type, this.m_pBuildData.level + 1);
                this.setBtnContent();
                this.updateViewInfo();
            }
        };
        BuildingInfoView.prototype.setBtnContent = function () {
            var font = GCode(CLEnum.LEVEL_UP);
            if (this.m_pCurLvCfg.level == 0) {
                font = GCode(CLEnum.CITY_BD_BUILD);
            }
            this.m_pBtnLvUp.setTitleLabel(font);
        };
        BuildingInfoView.prototype.updateViewInfo = function () {
            if (this.m_pCurLvCfg) {
                this.validateNow();
                this.SetTitle();
                this.SetLevelText();
                this.SetLevelUpConditions();
                this.SetLevelUpEffect();
                this.SetButton();
            }
        };
        BuildingInfoView.prototype.SetTitle = function () {
            //MainMap.moveToBuildByOffest(this.m_pBuildingId);
            var titleStr = GLan(C.BuildingConfig[this.m_pBuildingId].name);
            this.m_pTitle.setTitleName(titleStr + GCode(CLEnum.LEVEL_UP));
            this.m_pLbBuildName.text = titleStr;
            this.m_pLbCurLv.text = GCode(CLEnum.LEVEL2) + " " + this.m_pBuildData.level;
        };
        //new 
        //设置等级文本
        BuildingInfoView.prototype.SetLevelText = function () {
            this.m_pLbNextLv.text = GCode(CLEnum.CITY_BD_LV_NEXT) + this.m_pNextLvCfg.level;
        };
        //设置升级条件
        BuildingInfoView.prototype.SetLevelUpConditions = function () {
            var dataArr = [];
            if (MainMapModel.isFullQueue) {
                var ids = MainMapModel.getBuildIdQueue();
                if (ids) {
                    for (var index = 0; index < ids.length; index++) {
                        dataArr.push(new com_main.LvUpConditionsBuildQueueInfo(ids[index]));
                        if (ids[index] == this.m_pBuildingId) {
                            dataArr = [];
                            break;
                        }
                    }
                }
            }
            //条件 
            //解析配置表
            var datas = StringUtils.keyValsToNumberArray(this.m_pCurLvCfg.conditions);
            if (datas) {
                for (var key in datas) {
                    var data = datas[key];
                    if (data.key == 0) {
                        dataArr.push(new com_main.LvUpConditionsMonarchInfo(data.value));
                    }
                    else {
                        dataArr.push(new com_main.LvUpConditionsBuildInfo(data.key, data.value));
                    }
                }
            }
            //材料
            var consumes = Utils.parseCommonItemJson(this.m_pCurLvCfg.consumes);
            if (consumes) {
                for (var i = 0; i < consumes.length; i++) {
                    dataArr.push(new com_main.LvUpConditionsBaseInfo(consumes[i].itemId, consumes[i].count));
                }
            }
            this.conditionList = dataArr;
            this.m_pbuidltion = new eui.ArrayCollection(dataArr);
            this.m_materialList.itemRenderer = com_main.com_levelup_conditions_cell; //building_conditions_cell;
            this.m_materialList.dataProvider = this.m_pbuidltion;
        };
        /**刷新列表数据 */
        BuildingInfoView.prototype.reFlashitem = function (info) {
            for (var i = 0; i < this.m_pbuidltion.source.length; i++) {
                this.m_pbuidltion.replaceItemAt(this.m_pbuidltion.source[i], i);
            }
        };
        //设置升级效果
        BuildingInfoView.prototype.SetLevelUpEffect = function () {
            this.m_pLbLvUpDesc.text = '';
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_pEffectList.dataProvider = this.m_pCollection;
            this.m_pEffectList.itemRenderer = BuildEffItemRender;
            var sourceList = [];
            var data;
            var currValue;
            var nextValue;
            var dec;
            if (this.m_pCurLvCfg.buildingType == BuildingType.FUDING) { //聚宝盆
                var arr = [GCode(CLEnum.CITY_BD_JBP_EF1), GCode(CLEnum.CITY_BD_JBP_EF2), GCode(CLEnum.CITY_BD_JBP_EF3)];
                for (var i = 0; i < arr.length; i++) {
                    dec = arr[i];
                    if (i == 0) {
                        currValue = C.ExtraCoinLevelConfig[this.m_pCurLvCfg.level].bonusMoney + '%';
                        nextValue = C.ExtraCoinLevelConfig[this.m_pNextLvCfg.level].bonusMoney + '%';
                    }
                    else if (i == 1) {
                        currValue = C.ExtraCoinLevelConfig[this.m_pCurLvCfg.level].bonusGoldMax + '';
                        nextValue = C.ExtraCoinLevelConfig[this.m_pNextLvCfg.level].bonusGoldMax + '';
                    }
                    else {
                        currValue = Utils.DateUtils.getFormatTime(CornucopiaModel.getCoolTime(), 1);
                        var nextTime = CornucopiaModel.getNextCoolTime(this.m_pNextLvCfg.level);
                        nextValue = Utils.DateUtils.getFormatTime(nextTime, 1);
                    }
                    data = { dec: dec, currValue: currValue, nextValue: nextValue };
                    sourceList.push(data);
                }
            }
            else if (this.m_pCurLvCfg.buildingType == BuildingType.TAVERN) { //酒馆
                dec = GCode(CLEnum.CITY_BD_JG_EF);
                var currCfg = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level);
                var nextCfg = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level + 1);
                var arr = [GCode(CLEnum.CITY_BD_JG_EF), GCode(CLEnum.CITY_BD_JG_CCSX)];
                var currValue_1;
                var nextValue_1;
                for (var i = 0; i < arr.length; i++) {
                    dec = arr[i];
                    if (i == 0) {
                        currValue_1 = Math.floor(currCfg.time / 60) + GCode(CLEnum.MIN);
                        nextValue_1 = Math.floor(nextCfg.time / 60) + GCode(CLEnum.MIN);
                    }
                    else if (i == 1) {
                        currValue_1 = currCfg.maxRes + '';
                        nextValue_1 = nextCfg.maxRes + '';
                    }
                    data = { dec: dec, currValue: currValue_1, nextValue: nextValue_1 };
                    sourceList.push(data);
                }
            }
            else if (MainMapModel.isSoldierBuilding(this.m_pCurLvCfg.buildingType)) { //步兵营，工兵营，骑兵营,枪兵营
                var arr = [GCode(CLEnum.CITY_BD_BY_EF1), GCode(CLEnum.CITY_BD_BY_EF2), GCode(CLEnum.CITY_BD_BY_EF3),
                    GCode(CLEnum.CITY_BD_BY_EF4), GCode(CLEnum.CITY_BD_BY_EF5)];
                for (var i = 0; i < arr.length; i++) {
                    dec = arr[i];
                    data = this.setSoldiersInfo(this.m_pCurLvCfg, this.m_pNextLvCfg, arr[i], i);
                    sourceList.push(data);
                }
            }
            else if (this.m_pCurLvCfg.buildingType == BuildingType.CORNUCOPIA
                || this.m_pCurLvCfg.buildingType == BuildingType.LUNG_TO_COURT
                || this.m_pCurLvCfg.buildingType == BuildingType.AUDIENCE_HALL
                || this.m_pCurLvCfg.buildingType == BuildingType.MINISTRY_DEFENCE) {
                this.m_pLbLvUpDesc.text = this.m_pCurLvCfg.effectDesc;
            }
            else {
                var currCfg = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level);
                var nextCfg = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level + 1);
                var arr = [GLanFormat(this.m_pCurLvCfg.effectDesc), GCode(CLEnum.CITY_INVENTORY)];
                var currValue_2;
                var nextValue_2;
                for (var i = 0; i < arr.length; i++) {
                    dec = arr[i];
                    if (i == 0) {
                        currValue_2 = currCfg.value + '';
                        nextValue_2 = nextCfg.value + '';
                    }
                    else if (i == 1) {
                        currValue_2 = currCfg.maxRes + '';
                        nextValue_2 = nextCfg.maxRes + '';
                    }
                    data = { dec: dec, currValue: currValue_2, nextValue: nextValue_2 };
                    sourceList.push(data);
                }
            }
            this.m_pCollection.replaceAll(sourceList);
        };
        /**设置兵种升级效果显示 */
        BuildingInfoView.prototype.setSoldiersInfo = function (currCfg, nextCfg, decStr, index) {
            var data;
            var trainLvCfg = MainMapModel.getBuildingTrainCfg(currCfg.buildingType, currCfg.level);
            var trainLvCfgNext = MainMapModel.getBuildingTrainCfg(nextCfg.buildingType, nextCfg.level);
            // let baseAttri = StringUtils.keyValsToNumberSer(TeamModel.getTroopsInfo(trainLvCfg.soldiersType).soldierAttribute);
            var currGenCfg = MainMapModel.getSoldierLvCfg(trainLvCfg.soldiersType, currCfg.level);
            var nextGenCfg = MainMapModel.getSoldierLvCfg(trainLvCfgNext.soldiersType, trainLvCfgNext.level);
            var curAttris = StringUtils.keyValsToNumber(currGenCfg.attribute); //当前等级的士兵属性
            var nextAttris = StringUtils.keyValsToNumber(nextGenCfg.attribute);
            if (index == 0) { //兵种
                data = { dec: decStr, currValue: currGenCfg.name, nextValue: nextGenCfg.name };
            }
            else if (index == 1) { //库存上限
                data = { dec: decStr, currValue: (trainLvCfg.storagelimit).toString(), nextValue: (trainLvCfgNext.storagelimit).toString() };
            }
            else if (index == 2) { //攻击力
                data = {
                    dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.ATK),
                    nextValue: Utils.getAttriValByType(nextAttris, AttriType.ATK)
                };
            }
            else if (index == 3) { //防御力
                data = {
                    dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.DEF),
                    nextValue: Utils.getAttriValByType(nextAttris, AttriType.DEF)
                };
            }
            else if (index == 4) { //生命
                data = {
                    dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.HP),
                    nextValue: Utils.getAttriValByType(nextAttris, AttriType.HP)
                };
            }
            return data;
        };
        BuildingInfoView.prototype.SetButton = function () {
            if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
                this.m_pBtnLvUp.visible = false;
                this.m_pBtnFastFinis.x = 273;
            }
            else {
                this.m_pBtnLvUp.visible = true;
                this.m_pBtnFastFinis.x = 161;
            }
            var levelTime = 0;
            var vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;
            var endTime = this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond <= 0 ? 0 : this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond;
            var lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(endTime); //Utils.changeSecondToDay(this.m_pCurLvCfg.upLevelTime*0.001);
            this.m_pBtnLvUp.setCostLabel(lvUpTimeTxt);
            var fastCost = Utils.TimeGold(this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond);
            this.m_pBtnFastFinis.setCostLabel(fastCost !== 0 ? fastCost.toString() : GCode(CLEnum.AC_FREE));
            this.m_pBtnFastFinis.setTitleLabel(GCode(CLEnum.FINISH_SOON));
        };
        BuildingInfoView.prototype.SetBuildTime = function () {
            this.addToCallBack();
        };
        BuildingInfoView.prototype.addToCallBack = function () {
            if (!this.m_pIsAddCallBack) {
                MainMapModel.addCall(this.updateTimer, this, this.m_pBuildingId);
                this.m_pIsAddCallBack = true;
            }
        };
        BuildingInfoView.prototype.updateTimer = function () {
            if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
                var values = MainMapModel.getCountDownValues(this.m_pBuildingId);
                if (values && values.length > 2) {
                    this.m_pBtnFastFinis.setCostLabel(values[1]);
                }
            }
            else {
                this.updateView();
                this.removeFromCallBack();
            }
        };
        BuildingInfoView.prototype.removeFromCallBack = function () {
            if (this.m_pIsAddCallBack) {
                MainMapModel.removeCall(this, this.m_pBuildingId);
                this.m_pIsAddCallBack = false;
            }
        };
        BuildingInfoView.prototype.onClickFuncBtn = function () {
            // let tempType: number = C.BuildingConfig[this.m_pBuildingId].type;
            // this.setCurSoliderType(tempType);
            com_main.UpManager.history();
            var turnPanel = C.BuildingConfig[this.m_pBuildingId].TurnPanel;
            if (isNull(turnPanel))
                return;
            FunctionModel.funcToPanel(turnPanel);
        };
        // public setCurSoliderType(type: number) {
        // 	switch (type) {
        // 		case MBuildType.BBY:
        // 			TeamModel.curSoliderType = SoldierMainType.FOOTSOLDIER;
        // 			break;
        // 		case BuildingType.RIDER_TRAINING_CAMP:
        // 			TeamModel.curSoliderType = SoldierMainType.RIDESOLDIER;
        // 			break;
        // 		case BuildingType.ARCHER_TRAINING_CAMP:
        // 			TeamModel.curSoliderType = SoldierMainType.ARROWSOLDIER;
        // 			break;
        // 	}
        // }
        //元宝升级
        BuildingInfoView.prototype.onClickFastBtn = function () {
            var _this = this;
            for (var index = 0; index < this.conditionList.length; index++) {
                if (!this.conditionList[index].IsMatch)
                    return;
            }
            var content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(this.m_pBuildingId));
            Utils.showConfirmPop(content, function () {
                _this.onClickSure();
            }, this, "style2", LocalModel.DAY_NOTICE_BUILD);
        };
        /**确认元宝升级 */
        BuildingInfoView.prototype.onClickSure = function () {
            var totalPrice = MainMapModel.getBuildingFinishGlod(this.m_pBuildingId);
            var values = MainMapModel.getCountDownValues(this.m_pBuildingId);
            if (values && values.length > 2) {
                // let remainTime = values[2];
                // let totalPrice = this.getSpeedGoldCount();
                if (totalPrice > 0) {
                    if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) {
                        MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
                        MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
                        MainMapProxy.send_BUILDING_SPEED(this.m_pBuildingId, 0, 0, true);
                    }
                }
                else {
                    MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
                    MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
                }
            }
        };
        /** 升级按钮 */
        BuildingInfoView.prototype.onClickLevelup = function () {
            if (MainMapModel.isMaxQueue()) {
                EffectUtils.showTips(GCode(CLEnum.CITY_BD_QUE_MAX), 1, true);
                return;
            }
            // CD中
            if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
                EffectUtils.showTips(GCode(CLEnum.CITY_BD_IN), 1, true);
                return;
            }
            else {
                if (this.m_pCurLvCfg && this.m_pCurLvCfg.level == 0) {
                    MainMapProxy.send_BUILDING_ACTIVATED(this.m_pBuildingId);
                    com_main.UpManager.history();
                }
                else if (this.m_pNextLvCfg) {
                    //材料检测
                    for (var index = 0; index < this.conditionList.length; index++) {
                        if (!this.conditionList[index].IsMatch)
                            return;
                    }
                    MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
                    MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
                }
            }
        };
        BuildingInfoView.prototype.getSpeedGoldCount = function () {
            var totalPrice = 0;
            var values = MainMapModel.getCountDownValues(this.m_pBuildingId);
            if (values && values.length > 2) {
                var remainTime = values[2];
                // 获取的配置已经排序
                var cfgs = MainMapModel.getBuildingCdConfig();
                if (cfgs.length > 0) {
                    var baseValue = 0;
                    var len = cfgs.length;
                    for (var i = 0; i < len; i++) {
                        var cfg = cfgs[i];
                        if (remainTime > cfg.max) {
                            baseValue = cfg.max - baseValue;
                            totalPrice = totalPrice + baseValue * cfg.gold;
                            baseValue = cfg.max;
                        }
                        if (cfg.min <= remainTime && remainTime <= cfg.max) {
                            totalPrice = Math.ceil(totalPrice + (remainTime - baseValue) * cfg.gold);
                            break;
                        }
                    }
                }
            }
            return totalPrice;
        };
        BuildingInfoView.prototype.getBuildingCfg = function (buildingType, level) {
            for (var key in C.BuildingLevelConfig) {
                var cfg = C.BuildingLevelConfig[key];
                if (cfg.buildingType == buildingType && cfg.level == level) {
                    return cfg;
                }
            }
            return null;
        };
        BuildingInfoView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_BUILDING_ACTIVATED,
                ProtoDef.S2C_BUILDING_UPLEVEL,
                ProtoDef.S2C_BUILDING_SPEED,
                ProtoDef.BUILDING_CLEAN_COOLING,
            ];
        };
        /**处理协议号事件 */
        BuildingInfoView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_ACTIVATED: { // 请求建筑激活
                    this.updateView();
                    break;
                }
                case ProtoDef.S2C_BUILDING_UPLEVEL: { // 请求建筑升级
                    this.m_pBuildData = MainMapModel.getBuildInfo(this.m_pBuildingId);
                    //this.updateBottom();
                    //this.updateButton();
                    com_main.UpManager.history();
                    break;
                }
                case ProtoDef.S2C_BUILDING_SPEED: { // 请求建筑加速
                    if (body.bId == this.m_pBuildingId) {
                        com_main.UpManager.history();
                    }
                    //this.updateView();
                    break;
                }
                case ProtoDef.BUILDING_CLEAN_COOLING: { // 请求金币清除冷却
                    com_main.UpManager.history();
                    break;
                }
            }
        };
        BuildingInfoView.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.POPUP, BuildingInfoView.NAME);
            return obj;
        };
        /**检查新手引导面板条件 */
        BuildingInfoView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.BUILD_LEVEL_WND);
        };
        BuildingInfoView.NAME = "BuildingInfoView";
        BuildingInfoView.NORMAL_BTN_ENTER_X = 186;
        BuildingInfoView.NORMAL_BTN_LEVELUP_X = 556;
        // 每次使用加速锤的数量
        BuildingInfoView.CONSUME_HAMMER_COUNT = 1;
        return BuildingInfoView;
    }(com_main.CView));
    com_main.BuildingInfoView = BuildingInfoView;
    /**
   * @extends eui.ItemRenderer
   */
    var BuildEffItemRender = /** @class */ (function (_super_1) {
        __extends(BuildEffItemRender, _super_1);
        function BuildEffItemRender() {
            return _super_1.call(this) || this;
        }
        BuildEffItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BuildEffItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_buildItem = new com_main.buildItemRender();
            this.addChild(this.m_buildItem);
        };
        BuildEffItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_buildItem.setInfo(this.m_tData.dec, String(this.m_tData.currValue), String(this.m_tData.nextValue));
        };
        return BuildEffItemRender;
    }(eui.ItemRenderer));
    com_main.BuildEffItemRender = BuildEffItemRender;
})(com_main || (com_main = {}));
