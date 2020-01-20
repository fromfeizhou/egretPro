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
     * 城池驻军
     * @export
     * @class WorldBattleItem
     * @extends eui.ItemRenderer
     */
    var WorldCityTroopCell = /** @class */ (function (_super_1) {
        __extends(WorldCityTroopCell, _super_1);
        function WorldCityTroopCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/WorldCityTroopCellSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
            // this.cacheAsBitmap = true;
        }
        WorldCityTroopCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldCityTroopCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldCityTroopCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        WorldCityTroopCell.prototype.dataChanged = function () {
            var data = this.data;
            this.m_pTroopName.text = data.name;
            this.m_pTroop.text = "" + data.count;
            this.m_pTroopCount.text = "" + CommonUtils.numOutLenght(data.troop);
        };
        return WorldCityTroopCell;
    }(eui.ItemRenderer));
    com_main.WorldCityTroopCell = WorldCityTroopCell;
})(com_main || (com_main = {}));
