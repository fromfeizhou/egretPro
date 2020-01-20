class C {
  /**代码语言包 */
  public static CodeLanConfig: { [key: number]: CodeLanConfig };
  /**技能配置 */
  public static SkillConfig: { [key: number]: SkillConfig };
  /** 技能等级效果表*/
  public static SkillLvConfig: { [key: number]: SkillLvConfig };
  public static SkillLvConfigDic: { [key: number]: { [key: number]: SkillLvConfig } };
  /**经验书 */
  public static ExpBookConfig: { [key: number]: ExpBookConfig };
  /**玩家等级配置表 */
  public static PlayerExpConfig: { [key: number]: PlayerExpConfig };
  // /**地图配置 */
  // public static BattleMapConfig:  {[key:number]:BattleMapConfig};
  /**世界地图配置 */
  public static WorldMapConfig: { [key: number]: WorldMapConfig };
  /**解锁任务配置表 */
  public static WorldMapUnlockTaskConfig: { [key: number]: WorldMapUnlockTaskConfig };
  /**错误提示配置 */
  public static ErrorCodeConfig: { [key: number]: ErrorCodeConfig };

  /**Buff配置 */
  public static BuffConfig: { [key: number]: BuffConfig };

  /**w_武将_属性配置表 */
  public static GeneralConfig: { [key: number]: GeneralConfig };
  /**w_武将_等级表 */
  public static GeneralLevelConfig: { [key: number]: GeneralLevelConfig };
  /**w_武将_升星表 */
  public static GeneralStarConfig: { [key: number]: GeneralStarConfig };
  /**w_武将属性排序表 */
  public static GeneralShowConfig: { [key: number]: GeneralShowConfig };
  /**w_武将碎片转化百战精华表 */
  public static GeneralRebirthConfig: { [key: number]: GeneralRebirthConfig };

  /**b_兵种_属性配置表 */
  public static GeneralSoldierLvConfig: { [key: number]: GeneralSoldierLvConfig };
  public static GeneralSoldierLvConfigDic: Object;
  /** */
  public static ArmyActionConfig: { [key: number]: ArmyActionConfig };
  /**兵种模型配置 */
  public static ArmyModelConfig: { [key: number]: ArmyModelConfig };
  /**擂台配置 */
  public static ArenaConfig: { [key: number]: ArenaConfig };

  // /**关卡类型配置表 */
  // public static CheckPointTypeConfig:  {[key:number]:SkillConfig};

  /**公告配置表配置 */
  public static NoticeConfig: { [key: number]: NoticeConfig };

  /**兵种大类表 */
  // public static ArmyMainTypeConfig:  {[key:number]:SkillConfig};

  /**宝石配置表 */
  public static GemstoneConfig: { [key: number]: GemstoneConfig };

  /**道具配置表 */
  public static ItemConfig: { [key: number]: ItemConfig };



  /**特效配置表 */
  public static EffectConfig: { [key: number]: EffectConfig };
  /**常量配置表 */
  public static SystemConstConfig: { [key: number]: SystemConstConfig };

  /**跨服战常量表 */
  public static CrossServerConstConfig: { [key: number]: CrossServerConstConfig };

  /**建筑类型表 */
  public static BuildingTypeConfig: { [key: number]: BuildingTypeConfig };
  /**建筑资源产出表 */
  public static BuildingResourcesLvConfig: { [key: number]: BuildingResourcesLvConfig };
  public static BuildingResourcesLvConfigDic: Object;
  /**建筑等级表 */
  public static BuildingLevelConfig: { [key: number]: BuildingLevelConfig };
  public static BuildingLevelConfigDic: Object;
  /**建筑表 */
  public static BuildingConfig: { [key: number]: BuildingConfig };
  /**建筑效果描述表 */
  // public static BuildingEffectTypeConfig: { [key: number]: BuildingEffectTypeConfig };
  /**CD清除配置表 */
  public static CoolDownConfig: { [key: number]: CoolDownConfig };
  // /**建筑效果表 */
  // public static BuildingEffectConfig: { [key: number]: BuildingEffectConfig };

  /**国家名字配置表 */
  // public static CountryConfig:  {[key:number]:SkillConfig};
  /**活动配置表 */
  // public static ActivityConfig: { [key: number]: ActivityConfig };
  /**活动开放表 */
  // public static ActivityTypeConfig: { [key: number]: ActivityTypeConfig };
  /**活动数量奖励配置 */
  // public static ActivityOfCountConfig:  {[key:number]:SkillConfig}
  /**新手场景建筑配置表 */
  public static NoviceMapConfig: { [key: number]: NoviceMapConfig };
  /*任务*/
  // public static MissionConfig:  {[key:number]:SkillConfig};
  public static TaskConfig: { [key: number]: TaskConfig };
  public static TaskConditionConfig: { [key: number]: TaskConditionConfig };
  /**活跃度配置 */
  // public static ActivationConfig:  {[key:number]:SkillConfig};
  public static LivesRewardConfig: { [key: number]: LivesRewardConfig };
  /*任务标题类型配置表*/
  // public static BehaviorConfig:  {[key:number]:SkillConfig};

  /**科技效果表 */
  public static TechnologyEffectConfig: { [key: number]: TechnologyEffectConfig };
  /**科技配置表 */
  public static TechnologyConfig: { [key: number]: TechnologyConfig };
  /**科技等级配置表 */
  public static TechnologyLevelConfig: { [key: number]: TechnologyLevelConfig };
  public static TechnologyLevelConfigDic: Object;

  /**新手引导 */
  public static GuideConfig: { [key: number]: GuideConfig };
  public static GuideStepConfig: { [key: number]: GuideStepConfig };
  public static GuideDialogConfig: { [key: number]: GuideDialogConfig };

  /**材料副本配置表 */
  public static MaterialConfig: { [key: number]: MaterialConfig };
  /**材料副本次数配置表 */
  public static MaterialTypeConfig: { [key: number]: MaterialTypeConfig };
  /**功能等级开放表 */
  public static FunctionConfig: { [key: number]: FunctionConfig };
  /**功能按钮配置表 */
  public static FunctionBtnConfig: { [key: number]: FunctionBtnConfig };

  /**声音配置 */
  public static SoundConfig: { [key: number]: SoundConfig } = [];
  /**产铁加成表 */
  public static IronProportionConfig: { [key: number]: IronProportionConfig };
  public static FiefConstructionConfig: { [key: number]: FiefConstructionConfig };

  public static GuildConfig: { [key: number]: GuildConfig };
  public static GuildPositionConfig: { [key: number]: GuildPositionConfig };
  public static GuildShopConfig: { [key: number]: GuildShopConfig };
  public static GuildHelpConfig: { [key: number]: GuildHelpConfig };

  /**酒馆招募可获物品 */
  public static LotteryConfig: { [key: number]: LotteryConfig };
  /**聚宝盆 */
  public static GenerateCoinConfig: { [key: number]: GenerateCoinConfig };
  /**聚宝盆加成 */
  public static ExtraCoinLevelConfig: { [key: number]: ExtraCoinLevelConfig };
  /**宝物 */
  public static TreasureConfig: { [key: number]: TreasureConfig };
  /**宝物升级表 */
  public static TreasureLevelConfig: { [key: number]: TreasureLevelConfig };
  /**宝物星级加成表 */
  public static TreasureStarConfig: { [key: number]: TreasureStarConfig };
  public static TreasureStarConfigDic: { [starLevel: number]: { [quality: number]: TreasureStarConfig } };
  /**宝物次属性表 */
  public static SecondAttributeConfig: { [key: number]: SecondAttributeConfig };
  public static SecondAttributeConfigDic: { [team: number]: { [quality: number]: SecondAttributeConfig } };
  /**宝物次属性对照表 */
  public static TreaAttriConfig: { [key: number]: TreaAttriConfig };

  /**联盟科技表 */
  public static GuildTechnologyConfig: { [key: number]: GuildTechnologyConfig };
  /**联盟配置 */
  public static GuildDonationConfig: { [key: number]: GuildDonationConfig };
  // public static ShopConfig: { [key: number]: ShopConfig };
  /**充值表 */
  public static ActivityGrowthFundRewardConfig: { [key: number]: ActivityGrowthFundRewardConfig }
  /**签到配置 */
  public static SignUpConfig: { [key: number]: SignUpConfig };
  public static SignUpConfigDic: Object;
  /**每日签到配置 */
  // public static DailyLoginRewardActConfig: { [key: number]: DailyLoginRewardActConfig };
  /**充值和vip配置 */
  // public static RechargeArwardConfig: { [key: number]: RechargeArwardConfig };
  /**月卡周卡配置 */
  public static ActivityWeekMonthCardConfig: { [key: number]: ActivityWeekMonthCardConfig };
  /**转盘配置 */
  public static TurnTableConfig: { [key: number]: TurnTableConfig };
  /**转盘材料配置 */
  public static ConsumeConfig: { [key: number]: ConsumeConfig };
  /**在线奖励配置 */
  public static ActivityOnlineTimeRewardConfig: { [key: number]: ActivityOnlineTimeRewardConfig };

  /**训练兵种 */
  public static BuildingTrainConfig: { [key: number]: BuildingTrainConfig };
  /**世界地图路线 */
  public static WorldWayConfig: { [key: number]: WorldWayConfig };
  /**世界地图事件坐标 */
  public static EventCoordinatesConfig: { [key: number]: EventCoordinatesConfig };
  public static EventDataConfig: { [key: number]: EventDataConfig };

  /**面板跳转表 */
  public static TurnPanelConfig: { [key: number]: TurnPanelConfig };

  /**国家官职表 */
  public static JobConfig: { [key: number]: JobConfig };
  /**国家官职信息表 */
  public static JobInfoConfig: { [key: number]: JobInfoConfig };

  /**国家任务表 */
  // public static CountryTaskConfig: { [key: number]: CountryTaskConfig };
  /**国家任务条件表 */
  // public static CountryTaskConditionConfig: { [key: number]: CountryTaskConditionConfig };

  /**拜访奖励表 */
  public static VisitConfig: { [key: number]: VisitConfig };
  /**兵种方阵状态坐标 */
  public static SquareSoldierPositionConfig: { [key: number]: SquareSoldierPositionConfig };
  /** 章节信息配置表 */
  public static ChapterConfig: { [key: number]: ChapterConfig };
  public static ChapterConfigDic: { [chapterId: number]: { [level: number]: ChapterConfig } };
  /** 章节星星奖励配置表 */
  public static StarRewardConfig: { [key: number]: StarRewardConfig };
  public static StarRewardConfigDic: { [chapterId: number]: StarRewardConfig };
  /** 行营关卡信息 */
  public static StarConfig: { [key: number]: StarConfig };

  /**挂机武将冒泡文字 */
  public static PatrolTalkConfig: PatrolTalkConfig[];
  /**加速道具 */
  public static QuickenConfig: { [key: number]: QuickenConfig };
  /**pvp竞技场 */
  public static ApkRankAwardConfig: { [key: number]: ApkRankAwardConfig };
  /**boss配置 */
  public static BossConfig: { [key: number]: BossConfig };

  /**boss挑战配置 */
  public static PersonalBossConfig: { [key: number]: PersonalBossConfig };
  /**boss目标伤害配置 */
  public static BossHurtConfig: { [key: number]: BossHurtConfig };
  /**排名boss奖励配置 */
  public static RankBossRankRewardConfig: { [key: number]: RankBossRankRewardConfig };
  /**世界boss奖励配置 */
  public static WorldBossRankRewardConfig: { [key: number]: WorldBossRankRewardConfig };

  /**警报表 */
  public static WarningConfig: { [key: number]: WarningConfig };
  /**兵种进阶表 */
  public static ArmyProgressConfig: { [key: number]: ArmyProgressConfig };
  public static ArmyProgressConfigDic: { [type: number]: { [level: number]: ArmyProgressConfig } };;
  /**章节名称 */
  public static ChapterIdConfig: { [key: number]: ChapterIdConfig };
  /**掉落表 */
  public static DropConfig: { [key: number]: DropConfig };
  /**掉落表 */
  public static DropConfigDic: Object;

  /** 购买关卡挑战次数 */
  public static CheckPointCostConfig: { [key: number]: CheckPointCostConfig };

  /** 前端战斗特效 */
  public static ShowSkillEffectConfig: { [key: number]: ShowSkillEffectConfig };
  /** 第一场战斗脚本 */
  public static FirstBattleScriptConfig: { [key: number]: FirstBattleScriptConfig };
  /** 地形配置表 */
  public static TerrainConfig: { [key: number]: TerrainConfig };
  /**属性配置表 */
  public static AttributeConfig: { [key: number]: AttributeConfig };
  /**战斗类型配置表 */
  public static WarTypeConfig: { [key: number]: WarTypeConfig };

  /**装备配置表 */
  public static EquipmentConfig: { [key: number]: EquipmentConfig };
  public static EquipmentS2EConfig: { [key: number]: EquipmentConfig };
  /**套装加成 */
  public static EquipmentSetConfig: { [key: number]: EquipmentSetConfig };
  /**强化加成 */
  public static EquipmentSlotStrengthenConfig: { [key: number]: EquipmentSlotStrengthenConfig };
  public static EquipmentSlotStrengthenConfigDic: Object;
  /**进阶表 */
  public static EquipmentSlotUpgradeConfig: { [key: number]: EquipmentSlotUpgradeConfig };
  public static EquipmentSlotUpgradeConfigDic: Object;
  /**装备精炼 */
  public static EquipmentSlotWroughtConfig: { [key: number]: EquipmentSlotWroughtConfig };
  public static EquipmentSlotWroughtConfigDic: Object;
  /**装备加成配置 */
  public static EquipmentSlotSumConfig: { [key: number]: EquipmentSlotSumConfig };
  public static EquipmentSlotSumConfigDic: Object;
  /**vip 配置表 */
  public static VipConfig: { [key: number]: VipConfig };
  public static VipPrivillegesConfig: { [key: number]: VipPrivillegesConfig };
  /**挂机路线配置 */
  public static GuajiRouteConfig: { [key: number]: GuajiRouteConfig };
  /**国战奖励配置 */
  public static MilitaryMeritsConfig: { [key: number]: MilitaryMeritsConfig };
  /**军功排行奖励配置 */
  public static MilitaryMeritsRankRewardConfig: { [key: number]: MilitaryMeritsRankRewardConfig };
  /**龙骨动画导出scale */
  public static DragonBonesScaleConfig: { [key: number]: DragonBonesScaleConfig };
  /**主城建筑坐标 */
  public static BuildingCoordinateConfig: { [key: number]: BuildingCoordinateConfig };

  /**模块使用次数表 */
  public static ModuleUseCountConfig: { [key: number]: ModuleUseCountConfig }

  /**缘分配置表 */
  public static RelationConfig: { [key: number]: RelationConfig }
  /**玩家战功排名奖励 */
  public static XiangyangPlayerRankRewardConfig: { [key: number]: XiangyangPlayerRankRewardConfig };
  /**国家战功排名奖励 */
  public static XiangyangCountryRankRewardConfig: { [key: number]: XiangyangCountryRankRewardConfig };
  /**玩家挑战奖励 */
  public static XiangyangPlayerBattleRewardConfig: { [key: number]: XiangyangPlayerBattleRewardConfig };
  /**占领国家每日奖励 */
  public static XiangyangEveryDayRewardConfig: { [key: number]: XiangyangEveryDayRewardConfig };
  /**城池建造配置 */
  public static CityMadeConfig: { [key: number]: CityMadeConfig };
  public static CityMadeConfigDic: { [cityId: number]: { [level: number]: CityMadeConfig } };
  /**城池升级奖励类型 */
  public static CityRewardTypeConfig: { [key: number]: CityRewardTypeConfig };
  /** 历史信息配置表 */
  public static HistoryWarConfig: { [key: number]: HistoryWarConfig };
  public static HistoryWarConfigDic: { [chapterId: number]: { [level: number]: HistoryWarConfig } };
  /** 历史战役星星奖励配置表 */
  public static HistoryWarStarRewardConfig: { [key: number]: HistoryWarStarRewardConfig };
  public static HistoryWarStarRewardConfigDic: { [chapterId: number]: HistoryWarStarRewardConfig };

  /**历史战役星星配置表 */
  public static HistoryWarStarConfig: { [key: number]: HistoryWarStarConfig };
  /**历史战役名称表 */
  public static HistoryWarChapterNameConfig: { [key: number]: HistoryWarChapterNameConfig }

  /**跨服战地市配置表 */
  public static CrossServerCityConfig: { [key: number]: CrossServerCityConfig };

  /**跨服战内城配置表 */
  public static CrossServerAreaConfig: { [key: number]: CrossServerAreaConfig };

  /**跨服战奖励配置表 */
  public static CrossServerRewardConfig: { [key: number]: CrossServerRewardConfig };
  public static CrossServerRewardConfigDic: { [type: number]: { [value: number]: CrossServerRewardConfig } };

  /**战功配置 */
  public static MilitaryMeritsDayLimitConfig: { [key: number]: MilitaryMeritsDayLimitConfig };

  /**补兵配置 */
  public static ArmyUpTeamConfig: { [key: number]: ArmyUpTeamConfig }

}
