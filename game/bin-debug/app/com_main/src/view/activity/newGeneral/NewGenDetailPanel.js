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
    var NewGenDetailPanel = /** @class */ (function (_super_1) {
        __extends(NewGenDetailPanel, _super_1);
        function NewGenDetailPanel() {
            var _this = _super_1.call(this) || this;
            _this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenDetailSkin.exml");
            return _this;
        }
        NewGenDetailPanel.prototype.onShow = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            this.generalId = vo.getNewGenRewordCfg().generalId;
            this.initEvent();
        };
        NewGenDetailPanel.prototype.onDestory = function () {
            this.removeEvent();
        };
        Object.defineProperty(NewGenDetailPanel.prototype, "generalVo", {
            get: function () {
                return this.m_generalVo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewGenDetailPanel.prototype, "generalId", {
            set: function (id) {
                this.m_nGeneralId = id;
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        NewGenDetailPanel.prototype.refreshView = function () {
            var config = this.generalVo.config;
            var attriList = StringUtils.keyValsToNumber(config.attribute);
            this.m_labPower.text = attriList[AttriType.POWER] + "";
            this.m_labIntell.text = attriList[AttriType.INTELLIGENCE] + "";
            this.m_labLeader.text = attriList[AttriType.LEADERSHIP] + "";
            this.m_labAtk.text = attriList[AttriType.ATK] + "";
            this.m_labDef.text = attriList[AttriType.DEF] + "";
            this.m_labHp.text = attriList[AttriType.HP] + "";
            this.refreshSkill();
        };
        //刷新技能显示
        NewGenDetailPanel.prototype.refreshSkill = function () {
            var curLv = this.generalVo.level;
            var config = this.generalVo.config;
            for (var i = 1; i < 5; i++) {
                var iconView = this["m_skillIcon" + i];
                var info = this.generalVo.getOwnerSkillInfoBySeque(i);
                iconView.skillInfo = { generalId: this.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level, isShow: true };
            }
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        NewGenDetailPanel.prototype.initEvent = function () {
            for (var i = 1; i < 5; i++) {
                this["m_skillIcon" + i].openTips();
            }
        };
        NewGenDetailPanel.prototype.removeEvent = function () {
        };
        return NewGenDetailPanel;
    }(com_main.DynamicComponent));
    com_main.NewGenDetailPanel = NewGenDetailPanel;
})(com_main || (com_main = {}));
