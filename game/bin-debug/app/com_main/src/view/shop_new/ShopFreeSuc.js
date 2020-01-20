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
     * 免单商城
     */
    var ShopFreeSuc = /** @class */ (function (_super_1) {
        __extends(ShopFreeSuc, _super_1);
        function ShopFreeSuc(param) {
            var _this = _super_1.call(this) || this;
            _this.m_data = param;
            _this.name = com_main.ShopFreeRecord.NAME;
            _this.initApp("shop/ShopFreeSucSkin.exml");
            return _this;
        }
        ShopFreeSuc.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        ShopFreeSuc.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        ShopFreeSuc.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ShopFreeSuc.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (!this.m_data)
                return;
            this.m_item.setItemInfo(this.m_data.itemId, this.m_data.count);
        };
        ShopFreeSuc.NAME = 'ShopFreeSuc';
        return ShopFreeSuc;
    }(com_main.CView));
    com_main.ShopFreeSuc = ShopFreeSuc;
})(com_main || (com_main = {}));
