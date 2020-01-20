// module com_main {
//     export class GuidePlot1 extends CComponent {
//         public static NAME = 'GuidePlot1';
//         public m_pBg: CImage;
//         public m_pFont1: CImage;
//         public m_pFont2: CImage;
//         public m_pFont3: CImage;
//         public constructor() {
//             super();
//             this.name = GuidePlot1.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_plot1.exml");
//             this.height = GameConfig.curHeight();
//         }
//         public onDestroy() {
//             super.onDestroy();
//         }
//         protected childrenCreated() {
//             super.childrenCreated();
//             this.m_pFont1.alpha = 0;
//             this.m_pFont2.alpha = 0;
//             this.m_pFont3.alpha = 0;
//             egret.Tween.get(this.m_pFont1).to({alpha:1},1500);
//             egret.Tween.get(this.m_pFont2).wait(1500).to({alpha:1},1500);
//             egret.Tween.get(this.m_pFont3).wait(3000).to({alpha:1},1500);
//             //394
//             egret.Tween.get(this.m_pBg).to({y:-300},5000).wait(1500).call(this.call,this);
//         }
//         public call() {
//             Utils.removeFromParent(this);
//         }
//         /**强制指引拦截事件 */
//         $hitTest(stageX, stageY) {
//             return this;
//         };
//     }
// }
