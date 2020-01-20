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
    var LongJuanFengSkillAnimation = /** @class */ (function (_super_1) {
        __extends(LongJuanFengSkillAnimation, _super_1);
        function LongJuanFengSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.effectList = [];
            _this.createAnimation(avo);
            return _this;
        }
        LongJuanFengSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
            if (evt.frameLabel == "qifengEnd") {
                Utils.TimerManager.doTimer(800, 1, this.timerCallback, this);
                for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                    var effect = _a[_i];
                    effect.play("xunhuan", -1, false);
                }
            }
            else if (evt.frameLabel == "end") {
            }
        };
        LongJuanFengSkillAnimation.prototype.timerCallback = function () {
            for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                var effect = _a[_i];
                effect.play("end", 1, true);
            }
        };
        LongJuanFengSkillAnimation.prototype.createAnimation = function (avo) {
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
                if (targetObj) {
                    var effectMC = new MCDragonBones();
                    effectMC.initAsync(animation);
                    effectMC.play(animation, 1, false);
                    effectMC.x = targetObj.x;
                    effectMC.y = targetObj.y;
                    com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC, targetObj.y);
                    this.effectList.push(effectMC);
                }
            }
            this.effect = this.effectList[0];
            if (this.effect)
                this.effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
        };
        LongJuanFengSkillAnimation.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.timerCallback, this);
            for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                var effect = _a[_i];
                effect.destroy();
            }
        };
        return LongJuanFengSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.LongJuanFengSkillAnimation = LongJuanFengSkillAnimation;
})(com_main || (com_main = {}));
