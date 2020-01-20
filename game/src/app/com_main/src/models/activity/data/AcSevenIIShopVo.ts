// /**特惠商城 */
// class AcSevenIIShopVo extends ActivityVo implements IFObject {
//     public storeId: number;//商城id
//     public freeCount: number;//免费刷新次数
//     public refreshNum: number;//手动刷新次数
//     public goods: gameProto.IGoodsInfo[];//商品信息
//     public constructor() {
//         super();
//     }
//     /**解析信息 */
//     public initSevenIIShop(data: gameProto.IMerchantInfo) {
//         this.initdata(data);
//         com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SEVENII_HAND_UPDATE, null);
//     }
//     /**手动刷新更新 */
//     public handSevenIIShop(data: gameProto.IMerchantInfo) {
//         this.initdata(data);
//         com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SEVENII_HAND_UPDATE, null);
//     }
//     public initdata(data: gameProto.IMerchantInfo) {
//         this.storeId = data.storeId;
//         this.freeCount = data.freeRefreshNum;
//         this.refreshNum = data.refreshNum;
//         this.goods = data.goods;
//     }
//     /**=====================================================================================
// 	 * 数据配置相关 begin
// 	 * =====================================================================================
// 	 */

//     /**是否需要读取服务器配置(子类重写) */
//     public isNeedServerCfg() {
//         return false;
//     }

//     /**请求活动内容(子类重写)  */
//     public requestActivityInfo() {
//         ShopProxy.send_GET_MERCHANT(this.id);
//     }

// 	/**=====================================================================================
// 	 * 数据配置相关 end
// 	 * =====================================================================================
// 	 */
// }