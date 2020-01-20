var com_main;
(function (com_main) {
    var BaseSkillAnimation = /** @class */ (function () {
        function BaseSkillAnimation(avo, battleSceneMgr, mapView, position, isAutoRelease) {
            this.isPlayBuff = false;
            this.m_hurtStageNum = 1;
            this.avo = avo;
            this.battleSceneMgr = battleSceneMgr;
            this.mapView = mapView;
            this.isAutoRelease = isAutoRelease;
            this.isPlayBuff = false;
            if (avo && battleSceneMgr) {
                this.createAnimation(avo, position);
            }
            this.battleSkillMgr = com_main.BattleSkillMgr.getInstance();
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            this.m_hurtStageNum = skilleffectData.hurtStageNum;
        }
        BaseSkillAnimation.prototype.createAnimation = function (avo, position) {
            var config = avo.getSkillConfig();
            var skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
            var animation = skilleffectData.animation;
            // let animation = "longjuanfen";
            var effectMC = new MCDragonBones();
            effectMC.initAsync(animation);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            effectMC.play(skilleffectData.actionName, 1, this.isAutoRelease);
            effectMC.x = position.x;
            effectMC.y = position.y;
            // this.addChild(effectMC);
            // BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            this.effect = effectMC;
            // this.effect.scaleX = skilleffectData.scale;
            // this.effect.scaleY = skilleffectData.scale;
        };
        BaseSkillAnimation.prototype.frame_event = function (evt) {
            if (evt.frameLabel == "shake") {
                EffectUtils.shakeScreen(this.mapView, 4);
            }
            else if (evt.frameLabel == "shake_once_times") {
                EffectUtils.shakeScreen(this.mapView, 5);
            }
            else if (evt.frameLabel == "shake_little_once_times") {
                EffectUtils.shakeScreen(this.mapView, 6);
            }
            else if (evt.frameLabel == "hit_back") { //击退
                this.dealMoveData();
            }
            else if (evt.frameLabel == "flyBlood") {
                this.dealFlyBoold();
            }
            // else if(evt.frameLabel == "hit_fly"){ //击飞
            // 	this.dealHitFly();
            // }
            else if (evt.frameLabel == "change_layer_down") {
                if (this.effect) {
                    // BattleSceneMgr.getInstance().addChildToEffect(this.effect);
                }
            }
        };
        /**飘血 */
        BaseSkillAnimation.prototype.dealFlyBoold = function () {
            for (var _i = 0, _a = this.avo.targetList; _i < _a.length; _i++) {
                var target = _a[_i];
                var targetObj = com_main.BattleSceneMgr.getInstance().getDynamicObj(target.id);
                this.dealFlyBooldSingle(targetObj, target);
            }
            this.dealBuff();
        };
        BaseSkillAnimation.prototype.dealBuff = function () {
            //处理buff
            if (this.avo.add_buff_after && !this.isPlayBuff) {
                this.isPlayBuff = true;
                for (var _i = 0, _a = this.avo.add_buff_after; _i < _a.length; _i++) {
                    var buff = _a[_i];
                    this.battleSkillMgr.addBuffEffect(buff);
                }
            }
        };
        BaseSkillAnimation.prototype.dealFlyBooldSingle = function (targetObj, target) {
            if (!targetObj || !target) {
                console.log("skillEnd  找不到 显示对象");
                return;
                ;
            }
            targetObj.changeHp(target.hp, Math.floor(target.attackHurt / this.m_hurtStageNum), true, false, target.attackStatus, true);
            if (targetObj.getUnitInfo().type == UnitType.GENERAL && targetObj.getUnitInfo().faction == FactionType.ATK) {
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, { id: target.id, hp: target.hp, rage: target.angry, flowTime: this.avo.flowTime });
            }
            else {
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, { id: target.id, hp: target.hp, flowTime: this.avo.flowTime });
            }
            // this.battleSkillMgr.dealAttackStatus(target,targetObj);
        };
        /**击飞 */
        BaseSkillAnimation.prototype.dealMoveData = function () {
            for (var _i = 0, _a = this.avo.targetList; _i < _a.length; _i++) {
                var target = _a[_i];
                var targetObj = target;
                // debug("击飞id " + targetObj.id);
                if (targetObj.moveData) {
                    var obj = this.battleSceneMgr.getDynamicObj(targetObj.id);
                    if (obj) {
                        this.battleSkillMgr.dealMoveData(targetObj, obj);
                    }
                }
            }
        };
        BaseSkillAnimation.prototype.onDestroy = function () {
            Tween.removeTweens(this);
            if (this.effect) {
                this.effect.destroy();
                this.effect = null;
            }
        };
        return BaseSkillAnimation;
    }());
    com_main.BaseSkillAnimation = BaseSkillAnimation;
})(com_main || (com_main = {}));
