module com_main {
	/**
	 * 城池建设情报
	 */
	export class BuildInfoView extends CView {
		public static NAME = "BuildInfoView";

		public m_apopUp: com_main.APopUp;
		public m_listGeneral: eui.List;

		// 数据
		private m_pListGeneralDP: eui.ArrayCollection;

		public constructor(cityId: number) {
			super();
			this.name = BuildInfoView.NAME;
			this.initApp("world/building/BuildInfoViewSkin.exml");
		}

		protected listenerProtoNotifications(): any[] {
			return [

			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {

				default:
					break;
			}
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_apopUp.setTitleLabel(GCode(CLEnum.BUILD_INFO));

			this.m_pListGeneralDP = new eui.ArrayCollection([]);
			this.m_listGeneral.itemRenderer = BuildInfoCell;
			this.m_listGeneral.dataProvider = this.m_pListGeneralDP;

			this.addEvent();
			this.refreshListGeneral();
		}

		private addEvent() {
			com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.onWorldBuildUpdate, this);
			EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this.onBuildHeroDel, this);
		}

		private removeEvent() {
			com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_UPDATE, this);
			EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this);
		}

		/**更新城池建设状态 */
		public onWorldBuildUpdate(cityId: number) {
			// if (isNull(this.m_pListGeneralDP)) return;
			// for (let i = 0, len = this.m_pListGeneralDP.length; i<len; i++) {
			// 	if (isNull(this.m_pListGeneralDP.getItemAt(i))) continue;
			// 	let vo = this.m_pListGeneralDP.getItemAt(i) as CityBuildVo;
			// 	if (vo.cityId == cityId) {}
			// }
			this.refreshListGeneral();
		}

		private onBuildHeroDel(cityId: number) {
			if (CityBuildModel.unOwnerCity(cityId)) {
				UpManager.history();
				return;
			}
			this.refreshListGeneral();
		}

		public refreshListGeneral() {
			let allBuildGeneral: GeneralVo[] = []; // 所有武将在建设和建设完成的列表
			let list = CityBuildModel.getRecruitedGeneral();
			list.forEach((v, i, a) => {
				let cityId = CityBuildModel.getBuildGenCityId(v.generalId);
				if (cityId > 0) {
					let info = CityBuildModel.getCityInfo(cityId);
					v.cityBuildState = info.cityBuildState;
					if (v.cityBuildState != CityBuildEnum.FREE) allBuildGeneral.push(v);
				}
			});
			SortTools.MoreKeysSorter(allBuildGeneral, ["cityBuildState", "level", "quality"], [ArraySort.UPPER, ArraySort.LOWER, ArraySort.LOWER]);
			this.m_pListGeneralDP.replaceAll(allBuildGeneral);
		}
	}
}