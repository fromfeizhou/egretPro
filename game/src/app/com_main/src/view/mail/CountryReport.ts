module com_main {
	/**
	 * 邮件国家战报主面板
	 */

	export class CountryReport extends CComponent implements IMailTabView {
		public static NAME = 'CountryReport';

		public m_imgRes0: eui.Image;
		public m_imgRes1: eui.Image;
		public m_comState0: com_main.ComState;
		public m_comState1: com_main.ComState;
		public m_labMaxNum0: eui.Label;
		public m_labMaxNum1: eui.Label;
		public m_labLose0: eui.Label;
		public m_labLose1: eui.Label;
		public m_labLeft0: eui.Label;
		public m_labLeft1: eui.Label;
		public m_listTeam: eui.List;
		public m_listPersonal: eui.List;

		public m_nType: MailType;
		private m_tTeamCollect: eui.ArrayCollection;
		private m_tPerCollect: eui.ArrayCollection;

		public constructor(type: MailType) {
			super();
			this.name = CountryReport.NAME;
			this.m_nType = type;
			this.skinName = Utils.getAppSkin('mail/CountryReportSkin.exml');
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
			this.m_tTeamCollect = new eui.ArrayCollection();
			this.m_listTeam.itemRenderer = MailCnWarItem;
			this.m_listTeam.dataProvider = this.m_tTeamCollect;

			this.m_tPerCollect = new eui.ArrayCollection();
			this.m_listPersonal.itemRenderer = MailCnWarItem;
			this.m_listPersonal.dataProvider = this.m_tPerCollect;
		}

		public refresh(info: gameProto.S2C_MAILBOX_INFO): void {
			let data = JSON.parse(info.text) as ICountryMailInfo;

			this.m_imgRes0.source = data.victory == 1 ? "lb_ty1_s_png" : "lb_ty4_b_png";
			this.m_imgRes1.source = data.victory == 1 ? "lb_ty4_b_png" : "lb_ty1_s_png";

			this.m_comState0.stateId = data.atkTeamData.countryId;
			this.m_comState1.stateId = data.defTeamData.countryId;

			this.m_labMaxNum0.text = data.atkTeamData.teamCount.toString();
			this.m_labMaxNum1.text = data.defTeamData.teamCount.toString();

			this.m_labLose0.text = data.atkTeamData.fallBattleTeamCount.toString();
			this.m_labLose1.text = data.defTeamData.fallBattleTeamCount.toString();

			this.m_labLeft0.text = data.atkTeamData.surplusTeamCount.toString();
			this.m_labLeft1.text = data.defTeamData.surplusTeamCount.toString();

			let res: ICountryUnion[] = [];
			for (let i = 0; i < data.labourUnionList.length; i++) {
				res.push(data.labourUnionList[i]);
			}
			res.sort((a, b) => {
				return b.value - a.value;
			})
			this.m_tTeamCollect.removeAll();
			this.m_tTeamCollect.replaceAll(res);

			let perRes: ICountryPlayer[] = [];
			for (let i = 0; i < data.playerList.length; i++) {
				perRes.push(data.playerList[i]);
			}
			perRes.sort((a, b) => {
				return b.value - a.value;
			})
			this.m_tPerCollect.removeAll();
			this.m_tPerCollect.replaceAll(perRes);

		}
	}

	/**
	 * 国战排行
	 */
	class MailCnWarItem extends eui.ItemRenderer {
		public m_comState: com_main.ComState;
		public m_lbName: eui.Label;
		public m_lbNum: eui.Label;
		public m_lbRank: eui.Label;

		private m_tData: ICountryUnion | ICountryPlayer;

		public constructor() {
			super();
			this.touchChildren = false;
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			egret.Tween.removeTweens(this);
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			if (!this.m_tData) return;
			this.m_comState.stateId = this.m_tData.countryId;

			this.m_lbRank.text = `${this.itemIndex + 1}`;
			this.m_lbName.text = this.m_tData.name;
			this.m_lbNum.text = `${CommonUtils.numOutLenght(this.m_tData.value)}`
		}

	}

}