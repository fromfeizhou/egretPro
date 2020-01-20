// TypeScript file
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
    /**
     * 释放主动技能
     */
    var SmallActiveSkillName = /** @class */ (function (_super_1) {
        __extends(SmallActiveSkillName, _super_1);
        function SmallActiveSkillName(avo, csquare) {
            var _this = _super_1.call(this) || this;
            _this.skillId = 0;
            _this.skinName = Utils.getAppSkin("battle_new/components/smallActiveSkillNameSkin.exml");
            _this.unitInfo = BattleModel.getUnit(avo.attackData.id);
            _this.skillId = avo.skillId;
            _this.csquare = csquare;
            // this.avo = avo;
            _this.attackID = avo.attackData.id;
            _this.m_skilldata = avo.getSkillConfig();
            return _this;
        }
        SmallActiveSkillName.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        SmallActiveSkillName.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.name_lb.text = this.m_content;
            this.anchorOffsetX = this.width >> 1;
            this.anchorOffsetY = this.height >> 1;
            this.animation.play();
            this.animation.addEventListener("complete", this.onTweenComplete, this);
            if (this.unitInfo) {
                var config = C.GeneralConfig[this.unitInfo.sysId];
                if (config) {
                    this.headImage.source = GeneralModel.getCircleLogo(config.role);
                }
            }
            this.skillNameImage.source = Utils.getSkillNameImage(this.skillId) + "_png";
            var belongType = BattleModel.getBelongTypeById(this.attackID);
            if (belongType == BelongType.OWN) {
                this.heng_bg.source = "battle_skill_bg_3_png";
                this.headFrame.source = "battle_head_bg_3_png";
            }
            else {
                this.heng_bg.source = "battle_skill_bg_2_png";
                this.headFrame.source = "battle_head_bg_2_png";
            }
        };
        /**
         * 动画组播放完成
         */
        SmallActiveSkillName.prototype.onTweenComplete = function () {
            var _this = this;
            // Utils.removeFromParent(this);
            // egret.Tween.get(this).wait(170).call(() =>{
            //     this.csquare.startSkill(this.m_skilldata.skillEffectId);
            // })
            egret.Tween.get(this).wait(170)
                .wait(330)
                .to({ alpha: 0 }, 170).call(function () {
                Utils.removeFromParent(_this);
            });
            // console.log("释放 技能id ~~~~~~~~~~",this.avo.skillId);
            // console.log("skilldata.skillEffectId:",skilldata.skillEffectId);
        };
        return SmallActiveSkillName;
    }(com_main.CComponent));
    com_main.SmallActiveSkillName = SmallActiveSkillName;
})(com_main || (com_main = {}));
