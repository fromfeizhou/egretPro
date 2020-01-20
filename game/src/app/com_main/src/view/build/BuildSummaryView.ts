// module com_main {
// 	export class BuildSummaryView extends CView {

// 		////// 组件成员 //////
// 		public m_pTabs: com_main.TabBarContainer;
// 		private m_pGroupStars: eui.Group;

// 		private m_pViewInfo: any = null;
// 		private m_pInfo: any = null;

// 		public static buildInfoView1: any = null;
// 		public static buildInfoView2: any = null;

// 		public constructor(info: any) {
// 			super();
// 			this.initApp("map/build/map_build_summary_view.exml");
// 			this.m_pViewInfo = info;
// 			this.m_pInfo = WorldMapModel.getCityBuildInfo(this.m_pViewInfo.id);
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();
// 			if (BuildSummaryView.buildInfoView1 != null) {
// 				BuildSummaryView.buildInfoView1.onDestroy();
// 				BuildSummaryView.buildInfoView1 = null;
// 			}

// 			if (BuildSummaryView.buildInfoView2 != null) {
// 				BuildSummaryView.buildInfoView2.onDestroy();
// 				BuildSummaryView.buildInfoView2 = null;
// 			}

// 			this.m_pViewInfo = null;
// 			this.m_pInfo = null;

// 			WorldMap.hideGlow();
// 		}

// 		/////////////////////////////////////////////////////////////////协议号事件
// 		/**注册协议号事件 */
// 		protected listenerProtoNotifications(): any[] {
// 			return [];
// 		}

// 		/**处理协议号事件 */
// 		protected executes(notification: AGame.INotification) {
// 			let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			// console.log("View:execute -------->protocol, body:", protocol, body)
// 			switch (protocol) {
// 			}
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();

// 			this.initStar();

// 			this.m_pTabs.changeBuildButton();

// 			BuildSummaryView.buildInfoView2 = new BuildInfoView(this.m_pViewInfo);
// 			this.m_pTabs.addViewStackElement("build_selected_1_png",
// 				"", BuildSummaryView.buildInfoView2, "城池信息");

// 			BuildSummaryView.buildInfoView1 = new BuildFiefMainView(this.m_pViewInfo.id);
// 			this.m_pTabs.addViewStackElement("build_selected_1_png",
// 				"", BuildSummaryView.buildInfoView1, "封地信息");

// 			this.m_pTabs.setSelectedIndex(1);
// 			this.m_pTabs.setSelectedIndex(0);
// 			this.m_pTabs.setChangeCallback(this.onIndexChange, this);
// 		}

// 		private onIndexChange(index: number): boolean {
// 			if (index == 1) {
// 				// 功能未开启
// 				if (!FunctionModel.isFunctionOpen(FunctionType.FT_FIEF_CONSTRUCTION)) {
// 					let tips = Utils.getFunctionNotOpenTips();
// 					EffectUtils.showTips(tips, 1, true);
// 					return false;
// 				}

// 				// 不是自己的国家
// 				if (this.m_pInfo.country != RoleData.countryId) {
// 					let tips = GLan(500080);	// 攻占城池可占领封地生产
// 					EffectUtils.showTips(tips, 1, true);
// 					return false;
// 				}

// 				FiefModel.eventRegister(EventEnum.FIEF_BUILD_OPENVIEW);
// 				//this.registerProxys();
// 				let id = this.m_pViewInfo.id;
// 				FiefProxy.send_CITY_BATTLE_GET_FIEFS(id);
// 			} else {
// 				if (BuildSummaryView.buildInfoView1) {
// 					BuildSummaryView.buildInfoView1.onDestroy();
// 				}
// 			}
// 			return true;
// 		}

// 		/**点亮星星 */
// 		private initStar() {
// 			if (this.m_pInfo && this.m_pInfo.star) {
// 				let starNums = this.m_pInfo.star;
// 				let numChild = this.m_pGroupStars.numChildren;
// 				for (let i = 0; i < starNums && i < numChild; i++) {
// 					let starImg = this.m_pGroupStars.getChildAt(i);
// 					starImg.visible = true;
// 				}
// 			}
// 		}

// 		public setIndex(index: number) {
// 			this.m_pTabs.setSelectedIndex(index);
// 		}

// 	}
// }