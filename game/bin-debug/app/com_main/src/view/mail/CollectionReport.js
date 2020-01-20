var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * 邮件采集战报主面板
     */
    var CollectionReport = /** @class */ (function (_super_1) {
        __extends(CollectionReport, _super_1);
        function CollectionReport(type) {
            var _this = _super_1.call(this) || this;
            _this.name = CollectionReport.NAME;
            _this.m_nType = type;
            _this.skinName = Utils.getAppSkin('mail/CollectionReportSkin.exml');
            return _this;
        }
        CollectionReport.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CollectionReport.prototype.onDestroy = function () {
            this.clearHeadItem();
            _super_1.prototype.onDestroy.call(this);
        };
        CollectionReport.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CollectionReport.prototype.refresh = function (info) {
            var data = JSON.parse(info.text);
            var cfg = C.EventDataConfig[data.eventDataId];
            if (cfg) {
                this.m_imgIcon.source = "map_build_icon" + cfg.image + "_png";
                this.m_labLevel.text = cfg.lv.toString();
            }
            var reward = Utils.parseCommonItemJson(data.reward);
            this.m_groupReward.removeChildren();
            for (var i = 0; i < reward.length; i++) {
                var item = com_main.ComItemNew.create('count');
                NodeUtils.setScale(item, 0.9);
                item.setItemInfo(reward[i].itemId, reward[i].count);
                this.m_groupReward.addChild(item);
            }
            this.clearHeadItem();
            for (var i = 0; i < data.generalList.length; i++) {
                var info_1 = data.generalList[i];
                var genItem = com_main.GeneralHeadRender.create('base_info');
                NodeUtils.setScale(genItem, 0.8);
                genItem.setGenViewInfo(info_1.generalId, info_1.level, info_1.star, info_1.quality, info_1.generalName);
                this.m_groupArms.addChild(genItem);
            }
        };
        /**回收头像 */
        CollectionReport.prototype.clearHeadItem = function () {
            if (!this.m_groupArms)
                return;
            while (this.m_groupArms.numChildren > 0) {
                var item = this.m_groupArms.getChildAt(0);
                Utils.isGray(false, item);
                item.onDestroy();
            }
        };
        CollectionReport.NAME = 'CollectionReport';
        return CollectionReport;
    }(com_main.CComponent));
    com_main.CollectionReport = CollectionReport;
})(com_main || (com_main = {}));
