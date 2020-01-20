module com_main {
    export class GeneralGetInfoWndII extends GeneralGetInfoWnd {
        public static NAME = "GeneralGetInfoWndII";

        public constructor(param?) {
            super(param);
            this.name = GeneralGetInfoWndII.NAME;
        }

        protected playCardAction() {
            this.showUIAction();
        }

        /**显示ui */
        public showUIAction() {
            this.m_conEffEnter.visible = false;
            this.infoAction1.play(0);
            Sound.playGeneralSoundByID(GeneralModel.getGeneralSoundByGeneralID(this.m_generalId));
        }

    }
}