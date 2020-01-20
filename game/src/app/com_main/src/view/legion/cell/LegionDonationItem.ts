module com_main {
    export class LegionDonationItem extends CComponent {

        public m_pIconRoot: eui.Group;
        public m_imgIcon: com_main.CImage;
        public m_labLevel: eui.Label;
        public m_labName: eui.Label;
        public m_labDes: eui.Label;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("legion/tabView/LegionDonationCellSkin.exml");
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        /**显示信息 */
        public shoWInfo(name: string, level: number, des: string, source: string) {
            this.m_labName.text = name;
            this.m_labLevel.text = GCode(CLEnum.LEVEL2) + level.toString();
            this.m_labDes.text = des;
            this.m_imgIcon.source =  source + '_png';
            Utils.isGray(level == 0, this.m_pIconRoot);
        }
    }
}