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
    var GeneralUnLockSkill = /** @class */ (function (_super_1) {
        __extends(GeneralUnLockSkill, _super_1);
        function GeneralUnLockSkill(param) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralUnLockSkill.NAME;
            _this.m_generalId = param.generalId;
            _this.m_skillId = param.skillId;
            if (_this.m_generalId) {
                _this.m_generalVo = GeneralModel.getOwnGeneral(_this.m_generalId);
                _this.m_sequence = _this.m_generalVo.getOwnerSkillInfoById(_this.m_skillId).sequence;
            }
            /**初始化 */
            _this.initApp("general/tabView/GeneralUnLockSkillSkin.exml");
            return _this;
        }
        ; //进场动画
        GeneralUnLockSkill.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);
            com_main.EventManager.removeEventListeners(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralUnLockSkill.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTips.visible = false;
            this.commitProperties();
            this.refreshSkill();
            com_main.EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play(0);
        };
        GeneralUnLockSkill.prototype.refreshSkill = function () {
            var skill = C.SkillConfig[this.m_skillId];
            if (skill) {
                this.m_labSkillName.text = skill.name;
                this.m_labSkillDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_skillId, 1));
            }
            this.m_skillIcon.skillInfo = { generalId: this.m_generalId, skillId: this.m_skillId, sequence: this.m_sequence, level: 1 };
        };
        /**
         * 动画组播放完成
         */
        GeneralUnLockSkill.prototype.onTweenComplete = function () {
            this.m_labTips.visible = true;
        };
        GeneralUnLockSkill.prototype.onTouchBackGround = function () {
            if (!this.m_labTips.visible)
                return;
            com_main.UpManager.history();
        };
        GeneralUnLockSkill.NAME = "GeneralUnLockSkill";
        return GeneralUnLockSkill;
    }(com_main.CView));
    com_main.GeneralUnLockSkill = GeneralUnLockSkill;
})(com_main || (com_main = {}));
