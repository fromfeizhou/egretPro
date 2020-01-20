// module com_main {
//     export class WorldActivityComp extends CComponent {
//         public m_pIcon: eui.Group;
//         public m_icon: com_main.CImage;
//         public m_lbBg: com_main.CImage;
//         public m_pLb: com_main.CLabel;
//         public m_tData: WorldFunctionConfig;
//         public m_dt: number;
//         public constructor() {
//             super();
//         this.skinName = Utils.getAppSkin("world/WorldActivityCompSkin.exml");
//             this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
//         }
//         public onDestroy() {
//             this.removeEvent();
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.initEvent();
//         }
//         public updateUI(tData: WorldFunctionConfig) {
//             this.m_tData = tData;
//             let funcBtnCfg: FunctionBtnConfig = C.FunctionBtnConfig[tData.id];
//             if (isNull(funcBtnCfg)) return;
//             this.m_icon.source = `${funcBtnCfg.iconName}_png`
//             this.m_pLb.text = `${GCodeFromat(CLEnum.WOR_LOCK, this.m_tData.openLevel1)}`
//             if (tData.id == 3101) {
//                 let dateStrArr: string[] = tData.countdown.split(",");
//                 let dateSubArr: string[] = [];
//                 for (let str of dateStrArr) {
//                     dateSubArr.push(...str.split("~"));
//                 }
//                 //得到时间毫秒值数组
//                 let dateNumberArr: number[] = [];
//                 for (let subStr of dateSubArr) {
//                     dateNumberArr.push(this.getDateMillByDateStr(subStr));
//                 }
//                 let curtime = TimerUtils.getServerTimeMill();
//                 if (curtime > dateNumberArr[0] && curtime < dateNumberArr[1]) {
//                     this.m_dt = Math.floor(dateNumberArr[1] / 1000 - TimerUtils.getServerTime());
//                 } else if (curtime > dateNumberArr[2] && curtime < dateNumberArr[3]) {
//                     this.m_dt = Math.floor(dateNumberArr[3] / 1000 - TimerUtils.getServerTime());
//                 }
//                 this.m_lbBg.visible = this.m_dt > 0;
//                 this.m_pLb.visible = this.m_dt > 0;
//                 if (this.m_dt > 0) {
//                     Utils.TimerManager.doTimer(1000, this.m_dt + 1, this.updateCDTime, this);
//                 }
//             }
//         }
//         /**=====================================================================================
//      * 事件监听 begin
//      * =====================================================================================
//      */
//         private initEvent() {
//             EventManager.addTouchScaleListener(this.m_pIcon, this, this.onClickHandle);
//         }
//         public onClickHandle() {
//             if (RoleData.level < this.m_tData.openLevel1) {
//                 EffectUtils.showTips(GCodeFromat(CLEnum.WOR_LOCK, this.m_tData.openLevel1), 1, true)
//                 return;
//             }
//         }
//         /**时间解析 */
//         private getDateMillByDateStr(dateStr: string): number {
//             //得到当天零点的时间戳
//             let curDate: Date = new Date();
//             let curDateStr: string = curDate.toLocaleDateString();
//             let dateAllStr: string = curDateStr + " " + dateStr;
//             dateAllStr = dateAllStr.replace(/-/g, '/');
//             let dateMill: number = new Date(dateAllStr).getTime();
//             return dateMill;
//         }
//         /**
//         * 更新倒计时时间
//         */
//         public updateCDTime() {
//             this.m_dt--;
//             if (this.m_dt > 0) {
//                 this.m_pLb.text = Utils.DateUtils.getFormatBySecond(this.m_dt, 1)
//             } else {
//                 Utils.TimerManager.remove(this.updateCDTime, this);
//                 this.m_lbBg.visible = this.m_dt > 0;
//                 this.m_pLb.visible = this.m_dt > 0;
//             }
//         }
//         private removeEvent() {
//             EventManager.removeEventListeners(this);
//             Utils.TimerManager.remove(this.updateCDTime, this);
//         }
//         /**=====================================================================================
// 		 * 事件监听 end
// 		 * =====================================================================================
// 		 */
//     }
// }
