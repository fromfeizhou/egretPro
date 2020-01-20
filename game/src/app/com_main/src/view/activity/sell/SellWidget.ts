// /**银币倾销、兵书倾销、宝石促销组件 */
// module com_main {

//     export class SellWidget extends CComponent {

//         public m_pBg: com_main.CImage;
//         public m_pRemain: eui.Label;
//         public m_pObtain: eui.Label;
//         public m_pConsume: eui.Label;
//         public imgConsume: com_main.CImage;
//         public m_pBtn: com_main.ComButton;

//         private activityId: number;
//         private levelId: number;
//         private params: any;

//         public constructor() {
//             super();
//             this.skinName = Utils.getAppSkin("activity/sell/sell_widget.exml");
//             // this.initApp("activity/sell/sell_silver_widget.exml");
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.m_pConsume.anchorOffsetX = 0;
//         }

//         protected onCreate() { }

//         public initData(activityId, levelId, widgetParam: any) {
//             this.activityId = activityId;
//             this.levelId = levelId;
//             this.params = widgetParam;
//             // { buyNumber: config.buyNumber, isFree: config.isFree, freeNumber: config.freeNumber, params: config.params, obtain: null, cunsume: null }
//             // let type = ActivityModel.getActivityType(activityId);
//             // this.m_pBg.texture = Utils.getTempleItemTexture(type);
//             this.updateBg();
//             this.m_pRemain.text = "剩余" + widgetParam.buyNumber + "份";
//             this.m_pObtain.text = widgetParam.obtain.count + "";
//             this.m_pConsume.text = widgetParam.consume.count + "";
//             this.imgConsume.texture = RES.getRes(Utils.getResourceIcon(widgetParam.consume.itemId));

//             this.updateBtn();
//             // if (widgetParam.buyNumber + widgetParam.freeNumber <= 0) {
//             //     this.m_pBtn.disabled = true;
//             //     this.m_pBtn.gray = true;
//             // }

//             this.initEvent();
//         }

//         private updateBtn() {
//             if (this.params.isFree) {//免费
//                 this.m_pBtn.setTitleImg("font_qd_png");
//                 if (this.params.freeNumber <= 0) {
//                     this.m_pBtn.gray = true;
//                 }
//             } else {//要钱滴
//                 this.m_pBtn.setTitleImg("font_gm_png");
//                 if (this.params.buyNumber <= 0) {
//                     this.m_pBtn.gray = true;
//                 }
//             }
//         }

//         private initEvent() {
//             EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClick);
//         }

//         private onClick() {
//             if (this.params.isFree) {//免费
//                 if (this.params.freeNumber > 0) {
//                     ActivityProxy.send_SELL_ACTIVITY_FREE(this.activityId, Number(this.levelId));
//                 } else {
//                     this.m_pBtn.gray = true;
//                     EffectUtils.showTips("本日免费领取次数已达上限", 1, true);
//                 }
//             } else {//要钱滴
//                 if (this.params.buyNumber > 0) {
//                     if (this.params.consume.count <= RoleData.gold) {
//                         ActivityProxy.send_SELL_ACTIVITY_BUY(this.activityId, Number(this.levelId));
//                     }else{
//                         EffectUtils.showTips("金币不足", 1, true);
//                     }
//                 } else {
//                     this.m_pBtn.gray = true;
//                     EffectUtils.showTips("本日购买次数已达上限", 1, true);
//                 }
//             }
//         }

//         private updateBg() {
//             if (ActivityModel.getActivityType(this.activityId) == AcViewType.SILVER_SELL) {//银币
//                 this.m_pBg.texture = RES.getRes("temple_item1_png");
//             } else if (ActivityModel.getActivityType(this.activityId) == AcViewType.GEMSTONE_SELL) {//宝石
//                 this.m_pBg.texture = RES.getRes("temple_item4_png");
//             } else if (ActivityModel.getActivityType(this.activityId) == AcViewType.WAR_SELL) {//兵书
//                 this.m_pBg.texture = RES.getRes("temple_item3_png");
//             }
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             EventManager.removeEventListeners(this);
//         }
//     }
// }