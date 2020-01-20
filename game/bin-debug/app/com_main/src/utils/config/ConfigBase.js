var PersonalBossConfig = /** @class */ (function () {
    function PersonalBossConfig() {
    }
    PersonalBossConfig.prototype.attrs = function () {
        return ['id', 'bossType', 'bossName', 'power', 'openLevel', 'bossLevel', 'model', 'checkPointIds', 'worldPointIds', 'terrainId', 'killReward', 'week', 'time'];
    };
    PersonalBossConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'string'];
    };
    return PersonalBossConfig;
}());
window["PersonalBossConfig"] = PersonalBossConfig;
var BossConfig = /** @class */ (function () {
    function BossConfig() {
    }
    BossConfig.prototype.attrs = function () {
        return ['id', 'model', 'position', 'type', 'star', 'power', 'condition', 'checkPointIds', 'strengthenId', 'reward', 'nextId', 'level'];
    };
    BossConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'string', 'number', 'number'];
    };
    return BossConfig;
}());
window["BossConfig"] = BossConfig;
var BossHurtConfig = /** @class */ (function () {
    function BossHurtConfig() {
    }
    BossHurtConfig.prototype.attrs = function () {
        return ['id', 'bossHurt', 'bossHurtReward'];
    };
    BossHurtConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return BossHurtConfig;
}());
window["BossHurtConfig"] = BossHurtConfig;
var WorldBossRankRewardConfig = /** @class */ (function () {
    function WorldBossRankRewardConfig() {
    }
    WorldBossRankRewardConfig.prototype.attrs = function () {
        return ['id', 'bossId', 'rank', 'reward'];
    };
    WorldBossRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return WorldBossRankRewardConfig;
}());
window["WorldBossRankRewardConfig"] = WorldBossRankRewardConfig;
var RankBossRankRewardConfig = /** @class */ (function () {
    function RankBossRankRewardConfig() {
    }
    RankBossRankRewardConfig.prototype.attrs = function () {
        return ['id', 'bossId', 'rank', 'reward'];
    };
    RankBossRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return RankBossRankRewardConfig;
}());
window["RankBossRankRewardConfig"] = RankBossRankRewardConfig;
var ArmyActionConfig = /** @class */ (function () {
    function ArmyActionConfig() {
    }
    ArmyActionConfig.prototype.attrs = function () {
        return ['id', 'anchorOffsetX', 'anchorOffsetY', 'keyFrame', 'fps', 'fps2', 'launchX', 'launchY', 'launchDeleyTime'];
    };
    ArmyActionConfig.prototype.types = function () {
        return ['string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return ArmyActionConfig;
}());
window["ArmyActionConfig"] = ArmyActionConfig;
var ArmyModelConfig = /** @class */ (function () {
    function ArmyModelConfig() {
    }
    ArmyModelConfig.prototype.attrs = function () {
        return ['id', 'description', 'code', 'grid', 'attackEffect', 'bodyHeight', 'buffScale'];
    };
    ArmyModelConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'boolean', 'number', 'number'];
    };
    return ArmyModelConfig;
}());
window["ArmyModelConfig"] = ArmyModelConfig;
var GeneralSoldierLvConfig = /** @class */ (function () {
    function GeneralSoldierLvConfig() {
    }
    GeneralSoldierLvConfig.prototype.attrs = function () {
        return ['id', 'mainType', 'subType', 'LV', 'ourModelCode', 'enemyModelCode', 'name', 'attribute', 'speed', 'lordTomeSkill', 'teamconsumption', 'score'];
    };
    GeneralSoldierLvConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'number', 'string', 'number', 'number'];
    };
    return GeneralSoldierLvConfig;
}());
window["GeneralSoldierLvConfig"] = GeneralSoldierLvConfig;
var ArmyProgressConfig = /** @class */ (function () {
    function ArmyProgressConfig() {
    }
    ArmyProgressConfig.prototype.attrs = function () {
        return ['id', 'armyType', 'armyName', 'progressLevel', 'coumses', 'attribute', 'score'];
    };
    ArmyProgressConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'string', 'string', 'number'];
    };
    return ArmyProgressConfig;
}());
window["ArmyProgressConfig"] = ArmyProgressConfig;
var ArmyUpTeamConfig = /** @class */ (function () {
    function ArmyUpTeamConfig() {
    }
    ArmyUpTeamConfig.prototype.attrs = function () {
        return ['id', 'armyNum'];
    };
    ArmyUpTeamConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return ArmyUpTeamConfig;
}());
window["ArmyUpTeamConfig"] = ArmyUpTeamConfig;
var SquareSoldierPositionConfig = /** @class */ (function () {
    function SquareSoldierPositionConfig() {
    }
    SquareSoldierPositionConfig.prototype.attrs = function () {
        return ['id', 'soldier_1', 'soldier_2', 'soldier_3', 'soldier_4', 'soldier_5', 'soldier_6', 'soldier_7', 'soldier_8'];
    };
    SquareSoldierPositionConfig.prototype.types = function () {
        return ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string'];
    };
    return SquareSoldierPositionConfig;
}());
window["SquareSoldierPositionConfig"] = SquareSoldierPositionConfig;
var TreasureConfig = /** @class */ (function () {
    function TreasureConfig() {
    }
    TreasureConfig.prototype.attrs = function () {
        return ['id', 'name', 'quality', 'type', 'generalType', 'mainAttribute', 'secondaryAttributeGroup', 'exclusiveId', 'exclusiveAdd', 'highLevel', 'highStar', 'constitute', 'oneEffect', 'twoEffect', 'threeEffect', 'fragment', 'decompose'];
    };
    TreasureConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'string', 'string', 'string', 'number', 'string', 'number', 'number', 'string', 'string', 'string', 'string', 'number', 'number'];
    };
    return TreasureConfig;
}());
window["TreasureConfig"] = TreasureConfig;
var TreaAttriConfig = /** @class */ (function () {
    function TreaAttriConfig() {
    }
    TreaAttriConfig.prototype.attrs = function () {
        return ['id', 'type', 'subType', 'attriType', 'valType'];
    };
    TreaAttriConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number'];
    };
    return TreaAttriConfig;
}());
window["TreaAttriConfig"] = TreaAttriConfig;
var TreasureStarConfig = /** @class */ (function () {
    function TreasureStarConfig() {
    }
    TreasureStarConfig.prototype.attrs = function () {
        return ['id', 'starLevel', 'quality', 'attriAddRate', 'consume', 'unlockHole', 'levelLimit', 'fragmenNum'];
    };
    TreasureStarConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string', 'number', 'number', 'number'];
    };
    return TreasureStarConfig;
}());
window["TreasureStarConfig"] = TreasureStarConfig;
var SecondAttributeConfig = /** @class */ (function () {
    function SecondAttributeConfig() {
    }
    SecondAttributeConfig.prototype.attrs = function () {
        return ['id', 'name', 'desc', 'team', 'quality', 'attris'];
    };
    SecondAttributeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number', 'string'];
    };
    return SecondAttributeConfig;
}());
window["SecondAttributeConfig"] = SecondAttributeConfig;
var TreasureLevelConfig = /** @class */ (function () {
    function TreasureLevelConfig() {
    }
    TreasureLevelConfig.prototype.attrs = function () {
        return ['id', 'growUp', 'consume', 'success'];
    };
    TreasureLevelConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number'];
    };
    return TreasureLevelConfig;
}());
window["TreasureLevelConfig"] = TreasureLevelConfig;
var GemstoneConfig = /** @class */ (function () {
    function GemstoneConfig() {
    }
    GemstoneConfig.prototype.attrs = function () {
        return ['id', 'nextId', 'type', 'gemLevel', 'openLevel', 'attri', 'composeNumber', 'cost'];
    };
    GemstoneConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'string', 'number', 'number'];
    };
    return GemstoneConfig;
}());
window["GemstoneConfig"] = GemstoneConfig;
var VisitConfig = /** @class */ (function () {
    function VisitConfig() {
    }
    VisitConfig.prototype.attrs = function () {
        return ['id', 'name', 'heroId', 'reward', 'icon', 'starttext', 'endtext', 'cooling'];
    };
    VisitConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return VisitConfig;
}());
window["VisitConfig"] = VisitConfig;
var ApkRankAwardConfig = /** @class */ (function () {
    function ApkRankAwardConfig() {
    }
    ApkRankAwardConfig.prototype.attrs = function () {
        return ['id', 'minRank', 'maxRank', 'reward'];
    };
    ApkRankAwardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return ApkRankAwardConfig;
}());
window["ApkRankAwardConfig"] = ApkRankAwardConfig;
var ApkMaxRankAwardConfig = /** @class */ (function () {
    function ApkMaxRankAwardConfig() {
    }
    ApkMaxRankAwardConfig.prototype.attrs = function () {
        return ['id', 'minRank', 'maxRank', 'reward'];
    };
    ApkMaxRankAwardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return ApkMaxRankAwardConfig;
}());
window["ApkMaxRankAwardConfig"] = ApkMaxRankAwardConfig;
var CoolDownConfig = /** @class */ (function () {
    function CoolDownConfig() {
    }
    CoolDownConfig.prototype.attrs = function () {
        return ['id', 'type', 'min', 'max', 'gold'];
    };
    CoolDownConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number'];
    };
    return CoolDownConfig;
}());
window["CoolDownConfig"] = CoolDownConfig;
var VipPrivillegesConfig = /** @class */ (function () {
    function VipPrivillegesConfig() {
    }
    VipPrivillegesConfig.prototype.attrs = function () {
        return ['id', 'key', 'moduleUseCountId', 'type', 'vip0', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'vip10', 'vip11', 'vip12', 'vip13', 'vip14', 'vip15', 'valType', 'description'];
    };
    VipPrivillegesConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return VipPrivillegesConfig;
}());
window["VipPrivillegesConfig"] = VipPrivillegesConfig;
var VipConfig = /** @class */ (function () {
    function VipConfig() {
    }
    VipConfig.prototype.attrs = function () {
        return ['id', 'level', 'exp', 'dailyReward', 'levelReward', 'privileges', 'price', 'discount', 'amount'];
    };
    VipConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string', 'string', 'number', 'string', 'number'];
    };
    return VipConfig;
}());
window["VipConfig"] = VipConfig;
var MaterialTypeConfig = /** @class */ (function () {
    function MaterialTypeConfig() {
    }
    MaterialTypeConfig.prototype.attrs = function () {
        return ['id', 'key', 'freeCount', 'vipBuyPrivilege', 'buyPrice'];
    };
    MaterialTypeConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'string'];
    };
    return MaterialTypeConfig;
}());
window["MaterialTypeConfig"] = MaterialTypeConfig;
var MaterialConfig = /** @class */ (function () {
    function MaterialConfig() {
    }
    MaterialConfig.prototype.attrs = function () {
        return ['id', 'type', 'playerLevel', 'name', 'prev', 'grade', 'power', 'scenetype', 'model', 'terrainId', 'checkPointIds', 'reward', 'week', 'time'];
    };
    MaterialConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string'];
    };
    return MaterialConfig;
}());
window["MaterialConfig"] = MaterialConfig;
var ErrorCodeConfig = /** @class */ (function () {
    function ErrorCodeConfig() {
    }
    ErrorCodeConfig.prototype.attrs = function () {
        return ['id', 'name'];
    };
    ErrorCodeConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return ErrorCodeConfig;
}());
window["ErrorCodeConfig"] = ErrorCodeConfig;
var CDKeyRerwardConfig = /** @class */ (function () {
    function CDKeyRerwardConfig() {
    }
    CDKeyRerwardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'isUnify', 'reward', 'timeLimit', 'num'];
    };
    CDKeyRerwardConfig.prototype.types = function () {
        return ['number', 'string', 'boolean', 'string', 'number', 'number'];
    };
    return CDKeyRerwardConfig;
}());
window["CDKeyRerwardConfig"] = CDKeyRerwardConfig;
var TerrainSceneElementConfig = /** @class */ (function () {
    function TerrainSceneElementConfig() {
    }
    TerrainSceneElementConfig.prototype.attrs = function () {
        return ['id', 'type', 'name', 'lv', 'position', 'attribute', 'speed', 'isHistoricSite', 'lordTomeSkill', 'passiveSkill'];
    };
    TerrainSceneElementConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'string', 'number', 'boolean', 'string', 'string'];
    };
    return TerrainSceneElementConfig;
}());
window["TerrainSceneElementConfig"] = TerrainSceneElementConfig;
var TerrainConfig = /** @class */ (function () {
    function TerrainConfig() {
    }
    TerrainConfig.prototype.attrs = function () {
        return ['id', 'name', 'terrain', 'sound', 'offX', 'offY'];
    };
    TerrainConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'number'];
    };
    return TerrainConfig;
}());
window["TerrainConfig"] = TerrainConfig;
var DropLimitConfig = /** @class */ (function () {
    function DropLimitConfig() {
    }
    DropLimitConfig.prototype.attrs = function () {
        return ['id', 'itemId', 'dropNo', 'limitAmount', 'dropPeriod', 'startingTime', 'endTime'];
    };
    DropLimitConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return DropLimitConfig;
}());
window["DropLimitConfig"] = DropLimitConfig;
var DropConfig = /** @class */ (function () {
    function DropConfig() {
    }
    DropConfig.prototype.attrs = function () {
        return ['id', 'dropNo', 'rewards'];
    };
    DropConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return DropConfig;
}());
window["DropConfig"] = DropConfig;
var ItemConfig = /** @class */ (function () {
    function ItemConfig() {
    }
    ItemConfig.prototype.attrs = function () {
        return ['id', 'sourceIcon', 'type', 'mainType', 'subType', 'name', 'description', 'level', 'quality', 'upperLimit', 'overflowType', 'usable', 'sourcePage', 'sourcePrice', 'property', 'ifUnique', 'get', 'common'];
    };
    ItemConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string', 'boolean', 'string', 'string'];
    };
    return ItemConfig;
}());
window["ItemConfig"] = ItemConfig;
var ItemGiftExConfig = /** @class */ (function () {
    function ItemGiftExConfig() {
    }
    ItemGiftExConfig.prototype.attrs = function () {
        return ['id', 'type', 'rewards'];
    };
    ItemGiftExConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return ItemGiftExConfig;
}());
window["ItemGiftExConfig"] = ItemGiftExConfig;
var EquipmentConfig = /** @class */ (function () {
    function EquipmentConfig() {
    }
    EquipmentConfig.prototype.attrs = function () {
        return ['id', 'name', 'level', 'attribute', 'slotType', 'setId', 'fragmentId', 'fragmentCount', 'decomposition', 'cmbatpower'];
    };
    EquipmentConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'number', 'number', 'number', 'number', 'string', 'number'];
    };
    return EquipmentConfig;
}());
window["EquipmentConfig"] = EquipmentConfig;
var EquipmentSlotSumConfig = /** @class */ (function () {
    function EquipmentSlotSumConfig() {
    }
    EquipmentSlotSumConfig.prototype.attrs = function () {
        return ['id', 'sumLevel', 'type', 'attribute', 'text'];
    };
    EquipmentSlotSumConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'string'];
    };
    return EquipmentSlotSumConfig;
}());
window["EquipmentSlotSumConfig"] = EquipmentSlotSumConfig;
var EquipmentSlotStrengthenConfig = /** @class */ (function () {
    function EquipmentSlotStrengthenConfig() {
    }
    EquipmentSlotStrengthenConfig.prototype.attrs = function () {
        return ['id', 'level', 'slot', 'addAttribute', 'consume'];
    };
    EquipmentSlotStrengthenConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string'];
    };
    return EquipmentSlotStrengthenConfig;
}());
window["EquipmentSlotStrengthenConfig"] = EquipmentSlotStrengthenConfig;
var EquipmentSlotWroughtConfig = /** @class */ (function () {
    function EquipmentSlotWroughtConfig() {
    }
    EquipmentSlotWroughtConfig.prototype.attrs = function () {
        return ['id', 'level', 'slot', 'addAttribute', 'consume'];
    };
    EquipmentSlotWroughtConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string'];
    };
    return EquipmentSlotWroughtConfig;
}());
window["EquipmentSlotWroughtConfig"] = EquipmentSlotWroughtConfig;
var EquipmentSetConfig = /** @class */ (function () {
    function EquipmentSetConfig() {
    }
    EquipmentSetConfig.prototype.attrs = function () {
        return ['id', 'quality', 'name', 'level', 'suit', 'attribute2', 'attribute3', 'attribute4', 'text2', 'text3', 'text4'];
    };
    EquipmentSetConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'string', 'string', 'string', 'string', 'string', 'string', 'string'];
    };
    return EquipmentSetConfig;
}());
window["EquipmentSetConfig"] = EquipmentSetConfig;
var EquipmentSlotUpgradeConfig = /** @class */ (function () {
    function EquipmentSlotUpgradeConfig() {
    }
    EquipmentSlotUpgradeConfig.prototype.attrs = function () {
        return ['id', 'level', 'slot', 'consume'];
    };
    EquipmentSlotUpgradeConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return EquipmentSlotUpgradeConfig;
}());
window["EquipmentSlotUpgradeConfig"] = EquipmentSlotUpgradeConfig;
var FiefConstructionConfig = /** @class */ (function () {
    function FiefConstructionConfig() {
    }
    FiefConstructionConfig.prototype.attrs = function () {
        return ['id', 'reward', 'coefficient', 'consume', 'time', 'cdTime'];
    };
    FiefConstructionConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'number', 'number'];
    };
    return FiefConstructionConfig;
}());
window["FiefConstructionConfig"] = FiefConstructionConfig;
var IronProportionConfig = /** @class */ (function () {
    function IronProportionConfig() {
    }
    IronProportionConfig.prototype.attrs = function () {
        return ['id', 'cityLevelProportion', 'officialProportion'];
    };
    IronProportionConfig.prototype.types = function () {
        return ['number', 'number', 'number'];
    };
    return IronProportionConfig;
}());
window["IronProportionConfig"] = IronProportionConfig;
var GuildPositionConfig = /** @class */ (function () {
    function GuildPositionConfig() {
    }
    GuildPositionConfig.prototype.attrs = function () {
        return ['id', 'name', 'canAccept', 'canInvite', 'canAppoint', 'canKickOut', 'canChangeName', 'canChangeDeclaration', 'canReplenish', 'amount'];
    };
    GuildPositionConfig.prototype.types = function () {
        return ['number', 'string', 'boolean', 'boolean', 'boolean', 'boolean', 'boolean', 'boolean', 'boolean', 'number'];
    };
    return GuildPositionConfig;
}());
window["GuildPositionConfig"] = GuildPositionConfig;
var GuildShopConfig = /** @class */ (function () {
    function GuildShopConfig() {
    }
    GuildShopConfig.prototype.attrs = function () {
        return ['id', 'itemId', 'fund', 'score', 'stock'];
    };
    GuildShopConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'number'];
    };
    return GuildShopConfig;
}());
window["GuildShopConfig"] = GuildShopConfig;
var GuildConfig = /** @class */ (function () {
    function GuildConfig() {
    }
    GuildConfig.prototype.attrs = function () {
        return ['id', 'contribution', 'limit'];
    };
    GuildConfig.prototype.types = function () {
        return ['number', 'number', 'number'];
    };
    return GuildConfig;
}());
window["GuildConfig"] = GuildConfig;
var GuildHelpConfig = /** @class */ (function () {
    function GuildHelpConfig() {
    }
    GuildHelpConfig.prototype.attrs = function () {
        return ['id', 'percent'];
    };
    GuildHelpConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return GuildHelpConfig;
}());
window["GuildHelpConfig"] = GuildHelpConfig;
var GuildDonationConfig = /** @class */ (function () {
    function GuildDonationConfig() {
    }
    GuildDonationConfig.prototype.attrs = function () {
        return ['id', 'name', 'techID', 'type', 'expend1', 'expend2', 'gain', 'guild_exp'];
    };
    GuildDonationConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'string', 'string', 'number'];
    };
    return GuildDonationConfig;
}());
window["GuildDonationConfig"] = GuildDonationConfig;
var StarRewardConfig = /** @class */ (function () {
    function StarRewardConfig() {
    }
    StarRewardConfig.prototype.attrs = function () {
        return ['id', 'chapterId', 'star', 'starReward'];
    };
    StarRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return StarRewardConfig;
}());
window["StarRewardConfig"] = StarRewardConfig;
var StarConfig = /** @class */ (function () {
    function StarConfig() {
    }
    StarConfig.prototype.attrs = function () {
        return ['id', 'oneStarConfig', 'twoStarConfig', 'threeStarConfig', 'power'];
    };
    StarConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number'];
    };
    return StarConfig;
}());
window["StarConfig"] = StarConfig;
var ChapterIdConfig = /** @class */ (function () {
    function ChapterIdConfig() {
    }
    ChapterIdConfig.prototype.attrs = function () {
        return ['id', 'chapterName'];
    };
    ChapterIdConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return ChapterIdConfig;
}());
window["ChapterIdConfig"] = ChapterIdConfig;
var CheckPointCostConfig = /** @class */ (function () {
    function CheckPointCostConfig() {
    }
    CheckPointCostConfig.prototype.attrs = function () {
        return ['id', 'times', 'cost'];
    };
    CheckPointCostConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return CheckPointCostConfig;
}());
window["CheckPointCostConfig"] = CheckPointCostConfig;
var ChapterConfig = /** @class */ (function () {
    function ChapterConfig() {
    }
    ChapterConfig.prototype.attrs = function () {
        return ['id', 'title', 'difficultyType', 'resMapName', 'sweepAway', 'chapterId', 'level', 'resRoleName', 'stageType', 'terrainId', 'terrainSceneElement', 'npcTeamIds', 'checkPointPos', 'lockLv', 'generalInfos', 'firstReward', 'winReward', 'maxChallengeCount', 'starOne', 'starTwo', 'starThree', 'prevPointId', 'nextPointId', 'StrengthenId'];
    };
    ChapterConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'boolean', 'number', 'number', 'string', 'number', 'number', 'string', 'number', 'string', 'number', 'string', 'string', 'string', 'number', 'string', 'string', 'string', 'string', 'string', 'number'];
    };
    return ChapterConfig;
}());
window["ChapterConfig"] = ChapterConfig;
var FunctionConfig = /** @class */ (function () {
    function FunctionConfig() {
    }
    FunctionConfig.prototype.attrs = function () {
        return ['id', 'btnType', 'name', 'key', 'type', 'openLevel', 'openTaskId', 'visibleLevel', 'isRemind', 'content', 'text', 'turnPanel', 'sortPreview', 'isPreView'];
    };
    FunctionConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return FunctionConfig;
}());
window["FunctionConfig"] = FunctionConfig;
var FunctionBtnConfig = /** @class */ (function () {
    function FunctionBtnConfig() {
    }
    FunctionBtnConfig.prototype.attrs = function () {
        return ['id', 'iconName', 'pos', 'priority', 'scene'];
    };
    FunctionBtnConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number'];
    };
    return FunctionBtnConfig;
}());
window["FunctionBtnConfig"] = FunctionBtnConfig;
var SystemPreviewConfig = /** @class */ (function () {
    function SystemPreviewConfig() {
    }
    SystemPreviewConfig.prototype.attrs = function () {
        return ['id', 'name', 'icon', 'level', 'text', 'turnPanel'];
    };
    SystemPreviewConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'string', 'number'];
    };
    return SystemPreviewConfig;
}());
window["SystemPreviewConfig"] = SystemPreviewConfig;
var CountryConfig = /** @class */ (function () {
    function CountryConfig() {
    }
    CountryConfig.prototype.attrs = function () {
        return ['id', 'name'];
    };
    CountryConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return CountryConfig;
}());
window["CountryConfig"] = CountryConfig;
var CountryTaskConfig = /** @class */ (function () {
    function CountryTaskConfig() {
    }
    CountryTaskConfig.prototype.attrs = function () {
        return ['id', 'taskType', 'name', 'condition', 'detail', 'errandReward', 'taskGoal', 'turnPanel'];
    };
    CountryTaskConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'string', 'number', 'number'];
    };
    return CountryTaskConfig;
}());
window["CountryTaskConfig"] = CountryTaskConfig;
var JobInfoConfig = /** @class */ (function () {
    function JobInfoConfig() {
    }
    JobInfoConfig.prototype.attrs = function () {
        return ['id', 'power', 'intelligence', 'leadership', 'armyHp', 'atk', 'def', 'hp', 'attribute', 'mobile', 'speak', 'technology', 'buildingcd', 'resource', 'soldiercd', 'jobassignment', 'allocation', 'editbulletin', 'description', 'condition'];
    };
    JobInfoConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return JobInfoConfig;
}());
window["JobInfoConfig"] = JobInfoConfig;
var CountryTaskConditionConfig = /** @class */ (function () {
    function CountryTaskConditionConfig() {
    }
    CountryTaskConditionConfig.prototype.attrs = function () {
        return ['id', 'condition'];
    };
    CountryTaskConditionConfig.prototype.types = function () {
        return ['number', 'string'];
    };
    return CountryTaskConditionConfig;
}());
window["CountryTaskConditionConfig"] = CountryTaskConditionConfig;
var JobConfig = /** @class */ (function () {
    function JobConfig() {
    }
    JobConfig.prototype.attrs = function () {
        return ['id', 'name', 'allocation', 'effect', 'sort', 'condition', 'autoAllocation', 'salary'];
    };
    JobConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'number', 'string'];
    };
    return JobConfig;
}());
window["JobConfig"] = JobConfig;
var ArmyStrengthenConfig = /** @class */ (function () {
    function ArmyStrengthenConfig() {
    }
    ArmyStrengthenConfig.prototype.attrs = function () {
        return ['id', 'monsterLv', 'monsterStar', 'monsterQuality'];
    };
    ArmyStrengthenConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number'];
    };
    return ArmyStrengthenConfig;
}());
window["ArmyStrengthenConfig"] = ArmyStrengthenConfig;
var GuajiRouteConfig = /** @class */ (function () {
    function GuajiRouteConfig() {
    }
    GuajiRouteConfig.prototype.attrs = function () {
        return ['id', 'speed', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15', 'step16', 'step17', 'step18', 'step19', 'step20', 'step21', 'step22', 'step23', 'step24'];
    };
    GuajiRouteConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string'];
    };
    return GuajiRouteConfig;
}());
window["GuajiRouteConfig"] = GuajiRouteConfig;
var ActivityOfCountConfig = /** @class */ (function () {
    function ActivityOfCountConfig() {
    }
    ActivityOfCountConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'name', 'Type', 'itemId', 'num', 'reward', 'rewardType', 'receiveCount'];
    };
    ActivityOfCountConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'string', 'number', 'string', 'number', 'number'];
    };
    return ActivityOfCountConfig;
}());
window["ActivityOfCountConfig"] = ActivityOfCountConfig;
var ActivityTaskConfig = /** @class */ (function () {
    function ActivityTaskConfig() {
    }
    ActivityTaskConfig.prototype.attrs = function () {
        return ['id', 'title', 'type', 'activityId', 'countryId', 'taskType', 'sort', 'guideTask', 'rewardOrderType', 'frontTaskID', 'frontLv', 'frontBuild', 'frontModuleOpen', 'rewardDay'];
    };
    ActivityTaskConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'number', 'number'];
    };
    return ActivityTaskConfig;
}());
window["ActivityTaskConfig"] = ActivityTaskConfig;
var ActivityTaskConditionConfig = /** @class */ (function () {
    function ActivityTaskConditionConfig() {
    }
    ActivityTaskConditionConfig.prototype.attrs = function () {
        return ['id', 'taskId', 'order', 'activityId', 'title', 'paramKey', 'paramValue', 'rewardActivity', 'rewardItem', 'turnPanel'];
    };
    ActivityTaskConditionConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'number', 'string', 'IItemInfo[]', 'number'];
    };
    return ActivityTaskConditionConfig;
}());
window["ActivityTaskConditionConfig"] = ActivityTaskConditionConfig;
var ActivitySinglePayRewardConfig = /** @class */ (function () {
    function ActivitySinglePayRewardConfig() {
    }
    ActivitySinglePayRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'level', 'reward', 'desc'];
    };
    ActivitySinglePayRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]', 'string'];
    };
    return ActivitySinglePayRewardConfig;
}());
window["ActivitySinglePayRewardConfig"] = ActivitySinglePayRewardConfig;
var ActivityWeekMonthCardConfig = /** @class */ (function () {
    function ActivityWeekMonthCardConfig() {
    }
    ActivityWeekMonthCardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'cardType', 'price', 'reward', 'rewardCount', 'desc'];
    };
    ActivityWeekMonthCardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'string'];
    };
    return ActivityWeekMonthCardConfig;
}());
window["ActivityWeekMonthCardConfig"] = ActivityWeekMonthCardConfig;
var PrizeConfig = /** @class */ (function () {
    function PrizeConfig() {
    }
    PrizeConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'award', 'rate', 'lucky', 'reset'];
    };
    PrizeConfig.prototype.types = function () {
        return ['number', 'number', 'IItemInfo', 'number', 'number', 'number'];
    };
    return PrizeConfig;
}());
window["PrizeConfig"] = PrizeConfig;
var PrizeAccumulateConfig = /** @class */ (function () {
    function PrizeAccumulateConfig() {
    }
    PrizeAccumulateConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'award', 'accumulate'];
    };
    PrizeAccumulateConfig.prototype.types = function () {
        return ['number', 'number', 'IItemInfo[]', 'number'];
    };
    return PrizeAccumulateConfig;
}());
window["PrizeAccumulateConfig"] = PrizeAccumulateConfig;
var ActivityGrowthFundRewardConfig = /** @class */ (function () {
    function ActivityGrowthFundRewardConfig() {
    }
    ActivityGrowthFundRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'playerLevel', 'reward'];
    };
    ActivityGrowthFundRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]'];
    };
    return ActivityGrowthFundRewardConfig;
}());
window["ActivityGrowthFundRewardConfig"] = ActivityGrowthFundRewardConfig;
var ActivityPowerRankRewardConfig = /** @class */ (function () {
    function ActivityPowerRankRewardConfig() {
    }
    ActivityPowerRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'reward'];
    };
    ActivityPowerRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'IItemInfo[]'];
    };
    return ActivityPowerRankRewardConfig;
}());
window["ActivityPowerRankRewardConfig"] = ActivityPowerRankRewardConfig;
var ActivityApkRankRewardConfig = /** @class */ (function () {
    function ActivityApkRankRewardConfig() {
    }
    ActivityApkRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'ranks', 'reward'];
    };
    ActivityApkRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'IItemInfo[]'];
    };
    return ActivityApkRankRewardConfig;
}());
window["ActivityApkRankRewardConfig"] = ActivityApkRankRewardConfig;
var ActivityGuildForceRankRewardConfig = /** @class */ (function () {
    function ActivityGuildForceRankRewardConfig() {
    }
    ActivityGuildForceRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'ranks', 'reward'];
    };
    ActivityGuildForceRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'IItemInfo[]'];
    };
    return ActivityGuildForceRankRewardConfig;
}());
window["ActivityGuildForceRankRewardConfig"] = ActivityGuildForceRankRewardConfig;
var ActivityCountryCitysRankRewardConfig = /** @class */ (function () {
    function ActivityCountryCitysRankRewardConfig() {
    }
    ActivityCountryCitysRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'ranks', 'reward'];
    };
    ActivityCountryCitysRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'IItemInfo[]'];
    };
    return ActivityCountryCitysRankRewardConfig;
}());
window["ActivityCountryCitysRankRewardConfig"] = ActivityCountryCitysRankRewardConfig;
var CostKeepsakeRewardConfig = /** @class */ (function () {
    function CostKeepsakeRewardConfig() {
    }
    CostKeepsakeRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'keepsakeCount', 'reward'];
    };
    CostKeepsakeRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]'];
    };
    return CostKeepsakeRewardConfig;
}());
window["CostKeepsakeRewardConfig"] = CostKeepsakeRewardConfig;
var ActivityNewGeneralRewardConfig = /** @class */ (function () {
    function ActivityNewGeneralRewardConfig() {
    }
    ActivityNewGeneralRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'requiredRward', 'optionalReward', 'visitCost', 'visitCost10', 'generalId', 'titleStr', 'titleStr1', 'videoUrl', 'icon'];
    };
    ActivityNewGeneralRewardConfig.prototype.types = function () {
        return ['number', 'number', 'IItemInfo[]', 'IItemInfo[]', 'IItemInfo[]', 'IItemInfo[]', 'number', 'string', 'string', 'string', 'string'];
    };
    return ActivityNewGeneralRewardConfig;
}());
window["ActivityNewGeneralRewardConfig"] = ActivityNewGeneralRewardConfig;
var ActivityLoginDaysRewardConfig = /** @class */ (function () {
    function ActivityLoginDaysRewardConfig() {
    }
    ActivityLoginDaysRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'loginDays', 'reward', 'extralRewardCondition', 'rewardType'];
    };
    ActivityLoginDaysRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]', 'number', 'number'];
    };
    return ActivityLoginDaysRewardConfig;
}());
window["ActivityLoginDaysRewardConfig"] = ActivityLoginDaysRewardConfig;
var ActivityConsumeGiftRewardConfig = /** @class */ (function () {
    function ActivityConsumeGiftRewardConfig() {
    }
    ActivityConsumeGiftRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'level', 'reward', 'desc'];
    };
    ActivityConsumeGiftRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]', 'string'];
    };
    return ActivityConsumeGiftRewardConfig;
}());
window["ActivityConsumeGiftRewardConfig"] = ActivityConsumeGiftRewardConfig;
var ActivityLevelRankRewardConfig = /** @class */ (function () {
    function ActivityLevelRankRewardConfig() {
    }
    ActivityLevelRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'reward'];
    };
    ActivityLevelRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'IItemInfo[]'];
    };
    return ActivityLevelRankRewardConfig;
}());
window["ActivityLevelRankRewardConfig"] = ActivityLevelRankRewardConfig;
var ActivityTotalPayRewardConfig = /** @class */ (function () {
    function ActivityTotalPayRewardConfig() {
    }
    ActivityTotalPayRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'level', 'reward', 'desc'];
    };
    ActivityTotalPayRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]', 'string'];
    };
    return ActivityTotalPayRewardConfig;
}());
window["ActivityTotalPayRewardConfig"] = ActivityTotalPayRewardConfig;
var TreasureBowlLevelConfig = /** @class */ (function () {
    function TreasureBowlLevelConfig() {
    }
    TreasureBowlLevelConfig.prototype.attrs = function () {
        return ['id', 'count', 'activityId', 'itemType', 'min', 'max'];
    };
    TreasureBowlLevelConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number'];
    };
    return TreasureBowlLevelConfig;
}());
window["TreasureBowlLevelConfig"] = TreasureBowlLevelConfig;
var TreasureBowlConfig = /** @class */ (function () {
    function TreasureBowlConfig() {
    }
    TreasureBowlConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'totalPayActivityId', 'perPay', 'perCount'];
    };
    TreasureBowlConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number'];
    };
    return TreasureBowlConfig;
}());
window["TreasureBowlConfig"] = TreasureBowlConfig;
var ActivityFirstPayRewardConfig = /** @class */ (function () {
    function ActivityFirstPayRewardConfig() {
    }
    ActivityFirstPayRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'level', 'reward', 'desc', 'nextId', 'price'];
    };
    ActivityFirstPayRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]', 'string', 'number', 'number'];
    };
    return ActivityFirstPayRewardConfig;
}());
window["ActivityFirstPayRewardConfig"] = ActivityFirstPayRewardConfig;
var GuildTechnologyConfig = /** @class */ (function () {
    function GuildTechnologyConfig() {
    }
    GuildTechnologyConfig.prototype.attrs = function () {
        return ['id', 'name', 'icon', 'describe', 'techID', 'nexttechID', 'type', 'level', 'attributeID', 'exp', 'legionlevel', 'generalType'];
    };
    GuildTechnologyConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number'];
    };
    return GuildTechnologyConfig;
}());
window["GuildTechnologyConfig"] = GuildTechnologyConfig;
var QuickenConfig = /** @class */ (function () {
    function QuickenConfig() {
    }
    QuickenConfig.prototype.attrs = function () {
        return ['id', 'type', 'name', 'reduceTime', 'reduceTimerate'];
    };
    QuickenConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number'];
    };
    return QuickenConfig;
}());
window["QuickenConfig"] = QuickenConfig;
var ShowSkillEffectConfig = /** @class */ (function () {
    function ShowSkillEffectConfig() {
    }
    ShowSkillEffectConfig.prototype.attrs = function () {
        return ['id', 'animation', 'actionName', 'showType', 'startAnimation', 'playTime', 'beAckEffect', 'hurtStageNum', 'scale', 'effectSound'];
    };
    ShowSkillEffectConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'string', 'number', 'number', 'number', 'number', 'number'];
    };
    return ShowSkillEffectConfig;
}());
window["ShowSkillEffectConfig"] = ShowSkillEffectConfig;
var BuffEffectConfig = /** @class */ (function () {
    function BuffEffectConfig() {
    }
    BuffEffectConfig.prototype.attrs = function () {
        return ['id', 'name', 'controlType', 'key', 'paramType'];
    };
    BuffEffectConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'number'];
    };
    return BuffEffectConfig;
}());
window["BuffEffectConfig"] = BuffEffectConfig;
var BuffConfig = /** @class */ (function () {
    function BuffConfig() {
    }
    BuffConfig.prototype.attrs = function () {
        return ['id', 'texiao', 'describe'];
    };
    BuffConfig.prototype.types = function () {
        return ['number', 'number', 'number'];
    };
    return BuffConfig;
}());
window["BuffConfig"] = BuffConfig;
var BuffTargetTypeConfig = /** @class */ (function () {
    function BuffTargetTypeConfig() {
    }
    BuffTargetTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'isScenesBuff'];
    };
    BuffTargetTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'boolean'];
    };
    return BuffTargetTypeConfig;
}());
window["BuffTargetTypeConfig"] = BuffTargetTypeConfig;
var SkillAttachGroupConfig = /** @class */ (function () {
    function SkillAttachGroupConfig() {
    }
    SkillAttachGroupConfig.prototype.attrs = function () {
        return ['id', 'group', 'buffId'];
    };
    SkillAttachGroupConfig.prototype.types = function () {
        return ['number', 'string', 'number'];
    };
    return SkillAttachGroupConfig;
}());
window["SkillAttachGroupConfig"] = SkillAttachGroupConfig;
var BuffPassiveConditionTypeConfig = /** @class */ (function () {
    function BuffPassiveConditionTypeConfig() {
    }
    BuffPassiveConditionTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key'];
    };
    BuffPassiveConditionTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string'];
    };
    return BuffPassiveConditionTypeConfig;
}());
window["BuffPassiveConditionTypeConfig"] = BuffPassiveConditionTypeConfig;
var ZhaoHuanWuConfig = /** @class */ (function () {
    function ZhaoHuanWuConfig() {
    }
    ZhaoHuanWuConfig.prototype.attrs = function () {
        return ['id', 'name', 'isCollide', 'resId', 'resType'];
    };
    ZhaoHuanWuConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'number'];
    };
    return ZhaoHuanWuConfig;
}());
window["ZhaoHuanWuConfig"] = ZhaoHuanWuConfig;
var SkillAttachConfig = /** @class */ (function () {
    function SkillAttachConfig() {
    }
    SkillAttachConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'buffId', 'duration', 'ICON'];
    };
    SkillAttachConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number', 'string'];
    };
    return SkillAttachConfig;
}());
window["SkillAttachConfig"] = SkillAttachConfig;
var SkillWarTypeConfig = /** @class */ (function () {
    function SkillWarTypeConfig() {
    }
    SkillWarTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key'];
    };
    SkillWarTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string'];
    };
    return SkillWarTypeConfig;
}());
window["SkillWarTypeConfig"] = SkillWarTypeConfig;
var SkillConfig = /** @class */ (function () {
    function SkillConfig() {
    }
    SkillConfig.prototype.attrs = function () {
        return ['id', 'name', 'skillType', 'job', 'loop', 'indexChild', 'interrupt', 'cooling', 'readyTime', 'readyType', 'pauseTime', 'actRangeType', 'beAttacked', 'groupEffect', 'param', 'commAttToPassive', 'anger', 'injuryType', 'attackAngert', 'moveDistance', 'automaticDistance', 'distance', 'icon', 'skillNameImage', 'bigSkillNameImage', 'skillEffectId', 'bulletId', 'openTpye', 'openParam', 'bufword', 'type', 'effectTargetCellScope', 'talk'];
    };
    SkillConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string', 'string', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'number', 'number', 'number', 'string', 'string', 'number', 'number', 'string'];
    };
    return SkillConfig;
}());
window["SkillConfig"] = SkillConfig;
var SkillLvConfig = /** @class */ (function () {
    function SkillLvConfig() {
    }
    SkillLvConfig.prototype.attrs = function () {
        return ['id', 'skillId', 'skillLv', 'upLimit', 'upConsume', 'force', 'describe'];
    };
    SkillLvConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string', 'number', 'string'];
    };
    return SkillLvConfig;
}());
window["SkillLvConfig"] = SkillLvConfig;
var GenerateCoinConfig = /** @class */ (function () {
    function GenerateCoinConfig() {
    }
    GenerateCoinConfig.prototype.attrs = function () {
        return ['id', 'gold', 'money'];
    };
    GenerateCoinConfig.prototype.types = function () {
        return ['number', 'number', 'number'];
    };
    return GenerateCoinConfig;
}());
window["GenerateCoinConfig"] = GenerateCoinConfig;
var ExtraCoinLevelConfig = /** @class */ (function () {
    function ExtraCoinLevelConfig() {
    }
    ExtraCoinLevelConfig.prototype.attrs = function () {
        return ['id', 'bonusMoney', 'bonusGoldMax', 'coldTime'];
    };
    ExtraCoinLevelConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number'];
    };
    return ExtraCoinLevelConfig;
}());
window["ExtraCoinLevelConfig"] = ExtraCoinLevelConfig;
var WarningConfig = /** @class */ (function () {
    function WarningConfig() {
    }
    WarningConfig.prototype.attrs = function () {
        return ['id', 'Types', 'iconID', 'content'];
    };
    WarningConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number'];
    };
    return WarningConfig;
}());
window["WarningConfig"] = WarningConfig;
var LotteryConfig = /** @class */ (function () {
    function LotteryConfig() {
    }
    LotteryConfig.prototype.attrs = function () {
        return ['id', 'rewardType', 'item', 'showItem', 'amount', 'extraAmount', 'rate', 'extraRate', 'expBook'];
    };
    LotteryConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'string'];
    };
    return LotteryConfig;
}());
window["LotteryConfig"] = LotteryConfig;
var LotteryRedHeroConfig = /** @class */ (function () {
    function LotteryRedHeroConfig() {
    }
    LotteryRedHeroConfig.prototype.attrs = function () {
        return ['id', 'rewardType', 'item', 'showItem', 'amount', 'extraAmount', 'rate', 'extraRate', 'expBook'];
    };
    LotteryRedHeroConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string'];
    };
    return LotteryRedHeroConfig;
}());
window["LotteryRedHeroConfig"] = LotteryRedHeroConfig;
var TechnologyLevelConfig = /** @class */ (function () {
    function TechnologyLevelConfig() {
    }
    TechnologyLevelConfig.prototype.attrs = function () {
        return ['id', 'techId', 'level', 'power', 'Desc', 'effect', 'duration', 'consume', 'limitTechs', 'limitLv'];
    };
    TechnologyLevelConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'string', 'number', 'string', 'string', 'number'];
    };
    return TechnologyLevelConfig;
}());
window["TechnologyLevelConfig"] = TechnologyLevelConfig;
var TechnologyEffectConfig = /** @class */ (function () {
    function TechnologyEffectConfig() {
    }
    TechnologyEffectConfig.prototype.attrs = function () {
        return ['id', 'effectDesc', 'type', 'subType', 'valType'];
    };
    TechnologyEffectConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number'];
    };
    return TechnologyEffectConfig;
}());
window["TechnologyEffectConfig"] = TechnologyEffectConfig;
var TechnologyConfig = /** @class */ (function () {
    function TechnologyConfig() {
    }
    TechnologyConfig.prototype.attrs = function () {
        return ['id', 'type', 'row', 'col', 'icon', 'name', 'maxLevel', 'openDesc'];
    };
    TechnologyConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'number', 'number'];
    };
    return TechnologyConfig;
}());
window["TechnologyConfig"] = TechnologyConfig;
var CrossServerRewardConfig = /** @class */ (function () {
    function CrossServerRewardConfig() {
    }
    CrossServerRewardConfig.prototype.attrs = function () {
        return ['id', 'value', 'type', 'reward'];
    };
    CrossServerRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'IItemInfo[]'];
    };
    return CrossServerRewardConfig;
}());
window["CrossServerRewardConfig"] = CrossServerRewardConfig;
var CrossServerConstConfig = /** @class */ (function () {
    function CrossServerConstConfig() {
    }
    CrossServerConstConfig.prototype.attrs = function () {
        return ['id', 'key', 'value', 'type', 'name'];
    };
    CrossServerConstConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'string', 'number'];
    };
    return CrossServerConstConfig;
}());
window["CrossServerConstConfig"] = CrossServerConstConfig;
var CrossServerAreaConfig = /** @class */ (function () {
    function CrossServerAreaConfig() {
    }
    CrossServerAreaConfig.prototype.attrs = function () {
        return ['id', 'name', 'battleMap', 'garrison'];
    };
    CrossServerAreaConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return CrossServerAreaConfig;
}());
window["CrossServerAreaConfig"] = CrossServerAreaConfig;
var CrossServerCityConfig = /** @class */ (function () {
    function CrossServerCityConfig() {
    }
    CrossServerCityConfig.prototype.attrs = function () {
        return ['id', 'cityName', 'cityType', 'warAreaList', 'cityWallList', 'icon'];
    };
    CrossServerCityConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'string', 'string', 'string'];
    };
    return CrossServerCityConfig;
}());
window["CrossServerCityConfig"] = CrossServerCityConfig;
var HistoryWarStarConfig = /** @class */ (function () {
    function HistoryWarStarConfig() {
    }
    HistoryWarStarConfig.prototype.attrs = function () {
        return ['id', 'oneStarConfig', 'twoStarConfig', 'threeStarConfig', 'power'];
    };
    HistoryWarStarConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number'];
    };
    return HistoryWarStarConfig;
}());
window["HistoryWarStarConfig"] = HistoryWarStarConfig;
var HistoryWarChapterNameConfig = /** @class */ (function () {
    function HistoryWarChapterNameConfig() {
    }
    HistoryWarChapterNameConfig.prototype.attrs = function () {
        return ['id', 'chapterName'];
    };
    HistoryWarChapterNameConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return HistoryWarChapterNameConfig;
}());
window["HistoryWarChapterNameConfig"] = HistoryWarChapterNameConfig;
var HistoryWarStarRewardConfig = /** @class */ (function () {
    function HistoryWarStarRewardConfig() {
    }
    HistoryWarStarRewardConfig.prototype.attrs = function () {
        return ['id', 'chapterId', 'star', 'starReward'];
    };
    HistoryWarStarRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return HistoryWarStarRewardConfig;
}());
window["HistoryWarStarRewardConfig"] = HistoryWarStarRewardConfig;
var HistoryWarConfig = /** @class */ (function () {
    function HistoryWarConfig() {
    }
    HistoryWarConfig.prototype.attrs = function () {
        return ['id', 'difficultyType', 'resMapName', 'chapterId', 'level', 'resRoleName', 'terrainId', 'terrainSceneElement', 'npcTeamIds', 'checkPointPos', 'lockLv', 'nationTypeLimit', 'generalOccupationLimit', 'generalInfos', 'firstReward', 'winReward', 'maxChallengeCount', 'starTwo', 'starThree', 'prevPointId', 'nextPointId'];
    };
    HistoryWarConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'string', 'number', 'string', 'number', 'string', 'number', 'string', 'string', 'string', 'string', 'string', 'number', 'string', 'string', 'number', 'number'];
    };
    return HistoryWarConfig;
}());
window["HistoryWarConfig"] = HistoryWarConfig;
var ArenaConfig = /** @class */ (function () {
    function ArenaConfig() {
    }
    ArenaConfig.prototype.attrs = function () {
        return ['id', 'beforeId', 'terrainId', 'checkPointId', 'openLevel', 'background', 'isBox', 'power', 'firstReward', 'reward'];
    };
    ArenaConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'boolean', 'number', 'string', 'string'];
    };
    return ArenaConfig;
}());
window["ArenaConfig"] = ArenaConfig;
var WorshipRewardConfig = /** @class */ (function () {
    function WorshipRewardConfig() {
    }
    WorshipRewardConfig.prototype.attrs = function () {
        return ['id', 'worshipType', 'rank', 'reward', 'rankReward'];
    };
    WorshipRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string'];
    };
    return WorshipRewardConfig;
}());
window["WorshipRewardConfig"] = WorshipRewardConfig;
var TurnPanelConfig = /** @class */ (function () {
    function TurnPanelConfig() {
    }
    TurnPanelConfig.prototype.attrs = function () {
        return ['id', 'image', 'description', 'limit', 'turnType', 'paramId', 'param', 'uiRoot', 'uiPath'];
    };
    TurnPanelConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'string', 'number', 'number', 'string', 'string', 'string'];
    };
    return TurnPanelConfig;
}());
window["TurnPanelConfig"] = TurnPanelConfig;
var ModuleUseCountConfig = /** @class */ (function () {
    function ModuleUseCountConfig() {
    }
    ModuleUseCountConfig.prototype.attrs = function () {
        return ['id', 'key', 'name', 'resetType', 'useCount', 'reTime', 'buyMaxNum', 'buildId', 'buildLvCount', 'goldConsume'];
    };
    ModuleUseCountConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number', 'string', 'number', 'number', 'string', 'string'];
    };
    return ModuleUseCountConfig;
}());
window["ModuleUseCountConfig"] = ModuleUseCountConfig;
var NoticeConfig = /** @class */ (function () {
    function NoticeConfig() {
    }
    NoticeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'msgType', 'msg'];
    };
    NoticeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number'];
    };
    return NoticeConfig;
}());
window["NoticeConfig"] = NoticeConfig;
var SignUpConfig = /** @class */ (function () {
    function SignUpConfig() {
    }
    SignUpConfig.prototype.attrs = function () {
        return ['id', 'doubling', 'vip', 'reward', 'extraReward', 'month', 'day'];
    };
    SignUpConfig.prototype.types = function () {
        return ['number', 'boolean', 'number', 'string', 'string', 'number', 'number'];
    };
    return SignUpConfig;
}());
window["SignUpConfig"] = SignUpConfig;
var TaskConditionConfig = /** @class */ (function () {
    function TaskConditionConfig() {
    }
    TaskConditionConfig.prototype.attrs = function () {
        return ['id', 'taskId', 'order', 'title', 'paramKey', 'paramValue', 'rewardActivity', 'rewardItem', 'turnPanel'];
    };
    TaskConditionConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'number', 'number', 'string', 'IItemInfo[]', 'number'];
    };
    return TaskConditionConfig;
}());
window["TaskConditionConfig"] = TaskConditionConfig;
var LivesRewardConfig = /** @class */ (function () {
    function LivesRewardConfig() {
    }
    LivesRewardConfig.prototype.attrs = function () {
        return ['id', 'liveness', 'Reward'];
    };
    LivesRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return LivesRewardConfig;
}());
window["LivesRewardConfig"] = LivesRewardConfig;
var TaskConfig = /** @class */ (function () {
    function TaskConfig() {
    }
    TaskConfig.prototype.attrs = function () {
        return ['id', 'title', 'type', 'activityId', 'countryId', 'taskType', 'sort', 'guideTask', 'rewardOrderType', 'frontTaskID', 'frontLv', 'frontBuild', 'frontModuleOpen', 'rewardDay'];
    };
    TaskConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'number', 'number'];
    };
    return TaskConfig;
}());
window["TaskConfig"] = TaskConfig;
var EventDataConfig = /** @class */ (function () {
    function EventDataConfig() {
    }
    EventDataConfig.prototype.attrs = function () {
        return ['id', 'name', 'reward', 'affairType', 'subAffairType', 'collectionTime', 'lv', 'npcId', 'image', 'colour', 'recommendForce'];
    };
    EventDataConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number'];
    };
    return EventDataConfig;
}());
window["EventDataConfig"] = EventDataConfig;
var EventCoordinatesConfig = /** @class */ (function () {
    function EventCoordinatesConfig() {
    }
    EventCoordinatesConfig.prototype.attrs = function () {
        return ['id', 'name', 'cityId', 'posX', 'posY', 'moveTime', 'frequency'];
    };
    EventCoordinatesConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return EventCoordinatesConfig;
}());
window["EventCoordinatesConfig"] = EventCoordinatesConfig;
var WorldWayConfig = /** @class */ (function () {
    function WorldWayConfig() {
    }
    WorldWayConfig.prototype.attrs = function () {
        return ['id', 'start', 'end', 'way'];
    };
    WorldWayConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return WorldWayConfig;
}());
window["WorldWayConfig"] = WorldWayConfig;
var WorldMapConfig = /** @class */ (function () {
    function WorldMapConfig() {
    }
    WorldMapConfig.prototype.attrs = function () {
        return ['id', 'name', 'countryId', 'mapId', 'posX', 'posY', 'ThumbnailX', 'ThumbnailY', 'influenceX', 'influenceY', 'mapX', 'mapY', 'icon', 'type', 'mapCity', 'battleMap', 'terrain', 'aroundCityId', 'level', 'citySkill', 'time', 'first', 'AtackCityLv', 'initCityLv', 'firstinfoicon', 'firstreward', 'firstrewardRank1', 'firstrewardRank2', 'reward', 'rewardicon', 'description', 'Ruledescription', 'banner', 'forbidattack', 'VisibleXY', 'unlockReward', 'OpenTheTask'];
    };
    WorldMapConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'string', 'number', 'string', 'string', 'number', 'number', 'number', 'string', 'string', 'string', 'string', 'string', 'string', 'number', 'number', 'number', 'string', 'string', 'string', 'number'];
    };
    return WorldMapConfig;
}());
window["WorldMapConfig"] = WorldMapConfig;
var CityMadeConfig = /** @class */ (function () {
    function CityMadeConfig() {
    }
    CityMadeConfig.prototype.attrs = function () {
        return ['id', 'cityId', 'level', 'sumExp', 'costs', 'time', 'cityRewardType', 'cityReward', 'addExp', 'addMilltory', 'addGeneralExp'];
    };
    CityMadeConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'IItemInfo[]', 'number', 'number', 'number', 'number', 'IItemInfo', 'IItemInfo'];
    };
    return CityMadeConfig;
}());
window["CityMadeConfig"] = CityMadeConfig;
var CityRewardTypeConfig = /** @class */ (function () {
    function CityRewardTypeConfig() {
    }
    CityRewardTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'icon', 'nameBuff'];
    };
    CityRewardTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'string', 'string'];
    };
    return CityRewardTypeConfig;
}());
window["CityRewardTypeConfig"] = CityRewardTypeConfig;
var WorldMapUnlockTaskConfig = /** @class */ (function () {
    function WorldMapUnlockTaskConfig() {
    }
    WorldMapUnlockTaskConfig.prototype.attrs = function () {
        return ['id', 'level', 'weight', 'type', 'consume', 'npcTeamId', 'UnlockText1', 'UnlockText2', 'UnlockText3'];
    };
    WorldMapUnlockTaskConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'number'];
    };
    return WorldMapUnlockTaskConfig;
}());
window["WorldMapUnlockTaskConfig"] = WorldMapUnlockTaskConfig;
var AttributeConfig = /** @class */ (function () {
    function AttributeConfig() {
    }
    AttributeConfig.prototype.attrs = function () {
        return ['id', 'key', 'name', 'attributeType', 'type'];
    };
    AttributeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number'];
    };
    return AttributeConfig;
}());
window["AttributeConfig"] = AttributeConfig;
var EffectConfig = /** @class */ (function () {
    function EffectConfig() {
    }
    EffectConfig.prototype.attrs = function () {
        return ['id', 'description', 'effectName', 'effectFont', 'effectFile', 'isRepeat', 'playTime', 'scale', 'offsetX', 'offsetY', 'anchorOffsetX', 'anchorOffsetY', 'spMark', 'tween', 'fps', 'keyFrame', 'testUIShow'];
    };
    EffectConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return EffectConfig;
}());
window["EffectConfig"] = EffectConfig;
var GeneralConfig = /** @class */ (function () {
    function GeneralConfig() {
    }
    GeneralConfig.prototype.attrs = function () {
        return ['id', 'name', 'role', 'nationType', 'useable', 'generalDescription', 'skillDescription', 'ourModelCode', 'warPosition', 'warPositionDes', 'generalType', 'generalOccupation', 'generalOccupationDes', 'armyType', 'armyId', 'lv', 'starLevel', 'qualityLevel', 'collection', 'fight', 'attribute', 'speed', 'lordTomeSkill', 'angerSkill', 'passiveSkill', 'length', 'width', 'itemViewId', 'itemId', 'soul', 'sound', 'skillSound', 'sex', 'rebirthCosts'];
    };
    GeneralConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'number', 'string', 'string', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string'];
    };
    return GeneralConfig;
}());
window["GeneralConfig"] = GeneralConfig;
var GeneralRebirthConfig = /** @class */ (function () {
    function GeneralRebirthConfig() {
    }
    GeneralRebirthConfig.prototype.attrs = function () {
        return ['id', 'transform'];
    };
    GeneralRebirthConfig.prototype.types = function () {
        return ['number', 'string'];
    };
    return GeneralRebirthConfig;
}());
window["GeneralRebirthConfig"] = GeneralRebirthConfig;
var GeneralLevelConfig = /** @class */ (function () {
    function GeneralLevelConfig() {
    }
    GeneralLevelConfig.prototype.attrs = function () {
        return ['id', 'level', 'exp', 'isUpgrade', 'consume', 'playerLevel', 'attribute'];
    };
    GeneralLevelConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'string'];
    };
    return GeneralLevelConfig;
}());
window["GeneralLevelConfig"] = GeneralLevelConfig;
var GeneralStarConfig = /** @class */ (function () {
    function GeneralStarConfig() {
    }
    GeneralStarConfig.prototype.attrs = function () {
        return ['id', 'star', 'starlevel', 'starType', 'soulNum', 'qualityLevel', 'attribute'];
    };
    GeneralStarConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'string'];
    };
    return GeneralStarConfig;
}());
window["GeneralStarConfig"] = GeneralStarConfig;
var ExpBookConfig = /** @class */ (function () {
    function ExpBookConfig() {
    }
    ExpBookConfig.prototype.attrs = function () {
        return ['id', 'exp'];
    };
    ExpBookConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return ExpBookConfig;
}());
window["ExpBookConfig"] = ExpBookConfig;
var GeneralShowConfig = /** @class */ (function () {
    function GeneralShowConfig() {
    }
    GeneralShowConfig.prototype.attrs = function () {
        return ['id', 'AttriId'];
    };
    GeneralShowConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return GeneralShowConfig;
}());
window["GeneralShowConfig"] = GeneralShowConfig;
var PlayerHeadConfig = /** @class */ (function () {
    function PlayerHeadConfig() {
    }
    PlayerHeadConfig.prototype.attrs = function () {
        return ['id', 'type', 'name', 'description'];
    };
    PlayerHeadConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return PlayerHeadConfig;
}());
window["PlayerHeadConfig"] = PlayerHeadConfig;
var PlayerExpConfig = /** @class */ (function () {
    function PlayerExpConfig() {
    }
    PlayerExpConfig.prototype.attrs = function () {
        return ['id', 'playerLevel', 'playerExp'];
    };
    PlayerExpConfig.prototype.types = function () {
        return ['number', 'number', 'number'];
    };
    return PlayerExpConfig;
}());
window["PlayerExpConfig"] = PlayerExpConfig;
var PatrolTalkConfig = /** @class */ (function () {
    function PatrolTalkConfig() {
    }
    PatrolTalkConfig.prototype.attrs = function () {
        return ['id', 'description', 'lowLevel', 'heightLevel'];
    };
    PatrolTalkConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number'];
    };
    return PatrolTalkConfig;
}());
window["PatrolTalkConfig"] = PatrolTalkConfig;
var NoviceMapConfig = /** @class */ (function () {
    function NoviceMapConfig() {
    }
    NoviceMapConfig.prototype.attrs = function () {
        return ['id', 'name', 'posX', 'posY', 'type', 'terrain', 'guide_id', 'Status', 'guideId', 'country'];
    };
    NoviceMapConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'];
    };
    return NoviceMapConfig;
}());
window["NoviceMapConfig"] = NoviceMapConfig;
var GuideConfig = /** @class */ (function () {
    function GuideConfig() {
    }
    GuideConfig.prototype.attrs = function () {
        return ['id', 'type', 'params', 'sceneId'];
    };
    GuideConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number'];
    };
    return GuideConfig;
}());
window["GuideConfig"] = GuideConfig;
var GuideStepConfig = /** @class */ (function () {
    function GuideStepConfig() {
    }
    GuideStepConfig.prototype.attrs = function () {
        return ['id', 'guideId', 'condition', 'param', 'actType', 'actParam', 'uiRoot', 'uiPath', 'desParam'];
    };
    GuideStepConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number', 'number', 'string', 'string', 'number'];
    };
    return GuideStepConfig;
}());
window["GuideStepConfig"] = GuideStepConfig;
var GuideDialogConfig = /** @class */ (function () {
    function GuideDialogConfig() {
    }
    GuideDialogConfig.prototype.attrs = function () {
        return ['id', 'generalId', 'name', 'type', 'dialog', 'sound'];
    };
    GuideDialogConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'string'];
    };
    return GuideDialogConfig;
}());
window["GuideDialogConfig"] = GuideDialogConfig;
var FirstBattleScriptConfig = /** @class */ (function () {
    function FirstBattleScriptConfig() {
    }
    FirstBattleScriptConfig.prototype.attrs = function () {
        return ['id', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15', 'step16', 'step17', 'step18', 'step19'];
    };
    FirstBattleScriptConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string'];
    };
    return FirstBattleScriptConfig;
}());
window["FirstBattleScriptConfig"] = FirstBattleScriptConfig;
var SystemConstConfig = /** @class */ (function () {
    function SystemConstConfig() {
    }
    SystemConstConfig.prototype.attrs = function () {
        return ['id', 'key', 'value', 'type', 'name'];
    };
    SystemConstConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'string', 'number'];
    };
    return SystemConstConfig;
}());
window["SystemConstConfig"] = SystemConstConfig;
var XiangyangEveryDayRewardConfig = /** @class */ (function () {
    function XiangyangEveryDayRewardConfig() {
    }
    XiangyangEveryDayRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'reward'];
    };
    XiangyangEveryDayRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return XiangyangEveryDayRewardConfig;
}());
window["XiangyangEveryDayRewardConfig"] = XiangyangEveryDayRewardConfig;
var XiangyangPlayerRankRewardConfig = /** @class */ (function () {
    function XiangyangPlayerRankRewardConfig() {
    }
    XiangyangPlayerRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'reward'];
    };
    XiangyangPlayerRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return XiangyangPlayerRankRewardConfig;
}());
window["XiangyangPlayerRankRewardConfig"] = XiangyangPlayerRankRewardConfig;
var XiangyangCountryRankRewardConfig = /** @class */ (function () {
    function XiangyangCountryRankRewardConfig() {
    }
    XiangyangCountryRankRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'countryRankCount', 'reward'];
    };
    XiangyangCountryRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return XiangyangCountryRankRewardConfig;
}());
window["XiangyangCountryRankRewardConfig"] = XiangyangCountryRankRewardConfig;
var XiangyangPlayerBattleRewardConfig = /** @class */ (function () {
    function XiangyangPlayerBattleRewardConfig() {
    }
    XiangyangPlayerBattleRewardConfig.prototype.attrs = function () {
        return ['id', 'activityId', 'count', 'reward'];
    };
    XiangyangPlayerBattleRewardConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string'];
    };
    return XiangyangPlayerBattleRewardConfig;
}());
window["XiangyangPlayerBattleRewardConfig"] = XiangyangPlayerBattleRewardConfig;
var RelationConfig = /** @class */ (function () {
    function RelationConfig() {
    }
    RelationConfig.prototype.attrs = function () {
        return ['id', 'generalId', 'relationId', 'level', 'name', 'power', 'Desc', 'effect', 'triggerType', 'triggerParameter'];
    };
    RelationConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'number', 'string', 'string', 'number', 'string'];
    };
    return RelationConfig;
}());
window["RelationConfig"] = RelationConfig;
var SoundConfig = /** @class */ (function () {
    function SoundConfig() {
    }
    SoundConfig.prototype.attrs = function () {
        return ['id', 'desc', 'name', 'loop'];
    };
    SoundConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'boolean'];
    };
    return SoundConfig;
}());
window["SoundConfig"] = SoundConfig;
var BuildingResourcesLvConfig = /** @class */ (function () {
    function BuildingResourcesLvConfig() {
    }
    BuildingResourcesLvConfig.prototype.attrs = function () {
        return ['id', 'type', 'lv', 'value', 'time', 'maxRes'];
    };
    BuildingResourcesLvConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number'];
    };
    return BuildingResourcesLvConfig;
}());
window["BuildingResourcesLvConfig"] = BuildingResourcesLvConfig;
var BuildingCoordinateConfig = /** @class */ (function () {
    function BuildingCoordinateConfig() {
    }
    BuildingCoordinateConfig.prototype.attrs = function () {
        return ['id', 'buildPos', 'upLvOffset', 'nameOffset', 'iconOffset'];
    };
    BuildingCoordinateConfig.prototype.types = function () {
        return ['string', 'string', 'string', 'string', 'string'];
    };
    return BuildingCoordinateConfig;
}());
window["BuildingCoordinateConfig"] = BuildingCoordinateConfig;
var BuildingConfig = /** @class */ (function () {
    function BuildingConfig() {
    }
    BuildingConfig.prototype.attrs = function () {
        return ['id', 'name', 'type', 'status', 'openLevel', 'pos', 'upgrad', 'TurnPanel', 'rk', 'rkFunction', 'buildFunction'];
    };
    BuildingConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string'];
    };
    return BuildingConfig;
}());
window["BuildingConfig"] = BuildingConfig;
var BuildingLevelConfig = /** @class */ (function () {
    function BuildingLevelConfig() {
    }
    BuildingLevelConfig.prototype.attrs = function () {
        return ['id', 'buildingType', 'level', 'upLevelTime', 'conditions', 'consumes', 'effectDesc'];
    };
    BuildingLevelConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'string', 'string', 'string'];
    };
    return BuildingLevelConfig;
}());
window["BuildingLevelConfig"] = BuildingLevelConfig;
var BuildingTrainConfig = /** @class */ (function () {
    function BuildingTrainConfig() {
    }
    BuildingTrainConfig.prototype.attrs = function () {
        return ['id', 'buildingType', 'soldiersType', 'level', 'elapsedTime', 'consumes', 'trainlimit', 'storagelimit', 'buildDesc'];
    };
    BuildingTrainConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number', 'number', 'string', 'number', 'number', 'string'];
    };
    return BuildingTrainConfig;
}());
window["BuildingTrainConfig"] = BuildingTrainConfig;
var BuildingTypeConfig = /** @class */ (function () {
    function BuildingTypeConfig() {
    }
    BuildingTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'type', 'produce'];
    };
    BuildingTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number'];
    };
    return BuildingTypeConfig;
}());
window["BuildingTypeConfig"] = BuildingTypeConfig;
var ActivityOnlineTimeRewardConfig = /** @class */ (function () {
    function ActivityOnlineTimeRewardConfig() {
    }
    ActivityOnlineTimeRewardConfig.prototype.attrs = function () {
        return ['id', 'minutes', 'reward'];
    };
    ActivityOnlineTimeRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return ActivityOnlineTimeRewardConfig;
}());
window["ActivityOnlineTimeRewardConfig"] = ActivityOnlineTimeRewardConfig;
var BulletConfig = /** @class */ (function () {
    function BulletConfig() {
    }
    BulletConfig.prototype.attrs = function () {
        return ['id', 'description', 'disPercent', 'angleOffset', 'pic', 'speed', 'isCatapultTrack', 'effect', 'sound', 'autoRotation'];
    };
    BulletConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'string', 'number', 'number', 'number', 'number', 'number'];
    };
    return BulletConfig;
}());
window["BulletConfig"] = BulletConfig;
var MilitaryMeritsConfig = /** @class */ (function () {
    function MilitaryMeritsConfig() {
    }
    MilitaryMeritsConfig.prototype.attrs = function () {
        return ['id', 'militaryMerits', 'reward'];
    };
    MilitaryMeritsConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return MilitaryMeritsConfig;
}());
window["MilitaryMeritsConfig"] = MilitaryMeritsConfig;
var MilitaryMeritsDayLimitConfig = /** @class */ (function () {
    function MilitaryMeritsDayLimitConfig() {
    }
    MilitaryMeritsDayLimitConfig.prototype.attrs = function () {
        return ['id', 'dayLimit'];
    };
    MilitaryMeritsDayLimitConfig.prototype.types = function () {
        return ['number', 'number'];
    };
    return MilitaryMeritsDayLimitConfig;
}());
window["MilitaryMeritsDayLimitConfig"] = MilitaryMeritsDayLimitConfig;
var MilitaryMeritsRankRewardConfig = /** @class */ (function () {
    function MilitaryMeritsRankRewardConfig() {
    }
    MilitaryMeritsRankRewardConfig.prototype.attrs = function () {
        return ['id', 'rank', 'reward'];
    };
    MilitaryMeritsRankRewardConfig.prototype.types = function () {
        return ['number', 'number', 'string'];
    };
    return MilitaryMeritsRankRewardConfig;
}());
window["MilitaryMeritsRankRewardConfig"] = MilitaryMeritsRankRewardConfig;
var BattleMapConfig = /** @class */ (function () {
    function BattleMapConfig() {
    }
    BattleMapConfig.prototype.attrs = function () {
        return ['id', 'name', 'tileMap', 'terrain', 'sound'];
    };
    BattleMapConfig.prototype.types = function () {
        return ['number', 'number', 'string', 'number', 'number'];
    };
    return BattleMapConfig;
}());
window["BattleMapConfig"] = BattleMapConfig;
var WarTypeConfig = /** @class */ (function () {
    function WarTypeConfig() {
    }
    WarTypeConfig.prototype.attrs = function () {
        return ['id', 'name', 'key', 'combatType', 'sendBegin', 'autoLevelLimit', 'initAuto', 'quickBattle'];
    };
    WarTypeConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number', 'number', 'number', 'string'];
    };
    return WarTypeConfig;
}());
window["WarTypeConfig"] = WarTypeConfig;
var ReportTypeConfig = /** @class */ (function () {
    function ReportTypeConfig() {
    }
    ReportTypeConfig.prototype.attrs = function () {
        return ['id', 'state', 'createState', 'reportState'];
    };
    ReportTypeConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'number'];
    };
    return ReportTypeConfig;
}());
window["ReportTypeConfig"] = ReportTypeConfig;
var TurnTableConfig = /** @class */ (function () {
    function TurnTableConfig() {
    }
    TurnTableConfig.prototype.attrs = function () {
        return ['id', 'award', 'type', 'team', 'rate', 'rewards'];
    };
    TurnTableConfig.prototype.types = function () {
        return ['number', 'string', 'number', 'number', 'number', 'string'];
    };
    return TurnTableConfig;
}());
window["TurnTableConfig"] = TurnTableConfig;
var ConsumeConfig = /** @class */ (function () {
    function ConsumeConfig() {
    }
    ConsumeConfig.prototype.attrs = function () {
        return ['id', 'type', 'times', 'cost', 'percent'];
    };
    ConsumeConfig.prototype.types = function () {
        return ['number', 'number', 'number', 'string', 'string'];
    };
    return ConsumeConfig;
}());
window["ConsumeConfig"] = ConsumeConfig;
var SoldierTypeRestraintConfig = /** @class */ (function () {
    function SoldierTypeRestraintConfig() {
    }
    SoldierTypeRestraintConfig.prototype.attrs = function () {
        return ['id', 'name', 'restraint', 'probability', 'value'];
    };
    SoldierTypeRestraintConfig.prototype.types = function () {
        return ['number', 'string', 'string', 'number', 'number'];
    };
    return SoldierTypeRestraintConfig;
}());
window["SoldierTypeRestraintConfig"] = SoldierTypeRestraintConfig;
var DragonBonesScaleConfig = /** @class */ (function () {
    function DragonBonesScaleConfig() {
    }
    DragonBonesScaleConfig.prototype.attrs = function () {
        return ['id', 'scale'];
    };
    DragonBonesScaleConfig.prototype.types = function () {
        return ['string', 'number'];
    };
    return DragonBonesScaleConfig;
}());
window["DragonBonesScaleConfig"] = DragonBonesScaleConfig;
var CodeLanConfig = /** @class */ (function () {
    function CodeLanConfig() {
    }
    CodeLanConfig.prototype.attrs = function () {
        return ['id', 'key', 'value'];
    };
    CodeLanConfig.prototype.types = function () {
        return ['number', 'string', 'number'];
    };
    return CodeLanConfig;
}());
window["CodeLanConfig"] = CodeLanConfig;
var DAFConfig = /** @class */ (function () {
    function DAFConfig() {
    }
    DAFConfig.prototype.attrs = function () {
        return ['id', 'desc'];
    };
    DAFConfig.prototype.types = function () {
        return ['number', 'string'];
    };
    return DAFConfig;
}());
window["DAFConfig"] = DAFConfig;
var LanguageConfig = /** @class */ (function () {
    function LanguageConfig() {
    }
    LanguageConfig.prototype.attrs = function () {
        return ['id', 'value'];
    };
    LanguageConfig.prototype.types = function () {
        return ['number', 'string'];
    };
    return LanguageConfig;
}());
window["LanguageConfig"] = LanguageConfig;
