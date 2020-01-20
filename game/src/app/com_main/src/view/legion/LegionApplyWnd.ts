module com_main {
	/**联盟申请列表 */
	export class LegionApplyWnd extends CView {
		public static NAME = 'LegionApplyWnd';
		private m_ItemList:eui.List;
		private m_Scroller:eui.Scroller;
		private m_PopUp:com_main.APopUp;
		/** 当前擂台列表数据 */
		private m_DataArray:eui.ArrayCollection = new eui.ArrayCollection();
		private m_num = [0,0,0,0,0];
		private m_numMax = [1,2,4,5,50];
		private m_data = null;
		private m_max = 35;
		private m_curPag = 0;
		private m_totalPage = 2;
		private m_scrollV = 0;
		public constructor(mata:any) {
			super();
			// this.skinName = Utils.getSkinName("app/legion/LegionApplyWndSkin.exml");
			this.name = LegionApplyWnd.NAME;
            this.initApp("legion/LegionApplyWndSkin.exml");
			this.m_data = mata;
		}
		protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.CHECK_APPLY_JOIN_GUILD,
                ProtoDef.ACCEPT_APPLY_JOIN_GUILD
            ];
        }
		public executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.CHECK_APPLY_JOIN_GUILD:
				{
					let info = body.stayApplyJoin;
					this.m_curPag = body.page ; //分页
					this.m_totalPage = body.totalPage ; //总页数
					this.initScroller(info);
				}
				break;
				case ProtoDef.ACCEPT_APPLY_JOIN_GUILD:{//3617
				if (body) {
					this.removeItemAt(body.type);
				}				
				break;
			}
			}
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			// this.initScroller();
			this.m_PopUp.setBottomBorder();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_APPLY_LIST));
			this.requestPage();
			//this.test();
		}

		public onDestroy(): void {
            super.onDestroy();
             EventManager.removeEventListeners(this);
        }
		private requestPage() {
			if (this.m_curPag ==0 || this.m_curPag < this.m_totalPage){
				LegionProxy.send_CHECK_APPLY_JOIN_GUILD(this.m_curPag + 1);
			}
		}
		private onScrollEnd() {
			if (this.m_Scroller && (this.m_Scroller.viewport.scrollV + this.m_Scroller.height) >= this.m_Scroller.viewport.contentHeight ) {
				this.requestPage();
			}
		}
		private test(){
			let n = [];
			for(var i=0;i<10;i++){
				let t = {playerId:123321,name:'', fight:13333, level:1};
				n.push(t);
			}
			let body = {stayApplyJoin:n,page:1,totalPage:1};
			
			let info = body.stayApplyJoin;
			this.m_curPag = body.page ; //分页
			this.m_totalPage = body.totalPage ; //总页数
			this.initScroller(info);
		}
		private initScroller(body){
			let list = [];
			for(let i = 0;i<body.length;i++){
				var info = body[i];
				let type = info.type;
				list.push({index:this.m_DataArray.length+i,playerId:info.playerId,playerName:info.name, fight:info.power, level:info.level,btnHandle:(index)=>this.onClickHandle(index)});
			}
			if(this.m_DataArray.length==0){
				this.m_DataArray = new eui.ArrayCollection(list);
			}else 
			{
				// this.m_DataArray.replaceAll(list);
				for(let i = 0;i<list.length;i++){
					this.m_DataArray.addItem(list);
				}
			}
			this.m_ItemList.dataProvider = this.m_DataArray;
			this.m_ItemList.itemRenderer = LegionApplyCell;
		}
		private onClickHandle(index){
			
		}
		private removeItemAt(index){
			this.m_DataArray.removeItemAt(index);
			for(let i=0;i<this.m_DataArray.length;i++){
				let data = this.m_DataArray.source[i];
				data.index = i;
			}
		}
	}
	
	class LegionApplyCell extends eui.ItemRenderer {
		private m_Name:com_main.CLabel;
		private m_lv:com_main.CLabel;
		private m_labelFight:eui.BitmapLabel;
		private m_BtnConfirm:eui.Group;
		private m_BtnReject:com_main.ComButton;
		public constructor() {
			super();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickConfirm);
			EventManager.addTouchScaleListener(this.m_BtnReject, this, this.onClickReject);
		}
		

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
			EventManager.removeEventListeners(this);
		}
		//同意
		private onClickConfirm(){
			// if(this.data.btnHandle)
			// 	this.data.btnHandle(this.data.index);
			LegionProxy.send_ACCEPT_APPLY_JOIN_GUILD(this.data.playerId,0,this.data.index);
		}
		//拒绝
		private onClickReject(){
			LegionProxy.send_ACCEPT_APPLY_JOIN_GUILD(this.data.playerId,1,this.data.index);
			// if(this.data.btnHandle)
			// 	this.data.btnHandle(this.data.index);
		}
		protected dataChanged(): void {
			super.dataChanged();
			if( this.data ){
				this.m_BtnReject.setTitleLabel(GCode(CLEnum.RESURE));
				this.m_Name.text = this.data.playerName;
				this.m_lv.text = this.data.level;
				this.m_labelFight.text = this.data.fight;
			}
		
		}


	}
}