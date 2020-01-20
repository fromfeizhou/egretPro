/**
 * 工会科技
 */
class LegionTeachVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["id", "exp", "type"];

	public id: number;	//科技id [服务器推送新的技能id 替换旧的 达到技能升级目的]
	public exp: number; //科技经验
	public type: number; //科技类型

	public cfg: GuildTechnologyConfig;//科技配置
	public static create(body?: gameProto.IGuildTechInfo) {
		var obj: LegionTeachVo = new LegionTeachVo(body);
		return obj;
	}

	public onDestroy() {
	}

	public constructor(body?: gameProto.IGuildTechInfo) {
		super();
		this.init(body);
	}

	public init(body?: gameProto.IGuildTechInfo) {
		this.parseKeys(body);
	}

	/**更新数据 */
	public update(body?: gameProto.IGuildTechInfo) {
		this.parseKeys(body);
	}
	/**解析服务器协议 */
	private parseKeys(body: any) {
		let keys: Array<string> = LegionTeachVo.AttriKey;
		Utils.voParsePbData(this, body, LegionTeachVo.AttriKey);

		this.cfg = LegionModel.getTechCfgById(this.id);
		/**对应科技类型 数据更新 */
		com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_TECH_UPDATE, this.type);
	}

	/**等级 */
	public get level() {
		return this.cfg.level;
	}
	/**名字 */
	public get name() {
		return GLan(this.cfg.name);
	}
	/**描述 */
	public get des() {
		return GLan(this.cfg.describe);
	}

	/**next level描述 */
	public get nextDes() {
		let nextcfg =  LegionModel.getTechCfgById(this.nextId);
		if(nextcfg) return GLan(nextcfg.describe);
		return '';
	}
	/**升级经验 */
	public get maxExp() {
		return this.cfg.exp > 0 ? this.cfg.exp : -1;
	}

	/**下一级id */
	public get nextId() {
		return this.cfg.nexttechID;
	}

	public get nextCfg() {
		return LegionModel.getTechCfgById(this.nextId);
	}

}