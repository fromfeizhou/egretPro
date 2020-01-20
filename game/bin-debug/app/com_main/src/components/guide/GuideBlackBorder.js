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
/**
 * 电影上下黑边效果
 */
var com_main;
(function (com_main) {
    var GuideBlackBorder = /** @class */ (function (_super_1) {
        __extends(GuideBlackBorder, _super_1);
        function GuideBlackBorder() {
            var _this = _super_1.call(this) || this;
            _this.width = GameConfig.curWidth();
            _this.height = GameConfig.curHeight();
            var top = new eui.Image("border_006_png");
            top.width = GameConfig.curWidth();
            top.height = 70;
            _this.addChild(top);
            var bottom = new eui.Image("border_006_png");
            bottom.width = GameConfig.curWidth();
            bottom.height = 70;
            bottom.y = GameConfig.curHeight() - 70;
            _this.addChild(bottom);
            AGame.R.app.popUpLevel.addChild(_this);
            return _this;
        }
        return GuideBlackBorder;
    }(eui.Component));
    com_main.GuideBlackBorder = GuideBlackBorder;
})(com_main || (com_main = {}));
