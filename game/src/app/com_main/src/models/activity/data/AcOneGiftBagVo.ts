/**一元礼包 */
class AcOneGiftBagVo extends ActivityVo implements IFObject {
    public awardRecordSet: number[];//首充活动领奖记录
    public paySet: number[];//充值后生成的奖励档次
    public constructor() {
        super();
    }
    /**解析信息 */
    public initOneGiftBag(data: gameProto.S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO) {
        this.awardRecordSet = data.awardRecordSet;
        this.paySet = data.paySet;
        if (this.checkOneEnd()) {
            this.close();
            return;
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, null)
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.awardRecordSet = data.awardRecord;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, null)
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        if (this.checkOneEnd()) {
            this.close();
            return;
        }
    }

    /**获得按钮状态 */
    public getBtnState() {
        return this.paySet.length != this.awardRecordSet.length;
    }


    /**判断奖励是否领取完毕 */
    public checkOneEnd() {
        if (this.rechargeIds.length > 0 && this.rechargeIds.length == this.awardRecordSet.length) return true;
        return false;
    }

    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return false;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO(this.id);
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}