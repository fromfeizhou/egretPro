// module com_main {
// 	/**
// 	 * 首占奖励面板
// 	 */
//     export class WorldActivityView extends CComponent {
//         public static NAME = 'WorldActivityView';
//         public m_pAct: eui.Group;
//         public m_compList: Array<WorldFunctionConfig> = []
//         public constructor() {
//             super();
//             this.name = WorldActivityView.NAME;
//             this.skinName = Utils.getAppSkin("world/WorldActivityViewSkin.exml");
//         }
//         $onRemoveFromStage(isclear = true): void {
//             this.onDestroy();
//             super.$onRemoveFromStage(isclear);
//         }
//         public onDestroy(): void {
//             this.removeEvent();
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.createActivity();
//             this.initEvent();
//         }
//         public createActivity() {
//             this.m_pAct.removeChildren();
//             this.m_compList = [];
//             for (let key in C.WorldFunctionConfig) {
//                 if (isNull(C.WorldFunctionConfig[key]))
//                     continue;
//                 let tData = C.WorldFunctionConfig[key];
//                 if (tData.id ==3101 || RoleData.level < tData.openLevel1) {
//                     let actComp: WorldActivityComp = new WorldActivityComp();
//                     actComp.name = `comp_${tData.id}`
//                     actComp.updateUI(tData);
//                     this.m_pAct.addChild(actComp);
//                     if (tData.id ==3101)
//                         continue
//                     this.m_compList.push(tData);
//                 }
//             }
//         }
//         /**=====================================================================================
// 		 * 事件监听 begin
// 		 * =====================================================================================
// 		 */
//         private initEvent() {
//             com_main.EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.onCheck, this);
//         }
//         private removeEvent() {
//             com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_LEVLE, this);
//         }
//         public onCheck() {
//             if (this.m_compList.length == 0)
//                 return;
//             for (let index = 0; index < this.m_compList.length; index++) {
//                 let tData = this.m_compList[index];
//                 if (tData.openLevel1 > RoleData.level)
//                     continue
//                 let comp: WorldActivityComp = <WorldActivityComp>this.m_pAct.getChildByName(`comp_${tData.id}`);
//                 this.m_pAct.removeChild(comp);
//             }
//         }
//         /**=====================================================================================
// 		 * 事件监听 end
// 		 * =====================================================================================
// 		 */
//     }
// }
