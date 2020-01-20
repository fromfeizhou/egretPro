/**首充活动 */
class AcPayFirstVo extends ActivityVo implements IFObject {
    public awardRecordSet: number[];//首充活动领奖记录
    public paySet: number[];//充值后生成的奖励档次
    public configId: number;//当前生效的首充配置Id

    public configs: { [key: number]: ActivityFirstPayRewardConfig };

    public constructor() {
        super();
    }
    /**解析首充数据 */
    public initPayFirstInfo(data: gameProto.IS2C_ACTIVITY_GET_FIRTS_PAY_INFO) {
        this.paySet = data.paySet;
        this.awardRecordSet = data.awardRecordSet;
        this.configId = data.configId;
         if (!this.getRechargeAwardCfgByType()) {
            ActivityModel.removeActivityInfo(this.id);
        }else{
            com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.viewType);
        }
    }

    /**领奖返回 */
    public updateAward(data: gameProto.IS2C_ACTIVITY_GET_FIRTS_PAY_REWARD) {
        this.awardRecordSet = data.activityAward.awardRecord;
        this.configId = data.configId;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.activityAward.message);
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.viewType);

        if (!this.getRechargeAwardCfgByType()) {
            ActivityModel.removeActivityInfo(this.id);
        }
    }

    /**
	 * 获得首充奖励表id 
	 * 只返回符合条件的第一条
	 */
    public getRechargeAwardCfgByType(): ActivityFirstPayRewardConfig {
        let payFirstCfg = this.configs;
        for (let id in payFirstCfg) {
            let info = payFirstCfg[id];
            if (info != null && info != undefined) {
                if (info.id == this.configId) {
                    return info;
                }
            }
        }
        return null;
    }

    /**判断首充充值了是否领取 */
    public getPayBtnState(cfg: ActivityFirstPayRewardConfig) {
        if (this.paySet && this.paySet.length > 0) {
            for (let i = 0; i < this.paySet.length; i++) {
                if (this.paySet[i] == cfg.level) {
                    return true;
                }
            }
        }
        return false;
    }

    /**获得首充按钮状态 */
    public getBtnState() {
        let state: boolean;
        let cf = this.getRechargeAwardCfgByType();
        if (!cf) return false;
        if (this.awardRecordSet && this.awardRecordSet.length > 0) {
            for (let i = 0; i < this.awardRecordSet.length; i++) {
                if (cf.id != this.awardRecordSet[i]) {
                    state = this.getPayBtnState(cf);
                }
            }
        } else {
            state = this.getPayBtnState(cf);
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
        ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_INFO(this.id);
    }
    /**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */

}