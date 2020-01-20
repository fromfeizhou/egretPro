module com_main {
    export class SevenIILoginPanel extends DynamicComponent {

        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.Group;
        public m_btnGet: com_main.ComButton;
        public m_labTip: eui.Label;
        public m_pState: eui.Group;
        public m_imgBg: eui.Image;
        public m_labState: eui.Label;
        public m_pBtnRoot: eui.Group;
        public m_imgTips:eui.Image;

        private m_currLoginCfg: ActivityLoginDaysRewardConfig;
        private m_activiVo: AcLoginDayVo;
        private loginCfg: ActivityLoginDaysRewardConfig[];
        private btnList: SevenIILoginTabCell[];
        private m_currDay = 0;//当前开启天
        private m_index = 0;//当前选中
        private m_status: number;  //按钮状态
        private m_actType:AcViewType//活动类型
        public constructor(actType:AcViewType) {
            super();
            this.m_actType=actType;
            this.dynamicSkinName = Utils.getSkinName("app/activity/sevenII/SevenIILoginPanelSkin.exml");
        }

        protected onShow(){
            this.init();
            this.addEvent();
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.init();
        //     this.addEvent();

        // }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnGet, this, this.onBtnGetHandler);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.onActivityDay, this);

        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_LOGIN_DAY, this);
            EventManager.removeEventListeners(this);
        }

        private onActivityDay(id:number){
            if(!this.m_activiVo || this.m_activiVo.id != id) return;
            this.getBtnState()
        }
        
        //初始化
        public init() {
            this.m_imgTips.source=this.m_actType==AcViewType.SIGN_CONTIN_DAY_3?'lb_7t_xcklqrqdlhb_png':'lb_7t_dlzsdl_png';
            this.m_activiVo = ActivityModel.getActivityVo<AcLoginDayVo>(this.m_actType);
            if (this.m_activiVo) {
                this.initListView();
            }
        }

        /**设置物品信息 */
        public initListView() {
            let cfgs = this.m_activiVo.configs;
            this.loginCfg = [];
            for (let key in cfgs) {
                if (unNull(cfgs[key])) {
                    this.loginCfg.push(cfgs[key]);
                }
            }
            this.btnList = [];
            this.m_pBtnRoot.removeChildren();
            for (let i = 0; i < this.loginCfg.length; i++) {
                let cfg = this.loginCfg[i];
                let loginCell = new SevenIILoginTabCell(this.loginCfg[i]);
                this.m_pBtnRoot.addChild(loginCell);
                this.btnList.push(loginCell);
                EventManager.addTouchTapListener(loginCell, this, this.OnClickHander);
            }
            this.m_currDay = Math.max.apply(null, this.m_activiVo.loginDaySet);//当前开启天
            if (this.m_currDay <= 7) {//大于7天默认选中第一天
                this.m_index = this.m_currDay - 1;
            }
            this.m_currLoginCfg = this.loginCfg[this.m_index];
            this.btnList[this.m_index].setSelect(true);
            this.showItem(this.loginCfg[this.m_index].reward);
            this.getBtnState();

        }
        /**设置当前选中武将下标 */
        private OnClickHander(e: TouchEvent) {
            let cell = e.currentTarget;
            if (this.m_currDay == cell['m_days']) return;
            for (let i = 0; i < this.btnList.length; i++) {
                this.btnList[i].setSelect(false);
            }
            this.m_currDay = cell['m_days'];
            this.btnList[this.m_currDay - 1].setSelect(true);
            this.m_currLoginCfg = this.loginCfg[this.m_currDay - 1];
            this.showItem(this.loginCfg[this.m_currDay - 1].reward);
            this.getBtnState();
        }
        /**设置奖励显示*/
        private showItem(arwardList: IItemInfo[]) {
            this.m_pItemRoot.removeChildren();
            for (let i = 0; i < arwardList.length; i++) {
                let itemView = ComItemNew.create("count");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_pItemRoot.addChild(itemView);
            }
        }
        /**设置领取按钮状态*/
        private getBtnState() {
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
        }
        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.m_activiVo.id, this.m_currLoginCfg.id);
        }

    }
}