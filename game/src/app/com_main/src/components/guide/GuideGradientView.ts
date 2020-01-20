// //
// module com_main {
// 	/**
// 	 * 渐变面板相关
// 	 */
//     export class GuideGradientView extends CView {
//         public static NAME = 'GuideGradientView';

//         private m_pMaskRoot: eui.Group;
//         private m_pIsShow: boolean;//true 从0->1 false 1->0
//         private m_pTime: number;
//         private m_pStartAlpha: number;
//         private m_pEndAlpha: number;
//         private callback:Function;



//         public constructor(data: any) {//{titleStrs}
//             super();
//             this.name = GuideGradientView.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_gradient_view_skin.exml");
//             if (data) {
//                 this.m_pIsShow = data.isShow;
//                 this.m_pTime = data.time;
//                 this.callback = data.callback;
//             }
//             this.m_pStartAlpha = this.m_pIsShow ? 0 : 1;
//             this.m_pEndAlpha = this.m_pIsShow ? 1 : 0;
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
//             this.m_pMaskRoot.alpha = this.m_pStartAlpha;
//             let temp = this.m_pEndAlpha;
//             egret.Tween.get(this.m_pMaskRoot)
//                 .to({ alpha: this.m_pEndAlpha }, this.m_pTime).call(() => {
//                     SceneManager.closeGuidePanelByName(GuideGradientView.NAME);
//                     if(this.callback){
//                         this.callback();
//                         this.callback = null;
//                     }
//                 })
//         }
//     }
// }