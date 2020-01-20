// module com_main {
// 	/**
// 	 * 建筑升级条件cell 后续使用com_levelup_conditions_cell代替
// 	 */
//     export class building_conditions_cell extends eui.ItemRenderer {
// 		private m_pBtnGoto:com_main.ComButton;
// 		private m_icon :com_main.CImage;
// 		private m_imageIsCan :com_main.CImage;
// 		private m_pLbDesc :com_main.CLabel;
// 		public constructor() {
// 			super();
// 			this.touchChildren = true;
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.m_pBtnGoto.setTitleLabel(GCode(CLEnum.CITY_BD_LV_GO));
// 			EventManager.addTouchScaleListener(this.m_pBtnGoto, this, this.onClickHundler);
// 		}
// 		private onClickHundler(e){
// 		}
// 		$onRemoveFromStage(): void {
// 			super.$onRemoveFromStage();
// 		}
// 		protected dataChanged(): void {
// 			super.dataChanged();
// 			if( this.data ){
// 				if(this.data.isItem){
// 					this.SetIcon(RoleData.GetMaterialIconPathById(this.data.itemId))
// 					this.m_pLbDesc.text = CommonUtils.numOutLenght(RoleData.GetMaterialNumById(this.data.itemId))+"/"+this.data.cost;
// 					this.SetIsCanImage(RoleData.GetMaterialNumById(this.data.itemId)>= this.data.cost);
// 				}else{
// 					let addtionData = this.data.addtionData;
// 					if (addtionData){
// 						this.SetIcon(addtionData.iconPath);
// 						this.m_pLbDesc.text = addtionData.desc;
// 						this.SetIsCanImage(addtionData.isCan);
// 					}
// 				}
// 			}
// 		}
// 		private SetIcon(iconPath:string){
// 			if(iconPath == "") return ;
// 			this.m_icon.source = iconPath;
// 		}
// 		private SetIsCanImage(isCan :boolean){
// 			let iconPath = "commom_x_png";
// 			if(isCan)
// 				iconPath = "common_y_png";
// 			this.m_imageIsCan.source = iconPath;
// 			this.m_pBtnGoto.visible = !isCan;
// 		}
// 	}
// }
// interface Building_conditions_Interface {
// 	iconPath :string;
// 	desc :string;
// 	isCan :boolean;
// }
