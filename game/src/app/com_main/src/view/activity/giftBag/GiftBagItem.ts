module com_main {
    export class GiftBagItem extends CView implements IGiftbagWnd {
        public static NAME = 'GiftBagItem';
        public m_pRoot: eui.Group;
        public m_imgRole: eui.Image;
        public m_payRoot: eui.Group;
        public m_btnBuy: com_main.ComPayButton;
        public m_goldRoot: eui.Group;
        public m_btnVipBuy: com_main.ComPayButton;
        public m_labTip: eui.Label;
        public m_imgPic: eui.Image;
        public m_labGen: eui.Label;
        public m_labTime: eui.Label;
        public m_groupAward: eui.Group;

        /**礼包 */
        public giftId: number;   //礼包id
        public giftTime: number; //礼包倒计时
        public giftState: number; //礼包领取状态
        public bInit: boolean;
        private giftVo: GiftBagVo;
        public constructor(param: GiftBagVo) {
            super();
            this.name = GiftBagItem.NAME;
            this.giftId = param.giftBagId;
            this.giftState = param.giftBagStatus;
            this.giftTime = param.getCountDown();
            this.giftVo = param;
            this.initApp("activity/giftBag/GiftBagItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
        }

        public initView() {
            if (this.bInit) return;
            this.addEvent();
            this.m_labTime.text = this.getCountDown();
            this.InitShowItem();
            this.onRefreshImg();
            this.onRefreshImgPic();
            this.bInit = true;
            window["ta"].track('GiftWnd', { giftId: this.giftId, 'trigger_time': new Date() });
        }
        /**显示物品 */
        private InitShowItem() {
            this.m_groupAward.removeChildren();
            let arwardList = Utils.parseCommonItemServ(this.giftVo.rechargeConfig.reward);
            for (let i = 0; i < arwardList.length; i++) {
                let itemView = ComItemNew.create("count");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
            }
            this.m_labGen.text = this.giftVo.rechargeConfig.description;
            this.refreshBtn();
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        }

        /**倒计时回调 */
        public timeCall() {
            if (this.giftTime < 0) return;
            this.giftTime--;
            this.giftTime = Math.max(0, this.giftTime);
            this.m_labTime.text = this.getCountDown();
        }

        /**刷新形象 */
        private onRefreshImg() {
            let source: string;
            if (this.giftVo.giftBagType == GiftItemEnum.redGen) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            } else if (this.giftVo.giftBagType == GiftItemEnum.roleLv) {
                source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
            } else if (this.giftVo.giftBagType == GiftItemEnum.genUpLv || this.giftVo.giftBagType == GiftItemEnum.genTupo) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            } else if (this.giftVo.giftBagType == GiftItemEnum.haveGenGm) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            } else {
                source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
            }
            this.m_imgRole.source = source;
        }
        /**刷新美术字显示 */
        private onRefreshImgPic() {
            let source: string;
            if (this.giftVo.giftBagType == GiftItemEnum.redGen) {
                source = 'lb_hjzslb_png';
            } else if (this.giftVo.giftBagType == GiftItemEnum.roleLv) {
                source = 'lb_jzdjlb_png';
            } else if (this.giftVo.giftBagType == GiftItemEnum.genTupo) {
                source = 'lb_wjtplb_png';
            } else if (this.giftVo.giftBagType == GiftItemEnum.roleVipGm) {
                source = 'lb_gzlb_png';
            } else if (this.giftVo.giftBagType == GiftItemEnum.genUpLv) {
                source = 'lb_wjdjlb_png';
            } else {
                source = 'lb_qylb_png';
            }
            this.m_imgPic.source = source;
        }


        /**刷新显示 */
        public refreshView() {
            this.refreshBtn();
        }
        /**按钮显示 */
        private refreshBtn() {
            if (GiftBagModel.getButtonState(this.giftId) == 1) {
                this.m_btnBuy.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.setbtnInfo(true);
            } else {
                this.m_btnBuy.cost = this.giftVo.rechargeConfig.price;
                this.setbtnInfo(false);
            }

            // let prices = this.giftVo.rechargeConfig.price;
            // let sources = GiftBagModel.getButtonState(this.giftId) == 1 ? '': PropModel.getPropIcon(prices[0].key);
            // let str = GiftBagModel.getButtonState(this.giftId) == 1 ? GCode(CLEnum.TAKE_OUT) : '' + prices[0].value;
            // this.m_btnBuy.setCostLabel(str);
            // this.m_btnBuy.setCostImg(sources);
        }
        /**设置按钮位置显示 */
        private setbtnInfo(boo: boolean) {
            if (boo) {
                this.m_payRoot.x = 258;
                this.m_goldRoot.visible = false;
            } else {
                this.m_payRoot.x = VipModel.isHVipGoldDis() ? 107 : 258;
                this.m_goldRoot.visible = VipModel.isHVipGoldDis();
                let price = VipModel.getHVipGoldBuyPrice(this.giftVo.rechargeConfig.price);
                this.m_btnVipBuy.setCostLabel(price.toString());
                this.m_labTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY, VipModel.getHVipGoldLv()));
            }
        }
        /**刷新列表数据 */
        private refresh() {

        }
        /**人民币购买 */
        private OnClickHander() {
            if (GiftBagModel.getButtonState(this.giftId) == 0) {
                PayProxy.C2S_RECHARGE(this.giftId, this.giftVo.rechargeConfig.price);
            } else {
                GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_AWARD(this.giftId);

            }
        }
        /**vip10购买 */
        private OnGoldBuyBtn(e: egret.Event) {
            let price = VipModel.getHVipGoldBuyPrice(this.giftVo.rechargeConfig.price);
            if (VipModel.canHVipBuy(price)) {
                PayProxy.C2S_GOLD_BUY(this.giftId);
            }
        }


        public getCountDown() {
            return Utils.DateUtils.getCountDownStrBySecond(this.giftTime);
        }

        public getLeftTime() {
            return this.giftTime;
        }
        public getTitle() {
            return this.giftVo.rechargeConfig.name;
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnBuy, this, this.OnClickHander);
            EventManager.addTouchScaleListener(this.m_btnVipBuy, this, this.OnGoldBuyBtn);
            EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this.onGiftBagUpdate, this);
        }

        /**移除事件 */
        private removeEvent() {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
        }

        private onGiftBagUpdate(id: number) {
            if (id == this.giftId) {
                this.refreshView();
            }
        }

    }
}