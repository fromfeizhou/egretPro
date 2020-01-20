// TypeScript file

module com_main {
	export class NewGenLimitBuyPanel extends DynamicComponent {

		public m_allGroup: eui.Group;
		public m_titleImg: eui.Image;
		public m_once: eui.Group;
		public m_lbValue: eui.BitmapLabel;
		public m_itemList: eui.Group;
		public m_btnGet: com_main.ComPayButton;

		private m_effect: MCDragonBones;	//按钮特效
		private m_vo: AcNewGenVisVo;           //活动数据
		// private m_config: ActivityTotalPayRewardConfig;
		public constructor() {
			super();
			this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenLimitBuySkin.exml");
		}

		public onShow() {
			this.initEvent();
			this.m_vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
			if(!this.m_vo) return;
			let config = this.m_vo.rechargeCfgs[0];
			this.refreshReward(Utils.parseCommonItemServ(config.reward));

			this.refreshBtnState();

			let vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
			eui.getAssets(vo.getNewGenRewordCfg().titleStr1 + '_png', () => {
				let tex = RES.getRes(vo.getNewGenRewordCfg().titleStr1 + '_png');
				this.m_titleImg.source = tex;
				this.m_titleImg.anchorOffsetX = this.m_titleImg.width / 2;
				this.m_titleImg.anchorOffsetY = this.m_titleImg.height / 2;
				this.m_once.x = this.m_titleImg.x + this.m_titleImg.width / 2 - 15;
			}, this)
		}

		public onDestroy(): void {
			super.onDestroy();
			this.removeEvent();
			this.clearBtnEff();
		}

		public refreshBtnState() {
			let state = this.m_vo.getLimitStatu();
			this.m_btnGet['commitProperties']();
			if (state == 0) { //未购买
				let config = this.m_vo.rechargeCfgs[0];
				this.m_btnGet.cost = config.price;
				this.setEff();
			} else if (state == 1) { //领取
				this.m_btnGet.otherLabel = GCode(CLEnum.TAKE_OUT);
				this.clearBtnEff();
			} else if (state == 2) { //已领取
				this.m_btnGet.otherLabel = GCode(CLEnum.TAKE_OUT_END);
				this.m_btnGet.disabled = true;
			}
		}

		/**按钮特效 */
		private setEff() {
			if (!this.m_effect) {
				this.m_effect = new MCDragonBones();
				this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
				this.m_effect.play(IETypes.EUI_BtnEffect02);
				this.m_effect.x = 135;
				this.m_effect.y = 47.5;
				this.m_btnGet.addChild(this.m_effect);
			}
		}

		private clearBtnEff() {
			if (this.m_effect) {
				this.m_effect.destroy();
				this.m_effect = null;
			}
		}

		//设置奖励列表
		private refreshReward(reward: IItemInfo[]) {
			this.m_itemList.removeChildren();
			for (let item of reward) {
				let itemView = ComItemNew.create('count', true, true);
				itemView.setItemInfo(item.itemId, item.count);
				this.m_itemList.addChild(itemView);
			}
		}

        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

		private initEvent() {
			EventManager.addTouchScaleListener(this.m_btnGet, this, this.onClicGet);
			EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GEN_LIM, this.refreshBtnState, this);
		}

		private removeEvent() {
			EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GEN_LIM, this);
			EventManager.removeEventListeners(this);
		}
		/**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

		//领取奖励
		private onClicGet(e: egret.TouchEvent) {
			let state = this.m_vo.getLimitStatu();
			if (state == 0) { //未购买
				let config = this.m_vo.rechargeCfgs[0];
				PayProxy.C2S_RECHARGE(config.id, config.price)
				return;
			} else if (state == 1) { //领取
				ActivityProxy.send_C2S_ACTIVITY_AWARD_GENERAL_BAG(this.m_vo.id);
			} else if (state == 2) { //已经领取过了
				EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
			}
		}
	}
}