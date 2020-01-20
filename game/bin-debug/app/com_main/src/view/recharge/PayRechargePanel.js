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
    var PayRechargePanel = /** @class */ (function (_super_1) {
        __extends(PayRechargePanel, _super_1);
        function PayRechargePanel(type) {
            var _this = _super_1.call(this) || this;
            _this.activityType = type;
            _this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
            return _this;
        }
        PayRechargePanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // this.activiVo.viewState = false;
            Utils.TimerManager.remove(this.updateDownTime, this);
        };
        PayRechargePanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            this.removeEvent();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PayRechargePanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBoxRoot.visible = false;
        };
        /**初始化界面 */
        PayRechargePanel.prototype.initView = function () {
            if (this.bInit)
                return;
            var activiVo = this.getActivityVo();
            if (!activiVo)
                return;
            this.m_nActivityId = activiVo.id;
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            this.initListView();
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        };
        PayRechargePanel.prototype.updateDownTime = function () {
            var activiVo = this.getActivityVo();
            if (!activiVo)
                return;
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate) {
                Utils.TimerManager.remove(this.updateDownTime, this);
                return;
            }
            var str = Utils.DateUtils.getCountdownStrByCfg(activiVo.closeDate - curtime, 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(timeStr + "<font color=#00ff00>" + str + "</font>");
        };
        /**列表显示 */
        PayRechargePanel.prototype.initListView = function () {
            var activiVo = this.getActivityVo();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = com_main.RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            if (activiVo) {
                var cfgs = activiVo.getRechargeCfgBy();
                this.payCfg = [];
                for (var key in cfgs) {
                    if (unNull(cfgs[key])) {
                        this.payCfg.push(cfgs[key]);
                    }
                }
            }
            var res = [];
            for (var id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 1, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].level, desc: this.payCfg[id].desc, vo: activiVo });
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        };
        /**刷新显示 */
        PayRechargePanel.prototype.refreshView = function () {
            if (!this.bInit)
                return;
            var activiVo = this.getActivityVo();
            if (!activiVo)
                return;
            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        };
        /**排序 */
        PayRechargePanel.prototype.cfgsort = function (a, b) {
            var state1;
            var state2;
            if (a.vo.viewType == AcViewType.RECHARGE_SINGLE) {
                var voact = this.getActivityVo();
                state1 = voact.getRechargeOneBtnRed(a.num, a.id);
                state2 = voact.getRechargeOneBtnRed(b.num, b.id);
            }
            else if (a.vo.viewType == AcViewType.RECHARGE_ADD_UP) {
                var voact = this.getActivityVo();
                state1 = voact.getAllRechargeBtnRed(a.num, a.id);
                state2 = voact.getAllRechargeBtnRed(b.num, b.id);
            }
            else if (a.vo.viewType == AcViewType.CONSUME_GIFT) {
                var voact = this.getActivityVo();
                state1 = voact.getConsumptionBtnRed(a.num, a.id);
                state2 = voact.getConsumptionBtnRed(b.num, b.id);
            }
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
        /**获得数据 */
        PayRechargePanel.prototype.getActivityVo = function () {
            switch (this.activityType) {
                case AcViewType.RECHARGE_SINGLE:
                    return ActivityModel.getActivityVo(AcViewType.RECHARGE_SINGLE);
                case AcViewType.RECHARGE_ADD_UP:
                    return ActivityModel.getActivityVo(AcViewType.RECHARGE_ADD_UP);
                case AcViewType.CONSUME_GIFT:
                    return ActivityModel.getActivityVo(AcViewType.CONSUME_GIFT);
            }
        };
        /**设置宽高 */
        PayRechargePanel.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_scroller);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        PayRechargePanel.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.onActivityAddCharge, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.onActivitySingleCharge, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.onActivityConsumeGift, this);
        };
        /**移除事件 */
        PayRechargePanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ADD_CHARGE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_CONSUME_GIFT, this);
        };
        /**累计充值 */
        PayRechargePanel.prototype.onActivityAddCharge = function (id) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        };
        /**消费豪礼 */
        PayRechargePanel.prototype.onActivityConsumeGift = function (id) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        };
        /**单笔充值 */
        PayRechargePanel.prototype.onActivitySingleCharge = function (id) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        };
        return PayRechargePanel;
    }(com_main.CComponent));
    com_main.PayRechargePanel = PayRechargePanel;
})(com_main || (com_main = {}));
