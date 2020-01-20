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
    var BossHurtCell = /** @class */ (function (_super_1) {
        __extends(BossHurtCell, _super_1);
        /**伤害榜单item */
        function BossHurtCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/boss/BossHurtCellSkin.exml");
            return _this;
        }
        BossHurtCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BossHurtCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        BossHurtCell.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
        };
        /**设置伤害榜单信息 */
        BossHurtCell.prototype.setItemInfo = function (ranking, name, fight, hurt, playerId, countryId) {
            RankModel.refreshRankIcon(this.m_hurtNoun, this.m_rankingNum, ranking);
            this.m_roleName.text = name;
            this.m_hurtPower.text = fight + '';
            this.m_hurtCount.text = hurt + '';
            this.setCountry(countryId);
        };
        /**设置国家 */
        BossHurtCell.prototype.setCountry = function (countryId) {
            this.m_comState.stateId = countryId;
        };
        return BossHurtCell;
    }(com_main.CComponent));
    com_main.BossHurtCell = BossHurtCell;
})(com_main || (com_main = {}));
