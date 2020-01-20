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
     * 商城面板相关
     */
    var ShopTreasure = /** @class */ (function (_super_1) {
        __extends(ShopTreasure, _super_1);
        function ShopTreasure(data) {
            var _this = _super_1.call(this) || this;
            _this.m_pWidgets = {};
            _this.m_curIndex = 0;
            _this.m_curInfo = null; //当前数据
            _this.m_curTime = 0;
            _this.m_coinId = 0; //消耗的货币Id
            _this.m_numMax = 0; //消耗的货币数量
            _this.m_resetTime = 0;
            _this.m_pRemainTime = 0;
            _this.name = ShopTreasure.NAME;
            _this.m_curInfo = data.info;
            _this.initApp("shop/ShopTreasureSkin.exml");
            return _this;
        }
        ShopTreasure.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_MERCHANT,
                ProtoDef.HAND_REFRESH_MERCHANT,
                ProtoDef.MERCHANT_BUY_GOODS,
            ];
        };
        /**处理协议号事件 */
        ShopTreasure.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: { // 获得商城信息
                    var data = body;
                    if (data && data.info.storeId == this.m_nStoreId) {
                        this.initView(body.info);
                    }
                    break;
                }
                case ProtoDef.HAND_REFRESH_MERCHANT: { // 手动刷新
                    var data = body;
                    if (data && data.info.storeId == this.m_nStoreId) {
                        this.initView(body.info);
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: { // 商城购买物品
                    var data = body;
                    if (data) {
                        if (this.m_nStoreId == data.storeId) {
                            //刷新商品
                            for (var i = 0; i < this.m_pListDataProvider.source.length; i++) {
                                var item = this.m_pListDataProvider.getItemAt(i);
                                if (item.info.id == data.goodsInfo.id) {
                                    var tmp = { storeId: this.m_nStoreId, info: data.goodsInfo };
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
        ShopTreasure.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateRemainTime, this);
            Utils.TimerManager.remove(this.updateCDTime, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
            if (this.m_List) {
                this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
                this.m_List = null;
            }
        };
        ShopTreasure.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.height = this.stage.stageHeight;
            /**切卡商品对应id */
            //隐藏vip商城
            if (platform.isHidePayFunc()) {
                ShopTreasure.STORE_LIST = [ShopStoreIdEnum.GENERAL, ShopStoreIdEnum.TREASURE,
                    ShopStoreIdEnum.LEGION, ShopStoreIdEnum.ARENA, ShopStoreIdEnum.CONQUER, ShopStoreIdEnum.EXPLOIT, ShopStoreIdEnum.HONORSHOP];
            }
            else {
                ShopTreasure.STORE_LIST = [ShopStoreIdEnum.GENERAL, ShopStoreIdEnum.TREASURE,
                    ShopStoreIdEnum.LEGION, ShopStoreIdEnum.ARENA, ShopStoreIdEnum.NOBLE, ShopStoreIdEnum.CONQUER, ShopStoreIdEnum.EXPLOIT, ShopStoreIdEnum.HONORSHOP];
            }
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_WJ) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_ZB) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_LM) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_JJ) });
            if (!platform.isHidePayFunc())
                this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_GZ) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.SHOP_TAB_ZJ) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.EXPLOIT_TAB_ZG) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.HONOR_SHOP) });
            this.m_comTabGroup.setChangeCallback(this.onTabBtnClick, this);
            com_main.EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickRefresh);
            com_main.EventManager.addTouchScaleListener(this.m_btnVip, this, this.onClickRefresh);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
            this.validateNow();
            // 初始化界面
            // this.m_nStoreId = ShopTreasure.STORE_LIST[this.m_curIndex];
            this.initView(this.m_curInfo);
            this.refreshTime();
            //设配
            Utils.toStageBestScaleHeigt(this.m_pAllGroup);
            this.calcuResetTime();
            this.updateCDTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateCDTime, this);
        };
        ShopTreasure.prototype.initView = function (data) {
            this.m_curInfo = data;
            if (!this.m_curInfo)
                return;
            var index = ShopTreasure.STORE_LIST.indexOf(data.storeId);
            this.m_curIndex = index;
            this.m_comTabGroup.m_tabBtn.selectedIndex = this.m_curIndex;
            var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
            this.changeStoreId(storeId);
            this.refreshTime();
            this.refreshData(data);
        };
        ShopTreasure.prototype.changeStoreId = function (storeId) {
            if (this.m_nStoreId != storeId) {
                this.m_nStoreId = storeId;
                switch (storeId) {
                    case ShopStoreIdEnum.LEGION: //联盟商店
                        this.m_MainTopNew.setResources([PropEnum.GUILD_POINT]);
                        break;
                    case ShopStoreIdEnum.ARENA: //竞技商店
                        this.m_MainTopNew.setResources([PropEnum.PVP_MEDAL]);
                        break;
                    case ShopStoreIdEnum.CONQUER: //过关斩将商店
                        this.m_MainTopNew.setResources([PropEnum.CONQUER]);
                        break;
                    case ShopStoreIdEnum.GENERAL: //武将商店
                        this.m_MainTopNew.setResources([PropEnum.BOSSSCORE]);
                        break;
                    case ShopStoreIdEnum.EXPLOIT: //功勋商城
                        this.m_MainTopNew.setResources([PropEnum.MILITARY_MERITS_CONSUMED]);
                        break;
                    case ShopStoreIdEnum.HONORSHOP: //荣誉商城
                        this.m_MainTopNew.setResources([PropEnum.HONOR]);
                        break;
                    default:
                        this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.FOOD, PropEnum.WOOD, PropEnum.IRON]);
                        break;
                }
                if (storeId == ShopStoreIdEnum.NOBLE) {
                    this.currentState = 'vip';
                }
                else if (storeId == ShopStoreIdEnum.EXPLOIT || storeId == ShopStoreIdEnum.HONORSHOP) {
                    this.currentState = 'ploit';
                }
                else {
                    this.currentState = 'nor';
                }
                this.commitProperties();
            }
        };
        /**切卡按钮点击 */
        ShopTreasure.prototype.onTabBtnClick = function (selectedIndex) {
            this.m_curIndex = selectedIndex;
            this.m_shopScroller.stopAnimation();
            this.m_shopScroller.viewport.scrollV = 0;
            var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
            this.changeStoreId(storeId);
            ShopProxy.send_GET_MERCHANT(storeId);
        };
        ShopTreasure.prototype.calcuResetTime = function () {
            var cur = new Date();
            cur.setHours(0);
            cur.setMinutes(0);
            cur.setSeconds(0);
            var day = cur.getDay();
            this.m_resetTime = cur.getTime() + (8 - day) * 3600 * 24 * 1000;
        };
        /** 更新倒计时时间*/
        ShopTreasure.prototype.updateCDTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            var str = Utils.DateUtils.getCountdownStrByCfg(this.m_resetTime - curtime, 1);
            this.m_pCDTtime.text = str;
        };
        /**刷新 */
        ShopTreasure.prototype.onClickRefresh = function () {
            if (this.m_nStoreId == ShopStoreIdEnum.NOBLE) {
                var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
                ShopProxy.send_HAND_REFRESH_MERCHANT(storeId);
            }
            else {
                if (PropModel.isItemEnough(this.m_coinId, this.m_numMax, 1)) {
                    var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
                    ShopProxy.send_HAND_REFRESH_MERCHANT(storeId);
                }
            }
        };
        /**充值完成刷新*/
        ShopTreasure.prototype.refreshRechargeView = function () {
            if (this.m_nStoreId == ShopStoreIdEnum.NOBLE) {
                this.m_pListDataProvider.refresh();
            }
        };
        ShopTreasure.prototype.onClickBack = function () {
            com_main.UpManager.history();
        };
        ShopTreasure.prototype.refreshTime = function () {
            var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
            // let cfg = C.StorePropertyConfig[storeId];
            var coienm = Utils.parseCommonItemServSingle(this.m_curInfo.coumses);
            this.m_coinId = coienm.itemId; //消耗的货币ID
            this.m_numMax = coienm.count; //消耗的货币ID//消耗的货币数量
            var Refresh = this.m_curInfo.autoRefresh;
            if (Refresh.length <= 0) { //是否自动刷新
                return;
            }
            var timeArr = [];
            for (var i in Refresh) {
                var h = Refresh[i].key, m = Refresh[i].value;
                var date = new Date(TimerUtils.getServerTimeMill());
                date.setHours(h, m, 0, 0);
                timeArr.push(date.getTime());
            }
            var nowTime = TimerUtils.getServerTimeMill();
            this.resetTime = Refresh[0].key;
            // this.m_labReset.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_RUSH_RESET, this.resetTime));
            this.m_curTime = timeArr[0]; //目标时间
            for (var i = 1; i < timeArr.length; i++) {
                this.m_curTime = timeArr[i];
                if (this.m_curTime > nowTime) {
                    break;
                }
            }
            var btnPicStr = RoleData.GetMaterialIconPathById(this.m_coinId); //按钮显示资源图片路径
            this.m_comCostTextButton.setCostImg(btnPicStr);
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.SHOP_RUSH_NOW));
            this.m_comCostTextButton.setCostLabel(this.m_numMax + "");
            this.m_refreshTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_RUSH_DES, TimerUtils.dateFormat("hh:mm:ss", this.m_curTime / 1000)));
            Utils.TimerManager.remove(this.updateRemainTime, this);
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
        };
        ShopTreasure.prototype.refreshData = function (data) {
            var refreshNumstr = data.refreshNum > 0 ? data.refreshNum : "0";
            this.m_surplus.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_RUSH_LEFT1, data.refreshNum));
            var items = data.goods;
            var consumeType = 1;
            this.m_btnVip.visible = false;
            this.m_pTimeRoot.visible = false;
            if (this.m_nStoreId == ShopStoreIdEnum.NOBLE) {
                this.m_comCostTextButton.visible = false;
                this.labRefresh(data.freeRefreshNum);
                this.m_btnVip.visible = data.freeRefreshNum <= 0 ? false : true;
                this.m_btnVip.setTitleLabel(GCode(CLEnum.SHOP_RUSH_FREE));
            }
            else {
                data.refreshNum > 0 ? Utils.isGray(false, this.m_comCostTextButton) : Utils.isGray(true, this.m_comCostTextButton);
                this.m_comCostTextButton.touchEnabled = data.refreshNum > 0 ? true : false;
                this.m_comCostTextButton.touchChildren = data.refreshNum > 0 ? true : false;
                this.m_comCostTextButton.visible = data.refreshNum > 0 ? true : false;
            }
            data.goods.sort(function (a, b) {
                if (a.vipLevel != b.vipLevel)
                    return a.vipLevel - b.vipLevel;
                return a.id - b.id;
            });
            var res = [];
            for (var i = 0; i < data.goods.length; i++) {
                res.push({ storeId: this.m_nStoreId, info: data.goods[i] });
            }
            if (this.m_pListDataProvider) {
                this.m_pListDataProvider.replaceAll(res);
            }
            else {
                this.m_pListDataProvider = new eui.ArrayCollection(res);
                this.m_List.dataProvider = this.m_pListDataProvider;
                this.m_List.itemRenderer = ShopTreasureCell;
                this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
        };
        /**贵族免费次数刷新 */
        ShopTreasure.prototype.labRefresh = function (free) {
            free = free <= 0 ? 0 : free;
            this.m_labReset.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_RUSH_RESET, this.resetTime));
            this.m_surplus.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_RUSH_FREE1, free));
        };
        ShopTreasure.prototype.onTouchTab = function (e) {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        };
        ShopTreasure.prototype.updateRemainTime = function () {
            var time = Math.floor((TimerUtils.getServerTimeMill() - this.m_curTime) / 1000);
            if (time == 0 || time == 1) {
                Utils.TimerManager.remove(this.updateRemainTime, this);
                var storeId = ShopTreasure.STORE_LIST[this.m_curIndex];
                ShopProxy.send_GET_MERCHANT(storeId);
            }
        };
        ShopTreasure.NAME = 'ShopTreasure';
        return ShopTreasure;
    }(com_main.CView));
    com_main.ShopTreasure = ShopTreasure;
    var ShopTreasureCell = /** @class */ (function (_super_1) {
        __extends(ShopTreasureCell, _super_1);
        function ShopTreasureCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            return _this;
        }
        ShopTreasureCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnbuy, this, this.onClickbuy);
            // this.cacheAsBitmap = true;
        };
        ShopTreasureCell.prototype.onClickbuy = function (e) {
            var info = this.m_tData.info;
            if (RoleData.vipLevel < info.vipLevel) {
                Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
                return;
            }
            var cost = Utils.parseCommonItemServSingle(info.coumses);
            var price = Math.ceil(cost.count * info.discount / 100);
            var str = RoleData.getTipsisbeyond(cost.itemId, price);
            if (info.stock > 1) {
                str == "" ? Utils.open_view(TASK_UI.SHOP_BUY_DLG_PANEL, this.m_tData) : EffectUtils.showTips(str, 1, true);
            }
            else {
                str == "" ? ShopProxy.send_MERCHANT_BUY_GOODS(this.m_tData.storeId, info.id, 1) : EffectUtils.showTips(str, 1, true);
            }
        };
        ShopTreasureCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ShopTreasureCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            var info = this.m_tData.info;
            var name = Utils.getItemName(info.itemId);
            this.m_ComItem.setItemInfo(info.itemId, info.ondGroupCount);
            var data = { title: '', des: name };
            // CTipsManager.addTips(this, { type: TipsEnum.Normal, param: data });
            if (info.stock > 0) {
                this.m_imgSoldOut.visible = false;
                this.m_btnbuy.visible = true;
                this.m_btnbuy.setTitleLabel(GCode(CLEnum.BUY));
                if (this.m_tData.storeId == ShopStoreIdEnum.NOBLE) {
                    var btnStr = RoleData.vipLevel >= info.vipLevel ? GCode(CLEnum.BUY) : GCodeFromat(CLEnum.SHOP_VIP_LIMIT, info.vipLevel);
                    this.m_btnbuy.setTitleLabel(btnStr);
                }
            }
            else {
                this.m_imgSoldOut.visible = true;
                this.m_btnbuy.visible = false;
            }
            var cost = Utils.parseCommonItemServSingle(info.coumses);
            Utils.setPropLabName(info.itemId, this.propName);
            this.m_stock.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_BUY_LIMIT, info.stock, info.stockMax));
            this.m_discount.text = GCodeFromat(CLEnum.SHOP_DISCOUNT, info.discount / 10);
            this.m_discountbg.source = (info.discount / 10) >= 5 ? "border_1040_png" : "border_1032_png";
            this.m_discountGroup.visible = info.discount == 100 ? false : true;
            this.m_unDiscountGroup.visible = info.discount == 100 ? true : false;
            this.m_oldPlace.text = cost.count.toString();
            this.m_pCostIcon.source = RoleData.GetMaterialIconPathById(cost.itemId);
            this.m_pLbCost.text = "" + Math.ceil(cost.count * info.discount / 100);
            this.m_pCostIcon0.source = RoleData.GetMaterialIconPathById(cost.itemId);
            this.m_pLbCost0.text = "" + Math.ceil(cost.count * info.discount / 100);
            this.m_line.width = this.m_oldPlace.width + 13;
        };
        return ShopTreasureCell;
    }(eui.ItemRenderer));
    com_main.ShopTreasureCell = ShopTreasureCell;
})(com_main || (com_main = {}));
