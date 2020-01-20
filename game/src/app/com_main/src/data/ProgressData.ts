class ProgressData {
    private static m_pProConfig;

    public static initConfig() {
        if (!this.m_pProConfig) {
            this.m_pProConfig = {};
            this.m_pProConfig[ProgressTypes.PT_BUILD] = this.createCfgItem(81);
            // this.m_pProConfig[ProgressTypes.PT_EXP] = this.createCfgItem(210);
            // this.m_pProConfig[ProgressTypes.PT_EXP2] = this.createCfgItem(365);
            // this.m_pProConfig[ProgressTypes.PT_BUILD_HP] = this.createCfgItem(261);
        }
    }

    /**进度条最小/最大长度 */
    public static createCfgItem(max: number, min: number = 0) {
        var item: any = {};
        item.min = min;
        item.max = max;
        return item;
    }

    public static loadConfig(type) {
        return this.m_pProConfig[type];
    }
}

