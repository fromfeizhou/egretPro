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
    /** */
    var EquipRecycleCell = /** @class */ (function (_super_1) {
        __extends(EquipRecycleCell, _super_1);
        function EquipRecycleCell() {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.EquipItem.NAME;
            _this.skinName = Utils.getAppSkin("equip/EquipRecycleCellSkin.exml");
            return _this;
        }
        EquipRecycleCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        EquipRecycleCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipRecycleCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
        };
        /**设置选中信息 */
        EquipRecycleCell.prototype.setRecycleInfo = function (level, state) {
            this.m_labEqLv.text = level + '级';
            this.m_imgSelect.visible = state;
        };
        EquipRecycleCell.NAME = 'EquipRecycleCell';
        return EquipRecycleCell;
    }(com_main.CComponent));
    com_main.EquipRecycleCell = EquipRecycleCell;
})(com_main || (com_main = {}));
