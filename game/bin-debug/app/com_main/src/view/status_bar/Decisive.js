// /**左攻右守 */
// module com_main {
//     export class Decisive extends CView {
//         public m_pGroup: eui.Group;
//         public m_pAtkBlood: com_main.CImage;
//         public m_pDefBlood: com_main.CImage;
//         public m_pAtkFlag: com_main.CImage;
//         public m_pDefFlag: com_main.CImage;
//         public m_pTime: eui.Label;
//         //1：魏国 蓝
//         //2：蜀国 红
//         //3：吴国 绿
//         /**
//          * 
//          * 旗帜：
//          * top_zy_1_png：魏国
//          * top_zy_2_png：蜀国
//          * top_zy_3_png：吴国
//          * 血条：
//          * top_pro_3_png：魏国
//          * top_pro_1_png：蜀国
//          * top_pro_2_png：吴国
//          */
//         /**当前战斗类型 */
//         private typeId: number = 0;
//         /**当前战场剩余时间 */
//         private time: number = 0;
//         /**防守方总血 */
//         private defBlood: number = 0;
//         /**防守方当前血 */
//         private curDefBlood: number = 0;
//         /**攻击方总血 */
//         private atkBlood: number = 0;
//         /**攻击方当前血 */
//         private curAtkBlood: number = 0;
//         public constructor() {
//             super();
//             this.initApp("battle_/top/battle_top_Decisive.exml");
//             this.y = 10;
//             this.typeId = BattleModel.getCheckPointType();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.initConfig();
//             this.addEvent();
//         }
//         private initConfig() {
//             // this.time = TruceWidget.times;
//             // if (this.time && this.time > 0) {
//             //     this.m_pTime.visible = true;
//             //     Utils.TimerManager.doTimer(1000, 0, this.onTimerFrame, this);
//             // }
//             let battldData = BattleModel.getBattleInfos();
//             for (let i in battldData) {
//                 if (battldData[i]) {
//                     if (battldData[i].atkCountryIds[0] == 1) {
//                         this.m_pAtkFlag.texture = RES.getRes("top_zy_1_png");
//                         this.m_pAtkBlood.texture = RES.getRes("top_pro_3_png");
//                     } else if (battldData[i].atkCountryIds[0] == 2) {
//                         this.m_pAtkFlag.texture = RES.getRes("top_zy_2_png");
//                         this.m_pAtkBlood.texture = RES.getRes("top_pro_1_png");
//                     } else if (battldData[i].atkCountryIds[0] == 3) {
//                         this.m_pAtkFlag.texture = RES.getRes("top_zy_3_png");
//                         this.m_pAtkBlood.texture = RES.getRes("top_pro_2_png");
//                     }
//                     if (battldData[i].defCountryIds[0] == 1) {
//                         this.m_pDefFlag.texture = RES.getRes("top_zy_1_png");
//                         this.m_pDefBlood.texture = RES.getRes("top_pro_3_png");
//                     } else if (battldData[i].defCountryIds[0] == 2) {
//                         this.m_pDefFlag.texture = RES.getRes("top_zy_2_png");
//                         this.m_pDefBlood.texture = RES.getRes("top_pro_1_png");
//                     } else if (battldData[i].defCountryIds[0] == 3) {
//                         this.m_pDefFlag.texture = RES.getRes("top_zy_3_png");
//                         this.m_pDefBlood.texture = RES.getRes("top_pro_2_png");
//                     }
//                 }
//             }
//             let buildings: UnitInfoVo[] = BattleModel.getUnitsByType(UnitType.BUILDING);
//             for (let i in buildings) {
//                 if (buildings[i].faction == FactionType.ATK) {        //攻击方
//                     this.atkBlood = buildings[i].maxHP;
//                     this.curAtkBlood = buildings[i].getHp();
//                     this.m_pAtkBlood.width = this.m_pAtkBlood.width * buildings[i].getPercentHP();
//                 } else if (buildings[i].faction == FactionType.DEF) { //防守方
//                     this.defBlood = buildings[i].maxHP;
//                     this.curDefBlood = buildings[i].getHp();
//                     this.m_pDefBlood.width = this.m_pDefBlood.width * buildings[i].getPercentHP();
//                 }
//             }
//         }
//         private onTimerFrame() {
//             if (this.time > 0) {
//                 this.m_pTime.text = Utils.DateUtils.getFormatBySecond(this.time, 3);
//                 this.time--;
//             } else {
//                 Utils.TimerManager.remove(this.onTimerFrame, this);
//             }
//         }
//         private addEvent() {
//             EventMgr.addEvent(UnitNav.ATTR_BBUILD_HP, this.updateBloodData, this);
//         }
//         private updateBloodData(body /*:BattleUnitAttrChangeVo*/) {
//             // let id: Long = Long.fromValue(body.changerPlayerId);
//             // let playerId = id.toNumber();
//             // let playerData: BattlePlayerInfoVo = BattleModel.getBattlePlayer(playerId);
//             let unit: UnitInfoVo = BattleModel.getUnit(body.unitId);
//             if (unit.faction == FactionType.ATK) {                   //攻击方
//                 let atkDamage = this.atkBlood - body.getHp();        //伤害变化值
//                 this.curAtkBlood = body.getHp();
//                 this.updateAtkBloodView();                           //伤害喷血效果
//                 this.showWallDamage(atkDamage, FactionType.ATK);     //伤害值飘动显示
//             } else if (unit.faction == FactionType.DEF) {            //防守方
//                 let defDamage = this.defBlood - body.getHp();        //伤害变化值
//                 this.curDefBlood = body.getHp();
//                 this.updateDefBloodView();                           //伤害喷血效果
//                 this.showWallDamage(defDamage, FactionType.DEF);     //伤害值飘动显示
//             }
//         }
//         private updateAtkBloodView() {
//             this.m_pAtkBlood.x = this.m_pAtkBlood.x + this.m_pAtkBlood.width * (1 - this.curAtkBlood / this.atkBlood);
//             this.m_pAtkBlood.width = this.m_pAtkBlood.width * (this.curAtkBlood / this.atkBlood);
//             /**喷血效果 */
//             let cityBloodEffect = ImageEffect.load(IETypes.EBattle_Blood);
//             cityBloodEffect.anchorOffsetX = cityBloodEffect.width / 2;
//             cityBloodEffect.anchorOffsetY = cityBloodEffect.height / 2;
//             cityBloodEffect.scaleX = -1;
//             Utils.addChild(this.m_pGroup, cityBloodEffect);
//             cityBloodEffect.x = this.m_pAtkBlood.x + 45;
//             cityBloodEffect.y = this.m_pAtkBlood.y - 55;
//             ImageEffect.runAction(cityBloodEffect, () => {
//                 ImageEffect.removeAction(cityBloodEffect);
//             }, this, false);
//         }
//         private updateDefBloodView() {
//             this.m_pDefBlood.x = this.m_pDefBlood.x - this.m_pDefBlood.width * (1 - this.curDefBlood / this.defBlood);
//             this.m_pDefBlood.width = this.m_pDefBlood.width * (this.curDefBlood / this.defBlood);
//             /**喷血效果 */
//             let cityBloodEffect = ImageEffect.load(IETypes.EBattle_Blood);
//             cityBloodEffect.anchorOffsetX = cityBloodEffect.width / 2;
//             cityBloodEffect.anchorOffsetY = cityBloodEffect.height / 2;
//             Utils.addChild(this.m_pGroup, cityBloodEffect);
//             cityBloodEffect.x = this.m_pDefBlood.x - 45;
//             cityBloodEffect.y = this.m_pDefBlood.y - 55;
//             ImageEffect.runAction(cityBloodEffect, () => {
//                 ImageEffect.removeAction(cityBloodEffect);
//             }, this, false);
//         }
//         /**界面显示城池飘血效果 */
//         private showWallDamage(damage, faction: FactionType) {
//             // let txt: egret.BitmapText = ObjectPool.pop("egret.BitmapText");
//             let txt: egret.BitmapText = new egret.BitmapText();
//             txt.letterSpacing = -6;
//             txt.font = RES.getRes("font_number_hurt_fnt");
//             txt.text = "-" + damage;
//             txt.alpha = 1;
//             txt.scaleX = 1.2;
//             txt.scaleY = 1.2;
//             if (faction = FactionType.ATK) {//攻击方
//                 txt.x = this.m_pAtkBlood.x + this.m_pAtkBlood.width - txt.width;
//                 txt.y = this.m_pAtkBlood.y + 50;
//             } else {//防守方
//                 txt.x = this.m_pDefBlood.x - this.m_pDefBlood.width + txt.width;
//                 txt.y = this.m_pDefBlood.y + 50;
//             }
//             AnchorUtil.setAnchor(txt, 0.5);
//             Utils.addChild(this, txt);
//             CEffectFunc.floatHitCityWallAction(txt, () => {
//                 Utils.DisplayUtils.removeFromParent(txt);
//                 // ObjectPool.push(txt);
//             }, this);
//         }
//         public onDestroy(): void {
//             super.onDestroy();
//             Utils.TimerManager.remove(this.onTimerFrame, this);
//             EventMgr.removeEventByObject(UnitNav.ATTR_BBUILD_HP, this.updateBloodData);
//         }
//     }
// }
