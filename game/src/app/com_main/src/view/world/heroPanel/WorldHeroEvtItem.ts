module com_main {

    export interface IWorldHeroEvtItemRD {
        order: number;
        cityId: number;
        evtId: number;
    }

    export class WorldHeroEvtItem extends eui.ItemRenderer {
        public m_pGay: eui.Group;
        public m_pPanel: com_main.CImage;
        public m_comFightItem: com_main.ComFightItem;
        public m_pHeroHead: com_main.GeneralHeadRender;
        public m_pLbName: eui.Label;
        public m_pLbAmry: eui.Label;
        public m_pNameG: eui.Group;
        public m_pLbCity: eui.Label;
        public m_pIco: com_main.CImage;
        public m_posBtn: com_main.CImage;
        public m_pHand: eui.Group;
        public m_handBtn: com_main.CImage;
        public m_handpLb: com_main.CImage;

        /**名字 */
        private m_tData: IWorldHeroEvtItemRD;

        private m_nDt: number = 0;
        private m_nMoveDt: number = 0;
        private m_cityName: string = "";
        private m_state: number = 0;
        private m_nTeamOldEvt: number;    //队伍旧事件(事件结束刷新ui使用)


        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/WorldHeroEvtItemSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy(): void {
            EventManager.removeEventListener(this.m_pPanel);
            this.removeEvent();
            Utils.TimerManager.remove(this.update, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEvent();
        }

        protected dataChanged() {
            this.m_tData = this.data;
            //队伍未解锁
            Utils.isGray(false, this)
            if (this.m_tData.order > TeamModel.getTeamMax(TeamType.WORLD)) {
                this.currentState = "lock";
                return;
            }
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_tData.order);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;
            }

            this.currentState = "base";

            let info = teamVo.getTeamUiInfo();
            this.m_pLbAmry.text = GCode(CLEnum.ARMY) + Global.getNumber(Number(this.m_tData.order + 1));
            this.m_pLbName.text = GeneralModel.getGeneralName(info.headId);
            this.m_pHeroHead.setGenId(info.headId);
            // this.m_pFight.text = `${info.fight}`;
            this.m_comFightItem.setFight(info.fight);
            let state = WorldModel.getTeamEvtTypeById(teamVo.id);
            this.m_state = state;
            let eventVo: WorldEventVo = WorldModel.getTeamEvtById(teamVo.id);
            this.m_pLbCity.text = WorldModel.getEventDes(state);
            Utils.isGray(true, this.m_pGay)
            if (state == WorldEventType.NONE)
                Utils.isGray(false, this)
            let cityname: string = "";
            if (eventVo) {
                cityname = WorldModel.getCityName(eventVo.coordCfg.cityId);
                this.m_nTeamOldEvt = eventVo.eventCoordinatesId;
            } else {
                cityname = WorldModel.getCityName(teamVo.cityId);
                this.m_nTeamOldEvt = 0;
            }
            this.m_cityName = cityname;
            Utils.isGray(false, this.m_pGay);
            this.m_posBtn.visible = true;
            switch (state) {
                case WorldEventType.NONE: {
                    let desc: string = `${cityname}-<font color=0x44d0f3>${WorldModel.getEventDes(state)}</font>`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case WorldEventType.MOVE: {
                    Utils.TimerManager.remove(this.updateMove, this);

                    let clientEvo: IClientMoveEt = WorldModel.getClientMoveByTeamId(teamVo.id)
                    let dt = clientEvo.endTime - TimerUtils.getServerTime();
                    dt = Math.max(0, dt);
                    this.m_nMoveDt = dt;
                    if (this.m_nMoveDt > 0) {
                        let desc: string = `${WorldModel.getEventDes(state)}${Utils.DateUtils.getFormatBySecond(dt, 1)}`
                        this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                        Utils.TimerManager.doTimer(1000, this.m_nMoveDt + 1, this.updateMove, this, );
                        Utils.isGray(true, this.m_pGay);
                        this.m_posBtn.visible = false;
                    }
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    Utils.TimerManager.remove(this.update, this);
                    let dt = eventVo.userMapEventData.endTime - TimerUtils.getServerTime() - eventVo.userMapEventData.speedTime;
                    this.m_nDt = dt;
                    if (this.m_nDt > 0) {
                        this.m_pIco.source = "icon_cj_png";
                        Utils.isGray(true, this.m_pGay);
                        this.m_pHand.visible = true;

                        let desc: string = `${WorldModel.getEventDes(state)}${Utils.DateUtils.getFormatBySecond(dt, 1)}`
                        this.m_pLbCity.textFlow = Utils.htmlParser(desc);

                        Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, );
                    }
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    this.m_pIco.source = "icon_sj_png";
                    Utils.isGray(true, this.m_pGay);
                    let desc: string = `${cityname}-${WorldModel.getEventDes(state)}`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case WorldEventType.FIGHT: {
                    this.m_pIco.source = "common_att_png";
                    Utils.isGray(true, this.m_pGay);
                    let desc: string = "";
                    if (cityname) {
                        desc = `${cityname}-${WorldModel.getEventDes(state)}`
                    } else {
                        desc = `${WorldModel.getEventDes(state)}`
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
        }


        //============================================================================================================================================= 
        //事件监听 begin
        //============================================================================================================================================= 
        private addEvent() {
            EventManager.addTouchTapListener(this.m_pPanel, this, this.onCkickPanel)
            EventManager.addTouchTapListener(this.m_posBtn, this, this.goTargetCity)
            EventManager.addTouchScaleListener(this.m_pHand, this, this.onHandler);
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, this.onEventUpdate, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventManager.removeEventListener(this.m_pPanel);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, this);
        }
        /**事件完成 */
        private onEventUpdate(evtId: number) {
            if (this.m_nTeamOldEvt == evtId) {
                this.dataChanged();
            }
        }

        /**
         * 按钮操作
         */
        public onHandler(pvt: egret.TouchEvent) {
            pvt.stopImmediatePropagation();
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_tData.order);
            let eventVo = WorldModel.getTeamEvtById(teamVo.id);
            if (!eventVo) return;
            UpManager.history();
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.WorldGather, targetId: eventVo.eventCoordinatesId,
                startTime: eventVo.userMapEventData.startTime,
                endTime: eventVo.userMapEventData.endTime,
                speedUpTime: eventVo.userMapEventData.speedTime
            });
        }

        public goTargetCity(pvt: egret.TouchEvent) {
            pvt.stopImmediatePropagation();
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_tData.order);
            let state = WorldModel.getTeamEvtTypeById(teamVo.id);
            let eventVo = WorldModel.getEventVoByPosId(this.m_tData.evtId);
            if (!eventVo) return;
            UpManager.history();
            let cityId: number = 0;
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
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, cityId);
        }
        /**点击面板 */
        public onCkickPanel(pvt: egret.TouchEvent) {
            const state = this.currentState;
            if (state == "lock") return;
            if (state == "empty") {
                UpManager.history();
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_tData.order });
                return;
            }
            Sound.playTap();

            //非空闲队伍过滤
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_tData.order);
            let evtType = WorldModel.getTeamEvtTypeById(teamVo.id);

            if (evtType == WorldEventType.NONE) {
                this.doEvtAction();
            } else {
                let tips = WorldModel.getEventDes(evtType);
                EffectUtils.showTips(tips, 1, true);
            }
        }

        private doEvtAction() {
            UpManager.history();
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_tData.order)
            if (this.m_tData.cityId != -1 && this.m_tData.evtId == -1) {
                WorldProxy.C2S_UNLOCK_CITY(this.m_tData.cityId, teamVo.id);
                return;
            }
            let evtVo = WorldModel.getEventVoByPosId(this.m_tData.evtId);
            if (!evtVo) return;
            if (evtVo.getTeamId() > 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_ACT_FAL));
                return;
            }

            WorldModel.createClientMove(teamVo.id, evtVo.eventCoordinatesId);
            if (!WorldModel.isFromSearchPanel)
                return;
            let name = WorldModel.getCityName(evtVo.cityId);
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
        }
        //============================================================================================================================================= 
        //事件监听 begin
        //=============================================================================================================================================

        protected update() {
            this.m_nDt--;
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.dataChanged();
                return;
            }
            let desc: string = `${WorldModel.getEventDes(this.m_state)}${Utils.DateUtils.getFormatBySecond(this.m_nDt, 1)}`
            this.m_pLbCity.textFlow = Utils.htmlParser(desc);
        }

        protected updateMove() {
            this.m_nMoveDt--;
            if (this.m_nMoveDt <= 0) {
                Utils.TimerManager.remove(this.updateMove, this);
                this.dataChanged();
                return;
            }
            let desc: string = `${WorldModel.getEventDes(this.m_state)}${Utils.DateUtils.getFormatBySecond(this.m_nMoveDt, 1)}`
            this.m_pLbCity.textFlow = Utils.htmlParser(desc);
        }
    }

}