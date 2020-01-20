module com_main {
	/**
	 * 英雄头像
	 */
	export class GeneralCell extends eui.ItemRenderer {
		private m_pHero: com_main.GeneralHeadRender;
		private m_labLevel: com_main.CLabel;
		private m_labName: com_main.CLabel;
		private m_labSkill: com_main.CLabel;
		private m_labExp: com_main.CLabel;
		private m_imgExpPro: eui.Image;
		private m_labExpPro: eui.Label;
		private m_pImgLight: com_main.CImage;
		private m_gDone: eui.Group;
		private m_gBuilding: eui.Group;
		private m_labBB: com_main.CLabel;
		private m_labBT: com_main.CLabel;


		private m_tData: GeneralVo;
		private m_tCityInfo: CityBuildVo; // gameProto.IPlayerMadeInfo;
		private curEndTime: number = 0;
		private curSpeedUpTime: number = 0;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/world/building/buildingCell/GeneralCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy() {
			this.m_tData = null;
			this.m_tCityInfo = null;
			this.curEndTime = 0;
			this.curSpeedUpTime = 0;
			Utils.TimerManager.remove(this.timeCallback, this);
		}

		protected dataChanged(): void {
			super.dataChanged();

			this.m_tData = this.data;
			if (!this.m_tData) return;

			this.m_gBuilding.visible = false;
			this.m_gDone.visible = false;
			this.refresh();
		}

		private refresh(): void {
			let info = this.m_tData;
			// 武将id
			let headId = info.generalId;
			this.m_pHero.setGenId(headId);
			this.m_labName.text = GeneralModel.getGeneralName(headId);
			this.m_labName.textColor = Utils.getColorOfQuality(info.qualityLevel);
			this.m_labSkill.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BUILD_SKILL, "无"));
			this.m_labExp.text = GCode(CLEnum.CITY_BUILD_SEXP);
			this.m_labLevel.text = info.level + GCode(CLEnum.LEVEL);

			this.refreshExpView();
			this.refreshGeneralBuildState();
		}

		/**刷新经验 */
		public refreshExpView() {
			let info = this.m_tData;
			this.m_labExpPro.text = Math.floor(info.curExp / info.GetMaxExp() * 100) + "%";
			let pro = (info.curExp / info.GetMaxExp()) > 1 ? 1 : (info.curExp / info.GetMaxExp());
			this.m_imgExpPro.width = pro * 152;
		}

		/**刷新建造状态 */
		public refreshGeneralBuildState() {
			let info = this.m_tData;
			let pInfo = CityBuildModel.getCityInfoByGeneralId(info.generalId);
			if (isNull(pInfo)) return;

			this.m_tCityInfo = pInfo;
			if (info.cityBuildState == CityBuildEnum.DONE) {
				this.m_gBuilding.visible = false;
				this.m_gDone.visible = true;
				Utils.TimerManager.remove(this.timeCallback, this);
			} else if (info.cityBuildState == CityBuildEnum.BUILDING) {
				this.m_gBuilding.visible = true;
				this.m_gDone.visible = false;
				this.initTime();
			} else {
				this.m_gBuilding.visible = false;
				this.m_gDone.visible = false;
			}
		}

		private initTime() {
			this.timeCallback();
			Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
		}

		//时间回调
		private timeCallback() {
			this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
			this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;

			let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
			let lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
			let cityConfig = WorldModel.getCityConfig(this.m_tCityInfo.cityId);
			this.m_labBB.text = WorldModel.getCityName(cityConfig.id) + GCode(CLEnum.CITY_BUILD_ING);
			this.m_labBT.text = lvUpTimeTxt;
			if (this.curEndTime > 0 && lefttime <= 0) {
				Utils.TimerManager.remove(this.timeCallback, this);
				// CityBuildProxy.C2S_CITY_MADE_INFO(this.m_tCityInfo.cityId);
				this.refresh();
			}
		}
	}

	/**
	 * 奖励
	 */
	export class RewardCell extends CComponent {
		public m_imgIcon: eui.Image;
		public m_labDes: com_main.CLabel;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/world/building/buildingCell/RewardCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public setIconView(source: string, des: string) {
			this.m_imgIcon.source = source;
			this.m_labDes.textFlow = Utils.htmlParser(des);
		}
	}

	/**
	 * 奖励类型
	 */
	export class RewardTypeCell extends CComponent {
		public m_labDes: com_main.CLabel;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/world/building/buildingCell/RewardTypeCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public setView(des: string) {
			this.m_labDes.textFlow = Utils.htmlParser(des);
		}
	}

	/**城池buff图标 */
	export class CityBuffCell extends CComponent {
		public m_labName: eui.Label;
		public m_imgSkillIcon: eui.Image;
		public m_groupLv: eui.Group;
		public m_labLevel: com_main.CLabel;

		public constructor(param?) {
			super();
			this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.currentState = "basebuff";
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		/**设置icon */
		public setIcon(icon: string | egret.Texture, isGray: boolean = true) {
			this.m_imgSkillIcon.source = icon;
			Utils.isGray(isGray, this.m_imgSkillIcon);
		}

		/**设置名字 */
		public setName(name: string = "") {
			this.m_labName.text = name;
		}
	}

	/**建设情报 */
	export class BuildInfoCell extends eui.ItemRenderer {
		public m_pPanel: com_main.CImage;
		public m_pHero: com_main.GeneralHeadRender;
		public m_labName: com_main.CLabel;
		public m_labBB: com_main.CLabel;
		public m_labBC: com_main.CLabel;
		public m_labBT: com_main.CLabel;
		public m_btnLocation: eui.Group;
		public m_cbtnDone: com_main.ComButton;
		public m_cbtnBuilding: com_main.ComButton;

		private m_tData: GeneralVo;
		private m_tCityInfo: CityBuildVo;
		private curEndTime: number = 0;
		private curSpeedUpTime: number = 0;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/world/building/buildingCell/BuildInfoCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.addEvent();
			this.m_cbtnDone.setTitleLabel(GCode(CLEnum.FINISH));
			this.m_cbtnBuilding.setTitleLabel(GCode(CLEnum.SPEED_AD));
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy() {
			this.m_tData = null;
			this.m_tCityInfo = null;
			this.curEndTime = 0;
			this.curSpeedUpTime = 0;
			this.removeEvent();
			Utils.TimerManager.remove(this.timeCallback, this);
		}

		protected dataChanged(): void {
			super.dataChanged();

			this.m_tData = this.data;
			if (!this.m_tData) return;

			this.refresh();
		}

		private addEvent() {
			EventManager.addTouchScaleListener(this.m_btnLocation, this, this.onclickLocation);
			EventManager.addTouchScaleListener(this.m_cbtnBuilding, this, this.onclickBuilding);
			EventManager.addTouchScaleListener(this.m_cbtnDone, this, this.onclickDone);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);
		}

		private onclickLocation() {
			if (isNull(this.m_tCityInfo)) return;
			if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
				UpManager.history();
				return;
			}
			let vo = this.m_tCityInfo;
			WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, vo.cityId);
			UpManager.history();
		}

		private onclickBuilding() {
			if (isNull(this.m_tCityInfo)) return;
			if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
				UpManager.history();
				return;
			}
			Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
				propSpeedType: PropSpeedType.CityBuild,
				targetId: this.m_tCityInfo.cityId,
				startTime: this.m_tCityInfo.startDate,
				endTime: this.m_tCityInfo.endDate,
				speedUpTime: this.m_tCityInfo.speedTime,
			});
		}

		private onclickDone() {
			if (isNull(this.m_tCityInfo)) return;
			if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
				UpManager.history();
				return;
			}
			let vo = this.m_tCityInfo;
			CityBuildModel.curCityId = vo.cityId;
			CityBuildProxy.C2S_CITY_MADE_REWARD(vo.cityId, vo.generalId);
		}

		private initTime() {
			this.timeCallback();
			Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
		}

		//时间回调
		private timeCallback() {
			this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
			this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;

			let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
			let lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
			this.m_labBT.text = lvUpTimeTxt;
			if (this.curEndTime > 0 && lefttime <= 0) {
				Utils.TimerManager.remove(this.timeCallback, this);
				if (this.m_tCityInfo) this.m_tCityInfo.updateTime();
			}
		}

		private refresh(): void {
			let info = this.m_tData;
			// 武将id
			let headId = info.generalId;
			this.m_pHero.setGenId(headId);
			this.m_labName.text = GeneralModel.getGeneralName(headId);
			this.m_labName.textColor = Utils.getColorOfQuality(info.qualityLevel);

			this.refreshGeneralBuildState();
			this.refreshCityInfo();
		}

		/**刷新建造状态 */
		public refreshGeneralBuildState() {
			let info = this.m_tData;
			let pInfo = CityBuildModel.getCityInfoByGeneralId(info.generalId);
			if (isNull(pInfo)) return;

			this.m_tCityInfo = pInfo;
			if (info.cityBuildState == CityBuildEnum.DONE) {
				this.currentState = "done";
				this.m_labBC.text = GCode(CLEnum.CITY_BUILD_DONE2);// "建造已完成";
				Utils.TimerManager.remove(this.timeCallback, this);
			} else if (info.cityBuildState == CityBuildEnum.BUILDING) {
				this.currentState = "building";
				this.m_labBC.text = GCode(CLEnum.CITY_BUILD_ING2);//"后完成建造";
				this.initTime();
			}
		}

		/**刷新城市信息 */
		private refreshCityInfo() {
			if (isNull(this.m_tCityInfo)) return;
			let cityConfig = WorldModel.getCityConfig(this.m_tCityInfo.cityId);
			this.m_labBB.text = WorldModel.getCityName(cityConfig.id);
		}
	}
}