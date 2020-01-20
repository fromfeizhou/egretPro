/**直购礼包 */
class AcPuGigtBagVo extends ActivityVo implements IFObject {
    public idCount: { [key: number]: number };
    public constructor() {
        super();
    }

    /**解析消费豪礼数据 */
    public initPuGiftBagData(idCount: gameProto.ITuple[]) {
        //本地初始化所有礼包
        if (!this.idCount) {
            this.idCount = {};
            for (let i = 0; i < this.rechargeIds.length; i++) {
                this.idCount[this.rechargeIds[i]] = 0;
            }
        }

        for (let i = 0; i < idCount.length; i++) {
            this.idCount[idCount[i].key] = idCount[i].value;
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_PU_GIFT, null);
    }

    /**已购买次数 */
    public getbuyCount(shopId: number): number {
        if (isNull(this.idCount[shopId]))
            return 0;
        return this.idCount[shopId];
    }
    /**
     * 限制次数
     */
    public getbuyLimitCout(shopId): number {
        for (let i = 0; i < this.rechargeCfgs.length; i++) {
            let cfg = this.rechargeCfgs[i];
            if (cfg.shopId == shopId) return cfg.count;
        }
        return 0;
    }
    /** 直购礼包item按钮红点*/
    public getPurchageGiftBagBtnRed(shopId: number) {
        let state: number = 1;  //进行中
        let buyCout: number = this.getbuyCount(shopId);
        let limitCount: number = this.getbuyLimitCout(shopId);
        if (buyCout >= limitCount)
            state = 2;
        return state;
    }

    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_ZHI_GOU_INFO(this.id);
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}