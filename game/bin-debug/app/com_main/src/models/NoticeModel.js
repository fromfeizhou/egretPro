/**
 * 公告模块
**/
var NoticeModel = /** @class */ (function () {
    function NoticeModel() {
    }
    /**获得公告文本 */
    NoticeModel.getMsg = function (id, param) {
        var cfg = C.NoticeConfig[id];
        if (!cfg)
            return null;
        var base = GLan(cfg.msg);
        switch (id) {
            case INoticeEnum.GEN_CARD:
                return this.getGenCardMsg(base, param);
            case INoticeEnum.GEM_HIGH:
            case INoticeEnum.GET_TREASURE:
                return this.getItemMsg(base, param);
            default:
                return Utils.getLanguageFormat.apply(Utils, [base].concat(param));
        }
    };
    /**获得武将解析 */
    NoticeModel.getGenCardMsg = function (base, data) {
        var player = data[0], generalId = data[1];
        var cfg = C.GeneralConfig[Number(generalId)];
        if (cfg) {
            // let name = this.getColorStr(GLan(cfg.name), cfg.qualityLevel);
            var color = Utils.getColorOfQuality(cfg.qualityLevel);
            var name_1 = GLan(cfg.name);
            return Utils.getLanguageFormat(base, player, color, name_1);
        }
    };
    /**获得宝石解析 */
    NoticeModel.getItemMsg = function (base, data) {
        var player = data[0], itemId = data[1];
        var cfg = C.ItemConfig[Number(itemId)];
        var name = this.getColorStr(GLan(cfg.name), cfg.quality);
        return Utils.getLanguageFormat(base, player, name);
    };
    /**获得品质颜色字符串 */
    NoticeModel.getColorStr = function (str, quality) {
        return "<font color = " + Utils.getColorOfQuality(quality) + ">" + str + "</font>";
    };
    return NoticeModel;
}());
