module com_main {
	/**
	 * 宝石列表cell
	 */
    export class TreaInLayListItem extends CComponent {
        public m_labAttri: eui.Label;
        public m_labName: eui.Label;
        public m_comItem: com_main.ComItemNew;
        public m_pSelTips: eui.Group;

        public itemId: number;   //宝石id
        private m_nPos: number;   //孔位

        public constructor() {
            super();

            this.skinName = Utils.getAppSkin("treasure/TreaInLayListItemSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();

        }

        /**设置宝石数据 */
        public setItemInfo(itemId: number, pos: number) {
            this.itemId = itemId;
            this.m_nPos = pos;
            this.refresView();
        }

        private refresView() {
            let stoneCfg = C.GemstoneConfig[this.itemId];
            if (stoneCfg) {
                let attri = StringUtils.keyValsToNumberArray(stoneCfg.attri);
                Utils.setPropLabName(this.itemId, this.m_labName);
                this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri[0], true, '%s%s'));
                this.m_comItem.setItemInfo(this.itemId);
            }
        }

        public setEquipState(val: boolean) {
            this.m_pSelTips.visible = val;
        }

    }
}