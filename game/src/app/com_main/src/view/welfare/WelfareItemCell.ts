module com_main {
	export class WelfareItemCell extends CComponent {
		private m_signUpCfg: SignUpConfig;
		private m_comItem: ComItemNew;
		private m_groupGetFlag: eui.Group;
		private m_labGetFlag: eui.Label;
		public m_mask: eui.Rect;
		public m_black: com_main.CImage;

		private m_state = -1; //0已领取 ，1可领奖，-1其他不可点击
		private m_ItemEff: MCDragonBones;  //可领特效

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/welfare/WelfareItemCellSkin.exml");
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			super.onDestroy();
			 this.clearEffect();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.cacheAsBitmap = true;
			this.m_comItem.mask = this.m_mask;
		}

		public init(cfg) {
			this.m_signUpCfg = cfg;
			if (cfg) {
				let items = Utils.parseCommonItemJson(cfg.extraReward);
				this.m_comItem.setItemInfo(items[0].itemId, items[0].count);
				EventManager.addTouchTapListener(this, this, this.onClickItem);
			}
		}

		public updateState(state) {
			if (this.m_state == state) return;
			this.m_state = state;
			this.m_black.visible = false;
			if (state == 0) {
				this.m_groupGetFlag.visible = true;
				this.m_labGetFlag.text = GCode(CLEnum.TAKE_OUT_END);
				this.clearEffect();
			} else if (state == 1) {
				this.m_groupGetFlag.visible = true;
				this.m_labGetFlag.text = GCode(CLEnum.TAKE_OUT_IN);
				this.createEffect();
			} else {
				this.m_groupGetFlag.visible = false;
				Utils.isGray(false, this.m_comItem);
				this.m_black.visible = true;
				this.clearEffect();
			}
		}

		/**获取配置表 */
		public get signCfg(): SignUpConfig {
			return this.m_signUpCfg;
		}

		/**额外奖励领取 */
		private onClickItem(e: egret.Event) {
			if (this.m_state == 1) {
				WelfareProxy.send_RECEIVE_SIGN_UP_EXTRA_REWARD(this.m_signUpCfg.id);
			}
		}
		//=============================================================================================================================================
		//特效 begin
		//============================================================================================================================================= 
		/**设置特效 */
		private createEffect() {
			if (this.m_ItemEff) return;
			this.m_ItemEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
			this.m_ItemEff.x = this.width / 2;
			this.m_ItemEff.y = 48.5;
			// this.m_generalEff.play(IETypes.EUI_EqLevelEff, 0);
			this.addChild(this.m_ItemEff);
		}
		private clearEffect() {
			if (this.m_ItemEff) {
				NormalMcMgr.removeMc(this.m_ItemEff);
				this.m_ItemEff = null;
			}
		}
		//=============================================================================================================================================
		//特效 end
		//============================================================================================================================================= 
	}
}