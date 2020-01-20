// module com_main {
//     export class CityBlood extends CView {
//         public cityBloodGroup: eui.Group;
//         public cityBlood_Img: com_main.CImage;
//         public money_Group: eui.Group;
//         public money_Img: com_main.CImage;
//         public callHelp_Lab: eui.Label;
//         public flag_Group: eui.Group;
//         public flag_Img: com_main.CImage;
//         public fightHelp_Lab: eui.Label;
//         public bloodState: eui.Label;
//         public lion_Img: com_main.CImage;
//         // private cityBlood: number = 0;
//         // private isAddBlood: Boolean = true;
//         private bloodWidth: number = 312;//血条总长度
//         private flagArray: any[] = [];
//         private flagId: number = 0;                 //城池血量到达了哪个旗帜
//         private currentHp: number = 0;
//         private maxHp: number = 0;
//         private bloodSpeed: number = 1;
//         private hpLevelArr: any[] = [];
//         public static m_pIsShowBlood: boolean = false;
//         ///////////////////////////////////战斗事件（召唤援军/使用战法）//////////////////////////////////////
//         private callHelpTime: number = 0;
//         private fightHelpTime: number = 0;
//         ///////////////////////////////////////////////////////////////////////////////////////////////////
//         public constructor() {
//             super();
//             this.initApp("battle_/top/battle_top_CityBlood.exml");
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.y = 0;
//             this.x = 42;
//             this.callHelp_Lab.touchEnabled = false;
//             this.fightHelp_Lab.touchEnabled = false;
//             this.initAll();
//             this.bloodState.visible = CityBlood.m_pIsShowBlood;
//         }
//         private initAll() {
//             this.initCityBlood();
//             this.initConfig();
//             this.initEvent();
//         }
//         private initConfig() {
//             /**配置监听召唤援军或使用战法时的显示 */
//             // FightEventType.CALL_HELP,FightEventType.FIGHT_HELP
//             let callHelp = BattleData.getFightEventConfig(FightEventType.CALL_HELP);
//             let fightHelp = BattleData.getFightEventConfig(FightEventType.FIGHT_HELP);
//             if (callHelp) {   //召唤援军
//                 TipsManager.addTips(this.money_Img, callHelp.description, 0);//援兵事件
//             }
//             if (fightHelp) {  //使用战法
//                 TipsManager.addTips(this.flag_Img, fightHelp.description, 0);//战法事件
//             }
//             if (BattleModel.getCheckPointConfig()) {
//                 let eventIdArray = BattleModel.getCheckPointConfig().eventIds.split(",");
//                 for (let id in eventIdArray) {
//                     let config = C.LogicEventConfig[eventIdArray[id]];
//                     if (!config) continue;
//                     if (config.type == FightEventType.CALL_SUPPER_HELP) {//如果为召唤超级援兵时
//                         if (Number(config.cond0Arg1) < this.currentHp / this.maxHp) {
//                             this.hpLevelArr.push(Number(config.cond0Arg1));
//                             debug("血分段", Number(config.cond0Arg1), this.maxHp * Number(config.cond0Arg1));
//                         }
//                     }
//                 }
//                 this.hpLevelArr.sort();//默认从小到大排序
//             }
//             /**初始化旗帜数组 */
//             // let receive: any = BattleModel.getCityBattleHitWallDataInfo();
//             // let id = receive.cityId;
//             let cityConfig = C.WorldMapConfig[WorldMapModel.m_pLastSelectId];
//             let totalW = this.bloodWidth;                          //血条总宽度
//             let strs = ["0.25", "0.5", "0.75"];            //默认0.25，0.5，0.75
//             this.flagId = strs.length - 1;
//             if (cityConfig) {
//                 let str = cityConfig.flagCount.replace(/\[|\]/g, "");
//                 strs = str.split(",");
//                 this.flagId = strs.length - 1;
//             }
//             for (let i = 0; i < strs.length; i++) {
//                 let flagImg: egret.Bitmap = new egret.Bitmap(RES.getRes("fight_component_btn1-7-1"));
//                 flagImg.width = 30;
//                 flagImg.height = 34;
//                 AnchorUtil.setAnchorX(flagImg, 0.5);
//                 // let a = this.cityBlood_Img.localToGlobal(120, 45);
//                 flagImg.x = this.cityBlood_Img.x + totalW * Number(strs[i]);     //120为血条的坐标
//                 flagImg.y = this.cityBlood_Img.y;
//                 // Utils.addChild(this.cityBloodGroup, flagImg);
//                 if (flagImg.x - 10 < this.cityBlood_Img.x + this.currentHp * this.bloodWidth / this.maxHp) {
//                     this.flagArray.push(flagImg);
//                 } else {
//                     flagImg.texture = RES.getRes("fight_component_btn1-7-2");
//                     this.flagId--;
//                 }
//             }
//         }
//         private initEvent() {
//             EventManager.addTouchScaleListener(this.lion_Img, this, this.lionOnClick);
//             Utils.TimerManager.doTimer(1000, 0, this.onTimerFrame, this);
//             EventMgr.addEvent(UnitNav.ATTR_BBUILD_HP, this.updateCityBloodData, this);
//         }
//         private lionOnClick() {
//             CityBlood.m_pIsShowBlood = !CityBlood.m_pIsShowBlood;
//             this.bloodState.visible = CityBlood.m_pIsShowBlood;
//         }
//         /**倒计时 */
//         private tempBool_1 = false;
//         private tempBool_2 = false;
//         private onTimerFrame(delta: number) {
//             //zb
//             //泽标
//             // debug("血：当前血量，", this.currentHp, this.maxHp);
//             /**显示撞墙经验和军工 */
//             this.showHitWallMilitary = true;
//             this.showHitWallExp = true;
//             /**每隔1s更新显示召唤援军或者使用战法倒计时 */
//             this.callHelpTime = BattleData.getFightEventTickTime(FightEventType.CALL_HELP);
//             this.fightHelpTime = BattleData.getFightEventTickTime(FightEventType.FIGHT_HELP);
//             this.callHelpTime = Math.floor(this.callHelpTime / 1000);
//             this.fightHelpTime = Math.floor(this.fightHelpTime / 1000);
//             if (this.callHelp_Lab && this.fightHelp_Lab) {
//                 this.callHelp_Lab.text = this.callHelpTime + "";
//                 this.fightHelp_Lab.text = this.fightHelpTime + "";
//             }
//             /**添加战斗事件的战场公告 */
//             if (this.tempBool_1) {
//                 if (this.callHelpTime <= 0) {
//                     this.tempBool_1 = false;
//                     this.sendNotice("守方召唤士兵");
//                 }
//             }
//             if (this.tempBool_2) {
//                 if (this.fightHelpTime <= 0) {
//                     this.tempBool_2 = false;
//                     this.sendNotice("守方士兵使用战法");
//                 }
//             }
//             //非攻即守
//             let isHasArmy: boolean = false;
//             isHasArmy = ((BattleModel.getUnitCountByFaction(FactionType.ATK) > 0) && (BattleModel.getUnitCountByFaction(FactionType.DEF) > 0));
//             this.tempBool_1 = (this.callHelpTime > 0 && isHasArmy);
//             this.tempBool_2 = (this.fightHelpTime > 0 && isHasArmy);
//         }
//         /**初始化城池血量状态，包括旗帜状态 */
//         private initCityBlood() {
//             if (!(this.maxHp && this.currentHp)) {
//                 let cityUnit = BattleModel.getUnit(null, UnitType.BUILDING);
//                 if (cityUnit) {
//                     this.maxHp = cityUnit.maxHP;
//                     this.currentHp = cityUnit.getHp();
//                     let x = Utils.getVirtualBlood(this.currentHp / this.maxHp);//虚拟血百分比
//                     // let x = this.setVirtualBlood(this.currentHp / this.maxHp);//虚拟血百分比
//                     let trueHpWidth = this.bloodWidth * x;//总长乘以系数
//                     // let trueHpWidth = this.currentHp * this.bloodWidth / this.maxHp;
//                     this.setCityBlood(trueHpWidth);
//                     this.bloodState.text = this.currentHp + "/" + this.maxHp;
//                     // error("初始：最大血量:", this.maxHp, ",当前血量:", this.currentHp, ",当前血量长度值:", trueHp);
//                 }
//             }
//         }
//         //设置城市血量
//         private setCityBlood(trueHpWidth: number) {
//             this.cityBlood_Img.width = trueHpWidth;
//             this.setFlagState(trueHpWidth, true);
//         }
//         /**更新城池血量 */
//         private updateCityBloodData(body: BattleUnitAttrChangeVo) {
//             // error(this.cityBlood_Img.width, "原先的城池血量：", this.currentHp, ",接收的城池当前血量：", body.HP, ",伤害变化值:" + (this.currentHp - body.HP));
//             let damage = this.currentHp - body.getHp();//伤害变化值
//             this.showWallDamage(damage);//在城池血条旁边显示城池所受伤害效果
//             this.currentHp = body.getHp();
//             this.setNotice(this.currentHp);//超级援军公告
//             let x = Utils.getVirtualBlood(this.currentHp / this.maxHp);//虚拟血百分比
//             // let x = this.setVirtualBlood(this.currentHp / this.maxHp);//虚拟血百分比
//             let virtualHp = this.maxHp * x;
//             this.updateCityBloodState(virtualHp);//更新显示城池血量进度
//             debug("模拟：", virtualHp, ",真实：", this.currentHp, ",差值：", this.currentHp - virtualHp);
//             this.setFlagState(this.currentHp * this.bloodWidth / this.maxHp);//更新显示旗帜状态
//             //zb
//             // let id: Long = Long.fromValue(body.changerPlayerId);
//             // let playerId = id.toNumber();
//             let id: number = body.changerPlayerId;
//             let playerId = id;
//             let playerData = BattleModel.getBattlePlayer(playerId);
//             if (damage < 0) {
//                 debug(damage);
//                 return;
//             }
//             if (playerId != -1) {
//                 this.addExpMilitary(body, damage);//更新显示城墙掉血我方所得经验或者军工
//                 //攻击城墙，用计算军工经验加成
//                 // if (body.armyMainType == 4) {    //攻击城池的为撞车时累加伤害
//                 //     this.hitCarDamage = this.hitCarDamage + damage;
//                 //     // debug("撞车:", damage);
//                 // } else {                         //攻击城池的为别的种类时累加别的伤害
//                 //     this.otherArmyDamage = this.otherArmyDamage + damage;
//                 //     // debug("其他车:", damage);
//                 // }
//             }
//         }
//         /**设置城池扣血速度等级,在此注释，已写在静态方法中 */
//         // private setVirtualBlood(x) {/** x:当前血除以总血 */
//         //     // let temp = this.currentHp / this.maxHp;
//         //     if (x == 0) {
//         //         return 0;
//         //     }
//         //     let sum = 0;
//         //     let i;
//         //     for (i = C.CityBloodConfig.length - 1; i >= 1; i--) {
//         //         let config = C.CityBloodConfig[i];
//         //         if (x <= config.level_end) {
//         //             if (x <= config.level_start) {
//         //                 sum = sum + (config.level_end - config.level_start) * config.param;
//         //             } else if (x > config.level_start) {
//         //                 sum = sum + (config.level_end - x) * config.param;
//         //                 break;
//         //             }
//         //         }
//         //     }
//         //     return 1 - sum;
//         // }
//         /**更新城池血量界面效果显示 */
//         private updateCityBloodState(hp) {
//             this.bloodState.text = "真实：" + this.currentHp + "/" + this.maxHp;
//             // debug("当前血量：", this.currentHp, "，最大血量：", this.maxHp);
//             /**喷血效果 */
//             let cityBloodEffect = ImageEffect.load(IETypes.EBattle_Blood);
//             cityBloodEffect.anchorOffsetX = cityBloodEffect.width / 2;
//             cityBloodEffect.anchorOffsetY = cityBloodEffect.height / 2;
//             Utils.addChild(this.cityBloodGroup, cityBloodEffect);
//             // let point = this.cityBlood_Img.localToGlobal(this.cityBlood_Img.x, this.cityBlood_Img.y);
//             cityBloodEffect.x = this.cityBlood_Img.x + this.cityBlood_Img.width - 47;
//             cityBloodEffect.y = this.cityBlood_Img.y - 50;
//             ImageEffect.runAction(cityBloodEffect, () => {
//                 ImageEffect.removeAction(cityBloodEffect);
//             }, this, false);
//             if (hp < 0) {
//                 hp = 0;
//                 this.cityBlood_Img.width = hp * 315 / this.maxHp;
//             } else {
//                 this.cityBlood_Img.width = hp * 315 / this.maxHp;
//                 // 	debug("更新血量成功，当前血量：", this.currentHp, "，最大血量：", this.maxHp);
//             }
//         }
//         /**界面显示城池飘血效果 */
//         private showWallDamage(damage) {
//             //////////////////////////////////////////////////////////////////////////
//             // let txt: egret.BitmapText = ObjectPool.pop("egret.BitmapText");
//             let txt: egret.BitmapText = new egret.BitmapText();
//             txt.letterSpacing = -6;
//             txt.font = RES.getRes("font_number_hurt_fnt");
//             txt.text = "-" + damage;
//             txt.alpha = 1;
//             txt.scaleX = 1.2;
//             txt.scaleY = 1.2;
//             txt.x = 160;
//             txt.y = 80;
//             AnchorUtil.setAnchor(txt, 0.5);
//             Utils.addChild(this, txt);
//             CEffectFunc.floatHitCityWallAction(txt, () => {
//                 Utils.DisplayUtils.removeFromParent(txt);
//                 // ObjectPool.push(txt);
//             }, this);
//             //////////////////////////////////////////////////////////////////////////
//         }
//         private isReadyCall: boolean = true;
//         private isCalled: boolean = true;
//         /**由城池血量判断战场超级援军公告 */
//         private setNotice(hp) {
//             let noticeTip = 0;
//             let j;
//             for (j = this.hpLevelArr.length - 1; j >= 0; j--) {
//                 if (hp / this.maxHp <= this.hpLevelArr[j] + 0.02) {//预先公告
//                     noticeTip = 1;
//                     // break;
//                 }
//                 if (hp / this.maxHp <= this.hpLevelArr[j]) {//公告
//                     noticeTip = 2;
//                     // break;
//                 }
//             }
//             if (noticeTip != 0) {
//                 let tipStr;
//                 if (noticeTip == 1 && this.isReadyCall) {//预先公告
//                     this.isCalled = true;
//                     this.isReadyCall = false;
//                     tipStr = "即将召唤守城精英兵";
//                     this.sendNotice(tipStr);
//                     debug("血，即将召唤守城精英兵");
//                     debug("血", noticeTip, ",召唤：", this.isCalled, ",即将召唤", this.isReadyCall, this.hpLevelArr);
//                 } else if (noticeTip == 2 && this.isCalled) {//公告
//                     this.hpLevelArr.splice(j, this.hpLevelArr.length - j);
//                     this.isCalled = false;
//                     this.isReadyCall = true;
//                     tipStr = "召唤大批守城精英兵";
//                     this.sendNotice(tipStr);
//                     debug("血，召唤大批守城精英兵");
//                     debug("血", noticeTip, ",召唤：", this.isCalled, ",即将召唤", this.isReadyCall, this.hpLevelArr);
//                 }
//             }
//         }
//         /**发送战场公告 */
//         private sendNotice(str) {
//             com_main.EventMgr.dispatchEvent(EventEnum.BATTLE_NOTICE_CLIENT, { content: str });
//         }
//         /**设置城池血量上的旗帜状态 */
//         private setFlagState(cityBlood: number, isInit?: boolean) {
//             if (this.flagArray.length != 0) {
//                 for (let i = 0; i < this.flagArray.length; i++) {
//                     // debug("测试:", cityBlood + this.cityBlood_Img.x, ",第" + (i + 1) + "根旗子:", this.flagArray[i].x - 10);
//                 }
//                 for (let i = 0; i < this.flagArray.length; i++) {
//                     if (cityBlood + this.cityBlood_Img.x < this.flagArray[i].x - 10) {
//                         this.flagArray[i].texture = RES.getRes("fight_component_btn1-7-2");
//                         if (isInit) {            //判断是否初始化状态，是的话不抖动
//                             continue;
//                         }
//                         if (this.flagId == i) {
//                             this.flagId--;
//                             // debug("屏幕震动");
//                             // 城池血量低于旗帜，屏幕震动一次
//                             // BattleSceneMgr.getInstance().shakeScreen();
//                             CEffectFunc.shakeAction(AGame.R.app.root, 0, 0);
//                         }
//                     }
//                 }
//             }
//         }
//         private hitCarDamage: number = 0;//撞车伤害
//         private otherArmyDamage: number = 0;//其他兵种伤害
//         private hitCarNum: number = 0;
//         private otherArmyNum: number = 0;
//         private showHitWallMilitary: boolean = false;
//         private showHitWallExp: boolean = false;
//         private lastExp: number = 0;
//         private lastMilitary: number = 0;
//         private addExpMilitary(body, damage) {                     //攻击城墙时的军工经验加成显示
//             if (body.armyMainType == 4) {                          //攻击城池的为撞车时累加伤害
//                 this.hitCarDamage = damage;
//                 this.hitCarNum = 1;
//                 this.otherArmyNum = 0;
//                 // debug("撞车:", damage);
//             } else {                                               //攻击城池的为别的种类时累加别的伤害
//                 this.otherArmyDamage = damage;
//                 this.hitCarNum = 0;
//                 this.otherArmyNum = 1;
//                 // debug("其他车:", damage);
//             }
//             /**经验 */
//             let exp = Exp.hitWallExp(this.otherArmyDamage, this.hitCarDamage);
//             this.hitCarDamage = 0;
//             this.otherArmyDamage = 0;
//             /**军工 */
//             let military = Military.hitWallMilitary(body.armyMainType);
//             if (this.lastExp < ExpModel.getHitWallExp() && this.showHitWallExp) {
//                 this.showHitWallExp = false;
//                 exp = ExpModel.getHitWallExp() - this.lastExp;
//                 this.lastExp = ExpModel.getHitWallExp();
//                 if (Math.floor(exp) > 0) {
//                     CEffectFunc.expMilitaryAction(RES.getRes("font_num_11_fnt"), RES.getRes("battle_exp"), "+" + Math.floor(exp), 300, 180, this);
//                 }
//                 // debug("经验=" + exp + "=" + "城墙总经验" + city.exp + "/城墙总血量" + city.hp + "*(其他兵种1s伤害" + this.otherArmyDamage + "+撞车1s伤害" + this.hitCarDamage + "/X系数" + Number(description.value) + ")*玩家上阵兵团个数" + currentplayerarmyNum + "/总玩家上阵兵团个数" + currentarmyNum + "*等级经验系数" + C.PlayerExpMilitaryConfig[RoleData.level].coefficient);
//             }
//             if (this.lastMilitary < MilitaryModel.getHitWallMilitary() && this.showHitWallMilitary) {
//                 this.showHitWallMilitary = false;
//                 military = MilitaryModel.getHitWallMilitary() - this.lastMilitary;
//                 this.lastMilitary = MilitaryModel.getHitWallMilitary();
//                 if (Math.round(military) > 0) {
//                     CEffectFunc.expMilitaryAction(RES.getRes("font_num_11_fnt"), RES.getRes("battle_military"), "+" + Math.round(military), 500, 180, this);
//                 }
//                 // debug("军工=" + military + "=" + "城墙总军工" + city.military + "/城墙总血量" + city.hp + "*(其他兵种1s伤害" + this.otherArmyDamage + "+撞车1s伤害" + this.hitCarDamage + "/X系数" + Number(description.value) + ")*玩家上阵兵团个数" + currentplayerarmyNum + "/总玩家上阵兵团个数" + currentarmyNum);
//             }
//         }
//         public onDestroy(): void {
//             super.onDestroy();
//             this.destroyEvent();
//         }
//         private destroyEvent() {
//             EventManager.removeEventListeners(this);
//             Utils.TimerManager.remove(this.onTimerFrame, this);
//             EventMgr.removeEventByObject(UnitNav.ATTR_BBUILD_HP, this.updateCityBloodData);
//         }
//     }
// }
