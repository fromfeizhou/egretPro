// TypeScript file


module com_main {
	/**
	 * 离线收益
	 */
    export class OfflineRewardView extends CView {
        public static NAME = 'OfflineRewardView';

        public ApopUp: com_main.APopUp;
        public rewardTime_lb: eui.Label;
        public maxRewardTime_lb: eui.Label;
        public silver_res: eui.Label;
        public silver_vip: eui.Label;
        public silver_tec: eui.Label;
        public exp_res: eui.Label;
        public exp_vip: eui.Label;
        public exp_tec: eui.Label;
        public tips_lb: eui.Label;
        public get_btn: com_main.ComButton;
        public vip_btn: eui.Image;
        public tech_btn: eui.Image;

        public constructor(data?) {
            super();
            this.name = OfflineRewardView.NAME;
            this.initApp("patrol/offLineRewardSkin.exml");

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

            EventManager.addTouchScaleListener(this.vip_btn, this, this.onClickVipBtn);
            EventManager.addTouchScaleListener(this.tech_btn, this, this.onclickTechBtn);
            EventManager.addTouchScaleListener(this.get_btn, this, this.onclickGetReward);



            this.initView();
        }
        private initView() {
            this.ApopUp.setTitleLabel(GCode(CLEnum.HAN_AWARD_OFF));
            this.get_btn.setTitleLabel(GCode(CLEnum.SURE));



            let lastReceviceTTime = RoleData.offlineStamp * 1000;
            let curtime = TimerUtils.getServerTimeMill();
            let sec = Math.floor((curtime - lastReceviceTTime) / 1000);
            let vipLineCfg = C.VipPrivillegesConfig[VipPrivillType.MAX_OFFLINE_INCOME];
            let offLine = Number(vipLineCfg['vip' + RoleData.vipLevel]);
            let maxSec = offLine * 3600 < sec ? offLine * 3600 : sec;

            let [silver, exp] = PatrolModel.calculateRewardSpeed(maxSec);
            let vipCfg = C.VipPrivillegesConfig[VipPrivillType.PATROL_REWARD_ADD_RATE];
            let pervent = VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE) * 100;

            this.silver_tec.text = 0 + "%";
            this.exp_tec.text = 0 + "%";
            this.silver_vip.text = pervent + "%";
            this.exp_vip.text = pervent + "%";

            this.silver_res.text = `+${silver}`;
            this.exp_res.text = `+${exp}`;


            let hour = Math.floor(sec / 3600);
            let minSce = sec % 3600;
            let min = Math.floor(minSce / 60);


            this.rewardTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_TIPS, hour, min));
            this.maxRewardTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_TIPS1, offLine));
            this.tips_lb.textFlow = Utils.htmlParser(GCode(CLEnum.HAN_TIPS2));
        }

        //点击vip
        private onClickVipBtn(e: egret.Event) {

        }
        //点击科技加成
        private onclickTechBtn() {

        }

        //点击收取
        private onclickGetReward() {
            // PatrolProxy.send_C2S_PATROL_RECEIVE_REWARD(false);
            UpManager.close(false);
        }

        public onDestroy(): void {
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        }
    }
}

