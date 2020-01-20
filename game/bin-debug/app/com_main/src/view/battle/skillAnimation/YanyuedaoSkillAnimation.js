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
    var YanyuedaoSkillAnimation = /** @class */ (function (_super_1) {
        __extends(YanyuedaoSkillAnimation, _super_1);
        // public effectList:any[];		
        function YanyuedaoSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            // this.effectList = [];
            _this.createAnimation(avo);
            return _this;
        }
        YanyuedaoSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
        };
        YanyuedaoSkillAnimation.prototype.createAnimation = function (avo) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            // let animation = "yanYueDao";
            var targetUnitIdList = avo.targetList;
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            var Obj = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            var actionName = "";
            var dir = Obj.getFourDirection();
            if (dir == CSquare_Direction.LEFT_UP) {
                actionName = "leftUp";
            }
            else if (dir == CSquare_Direction.LEFT_DOWN) {
                actionName = "leftDown";
            }
            else if (dir == CSquare_Direction.RIGHT_DOWN) {
                actionName = "rightDown";
            }
            else if (dir == CSquare_Direction.RIGHT_UP) {
                actionName = "rightUp";
            }
            effectMC.play(actionName, 1, true);
            var _a = Obj.getMapXY(), x = _a[0], y = _a[1];
            effectMC.x = x;
            effectMC.y = y;
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            this.effect = effectMC;
        };
        return YanyuedaoSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.YanyuedaoSkillAnimation = YanyuedaoSkillAnimation;
})(com_main || (com_main = {}));
