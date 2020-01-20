// module com_main {
//     export class MilitaryExpFlag extends CView {
//         public expGroup: eui.Group;
//         public experience_Img: com_main.CImage;
//         public expGold_Img: com_main.CImage;
//         public expPrice_Label: eui.Label;
//         public expTime_Label: eui.Label;
//         public expLabel: eui.Label;
//         public militaryGroup: eui.Group;
//         public military_Img: com_main.CImage;
//         public militaryGold_Img: com_main.CImage;
//         public militaryPrice_Label: eui.Label;
//         public militaryLabel: eui.Label;
//         public militaryTime_Label: eui.Label;

//         ////////////////////////军工旗或经验旗倒计时（秒）//////////////////////////
//         private expCd: number;
//         private militaryCd: number;
//         private expTecCd: number = 0;
//         private militaryTecCd: number = 0;
//         private expId: number;
//         private militaryId: number;
//         private showMilitaryBuff: boolean = false;
//         private showExpBuff: boolean = false;
//         private expKill: number = 0;
//         private militaryKill: number = 0;
//         private isExpOver: boolean = true;
//         private isMilitaryOver: boolean = true;
//         private isInitBuffPrice: boolean = false;
//         private isExpFree: boolean = false;
//         private isMilitaryFree: boolean = false;

//         private militaryForBuy: number = 0;
//         private expForBuy: number = 0;
//         private expFlagBaseExp: number = 0;//经验旗基础经验
//         private expFlagConversionRate: number = 0;//经验旗转换率
//         private militaryFlagBaseMilitary: number = 0;//军功旗基础经验
//         private militaryFlagConversionRate: number = 0;//军功旗转换率

//         public constructor() {
//             super();
//             this.initApp("battle_/top/battle_top_MilitaryExpFlag.exml");
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.anchorOffsetY = this.height / 2;
//             this.y = 400;
//             this.x = 0;
//             this.initAll();

//             // let config = C.TechnologyEffectConfig;
//             // for (let id in config) {
//             //     if (config[id].level == TechnologyModel.BEGIN_TECH_LEVEL) {
//             //         if (config[id].tid == 51) { //经验旗倒计时增加时间
//             //             let isActive = TechnologyModel.isActived(51);
//             //             if (isActive) {
//             //                 this.expTecCd = Number(config[id].effect);
//             //             }
//             //         } else if (config[id].tid == 52) { //军工旗倒计时增加时间
//             //             let isActive_ = TechnologyModel.isActived(52);
//             //             if (isActive_) {
//             //                 this.militaryTecCd = Number(config[id].effect);
//             //             }
//             //         }
//             //     }
//             // }
//         }

//         private initAll() {
//             this.initConfig();
//             this.initBuffPrice();
//             this.initEvent();

//             if (!FunctionModel.isFunctionOpen(FunctionType.FT_MILITARY_FLAG)) {
//                 this.militaryGroup.visible = false;
//             }
//             if (!FunctionModel.isFunctionOpen(FunctionType.FT_EXP_FLAG)) {
//                 this.expGroup.visible = false;
//             }
//         }

//         private initConfig() {
//             /**配置攻击敌人武将时的军工经验公式常量 */
//             let levelConfig = C.PlayerExpMilitaryConfig[RoleData.level];
//             if (levelConfig) {
//                 this.expFlagBaseExp = levelConfig.expFlagBaseExp;
//                 this.expFlagConversionRate = levelConfig.expFlagConversionRate;
//                 this.militaryFlagBaseMilitary = levelConfig.militaryFlagBaseMilitary;
//                 this.militaryFlagConversionRate = levelConfig.militaryFlagConversionRate;
//             } else {
//                 // error("经验军工等级读取不到配置表，使用默认值");
//                 this.expFlagBaseExp = 20000;
//                 this.expFlagConversionRate = 10;
//                 this.militaryFlagBaseMilitary = 2000;
//                 this.militaryFlagConversionRate = 1;
//             }
//         }

//         /**初始化军工经验旗buff的价格 */
//         private initBuffPrice() {
//             if (this.expGroup && this.militaryGroup) {
//                 if (!this.isInitBuffPrice) {
//                     if (BattleModel.getCityBattleExpMilitaryFlag()) {
//                         this.isInitBuffPrice = true;
//                         let body = BattleModel.getCityBattleExpMilitaryFlag();
//                         for (let i = 0; i < body.length; i++) {
//                             if (body[i] && C.BattleBuffConfig[body[i].id]) {
//                                 if (C.BattleBuffConfig[body[i].id] && C.BattleBuffConfig[body[i].id].type == BattleBuff.ExpBuff) {
//                                     this.expPrice_Label.text = body[i].cost + "";//初始化经验旗buff价格
//                                     this.expId = body[i].id;
//                                 }
//                                 if (C.BattleBuffConfig[body[i].id].type == BattleBuff.MilitaryBuff) {
//                                     this.militaryPrice_Label.text = body[i].cost + ""; // 初始化军工旗buff价格
//                                     this.militaryId = body[i].id;
//                                 }
//                             }
//                             else {
//                                 debug("读取配置表初始化军工经验旗id失败");
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         private initEvent() {
//             // Utils.TimerManager.doTimer(1000, 0, this.onTimerFrame, this);
//             EventMgr.addEvent(UnitNav.SQUARE_REMOVE, this.onUnitDie, this);
//             EventManager.addTouchScaleListener(this.experience_Img, this, this.experienceClick);
//             EventManager.addTouchScaleListener(this.military_Img, this, this.militaryClick);
//             EventMgr.addEvent(EventEnum.CITY_BATTLE_BUY_BATTLE_BUFF, this.respBuyBuff, this); //点击购买buff加成后响应
//             EventMgr.addEvent(EventEnum.CITY_BATTLE_EXP_MILITARY_FLAG_END, this.respExpMilitary, this);  //倒计时结束后响应下一次军工经验旗信息
//         }

//         private onUnitDie(unit: UnitInfoVo) {
//             // 单位方阵id
//             if (unit) {
//                 // let info = BattleModel.getUnit(unit.id);
//                 let info = unit;
//                 if (info) {
//                     /** 阵营 (0:进攻方,1:防守方) */
//                     if (info.faction == FactionType.DEF) {		//防守方
//                         if (this.expTime_Label.visible) {
//                             this.expKill++;
//                         }
//                         if (this.militaryTime_Label.visible) {
//                             this.militaryKill++;
//                         }
//                         if (this.showExpBuff) {
//                             this.showExpBuff = false;
//                             // this.expForBuy = this.expFlagBaseExp + this.expKill * this.expFlagConversionRate;
//                             this.expForBuy = Exp.flagExp(this.expKill);
//                             this.expLabel.text = Math.floor(this.expForBuy) + "";
//                             egret.Tween.get(this.expLabel).to({ scaleX: 1.3, scaleY: 1.3 }, 20).to({ scaleX: 1, scaleY: 1 }, 250).call(() => {
//                                 if (this.expTime_Label.visible) {
//                                     this.showExpBuff = true;
//                                 }
//                             });
//                             this.showExpBuff = false;
//                         }
//                         if (this.showMilitaryBuff) {
//                             this.showMilitaryBuff = false;
//                             // this.militaryForBuy = this.militaryFlagBaseMilitary + this.militaryKill * this.militaryFlagConversionRate;
//                             this.militaryForBuy = Military.flagMilitary(this.militaryKill);
//                             this.militaryLabel.text = Math.floor(this.militaryForBuy) + "";
//                             egret.Tween.get(this.militaryLabel).to({ scaleX: 1.3, scaleY: 1.3 }, 20).to({ scaleX: 1, scaleY: 1 }, 250).call(() => {
//                                 if (this.militaryTime_Label.visible) {
//                                     this.showMilitaryBuff = true;
//                                 }
//                             });
//                         }
//                     }
//                 } else {
//                     debug("读不到死亡方阵");
//                 }
//             }
//         }


//         //经验点击
//         private experienceClick(evt: egret.Event) {
//             if (this.isExpOver) {
//                 this.isExpOver = false;
//                 let effect: string;
//                 let price: number;
//                 let buff = C.BattleBuffConfig[this.expId];
//                 if (buff) {
//                     effect = GLan(buff.name);
//                     let strs = effect.split("，");
//                     if (strs.length > 0) {
//                         effect = "";
//                     }
//                     for (let i = 0; i < strs.length; i++) {
//                         effect = effect + strs[i] + "\n";
//                     }
//                     if (this.isExpFree) {
//                         price = 0;
//                     } else {
//                         price = buff.price;
//                     }
//                 }
//                 let view = new com_main.ConfirmPop("消耗" + price + "元宝" + effect,null,null,
//                     () => {
//                         // this.expTime_Label.visible = true;
//                         // this.expLabel.visible = true;
//                         // this.experience_Img.touchEnabled = false;
//                         BattleProxy.send_CITY_BATTLE_BUY_BATTLE_BUFF(this.expId);
//                     },
//                     () => {
//                         this.isExpOver = true;
//                     }, this);
//                 UpManager.popSmallView(view, null, false);
//                 UpManager.mask(true, 0);
//             } else {
//                 if (this.expLabel && this.expLabel.visible) {
//                     this.isExpOver = true;
//                     this.expGold_Img.visible = true;
//                     this.expPrice_Label.visible = true;
//                     this.expLabel.visible = false;

//                     this.expKill = 0;//清空数据
//                     this.expLabel.text = 0 + "";
//                     EffectUtils.showTips(GLan(500062) + Math.floor(this.expForBuy));
//                     // MessageTip.AddMessageInfo("恭喜成功领取经验" + this.expForBuy);
//                     this.expForBuy = 0;
//                     Exp.isRecExpFlag = true;
//                 } else {
//                     this.isExpOver = true;
//                     this.experienceClick(null);
//                 }
//             }
//         }

//         //军工点击
//         private militaryClick(evt: egret.Event) {
//             if (this.isMilitaryOver) {
//                 this.isMilitaryOver = false;
//                 let effect: string;
//                 let price: number;
//                 let buff = C.BattleBuffConfig[this.militaryId];
//                 if (buff) {
//                     effect = GLan(buff.name);
//                     if (this.isMilitaryFree) {
//                         price = 0;
//                     } else {
//                         price = buff.price;
//                     }
//                 }
//                 let view = new com_main.ConfirmPop("消耗" + price + "元宝" + effect,null,null, () => {
//                     BattleProxy.send_CITY_BATTLE_BUY_BATTLE_BUFF(this.militaryId);
//                 }, () => {
//                     this.isMilitaryOver = true;
//                 }, this);
//                 UpManager.popSmallView(view, null, false);
//                 UpManager.mask(true, 0);
//             }
//             else {
//                 if (this.militaryLabel && this.militaryLabel.visible) {
//                     this.isMilitaryOver = true;
//                     this.militaryGold_Img.visible = true;
//                     this.militaryPrice_Label.visible = true;
//                     this.militaryLabel.visible = false;

//                     this.militaryKill = 0;//清空数据
//                     this.militaryLabel.text = 0 + "";
//                     EffectUtils.showTips(GLan(500063) + Math.floor(this.militaryForBuy));
//                     // MessageTip.AddMessageInfo("恭喜成功领取军功" + this.militaryForBuy);
//                     this.militaryForBuy = 0;
//                     Military.isRecMilitaryFlag = true;
//                 } else {
//                     this.isMilitaryOver = true;
//                     this.militaryClick(null);
//                 }
//             }
//         }

//         //经验倒计时
//         private onExpTick() {
//             if (this.expTime_Label) {
//                 if (this.expTime_Label.visible) { //开启经验倒计时
//                     this.expGold_Img.visible = false;
//                     this.expPrice_Label.visible = false;
//                     if (this.expCd > 0) {
//                         this.showExpBuff = true;
//                         this.expCd--;
//                         this.expTime_Label.text = Utils.DateUtils.getFormatBySecond(this.expCd, 3);//将倒计时格式化
//                     } else {  //倒计时结束
//                         Utils.TimerManager.remove(this.onExpTick, this);
//                         this.expTime_Label.visible = false;
//                         BattleProxy.send_CITY_BATTLE_EXP_MILITARY_FLAG_END(this.expId);//请求下一次经验旗信息
//                     }
//                 }
//             }
//         }

//         //军工倒计时
//         private onMilitaryTick() {
//             if (this.militaryTime_Label) {
//                 if (this.militaryTime_Label.visible) { 	//开启军工倒计时
//                     this.militaryGold_Img.visible = false;
//                     this.militaryPrice_Label.visible = false;
//                     if (this.militaryCd > 0) {
//                         this.showMilitaryBuff = true;
//                         this.militaryCd--;
//                         this.militaryTime_Label.text = Utils.DateUtils.getFormatBySecond(this.militaryCd, 3);//将倒计时格式化
//                     } else {  //倒计时结束
//                         Utils.TimerManager.remove(this.onMilitaryTick, this);
//                         this.militaryTime_Label.visible = false;
//                         BattleProxy.send_CITY_BATTLE_EXP_MILITARY_FLAG_END(this.militaryId);//请求下一次军工旗信息
//                     }
//                 }
//             }
//         }

//         /**军工经验旗倒计时完响应 */
//         private respExpMilitary(body) {
//             // error("军工经验旗：", body);
//             if (body && body.id) {
//                 let buff = C.BattleBuffConfig[body.id];
//                 if (buff) {
//                     if (buff.type == BattleBuff.ExpBuff) {  //响应结束经验旗
//                         this.expId = body.id;
//                         this.expPrice_Label.text = body.cost + "";
//                         if (body.cost == 0) {
//                             // error("经验倒计时完，响应下次免费");
//                             this.isExpFree = true;
//                         } else {
//                             // error("经验倒计时完，响应下次需要" + body.cost);
//                             this.isExpFree = false;
//                         }
//                         // this.expTime_Label.visible = false;
//                         this.experience_Img.touchEnabled = true;
//                     }
//                     if (buff.type == BattleBuff.MilitaryBuff) {//响应结束军工旗
//                         this.militaryId = body.id;
//                         this.militaryPrice_Label.text = body.cost + "";
//                         if (body.cost == 0) {
//                             // error("军工倒计时完响应，下次免费");
//                             this.isMilitaryFree = true;
//                         } else {
//                             // error("军工倒计时完响应，下次需要" + body.cost);
//                             this.isMilitaryFree = false;
//                         }

//                         // this.militaryTime_Label.visible = false;
//                         this.military_Img.touchEnabled = true;
//                     }
//                 }
//             }
//         }

//         /**接收响应购买军工经验旗返回数据 */
//         private respBuyBuff(body) {
//             if (body) {
//                 //zb
//                 // let endTime = (<Long>body.time).toNumber();
//                 let endTime = body.time;
//                 let serverTime = TimerUtils.getServerTimeMill();
//                 let time = Math.round((endTime - serverTime) / 1000);
//                 let buff = C.BattleBuffConfig[body.id];
//                 if (buff) {
//                     if (buff.type == BattleBuff.ExpBuff) {      //显示经验倒计时
//                         // this.expCd = buff.time / 1000;		    //1对应配置表经验
//                         this.expCd = time;
//                         this.expTime_Label.visible = true;
//                         this.expLabel.visible = true;
//                         this.experience_Img.touchEnabled = false;
//                         this.expLabel.text = this.expFlagBaseExp + "";
//                         this.expForBuy = Exp.flagExp(0);
//                         // error("响应经验购买，开始显示倒计时" + this.expCd);
//                         Utils.TimerManager.doTimer(1000, 0, this.onExpTick, this);
//                     }
//                     if (buff.type == BattleBuff.MilitaryBuff) { //显示军工倒计时
//                         // this.militaryCd = buff.time / 1000;		//2对应配置表军工
//                         this.militaryCd = time;
//                         this.militaryLabel.visible = true;
//                         this.militaryTime_Label.visible = true;
//                         this.military_Img.touchEnabled = false;
//                         this.militaryLabel.text = Math.floor(this.militaryFlagBaseMilitary * Military.getRate()) + "";
//                         this.militaryForBuy = Military.flagMilitary(0);
//                         // error("响应军工购买，开始显示倒计时" + this.militaryCd);
//                         Utils.TimerManager.doTimer(1000, 0, this.onMilitaryTick, this);
//                     }
//                 }
//             }
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             this.destroyEvent();
//         }

//         private destroyEvent() {
//             EventManager.removeEventListeners(this);
//             Utils.TimerManager.remove(this.onExpTick, this);
//             Utils.TimerManager.remove(this.onMilitaryTick, this);
//             EventMgr.removeEventByObject(UnitNav.SQUARE_REMOVE, this.onUnitDie);
//             EventMgr.removeEventByObject(EventEnum.CITY_BATTLE_BUY_BATTLE_BUFF, this.respBuyBuff);
//             EventMgr.removeEventByObject(EventEnum.CITY_BATTLE_EXP_MILITARY_FLAG_END, this.respExpMilitary);
//         }
//     }
// }