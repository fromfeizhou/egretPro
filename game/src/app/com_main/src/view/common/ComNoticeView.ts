module com_main {
    export class ComNoticeView extends CView {
        public static NAME = "ComNoticeView";
        public m_apopUp: com_main.APopUp;
        public m_nImg: eui.Image;
        public m_lbTime: eui.Label;

        public m_notice: gameProto.IActivityNotiseConfig;
        public m_timStr: string = "活动截止时间：11月21日0点"
        public constructor(data: gameProto.IActivityNotiseConfig) {
            super();
            this.m_notice = data
            this.name = ComNoticeView.NAME;
            this.initApp("common/ComNoticeViewSkin.exml");

        }

        public onDestroy(): void {
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_NOTICE]);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel(GCode(CLEnum.AC_NOTICE));
            this.refresh();
        }

        /**刷新面板 */
        private refresh() {
            this.m_lbTime.text = this.m_timStr;
            this.m_nImg.source = LoginConst.getResUrl(this.m_notice.url, 'notice');
            switch (this.m_notice.type) {
                case AcNoticeEnum.IMG_TEXT:
                    this.m_lbTime.horizontalCenter = 0;
                    this.m_lbTime.y = 110;
                    this.m_lbTime.visible = true;
                    this.m_lbTime.text = "活动截止时间：" + this.getTimeStr(this.m_notice.closeDate.replace(/-/g,"/"));
                    break;
                case AcNoticeEnum.IMG:
                    this.m_lbTime.visible = false;
                    break;
            }
        }

        public getTimeStr(time: string): string {
            let date: Date = new Date(time);
            return date.getFullYear() + "年" +(date.getMonth()+1)+ "月" + date.getDate() + "日"
        }

    }
}