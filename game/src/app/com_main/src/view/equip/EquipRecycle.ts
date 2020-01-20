module com_main {
    /**回收筛选 */
    export class EquipRecycle extends CView {

        private RecycleList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        public static NAME = "EquipRecycle";
        public m_APopUp: com_main.APopUp;

        public m_btnConfirm: com_main.ComButton;
        public m_imgTick: eui.Image;
        public m_TickRooot: eui.Group;
        public allState: boolean;   //全选状态
        public isSur: boolean;   //是否确定


        public m_ItemList: eui.List;
        private m_pCollection: eui.ArrayCollection;   //列表数据
        public constructor() {
            super();
            this.name = EquipRecycle.NAME;
            this.initApp("equip/EquipRecycleSkin.exml");
            this.isSur = false;
        }

        public onDestroy() {
            super.onDestroy();
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, { isSur: this.isSur, allState: this.allState });
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_ItemList.dataProvider = this.m_pCollection;
            this.m_ItemList.itemRenderer = EquipRecycleRender;
            this.m_ItemList.useVirtualLayout = true;
            this.m_ItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);
            EventManager.addTouchTapListener(this.m_TickRooot, this, this.onTickClick);

            this.setRecycle();
        }
        /**设置回收档次 */
        private setRecycle() {
            let res: IEquipRecycleRD[] = [];
            for (let i = 0; i < this.RecycleList.length; i++) {
                let lv = this.RecycleList[i];
                let vo: IEquipRecycleRD = { level: lv, mulstate: lv <= 50 };
                res.push(vo);
                 if (vo.mulstate) {
                    EquipModel.lvList.push(lv);
                }
            }
            this.m_pCollection.replaceAll(res);
        }
        private onTickClick() {
            let state = !this.allState;
            this.m_imgTick.visible = state;
            this.allState = state;
            this.allTick(state);
        }
        /**设置全选按钮状态*/
        private setalltickState(state: boolean) {
            this.m_imgTick.visible = state;
        }
        /**全选 */
        private allTick(state: boolean) {
            EquipModel.lvList = [];
            let res: IEquipRecycleRD[] = [];
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEquipRecycleRD;
                if (data) {
                    res.push({ level: data.level, mulstate: state });
                }
                if (state) {
                    EquipModel.lvList.push(data.level);
                }
            }
            this.m_pCollection.replaceAll(res);
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, { isSur: true, allState: this.allState });
        }
        //确定
        private onConfirmClick() {
            this.isSur = true;
            UpManager.history();
        }
        private onClickEquip(e: any) {
            this.setMultiIndex(e.itemIndex);
        }
        /**
    * 设置当前选中
    * @param isConst 强制刷新
    *  */
        private setMultiIndex(index: number) {
            let data = this.m_pCollection.getItemAt(index) as IEquipRecycleRD;
            data.mulstate = !data.mulstate;
            this.m_pCollection.replaceItemAt(data, index);
            if (data.mulstate) {
                if (EquipModel.lvList.indexOf(data.level) == -1) {
                    EquipModel.lvList.push(data.level);
                }
            } else {
                let index = EquipModel.lvList.indexOf(data.level);
                EquipModel.lvList.splice(index, 1);
            }
            let res: IEquipRecycleRD[] = [];
            for (let i = 0; i < this.m_pCollection.source.length; i++) {

                if (this.m_pCollection.source.length == EquipModel.lvList.length) {
                    this.allState = true;
                } else {
                    this.allState = false;
                }
            }
            this.setalltickState(this.allState);
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this);
        }
    }
    interface IEquipRecycleRD {
        level: number,
        mulstate: boolean,
    }
    class EquipRecycleRender extends eui.ItemRenderer {
        protected m_RecycleCell: EquipRecycleCell;
        protected m_imgSelected: eui.Image;
        protected m_imgMulti: eui.Image;
        protected m_norRoot: egret.DisplayObjectContainer;
        protected m_multiRoot: egret.DisplayObjectContainer;

        protected m_tData: IEquipRecycleRD;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_RecycleCell = new EquipRecycleCell();
            this.addChild(this.m_RecycleCell);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_RecycleCell.setRecycleInfo(this.m_tData.level, this.m_tData.mulstate);
        }
    }

}