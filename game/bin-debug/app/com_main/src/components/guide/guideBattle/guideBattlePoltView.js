// //
// module com_main {
// 	/**
// 	 * 渐变面板相关
// 	 */
//     export class guideBattlePoltView extends CView {
//         public static NAME = 'guideBattlePoltView';
//         private m_pSkip:eui.Group;
//         public constructor() {//{titleStrs}
//             super();
//             this.name = guideBattlePoltView.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_plot_view.exml");
//         }
//         protected listenerProtoNotifications(): any[] {
//             return [
//             ];
//         }
//         /**处理协议号事件 */
//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//         }
//         public onDestroy(): void {
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//           EventManager.addTouchScaleListener(this.m_pSkip, this, this.skipPlot);
//         }
//         private skipPlot(){
//             SceneManager.closeGuidePanelByName(guideBattlePoltView.NAME);            
//             EventMgr.dispatchEvent(GuideEvent.GUIDE_SKIP_PLOT,null);
//         }
//     }
// }
