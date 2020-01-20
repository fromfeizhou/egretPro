var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**提示图标 可以设置背景文字 */
    var RemindIcon = /** @class */ (function (_super_1) {
        __extends(RemindIcon, _super_1);
        function RemindIcon() {
            var _this = _super_1.call(this) || this;
            /**自身宽 */
            _this.m_pWidth = 30;
            /**自身高 */
            _this.m_pHeight = 30;
            _this.init();
            return _this;
        }
        RemindIcon.create = function () {
            var obj = new RemindIcon();
            return obj;
        };
        RemindIcon.prototype.init = function () {
            this.touchEnabled = false;
            this.touchChildren = false;
            this.width = this.m_pWidth;
            this.height = this.m_pHeight;
            AnchorUtil.setAnchor(this, 0.5);
            this.initView();
        };
        RemindIcon.prototype.onDestroy = function () {
            Utils.removeAllChild(this);
            this.m_pImgIcon = null;
            this.m_pLblName = null;
        };
        RemindIcon.prototype.initView = function () {
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
        };
        RemindIcon.prototype.setText = function (val) {
            if (this.m_pLblName) {
                this.m_pLblName.text = val;
                this.doLayout();
            }
        };
        /**慢慢维护里面的参数 */
        RemindIcon.prototype.setTextFont = function (size) {
            if (this.m_pLblName) {
                this.m_pLblName.textAlign = egret.HorizontalAlign.CENTER;
                this.m_pLblName.verticalAlign = egret.VerticalAlign.MIDDLE;
                this.m_pLblName.textColor = GameConfig.TextColors.fontWhite;
                this.m_pLblName.strokeColor = GameConfig.TextColors.stroke;
                this.m_pLblName.size = fontSize(size || 25);
                this.m_pLblName.stroke = 2;
            }
        };
        RemindIcon.prototype.doLayout = function () {
            AnchorUtil.setAnchor(this.m_pLblName, 0.5);
            this.m_pLblName.x = this.width / 2;
            this.m_pLblName.y = this.height / 2;
        };
        return RemindIcon;
    }(egret.DisplayObjectContainer));
    com_main.RemindIcon = RemindIcon;
})(com_main || (com_main = {}));
