module com_main {
	export class WelfareCell extends CComponent {
		public m_pIconItem: com_main.ComItemNew;
		public m_groupGetFlag: eui.Group;
		public m_phaveLevel: eui.Label;
		public m_dobuleGroup: eui.Group;
		public m_pLbDoubleStr: eui.Label;

		private actionGroup: egret.tween.TweenGroup;;   //选中动画
		public m_imgSelect: eui.Image;
		private m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击
		private m_cfg: SignUpConfig;
		private m_currbuqNum: number;//当前补签次数
		private m_currPrice: number;  //当前补签所需价格
		// private m_eqLvEff: MCDragonBones;
		public constructor(cfg: SignUpConfig) {
			super();
			this.skinName = Utils.getSkinName("app/welfare/WelfareCellSkin.exml");
			this.m_cfg = cfg;
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			super.onDestroy();
			this.actionGroup.removeEventListener("complete", this.replay, this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.cacheAsBitmap = true;
			this.m_imgSelect.visible = false;
			this.actionGroup.play(0);
			this.actionGroup.addEventListener('complete', this.replay, this);
			this.init();
		}
		public replay(): void {
			this.actionGroup.play(0);
		}


		public init() {
			if (!this.m_cfg) return;
			let rewardCfg = Utils.parseCommonItemJson(this.m_cfg.reward);
			this.m_pIconItem.setItemInfo(rewardCfg[0].itemId, rewardCfg[0].count);
			if (this.m_cfg.doubling) {
				this.m_dobuleGroup.visible = true;
			} else {
				this.m_dobuleGroup.visible = false;
			}
			this.m_pLbDoubleStr.text = GCodeFromat(CLEnum.AC_SIGN_VIP, this.m_cfg.vip)
			EventManager.addTouchTapListener(this, this, this.onClickHandler);
		}
		public updateState(state) {
			if (this.m_state == state) return;
			this.m_state = state;

			if (state == 0) {
				this.m_groupGetFlag.visible = true;
				this.m_phaveLevel.text = GCode(CLEnum.TAKE_OUT_END);
				this.m_phaveLevel.textColor = 0x70f145
				this.m_imgSelect.visible = false;
			} else if (state == 1) {
				this.m_imgSelect.visible = true;
				this.m_groupGetFlag.visible = true;
				this.m_phaveLevel.text = GCode(CLEnum.AC_SUP_SIGN);
				this.m_phaveLevel.textColor = 0xf3a549
			} else if (state == 2) {
				this.m_imgSelect.visible = true;
				this.m_groupGetFlag.visible = false;
			} else if (state == 3) {
				this.m_imgSelect.visible = true;
				this.m_groupGetFlag.visible = true;
				this.m_phaveLevel.text = "可补领"/*GCode(CLEnum.AC_SUP_SIGN)*/;
				this.m_phaveLevel.textColor = 0xf3a549
			} else {
				this.m_groupGetFlag.visible = false;
			}
		}

		private onClickHandler(e: egret.Event) {
			if (this.m_state == 1) {
				this.onBuyNum();

			} else if (this.m_state == 2) { //可签到
				WelfareProxy.send_SIGN_UP();
			} else if (this.m_state == 3) {	//可补领
				WelfareProxy.send_PATCH_COLLA();
			}
		}
		/**目前补签次数 */
		public updateBuQian(num: number) {
			this.m_currbuqNum = num;
		}
		/**消耗元宝补签 */
		private onBuyNum() {
			let costList = ConstUtil.getNumArray(IConstEnum.SIGN_UP_PRICE);
			let num = this.m_currbuqNum > 0 ? this.m_currbuqNum : 0;
			this.m_currPrice = costList[num];

			if (PropModel.isItemEnough(PropEnum.GOLD, this.m_currPrice, 2)) {
				let content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, costList[num]);
				Utils.showConfirmPop(content, () => {
					WelfareProxy.send_SUPPLEMENT_SIGN_UP();
				}, this);
			}
		}
	}
}