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
    var TavernCheckitem = /** @class */ (function (_super_1) {
        __extends(TavernCheckitem, _super_1);
        function TavernCheckitem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("tavern/tavern_item_render.exml");
            return _this;
        }
        TavernCheckitem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this);
            _super_1.prototype.onDestroy.call(this);
        };
        TavernCheckitem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labPercent.visible = true;
        };
        TavernCheckitem.prototype.setItemInfo = function (item, currPer, totalPer) {
            var cfg = PropModel.getCfg(item);
            this.m_ComItemNew.setItemInfo(cfg.id, 1);
            this.setProbability(currPer, totalPer);
        };
        /**设置概率值 */
        TavernCheckitem.prototype.setProbability = function (currPer, totalPer) {
            var num = (currPer / totalPer) * 100;
            this.m_labPercent.text = num.toFixed(2).toString() + "%";
        };
        return TavernCheckitem;
    }(com_main.CComponent));
    com_main.TavernCheckitem = TavernCheckitem;
})(com_main || (com_main = {}));
