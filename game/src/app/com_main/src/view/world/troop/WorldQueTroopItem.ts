module com_main {

    /**
     * 行军列队
     */
    export class WorldQueTroopItem extends CComponent {

        public static readonly NAME = "WorldQueTroopItem";

        public m_imgLock: eui.Image;
        public m_imgEmpty: eui.Image;
        public m_pHeadRoot: eui.Group;
        public m_imgHeadMask: eui.Image;
        public m_imgHead: eui.Image;
        public m_pStateRoot: eui.Group;
        public m_lbTroop: eui.BitmapLabel;
        public m_imgSel: eui.Image;

        private m_bSelected: boolean;
        private m_bOpen: boolean;    //是否解锁
        private m_nOrder: number;   //队伍下标
        private m_nTeamType: TeamType;
        private m_tTeamVo: TeamVo;

        public constructor() {
            super();
            this.name = WorldQueTroopItem.NAME;
            this.skinName = Utils.getAppSkin("world/troop/WorldQueTroopItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
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
        }

        public get selected() {
            return this.m_bSelected;
        }

        /**设置队伍下标 */
        public setInfo(teamType: TeamType, order: number) {
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
            this.m_lbTroop.text = `${order + 1}`
        }

        public get order() {
            return this.m_nOrder;
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
            } else {
                this.m_pHeadRoot.visible = false;
                this.m_pStateRoot.visible = false;
                this.m_imgLock.visible = true;
                this.m_imgEmpty.visible = false;
            }
        }

        public get open() {
            return this.m_bOpen;
        }



        /**刷新头像显示 */
        private refreshHead() {
            if (!this.m_tTeamVo) return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_pHeadRoot.visible = false;
                this.m_imgEmpty.visible = true;
                return;
            }
            this.m_imgEmpty.visible = false;
            this.m_pHeadRoot.visible = true;
            let info = this.m_tTeamVo.getTeamUiInfo();
            let config = C.GeneralConfig[info.headId];
            this.m_imgHead.source = GeneralModel.getSoldierLogo(config.role);
        }



        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        private addEvent() {
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onTeamUpdateGirdInfo, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
        }

        // private onItemClick() {
        //     if (!this.m_bOpen) {
        //         EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
        //         return;
        //     }
        //     // if (this.m_tTeamVo.isEmptyTeam()) {
        //     //     Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
        //     //     return;
        //     // }
        //     if (this.m_callObj && this.m_callback) {
        //         this.m_callback.call(this.m_callObj, this.m_nOrder);
        //     }
        // }


        /* 上阵信息刷新
         * @param changeIds 客户端拟刷新
         *  */
        private onTeamUpdateGirdInfo(vo: TeamVo) {
            if (!this.m_bOpen) return;
            if (this.m_tTeamVo.teamType == vo.teamType && this.m_tTeamVo.id == vo.id) {
                this.refreshHead();
            }

        }

        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
    }

}