// module com_main {
//     export class ActivitySelectWidget extends CComponent {
//         // 相邻按钮的间隔
//         private static INTERVAL_X = 160;
//         // 下一个按钮位置
//         private m_pNextX: number = 0;
//         // 当前选中的活动
//         private m_pCurrentId: number = 0;
//         private m_pBtnList: any = null;
//         private m_pScroller: eui.Scroller;
//         private m_pGroup: eui.Group;
//         private static m_pPos: number = 0;
//         public constructor() {
//             super();
//             this.skinName = Utils.getSkinName("app/activity/activity_select_widget.exml");
//         }
//         public static get posH(): number {
//             return ActivitySelectWidget.m_pPos;
//         }
//         public static set posH(pos: number) {
//             ActivitySelectWidget.m_pPos = pos;
//         }
//         public onDestroy() {
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             EventManager.addEventListener(this.m_pScroller, eui.UIEvent.CHANGE_END, this, this.onScrollerChange);
//         }
//         /**
//          * 初始化部件
//          */
//         public initWidget(activityId: number) {
//             if (this.m_pBtnList == null) {
//                 this.m_pBtnList = {};
//                 let len = ActivityModel.COMMON_ACTIVITY_LIST.length;
//                 for (let i = 0; i < len; i++) {
//                     let type = ActivityModel.COMMON_ACTIVITY_LIST[i];
//                     if (ActivityModel.checkIsOpen(type)) {
//                         let id = ActivityModel.getID(type)
//                         let btn = new ActivitySelectBtn(id);
//                         this.m_pGroup.addChild(btn);
//                         this.m_pBtnList[btn.activityId] = btn;
//                         btn.x = this.m_pNextX;
//                         this.m_pNextX = this.m_pNextX + ActivitySelectWidget.INTERVAL_X;
//                         EventManager.addTouchScaleListener(btn, this, this.onClickBtn);
//                         if (id == activityId) {
//                             btn.selected();
//                             this.m_pCurrentId = activityId;
//                         }
//                     }
//                 }
//             }
//             if (ActivitySelectWidget.posH < this.m_pGroup.width) {
//                 this.m_pScroller.viewport.scrollH = ActivitySelectWidget.posH;
//             } else {
//                 this.m_pScroller.viewport.scrollH = ActivitySelectWidget.posH = 0;
//             }
//         }
//         /**
//          * 滑动改变
//          */
//         private onScrollerChange() {
//             ActivitySelectWidget.posH = this.m_pScroller.viewport.scrollH;
//         }
//         /**
//          * 点击选中
//          */
//         private onClickBtn(evt: egret.TouchEvent) {
//             if (evt.target instanceof ActivitySelectBtn) {
//                 let lastSelectBtn = <ActivitySelectBtn>(this.m_pBtnList[this.m_pCurrentId]);
//                 let selectBtn = <ActivitySelectBtn>(evt.target);
//                 if (lastSelectBtn == null || selectBtn == null) {
//                     return;
//                 }
//                 if (selectBtn.activityId == lastSelectBtn.activityId) {
//                     return;
//                 }
//                 lastSelectBtn.unSelect();
//                 selectBtn.selected();
//                 this.m_pCurrentId = selectBtn.activityId;
//                 this.sendReq(selectBtn.activityId);
//             }
//         }
//         private sendReq(activityId: AcViewType) {
//             let activityType = ActivityModel.getActivityType(activityId);
//             switch (activityType) {
//                 case AcViewType.DECISIVE_BATTLE: {//决战
//                     break;
//                 }
//                 case AcViewType.SILVER_SELL: {//银币倾销
//                     ActivityProxy.send_SELL_ACTIVITY_INFO(ActivityModel.getID(AcViewType.SILVER_SELL));
//                     break;
//                 }
//                 case AcViewType.WAR_SELL: {//兵书倾销
//                     ActivityProxy.send_SELL_ACTIVITY_INFO(ActivityModel.getID(AcViewType.WAR_SELL));
//                     break;
//                 }
//                 case AcViewType.GEMSTONE_SELL: {//宝石倾销
//                     ActivityProxy.send_SELL_ACTIVITY_INFO(ActivityModel.getID(AcViewType.GEMSTONE_SELL));
//                     break;
//                 }
//                 case AcViewType.BAOT_ARROW: {//草船借箭
//                     break;
//                 }
//                 case AcViewType.SILVER_DIAL: {//银币转盘
//                     break;
//                 }
//                 case AcViewType.CAOCAO_IN_ARMS: {//曹操起兵
//                     break;
//                 }
//                 case AcViewType.SEVEN_MENGHUO: {//七擒孟获
//                     break;
//                 }
//                 case AcViewType.THREE_VISITS_BOOK: {//三顾茅庐（奖励书）
//                     ThreeVisitsProxy.send_THREE_VISITS_GET_REWARD();
//                     break;
//                 }
//                 case AcViewType.THREE_VISITS_GEMSTONE: {// 三顾茅庐（奖励宝石）
//                     ThreeVisitsProxy.send_THREE_VISITS_GET_REWARD();
//                     break;
//                 }
//             }
//         }
//     }
// }
