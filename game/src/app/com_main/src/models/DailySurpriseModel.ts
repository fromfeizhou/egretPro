
/**每日惊喜商城 */
class DailySurpriseModel {

	public static shopDataDic: { [id: number]: gameProto.IShopData };
	private static isOpenWnd:boolean
	public static init() {
		this.shopDataDic = {};
		this.addEvent();
	}

	/**数据清理 */
	public static clear() {
		this.shopDataDic = null;
		this.removeEvent();
	}
	
	/**每日商城数据解析 */
	public static parseDailySurprise(data: gameProto.IS2C_SURPRISE_MARKET) {
		let shopdata: gameProto.IShopData[] = data.shopdata;
		if (isNull(shopdata) || shopdata.length == 0) {
			//EffectUtils.showTips("每日惊喜商城商品正在准备中...");
			return;
		}
		//收到数据 功能开放
		FunctionModel.addNewFuncClient(FunctionType.DAILY_SURPRISE);
		if (data.update) this.init();

		for (let i = 0; i < shopdata.length; i++) {
			this.addShopData(shopdata[i]);
		}
	}

	/**==================================================================================================================================
	 * 每日惊喜商城 begin
	 * ==================================================================================================================================
	 */
	/**添加商品数据 */
	private static addShopData(data: gameProto.IShopData) {
		let id = data.rechargeConfigs.id;
		this.shopDataDic[id] = data;
	}

	/**获取商品数据 */
	public static getShopData(id: number) {
		return this.shopDataDic[id];
	}

	/**==================================================================================================================================
	 * 每日惊喜商城 end
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */

    public static addEvent() {
        com_main.EventMgr.addEvent(NormalEvent.NORMAL_CROSS_DAY, this.onCrossDay, this);
    }

    public static removeEvent() {
        com_main.EventMgr.removeStaticEvent(NormalEvent.NORMAL_CROSS_DAY, this.onCrossDay);
    }

	/**跨天 */
	public static onCrossDay(){
		DailySurpriseProxy.C2S_SURPRISE_MARKET();
	}

	/**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */

}