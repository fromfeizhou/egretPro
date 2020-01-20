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
     * 直购礼包
     *
     */
    var PurchageGiftBagPanel = /** @class */ (function (_super_1) {
        __extends(PurchageGiftBagPanel, _super_1);
        function PurchageGiftBagPanel(type) {
            var _this = _super_1.call(this) || this;
            _this.activityType = type;
            _this.currentState = "recharge";
            _this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
            return _this;
        }
        PurchageGiftBagPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // this.activiVo.viewState = false;
            Utils.TimerManager.remove(this.updateDownTime, this);
        };
        PurchageGiftBagPanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            this.removeEvent();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PurchageGiftBagPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBoxRoot.visible = false;
            var actvo = ActivityModel.getActivityVo(AcViewType.PURCHAGE_BAG);
        };
        /**初始化界面 */
        PurchageGiftBagPanel.prototype.initView = function () {
            if (this.bInit)
                return;
            this.initListView();
            var activiVo = this.getActivityVo();
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        };
        PurchageGiftBagPanel.prototype.updateDownTime = function () {
            var activiVo = this.getActivityVo();
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
            var str = Utils.DateUtils.getCountdownStrByCfg(activiVo.closeDate - curtime, 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(timeStr + "<font color=#00ff00>" + str + "</font>");
        };
        /**列表显示 */
        PurchageGiftBagPanel.prototype.initListView = function () {
            var activiVo = this.getActivityVo();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = com_main.RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            if (activiVo) {
                this.payCfg = activiVo.rechargeCfgs;
            }
            var res = [];
            for (var id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 2, width: this.m_scroller.width, id: this.payCfg[id].id, reward: Utils.parseCommonItemServ(this.payCfg[id].reward), num: this.payCfg[id].price, desc: this.payCfg[id].name, vo: activiVo });
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        };
        /**刷新显示 */
        PurchageGiftBagPanel.prototype.refreshView = function () {
            if (!this.bInit)
                return;
            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        };
        /**排序 */
        PurchageGiftBagPanel.prototype.cfgsort = function (a, b) {
            var activiVo = this.getActivityVo();
            var state1 = activiVo.getPurchageGiftBagBtnRed(a.id);
            var state2 = activiVo.getPurchageGiftBagBtnRed(b.id);
            if (state1 != state2) {
                return state1 - state2;
            }
            else {
                return a.id - b.id;
            }
        };
        /**获得数据 */
        PurchageGiftBagPanel.prototype.getActivityVo = function () {
            return ActivityModel.getActivityVo(AcViewType.PURCHAGE_BAG);
        };
        /**设置宽高 */
        PurchageGiftBagPanel.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //TimerHandler
            Utils.toStageBestScaleHeigt(this.m_scroller);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        PurchageGiftBagPanel.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PU_GIFT, this.onActivityMoonCard, this);
        };
        /**移除事件 */
        PurchageGiftBagPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PU_GIFT, this);
        };
        /**直购礼包刷新 */
        PurchageGiftBagPanel.prototype.onActivityMoonCard = function () {
            this.refreshView();
        };
        return PurchageGiftBagPanel;
    }(com_main.CComponent));
    com_main.PurchageGiftBagPanel = PurchageGiftBagPanel;
})(com_main || (com_main = {}));
