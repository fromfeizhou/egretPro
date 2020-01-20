// module com_main {
//     export interface IWelfareView {
//         activityType: AcViewType;
//         setViewSize(width: number, height: number): void;
//     }
// 	/**
// 	 * 福利面板相关
// 	 */
//     export class Welfare extends CView {
//         public static NAME = 'Welfare';
//         public m_MainTopNew: com_main.MainTopNew;
//         public m_ComTabGroup: ComTabGroup;
//         private m_tabViewStack: eui.ViewStack;   //主切卡
//         private m_nWidth: number;    //切卡宽度
//         private m_nHeight: number;   //切卡高度
//         private m_pViews: Array<IWelfareView> = [];
//         public m_nCurWelfareType: AcViewType;
//         public constructor(pageType: AcViewType) {
//             super();
//             this.name = Welfare.NAME;
//             this.m_nCurWelfareType = pageType;
//             this.initApp("welfare/WelfareSkin.exml");
//         }
//         public onDestroy(): void {
//             this.m_pViews = null;
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.m_MainTopNew.setTitleName("福利");
//             this.addSignUpView();
//             this.addDayLoginView();
//             this.addCardView();
//             this.addRechargeAddView();
//             this.addGrowFundView();
//             //强制渲染一次 获取宽高
//             this.validateNow();
//             let width = this.m_tabViewStack.width;
//             let height = this.m_tabViewStack.height;
//             for (let i = 0; i < this.m_pViews.length; i++) {
//                 this.m_pViews[i].setViewSize(width, height);
//             }
//             let index = 0;
//             for (let i = 0; i < this.m_pViews.length; i++) {
//                 let view = this.m_pViews[i];
//                 if (view.activityType == this.m_nCurWelfareType) {
//                     index = i;
//                     break;
//                 }
//             }
//             this.m_ComTabGroup.setChangeCallback(this.changeTag, this);
//             this.m_ComTabGroup.selectedIndex = index;
//             this.changeTag(index);
//         }
//         /**切换当前卡 */
//         private changeTag(index: number) {
//             this.m_nCurWelfareType = this.m_pViews[index].activityType;
//             this.m_tabViewStack.selectedIndex = index;
//         }
//         /**添加每日签到 */
//         private addSignUpView() {
//             // let type = AcViewType.SIGN_DAY;
//             // if (!ActivityModel.isOpen(type)) return;
//             // this.m_ComTabGroup.addTabBtnData({ name: "每日签到" });
//             // let signUpView = new WelfareSignUp(type);
//             // this.m_tabViewStack.addChild(signUpView);
//             // this.m_pViews.push(signUpView);
//         }
//         /**添加累计登陆 */
//         private addDayLoginView() {
//             // let type = AcViewType.LOGIN_ADD_UP;
//             // if (!ActivityModel.isOpen(type)) return;
//             // this.m_ComTabGroup.addTabBtnData({ name: "累计登陆" });
//             // let loginView = new WelfareDayLogin(type);
//             // this.m_tabViewStack.addChild(loginView);
//             // this.m_pViews.push(loginView);
//         }
//         /**添加月卡周卡 */
//         private addCardView() {
//             // let type = AcViewType.CARD_MONTH_WEEK;
//             // if (!ActivityModel.isOpen(type)) return;
//             // this.m_ComTabGroup.addTabBtnData({ name: "月卡周卡" });
//             // let cardView = new PayCardPanel(type);
//             // this.m_tabViewStack.addChild(cardView);
//             // this.m_pViews.push(cardView);
//         }
//         /**添加成长基金 */
//         private addGrowFundView() {
//             // let type = AcViewType.FUND_GROWTH;
//             // if (!ActivityModel.isOpen(type)) return;
//             // this.m_ComTabGroup.addTabBtnData({ name: "成长基金" });
//             // let growView = new PayGrowFundPanel(type);
//             // this.m_tabViewStack.addChild(growView);
//             // this.m_pViews.push(growView);
//         }
//         /**添加累计充值奖励 */
//         private addRechargeAddView() {
//             // let type = AcViewType.RECHARGE_ADD_UP;
//             // if (!ActivityModel.isOpen(type)) return;
//             // this.m_ComTabGroup.addTabBtnData({ name: "累计充值" });
//             // let payAwardView = new PayShopAwardView(type);
//             // this.m_tabViewStack.addChild(payAwardView);
//             // this.m_pViews.push(payAwardView);
//         }
//     }
// }
