module com_main {
    export class TavernCheckitem extends CComponent {

        private m_ComItemNew: ComItemNew;
        private m_E_OutFrame: eui.Image;
        private m_E_Top: eui.Image;
        private m_labPercent: eui.Label;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("tavern/tavern_item_render.exml");
        }
        public onDestroy(): void {
            EventManager.removeEventListener(this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_labPercent.visible = true;

        }

        public setItemInfo(item: number, currPer: number, totalPer: number) {
            let cfg: ItemConfig = PropModel.getCfg(item);
            this.m_ComItemNew.setItemInfo(cfg.id,1);
            this.setProbability(currPer, totalPer);
        }
        /**设置概率值 */
        private setProbability(currPer: number, totalPer: number) {
            let num = (currPer / totalPer) * 100;
            this.m_labPercent.text = num.toFixed(2).toString() + "%";

        }

    }

}