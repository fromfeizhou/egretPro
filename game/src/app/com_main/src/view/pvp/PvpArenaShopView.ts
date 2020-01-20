module com_main {
	/**
	 * pvp战报面板相关
	 */
    export class PvpArenaShopView extends CView {
        public static NAME = 'PvpArenaShopView';
        private readonly SHOPITEMMAXCOUNT:number = 10;
      
        private m_pShopItemRoot:eui.Group;
        private m_MainTopNew:MainTopNew;
        private shopItemList:PvpArenaShopCell[];

        public constructor() {
            super();
            this.name = PvpArenaShopView.NAME;
            this.initApp("pvp_arena/PvpArenaShopViewSkin.exml");
            this.shopItemList = [];
        }
        protected listenerProtoNotifications(): any[] {
            return [
                //ProtoDef.MISSION_ACTIVE_REWAED,
               // ProtoDef.MISSION_ACTIVE_INFO,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                      
            }
        }

        public onDestroy(): void {
            super.onDestroy();
        }
        
        protected childrenCreated(): void {
            super.childrenCreated();
            this.initView();
        }

        private initView(){
            
            this.updateView();
        }

        private updateView(){

            let tempData = [1,2,3,4,5,7,8,9,13,14];
            let i = 0;
            for(;i<tempData.length;i++){
                if(this.shopItemList.length<=i){
                    let tempItem = new PvpArenaShopCell(tempData[i]);
                    tempItem.onClickCell = (id)=>{
                        this.onBuy(id);
                    }
                    this.m_pShopItemRoot.addChild(tempItem);
                    this.shopItemList.push(tempItem);
                }else{
                    this.shopItemList[i].updateView(tempData[i]);
                }
            }
            for(;i<this.shopItemList.length;i++){
                this.shopItemList[i].visible = false;
            }

        }

        private onBuy(id){

            error(id+"==========================")
        }
    }
}