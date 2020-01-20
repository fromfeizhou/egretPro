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
    var LoginDailyPanel = /** @class */ (function (_super_1) {
        __extends(LoginDailyPanel, _super_1);
        function LoginDailyPanel(type) {
            var _this = _super_1.call(this) || this;
            _this.activityType = type;
            _this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
            return _this;
        }
        LoginDailyPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // this.activiVo.viewState = false;
            Utils.TimerManager.remove(this.updateDownTime, this);
        };
        LoginDailyPanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        LoginDailyPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_boxRoot, this, this.onClickBox);
            com_main.EventManager.addTouchScaleListener(this.m_btnBox, this, this.onCheckReward);
        };
        /**初始化界面 */
        LoginDailyPanel.prototype.initView = function () {
            if (this.bInit)
                return;
            this.activiVo = ActivityModel.getActivityVo(this.activityType);
            if (!this.activiVo)
                return;
            this.m_nActivityId = this.activiVo.id;
            this.initListView();
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        };
        LoginDailyPanel.prototype.updateDownTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate) {
                Utils.TimerManager.remove(this.updateDownTime, this);
                return;
            }
            var str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(timeStr + "<font color=#00ff00>" + str + "</font>");
        };
        /**列表显示 */
        LoginDailyPanel.prototype.initListView = function () {
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiVo.viewType + '_jpg');
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = com_main.RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            //配置表初始化
            this.payCfg = [];
            if (this.activiVo) {
                for (var k in this.activiVo.configs) {
                    if (this.activiVo.configs[k].rewardType == 1) {
                        this.extraCfg = this.activiVo.configs[k];
                    }
                    else {
                        this.payCfg.push(this.activiVo.configs[k]);
                    }
                }
            }
            var res = [];
            for (var id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 0, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].loginDays, desc: '', vo: this.activiVo });
            }
            res.sort(this.cfgsort);
            this.m_tCollection.replaceAll(res);
            this.refreshBox();
        };
        /**刷新显示 */
        LoginDailyPanel.prototype.refreshView = function () {
            // this.activiVo = ActivityModel.getActivityVo(this.activityType);
            this.m_tCollection.source.sort(this.cfgsort);
            this.m_tCollection.refresh();
            this.refreshBox();
        };
        /**刷新宝箱信息 */
        LoginDailyPanel.prototype.refreshBox = function () {
            var allday = this.activiVo.loginDaySet.length > this.extraCfg.extralRewardCondition ? this.extraCfg.extralRewardCondition : this.activiVo.loginDaySet.length;
            this.m_labPro.text = allday + '/' + this.extraCfg.extralRewardCondition;
            this.boo = this.activiVo.getBoxState(); //宝箱是否已领取 
            this.m_AllOutRoot.visible = false;
            if (this.boo) {
                this.m_btnBox.visible = true;
                this.m_btnBox.source = "bx-open_png";
                this.m_AllOutRoot.visible = true;
                this.m_btnBox.touchEnabled = false;
                if (this.m_pEffect) {
                    this.m_pEffect.onDestroy();
                    Utils.removeFromParent(this.m_pEffect);
                    this.m_pEffect = null;
                }
            }
            else {
                if (this.activiVo.loginDaySet.length >= this.extraCfg.extralRewardCondition) {
                    this.m_boxRoot.visible = true;
                    this.m_btnBox.visible = false;
                    if (!this.m_pEffect) {
                        this.m_pEffect = new com_main.BoxEffect(3, true);
                        this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                        this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                        this.m_pEffect.x = 48;
                        this.m_pEffect.y = 50;
                        this.m_boxRoot.addChild(this.m_pEffect);
                    }
                }
                else {
                    this.m_btnBox.source = "bx-jinl_png";
                    this.m_btnBox.visible = true;
                    this.m_boxRoot.visible = false;
                    if (this.m_pEffect) {
                        this.m_pEffect.onDestroy();
                        Utils.removeFromParent(this.m_pEffect);
                        this.m_pEffect = null;
                    }
                }
            }
        };
        /**领取宝箱奖励 */
        LoginDailyPanel.prototype.onClickBox = function () {
            if (this.boo)
                return;
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.activiVo.id, this.extraCfg.id);
        };
        /**查看宝箱奖励 */
        LoginDailyPanel.prototype.onCheckReward = function () {
            Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: this.extraCfg.reward, titleStr: GCode(CLEnum.BOX_AWARD) });
        };
        /**排序 */
        LoginDailyPanel.prototype.cfgsort = function (a, b) {
            var state1;
            var state2;
            var voact = ActivityModel.getActivityVo(AcViewType.SIGN_CONTIN_DAY);
            state1 = voact.getLoginDailyBtnRed(a.num, a.id);
            state2 = voact.getLoginDailyBtnRed(b.num, b.id);
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
        /**设置宽高 */
        LoginDailyPanel.prototype.setViewSize = function (width, height) {
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
        LoginDailyPanel.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.onActivityLoginDay, this);
        };
        /**移除事件 */
        LoginDailyPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_LOGIN_DAY, this);
        };
        /**7天登陆 */
        LoginDailyPanel.prototype.onActivityLoginDay = function (id) {
            if (this.m_nActivityId != id)
                return;
            this.refreshView();
        };
        return LoginDailyPanel;
    }(com_main.CComponent));
    com_main.LoginDailyPanel = LoginDailyPanel;
})(com_main || (com_main = {}));
