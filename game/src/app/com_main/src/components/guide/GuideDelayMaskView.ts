
module com_main {
	/**
	 * 指引遮罩面板相关
	 */
    export class GuideDelayMaskView extends CView {
        public static NAME = 'GuideDelayMaskView';

        private m_nDelay: number;

        public constructor(delay: number = 500) {//{heroId:xxx,dialog:"XXX"}
            super();
            this.m_nDelay = delay;
            this.name = GuideDelayMaskView.NAME;
            this.skinName = Utils.getComSkin("guide/guide_delay_mask_view_skin.exml");
        }
        public onDestroy(): void {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchTapListener(this, this, () => { });
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);

        }

        private onTimeHandler() {
            this.m_nDelay -= 30;
            if (this.m_nDelay <= 0) {
                if (WorldView.isMove() || MainMap.isMove()) return;
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.closeView();
            }
        }

        private closeView() {
            SceneManager.closeGuidePanelByName(GuideDelayMaskView.NAME);
        }
    }
}