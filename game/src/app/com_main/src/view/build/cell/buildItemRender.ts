module com_main {
    export class buildItemRender extends CComponent {

        public m_pLbLvUpDesc: com_main.CLabel;
        public m_effectValueRoot: eui.Group;
        public m_pLbCurLvValue: com_main.CLabel;
        public m_pLbNextLvValue: com_main.CLabel;

        private m_nCfgId: number;

        public constructor() {
            super();

            this.skinName = Utils.getAppSkin("map/build/build_info_effect_item_Skin.exml");
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
        }
        /**设置显示信息 */
        public setInfo(dec: string, currValue: string, nextValue: string) {
            this.m_pLbCurLvValue.text = currValue;
            this.m_pLbLvUpDesc.text = dec;
            this.m_pLbNextLvValue.text = nextValue;
        }
    }
}