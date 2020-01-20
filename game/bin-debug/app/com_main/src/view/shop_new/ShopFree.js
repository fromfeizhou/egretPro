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
    var ShopFree = /** @class */ (function (_super_1) {
        __extends(ShopFree, _super_1);
        function ShopFree(data) {
            var _this = _super_1.call(this) || this;
            _this.m_curInfo = null; //当前数据
            _this.name = ShopFree.NAME;
            _this.m_curInfo = data.info;
            _this.initApp("shop/ShopFreeSkin.exml");
            return _this;
        }
        ShopFree.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_MERCHANT,
                ProtoDef.MERCHANT_BUY_GOODS,
            ];
        };
        /**处理协议号事件 */
        ShopFree.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: { // 获得商城信息
                    if (body) {
                        this.m_curInfo = body.info;
                        this.refreshItemView();
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: { //购买商品
                    var data = body;
                    if (data) {
                        this.refreshItemByList(data.goodsInfo);
                        Utils.open_view(TASK_UI.SHOP_FREE_SUC_PANEL, { itemId: data.goodsInfo.itemId, count: 10 });
                    }
                }
            }
        };
        ShopFree.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.FREE_SHOP_UI]);
        };
        ShopFree.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.SHOP_FREE));
            this.m_btnRecord.setTitleLabel(GCode(CLEnum.SHOP_FREE_REC));
            com_main.EventManager.addTouchScaleListener(this.m_btnRecord, this, this.onBtnRecordHandler);
            this.validateNow();
            egret.callLater(function () {
                if (_this.m_groupItems)
                    Utils.tileGroupToCenter(_this.m_groupItems, 192);
            }, this);
            // 刷新商品
            this.refreshItemView();
        };
        /**免单记录按钮 */
        ShopFree.prototype.onBtnRecordHandler = function () {
            var arr = [];
            for (var i = 1; i < 15; i++) {
                arr.push({ time: TimerUtils.getServerTime(), itemId: i, count: i + 1 });
            }
            Utils.open_view(TASK_UI.SHOP_FREE_RECORD_PANEL, { datas: arr });
        };
        // 刷新商品
        ShopFree.prototype.refreshItemView = function () {
            if (!this.m_curInfo)
                return;
            for (var i = 0; i < this.m_curInfo.goods.length; i++) {
                var goodInfo = this.m_curInfo.goods[i];
                if (i >= this.m_groupItems.numChildren) {
                    var item = new com_main.ShopFreeCell();
                    this.m_groupItems.addChild(item);
                }
                var shopCell = this.m_groupItems.getChildAt(i);
                shopCell.setShopInfo(this.m_curInfo.storeId, goodInfo);
            }
        };
        //根据列表刷新物品
        ShopFree.prototype.refreshItemByList = function (data) {
            for (var i = 0; i < this.m_groupItems.numChildren; i++) {
                var shopCell = this.m_groupItems.getChildAt(i);
                if (data.id == shopCell.goodsId) {
                    shopCell.refreshInfo(data);
                }
            }
        };
        ShopFree.NAME = 'ShopFree';
        return ShopFree;
    }(com_main.CView));
    com_main.ShopFree = ShopFree;
})(com_main || (com_main = {}));
