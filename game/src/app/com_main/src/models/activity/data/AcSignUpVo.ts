/**签到 */
class AcSignUpVo extends ActivityVo implements IFObject {
    private m_signResp: gameProto.IGetSignUpResp;
    public constructor() {
        super();

    }

    /**解析签到数据 */
    public initSignUpData(m_signResp: gameProto.IGetSignUpResp) {
        this.m_signResp = m_signResp;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SIGN_MONTH, null);
    }

    public getSignUpData(): gameProto.IGetSignUpResp {
        return this.m_signResp;
    }

    /**可以领取奖励 */
    public hasAward() {
        let data = this.m_signResp;
        if (!data) return 0;
        let canSign = data.lastTime == 0 || TimerUtils.isOverDay(data.lastTime * 1000) || data.rewardStatus > 0;
        if (canSign) return 1;
        for (let i = 0; i < data.notReceiveExtras.length; i++) {
            let rewardId = data.notReceiveExtras[i];
            if (data.receiveExtras.indexOf(rewardId) == -1) return 1
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
        WelfareProxy.send_GET_SIGN_UP();
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