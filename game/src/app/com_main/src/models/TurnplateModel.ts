class TurnplateModel {
	
	  /**转盘免费次数 */
    private static m_turntableFreeCount :number=0;
      /**转盘时间 */
    private static m_turntableTime:number;
	/**转盘物品组id */
	private static m_turnplateGroupId:number;
	/**转盘物品id列表 */
	private static m_curTurnplateItemIdList:number[];
	
	public static init() {
		debug("MissionModel:init-------->>");
		this.m_curTurnplateItemIdList = [];		
	}

	public static clear() {
		
		 this.init();
	}
	/**获取当前转盘物品列表 */
	public static getCurTurnPlateItemList():number[]{
		return this.m_curTurnplateItemIdList;
	}

	/**获取刷新时间戳 */
	public static getEndTime():number{
		return this.m_turntableTime;
	}

	/**转盘数据 */
    public static initTurnTableInfo(data:any){
        this.m_turntableTime = data.time;
        this.m_turntableFreeCount = data.count;
		this.m_turnplateGroupId = data.itemListId;
		this.setCurTurnplateItemList(this.m_turnplateGroupId);
    }
	//获取当前时间段转盘物品列表
	public static setCurTurnplateItemList(rewardListId:number){
		this.m_curTurnplateItemIdList = [];
		let cfgList = C.TurnTableConfig;
		for (let key in cfgList) {
			if (cfgList.hasOwnProperty(key)) {
				let cfg = cfgList[key];
				if(cfg.team == rewardListId)
					this.m_curTurnplateItemIdList.push(cfg.id);
			}
		}
		this.m_curTurnplateItemIdList.sort((a,b)=>{
			return a-b;
		});
	}
	//获取消耗配置
	public static getTurnCostType(type:number,count:number){
		
		let cfgList = C.ConsumeConfig;		
		for (let key in cfgList) {
			if (cfgList.hasOwnProperty(key)) {
				let cfg = cfgList[key];
				if(cfg.type == type&&cfg.times == count)
					return cfg;
			}
		}
		return null;
	}
	
}