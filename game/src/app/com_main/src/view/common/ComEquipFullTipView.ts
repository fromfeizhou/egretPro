module com_main {
    export class ComEquipFullTipView extends CView {
        public static NAME = "ComEquipFullTipView";
        public m_pRoot: eui.Group;
        public m_labDec: eui.Label;
        public m_labTip: eui.Label;
        public m_btnGoto: com_main.ComButton;
        public m_imgTitle: eui.Image;
        public m_pMaskBtn: eui.Group;


        private m_type: number;

        /**奖励通用界面 */
        public constructor(param: any) {
            super();
            this.name = ComEquipFullTipView.NAME;
            this.m_type = param.type;
            this.initApp("common/ComEquipFullTipViewSkin.exml");
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            EventManager.addTouchScaleListener(this.m_btnGoto, this, this.ClickGoto);
        }
        private initView() {
            this.m_imgTitle.source = this.m_type == 1 ? 'lb_zbym_png' : 'lb_zbspym_png';
            this.m_labDec.text = this.m_type == 1 ? GCode(CLEnum.EQUIP_FULL):GCode(CLEnum.EQUIP_SOUL_FULL);
            this.m_labTip.text = this.m_type == 1 ? GCode(CLEnum.EQUIP_RECOVER_TIPS) : '';
            let str = this.m_type == 1 ?GCode(CLEnum.EQUIP_TO_RECOVER):GCode(CLEnum.EQUIP_TO_COMPOSE);
            this.m_btnGoto.setTitleLabel(str);
            EventManager.addTouchScaleListener(this.m_btnGoto, this, this.ClickGoto);
        }
        private ClickGoto() {
            UpManager.close();
            let gotoId= this.m_type == 1 ?100017:100016;
            FunctionModel.funcToPanel(gotoId);
        }


    }
}