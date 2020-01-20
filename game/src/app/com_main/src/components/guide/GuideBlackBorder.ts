/**
 * 电影上下黑边效果
 */
module com_main {
    export class GuideBlackBorder extends eui.Component {
        public constructor() {
            super();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();

            let top = new eui.Image("border_006_png");
            top.width = GameConfig.curWidth();
            top.height = 70;
            this.addChild(top);

            let bottom = new eui.Image("border_006_png");
            bottom.width = GameConfig.curWidth();
            bottom.height = 70;
            bottom.y = GameConfig.curHeight() - 70;
            this.addChild(bottom);

            AGame.R.app.popUpLevel.addChild(this);
        }
    }
}
    