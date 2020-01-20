module com_main {
	export class CountryApplyItem extends eui.ItemRenderer {
		public static NAME = 'CountryApplyItem';

		public m_RoleHead:com_main.ComHeadItem;
		public m_playerName:com_main.CLabel;
		public m_pAggressivity:com_main.CLabel;
		public m_pMilitary:com_main.CLabel;
		public m_pLegion:com_main.CLabel;
		public m_pCityNum:com_main.CLabel;
		public m_Btn:com_main.ComButton;



		private _viewParam: any;
		private m_tData: gameProto.CountryPlayerInfo
		public constructor(viewParam: any) {
			super();
			this.name = CountryApplyItem.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryApplyItemSkin.exml");
			this._viewParam = viewParam;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_Btn, this, this.OnClickBtn);
		}

		protected dataChanged() {
			this.currentState = this.data.state;
			this.Refresh()
		}

		public Refresh() {
			this.m_Btn.setTitleLabel(this.data.btnName);
			this.m_tData = this.data.playerInfo as gameProto.CountryPlayerInfo;
			this.m_playerName.text = this.data.playerInfo.name;
			this.m_pAggressivity.text = `${this.m_tData.fight}`;
			this.m_pMilitary.text = `${this.m_tData.warMerits}`;
			let jobCfg = C.JobConfig[this.m_tData.jobId];
			this.m_pLegion.text = jobCfg ? GLan(jobCfg.name) : GCode(CLEnum.NONE);
			this.m_pCityNum.text = this.m_tData.cities ? `${this.m_tData.cities.length}` : "0"
			this.Refresh_RoleHead();
		}

		private Refresh_RoleHead(): void {
			// let headStr = Utils.getPlayerHeadImg(this.m_tData.roleHead);
			this.m_RoleHead.info = { type: 1, url:this.m_tData.roleHead.toString(), official: 0, vip: 0 };
		}


		private OnClickBtn(): void {
			let playerId: number = this.data.playerInfo.playerId;
			if (CountryModel.ApplyListViewParam.curState == "Job") {
				let jobId: number = CountryModel.ApplyListViewParam.jobId;

				let tip: string = "";
				if (jobId == 1) {
					tip = GCodeFromat(CLEnum.STATE_RW_TIPS, this.data.playerInfo.name);
				}
				else {
					let jobName: string = GLan(C.JobConfig[jobId].name);
					tip = GCodeFromat(CLEnum.STATE_RM_TIPS, this.data.playerInfo.name, jobName);
				}
				Utils.showConfirmPop(tip, () => {
					UpManager.history();
					CountryProxy.send_COUNTRY_APPLY_JOB(jobId, playerId);
				}, this);
			}
			else if (CountryModel.ApplyListViewParam.curState == "Manage") {
				let cityId: number = CountryModel.ApplyListViewParam.cityId;
				let playerId: number = this.data.playerInfo.playerId;
				CountryProxy.send_COUNTRY_APPLY_CITY(cityId, playerId);
				UpManager.history();
			}
		}
	}
}