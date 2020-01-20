/**成长基金 */
class GrowthFundVo extends ActivityVo implements IFObject {
    public buyGrowthFund: boolean;   //是否购买
    // public paySet: number[];//活动成长基金档次
    public awardRecordSet: number[];//成长基金活动领奖记录

    public constructor() {
        super();
    }
    /**解析成长基金数据 */
    public initGrowFund(data: gameProto.IS2C_ACTIVITY_GET_GROWTH_FUND_INFO) {
        this.buyGrowthFund = data.buyGrowthFund;
        // this.paySet = data.paySet;
        this.awardRecordSet = data.awardRecordSet;//活动领奖记录
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, null);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.awardRecordSet = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, null);
    }

    //获取对应配置表
    public getRechargeCfgBy() {
        return C.ActivityGrowthFundRewardConfig;
    }

    /** 成长基金 item按钮红点*/
    public getGrowFundBtnRed(costNum: number, id: number) {
        let state: number = 1;  //进行中
        let awardRecordSet = this.awardRecordSet;
        // if (!this.buyGrowthFund) {
        //     return state;
        // }
        if (this.awardRecordSet && this.awardRecordSet.length > 0) {
            for (let i in this.awardRecordSet) {
                if (this.awardRecordSet[i] != id) {//排除已领的id
                    if (RoleData.level > 0 && RoleData.level >= costNum) {//君主等级达到条件
                        state = 0;
                    }
                } else {//已领取
                    state = 2;
                    break;
                }
            }
        } else {
            if (RoleData.level > 0 && RoleData.level >= costNum) {
                state = 0;
            }
        }
        return state;
    }

    /**有可领奖励 */
    public hasAward() {
        if (!this.buyGrowthFund) {
            return 0;
        }
        for (let key in C.ActivityGrowthFundRewardConfig) {
            let cfg = C.ActivityGrowthFundRewardConfig[key];
            if (cfg && RoleData.level >= cfg.playerLevel && this.awardRecordSet.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    }

    /**冲值表 */
    public getRechargeCfg(){
        return this.rechargeCfgs[0];
    }
    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_INFO(this.id);
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}