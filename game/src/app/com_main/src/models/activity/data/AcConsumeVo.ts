/**消费豪礼 */
class AcConsumeVo extends ActivityVo implements IFObject {
    public consumeSum: number;//活动消费豪礼记录
    public consumption: number[];//消费豪礼活动领奖记录

    public configs: { [key: number]: ActivityConsumeGiftRewardConfig };
    public constructor() {
        super();
    }

    /**解析消费豪礼数据 */
    public initConsumption(data: gameProto.IS2C_ACTIVITY_GET_CONSUME_GIFT_INFO) {
        this.consumeSum = data.consumeSum;
        this.consumption = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.id);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.consumption = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.id);
    }

    //获取对应配置表
    public getRechargeCfgBy() {
        return this.configs;
    }

    /** 消费豪礼 根据充值金额获得item按钮红点*/
    public getConsumptionBtnRed(costNum: number, id: number) {
        let state: number = 1;  //进行中
        let consumeSum = this.consumeSum;
        if (this.consumption && this.consumption.length > 0) {
            for (let i in this.consumption) {
                if (this.consumption[i] != id) {//排除已领的id
                    if (consumeSum > 0 && consumeSum >= costNum) {//消费金额达到条件
                        state = 0;
                    }
                } else {//已领取
                    state = 2;
                    break;
                }
            }
        } else {
            if (consumeSum > 0 && consumeSum >= costNum) {
                state = 0;
            }
        }
        return state;
    }

    /**可领奖励 */
    public hasAward() {
        for (let key in this.configs) {
            let cfg = this.configs[key];
            if (cfg && cfg.level <= this.consumeSum && this.consumption.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    }

    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO(this.id);
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}