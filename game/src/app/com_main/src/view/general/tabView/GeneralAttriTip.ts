
module com_main {
    /**
     * 武将属性tip
     */
    export class GeneralAttriTip extends CComponent {

        public static NAME = "GeneralAttriTip";
        public m_labTitle: eui.Label;
        public m_labDoc: eui.Label;
        public attriType: number;
        public constructor(param?: number) {
            super();
            this.attriType = param;
            this.skinName = Utils.getAppSkin("general/tabView/General_Attri_tip.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.refresh();
        }

        public refresh() {
            let strTitle: string;
            let strDoc: string;
            if (this.attriType == AttriType.POWER) {
                strTitle = GCode(CLEnum.GEN_ATT_WL);
                strDoc = GCode(CLEnum.GEN_ATT_WL_TIPS);
            } else if (this.attriType == AttriType.INTELLIGENCE) {
                strTitle = GCode(CLEnum.GEN_ATT_ZL);
                strDoc = GCode(CLEnum.GEN_ATT_ZL_TIPS);
            } else {
                strTitle = GCode(CLEnum.GEN_ATT_TY);
                strDoc = GCode(CLEnum.GEN_ATT_TY_TIPS);
            }
            this.m_labTitle.text = strTitle;
            this.m_labDoc.text = strDoc;

        }
        public doAction(isShow: boolean) {
            egret.Tween.removeTweens(this);
            let tw = egret.Tween.get(this);

            if (isShow) {
                this.scaleY = 0;
                this.alpha = 0.5;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.cubicOut);
            } else {
                let tw = egret.Tween.get(this);
                tw.to({ alpha: 0 }, 300, Ease.cubicOut);
            }
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this);
            super.onDestroy();
        }


    }


}