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
     * 联盟商城
     */
    var LegionShopView = /** @class */ (function (_super_1) {
        __extends(LegionShopView, _super_1);
        function LegionShopView(size) {
            var _this = _super_1.call(this) || this;
            _this.m_coinId = 0; //消耗的货币Id
            _this.m_numMax = 0; //消耗的货币数量
            _this.m_curInfo = null; //当前数据
            _this.m_curTime = 0;
            _this.m_pWidgets = {};
            NodeUtils.setSize(_this, size);
            _this.name = LegionShopView.NAME;
            _this.initApp('legion/tabView/LegionShopViewSkin.exml');
            return _this;
        }
        LegionShopView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        LegionShopView.prototype.onDestroy = function () {
            this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            Utils.TimerManager.remove(this.updateRemainTime, this);
            _super_1.prototype.onDestroy.call(this);
        };
        LegionShopView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.LEGION);
            com_main.EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickRefresh);
            //设配
            Utils.toStageBestScaleHeigt(this.m_shopScroller);
            this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
        };
        LegionShopView.prototype.initView = function (data) {
            this.refreshTime();
            this.refreshData(data);
        };
        /**
         * 普通酒馆状态
         */
        LegionShopView.prototype.initNormalState = function () {
            this.validateNow();
        };
        /**商品刷新 */
        LegionShopView.prototype.onClickRefresh = function () {
            if (PropModel.isItemEnough(this.m_coinId, this.m_numMax, 1)) {
                ShopProxy.send_HAND_REFRESH_MERCHANT(ShopStoreIdEnum.LEGION);
            }
        };
        LegionShopView.prototype.refreshTime = function () {
            // let cfg = C.StorePropertyConfig[4];
            var coienm = Utils.parseCommonItemServSingle(this.m_curInfo.coumses);
            this.m_coinId = coienm.itemId; //消耗的货币ID
            this.m_numMax = coienm.count; //消耗的货币数量
            var Refresh = this.m_curInfo.autoRefresh;
            var timeArr = [];
            for (var i in Refresh) {
                var h = Refresh[i].key, m = Refresh[i].value;
                var date = new Date(TimerUtils.getServerTimeMill());
                date.setHours(h, m, 0, 0);
                timeArr.push(date.getTime());
            }
            var nowTime = TimerUtils.getServerTimeMill();
            for (var i = 1; i < timeArr.length; i++) {
                var curIndex = i;
                var preValue = timeArr[i - 1];
                var curValue = timeArr[i];
                if (nowTime > preValue && nowTime < curValue) {
                    console.log('nowTime0=', curValue);
                    this.m_curTime = curValue;
                    break;
                }
                else if (nowTime > curValue && curIndex == timeArr.length - 1) {
                    console.log('nowTime1=', timeArr[0]);
                    this.m_curTime = timeArr[0];
                    break;
                }
                else if (nowTime < preValue) {
                    this.m_curTime = preValue;
                    break;
                }
            }
            var str = [
                { text: GCode(CLEnum.SHOP_NEXT_TIME), style: { "size": 22, "textColor": 0xABB7D1 } },
                { text: TimerUtils.dateFormat("hh:mm:ss", this.m_curTime / 1000), style: { "size": 22, "textColor": 0xE9E9E6 } },
            ];
            var btnPicStr = RoleData.GetMaterialIconPathById(this.m_coinId); //按钮显示资源图片路径
            this.m_comCostTextButton.setCostImg(btnPicStr);
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.SHOP_RUSH_NOW));
            this.m_comCostTextButton.setCostLabel(this.m_numMax + "");
            this.m_refreshTime.textFlow = str;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
        };
        LegionShopView.prototype.refreshData = function (data) {
            // this.m_consumeType = [];
            data.refreshNum > 0 ? data.refreshNum = data.refreshNum : data.refreshNum = 0;
            var str = [
                { text: GCode(CLEnum.SHOP_RUSH_LEFT), style: { "size": 22, "textColor": 0x8A8A9E } },
                { text: data.refreshNum + " ", style: { "size": 22, "textColor": 0xE9E9E6 } },
            ];
            this.m_surplus.textFlow = str;
            var res = [];
            for (var i = 0; i < data.goods.length; i++) {
                res.push({ storeId: ShopStoreIdEnum.LEGION, info: data.goods[i] });
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
        LegionShopView.prototype.onTouchTab = function (e) {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        };
        LegionShopView.prototype.updateRemainTime = function () {
            var time = Math.floor((TimerUtils.getServerTimeMill() - this.m_curTime) / 1000);
            if (time == 0 || time == 1) {
                Utils.TimerManager.remove(this.updateRemainTime, this);
                ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.LEGION);
            }
        };
        /**=====================================================================================
       * 协议处理 begin
       * =====================================================================================
       */
        LegionShopView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_MERCHANT,
                ProtoDef.HAND_REFRESH_MERCHANT,
                ProtoDef.MERCHANT_BUY_GOODS,
            ];
        };
        /**处理协议号事件 */
        LegionShopView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: { //商店
                    if (body) {
                        this.m_curInfo = body.info;
                        this.initView(body.info);
                    }
                }
                case ProtoDef.HAND_REFRESH_MERCHANT: { // 手动刷新
                    if (body) {
                        this.initView(body.info);
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: { // 商城购买物品
                    var data = body;
                    if (data) {
                        if (ShopStoreIdEnum.LEGION == data.storeId) {
                            //刷新商品
                            for (var i = 0; i < this.m_pListDataProvider.source.length; i++) {
                                var item = this.m_pListDataProvider.getItemAt(i);
                                if (item.info.id == data.goodsInfo.id) {
                                    var tmp = { storeId: ShopStoreIdEnum.LEGION, info: data.goodsInfo };
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
        LegionShopView.NAME = 'LegionShopView';
        return LegionShopView;
    }(com_main.CView));
    com_main.LegionShopView = LegionShopView;
})(com_main || (com_main = {}));
