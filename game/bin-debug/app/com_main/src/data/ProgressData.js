var ProgressData = /** @class */ (function () {
    function ProgressData() {
    }
    ProgressData.initConfig = function () {
        if (!this.m_pProConfig) {
            this.m_pProConfig = {};
            this.m_pProConfig[ProgressTypes.PT_BUILD] = this.createCfgItem(81);
            // this.m_pProConfig[ProgressTypes.PT_EXP] = this.createCfgItem(210);
            // this.m_pProConfig[ProgressTypes.PT_EXP2] = this.createCfgItem(365);
            // this.m_pProConfig[ProgressTypes.PT_BUILD_HP] = this.createCfgItem(261);
        }
    };
    /**进度条最小/最大长度 */
    ProgressData.createCfgItem = function (max, min) {
        if (min === void 0) { min = 0; }
        var item = {};
        item.min = min;
        item.max = max;
        return item;
    };
    ProgressData.loadConfig = function (type) {
        return this.m_pProConfig[type];
    };
    return ProgressData;
}());
