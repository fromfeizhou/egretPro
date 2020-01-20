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
    var WorldHeroEvtItem = /** @class */ (function (_super_1) {
        __extends(WorldHeroEvtItem, _super_1);
        function WorldHeroEvtItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nDt = 0;
            _this.m_nMoveDt = 0;
            _this.m_cityName = "";
            _this.m_state = 0;
            _this.skinName = Utils.getSkinName("app/world/WorldHeroEvtItemSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldHeroEvtItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pPanel);
            this.removeEvent();
            Utils.TimerManager.remove(this.update, this);
        };
        WorldHeroEvtItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        WorldHeroEvtItem.prototype.dataChanged = function () {
            this.m_tData = this.data;
            //队伍未解锁
            Utils.isGray(false, this);
            if (this.m_tData.order > TeamModel.getTeamMax(1 /* WORLD */)) {
                this.currentState = "lock";
                return;
            }
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_tData.order);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;
            }
            this.currentState = "base";
            var info = teamVo.getTeamUiInfo();
            this.m_pLbAmry.text = GCode(CLEnum.ARMY) + Global.getNumber(Number(this.m_tData.order + 1));
            this.m_pLbName.text = GeneralModel.getGeneralName(info.headId);
            this.m_pHeroHead.setGenId(info.headId);
            // this.m_pFight.text = `${info.fight}`;
            this.m_comFightItem.setFight(info.fight);
            var state = WorldModel.getTeamEvtTypeById(teamVo.id);
            this.m_state = state;
            var eventVo = WorldModel.getTeamEvtById(teamVo.id);
            this.m_pLbCity.text = WorldModel.getEventDes(state);
            Utils.isGray(true, this.m_pGay);
            if (state == WorldEventType.NONE)
                Utils.isGray(false, this);
            var cityname = "";
            if (eventVo) {
                cityname = WorldModel.getCityName(eventVo.coordCfg.cityId);
                this.m_nTeamOldEvt = eventVo.eventCoordinatesId;
            }
            else {
                cityname = WorldModel.getCityName(teamVo.cityId);
                this.m_nTeamOldEvt = 0;
            }
            this.m_cityName = cityname;
            Utils.isGray(false, this.m_pGay);
            this.m_posBtn.visible = true;
            switch (state) {
                case WorldEventType.NONE: {
                    var desc = cityname + "-<font color=0x44d0f3>" + WorldModel.getEventDes(state) + "</font>";
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case WorldEventType.MOVE: {
                    Utils.TimerManager.remove(this.updateMove, this);
                    var clientEvo = WorldModel.getClientMoveByTeamId(teamVo.id);
                    var dt = clientEvo.endTime - TimerUtils.getServerTime();
                    dt = Math.max(0, dt);
                    this.m_nMoveDt = dt;
                    if (this.m_nMoveDt > 0) {
                        var desc = "" + WorldModel.getEventDes(state) + Utils.DateUtils.getFormatBySecond(dt, 1);
                        this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                        Utils.TimerManager.doTimer(1000, this.m_nMoveDt + 1, this.updateMove, this);
                        Utils.isGray(true, this.m_pGay);
                        this.m_posBtn.visible = false;
                    }
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    Utils.TimerManager.remove(this.update, this);
                    var dt = eventVo.userMapEventData.endTime - TimerUtils.getServerTime() - eventVo.userMapEventData.speedTime;
                    this.m_nDt = dt;
                    if (this.m_nDt > 0) {
                        this.m_pIco.source = "icon_cj_png";
                        Utils.isGray(true, this.m_pGay);
                        this.m_pHand.visible = true;
                        var desc = "" + WorldModel.getEventDes(state) + Utils.DateUtils.getFormatBySecond(dt, 1);
                        this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                        Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this);
                    }
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    this.m_pIco.source = "icon_sj_png";
                    Utils.isGray(true, this.m_pGay);
                    var desc = cityname + "-" + WorldModel.getEventDes(state);
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case WorldEventType.FIGHT: {
                    this.m_pIco.source = "common_att_png";
                    Utils.isGray(true, this.m_pGay);
                    var desc = "";
                    if (cityname) {
                        desc = cityname + "-" + WorldModel.getEventDes(state);
                    }
                    else {
                        desc = "" + WorldModel.getEventDes(state);
                    }
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                // case WorldEventType.FIGHT: {
                //     this.m_pIco.source = "icon_yd_png";
                //     Utils.isGray(true, this.m_pGay);
                //     break;
                // }
            }
        };
        //============================================================================================================================================= 
        //事件监听 begin
        //============================================================================================================================================= 
        WorldHeroEvtItem.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_pPanel, this, this.onCkickPanel);
            com_main.EventManager.addTouchTapListener(this.m_posBtn, this, this.goTargetCity);
            com_main.EventManager.addTouchScaleListener(this.m_pHand, this, this.onHandler);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, this.onEventUpdate, this);
        };
        WorldHeroEvtItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventManager.removeEventListener(this.m_pPanel);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, this);
        };
        /**事件完成 */
        WorldHeroEvtItem.prototype.onEventUpdate = function (evtId) {
            if (this.m_nTeamOldEvt == evtId) {
                this.dataChanged();
            }
        };
        /**
         * 按钮操作
         */
        WorldHeroEvtItem.prototype.onHandler = function (pvt) {
            pvt.stopImmediatePropagation();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_tData.order);
            var eventVo = WorldModel.getTeamEvtById(teamVo.id);
            if (!eventVo)
                return;
            com_main.UpManager.history();
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.WorldGather, targetId: eventVo.eventCoordinatesId,
                startTime: eventVo.userMapEventData.startTime,
                endTime: eventVo.userMapEventData.endTime,
                speedUpTime: eventVo.userMapEventData.speedTime
            });
        };
        WorldHeroEvtItem.prototype.goTargetCity = function (pvt) {
            pvt.stopImmediatePropagation();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_tData.order);
            var state = WorldModel.getTeamEvtTypeById(teamVo.id);
            var eventVo = WorldModel.getEventVoByPosId(this.m_tData.evtId);
            if (!eventVo)
                return;
            com_main.UpManager.history();
            var cityId = 0;
            switch (state) {
                case WorldEventType.NONE: {
                    cityId = teamVo.cityId;
                    break;
                }
                default: {
                    cityId = eventVo.cityId;
                    break;
                }
            }
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, cityId);
        };
        /**点击面板 */
        WorldHeroEvtItem.prototype.onCkickPanel = function (pvt) {
            var state = this.currentState;
            if (state == "lock")
                return;
            if (state == "empty") {
                com_main.UpManager.history();
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_tData.order });
                return;
            }
            Sound.playTap();
            //非空闲队伍过滤
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_tData.order);
            var evtType = WorldModel.getTeamEvtTypeById(teamVo.id);
            if (evtType == WorldEventType.NONE) {
                this.doEvtAction();
            }
            else {
                var tips = WorldModel.getEventDes(evtType);
                EffectUtils.showTips(tips, 1, true);
            }
        };
        WorldHeroEvtItem.prototype.doEvtAction = function () {
            com_main.UpManager.history();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_tData.order);
            if (this.m_tData.cityId != -1 && this.m_tData.evtId == -1) {
                WorldProxy.C2S_UNLOCK_CITY(this.m_tData.cityId, teamVo.id);
                return;
            }
            var evtVo = WorldModel.getEventVoByPosId(this.m_tData.evtId);
            if (!evtVo)
                return;
            if (evtVo.getTeamId() > 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_ACT_FAL));
                return;
            }
            WorldModel.createClientMove(teamVo.id, evtVo.eventCoordinatesId);
            if (!WorldModel.isFromSearchPanel)
                return;
            var name = WorldModel.getCityName(evtVo.cityId);
            switch (evtVo.type) {
                case WorldEventType.RES_COLLECT: {
                    EffectUtils.showTips(GCodeFromat(CLEnum.WOR_TEAM_ACT_CJ, name));
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    EffectUtils.showTips(GCodeFromat(CLEnum.WOR_TEAM_ACT_SJ, name));
                    break;
                }
                case WorldEventType.FIGHT: {
                    EffectUtils.showTips(GCodeFromat(CLEnum.WOR_TEAM_ACT_ZF, name));
                    break;
                }
            }
        };
        //============================================================================================================================================= 
        //事件监听 begin
        //=============================================================================================================================================
        WorldHeroEvtItem.prototype.update = function () {
            this.m_nDt--;
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.dataChanged();
                return;
            }
            var desc = "" + WorldModel.getEventDes(this.m_state) + Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            this.m_pLbCity.textFlow = Utils.htmlParser(desc);
        };
        WorldHeroEvtItem.prototype.updateMove = function () {
            this.m_nMoveDt--;
            if (this.m_nMoveDt <= 0) {
                Utils.TimerManager.remove(this.updateMove, this);
                this.dataChanged();
                return;
            }
            var desc = "" + WorldModel.getEventDes(this.m_state) + Utils.DateUtils.getFormatBySecond(this.m_nMoveDt, 1);
            this.m_pLbCity.textFlow = Utils.htmlParser(desc);
        };
        return WorldHeroEvtItem;
    }(eui.ItemRenderer));
    com_main.WorldHeroEvtItem = WorldHeroEvtItem;
})(com_main || (com_main = {}));
