
// module com_main {

// 	/**
// 	 * 猛将提示
// 	 */
//     export class MapMJ extends CComponent {

//         public m_pLevel: eui.Label;
//         public m_pLogo: CImage;

//         private m_pLv: number = 0;
//         private m_pPId: number = 0;
//         private m_pHead: number = 0;

//         public constructor(pId: number, head: number, level: number) {
//             super();
//             this.skinName = Utils.getAppSkin("map/map_build_mj.exml");
//             this.m_pLv = level;
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.x = 130;
//             this.y = -90;

//             this.m_pLevel.text = this.m_pLv + '';
//             let textrue = RES.getRes('role_b_' + this.m_pHead + '_1_png');
//             if (textrue) {
//                 this.m_pLogo.texture = textrue;
//             }

//             let tw = egret.Tween.get(this, { loop: true });
//             tw.to({ "x": this.x - 5 }, 30)
//                 .to({ "x": this.x + 5 }, 60)
//                 .to({ "x": this.x - 5 }, 60)
//                 .to({ "x": this.x + 5 }, 60)
//                 .to({ "x": this.x - 5 }, 60)
//                 .to({ "x": this.x + 5 }, 60)
//                 .to({ "x": this.x }, 60)
//                 .to({ "x": this.x }, 500);
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             egret.Tween.removeTweens(this);
//         }
//     }
// }