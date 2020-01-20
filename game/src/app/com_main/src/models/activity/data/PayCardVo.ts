/**周卡月卡 */
class PayCardVo extends ActivityVo implements IFObject {
    public weekMonthCardInfoDic: { [key: number]: gameProto.IWeekMonthCardInfo }; //周卡月卡信息	

    public constructor() {
        super();
        this.weekMonthCardInfoDic = {};
        // this.addActNotice();
    }
    /**解析周卡月卡数据 */
    public initPayCard(info: gameProto.IS2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO) {
        if (info.cardInfo && info.cardInfo.length > 0) {
            for (let i = 0; i < info.cardInfo.length; i++) {
                let data = info.cardInfo[i];
                this.weekMonthCardInfoDic[data.cardType] = data;
            }
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_MOON_CARD, null);
    }
    

    /**领取奖励 */
    public finishAward(data: gameProto.IWeekMonthRewardInfo) {
        //领奖错误
        if (data.resultCode != 0) return;
        for (let i in data.cardInfo) {
            let payVo = data.cardInfo[i];
            this.weekMonthCardInfoDic[payVo.cardType] = payVo;
        }
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_MOON_CARD, null);
    }

    //获取对应配置表
    public getRechargeCfgBy() {
        // return C.RechargeConfig;
    }

    //获得周卡充值配置
    public getWeekRechargeCfg(){
        return this.rechargeCfgs[0];
    }
    //获得月卡充值配置
    public getMonthRechargeCfg(){
        return this.rechargeCfgs[1];
    }

    //活动配置
    public getWeekMonthCfg(index:number = 0){
        for(let key in C.ActivityWeekMonthCardConfig){
            let config = C.ActivityWeekMonthCardConfig[key]
            if(unNull(config) &&config.cardType == this.rechargeIds[index]) return config;
        }
    }
    
    /** 周卡月卡按钮红点*/
    public getGrowFundBtnRed(key: number) {
        let state: number = 1;  //进行中
        let infoVo = this.weekMonthCardInfoDic[key];
        if (infoVo) {
            if (infoVo.canReceive) {
                state = 0;
            } else {
                state = 2;
            }
        }
        return state;
    }

    /**有可领取奖励 */
    public hasAward() {
        for (let key in this.weekMonthCardInfoDic) {
            let data = this.weekMonthCardInfoDic[key];
            if (data && data.canReceive) return 1;
        }
        return 0;
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
        ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO(this.id);
    }

     /**跨天请求 */
    public crossDayRequest() {
        this.requestActivityInfo();
    }
	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */

}