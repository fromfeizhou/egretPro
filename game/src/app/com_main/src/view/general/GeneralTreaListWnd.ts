module com_main {
	/**
	 * 宝物选中列表
	 */
    export class GeneralTreaListWnd extends CView {
        public static NAME = 'GeneralTreaListWnd';

        public m_APopUp: com_main.APopUp;
        public m_pItemList: eui.List;
        public m_btnEquip: com_main.ComButton;

        private m_nGeneralId: number;    //武将id
        private m_nGeneralType: SoliderGeneralType;  //武将类型

        private m_nCurIndex: number;
        private m_tCollection: eui.ArrayCollection;

        public constructor(param?) {
            super();
            this.name = GeneralTreaListWnd.NAME;
            this.m_nGeneralId = param.generalId;
            this.m_nGeneralType = param.generalType;
            this.initApp("general/GeneralTreaListWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.GEN_TITLE_BWZB));
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.GEN_TREA_ZB));

            this.refreshTreaList();
            EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
        }

        /**装备回调 */
        private onBtnEquipHandler() {
            let data: ITreaRD = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                GeneralProxy.send_GENERAL_TREASURE_WEAR(this.m_nGeneralId, data.itemId);
            } else {
                EffectUtils.showTips(GCode(CLEnum.GEN_TREA_NO), 1, true);
            }
            UpManager.history();
        }

        /**刷新列表显示 */
        private refreshTreaList() {
            let generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId) as GeneralVo;
            if (!generalVo) {
                return;
            }

            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemList.dataProvider = this.m_tCollection;
            this.m_pItemList.itemRenderer = TreaRender;
            this.m_pItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTreaHandler, this);

            let list = TreasureModel.getTreasByGeneralType(this.m_nGeneralType);
            let res: ITreaRD[] = [];
            for (let i = 0; i < list.length; i++) {
                let treaVo = list[i];
                res.push({ itemId: treaVo.itemId, sel: false });
            }
            this.m_tCollection.replaceAll(res);
            this.setCurSelected(0);
        }

        /**设置当前选中 */
        private setCurSelected(index: number) {
            if (this.m_nCurIndex == index) return;
            let item: ITreaRD = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {
                item.sel = false;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
            this.m_nCurIndex = index;
            item = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {
                item.sel = true;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
        }
        /**选中宝石回调 */
        private onTreaHandler(e: eui.ItemTapEvent) {
            this.setCurSelected(e.itemIndex);
        }
    }

    /** 宝石*/
    interface ITreaRD {
        itemId: number;
        sel: boolean,
    }

    class TreaRender extends eui.ItemRenderer {
        protected m_item: ComTreaItem;

        protected m_tData: ITreaRD;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = new ComTreaItem();
            this.addChild(this.m_item);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setInfo(this.m_tData.itemId);
                this.m_item.setSecected(this.m_tData.sel);
            }
        }

    }
}