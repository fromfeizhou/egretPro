// enum exitTipType {
//     /**无反应 */
//     NONE = 0,
//     /**正常退出 */
//     NORMALEXITTIP = 1,
//     /**加速退出 */
//     QUICKEXITTIP = 2,
// }
// module com_main {
//     export class Back extends CView {
//         public back_Group: eui.Group;
//         public m_pQuickExit: eui.Label;

//         private canSpeedUpOut: boolean;
//         private exitTip: string;

//         private exitTipType: exitTipType = exitTipType.NORMALEXITTIP;
//         private curBattleType;

//         public constructor(canSpeedUpOut?: boolean, exitTip?: string) {
//             super();
//             this.initApp("battle_/top/battle_top_Back.exml");
//             this.canSpeedUpOut = canSpeedUpOut;
//             this.exitTip = exitTip;
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.y = 30;
//             this.x = 638;
//             this.initAll();
//         }

//         private initAll() {
//             this.curBattleType = BattleModel.getCheckPointType();
//             this.initEvent();
//         }

//         private initEvent() {
//             EventManager.addTouchScaleListener(this.back_Group, this, this.BackClick);
//         }

//         //返回点击
//         private BackClick(evt: egret.Event) {
//             switch (this.exitTipType) {
//                 case exitTipType.NORMALEXITTIP: {//正常撤退提示
//                     this.normalExitView();
//                     break;
//                 }
//                 case exitTipType.QUICKEXITTIP: {//快速撤退提示
//                     this.quickExitView();
//                     break;
//                 }
//                 default: {
//                     break;
//                 }
//             }
//         }

//         /**正常撤退弹窗 */
//         private normalExitView() {
//             //zb
//             // let count = BattleModel.getUnitCount(RoleData.playerId.toNumber());
//             let count = BattleModel.getUnitCount(RoleData.playerId);
//             if (count > 0) {
//                 let view = new com_main.ConfirmPop([this.exitTip], "state1", this.toExitBattle, null, this);
//                 UpManager.popSmallView(view, null, false);
//                 UpManager.mask(true, 0);
//             } else {
//                 this.toExitBattle();
//             }
//         }

//         private toExitBattle() {
//             if (BattleModel.isBattleJoin()) {
//                 BattleProxy.send_BATTLE_WITHDRAW();
//             } else {
//                 BattleProxy.send_BATTLE_LEAVE();
//             }
//             /**在此因为擂台没收到撤退响应，故多此一举 */
//             if (!this.canSpeedUpOut) {//由配置表控制可否快速撤退
//                 this.exitTipType = exitTipType.NONE;
//                 this.back_Group.touchEnabled = false;
//                 this.back_Group.touchChildren = false;
//             }
//         }

//         /**快速撤退弹窗 */
//         private quickExitView() {
//             //zb
//             // let currentplayerarmyNum = BattleModel.getUnitCount(RoleData.playerId.toNumber());//我的上阵兵团个数
//             let currentplayerarmyNum = BattleModel.getUnitCount(RoleData.playerId);//我的上阵兵团个数
//             let x = 0.2;  //默认0.2
//             if (Utils.getConstConfigValue(511)) {
//                 x = Number(Utils.getConstConfigValue(511));//快速撤退每个方阵消耗元宝数
//             }
//             let view = new com_main.ConfirmPop(["" + Math.ceil(currentplayerarmyNum * x), "马上撤退！"], "state2",
//                 () => {
//                     if (RoleData.gold >= Math.ceil(currentplayerarmyNum * x)) {
//                         BattleProxy.send_BATTLE_WITHDRAW(true);//确认快速撤退
//                     } else {
//                         EffectUtils.showTips("元宝不足", 1, true);
//                     }
//                     // this.exitTipType = exitTipType.NONE;
//                     this.back_Group.touchEnabled = false;
//                 },
//                 () => { },
//                 this, { consumeIcon: PropModel.getPropIcon(1), consumeColor: GameConfig.TextColors.red });
//             UpManager.popSmallView(view, null, false);
//             UpManager.mask(true, 0);
//         }

//         protected listenerProtoNotifications(): any[] {
//             return [
//                 [ProtoDef.BATTLE_WITHDRAW]
//             ];
//         }

//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             // debug("View:handleNotification--->>", name, body);
//             switch (protocol) {
//                 case ProtoDef.BATTLE_WITHDRAW: {
//                     //1.如果延迟时间大于0,则隐藏撤退按钮
//                     //2.如果延迟小于等于0,则进行撤退操作
//                     //3.在延迟大于0时倒数结束,服务器会重新发送一个延迟为0的消息
//                     //zb
//                     // let delay = BattleModel.getRetreatDelay().toNumber();
//                     let delay = BattleModel.getRetreatDelay();
//                     if (delay > 0) {  //倒计时
//                         if (this.canSpeedUpOut) {//由配置表控制可否快速撤退
//                             this.exitTipType = exitTipType.QUICKEXITTIP;
//                             this.m_pQuickExit.visible = true;
//                             this.m_pQuickExit.touchEnabled = false;
//                         }
//                     }
//                     // this.back_Group.visible = (delay <= 0);//<=0不让点击隐藏，和上面矛盾了
//                     break;
//                 }
//                 default: {
//                     break;
//                 }
//             }
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             this.destroyEvent();
//             if (this.curBattleType == CheckPointType.DECISIVE_BATTLE) {
//                 Utils.open_view(TASK_UI.POP_DECISIVE_BATTLE);
//             }
//         }

//         private destroyEvent() {
//             Utils.removeFromParent(this);
//             EventManager.removeEventListeners(this);
//         }
//     }
// }