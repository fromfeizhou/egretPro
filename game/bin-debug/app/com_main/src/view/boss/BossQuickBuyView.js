// module com_main {
//     export class BossQuickBuyView extends CView {
//         public static NAME = "BossQuickBuyView";
//         public m_APopUp: com_main.APopUp;
//         public m_itemMax: com_main.CLabel;
//         public m_itemName: com_main.CLabel;
//         public m_buyCount: com_main.CLabel;
//         public m_description: com_main.CLabel;
//         public m_itemView: com_main.ComItemNew;
//         public m_btnBuy: com_main.ComCostButton;
//         public m_btnBuy1: com_main.ComCostTextButton;
//         // private m_callback: any; //回调函数
//         // private m_thisObj: any;  //回调对象
//         private m_sAwards: string;   //购买的物品
//         private m_quickBuyId: number;   //购买的物品id
//         private m_costNum: number;   //使用道具消耗数量
//         private m_pitemMax: number;   //拥有的物品数量
//         private m_bossId: number;   //bossID
//         private m_bossType: number;   //1个人 2排名 3世界
//         private m_needCoin: number;       //个人消耗金币
//         private m_rewardCfg: IItemInfo;        //常量配置个人消耗令牌
//         private m_maxBuyCountCfg: string;             //常量配置boss最多购买次数(个人，排名，世界)
//         private m_btnState: number;          //按钮状态，0 为使用道具，1为购买
//         public constructor(param: any) {
//             super();
//             this.name = BossQuickBuyView.NAME;
//             this.m_sAwards = param.awards;
//             this.m_bossId = param.bossid;
//             this.m_bossType = param.type;
//             this.m_rewardCfg = Utils.parseCommonItemJson(this.m_sAwards)[0];
//             this.m_costNum = this.m_rewardCfg.count;
//             this.m_quickBuyId = this.m_rewardCfg.itemId;
//             this.initApp("boss/BossQuickBuyViewSkin.exml");
//         }
//         protected listenerProtoNotifications(): any[] {
//             return [
//                 ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT,
//                 ProtoDef.S2C_CLEAR_BOSS,
//             ];
//         }
//         /**处理协议号事件 */
//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             switch (protocol) {
//                 case ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT: {//购买返回
//                     this.setBuyCount();
//                     break;
//                 }
//                 case ProtoDef.S2C_CLEAR_BOSS: {//返回扫荡信息
//                     this.setBuyCount();
//                     break;
//                 }
//             }
//         }
//         public onDestroy(): void {
//             super.onDestroy();
//         }
//         protected childrenCreated() {
//             super.childrenCreated();
//             let itemInfo: IItemInfo;
//             switch (this.m_bossType) {
//                 case BossEnum.Single:
//                     itemInfo = ConstUtil.getItems(IConstEnum.PERSONAL_BOSS_CONSUME_GOLD)[0];
//                     this.m_maxBuyCountCfg = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).maxBuyAmountCount + '';
//                     break;
//                 case BossEnum.Rank:
//                     itemInfo = ConstUtil.getItems(IConstEnum.RANKING_BOSS_CONSUME_GOLD)[0];
//                     if (ConstUtil.getString(IConstEnum.RANKING_BOSS_BUY_COUNT) != '') {
//                         this.m_maxBuyCountCfg = Utils.JsonParseWrap(ConstUtil.getString(IConstEnum.RANKING_BOSS_BUY_COUNT));
//                     }
//                     break;
//                 case BossEnum.World:
//                     itemInfo = ConstUtil.getItems(IConstEnum.WORLD_BOSS_CONSUME_GOLD)[0];
//                     if (ConstUtil.getString(IConstEnum.WORLD_BOSS_BUY_COUNT) != '') {
//                         this.m_maxBuyCountCfg = Utils.JsonParseWrap(ConstUtil.getString(IConstEnum.WORLD_BOSS_BUY_COUNT));
//                     }
//                     break;
//             }
//             this.m_needCoin = itemInfo.count;
//             this.m_APopUp.setTitleLabel(GCode(CLEnum.HAN_BOS_BUY));
//             EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnBuyHandler);
//             EventManager.addTouchScaleListener(this.m_btnBuy1, this, this.onBtnBuyHandler);
//             this.reFresh();
//             this.setBuyCount();
//         }
//         /**刷新面板 */
//         private reFresh() {
//             this.m_itemView.setItemInfo(this.m_quickBuyId, 0);
//             Utils.setPropLabName(this.m_quickBuyId, this.m_itemName);
//             let cfg = PropModel.getCfg(this.m_quickBuyId);
//             if (cfg) {
//                 this.m_description.text = GLan(cfg.description);
//             }
//         }
//         /**刷新购买次数 */
//         private setBuyCount() {
//             let buyCount: number;//购买次数
//             let conNum = RoleData.GetMaterialNumById(PropEnum.GOLD);
//             if (this.m_bossType == BossEnum.Rank) {//排名购买次数
//                 buyCount = NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS).reBuyAmountCount;
//             } else if (this.m_bossType == BossEnum.World) {//世界购买次数
//                 buyCount = NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS).reBuyAmountCount;
//             } else {//个人购买次数
//                 // let personalBossInfo = BossModel.getSingleItemInfo(this.m_bossId);
//                 buyCount = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reBuyAmountCount;
//             }
//             this.m_btnBuy.visible = false;
//             this.m_btnBuy1.visible = false;
//             this.m_buyCount.text = buyCount + "/" + this.m_maxBuyCountCfg;
//             this.m_pitemMax = PropModel.getPropNum(this.m_rewardCfg.itemId);
//             this.m_itemMax.text = GCodeFromat(CLEnum.PIECE, this.m_pitemMax);
//             if (this.m_bossType == BossEnum.Rank && buyCount > 0) {
//                 this.m_btnBuy.currentState = "style3";
//                 this.m_btnBuy.setCostImg('');
//                 this.m_btnBuy.setCostLabel(GCode(CLEnum.BUY_FREE));
//                 this.m_btnBuy.visible = true;
//                 this.m_btnState = BtnQuickState.BUYCOUNT;
//                 return;
//             }
//             if (this.m_pitemMax == 0) {
//                 this.m_btnBuy1.currentState = "size3";
//                 this.m_btnBuy1.setCostImg(PropModel.getPropIcon(PropEnum.GOLD));
//                 this.m_btnBuy1.setCostLabel(`${this.m_needCoin}`);
//                 this.m_btnBuy1.setTitleLabel(GCode(CLEnum.BUY_NOW))
//                 this.m_btnBuy1.visible = true;
//             } else {
//                 this.m_btnBuy.currentState = "style3";
//                 this.m_btnBuy.setCostImg('');
//                 this.m_btnBuy.setCostLabel(GCode(CLEnum.USE_ITEM));
//                 this.m_btnBuy.visible = true;
//             }
//             this.m_btnState = this.m_pitemMax <= 0 ? 1 : 0;
//         }
//         /**按钮挑战处理 */
//         private onBtnBuyHandler() {
//             switch (this.m_btnState) {
//                 case BtnQuickState.USEPROPS: {
//                     this.useProps();//使用道具挑战
//                     break;
//                 }
//                 case BtnQuickState.BUYCOUNT: {
//                     this.buyCount();//购买次数
//                     break;
//                 }
//             }
//         }
//         /**购买挑战次数 */
//         private buyCount() {
//             let str = RoleData.getTipsisbeyond(PropEnum.GOLD, Number(this.m_needCoin));
//             if (!PropModel.isItemEnough(PropEnum.GOLD, this.m_needCoin, 3, str)) {
//                 return;
//             }
//             switch (this.m_bossType) {
//                 case BossEnum.Single: {
//                     let maxCount = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).maxBuyAmountCount;
//                     let canCount = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reBuyAmountCount;
//                     if (canCount > 0) {
//                         BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_bossType);
//                     } else {
//                         EffectUtils.showTips(GCode(CLEnum.BOSS_BUY_FAL), 1, true);
//                     }
//                     break;
//                 }
//                 case BossEnum.Rank: {
//                     let info = NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
//                     if (info.reBuyAmountCount > 0) {
//                         BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_bossType);
//                     } else {
//                         EffectUtils.showTips(GCode(CLEnum.BOSS_BUY_FAL), 1, true);
//                     }
//                     break;
//                 }
//                 case BossEnum.World: {
//                     let info = NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
//                     if (info.reBuyAmountCount > 0) {
//                         BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_bossType);
//                     } else {
//                         EffectUtils.showTips(GCode(CLEnum.BOSS_BUY_FAL), 1, true);
//                     }
//                     break;
//                 }
//             }
//         }
//         /**使用道具挑战 */
//         private useProps() {
//             // let m_rankMax = Utils.JsonParseWrap(ConstUtil.getString(IConstEnum.RANKING_BOSS_CHALLENGE_COUNT));
//             // let m_worldMax = Utils.JsonParseWrap(ConstUtil.getString(IConstEnum.WORLD_BOSS_CHALLENGE_COUNT));
//             if (this.m_pitemMax == 0) return;
//             switch (this.m_bossType) {
//                 case BossEnum.Single:{
//                      let info = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS);
//                     if (info.reCount > 0 ) {
//                         PropProxy.send_BACKPACK_USE_ITEM(this.m_quickBuyId, this.m_costNum);
//                         BossProxy.C2S_CLEAR_BOSS(this.m_bossId, this.m_quickBuyId);
//                     }else{
//                         EffectUtils.showTips(GCode(CLEnum.BOSS_FIGHT_FULL), 1, true);
//                     }
//                     break;
//                 }
//                 // case BossEnum.Rank:{
//                 //     let info = NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
//                 //     if (info.reCount > 0 ) {
//                 //         BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_bossType);
//                 //     }else{
//                 //         EffectUtils.showTips(GCode(CLEnum.BOSS_FIGHT_FULL), 1, true);
//                 //     }
//                 //     break;
//                 // }
//                 // case BossEnum.World:{
//                 //     let info = NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
//                 //     if (info.reCount > 0) {
//                 //         BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_bossType);
//                 //     }else{
//                 //         EffectUtils.showTips(GCode(CLEnum.BOSS_FIGHT_FULL), 1, true);
//                 //     }
//                 //     break;
//                 // }
//             }
//         }
//     }
// }
