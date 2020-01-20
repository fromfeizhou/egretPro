module com_main {
	export class CountryMainWnd extends CView {

		public static NAME = 'CountryMainWnd';

		public m_pViewRoot: eui.Group;
		public m_ViewStack: eui.ViewStack;
		public m_TagGroup: com_main.ComTabGroup;
		public m_MainTopNew: com_main.MainTopNew;

		private m_curTagIndex: number;
		public constructor(param: any) {
			super();
			this.name = CountryMainWnd.NAME;
			this.initApp("Country/CountryMainWndSkin.exml");
			this.m_curTagIndex = param == null ? 0 : param.defTag;
		}

		public onDestroy(): void {
			super.onDestroy();
			SceneResGroupCfg.clearModelRes([ModuleEnums.COUNTRY_UI]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_MainTopNew.setTitleName(GCode(CLEnum.STATE))
			this.m_MainTopNew.setResources([PropEnum.MILITARY_MERITS_CONSUMED]);
			this.InitTagGroup();
			this.changeTag(this.m_curTagIndex);

			Utils.toStageBestScale(this.m_pViewRoot);
		}

		private InitTagGroup(): void {
			this.m_TagGroup.initNorTabBtns([
				GCode(CLEnum.STATE_TAB_INFO),
				GCode(CLEnum.STATE_TAB_GZ),
				GCode(CLEnum.STATE_TAB_GL),
				GCode(CLEnum.STATE_TAB_DS),
				GCode(CLEnum.STATE_TAB_GZQB)
			]);
			this.m_TagGroup.setChangeCallback(this.changeTag, this);

			let tabView1 = new CountryInfoView();
			this.m_ViewStack.addChild(tabView1);

			let tabView2 = new CountryJobView();
			this.m_ViewStack.addChild(tabView2);

			let tabView3 = new CountryManageView();
			this.m_ViewStack.addChild(tabView3);

			let tabView4 = new CountryTaskView();
			this.m_ViewStack.addChild(tabView4);

			let tabView5 = new CityChangeInfoView();
			this.m_ViewStack.addChild(tabView5);
			//官职管理界面红点
			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GZ)), { x: 132, y: -5 }, [RedEvtType.JOB_COUNTRY], 1);
			//城市变更信息红点
			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GZQB)), { x: 132, y: -5 }, [RedEvtType.CITY_CHANGE_COUNTRY], 1);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_DS)), { x: 132, y: -5 }, [RedEvtType.TASK_COUNTRY], 1);
			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GL)), { x: 132, y: -5 }, [RedEvtType.TAX_COUNTRY], 1);
		}

		private changeTag(index: number) {
			this.m_TagGroup.selectedIndex = index;
			this.m_ViewStack.selectedIndex = index;

			//国家情报
			if(index == 4){
				CountryModel.setCityChangeRed(false);
			}
		}

	}
}