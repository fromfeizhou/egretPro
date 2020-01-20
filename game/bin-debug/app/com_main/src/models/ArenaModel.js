// class ArenaModel {
// 	private static _instance: ArenaModel = null;
// 	public static get Instance(){
//         if (!this._instance)
//             this._instance = new ArenaModel();
//         return this._instance;
//     }
//     /** 后端数据 - 擂台等级 */
// 	public ArenaId:number;
//     /** 后端数据 - 免费重置次数 */
//     public FreeResetTimes:number;
//     /** 后端数据 - 是否允许扫荡 */
//     public CanMoppingUp:boolean;
// }
/**过关斩将状态 */
var ArenaEnum;
(function (ArenaEnum) {
    /**当前挑战 */
    ArenaEnum[ArenaEnum["CurStage"] = 0] = "CurStage";
    /**未开锁*/
    ArenaEnum[ArenaEnum["UnPass"] = 1] = "UnPass";
    /**已通关 */
    ArenaEnum[ArenaEnum["Pass"] = 2] = "Pass";
})(ArenaEnum || (ArenaEnum = {}));
var ArenaModel = /** @class */ (function () {
    function ArenaModel() {
    }
    Object.defineProperty(ArenaModel, "arenaId", {
        get: function () {
            return this._arenaId;
        },
        set: function (id) {
            this._arenaId = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArenaModel, "freeResetTimes", {
        get: function () {
            return this._freeResetTimes;
        },
        set: function (times) {
            this._freeResetTimes = times;
            com_main.EventMgr.dispatchEvent(PassWarEvent.PASS_WAR_UPDATE_FREE, null);
        },
        enumerable: true,
        configurable: true
    });
    /**模块初始化 */
    ArenaModel.init = function () {
        this.onBattleList = [];
        this.awardLists = [];
    };
    /**清理 */
    ArenaModel.clear = function () {
        this.onBattleList = null;
        this.awardLists = null;
    };
    /**更新上阵列表 */
    ArenaModel.updateBattleList = function (list) {
        this.onBattleList = list;
    };
    /**更新领取奖励列表 */
    ArenaModel.updateAwardList = function (list) {
        this.awardLists = list;
    };
    /**传入关卡id判断是否首胜奖励 */
    ArenaModel.getAwardById = function (id) {
        var noFirst = false;
        for (var i = 0; i < this.awardLists.length; i++) {
            if (this.awardLists[i] == id) {
                noFirst = true;
            }
        }
        return noFirst;
    };
    /**获取当前挑战的最大关卡 */
    ArenaModel.getMaxId = function () {
        var max = this.awardLists[0];
        for (var i = 0; i < this.awardLists.length; i++) {
            if (this.awardLists[i] > max) {
                max = this.awardLists[i];
            }
        }
        return max;
    };
    /**领取奖励成功 */
    ArenaModel.setAwardById = function (id) {
        var index = this.awardLists.indexOf(id);
        if (index >= 0) {
            this.awardLists.splice(index, 1);
        }
    };
    /**红点判断 */
    ArenaModel.getFightLeftTimes = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARENA))
            return 0;
        return this.freeResetTimes;
    };
    return ArenaModel;
}());
