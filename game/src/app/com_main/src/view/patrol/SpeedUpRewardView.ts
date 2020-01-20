// TypeScript file


module com_main {
	/**
	 * 收益加速
	 */
    export class SpeedUpRewardView extends CView {
        public static NAME = 'SpeedUpRewardView';

        public ApopUp: com_main.APopUp;
        public speedUpTime_lb: eui.Label;
        public todayNum_lb: eui.Label;
        public silver_res: eui.Label;
        public silver_vip: eui.Label;
        public silver_tec: eui.Label;
        public exp_res: eui.Label;
        public exp_vip: eui.Label;
        public exp_tec: eui.Label;
        public confirm_btn: eui.Group;
        public consumeNum_lb: eui.Label;
        public consume_icon: eui.Image;
        public m_pConsume: eui.Group;
        public m_labFree: eui.Label;

        private m_gold: number = 0;
        public constructor(data?) {
            super();
            this.name = SpeedUpRewardView.NAME;
            this.initApp("patrol/speedUpRewardSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_PATROL_WINE,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_PATROL_WINE: {
                    this.refreshInfo();
                }
            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.confirm_btn, this, this.onclickConfirmBtn);

            this.initView();
            this.initEvent();
        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        private initEvent() {
            EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
            EventManager.removeEventListeners(this);
        }
        private initView() {
            this.ApopUp.setTitleLabel(GCode(CLEnum.HAN_TITLE_SPEED));
            this.refreshInfo();
        }

        private refreshInfo() {
            let pervent = VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE) * 100;//挂机vip百分比
            this.silver_vip.text = pervent + "%";
            this.exp_vip.text = pervent + "%";


            let [silverSpeed, expSpeed] = PatrolModel.calculateRewardSpeed();

            this.silver_res.text = `+${silverSpeed}`;
            this.exp_res.text = `+${expSpeed}`;

            this.todayNum_lb.text = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount + '';
            let value = ConstUtil.getValue(IConstEnum.PATROL_SPEED_HOUR);
            this.speedUpTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_SPEED_TIPS, value));

            // let alcoholCount = PropModel.getPropNum(PropEnum.Alcohol);
            // if (alcoholCount > 0) {
            //     this.consume_icon.source = PropModel.getPropIcon(PropEnum.Alcohol);
            // } else {
            let useCount = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).useCount;
            let consumeList = ConstUtil.keyValsToNumberArray(IConstEnum.PATROL_WINE_CONSUME_GOLD);
            let data = useCount >= consumeList.length ? consumeList[consumeList.length - 1] : consumeList[useCount];
            this.m_gold = data.value;
            if (data.value <= 0) {
                this.m_pConsume.visible = false;
                this.m_labFree.visible = true;
            } else {
                this.m_pConsume.visible = true;
                this.m_labFree.visible = false;
                this.consume_icon.source = 'icon_source_gold_png';
                this.consumeNum_lb.text = 'x' + data.value;
            }

            // }
            let wineCount = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount;
            if (wineCount == 0) {
                Utils.isGray(true, this.confirm_btn)
            } else {
                Utils.isGray(false, this.confirm_btn)
            }
        }
        //点击收取
        private onclickConfirmBtn() {
            let num = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount;
            if (num == 0) {
                if (RoleData.vipLevel < 15) {
                    EffectUtils.showTips(GCode(CLEnum.HAN_SPEED_TIPS1), 1, true);
                } else {
                    EffectUtils.showTips(GCode(CLEnum.HAN_SPEED_TIPS2), 1, true);
                }
                return;
            }

            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold,1)) {
                PatrolProxy.send_C2S_PATROL_WINE();
            }
        }
        /**功能次数变动 */
        private onFunCount(id: IFunCountEnum) {
            if (id != IFunCountEnum.PATROL_WINE)
                return;
            this.refreshInfo();
        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        }
    }
}

