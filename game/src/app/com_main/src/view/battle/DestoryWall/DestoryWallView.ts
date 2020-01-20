
module com_main {
	/**
	 * 攻破城墙
	 */
    export class DestoryWallView extends CView {


        public static NAME = 'DestoryWallView';
        public rect:eui.Rect;
        public m_bg:eui.Group;
        public m_pBg:com_main.CImage;
        public cImage:com_main.CImage;



        private m_pShowAni: egret.tween.TweenGroup;


        public constructor() {
            super();
            this.name = DestoryWallView.NAME;
            this.initApp("battle_new/destoryWall/DestoryWallViewSkin.exml");
        }

        
        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pShowAni.addEventListener("complete", this.onBgAniFinish, this);
            this.m_pShowAni.play(0);
        }
        
        //播完动画
        private onBgAniFinish(event: egret.Event): void {
            // UpManager.history();
            Utils.removeFromParent(this)
        }
    }
}