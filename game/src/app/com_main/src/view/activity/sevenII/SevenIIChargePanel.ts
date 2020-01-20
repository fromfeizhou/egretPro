module com_main {

    export class SevenIIChargePanel extends DynamicComponent {
        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.List;
        public m_imgIcon: eui.Image;

        private m_tCollection: eui.ArrayCollection;
        private m_activiVo: any;
        private payCfg: ActivitySinglePayRewardConfig[];
        private m_type: number;
        public constructor() {
            super();
            this.dynamicSkinName = Utils.getSkinName("app/activity/sevenII/SevenIIChargePanelSkin.exml");
        }

        protected onShow() {
            this.addEvent();

            switch (this.m_type) {
                case AcViewType.RECHARGE_SINGLE_2: {
                    this.m_activiVo = this.getActivityVo(this.m_type) as AcPaySetOneVo;
                    this.m_imgIcon.source = 'lb_7t_xsdbcz_png';
                    break
                }
                case AcViewType.RECHARGE_SINGLE_3: {
                    this.m_activiVo = this.getActivityVo(this.m_type) as AcPaySetOneVo;
                    this.m_imgIcon.source = 'lb_7t_cjczhlxs_png';
                    break
                }
                case AcViewType.RECHARGE_ADD_UP_3: {
                    this.m_activiVo = this.getActivityVo(this.m_type) as AcPaySumVo;
                    this.m_imgIcon.source = 'lb_7t_ljfl_png';
                    break;
                }
                case AcViewType.RECHARGE_ADD_UP_5: {
                    this.m_activiVo = this.getActivityVo(this.m_type) as AcPaySumVo;
                    this.m_imgIcon.source = 'lb_7t_jsjcnnyy_png';
                    break;
                }
            }
            this.init();
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
        //     this.addEvent();
        // }
        /**根据类型读取数据 */
        public setType(type: number) {
            this.m_type = type;
        }
        //初始化
        public init() {
            if (this.m_activiVo) {
                this.initListView();
            }
        }
        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.refreshRechargeView, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.refreshRechargeView, this);

        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ADD_CHARGE, this);
        }

        /**充值完成刷新单笔和累计充值 */
        private refreshRechargeView(id: number) {
            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        }
        /**列表显示 */
        public initListView() {
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = SevenIIChargeItem;
            this.m_pItemRoot.dataProvider = this.m_tCollection;

            if (this.m_activiVo) {
                let cfgs = this.m_activiVo.getRechargeCfgBy();
                this.payCfg = [];
                for (let key in cfgs) {
                    if (unNull(cfgs[key])) {
                        this.payCfg.push(cfgs[key]);
                    }
                }
            }
            let res: IRechargeItemRD[] = [];
            for (let id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 0, width: this.m_scroller.width, id: this.payCfg[id].id, reward: this.payCfg[id].reward, num: this.payCfg[id].level, desc: this.payCfg[id].desc, vo: this.m_activiVo })
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        }
        /**排序 */
        private cfgsort(a: IRechargeItemRD, b: IRechargeItemRD) {
            let state1: number;
            let state2: number;

            if (a.vo.viewType == AcViewType.RECHARGE_SINGLE_2 || a.vo.viewType == AcViewType.RECHARGE_SINGLE_3) {
                state1 = this.m_activiVo.getRechargeOneBtnRed(a.num, a.id);
                state2 = this.m_activiVo.getRechargeOneBtnRed(b.num, b.id);

            } else if (a.vo.viewType == AcViewType.RECHARGE_ADD_UP_3 || a.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) {
                state1 = this.m_activiVo.getAllRechargeBtnRed(a.num, a.id);
                state2 = this.m_activiVo.getAllRechargeBtnRed(b.num, b.id);
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
        private getActivityVo(type: number) {
            switch (type) {
                case AcViewType.RECHARGE_SINGLE_2:
                case AcViewType.RECHARGE_SINGLE_3: {
                    return ActivityModel.getActivityVo<AcPaySetOneVo>(type);
                }
                case AcViewType.RECHARGE_ADD_UP_3:
                case AcViewType.RECHARGE_ADD_UP_5: {
                    return ActivityModel.getActivityVo<AcPaySumVo>(type);
                }
            }
        }
    }
}