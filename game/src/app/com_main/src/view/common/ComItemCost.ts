module com_main {
	/**
	 * 道具
	 */
    export class ComItemCost extends CComponent {
        private m_imgIcon: com_main.CImage;
        private m_imgBg: com_main.CImage;
        private m_labCount: com_main.CLabel;

        private m_pItemId;
        private m_nMaxNum;      //物品数量

        private m_bOpenTips = true;    //tips开启状态

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/com_item_cost.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        /**启用通用tips */
        public set openTips(val) {
            if (this.m_bOpenTips == val) return;
            this.m_bOpenTips = val;
            if (val) {
                this.setTipsInfo();
            } else {
                CTipsManager.clearTips(this);
            }
        }
        public get openTips() {
            return this.m_bOpenTips;
        }
        /*修改tips */
        private setTipsInfo() {
            if (this.m_bOpenTips && this.m_pItemId > 0)
                CTipsManager.addTips(this, { type: TipsEnum.Item, param: this.m_pItemId })
        }

        /**设置物品id 和 数量*/
        public setItemInfo(id: number, maxNum: number) {
            this.itemId = id;
            this.maxNum = maxNum;
            this.setTipsInfo();
        }

        /**
         * 注意：该方式自动获取背包数量，自定义数量显示 使用接口setItemInfo
         * 设置物品id */
        private set itemId(id: number) {
            if (this.m_pItemId == id) return;
            this.m_pItemId = id;
            this.setTipsInfo();
            this.refreshView();
        }
        /**获得物品id */
        private get itemId() {
            return this.m_pItemId;
        }

        private set maxNum(maxNum: number) {
            this.m_nMaxNum = maxNum;
            this.refreshCount();
        }

        /**刷新显示 */
        private refreshView(): void {
            if (this.m_pItemId && this.m_pItemId > 0) {
                let info = PropModel.getCfg(this.m_pItemId);
                if (info) {
                    if (info.mainType == PropMainType.SOUL || info.mainType == PropMainType.SKILL_SOUL) {
                        this.setChildIndex(this.m_imgIcon, 0);
                    } else {
                        this.setChildIndex(this.m_imgBg, 0);
                    }
                    this.refreshIcon()
                    this.refreshQualityBg();
                }
            } else {
                this.resetViewState();
            }

        }
        /**重置显示 */
        private resetViewState(): void {
            this.m_imgIcon.source = "";
            this.m_imgBg.source = "";
            if (this.m_labCount) {
                this.m_labCount.text = "";
            }
            this.refreshQualityBg();

        }

        /**刷新图标 */
        private refreshIcon() {
            let image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        }

        /**刷新品质框 */
        private refreshQualityBg() {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        }

        /**刷新数量 */
        public refreshCount(count?: number) {
            if (this.m_labCount) {
                let itemCfg = C.ItemConfig[this.m_pItemId]
                let num = 0;
                let isResource = itemCfg.type == PropType.RESOURCE;//是否是资源
                if (isResource) {
                    num = RoleData.GetMaterialNumById(this.m_pItemId);
                } else {
                    num = PropModel.getPropNum(this.m_pItemId);
                }
                Utils.setRedProcessText(this.m_labCount, num, this.m_nMaxNum);
            }
        }

    }
}