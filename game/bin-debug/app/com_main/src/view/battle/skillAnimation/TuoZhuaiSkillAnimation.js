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
    var TuoZhuaiSkillAnimation = /** @class */ (function (_super_1) {
        __extends(TuoZhuaiSkillAnimation, _super_1);
        function TuoZhuaiSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.effectList = [];
            _this.createAnimation(avo);
            return _this;
        }
        TuoZhuaiSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
            // if(evt.frameLabel == "shake"){
            // 	EffectUtils.shakeScreen(this.mapView,2);
            // }else if(evt.frameLabel == "flyBlood"){
            // 	for(let i in this.avo.unitAttrChange){
            // 		let attrChange = this.avo.unitAttrChange[i];
            // 		this.battleSceneMgr.unitAttrChange(BattleUnitAttrChangeVo.create(attrChange));
            // 	}
            // }
        };
        TuoZhuaiSkillAnimation.prototype.createAnimation = function (avo) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            var targetUnitIdList = avo.targetList;
            //根据y层级排序
            function sortFun(a, b) {
                if (a.y > b.y) {
                    return 1;
                }
                else if (a.y < b.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            var targetObjList = [];
            for (var i in targetUnitIdList) {
                var targetObj = this.battleSceneMgr.getDynamicObj(targetUnitIdList[i].id);
                targetObjList.push(targetObj);
            }
            targetObjList.sort(sortFun);
            // console.log("targetObjList =",targetObjList);
            for (var i in targetObjList) {
                var targetObj = targetObjList[i];
                var unitinfo = targetObj.getUnitInfo();
                var effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                // console.log("unitinfo.faction = ",unitinfo.faction);
                if (unitinfo.faction == FactionType.ATK) {
                    effectMC.play("leftDown", 1, true);
                }
                else {
                    effectMC.play("RightUp", 1, true);
                }
                effectMC.x = targetObj.x;
                effectMC.y = targetObj.y;
                // this.addChild(effectMC);
                // BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
                com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
                this.effectList.push(effectMC);
            }
            this.effect = this.effectList[0];
            this.effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
        };
        TuoZhuaiSkillAnimation.prototype.onDestroy = function () {
            this.effect.destroy();
            for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                var effect = _a[_i];
                effect.destroy();
            }
        };
        return TuoZhuaiSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.TuoZhuaiSkillAnimation = TuoZhuaiSkillAnimation;
})(com_main || (com_main = {}));
