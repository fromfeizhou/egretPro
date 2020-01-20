// module com_main {
//     /**
//      * 顶部显示擂台窗口显示信息
//      */
//     export class Pve extends CView {

//         public m_pName: eui.Label;
//         public m_pNum: eui.Label;
//         public m_pTime: eui.Label;

//         /**当前Pve类型 */
//         private checkType: number = 0;
//         /**当前战场剩余时间 */
//         private countTime: number = 0;
//         /**敌人总上阵兵团个数 */
//         private totalCount = 0;
//         /**敌人当前已上阵兵团个数 */
//         private currCount = 0;

//         public constructor() {
//             super();
//             this.initApp("battle_/top/battle_top_PVE.exml");
//             EventMgr.addEvent(UnitNav.SQUARE_REMOVE, this.onUnitDie, this);
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.anchorOffsetX = this.width / 2;
//             this.x = GameConfig.curWidth() / 2;
//             this.y = 50;

//             this.checkType = BattleModel.getCheckPointType();
//             if (this.checkType == CheckPointType.ARENA) {
//                 BattleProxy.send_ArenaId();//请求获取擂台id
//             } else {
//                 this.starTick();
//                 this.flushUnitCount();
//             }
//         }

//         protected listenerProtoNotifications(): any[] {
//             return [
//                 [ProtoDef.ARENA_ID]//获取玩家擂台id
//             ];
//         }

//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             debug("BattleProxy:execute-------->>", body)
//             switch (protocol) {
//                 case ProtoDef.ARENA_ID: {
//                     RoleData.arena = body.arenaId;
//                     this.starTick();
//                     this.flushUnitCount();
//                     // console.warn("收到了擂台id", body.arenaId);
//                     break;
//                 }
//                 default: {
//                     break;
//                 }
//             }
//         }

//         private starTick() {
//             if (C.CheckPointTypeConfig[this.checkType]) {
//                 this.countTime = C.CheckPointTypeConfig[this.checkType].passTimeLimit;
//                 if (this.countTime > 0) {
//                     this.countTime = this.countTime / 1000;
//                     this.m_pTime.visible = true;
//                     Utils.TimerManager.doTimer(1000, 0, this.onTimerFrame, this);
//                 }
//             }
//         }

//         private onTimerFrame() {
//             if (this.countTime > 0) {
//                 this.m_pTime.text = Utils.DateUtils.getFormatBySecond(this.countTime, 3);
//                 this.countTime--;
//             } else {
//                 Utils.TimerManager.remove(this.onTimerFrame, this);
//             }
//         }

//         private onUnitDie(unit: UnitInfoVo) {
//             if (BattleModel.getOwnFaction() != unit.faction) {
//                 this.currCount--;
//                 if (this.currCount < 0) this.currCount = 0;
//                 this.m_pNum.text = this.currCount + "/" + this.totalCount + "敌人";
//             }
//         }

//         //显示数量状态
//         private flushUnitCount() {
//             let battleinfo = BattleModel.getBattleInfo();
//             switch (this.checkType) {
//                 case CheckPointType.ARENA: { /**擂台 */
//                     this.totalCount = BattleModel.getInitialArenaNPCCount(BattleModel.getArenaId());
//                     this.currCount = this.totalCount - battleinfo.deadNPCArmy;
//                     if (this.currCount < 0) this.currCount = 0;
//                     this.m_pName.text = Utils.formatstr("第{x}关", "{x}", BattleModel.getArenaId() + "");
//                     break;
//                 }
//                 case CheckPointType.CHALLENGE: { /**马贼 */
//                     let checkConfig = BattleModel.getCheckPointConfig();
//                     if (!checkConfig) break;
//                     let eventIds = checkConfig.eventIds.split(",");
//                     for (let id in eventIds) {
//                         let evtid = parseInt(eventIds[id]);
//                         let config = BattleData.getLoginEventConfig(evtid);
//                         if (!config) continue;
//                         //如果为马贼召唤援兵时
//                         if (config.type == FightEventType.CALL_HELP) {
//                             let args = config.action0Arg3.split(";");
//                             for (let i in args) {
//                                 let count: number = Number(args[i].split(",")[1]) || 0;//写死1
//                                 this.totalCount = this.totalCount + count;
//                             }
//                         }
//                     }
//                     this.currCount = this.totalCount - battleinfo.deadNPCArmy;
//                     if (this.currCount < 0) this.currCount = 0;
//                     this.m_pName.text = "马贼";
//                     break;
//                 }
//                 default: {
//                     error("获取不到的关卡类型：", this.checkType);
//                     break;
//                 }
//             }
//             this.m_pNum.text = this.currCount + "/" + this.totalCount + "敌人";
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             EventMgr.removeEventByObject(UnitNav.SQUARE_REMOVE, this.onUnitDie);
//             Utils.TimerManager.remove(this.onTimerFrame, this);
//         }
//     }
// }