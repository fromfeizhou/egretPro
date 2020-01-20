// module com_main {
//     export class GuideMainCityBattleThreeAction extends GuideBattleBaseAction {
//         public constructor(data: any) {
//             super(data)
//         }
//         protected init() {
//             super.init();
//             this.cfg = GuideModel.getMainCityBattleThreeConfig();
//             this.m_map.moveTo(1272, 617, false);
//             this.pusStepCallback(this.firstStepByTalk, this);
//            let timeOutId = egret.setTimeout(() => {
//                 this.onBegin();
//             }, this, 500);
//             this.pushTimeOutId(timeOutId);
//         }
//         private onBegin() {
//             this.getUnit(GuideBattleRoleId.MainSoldier_5).setSoldierVisible(2, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_5).setSoldierVisible(1, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_5).setSoldierVisible(6, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_5).setSoldierVisible(5, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_6).setSoldierVisible(2, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_6).setSoldierVisible(1, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_6).setSoldierVisible(6, false);
//             this.getUnit(GuideBattleRoleId.MainSoldier_6).setSoldierVisible(5, false);
//             let timeOutId = egret.setTimeout(() => {
//                 this.play();
//             }, this, 1000);
//             this.pushTimeOutId(timeOutId);
//         }
//         private firstStepByTalk() {
//             this.csQuareTalk(GuideBattleRoleId.MainSoldier_2, "感谢英雄相救，我们一致推举您做我们的城主", 1000, 2000);
//             this.csQuareTalk(GuideBattleRoleId.MainSoldier_3, "还请恩公万万不能推迟", 3000, 2000);
//             let timeOutId = egret.setTimeout(() => {
//                 this.findPathPos(GuideBattleRoleId.MainSoldier_2, new Point(1504, 614), null, () => {
//                     this.getUnit(GuideBattleRoleId.MainSoldier_2).changeDirection(CSquare_Direction.LEFT_DOWN);
//                     new GuideRoleMoveer(GuideBattleRoleId.Main, [new Point(1472, 652), new Point(1548, 616), new Point(1610, 555)], () => {
//                         this.getUnit(GuideBattleRoleId.Main).changeDirection(CSquare_Direction.LEFT_DOWN);
//                         this.onMainRoleTalk();
//                     });
//                 });
//             }, this, 6000);
//             this.pushTimeOutId(timeOutId);
//         }
//         private onMainRoleTalk() {
//             this.csQuareTalk(GuideBattleRoleId.Main, "恭敬不如从命，今后请大家与我一起平定乱世!", this.m_pDelayTimeUnti);
//             let timeOutId = egret.setTimeout(() => {
//                 let param = {
//                     isShow: true, time: 2000, callback: () => {
//                         this.play();
//                     }
//                 };
//                 Utils.open_view(TASK_UI.GUIDE_GRADIENT_VIEW, param);
//             }, this, this.m_pTalkShowTime * 4);
//             this.pushTimeOutId(timeOutId);
//         }
//         //步骤结束
//         protected onStepEnd() {
//             SceneManager.enterScene(SceneEnums.MAIN_CITY);
//         }
//     }
// }
