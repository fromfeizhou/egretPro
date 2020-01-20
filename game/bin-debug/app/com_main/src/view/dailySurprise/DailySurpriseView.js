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
     * 每日惊喜商城
     */
    var DailySurpriseView = /** @class */ (function (_super_1) {
        __extends(DailySurpriseView, _super_1);
        function DailySurpriseView() {
            var _this = _super_1.call(this) || this;
            _this.m_resetTime = 0;
            _this.name = DailySurpriseView.NAME;
            _this.initApp("dailySurprise/DailySurpriseSkin.exml");
            return _this;
        }
        DailySurpriseView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_SURPRISE_MARKET,
            ];
        };
        DailySurpriseView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SURPRISE_MARKET: {
                    this.calcuResetTime();
                    this.refreshView();
                    break;
                }
            }
        };
        DailySurpriseView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            RankModel.clear();
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateCDTime, this);
        };
        DailySurpriseView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initView();
            Utils.toStageBestScale(this.m_pRoot);
            this.calcuResetTime();
            this.updateCDTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateCDTime, this);
        };
        /**重置结束倒计时 */
        DailySurpriseView.prototype.calcuResetTime = function () {
            var date = TimerUtils.getServerDate();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            this.m_resetTime = date.getTime() + 3600 * 24 * 1000;
        };
        /**更新倒计时时间 */
        DailySurpriseView.prototype.updateCDTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            // let str = Utils.DateUtils.getFormatBySecond((this.m_resetTime - curtime) / 1000, 4);
            // this.m_pCDTtime.text = str;
            var str = Utils.DateUtils.getActiveDownStr(this.m_resetTime - curtime, 2);
            this.m_pCDTtime.textFlow = Utils.htmlParser(str);
        };
        DailySurpriseView.prototype.initView = function () {
            this.m_MainTopNew.setTitleName(GCode(CLEnum.SHOP_DAILY_SURPRISE));
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_listItem.dataProvider = this.m_tCollections;
            this.m_listItem.itemRenderer = DailySurpriseCell;
            this.refreshView();
        };
        DailySurpriseView.prototype.refreshView = function () {
            var shopDataDic = DailySurpriseModel.shopDataDic;
            if (shopDataDic) {
                var listData = [];
                for (var i in shopDataDic) {
                    listData.push(shopDataDic[i]);
                }
                this.m_tCollections.replaceAll(listData);
            }
            this.m_labVip.visible = VipModel.isHVipGoldDis();
            this.m_labVip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY_D, VipModel.getHVipGoldLv()));
        };
        DailySurpriseView.NAME = "DailySurpriseView";
        return DailySurpriseView;
    }(com_main.CView));
    com_main.DailySurpriseView = DailySurpriseView;
    /**每日惊喜商城 购买项 */
    var DailySurpriseCell = /** @class */ (function (_super_1) {
        __extends(DailySurpriseCell, _super_1);
        function DailySurpriseCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/dailySurprise/DailySurpriseCellSkin.exml");
            _this.currentState = VipModel.isHVipGoldDis() ? "high" : "low";
            return _this;
        }
        DailySurpriseCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        DailySurpriseCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnbuy, this, this.onClickbuy);
            com_main.EventManager.addTouchScaleListener(this.m_btnbuy1, this, this.onClickbuy1);
        };
        DailySurpriseCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.initView();
        };
        DailySurpriseCell.prototype.onClickbuy = function (e) {
            var cfg = this.m_tData.rechargeConfigs;
            if (isNull(cfg)) {
                EffectUtils.showTips("商品出错...");
                return;
            }
            if (this.m_tData.buyCount >= cfg.count) {
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX));
                return;
            }
            var id = cfg.id;
            var cost = cfg.price;
            PayProxy.C2S_RECHARGE(id, cost);
        };
        DailySurpriseCell.prototype.onClickbuy1 = function (e) {
            var cfg = this.m_tData.rechargeConfigs;
            if (isNull(cfg)) {
                EffectUtils.showTips("商品出错...");
                return;
            }
            if (this.m_tData.buyCount >= cfg.count) {
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX));
                return;
            }
            var id = cfg.id;
            var cost = cfg.price;
            cost = VipModel.getHVipGoldBuyPrice(cost);
            if (VipModel.canHVipBuy(cost))
                PayProxy.C2S_GOLD_BUY(id);
        };
        DailySurpriseCell.prototype.initView = function () {
            var cfg = this.m_tData.rechargeConfigs;
            var buyCount = this.m_tData.buyCount;
            this.m_labName.text = cfg.name;
            this.m_labStock.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.AC_SHOP_LIMIT, buyCount, cfg.count));
            this.m_imgSoldOut.visible = buyCount >= cfg.count;
            this.m_labText.visible = buyCount < cfg.count;
            this.m_btnbuy.visible = buyCount >= cfg.count ? false : true;
            this.m_btnbuy.setTitleLabel(GCodeFromat(CLEnum.AC_Y, cfg.price));
            this.m_btnbuy1.visible = buyCount >= cfg.count ? false : true;
            this.m_btnbuy1.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));
            this.m_btnbuy1.setCostLabel(VipModel.getHVipGoldBuyPrice(cfg.price) + "");
            // 奖励道具
            if (isNull(cfg.reward))
                return;
            var itemInfo = Utils.parseCommonItemServ(cfg.reward);
            for (var i = 0; i < 4; i++) {
                var data = itemInfo[i];
                var item = this["m_comItem" + i];
                if (data) {
                    item.visible = true;
                    item.setItemInfo(data.itemId, data.count);
                }
                else {
                    item.visible = false;
                }
            }
        };
        return DailySurpriseCell;
    }(eui.ItemRenderer));
    com_main.DailySurpriseCell = DailySurpriseCell;
})(com_main || (com_main = {}));
