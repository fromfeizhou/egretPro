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
    var SevenIILoginPanel = /** @class */ (function (_super_1) {
        __extends(SevenIILoginPanel, _super_1);
        function SevenIILoginPanel(actType) {
            var _this = _super_1.call(this) || this;
            _this.m_currDay = 0; //当前开启天
            _this.m_index = 0; //当前选中
            _this.m_actType = actType;
            _this.dynamicSkinName = Utils.getSkinName("app/activity/sevenII/SevenIILoginPanelSkin.exml");
            return _this;
        }
        SevenIILoginPanel.prototype.onShow = function () {
            this.init();
            this.addEvent();
        };
        SevenIILoginPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        SevenIILoginPanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.init();
        //     this.addEvent();
        // }
        /**监听事件 */
        SevenIILoginPanel.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnGet, this, this.onBtnGetHandler);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.onActivityDay, this);
        };
        /**移除事件 */
        SevenIILoginPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_LOGIN_DAY, this);
            com_main.EventManager.removeEventListeners(this);
        };
        SevenIILoginPanel.prototype.onActivityDay = function (id) {
            if (!this.m_activiVo || this.m_activiVo.id != id)
                return;
            this.getBtnState();
        };
        //初始化
        SevenIILoginPanel.prototype.init = function () {
            this.m_imgTips.source = this.m_actType == AcViewType.SIGN_CONTIN_DAY_3 ? 'lb_7t_xcklqrqdlhb_png' : 'lb_7t_dlzsdl_png';
            this.m_activiVo = ActivityModel.getActivityVo(this.m_actType);
            if (this.m_activiVo) {
                this.initListView();
            }
        };
        /**设置物品信息 */
        SevenIILoginPanel.prototype.initListView = function () {
            var cfgs = this.m_activiVo.configs;
            this.loginCfg = [];
            for (var key in cfgs) {
                if (unNull(cfgs[key])) {
                    this.loginCfg.push(cfgs[key]);
                }
            }
            this.btnList = [];
            this.m_pBtnRoot.removeChildren();
            for (var i = 0; i < this.loginCfg.length; i++) {
                var cfg = this.loginCfg[i];
                var loginCell = new com_main.SevenIILoginTabCell(this.loginCfg[i]);
                this.m_pBtnRoot.addChild(loginCell);
                this.btnList.push(loginCell);
                com_main.EventManager.addTouchTapListener(loginCell, this, this.OnClickHander);
            }
            this.m_currDay = Math.max.apply(null, this.m_activiVo.loginDaySet); //当前开启天
            if (this.m_currDay <= 7) { //大于7天默认选中第一天
                this.m_index = this.m_currDay - 1;
            }
            this.m_currLoginCfg = this.loginCfg[this.m_index];
            this.btnList[this.m_index].setSelect(true);
            this.showItem(this.loginCfg[this.m_index].reward);
            this.getBtnState();
        };
        /**设置当前选中武将下标 */
        SevenIILoginPanel.prototype.OnClickHander = function (e) {
            var cell = e.currentTarget;
            if (this.m_currDay == cell['m_days'])
                return;
            for (var i = 0; i < this.btnList.length; i++) {
                this.btnList[i].setSelect(false);
            }
            this.m_currDay = cell['m_days'];
            this.btnList[this.m_currDay - 1].setSelect(true);
            this.m_currLoginCfg = this.loginCfg[this.m_currDay - 1];
            this.showItem(this.loginCfg[this.m_currDay - 1].reward);
            this.getBtnState();
        };
        /**设置奖励显示*/
        SevenIILoginPanel.prototype.showItem = function (arwardList) {
            this.m_pItemRoot.removeChildren();
            for (var i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("count");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_pItemRoot.addChild(itemView);
            }
        };
        /**设置领取按钮状态*/
        SevenIILoginPanel.prototype.getBtnState = function () {
            this.m_status = this.m_activiVo.getLoginDailyBtnRed(this.m_currLoginCfg.loginDays, this.m_currLoginCfg.id);
            this.m_btnGet.visible = this.m_status == ActivityStatus.FINISH ? true : false;
            this.m_btnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
            this.m_labTip.text = GCodeFromat(CLEnum.AC_GET_DAY_AFTER, this.m_activiVo.getCurday(this.m_currLoginCfg.loginDays));
            this.m_labTip.visible = this.m_status == ActivityStatus.PROCESSING ? true : false;
            Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_btnGet);
            this.m_pState.visible = this.m_status == ActivityStatus.REWARD || this.m_status == ActivityStatus.FAILURE ? true : false;
            Utils.isGray(this.m_status == ActivityStatus.FAILURE, this.m_imgBg);
            this.m_labState.text = this.m_status == ActivityStatus.FAILURE ? GCode(CLEnum.AC_GET_SX) : GCode(CLEnum.TAKE_OUT_END);
            this.m_btnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
        };
        /**领取奖励 */
        SevenIILoginPanel.prototype.onBtnGetHandler = function (e) {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.m_activiVo.id, this.m_currLoginCfg.id);
        };
        return SevenIILoginPanel;
    }(com_main.DynamicComponent));
    com_main.SevenIILoginPanel = SevenIILoginPanel;
})(com_main || (com_main = {}));
