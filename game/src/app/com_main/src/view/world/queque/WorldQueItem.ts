module com_main {

    /**
     * 行军列队
     */
    export class WorldQueItem extends CComponent {

        public static readonly NAME = "WorldQueItem";

        public m_imgTouch: eui.Image;
        public m_imgLock: eui.Image;
        public m_pHeadRoot: eui.Group;
        public m_imgHeadMask: eui.Image;
        public m_imgHead: eui.Image;
        public m_pStateRoot: eui.Group;
        public m_labState: eui.Label;
        public m_imgSel: eui.Image;
        public m_pOperaRoot: eui.Group;
        public m_pAccBtn: eui.Image;
        public m_pPosBtn: eui.Image;
        public m_pEmBtn: eui.Image;
        public m_imgXYState: eui.Image;

        private m_bSelected: boolean;
        private m_bOpen: boolean;    //是否解锁
        private m_nOrder: number;   //队伍下标
        private m_nTeamType: TeamType;
        private m_callback: (val: number) => void;
        private m_callObj: any;
        private m_tTeamVo: TeamVo;

        public constructor(iid?: number) {
            super();
            this.name = WorldQueItem.NAME;
            this.skinName = Utils.getAppSkin("world/queque/WorldQueItemSkin.exml");
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.m_callObj = null;
            this.m_callback = null;
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_bSelected = false;
            this.m_bOpen = false;
            this.m_imgHead.mask = this.m_imgHeadMask;
            this.addEvent();
        }

        /**设置选中状态 */
        public set selected(val: boolean) {
            if (this.m_bSelected == val) return;
            this.m_bSelected = val;
            this.m_imgSel.visible = val;
            this.refreshSelected();
        }

        public get selected() {
            return this.m_bSelected;
        }

        /**设置队伍下标 */
        public setInfo(teamType: TeamType, order: number) {
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
        }



        /**设置选中回调函数 */
        public setSelectFunc(func: (val: number) => void, obj: any) {
            this.m_callback = func;
            this.m_callObj = obj;
        }

        /**设置解锁 */
        public set open(val: boolean) {
            if (this.m_bOpen == val) return;
            this.m_bOpen = val;
            if (val) {
                this.m_pStateRoot.visible = true;
                this.m_imgLock.visible = false;
                this.m_tTeamVo = TeamModel.getTeamVoByType(this.m_nTeamType, this.m_nOrder);
                this.refreshHead();
                this.refreshState();
            } else {
                this.m_pHeadRoot.visible = false;
                this.m_pStateRoot.visible = false;
                this.m_imgLock.visible = true;
            }
        }

        public get open() {
            return this.m_bOpen;
        }

        /**刷新选中显示 */
        private refreshSelected() {
            //跨服战 不显示
            if (this.m_nTeamType == TeamType.CROSS_SERVER) return;

            egret.Tween.removeTweens(this.m_pOperaRoot);
            let tw = egret.Tween.get(this.m_pOperaRoot);
            if (this.m_bSelected) {
                this.m_pOperaRoot.visible = true;
                this.m_pOperaRoot.alpha = 0.3;
                this.m_pOperaRoot.scaleX = 0;
                this.m_pOperaRoot.scaleY = 0;
                tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, Ease.quadOut);

            } else {
                tw.to({ scaleX: 0, scaleY: 0, alpha: 0.3 }, 150, Ease.quadOut);
                tw.call(() => {
                    this.m_pOperaRoot.visible = false;
                }, this)
            }
        }

        /**刷新头像显示 */
        private refreshHead() {
            if (!this.m_tTeamVo) return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_pHeadRoot.visible = false;
                return;
            }
            this.m_pHeadRoot.visible = true;
            let info = this.m_tTeamVo.getTeamUiInfo();
            let config = C.GeneralConfig[info.headId];
            this.m_imgHead.source = GeneralModel.getSoldierLogo(config.role);
        }

        /**刷新状态显示 */
        public refreshState() {
            if (!this.m_tTeamVo) return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_labState.textFlow = Global.getTextFlow(`<font color = 0xe9e9e6>${GCode(CLEnum.CAMP_NONE)}</font>`);;
                return;
            }
            let isMove: boolean = false;
            switch (this.m_tTeamVo.state) {
                case TeamState.IDLE: {
                    this.m_labState.textFlow = Global.getTextFlow(`<font color = 0x00ff00>${GCode(CLEnum.WOR_TEAM_KX)}</font>`);
                    break;
                }
                case TeamState.MOVE: {
                    this.m_labState.textFlow = Global.getTextFlow(`<font color = 0xe9e9e6>${GCode(CLEnum.WOR_TEAM_YD)}</font>`);
                    break;
                }
                case TeamState.QUEQUIE: {
                    this.m_labState.textFlow = Global.getTextFlow(`<font color = 0xe9e9e6>${GCode(CLEnum.WOR_TEAM_GZPD)}</font>`);
                    break;
                }
                case TeamState.WORLD_BATTLE:
                case TeamState.WAR: {
                    this.m_labState.textFlow = Global.getTextFlow(`<font color = 0xff0000>${GCode(CLEnum.WOR_TEAM_GZZD)}</font>`);
                    break;
                }
            }

            this.updateState();

        }

        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        private addEvent() {
            EventManager.addTouchTapListener(this.m_imgTouch, this, this.onItemClick);
            EventManager.addTouchScaleListener(this.m_pEmBtn, this, () => {
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
            });

            EventManager.addTouchScaleListener(this.m_pAccBtn, this, () => {
                let m_teamKey = WorldModel.getOwnerTeamMoveKey(this.m_nOrder);
                Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
            });
            EventManager.addTouchScaleListener(this.m_pPosBtn, this, () => {
                if (this.m_tTeamVo.isEmptyTeam()) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_EMPTY), 1, true);
                    return;
                }
                if (this.m_tTeamVo.state == TeamState.MOVE) {
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.HERO, WorldModel.getOwnerTeamMoveKey(this.m_nOrder));
                } else {
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.m_tTeamVo.cityId);
                }
            });

            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onTeamUpdateGirdInfo, this);
            EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, this.onTeamMoveList, this);

        }
        public updateState() {
            if (isNull(this.m_tTeamVo)) return;
            let config: WorldMapConfig = C.WorldMapConfig[this.m_tTeamVo.cityId];
            if (config) {
                this.m_imgXYState.visible = config.mapId == SceneEnums.WORLD_XIANGYANG_CITY;
            }
            let moveData = WorldModel.getOwnerTeamMoveData(this.m_tTeamVo.order);
            if (this.m_tTeamVo.state == TeamState.MOVE && moveData) {
                this.currentState = "move";
            } else {
                this.currentState = 'base';
            }
            this.commitProperties();
        }

        public onTeamMoveList(teamKey: string) {
            if (WorldModel.getOwnerTeamMoveKey(this.m_nOrder) == teamKey) {
                this.updateState();
            }
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, this);
            EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
        }


        private onItemClick() {
            if (!this.m_bOpen) {
                if (this.m_nTeamType == TeamType.CROSS_SERVER) {
                    EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                }
                if (this.m_nTeamType == TeamType.WORLD) {
                    EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
                }
                return;
            }
            if (this.m_tTeamVo.isEmptyTeam()) {
                if (this.m_nTeamType == TeamType.CROSS_SERVER) {
                    Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: this.m_nOrder });
                } else {
                    Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
                };
                return;
            }
            if (this.m_callObj && this.m_callback) {
                this.m_callback.call(this.m_callObj, this.m_nOrder);
            }
        }


        /* 上阵信息刷新
         * @param changeIds 客户端拟刷新
         *  */
        private onTeamUpdateGirdInfo(vo: TeamVo) {
            if (!this.m_bOpen) return;
            if (vo.teamType != this.m_nTeamType && this.m_nOrder != vo.order) return;
            this.refreshHead();
            this.refreshState();
        }

        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
    }

}