module com_main {
	export class MainTopNew extends CComponent {
		public static NAME: string = "MainTopNew";
		private m_SilverGroup: eui.Group;
		private m_GoldGroup: eui.Group;
		private m_BtnBack: eui.Image;
		private m_TileName: eui.Label;

		public m_groupSource: eui.Group; //资源组
		private m_autoRefresh: boolean;	//资源自动刷新

		private onClickBackHandler: () => void;
		private onClickBackHandlerObj: any;

		public constructor() {
			super();
			this.name = MainTopNew.NAME;
			this.skinName = Utils.getSkinName("app/top_new/new_top_main.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_BtnBack["sound_cancel"] = SoundData.getCancelSound();
			EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onClickBack);
			EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
			EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onRoleResource, this);
			Utils.toStageBestScale(this.m_groupSource);
			this.m_autoRefresh = true;
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			super.onDestroy();
		}

		public setExitCallBack(callback: any, obj: any) {
			this.onClickBackHandler = callback;
			this.onClickBackHandlerObj = obj;
		}

		private onClickBack() {
			if (this.onClickBackHandler) {
				this.onClickBackHandler.call(this.onClickBackHandlerObj);
				return;
			}
			com_main.UpManager.history();
		}

		/**设置标题 */
		public setTitleName(name: string) {
			this.m_TileName.text = name;
		}

		/**设置资源栏 */
		public setResources(sources: Array<PropEnum>) {
			if (PlatConst.isRmbPay()) {
				let index = sources.indexOf(PropEnum.YU);
				if (index >= 0) sources.splice(index, 1)
			}
			Utils.removeAllChild(this.m_groupSource);
			for (let i = 0; i < sources.length; i++) {
				let id = sources[i];
				let item = new TopSourceItem(id);
				this.m_groupSource.addChild(item);
			}
		}

		/**资源刷新标记 */
		public set autoRefresh(val) {
			this.m_autoRefresh = val;
		}
		public get autoRefresh(): boolean {
			return this.m_autoRefresh;
		}

		/**获得资源组件 */
		private getSourceItem(id: PropEnum) {
			for (let i = 0; i < this.m_groupSource.numChildren; i++) {
				let item = this.m_groupSource.getChildAt(i) as TopSourceItem;
				if (item && item.itemId == id) {
					return item;
				}
			}
			return null;
		}

		/**资源刷新 */
		private onRoleResource(sourceId: PropEnum) {
			if (!this.m_autoRefresh) return;

			let item = this.getSourceItem(sourceId);
			if (item) {
				item.refreshNum();
			}
		}

		public static getMainTopNew(panel: any) {
			if (panel) {
				return <MainTopNew>(panel.getChildByName(MainTopNew.NAME));
			}
			return null;
		}

		public getBackBtn() {
			return this.m_BtnBack;
		}

	}
}