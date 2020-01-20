// module com_main {
//     export class LevelupConditionDescWidget extends CComponent {
//         // 下标对应 LevelUpConditionType
//         private static CONDITION_DESC = [
//             0,
//             550044
//         ];
//         private m_pImgTanhao: CImage;
//         private m_pLbDesc: eui.Label
//         private m_pLbTarget: eui.Label;
//         constructor() {
//             super();
//             this.skinName = Utils.getSkinName("app/map/build/levelup_condition_desc_widget.exml");
//         }
//         /**
//          * @return 条件是否成立
//          */
//         public setDesc(condition: any, nextBuildingLv: number): boolean {
//             if (condition.length >= 3) {
//                 let showTanhao: boolean = false;
//                 let conditionType = condition[0];
//                 let limitType = condition[1];
//                 let limitValue = condition[2];
//                 let color = 0xFFB400;
//                 let currentValue = 0;
//                 let desc = "未知类型";
//                 let isRed = false;
//                 switch (conditionType) {
//                     case LevelUpConditionType.ROLE_LEVEL: {
//                         desc = GLan(LevelupConditionDescWidget.CONDITION_DESC[conditionType]);
//                         currentValue = RoleData.level;
//                         /**
//                          * 建筑等级不能超过玩家等级,如果玩家等级达到了升级条件等级
//                          * 必须再比较一下建筑等级，至少比建筑等级高一级才能升级建筑
//                          */
//                         let targetLevel = limitValue;
//                         if (currentValue >= targetLevel) {
//                             if (currentValue < nextBuildingLv) {
//                                 targetLevel = nextBuildingLv;
//                                 isRed = true;
//                             }
//                         } else {
//                             isRed = true;
//                         }
//                         desc = format(desc, targetLevel);
//                         this.m_pLbDesc.text = desc;
//                         break;
//                     }
//                     case LevelUpConditionType.BUILDING_LEVEL: {
//                         // desc = GLan(LevelupConditionDescWidget.CONDITION_DESC[conditionType]);
//                         /**
//                          * 建筑等级不能超过玩家等级,如果玩家等级达到了升级条件等级
//                          * 必须再比较一下建筑等级，至少比建筑等级高一级才能升级建筑
//                          */
//                         let targetLevel = limitValue;
//                         currentValue = MainMapModel.getLevelByType(limitType); 
//                         if (currentValue >= targetLevel) {
//                             // if (currentValue < nextBuildingLv) {
//                             //     targetLevel = nextBuildingLv;
//                             //     isRed = true;
//                             // }
//                         } else {
//                             isRed = true;
//                         }
//                         desc = format("建筑"+ limitType +"等级要求：" + targetLevel + "级");
//                         this.m_pLbDesc.text = desc;
//                         break;
//                     }
//                 }
//                 if (isRed) {
//                     this.m_pLbDesc.textColor = 0xff0000;
//                 }
//                 //this.m_pImgTanhao.x = this.m_pLbTarget.left + this.m_pLbTarget.width + 30;
//                 return true;
//             }
//         }
//         /**设置为建造队列已满 */
//         public setQueueMax() {
//             Utils.setTextByLanguageKey(500082, this.m_pLbDesc, "建造队列已满!");
//             this.m_pLbDesc.textColor = 0xff0000;
//         }
//     }
// }
