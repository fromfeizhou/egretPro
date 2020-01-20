var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TeamVo = /** @class */ (function (_super_1) {
    __extends(TeamVo, _super_1);
    function TeamVo() {
        return _super_1.call(this) || this;
    }
    TeamVo.create = function () {
        var obj = new TeamVo();
        return obj;
    };
    TeamVo.prototype.init = function (body) {
        this.parseKeys(body);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this);
    };
    /**更新数据 */
    TeamVo.prototype.update = function (body) {
        var oldId = this.cityId;
        this.parseKeys(body);
        this.cityId = body ? body.cityId : 0;
        if (oldId != this.cityId) {
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, oldId);
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this.cityId);
        }
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this);
    };
    /**解析服务器协议 */
    TeamVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, TeamVo.AttriKey);
        //部队兵力重置
        this.fight = 0;
        this.headId = 0;
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0) {
                if (this.headId == 0)
                    this.headId = data.generalId;
                var vo = GeneralModel.getOwnGeneral(data.generalId);
                data.soldierType = vo.getGeneralArmyType();
                data.level = vo.level;
                data.minSoldierMaxCount = vo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
                this.fight = vo.fight;
            }
        }
    };
    /**获取拷贝布阵信息 */
    TeamVo.prototype.cloneTeamGeneralData = function () {
        var list = [];
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            var tmpData = {
                generalId: data.generalId, position: data.position, generalLevel: data.generalLevel, generalStar: data.generalStar,
                minSoldierCount: JSON.parse(JSON.stringify(data.minSoldierCount)), minSoldierTotalCount: data.minSoldierTotalCount
            };
            list.push(tmpData);
        }
        for (var i = 0; i < 5; i++) {
            var isEmpty = true;
            ;
            for (var k = 0; k < this.teamGeneralData.length; k++) {
                var data = this.teamGeneralData[k];
                if (data.position - 1 == i) {
                    isEmpty = false;
                    break;
                }
            }
            //空位置
            if (isEmpty) {
                var tmpData = {
                    generalId: 0, position: i, generalLevel: 0, generalStar: 0,
                    minSoldierCount: [], minSoldierTotalCount: 0
                };
                list.push(tmpData);
            }
        }
        list.sort(function (a, b) {
            return a.position - b.position;
        });
        return list;
    };
    /**队伍存在武将 */
    TeamVo.prototype.hasGeneralById = function (id) {
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            if (id == this.teamGeneralData[i].generalId) {
                return true;
            }
        }
        return false;
    };
    /**是否是空队伍 */
    TeamVo.prototype.isEmptyTeam = function () {
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            if (this.teamGeneralData[i].generalId > 0) {
                return false;
            }
        }
        return true;
    };
    /**获得部队血量战力 */
    TeamVo.prototype.getTeamUiInfo = function () {
        var cur = 0, max = 0;
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            if (this.teamGeneralData[i].generalId > 0) {
                cur += this.teamGeneralData[i].minSoldierTotalCount;
                max += this.teamGeneralData[i].minSoldierMaxCount;
            }
        }
        //容错 防止0
        max = Math.max(1, max);
        return { headId: this.headId, fight: this.fight, hp: cur, maxHp: max };
    };
    /**获得移动消耗 */
    TeamVo.prototype.getMoveCost = function () {
        var cost = 0;
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            var genVo = GeneralModel.getOwnGeneral(data.generalId);
            if (genVo) {
                var cfg = genVo.getGeneralArmyConfig();
                cost += cfg.teamconsumption;
            }
        }
        return cost;
    };
    /**得到兵种当前兵，最大兵映射 */
    // public getSoliderTypeMap() {
    // 	let soliderNum = {};
    // 	soliderNum[SoldierMainType.FOOTSOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.RIDESOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.ARROWSOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.PIKEMAN] = [0, 0];
    // 	//计算兵力总和
    // 	for (let i = 0; i < this.teamGeneralData.length; i++) {
    // 		let data = this.teamGeneralData[i];
    // 		if (data.generalId > 0) {
    // 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
    // 			let armyType = genVo.getGeneralArmyType();
    // 			soliderNum[armyType][0] += Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
    // 			soliderNum[armyType][1] += genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
    // 		}
    // 	}
    // 	return soliderNum
    // }
    /**兵库补兵根据等级换算 前面的值是需要的兵力*/
    // public getSoliderLevTypeMap() {
    // 	let soliderNum = {};
    // 	soliderNum[SoldierMainType.FOOTSOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.RIDESOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.ARROWSOLDIER] = [0, 0];
    // 	soliderNum[SoldierMainType.PIKEMAN] = [0, 0];
    // 	//计算兵力总和
    // 	for (let i = 0; i < this.teamGeneralData.length; i++) {
    // 		let data = this.teamGeneralData[i];
    // 		if (data.generalId > 0) {
    // 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
    // 			let armyType = genVo.getGeneralArmyType();
    // 			// soliderNum[armyType][0] += Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
    // 			let curSolider = Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
    // 			let maxSolider = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
    // 			let needSoliderOld = maxSolider - curSolider;
    // 			let rate = Math.ceil((needSoliderOld / maxSolider) * 100);
    // 			let armyupCfig = unNull(C.ArmyUpTeamConfig[genVo.level]) ? C.ArmyUpTeamConfig[genVo.level] : C.ArmyUpTeamConfig[1];
    // 			let needSoliderNew = armyupCfig.armyNum * rate;
    // 			soliderNum[armyType][0] += needSoliderNew;
    // 			soliderNum[armyType][1] += maxSolider;
    // 		}
    // 	}
    // 	return soliderNum
    // }
    /**判断兵力是否已满根据武将等级 */
    TeamVo.prototype.isSoliderByTypeFull = function (type) {
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0 && data.soldierType == type) {
                //有一个没满就推出
                if (data.minSoldierMaxCount - data.minSoldierTotalCount > 0)
                    return false;
            }
        }
        return true;
    };
    /**武将血量是否已满 */
    TeamVo.prototype.isSoldierFull = function () {
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0) {
                //有一个没满就推出
                if (data.minSoldierMaxCount - data.minSoldierTotalCount > 0)
                    return false;
            }
        }
        return true;
    };
    /**兵力需求 */
    // public needSoldierCost() {
    // 	let gold = 0;
    // 	let price: string = ConstUtil.getString(IConstEnum.TROOP_SUPPLYMENT_PRICE);
    // 	let priceArray = price.split(",");
    // 	//计算兵力总和
    // 	for (let i = 0; i < this.teamGeneralData.length; i++) {
    // 		let data = this.teamGeneralData[i];
    // 		if (data.generalId > 0) {
    // 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
    // 			let armyType = genVo.getGeneralArmyType();
    // 			let subTroop: number = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER) - data.minSoldierTotalCount;
    // 			if (subTroop < 0) continue;
    // 			let level = MainMapModel.getSoliderBuildLvByType(armyType)//读取建筑等级
    // 			gold += Number(priceArray[level] ? priceArray[level].split("_")[1] : priceArray[priceArray.length - 1].split("_")[1]) * (subTroop / ConstUtil.getValue(IConstEnum.TRAIN_ARMY_UNIT));
    // 		}
    // 	}
    // 	return gold;
    // }
    /**武将带兵血量缺口 */
    TeamVo.prototype.getFillHpCostGold = function () {
        var armyNumMap = this.getArmyNumMap();
        var cost = 0;
        var priceMap = ConstUtil.getKeyVal(IConstEnum.TROOP_SUPPLYMENT_PRICE);
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0) {
                var level = MainMapModel.getSoliderBuildLvByType(data.soldierType); //读取建筑等级
                var price = priceMap[level] || 0.031; //单价
                var lostRate = Math.ceil((data.minSoldierMaxCount - data.minSoldierTotalCount) / data.minSoldierMaxCount * 100);
                var cfg = C.ArmyUpTeamConfig[data.level] || C.ArmyUpTeamConfig[1];
                var needFillNum = cfg.armyNum * lostRate;
                if (armyNumMap[data.soldierType] > needFillNum) {
                    armyNumMap[data.soldierType] -= needFillNum;
                    continue;
                }
                needFillNum -= armyNumMap[data.soldierType];
                armyNumMap[data.soldierType] = 0;
                cost += needFillNum * price / ConstUtil.getValue(IConstEnum.TRAIN_ARMY_UNIT);
            }
        }
        return cost;
    };
    /**判断兵库是否能补满兵*/
    TeamVo.prototype.isSoliderStorageFull = function () {
        var armyNumMap = this.getArmyNumMap();
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0) {
                var level = MainMapModel.getSoliderBuildLvByType(data.soldierType); //读取建筑等级
                var lostRate = Math.ceil((data.minSoldierMaxCount - data.minSoldierTotalCount) / data.minSoldierMaxCount * 100);
                var cfg = C.ArmyUpTeamConfig[data.level] || C.ArmyUpTeamConfig[1];
                var needFillNum = cfg.armyNum * lostRate;
                ;
                armyNumMap[data.soldierType] -= needFillNum;
                if (armyNumMap[data.soldierType] < 0)
                    return false;
            }
        }
        return true;
    };
    /**对应补兵类型 是否需要补兵 */
    TeamVo.prototype.isSoliderNeedFillByType = function (type) {
        var totalNum = TeamModel.getTroopsInfo(type).num;
        for (var i = 0; i < this.teamGeneralData.length; i++) {
            var data = this.teamGeneralData[i];
            if (data.generalId > 0 && data.soldierType == type) {
                return (data.minSoldierMaxCount - data.minSoldierTotalCount) > 0;
            }
        }
        return false;
    };
    /**获得兵营兵力 拷贝 */
    TeamVo.prototype.getArmyNumMap = function () {
        var _a;
        var armyNumMap = (_a = {},
            _a[SoldierMainType.FOOTSOLDIER] = TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num,
            _a[SoldierMainType.RIDESOLDIER] = TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num,
            _a[SoldierMainType.ARROWSOLDIER] = TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num,
            _a[SoldierMainType.PIKEMAN] = TeamModel.getTroopsInfo(SoldierMainType.PIKEMAN).num,
            _a);
        return armyNumMap;
    };
    TeamVo.prototype.onDestroy = function () {
    };
    /**属性值 */
    TeamVo.AttriKey = ["id", "order", "teamType", "state", "teamGeneralData", "cityId", "autoFill"];
    return TeamVo;
}(BaseClass));
