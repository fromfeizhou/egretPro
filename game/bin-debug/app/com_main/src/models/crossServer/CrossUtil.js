var CrossUtil = /** @class */ (function () {
    function CrossUtil() {
    }
    /**获得常量配置 变量值（number） */
    CrossUtil.getValue = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return Number(cfg.value);
        }
        return 0;
    };
    /**获得常量配置 变量值（string） */
    CrossUtil.getString = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return cfg.value;
        }
        return "";
    };
    /**获得奖励 */
    CrossUtil.getItems = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return Utils.parseCommonItemJson(cfg.value);
        }
        return [];
    };
    /**获得常量配置数组(值string 注意转换) */
    CrossUtil.getArray = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return JSON.parse(cfg.value);
        }
        return [];
    };
    /**获得常量配置数组(值number 注意转换) */
    CrossUtil.getNumArray = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
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
    CrossUtil.getNumArray2 = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
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
    CrossUtil.getStringArray = function (constId) {
        var cfg = C.CrossServerConstConfig[constId];
        if (cfg) {
            return cfg.value.split(',');
        }
        return [];
    };
    /**解析指定格式字符串 返回keyVal
    * 格式："1_100,2_100,3_100"
    * 返回数组
    */
    CrossUtil.keyValsToNumberArray = function (constId) {
        return StringUtils.keyValsToNumberArray(C.CrossServerConstConfig[constId].value);
    };
    return CrossUtil;
}());
