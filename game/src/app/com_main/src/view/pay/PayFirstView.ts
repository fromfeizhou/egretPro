module com_main {
    /**
     * 首充
     */
    export class PayFirstView extends CView {

        public static NAME = "PayFirstView";
        public m_closeBg: eui.Group;
        public m_genCard: com_main.ComGenCard;
        public m_tIcon: eui.Image;
        public m_tPriceLab: eui.Label;
        public m_awardDesc: eui.Image;
        public m_award: eui.Image;
        public m_labPlayerVip: eui.BitmapLabel;
        public m_groupAward: eui.Group;
        public m_btnGoto: com_main.ComButton;



        private m_curShopId: number;
        private activiVo: AcPayFirstVo;
        private firstPayCfg: ActivityFirstPayRewardConfig;

        private m_effect: MCDragonBones;	//按钮特效
        public constructor() {
            super();
            this.name = PayFirstView.NAME;
            this.initApp("pay/pay_first_view.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD: {
                    this.updateView();
                    break;
                } default: {
                }
            }
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
            this.m_closeBg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this);
            // this.activiVo.viewState = false;
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
            if (this.m_genCard)
                egret.Tween.removeTweens(this.m_genCard);

            SceneResGroupCfg.clearModelRes([ModuleEnums.FRIST_PAY_UI]);
        }

        private hidePanel() {
            if (this.activiVo) {
                this.firstPayCfg = this.activiVo.getRechargeAwardCfgByType();
            }
            if (!this.firstPayCfg) {
                UpManager.history();
            }
            return;
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.updateView();
            this.setEff();

            this.m_closeBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoClick);
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
            EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.updateView, this);
        }

        private updateView() {
            this.activiVo = ActivityModel.getActivityVo<AcPayFirstVo>(AcViewType.FIRST_RECHARGE);
            if (this.activiVo) {
                this.firstPayCfg = this.activiVo.getRechargeAwardCfgByType();
            }
            if (!this.firstPayCfg) {
                return;
            }
            if (this.activiVo.awardRecordSet.length > 0) {
                this.m_tIcon.source = "lb_czdl_png"
                this.m_tIcon.y = 20;
                this.m_tIcon.x = 90
                this.m_tPriceLab.text = GCodeFromat(CLEnum.AC_PAY_FIRST_COT, this.firstPayCfg.level)
            } else {
                this.m_tIcon.source = "lb_sc_dl_png"
                this.m_tPriceLab.text = GCode(CLEnum.AC_PAY_FIRST)
            }
            let str = this.activiVo.getBtnState() ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.AC_PAY_GOTO);
            this.m_btnGoto.setTitleLabel(str);
            this.m_labPlayerVip.text = `${this.firstPayCfg.price}`
            this.m_groupAward.removeChildren();
            let arwardList = this.firstPayCfg.reward;
            for (let i = 0; i < arwardList.length; i++) {
                let itemView = ComItemNew.create("name_num");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
            }
            this.updateAward();
            this.createAni();
        }
        public createAni() {
            this.m_genCard.setInfo(1003, true);
        }

        private updateAward() {
            if (isNull(this.firstPayCfg))
                return;
            switch (this.firstPayCfg.id) {
                case 1:
                    this.m_awardDesc.source = "lb_sc_zsjpwj_png"
                    this.m_award.source = "lb_zy_png"
                    break;
                case 2:
                    this.m_awardDesc.source = "lb_zscqjn_png"
                    this.m_award.source = "lb_flzt_png"
                    break;
                case 3:
                    this.m_awardDesc.source = "lb_jljpwj_png"
                    this.m_award.source = "lb_5xzy_png"
                    break;
                case 4:
                    this.m_awardDesc.source = "lb_jljpwj_png"
                    this.m_award.source = "lb_8xzy_png"
                    break;
                case 5:
                    this.m_awardDesc.source = "lb_jljpwj_png"
                    this.m_award.source = "lb_10xzy_png"
                    break;
                case 6:
                    this.m_awardDesc.source = "lb_zszyzy_png"
                    this.m_award.source = "lb_zyysz_png"
                    break;
            }
        }
        /**按钮特效 */
        private setEff() {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_btnGoto.addChild(this.m_effect);
        }
        protected onCloseClick(e: egret.TouchEvent) {
            UpManager.history();
        }
        private onGotoClick(e: egret.Event): void {

            if (this.activiVo.getBtnState()) {
                ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD(this.activiVo.id, this.firstPayCfg.id);
            } else {
                // UpManager.history();
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
            }
        }
    }
}