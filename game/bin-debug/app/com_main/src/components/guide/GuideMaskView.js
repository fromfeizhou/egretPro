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
    /**
     * 指引遮罩面板相关
     */
    var GuideMaskView = /** @class */ (function (_super_1) {
        __extends(GuideMaskView, _super_1);
        function GuideMaskView() {
            var _this = _super_1.call(this) || this;
            _this.name = GuideMaskView.NAME;
            _this.skinName = Utils.getComSkin("guide/guide_delay_mask_view_skin.exml");
            return _this;
        }
        GuideMaskView.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.NET, GuideMaskView.NAME);
            return obj;
        };
        GuideMaskView.show = function () {
            var view = GuideMaskView.getClass();
            if (!view) {
                view = new GuideMaskView();
                view.height = AGame.R.app.stageHeight;
                view.width = AGame.R.app.stageWidth;
                SceneManager.addChild(LayerEnums.NET, view, 0);
            }
        };
        GuideMaskView.hide = function () {
            var view = GuideMaskView.getClass();
            if (view)
                view.onDestroy();
        };
        GuideMaskView.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
        };
        GuideMaskView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GuideMaskView.NAME = 'GuideMaskView';
        return GuideMaskView;
    }(com_main.CView));
    com_main.GuideMaskView = GuideMaskView;
})(com_main || (com_main = {}));
