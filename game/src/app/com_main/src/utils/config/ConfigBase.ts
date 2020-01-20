class PersonalBossConfig{
	public id:number;
	public bossType:number;
	public bossName:string;
	public power:number;
	public openLevel:number;
	public bossLevel:number;
	public model:number;
	public checkPointIds:number;
	public worldPointIds:string;
	public terrainId:number;
	public killReward:number;
	public week:number;
	public time:string;

	public attrs(){
		return ['id','bossType','bossName','power','openLevel','bossLevel','model','checkPointIds','worldPointIds','terrainId','killReward','week','time']
	}

	public types(){
		return ['number','number','string','number','number','number','number','number','string','number','number','number','string']
	}
}
window["PersonalBossConfig"] = PersonalBossConfig;

class BossConfig{
	public id:number;
	public model:number;
	public position:number;
	public type:number;
	public star:number;
	public power:number;
	public condition:string;
	public checkPointIds:number;
	public strengthenId:number;
	public reward:string;
	public nextId:number;
	public level:number;

	public attrs(){
		return ['id','model','position','type','star','power','condition','checkPointIds','strengthenId','reward','nextId','level']
	}

	public types(){
		return ['number','number','number','number','number','number','string','number','number','string','number','number']
	}
}
window["BossConfig"] = BossConfig;

class BossHurtConfig{
	public id:number;
	public bossHurt:number;
	public bossHurtReward:string;

	public attrs(){
		return ['id','bossHurt','bossHurtReward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["BossHurtConfig"] = BossHurtConfig;

class WorldBossRankRewardConfig{
	public id:number;
	public bossId:number;
	public rank:number;
	public reward:string;

	public attrs(){
		return ['id','bossId','rank','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["WorldBossRankRewardConfig"] = WorldBossRankRewardConfig;

class RankBossRankRewardConfig{
	public id:number;
	public bossId:number;
	public rank:number;
	public reward:string;

	public attrs(){
		return ['id','bossId','rank','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["RankBossRankRewardConfig"] = RankBossRankRewardConfig;

class ArmyActionConfig{
	public id:string;
	public anchorOffsetX:number;
	public anchorOffsetY:number;
	public keyFrame:number;
	public fps:number;
	public fps2:number;
	public launchX:number;
	public launchY:number;
	public launchDeleyTime:number;

	public attrs(){
		return ['id','anchorOffsetX','anchorOffsetY','keyFrame','fps','fps2','launchX','launchY','launchDeleyTime']
	}

	public types(){
		return ['string','number','number','number','number','number','number','number','number']
	}
}
window["ArmyActionConfig"] = ArmyActionConfig;

class ArmyModelConfig{
	public id:number;
	public description:string;
	public code:number;
	public grid:number;
	public attackEffect:boolean;
	public bodyHeight:number;
	public buffScale:number;

	public attrs(){
		return ['id','description','code','grid','attackEffect','bodyHeight','buffScale']
	}

	public types(){
		return ['number','string','number','number','boolean','number','number']
	}
}
window["ArmyModelConfig"] = ArmyModelConfig;

class GeneralSoldierLvConfig{
	public id:number;
	public mainType:number;
	public subType:number;
	public LV:number;
	public ourModelCode:number;
	public enemyModelCode:number;
	public name:string;
	public attribute:string;
	public speed:number;
	public lordTomeSkill:string;
	public teamconsumption:number;
	public score:number;

	public attrs(){
		return ['id','mainType','subType','LV','ourModelCode','enemyModelCode','name','attribute','speed','lordTomeSkill','teamconsumption','score']
	}

	public types(){
		return ['number','number','number','number','number','number','string','string','number','string','number','number']
	}
}
window["GeneralSoldierLvConfig"] = GeneralSoldierLvConfig;

class ArmyProgressConfig{
	public id:number;
	public armyType:number;
	public armyName:string;
	public progressLevel:number;
	public coumses:string;
	public attribute:string;
	public score:number;

	public attrs(){
		return ['id','armyType','armyName','progressLevel','coumses','attribute','score']
	}

	public types(){
		return ['number','number','string','number','string','string','number']
	}
}
window["ArmyProgressConfig"] = ArmyProgressConfig;

class ArmyUpTeamConfig{
	public id:number;
	public armyNum:number;

	public attrs(){
		return ['id','armyNum']
	}

	public types(){
		return ['number','number']
	}
}
window["ArmyUpTeamConfig"] = ArmyUpTeamConfig;

class SquareSoldierPositionConfig{
	public id:string;
	public soldier_1:string;
	public soldier_2:string;
	public soldier_3:string;
	public soldier_4:string;
	public soldier_5:string;
	public soldier_6:string;
	public soldier_7:string;
	public soldier_8:string;

	public attrs(){
		return ['id','soldier_1','soldier_2','soldier_3','soldier_4','soldier_5','soldier_6','soldier_7','soldier_8']
	}

	public types(){
		return ['string','string','string','string','string','string','string','string','string']
	}
}
window["SquareSoldierPositionConfig"] = SquareSoldierPositionConfig;

class TreasureConfig{
	public id:number;
	public name:string;
	public quality:number;
	public type:number;
	public generalType:string;
	public mainAttribute:string;
	public secondaryAttributeGroup:string;
	public exclusiveId:number;
	public exclusiveAdd:string;
	public highLevel:number;
	public highStar:number;
	public constitute:string;
	public oneEffect:string;
	public twoEffect:string;
	public threeEffect:string;
	public fragment:number;
	public decompose:number;

	public attrs(){
		return ['id','name','quality','type','generalType','mainAttribute','secondaryAttributeGroup','exclusiveId','exclusiveAdd','highLevel','highStar','constitute','oneEffect','twoEffect','threeEffect','fragment','decompose']
	}

	public types(){
		return ['number','string','number','number','string','string','string','number','string','number','number','string','string','string','string','number','number']
	}
}
window["TreasureConfig"] = TreasureConfig;

class TreaAttriConfig{
	public id:number;
	public type:number;
	public subType:number;
	public attriType:number;
	public valType:number;

	public attrs(){
		return ['id','type','subType','attriType','valType']
	}

	public types(){
		return ['number','number','number','number','number']
	}
}
window["TreaAttriConfig"] = TreaAttriConfig;

class TreasureStarConfig{
	public id:number;
	public starLevel:number;
	public quality:number;
	public attriAddRate:string;
	public consume:string;
	public unlockHole:number;
	public levelLimit:number;
	public fragmenNum:number;

	public attrs(){
		return ['id','starLevel','quality','attriAddRate','consume','unlockHole','levelLimit','fragmenNum']
	}

	public types(){
		return ['number','number','number','string','string','number','number','number']
	}
}
window["TreasureStarConfig"] = TreasureStarConfig;

class SecondAttributeConfig{
	public id:number;
	public name:string;
	public desc:string;
	public team:number;
	public quality:number;
	public attris:string;

	public attrs(){
		return ['id','name','desc','team','quality','attris']
	}

	public types(){
		return ['number','string','string','number','number','string']
	}
}
window["SecondAttributeConfig"] = SecondAttributeConfig;

class TreasureLevelConfig{
	public id:number;
	public growUp:string;
	public consume:string;
	public success:number;

	public attrs(){
		return ['id','growUp','consume','success']
	}

	public types(){
		return ['number','string','string','number']
	}
}
window["TreasureLevelConfig"] = TreasureLevelConfig;

class GemstoneConfig{
	public id:number;
	public nextId:number;
	public type:number;
	public gemLevel:number;
	public openLevel:number;
	public attri:string;
	public composeNumber:number;
	public cost:number;

	public attrs(){
		return ['id','nextId','type','gemLevel','openLevel','attri','composeNumber','cost']
	}

	public types(){
		return ['number','number','number','number','number','string','number','number']
	}
}
window["GemstoneConfig"] = GemstoneConfig;

class VisitConfig{
	public id:number;
	public name:number;
	public heroId:number;
	public reward:number;
	public icon:number;
	public starttext:number;
	public endtext:number;
	public cooling:number;

	public attrs(){
		return ['id','name','heroId','reward','icon','starttext','endtext','cooling']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number']
	}
}
window["VisitConfig"] = VisitConfig;

class ApkRankAwardConfig{
	public id:number;
	public minRank:number;
	public maxRank:number;
	public reward:string;

	public attrs(){
		return ['id','minRank','maxRank','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["ApkRankAwardConfig"] = ApkRankAwardConfig;

class ApkMaxRankAwardConfig{
	public id:number;
	public minRank:number;
	public maxRank:number;
	public reward:string;

	public attrs(){
		return ['id','minRank','maxRank','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["ApkMaxRankAwardConfig"] = ApkMaxRankAwardConfig;

class CoolDownConfig{
	public id:number;
	public type:number;
	public min:number;
	public max:number;
	public gold:number;

	public attrs(){
		return ['id','type','min','max','gold']
	}

	public types(){
		return ['number','number','number','number','number']
	}
}
window["CoolDownConfig"] = CoolDownConfig;

class VipPrivillegesConfig{
	public id:number;
	public key:string;
	public moduleUseCountId:number;
	public type:number;
	public vip0:number;
	public vip1:number;
	public vip2:number;
	public vip3:number;
	public vip4:number;
	public vip5:number;
	public vip6:number;
	public vip7:number;
	public vip8:number;
	public vip9:number;
	public vip10:number;
	public vip11:number;
	public vip12:number;
	public vip13:number;
	public vip14:number;
	public vip15:number;
	public valType:number;
	public description:number;

	public attrs(){
		return ['id','key','moduleUseCountId','type','vip0','vip1','vip2','vip3','vip4','vip5','vip6','vip7','vip8','vip9','vip10','vip11','vip12','vip13','vip14','vip15','valType','description']
	}

	public types(){
		return ['number','string','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number','number']
	}
}
window["VipPrivillegesConfig"] = VipPrivillegesConfig;

class VipConfig{
	public id:number;
	public level:number;
	public exp:number;
	public dailyReward:string;
	public levelReward:string;
	public privileges:string;
	public price:number;
	public discount:string;
	public amount:number;

	public attrs(){
		return ['id','level','exp','dailyReward','levelReward','privileges','price','discount','amount']
	}

	public types(){
		return ['number','number','number','string','string','string','number','string','number']
	}
}
window["VipConfig"] = VipConfig;

class MaterialTypeConfig{
	public id:number;
	public key:string;
	public freeCount:number;
	public vipBuyPrivilege:number;
	public buyPrice:string;

	public attrs(){
		return ['id','key','freeCount','vipBuyPrivilege','buyPrice']
	}

	public types(){
		return ['number','string','number','number','string']
	}
}
window["MaterialTypeConfig"] = MaterialTypeConfig;

class MaterialConfig{
	public id:number;
	public type:number;
	public playerLevel:number;
	public name:string;
	public prev:number;
	public grade:number;
	public power:number;
	public scenetype:number;
	public model:number;
	public terrainId:number;
	public checkPointIds:number;
	public reward:string;
	public week:string;
	public time:string;

	public attrs(){
		return ['id','type','playerLevel','name','prev','grade','power','scenetype','model','terrainId','checkPointIds','reward','week','time']
	}

	public types(){
		return ['number','number','number','string','number','number','number','number','number','number','number','string','string','string']
	}
}
window["MaterialConfig"] = MaterialConfig;

class ErrorCodeConfig{
	public id:number;
	public name:number;

	public attrs(){
		return ['id','name']
	}

	public types(){
		return ['number','number']
	}
}
window["ErrorCodeConfig"] = ErrorCodeConfig;

class CDKeyRerwardConfig{
	public id:number;
	public activityId:string;
	public isUnify:boolean;
	public reward:string;
	public timeLimit:number;
	public num:number;

	public attrs(){
		return ['id','activityId','isUnify','reward','timeLimit','num']
	}

	public types(){
		return ['number','string','boolean','string','number','number']
	}
}
window["CDKeyRerwardConfig"] = CDKeyRerwardConfig;

class TerrainSceneElementConfig{
	public id:number;
	public type:number;
	public name:string;
	public lv:number;
	public position:number;
	public attribute:string;
	public speed:number;
	public isHistoricSite:boolean;
	public lordTomeSkill:string;
	public passiveSkill:string;

	public attrs(){
		return ['id','type','name','lv','position','attribute','speed','isHistoricSite','lordTomeSkill','passiveSkill']
	}

	public types(){
		return ['number','number','string','number','number','string','number','boolean','string','string']
	}
}
window["TerrainSceneElementConfig"] = TerrainSceneElementConfig;

class TerrainConfig{
	public id:number;
	public name:string;
	public terrain:number;
	public sound:number;
	public offX:number;
	public offY:number;

	public attrs(){
		return ['id','name','terrain','sound','offX','offY']
	}

	public types(){
		return ['number','string','number','number','number','number']
	}
}
window["TerrainConfig"] = TerrainConfig;

class DropLimitConfig{
	public id:number;
	public itemId:number;
	public dropNo:number;
	public limitAmount:number;
	public dropPeriod:number;
	public startingTime:number;
	public endTime:number;

	public attrs(){
		return ['id','itemId','dropNo','limitAmount','dropPeriod','startingTime','endTime']
	}

	public types(){
		return ['number','number','number','number','number','number','number']
	}
}
window["DropLimitConfig"] = DropLimitConfig;

class DropConfig{
	public id:number;
	public dropNo:number;
	public rewards:string;

	public attrs(){
		return ['id','dropNo','rewards']
	}

	public types(){
		return ['number','number','string']
	}
}
window["DropConfig"] = DropConfig;

class ItemConfig{
	public id:number;
	public sourceIcon:number;
	public type:number;
	public mainType:number;
	public subType:number;
	public name:number;
	public description:string;
	public level:number;
	public quality:number;
	public upperLimit:number;
	public overflowType:number;
	public usable:number;
	public sourcePage:string;
	public sourcePrice:string;
	public property:string;
	public ifUnique:boolean;
	public get:string;
	public common:string;

	public attrs(){
		return ['id','sourceIcon','type','mainType','subType','name','description','level','quality','upperLimit','overflowType','usable','sourcePage','sourcePrice','property','ifUnique','get','common']
	}

	public types(){
		return ['number','number','number','number','number','number','string','number','number','number','number','number','string','string','string','boolean','string','string']
	}
}
window["ItemConfig"] = ItemConfig;

class ItemGiftExConfig{
	public id:number;
	public type:number;
	public rewards:string;

	public attrs(){
		return ['id','type','rewards']
	}

	public types(){
		return ['number','number','string']
	}
}
window["ItemGiftExConfig"] = ItemGiftExConfig;

class EquipmentConfig{
	public id:number;
	public name:string;
	public level:number;
	public attribute:string;
	public slotType:number;
	public setId:number;
	public fragmentId:number;
	public fragmentCount:number;
	public decomposition:string;
	public cmbatpower:number;

	public attrs(){
		return ['id','name','level','attribute','slotType','setId','fragmentId','fragmentCount','decomposition','cmbatpower']
	}

	public types(){
		return ['number','string','number','string','number','number','number','number','string','number']
	}
}
window["EquipmentConfig"] = EquipmentConfig;

class EquipmentSlotSumConfig{
	public id:number;
	public sumLevel:string;
	public type:number;
	public attribute:string;
	public text:string;

	public attrs(){
		return ['id','sumLevel','type','attribute','text']
	}

	public types(){
		return ['number','string','number','string','string']
	}
}
window["EquipmentSlotSumConfig"] = EquipmentSlotSumConfig;

class EquipmentSlotStrengthenConfig{
	public id:number;
	public level:number;
	public slot:number;
	public addAttribute:string;
	public consume:string;

	public attrs(){
		return ['id','level','slot','addAttribute','consume']
	}

	public types(){
		return ['number','number','number','string','string']
	}
}
window["EquipmentSlotStrengthenConfig"] = EquipmentSlotStrengthenConfig;

class EquipmentSlotWroughtConfig{
	public id:number;
	public level:number;
	public slot:number;
	public addAttribute:string;
	public consume:string;

	public attrs(){
		return ['id','level','slot','addAttribute','consume']
	}

	public types(){
		return ['number','number','number','string','string']
	}
}
window["EquipmentSlotWroughtConfig"] = EquipmentSlotWroughtConfig;

class EquipmentSetConfig{
	public id:number;
	public quality:number;
	public name:string;
	public level:number;
	public suit:string;
	public attribute2:string;
	public attribute3:string;
	public attribute4:string;
	public text2:string;
	public text3:string;
	public text4:string;

	public attrs(){
		return ['id','quality','name','level','suit','attribute2','attribute3','attribute4','text2','text3','text4']
	}

	public types(){
		return ['number','number','string','number','string','string','string','string','string','string','string']
	}
}
window["EquipmentSetConfig"] = EquipmentSetConfig;

class EquipmentSlotUpgradeConfig{
	public id:number;
	public level:number;
	public slot:number;
	public consume:string;

	public attrs(){
		return ['id','level','slot','consume']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["EquipmentSlotUpgradeConfig"] = EquipmentSlotUpgradeConfig;

class FiefConstructionConfig{
	public id:number;
	public reward:string;
	public coefficient:number;
	public consume:string;
	public time:number;
	public cdTime:number;

	public attrs(){
		return ['id','reward','coefficient','consume','time','cdTime']
	}

	public types(){
		return ['number','string','number','string','number','number']
	}
}
window["FiefConstructionConfig"] = FiefConstructionConfig;

class IronProportionConfig{
	public id:number;
	public cityLevelProportion:number;
	public officialProportion:number;

	public attrs(){
		return ['id','cityLevelProportion','officialProportion']
	}

	public types(){
		return ['number','number','number']
	}
}
window["IronProportionConfig"] = IronProportionConfig;

class GuildPositionConfig{
	public id:number;
	public name:string;
	public canAccept:boolean;
	public canInvite:boolean;
	public canAppoint:boolean;
	public canKickOut:boolean;
	public canChangeName:boolean;
	public canChangeDeclaration:boolean;
	public canReplenish:boolean;
	public amount:number;

	public attrs(){
		return ['id','name','canAccept','canInvite','canAppoint','canKickOut','canChangeName','canChangeDeclaration','canReplenish','amount']
	}

	public types(){
		return ['number','string','boolean','boolean','boolean','boolean','boolean','boolean','boolean','number']
	}
}
window["GuildPositionConfig"] = GuildPositionConfig;

class GuildShopConfig{
	public id:number;
	public itemId:number;
	public fund:number;
	public score:string;
	public stock:number;

	public attrs(){
		return ['id','itemId','fund','score','stock']
	}

	public types(){
		return ['number','number','number','string','number']
	}
}
window["GuildShopConfig"] = GuildShopConfig;

class GuildConfig{
	public id:number;
	public contribution:number;
	public limit:number;

	public attrs(){
		return ['id','contribution','limit']
	}

	public types(){
		return ['number','number','number']
	}
}
window["GuildConfig"] = GuildConfig;

class GuildHelpConfig{
	public id:number;
	public percent:number;

	public attrs(){
		return ['id','percent']
	}

	public types(){
		return ['number','number']
	}
}
window["GuildHelpConfig"] = GuildHelpConfig;

class GuildDonationConfig{
	public id:number;
	public name:number;
	public techID:number;
	public type:number;
	public expend1:string;
	public expend2:string;
	public gain:string;
	public guild_exp:number;

	public attrs(){
		return ['id','name','techID','type','expend1','expend2','gain','guild_exp']
	}

	public types(){
		return ['number','number','number','number','string','string','string','number']
	}
}
window["GuildDonationConfig"] = GuildDonationConfig;

class StarRewardConfig{
	public id:number;
	public chapterId:number;
	public star:number;
	public starReward:string;

	public attrs(){
		return ['id','chapterId','star','starReward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["StarRewardConfig"] = StarRewardConfig;

class StarConfig{
	public id:number;
	public oneStarConfig:number;
	public twoStarConfig:number;
	public threeStarConfig:number;
	public power:number;

	public attrs(){
		return ['id','oneStarConfig','twoStarConfig','threeStarConfig','power']
	}

	public types(){
		return ['number','number','number','number','number']
	}
}
window["StarConfig"] = StarConfig;

class ChapterIdConfig{
	public id:number;
	public chapterName:number;

	public attrs(){
		return ['id','chapterName']
	}

	public types(){
		return ['number','number']
	}
}
window["ChapterIdConfig"] = ChapterIdConfig;

class CheckPointCostConfig{
	public id:number;
	public times:number;
	public cost:string;

	public attrs(){
		return ['id','times','cost']
	}

	public types(){
		return ['number','number','string']
	}
}
window["CheckPointCostConfig"] = CheckPointCostConfig;

class ChapterConfig{
	public id:number;
	public title:string;
	public difficultyType:number;
	public resMapName:string;
	public sweepAway:boolean;
	public chapterId:number;
	public level:number;
	public resRoleName:string;
	public stageType:number;
	public terrainId:number;
	public terrainSceneElement:string;
	public npcTeamIds:number;
	public checkPointPos:string;
	public lockLv:number;
	public generalInfos:string;
	public firstReward:string;
	public winReward:string;
	public maxChallengeCount:number;
	public starOne:string;
	public starTwo:string;
	public starThree:string;
	public prevPointId:string;
	public nextPointId:string;
	public StrengthenId:number;

	public attrs(){
		return ['id','title','difficultyType','resMapName','sweepAway','chapterId','level','resRoleName','stageType','terrainId','terrainSceneElement','npcTeamIds','checkPointPos','lockLv','generalInfos','firstReward','winReward','maxChallengeCount','starOne','starTwo','starThree','prevPointId','nextPointId','StrengthenId']
	}

	public types(){
		return ['number','string','number','string','boolean','number','number','string','number','number','string','number','string','number','string','string','string','number','string','string','string','string','string','number']
	}
}
window["ChapterConfig"] = ChapterConfig;

class FunctionConfig{
	public id:number;
	public btnType:number;
	public name:string;
	public key:string;
	public type:number;
	public openLevel:number;
	public openTaskId:number;
	public visibleLevel:number;
	public isRemind:number;
	public content:number;
	public text:number;
	public turnPanel:number;
	public sortPreview:number;
	public isPreView:number;

	public attrs(){
		return ['id','btnType','name','key','type','openLevel','openTaskId','visibleLevel','isRemind','content','text','turnPanel','sortPreview','isPreView']
	}

	public types(){
		return ['number','number','string','string','number','number','number','number','number','number','number','number','number','number']
	}
}
window["FunctionConfig"] = FunctionConfig;

class FunctionBtnConfig{
	public id:number;
	public iconName:string;
	public pos:number;
	public priority:number;
	public scene:number;

	public attrs(){
		return ['id','iconName','pos','priority','scene']
	}

	public types(){
		return ['number','string','number','number','number']
	}
}
window["FunctionBtnConfig"] = FunctionBtnConfig;

class SystemPreviewConfig{
	public id:number;
	public name:string;
	public icon:string;
	public level:number;
	public text:string;
	public turnPanel:number;

	public attrs(){
		return ['id','name','icon','level','text','turnPanel']
	}

	public types(){
		return ['number','string','string','number','string','number']
	}
}
window["SystemPreviewConfig"] = SystemPreviewConfig;

class CountryConfig{
	public id:number;
	public name:number;

	public attrs(){
		return ['id','name']
	}

	public types(){
		return ['number','number']
	}
}
window["CountryConfig"] = CountryConfig;

class CountryTaskConfig{
	public id:number;
	public taskType:number;
	public name:number;
	public condition:number;
	public detail:number;
	public errandReward:string;
	public taskGoal:number;
	public turnPanel:number;

	public attrs(){
		return ['id','taskType','name','condition','detail','errandReward','taskGoal','turnPanel']
	}

	public types(){
		return ['number','number','number','number','number','string','number','number']
	}
}
window["CountryTaskConfig"] = CountryTaskConfig;

class JobInfoConfig{
	public id:number;
	public power:number;
	public intelligence:number;
	public leadership:number;
	public armyHp:number;
	public atk:number;
	public def:number;
	public hp:number;
	public attribute:string;
	public mobile:number;
	public speak:number;
	public technology:number;
	public buildingcd:number;
	public resource:number;
	public soldiercd:number;
	public jobassignment:number;
	public allocation:number;
	public editbulletin:number;
	public description:number;
	public condition:number;

	public attrs(){
		return ['id','power','intelligence','leadership','armyHp','atk','def','hp','attribute','mobile','speak','technology','buildingcd','resource','soldiercd','jobassignment','allocation','editbulletin','description','condition']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number','string','number','number','number','number','number','number','number','number','number','number','number']
	}
}
window["JobInfoConfig"] = JobInfoConfig;

class CountryTaskConditionConfig{
	public id:number;
	public condition:string;

	public attrs(){
		return ['id','condition']
	}

	public types(){
		return ['number','string']
	}
}
window["CountryTaskConditionConfig"] = CountryTaskConditionConfig;

class JobConfig{
	public id:number;
	public name:number;
	public allocation:string;
	public effect:number;
	public sort:number;
	public condition:number;
	public autoAllocation:number;
	public salary:string;

	public attrs(){
		return ['id','name','allocation','effect','sort','condition','autoAllocation','salary']
	}

	public types(){
		return ['number','number','string','number','number','number','number','string']
	}
}
window["JobConfig"] = JobConfig;

class ArmyStrengthenConfig{
	public id:number;
	public monsterLv:number;
	public monsterStar:number;
	public monsterQuality:number;

	public attrs(){
		return ['id','monsterLv','monsterStar','monsterQuality']
	}

	public types(){
		return ['number','number','number','number']
	}
}
window["ArmyStrengthenConfig"] = ArmyStrengthenConfig;

class GuajiRouteConfig{
	public id:number;
	public speed:number;
	public step1:string;
	public step2:string;
	public step3:string;
	public step4:string;
	public step5:string;
	public step6:string;
	public step7:string;
	public step8:string;
	public step9:string;
	public step10:string;
	public step11:string;
	public step12:string;
	public step13:string;
	public step14:string;
	public step15:string;
	public step16:string;
	public step17:string;
	public step18:string;
	public step19:string;
	public step20:string;
	public step21:string;
	public step22:string;
	public step23:string;
	public step24:string;

	public attrs(){
		return ['id','speed','step1','step2','step3','step4','step5','step6','step7','step8','step9','step10','step11','step12','step13','step14','step15','step16','step17','step18','step19','step20','step21','step22','step23','step24']
	}

	public types(){
		return ['number','number','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string']
	}
}
window["GuajiRouteConfig"] = GuajiRouteConfig;

class ActivityOfCountConfig{
	public id:number;
	public activityId:number;
	public name:string;
	public Type:number;
	public itemId:string;
	public num:number;
	public reward:string;
	public rewardType:number;
	public receiveCount:number;

	public attrs(){
		return ['id','activityId','name','Type','itemId','num','reward','rewardType','receiveCount']
	}

	public types(){
		return ['number','number','string','number','string','number','string','number','number']
	}
}
window["ActivityOfCountConfig"] = ActivityOfCountConfig;

class ActivityTaskConfig{
	public id:number;
	public title:string;
	public type:number;
	public activityId:number;
	public countryId:number;
	public taskType:number;
	public sort:number;
	public guideTask:number;
	public rewardOrderType:number;
	public frontTaskID:number;
	public frontLv:string;
	public frontBuild:string;
	public frontModuleOpen:number;
	public rewardDay:number;

	public attrs(){
		return ['id','title','type','activityId','countryId','taskType','sort','guideTask','rewardOrderType','frontTaskID','frontLv','frontBuild','frontModuleOpen','rewardDay']
	}

	public types(){
		return ['number','string','number','number','number','number','number','number','number','number','string','string','number','number']
	}
}
window["ActivityTaskConfig"] = ActivityTaskConfig;

class ActivityTaskConditionConfig{
	public id:number;
	public taskId:number;
	public order:number;
	public activityId:number;
	public title:string;
	public paramKey:number;
	public paramValue:number;
	public rewardActivity:string;
	public rewardItem:IItemInfo[];
	public turnPanel:number;

	public attrs(){
		return ['id','taskId','order','activityId','title','paramKey','paramValue','rewardActivity','rewardItem','turnPanel']
	}

	public types(){
		return ['number','number','number','number','string','number','number','string','IItemInfo[]','number']
	}
}
window["ActivityTaskConditionConfig"] = ActivityTaskConditionConfig;

class ActivitySinglePayRewardConfig{
	public id:number;
	public activityId:number;
	public level:number;
	public reward:IItemInfo[];
	public desc:string;

	public attrs(){
		return ['id','activityId','level','reward','desc']
	}

	public types(){
		return ['number','number','number','IItemInfo[]','string']
	}
}
window["ActivitySinglePayRewardConfig"] = ActivitySinglePayRewardConfig;

class ActivityWeekMonthCardConfig{
	public id:number;
	public activityId:number;
	public cardType:number;
	public price:number;
	public reward:string;
	public rewardCount:number;
	public desc:string;

	public attrs(){
		return ['id','activityId','cardType','price','reward','rewardCount','desc']
	}

	public types(){
		return ['number','number','number','number','string','number','string']
	}
}
window["ActivityWeekMonthCardConfig"] = ActivityWeekMonthCardConfig;

class PrizeConfig{
	public id:number;
	public activityId:number;
	public award:IItemInfo;
	public rate:number;
	public lucky:number;
	public reset:number;

	public attrs(){
		return ['id','activityId','award','rate','lucky','reset']
	}

	public types(){
		return ['number','number','IItemInfo','number','number','number']
	}
}
window["PrizeConfig"] = PrizeConfig;

class PrizeAccumulateConfig{
	public id:number;
	public activityId:number;
	public award:IItemInfo[];
	public accumulate:number;

	public attrs(){
		return ['id','activityId','award','accumulate']
	}

	public types(){
		return ['number','number','IItemInfo[]','number']
	}
}
window["PrizeAccumulateConfig"] = PrizeAccumulateConfig;

class ActivityGrowthFundRewardConfig{
	public id:number;
	public activityId:number;
	public playerLevel:number;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','playerLevel','reward']
	}

	public types(){
		return ['number','number','number','IItemInfo[]']
	}
}
window["ActivityGrowthFundRewardConfig"] = ActivityGrowthFundRewardConfig;

class ActivityPowerRankRewardConfig{
	public id:number;
	public activityId:number;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','reward']
	}

	public types(){
		return ['number','number','IItemInfo[]']
	}
}
window["ActivityPowerRankRewardConfig"] = ActivityPowerRankRewardConfig;

class ActivityApkRankRewardConfig{
	public id:number;
	public activityId:number;
	public ranks:string;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','ranks','reward']
	}

	public types(){
		return ['number','number','string','IItemInfo[]']
	}
}
window["ActivityApkRankRewardConfig"] = ActivityApkRankRewardConfig;

class ActivityGuildForceRankRewardConfig{
	public id:number;
	public activityId:number;
	public ranks:string;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','ranks','reward']
	}

	public types(){
		return ['number','number','string','IItemInfo[]']
	}
}
window["ActivityGuildForceRankRewardConfig"] = ActivityGuildForceRankRewardConfig;

class ActivityCountryCitysRankRewardConfig{
	public id:number;
	public activityId:number;
	public ranks:string;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','ranks','reward']
	}

	public types(){
		return ['number','number','string','IItemInfo[]']
	}
}
window["ActivityCountryCitysRankRewardConfig"] = ActivityCountryCitysRankRewardConfig;

class CostKeepsakeRewardConfig{
	public id:number;
	public activityId:number;
	public keepsakeCount:number;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','keepsakeCount','reward']
	}

	public types(){
		return ['number','number','number','IItemInfo[]']
	}
}
window["CostKeepsakeRewardConfig"] = CostKeepsakeRewardConfig;

class ActivityNewGeneralRewardConfig{
	public id:number;
	public activityId:number;
	public requiredRward:IItemInfo[];
	public optionalReward:IItemInfo[];
	public visitCost:IItemInfo[];
	public visitCost10:IItemInfo[];
	public generalId:number;
	public titleStr:string;
	public titleStr1:string;
	public videoUrl:string;
	public icon:string;

	public attrs(){
		return ['id','activityId','requiredRward','optionalReward','visitCost','visitCost10','generalId','titleStr','titleStr1','videoUrl','icon']
	}

	public types(){
		return ['number','number','IItemInfo[]','IItemInfo[]','IItemInfo[]','IItemInfo[]','number','string','string','string','string']
	}
}
window["ActivityNewGeneralRewardConfig"] = ActivityNewGeneralRewardConfig;

class ActivityLoginDaysRewardConfig{
	public id:number;
	public activityId:number;
	public loginDays:number;
	public reward:IItemInfo[];
	public extralRewardCondition:number;
	public rewardType:number;

	public attrs(){
		return ['id','activityId','loginDays','reward','extralRewardCondition','rewardType']
	}

	public types(){
		return ['number','number','number','IItemInfo[]','number','number']
	}
}
window["ActivityLoginDaysRewardConfig"] = ActivityLoginDaysRewardConfig;

class ActivityConsumeGiftRewardConfig{
	public id:number;
	public activityId:number;
	public level:number;
	public reward:IItemInfo[];
	public desc:string;

	public attrs(){
		return ['id','activityId','level','reward','desc']
	}

	public types(){
		return ['number','number','number','IItemInfo[]','string']
	}
}
window["ActivityConsumeGiftRewardConfig"] = ActivityConsumeGiftRewardConfig;

class ActivityLevelRankRewardConfig{
	public id:number;
	public activityId:number;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','activityId','reward']
	}

	public types(){
		return ['number','number','IItemInfo[]']
	}
}
window["ActivityLevelRankRewardConfig"] = ActivityLevelRankRewardConfig;

class ActivityTotalPayRewardConfig{
	public id:number;
	public activityId:number;
	public level:number;
	public reward:IItemInfo[];
	public desc:string;

	public attrs(){
		return ['id','activityId','level','reward','desc']
	}

	public types(){
		return ['number','number','number','IItemInfo[]','string']
	}
}
window["ActivityTotalPayRewardConfig"] = ActivityTotalPayRewardConfig;

class TreasureBowlLevelConfig{
	public id:number;
	public count:number;
	public activityId:number;
	public itemType:number;
	public min:number;
	public max:number;

	public attrs(){
		return ['id','count','activityId','itemType','min','max']
	}

	public types(){
		return ['number','number','number','number','number','number']
	}
}
window["TreasureBowlLevelConfig"] = TreasureBowlLevelConfig;

class TreasureBowlConfig{
	public id:number;
	public activityId:number;
	public totalPayActivityId:number;
	public perPay:number;
	public perCount:number;

	public attrs(){
		return ['id','activityId','totalPayActivityId','perPay','perCount']
	}

	public types(){
		return ['number','number','number','number','number']
	}
}
window["TreasureBowlConfig"] = TreasureBowlConfig;

class ActivityFirstPayRewardConfig{
	public id:number;
	public activityId:number;
	public level:number;
	public reward:IItemInfo[];
	public desc:string;
	public nextId:number;
	public price:number;

	public attrs(){
		return ['id','activityId','level','reward','desc','nextId','price']
	}

	public types(){
		return ['number','number','number','IItemInfo[]','string','number','number']
	}
}
window["ActivityFirstPayRewardConfig"] = ActivityFirstPayRewardConfig;

class GuildTechnologyConfig{
	public id:number;
	public name:number;
	public icon:string;
	public describe:number;
	public techID:number;
	public nexttechID:number;
	public type:number;
	public level:number;
	public attributeID:string;
	public exp:number;
	public legionlevel:number;
	public generalType:number;

	public attrs(){
		return ['id','name','icon','describe','techID','nexttechID','type','level','attributeID','exp','legionlevel','generalType']
	}

	public types(){
		return ['number','number','string','number','number','number','number','number','string','number','number','number']
	}
}
window["GuildTechnologyConfig"] = GuildTechnologyConfig;

class QuickenConfig{
	public id:number;
	public type:number;
	public name:string;
	public reduceTime:number;
	public reduceTimerate:number;

	public attrs(){
		return ['id','type','name','reduceTime','reduceTimerate']
	}

	public types(){
		return ['number','number','string','number','number']
	}
}
window["QuickenConfig"] = QuickenConfig;

class ShowSkillEffectConfig{
	public id:number;
	public animation:string;
	public actionName:string;
	public showType:number;
	public startAnimation:string;
	public playTime:number;
	public beAckEffect:number;
	public hurtStageNum:number;
	public scale:number;
	public effectSound:number;

	public attrs(){
		return ['id','animation','actionName','showType','startAnimation','playTime','beAckEffect','hurtStageNum','scale','effectSound']
	}

	public types(){
		return ['number','string','string','number','string','number','number','number','number','number']
	}
}
window["ShowSkillEffectConfig"] = ShowSkillEffectConfig;

class BuffEffectConfig{
	public id:number;
	public name:string;
	public controlType:number;
	public key:string;
	public paramType:number;

	public attrs(){
		return ['id','name','controlType','key','paramType']
	}

	public types(){
		return ['number','string','number','string','number']
	}
}
window["BuffEffectConfig"] = BuffEffectConfig;

class BuffConfig{
	public id:number;
	public texiao:number;
	public describe:number;

	public attrs(){
		return ['id','texiao','describe']
	}

	public types(){
		return ['number','number','number']
	}
}
window["BuffConfig"] = BuffConfig;

class BuffTargetTypeConfig{
	public id:number;
	public name:string;
	public key:string;
	public isScenesBuff:boolean;

	public attrs(){
		return ['id','name','key','isScenesBuff']
	}

	public types(){
		return ['number','string','string','boolean']
	}
}
window["BuffTargetTypeConfig"] = BuffTargetTypeConfig;

class SkillAttachGroupConfig{
	public id:number;
	public group:string;
	public buffId:number;

	public attrs(){
		return ['id','group','buffId']
	}

	public types(){
		return ['number','string','number']
	}
}
window["SkillAttachGroupConfig"] = SkillAttachGroupConfig;

class BuffPassiveConditionTypeConfig{
	public id:number;
	public name:string;
	public key:string;

	public attrs(){
		return ['id','name','key']
	}

	public types(){
		return ['number','string','string']
	}
}
window["BuffPassiveConditionTypeConfig"] = BuffPassiveConditionTypeConfig;

class ZhaoHuanWuConfig{
	public id:number;
	public name:string;
	public isCollide:number;
	public resId:string;
	public resType:number;

	public attrs(){
		return ['id','name','isCollide','resId','resType']
	}

	public types(){
		return ['number','string','number','string','number']
	}
}
window["ZhaoHuanWuConfig"] = ZhaoHuanWuConfig;

class SkillAttachConfig{
	public id:number;
	public name:string;
	public key:string;
	public buffId:number;
	public duration:number;
	public ICON:string;

	public attrs(){
		return ['id','name','key','buffId','duration','ICON']
	}

	public types(){
		return ['number','string','string','number','number','string']
	}
}
window["SkillAttachConfig"] = SkillAttachConfig;

class SkillWarTypeConfig{
	public id:number;
	public name:string;
	public key:string;

	public attrs(){
		return ['id','name','key']
	}

	public types(){
		return ['number','string','string']
	}
}
window["SkillWarTypeConfig"] = SkillWarTypeConfig;

class SkillConfig{
	public id:number;
	public name:string;
	public skillType:number;
	public job:number;
	public loop:string;
	public indexChild:number;
	public interrupt:number;
	public cooling:number;
	public readyTime:number;
	public readyType:number;
	public pauseTime:number;
	public actRangeType:string;
	public beAttacked:string;
	public groupEffect:string;
	public param:string;
	public commAttToPassive:string;
	public anger:number;
	public injuryType:number;
	public attackAngert:number;
	public moveDistance:number;
	public automaticDistance:number;
	public distance:number;
	public icon:number;
	public skillNameImage:string;
	public bigSkillNameImage:string;
	public skillEffectId:number;
	public bulletId:number;
	public openTpye:number;
	public openParam:string;
	public bufword:string;
	public type:number;
	public effectTargetCellScope:number;
	public talk:string;

	public attrs(){
		return ['id','name','skillType','job','loop','indexChild','interrupt','cooling','readyTime','readyType','pauseTime','actRangeType','beAttacked','groupEffect','param','commAttToPassive','anger','injuryType','attackAngert','moveDistance','automaticDistance','distance','icon','skillNameImage','bigSkillNameImage','skillEffectId','bulletId','openTpye','openParam','bufword','type','effectTargetCellScope','talk']
	}

	public types(){
		return ['number','string','number','number','string','number','number','number','number','number','number','string','string','string','string','string','number','number','number','number','number','number','number','string','string','number','number','number','string','string','number','number','string']
	}
}
window["SkillConfig"] = SkillConfig;

class SkillLvConfig{
	public id:number;
	public skillId:number;
	public skillLv:number;
	public upLimit:string;
	public upConsume:string;
	public force:number;
	public describe:string;

	public attrs(){
		return ['id','skillId','skillLv','upLimit','upConsume','force','describe']
	}

	public types(){
		return ['number','number','number','string','string','number','string']
	}
}
window["SkillLvConfig"] = SkillLvConfig;

class GenerateCoinConfig{
	public id:number;
	public gold:number;
	public money:number;

	public attrs(){
		return ['id','gold','money']
	}

	public types(){
		return ['number','number','number']
	}
}
window["GenerateCoinConfig"] = GenerateCoinConfig;

class ExtraCoinLevelConfig{
	public id:number;
	public bonusMoney:number;
	public bonusGoldMax:number;
	public coldTime:number;

	public attrs(){
		return ['id','bonusMoney','bonusGoldMax','coldTime']
	}

	public types(){
		return ['number','number','number','number']
	}
}
window["ExtraCoinLevelConfig"] = ExtraCoinLevelConfig;

class WarningConfig{
	public id:number;
	public Types:number;
	public iconID:string;
	public content:number;

	public attrs(){
		return ['id','Types','iconID','content']
	}

	public types(){
		return ['number','number','string','number']
	}
}
window["WarningConfig"] = WarningConfig;

class LotteryConfig{
	public id:number;
	public rewardType:number;
	public item:number;
	public showItem:number;
	public amount:number;
	public extraAmount:number;
	public rate:string;
	public extraRate:number;
	public expBook:string;

	public attrs(){
		return ['id','rewardType','item','showItem','amount','extraAmount','rate','extraRate','expBook']
	}

	public types(){
		return ['number','number','number','number','number','number','string','number','string']
	}
}
window["LotteryConfig"] = LotteryConfig;

class LotteryRedHeroConfig{
	public id:number;
	public rewardType:number;
	public item:number;
	public showItem:number;
	public amount:number;
	public extraAmount:number;
	public rate:number;
	public extraRate:number;
	public expBook:string;

	public attrs(){
		return ['id','rewardType','item','showItem','amount','extraAmount','rate','extraRate','expBook']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number','string']
	}
}
window["LotteryRedHeroConfig"] = LotteryRedHeroConfig;

class TechnologyLevelConfig{
	public id:number;
	public techId:number;
	public level:number;
	public power:number;
	public Desc:string;
	public effect:string;
	public duration:number;
	public consume:string;
	public limitTechs:string;
	public limitLv:number;

	public attrs(){
		return ['id','techId','level','power','Desc','effect','duration','consume','limitTechs','limitLv']
	}

	public types(){
		return ['number','number','number','number','string','string','number','string','string','number']
	}
}
window["TechnologyLevelConfig"] = TechnologyLevelConfig;

class TechnologyEffectConfig{
	public id:number;
	public effectDesc:string;
	public type:number;
	public subType:number;
	public valType:number;

	public attrs(){
		return ['id','effectDesc','type','subType','valType']
	}

	public types(){
		return ['number','string','number','number','number']
	}
}
window["TechnologyEffectConfig"] = TechnologyEffectConfig;

class TechnologyConfig{
	public id:number;
	public type:number;
	public row:number;
	public col:number;
	public icon:string;
	public name:number;
	public maxLevel:number;
	public openDesc:number;

	public attrs(){
		return ['id','type','row','col','icon','name','maxLevel','openDesc']
	}

	public types(){
		return ['number','number','number','number','string','number','number','number']
	}
}
window["TechnologyConfig"] = TechnologyConfig;

class CrossServerRewardConfig{
	public id:number;
	public value:number;
	public type:number;
	public reward:IItemInfo[];

	public attrs(){
		return ['id','value','type','reward']
	}

	public types(){
		return ['number','number','number','IItemInfo[]']
	}
}
window["CrossServerRewardConfig"] = CrossServerRewardConfig;

class CrossServerConstConfig{
	public id:number;
	public key:string;
	public value:string;
	public type:string;
	public name:number;

	public attrs(){
		return ['id','key','value','type','name']
	}

	public types(){
		return ['number','string','string','string','number']
	}
}
window["CrossServerConstConfig"] = CrossServerConstConfig;

class CrossServerAreaConfig{
	public id:number;
	public name:number;
	public battleMap:number;
	public garrison:string;

	public attrs(){
		return ['id','name','battleMap','garrison']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["CrossServerAreaConfig"] = CrossServerAreaConfig;

class CrossServerCityConfig{
	public id:number;
	public cityName:string;
	public cityType:number;
	public warAreaList:string;
	public cityWallList:string;
	public icon:string;

	public attrs(){
		return ['id','cityName','cityType','warAreaList','cityWallList','icon']
	}

	public types(){
		return ['number','string','number','string','string','string']
	}
}
window["CrossServerCityConfig"] = CrossServerCityConfig;

class HistoryWarStarConfig{
	public id:number;
	public oneStarConfig:number;
	public twoStarConfig:number;
	public threeStarConfig:number;
	public power:number;

	public attrs(){
		return ['id','oneStarConfig','twoStarConfig','threeStarConfig','power']
	}

	public types(){
		return ['number','number','number','number','number']
	}
}
window["HistoryWarStarConfig"] = HistoryWarStarConfig;

class HistoryWarChapterNameConfig{
	public id:number;
	public chapterName:number;

	public attrs(){
		return ['id','chapterName']
	}

	public types(){
		return ['number','number']
	}
}
window["HistoryWarChapterNameConfig"] = HistoryWarChapterNameConfig;

class HistoryWarStarRewardConfig{
	public id:number;
	public chapterId:number;
	public star:number;
	public starReward:string;

	public attrs(){
		return ['id','chapterId','star','starReward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["HistoryWarStarRewardConfig"] = HistoryWarStarRewardConfig;

class HistoryWarConfig{
	public id:number;
	public difficultyType:number;
	public resMapName:string;
	public chapterId:number;
	public level:number;
	public resRoleName:string;
	public terrainId:number;
	public terrainSceneElement:string;
	public npcTeamIds:number;
	public checkPointPos:string;
	public lockLv:number;
	public nationTypeLimit:string;
	public generalOccupationLimit:string;
	public generalInfos:string;
	public firstReward:string;
	public winReward:string;
	public maxChallengeCount:number;
	public starTwo:string;
	public starThree:string;
	public prevPointId:number;
	public nextPointId:number;

	public attrs(){
		return ['id','difficultyType','resMapName','chapterId','level','resRoleName','terrainId','terrainSceneElement','npcTeamIds','checkPointPos','lockLv','nationTypeLimit','generalOccupationLimit','generalInfos','firstReward','winReward','maxChallengeCount','starTwo','starThree','prevPointId','nextPointId']
	}

	public types(){
		return ['number','number','string','number','number','string','number','string','number','string','number','string','string','string','string','string','number','string','string','number','number']
	}
}
window["HistoryWarConfig"] = HistoryWarConfig;

class ArenaConfig{
	public id:number;
	public beforeId:number;
	public terrainId:number;
	public checkPointId:number;
	public openLevel:number;
	public background:number;
	public isBox:boolean;
	public power:number;
	public firstReward:string;
	public reward:string;

	public attrs(){
		return ['id','beforeId','terrainId','checkPointId','openLevel','background','isBox','power','firstReward','reward']
	}

	public types(){
		return ['number','number','number','number','number','number','boolean','number','string','string']
	}
}
window["ArenaConfig"] = ArenaConfig;

class WorshipRewardConfig{
	public id:number;
	public worshipType:number;
	public rank:number;
	public reward:string;
	public rankReward:string;

	public attrs(){
		return ['id','worshipType','rank','reward','rankReward']
	}

	public types(){
		return ['number','number','number','string','string']
	}
}
window["WorshipRewardConfig"] = WorshipRewardConfig;

class TurnPanelConfig{
	public id:number;
	public image:string;
	public description:string;
	public limit:string;
	public turnType:number;
	public paramId:number;
	public param:string;
	public uiRoot:string;
	public uiPath:string;

	public attrs(){
		return ['id','image','description','limit','turnType','paramId','param','uiRoot','uiPath']
	}

	public types(){
		return ['number','string','string','string','number','number','string','string','string']
	}
}
window["TurnPanelConfig"] = TurnPanelConfig;

class ModuleUseCountConfig{
	public id:number;
	public key:string;
	public name:string;
	public resetType:number;
	public useCount:number;
	public reTime:string;
	public buyMaxNum:number;
	public buildId:number;
	public buildLvCount:string;
	public goldConsume:string;

	public attrs(){
		return ['id','key','name','resetType','useCount','reTime','buyMaxNum','buildId','buildLvCount','goldConsume']
	}

	public types(){
		return ['number','string','string','number','number','string','number','number','string','string']
	}
}
window["ModuleUseCountConfig"] = ModuleUseCountConfig;

class NoticeConfig{
	public id:number;
	public name:string;
	public key:string;
	public msgType:number;
	public msg:number;

	public attrs(){
		return ['id','name','key','msgType','msg']
	}

	public types(){
		return ['number','string','string','number','number']
	}
}
window["NoticeConfig"] = NoticeConfig;

class SignUpConfig{
	public id:number;
	public doubling:boolean;
	public vip:number;
	public reward:string;
	public extraReward:string;
	public month:number;
	public day:number;

	public attrs(){
		return ['id','doubling','vip','reward','extraReward','month','day']
	}

	public types(){
		return ['number','boolean','number','string','string','number','number']
	}
}
window["SignUpConfig"] = SignUpConfig;

class TaskConditionConfig{
	public id:number;
	public taskId:number;
	public order:number;
	public title:string;
	public paramKey:number;
	public paramValue:number;
	public rewardActivity:string;
	public rewardItem:IItemInfo[];
	public turnPanel:number;

	public attrs(){
		return ['id','taskId','order','title','paramKey','paramValue','rewardActivity','rewardItem','turnPanel']
	}

	public types(){
		return ['number','number','number','string','number','number','string','IItemInfo[]','number']
	}
}
window["TaskConditionConfig"] = TaskConditionConfig;

class LivesRewardConfig{
	public id:number;
	public liveness:number;
	public Reward:string;

	public attrs(){
		return ['id','liveness','Reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["LivesRewardConfig"] = LivesRewardConfig;

class TaskConfig{
	public id:number;
	public title:string;
	public type:number;
	public activityId:number;
	public countryId:number;
	public taskType:number;
	public sort:number;
	public guideTask:number;
	public rewardOrderType:number;
	public frontTaskID:number;
	public frontLv:string;
	public frontBuild:string;
	public frontModuleOpen:number;
	public rewardDay:number;

	public attrs(){
		return ['id','title','type','activityId','countryId','taskType','sort','guideTask','rewardOrderType','frontTaskID','frontLv','frontBuild','frontModuleOpen','rewardDay']
	}

	public types(){
		return ['number','string','number','number','number','number','number','number','number','number','string','string','number','number']
	}
}
window["TaskConfig"] = TaskConfig;

class EventDataConfig{
	public id:number;
	public name:number;
	public reward:string;
	public affairType:number;
	public subAffairType:number;
	public collectionTime:number;
	public lv:number;
	public npcId:number;
	public image:string;
	public colour:number;
	public recommendForce:number;

	public attrs(){
		return ['id','name','reward','affairType','subAffairType','collectionTime','lv','npcId','image','colour','recommendForce']
	}

	public types(){
		return ['number','number','string','number','number','number','number','number','string','number','number']
	}
}
window["EventDataConfig"] = EventDataConfig;

class EventCoordinatesConfig{
	public id:number;
	public name:number;
	public cityId:number;
	public posX:number;
	public posY:number;
	public moveTime:number;
	public frequency:number;

	public attrs(){
		return ['id','name','cityId','posX','posY','moveTime','frequency']
	}

	public types(){
		return ['number','number','number','number','number','number','number']
	}
}
window["EventCoordinatesConfig"] = EventCoordinatesConfig;

class WorldWayConfig{
	public id:number;
	public start:number;
	public end:number;
	public way:string;

	public attrs(){
		return ['id','start','end','way']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["WorldWayConfig"] = WorldWayConfig;

class WorldMapConfig{
	public id:number;
	public name:number;
	public countryId:number;
	public mapId:number;
	public posX:number;
	public posY:number;
	public ThumbnailX:number;
	public ThumbnailY:number;
	public influenceX:number;
	public influenceY:number;
	public mapX:number;
	public mapY:number;
	public icon:string;
	public type:number;
	public mapCity:number;
	public battleMap:number;
	public terrain:number;
	public aroundCityId:string;
	public level:number;
	public citySkill:string;
	public time:string;
	public first:number;
	public AtackCityLv:number;
	public initCityLv:number;
	public firstinfoicon:string;
	public firstreward:string;
	public firstrewardRank1:string;
	public firstrewardRank2:string;
	public reward:string;
	public rewardicon:string;
	public description:number;
	public Ruledescription:number;
	public banner:number;
	public forbidattack:string;
	public VisibleXY:string;
	public unlockReward:string;
	public OpenTheTask:number;

	public attrs(){
		return ['id','name','countryId','mapId','posX','posY','ThumbnailX','ThumbnailY','influenceX','influenceY','mapX','mapY','icon','type','mapCity','battleMap','terrain','aroundCityId','level','citySkill','time','first','AtackCityLv','initCityLv','firstinfoicon','firstreward','firstrewardRank1','firstrewardRank2','reward','rewardicon','description','Ruledescription','banner','forbidattack','VisibleXY','unlockReward','OpenTheTask']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number','number','number','number','number','string','number','number','number','number','string','number','string','string','number','number','number','string','string','string','string','string','string','number','number','number','string','string','string','number']
	}
}
window["WorldMapConfig"] = WorldMapConfig;

class CityMadeConfig{
	public id:number;
	public cityId:number;
	public level:number;
	public sumExp:number;
	public costs:IItemInfo[];
	public time:number;
	public cityRewardType:number;
	public cityReward:number;
	public addExp:number;
	public addMilltory:IItemInfo;
	public addGeneralExp:IItemInfo;

	public attrs(){
		return ['id','cityId','level','sumExp','costs','time','cityRewardType','cityReward','addExp','addMilltory','addGeneralExp']
	}

	public types(){
		return ['number','number','number','number','IItemInfo[]','number','number','number','number','IItemInfo','IItemInfo']
	}
}
window["CityMadeConfig"] = CityMadeConfig;

class CityRewardTypeConfig{
	public id:number;
	public name:string;
	public key:string;
	public icon:string;
	public nameBuff:string;

	public attrs(){
		return ['id','name','key','icon','nameBuff']
	}

	public types(){
		return ['number','string','string','string','string']
	}
}
window["CityRewardTypeConfig"] = CityRewardTypeConfig;

class WorldMapUnlockTaskConfig{
	public id:number;
	public level:number;
	public weight:number;
	public type:number;
	public consume:string;
	public npcTeamId:number;
	public UnlockText1:number;
	public UnlockText2:number;
	public UnlockText3:number;

	public attrs(){
		return ['id','level','weight','type','consume','npcTeamId','UnlockText1','UnlockText2','UnlockText3']
	}

	public types(){
		return ['number','number','number','number','string','number','number','number','number']
	}
}
window["WorldMapUnlockTaskConfig"] = WorldMapUnlockTaskConfig;

class AttributeConfig{
	public id:number;
	public key:string;
	public name:string;
	public attributeType:number;
	public type:number;

	public attrs(){
		return ['id','key','name','attributeType','type']
	}

	public types(){
		return ['number','string','string','number','number']
	}
}
window["AttributeConfig"] = AttributeConfig;

class EffectConfig{
	public id:number;
	public description:string;
	public effectName:string;
	public effectFont:number;
	public effectFile:string;
	public isRepeat:number;
	public playTime:number;
	public scale:number;
	public offsetX:number;
	public offsetY:number;
	public anchorOffsetX:number;
	public anchorOffsetY:number;
	public spMark:number;
	public tween:number;
	public fps:number;
	public keyFrame:number;
	public testUIShow:number;

	public attrs(){
		return ['id','description','effectName','effectFont','effectFile','isRepeat','playTime','scale','offsetX','offsetY','anchorOffsetX','anchorOffsetY','spMark','tween','fps','keyFrame','testUIShow']
	}

	public types(){
		return ['number','string','string','number','string','number','number','number','number','number','number','number','number','number','number','number','number']
	}
}
window["EffectConfig"] = EffectConfig;

class GeneralConfig{
	public id:number;
	public name:number;
	public role:string;
	public nationType:number;
	public useable:number;
	public generalDescription:number;
	public skillDescription:number;
	public ourModelCode:number;
	public warPosition:string;
	public warPositionDes:number;
	public generalType:number;
	public generalOccupation:number;
	public generalOccupationDes:number;
	public armyType:number;
	public armyId:number;
	public lv:number;
	public starLevel:number;
	public qualityLevel:number;
	public collection:number;
	public fight:number;
	public attribute:string;
	public speed:number;
	public lordTomeSkill:string;
	public angerSkill:string;
	public passiveSkill:string;
	public length:number;
	public width:number;
	public itemViewId:number;
	public itemId:number;
	public soul:number;
	public sound:number;
	public skillSound:number;
	public sex:number;
	public rebirthCosts:string;

	public attrs(){
		return ['id','name','role','nationType','useable','generalDescription','skillDescription','ourModelCode','warPosition','warPositionDes','generalType','generalOccupation','generalOccupationDes','armyType','armyId','lv','starLevel','qualityLevel','collection','fight','attribute','speed','lordTomeSkill','angerSkill','passiveSkill','length','width','itemViewId','itemId','soul','sound','skillSound','sex','rebirthCosts']
	}

	public types(){
		return ['number','number','string','number','number','number','number','number','string','number','number','number','number','number','number','number','number','number','number','number','string','number','string','string','string','number','number','number','number','number','number','number','number','string']
	}
}
window["GeneralConfig"] = GeneralConfig;

class GeneralRebirthConfig{
	public id:number;
	public transform:string;

	public attrs(){
		return ['id','transform']
	}

	public types(){
		return ['number','string']
	}
}
window["GeneralRebirthConfig"] = GeneralRebirthConfig;

class GeneralLevelConfig{
	public id:number;
	public level:number;
	public exp:number;
	public isUpgrade:number;
	public consume:string;
	public playerLevel:number;
	public attribute:string;

	public attrs(){
		return ['id','level','exp','isUpgrade','consume','playerLevel','attribute']
	}

	public types(){
		return ['number','number','number','number','string','number','string']
	}
}
window["GeneralLevelConfig"] = GeneralLevelConfig;

class GeneralStarConfig{
	public id:number;
	public star:number;
	public starlevel:number;
	public starType:number;
	public soulNum:number;
	public qualityLevel:number;
	public attribute:string;

	public attrs(){
		return ['id','star','starlevel','starType','soulNum','qualityLevel','attribute']
	}

	public types(){
		return ['number','number','number','number','number','number','string']
	}
}
window["GeneralStarConfig"] = GeneralStarConfig;

class ExpBookConfig{
	public id:number;
	public exp:number;

	public attrs(){
		return ['id','exp']
	}

	public types(){
		return ['number','number']
	}
}
window["ExpBookConfig"] = ExpBookConfig;

class GeneralShowConfig{
	public id:number;
	public AttriId:number;

	public attrs(){
		return ['id','AttriId']
	}

	public types(){
		return ['number','number']
	}
}
window["GeneralShowConfig"] = GeneralShowConfig;

class PlayerHeadConfig{
	public id:number;
	public type:number;
	public name:number;
	public description:string;

	public attrs(){
		return ['id','type','name','description']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["PlayerHeadConfig"] = PlayerHeadConfig;

class PlayerExpConfig{
	public id:number;
	public playerLevel:number;
	public playerExp:number;

	public attrs(){
		return ['id','playerLevel','playerExp']
	}

	public types(){
		return ['number','number','number']
	}
}
window["PlayerExpConfig"] = PlayerExpConfig;

class PatrolTalkConfig{
	public id:number;
	public description:number;
	public lowLevel:number;
	public heightLevel:number;

	public attrs(){
		return ['id','description','lowLevel','heightLevel']
	}

	public types(){
		return ['number','number','number','number']
	}
}
window["PatrolTalkConfig"] = PatrolTalkConfig;

class NoviceMapConfig{
	public id:number;
	public name:number;
	public posX:number;
	public posY:number;
	public type:number;
	public terrain:number;
	public guide_id:number;
	public Status:number;
	public guideId:number;
	public country:number;

	public attrs(){
		return ['id','name','posX','posY','type','terrain','guide_id','Status','guideId','country']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number','number','number']
	}
}
window["NoviceMapConfig"] = NoviceMapConfig;

class GuideConfig{
	public id:number;
	public type:number;
	public params:string;
	public sceneId:number;

	public attrs(){
		return ['id','type','params','sceneId']
	}

	public types(){
		return ['number','number','string','number']
	}
}
window["GuideConfig"] = GuideConfig;

class GuideStepConfig{
	public id:number;
	public guideId:number;
	public condition:string;
	public param:number;
	public actType:number;
	public actParam:number;
	public uiRoot:string;
	public uiPath:string;
	public desParam:number;

	public attrs(){
		return ['id','guideId','condition','param','actType','actParam','uiRoot','uiPath','desParam']
	}

	public types(){
		return ['number','number','string','number','number','number','string','string','number']
	}
}
window["GuideStepConfig"] = GuideStepConfig;

class GuideDialogConfig{
	public id:number;
	public generalId:string;
	public name:number;
	public type:number;
	public dialog:number;
	public sound:string;

	public attrs(){
		return ['id','generalId','name','type','dialog','sound']
	}

	public types(){
		return ['number','string','number','number','number','string']
	}
}
window["GuideDialogConfig"] = GuideDialogConfig;

class FirstBattleScriptConfig{
	public id:number;
	public step1:string;
	public step2:string;
	public step3:string;
	public step4:string;
	public step5:string;
	public step6:string;
	public step7:string;
	public step8:string;
	public step9:string;
	public step10:string;
	public step11:string;
	public step12:string;
	public step13:string;
	public step14:string;
	public step15:string;
	public step16:string;
	public step17:string;
	public step18:string;
	public step19:string;

	public attrs(){
		return ['id','step1','step2','step3','step4','step5','step6','step7','step8','step9','step10','step11','step12','step13','step14','step15','step16','step17','step18','step19']
	}

	public types(){
		return ['number','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string','string']
	}
}
window["FirstBattleScriptConfig"] = FirstBattleScriptConfig;

class SystemConstConfig{
	public id:number;
	public key:string;
	public value:string;
	public type:string;
	public name:number;

	public attrs(){
		return ['id','key','value','type','name']
	}

	public types(){
		return ['number','string','string','string','number']
	}
}
window["SystemConstConfig"] = SystemConstConfig;

class XiangyangEveryDayRewardConfig{
	public id:number;
	public activityId:number;
	public reward:string;

	public attrs(){
		return ['id','activityId','reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["XiangyangEveryDayRewardConfig"] = XiangyangEveryDayRewardConfig;

class XiangyangPlayerRankRewardConfig{
	public id:number;
	public activityId:number;
	public reward:string;

	public attrs(){
		return ['id','activityId','reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["XiangyangPlayerRankRewardConfig"] = XiangyangPlayerRankRewardConfig;

class XiangyangCountryRankRewardConfig{
	public id:number;
	public activityId:number;
	public countryRankCount:number;
	public reward:string;

	public attrs(){
		return ['id','activityId','countryRankCount','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["XiangyangCountryRankRewardConfig"] = XiangyangCountryRankRewardConfig;

class XiangyangPlayerBattleRewardConfig{
	public id:number;
	public activityId:number;
	public count:number;
	public reward:string;

	public attrs(){
		return ['id','activityId','count','reward']
	}

	public types(){
		return ['number','number','number','string']
	}
}
window["XiangyangPlayerBattleRewardConfig"] = XiangyangPlayerBattleRewardConfig;

class RelationConfig{
	public id:number;
	public generalId:number;
	public relationId:number;
	public level:number;
	public name:string;
	public power:number;
	public Desc:string;
	public effect:string;
	public triggerType:number;
	public triggerParameter:string;

	public attrs(){
		return ['id','generalId','relationId','level','name','power','Desc','effect','triggerType','triggerParameter']
	}

	public types(){
		return ['number','number','number','number','string','number','string','string','number','string']
	}
}
window["RelationConfig"] = RelationConfig;

class SoundConfig{
	public id:number;
	public desc:number;
	public name:string;
	public loop:boolean;

	public attrs(){
		return ['id','desc','name','loop']
	}

	public types(){
		return ['number','number','string','boolean']
	}
}
window["SoundConfig"] = SoundConfig;

class BuildingResourcesLvConfig{
	public id:number;
	public type:number;
	public lv:number;
	public value:number;
	public time:number;
	public maxRes:number;

	public attrs(){
		return ['id','type','lv','value','time','maxRes']
	}

	public types(){
		return ['number','number','number','number','number','number']
	}
}
window["BuildingResourcesLvConfig"] = BuildingResourcesLvConfig;

class BuildingCoordinateConfig{
	public id:string;
	public buildPos:string;
	public upLvOffset:string;
	public nameOffset:string;
	public iconOffset:string;

	public attrs(){
		return ['id','buildPos','upLvOffset','nameOffset','iconOffset']
	}

	public types(){
		return ['string','string','string','string','string']
	}
}
window["BuildingCoordinateConfig"] = BuildingCoordinateConfig;

class BuildingConfig{
	public id:number;
	public name:number;
	public type:number;
	public status:number;
	public openLevel:number;
	public pos:number;
	public upgrad:number;
	public TurnPanel:number;
	public rk:string;
	public rkFunction:string;
	public buildFunction:string;

	public attrs(){
		return ['id','name','type','status','openLevel','pos','upgrad','TurnPanel','rk','rkFunction','buildFunction']
	}

	public types(){
		return ['number','number','number','number','number','number','number','number','string','string','string']
	}
}
window["BuildingConfig"] = BuildingConfig;

class BuildingLevelConfig{
	public id:number;
	public buildingType:number;
	public level:number;
	public upLevelTime:number;
	public conditions:string;
	public consumes:string;
	public effectDesc:string;

	public attrs(){
		return ['id','buildingType','level','upLevelTime','conditions','consumes','effectDesc']
	}

	public types(){
		return ['number','number','number','number','string','string','string']
	}
}
window["BuildingLevelConfig"] = BuildingLevelConfig;

class BuildingTrainConfig{
	public id:number;
	public buildingType:number;
	public soldiersType:number;
	public level:number;
	public elapsedTime:number;
	public consumes:string;
	public trainlimit:number;
	public storagelimit:number;
	public buildDesc:string;

	public attrs(){
		return ['id','buildingType','soldiersType','level','elapsedTime','consumes','trainlimit','storagelimit','buildDesc']
	}

	public types(){
		return ['number','number','number','number','number','string','number','number','string']
	}
}
window["BuildingTrainConfig"] = BuildingTrainConfig;

class BuildingTypeConfig{
	public id:number;
	public name:string;
	public key:string;
	public type:number;
	public produce:number;

	public attrs(){
		return ['id','name','key','type','produce']
	}

	public types(){
		return ['number','string','string','number','number']
	}
}
window["BuildingTypeConfig"] = BuildingTypeConfig;

class ActivityOnlineTimeRewardConfig{
	public id:number;
	public minutes:number;
	public reward:string;

	public attrs(){
		return ['id','minutes','reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["ActivityOnlineTimeRewardConfig"] = ActivityOnlineTimeRewardConfig;

class BulletConfig{
	public id:number;
	public description:string;
	public disPercent:number;
	public angleOffset:number;
	public pic:string;
	public speed:number;
	public isCatapultTrack:number;
	public effect:number;
	public sound:number;
	public autoRotation:number;

	public attrs(){
		return ['id','description','disPercent','angleOffset','pic','speed','isCatapultTrack','effect','sound','autoRotation']
	}

	public types(){
		return ['number','string','number','number','string','number','number','number','number','number']
	}
}
window["BulletConfig"] = BulletConfig;

class MilitaryMeritsConfig{
	public id:number;
	public militaryMerits:number;
	public reward:string;

	public attrs(){
		return ['id','militaryMerits','reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["MilitaryMeritsConfig"] = MilitaryMeritsConfig;

class MilitaryMeritsDayLimitConfig{
	public id:number;
	public dayLimit:number;

	public attrs(){
		return ['id','dayLimit']
	}

	public types(){
		return ['number','number']
	}
}
window["MilitaryMeritsDayLimitConfig"] = MilitaryMeritsDayLimitConfig;

class MilitaryMeritsRankRewardConfig{
	public id:number;
	public rank:number;
	public reward:string;

	public attrs(){
		return ['id','rank','reward']
	}

	public types(){
		return ['number','number','string']
	}
}
window["MilitaryMeritsRankRewardConfig"] = MilitaryMeritsRankRewardConfig;

class BattleMapConfig{
	public id:number;
	public name:number;
	public tileMap:string;
	public terrain:number;
	public sound:number;

	public attrs(){
		return ['id','name','tileMap','terrain','sound']
	}

	public types(){
		return ['number','number','string','number','number']
	}
}
window["BattleMapConfig"] = BattleMapConfig;

class WarTypeConfig{
	public id:number;
	public name:string;
	public key:string;
	public combatType:number;
	public sendBegin:number;
	public autoLevelLimit:number;
	public initAuto:number;
	public quickBattle:string;

	public attrs(){
		return ['id','name','key','combatType','sendBegin','autoLevelLimit','initAuto','quickBattle']
	}

	public types(){
		return ['number','string','string','number','number','number','number','string']
	}
}
window["WarTypeConfig"] = WarTypeConfig;

class ReportTypeConfig{
	public id:number;
	public state:number;
	public createState:number;
	public reportState:number;

	public attrs(){
		return ['id','state','createState','reportState']
	}

	public types(){
		return ['number','number','number','number']
	}
}
window["ReportTypeConfig"] = ReportTypeConfig;

class TurnTableConfig{
	public id:number;
	public award:string;
	public type:number;
	public team:number;
	public rate:number;
	public rewards:string;

	public attrs(){
		return ['id','award','type','team','rate','rewards']
	}

	public types(){
		return ['number','string','number','number','number','string']
	}
}
window["TurnTableConfig"] = TurnTableConfig;

class ConsumeConfig{
	public id:number;
	public type:number;
	public times:number;
	public cost:string;
	public percent:string;

	public attrs(){
		return ['id','type','times','cost','percent']
	}

	public types(){
		return ['number','number','number','string','string']
	}
}
window["ConsumeConfig"] = ConsumeConfig;

class SoldierTypeRestraintConfig{
	public id:number;
	public name:string;
	public restraint:string;
	public probability:number;
	public value:number;

	public attrs(){
		return ['id','name','restraint','probability','value']
	}

	public types(){
		return ['number','string','string','number','number']
	}
}
window["SoldierTypeRestraintConfig"] = SoldierTypeRestraintConfig;

class DragonBonesScaleConfig{
	public id:string;
	public scale:number;

	public attrs(){
		return ['id','scale']
	}

	public types(){
		return ['string','number']
	}
}
window["DragonBonesScaleConfig"] = DragonBonesScaleConfig;

class CodeLanConfig{
	public id:number;
	public key:string;
	public value:number;

	public attrs(){
		return ['id','key','value']
	}

	public types(){
		return ['number','string','number']
	}
}
window["CodeLanConfig"] = CodeLanConfig;

class DAFConfig{
	public id:number;
	public desc:string;

	public attrs(){
		return ['id','desc']
	}

	public types(){
		return ['number','string']
	}
}
window["DAFConfig"] = DAFConfig;

class LanguageConfig{
	public id:number;
	public value:string;

	public attrs(){
		return ['id','value']
	}

	public types(){
		return ['number','string']
	}
}
window["LanguageConfig"] = LanguageConfig;

