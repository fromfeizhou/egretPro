module com_main {
	/**
	 * 邮件剿匪战报主面板
	 */

	export class CatchBanditsReport extends CComponent implements IMailTabView {
		public static NAME = 'CatchBanditsReport';
		private static PRO_WID: number = 223;

		public m_imgTitle: eui.Image;
		public m_groupReward: eui.Group;
		public m_labCity: eui.Label;
		public m_comState0: com_main.ComState;
		public m_playerName0: eui.Label;
		public m_armsName0: eui.Label;
		public m_power0: eui.Label;
		public m_imgPro0: eui.Image;
		public m_lbArmsCount0: eui.Label;
		public m_groupGenerals0: eui.Group;
		public m_comState1: com_main.ComState;
		public m_playerName1: eui.Label;
		public m_armsName1: eui.Label;
		public m_power1: eui.Label;
		public m_imgPro1: eui.Image;
		public m_lbArmsCount1: eui.Label;
		public m_groupGenerals1: eui.Group;
		public m_imgResult: eui.Image;

		public m_nType: MailType;
		public constructor(type: MailType) {
			super();
			this.name = CatchBanditsReport.NAME;
			this.m_nType = type;
			this.skinName = Utils.getAppSkin('mail/CatchBanditsReportSkin.exml');
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			this.clearHeadItem(this.m_groupGenerals0);
			this.clearHeadItem(this.m_groupGenerals1);
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

		}

		public refresh(info: gameProto.S2C_MAILBOX_INFO): void {
			let data = JSON.parse(info.text) as ICBReportMailInfo;
			this.m_imgTitle.source = data.victory == 1 ? 'zb_sl_jpg' : 'zb_zb_jpg';
			this.m_imgResult.source = data.victory == 1 ? "lb_ty1_s_png" : "lb_ty4_b_png";
			let rewards = Utils.parseCommonItemJson(data.reward);
			this.m_groupReward.removeChildren();
			for (let i = 0; i < rewards.length; i++) {
				let item = ComItemNew.create('count');
				NodeUtils.setScale(item, 0.9);
				item.setItemInfo(rewards[i].itemId, rewards[i].count);
				this.m_groupReward.addChild(item);
			}
			if (rewards.length == 0) {
				this.currentState = 'empty';
			} else {
				this.currentState = 'base';
			}

			this.m_labCity.text = WorldModel.getCityName(data.cityId);
			this.setItemView(data.atkWildMonsterReportTeamData, 0, data.victory == 1);
			this.setItemView(data.defWildMonsterReportTeamData, 1, data.victory == 0);
		}

		/**设置单个item显示 */
		private setItemView(data: IWMReportTeamData, fix: number, isWin: boolean) {
			let countryId = data.isNpc == 1 ? 4 : RoleData.countryId;
			let comState: ComState = this[`m_comState${fix}`];
			comState.stateId = countryId;

			let labName: eui.Label = this[`m_playerName${fix}`];
			labName.text = data.playerName;

			let labTeamName: eui.Label = this[`m_armsName${fix}`];
			labTeamName.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(data.teamId);

			let labPower: eui.Label = this[`m_power${fix}`];
			labPower.text = data.teamForce.toString();

			let labPro: eui.Label = this[`m_lbArmsCount${fix}`];
			labPro.text = `${data.surplusSoldiersCount}/${data.maxSoldiersCount}`;
			let imgPro: eui.Image = this[`m_imgPro${fix}`];
			imgPro.width = CatchBanditsReport.PRO_WID * (data.surplusSoldiersCount / data.maxSoldiersCount);

			let group: eui.Group = this[`m_groupGenerals${fix}`];
			this.clearHeadItem(group);
			for (let i = 0; i < data.generalList.length; i++) {
				let info = data.generalList[i];
				let item = GeneralHeadRender.create('arena');
				NodeUtils.setScale(item, 0.8);
				item.setGenViewInfo(info.generalId, info.level, info.star, info.quality, info.generalName)
				// item.enabled = !isWin;
				Utils.isGray(!isWin, item);
				group.addChild(item);
			}
		}
		/**回收头像 */
		private clearHeadItem(group: eui.Group) {
			if (!group) return;
			while (group.numChildren > 0) {
				let item = group.getChildAt(0) as GeneralHeadRender;
				Utils.isGray(false, item);
				item.onDestroy();
			}
		}
	}

}