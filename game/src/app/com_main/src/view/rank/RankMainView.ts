module com_main {
	/**
	 * 排行榜主界面
	 */
	export class RankMainView extends CView {

		public static NAME = "RankMainView";

		public m_TagGroup: com_main.ComTabGroup;
		public m_MainTopNew: com_main.MainTopNew;
		public m_ViewStack: eui.ViewStack;

		private m_tViews: RankListPage[];
		private m_nCurIndex: number;
		private m_nTypes: RankType[];

		public constructor(param: any) {
			super();
			this.name = RankMainView.NAME;

			this.initApp("rank/rank_main_view.exml");
			this.m_nCurIndex = param == null ? 0 : param.defTag;
		}

		public onDestroy(): void {
			RankModel.clear();
			super.onDestroy();

			SceneResGroupCfg.clearModelRes([ModuleEnums.RANK]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_MainTopNew.setTitleName(GCode(CLEnum.RANK));
			this.m_nTypes = [RankType.PLAYER, RankType.GENREAL, RankType.LEGION, RankType.COUNTRY,RankType.ONEHERO];
			this.InitTagGroup();
			this.InitListView();

			this.changeView(0);

			WorshipProxy.send_C2S_WORSHIP_INFO(WorshipType.FIGHT_RANK);
		}

		public changeView(index: number) {
			this.m_nCurIndex = index;
			this.m_TagGroup.selectedIndex = this.m_nCurIndex;
			this.m_ViewStack.selectedIndex = index;
			RankProxy.C2S_RANK_COMM(this.m_nTypes[this.m_nCurIndex]);
		}

		private InitTagGroup(): void {
			this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_ZL) });
			this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_WJ) });
			this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LM) });
			this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_CITY) });
			this.m_TagGroup.addTabBtnData({ name: '神将排行' });
			this.m_TagGroup.setChangeCallback(this.changeTag, this);
		}



		/**切卡按钮点击 */
		private changeTag(index: number) {
			this.changeView(index);
		}

		private InitListView(): void {
			this.validateNow();

			this.m_tViews = [];
			for (let i = 0; i < this.m_nTypes.length; i++) {
				let view = new RankListPage(this.m_nTypes[i]);
				this.m_ViewStack.addChild(view);
				this.m_tViews.push(view);
			}
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_RANK_COMM,
				ProtoDef.S2C_WORSHIP_INFO,
				ProtoDef.S2C_WORSHIP,
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_RANK_COMM: {
					this.m_tViews[this.m_nCurIndex].Refresh();
					break;
				}
				case ProtoDef.S2C_WORSHIP_INFO: 
				case ProtoDef.S2C_WORSHIP: {
					this.m_tViews[this.m_nCurIndex].Refresh();
					break;
				}
			}
		}
	}
}