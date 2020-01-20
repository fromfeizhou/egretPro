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
     * 加速面板相关
     */
    var SpeedUpView = /** @class */ (function (_super_1) {
        __extends(SpeedUpView, _super_1);
        function SpeedUpView(data) {
            var _this = _super_1.call(this) || this;
            _this.timeImageWidth = 100;
            _this.warningTime = 10;
            _this.freeTime = 0;
            _this.curEndTime = 0;
            _this.curStartTime = 0;
            _this.curSpeedUpTime = 0;
            _this.speedUpTime = 0;
            _this.speedUpPropNum = 0;
            _this.isShowEffect = false;
            _this.m_curSliderValue = 1;
            _this.cityId = -1;
            _this.curType = data.propSpeedType;
            _this.curStartTime = data.startTime;
            _this.curEndTime = data.endTime;
            _this.curId = data.targetId;
            _this.name = SpeedUpView.NAME;
            _this.curSpeedUpTime = data.speedUpTime;
            _this.cityId = data.cityId;
            var id = MainMapModel.popViewId();
            _this.initApp("speed_up/SpeedUpViewSkin.exml");
            return _this;
        }
        SpeedUpView.prototype.listenerProtoNotifications = function () {
            switch (this.curType) {
                case PropSpeedType.Build:
                    return [ProtoDef.S2C_BUILDING_SPEED];
                case PropSpeedType.Soldier:
                    return [ProtoDef.S2C_TRAINING_SPEED];
                case PropSpeedType.Technology:
                    return [ProtoDef.S2C_TECHNOLOGY_SPEEDUP];
                case PropSpeedType.WorldGather:
                    return [ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN, ProtoDef.S2C_WORLDMAP_EVENT_OVER];
                case PropSpeedType.WorldVisit:
                    return [ProtoDef.S2C_VISIT_CD_SPEED];
                case PropSpeedType.CityBuild:
                    return [ProtoDef.S2C_CITY_MADE_SPEED];
            }
            return [];
        };
        /**处理协议号事件 */
        SpeedUpView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            var isClose = true;
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_SPEED: {
                    var bId = body.bId;
                    if (MainMapModel.isInBuilding(bId)) {
                        var info = MainMapModel.getBuildInfo(bId);
                        this.curEndTime = info.buildEndTime;
                        this.curStartTime = info.buildStartTime;
                        this.curSpeedUpTime = info.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TRAINING_SPEED: {
                    var bId = body.bId;
                    if (MainMapModel.isInTrain(bId)) {
                        var info = MainMapModel.getTrainArmyVoById(bId);
                        this.curEndTime = info.endTime;
                        this.curStartTime = info.startTime;
                        this.curSpeedUpTime = info.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TECHNOLOGY_SPEEDUP: {
                    if (TechnoModel.isInLevelCd()) {
                        var info = TechnoModel.getTimeData();
                        this.curEndTime = info.end;
                        this.curStartTime = info.start;
                        this.curSpeedUpTime = info.speed;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: {
                    isClose = true;
                } //事件完成
                case ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN: { //采集加速
                    var evtVo = WorldModel.getEventVoByPosId(this.curId);
                    if (evtVo) {
                        //事件时间采用单位为秒 需转换
                        this.curEndTime = evtVo.userMapEventData.endTime;
                        this.curStartTime = evtVo.userMapEventData.startTime;
                        this.curSpeedUpTime = evtVo.userMapEventData.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                    }
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: { //拜访加速
                    var visitVo = WorldModel.getVisitEventById(this.curId);
                    var visCfg = C.VisitConfig[visitVo.visitId];
                    var curEndTime = visitVo.refreshStamp + visCfg.cooling;
                    if (visitVo) {
                        //事件时间采用单位为秒 需转换
                        this.curEndTime = curEndTime;
                        this.curStartTime = visitVo.refreshStamp;
                        this.curSpeedUpTime = visitVo.speed;
                        var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
                        if (lefttime > 0) {
                            this.setSpeedUpCellList();
                            this.showEffect();
                            isClose = false;
                        }
                        else {
                            isClose = true;
                        }
                    }
                    break;
                }
                case ProtoDef.S2C_CITY_MADE_SPEED:
                    { //城市建筑加速
                        var mi = body.playerMadeInfo;
                        CityBuildModel.initPlayerMadeInfo(mi);
                        var info = CityBuildModel.getCityInfo(this.curId);
                        if (info.isBuilding()) {
                            this.curEndTime = info.endDate;
                            this.curStartTime = info.startDate;
                            this.curSpeedUpTime = info.speedTime;
                            var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
                            if (lefttime > 0) {
                                this.setSpeedUpCellList();
                                this.showEffect();
                                isClose = false;
                            }
                            else {
                                isClose = true;
                            }
                        }
                    }
                    break;
            }
            if (isClose)
                com_main.UpManager.history();
        };
        SpeedUpView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.timeCallback, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        SpeedUpView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBtnGoto.setTitleLabel(GCode(CLEnum.SOURCE_PATH));
            this.m_pBtnUse.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_pBtnFast.setTitleLabel(GCode(CLEnum.FINISH_SOON));
            this.timeImageWidth = this.m_pImageProgress.width;
            this.m_pImageProgress.width = 0;
            this.m_pImageProgress2.width = 0;
            this.m_pNum.text = "0";
            this.setTitle();
            this.initEvent();
            this.initView();
            this.validateNow();
            this.onGuideCondition();
        };
        SpeedUpView.prototype.setTitle = function () {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.CITY_BD_UP));
                    break;
                }
                case PropSpeedType.Soldier: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.ARMY_TRAIN));
                    break;
                }
                case PropSpeedType.Technology: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.TEC_UP));
                    break;
                }
                case PropSpeedType.WorldGather: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.WOR_CO_ACC));
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.WOR_VIS_RE));
                    break;
                }
                case PropSpeedType.CityBuild: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.CITY_BUILD_TITLE));
                    break;
                }
            }
        };
        SpeedUpView.prototype.initEvent = function () {
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnFast, this, this.onClickFast);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnUse, this, this.onClickUse);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGoto, this, this.onClickGoto);
            /**资源更新 */
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
        };
        SpeedUpView.prototype.onClickGoto = function () {
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.TREASURE);
            // EffectUtils.showTips("功能未开放", 1, true);
        };
        SpeedUpView.prototype.initView = function () {
            this.setSpeedUpCellList();
            this.initTime();
            // this.speedUpPropNum = this.getPropUseMaxNum();
            // this.updateSlider();
        };
        /**资源更新 */
        SpeedUpView.prototype.onRoleResource = function () {
            this.setSpeedUpCellList();
        };
        SpeedUpView.prototype.initTime = function () {
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        //时间回调
        SpeedUpView.prototype.timeCallback = function () {
            var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            if (lefttime <= 0) {
                com_main.UpManager.history();
                com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_REFRESH, null);
                return;
            }
            this.m_pBtnFast.setCostLabel(Utils.TimeGold(lefttime) != 0 ? Utils.TimeGold(lefttime).toString() : GCode(CLEnum.AC_FREE));
            this.setImageProgerss(this.m_pImageProgress, this.timeImageWidth, this.curStartTime, this.curEndTime, this.curSpeedUpTime, this.m_pLbCurTime);
            this.setImageProgerss(this.m_pImageProgress2, this.timeImageWidth, this.curStartTime, this.curEndTime, this.curSpeedUpTime, null, this.speedUpTime);
        };
        SpeedUpView.prototype.setImageProgerss = function (progressImage, imageWidth, startTime, endTime, speedUpTime, timeText, addtionTime) {
            if (addtionTime === void 0) { addtionTime = 0; }
            var stime = startTime;
            var etime = endTime;
            var spTime = speedUpTime + addtionTime;
            var dataInfo = Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000, false);
            var tempWidth = Number(dataInfo[0]) * imageWidth;
            if (timeText) {
                timeText.text = dataInfo[1] + "";
                if (this.isShowEffect) //播放特效的时候蓝色进度条不随时间移动
                    return;
            }
            progressImage.width = tempWidth > imageWidth ? imageWidth : tempWidth;
        };
        //设置道具列表
        SpeedUpView.prototype.setSpeedUpCellList = function () {
            var _this = this;
            this.curPropList = [];
            this.speedUpTime = 0;
            this.curSelectItem = null;
            var tempList = PropModel.getPropItemListByAllType(PropMainType.SPEED, PropSpeedType.All, false);
            tempList = tempList.concat(PropModel.getPropItemListByAllType(PropMainType.SPEED, this.curType, false));
            for (var index = 0; index < tempList.length; index++) {
                this.curPropList.push(tempList[index].itemId);
            }
            Utils.removeAllChild(this.m_pCellRoot);
            if (this.curPropList.length == 0) {
                this.setNotPropState(true);
                return;
            }
            else
                this.setNotPropState(false);
            this.sortPropList();
            this.curSelectPropId = this.curPropList[0];
            for (var index = 0; index < this.curPropList.length; index++) {
                var infoId = this.curPropList[index];
                var setSelect = (this.curSelectPropId == infoId);
                var cell = new com_main.SpeedUpCell(infoId, setSelect);
                cell.onClick = function (item) {
                    _this.onClickCell(item);
                };
                this.m_pCellRoot.addChild(cell);
                if (setSelect) {
                    this.onClickCell(cell);
                }
            }
            this.m_pScrller.viewport.scrollH = 0;
        };
        //排序道具
        SpeedUpView.prototype.sortPropList = function () {
            if (this.curPropList == null || this.curPropList.length == 0)
                return;
            var hasNotComType = false;
            this.curPropList.sort(function (a, b) {
                var cfgA = C.QuickenConfig[a];
                var cfgB = C.QuickenConfig[b];
                if (cfgA.type != PropSpeedType.All || cfgB.type != PropSpeedType.All)
                    hasNotComType = true;
                if (cfgA.type != cfgB.type) {
                    return cfgB.type - cfgA.type;
                }
                else if (cfgA.reduceTime != cfgB.reduceTime) {
                    return cfgB.reduceTime - cfgA.reduceTime;
                }
                return 0;
            });
            var curtime = TimerUtils.getServerTime();
            var needTime = this.curEndTime - curtime - this.curSpeedUpTime;
            //选择一个最优的放最前面，其他不变
            var minTime = Number.MAX_VALUE;
            var tempIndex = -1;
            for (var index = 0; index < this.curPropList.length; index++) {
                var id = this.curPropList[index];
                var cfg = C.QuickenConfig[id];
                if (hasNotComType) //有非通用类型只排通用类型
                 {
                    if (cfg.type == PropSpeedType.All)
                        continue;
                }
                var difference = needTime - cfg.reduceTime / 1000;
                if (difference >= 0) {
                    if (minTime >= difference) {
                        minTime = difference;
                        tempIndex = index;
                    }
                }
            }
            if (tempIndex == -1) { //拿最后一个 消耗最小
                for (var index = this.curPropList.length - 1; index >= 0; index--) {
                    var cfg = C.QuickenConfig[this.curPropList[index]];
                    if (hasNotComType) {
                        if (cfg.type != PropSpeedType.All) {
                            tempIndex = index;
                            break;
                        }
                    }
                    else {
                        tempIndex = index;
                        break;
                    }
                }
            }
            if (tempIndex != -1) {
                var tempId = this.curPropList[tempIndex];
                this.curPropList.splice(tempIndex, 1);
                this.curPropList.unshift(tempId);
            }
        };
        //点击道具
        SpeedUpView.prototype.onClickCell = function (item) {
            if (this.curSelectItem == item)
                return;
            if (this.curSelectItem)
                this.curSelectItem.SelectState = false;
            item.SelectState = true;
            this.curSelectItem = item;
            this.curSelectPropId = item.PropId;
            this.curSelectPropCfg = C.QuickenConfig[item.PropId];
            this.speedUpPropNum = this.getPropUseMaxNum();
            this.m_slider.maximum = this.speedUpPropNum;
            this.updateSlider();
        };
        //获取可以使用的最大数量
        SpeedUpView.prototype.getPropUseMaxNum = function () {
            if (this.curPropList.length == 0) {
                return 0;
            }
            var needTime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            var curTime = 0;
            var tempNum = 0;
            while (needTime > curTime && tempNum < PropModel.getPropNum(this.curSelectPropId)) {
                tempNum++;
                curTime = this.curSelectPropCfg.reduceTime / 1000 * tempNum;
            }
            if (this.curSelectPropCfg.reduceTime / 1000 * tempNum > needTime)
                tempNum--;
            tempNum = tempNum < 1 ? 1 : tempNum;
            return tempNum;
        };
        //减道具
        SpeedUpView.prototype.onClickSub = function () {
            this.speedUpPropNum--;
            if (this.speedUpPropNum < 1) {
                this.speedUpPropNum = 1;
                return;
            }
            this.updateSlider();
        };
        /**
         * 加道具
         */
        SpeedUpView.prototype.onClickAdd = function () {
            this.speedUpPropNum++;
            if (this.speedUpPropNum > this.getPropUseMaxNum()) { //PropModel.getPropNum(this.curSelectPropId)) {
                this.speedUpPropNum = this.getPropUseMaxNum();
                return;
            }
            this.updateSlider();
        };
        //滑动滑块
        SpeedUpView.prototype.onchangSlider = function (event) {
            var values = event.currentTarget.value;
            if (values < 1) {
                values = 1;
            }
            this.speedUpPropNum = Math.floor(values);
            this.updateSlider();
        };
        //刷新时间显示
        SpeedUpView.prototype.updateSlider = function () {
            this.m_slider.value = this.speedUpPropNum;
            this.m_pNum.text = this.speedUpPropNum + "";
            this.speedUpTime = this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum;
            this.m_pLbSpeedUpTime.text = Utils.DateUtils.getCountdownStrByCfg(this.speedUpTime * 1000) + "";
            this.timeCallback();
        };
        //立刻完成
        SpeedUpView.prototype.onClickFast = function () {
            var leftTime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            var totalPrice = Utils.TimeGold(leftTime);
            if (!PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) {
                return;
            }
            var content = GCodeFromat(CLEnum.CITY_BD_SPEED, totalPrice);
            Utils.showConfirmPop(content, this.onConfirmFast, this, "style2", LocalModel.DAY_NOTICE_BUILD);
        };
        SpeedUpView.prototype.onClickUse = function () {
            if (this.speedUpPropNum == 0 || this.curSelectPropId == 0) {
                EffectUtils.showTips(GCode(CLEnum.CITY_NOT_ITEM), 1, true);
                return;
            }
            var time = TimerUtils.getServerTime();
            time = this.curEndTime - time - this.curSpeedUpTime;
            var moreTime = Math.floor(((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) - time) / 60); //使用加速道具剩余的时间
            // if ((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) - time > this.warningTime * 60 ) {
            if ((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) > time) {
                // let content = "你选择加速的时间大于计时器中的剩余时间" + moreTime + "分钟以上，确认使用？";
                var content = GCodeFromat(CLEnum.CITY_SP_TIME, moreTime);
                Utils.showConfirmPop(content, this.onConfirmClickUse, this);
            }
            else {
                this.onConfirmClickUse();
            }
        };
        SpeedUpView.prototype.onConfirmClickUse = function () {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    MainMapProxy.send_BUILDING_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.Soldier: {
                    SoldierProxy.send_C2S_TRAINING_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.Technology: {
                    TechnologyProxy.C2S_TECHNOLOGY_SPEEDUP(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.WorldGather: {
                    WorldProxy.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    WorldProxy.C2S_VISIT_CD_SPEED(this.curId, false, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.CityBuild: {
                    if (CityBuildModel.unOwnerCity(this.curId)) {
                        com_main.UpManager.history();
                        break;
                    }
                    CityBuildProxy.C2S_CITY_MADE_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                default: {
                }
            }
        };
        //立刻完成
        SpeedUpView.prototype.onConfirmFast = function () {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    MainMapProxy.send_BUILDING_SPEED(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.Soldier: {
                    SoldierProxy.send_C2S_TRAINING_SPEED(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.Technology: {
                    TechnologyProxy.C2S_TECHNOLOGY_SPEEDUP(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.WorldGather: {
                    WorldProxy.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    WorldProxy.C2S_VISIT_CD_SPEED(this.curId, true, 0, 0);
                    break;
                }
                case PropSpeedType.CityBuild: {
                    if (CityBuildModel.unOwnerCity(this.curId)) {
                        com_main.UpManager.history();
                        break;
                    }
                    CityBuildProxy.C2S_CITY_MADE_SPEED(this.curId, 0, 0);
                    break;
                }
                default: {
                }
            }
        };
        SpeedUpView.prototype.setNotPropState = function (isHide) {
            this.m_slider.maximum = 0;
            this.m_pLbSpeedUpTime.text = "00:00:00";
            this.speedUpPropNum = 0;
            this.curSelectPropId = 0;
            this.m_pNotPropTips.visible = isHide;
            this.timeCallback();
        };
        SpeedUpView.prototype.showEffect = function () {
            var _this = this;
            this.isShowEffect = true;
            this.touchChildren = false;
            var target = this.m_pImageProgress2.width;
            Tween.get(this.m_pImageProgress).to({ width: target }, 400, egret.Ease.sineIn).call(function () {
                _this.isShowEffect = false;
                _this.touchChildren = true;
            });
        };
        /**检查新手引导面板条件 */
        SpeedUpView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SPEED_WND);
        };
        SpeedUpView.NAME = 'SpeedUpView';
        return SpeedUpView;
    }(com_main.CView));
    com_main.SpeedUpView = SpeedUpView;
})(com_main || (com_main = {}));
