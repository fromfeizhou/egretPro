module com_main {
    /**宝物配置 */
    export class ComTreaItem extends CComponent {
        public m_imgBg: eui.Image;
        public m_imgIcon: eui.Image;
        public m_groupOwner: eui.Group;
        public m_labOwnerName: eui.Label;
        public m_imgSelect: eui.Image;
        public m_groupStart: eui.Group;
        public m_labName: eui.Label;

        public m_nItemId: number;       //宝物id
        public m_tCurVo: TreasureVo;    //宝物数据结构

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/ComTreaItemSkin.exml");
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.touchChildren = false;
            this.cacheAsBitmap = true;
        }

        /**设置唯一id */
        public setInfo(itemId: number) {
            if (this.m_nItemId == itemId) return;
            this.m_nItemId = itemId;
            this.m_tCurVo = TreasureModel.getData(itemId);
            this.refreshView();
        }

        /**设置宝物物品id 星级 等级 */
        public setItemInfo(itemId: number, level: number = 1, star: number = 0,ownerName:string = '') {
            this.refreshItemView(itemId);
            this.refreshStar(star);
            this.setOwnerName(ownerName);
        }

        /**选中 */
        public setSecected(val: boolean) {
            this.m_imgSelect.visible = val;
        }

        /**刷新显示 */
        public refreshView() {
            if (this.m_tCurVo) {
                this.refreshItemView(this.m_tCurVo.itemId);

                if (this.m_tCurVo.generalId > 0) {
                    this.setOwnerName(GeneralModel.getGeneralName(this.m_tCurVo.generalId))
                } else {
                    this.setOwnerName("");
                }

                // this.refreshLevel(this.m_tCurVo.level);
                this.refreshStar(this.m_tCurVo.star);
            } else {
                this.m_imgIcon.source = "";
                this.m_imgBg.source = TreasureModel.getTreaQualityBg(1);
                this.m_labName.text = "";
                this.setOwnerName("");
                // this.refreshLevel(0);
                this.refreshStar(0);
            }
        }

        /**刷新图标 */
        private refreshItemView(itemId: number) {
            let itemCfg = C.ItemConfig[itemId];
            this.m_imgIcon.source = TreasureModel.getTreaIcon(itemId);
            this.m_imgBg.source = TreasureModel.getTreaQualityBg(itemCfg.quality);
            Utils.setPropLabName(itemId, this.m_labName)
        }
      

        /**刷新星级 */
        private refreshStar(starNum: number) {
            while (this.m_groupStart.numChildren > starNum) {
                this.m_groupStart.removeChildAt(0);
            }

            for (let i = this.m_groupStart.numChildren; i < starNum; i++) {
                let star = new eui.Image();
                star.source = "common_star_png";
                star.width = 30;
                star.height = 30;
                this.m_groupStart.addChild(star);
            }
        }



        /**设置拥有者名字 */
        public setOwnerName(ownerName: string) {
            if (ownerName == "") {
                this.m_groupOwner.visible = false;
            } else {
                this.m_groupOwner.visible = true;
                this.m_labOwnerName.text = ownerName;
            }
        }

    }
}