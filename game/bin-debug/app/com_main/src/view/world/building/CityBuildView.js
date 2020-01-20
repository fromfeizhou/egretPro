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
    /**
     * 城池建设
     */
    var CityBuildView = /** @class */ (function (_super_1) {
        __extends(CityBuildView, _super_1);
        function CityBuildView(cityId) {
            var _this = _super_1.call(this) || this;
            // 数据
            _this.m_cityId = -1;
            _this.m_tCurCfg = null;
            _this.m_tNextCfg = null;
            _this.m_nLevel = 1;
            _this.curEndTime = 0;
            _this.curSpeedUpTime = 0;
            _this.name = CityBuildView.NAME;
            _this.initApp("world/building/CityBuildViewSkin.exml");
            _this.m_cityId = Number(cityId);
            CityBuildModel.curCityId = cityId;
            return _this;
        }
        CityBuildView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CITY_MADE_INFO,
                ProtoDef.S2C_CITY_MADE,
                ProtoDef.S2C_CITY_MADE_SPEED,
                ProtoDef.S2C_CITY_MADE_REWARD
            ];
        };
        CityBuildView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_MADE_INFO: {
                    this.refreshListGeneral();
                    // this.updateCitySvData();
                    break;
                }
                case ProtoDef.S2C_CITY_MADE: {
                    this.refreshListGeneral();
                    break;
                }
                case ProtoDef.S2C_CITY_MADE_SPEED: {
                    this.refreshListGeneral();
                    // 特效
                    this.showUpGradeEffect();
                    break;
                }
                case ProtoDef.S2C_CITY_MADE_REWARD: {
                    // this.updateGeneralExp();
                    break;
                }
                default:
                    break;
            }
        };
        CityBuildView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CityBuildView.prototype.onDestroy = function () {
            this.m_cityId = -1;
            this.m_preGeneralId = null;
            this.m_curGeneralVO = null;
            this.curEndTime = 0;
            this.curSpeedUpTime = 0;
            this.m_tCurCfg = null;
            Utils.TimerManager.remove(this.timeCallback, this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CityBuildView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.CITY_BUILD_TITLE));
            this.m_pListGeneralDP = new eui.ArrayCollection([]);
            this.m_listGeneral.itemRenderer = com_main.GeneralCell;
            this.m_listGeneral.dataProvider = this.m_pListGeneralDP;
            this.addEvent();
            // this.refreshView();
            this.refreshListGeneral();
        };
        CityBuildView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnFastFinis, this, this.onClickFastBtn);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnLvUp, this, this.onClickLevelup);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnReward, this, this.onClickReward);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnFast, this, this.onClickFast);
            this.m_listGeneral.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this.onBuildHeroDel, this);
        };
        CityBuildView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            this.m_listGeneral.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this);
        };
        CityBuildView.prototype.onBuildHeroDel = function (cityId) {
            if (cityId == this.m_cityId && !WorldModel.isOwnerCity(cityId)) {
                com_main.UpManager.close();
            }
        };
        /**更新已招募的武将 */
        CityBuildView.prototype.refreshListGeneral = function () {
            var _this = this;
            var curBuildGeneral = null; // 当前在建设或者建设完成的武将
            var list = CityBuildModel.getRecruitedGeneral();
            list.forEach(function (v, i, a) {
                var cityId = CityBuildModel.getBuildGenCityId(v.generalId);
                if (cityId > 0) {
                    var info = CityBuildModel.getCityInfo(cityId);
                    v.cityBuildState = info.cityBuildState;
                    if (cityId == _this.m_cityId)
                        curBuildGeneral = v;
                }
                else {
                    v.cityBuildState = CityBuildEnum.FREE;
                }
            });
            SortTools.MoreKeysSorter(list, ["cityBuildState", "level", "quality"], [ArraySort.UPPER, ArraySort.LOWER, ArraySort.LOWER]);
            this.m_pListGeneralDP.replaceAll(list);
            // 第二次排序 当前在建设状态的城池武将排在最前面
            var sIndex = this.m_pListGeneralDP.getItemIndex(curBuildGeneral);
            if (sIndex > 0 /*-1 && this.m_pListGeneralDP.length > 1*/) {
                this.m_pListGeneralDP.removeItemAt(sIndex);
                this.m_pListGeneralDP.addItemAt(curBuildGeneral, 0);
            }
            var index = this.m_curGeneralVO ? this.m_pListGeneralDP.getItemIndex(this.m_curGeneralVO) : 0;
            this.m_listGeneral.selectedIndex = index;
            if (unNull(list[index]))
                this.updateListItemView(list[index]);
        };
        /**更新界面 */
        CityBuildView.prototype.refreshView = function () {
            if (isNull(this.m_cityId) || this.m_cityId == -1)
                return;
            if (CityBuildModel.unOwnerCity(this.m_cityId)) {
                com_main.UpManager.history();
                return;
            }
            var cityConfig = WorldModel.getCityConfig(this.m_cityId);
            this.m_imgCity.source = cityConfig.icon + "_png";
            this.m_labCName.text = WorldModel.getCityName(cityConfig.id);
        };
        //元宝升级
        CityBuildView.prototype.onClickFastBtn = function () {
            if (CityBuildModel.unOwnerCity(this.m_cityId)) {
                com_main.UpManager.history();
                return;
            }
            var sumExp = this.m_tCityInfo ? this.m_tCityInfo.sumExp : CityBuildModel.sumExp;
            // 下一级检测
            if (sumExp >= this.m_tNextCfg.sumExp) {
                EffectUtils.showTips(GCode(CLEnum.TEC_LEVEL_MAX));
                return;
            }
            // 材料检测
            var itemCosts = this.m_tCurCfg.costs;
            for (var i = 0; i < itemCosts.length; i++) {
                var info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
                if (!info3.IsMatch)
                    return;
            }
            var content = GCodeFromat(CLEnum.CITY_BD_SPEED, CityBuildModel.getCityBuildFinishGold(this.m_cityId));
            Utils.showConfirmPop(content, this.onClickSure, this, "style2", LocalModel.DAY_NOTICE_CITY_BUILD);
        };
        /**确认元宝升级 */
        CityBuildView.prototype.onClickSure = function () {
            var totalPrice = CityBuildModel.getCityBuildFinishGold(this.m_cityId);
            if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 2)) {
                CityBuildProxy.C2S_CITY_MADE(this.m_preGeneralId, this.m_cityId, true);
                // 特效
                this.showUpGradeEffect();
            }
        };
        /** 升级按钮 */
        CityBuildView.prototype.onClickLevelup = function () {
            if (CityBuildModel.unOwnerCity(this.m_cityId)) {
                com_main.UpManager.history();
                return;
            }
            var pInfo = CityBuildModel.getCityInfo(this.m_cityId);
            if (pInfo && pInfo.isBuilding()) {
                EffectUtils.showTips(GCode(CLEnum.CITY_BD_IN));
                return;
            }
            var sumExp = this.m_tCityInfo ? this.m_tCityInfo.sumExp : CityBuildModel.sumExp;
            // 下一级检测
            if (sumExp >= this.m_tNextCfg.sumExp) {
                EffectUtils.showTips(GCode(CLEnum.TEC_LEVEL_MAX));
                return;
            }
            // 材料检测
            var itemCosts = this.m_tCurCfg.costs;
            for (var i = 0; i < itemCosts.length; i++) {
                var info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
                if (!info3.IsMatch)
                    return;
            }
            CityBuildProxy.C2S_CITY_MADE(this.m_preGeneralId, this.m_cityId, false);
        };
        /**领取奖励 */
        CityBuildView.prototype.onClickReward = function () {
            var vo = CityBuildModel.getCityInfo(this.m_cityId);
            CityBuildProxy.C2S_CITY_MADE_REWARD(this.m_cityId, vo.generalId);
        };
        /**加速进度 */
        CityBuildView.prototype.onClickFast = function () {
            if (CityBuildModel.unOwnerCity(this.m_cityId)) {
                com_main.UpManager.history();
                return;
            }
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.CityBuild,
                targetId: this.m_cityId,
                startTime: this.m_tCityInfo.startDate,
                endTime: this.m_tCityInfo.endDate,
                speedUpTime: this.m_tCityInfo.speedTime,
            });
        };
        CityBuildView.prototype.setButton = function (cityId) {
            this.setButtonState(cityId);
            cityId = isNull(cityId) ? this.m_cityId : cityId;
            var cfg = CityBuildModel.getCityMadeConfig(cityId, this.m_nLevel);
            var levelTime = 0;
            // let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;
            var vipSpeedMillSecond = 0;
            var timeCount = cfg.time - vipSpeedMillSecond <= 0 ? 0 : cfg.time - vipSpeedMillSecond; // 配置表总耗时
            var lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(timeCount * 60);
            this.m_pBtnLvUp.setCostLabel(lvUpTimeTxt);
            this.m_pBtnLvUp.setTitleLabel(GCode(CLEnum.CITY_BD_BUILD));
            this.m_pBtnLvUp.setCostImg('icon_time_png');
            var fastCost = Utils.TimeGold((cfg.time - vipSpeedMillSecond) * 60);
            this.m_pBtnFastFinis.setCostLabel(fastCost !== 0 ? fastCost.toString() : GCode(CLEnum.AC_FREE));
            this.m_pBtnFastFinis.setTitleLabel(GCode(CLEnum.FINISH_SOON));
            this.m_labCTips.text = GCode(CLEnum.CITY_BUILD_DONE);
            this.m_pBtnReward.setTitleLabel(GCode(CLEnum.TAKE_OUT) + GCode(CLEnum.REWARD));
            this.m_pBtnFast.setCostImg('icon_time_png');
            this.m_pBtnFast.setTitleLabel(GCode(CLEnum.SPEED_AD));
        };
        CityBuildView.prototype.setButtonState = function (cityId) {
            cityId = isNull(cityId) ? this.m_cityId : cityId;
            if (CityBuildModel.hasCityBuildInfo(cityId)) {
                var cityInfo = CityBuildModel.getCityInfo(cityId);
                if (cityInfo.cityBuildState == CityBuildEnum.DONE) {
                    this.m_gFree.visible = false;
                    this.m_gDone.visible = true;
                    this.m_gBuilding.visible = false;
                    Utils.TimerManager.remove(this.timeCallback, this);
                }
                else if (cityInfo.cityBuildState == CityBuildEnum.BUILDING) {
                    this.m_gFree.visible = false;
                    this.m_gDone.visible = false;
                    this.m_gBuilding.visible = true;
                    this.initTime();
                }
                else if (cityInfo.cityBuildState == CityBuildEnum.FREE) {
                    this.m_gFree.visible = true;
                    this.m_gDone.visible = false;
                    this.m_gBuilding.visible = false;
                }
            }
            else {
                this.m_gFree.visible = true;
                this.m_gDone.visible = false;
                this.m_gBuilding.visible = false;
            }
        };
        CityBuildView.prototype.initTime = function () {
            Utils.TimerManager.remove(this.timeCallback, this);
            this.timeCallback();
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        //时间回调
        CityBuildView.prototype.timeCallback = function () {
            this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
            this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;
            var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            var lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
            this.m_pBtnFast.setCostLabel(lvUpTimeTxt);
            if (this.curEndTime > 0 && lefttime <= 0) {
                Utils.TimerManager.remove(this.timeCallback, this);
                // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.m_cityId);
                // CityBuildProxy.C2S_CITY_MADE_INFO(this.m_cityId);
                //主动调用数据层计时器逻辑
                var vo = CityBuildModel.getCityInfo(this.m_cityId);
                if (vo)
                    vo.updateTime();
                this.refreshListGeneral();
                // 特效
                this.showUpGradeEffect();
            }
        };
        CityBuildView.prototype.onTouchTab = function (e) {
            var item = e.item;
            if (isNull(item) || this.m_preGeneralId === item.generalId)
                return;
            // this.m_curGeneralVO = item;
            this.updateListItemView(item);
        };
        /**更新武将点击显示相关 */
        CityBuildView.prototype.updateListItemView = function (info) {
            this.m_preGeneralId = info.generalId;
            this.m_curGeneralVO = info;
            this.m_labGName.text = GeneralModel.getGeneralName(info.generalId);
            this.m_labGName.textColor = Utils.getColorOfQuality(info.qualityLevel);
            this.refreshViewItem();
        };
        /**更新武将经验 */
        CityBuildView.prototype.updateGeneralExp = function () {
            if (isNull(this.m_pListGeneralDP))
                return;
            var vo = CityBuildModel.getCityInfo(this.m_cityId);
            for (var i = 0; i < this.m_pListGeneralDP.length; i++) {
                if (!this.m_pListGeneralDP.getItemAt(i))
                    continue;
                var item = this.m_pListGeneralDP.getItemAt(i);
                // if (item.generalId == vo.generalId) item.curExp += this.m_tCurCfg.addGeneralExp;
                if (item.generalId == vo.generalId)
                    item.curExp += this.m_tCurCfg.addGeneralExp.count * (C.ExpBookConfig[this.m_tCurCfg.addGeneralExp.itemId].exp);
            }
        };
        CityBuildView.prototype.refreshViewItem = function () {
            var cityInfo = CityBuildModel.getCityInfoByGeneralId(this.m_preGeneralId);
            if (cityInfo && cityInfo.cityBuildState != CityBuildEnum.FREE) {
                this.m_cityId = cityInfo.cityId;
            }
            else {
                this.m_cityId = CityBuildModel.curCityId;
            }
            this.refreshView();
            this.updateCitySvData();
        };
        /**更新奖励道具 */
        CityBuildView.prototype.refreshItems = function () {
            var str0 = GCodeFromat(CLEnum.CITY_BUILD_GEXP, CommonUtils.numOutLenght(this.m_tCurCfg.addGeneralExp.count * (C.ExpBookConfig[this.m_tCurCfg.addGeneralExp.itemId].exp)));
            var str1 = GCodeFromat(CLEnum.CITY_BUILD_MILL, CommonUtils.numOutLenght(this.m_tCurCfg.addMilltory.count));
            var str2 = GCodeFromat(CLEnum.CITY_BUILD_BEXP, CommonUtils.numOutLenght(this.m_tCurCfg.addExp));
            this.m_rcItem0.setIconView('common_prop_5_png', str0);
            this.m_rcItem1.setIconView('common_prop_106_png', str1);
            this.m_rcItem2.setIconView('common_prop_103_png', str2);
        };
        /**刷新消耗 */
        CityBuildView.prototype.refreshCost = function () {
            for (var i = 0; i < 3; i++) {
                var data = this.m_tCurCfg.costs[i];
                var item = this["m_costItem" + i];
                if (data) {
                    item.visible = true;
                    item.setInfo(data.itemId, data.count);
                }
                else {
                    item.visible = false;
                }
            }
        };
        /**刷新等级特权 */
        CityBuildView.prototype.refreshPrivilege = function () {
            // this.m_gEffect.removeChildren();
            var strList = CityBuildModel.getCityPrivilege(this.m_cityId);
            for (var i in strList) {
                var str = strList[i];
                var comp = this.m_gEffect.getElementAt(Number(i));
                if (isNull(comp)) {
                    comp = new com_main.RewardTypeCell();
                    this.m_gEffect.addChild(comp);
                }
                comp.setView(str.str);
            }
        };
        /**建造完成 加速完成 */
        CityBuildView.prototype.showUpGradeEffect = function () {
            var tempName = IETypes.EBuild_UpGrade;
            var EBuild_UpGrade = new MCDragonBones();
            EBuild_UpGrade.initAsync(tempName);
            EBuild_UpGrade.play(tempName, 1, true);
            var tscale = 1.0;
            EBuild_UpGrade.scaleX = EBuild_UpGrade.scaleY = tscale;
            EBuild_UpGrade.x = 205;
            EBuild_UpGrade.y = 100;
            this.m_gCityEffect.addChild(EBuild_UpGrade);
        };
        //===================协议数据 开始==================
        CityBuildView.prototype.updateCitySvData = function () {
            var _a;
            this.m_labTips.text = GCode(CLEnum.CITY_BUILD_TIPS);
            // 当前城池建设信息
            _a = CityBuildModel.getCityExpLevel2(this.m_cityId, CityBuildModel.sumExp), this.m_nLevel = _a[0], this.m_tNextCfg = _a[1];
            if (!this.m_tNextCfg) {
                error("CityMadeConfig cityId not exist!");
                return;
            }
            var cityLevel = this.m_nLevel;
            var cityInfo = CityBuildModel.getCityInfo(this.m_cityId);
            // if (unNull(cityInfo)) this.m_tCityInfo = cityInfo;
            this.m_tCityInfo = cityInfo;
            this.m_labLv.text = GCode(CLEnum.LEVEL2) + cityLevel;
            this.m_labCLv.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BUILD_LEVEL, cityLevel));
            // 进度条
            var curExp = isNull(cityInfo) ? CityBuildModel.sumExp : cityInfo.sumExp;
            var nextExp = this.m_tNextCfg.sumExp;
            var per = curExp / nextExp;
            this.m_imgExpPro.scaleX = per > 1 ? 1 : per;
            this.m_labExpPro.text = GCode(CLEnum.CITY_BUILD_EXP) + ":" + CommonUtils.numOutLenght(curExp) + "/" + CommonUtils.numOutLenght(nextExp);
            this.m_tCurCfg = CityBuildModel.getCityMadeConfig(this.m_cityId, this.m_nLevel);
            // this.refreshListGeneral();
            this.setButton();
            this.refreshItems();
            this.refreshCost();
            this.refreshPrivilege();
        };
        CityBuildView.NAME = "CityBuildView";
        return CityBuildView;
    }(com_main.CView));
    com_main.CityBuildView = CityBuildView;
})(com_main || (com_main = {}));
