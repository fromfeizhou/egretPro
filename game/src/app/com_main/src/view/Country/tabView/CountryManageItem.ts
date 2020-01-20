module com_main {
	export interface ICountryManageItemRD {
		cityName: string;
		cityType: number;
		playerName: string;
		legion: string;
		isSelf: boolean;
		cityId: number
	}
	export class CountryManageItem extends eui.ItemRenderer {
		public static NAME = 'CountryManageItem';
		public m_pCityName: com_main.CLabel;
		public m_pCityType: com_main.CLabel;
		public m_pName: com_main.CLabel;
		public m_pLegion: com_main.CLabel;
		public m_pBtn: com_main.ComButton;


		private m_tData: ICountryManageItemRD
		public constructor() {
			super();
			this.name = ArenaView.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryManageItemSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_pBtn, this, this.OnClickBtn);
		}

		$onRemoveFromStage(): void {
			EventManager.removeEventListeners(this);
			super.$onRemoveFromStage();
		}

		protected dataChanged() {
			let selfJobId = CountryModel.Self_PlayerInfo.jobId;
			this.m_tData = this.data as ICountryManageItemRD;
			if (this.data.isSelf) {
				this._btnModel = 1;
				this.m_pBtn.setImage("btn_006_up_png")
			} else if (selfJobId == 1) {
				//君王有任命权
				this._btnModel = 2;
				this.m_pBtn.setImage("btn_001_up_png")
			} else {
				this._btnModel = 0;
			}
			this.m_pCityName.text = this.m_tData.cityName == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.cityName;
			this.m_pCityType.text = `${WorldModel.getCityTypeName(this.m_tData.cityType)}`
			this.m_pLegion.text = this.m_tData.legion == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.legion;
			this.m_pName.text = this.m_tData.playerName == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.playerName;
			this.m_pBtn.visible = this._btnModel != 0;
			this.m_pBtn.setTitleLabel(this._btnName[this._btnModel]);
		}
		private readonly _btnName: string[] = [GCode(CLEnum.STATE_GZ_EMPTY), GCode(CLEnum.STATE_GZ_XR), GCode(CLEnum.STATE_GZ_RM)];
		private _btnModel: number = 0;


		private OnClickBtn(): void {
			CountryModel.LeaveCity = this._btnModel == 1;
			if (CountryModel.LeaveCity == true) {
				let tip: string = GCodeFromat(CLEnum.STATE_CITY_XR_TIPS, this.m_tData.cityName);
				Utils.showConfirmPop(tip, () => CountryProxy.send_COUNTRY_APPLY_CITY(this.m_tData.cityId, 0), this);
			}
			else {
				CountryModel.ApplyListViewParam = {};
				CountryModel.ApplyListViewParam.cityId = this.m_tData.cityId;
				CountryModel.ApplyListViewParam.curState = "Manage";
				CountryModel.ApplyListViewParam.btnName = this._btnName[this._btnModel];
				CountryModel.ApplyListViewParam.titleName = GCode(CLEnum.STATE_TAB_GL);
				CountryProxy.send_COUNTRY_APPLY_LIST(1);
			}
		}
	}
}