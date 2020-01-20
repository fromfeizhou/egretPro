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
enum ArenaEnum {
    /**当前挑战 */
    CurStage = 0,
    /**未开锁*/
    UnPass = 1,
    /**已通关 */
    Pass = 2,
}

class ArenaModel {
    /** 后端数据 - 擂台等级 */
    public static _arenaId: number;

    /** 后端数据 - 免费重置次数 */
    public static _freeResetTimes: number;

    /** 后端数据 - 是否允许扫荡 */
    public static canMoppingUp: boolean;

    /**上阵列表 */
    public static onBattleList: Array<number>;

    /**可领取奖励关卡id */
    public static awardLists: Array<number>;

    public static set arenaId(id: number) {
        this._arenaId = id;
    }

    public static get arenaId() {
        return this._arenaId;
    }

    public static set freeResetTimes(times: number) {
        this._freeResetTimes = times;
        com_main.EventMgr.dispatchEvent(PassWarEvent.PASS_WAR_UPDATE_FREE, null);
    }

    public static get freeResetTimes() {
        return this._freeResetTimes;
    }

    /**模块初始化 */
    public static init() {
        this.onBattleList = [];
        this.awardLists = [];
    }

    /**清理 */
    public static clear() {
        this.onBattleList = null;
        this.awardLists = null;
    }

    /**更新上阵列表 */
    public static updateBattleList(list) {
        this.onBattleList = list;
    }

    /**更新领取奖励列表 */
    public static updateAwardList(list) {
        this.awardLists = list;
    }
    /**传入关卡id判断是否首胜奖励 */
    public static getAwardById(id: number) {
        let noFirst: boolean = false;
        for (let i = 0; i < this.awardLists.length; i++) {
            if (this.awardLists[i] == id) {
                noFirst = true;
            }
        }
        return noFirst;
    }
    /**获取当前挑战的最大关卡 */
    public static getMaxId() {
        let max = this.awardLists[0];
        for (let i = 0; i < this.awardLists.length; i++) {
            if (this.awardLists[i] > max) {
                max=this.awardLists[i];
            }
        }
        return max;
    }
    /**领取奖励成功 */
    public static setAwardById(id: number) {
        let index = this.awardLists.indexOf(id);
        if (index >= 0) {
            this.awardLists.splice(index, 1);
        }
    }

    /**红点判断 */
    public static getFightLeftTimes() {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARENA)) return 0;

        return this.freeResetTimes;
    }

}
