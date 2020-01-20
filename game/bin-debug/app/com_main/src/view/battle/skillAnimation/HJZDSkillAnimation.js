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
//吼叫震动
var com_main;
(function (com_main) {
    var HJZDSkillAnimation = /** @class */ (function (_super_1) {
        __extends(HJZDSkillAnimation, _super_1);
        function HJZDSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = this;
            var targetObj = battleSceneMgr.getDynamicObj(avo.attackData.id);
            var _a = targetObj.getMapXY(), x = _a[0], y = _a[1];
            var pos = new egret.Point(x, y);
            _this = _super_1.call(this, avo, battleSceneMgr, mapView, pos, true) || this;
            return _this;
        }
        HJZDSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        return HJZDSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.HJZDSkillAnimation = HJZDSkillAnimation;
})(com_main || (com_main = {}));
