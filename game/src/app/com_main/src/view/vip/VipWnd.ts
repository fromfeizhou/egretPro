module com_main {
	/**
	 * 任务面板相关
	 */
    export class VipWnd extends CView {
        public static NAME = 'VipWnd';
        public static PRO_MAX: number = 436;
        public m_MainTopNew: com_main.MainTopNew;
        public m_pViewRoot: eui.Group;
        public m_labPlayerVip: eui.BitmapLabel;
        public m_labTaget: eui.Label;
        public m_lbExp: eui.Label;
        public m_imgVipPro: com_main.CImage;
        public m_btnRecharge: com_main.ComButton;
        public m_pBoxBtn: com_main.CImage;
        public m_pDailyRed: com_main.CImage;
        public m_pBoxTipsRoot: eui.Group;
        public m_labBoxTip: eui.Label;
        public m_btnVipShop: com_main.CImage;
        public m_labPrivigeLeft: eui.BitmapLabel;
        public m_labMoneyTaget: eui.Label;
        public m_labPrivigeRight: eui.BitmapLabel;
        public m_pOriRoot: eui.Group;
        public m_labOri: eui.Label;
        public m_labPrice: eui.Label;
        public m_btnBuy: com_main.ComButton;
        public m_pAwardList: eui.List;
        public m_lbLevelState: com_main.CLabel;
        public m_btnLeft: eui.Image;
        public m_btnRight: eui.Image;
        public m_pDesScoller: eui.Scroller;
        public m_pDesList: eui.List;



        private m_tCollections: eui.ArrayCollection;
        private m_tAwardColls: eui.ArrayCollection;
        private m_nCurVipLv: number;
        private m_btnMissionEff: MCDragonBones;  //任务按钮特效
        public constructor() {
            super();
            this.name = VipWnd.NAME;
            this.initApp("vip/VipWndSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_VIP_DAILY_REWARD,
                ProtoDef.S2C_VIP_LEVEL_REWARD,
                ProtoDef.S2C_RECHARGE_INFO,
                ProtoDef.S2C_RECHARGE
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VIP_DAILY_REWARD: {
                    this.updateDailyAwardState();
                    break;
                }
                case ProtoDef.S2C_VIP_LEVEL_REWARD: {
                    this.updateLevelAwardLab();
                    break;
                }
                case ProtoDef.S2C_RECHARGE_INFO: {
                    break;
                }
                case ProtoDef.S2C_RECHARGE: {
                    this.refreshVipExp();
                    // this.refreshVipLv();
                    this.updateDailyAwardState();
                    break;
                }
            }
        }
        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
            this.clearBtnMissionEffect();
            SceneResGroupCfg.clearModelRes([ModuleEnums.VIP]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_btnRecharge.setTitleLabel(GCode(CLEnum.VIP_CHARGE_NOW));
            this.m_btnBuy.setTitleLabel(GCode(CLEnum.BUY));
            this.m_MainTopNew.setTitleName(GCode(CLEnum.VIP_PRIVIGE));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pDesList.dataProvider = this.m_tCollections;
            this.m_pDesList.itemRenderer = VipPrivilegeCell;

            this.m_tAwardColls = new eui.ArrayCollection([]);
            this.m_pAwardList.dataProvider = this.m_tAwardColls;
            this.m_pAwardList.itemRenderer = VipLvAwardRender;

            this.refreshVipLv();
            this.refreshVipExp();
            let curIndex = RoleData.vipLevel > 0 ? RoleData.vipLevel : 0;
            this.changeIndex(curIndex);
            this.updateDailyAwardState();
            this.initEvent();

            Utils.toStageBestScale(this.m_pViewRoot);
        }
        public onRefresh(body?): void {
            if (VipModel.isReChargeBtnClick) {
                VipModel.isReChargeBtnClick = false;
                let curIndex = RoleData.vipLevel > 0 ? RoleData.vipLevel : 0;
                this.changeIndex(curIndex);
            }

        }
        /**选中改变 */
        private changeIndex(index: number) {
            if (this.m_nCurVipLv == index) return;
            this.m_nCurVipLv = index;
            this.m_btnLeft.visible = this.m_nCurVipLv > 0;
            this.m_btnRight.visible = this.m_nCurVipLv < VipModel.MAX_VIP;
            // this.m_pLRed.visible = VipModel.isHasLevAwardByLev(this.m_nCurVipLv - 1)
            // this.m_pRRed.visible = VipModel.isHasLevAwardByLev(this.m_nCurVipLv + 1)
            this.refreshView();
        }

        /**刷新界面 */
        private refreshView() {
            this.refreshPrivillView();
            this.refreshVipLvGiftView();
            this.refreshVipPrivigeLab();
            this.refreshVipPrice();
            this.updateLevelAwardLab();
            this.updateChargeLab();
        }
        /**刷新充值金额信息 */
        public updateChargeLab() {
            this.m_labMoneyTaget.visible = this.m_nCurVipLv > RoleData.vipLevel;
            let cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv - 1);
            let money = Math.floor((cfg.exp - RoleData.vipIntegral) / 10);
            money = Math.max(0, money)
            this.m_labMoneyTaget.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.VIP_NEXT_TIPS1, money, this.m_nCurVipLv));
        }
        /**刷新每日奖励状态 */
        public updateDailyAwardState() {
            this.m_labBoxTip.text = VipModel.vipVo.vipDailyReward ? GCode(CLEnum.TAKE_OUT_IN) : GCode(CLEnum.TAKE_OUT_END);
            this.m_pBoxBtn.source = VipModel.vipVo.vipDailyReward ? "vip_baoxiang_png" : "vip_baoxiang_open_png"
            this.m_pDailyRed.visible = VipModel.vipVo.vipDailyReward;
        }
        /**刷新价格 */
        public refreshVipPrice() {
            let cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (cfg) {
                this.m_labOri.text = `${cfg.discount}`
                this.m_labPrice.text = `${cfg.price}`
            }
        }
        /**刷新vip等级 */
        private refreshVipLv() {
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
        }
        /**
         * 贵族等级文本
         */
        private refreshVipPrivigeLab() {
            this.m_labPrivigeLeft.text = GCodeFromat(CLEnum.VIP_PRIVIGE_LV, this.m_nCurVipLv);
            this.m_labPrivigeRight.text = GCodeFromat(CLEnum.VIP_PRIVIGE_GIFT, this.m_nCurVipLv);
        }
        /**设置任务领取按钮特效 */
        private createBtnMissionEffect() {
            if (this.m_btnMissionEff) return;
            this.m_btnMissionEff = new MCDragonBones();
            this.m_btnMissionEff.initAsync(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.play(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.x = 72.5;
            this.m_btnMissionEff.y = 30;
            this.m_btnBuy.addChild(this.m_btnMissionEff);
        }
        private clearBtnMissionEffect() {
            if (this.m_btnMissionEff) {
                this.m_btnMissionEff.destroy();
                this.m_btnMissionEff = null;
            }
        }
        /**刷新vip经验 */
        private refreshVipExp() {
            let cfg = VipModel.getVipCfgByLv(RoleData.vipLevel);
            let pro: number = 0;

            let preCfg = VipModel.getVipCfgByLv(RoleData.vipLevel - 1);
            this.m_lbExp.visible = RoleData.vipLevel !== VipModel.MAX_VIP
            if (RoleData.vipLevel > 0) {
                this.m_lbExp.text = cfg.exp - preCfg.exp >= 0 ? `${RoleData.vipIntegral - preCfg.exp}/${cfg.exp - preCfg.exp}` : `${RoleData.vipIntegral - preCfg.exp}`;
                pro = Math.min((RoleData.vipIntegral - preCfg.exp) / (cfg.exp - preCfg.exp), 1);
                // if ( RoleData.vipLevel == VipModel.MAX_VIP) {
                //     this.m_lbExp.text = `${ RoleData.vipIntegral}`
                // }
            } else {
                this.m_lbExp.text = `${RoleData.vipIntegral}/${cfg.exp}`;
                pro = Math.min(RoleData.vipIntegral / cfg.exp, 1);
            }
            this.m_imgVipPro.width = VipWnd.PRO_MAX * pro;

            if (RoleData.vipLevel < VipModel.MAX_VIP) {
                let cfg = VipModel.getVipCfgByLv(RoleData.vipLevel);
                let exp = cfg.exp - RoleData.vipIntegral;
                exp = Math.max(0, exp);
                this.m_labTaget.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.VIP_NEXT_TIPS, exp, RoleData.vipLevel + 1));
            } else {
                this.m_labTaget.text = '';
            }
        }

        /**刷新特权列表 */
        private refreshPrivillView() {
            let list = VipModel.getVipPrivilByVip(this.m_nCurVipLv);
            let res: IVipPrivillRD[] = [];
            for (let i = 0; i < list.length; i++) {
                res.push({ level: this.m_nCurVipLv, data: list[i] });
            }
            res.sort(this.sortByPrivile)
            this.m_tCollections.replaceAll(res);
            this.m_pDesScoller.viewport.scrollV = 0;
        }
        /**特权列表排序 */
        public sortByPrivile(p1: IVipPrivillRD, p2: IVipPrivillRD) {
            function calcuState(m_tData: IVipPrivillRD): number {
                let cfg = C.VipPrivillegesConfig[m_tData.data.key];
                let oldVal = cfg[`vip${m_tData.level - 1}`];
                let state = (oldVal == 0) ? 1 : 3;

                if (state == 3) {
                    state = VipModel.checkVipPrivileUp(m_tData.level, m_tData.data.key) ? 2 : 3;
                }
                return state;
            }
            let state1 = calcuState(p1);
            let state2 = calcuState(p2);
            return state1 - state2;
        }

        /**刷新礼包奖励 */
        private refreshVipLvGiftView() {
            let cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (cfg) {
                let items = Utils.parseCommonItemJson(cfg.levelReward);
                this.m_tAwardColls.replaceAll(items);
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
            EventManager.addTouchScaleListener(this.m_btnVipShop, this, this.onBtnVipShopHandler);
            EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onBtnRechargeHandler);
            EventManager.addTouchScaleListener(this.m_pBoxBtn, this, this.onBtnDailyHandler);
            EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnLevelHandler)

            EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshVipLv, this);
            EventMgr.addEvent(RoleEvent.ROLE_VIP_EXP, this.refreshVipExp, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_EXP, this);
        }

        private onLeftHandler() {
            let index = this.m_nCurVipLv - 1;
            if (index >= 0) this.changeIndex(index);
        }
        public updateLevelAwardLab() {
            this.clearBtnMissionEffect();
            if (VipModel.vipVo.receivedVipLevelReward.indexOf(this.m_nCurVipLv) != -1) {
                this.m_btnBuy.visible = false;
                this.m_lbLevelState.text = GCode(CLEnum.BUY_ALR);
                this.m_lbLevelState.visible = true;
                return;
            }

            if (RoleData.vipLevel >= this.m_nCurVipLv) {
                this.m_btnBuy.visible = true;
                this.createBtnMissionEffect();
                this.m_lbLevelState.visible = false;
                return;
            }
            this.m_btnBuy.visible = false;
            this.m_lbLevelState.visible = true;
            this.m_lbLevelState.text = GCodeFromat(CLEnum.VIP_BUY_LIMIT, this.m_nCurVipLv);
        }
        private onRightHandler() {
            let index = this.m_nCurVipLv + 1;
            if (index <= VipModel.MAX_VIP) this.changeIndex(index);
        }

        /**充值 */
        public onBtnRechargeHandler(pvt: egret.TouchEvent) {
            VipModel.isReChargeBtnClick = true;
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }
        /**没日奖励 */
        public onBtnDailyHandler(pvt: egret.TouchEvent) {
            if (!VipModel.vipVo.vipDailyReward) {
                EffectUtils.showTips(GCode(CLEnum.VIP_GET_TIPS));
                return;
            }
            VipProxy.C2S_VIP_DAILY_REWARD();
        }
        /**等级购买 */
        public onBtnLevelHandler(pvt: egret.TouchEvent) {
            let cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (!cfg) {
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, cfg.price,1)) {
                VipModel.currenReceiveLevel = this.m_nCurVipLv;
                VipProxy.C2S_VIP_LEVEL_REWARD(this.m_nCurVipLv);
            }
        }
        /**vip商城*/
        public onBtnVipShopHandler(pvt: egret.TouchEvent) {
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.NOBLE);
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }

    /**等级礼包奖励 */
    export class VipLvAwardRender extends eui.ItemRenderer {
        public m_item: ComItemNew;
        protected m_tData: IItemInfo;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            Utils.removeFromParent(this.m_item);
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.removeChildren();
            this.m_item = ComItemNew.create('count');
            this.addChild(this.m_item);

        }


        protected dataChanged() {
            this.m_tData = this.data as IItemInfo;
            this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
        }
    }
}