// module com_main {
//     export class GuidePlot2 extends CComponent {
//         public static NAME = 'GuidePlot2';
//         public m_pBg: CImage;
//         public m_pFire: CImage;
//         public m_pLS: CImage;//乱世
//         public m_pXX: CImage;//英雄
//         public m_pJS: CImage;//救世
//         public m_pYX: CImage;//英雄
//         public m_pWH1: CImage;//问号1
//         public m_pWH2: CImage;//问号2
//         public m_pWZHC: CImage;//我之何处
//         public m_pYG: CImage;//又该
//         public m_pHQHC: CImage;//何去何从
//         private m_pEGuide_Fire: SpriteAnimation;
//         public constructor() {
//             super();
//             this.name = GuidePlot2.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_plot2.exml");
//             this.height = GameConfig.curHeight();
//         }
//         public onDestroy() {
//             super.onDestroy();
//             if (this.m_pEGuide_Fire) {
//                 this.m_pEGuide_Fire.removeBitmap(this.m_pFire);
//                 this.m_pEGuide_Fire.removeAction();
//                 this.m_pEGuide_Fire = null;
//             }
//         }
//         protected childrenCreated() {
//             super.childrenCreated();
//             // this.height = this.stage.stageHeight;
//             let self = this;
//             self.m_pLS.alpha = 0;
//             self.m_pXX.alpha = 0;
//             self.m_pJS.alpha = 0;
//             self.m_pYX.alpha = 0;
//             self.m_pWH1.alpha = 0;
//             self.m_pWH2.alpha = 0;
//             self.m_pWZHC.alpha = 0;
//             self.m_pYG.alpha = 0;
//             self.m_pHQHC.alpha = 0;
//             /**烟火特效 */
//             // self.m_pEGuide_Fire = ImageEffect.load_2(IETypes.EGuide_Fire);
//             // if(self.m_pEGuide_Fire)
//             //     self.m_pEGuide_Fire.addBitmap(self.m_pFire);
//             this.font1();
//         }
//         public font1(){
//             egret.Tween.get(this.m_pLS).to({alpha:1},1000);
//             egret.Tween.get(this.m_pXX).wait(1000).to({alpha:1},1000);
//             egret.Tween.get(this.m_pWH1).wait(2000).to({alpha:1},1000).wait(800).call(this.font1_hide,this);
//         }
//         public font1_hide(){
//             egret.Tween.get(this.m_pLS).to({alpha:0},500);
//             egret.Tween.get(this.m_pXX).to({alpha:0},500);
//             egret.Tween.get(this.m_pWH1).to({alpha:0},500).call(this.font2,this);
//         }
//         public font2(){
//             egret.Tween.get(this.m_pJS).to({alpha:1},1000);
//             egret.Tween.get(this.m_pYX).wait(1000).to({alpha:1},1000);
//             egret.Tween.get(this.m_pWH1).wait(2000).to({alpha:1},1000).wait(800).call(this.font2_hide,this);
//         }
//         public font2_hide(){
//             egret.Tween.get(this.m_pJS).to({alpha:0},500);
//             egret.Tween.get(this.m_pYX).to({alpha:0},500);
//             egret.Tween.get(this.m_pWH1).to({alpha:0},500).call(this.font3,this);
//         }
//         public font3(){
//             egret.Tween.get(this.m_pWZHC).to({alpha:1},1000);
//             egret.Tween.get(this.m_pYG).wait(1000).to({alpha:1},1000);
//             egret.Tween.get(this.m_pHQHC).wait(2000).to({alpha:1},1000);
//             egret.Tween.get(this.m_pWH2).wait(2500).to({alpha:1},1000).wait(2000).call(this.call,this);
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
