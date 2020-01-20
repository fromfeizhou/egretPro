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
    /**
     * 道具
     */
    var TurnplateCell = /** @class */ (function (_super_1) {
        __extends(TurnplateCell, _super_1);
        function TurnplateCell(id) {
            var _this = _super_1.call(this) || this;
            if (id)
                _this.m_pItemId = id;
            _this.skinName = Utils.getAppSkin("turnplate/TurnplateCellSkin.exml");
            return _this;
        }
        TurnplateCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TurnplateCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (this.m_pItemId)
                this.setCellId(this.m_pItemId);
        };
        TurnplateCell.prototype.setCellId = function (id) {
            this.m_pItemId = id;
            this.m_pItem.setItemInfo(id);
            this.m_pItem.visible = true;
            this.setSelectState(false);
        };
        TurnplateCell.prototype.setSelectState = function (isSelect) {
            this.m_pSelectState.visible = isSelect;
        };
        return TurnplateCell;
    }(com_main.CComponent));
    com_main.TurnplateCell = TurnplateCell;
})(com_main || (com_main = {}));
