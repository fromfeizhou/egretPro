// module com_main {
//     /**签到 */
//     export class WelfareDayLogin extends CView implements IWelfareView {
//         /**面板类型 */
//         public activityType: AcViewType;
//         private m_pGSroller: eui.Group;
//         private m_pCellList: Array<WelfareLoginCell>;    //每日奖励cell
//         // private m_loginResp: gameProto.DailyLoginActResp;
//         public constructor(type: AcViewType) {
//             super();
//             this.activityType = type;
//             this.initApp("welfare/WelfareDayLoginSkin.exml");
//         }
//         protected listenerProtoNotifications(): any[] {
//             return [
//                 ProtoDef.DAILY_LOGIN_ACT,
//                 ProtoDef.DAILY_LOGIN_ACT_REWARD,
//             ];
//         }
//         /**处理协议号事件 */
//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             switch (protocol) {
//                 case ProtoDef.DAILY_LOGIN_ACT: {// 获取每日登陆信息
//                     if (body) {
//                         // this.m_loginResp = body;
//                         this.refreshView();
//                     }
//                     break;
//                 }
//                 case ProtoDef.DAILY_LOGIN_ACT_REWARD: {// 每日登陆领取放回
//                     if (body) {
//                         for (let i = 0; i < this.m_pCellList.length; i++) {
//                             if(this.m_pCellList[i].awardId == body.received){
//                                 this.m_pCellList[i].refreshBtnByGet();
//                                 break;
//                             }
//                         }
//                     }
//                     break;
//                 }
//             }
//         }
//         $onRemoveFromStage(): void {
//             this.onDestroy();
//             super.$onRemoveFromStage();
//         }
//         public onDestroy(): void {
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             let cfg = C.DailyLoginRewardActConfig;
//             this.m_pCellList = [];
//             for (let id in cfg) {
//                 if (cfg[id] != null && cfg[id] != undefined) {
//                     let awardItem = new WelfareLoginCell(Number(id));
//                     this.m_pGSroller.addChild(awardItem);
//                     this.m_pCellList.push(awardItem);
//                 }
//             }
//             WelfareProxy.send_DAILY_LOGIN_ACT();
//         }
//          /**设置宽高 */
//         public setViewSize(width:number,height:number){
//             this.width = width;
//             this.height = height;
//         }
//         /**刷新显示 */
//         public refreshView() {
//             // if (this.m_loginResp) {
//             //     for (let i = 0; i < this.m_pCellList.length; i++) {
//             //         this.m_pCellList[i].refreshBtnByData(this.m_loginResp)
//             //     }
//             // }
//         }
//     }
// }
