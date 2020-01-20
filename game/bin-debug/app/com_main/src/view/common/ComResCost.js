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
    var ComResCost = /** @class */ (function (_super_1) {
        __extends(ComResCost, _super_1);
        function ComResCost() {
            var _this = _super_1.call(this) || this;
            _this.name = ComResCost.NAME;
            _this.skinName = Utils.getAppSkin("common/ComResCostSkin.exml");
            return _this;
        }
        ComResCost.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ComResCost.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        ComResCost.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        ComResCost.prototype.setInfo = function (itemId, cost) {
            this.m_nItemId = itemId;
            this.m_nCost = cost;
            this.m_labCost.text = cost.toString();
            // CTipsManager.addTips(this, { type: TipsEnum.Item, param: this.m_nItemId })
            this.refreshIcon();
            this.refresCost();
            this.addEvent();
        };
        /**刷新图标 */
        ComResCost.prototype.refreshIcon = function () {
            this.m_imgIcon.source = PropModel.getPropIcon(this.m_nItemId);
        };
        /**刷新数量 */
        ComResCost.prototype.refresCost = function () {
            var color = PropModel.isItemEnough(this.m_nItemId, this.m_nCost) ? 0xe9e9e6 : 0xff0000;
            this.m_labCost.textColor = color;
        };
        /**监听事件 */
        ComResCost.prototype.addEvent = function () {
            if (this.m_bInitEvt)
                return;
            this.m_bInitEvt = true;
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onItemChange, this);
            com_main.EventManager.addTouchTapListener(this, this, this.onShowTip);
        };
        /**弹出物品信息 */
        ComResCost.prototype.onShowTip = function () {
            var cfg = C.ItemConfig[this.m_nItemId];
            if (cfg) {
                Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: cfg.mainType, itemId: this.m_nItemId });
            }
        };
        /**移除事件 */
        ComResCost.prototype.removeEvent = function () {
            if (!this.m_bInitEvt)
                return;
            this.m_bInitEvt = false;
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventManager.removeEventListener(this);
        };
        /**资源刷新 */
        ComResCost.prototype.onItemChange = function (sourceId) {
            if (this.m_nItemId != sourceId)
                return;
            this.refresCost();
        };
        ComResCost.NAME = 'ComResCost';
        return ComResCost;
    }(com_main.CComponent));
    com_main.ComResCost = ComResCost;
})(com_main || (com_main = {}));
