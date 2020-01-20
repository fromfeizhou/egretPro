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
    var GeneralSkillView = /** @class */ (function (_super_1) {
        __extends(GeneralSkillView, _super_1);
        function GeneralSkillView(width, height) {
            var _this = _super_1.call(this, width, height) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralSkillViewSkin.exml");
            _this.name = GeneralSkillView.NAME;
            return _this;
        }
        GeneralSkillView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            for (var i = 1; i < 5; i++) {
                var item = this["m_skillRender" + i];
                com_main.EventManager.addTouchTapListener(item, this, this.onClickSkillRender);
            }
        };
        /**技能点击回调 */
        GeneralSkillView.prototype.onClickSkillRender = function (e) {
            var skillItem = e.currentTarget;
            if (skillItem && skillItem.isOpen()) {
                var skill = C.SkillConfig[skillItem.skillInfo.skillId];
                if (skill && skill.skillType == 3) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_SKILL_FAL1), 1, true);
                    return;
                }
                var cfg = C.SkillLvConfigDic[skillItem.skillInfo.skillId][skillItem.skillInfo.level];
                if (!cfg || !cfg.upConsume) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_SKILL_FAL2), 1, true);
                    return;
                }
                var data = { generalId: this.generalId, data: skillItem.skillInfo };
                Utils.open_view(TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW, data);
            }
            else {
                var strTip = GeneralModel.getSkillOpenDes(skillItem.skillInfo.skillId, true);
                EffectUtils.showTips(strTip, 1, true);
            }
        };
        GeneralSkillView.prototype.refreshView = function () {
            _super_1.prototype.refreshView.call(this);
            if (this.generalVo) {
                for (var i = 1; i < 5; i++) {
                    var item = this["m_skillRender" + i];
                    var info = this.generalVo.getOwnerSkillInfoBySeque(i);
                    if (info && info.skillId > 0) {
                        item.skillInfo = { generalId: this.generalId, skillId: info.skillId, level: info.level, sequence: info.sequence };
                        var skill = C.SkillConfig[info.skillId];
                        if (skill && skill.skillType != 3) { //过滤被动技能红点
                            RedPointModel.AddInfoListener(this["m_skillRender" + i], { x: 92, y: 23, scale: 0.78 }, [RedEvtType.GEN_SKILL], 2, { generalId: this.generalId, skillId: info.skillId });
                        }
                    }
                }
            }
        };
        GeneralSkillView.NAME = 'GeneralSkillView';
        return GeneralSkillView;
    }(com_main.GeneralBaseView));
    com_main.GeneralSkillView = GeneralSkillView;
})(com_main || (com_main = {}));
