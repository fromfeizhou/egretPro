module com_main {
    /**装备碎片格子 */
    export class EquipSoulItem extends CComponent {
        public static NAME: string = 'EquipSoulItem';

        public m_imgBg: com_main.CImage;
        public m_imgIcon: com_main.CImage;
        public m_imgQIcon: com_main.CImage;
        public m_labEquipName: eui.Label;
        public m_labCount: eui.Label;
        public m_labEquipLv: eui.Label;
        public m_pEffRoot: eui.Group;

        private m_eqLvEff: MCDragonBones;
        private m_nItemId: number;        //格子物品id

        public constructor() {
            super();
            this.name = EquipSoulItem.NAME;
            this.skinName = Utils.getAppSkin("equip/EquipSoulItemSkin.exml");
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.touchChildren = false;
            // this.cacheAsBitmap = true;
            this.m_nItemId = 0;
        }

        /**设置装备信息 */
        public setItemInfo(itemId: number, count: number, max: number) {
            this.refreshItemView(itemId);
            this.refreshCount(count, max);
        }


        /**刷新图标 */
        private refreshItemView(itemId: number) {
            if (this.m_nItemId == itemId) return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                let itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                this.m_imgQIcon.source = PropModel.getQualitySoulIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            } else {
                this.m_imgIcon.source = '';
                this.m_imgQIcon.source = '';
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
            this.refreshEquipLv();
            this.refreshRedEffect();

        }

        /**刷装备名字 */
        private refreshEquipName() {
            if (!this.m_labEquipName) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labEquipName);
            } else {
                this.m_labEquipName.text = '';
            }
        }
        /**刷装备等级 */
        private refreshEquipLv() {
            if (!this.m_labEquipLv) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabLv(this.m_nItemId, this.m_labEquipLv);
            } else {
                this.m_labEquipLv.text = '';
            }
        }

        /**刷装备数量 */
        private refreshCount(count: number, max: number) {
            if (!this.m_labCount) return;
            Utils.setRedProcessText(this.m_labCount, count, max);
        }
        /**设置流光特效*/
        public refreshRedEffect() {
            let itemInfo = C.ItemConfig[this.m_nItemId];

            if (itemInfo && itemInfo.quality >= 5) {
                this.createLvEffect();
            } else {
                this.clearLvEffect();
            }
        }
        private createLvEffect() {
            if (this.m_eqLvEff) return;
            this.m_eqLvEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_eqLvEff.x = 51;
            this.m_eqLvEff.y = 49;
            this.m_pEffRoot.addChild(this.m_eqLvEff);
        }
        private clearLvEffect() {
            if (this.m_eqLvEff) {
                NormalMcMgr.removeMc(this.m_eqLvEff);
                this.m_eqLvEff = null;
            }
        }
    }
}