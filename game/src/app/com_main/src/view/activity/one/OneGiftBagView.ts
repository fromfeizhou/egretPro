module com_main {
    /**
     * 一元礼包
     */
    export class OneGiftBagView extends CView {
        public static NAME = "OneGiftBagView";
        public m_closeBg: eui.Group;
        public m_groupAward: eui.Group;
        public m_btnAward: com_main.ComButton;
        public m_btnGoto: com_main.ComPayButton;

        private m_curShopId: number;
        private activiVo: AcOneGiftBagVo;

        private m_effect: MCDragonBones;	//按钮特效
        private m_num: any;
        public constructor() {
            super();
            this.name = OneGiftBagView.NAME;
            this.initApp("activity/one/OneGiftBagViewSkin.exml");
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        private hidePanel() {
            if (this.activiVo.checkOneEnd()) {
                UpManager.history();
            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.updateView();
            this.setEff();
            this.initEvent()

        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            this.m_closeBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoClick);
            EventManager.addTouchScaleListener(this.m_btnAward, this, this.onGotoClick);
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, this.updateState, this);
            // EventMgr.addEvent(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this.refreshGoYuView, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, this);
            // EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this);
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        private updateView() {
            this.activiVo = ActivityModel.getActivityVo<AcOneGiftBagVo>(AcViewType.ONE_GIFT_BAG);
            if (!this.activiVo) return;

            this.updateState()
        }
        /**勾玉购买刷新 */
        // private refreshGoYuView(shopType: number) {
        // for (let i = 0; i < this.m_pViews.length; i++) {
        //     let view = this.m_pViews[i];
        //     if (view.activityType == shopType) {
        //         view.refreshView();
        //     }
        // }
        // this.updateView();
        // }
        public updateState() {
            let id = this.activiVo.awardRecordSet.length;
            if (id >= this.activiVo.rechargeCfgs.length) return;

            let cfg = this.activiVo.rechargeCfgs[id];
            this.m_num = cfg.price;
            this.m_btnGoto.cost = cfg.price;
            this.m_btnAward.setTitleLabel(GCode(CLEnum.TAKE_OUT))
            this.m_btnGoto.visible = !this.activiVo.getBtnState()
            this.m_btnAward.visible = this.activiVo.getBtnState();
            //
            // this.m_btnGoto.setTitleLabel(str);
            this.m_curShopId = cfg.shopId;

            this.m_groupAward.removeChildren();
            let arwardList = Utils.parseCommonItemServ(this.activiVo.rechargeCfgs[id].reward);
            for (let i = 0; i < arwardList.length; i++) {
                let itemView = ComItemNew.create("name_num");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
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
            if (!this.activiVo.getBtnState()) {
                let id = this.activiVo.awardRecordSet.length;
                if (id >= this.activiVo.rechargeCfgs.length) return;
                let cfg = this.activiVo.rechargeCfgs[id];
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            } else {
                ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD(this.activiVo.id, this.m_curShopId);
            }

            // UpManager.history();
        }
    }
}