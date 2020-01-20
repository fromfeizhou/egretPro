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
     * 首充
     */
    var PayFirstView = /** @class */ (function (_super_1) {
        __extends(PayFirstView, _super_1);
        function PayFirstView() {
            var _this = _super_1.call(this) || this;
            _this.name = PayFirstView.NAME;
            _this.initApp("pay/pay_first_view.exml");
            return _this;
        }
        PayFirstView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD,
            ];
        };
        /**处理协议号事件 */
        PayFirstView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD: {
                    this.updateView();
                    break;
                }
                default: {
                }
            }
        };
        PayFirstView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PayFirstView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
            this.m_closeBg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this);
            // this.activiVo.viewState = false;
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
            if (this.m_genCard)
                egret.Tween.removeTweens(this.m_genCard);
            SceneResGroupCfg.clearModelRes([ModuleEnums.FRIST_PAY_UI]);
        };
        PayFirstView.prototype.hidePanel = function () {
            if (this.activiVo) {
                this.firstPayCfg = this.activiVo.getRechargeAwardCfgByType();
            }
            if (!this.firstPayCfg) {
                com_main.UpManager.history();
            }
            return;
        };
        PayFirstView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateView();
            this.setEff();
            this.m_closeBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoClick);
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
            com_main.EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.updateView, this);
        };
        PayFirstView.prototype.updateView = function () {
            this.activiVo = ActivityModel.getActivityVo(AcViewType.FIRST_RECHARGE);
            if (this.activiVo) {
                this.firstPayCfg = this.activiVo.getRechargeAwardCfgByType();
            }
            if (!this.firstPayCfg) {
                return;
            }
            if (this.activiVo.awardRecordSet.length > 0) {
                this.m_tIcon.source = "lb_czdl_png";
                this.m_tIcon.y = 20;
                this.m_tIcon.x = 90;
                this.m_tPriceLab.text = GCodeFromat(CLEnum.AC_PAY_FIRST_COT, this.firstPayCfg.level);
            }
            else {
                this.m_tIcon.source = "lb_sc_dl_png";
                this.m_tPriceLab.text = GCode(CLEnum.AC_PAY_FIRST);
            }
            var str = this.activiVo.getBtnState() ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.AC_PAY_GOTO);
            this.m_btnGoto.setTitleLabel(str);
            this.m_labPlayerVip.text = "" + this.firstPayCfg.price;
            this.m_groupAward.removeChildren();
            var arwardList = this.firstPayCfg.reward;
            for (var i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("name_num");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
            }
            this.updateAward();
            this.createAni();
        };
        PayFirstView.prototype.createAni = function () {
            this.m_genCard.setInfo(1003, true);
        };
        PayFirstView.prototype.updateAward = function () {
            if (isNull(this.firstPayCfg))
                return;
            switch (this.firstPayCfg.id) {
                case 1:
                    this.m_awardDesc.source = "lb_sc_zsjpwj_png";
                    this.m_award.source = "lb_zy_png";
                    break;
                case 2:
                    this.m_awardDesc.source = "lb_zscqjn_png";
                    this.m_award.source = "lb_flzt_png";
                    break;
                case 3:
                    this.m_awardDesc.source = "lb_jljpwj_png";
                    this.m_award.source = "lb_5xzy_png";
                    break;
                case 4:
                    this.m_awardDesc.source = "lb_jljpwj_png";
                    this.m_award.source = "lb_8xzy_png";
                    break;
                case 5:
                    this.m_awardDesc.source = "lb_jljpwj_png";
                    this.m_award.source = "lb_10xzy_png";
                    break;
                case 6:
                    this.m_awardDesc.source = "lb_zszyzy_png";
                    this.m_award.source = "lb_zyysz_png";
                    break;
            }
        };
        /**按钮特效 */
        PayFirstView.prototype.setEff = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_btnGoto.addChild(this.m_effect);
        };
        PayFirstView.prototype.onCloseClick = function (e) {
            com_main.UpManager.history();
        };
        PayFirstView.prototype.onGotoClick = function (e) {
            if (this.activiVo.getBtnState()) {
                ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD(this.activiVo.id, this.firstPayCfg.id);
            }
            else {
                // UpManager.history();
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
            }
        };
        PayFirstView.NAME = "PayFirstView";
        return PayFirstView;
    }(com_main.CView));
    com_main.PayFirstView = PayFirstView;
})(com_main || (com_main = {}));
