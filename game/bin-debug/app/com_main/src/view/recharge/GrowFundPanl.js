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
    var GrowFundPanl = /** @class */ (function (_super_1) {
        __extends(GrowFundPanl, _super_1);
        function GrowFundPanl(type) {
            var _this = _super_1.call(this) || this;
            _this.m_shopList = [];
            _this.activityType = type;
            _this.currentState = "recharge";
            _this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
            return _this;
        }
        GrowFundPanl.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.clearEffect();
            Utils.TimerManager.remove(this.updateDownTime, this);
        };
        GrowFundPanl.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GrowFundPanl.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBoxRoot.visible = false;
            this.m_pBtnBuy.visible = true;
            this.m_pTimeGroup.visible = false;
            com_main.EventManager.addTouchScaleListener(this.m_btnGrowBuy, this, this.onBtnBuyHandler);
        };
        /**初始化界面 */
        GrowFundPanl.prototype.initView = function () {
            if (this.bInit)
                return;
            this.activiVo = ActivityModel.getActivityVo(this.activityType);
            this.initListView();
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activityType + '_jpg');
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        };
        GrowFundPanl.prototype.updateDownTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate)
                return;
            var str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(timeStr + "<font color=#00ff00>" + str + "</font>");
        };
        /**列表显示 */
        GrowFundPanl.prototype.initListView = function () {
            this.setBtnBuyState();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = com_main.RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            //配置表初始化
            this.growfundCfg = [];
            if (this.activiVo) {
                for (var k in C.ActivityGrowthFundRewardConfig) {
                    this.growfundCfg.push(C.ActivityGrowthFundRewardConfig[k]);
                }
            }
            var res = [];
            for (var id = 0; id < this.growfundCfg.length; id++) {
                res.push({ type: 3, width: this.m_scroller.width, id: this.growfundCfg[id].id, reward: this.growfundCfg[id].reward, num: this.growfundCfg[id].playerLevel, desc: '', vo: this.activiVo });
            }
            res.sort(this.cfgsort);
            this.m_tCollection.replaceAll(res);
        };
        /**购买成长基金 */
        GrowFundPanl.prototype.onBtnBuyHandler = function (e) {
            var cfg = this.activiVo.getRechargeCfg();
            PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            // let price = this.activiVo.getRechargeCfg().price[0];
            // if (PropModel.isItemEnough(PropEnum.YU, price.value, 1)) {
            //     PayProxy.C2S_JADE_BUY(IRechargeEnum.GROW_FUN);
            //     // UpManager.history();
            // }
        };
        /**刷新显示 */
        GrowFundPanl.prototype.refreshView = function () {
            // this.activiVo = ActivityModel.getActivityVo(this.activityType);
            if (!this.bInit)
                return;
            this.m_tCollection.source.sort(this.cfgsort);
            this.m_tCollection.refresh();
            this.setBtnBuyState();
        };
        /**设置按钮状态 */
        GrowFundPanl.prototype.setBtnBuyState = function () {
            this.activiVo = ActivityModel.getActivityVo(this.activityType);
            if (this.activiVo.buyGrowthFund) {
                this.m_btnGrowBuy.otherLabel = GCode(CLEnum.BUY_ALR);
                this.m_btnGrowBuy.enabled = false;
                this.clearEffect();
            }
            else {
                this.m_btnGrowBuy.cost = this.activiVo.getRechargeCfg().price;
                this.m_btnGrowBuy.enabled = true;
                this.setEff();
            }
            Utils.isGray(this.activiVo.buyGrowthFund, this.m_btnGrowBuy);
            if (this.activiVo.buyGrowthFund) {
                this.clearEffect();
            }
            else {
                this.setEff();
            }
        };
        /**排序 */
        GrowFundPanl.prototype.cfgsort = function (a, b) {
            var state1;
            var state2;
            var voact = ActivityModel.getActivityVo(AcViewType.FUND_GROWTH);
            state1 = voact.getGrowFundBtnRed(a.num, a.id);
            state2 = voact.getGrowFundBtnRed(b.num, b.id);
            if (state1 > state2) {
                return 1;
            }
            else if (state1 < state2) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            else if (a.id < b.id) {
                return -1;
            }
            else {
                return 0;
            }
        };
        /**设置特效 */
        GrowFundPanl.prototype.setEff = function () {
            if (this.m_effect)
                return;
            this.m_effect = NormalMcMgr.createMc(IETypes.EUI_FundGrowth);
            this.m_effect.x = 118;
            this.m_effect.y = 37.5;
            this.m_effect.scaleX = 1.34;
            this.m_effect.scaleY = 1.34;
            this.m_btnGrowBuy.addChild(this.m_effect);
        };
        GrowFundPanl.prototype.clearEffect = function () {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
            }
        };
        /**设置宽高 */
        GrowFundPanl.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //适配
            Utils.toStageBestScaleHeigt(this.m_scroller);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        GrowFundPanl.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, this.onActivityGrowthFun, this);
        };
        /**移除事件 */
        GrowFundPanl.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GROWTH_FUN, this);
        };
        /**成长基金 */
        GrowFundPanl.prototype.onActivityGrowthFun = function () {
            this.refreshView();
        };
        return GrowFundPanl;
    }(com_main.CComponent));
    com_main.GrowFundPanl = GrowFundPanl;
})(com_main || (com_main = {}));
