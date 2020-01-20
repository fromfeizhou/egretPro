/** 膜拜 */
class WorshipModel {
    /**玩家各个排行榜膜拜情况 */
    private static worshipStateDic: {[key:number]:boolean}={};

    /** */
    private static worshipDataDic: {[key:number]: any}={};
    
    /**设置膜拜数据 */
    public static set worshipState(data: gameProto.IWorshipState[]){
        for (let i = 0; i < data.length; i++) {
            let info=data[i];
           this.worshipStateDic[info.worshipType]=info.canWorship;
        }
    }

    /**膜拜数据 */
    public static getStateByType(worshipType: number) {
        return this.worshipStateDic[worshipType];
    }

    /**设置膜拜数据 */
    public static set worshipData(data: gameProto.IworshipData[]){
        for (let i = 0; i < data.length; i++) {
            let info=data[i];
            if(info.worshipType == WorshipType.KING){
                this.worshipDataDic[info.worshipType]=info;
            }else if(info.worshipType == WorshipType.FIGHT_RANK){
                if(!this.worshipDataDic[WorshipType.FIGHT_RANK]) this.worshipDataDic[WorshipType.FIGHT_RANK] = [];
                this.worshipDataDic[WorshipType.FIGHT_RANK][info.rank] = info;
            }
           
        }
    }

    /**获取膜拜数据 */
    public static getWorshipData(worshipType: number, rank?: number): gameProto.IworshipData{
        if(worshipType == WorshipType.KING){
            return this.worshipDataDic[worshipType];
        }else if(worshipType == WorshipType.FIGHT_RANK && this.worshipDataDic[WorshipType.FIGHT_RANK]){
            return this.worshipDataDic[worshipType][rank];
        }
    }

    /**获取膜拜数据 */
    public static getRedStateByType(worshipType: number): number{
        if(!FunctionModel.isFunctionOpen(FunctionType.RANK)) return 0;
        let info:gameProto.S2C_COUNTRY_EMPEROR_INFO = CountryModel.getCountryEmperorInfo();
        if(info && info.nickName == RoleData.nickName ){
            return 0;
        }

        return this.worshipStateDic[worshipType]? 1:0;
    }

}