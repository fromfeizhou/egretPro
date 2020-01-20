module com_main {
	/**
	 * 道具
	 */
	export class TurnplateMaterialCell extends CComponent {

		private readonly CLICKMAXCOUNT:number = 3;

		private m_pItem:ComItemNew;
		private m_pCostIcon:CImage;
		private m_pLbCost:eui.BitmapLabel;
		private m_pLbAddtion:CLabel;
		private m_pSelectState:CImage;
		private m_pCostStr:CLabel;
		private m_pCostRoot:eui.Group;

		private m_pClickCount:number = 0;
		private m_pItemId:number;
		private m_pCfg:TurnTableConfig;
		private m_pCurCost:number;

		public onClickHandler:(cell:TurnplateMaterialCell)=>void;
       
		public constructor(id?:number) {
			super();
			if(id)
				this.m_pItemId = id;
			this.skinName = Utils.getAppSkin("turnplate/TurnplateMaterialCellSkin.exml");
		}

		public onDestroy(): void {
            EventManager.removeEventListener(this);			
			super.onDestroy();
		}

        protected childrenCreated() {
			super.childrenCreated();
			this.m_pItem.openTips = false;
			if(this.m_pItemId)
				this.setCellId(this.m_pItemId);
			EventManager.addTouchTapListener(this, this, this.onClick)
        }

		public setCellId(id:number){
			this.m_pItemId = id;
			this.m_pItem.setItemInfo(id);
			this.setSelectState();
			this.m_pCfg = C.TurnTableConfig[id];
			if(this.m_pCfg)
				this.updateCell();
			else
				error("data is not Find");
		}

		private updateCell(){
			this.setAddtionStr();
			this.setCost();
			this.setFreeOrCancelState();
			this.setSelectState();
		}

		private setAddtionStr(){
			if(this.m_pCfg){
				let addtion = "0";
				let costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type,this.m_pClickCount);
				if(costCfg){
					addtion = costCfg.percent;
				}else{
					addtion = "0";
				}
				this.m_pLbAddtion.text = "+" + addtion + "%";				
			}
		}

		private setFreeOrCancelState(){
			let showCost = true;
			let tempStr = "";
			if(this.m_pClickCount == this.CLICKMAXCOUNT){
				showCost = false;
				tempStr = GCode(CLEnum.CANCEL);
			}else{
				showCost = this.m_pCfg.type!=1;
				tempStr = showCost?"":GCode(CLEnum.AC_FREE);
			}
			this.m_pCostRoot.visible = showCost;
			this.m_pCostStr.text = tempStr;
		}

		public setSelectState(){
			this.m_pSelectState.visible = this.m_pClickCount>0;
		}

		private onClick(e: egret.Event){
			
			if(this.onClickHandler){
				this.onClickHandler(this);
			}
		}
		//点击有效
		public onClickSuccess(){
			this.m_pClickCount = ++this.m_pClickCount % (this.CLICKMAXCOUNT+1);
			this.updateCell();

			
		}

		//金币总量
		private setCost(){
			let costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type,this.m_pClickCount+1);
			if(costCfg){
				let pArr = JSON.parse(costCfg.cost);
				this.m_pLbCost.text= pArr[2];
			}	
		}

		public getCurCostNum(){
			let tempNum = 0;
			for(let i=0;i<=this.m_pClickCount;i++){
				let costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type,i);
					if(costCfg){
						let pArr = JSON.parse(costCfg.cost);
						tempNum += Number(pArr[2]);
					}	
			}
			return tempNum;
		}

		public getItemId(){
			return this.m_pItemId;
		}

		public getClickNum(){
			return this.m_pClickCount;
		}
	}
}