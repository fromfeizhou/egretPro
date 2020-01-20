/**
 * 商店
 */
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
var ShopProxy = /** @class */ (function (_super_1) {
    __extends(ShopProxy, _super_1);
    function ShopProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    ShopProxy.prototype.listenerProtoNotifications = function () {
        return [
            // [ProtoDef.Travel_Shop_List, this, 'TravelListReq', 'TravelListResp'],// 云游商人购物列表
            // [ProtoDef.Fixed_Shop_List, this, 'FixedListReq', 'FixedListResp'],// 珍宝商人购物列表
            // [ProtoDef.Buy_Merchant_Good, this, 'BuyMerchantGoodReq', 'BuyMerchantGoodResp'],// 珍宝商人购物列表
            // [ProtoDef.Refresh_Merchant_List, this, 'RefreshMerchantListReq', 'RefreshMerchantListResp'],// 珍宝商人购物列表
            [ProtoDef.GET_MERCHANT, this, 'GetMerchantReq', 'GetMerchantResp'],
            [ProtoDef.HAND_REFRESH_MERCHANT, this, 'HandRefreshMerchantReq', 'HandRefreshMerchantResp'],
            [ProtoDef.MERCHANT_BUY_GOODS, this, 'MerchantBuyGoodsReq', 'MerchantBuyGoodsResp'],
        ];
    };
    ShopProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO, this, 'C2S_ACTIVITY_PREFERENTAIL_STORE_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_INFO, this, 'S2C_ACTIVITY_PREFERENTAIL_STORE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_PREFERENTAIL_REFRESH, this, 'C2S_ACTIVITY_PREFERENTAIL_REFRESH', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_PREFERENTAIL_REFRESH, this, 'S2C_ACTIVITY_PREFERENTAIL_REFRESH', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY, this, 'C2S_ACTIVITY_PREFERENTAIL_STORE_BUY', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_BUY, this, 'S2C_ACTIVITY_PREFERENTAIL_STORE_BUY', ProxyEnum.RECEIVE],
        ];
    };
    ShopProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.GET_MERCHANT: { // 获得商城信息
                Loading.hide();
                if (body) {
                    var data = body.info;
                    if (ShopProxy.isOpenView) {
                        ShopProxy.isOpenView = false;
                        if (data.storeId == ShopStoreIdEnum.FREE_ITEM) {
                            /**免单商城 */
                            Utils.open_view(TASK_UI.SHOP_FREE_PANEL, body);
                        }
                        else {
                            /**通用商城 */
                            Utils.open_view(TASK_UI.SHOP_TREASURE_PANEL, body);
                        }
                    }
                }
                break;
            }
            case ProtoDef.MERCHANT_BUY_GOODS: { // 获得商城信息
                if (body) {
                    var data = body;
                    // if (data) {
                    // 	EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_SUC), 1);
                    // }
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_INFO: {
                com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO, body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_PREFERENTAIL_REFRESH: {
                com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH, body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_BUY: {
                com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY, body);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求云游商人列表 */
    // public static send_Travel_Shop_List(isOpenView: boolean) {
    // 	this.isOpenView = isOpenView;
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.Travel_Shop_List);
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    // /**请求珍宝商人列表 */
    // public static send_Fixed_Shop_List(isOpenView: boolean) {
    // 	this.isOpenView = isOpenView;
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.Fixed_Shop_List);
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    // /*购买商店商品 */
    // public static send_Buy_Merchant_Good(itemId, type) {
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.Buy_Merchant_Good);
    // 	data.itemId = itemId;
    // 	data.type = type;
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    // /**刷新商品列表结果 */
    // public static send_Refresh_Merchant_List() {
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.Refresh_Merchant_List);
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    /**获得商城信息 1,2,3*/
    ShopProxy.send_GET_MERCHANT = function (storeId) {
        this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_MERCHANT);
        data.storeId = storeId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获得商城信息 1,2,3*/
    ShopProxy.send_GET_MERCHANT_OPEN_VIEW = function (storeId) {
        this.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_MERCHANT);
        data.storeId = storeId;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**手动刷新 */
    ShopProxy.send_HAND_REFRESH_MERCHANT = function (storeId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HAND_REFRESH_MERCHANT);
        data.storeId = storeId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**商城购买物品 */
    ShopProxy.send_MERCHANT_BUY_GOODS = function (storeId, id, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.MERCHANT_BUY_GOODS);
        data.storeId = storeId;
        data.id = id;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获得特惠商城信息 */
    ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO = function (storeId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO);
        data.storeId = storeId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**手动刷新 */
    ShopProxy.C2S_ACTIVITY_PREFERENTAIL_REFRESH = function (storeId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_REFRESH);
        data.storeId = storeId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**商城购买物品 */
    ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY = function (storeId, id, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY);
        data.storeId = storeId;
        data.id = id;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    ShopProxy.isOpenView = false;
    return ShopProxy;
}(BaseProxy));
