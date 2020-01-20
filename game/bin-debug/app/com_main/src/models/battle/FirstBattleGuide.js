var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var FirstBattleGuide = /** @class */ (function (_super_1) {
        __extends(FirstBattleGuide, _super_1);
        function FirstBattleGuide() {
            var _this = _super_1.call(this) || this;
            _this.step = -1;
            _this.callbackObj = null;
            return _this;
        }
        FirstBattleGuide.prototype.start = function () {
            this.step = 0;
            Utils.TimerManager.doTimer(5000, 1, this.guideSetp1, this);
            var obj = SceneManager.getClass(LayerEnums.MENU, com_main.BattleView.NAME);
            if (obj) {
                obj.visible = false;
            }
        };
        FirstBattleGuide.prototype.checkStep = function () {
            if (this.step == 1) {
                this.guideSetp2();
                return true;
            }
            else if (this.step == 2) {
                this.guideSetp3();
                return true;
            }
            return false;
        };
        //步骤1
        FirstBattleGuide.prototype.guideSetp1 = function () {
            this.squareList = [];
            //左边英雄
            var square1 = com_main.CSquare.createId(1012, true, true);
            square1.changeStatus(CSquare_Status.STATUS_STAND);
            square1.changeDirection(CSquare_Direction.RIGHT_UP);
            square1.setXY(633, 1066);
            com_main.BattleSceneMgr.getInstance().addChildToEffect(square1);
            Tween.get(square1)
                .wait(1000)
                .call(function () { square1.changeStatus(CSquare_Status.STATUS_WALK); })
                .to({ x: 869, y: 915 }, 3000)
                .call(function () { square1.changeStatus(CSquare_Status.STATUS_STAND); });
            this.squareList[1] = square1;
            //右边英雄
            var square2 = com_main.CSquare.createId(1018, true, true);
            square2.changeStatus(CSquare_Status.STATUS_STAND);
            square2.changeDirection(CSquare_Direction.LEFT_DOWN);
            square2.setXY(1127, 756);
            com_main.BattleSceneMgr.getInstance().addChildToEffect(square2);
            Tween.get(square2)
                .wait(1000)
                .call(function () { square2.changeStatus(CSquare_Status.STATUS_WALK); })
                .to({ x: 926, y: 876 }, 3000)
                // .call(()=>{ square2.changeStatus(CSquare_Status.STATUS_STAND);
                //             this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"我奉诏领兵讨伐，应将你们屠戮殆尽。|但念你们本是我大汉子民，也是为世道所迫。|放下兵器开城受降，我可免你们一死。"}',
                //                         '{"isBone":1,"state":"right","heroId":1046,"dialog":"苍天已死黄天当立，我们才是顺天应命。|我看将军尚良心未泯，或早日皈依我太平道可免杀身之祸。"}',
                //                         '{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"那战场上见……"}'
                //             ],this.guideSetp2)});
                .call(function () {
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GUIDE_WAR_PROCESS);
            });
            this.squareList[2] = square2;
            this.step = 1;
        };
        //步骤2
        FirstBattleGuide.prototype.guideSetp2 = function () {
            var _this = this;
            var square1 = this.squareList[1];
            Tween.get(square1)
                .wait(1000)
                .call(function () {
                square1.changeStatus(CSquare_Status.STATUS_WALK);
                square1.changeDirection(CSquare_Direction.LEFT_DOWN);
            })
                .to({ x: 633, y: 1066 }, 3000)
                // .call(()=>{square1.changeStatus(CSquare_Status.STATUS_STAND);
                // 		   square1.changeDirection(CSquare_Direction.RIGHT_UP);
                //             this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"今日一战免不了了，都去准备一下吧。"}',
                //                         '{"isBone":1,"state":"right","heroId":1016,"dialog":"将军宅心忠厚本可免去刀兵之灾。可怜我大汉百姓了……"}',
                //                         '{"isBone":1,"state":"right","heroId":1009,"dialog":"没必要为了这些人而不快嘛。"}',
                //             ],this.guideSetp3)});
                .call(function () {
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GUIDE_WAR_PROCESS);
            });
            var square2 = this.squareList[2];
            Tween.get(square2)
                .wait(1000)
                .call(function () {
                square2.changeStatus(CSquare_Status.STATUS_WALK);
                square2.changeDirection(CSquare_Direction.RIGHT_UP);
            })
                .to({ x: 1127, y: 756 }, 3000)
                .call(function () {
                square2.onDestroy();
                Utils.removeFromParent(square2);
                _this.squareList[2] = null;
            });
            this.step = 2;
        };
        FirstBattleGuide.prototype.showDialog = function (dialogList) {
            BattleModel.setIsStopPlay(true);
            this.dialog(dialogList, function () { BattleModel.setIsStopPlay(false); });
        };
        FirstBattleGuide.prototype.dialog = function (content, callback, callbackObj) {
            this.dialogContent = content;
            this.dialogNum = 0;
            this.dialogCallback = callback;
            this.callbackObj = callbackObj;
            this.dialogNext();
        };
        FirstBattleGuide.prototype.dialogNext = function () {
            if (this.dialogContent[this.dialogNum]) {
                Utils.open_view(TASK_UI.GUIDE_DIALOG_VIEW, this.getDialogParam(this.dialogContent[this.dialogNum], this.dialogNext));
                this.dialogNum += 1;
            }
            else {
                if (this.callbackObj) {
                    this.dialogCallback.apply(this.callbackObj);
                }
                else {
                    this.dialogCallback();
                }
            }
        };
        //步骤3
        FirstBattleGuide.prototype.guideSetp3 = function () {
            var _this = this;
            var square1 = this.squareList[1];
            Tween.get(square1).to({ alpha: 0 }, 1000)
                .call(function () {
                Utils.removeFromParent(square1);
                _this.squareList[1] = null;
            });
            // BattleProxy.startBattle(true);
            // BattleModel.setIsStopPlay(false);
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_START_BATTLE, null);
            var obj = SceneManager.getClass(LayerEnums.MENU, com_main.BattleView.NAME);
            obj.visible = true;
            this.step = 3;
            FightResponseUtil.play();
        };
        FirstBattleGuide.prototype.destoryWall = function (callback) {
            // BattleProxy.startBattle(false);
            BattleModel.setIsStopPlay(true);
            this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"给城门最后一击。"}'], callback);
            var obj = SceneManager.getClass(LayerEnums.MENU, com_main.BattleView.NAME);
            obj.visible = false;
        };
        FirstBattleGuide.prototype.getDialogParam = function (content, callback1) {
            return { stepData: { param: content, skip: false }, obj: this, callback: callback1 };
        };
        return FirstBattleGuide;
    }(BaseClass));
    com_main.FirstBattleGuide = FirstBattleGuide;
})(com_main || (com_main = {}));
