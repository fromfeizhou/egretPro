module com_main {
	/**
	 * 宝石镶嵌列表
	 */
    export class TreaInLayWnd extends CView {
        public m_APopUp: com_main.APopUp;
        public m_pItemList: eui.List;
        public m_btnEquip: com_main.ComButton;
        public m_btnUnEquip: com_main.ComButton;


        private m_nItemId: number;   //宝物id
        private m_nPos: number;   //孔位
        private m_nOldStoneId: number;   //旧的宝石id

        private m_nCurIndex: number;     //当期选中宝石下标
        private m_tCollection: eui.ArrayCollection;

        public constructor(param: any) {
            super();
            this.m_nItemId = param.itemId;
            this.m_nPos = param.pos;
            this.m_nOldStoneId = param.oldStoneId;
            this.initApp("treasure/TreaInLayWndSkin.exml");
        }

        public onDestroy(): void {
            this.m_pItemList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onStoneItemHandler, this);
            super.onDestroy();

        }

        protected childrenCreated() {
            super.childrenCreated();

            this.m_APopUp.setTitleLabel(GCode(CLEnum.TREA_BS_CHOSE));
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.TREA_BS_XQ));
            this.m_btnUnEquip.setTitleLabel(GCode(CLEnum.TREA_STONE_XX));


            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemList.dataProvider = this.m_tCollection;
            this.m_pItemList.itemRenderer = StoneRender;
            let list = PropModel.getGemList(PropStoneType.ALL);
            let res: IStoneRD[] = [];

            for (let i = 0; i < list.length; i++) {
                if (this.m_nOldStoneId != list[i].itemId) {
                    let data = { itemId: list[i].itemId, pos: this.m_nPos, sel: false, equip: false };
                    res.push(data);
                }
            }

            let targetType = 0;
            if(this.m_nOldStoneId > 0){
                targetType = C.GemstoneConfig[this.m_nOldStoneId].type;
            }
            res.sort((a, b) => {
                let typeA = C.GemstoneConfig[a.itemId].type;
                let typeB = C.GemstoneConfig[b.itemId].type;
                if (typeA == typeB) {
                    return b.itemId - a.itemId;
                }
                if(targetType > 0){
                    if(typeA == targetType) return -1;
                    if(typeB == targetType) return 1;
                }
                return typeA - typeB;
            });
            if (this.m_nOldStoneId > 0) {
                res.unshift({ itemId: this.m_nOldStoneId, pos: this.m_nPos, sel: false, equip: true });
            }

            this.m_tCollection.replaceAll(res);

            this.setCurSelected(0);

            EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
            EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquipHandler);

            this.m_pItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onStoneItemHandler, this);
        }

        /**设置当前选中 */
        private setCurSelected(index: number) {
            if (this.m_nCurIndex == index) return;
            let item: IStoneRD = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {
                item.sel = false;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
            this.m_nCurIndex = index;
            item = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {

                this.m_btnEquip.visible = !item.equip;
                this.m_btnUnEquip.visible = item.equip;
                item.sel = true;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
        }
        /**选中宝石回调 */
        private onStoneItemHandler(e: eui.ItemTapEvent) {
            this.setCurSelected(e.itemIndex);
        }

        /**镶嵌按钮回调 */
        private onBtnEquipHandler() {
            let data: IStoneRD = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                TreasureProxy.send_TREASURE_ASSEMBLING_GEMSTONE(this.m_nItemId, this.m_nPos, data.itemId);
            }
            UpManager.history();
        }

        /**卸下 */
        private onBtnUnEquipHandler() {
            TreasureProxy.send_TREASURE_ASSEMBLING_GEMSTONE(this.m_nItemId, this.m_nPos, 0);
            UpManager.history();
        }
    }

    /** 宝石*/
    interface IStoneRD {
        itemId: number,
        pos: number,
        sel: boolean,
        equip: boolean,
    }

    class StoneRender extends eui.ItemRenderer {
        protected m_item: TreaInLayListItem;
        private m_imgSelect: eui.Image;  //选中框

        protected m_tData: IStoneRD;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            if (this.m_imgSelect) {
                Utils.removeFromParent(this.m_imgSelect);
                this.m_imgSelect = null;
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = new TreaInLayListItem();
            this.addChild(this.m_item);

            this.m_imgSelect = new com_main.CImage("border_015_png");
            this.m_imgSelect.scale9Grid = new egret.Rectangle(28, 19, 26, 42);
            this.m_imgSelect.x = -4;
            this.m_imgSelect.y = -4;
            this.m_imgSelect.width = 331;
            this.m_imgSelect.height = 142;
            this.addChild(this.m_imgSelect);
        }


        protected dataChanged() {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.pos);
                this.m_item.setEquipState(this.m_tData.equip);
                this.m_imgSelect.visible = this.m_tData.sel;
            }
        }

    }
}