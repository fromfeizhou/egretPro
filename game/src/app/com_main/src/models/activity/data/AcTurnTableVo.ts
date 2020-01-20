/**转盘 */
class AcTurnTableVo extends ActivityVo implements IFObject {
    public account: number;   //累计抽奖次数
    public luncky: number;   //幸运值
    public accumulates: number[];//累积奖励领取记录
    public playNum: number;   //当前抽奖位置
    public isSkip: boolean;   //是否跳过动画
    public m_activityId: number;   //转盘类型id
    public freeCount: number;   //免费次数
    public configs: { [key: number]: PrizeConfig };
    public configsII: { [key: number]: PrizeAccumulateConfig };

    public constructor() {
        super();
    }

    /**解析转盘信息数据 */
    public getInfoData(data: gameProto.IS2C_ACTIVITY_GET_PRIZE_INFO) {
        this.parseData(data);
    }
    /**点击转盘返回数据 */
    public parsePalyData(data: gameProto.IS2C_ACTIVITY_PRIZE_PLAY) {
        this.parseData(data);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, data.message);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.accumulates = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, null);
    }
    /**解析转盘信息数据 */
    public parseData(data: any) {
        this.accumulates = [];
        this.account = data.prizeInfo.account;
        this.luncky=data.prizeInfo.luncky;
        this.playNum = data.prizeInfo.playNum;
        this.freeCount = data.prizeInfo.fireNum;
        this.m_activityId = data.activityId;
        for (let i = 0; i < data.prizeInfo.accumulates.length; i++) {
            this.accumulates.push(data.prizeInfo.accumulates[i].accumulate);
        }
    }

    /**=====================================================================================
	 * 配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }
    /**可领奖励 */
    public hasAward() {
        let prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE);//幸运转盘数量
        let prizeCfg: PrizeAccumulateConfig[] = [];
        for (let key in this.configsII) {
            let cfg = this.configsII[key];
            prizeCfg.push(cfg);
        }

        for (let i = 0; i < prizeCfg.length; i++) {
            let vo = prizeCfg[i];
            if (vo) {
                if (this.accumulates.indexOf(vo.id) == -1) {
                    if (this.account >= vo.accumulate) {
                        return 1;
                    }
                }
            }
        }
        if (prizeNum > 0) return 1;
        if (this.freeCount > 0) return 1;
        return 0;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        TurnTableProxy.C2S_ACTIVITY_GET_PRIZE_INFO(this.id);
    }

     /**跨天请求 */
    public crossDayRequest() {
        this.requestActivityInfo();
    }

	/**=====================================================================================
	 * 配置相关 end
	 * =====================================================================================
	 */
}