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
    var GeneralTreaOwner = /** @class */ (function (_super_1) {
        __extends(GeneralTreaOwner, _super_1);
        function GeneralTreaOwner(param) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralTreaOwnerSkin.exml");
            return _this;
        }
        GeneralTreaOwner.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GeneralTreaOwner.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        /**设置宝物id */
        GeneralTreaOwner.prototype.setInfo = function (itemId) {
            if (this.m_nItemId == itemId)
                return;
            this.m_nItemId = itemId;
            this.m_treaVo = TreasureModel.getData(itemId);
            if (this.m_treaVo && this.m_treaVo.treaCfg.exclusiveId > 0) {
                this.visible = true;
                this.refreshGeneralView();
            }
            else {
                this.visible = false;
            }
        };
        /**刷新专属武将显示 */
        GeneralTreaOwner.prototype.refreshGeneralView = function () {
            var generalId = this.m_treaVo.getDedicatedGenId();
            this.m_generalHead.setGenId(generalId);
            GeneralModel.setLabGaneralName(generalId, this.m_labGenName);
            var isActivated = this.m_treaVo.isInDedicatedGeneral();
            Utils.isGray(!isActivated, this.m_generalHead);
        };
        return GeneralTreaOwner;
    }(com_main.CComponent));
    com_main.GeneralTreaOwner = GeneralTreaOwner;
})(com_main || (com_main = {}));
