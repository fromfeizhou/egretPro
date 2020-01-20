module com_main {
    export interface ICrossHeroItemRD {
        order: number;
    }

    export class CrossHeroItem extends eui.ItemRenderer {
        public m_pGay: eui.Group;
        public m_pPanel: com_main.CImage;
        public m_pImgLight: com_main.CImage;
        public m_pPow: eui.Image;
        public m_comFightItem: com_main.ComFightItem;
        public m_pHeroHead: com_main.GeneralHeadRender;
        public m_pLbName: eui.Label;
        public m_pLbAmry: eui.Label;
        public m_pNameG: eui.Group;
        public m_pLbCity: eui.Label;
        public m_pIco: com_main.CImage;

        private m_nOrder: number = 0;   //队伍下标

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
        }

        public $onRemoveFromStage() {
            this.onDestroy();
        }
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
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        /**
         * 按钮操作
         */
        public onHandler(e: egret.TouchEvent) {
            e.stopImmediatePropagation();
            let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nOrder);
            switch (teamVo.state) {
                case TeamState.IDLE: {
                    Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nOrder });
                    break;
                }
                case TeamState.MOVE: {
                    let m_teamKey = WorldModel.getOwnerTeamMoveKey(this.m_nOrder);
                    Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
                    break;
                }
            }
        }

        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 

        protected dataChanged() {
            let data = this.data as ICrossHeroItemRD;
            this.m_nOrder = data.order;
            //队伍未解锁
            if (this.m_nOrder > TeamModel.getTeamMax(TeamType.CROSS_SERVER)) {
                this.currentState = "lock";
                return;
            }
            let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nOrder);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;

            }
            this.currentState = "cross";
            this.commitProperties();

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
            switch (teamVo.state) {
                case TeamState.IDLE: {
                    cityname = WorldModel.getCityName(teamVo.cityId);
                    let desc: string = `${cityname}-<font color=0x44d0f3>${TeamModel.getStateDes(teamVo.state)}</font>`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case TeamState.MOVE: {
                    this.m_pIco.source = "icon_yd_png";
                    Utils.isGray(true, this.m_pGay);
                    // let moveData: gameProto.ITeamMoveDataResp = WorldModel.getOwnerTeamMoveData(this.m_nOrder);
                    // if (moveData) {
                    //     let cityId = moveData.cityPath[moveData.cityPath.length - 1]
                    //     cityname = WorldModel.getCityName(cityId);
                    //     this.m_pLbCity.text = GCodeFromat(CLEnum.WOR_HE_GO, cityname);
                    // }
                     this.m_pLbCity.text = '移动中';
                    break;
                }
                // case TeamState.BATTLE:
                case TeamState.WORLD_BATTLE:
                case TeamState.QUEQUIE:
                case TeamState.WAR: {
                    Utils.isGray(true, this.m_pGay);
                    let desc: string = `${cityname}-${TeamModel.getStateDes(teamVo.state)}`
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_pIco.source = "common_att_png";
                    break;
                }
            }
        }

    }


}