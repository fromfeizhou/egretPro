// module com_main {

//     /**
//      * 
//      */
//     export class PayView extends CView {

//         public static NAME = "PayView";
//         private m_nType: number = 1;

//         private m_comTabGroup:ComTabGroup;
//         private m_MainTopNew:MainTopNew;

//         private m_pGLeft:eui.Group;
//         private m_pPayTab:com_main.PayTabWidget;
//         private m_pPanelCard:com_main.PayCardPanel;
//         private m_pScroller:eui.Scroller;
//         private m_pGScroller:eui.Group;
//         private m_pVsPanel:eui.ViewStack;
//         private m_pBtnFundBuy:eui.Group;



//         // private m_pTabs: PayTabSingle[] = [];


//         public constructor(ty?: number) {
//             super();
//             this.name = PayView.NAME;
//             this.m_nType = ty || 1;
            

//             this.initApp("pay/pay_view.exml");
//         }

//         protected listenerProtoNotifications(): any[] {
//             return [
//                 ProtoDef.BUY_GROW_FUND,
//                 ProtoDef.RECEIVE_GROW_FUND_REWARD,
//                 ProtoDef.RECHARGE_INFO
//             ];
//         }

//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			debug("PayFortuneView:execute -------->protocol, body:", protocol, body)
// 			switch (protocol) {
// 				case ProtoDef.BUY_GROW_FUND: {
//                     if (this.m_pBtnFundBuy && this.m_pBtnFundBuy.visible) {
//                         EffectUtils.showTips('成功购买成长基金', 1, true);
//                         this.m_pBtnFundBuy.visible = false;
//                         this.resetFund();
//                     }
// 					break;
// 				}
// 				case ProtoDef.RECEIVE_GROW_FUND_REWARD: {
//                     PayProxy.send_RECHARGE_INFO();
// 					break;
// 				}
// 				case ProtoDef.RECHARGE_INFO: {
//                     this.resetFund();
// 					break;
// 				}
// 			}
//         }

//         public onDestroy(): void {
//             EventManager.removeEventListener(this.m_pBtnFundBuy);
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.m_MainTopNew.setTitleName("福利");
//             this.m_comTabGroup.addTabBtnData({ name: "成长基金" });
//             this.m_comTabGroup.addTabBtnData({ name: "月卡周卡" });
//             this.m_comTabGroup.addTabBtnData({ name: "限时礼包" });
//             this.m_comTabGroup.setChangeCallback(this.changeTag,this);
           
//             this.initList();

//             this.m_pVsPanel.scaleX = GameConfig.getBestScale();
//             this.m_pVsPanel.scaleY = GameConfig.getBestScale();
//             this.m_pVsPanel.width= this.m_pVsPanel.width/GameConfig.getBestScale();
//             EventManager.addTouchScaleListener(this.m_pBtnFundBuy, this, this.buyClick)
//         }

//         private buyClick(e: egret.Event): void {
//             let [status, ret] = PayModel.getFundStatus();
//             if (status) {
//                 error(`has buy fund err===>`);
//                 return;
//             } 
//             PayProxy.send_BUY_GROW_FUND();
//         }

//         private changeTag(selIndex:number): void {
//             this.m_nType = selIndex;
//             this.initList();
//         }

//         private initList(): void {

//             this.m_pVsPanel.selectedIndex = this.m_nType == 2 ? 0 : 1;
//             this.m_pGScroller.removeChildren();
//             switch (this.m_nType) {
//                 case 1:
//                     this.m_pScroller.viewport.scrollV = 0;
//                     this.m_pScroller.viewport.scrollH = 0;
//                     this.initFund();
//                     break;
//                 case 2:
//                     this.m_pBtnFundBuy.visible = false;
//                     break;
//                 case 3:
//                     this.m_pBtnFundBuy.visible = false;
//                     this.m_pScroller.viewport.scrollV = 0;
//                     this.m_pScroller.viewport.scrollH = 0;
//                     for (let i=0; i<10; i++) {
//                         let item = new PayTgiftItem();
//                         this.m_pGScroller.addChild(item);
//                         item.x = 10;
//                         item.y = 20 + (item.height+10) * i;
//                     }
//                     break;
//             }
//         }

//         /**初始化基金信息列表 */
//         private initFund(): void {
//             let [status, ret] = PayModel.getFundStatus();
//             this.m_pBtnFundBuy.visible = !status;
//             debug(`=====================initFund:${ret}`);
//             let build = MainMapModel.getBuildInfo(1);
//             let i = 0;
//             debug(`==-========buld`,build);
//             for(let o of C.RechargeArwardConfig) {
//                 if (!o || o.type != 5) continue;
//                 let item = new PayFundItem();
//                 item.initData(o, build.level);
//                 this.m_pGScroller.addChild(item);
//                 item.y = 20;
//                 item.x = 10 + (item.width + 10) * i;
//                 i++;
//             }

//         }

//         private resetFund(): void {
//             for (let i = 0; i < this.m_pGScroller.numChildren; i++) {
//                 let item = <PayFundItem>this.m_pGScroller.getChildAt(i);
//                 item.setStatus();
//             }
//         }

//     }

// }