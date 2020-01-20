module com_main {

    export class LoginDailyPanel extends CComponent implements IRechargeMainWnd {
        /**面板类型 */
        public m_imgIcon: eui.Image;
        public m_labOpenTime: com_main.CLabel;
        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.List;
        public m_pBoxRoot: eui.Group;
        public m_btnBox: eui.Image;
        public m_AllOutRoot: eui.Group;
        public m_boxRoot: eui.Group;
        public m_labPro: com_main.CLabel;

        public activityType: AcViewType;
        private m_nActivityId; Number;
        public bInit: boolean;
        private boo: boolean;  //宝箱状态是否领取 
        private m_pEffect: BoxEffect;//宝箱特效
        private activiVo: AcLoginDayVo;
        private payCfg: ActivityLoginDaysRewardConfig[];//常规7日数据信息
        private extraCfg: ActivityLoginDaysRewardConfig; //额外宝箱数据信息

        private m_tCollection: eui.ArrayCollection;

        public constructor(type: AcViewType) {
            super();
            this.activityType = type;
            this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy()
            // this.activiVo.viewState = false;
            Utils.TimerManager.remove(this.updateDownTime, this);
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            this.removeEvent();
            EventManager.removeEventListeners(this);
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_boxRoot, this, this.onClickBox);
            EventManager.addTouchScaleListener(this.m_btnBox, this, this.onCheckReward);
        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.activiVo = ActivityModel.getActivityVo<AcLoginDayVo>(this.activityType);
            if (!this.activiVo) return;
            this.m_nActivityId = this.activiVo.id;

            this.initListView();
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        }

        public updateDownTime() {
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate) {
                Utils.TimerManager.remove(this.updateDownTime, this);
                return;
            }
            let str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(`${timeStr}<font color=#00ff00>${str}</font>`);
        }

        /**列表显示 */
        private initListView() {

            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiVo.viewType + '_jpg');
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            //配置表初始化
            this.payCfg = [];
            if (this.activiVo) {
                for (let k in this.activiVo.configs) {
                    if (this.activiVo.configs[k].rewardType == 1) {
                        this.extraCfg = this.activiVo.configs[k];
                    } else {
                        this.payCfg.push(this.activiVo.configs[k]);
                    }
                }
            }
            let res: IRechargeItemRD[] = [];
            for (let id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 0, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].loginDays, desc: '', vo: this.activiVo })
            }
            res.sort(this.cfgsort);
            this.m_tCollection.replaceAll(res);
            this.refreshBox();
        }

        /**刷新显示 */
        public refreshView() {
            // this.activiVo = ActivityModel.getActivityVo(this.activityType);
            this.m_tCollection.source.sort(this.cfgsort)
            this.m_tCollection.refresh();
            this.refreshBox();
        }
        /**刷新宝箱信息 */
        private refreshBox() {
            let allday = this.activiVo.loginDaySet.length > this.extraCfg.extralRewardCondition ? this.extraCfg.extralRewardCondition : this.activiVo.loginDaySet.length;
            this.m_labPro.text = allday + '/' + this.extraCfg.extralRewardCondition;
            this.boo = this.activiVo.getBoxState();  //宝箱是否已领取 
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
            } else {
                if (this.activiVo.loginDaySet.length >= this.extraCfg.extralRewardCondition) {
                    this.m_boxRoot.visible = true;
                    this.m_btnBox.visible = false;
                    if (!this.m_pEffect) {
                        this.m_pEffect = new BoxEffect(3, true);
                        this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                        this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                        this.m_pEffect.x = 48;
                        this.m_pEffect.y = 50;
                        this.m_boxRoot.addChild(this.m_pEffect);
                    }
                } else {
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

        }

        /**领取宝箱奖励 */
        private onClickBox() {
            if (this.boo) return;
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.activiVo.id, this.extraCfg.id);
        }
        /**查看宝箱奖励 */
        private onCheckReward() {
            Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: this.extraCfg.reward, titleStr: GCode(CLEnum.BOX_AWARD) });
        }


        /**排序 */
        private cfgsort(a: IRechargeItemRD, b: IRechargeItemRD) {
            let state1: number;
            let state2: number;
            let voact = ActivityModel.getActivityVo<AcLoginDayVo>(AcViewType.SIGN_CONTIN_DAY);
            state1 = voact.getLoginDailyBtnRed(a.num, a.id);
            state2 = voact.getLoginDailyBtnRed(b.num, b.id);
            if (state1 > state2) {
                return 1;
            } else if (state1 < state2) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            } else if (a.id < b.id) {
                return -1;
            } else {
                return 0;
            }
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //适配
            Utils.toStageBestScaleHeigt(this.m_scroller);
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.onActivityLoginDay, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_LOGIN_DAY, this);
        }

        /**7天登陆 */
        private onActivityLoginDay(id: number) {
            if (this.m_nActivityId != id) return;
            this.refreshView();
        }
    }

}