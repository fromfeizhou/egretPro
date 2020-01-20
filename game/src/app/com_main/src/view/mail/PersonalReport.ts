module com_main {
	/**
	 * 邮件个人战报主面板
	 */

	export class PersonalReport extends CComponent implements IMailTabView {
		public static NAME = 'PersonalReport';

		public m_lbArmNum: eui.Label;
		public m_lbDeathNum: eui.Label;
		public m_lbKillArmsNum: eui.Label;
		public m_lbKillNum: eui.Label;
		public m_itemAward: com_main.ComItemNew;
		public m_listWarResult: eui.List;

		public m_nType: MailType;
		private m_tCollection: eui.ArrayCollection;

		public constructor(type: MailType) {
			super();
			this.name = PersonalReport.NAME;
			this.m_nType = type;
			this.skinName = Utils.getAppSkin('mail/PersonalReportSkin.exml');
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_tCollection = new eui.ArrayCollection();
			this.m_listWarResult.itemRenderer = PersonWarItem;
			this.m_listWarResult.dataProvider = this.m_tCollection;
		}

		public refresh(info: gameProto.S2C_MAILBOX_INFO): void {
			let data: IPerMailInfo = JSON.parse(info.text);
			this.m_lbArmNum.text = data.teamCount + "";
			this.m_lbDeathNum.text = data.lossSoldiersCount + "";
			this.m_lbKillArmsNum.text = data.killTeamCount + "";
			this.m_lbKillNum.text = data.killSoldiersCount + "";
			// this.m_imgResult.source = data.victory == 1 ? "zb_sl_jpg" : "zb_zb_jpg";
			//军功奖励
			this.m_itemAward.setItemInfo(PropEnum.MILITARY_EXPLOIT, data.militaryMerits);

			let res: IWARMailData[] = [];
			for (let i = 0; i < data.warReportDataList.length; i++) {
				let tmp = data.warReportDataList[i];
				res.push(tmp);
			}
			this.m_tCollection.removeAll();
			this.m_tCollection.replaceAll(res);
		}

	}

	/**
	 * 对抗战报
	 */
	class PersonWarItem extends eui.ItemRenderer {
		private static PRO_WID: number = 223;

		public m_lbIndex: eui.Label;
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


		private m_tData: IWARMailData;

		public constructor() {
			super();
			this.touchChildren = false;
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			// this.clearHeadItem(this.m_groupGenerals0);
			// this.clearHeadItem(this.m_groupGenerals1);
			egret.Tween.removeTweens(this);
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			if (this.m_tData) {
				this.m_lbIndex.text = GCodeFromat(CLEnum.MAIL_TITLE_FIGHT, this.itemIndex + 1);
				let lData: ITeamMailData;
				let rData: ITeamMailData;
				let bWin: boolean = false;
				if (this.m_tData.warReportTeamDataAtk.countryId == RoleData.countryId) {
					lData = this.m_tData.warReportTeamDataAtk;
					rData = this.m_tData.warReportTeamDataDef;
					bWin = this.m_tData.isAtkVictory == 1;
				} else {
					lData = this.m_tData.warReportTeamDataDef;
					rData = this.m_tData.warReportTeamDataAtk;
					bWin = this.m_tData.isAtkVictory == 0;
				}

				this.setItemView(lData, 0, bWin);
				this.setItemView(rData, 1, !bWin);
				this.m_imgResult.source = bWin ? 'lb_ty1_s_png' : 'lb_ty4_b_png';
			}
		}

		/**设置单个item显示 */
		private setItemView(data: ITeamMailData, fix: number, isWin: boolean) {
			let comState: ComState = this[`m_comState${fix}`];
			comState.stateId = data.countryId;

			let labName: eui.Label = this[`m_playerName${fix}`];
			labName.text = data.playerName;

			let labTeamName: eui.Label = this[`m_armsName${fix}`];
			labTeamName.text = data.isNpc == 1 ? GCode(CLEnum.WOR_CFJ) : GCode(CLEnum.CAMP_ARMY) + Global.getNumber(data.teamId);

			let labPower: eui.Label = this[`m_power${fix}`];
			labPower.text = data.teamForce.toString();

			let labPro: eui.Label = this[`m_lbArmsCount${fix}`];
			labPro.text = `${data.surplusSoldiersCount}/${data.maxSoldiersCount}`;
			let imgPro: eui.Image = this[`m_imgPro${fix}`];
			imgPro.width = PersonWarItem.PRO_WID * (data.surplusSoldiersCount / data.maxSoldiersCount);

			// let group: eui.Group = this[`m_groupGenerals${fix}`];
			// this.clearHeadItem(group);
			// for (let i = 0; i < data.generalList.length; i++) {
			// 	let info = data.generalList[i];
			// 	let item = GeneralHeadRender.create('arena');
			// 	NodeUtils.setScale(item, 0.8);
			// 	item.setGenViewInfo(info.generalId, info.level, info.star, info.quality, info.generalName)
			// 	// item.enabled = !isWin;
			// 	Utils.isGray(!isWin, item);
			// 	group.addChild(item);
			// }
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