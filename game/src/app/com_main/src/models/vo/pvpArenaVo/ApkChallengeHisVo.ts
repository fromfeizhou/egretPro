/**
 * 任务基本信息
 */
class ApkChallengeHisVo extends BaseClass implements IFObject {

	public playerId:number ;//玩家ID
	public playerName:string;//玩家名
	public head :number; //头像
    public modifyRank:number;//本次发生变更的排行 (+为上升 -为下降)
	public force :number;//战力
    public challengeTime:number;//挑战时间
    public challengeWin:boolean ;//挑战结果
	public countryId:number;//国家id

	public static create(body?: any): ApkChallengeHisVo {
		var obj: ApkChallengeHisVo = new ApkChallengeHisVo(body);
		return obj;
	}

	public constructor(body: any) {
		super();
		this.init(body);
	}

	public init(body?: any) {
		if(body){
			let keys: Array<string> = [ "playerId", "playerName", "head", "modifyRank","force","challengeTime","challengeWin","countryId"];
			for (var ind in keys) {
				var key = keys[ind];			
				this[key] = body[key];
			}
		}else{
			
		}
		
	}
	

	public onDestroy() {
	}
}