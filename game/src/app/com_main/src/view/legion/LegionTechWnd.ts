module com_main {
	export class LegionTechWnd extends CView {
		public static NAME = 'LegionTechWnd';
		public static PRO_MAX: number = 430;

		public m_PopUp: com_main.APopUp;
		public m_pIconRoot: eui.Group;
		public m_imgIcon: eui.Image;
		public m_labName: eui.Label;
		public m_labLevel: eui.Label;
		public m_imgPro: eui.Image;
		public m_labExp: eui.Label;
		public m_labCurDes: eui.Label;
		public m_labNextDes: eui.Label;
		public m_labAwardScore: eui.Label;
		public m_labAwardExp: eui.Label;
		public m_labTimeVal: eui.Label;
		public m_btnGold: com_main.ComCostTextButton;
		public m_btnNor: com_main.ComCostTextButton;

		private maxExp: number;
		/**科技类型 */
		private m_nType = null;

		public constructor(data?) {
			super();
			this.m_nType = (data && data.type) || 1;
			this.name = LegionTechWnd.NAME;
			this.initApp("legion/LegionTechWndSkin.exml");
		}

		public onDestroy(): void {
			this.removeEvent()
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_TITEL_TECH));
			this.refreshView();
			this.addEvent();
		}

		/**刷新界面 */
		private refreshView() {
			let vo = LegionModel.getTeachVoByType(this.m_nType);
			if (!vo) return;
			this.m_labName.text = vo.name;
			this.m_imgIcon.source = vo.cfg.icon + '_png';

			/**贡献材料设置 */
			let cfg = C.GuildDonationConfig[this.m_nType];
			let itemGold = Utils.parseCommonItemJson(cfg.expend1)[0];
			this.m_btnGold.setCostImg(RoleData.GetMaterialIconPathById(itemGold.itemId));
			this.m_btnGold.setTitleLabel(GCode(CLEnum.GUILD_DONATE));
			this.m_btnGold.setCostLabel(itemGold.count.toString());


			let itemNor = Utils.parseCommonItemJson(cfg.expend2)[0];
			this.m_btnNor.setCostImg(RoleData.GetMaterialIconPathById(itemNor.itemId));
			this.m_btnNor.setTitleLabel(GCode(CLEnum.GUILD_DONATE));
			this.m_btnNor.setCostLabel(itemNor.count.toString());


			let award = Utils.parseCommonItemJson(cfg.gain)[0];
			this.m_labAwardScore.text = `${award.count}`;

			this.m_labAwardExp.text = `${cfg.guild_exp}`;

			this.refreshCount();
			this.refreshExp();
		}

		/**经验刷新 */
		private refreshExp() {
			let vo = LegionModel.getTeachVoByType(this.m_nType);
			if (!vo) return;
			this.m_labLevel.text = vo.level.toString();

			this.m_labCurDes.text = vo.des;
			this.maxExp = vo.maxExp;
			if (this.maxExp > 0) {
				this.m_labExp.text = `${vo.exp}/${this.maxExp}`;
				this.m_imgPro.width = (vo.exp / this.maxExp) * LegionTechWnd.PRO_MAX;

				this.m_labNextDes.text = vo.nextDes;
			} else {
				this.m_labExp.text = GCode(CLEnum.LEVEL_MAX1);
				this.m_imgPro.width = LegionTechWnd.PRO_MAX;
				this.m_labNextDes.text = GCode(CLEnum.NONE);
			}
		}

		//捐献次数刷新
		private refreshCount() {
			let curNum = LegionModel.getdonateResourceCount();
			let maxNum = LegionModel.getDonaMaxNum();
			let leftNum = maxNum - curNum;
			let isEmpty = leftNum == 0;
			this.m_labTimeVal.text = isEmpty ? GCode(CLEnum.GUILD_DONATE_NONE) : `${leftNum}/${maxNum}`;
			this.m_btnNor.enabled = !isEmpty;
			Utils.isGray(isEmpty, this.m_btnNor);
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private addEvent() {
			EventMgr.addEvent(LegionEvent.LEGION_TECH_UPDATE, this.onTechUpdate, this);
			EventManager.addTouchScaleListener(this.m_btnGold, this, this.onBtnGoldHandler);
			EventManager.addTouchScaleListener(this.m_btnNor, this, this.onBtnNorHandler);
		}

		private removeEvent() {
			EventMgr.removeEventByObject(LegionEvent.LEGION_TECH_UPDATE, this);
		}

		/**金币升级 */
		private onBtnGoldHandler() {
			let cfg = C.GuildDonationConfig[this.m_nType];
			let info = Utils.parseCommonItemJson(cfg.expend1)[0];
			if (this.maxExp > 0) {
				if (PropModel.isItemEnough(info.itemId, info.count, 1)) {
					LegionProxy.send_GUILD_TECH_DONATE(this.m_nType, 1);//捐献请求 参数tag 1金币  2材料
				}
			} else {
				EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
			}
		}

		/**材料升级 */
		private onBtnNorHandler() {
			let cfg = C.GuildDonationConfig[this.m_nType];
			let info = Utils.parseCommonItemJson(cfg.expend2)[0];
			if (this.maxExp > 0) {
				if (PropModel.isItemEnough(info.itemId, info.count, 1) && this.maxExp > 0) {
					LegionProxy.send_GUILD_TECH_DONATE(this.m_nType, 2);//捐献请求 参数tag 1金币  2材料
				}
			} else {
				EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
			}

		}

		/**科技更新 */
		private onTechUpdate(type: number) {
			if (this.m_nType != type) return;
			this.refreshExp();
		}

        /**=====================================================================================
          * 事件监听 end
          * =====================================================================================
          */

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.GUILD_TECH_DONATE,
			];
		}
		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.GUILD_TECH_DONATE: {// 联盟捐献
					this.refreshCount();
					break;
				}
			}
		}


	}
}