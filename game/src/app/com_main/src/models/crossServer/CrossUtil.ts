class CrossUtil {
    /**获得常量配置 变量值（number） */
    public static getValue(constId: CrossServerConstType): number {
        let cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return Number(cfg.value);
        }
        return 0;
    }

    /**获得常量配置 变量值（string） */
    public static getString(constId: CrossServerConstType): string {
        let cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return cfg.value;
        }
        return "";
    }

    /**获得奖励 */
    public static getItems(constId:CrossServerConstType):IItemInfo[]{
        let cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return Utils.parseCommonItemJson(cfg.value);
        }
        return []
    }

    /**获得常量配置数组(值string 注意转换) */
    public static getArray(constId: CrossServerConstType): Array<string> {
        let cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return JSON.parse(cfg.value);
        }
        return [];
    }

    /**获得常量配置数组(值number 注意转换) */
    public static getNumArray(constId: CrossServerConstType): Array<number> {
        let cfg = C.CrossServerConstConfig[constId];
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
    public static getNumArray2(constId: CrossServerConstType): Array<number> {
        let cfg = C.CrossServerConstConfig[constId];
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
    public static getStringArray(constId: CrossServerConstType): Array<string> {
        let cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return cfg.value.split(',');
        }
        return [];
    }

     /**解析指定格式字符串 返回keyVal
	 * 格式："1_100,2_100,3_100"
     * 返回数组
	 */
    public static keyValsToNumberArray(constId: CrossServerConstType): IKeyVal[] {
       return StringUtils.keyValsToNumberArray(C.CrossServerConstConfig[constId].value)
    }
    
}