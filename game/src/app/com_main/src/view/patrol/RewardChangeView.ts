module com_main {
	/**
	 * 离线收益
	 */
    export class RewardChangeView extends CView {
        public static NAME = 'RewardChangeView';
        public m_apopUp: com_main.APopUp;
        public m_labName: eui.Label;
        public m_labSilver_old: eui.Label;
        public M_labSilver_cur: eui.Label;
        public m_labExp_old: eui.Label;
        public m_labExp_cur: eui.Label;
        public m_btnConfirm: com_main.ComButton;


        public countdownSceond = 9;
        private m_tParam:{ old: IItemInfo[], new: IItemInfo[] };

        public constructor(data?:{ old: IItemInfo[], new: IItemInfo[] }) {
            super();
            this.name = RewardChangeView.NAME;
            this.m_tParam = data;
            this.initApp("patrol/rewardChangeSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [
                //    ProtoDef.GET_PATROL,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onclickButtonContinue);

            this.initView();
        }
        private initView() {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_TITLE_CHAN));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));

            if(!this.m_tParam) return;
            let [silver_cur, exp_cur] = PatrolModel.calculateRewardSpeed(3600, this.m_tParam.new);
            let [silver_old, exp_old] = PatrolModel.calculateRewardSpeed(3600, this.m_tParam.old);

            this.M_labSilver_cur.text = GCodeFromat(CLEnum.HOUR1, silver_cur);
            this.m_labExp_cur.text = GCodeFromat(CLEnum.HOUR1, exp_cur);
            this.m_labSilver_old.text = GCodeFromat(CLEnum.HOUR1, silver_old);
            this.m_labExp_old.text = GCodeFromat(CLEnum.HOUR1, exp_old);
            this.m_labName.text = GCodeFromat(CLEnum.HAN_TIPS3, PatrolModel.info.description);

            this.m_btnConfirm.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, 9));
            Utils.TimerManager.doTimer(1000, 0, this.countdown, this);

            this.m_btnConfirm["sound_queren"] = SoundData.getSureSound();
            EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onclickButtonContinue);
        }
        public countdown() {
            this.countdownSceond = this.countdownSceond - 1;
            if (this.countdownSceond < 0) {
                this.onclickButtonContinue();
                return;
            }
            this.m_btnConfirm.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
        }
        public onclickButtonContinue() {
            // Utils.TimerManager.remove(this.countdown, this);
            UpManager.history();
        }
        // //确认
        // private onclickConfirmBtn() {
        //     UpManager.close(false);
        // }

        public onDestroy(): void {
            super.onDestroy();
            Utils.TimerManager.remove(this.countdown, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        }
    }
}

