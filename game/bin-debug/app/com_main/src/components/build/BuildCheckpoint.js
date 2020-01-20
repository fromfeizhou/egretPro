// module com_main {
//     export class BuildCheckpoint extends CComponent {
//         private m_pTitleIcon: CImage;
//         private m_pEffectRoot: eui.Group;
//         private m_pEffect: MCDragonBones;
//         public constructor() {
//             super();
//             this.skinName = Utils.getSkinName("app/build/BuildCheckpointSkin.exml");
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.createAnimation();
//             this.setTitleIconAnimate();
//             RedPointModel.AddInfoListener(this, { x: 120, y: 3 },
//                 [RedEvtType.HEAD_QUATER], 3);
//         }
//         private createAnimation() {
//             this.m_pEffect = new MCDragonBones();
//             this.m_pEffect.initAsync(IETypes.EUI_zccsm);
//             this.m_pEffect.x = this.m_pEffectRoot.width * 0.5;
//             this.m_pEffect.y = this.m_pEffectRoot.height * 0.5;
//             this.m_pEffect.play(IETypes.EUI_zccsm, 0);
//             this.m_pEffectRoot.addChild(this.m_pEffect);
//         }
//         private setTitleIconAnimate() {
//             egret.Tween.removeTweens(this.m_pTitleIcon);
//             Tween.get(this.m_pTitleIcon, { loop: true })
//                 .to({ y: 15 }, 1000, egret.Ease.sineIn)
//                 .to({ y: 0 }, 1000, egret.Ease.sineOut);
//         }
//         public onDestroy(): void {
//             if (this.m_pEffect) {
//                 this.m_pEffect.destroy();
//                 this.m_pEffect = null;
//             }
//             super.onDestroy();
//         }
//     }
// }
