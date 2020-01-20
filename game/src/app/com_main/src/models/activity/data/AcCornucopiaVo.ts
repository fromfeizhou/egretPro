
interface TreasureBowl {
    totalCount: number; //剩余聚宝次数
    totalCost: number;  //已经聚宝次数
    curCount: number;   //当前聚宝次数
}

/**新7天聚宝盆活动 */
class AcCornucopiaVo extends ActivityVo implements IFObject {

    public configs: { [key: number]: TreasureBowlConfig };
    public configsII: { [key: number]: TreasureBowlLevelConfig };
    private m_sortList: TreasureBowlLevelConfig[];

    public CorInfo: TreasureBowl;

    public constructor() {
        super();
    }

    public initCorInfo(data: gameProto.IS2C_ACTIVITY_TREASEURE_BOWL_INFO) {
        this.parseInfo(data.treasureBowl);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR, null);
    }

    public parseInfo(info: gameProto.ITreasureBowl) {
        this.CorInfo = {
            totalCount: info.totalCount,
            totalCost: info.totalCost,
            curCount: info.curCount,
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.AC_7DAY_COR, null);
    }

    public rewardReturn(data: gameProto.IS2C_ACTIVITY_TREASEURE_BOWL_REWARD) {
        this.parseInfo(data.treasureBowl);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, data.message);
    }

    public getInfo() {
        return this.CorInfo;
    }

    public getMinMax(index: number): [number, number] {
        let cfg = this.getConfigsII();
        return [cfg[index].min, cfg[index].max];
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
        ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_INFO(this.id);
    }

    /** 获取ActivityNewGeneralReward配置表  */
    public getConfigs(): TreasureBowlConfig {
        for (let i in this.configs) {
            return this.configs[i];
        }
    }

    public getConfigsII() {
        if (!this.m_sortList) {
            this.m_sortList = [];
            for (let i in this.configsII) {
                this.m_sortList.push(this.configsII[i]);
            }
            this.m_sortList.sort((a, b) => {
                return a.id < b.id ? 0 : 1;

            })
        }
        return this.m_sortList;

    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */

    //聚宝盆红点
    public newCorRed(): boolean {
        if (this.CorInfo) {
            if (this.CorInfo.totalCost == 0 || this.CorInfo.totalCount > 0) return true;
        }
        return false;
    }
}