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
    var RoleReplaceItem = /** @class */ (function (_super_1) {
        __extends(RoleReplaceItem, _super_1);
        function RoleReplaceItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("role/role_replace_Item.exml");
            return _this;
        }
        RoleReplaceItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this);
            _super_1.prototype.onDestroy.call(this);
        };
        RoleReplaceItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.Image_head.mask = this.Image_mask;
        };
        RoleReplaceItem.prototype.setItemInfo = function (id, ishave) {
            var cfg = C.GeneralConfig[id];
            this.Image_head.source = GeneralModel.getSoldierLogo(cfg.role);
            this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(cfg.qualityLevel);
            this.m_imgWear.visible = RoleData.headId == id ? true : false;
            Utils.isGray(!ishave, this);
        };
        return RoleReplaceItem;
    }(com_main.CComponent));
    com_main.RoleReplaceItem = RoleReplaceItem;
})(com_main || (com_main = {}));
