module com_main {
	/**
	 * 在线奖励
	 */
    export class OnlineWnd extends CView {
        public static NAME = 'OnlineWnd';


        public gifCfg: ActivityOnlineTimeRewardConfig;
        public m_imgBtnClose: eui.Image;
        public m_labOnline: eui.Label;
        public m_pOnlineGroup: eui.Group;
        public m_pBtnGet: com_main.ComButton;
        private actid: number;
        private alltime: number;  //时间
        private m_effect: MCDragonBones;	//按钮特效
        public constructor() {
            super();
            this.name = OnlineWnd.NAME;
            this.initApp("activity/online/OnlineWndSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_ONLINE_REWARD,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_ONLINE_REWARD: {
                    this.inittem();
                    break;
                }
            }
        }
        public onDestroy(): void {
            super.onDestroy();
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.removeEvent();
            OnLineModel.viewState = false;
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }

            SceneResGroupCfg.clearModelRes([ModuleEnums.ONLINE_UI]);
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchTapListener(this.m_imgBtnClose, this, this.onHide);
            EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this.closePanel, this);
            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onGetReward);
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.inittem();
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.addEvent();

        }
        /**初始化 */
        private inittem() {

            this.gifCfg = OnLineModel.getCurCfgInfo();
            if (!this.gifCfg) return;
            this.showItem(this.gifCfg.reward);
            this.reFreshCardTime();
        }
        /**刷新倒计时显示 */
        private reFreshCardTime() {
            let time = OnLineModel.onlineTime;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.alltime = this.gifCfg.minutes * 60 - time;
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
            this.m_labOnline.text = this.alltime > 0 ? Utils.DateUtils.getFormatBySecond(this.alltime, 4) : GCode(CLEnum.TAKE_OUT_IN);
            Utils.isGray(this.alltime > 0, this.m_pBtnGet);
            this.m_pBtnGet.enabled = this.alltime > 0 ? false : true;
            if (this.alltime < 0) {
                this.setEff();
            } else {
                this.delEff();
            }
        }
        public closePanel(ft) {
            if (ft !== FunctionType.ONLINE)
                return;
            UpManager.history();
        }
        /**刷新倒计时 */
        private updateRemainTime() {
            if (this.alltime > 0) {
                if (--this.alltime > 0) {
                    this.m_labOnline.text = Utils.DateUtils.getFormatBySecond(this.alltime, 4);
                }
            } else {
                this.m_labOnline.text = GCode(CLEnum.TAKE_OUT_IN);
                Utils.TimerManager.remove(this.updateRemainTime, this);
                Utils.isGray(this.alltime > 0, this.m_pBtnGet);
                this.m_pBtnGet.enabled = this.alltime > 0 ? false : true;

            }
        }

        /**显示奖励 */
        private showItem(reward: string) {
            let arwardList = Utils.parseCommonItemJson(reward);
            let i = 0;
            for (i = 0; i < arwardList.length; i++) {
                if (this.m_pOnlineGroup.numChildren > i) {
                    (this.m_pOnlineGroup.getChildAt(i) as ComItemNew).setItemInfo(arwardList[i].itemId, arwardList[i].count);
                } else {
                    let itemView = ComItemNew.create("name_num");
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_pOnlineGroup.addChild(itemView);
                }
            }
            for (; i < this.m_pOnlineGroup.numChildren; i++) {
                this.m_pOnlineGroup.removeChildAt(i);
            }
        }
        private onGetReward() {
            if (!this.gifCfg) return;
            ActivityProxy.C2S_ONLINE_REWARD(this.gifCfg.id);
        }
        /**按钮特效 */
        private setEff() {
            if (this.m_effect) return;
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_pBtnGet.addChild(this.m_effect);
        }
        /**删除特效 */
        private delEff() {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        }

        private onHide() {
            UpManager.history();
        }

        private hidePanel() {
            if (!this.gifCfg) {
                UpManager.history();
                EventMgr.dispatchEvent(TASK_EVT.POP_FUNCTION_PANEL_CLOSE, FunctionType.ONLINE);
            }
        }
    }
}