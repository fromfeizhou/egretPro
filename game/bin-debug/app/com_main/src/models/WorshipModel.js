/** 膜拜 */
var WorshipModel = /** @class */ (function () {
    function WorshipModel() {
    }
    Object.defineProperty(WorshipModel, "worshipState", {
        /**设置膜拜数据 */
        set: function (data) {
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                this.worshipStateDic[info.worshipType] = info.canWorship;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**膜拜数据 */
    WorshipModel.getStateByType = function (worshipType) {
        return this.worshipStateDic[worshipType];
    };
    Object.defineProperty(WorshipModel, "worshipData", {
        /**设置膜拜数据 */
        set: function (data) {
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                if (info.worshipType == WorshipType.KING) {
                    this.worshipDataDic[info.worshipType] = info;
                }
                else if (info.worshipType == WorshipType.FIGHT_RANK) {
                    if (!this.worshipDataDic[WorshipType.FIGHT_RANK])
                        this.worshipDataDic[WorshipType.FIGHT_RANK] = [];
                    this.worshipDataDic[WorshipType.FIGHT_RANK][info.rank] = info;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**获取膜拜数据 */
    WorshipModel.getWorshipData = function (worshipType, rank) {
        if (worshipType == WorshipType.KING) {
            return this.worshipDataDic[worshipType];
        }
        else if (worshipType == WorshipType.FIGHT_RANK && this.worshipDataDic[WorshipType.FIGHT_RANK]) {
            return this.worshipDataDic[worshipType][rank];
        }
    };
    /**获取膜拜数据 */
    WorshipModel.getRedStateByType = function (worshipType) {
        if (!FunctionModel.isFunctionOpen(FunctionType.RANK))
            return 0;
        var info = CountryModel.getCountryEmperorInfo();
        if (info && info.nickName == RoleData.nickName) {
            return 0;
        }
        return this.worshipStateDic[worshipType] ? 1 : 0;
    };
    /**玩家各个排行榜膜拜情况 */
    WorshipModel.worshipStateDic = {};
    /** */
    WorshipModel.worshipDataDic = {};
    return WorshipModel;
}());
