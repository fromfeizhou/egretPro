// 魅惑技能
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
    var MeihuoSkillAnimation = /** @class */ (function (_super_1) {
        __extends(MeihuoSkillAnimation, _super_1);
        function MeihuoSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.effList = []; //飞行特效队列
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.isDealBuff = false;
            _this.createAnimation(avo);
            return _this;
        }
        MeihuoSkillAnimation.prototype.createAnimation = function (avo) {
            var _this = this;
            var Obj = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            var _a = Obj.getMapXY(), objX = _a[0], objY = _a[1];
            var targetUnitIdList = avo.targetList;
            var _loop_1 = function (i) {
                var targetObj = this_1.battleSceneMgr.getDynamicObj(targetUnitIdList[i].id);
                if (targetObj) {
                    var tx = targetObj.x;
                    var ty = targetObj.y - 40;
                    var ax = objX;
                    var ay = objY - 50;
                    var eff_1 = com_main.CEffectFunc.addEffect(122);
                    this_1.effList.push(eff_1);
                    eff_1.x = ax;
                    eff_1.y = ay;
                    var radian = Utils.MathUtils.getRadian2(ax, ay, tx, ty);
                    var angle = Utils.MathUtils.getAngle(radian);
                    eff_1.rotation = angle;
                    eff_1.play();
                    var speed = 1200; //飞行速度
                    var dis = MathUtils.getInstance().getDistance(ax, ay, tx, ty);
                    var time = dis / speed * 1000;
                    egret.Tween.get(eff_1).to({ x: tx, y: ty }, time).call(function () {
                        if (targetObj && targetObj.getUnitInfo() && targetObj.addEffect) {
                            _this.dealFlyBooldSingle(targetObj, targetUnitIdList[i]);
                            targetObj.addEffect(121);
                            if (!_this.isDealBuff) {
                                _this.isDealBuff = true;
                                _this.dealBuff();
                            }
                        }
                        Utils.removeFromParent(eff_1);
                    });
                }
            };
            var this_1 = this;
            for (var i in targetUnitIdList) {
                _loop_1(i);
            }
        };
        MeihuoSkillAnimation.prototype.onDestroy = function () {
            for (var _i = 0, _a = this.effList; _i < _a.length; _i++) {
                var i = _a[_i];
                egret.Tween.removeTweens(i);
            }
            this.effList = null;
        };
        return MeihuoSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.MeihuoSkillAnimation = MeihuoSkillAnimation;
})(com_main || (com_main = {}));
