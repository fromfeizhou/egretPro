/**
 * 任务基本信息
 */
class ApkRankVo extends BaseClass implements IFObject {

	public playerId:number ;//玩家ID
	public playerName:string;//玩家名
	public head :number; //头像
	public rank :number;//排行
	public force :number;//战力
	public generalWinInfo:gameProto.IGeneralWinInfo;
	public countryId:number;


	//=======================非协议数据
	/**排名奖励 */
	public rewardList: Array<IItemInfo>;

	public static create(body?: gameProto.IApkRankVo): ApkRankVo {
		var obj: ApkRankVo = new ApkRankVo(body);
		return obj;
	}

	public constructor(body: any) {
		super();
		this.init(body);
	}

	public init(body?: gameProto.IApkRankVo) {
		if(body){
			let keys: Array<string> = [ "playerId", "playerName", "head", "rank","force","generalWinInfo","countryId"];
			for (var ind in keys) {
				var key = keys[ind];			
				this[key] = body[key];
			}
		}
	}

	public setReward(){
		if(this.rank){
			for(let key in C.ApkRankAwardConfig){
				let cfg = C.ApkRankAwardConfig[key];
				if(cfg.minRank<=this.rank&&cfg.maxRank>=this.rank)
				{
					this.rewardList = Utils.parseCommonItemJson(cfg.reward);
				}
			}
		}else{

		}
	}

	public onDestroy() {
	}
}