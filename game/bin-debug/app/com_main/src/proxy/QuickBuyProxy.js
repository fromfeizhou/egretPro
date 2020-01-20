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
/**
 * 便捷购买
 */
var QuickBuyProxy = /** @class */ (function (_super_1) {
    __extends(QuickBuyProxy, _super_1);
    function QuickBuyProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    QuickBuyProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS, this, 'C2S_GET_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS, this, 'S2C_GET_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_QUCKLY_SHOP_BUY_GOODS, this, 'C2S_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.SEND],
            [ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS, this, 'S2C_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.RECEIVE],
        ];
    };
    QuickBuyProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS: {
                var data = body;
                if (QuickBuyProxy.isOpenView) {
                    QuickBuyProxy.isOpenView = false;
                    Utils.open_view(TASK_UI.PLAYER_SPEEDY_BUY_PANEL, data);
                }
                break;
            }
            case ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS: {
                if (body) {
                    EffectUtils.showTips(GCode(CLEnum.BAG_BUY_SUC), 1, false);
                }
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求快速商店商品可购买数量，价格区间 */
    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW = function (id) {
        QuickBuyProxy.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求快速商店商品可购买数量，价格区间 */
    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS = function (id) {
        QuickBuyProxy.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求快速商店商品可购买数量，价格区间 */
    QuickBuyProxy.C2S_QUCKLY_SHOP_BUY_GOODS = function (id, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    QuickBuyProxy.isOpenView = false;
    return QuickBuyProxy;
}(BaseProxy));
