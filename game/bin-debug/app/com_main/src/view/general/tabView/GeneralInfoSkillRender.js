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
    var GeneralInfoSkillRender = /** @class */ (function (_super_1) {
        __extends(GeneralInfoSkillRender, _super_1);
        function GeneralInfoSkillRender(param) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/General_info_skill_render.exml");
            return _this;
        }
        GeneralInfoSkillRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        Object.defineProperty(GeneralInfoSkillRender.prototype, "skillInfo", {
            get: function () {
                return this.m_data;
            },
            set: function (val) {
                this.m_data = val;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });
        /**技能是否激活 */
        GeneralInfoSkillRender.prototype.isOpen = function () {
            if (this.m_data && this.m_data.level > 0)
                return true;
            return false;
        };
        GeneralInfoSkillRender.prototype.refresh = function () {
            if (this.m_data && this.m_data.skillId > 0) {
                this.visible = true;
                this.m_skillIcon.skillInfo = this.m_data;
                var skill = C.SkillConfig[this.m_data.skillId];
                if (skill) {
                    this.m_labSkillName.text = skill.name;
                    var level = this.m_data.level > 0 ? this.m_data.level : 1;
                    this.m_labSkillDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, level));
                }
            }
            else {
                this.resetView();
            }
        };
        GeneralInfoSkillRender.prototype.resetView = function () {
            this.visible = false;
        };
        return GeneralInfoSkillRender;
    }(com_main.CComponent));
    com_main.GeneralInfoSkillRender = GeneralInfoSkillRender;
})(com_main || (com_main = {}));
