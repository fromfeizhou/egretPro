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
     * 角色面板信息
     */
    var RolePowerTipView = /** @class */ (function (_super_1) {
        __extends(RolePowerTipView, _super_1);
        function RolePowerTipView() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("role/role_power_tip.exml");
            return _this;
        }
        RolePowerTipView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        RolePowerTipView.prototype.doAction = function (isShow) {
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
        RolePowerTipView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            _super_1.prototype.onDestroy.call(this);
        };
        RolePowerTipView.NAME = "RolePowerTipView";
        return RolePowerTipView;
    }(com_main.CComponent));
    com_main.RolePowerTipView = RolePowerTipView;
})(com_main || (com_main = {}));
