/**部队，单元，武将 配置 */
var UnitData = /** @class */ (function () {
    function UnitData() {
    }
    /**获取部队，单元，武将 配置 */
    // public static getConfig(type: number, tempid: number): any {
    // 	if (type == UnitType.PLAYER_GENERAL || type == UnitType.NPC_GENERAL) {
    // 		return this.getGeneralConfig(tempid);
    // 	} else if (type == UnitType.NPC_GENERAL) {
    // 		// return this.getUnitConfig(tempid);
    // 	} else if (type == UnitType.BUILDING) {
    // 	} else if (type == UnitType.BUILDING_ATTACK_PART) {
    // 	}
    // 	return null;
    // }
    // /**获取玩家武将配置 */
    // public static getGeneralConfig(tempid: number ,isGeneral = false) {
    // 	let gconfig: GeneralConfig = C.GeneralConfig[tempid];
    // 	let aconfig: ArmyConfig;
    // 	if (gconfig) {
    // 		if(isGeneral == false)
    // 		{
    // 			aconfig = C.ArmyConfig[Number(gconfig.armyId)];
    // 		}else{
    // 			aconfig = C.ArmyConfig[Number(gconfig.ourModelCode)];
    // 		}
    // 	}
    // 	return { general: gconfig, arm: aconfig };
    // }
    // /**获取NPC武将配置 */
    // public static getUnitConfig(tempid: number) {
    // 	let uconfig = C.UnitConfig[tempid];
    // 	let aconfig: ArmyConfig;
    // 	if (uconfig) aconfig = C.ArmyConfig[Number(uconfig.armId)];
    // 	if (!uconfig) {
    // 		error("UnitData:getUnitConfig--->>获取战斗单位配置表是空的，检查配置是否有此ID tempid:", tempid);
    // 	}
    // 	if (!aconfig) {
    // 		error("UnitData:getUnitConfig--->>获取兵种属性配置表是空的，检查配置是否有此ID tempid:", tempid);
    // 	}
    // 	return { unit: uconfig, arm: aconfig };
    // }
    UnitData.getSquareSoldierPositionConfig = function (sq) {
        var config = C.SquareSoldierPositionConfig[sq];
        return config;
    };
    return UnitData;
}());
