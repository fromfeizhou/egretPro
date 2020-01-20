/**新武将拜访活动 */
class AcNewGenVisVo extends ActivityVo implements IFObject {

    public configs: { [key: number]: ActivityNewGeneralRewardConfig };
    public configsII: { [key: number]: CostKeepsakeRewardConfig };
    private m_sortList: CostKeepsakeRewardConfig[];

    private m_todayCostKeepsake: number;    //今日消耗信物数量
    private m_boxReardRecord: number[];       //宝箱领奖记录（配置Id）
    private m_chooseRewardList: IItemInfo[];   //已选奖励列表

    private m_isClick: boolean;
    private m_visitCost: IItemInfo;
    private m_visitCost10: IItemInfo;

    private m_limitStatu: number;  //限购礼包转台  0=未购买，1=已购买，2=购买并领取

    public constructor() {
        super();
    }


    /**新武将信息 */
    public initNewGenVis(data: gameProto.IS2C_ACTIVITY_NEW_GENERAL_INFO) {
        this.m_limitStatu = data.generalBagStatu;
        this.m_todayCostKeepsake = data.todayCostKeepsake;
        this.m_boxReardRecord = data.boxReardRecord;
        this.parseChooseRewardList(data.chooseRewardList);

        this.m_visitCost = this.getNewGenRewordCfg().visitCost[0];
        this.m_visitCost10 = this.getNewGenRewordCfg().visitCost10[0];

        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_INFO, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);

    }

    /**拜访返回 */
    public parseVisInfo(data: gameProto.IS2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD) {
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        this.m_todayCostKeepsake = data.todayCostKeepsake;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    }

    /**选择奖励返回 */
    public parseChangeReward(data: gameProto.IS2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD) {
        this.parseChooseRewardList(data.items);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, null);
    }

    /**领取宝箱返回 */
    public parseGetBox(data: gameProto.IS2C_ACTIVITY_NEW_GENERAL_BOX_REWARD) {
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        this.m_boxReardRecord = data.boxReardRecord;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    }

    private parseChooseRewardList(data: gameProto.ITuple[]) {
        let list: IItemInfo[] = [];
        for (let info of data) {
            list.push({ itemId: info.key, count: info.value });
        }
        this.m_chooseRewardList = list;
    }

    //限购礼包状态更新
    public setLimitStatu(s: number) {
        this.m_limitStatu = s;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_LIM, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    }

    public getLimitStatu(): number{
        return this.m_limitStatu;
    }

    //购买限购礼包
    public bugLimit(data: gameProto.IS2C_ACTIVITY_AWARD_GENERAL_BAG) {
        this.setLimitStatu(data.generalBagStatu);
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
    }

    public getChooseList() {
        return this.m_chooseRewardList;
    }

    public getCostKeepsake(): number {
        return this.m_todayCostKeepsake;
    }

    public getBoxReardRecord(): number[] {
        return this.m_boxReardRecord;
    }

    /**获取信物id */
    public getVisCost() {
        return this.m_visitCost;
    }

    /**拜访一次消耗信物数 */
    public getVisCost10() {
        return this.m_visitCost10;
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
        ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_INFO(this.id);
    }

    /** 获取ActivityNewGeneralReward配置表  */
    public getNewGenRewordCfg(): ActivityNewGeneralRewardConfig {
        for (let i in this.configs) {
            return this.configs[i];
        }
    }

    public getKeepsakeRewardCfg() {
        if(!this.m_sortList){
            this.m_sortList = [];
            for(let i in this.configsII){
                this.m_sortList.push(this.configsII[i]);
            }
            this.m_sortList.sort((a,b)=>{
                return a.id < b.id? 0:1 ;
                
            })
        }

        return this.m_sortList;
    }

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */

    public setClick() {
        this.m_isClick = true;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    }

    //信物红点
    public newGenVisRedState(): boolean {
        if (!this.m_isClick) {
            return true;
        }

        if (PropModel.getPropNum(this.m_visitCost.itemId) >= this.m_visitCost.count) {
            return true;
        }

        let cfg = this.getKeepsakeRewardCfg();
        for (let i = 0; i <= 3; i++) {
            if (this.m_todayCostKeepsake >= cfg[i].keepsakeCount && this.m_boxReardRecord.indexOf(i+1) == -1) {
                return true;
            }
        }
        return false;
    }

    //限购红点
    public newGenLimRedS(){
        if(this.m_limitStatu == 1){
            return true;
        }
        return false;
    }

}