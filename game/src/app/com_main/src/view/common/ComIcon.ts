module com_main {
    export class ComIcon extends CComponent {
        public static NAME = 'ComIcon';

        public m_pRoot: eui.Group;
        public m_imgBg: eui.Image;
        public m_imgLab: eui.Image;

        public constructor() {
            super();
            this.name = ComIcon.NAME;
            this.skinName = Utils.getAppSkin("common/ComIconSkin.exml")
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
        }

        public setInfo(iconUrl: string, labUrl: string) {
            this.m_imgBg.source = iconUrl;
            this.m_imgLab.source = labUrl;
        }

        /**监听事件用 */
        public get root() {
            return this.m_pRoot;
        }

    }
}