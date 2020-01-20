module com_main {

    export class GrowFundPanl extends CComponent implements IRechargeMainWnd {
        /**面板类型 */
        public m_imgIcon: eui.Image;
        public m_labOpenTime: com_main.CLabel;
        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.List;
        public m_pBoxRoot: eui.Group;
        public m_pBtnBuy: eui.Group;
        public m_btnGrowBuy: com_main.ComPayButton;
        public m_pTimeGroup: eui.Group;


        public activityType: AcViewType;
        public bInit: boolean;
        private activiVo: GrowthFundVo;
        private growfundCfg: ActivityGrowthFundRewardConfig[];// 成长基金数据信息
        private m_tCollection: eui.ArrayCollection;
        private m_shopList = [];
        private m_effect: MCDragonBones;	//按钮特效

        public constructor(type: AcViewType) {
            super();
            this.activityType = type;
            this.currentState = "recharge"
            this.skinName = Utils.getSkinName("app/pay/recharge/PayRechargePanelSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy()
            this.clearEffect();
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
            this.m_pBoxRoot.visible = false;
            this.m_pBtnBuy.visible = true;
            this.m_pTimeGroup.visible = false;
            EventManager.addTouchScaleListener(this.m_btnGrowBuy, this, this.onBtnBuyHandler);

        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;

            this.activiVo = ActivityModel.getActivityVo<GrowthFundVo>(this.activityType);
            this.initListView();
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activityType + '_jpg');
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            this.bInit = true;
            this.addEvent();
        }

        public updateDownTime() {
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate)
                return;
            let str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(`${timeStr}<font color=#00ff00>${str}</font>`);
        }

        /**列表显示 */
        private initListView() {
            this.setBtnBuyState();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemRoot.itemRenderer = RechargeItemRender;
            this.m_pItemRoot.dataProvider = this.m_tCollection;
            //配置表初始化
            this.growfundCfg = [];
            if (this.activiVo) {
                for (let k in C.ActivityGrowthFundRewardConfig) {
                    this.growfundCfg.push(C.ActivityGrowthFundRewardConfig[k]);
                }
            }
            let res: IRechargeItemRD[] = [];
            for (let id = 0; id < this.growfundCfg.length; id++) {
                res.push({ type: 3, width: this.m_scroller.width, id: this.growfundCfg[id].id, reward: this.growfundCfg[id].reward, num: this.growfundCfg[id].playerLevel, desc: '', vo: this.activiVo })
            }
            res.sort(this.cfgsort);
            this.m_tCollection.replaceAll(res);
        }

        /**购买成长基金 */
        private onBtnBuyHandler(e: egret.Event): void {
            let cfg = this.activiVo.getRechargeCfg();
            PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            // let price = this.activiVo.getRechargeCfg().price[0];
            // if (PropModel.isItemEnough(PropEnum.YU, price.value, 1)) {
            //     PayProxy.C2S_JADE_BUY(IRechargeEnum.GROW_FUN);
            //     // UpManager.history();
            // }
        }
        /**刷新显示 */
        public refreshView() {
            // this.activiVo = ActivityModel.getActivityVo(this.activityType);
            if (!this.bInit) return;
            this.m_tCollection.source.sort(this.cfgsort)
            this.m_tCollection.refresh();
            this.setBtnBuyState();
        }
        /**设置按钮状态 */
        private setBtnBuyState() {
            this.activiVo = ActivityModel.getActivityVo<GrowthFundVo>(this.activityType);
           
            if(this.activiVo.buyGrowthFund){
                this.m_btnGrowBuy.otherLabel = GCode(CLEnum.BUY_ALR)
                this.m_btnGrowBuy.enabled = false;
                this.clearEffect();
            }else{
                this.m_btnGrowBuy.cost = this.activiVo.getRechargeCfg().price;
                this.m_btnGrowBuy.enabled  = true;
                this.setEff();
            }
            Utils.isGray(this.activiVo.buyGrowthFund, this.m_btnGrowBuy);

            if (this.activiVo.buyGrowthFund) {
                this.clearEffect();
            } else {
                this.setEff();
            }
        }
        /**排序 */
        private cfgsort(a: IRechargeItemRD, b: IRechargeItemRD) {
            let state1: number;
            let state2: number;
            let voact = ActivityModel.getActivityVo<GrowthFundVo>(AcViewType.FUND_GROWTH);
            state1 = voact.getGrowFundBtnRed(a.num, a.id);
            state2 = voact.getGrowFundBtnRed(b.num, b.id);
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
        /**设置特效 */
        private setEff() {
            if (this.m_effect) return;
            this.m_effect = NormalMcMgr.createMc(IETypes.EUI_FundGrowth);
            this.m_effect.x = 118;
            this.m_effect.y = 37.5;
            this.m_effect.scaleX = 1.34;
            this.m_effect.scaleY = 1.34;
            this.m_btnGrowBuy.addChild(this.m_effect);
        }
        private clearEffect() {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
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
            EventMgr.addEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, this.onActivityGrowthFun, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GROWTH_FUN, this);
        }

        /**成长基金 */
        private onActivityGrowthFun() {
            this.refreshView();
        }

    }

}