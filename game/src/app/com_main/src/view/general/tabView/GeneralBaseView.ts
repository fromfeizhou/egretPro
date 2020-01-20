module com_main {
    export class GeneralBaseView extends CComponent {


        private m_nGeneralId: number;
        private m_generalVo: GeneralVo;

        public constructor(width: number, height: number) {
            super();
            this.width = width;
            this.height = height;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.addEvent();
        }

        public get generalId() {
            return this.m_nGeneralId;
        }

        public set generalId(id: number) {
            this.m_nGeneralId = id;
            this.m_generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            this.clearView();
            this.refreshView();
        }

        protected get generalVo() {
            return this.m_generalVo;
        }

        /**子类重写 */
        public refreshView() {

        }
        /**清理显示 */
        public clearView() {

        }

        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected addEvent() {
        }

        protected removeEvent() {
        }


        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}