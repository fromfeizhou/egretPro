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
     * 离线收益
     */
    var RewardChangeView = /** @class */ (function (_super_1) {
        __extends(RewardChangeView, _super_1);
        function RewardChangeView(data) {
            var _this = _super_1.call(this) || this;
            _this.countdownSceond = 9;
            _this.name = RewardChangeView.NAME;
            _this.m_tParam = data;
            _this.initApp("patrol/rewardChangeSkin.exml");
            return _this;
        }
        RewardChangeView.prototype.listenerProtoNotifications = function () {
            return [
            //    ProtoDef.GET_PATROL,
            ];
        };
        /**处理协议号事件 */
        RewardChangeView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        RewardChangeView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onclickButtonContinue);
            this.initView();
        };
        RewardChangeView.prototype.initView = function () {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_TITLE_CHAN));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            if (!this.m_tParam)
                return;
            var _a = PatrolModel.calculateRewardSpeed(3600, this.m_tParam.new), silver_cur = _a[0], exp_cur = _a[1];
            var _b = PatrolModel.calculateRewardSpeed(3600, this.m_tParam.old), silver_old = _b[0], exp_old = _b[1];
            this.M_labSilver_cur.text = GCodeFromat(CLEnum.HOUR1, silver_cur);
            this.m_labExp_cur.text = GCodeFromat(CLEnum.HOUR1, exp_cur);
            this.m_labSilver_old.text = GCodeFromat(CLEnum.HOUR1, silver_old);
            this.m_labExp_old.text = GCodeFromat(CLEnum.HOUR1, exp_old);
            this.m_labName.text = GCodeFromat(CLEnum.HAN_TIPS3, PatrolModel.info.description);
            this.m_btnConfirm.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, 9));
            Utils.TimerManager.doTimer(1000, 0, this.countdown, this);
            this.m_btnConfirm["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onclickButtonContinue);
        };
        RewardChangeView.prototype.countdown = function () {
            this.countdownSceond = this.countdownSceond - 1;
            if (this.countdownSceond < 0) {
                this.onclickButtonContinue();
                return;
            }
            this.m_btnConfirm.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
        };
        RewardChangeView.prototype.onclickButtonContinue = function () {
            // Utils.TimerManager.remove(this.countdown, this);
            com_main.UpManager.history();
        };
        // //确认
        // private onclickConfirmBtn() {
        //     UpManager.close(false);
        // }
        RewardChangeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Utils.TimerManager.remove(this.countdown, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        };
        RewardChangeView.NAME = 'RewardChangeView';
        return RewardChangeView;
    }(com_main.CView));
    com_main.RewardChangeView = RewardChangeView;
})(com_main || (com_main = {}));
