/**累计充值 */
class AcPaySumVo extends ActivityVo implements IFObject {
    public paySum: number;//充值金额
    public totaleRecord: number[];//累计充值活动领奖记录

    public configs: { [key: number]: ActivityTotalPayRewardConfig };
    public constructor() {
        super();
    }

    /**解析累计充值数据 */
    public initAllrecharge(data: gameProto.IS2C_ACTIVITY_GET_TOTAL_PAY_INFO) {
        this.paySum = data.paySum;
        this.totaleRecord = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.id);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.totaleRecord = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.id);
    }

    //获取对应配置表
    public getPaySum() {
        return this.paySum;
    }

    //获取对应配置表
    public getRechargeCfgBy() {
        return this.configs;
    }

    /** 累计充值 根据充值金额获得item按钮红点*/
    public getAllRechargeBtnRed(patsum: number, id: number) {
        let state: number = 1;  //进行中
        if (this.totaleRecord && this.totaleRecord.length > 0) {
            for (let i in this.totaleRecord) {
                if (this.totaleRecord[i] != id) {//排除已领的id
                    if (this.paySum > 0 && this.paySum >= patsum) {//充值金额达到条件
                        state = 0;
                    }
                } else {//已领取
                    state = 2;
                    break;
                }
            }
        } else {
            if (this.paySum > 0 && this.paySum >= patsum) {
                state = 0;
            }
        }
        return state;
    }

    /**可领奖励 */
    public hasAward() {
        for (let key in this.configs) {
            let cfg = this.configs[key];
            if (cfg && cfg.level <= this.paySum && this.totaleRecord.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    }

    /**=====================================================================================
	 * 配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_INFO(this.id);
    }

	/**=====================================================================================
	 * 配置相关 end
	 * =====================================================================================
	 */
}