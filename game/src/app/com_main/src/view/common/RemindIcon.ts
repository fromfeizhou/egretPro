module com_main {
    /**提示图标 可以设置背景文字 */
    export class RemindIcon extends egret.DisplayObjectContainer implements IFObject {
        /**自身宽 */
        private m_pWidth: number = 30;
        /**自身高 */
        private m_pHeight: number = 30;

        private m_pImgIcon: egret.Bitmap;
        /**标题 */
        private m_pLblName: eui.Label;

        public static create(): RemindIcon {
            let obj = new RemindIcon();
            return obj;
        }

        public constructor() {
            super();
            this.init();
        }

        public init() {
            this.touchEnabled = false;
            this.touchChildren = false;
            this.width = this.m_pWidth;
            this.height = this.m_pHeight;
            AnchorUtil.setAnchor(this, 0.5);
            this.initView();
        }

        public onDestroy() {
            Utils.removeAllChild(this);
            this.m_pImgIcon = null;
            this.m_pLblName = null;
        }

        public initView() {
            if (!this.m_pImgIcon) {
                this.m_pImgIcon = Utils.DisplayUtils.createBitmap("common_icon_yb_png");
                Utils.addChild(this, this.m_pImgIcon);
            }
            AnchorUtil.setAnchor(this.m_pImgIcon, 0.5);
            this.m_pImgIcon.x = this.width / 2;
            this.m_pImgIcon.y = this.height / 2;
            
            if (!this.m_pLblName) {
                this.m_pLblName = new eui.Label();
                this.m_pLblName.textAlign = egret.HorizontalAlign.CENTER;
                this.m_pLblName.verticalAlign = egret.VerticalAlign.MIDDLE;
                this.m_pLblName.textColor = GameConfig.TextColors.goldYellow;
                this.m_pLblName.strokeColor = GameConfig.TextColors.stroke;
                this.m_pLblName.size = fontSize(32);
                this.m_pLblName.stroke = 2;
                Utils.addChild(this, this.m_pLblName);
            }
        }

        public setText(val: any) {
            if (this.m_pLblName) {
                this.m_pLblName.text = val;
                this.doLayout();
            }
        }

        /**慢慢维护里面的参数 */
        public setTextFont(size?: number) {
            if (this.m_pLblName) {
                this.m_pLblName.textAlign = egret.HorizontalAlign.CENTER;
                this.m_pLblName.verticalAlign = egret.VerticalAlign.MIDDLE;
                this.m_pLblName.textColor = GameConfig.TextColors.fontWhite;
                this.m_pLblName.strokeColor = GameConfig.TextColors.stroke;
                this.m_pLblName.size = fontSize(size || 25);
                this.m_pLblName.stroke = 2;
            }
        }

        public doLayout(){
            AnchorUtil.setAnchor(this.m_pLblName, 0.5);
            this.m_pLblName.x = this.width / 2;
            this.m_pLblName.y = this.height / 2;
        }
    }
}