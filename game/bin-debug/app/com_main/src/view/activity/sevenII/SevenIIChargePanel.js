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
    var SevenIIChargePanel = /** @class */ (function (_super_1) {
        __extends(SevenIIChargePanel, _super_1);
        function SevenIIChargePanel() {
            var _this = _super_1.call(this) || this;
            _this.dynamicSkinName = Utils.getSkinName("app/activity/sevenII/SevenIIChargePanelSkin.exml");
            return _this;
        }
        SevenIIChargePanel.prototype.onShow = function () {
            this.addEvent();
            switch (this.m_type) {
                case AcViewType.RECHARGE_SINGLE_2: {
                    this.m_activiVo = this.getActivityVo(this.m_type);
                    this.m_imgIcon.source = 'lb_7t_xsdbcz_png';
                    break;
                }
                case AcViewType.RECHARGE_SINGLE_3: {
                    this.m_activiVo = this.getActivityVo(this.m_type);
                    this.m_imgIcon.source = 'lb_7t_cjczhlxs_png';
                    break;
                }
                case AcViewType.RECHARGE_ADD_UP_3: {
                    this.m_activiVo = this.getActivityVo(this.m_type);
                    this.m_imgIcon.source = 'lb_7t_ljfl_png';
                    break;
                }
                case AcViewType.RECHARGE_ADD_UP_5: {
                    this.m_activiVo = this.getActivityVo(this.m_type);
                    this.m_imgIcon.source = 'lb_7t_jsjcnnyy_png';
                    break;
                }
            }
            this.init();
        };
        SevenIIChargePanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        SevenIIChargePanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.addEvent();
        // }
        /**根据类型读取数据 */
        SevenIIChargePanel.prototype.setType = function (type) {
            this.m_type = type;
        };
        //初始化
        SevenIIChargePanel.prototype.init = function () {
            if (this.m_activiVo) {
                this.initListView();
            }
        };
        /**监听事件 */
        SevenIIChargePanel.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.refreshRechargeView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.refreshRechargeView, this);
        };
        /**移除事件 */
        SevenIIChargePanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ADD_CHARGE, this);
        };
        /**充值完成刷新单笔和累计充值 */
        SevenIIChargePanel.prototype.refreshRechargeView = function (id) {
            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        };
        /**列表显示 */
        SevenIIChargePanel.prototype.initListView = function () {
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = com_main.SevenIIChargeItem;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            if (this.m_activiVo) {
                var cfgs = this.m_activiVo.getRechargeCfgBy();
                this.payCfg = [];
                for (var key in cfgs) {
                    if (unNull(cfgs[key])) {
                        this.payCfg.push(cfgs[key]);
                    }
                }
            }
            var res = [];
            for (var id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 0, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].level, desc: this.payCfg[id].desc, vo: this.m_activiVo });
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        };
        /**排序 */
        SevenIIChargePanel.prototype.cfgsort = function (a, b) {
            var state1;
            var state2;
            if (a.vo.viewType == AcViewType.RECHARGE_SINGLE_2 || a.vo.viewType == AcViewType.RECHARGE_SINGLE_3) {
                state1 = this.m_activiVo.getRechargeOneBtnRed(a.num, a.id);
                state2 = this.m_activiVo.getRechargeOneBtnRed(b.num, b.id);
            }
            else if (a.vo.viewType == AcViewType.RECHARGE_ADD_UP_3 || a.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) {
                state1 = this.m_activiVo.getAllRechargeBtnRed(a.num, a.id);
                state2 = this.m_activiVo.getAllRechargeBtnRed(b.num, b.id);
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
        SevenIIChargePanel.prototype.getActivityVo = function (type) {
            switch (type) {
                case AcViewType.RECHARGE_SINGLE_2:
                case AcViewType.RECHARGE_SINGLE_3: {
                    return ActivityModel.getActivityVo(type);
                }
                case AcViewType.RECHARGE_ADD_UP_3:
                case AcViewType.RECHARGE_ADD_UP_5: {
                    return ActivityModel.getActivityVo(type);
                }
            }
        };
        return SevenIIChargePanel;
    }(com_main.DynamicComponent));
    com_main.SevenIIChargePanel = SevenIIChargePanel;
})(com_main || (com_main = {}));
