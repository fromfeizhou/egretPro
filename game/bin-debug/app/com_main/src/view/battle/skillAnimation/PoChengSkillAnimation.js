// TypeScript file
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
    var PoChengSkillAnimation = /** @class */ (function (_super_1) {
        __extends(PoChengSkillAnimation, _super_1);
        function PoChengSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.light = 0;
            position.x = 1178;
            position.y = 605;
            _this.mapView = mapView;
            _this.battleSceneMgr = battleSceneMgr;
            _this.createAnimation(avo, position);
            Tween.get(_this).to({ lightNum: 1 }, 100);
            return _this;
        }
        PoChengSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        PoChengSkillAnimation.prototype.createAnimation = function (avo, position) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            effectMC.setCallback(this.recoveryColor, this);
            effectMC.x = position.x;
            effectMC.y = position.y;
            // this.addChild(effectMC);
            // BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            this.effect = effectMC;
            this.effect.play(skilleffectData.actionName, 1, true);
            // this.effect.scaleX = skilleffectData.scale;
            // this.effect.scaleY = skilleffectData.scale;
        };
        PoChengSkillAnimation.prototype.recoveryColor = function () {
            Tween.removeTweens(this);
            Tween.get(this)
                .to({ lightNum: 0 }, 500);
        };
        Object.defineProperty(PoChengSkillAnimation.prototype, "lightNum", {
            get: function () {
                return this.light;
            },
            set: function (num) {
                this.light = num;
                var g = -58 * num;
                var b = -47 * num;
                var colorMatrix = [
                    1, 0, 0, 0, 0,
                    0, 1, 0, 0, g,
                    0, 0, 1, 0, b,
                    0, 0, 0, 1, 0
                ];
                var fliter = new egret.ColorMatrixFilter(colorMatrix);
                // this.mapView.filters = [fliter];
                // if(num == 0){
                //     this.mapView.filters = [];
                // }
                this.battleSceneMgr.setColor(fliter);
            },
            enumerable: true,
            configurable: true
        });
        return PoChengSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.PoChengSkillAnimation = PoChengSkillAnimation;
})(com_main || (com_main = {}));
