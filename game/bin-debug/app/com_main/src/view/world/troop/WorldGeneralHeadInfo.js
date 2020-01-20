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
    var WorldGeneralHeadInfo = /** @class */ (function (_super_1) {
        __extends(WorldGeneralHeadInfo, _super_1);
        function WorldGeneralHeadInfo() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("battle_new/components/general_head_info.exml");
            return _this;
        }
        WorldGeneralHeadInfo.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeFromParent();
        };
        WorldGeneralHeadInfo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        WorldGeneralHeadInfo.prototype.setData = function (generalId) {
            this.config = C.GeneralConfig[generalId];
            var genVo = GeneralModel.getOwnGeneral(generalId);
            var armyType = genVo.getGeneralArmyType();
            this.initTypeIcon(armyType);
            this.setPlayerName(GLan(this.config.name));
        };
        WorldGeneralHeadInfo.prototype.setPlayerName = function (name) {
            this.m_lbName.text = name;
            this.m_lbName.textColor = 0x00C6FF;
        };
        WorldGeneralHeadInfo.prototype.initTypeIcon = function (armyType) {
        };
        WorldGeneralHeadInfo.prototype.updateHP = function (hp) {
            var genVo = GeneralModel.getOwnGeneral(this.config.id);
            var maxHp = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
            var pecent = Math.min(hp / maxHp, 1);
            this.HP_image.width = Math.floor(pecent * 70);
        };
        WorldGeneralHeadInfo.prototype.updateSoldierHpBar = function () {
        };
        return WorldGeneralHeadInfo;
    }(com_main.CComponent));
    com_main.WorldGeneralHeadInfo = WorldGeneralHeadInfo;
})(com_main || (com_main = {}));
