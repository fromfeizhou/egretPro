module com_main {

    /**
     * 行军列队
     */
    export class WorldQueView extends CComponent {

        public static NAME = "WorldQueView";

        public m_pItemRoot: eui.Group;
        public queItem0: com_main.WorldQueItem;
        public queItem1: com_main.WorldQueItem;
        public queItem2: com_main.WorldQueItem;
        public queItem3: com_main.WorldQueItem;
        public queItem4: com_main.WorldQueItem;
        public m_pBtnShow: eui.Image;
        public m_pBtnHide: eui.Image;

        private m_bIsShow: boolean;      //可见
        protected m_nCurIndex: number;     //当前选中下标
        private m_nTeamType: TeamType;     //队伍类型

        public constructor() {
            super();
            this.name = WorldQueView.NAME;
            // this.skinName = Utils.getAppSkin("world/queque/WorldQueViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            egret.Tween.removeTweens(this.m_pItemRoot);
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_bIsShow = false;
        }


        public initData(type: TeamType) {
            this.m_nTeamType = type;
            this.m_nCurIndex = -1;
            let max = TeamModel.getTeamMax(type)
            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueItem;
                item.setInfo(type, i);
                item.setSelectFunc(this.onChangeSel, this)
                item.open = (i < max);
            }
            this.setViewState();

            this.addEvent();
        }

        /**改变选中 */
        protected onChangeSel(index: number) {
            if (this.m_nCurIndex == index) {
                this.m_nCurIndex = -1;
                this.setQueItemSel(index, false);
                return;
            }
            if (this.m_nCurIndex >= 0) {
                this.setQueItemSel(this.m_nCurIndex, false);
            }
            this.m_nCurIndex = index;
            this.setQueItemSel(this.m_nCurIndex, true);

        }

        /**队列选中刷新 */
        private setQueItemSel(index: number, val: boolean) {
            let item = this[`queItem${index}`] as WorldQueItem;
            if (item) item.selected = val;
        }


        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        protected addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnShow, this, this.setViewState);
            EventManager.addTouchScaleListener(this.m_pBtnHide, this, this.setViewState);

            EventMgr.addEvent(TeamUIEvent.TEAM_UPDATE_MAX_NUM, this.onTeamUpdateMaxNum, this);
            // EventMgr.addEvent(TaskWorldEvent.QUEUE_HIDE_OPERATE, this.onQueHideHander, this);
        }

        protected removeEvent() {
            EventManager.removeEventListeners(this);

            EventMgr.removeEventByObject(TeamUIEvent.TEAM_UPDATE_MAX_NUM, this);
            // EventMgr.removeEventByObject(TaskWorldEvent.QUEUE_HIDE_OPERATE, this);
        }

        // private onQueHideHander() {
        //     if (this.m_bIsShow) {
        //         this.setViewState();
        //         this.onChangeSel(this.m_nCurIndex);
        //     }
        // }

        /**显示隐藏切换 */
        private setViewState() {
            this.m_bIsShow = !this.m_bIsShow;
            egret.Tween.removeTweens(this.m_pItemRoot);
            let tw = egret.Tween.get(this.m_pItemRoot);

            if (this.m_bIsShow) {
                this.m_pBtnShow.visible = this.m_bIsShow;
                this.m_pBtnHide.visible = !this.m_bIsShow;
                this.m_pItemRoot.visible = true;
                this.m_pItemRoot.alpha = 0.3;
                this.m_pItemRoot.scaleY = 0;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.quadOut);

            } else {
                this.onChangeSel(this.m_nCurIndex);
                this.m_pBtnShow.visible = !this.m_bIsShow;
                this.m_pBtnHide.visible = this.m_bIsShow;
                tw.to({ scaleY: 0, alpha: 0.3 }, 300, Ease.quadOut);
                tw.call(() => {
                    this.m_pItemRoot.visible = false;
                }, this)
            }

        }

        /**队伍列表刷新 */
        private onTeamUpdateMaxNum() {
            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueItem;
                item.open = (i < TeamModel.getTeamMax(this.m_nTeamType));
            }
        }
        /**队伍列表刷新 */
        private onTeamUpdateDate() {
            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueItem;
                item.refreshState();
            }
        }
        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
    }

}