var ItfSiegeKill = /** @class */ (function () {
    function ItfSiegeKill() {
    }
    return ItfSiegeKill;
}());
/**建筑状态 */
var BuildEffectType;
(function (BuildEffectType) {
    BuildEffectType[BuildEffectType["NONE"] = 0] = "NONE";
    BuildEffectType[BuildEffectType["NOT_TO_ATTACK"] = 1] = "NOT_TO_ATTACK";
    BuildEffectType[BuildEffectType["CAN_ATTACK"] = 2] = "CAN_ATTACK";
    BuildEffectType[BuildEffectType["BE_ATTACK"] = 3] = "BE_ATTACK";
    BuildEffectType[BuildEffectType["ORTHER_ATTACK"] = 4] = "ORTHER_ATTACK";
    BuildEffectType[BuildEffectType["ATTACK"] = 5] = "ATTACK";
    BuildEffectType[BuildEffectType["DEFEND"] = 6] = "DEFEND";
    BuildEffectType[BuildEffectType["BuildING"] = 7] = "BuildING";
    BuildEffectType[BuildEffectType["Raid"] = 8] = "Raid";
})(BuildEffectType || (BuildEffectType = {}));
/**
 * 解锁枚举
 */
var WorldLockTaskType;
(function (WorldLockTaskType) {
    WorldLockTaskType[WorldLockTaskType["SOURCE"] = 1] = "SOURCE";
    WorldLockTaskType[WorldLockTaskType["FIGHT"] = 2] = "FIGHT";
})(WorldLockTaskType || (WorldLockTaskType = {}));
/**
 * 解锁任务阶段
 */
var WorldLockTaskStep;
(function (WorldLockTaskStep) {
    WorldLockTaskStep[WorldLockTaskStep["STATR"] = 1] = "STATR";
    WorldLockTaskStep[WorldLockTaskStep["FINISH"] = 2] = "FINISH";
})(WorldLockTaskStep || (WorldLockTaskStep = {}));
/**世界事件类型 */
var WorldEventType;
(function (WorldEventType) {
    WorldEventType[WorldEventType["NONE"] = 0] = "NONE";
    WorldEventType[WorldEventType["RES_COLLECT"] = 1] = "RES_COLLECT";
    WorldEventType[WorldEventType["RES_GATHER"] = 2] = "RES_GATHER";
    WorldEventType[WorldEventType["FIGHT"] = 3] = "FIGHT";
    WorldEventType[WorldEventType["VISIT"] = 4] = "VISIT";
    WorldEventType[WorldEventType["MOVE"] = 100] = "MOVE";
})(WorldEventType || (WorldEventType = {}));
/**世界事件枚举
 */
var WorldEventResType;
(function (WorldEventResType) {
    WorldEventResType[WorldEventResType["FOOD"] = 1] = "FOOD";
    WorldEventResType[WorldEventResType["IRON"] = 2] = "IRON";
    WorldEventResType[WorldEventResType["SLIVER"] = 3] = "SLIVER";
    WorldEventResType[WorldEventResType["WOOD"] = 4] = "WOOD";
    WorldEventResType[WorldEventResType["WUGUAN"] = 5] = "WUGUAN";
    WorldEventResType[WorldEventResType["YINSHI"] = 6] = "YINSHI";
})(WorldEventResType || (WorldEventResType = {}));
/**
 * 城池类型
 */
var CityType;
(function (CityType) {
    CityType[CityType["COMMON"] = 0] = "COMMON";
    CityType[CityType["KIING_BATTLE"] = 1] = "KIING_BATTLE";
    CityType[CityType["BIRTH"] = 2] = "BIRTH";
    CityType[CityType["EMPEROR_BATTLE"] = 3] = "EMPEROR_BATTLE";
    CityType[CityType["XIANG_GATE"] = 4] = "XIANG_GATE";
    CityType[CityType["XIANG_HALL"] = 5] = "XIANG_HALL";
    CityType[CityType["XIANG_BIRTH"] = 6] = "XIANG_BIRTH";
})(CityType || (CityType = {}));
var CityLevel;
(function (CityLevel) {
    CityLevel[CityLevel["CAPITAL"] = 1] = "CAPITAL";
    CityLevel[CityLevel["TOWN"] = 2] = "TOWN";
    CityLevel[CityLevel["COUNTY"] = 3] = "COUNTY";
})(CityLevel || (CityLevel = {}));
/**城池武将建造状态 */
var CityBuildEnum;
(function (CityBuildEnum) {
    CityBuildEnum[CityBuildEnum["DONE"] = 1] = "DONE";
    CityBuildEnum[CityBuildEnum["FREE"] = 2] = "FREE";
    CityBuildEnum[CityBuildEnum["BUILDING"] = 3] = "BUILDING";
})(CityBuildEnum || (CityBuildEnum = {}));
;
