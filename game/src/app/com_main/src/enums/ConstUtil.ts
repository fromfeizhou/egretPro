interface IAttCoeff {
    /**智力与血量成长系数 */
    Intel2Hp: number,
    /**统帅与血量成长系数 */
    Lead2Hp: number,
    /**武力与攻击成长系数 */
    Pow2Atk: number,
    /**智力与攻击成长系数 */
    Intel2Atk: number,
    /**武力与防御成长系数 */
    Pow2Def: number,
    /**统帅与防御成长系数 */
    Lead2Def: number,
    /**智力与兵力成长系数 */
    Intel2AHp: number,
    /**统帅与兵力成长系数 */
    Lead2AHp: number
}

class ConstUtil {
    /**获得常量配置 变量值（number） */
    public static getValue(constId: IConstEnum): number {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return Number(cfg.value);
        }
        return 0;
    }

    /**获得常量配置 变量值（string） */
    public static getString(constId: IConstEnum): string {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return cfg.value;
        }
        return "";
    }

    /**获得奖励 */
    public static getItems(constId:IConstEnum):IItemInfo[]{
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return Utils.parseCommonItemJson(cfg.value);
        }
        return []
    }

    /**获得常量配置数组(值string 注意转换) */
    public static getArray(constId: IConstEnum): Array<string> {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return JSON.parse(cfg.value);
        }
        return [];
    }

    /**获得常量配置数组(值number 注意转换) */
    public static getNumArray(constId: IConstEnum): Array<number> {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            let list = cfg.value.split(',');
            let res = [];
            for (let i = 0; i < list.length; i++) {
                res[i] = Number(list[i]);
            }
            return res;
        }
        return [];
    }

    /**获得常量配置数组(值number 注意转换)[[]] */
    public static getNumArray2(constId: IConstEnum): Array<number> {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            let valStr: string = cfg.value.replace("[[", "").replace("]]", "")
            if (!valStr)
                return [];
            let list = valStr.split(',');
            let res = [];
            for (let i = 0; i < list.length; i++) {
                res[i] = Number(list[i]);
            }
            return res;
        }
        return [];
    }
    /**获得常量配置数组(值string 注意转换) */
    public static getStringArray(constId: IConstEnum): Array<string> {
        let cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return cfg.value.split(',');
        }
        return [];
    }

     /**解析指定格式字符串 返回keyVal
	 * 格式："1_100,2_100,3_100"
     * 返回数组
	 */
    public static keyValsToNumberArray(constId: IConstEnum): IKeyVal[] {
       return StringUtils.keyValsToNumberArray(C.SystemConstConfig[constId].value)
    }


    /** 获得武将成长系数 */
    public static getGenCoeffs(): IAttCoeff {
        let res = this.getNumArray(IConstEnum.ATTRIBUTE_GROWTH_COEFFICIENT);
        return {
            Intel2Hp: res[0] / 10000, Lead2Hp: res[1] / 10000,
            Pow2Atk: res[2] / 10000, Intel2Atk: res[3] / 10000,
            Pow2Def: res[4] / 10000, Lead2Def: res[5] / 10000,
            Intel2AHp: res[6] / 10000, Lead2AHp: res[7] / 10000
        }
    }

    /**
     * 0_1,1_1,2_1
     * 获得key -value 
     * */
    public static getKeyVal(constId: IConstEnum):{ [key: number]: number }{
        let cfg = C.SystemConstConfig[constId];
        let res = {};
        if (cfg) {
            let list = cfg.value.split(',');
            for (let i = 0; i < list.length; i++) {
                let data = list[i].split('_');
                res[Number(data[0])] = Number(data[1]);
            }
        }
        return res;
    }
}