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
    var BattleSkillName = /** @class */ (function (_super_1) {
        __extends(BattleSkillName, _super_1);
        function BattleSkillName(avo, csquare) {
            var _this = _super_1.call(this) || this;
            _this.skillId = 0;
            _this.skinName = Utils.getAppSkin("battle_new/skill/battle_skill_start_name.exml");
            _this.unitInfo = BattleModel.getUnit(avo.attackData.id);
            _this.skillId = avo.skillId;
            _this.csquare = csquare;
            _this.m_skilldata = avo.getSkillConfig();
            return _this;
        }
        BattleSkillName.prototype.childrenCreated = function () {
            this.width = this.stage.stageWidth;
            this.height = this.stage.stageHeight;
            this.rect.width = this.stage.stageWidth + 100;
            this.rect.height = this.stage.stageHeight + 100;
            var config = C.GeneralConfig[this.unitInfo.sysId];
            this.m_effect = new MCDragonBones();
            this.m_effect.setCallback(this.effectEndCallback, this);
            this.m_effect.bindInitCallback(this.initCallbcak, this);
            this.m_effect.initAsync("HongjiangSkillBefore");
            this.m_effect.play("HongjiangSkillBefore", 1, true);
            this.m_effectNode.addChild(this.m_effect);
            this.m_effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            if (GeneralModel.hasSoliderLogoAnima(config.role)) {
                if (config) {
                    this.m_heroMc = new MCDragonBones();
                    this.m_heroMc.initAsync("Gen_Anim_" + config.role);
                    this.m_heroMc.play("animation");
                    this.m_heroMc.touchEnabled = false;
                    this.m_heroMc.touchChildren = false;
                    // Utils.toStageHeightScale(this.m_heroMc);
                    this.m_dargonLayer.addChild(this.m_heroMc);
                    this.m_dargonLayer.mask = this.m_pBoneMask;
                }
            }
            else {
                if (config) {
                    this.generalImage.visible = true;
                    this.generalImage.source = GeneralModel.getSoldierBigLogo(config.role);
                    this.generalImage.mask = this.m_pBoneMask;
                }
            }
        };
        BattleSkillName.prototype.setCallback = function (obj, callbackFunc) {
            this.callbackObj = obj;
            this.callbackFunc = callbackFunc;
        };
        BattleSkillName.prototype.initCallbcak = function () {
            var skillSorce = Utils.getSkillNameImage(this.skillId);
            this.m_effect.setNewSlot("sw1", skillSorce + "_1" + "_png", 53, 53);
            this.m_effect.setNewSlot("sw2", skillSorce + "_2" + "_png", 53, 53);
            this.m_effect.setNewSlot("sw3", skillSorce + "_3" + "_png", 53, 53);
            this.m_effect.setNewSlot("sw4", skillSorce + "_4" + "_png", 53, 53);
        };
        BattleSkillName.prototype.frozenScene = function () {
            this.visible = false;
        };
        BattleSkillName.prototype.startScene = function () {
            // egret.Tween.removeTweens(this);
            // egret.Tween.removeTweens(this.rect);
            this.onDestory();
        };
        BattleSkillName.prototype.onDestory = function () {
            // let skilldata = this.avo.getSkillConfig();
            // this.csquare.startSkill(this.m_skilldata.skillEffectId)
            this.csquare.startSkillEffect(this.m_skilldata.skillEffectId);
            Utils.removeFromParent(this);
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
            if (this.m_heroMc) {
                this.m_heroMc.destroy();
                this.m_heroMc = null;
            }
            // EventMgr.removeEventByObject(EventEnum.BATTLE_FROZEN_SCENE,this.frozenScene);
            // EventMgr.removeEventByObject(EventEnum.BATTLE_START_SCENE,this.startScene);
        };
        BattleSkillName.prototype.$onRemoveFromStage = function (isclear) {
            // egret.Tween.removeTweens(this);
            // egret.Tween.removeTweens(this.rect)
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BattleSkillName.prototype.effectEndCallback = function () {
            var _this = this;
            var tw2 = egret.Tween.get(this);
            tw2.wait(100)
                .to({ alpha: 0 }, 150)
                .call(function () {
                _this.onDestory();
            });
        };
        BattleSkillName.prototype.frame_event = function (evt) {
            if (evt.frameLabel == "changeGeneral") {
                var config = C.GeneralConfig[this.unitInfo.sysId];
                var image = new eui.Image();
                image.source = GeneralModel.getSoldierBigLogo(config.role);
                Utils.removeFromParent(this.m_generalGroup);
                this.m_generalGroup.visible = true;
                this.m_effect.setSlotDisplay("general", this.m_generalGroup, 0, 0);
            }
        };
        return BattleSkillName;
    }(com_main.CComponent));
    com_main.BattleSkillName = BattleSkillName;
})(com_main || (com_main = {}));
