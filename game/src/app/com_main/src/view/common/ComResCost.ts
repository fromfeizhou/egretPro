module com_main {
    export class ComResCost extends CComponent {
        public static NAME = 'ComResCost';

        public m_labCost: eui.Label;
        public m_imgIcon: eui.Image;

        private m_nItemId: number; //物品id
        private m_nCost: number;    //总数量
        private m_bInitEvt: boolean; //监听事件;

        public constructor() {
            super();
            this.name = ComResCost.NAME;
            this.skinName = Utils.getAppSkin("common/ComResCostSkin.exml")
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
        }

        public setInfo(itemId: number, cost: number) {
            this.m_nItemId = itemId;
            this.m_nCost = cost;
            this.m_labCost.text = cost.toString();
            // CTipsManager.addTips(this, { type: TipsEnum.Item, param: this.m_nItemId })
            this.refreshIcon();
            this.refresCost();
            this.addEvent();
        }

        /**刷新图标 */
        private refreshIcon() {
            this.m_imgIcon.source = PropModel.getPropIcon(this.m_nItemId);
        }

        /**刷新数量 */
        private refresCost() {
            let color = PropModel.isItemEnough(this.m_nItemId, this.m_nCost) ? 0xe9e9e6 : 0xff0000;
            this.m_labCost.textColor = color;
        }


        /**监听事件 */
        private addEvent() {
            if (this.m_bInitEvt) return;
            this.m_bInitEvt = true;
            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onItemChange, this);
            EventManager.addTouchTapListener(this, this, this.onShowTip);
        }

        /**弹出物品信息 */
        private onShowTip() {
            let cfg = C.ItemConfig[this.m_nItemId]
            if (cfg) {
                Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: cfg.mainType, itemId: this.m_nItemId});
            }
        }

        /**移除事件 */
        private removeEvent() {
            if (!this.m_bInitEvt) return;
            this.m_bInitEvt = false;
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            EventManager.removeEventListener(this);
        }

        /**资源刷新 */
        private onItemChange(sourceId: PropEnum) {
            if (this.m_nItemId != sourceId) return;
            this.refresCost();
        }


    }
}