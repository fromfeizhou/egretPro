/**跨服战 */
class AcCrossServerVo extends ActivityVo implements IFObject {

    public constructor() {
        super();
    }

    /**预告检测 */
    public checkPreIcon() {
        if (this.bActivited) return;
        if (this.preViewDate > 0 && !this.preNotice) {
            let time = TimerUtils.getServerTimeMill();
            // debug('bar==========>>',Utils.DateUtils.getFormatB,2),Utils.DateUtils.getFormatBySecond(this.preViewDate/1000,2),Utils.DateUtils.getFormatBySecond(this.closeDate/1000,2))

            if (time > this.preViewDate && time < this.closeDate) {
                this.preNotice = true;
            }
        }
    }

    /**攻击准备期间 */
    public isInAttReady() {
        let time = TimerUtils.getServerTimeMill();
        return (time >= this.preViewDate && time <= this.openDate)
    }

    /**图标是否可见 */
    public isOpenIcon() {
        if (this.bClose) return false;
        let time = TimerUtils.getServerTimeMill();
        return time > this.preViewDate && time < this.closeDate;
    }

    public close() {
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