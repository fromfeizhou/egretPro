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
    var VipPrivilegeCell = /** @class */ (function (_super_1) {
        __extends(VipPrivilegeCell, _super_1);
        function VipPrivilegeCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/vip/VipPrivilegeCellSkin.exml");
            return _this;
        }
        VipPrivilegeCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        VipPrivilegeCell.prototype.onDestroy = function () {
        };
        VipPrivilegeCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        VipPrivilegeCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            var data = this.m_tData.data;
            var cfg = C.VipPrivillegesConfig[data.key];
            var value = cfg.valType == 0 ? data.value + "" : data.value * 100 + "";
            this.m_labDes.textFlow = Utils.htmlParser(GLanFormat(cfg.description, '<font color=#ffff99>' + value + '</font>'));
            if (this.m_tData.level >= 0) {
                var oldVal = cfg["vip" + (this.m_tData.level - 1)];
                this.m_imgNew.visible = (oldVal == 0);
            }
            // this.m_imgUpState.visible = cfg.valType == 1;
            this.m_imgUpState.visible = VipModel.checkVipPrivileUp(this.m_tData.level, data.key);
        };
        return VipPrivilegeCell;
    }(eui.ItemRenderer));
    com_main.VipPrivilegeCell = VipPrivilegeCell;
})(com_main || (com_main = {}));
