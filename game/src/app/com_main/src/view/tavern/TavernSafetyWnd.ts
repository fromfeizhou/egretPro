module com_main {


	/**
	 * 保底召唤
	 */
    export class TavernSafetyWnd extends CView {
        public static NAME = 'TavernSafetyWnd';
        public m_PopUp: com_main.APopUp;
        public m_imgPro: eui.Image;
        public m_pScore: eui.Label;
        public m_labTip: com_main.CLabel;
        public m_pEffRoot: eui.Group;

        private m_effect: MCDragonBones;  //红品质特效
        private WIDTH = 370;//保底进度条width值
        private m_currSorce: number;//当前积分
        private m_MaxSorce: number;//积分上限
        public constructor(sorce: number) {
            super();
            this.name = TavernSafetyWnd.NAME;
            this.m_currSorce = sorce;
            this.initApp("tavern/TavernSafetyWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
            this.clearGeneralEffect();
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.TAVEN_SAFETY_CALL));
            this.m_MaxSorce = ConstUtil.getValue(IConstEnum.TAVERN_EXCHANGE_SCORE);//积分上限
            this.m_labTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_SAFETY_TIP, this.m_MaxSorce));
            this.refreshInfo();
            this.createGeneralEffect();
        }
        /**刷新积分 */
        private refreshInfo() {
            this.m_pScore.text = this.m_currSorce + '/' + this.m_MaxSorce;
            this.m_imgPro.width =this.m_currSorce>= this.m_MaxSorce?this.WIDTH:(this.m_currSorce / this.m_MaxSorce) * this.WIDTH;
        }
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置红品质特效 */
        private createGeneralEffect() {
            if (this.m_effect) return;
            this.m_effect = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_pEffRoot.addChild(this.m_effect);
        }
        private clearGeneralEffect() {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
            }
        }
        //=============================================================================================================================================
        //特效 end
        //============================================================================================================================================= 
    }
}