// module com_main {


// 	/**
// 	 * 云游商人面板
// 	 */
//     export class ShopCloud extends CView {
//         public static NAME = 'ShopCloud';
      
//         private m_btnRefresh:eui.Group;
        
       
//         private m_lastTimeValue:eui.Label;
//         private m_lastRefreshNumValue:eui.Label;
//         private m_lastRefreshCoin:eui.Label;
//         private m_lastRefreshtitle:eui.Label;
//         private m_pWidgets: any = {};
//         private m_List:eui.List;
    
//         public constructor() {
//             super();
//             this.name = ShopCloud.NAME;
//             this.initApp("shop/ShopCloudSkin.exml");
//         }
//         protected listenerProtoNotifications(): any[] {
//             return [
//                 ProtoDef.Buy_Merchant_Good,
//                 ProtoDef.Refresh_Merchant_List
//             ];
//         }
//         /**处理协议号事件 */
//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             switch (protocol) {
//                 case ProtoDef.Buy_Merchant_Good: {
//                     let result = body.result;
//                     if(result && body.type==1){
//                         let buy = body.item.buy;
//                         if(buy==true){
//                             ShopModel.updateShopTravelListByitemId(body.item.itemId,true);
//                             this.refreshData();
//                             this.m_pWidgets[body.item.itemId].m_coin.text = GCode(CLEnum.BUY_ALR);
//                             this.m_pWidgets[body.item.itemId].m_coin.textColor = 0xFF0000;
//                         }else 
//                         {
//                             this.m_pWidgets[body.item.itemId].m_coin.text = GCode(CLEnum.BUY_ALR);
//                             this.m_pWidgets[body.item.itemId].m_coin.textColor = 0xFFFFFF;
//                         }
//                     }
//                     break;
//                 }
//                 case ProtoDef.Refresh_Merchant_List: {// 刷新商品列表结果
//                     if (body) {
//                         if(body.result==true){
//                             ShopProxy.send_Travel_Shop_List(true);
//                         }
//                     }

//                     break;
// 			    }
//             }
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.height = this.stage.stageHeight;
//             EventManager.addEventListener(this.m_btnRefresh,egret.TouchEvent.TOUCH_TAP, this, this.onClickRefresh);
//             this.refreshTime();
//             // 初始化界面
//             this.initView(1);
            
//         }
//         private onClickRefresh(){
//             ShopProxy.send_Refresh_Merchant_List();
//         }
//         private onClickBack(){
//             com_main.UpManager.history();
//         }
 
//         private onClickTitle(e){
        
//         }
//         private refreshTime(){

//             let info = ShopModel.getShopTravelList();
//             this.m_pRemainTime = info.presentTime-(TimerUtils.getServerTimeMill())/1000;
//             this.m_pRemainTime<0?this.m_pRemainTime=0:this.m_pRemainTime;
//             this.m_lastTimeValue.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
// 			Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
//             let str = (5-info.refreshCount) + "/"+5;
//             this.m_lastRefreshNumValue.text = str;
//             if((5-info.refreshCount)==0){
//                Utils.isGray(true, this.m_btnRefresh);
//                this.m_btnRefresh.touchChildren = false;
//             }else
//             {
//                 Utils.isGray(false, this.m_btnRefresh);
//                 this.m_btnRefresh.touchChildren = true;
//             }
//         }
//         private m_pListDataProvider = null;
//         private m_data = [];
//         private m_pRemainTime = 0;
//         private initView(tag) {
//             this.refreshData();
//             this.m_List.dataProvider = this.m_pListDataProvider;
//             this.m_List.itemRenderer = ShopCloudCell;
//             this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
//         }
//         private refreshData(){
//             this.m_data = [];
//             let info = ShopModel.getShopTravelList();
//             let items = info.items;
//             if(items.length>0){
//                 for(let i=0;i<items.length;i++){
//                     let name = Utils.getItemName(items[i].itemId);
//                     this.m_data.push({name:name,itemId:items[i].itemId,buy:items[i].buy});
//                 }
//             }
            
//             if(this.m_pListDataProvider){
//                 this.m_pListDataProvider.replaceAll(this.m_data);
//             }else 
//             {
//                 this.m_pListDataProvider = new eui.ArrayCollection(this.m_data);
//             }
//         }
//         private onTouchTab(e){
//             var item = e.item;
//             this.m_pWidgets[item.itemId] = e.itemRenderer;
//         }
       
//         public onDestroy(): void {
//             super.onDestroy();
//              EventManager.removeEventListeners(this);
//              Utils.TimerManager.remove(this.updateRemainTime, this);
//         }
// 	   private updateRemainTime(){
//            if (--this.m_pRemainTime > -1) {
// 				this.m_lastTimeValue.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
// 			} else {
                
// 				this.m_lastTimeValue.text = "00:00:00";
// 				Utils.TimerManager.remove(this.updateRemainTime, this);
//                 ShopProxy.send_Refresh_Merchant_List();
// 			}
//        }
//     }
//     class ShopCloudCell extends eui.ItemRenderer {
    

//     private m_coin:eui.Label;
//     private m_btnbuy:eui.Group;
//     private m_pImgIcon:eui.Image;
//     private m_pImgbg:eui.Image;
// 	public constructor() {
// 		super();
// 		this.touchChildren = true;
// 	}

// 	protected childrenCreated(): void {
//         super.childrenCreated();
// 		EventManager.addTouchScaleListener(this.m_btnbuy, this, this.onClickbuy);
        
//     }
	
// 	private onClickbuy(e){
//         if(this.data.buy==false){
//             ShopProxy.send_Buy_Merchant_Good(this.data.itemId,1);
//         }else
//             EffectUtils.showTips(GCode(CLEnum.BUY_ALR), 1, true);
        
//     }
//     $onRemoveFromStage(): void {
//         super.$onRemoveFromStage();
//     }
    
//     protected dataChanged(): void {
//        super.dataChanged();
//         if( this.data ){
//             let name = Utils.getItemName(this.data.itemId);
//             let data: ITipsNor = { title: '', des: name };
// 			CTipsManager.addTips(this, { type: TipsEnum.Normal, param: data });
//             Utils.initPropkuang(this.m_pImgbg,this.data.itemId);
//             let image = PropModel.getPropIcon(this.data.itemId);
//             this.m_pImgIcon.source = image;
// 			if(this.data.buy==true){
//                 this.m_coin.text = GCode(CLEnum.BUY_ALR);
//                 this.m_coin.textColor =0xFF0000; 
//             }else 
//             {
//                 this.m_coin.text = "68";
//                 this.m_coin.textColor =0xFFFFFF; 
//             }
//         }
       
//     }


// }
// }