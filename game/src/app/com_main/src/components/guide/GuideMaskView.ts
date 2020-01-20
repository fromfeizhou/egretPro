
module com_main {
	/**
	 * 指引遮罩面板相关
	 */
    export class GuideMaskView extends CView {
        public static NAME = 'GuideMaskView';


        public static getClass(): GuideMaskView {
            let obj = SceneManager.getClass(LayerEnums.NET, GuideMaskView.NAME);
            return obj;
        }
        public static show() {
            let view = GuideMaskView.getClass();
            if (!view) {
                view = new GuideMaskView();
                view.height = AGame.R.app.stageHeight;
                view.width = AGame.R.app.stageWidth;
                SceneManager.addChild(LayerEnums.NET, view, 0);
            }
        }

        public static hide() {
            let view = GuideMaskView.getClass();
            if (view) view.onDestroy();
        }

        public constructor() {
            super();
            this.name = GuideMaskView.NAME;
            this.skinName = Utils.getComSkin("guide/guide_delay_mask_view_skin.exml");
        }
        public onDestroy(): void {
            Utils.removeFromParent(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }
       
    }
}