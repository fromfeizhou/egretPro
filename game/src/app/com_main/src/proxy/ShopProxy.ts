/**
 * 商店
 */

class ShopProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			// [ProtoDef.Travel_Shop_List, this, 'TravelListReq', 'TravelListResp'],// 云游商人购物列表
			// [ProtoDef.Fixed_Shop_List, this, 'FixedListReq', 'FixedListResp'],// 珍宝商人购物列表
			// [ProtoDef.Buy_Merchant_Good, this, 'BuyMerchantGoodReq', 'BuyMerchantGoodResp'],// 珍宝商人购物列表
			// [ProtoDef.Refresh_Merchant_List, this, 'RefreshMerchantListReq', 'RefreshMerchantListResp'],// 珍宝商人购物列表
			[ProtoDef.GET_MERCHANT, this, 'GetMerchantReq', 'GetMerchantResp'],// 获得商城信息
			[ProtoDef.HAND_REFRESH_MERCHANT, this, 'HandRefreshMerchantReq', 'HandRefreshMerchantResp'],// 手动刷新
			[ProtoDef.MERCHANT_BUY_GOODS, this, 'MerchantBuyGoodsReq', 'MerchantBuyGoodsResp'],// 商城购买物品
		]
	}

	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO, this, 'C2S_ACTIVITY_PREFERENTAIL_STORE_INFO', ProxyEnum.SEND],//获得特惠商城信息
			[ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_INFO, this, 'S2C_ACTIVITY_PREFERENTAIL_STORE_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_ACTIVITY_PREFERENTAIL_REFRESH, this, 'C2S_ACTIVITY_PREFERENTAIL_REFRESH', ProxyEnum.SEND],//手动刷新
			[ProtoDef.S2C_ACTIVITY_PREFERENTAIL_REFRESH, this, 'S2C_ACTIVITY_PREFERENTAIL_REFRESH', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY, this, 'C2S_ACTIVITY_PREFERENTAIL_STORE_BUY', ProxyEnum.SEND],//商城购买物品
			[ProtoDef.S2C_ACTIVITY_PREFERENTAIL_STORE_BUY, this, 'S2C_ACTIVITY_PREFERENTAIL_STORE_BUY', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {

			case ProtoDef.GET_MERCHANT: {// 获得商城信息
				Loading.hide();
				if (body) {
					let data = body.info as gameProto.IMerchantInfo;

					if (ShopProxy.isOpenView) {
						ShopProxy.isOpenView = false;
						if (data.storeId == ShopStoreIdEnum.FREE_ITEM) {
							/**免单商城 */
							Utils.open_view(TASK_UI.SHOP_FREE_PANEL, body);
						} else {
							/**通用商城 */
							Utils.open_view(TASK_UI.SHOP_TREASURE_PANEL, body);
						}
					}
				}

				break;
			}
			case ProtoDef.MERCHANT_BUY_GOODS: {// 获得商城信息
				if (body) {
					let data = body as gameProto.IMerchantBuyGoodsResp;
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
	}

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
	public static send_GET_MERCHANT(storeId) {
	this.isOpenView = false;
	let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_MERCHANT);
	data.storeId = storeId;
	AGame.ServiceBuilder.sendMessage(data);
}

	/**获得商城信息 1,2,3*/
	public static send_GET_MERCHANT_OPEN_VIEW(storeId) {
	this.isOpenView = true;
	let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_MERCHANT);
	data.storeId = storeId;
	AGame.ServiceBuilder.sendMessage(data, null, null, true);
}

	/**手动刷新 */
	public static send_HAND_REFRESH_MERCHANT(storeId) {
	let data = AGame.ServiceBuilder.newClazz(ProtoDef.HAND_REFRESH_MERCHANT);
	data.storeId = storeId;
	AGame.ServiceBuilder.sendMessage(data);
}
	/**商城购买物品 */
	public static send_MERCHANT_BUY_GOODS(storeId, id, num) {
	let data = AGame.ServiceBuilder.newClazz(ProtoDef.MERCHANT_BUY_GOODS) as gameProto.IMerchantBuyGoodsReq;
	data.storeId = storeId;
	data.id = id;
	data.num = num;
	AGame.ServiceBuilder.sendMessage(data);
}

	/**获得特惠商城信息 */
	public static C2S_ACTIVITY_PREFERENTAIL_STORE_INFO(storeId:number){
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO) as gameProto.IC2S_ACTIVITY_PREFERENTAIL_STORE_INFO;
		data.storeId = storeId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**手动刷新 */
	public static C2S_ACTIVITY_PREFERENTAIL_REFRESH(storeId:number){
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_REFRESH) as gameProto.IC2S_ACTIVITY_PREFERENTAIL_REFRESH;
		data.storeId = storeId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**商城购买物品 */
	public static C2S_ACTIVITY_PREFERENTAIL_STORE_BUY(storeId:number,id:number,num:number){
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY) as gameProto.IC2S_ACTIVITY_PREFERENTAIL_STORE_BUY;
		data.storeId = storeId;
		data.id = id;
		data.num = num;
		AGame.ServiceBuilder.sendMessage(data);
	}
}