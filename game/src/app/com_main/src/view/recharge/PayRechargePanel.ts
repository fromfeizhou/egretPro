module com_main {

    export class PayRechargePanel extends CComponent implements IRechargeMainWnd {
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
        private m_nActivityId:number;
        
        public bInit: boolean;

        private payCfg: any;
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
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pBoxRoot.visible = false;
        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            let activiVo = this.getActivityVo();
            if(!activiVo) return;
            this.m_nActivityId = activiVo.id;
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            this.initListView();
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;

            this.addEvent();
        }

        public updateDownTime() {
            let activiVo = this.getActivityVo();
            if(!activiVo) return;
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate){
                 Utils.TimerManager.remove(this.updateDownTime, this);
                 return;
            }
            let str = Utils.DateUtils.getCountdownStrByCfg(activiVo.closeDate - curtime, 1);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(`${timeStr}<font color=#00ff00>${str}</font>`);
        }

        /**列表显示 */
        private initListView() {
            let activiVo = this.getActivityVo();

            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;

            if (activiVo) {
                let cfgs = activiVo.getRechargeCfgBy();
                this.payCfg = [];
                for (let key in cfgs) {
                    if (unNull(cfgs[key])) {
                        this.payCfg.push(cfgs[key]);
                    }
                }
            }
            let res: IRechargeItemRD[] = [];
            for (let id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 1, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].level, desc: this.payCfg[id].desc, vo: activiVo })
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        }

        /**刷新显示 */
        public refreshView() {
            if (!this.bInit) return;
            let activiVo = this.getActivityVo();
            if(!activiVo) return;

            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        }

        /**排序 */
        private cfgsort(a: IRechargeItemRD, b: IRechargeItemRD) {
            let state1: number;
            let state2: number;
            if (a.vo.viewType == AcViewType.RECHARGE_SINGLE) {
                let voact = this.getActivityVo() as AcPaySetOneVo;
                state1 = voact.getRechargeOneBtnRed(a.num, a.id);
                state2 = voact.getRechargeOneBtnRed(b.num, b.id);

            } else if (a.vo.viewType == AcViewType.RECHARGE_ADD_UP) {
                let voact = this.getActivityVo() as AcPaySumVo;
                state1 = voact.getAllRechargeBtnRed(a.num, a.id);
                state2 = voact.getAllRechargeBtnRed(b.num, b.id);
            } else if (a.vo.viewType == AcViewType.CONSUME_GIFT) {
                let voact = this.getActivityVo() as AcConsumeVo;
                state1 = voact.getConsumptionBtnRed(a.num, a.id);
                state2 = voact.getConsumptionBtnRed(b.num, b.id);
            }
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
        /**获得数据 */
        private getActivityVo() {
            switch (this.activityType) {
                case AcViewType.RECHARGE_SINGLE:
                    return ActivityModel.getActivityVo<AcPaySetOneVo>(AcViewType.RECHARGE_SINGLE);
                case AcViewType.RECHARGE_ADD_UP:
                    return ActivityModel.getActivityVo<AcPaySumVo>(AcViewType.RECHARGE_ADD_UP);
                case AcViewType.CONSUME_GIFT:
                    return ActivityModel.getActivityVo<AcConsumeVo>(AcViewType.CONSUME_GIFT);
            }
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_scroller);

        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.onActivityAddCharge, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.onActivitySingleCharge, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.onActivityConsumeGift, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ADD_CHARGE, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_CONSUME_GIFT, this);
        }

        /**累计充值 */
        private onActivityAddCharge(id:number) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        }

        /**消费豪礼 */
        private onActivityConsumeGift(id:number) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        }

        /**单笔充值 */
        private onActivitySingleCharge(id:number) {
            if (this.m_nActivityId == id) {
                this.refreshView();
            }
        }

    }

}