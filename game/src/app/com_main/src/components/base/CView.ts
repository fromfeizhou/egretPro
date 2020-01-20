module com_main {
	export class CView extends AGame.View {
		protected lan: any;
		public popType: number = UpManager.STYLE_UP;

		public constructor() {
			super();
			this.lan = L.getInstance().getObject();
		}

		$onRemoveFromStage(isclear = true): void {
			this.lan = null;
			super.$onRemoveFromStage(isclear);
		}

		protected childrenCreated() {
			super.childrenCreated();
		
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}

		public resize(): void {
		}

		public onMaskClick(): void {

		}

		public onRefresh(body?): void {
			//Guide.uiCall(this.name);
		}

		/**检查新手引导面板条件 */
		public onGuideCondition(){
			// EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION,IGUIDECD.SCENE);
		}
	}
}