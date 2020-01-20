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
// 剑阵
var com_main;
(function (com_main) {
    var JianzhenSkillAnimation = /** @class */ (function (_super_1) {
        __extends(JianzhenSkillAnimation, _super_1);
        function JianzhenSkillAnimation(avo, battleSceneMgr, mapView, position) {
            return _super_1.call(this, avo, battleSceneMgr, mapView, position, true) || this;
        }
        JianzhenSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        JianzhenSkillAnimation.prototype.createAnimation = function (avo, position) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            // let animation = "longjuanfen";
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            var unitinfo = BattleModel.getUnit(avo.attackData.id);
            if (unitinfo.faction == FactionType.ATK) {
                effectMC.play("jianzhen_upRinht", 1, this.isAutoRelease);
            }
            else {
                effectMC.play("jianzhen_leftDown", 1, this.isAutoRelease);
            }
            // effectMC.play(skilleffectData.actionName,1,this.isAutoRelease);
            effectMC.x = position.x;
            effectMC.y = position.y;
            // this.addChild(effectMC);
            // BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            this.effect = effectMC;
            // this.effect.scaleX = skilleffectData.scale;
            // this.effect.scaleY = skilleffectData.scale;
        };
        return JianzhenSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.JianzhenSkillAnimation = JianzhenSkillAnimation;
})(com_main || (com_main = {}));
