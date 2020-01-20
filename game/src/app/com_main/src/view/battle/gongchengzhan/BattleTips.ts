// module com_main {

//     /**
//      * 战场弹出提示
//      * @export
//      * @class BattleTips
//      * @extends CComponent
//      */
//     export class BattleTips extends CComponent {

//         protected m_pBg:eui.Image;
//         protected m_pLbContent:com_main.CLabel;

//         protected m_nType: number = -1;
//         protected m_nStartDt: number = 0;
    
//         public constructor() {
//             super();
//             this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/BattleTips.exml");
//             this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.m_pLbContent.text = "你的部队已阵亡，5秒后将切换至下一部队。";
//             this.$resetWidth();
//         }
        
//         public onDestroy() {
//             EventManager.removeEventListeners(this);
//             Utils.TimerManager.remove(this.$update, this);
// 			super.onDestroy();
//         }
        
//         public setType(type: number) {
//             this.m_nType = type;
//             this.visible = true;
//             let txt = ""
//             if (this.m_nType == 1) {
//                 txt = "你的部队已阵亡，5秒后将切换至下一部队。";
//             } else if (this.m_nType == 2) {
//                 txt = "你的部队已战败，可重新派遣部队前来战斗！"
//             } else if (this.m_nType == 3) {
//                 txt = "你观看的部队已阵亡，可选择其他部队或自己部队进行观看。";
//             }
//             this.m_pLbContent.text = txt;
//             this.$resetWidth();
//             this.m_nStartDt = TimerUtils.getServerTimeMill();
//         }

//         public hide() {
//             this.visible = false;
//             this.m_nStartDt = 0;
//         }

//         protected $resetWidth() {
//             this.width = this.m_pLbContent.width + 100;
//         }


//         public checkBattle(playerid, cid, curBattleId) {
//             if (this.m_nStartDt == 0) return;
//             let dt = TimerUtils.getServerTimeMill() - this.m_nStartDt;
//             if (dt > 5000) {
//                 this.startBattle(playerid, cid, curBattleId)
//             } else {
//                 Utils.TimerManager.doTimer(5000 - dt, 1, this.$update, this, ()=> {
//                     this.startBattle(playerid, cid, curBattleId)
//                 })
//             }
//         }

//         protected $update() {

//         }

//         private startBattle(playerid, cid, curBattleId) {
//             // let nextSiege = WorldModel.getNextSiege(playerid, cid, curBattleId);

//             // if (!nextSiege) {
//             //     let [nSiege, _] = WorldModel.getSiegeAll(cid, curBattleId);
//             //     nextSiege = nSiege;

//             // }

//             // if(nextSiege){
//             //     SceneManager.enterScene(SceneEnums.BATTLE_MAP, nextSiege,false);
//             // }
//         }

//     }

// }