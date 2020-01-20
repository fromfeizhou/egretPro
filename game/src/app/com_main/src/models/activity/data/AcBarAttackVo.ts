/**南蛮入侵 */
class AcBarAttackVo extends ActivityVo implements IFObject {
    public cityDatas: { [key: number]: gameProto.IBbEvent };
    public evtDatas: gameProto.IBbEvent[];
    public bRequestDay: number;    //请求数据记录(每天只请求一次)
    public constructor() {
        super();
        this.cityDatas = {};
        this.evtDatas = [];
    }

    public parseData(evts: gameProto.IBbEvent[]) {
        if (this.bClose) return false;
        
        for (let i = 0; i < evts.length; i++) {
            this.syncList(evts[i])
            this.cityDatas[evts[i].cityId] = evts[i];
        }
    }

    /**同步列表 */
    private syncList(data: gameProto.IBbEvent) {
        if (this.bClose) return false;

        for (let i = 0; i < this.evtDatas.length; i++) {
            if (this.evtDatas[i].cityId == data.cityId) {
                this.evtDatas[i] = data;
                return;
            }
        }
        this.evtDatas.push(data);
    }

    /**预告检测 */
    public checkPreIcon() {
        if (this.bActivited) return;
        if (this.preViewDate > 0 && !this.preNotice) {
            let time = TimerUtils.getServerTimeMill();
            // debug('bar==========>>',Utils.DateUtils.getFormatBySecond(time/1000,2),Utils.DateUtils.getFormatBySecond(this.preViewDate/1000,2),Utils.DateUtils.getFormatBySecond(this.closeDate/1000,2))
            if (time >= this.preViewDate && time < this.closeDate) {
                this.preNotice = true;
            }
        }
    }

    /**攻击准备期间 */
    public isInAttReady() {
        let time = TimerUtils.getServerTimeMill();
        return (time >= this.preViewDate && time < this.openDate)
    }

    /**图标是否可见 */
    public isOpenIcon() {
        if (this.bClose) return false;
        let time = TimerUtils.getServerTimeMill();
        return time >= this.preViewDate && time < this.closeDate;
    }

    public close() {
        // this.cityDatas = null;
        // this.evtDatas = null;
        super.close()
    }

    /**=====================================================================================
	 * 配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return false;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        AcBattleProxy.C2S_BARBARIAN_BREAKOUT_EVENT();
    }

    /**是否预告请求 */
    public isNoticeRequest() {
        return true;
    }
	/**=====================================================================================
	 * 配置相关 end
	 * =====================================================================================
	 */
}