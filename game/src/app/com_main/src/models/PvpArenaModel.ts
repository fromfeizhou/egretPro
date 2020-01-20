

class PvpArenaModel {
	
	private static m_pChallengedCount :number ;//当天挑战次数
	private static m_pBuyCount:number ;//当天购买次数
	private static m_pIsChallenge:boolean ;//是否挑战过
	private static m_pRank :number ;//排名

	public static init() {
		debug("PvpArenaModel:init-------->>");
		this.m_pChallengedCount = 0;
		this.m_pBuyCount = 0;
		this.m_pIsChallenge = false;
		this.m_pRank = Number.MAX_VALUE;
	}

	public static clear() {
		this.init();
	}
	/**已挑战次数 */
	public static get ChallengedCount():number{
		return this.m_pChallengedCount;
	}
	/**默认可挑战次数 */
	public static get DefaultCount():number{
		return ConstUtil.getValue(IConstEnum.CONST_CHALLENGE_NUM);
	}
	/**总次数 */
	public static get AllChallengeCount():number{
		return this.DefaultCount + this.BuyCount;
	}
	/**可挑战次数 */
	public static get CanChallengeCount():number{
		return this.AllChallengeCount - this.ChallengedCount;
	}

	/**可挑战次数 */
	public static getFightLeftTimes():number{
		if (!FunctionModel.isFunctionOpen(FunctionType.APK)) return 0;
		
		return this.CanChallengeCount;
	}


	public static get IsChallenge():boolean{
		return this.m_pIsChallenge;
	}
	public static get BuyCount():number{
		return this.m_pBuyCount;
	}
	public static get Rank():number{
		return this.m_pRank;
	}

	public static setRank(rank:number){
		this.m_pRank = rank<=0? Number.MAX_VALUE:rank;
	}

	public static initPvpArenaInfo(data:any){
		this.m_pChallengedCount = data.challengeCount ||0;
		this.m_pBuyCount = data.buyCount || 0;
		this.m_pIsChallenge = data.challenged || false;
		this.m_pRank  = data.rank<=0? Number.MAX_VALUE:data.rank;
		com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
	}

	public static setBuyNum(data:any){
		this.m_pBuyCount = data.buyCount;
		this.m_pChallengedCount = data.challengeCount;
		com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
	}

	public static OnFastChallenge(data:any){
		if (data.message) {
			Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
		}
		this.m_pChallengedCount++;
		com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
	}
}

