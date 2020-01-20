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
    /**跨服战场军团 */
    var CrossLegionCell = /** @class */ (function (_super_1) {
        __extends(CrossLegionCell, _super_1);
        function CrossLegionCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("cross/sandTable/CrossLegionCellSkin.exml");
            _this.name = CrossLegionCell.NAME;
            return _this;
        }
        CrossLegionCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        CrossLegionCell.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        /**添加监听事件 */
        CrossLegionCell.prototype.addEvent = function () {
        };
        /**移除监听事件 */
        CrossLegionCell.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CrossLegionCell.NAME = 'CrossLegionCell';
        return CrossLegionCell;
    }(com_main.CComponent));
    com_main.CrossLegionCell = CrossLegionCell;
})(com_main || (com_main = {}));
