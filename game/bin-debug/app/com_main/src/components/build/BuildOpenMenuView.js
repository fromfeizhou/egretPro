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
    var BuildOpenMenuView = /** @class */ (function (_super_1) {
        __extends(BuildOpenMenuView, _super_1);
        function BuildOpenMenuView() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/build/BuildOpenMenuViewSkin.exml");
            return _this;
        }
        BuildOpenMenuView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width * 0.5;
            this.anchorOffsetY = this.height * 0.5;
            this.m_bIsAction = false;
        };
        BuildOpenMenuView.prototype.onDestroy = function () {
            if (this.m_bIsAction && this.m_groupIcon) {
                egret.Tween.removeTweens(this.m_groupIcon);
                egret.Tween.removeTweens(this.m_imgEffect);
            }
        };
        BuildOpenMenuView.prototype.resreshTips = function (tipStr, isOpen) {
            if (isOpen === void 0) { isOpen = false; }
            var stateName = isOpen ? "open" : "lock";
            this.currentState = stateName;
            if (isOpen && !this.m_bIsAction) {
                this.m_bIsAction = true;
                EffectUtils.macIconShake(this.m_groupIcon, this.m_groupIcon.x, this.m_groupIcon.y);
                egret.Tween.get(this.m_imgEffect, { loop: true }).to({ rotation: 360 }, 2000);
            }
        };
        return BuildOpenMenuView;
    }(com_main.CComponent));
    com_main.BuildOpenMenuView = BuildOpenMenuView;
})(com_main || (com_main = {}));
