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
    var DubLevelSkillAnimation = /** @class */ (function (_super_1) {
        __extends(DubLevelSkillAnimation, _super_1);
        function DubLevelSkillAnimation(avo, battleSceneMgr, mapView, position) {
            return _super_1.call(this, avo, battleSceneMgr, mapView, position, true) || this;
        }
        DubLevelSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        DubLevelSkillAnimation.prototype.createAnimation = function (avo, position) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            var aniName = skilleffectData.actionName.split('|');
            this.effectList = [];
            var obj = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            var _a = obj.getMapXY(), x = _a[0], y = _a[1];
            for (var i in aniName) {
                var effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
                effectMC.play(aniName[i], 1, this.isAutoRelease);
                effectMC.x = x;
                effectMC.y = y;
                this.effectList.push(effectMC);
                if (Number(i) == 0) {
                    com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
                }
                else {
                    com_main.BattleSceneMgr.getInstance().addChildToEffect(effectMC);
                }
            }
        };
        DubLevelSkillAnimation.prototype.onDestroy = function () {
            if (this.effectList) {
                for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                    var effect = _a[_i];
                    effect.destroy();
                }
            }
        };
        return DubLevelSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.DubLevelSkillAnimation = DubLevelSkillAnimation;
})(com_main || (com_main = {}));
