module com_main {
	/**
	 * 新手描述框
	 */
    export class GuideDesView extends CView {
        public static NAME = 'GuideDesView';

        public m_pLbDec: com_main.CLabel;
        public m_pBtnMask: eui.Group;

        private m_tData: GuideStepData;
        private m_tDesList: string[];
        private m_nDesId: number;

        public constructor(data: GuideStepData) {
            super();
            this.name = GuideDesView.NAME;
            this.m_tData = data;
            this.skinName = Utils.getComSkin("guide/GuideDesViewSkin.exml");

        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchTapListener(this.m_pBtnMask, this, this.onShowNext);
            let des = GLan(this.m_tData.stepCfg.desParam);
            this.m_tDesList = des == '' ? [] : JSON.parse(des);
            this.m_nDesId = 0;
            this.onShowNext();
        }

        //显示下一句
        private onShowNext() {
            if (this.m_nDesId >= this.m_tDesList.length) {
                this.closeDialog();
            } else {
                this.m_pLbDec.textFlow =Utils.htmlParser(this.m_tDesList[this.m_nDesId]);
            }
            this.m_nDesId++;
        }

        private closeDialog() {
            SceneManager.closeGuidePanelByName(GuideDesView.NAME);
        }
    }
}