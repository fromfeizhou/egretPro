module com_main {
    /**
     * 直购礼包
     * 
     */
    export class PurchageGiftBagPanel extends CComponent implements IRechargeMainWnd {
        /**面板类型 */
        public m_imgIcon: eui.Image;
        public m_labOpenTime: com_main.CLabel;
        public m_labDesc: com_main.CLabel;
        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.List;
        public m_pBoxRoot: eui.Group;
        public m_btnBox: eui.Image;
        public m_AllOutRoot: eui.Group;
        public m_boxRoot: eui.Group;
        public m_labPro: com_main.CLabel;
        public m_pBtnBuy: eui.Group;
        public m_btnGrowBuy: com_main.ComButton;


        public activityType: AcViewType;
        public bInit: boolean;

        private payCfg: gameProto.IRechargeConfig[];
        private m_tCollection: eui.ArrayCollection;

        public constructor(type: AcViewType) {
            super();
            this.activityType = type;
            this.currentState = "recharge"
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
            let actvo = ActivityModel.getActivityVo<AcPuGigtBagVo>(AcViewType.PURCHAGE_BAG);

        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.initListView();
            let activiVo = this.getActivityVo();
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        }

        public updateDownTime() {
            let activiVo = this.getActivityVo();
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
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
                this.payCfg = activiVo.rechargeCfgs;
            }
            let res: IRechargeItemRD[] = [];
            for (let id = 0; id < this.payCfg.length; id++) {
                res.push({ type: 2, width: this.m_scroller.width, id: this.payCfg[id].id, reward: Utils.parseCommonItemServ(this.payCfg[id].reward), num: this.payCfg[id].price, desc: this.payCfg[id].name, vo: activiVo })
            }
            res.sort(this.cfgsort.bind(this));
            this.m_tCollection.replaceAll(res);
        }

        /**刷新显示 */
        public refreshView() {
            if (!this.bInit) return;
            this.m_tCollection.source.sort(this.cfgsort.bind(this));
            this.m_tCollection.refresh();
        }

        /**排序 */
        private cfgsort(a: IRechargeItemRD, b: IRechargeItemRD) {
            let activiVo = <AcPuGigtBagVo>this.getActivityVo();
            let state1: number = activiVo.getPurchageGiftBagBtnRed(a.id);
            let state2: number = activiVo.getPurchageGiftBagBtnRed(b.id);
            if (state1 != state2) {
                return state1 - state2;
            } else {
                return a.id - b.id;
            }


        }
        /**获得数据 */
        private getActivityVo() {
            return ActivityModel.getActivityVo<AcPuGigtBagVo>(AcViewType.PURCHAGE_BAG);
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //TimerHandler
            Utils.toStageBestScaleHeigt(this.m_scroller);
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(ActivityEvent.ACTIVITY_PU_GIFT, this.onActivityMoonCard, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PU_GIFT, this);
        }

        /**直购礼包刷新 */
        private onActivityMoonCard() {
            this.refreshView();
        }


    }

}