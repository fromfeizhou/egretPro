/**model 管理 */
class Models {
	private static m_bInit: boolean;
	private static models: any[];

	public static init() {
		if (this.m_bInit) return;
		this.m_bInit = true;

		this.models = [];
		this.models.push(LocalModel);
		this.models.push(NormalModel);
		this.models.push(BattleModel);
		this.models.push(ChatModel);
		// this.models.push(SkillModel);
		this.models.push(WorldModel);
		this.models.push(WorldMapModel);
		this.models.push(TreasureModel);
		this.models.push(PropModel);
		this.models.push(EquipModel);
		this.models.push(GeneralModel);
		// this.models.push(ExpModel);
		// this.models.push(MilitaryModel);
		// this.models.push(FiefModel);
		// this.models.push(PlayerModel);
		// this.models.push(templeModel);
		this.models.push(LegionModel);
		// this.models.push(TavernModel);
		this.models.push(TechnoModel);
		// this.models.push(WarcraftModel);
		// this.models.push(MilitaryExploitModel);
		this.models.push(MailModel);
		// this.models.push(SecretaryModel);
		this.models.push(FunctionModel);
		this.models.push(MissionModel);
		this.models.push(ArenaModel);
		//this.models.push(PvpArenaModel);
		this.models.push(TurnplateModel);
		this.models.push(PatrolModel);

		this.models.push(HeadQuartersModel);
		this.models.push(CountryModel);
		this.models.push(RankModel);
		// this.models.push(SpeedUpModel);
		this.models.push(TeamModel);
		this.models.push(VipModel);
		this.models.push(ActivityModel);
		this.models.push(OnLineModel);
		this.models.push(GiftBagModel);
		this.models.push(FateModel);
		this.models.push(HistoryBattleModel);
		this.models.push(CityBuildModel);

		this.models.push(WorshipModel);
		this.models.push(CrossModel);
		this.models.push(DailySurpriseModel);

		//红点模块最后初始化 避免模块数据没初始化 访问出错
		this.models.push(RedPointModel);


		for (let key in this.models) {
			if (this.models.hasOwnProperty(key)) {
				let element = this.models[key];
				if (element.init
					&& typeof (element.init) == "function") {
					element.init();
				} else {
					debug("Models:init--->>", element, "没有初始化方法");
				}
			}
		}
	}

	public static clear() {
		this.m_bInit = false;
		for (let key in this.models) {
			if (this.models.hasOwnProperty(key)) {
				let element = this.models[key];
				if (element.clear && typeof (element.clear) == "function") {
					element.clear();
				} else {
					debug("Models:clear--->>", element, "没有清理方法");
				}
			}
		}
	}
}