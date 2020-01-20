module com_main {
    /**状况数据 */
    export interface ICrossWarSitu {
        isOwn: boolean,//是否是我方
        occupant: number//占领数量
        teamNum: number//部队数量
    }
    /**
     * 跨服战战况
     * @export
     * @class 
     * @extends CView
     */
    export class CrossServerWarSituView extends CView {

        public static readonly NAME = "CrossServerWarSituView";
        public m_PopUp: com_main.APopUp;
        public ownSituComp: com_main.CrossServerWarSituComp;
        public enemySituComp: com_main.CrossServerWarSituComp;
        public m_lbCity: com_main.CLabel;
        public m_build_1: com_main.CrossServerWarNameComp;
        public m_build_5: com_main.CrossServerWarNameComp;
        public m_build_2: com_main.CrossServerWarNameComp;
        public m_build_3: com_main.CrossServerWarNameComp;
        public m_build_4: com_main.CrossServerWarNameComp;
        public m_build_6: com_main.CrossServerWarNameComp;
        public m_build_7: com_main.CrossServerWarNameComp;





        public constructor() {
            super();
            this.name = CrossServerCampView.NAME;

            this.initApp("cross/CrossServerWarSituViewSkin.exml");
        }
        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.updateData();
            this.setCityId();
        }
        public updateData() {
            let curWarCity: number = CrossModel.getCurWarCity();
            this.m_lbCity.text = GLan(C.CrossServerAreaConfig[curWarCity].name);
            this.m_PopUp.setTitleLabel(GLan(C.CrossServerAreaConfig[curWarCity].name))
            let ownCrossServerWar: com_main.ICrossWarSitu = CrossModel.getCrossSituData(true);
            let enemyCrossServerWar: com_main.ICrossWarSitu = CrossModel.getCrossSituData(false);
            this.ownSituComp.updateUI(ownCrossServerWar);
            this.enemySituComp.updateUI(enemyCrossServerWar);
        }
        /**设置城市 */
        private setCityId() {
            for (let i = 1; i <= 7; i++) {
                this['m_build_' + i].bId = i;
            }
        }

        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */

        private addEvent() {

        }
        private removeEvent() {

        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
    }

}
