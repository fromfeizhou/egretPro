var ConstUtil = /** @class */ (function () {
    function ConstUtil() {
    }
    /**获得常量配置 变量值（number） */
    ConstUtil.getValue = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return Number(cfg.value);
        }
        return 0;
    };
    /**获得常量配置 变量值（string） */
    ConstUtil.getString = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return cfg.value;
        }
        return "";
    };
    /**获得奖励 */
    ConstUtil.getItems = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return Utils.parseCommonItemJson(cfg.value);
        }
        return [];
    };
    /**获得常量配置数组(值string 注意转换) */
    ConstUtil.getArray = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return JSON.parse(cfg.value);
        }
        return [];
    };
    /**获得常量配置数组(值number 注意转换) */
    ConstUtil.getNumArray = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            var list = cfg.value.split(',');
            var res = [];
            for (var i = 0; i < list.length; i++) {
                res[i] = Number(list[i]);
            }
            return res;
        }
        return [];
    };
    /**获得常量配置数组(值number 注意转换)[[]] */
    ConstUtil.getNumArray2 = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            var valStr = cfg.value.replace("[[", "").replace("]]", "");
            if (!valStr)
                return [];
            var list = valStr.split(',');
            var res = [];
            for (var i = 0; i < list.length; i++) {
                res[i] = Number(list[i]);
            }
            return res;
        }
        return [];
    };
    /**获得常量配置数组(值string 注意转换) */
    ConstUtil.getStringArray = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        if (cfg) {
            return cfg.value.split(',');
        }
        return [];
    };
    /**解析指定格式字符串 返回keyVal
    * 格式："1_100,2_100,3_100"
    * 返回数组
    */
    ConstUtil.keyValsToNumberArray = function (constId) {
        return StringUtils.keyValsToNumberArray(C.SystemConstConfig[constId].value);
    };
    /** 获得武将成长系数 */
    ConstUtil.getGenCoeffs = function () {
        var res = this.getNumArray(IConstEnum.ATTRIBUTE_GROWTH_COEFFICIENT);
        return {
            Intel2Hp: res[0] / 10000, Lead2Hp: res[1] / 10000,
            Pow2Atk: res[2] / 10000, Intel2Atk: res[3] / 10000,
            Pow2Def: res[4] / 10000, Lead2Def: res[5] / 10000,
            Intel2AHp: res[6] / 10000, Lead2AHp: res[7] / 10000
        };
    };
    /**
     * 0_1,1_1,2_1
     * 获得key -value
     * */
    ConstUtil.getKeyVal = function (constId) {
        var cfg = C.SystemConstConfig[constId];
        var res = {};
        if (cfg) {
            var list = cfg.value.split(',');
            for (var i = 0; i < list.length; i++) {
                var data = list[i].split('_');
                res[Number(data[0])] = Number(data[1]);
            }
        }
        return res;
    };
    return ConstUtil;
}());
