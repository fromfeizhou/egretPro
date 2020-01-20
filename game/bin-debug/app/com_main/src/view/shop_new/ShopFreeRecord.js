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
     * 免单商城
     */
    var ShopFreeRecord = /** @class */ (function (_super_1) {
        __extends(ShopFreeRecord, _super_1);
        function ShopFreeRecord(param) {
            var _this = _super_1.call(this) || this;
            _this.m_recordInfo = param;
            _this.name = ShopFreeRecord.NAME;
            _this.initApp("shop/ShopFreeRecordSkin.exml");
            return _this;
        }
        ShopFreeRecord.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        ShopFreeRecord.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        ShopFreeRecord.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ShopFreeRecord.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.SHOP_FREE_REC));
            if (!this.m_recordInfo)
                return;
            var datas = this.m_recordInfo.datas;
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var timeStr = TimerUtils.dateFormat("yyyy.MM.dd hh:mm:ss", data.time);
                var cfg = PropModel.getCfg(data.itemId);
                var color = Utils.getColorOfQuality(cfg.quality);
                var itemName = GLan(cfg.name) + '*' + data.count;
                var label = new eui.Label();
                label.size = 22;
                var relust = GCodeFromat(CLEnum.SHOP_FREE_MSG, timeStr, color, itemName);
                label.textFlow = Utils.htmlParser(relust);
                this.m_groupRecord.addChild(label);
            }
        };
        ShopFreeRecord.NAME = 'ShopFreeRecord';
        return ShopFreeRecord;
    }(com_main.CView));
    com_main.ShopFreeRecord = ShopFreeRecord;
})(com_main || (com_main = {}));
