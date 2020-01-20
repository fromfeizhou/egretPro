module com_main {
    export class ComHelpDocView extends CView {
        public static NAME = "ComHelpDocView";

        public m_apopUp: com_main.APopUp;
        public m_lbContent: eui.Label;

        public m_content: string;
        public m_title: string;
        public constructor(param: any) {
            super();

            this.name = ComHelpDocView.NAME;
            this.initApp("common/ComHelpDocSkin.exml");
            this.m_content = param.content;
            this.m_title = param.title;
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel(GCode(CLEnum.WOR_HELP_TITLE));

            this.refresh();
        }

        /**刷新面板 */
        private refresh() {
            this.m_lbContent.textFlow = Utils.htmlParser(this.m_content);
            if (isNull(this.m_title))
                return;
            this.m_apopUp.setTitleLabel(this.m_title);
        }

    }
}