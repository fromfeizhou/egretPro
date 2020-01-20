// module com_main {
// 	export class BagInfoUseDlg extends CComponent {
// 		private m_pItemId;
// 		private m_pIndex;
// 		private m_pLbName: eui.Label;
// 		private m_propdes:eui.Label;
// 		private m_useGroup:eui.Group;
// 		public constructor() {
// 			super();
// 			this.skinName = Utils.getSkinName("app/bag/bag_info_use_Dlg.exml");
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			EventManager.addTouchScaleListener(this.m_useGroup, this, this.onClickUse);
// 		}
// 		public onDestroy(): void {
// 			super.onDestroy();
// 			EventManager.removeEventListeners(this);
// 		}
// 		private onClickUse(){
// 			let nNum = PropModel.getPropNum(this.m_pItemId);
// 			if(nNum==1){
// 				PropProxy.send_BACKPACK_USE_ITEM(this.m_pItemId,1);
// 			}else 
// 			{
// 				Utils.open_view(TASK_UI.POP_BAG_PANEL, this.m_pItemId);
// 			}
// 		}
// 		public init(id: number,index:number) {
// 			this.m_pItemId = id;
// 			this.m_pIndex = index;
// 			let cfg = PropModel.getCfg(id);
// 			Utils.setTextByLanguageKey(cfg.name, this.m_pLbName, "未知科技名字");
// 			this.m_propdes.text = cfg.description;
// 			this.touchChildren = true;
// 			for(let i=1;i<=4;i++){
// 				this["m_arrow"+i].visible = false;
// 			}
// 			let mIdx = ((index) % 4)+1;
// 			this["m_arrow"+mIdx].visible = true;
// 		}
// 		public hideContent() {
// 			this.m_pLbName.visible = false;
// 		}
// 		public getItemId(): number {
// 			return this.m_pItemId;
// 		}
// 		public getIndex(): number {
// 			return this.m_pIndex;
// 		}
// 	}
// }
