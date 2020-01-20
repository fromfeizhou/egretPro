module com_main {
    export interface IWorldHeroItemRD {
        order: number;
        cityId: number;
        selected: boolean;
    }

    export class WorldHeroItem extends eui.ItemRenderer {
        public m_pGay: eui.Group;
        public m_pPanel: com_main.CImage;
        public m_pImgStatus: eui.Image;
        public m_pImgLight: com_main.CImage;
        public m_pPow: eui.Image;
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



        private m_nOrder: number = 0;   //队伍下标
        private m_nCityId: number = 0;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }
        // public $onRemoveFromStage() {
        //     this.onDestroy();
        // }
        public onDestroy(): void {
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEvent();

        }
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        private addEvent() {
            EventManager.addTouchTapListener(this.m_posBtn, this, this.goTargetCity)
            EventManager.addTouchScaleListener(this.m_pHand, this, this.onHandler);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventManager.removeEventListener(this.m_pPanel);
        }

        /**
         * 按钮操作
         */
        public onHandler(e: egret.TouchEvent) {
            e.stopImmediatePropagation();
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nOrder);
            switch (teamVo.state) {
                case TeamState.IDLE: {
                    Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nOrder, cityId: this.m_nCityId });
                    break;
                }
                case TeamState.MOVE: {
                    let m_teamKey = WorldModel.getOwnerTeamMoveKey(this.m_nOrder);
                    Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
                    break;
                }
            }
        }

        public goTargetCity(e: egret.TouchEvent) {
            e.stopImmediatePropagation();
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nOrder);
            let cityId: number = teamVo.cityId;;
            if (cityId > 0) {
                WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, cityId);
                UpManager.history();
            }
        }

        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 

        protected dataChanged() {
            let data = this.data as IWorldHeroItemRD;
            this.m_nOrder = data.order;
            //队伍未解锁
            if (this.m_nOrder > TeamModel.getTeamMax(TeamType.WORLD)) {
                this.currentState = "lock";
                return;
            }
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nOrder);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;

            }
            this.currentState = "base";
            this.commitProperties();
            
            this.m_pImgLight.visible = this.data.selected;
            
            let info = teamVo.getTeamUiInfo();
            this.m_pLbAmry.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(Number(this.m_nOrder + 1));
            this.m_pLbName.text = GeneralModel.getGeneralName(info.headId);
            this.m_pHeroHead.setGenId(info.headId);
            //血量
            const per = info.hp / info.maxHp;
            this.m_pPow.scaleX = per > 1 ? 1 : per;
            // //战斗力
            this.m_comFightItem.setFight(info.fight)

            this.m_pLbCity.text = TeamModel.getStateDes(teamVo.state);
            Utils.isGray(false, this.m_pGay);
            let cityname: string = ""
            this.m_pHand.visible = true;
            switch (teamVo.state) {
                case TeamState.IDLE: {
                    cityname = WorldModel.getCityName(teamVo.cityId);
                    let desc: string = `${cityname}-<font color=0x44d0f3>${TeamModel.getStateDes(teamVo.state)}</font>`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_handBtn.source = "btn_120_png"
                    this.m_handpLb.source = "lb_bb_png"
                    this.m_pHand.visible = per < 1;
                    break;
                }
                case TeamState.MOVE: {
                    this.m_pIco.source = "icon_yd_png";
                    Utils.isGray(true, this.m_pGay);
                    let moveData: gameProto.ITeamMoveDataResp = WorldModel.getOwnerTeamMoveData(this.m_nOrder);
                    if (moveData) {
                        let cityId = moveData.cityPath[moveData.cityPath.length - 1]
                        cityname = WorldModel.getCityName(cityId);
                        this.m_pLbCity.text = GCodeFromat(CLEnum.WOR_HE_GO, cityname);
                        this.m_handBtn.source = "btn_034_up_png"
                        this.m_handpLb.source = "lb_js_png"
                    }
                    break;
                }
                case TeamState.WAR:
                case TeamState.WORLD_BATTLE:
                case TeamState.QUEQUIE: {
                    Utils.isGray(true, this.m_pGay);
                    let desc: string = `${cityname}-${TeamModel.getStateDes(teamVo.state)}`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_pIco.source = "common_att_png";
                    this.m_pHand.visible = false;
                    break;
                }
            }
        }

    }


}