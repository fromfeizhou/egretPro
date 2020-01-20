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
     * 系统邮件
     */
    var SystemReport = /** @class */ (function (_super_1) {
        __extends(SystemReport, _super_1);
        function SystemReport(type) {
            var _this = _super_1.call(this) || this;
            _this.name = SystemReport.NAME;
            _this.m_nType = type;
            _this.skinName = Utils.getAppSkin('mail/SystemReportSkin.exml');
            return _this;
        }
        SystemReport.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        SystemReport.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        SystemReport.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollision = new eui.ArrayCollection();
            this.m_pRewardList.itemRenderer = RewardRender;
            this.m_pRewardList.dataProvider = this.m_tCollision;
        };
        SystemReport.prototype.refresh = function (info) {
            var title = MailModel.getMailTitleById(info.id);
            this.m_labTile.text = title.title;
            this.m_lbContent.text = "       " + info.text;
            var attaches = Utils.parseCommonItemJson(info.attachment);
            if (attaches.length > 0) {
                this.currentState = 'base';
            }
            else {
                this.currentState = 'empty';
            }
            this.commitProperties();
            this.m_tCollision.removeAll();
            this.m_tCollision.replaceAll(attaches);
        };
        SystemReport.NAME = 'SystemReport';
        return SystemReport;
    }(com_main.CComponent));
    com_main.SystemReport = SystemReport;
    var RewardRender = /** @class */ (function (_super_1) {
        __extends(RewardRender, _super_1);
        function RewardRender() {
            return _super_1.call(this) || this;
        }
        RewardRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RewardRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('count');
            this.addChild(this.m_item);
        };
        RewardRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
        };
        return RewardRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
