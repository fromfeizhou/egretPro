// module com_main {
// 	export class MissionViewItemCell extends CComponent {
// 		private m_pItemId;
// 		private m_pId;
// 		private m_pIndex;
// 		private m_pLbLevel:eui.Label;
// 		private m_pImgSelectbg:eui.Image;
// 		private m_bstate =false;
// 		public constructor() {
// 			super();
// 			this.skinName = Utils.getSkinName("app/mission/MissionViewItemCell.exml");
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 		}
// 		public init(cfg,index:number) {
// 			this.touchChildren = false;
// 			this.m_pIndex = index;
// 			let rewardCfg  = JSON.parse(cfg.reward);
// 			this.m_pId = cfg.id;
// 			this.m_pItemId = rewardCfg[0][1];
// 			this.updateNum(rewardCfg[0][2]);
// 			this.m_pImgSelectbg.visible = false;
// 		}
// 		public initLoin(cfg,index:number) {
// 			this.touchChildren = false;
// 			this.m_pIndex = index;
// 			this.m_pItemId = cfg[1];
// 			this.updateNum(cfg[2]);
// 			this.m_pImgSelectbg.visible = false;
// 		}
// 		public updateBshowbg(bshow) {
// 			this.m_pImgSelectbg.visible = bshow;
// 			this.m_bstate = bshow;
// 		}
// 		public updateNum(num) {
// 			 this.m_pLbLevel.text ="x"+ num;
// 		}
// 		public getId(): number {
// 			return this.m_pId;
// 		}
// 		public getItemId(): number {
// 			return this.m_pItemId;
// 		}
// 		public getIndex(): number {
// 			return this.m_pIndex;
// 		}
// 		public getState(): boolean {
// 			return this.m_bstate;
// 		}
// 	}
// }
