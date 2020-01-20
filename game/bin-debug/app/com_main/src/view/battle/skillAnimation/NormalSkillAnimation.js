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
//普通技能动画
//包括 雷电
var com_main;
(function (com_main) {
    var NormalSkillAnimation = /** @class */ (function (_super_1) {
        __extends(NormalSkillAnimation, _super_1);
        function NormalSkillAnimation(avo, battleSceneMgr, mapView, position) {
            return _super_1.call(this, avo, battleSceneMgr, mapView, position, true) || this;
        }
        NormalSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        return NormalSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.NormalSkillAnimation = NormalSkillAnimation;
})(com_main || (com_main = {}));
