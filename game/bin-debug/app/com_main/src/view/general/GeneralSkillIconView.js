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
    var GeneralSkillIconView = /** @class */ (function (_super_1) {
        __extends(GeneralSkillIconView, _super_1);
        function GeneralSkillIconView(param) {
            var _this = _super_1.call(this) || this;
            _this.m_bTipsOpen = false;
            _this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
            return _this;
        }
        GeneralSkillIconView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_stateName = this.currentState;
            this.refresh();
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        };
        GeneralSkillIconView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        Object.defineProperty(GeneralSkillIconView.prototype, "skillInfo", {
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
        /**隐藏等级 */
        GeneralSkillIconView.prototype.setLvView = function (val) {
            this.m_groupLv.visible = val;
        };
        /**开启tips */
        GeneralSkillIconView.prototype.openTips = function () {
            if (this.m_bTipsOpen)
                return;
            this.m_bTipsOpen = true;
            this.setTipsInfo();
        };
        /**设置tips */
        GeneralSkillIconView.prototype.setTipsInfo = function () {
            if (!this.m_bTipsOpen || !this.m_data || !(this.m_data.skillId > 0))
                return;
            var data = { skillId: this.m_data.skillId, level: this.m_data.level };
            com_main.CTipsManager.addTips(this, { type: com_main.TipsEnum.Skill, param: data });
        };
        /**刷新显示 */
        GeneralSkillIconView.prototype.refresh = function () {
            if (this.m_data && this.m_data.skillId > 0) {
                this.visible = true;
                if (this.m_data.isShow) {
                    this.setLvView(false);
                    this.setSkillIon();
                }
                else {
                    //皮肤设置 等级小于0 未开放
                    if (this.m_data.level > 0) {
                        this.setSkillIon();
                    }
                    else {
                        this.currentState = this.m_stateName + "lock";
                        this.refreshName(false);
                        Utils.isGray(true, this.m_imgSkillIcon);
                    }
                }
                this.m_imgSkillIcon.source = GeneralModel.getSkillIcon(this.m_data.skillId);
                this.refreshLevel();
                this.setTipsInfo();
            }
            else {
                this.visible = false;
            }
        };
        GeneralSkillIconView.prototype.setSkillIon = function () {
            this.currentState = this.m_stateName;
            this.refreshName(true);
            Utils.isGray(false, this.m_imgSkillIcon);
        };
        /**刷新等级 */
        GeneralSkillIconView.prototype.refreshLevel = function () {
            if (this.m_labLevel)
                this.m_labLevel.text = this.m_data.level + '';
        };
        /**刷新名字 */
        GeneralSkillIconView.prototype.refreshName = function (isOpen) {
            if (this.m_labName) {
                var skillInfo = C.SkillConfig[this.m_data.skillId];
                if (skillInfo) {
                    if (isOpen) {
                        this.m_labName.text = skillInfo.name;
                    }
                    else {
                        this.m_labName.text = GeneralModel.getSkillOpenDes(this.m_data.skillId);
                    }
                }
            }
        };
        return GeneralSkillIconView;
    }(com_main.CComponent));
    com_main.GeneralSkillIconView = GeneralSkillIconView;
})(com_main || (com_main = {}));
