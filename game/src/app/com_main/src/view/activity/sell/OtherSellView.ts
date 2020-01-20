// /**银币倾销 */
// module com_main {
//     export class OtherSellView extends CView {

//         public m_pType: eui.Label;
//         public m_pTip: eui.Label;
//         public m_pOther1: com_main.SellWidget;
//         public m_pOther2: com_main.SellWidget;
//         public m_pOther3: com_main.SellWidget;
//         public m_pOther4: com_main.SellWidget;
//         public m_pSelectWidget: com_main.ActivitySelectWidget;

//         private sellInfo: any;
//         private activityId: number = 0;
//         private type: AcViewType;
//         private paramStr: string;
//         private paramType: number = 1;
//         private widgetNum: number = 4;

//         private tempWidget: com_main.SellWidget[] = [];
//         private widget: any[/**活动id类型 */][/**档次,第几个组件 */] = [];
//         private widgetParam: any[] = [];

//         public constructor(body?: any) {
//             super();
//             this.initApp("activity/sell/sell_other_view.exml");
//             this.sellInfo = body.sellInfo;
//             this.activityId = body.activityId;
//             this.type = ActivityModel.getActivityType(this.activityId);
//             this.paramStr = body.param;

//             // this.type = AcViewType.WAR_SELL;
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//         }

//         protected listenerProtoNotifications(): any[] {
//             return [
//                 [ProtoDef.SELL_ACTIVITY_FREE],
//                 [ProtoDef.SELL_ACTIVITY_BUY]
//             ];
//         }

//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             switch (protocol) {
//                 case ProtoDef.SELL_ACTIVITY_FREE: {//更新顶部提示和对应档次的子组件
//                     this.widgetParam[body.levelId].freeNumber--;
//                     this.widgetParam[body.levelId].buyNumber--;
//                     this.widgetParam[body.levelId].isFree = false;
//                     this.widget[this.type][body.levelId].initData(this.activityId, body.levelId, this.widgetParam[body.levelId]);
//                     this.updateTip();
//                     break;
//                 }
//                 case ProtoDef.SELL_ACTIVITY_BUY: {//更新顶部提示和对应档次的子组件
//                     this.widgetParam[body.levelId].buyNumber--;
//                     this.widget[this.type][body.levelId].initData(this.activityId, body.levelId, this.widgetParam[body.levelId]);
//                     this.updateTip();
//                     break;
//                 }
//                 default: {
//                     break;
//                 }
//             }
//         }

//         protected onCreate() {
//             if (this.activityId != 0) {
//                 this.m_pSelectWidget.initWidget(this.activityId);
//             } else {
//                 if (this.type == AcViewType.SILVER_SELL) {
//                     EffectUtils.showTips("银币盛典未开启", true);
//                 } else if (this.type == AcViewType.WAR_SELL) {
//                     EffectUtils.showTips("兵书盛典未开启", true);
//                 }
//                 return;
//             }
//             this.initConfig();
//         }

//         private initConfig() {
//             /**初始化标题 */
//             if (this.type == AcViewType.SILVER_SELL) {
//                 this.m_pType.text = "银币盛典";
//             } else if (this.type == AcViewType.WAR_SELL) {
//                 this.m_pType.text = "兵书盛典";
//             } else if (this.type == AcViewType.GEMSTONE_SELL) {
//                 this.m_pType.text = "宝石盛典";
//             }
//             this.tempWidget[1] = this.m_pOther1;
//             this.tempWidget[2] = this.m_pOther2;
//             this.tempWidget[3] = this.m_pOther3;
//             this.tempWidget[4] = this.m_pOther4;
//             let numId: number = 1;
//             for (let id in C.ActivitySellConfig) {//为每个组件添加索引，并设置对应参数
//                 if (!C.ActivitySellConfig[id]) break;
//                 if (numId > this.widgetNum) break;
//                 let config = C.ActivitySellConfig[id];
//                 if (config.activityId == this.activityId) {//配置表里的活动id类型
//                     this.widget[this.type] = this.widget[this.type] || [];
//                     this.widget[this.type][id] = this.tempWidget[numId];//将组件全放进去

//                     this.widgetParam[id] = { buyNumber: config.buyNumber, isFree: /**config.isFree */false, freeNumber: config.freeNumber, params: config.params, obtain: null, consume: null };
//                     numId++;
//                     /**初始化参数提示 */
//                     if (config.type) {
//                         this.paramType = config.type;
//                     }
//                 }
//             }
//             this.updateWidget();//更新组件数据，依靠配置表
//             this.updateData();//再次更新组件数据，由服务端发来的数据修改
//             this.updateTip();//更新顶部提示
//         }

//         /**更新档次 */
//         private updateWidget() {
//             for (let id in this.widgetParam) {//遍历对应档次id查找对应获得资源数和消耗资源数
//                 for (let i in C.ActivitySellLevelConfig) {
//                     if (!C.ActivitySellLevelConfig[i]) break;
//                     let config = C.ActivitySellLevelConfig[i];
//                     if (config.LeveId == Number(id) && config.minLevel <= RoleData.level && RoleData.level <= config.maxLevel) {
//                         /**
//                          * consumes.type:资源类型
//                          * consumes.itemId:消耗的资源图标
//                          * consumes.count:消耗的资源数目
//                          */
//                         let consume: any = Utils.parseCommonItemJson(config.cunsume);
//                         let obtain: any = Utils.parseCommonItemJson(config.obtain);
//                         this.widgetParam[id].consume = consume[0];
//                         this.widgetParam[id].obtain = obtain[0];
//                         this.widget[this.type][id].initData(this.activityId, id, this.widgetParam[id]);
//                     }
//                 }
//             }
//         }

//         /**更新对应改变的数据 */
//         private updateData() {
//             if (!this.sellInfo) return false;
//             for (let key in this.sellInfo) {
//                 let config = this.sellInfo[key];
//                 if (!config.levelId) continue;
//                 this.widgetParam[config.levelId].buyNumber = this.widgetParam[config.levelId].buyNumber - config.buyNumber - config.freeNumber;
//                 this.widgetParam[config.levelId].freeNumber = this.widgetParam[config.levelId].freeNumber - config.freeNumber;
//                 /**小于0都按0显示 */
//                 if (this.widgetParam[config.levelId].buyNumber < 0) this.widgetParam[config.levelId].buyNumber = 0;
//                 if (this.widgetParam[config.levelId].freeNumber < 0) this.widgetParam[config.levelId].freeNumber = 0;
//                 this.widgetParam[config.levelId].isFree = config.isFree;
//                 this.widget[this.type][config.levelId].initData(this.activityId, config.levelId, this.widgetParam[config.levelId]);
//             }
//             return true;
//         }

//         /**更新提示 */
//         private updateTip() {
//             /**提示的参数判断 */
//             let freeNum = null;
//             let curKillNum = null;
//             let totalKillNum = null;
//             for (let i in this.widgetParam) {
//                 freeNum = this.widgetParam[i].freeNumber;
//                 totalKillNum = JSON.parse(this.widgetParam[i].params)[0];//该值会根据活动类型而不一样，在“【1】”和“【600】”选择
//                 if (freeNum && totalKillNum && freeNum != "" && totalKillNum != "") break;
//             }
//             if (this.paramType == 1) {//银币倾销和兵书倾销的参数
//                 if (this.type == AcViewType.SILVER_SELL) {
//                     let str = "完成庆典可免费领取，剩余{x}次";
//                     str = Utils.formatstr(str, "{x}", freeNum);
//                     this.m_pTip.text = str;
//                 } else if (this.type == AcViewType.WAR_SELL) {
//                     let str = "完成对战可免费领取，剩余{x}次";
//                     str = Utils.formatstr(str, "{x}", freeNum);
//                     this.m_pTip.text = str;
//                 }
//             } else if (this.paramType == 2) {//宝石倾销的参数
//                 let p: any[];
//                 p.push(Number(this.paramStr));
//                 p.push(totalKillNum);
//                 p.push(freeNum);
//                 let str = "上阵杀敌{x}/{x}可免费领取，剩余{x}次";
//                 str = Utils.formatstr_(str, "{x}", p);
//             } else if (this.paramType == 3) {//其他活动的参数

//             }
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             this.m_pOther1.onDestroy();
//             this.m_pOther2.onDestroy();
//             this.m_pOther3.onDestroy();
//             this.m_pOther4.onDestroy();
//             this.m_pSelectWidget.onDestroy();
//         }
//     }
// }