// module com_main {
//     /**
//      * 限时礼包Item
//      */
//     export class PayTgiftItem extends CComponent {
//         private m_pLbName: eui.Label;
//         private m_pLbNum: eui.Label;
//         private m_pItemcell0: com_main.WelfareItemCell;
//         private m_pItemcell1: com_main.WelfareItemCell;
//         private m_pItemcell2: com_main.WelfareItemCell;
//         private m_pItemcell3: com_main.WelfareItemCell;
//         private m_pItemcell4: com_main.WelfareItemCell;
//         private m_cangetGroup: eui.Group;
//         private m_pBtnBuy: eui.Image;
//         private m_pLbPrice: eui.Label;
//         private m_pLbRPrice: eui.Label;
//         public constructor() {
//             super();
//             this.skinName = Utils.getSkinName("app/pay/pay_tgift_item.exml");
//         }
//         public onDestroy(): void {
//             super.onDestroy();
//             EventManager.removeEventListener(this.m_pBtnBuy);
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.buyClick);
//         }
//         private buyClick(e: egret.Event): void {
//         }
//     }
// }
