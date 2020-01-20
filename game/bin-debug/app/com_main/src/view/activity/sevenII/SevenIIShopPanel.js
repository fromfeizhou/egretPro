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
     * 新7天特惠商城
     */
    var SevenIIShopPanel = /** @class */ (function (_super_1) {
        __extends(SevenIIShopPanel, _super_1);
        function SevenIIShopPanel(actType) {
            var _this = _super_1.call(this) || this;
            _this.m_pWidgets = {};
            _this.m_curInfo = null; //当前数据
            _this.m_actType = actType;
            _this.dynamicSkinName = Utils.getAppSkin("activity/sevenII/SevenIIShopPanelSkin.exml");
            return _this;
        }
        SevenIIShopPanel.prototype.onShow = function () {
            this.addEvent();
            this.m_imgTips.source = this.m_actType == AcViewType.AC_SHOP ? 'lb_7t_dchl_png' : 'lb_7t_cjthbkcg_png';
            var vo = ActivityModel.getActivityVo(this.m_actType);
            if (vo) {
                this.m_nActivityId = vo.id;
                ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO(this.m_nActivityId);
            }
        };
        SevenIIShopPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        SevenIIShopPanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        /**监听事件 */
        SevenIIShopPanel.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnRefresh, this, this.onClickRefresh);
            this.m_pItemRoot.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO, this.storeInfo, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH, this.storeRefresh, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY, this.storeBuy, this);
        };
        /**移除事件 */
        SevenIIShopPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            if (this.m_pItemRoot) {
                this.m_pItemRoot.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY, this);
        };
        /**刷新按钮更新 */
        SevenIIShopPanel.prototype.RefreshBtn = function () {
            // let cfg = C.StorePropertyConfig[ShopStoreIdEnum.SEVENIISHOP];
            var btnStr = GCode(CLEnum.ARENA_SX) + ':' + this.m_curInfo.refreshNum + '/' + this.m_curInfo.refreshAmount;
            this.m_btnRefresh.setTitleLabel(btnStr);
        };
        /**商品刷新 */
        SevenIIShopPanel.prototype.onClickRefresh = function () {
            if (this.m_curInfo.refreshNum > 0) {
                ShopProxy.C2S_ACTIVITY_PREFERENTAIL_REFRESH(this.m_nActivityId);
                return;
            }
            EffectUtils.showTips(GCode(CLEnum.SEVENII_SHOP), 1, false);
        };
        SevenIIShopPanel.prototype.initView = function (data) {
            this.m_curInfo = data;
            var res = [];
            for (var i = 0; i < this.m_curInfo.goods.length; i++) {
                res.push({ activityId: this.m_nActivityId, storeId: this.m_nActivityId, info: this.m_curInfo.goods[i] });
            }
            if (this.m_pListData) {
                this.m_pListData.replaceAll(res);
            }
            else {
                this.m_pListData = new eui.ArrayCollection(res);
                this.m_pItemRoot.dataProvider = this.m_pListData;
                this.m_pItemRoot.itemRenderer = SevenIIShopItem;
            }
            this.RefreshBtn();
        };
        // private refreshList() {
        //     SevenIIShopPanel.ifOne = true;
        //     if (SevenIIShopPanel.ifOne) UpManager.history();
        //     SevenIIShopPanel.ifOne = false;
        //     this.initListView();
        // }
        SevenIIShopPanel.prototype.onTouchTab = function (e) {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        };
        SevenIIShopPanel.prototype.storeInfo = function (data) {
            if (data && data.info.storeId == this.m_nActivityId) {
                this.initView(data.info);
            }
        };
        SevenIIShopPanel.prototype.storeRefresh = function (data) {
            if (data && data.info.storeId == this.m_nActivityId) {
                this.initView(data.info);
            }
        };
        SevenIIShopPanel.prototype.storeBuy = function (data) {
            if (data && data.storeId == this.m_nActivityId) {
                //刷新商品
                for (var i = 0; i < this.m_pListData.source.length; i++) {
                    var item = this.m_pListData.getItemAt(i);
                    if (item.info.id == data.goodsInfo.id) {
                        var tmp = { activityId: this.m_nActivityId, storeId: this.m_nActivityId, info: data.goodsInfo };
                        this.m_pListData.replaceItemAt(tmp, i);
                        break;
                    }
                }
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_SUC), 1);
            }
        };
        return SevenIIShopPanel;
    }(com_main.DynamicComponent));
    com_main.SevenIIShopPanel = SevenIIShopPanel;
    var SevenIIShopItem = /** @class */ (function (_super_1) {
        __extends(SevenIIShopItem, _super_1);
        function SevenIIShopItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIIShopItemSkin.exml");
            return _this;
        }
        SevenIIShopItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchTapListener(this.m_btnbuy, this, this.onClickbuy);
        };
        SevenIIShopItem.prototype.onClickbuy = function (e) {
            if (!this.m_tData)
                return;
            var info = this.m_tData.info;
            var consume = Utils.parseCommonItemServSingle(info.coumses);
            var price = Math.ceil(consume.count * info.discount / 100);
            if (PropModel.isItemEnough(consume.itemId, price, 1)) {
                if (info.stock > 0) {
                    Utils.open_view(TASK_UI.SHOP_BUY_DLG_PANEL, this.m_tData);
                }
            }
        };
        SevenIIShopItem.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        SevenIIShopItem.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            var info = this.m_tData.info;
            var name = Utils.getItemName(info.itemId);
            this.m_ComItem.setItemInfo(info.itemId, info.ondGroupCount);
            var data = { title: '', des: name };
            // CTipsManager.addTips(this.m_ComItem, { type: TipsEnum.Normal, param: data });
            Utils.setPropLabName(info.itemId, this.m_labItemName);
            var str = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_BUY_LIMIT, info.stock, info.stockMax));
            this.m_labLimit.textFlow = str;
            this.m_labFold.text = GCodeFromat(CLEnum.SHOP_DISCOUNT, info.discount / 10);
            this.m_discountbg.source = (info.discount / 10) >= 5 ? "border_1040_png" : "border_1032_png";
            this.m_pFoldRoot.visible = info.discount == 100 ? false : true;
            var consume = Utils.parseCommonItemServSingle(info.coumses);
            if (info.stock > 0) {
                this.m_imgSoldOut.visible = false;
                this.m_btnbuy.visible = true;
                var price = Math.ceil(consume.count * info.discount / 100);
                this.m_btnbuy.setCostLabel(price.toString());
            }
            else {
                this.m_imgSoldOut.visible = true;
                this.m_btnbuy.visible = false;
            }
        };
        return SevenIIShopItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
