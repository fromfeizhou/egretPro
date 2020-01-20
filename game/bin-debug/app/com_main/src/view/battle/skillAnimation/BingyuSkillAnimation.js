// 冰雨技能
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
    var BingyuSkillAnimation = /** @class */ (function (_super_1) {
        __extends(BingyuSkillAnimation, _super_1);
        function BingyuSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.effectList = [];
            _this.createAnimation(avo);
            _this.playCount = 0;
            _this.flyBloodTime = 0;
            return _this;
        }
        BingyuSkillAnimation.prototype.frame_event = function (evt) {
            if (evt.frameLabel == "flyBlood" && this.flyBloodTime == 0) {
                this.dealFlyBoold();
                this.flyBloodTime += 1;
                return;
            }
            _super_1.prototype.frame_event.call(this, evt);
        };
        BingyuSkillAnimation.prototype.timerCallback = function () {
            var targetObj = this.targetObjList[this.playCount];
            if (targetObj) {
                var effectMC = new MCDragonBones();
                effectMC.initAsync(this.animation);
                effectMC.play(this.animation, 1, true);
                effectMC.x = targetObj.x;
                effectMC.y = targetObj.y;
                com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC, targetObj.y);
                this.effectList.push(effectMC);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            }
            this.playCount += 1;
        };
        BingyuSkillAnimation.prototype.createAnimation = function (avo) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            this.animation = skilleffectData.animation;
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
            // targetObjList.sort(sortFun);
            this.targetObjList = targetObjList;
            Utils.TimerManager.doTimer(80, this.targetObjList.length - 1, this.timerCallback, this);
            this.timerCallback();
        };
        BingyuSkillAnimation.prototype.onDestroy = function () {
            // this.effect.destroy();
            Utils.TimerManager.remove(this.timerCallback, this);
            for (var _i = 0, _a = this.effectList; _i < _a.length; _i++) {
                var effect = _a[_i];
                effect.destroy();
            }
        };
        return BingyuSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.BingyuSkillAnimation = BingyuSkillAnimation;
})(com_main || (com_main = {}));
