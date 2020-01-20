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
     * 限时商城
     */
    var GiftShopView = /** @class */ (function (_super_1) {
        __extends(GiftShopView, _super_1);
        function GiftShopView(vo) {
            var _this = _super_1.call(this) || this;
            _this.m_curInfo = null; //当前数据
            _this.m_pWidgets = {};
            _this.name = GiftShopView.NAME;
            _this.giftShopVo = vo;
            _this.giftTime = vo.getCountDown();
            _this.giftId = vo.giftBagId;
            _this.initApp("activity/giftBag/GiftShopViewSkin.exml");
            return _this;
        }
        GiftShopView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GiftShopView.prototype.onDestroy = function () {
            this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            _super_1.prototype.onDestroy.call(this);
        };
        GiftShopView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.GIFTSHOP);
        };
        /**设置宽高 */
        GiftShopView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //设配
            Utils.toStageBestScaleHeigt(this.m_shopScroller);
        };
        GiftShopView.prototype.initView = function () {
            window["ta"].track('GiftWnd', { giftId: this.giftId, 'trigger_time': new Date() });
            if (this.bInit)
                return;
            this.bInit = true;
            this.m_labTime.text = '活动倒计时：' + this.getCountDown();
        };
        /**倒计时回调 */
        GiftShopView.prototype.timeCall = function () {
            if (this.giftTime < 0)
                return;
            this.giftTime--;
            this.giftTime = Math.max(0, this.giftTime);
            this.m_labTime.text = '活动倒计时：' + this.getCountDown();
        };
        GiftShopView.prototype.getCountDown = function () {
            return Utils.DateUtils.getCountDownStrBySecond(this.giftTime);
        };
        GiftShopView.prototype.getTitle = function () {
            return '限时商城';
        };
        GiftShopView.prototype.initInfoView = function (data) {
            this.refreshData(data);
        };
        GiftShopView.prototype.refreshView = function () {
        };
        GiftShopView.prototype.refreshData = function (data) {
            var res = [];
            for (var i = 0; i < data.goods.length; i++) {
                res.push({ storeId: ShopStoreIdEnum.GIFTSHOP, info: data.goods[i] });
            }
            if (this.m_pListDataProvider) {
                this.m_pListDataProvider.replaceAll(res);
            }
            else {
                this.m_pListDataProvider = new eui.ArrayCollection(res);
                this.m_List.dataProvider = this.m_pListDataProvider;
                this.m_List.itemRenderer = com_main.ShopTreasureCell;
                this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
        };
        GiftShopView.prototype.onTouchTab = function (e) {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        };
        /**=====================================================================================
       * 协议处理 begin
       * =====================================================================================
       */
        GiftShopView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_MERCHANT,
                ProtoDef.HAND_REFRESH_MERCHANT,
                ProtoDef.MERCHANT_BUY_GOODS,
            ];
        };
        /**处理协议号事件 */
        GiftShopView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: { //商店
                    if (body) {
                        this.m_curInfo = body.info;
                        this.initInfoView(body.info);
                    }
                }
                case ProtoDef.HAND_REFRESH_MERCHANT: { // 手动刷新
                    if (body) {
                        this.initInfoView(body.info);
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: { // 商城购买物品
                    var data = body;
                    if (data) {
                        if (ShopStoreIdEnum.GIFTSHOP == data.storeId) {
                            //刷新商品
                            for (var i = 0; i < this.m_pListDataProvider.source.length; i++) {
                                var item = this.m_pListDataProvider.getItemAt(i);
                                if (item.info.id == data.goodsInfo.id) {
                                    var tmp = { storeId: ShopStoreIdEnum.GIFTSHOP, info: data.goodsInfo };
                                    this.m_pListDataProvider.replaceItemAt(tmp, i);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        };
        GiftShopView.NAME = 'GiftShopView';
        return GiftShopView;
    }(com_main.CView));
    com_main.GiftShopView = GiftShopView;
})(com_main || (com_main = {}));
