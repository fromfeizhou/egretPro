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
/**
 * 赵云突刺技能
 */
var com_main;
(function (com_main) {
    var AssaultSkillAnimation = /** @class */ (function (_super_1) {
        __extends(AssaultSkillAnimation, _super_1);
        function AssaultSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo) || this;
            _this.m_attIndex = 0;
            _this.m_totalAttIndex = 4;
            _this.m_clientPlayIndex = -1;
            _this.m_targetList = [];
            _this.battleSceneMgr = battleSceneMgr;
            _this.mapView = mapView;
            _this.createAnimation();
            _this.setTargetList(_this.avo);
            return _this;
        }
        AssaultSkillAnimation.prototype.createAnimation = function () {
            if (this.avo.attackData.isOffSet > 0) {
                var attackObj = com_main.BattleSceneMgr.getInstance().getDynamicObj(this.avo.attackData.id);
                var position = ISOMap.getInstance().leftDownCellToPixel(this.avo.attackData.toPosX, this.avo.attackData.toPosY);
                var angle = Utils.MathUtils.getPosAngle({ x: attackObj.x, y: attackObj.y }, { x: position[0], y: position[1] });
                if (attackObj) {
                    // Tween.get(attackObj).wait(200).to({x:position[0], y:position[1]},300);
                    attackObj.setDirectionOnAngle(angle);
                }
                var config = this.avo.getSkillConfig();
                var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
                var animation = skilleffectData.animation;
                var effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
                var actionName = "";
                if (this.avo.attIndex == 0) {
                    actionName = "chong_0";
                }
                else if (this.avo.attIndex < AssaultSkillAnimation.tatolIndex) {
                    actionName = "chong_1";
                }
                else {
                    actionName = "chong_2";
                }
                effectMC.play(actionName, 1, true);
                // + CSquareFunc.getEffectDirectionByRotation(angle)
                effectMC.x = attackObj.x;
                effectMC.y = attackObj.y - 50;
                com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
                this.effect = effectMC;
                // this.effect.scaleX = skilleffectData.scale;
                // this.effect.scaleY = skilleffectData.scale;
                //角度
                this.effect.rotation = angle;
                if ((angle > 90 && angle <= 180) || (angle >= -180 && angle < -90)) {
                    this.effect.scaleY = -1;
                }
            }
        };
        AssaultSkillAnimation.prototype.frame_event = function (evt) {
            _super_1.prototype.frame_event.call(this, evt);
            var attackObj = com_main.BattleSceneMgr.getInstance().getDynamicObj(this.avo.attackData.id);
            var position = ISOMap.getInstance().leftDownCellToPixel(this.avo.attackData.toPosX, this.avo.attackData.toPosY);
            if (evt.frameLabel == "move") {
                if (attackObj) {
                    Tween.get(attackObj).to({ x: position[0], y: position[1] }, 200);
                    Tween.get(this.effect).to({ x: position[0], y: position[1] - 50 }, 200);
                }
            }
            for (var i = 0; i <= 3; i++) {
                if (evt.frameLabel == "step_" + i) {
                    this.dealSetp(i);
                    this.m_clientPlayIndex = i;
                }
            }
            if (evt.frameLabel == "end") {
                this.battleSceneMgr.removeEffect(this);
                this.onDestroy();
            }
        };
        AssaultSkillAnimation.prototype.dealSetp = function (i) {
            this.avo.targetDataArr = this.m_targetList[i] || [];
            debug("step_" + i, this.m_targetList[i]);
            this.dealFlyBoold();
            this.dealMoveData();
            var allNum = 0;
            var jifeiNum = 0;
            var jiTuiNum = 0;
            var siwangNum = 0;
            for (var _i = 0, _a = this.avo.targetDataArr; _i < _a.length; _i++) {
                var target = _a[_i];
                allNum += 1;
                var targetObj = target;
                if (targetObj.moveData && targetObj.moveData.moveType == EnumHurtMoveType.JF) {
                    jifeiNum += 1;
                }
                else if (targetObj.moveData && targetObj.moveData.moveType == EnumHurtMoveType.JT_BACK) {
                    jiTuiNum += 1;
                }
                if (targetObj.hp == 0) {
                    siwangNum += 1;
                    // console.log("死亡" + targetObj.id);
                }
            }
            debug("打中 " + allNum, "击飞 " + jifeiNum, "击退 " + jiTuiNum, "死亡 " + siwangNum);
        };
        AssaultSkillAnimation.prototype.setTargetList = function (avo) {
            if (this.avo.attIndex != avo.attIndex) {
                return;
            }
            this.m_attIndex += 1;
            this.m_targetList[avo.attIndexChild] = avo.targetList;
            if (avo.attIndexChild <= this.m_clientPlayIndex) {
                this.dealSetp(avo.attIndexChild);
            }
        };
        AssaultSkillAnimation.tatolIndex = 3;
        return AssaultSkillAnimation;
    }(com_main.BaseSkillAnimation));
    com_main.AssaultSkillAnimation = AssaultSkillAnimation;
})(com_main || (com_main = {}));
