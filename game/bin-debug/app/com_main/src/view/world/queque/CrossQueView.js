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
     * 行军列队
     */
    var CrossQueView = /** @class */ (function (_super_1) {
        __extends(CrossQueView, _super_1);
        function CrossQueView() {
            var _this = _super_1.call(this) || this;
            _this.name = CrossQueView.NAME;
            return _this;
            // this.skinName = Utils.getAppSkin("world/queque/WorldQueViewSkin.exml");
        }
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        CrossQueView.prototype.addEvent = function () {
        };
        CrossQueView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**改变选中 */
        CrossQueView.prototype.onChangeSel = function (index) {
            Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: index });
        };
        CrossQueView.NAME = "CrossQueView";
        return CrossQueView;
    }(com_main.WorldQueView));
    com_main.CrossQueView = CrossQueView;
})(com_main || (com_main = {}));
