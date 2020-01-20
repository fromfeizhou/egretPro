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
    var XuanfengzhanSkillAnimation = /** @class */ (function (_super_1) {
        __extends(XuanfengzhanSkillAnimation, _super_1);
        // public effectFeng :MCDragonBones;
        // public position : egret.Point;
        // public effectList:any[];		
        function XuanfengzhanSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            // this.effectList = [];
            _this.createAnimation(avo);
            return _this;
        }
        XuanfengzhanSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        XuanfengzhanSkillAnimation.prototype.createAnimation = function (avo) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            var targetUnitIdList = avo.targetList;
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            var Obj = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            effectMC.play(animation, 1, true);
            effectMC.x = Obj.x;
            effectMC.y = Obj.y;
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            this.effect = effectMC;
        };
        return XuanfengzhanSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.XuanfengzhanSkillAnimation = XuanfengzhanSkillAnimation;
})(com_main || (com_main = {}));
