module com_main {
    /**
     * 基础组件
     */
    export class EquipBaseComp extends CComponent {
        protected m_nGeneralId: number;  //武将id
        protected m_nEquipPos: IEquipPos;        //装备格子
        public constructor() {
            super();
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        /**设置武将id */
        public set generalId(val: number) {
            if (this.m_nGeneralId == val) return;
            this.m_nGeneralId = val;
            this.clearView();
            this.initView();
        }

        public get generalId(): number {
            return this.m_nGeneralId;
        }

        /**设置装备格子 */
        public set equipPos(val: IEquipPos) {
            if (this.m_nEquipPos == val) return;
            this.m_nEquipPos = val;
            this.refreshView();
        }

        public get equipPos(): IEquipPos {
            return this.m_nEquipPos;
        }

        /**清理显示 */
        public clearView() {

        }
        /**初始化显示 */
        public initView() {

        }


        /**刷新显示 */
        public refreshView() {

        }
    }
}