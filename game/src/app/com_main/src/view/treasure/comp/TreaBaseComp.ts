module com_main {
    /** 道具 */
    export class TreaBaseComp extends CComponent {

        protected m_nItemId: number;       //当前id
        protected m_curVo: TreasureVo; //宝物数据

        public constructor() {
            super();
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }


        /**设置id */
        public set itemId(val: number) {
            if (this.m_nItemId == val || isNull(val)) return;
            this.m_nItemId = val;
            this.m_curVo = TreasureModel.getData(this.m_nItemId);
            if (!this.m_curVo) this.m_curVo = TreasureModel.getPreViewVo(this.m_nItemId);
            this.initView();
        }
        
        public get itemId() {
            return this.m_nItemId;
        }

        /**初始化界面 */
        protected initView() {

        }

    }

}