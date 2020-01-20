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
    var BaguaSkillAnimation = /** @class */ (function (_super_1) {
        __extends(BaguaSkillAnimation, _super_1);
        // public avo: SkillAtkVo;
        // public battleSceneMgr:BattleSceneMgr;
        // public mapView: BaseMap;
        // public effect:MCDragonBones;
        function BaguaSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.createAnimation(avo, position);
            return _this;
        }
        BaguaSkillAnimation.prototype.createAnimation = function (avo, position) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            effectMC.play(animation, 1, false);
            effectMC.x = position.x;
            effectMC.y = position.y;
            // this.addChild(effectMC);
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            // BattleSceneMgr.getInstance().addChildToEffect(effectMC);
            this.effect = effectMC;
        };
        BaguaSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
            if (evt.frameLabel == "start") {
                this.effect.play("repeat", -1, false);
                var skilldata = this.avo.getSkillConfig();
                // Utils.TimerManager.doTimer(skilldata.playTime, 1, this.timerCallback, this);
            }
            else if (evt.frameLabel == "repeat") {
                this.effect.play("end", 1, true);
            }
            else if (evt.frameLabel == "end") {
            }
            // else if(evt.frameLabel == "shake"){
            // 	EffectUtils.shakeScreen(this.mapView,2);
            // }else if(evt.frameLabel == "flyBlood"){
            // 	// EffectUtils.shakeScreen(this.mapView,2);
            // 	for(let i in this.avo.unitAttrChange){
            // 		let attrChange = this.avo.unitAttrChange[i];
            // 		this.battleSceneMgr.unitAttrChange(BattleUnitAttrChangeVo.create(attrChange));
            // 	}
            // 	console.log("this.avo.unitAttrChange  = ",this.avo.unitAttrChange);
            // }
        };
        BaguaSkillAnimation.prototype.timerCallback = function () {
            this.effect.play("end", 1, true);
        };
        return BaguaSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.BaguaSkillAnimation = BaguaSkillAnimation;
})(com_main || (com_main = {}));
