/**
 * 公告模块 
**/

class NoticeModel {

    /**获得公告文本 */
    public static getMsg(id: INoticeEnum, param: string[]): string {
        let cfg = C.NoticeConfig[id];
        if (!cfg) return null;
        let base: string = GLan(cfg.msg);
        switch (id) {
            case INoticeEnum.GEN_CARD:
                return this.getGenCardMsg(base, param);
            case INoticeEnum.GEM_HIGH:
            case INoticeEnum.GET_TREASURE:
                return this.getItemMsg(base,param);
            default:
                return Utils.getLanguageFormat(base, ...param);
        }
    }

    /**获得武将解析 */
    private static getGenCardMsg(base: string, data: string[]) {
        let [player, generalId] = data;
        let cfg = C.GeneralConfig[Number(generalId)]
        if (cfg) {
            // let name = this.getColorStr(GLan(cfg.name), cfg.qualityLevel);
            let color = Utils.getColorOfQuality(cfg.qualityLevel);
            let name = GLan(cfg.name);
            return Utils.getLanguageFormat(base, player, color, name);
        }

    }

    /**获得宝石解析 */
    private static getItemMsg(base: string, data: string[]) {
        let [player, itemId] = data;
        let cfg = C.ItemConfig[Number(itemId)]
        let name = this.getColorStr(GLan(cfg.name), cfg.quality);
        return Utils.getLanguageFormat(base, player, name);
    }

   

    /**获得品质颜色字符串 */
    private static getColorStr(str: string, quality: number) {
        return `<font color = ${Utils.getColorOfQuality(quality)}>${str}</font>`;
    }
}