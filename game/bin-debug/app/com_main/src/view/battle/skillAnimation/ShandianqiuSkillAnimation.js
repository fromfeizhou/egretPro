// 雷电技能
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
    var ShandianqiuSkillAnimation = /** @class */ (function (_super_1) {
        __extends(ShandianqiuSkillAnimation, _super_1);
        function ShandianqiuSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.shakeNum = 0;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.effectList = [];
            _this.playCount = 0;
            _this.flyBloodTime = 0;
            _this.createAnimation(avo);
            return _this;
        }
        ShandianqiuSkillAnimation.prototype.frame_event = function (evt) {
            var isShake = (evt.frameLabel == "shake" || evt.frameLabel == "shake_once_times" || evt.frameLabel == "shake_little_once_times");
            // 震动规则 只震动一次
            if (this.shakeNum % 3 != 0 && isShake) {
                this.shakeNum += 1;
                return;
            }
            else if (isShake) {
                this.shakeNum += 1;
            }
            if (evt.frameLabel == "flyBlood") {
                var targetCsq = this.targetObjList[this.flyBloodTime];
                if (targetCsq && targetCsq.getUnitInfo()) {
                    this.dealFlyBooldSingle(targetCsq, this.getTargetVo(targetCsq.getUnitInfo().elementId));
                }
                if (this.flyBloodTime == 0) {
                    this.dealBuff();
                }
                this.flyBloodTime += 1;
            }
            else {
                _super_1.prototype.frame_event.call(this, evt);
            }
        };
        ShandianqiuSkillAnimation.prototype.getTargetVo = function (id) {
            for (var _i = 0, _a = this.avo.targetList; _i < _a.length; _i++) {
                var target = _a[_i];
                if (target.id == id) {
                    return target;
                }
            }
        };
        ShandianqiuSkillAnimation.prototype.timerCallback = function () {
            var targetObj = this.targetObjList[this.playCount];
            if (targetObj) {
                var effectMC = new MCDragonBones();
                effectMC.initAsync(this.animation);
                effectMC.play(this.actionName, 1, true);
                effectMC.x = targetObj.x;
                effectMC.y = targetObj.y;
                com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC, targetObj.y);
                this.effectList.push(effectMC);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            }
            this.playCount += 1;
        };
        ShandianqiuSkillAnimation.prototype.createAnimation = function (avo) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            this.animation = skilleffectData.animation;
            if (config.skillEffectId == 134) {
                var Obj = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
                var list = [6, 7, 8, 1]; //右上方向
                if (list.indexOf(Obj.getDirection()) != -1) {
                    this.actionName = 'flxf_fx_1';
                }
                else {
                    this.actionName = 'flxf_fx_2';
                }
            }
            else {
                this.actionName = skilleffectData.actionName;
            }
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
            this.targetObjList = targetObjList;
            if (config.skillEffectId == 134) {
                Utils.TimerManager.doTimer(225, this.targetObjList.length - 1, this.timerCallback, this);
            }
            else {
                Utils.TimerManager.doTimer(30, this.targetObjList.length - 1, this.timerCallback, this);
            }
            this.timerCallback();
        };
        ShandianqiuSkillAnimation.prototype.onDestroy = function () {
            Tween.removeTweens(this);
            Utils.TimerManager.remove(this.timerCallback, this);
            for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                var effect = _a[_i];
                effect.destroy();
            }
        };
        return ShandianqiuSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.ShandianqiuSkillAnimation = ShandianqiuSkillAnimation;
})(com_main || (com_main = {}));
