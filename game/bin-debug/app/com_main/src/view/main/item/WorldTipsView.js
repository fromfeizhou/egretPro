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
    var WorldTipsView = /** @class */ (function (_super_1) {
        __extends(WorldTipsView, _super_1);
        function WorldTipsView() {
            var _this = _super_1.call(this) || this;
            _this.name = WorldTipsView.NAME;
            _this.skinName = Utils.getAppSkin("top_new/item/WorldTipsViewSkin.exml");
            return _this;
        }
        WorldTipsView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldTipsView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldTipsView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labDes.text = GCodeFromat(CLEnum.WOR_LEVEL_TIPS, WorldModel.worldLevel);
        };
        WorldTipsView.prototype.doAction = function (isShow) {
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this);
            if (isShow) {
                this.scaleY = 0;
                this.alpha = 0.5;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.cubicOut);
            }
            else {
                var tw_1 = egret.Tween.get(this);
                tw_1.to({ alpha: 0 }, 300, Ease.cubicOut);
            }
        };
        WorldTipsView.NAME = "WorldTipsView";
        return WorldTipsView;
    }(com_main.CComponent));
    com_main.WorldTipsView = WorldTipsView;
})(com_main || (com_main = {}));
