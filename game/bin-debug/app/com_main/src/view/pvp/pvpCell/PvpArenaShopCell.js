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
    var PvpArenaShopCell = /** @class */ (function (_super_1) {
        __extends(PvpArenaShopCell, _super_1);
        function PvpArenaShopCell(id) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("pvp_arena/PvpArenaShopCellSkin.exml");
            _this.shopId = id;
            return _this;
        }
        PvpArenaShopCell.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.onBuy);
            this.updateView(this.shopId);
        };
        PvpArenaShopCell.prototype.onBuy = function () {
            if (this.onClickCell) {
                this.onClickCell(this.shopId);
            }
        };
        PvpArenaShopCell.prototype.updateView = function (id) {
            this.shopId = id;
            this.m_pLbName.text = id + "";
            this.visible = true;
        };
        return PvpArenaShopCell;
    }(com_main.CComponent));
    com_main.PvpArenaShopCell = PvpArenaShopCell;
})(com_main || (com_main = {}));
