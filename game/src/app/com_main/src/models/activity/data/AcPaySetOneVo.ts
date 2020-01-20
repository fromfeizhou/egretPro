/**单笔充值 */
class AcPaySetOneVo extends ActivityVo implements IFObject {
    public paySetOne: number[];//活动单笔充值记录
    public awardRecordSetOne: number[];//累单笔充值活动领奖记录

    public configs: { [key: number]: ActivitySinglePayRewardConfig };
    public constructor() {
        super();
    }

    /**解析单笔充值数据 */
    public initRechargeOne(data: gameProto.IS2C_ACTIVITY_GET_SINGLE_PAY_INFO) {
        this.paySetOne = data.paySet;
        this.awardRecordSetOne = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.id);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.awardRecordSetOne = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.id);
    }

    //获取对应配置表
    public getRechargeCfgBy() {
        return this.configs;
    }

    /**可领奖励 */
    public hasAward() {
        for (let key in this.configs) {
            let cfg = this.configs[key];
            if (cfg && this.paySetOne.indexOf(cfg.level) >= 0 && this.awardRecordSetOne.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    }

    /**判断单笔充值了是否领取 */
    public getRechargeOneState(level: number) {
        if (this.paySetOne && this.paySetOne.length > 0) {
            for (let i = 0; i < this.paySetOne.length; i++) {
                if (this.paySetOne[i] == level) {
                    return true;
                }
            }
        }
        return false;
    }

    /**单笔充值 根据活动id取活动单个item数据 */
    public getCfgById(id: number) {
        let cfg = this.getRechargeCfgBy();
        return cfg[id];
    }

    /** 单笔充值 根据充值金额获得item按钮红点*/
    public getRechargeOneBtnRed(payNum: number, id: number) {
        let state: number = 1;  //进行中
        let cfg = this.getCfgById(id);
        if (this.awardRecordSetOne && this.awardRecordSetOne.length > 0) {
            for (let j = 0; j < this.awardRecordSetOne.length; j++) {
                let awardId = this.awardRecordSetOne[j];
                if (awardId != id) {  //排除已领的id
                    state = this.getRechargeOneState(cfg.level) ? 0 : 1;
                } else {
                    state = 2
                    break;
                }
            }
        } else {
            if (this.paySetOne && this.paySetOne.length > 0) {
                for (let i = 0; i < this.paySetOne.length; i++) {
                    if (this.paySetOne[i] == payNum) {
                        state = 0;
                    }
                }
            }
        }
        return state;
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
        ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_INFO(this.id);
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}