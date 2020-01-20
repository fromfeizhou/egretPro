// module com_main {

//     enum EffectValueType {
//         value = 1,
//         percent = 2,
//     }

//     export class BuildingEffectWidget extends CComponent {

//         // UI部件
//         private m_pImgType: CImage;
//         private m_pEfcDesc: eui.Label;
//         private m_pLbCurValue: eui.Label;
//         private m_pGroupAdd: eui.Group;
//         private m_pLbAdd: eui.Label;

//         constructor() {
//             super();
//             this.skinName = Utils.getAppSkin("map/build/building_effect_widget.exml");
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//         }

//         public setEffectDesc2(currentEfcId: number, nextEfcId: number) {

//             let curCfg: BuildingEffectConfig = C.BuildingEffectConfig[currentEfcId];
//             let nextCfg: BuildingEffectConfig = C.BuildingEffectConfig[nextEfcId];

//             let curValue = 0;
//             let nextValue = 0;
//             if (curCfg && this.m_pLbCurValue) {
//                 // 从建筑效果类型表里取效果描述
//                 let key = 0;
//                 let typeCfg = C.BuildingEffectTypeConfig[curCfg.type];
//                 if (typeCfg) {
//                     key = typeCfg.desc;
//                 }
//                 if (this.m_pEfcDesc)
//                     Utils.setTextByLanguageKey(key, this.m_pEfcDesc, "未知效果");

//                 curValue = curCfg.value;
//                 if (curCfg.time != null && curCfg.time > 0) {
//                     // 策划公式
//                     curValue = Math.floor((1000 * 60 * 60 * 24) / curCfg.time * curCfg.value);
//                 }
//                 if (curCfg.valueType == EffectValueType.percent) {
//                     // 万分比
//                     this.m_pLbCurValue.text = Math.floor(curValue * 100) / 10000 + "%";
//                 } else {
//                     this.m_pLbCurValue.text = curValue + "";
//                 }
//             }

//             if (nextCfg && this.m_pLbAdd) {
//                 nextValue = nextCfg.value;
//                 if (nextCfg.time != null && nextCfg.time > 0) {
//                     // 策划公式
//                     nextValue = Math.floor((1000 * 60 * 60 * 24) / nextCfg.time * nextCfg.value);
//                 }

//                 let addValue = nextValue - curValue;
//                 if (curCfg.valueType == EffectValueType.percent) {
//                     // 万分比
//                     this.m_pLbAdd.text = Math.floor(addValue * 100) / 10000 + "%";
//                 } else {
//                     this.m_pLbAdd.text = addValue + "";
//                 }
//             } else {
//                 this.m_pGroupAdd.visible = false;
//             }
//         }
//     }
// }