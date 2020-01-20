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
    var ResultCtrl = /** @class */ (function (_super_1) {
        __extends(ResultCtrl, _super_1);
        function ResultCtrl() {
            return _super_1.call(this) || this;
        }
        ResultCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_RESULT_BATTLE_VIEW, ResultCtrl],
                [TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, ResultCtrl],
                [TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW, ResultCtrl],
                [TASK_UI.POP_RESULT_HISTORY_BATTLE_VIEW, ResultCtrl],
            ];
        };
        ResultCtrl.prototype.execute = function (notification) {
            debug("ResultCtrl:execute------>>", notification);
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_RESULT_BATTLE_VIEW: {
                    var body = notification.getBody();
                    var isWin = body.isWin;
                    var rewards = body.rewards;
                    var battleType = body.battleType;
                    //要等方阵死亡动画结束
                    // let view ;
                    // if(isWin){
                    // 	if(battleType == CheckPointType.ARENA){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.RAMPART){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.PATROL){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.BOSS){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.VISITOR){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.ENCOUNTER){
                    // 		return;
                    // 	}else if(battleType == CheckPointType.Pvp){
                    // 		return;
                    // 	}
                    // 	else{
                    // 		SceneManager.openView("com_main.ArenaSuccessResultView",{rewards:{},battleType:battleType},null,UpManager.STYLE_FULL,true,false,0,false)
                    // 	}
                    // }else{
                    // 	SceneManager.openView("com_main.BattleResultFaliView",battleType,null,UpManager.STYLE_FULL,true,false,0,false);
                    // }
                    break;
                }
                case TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW: {
                    var body = notification.getBody();
                    var isWin = body.result;
                    var rewards = body.rewards;
                    var battleType = body.battleType;
                    var bossType = body.bossType;
                    var lastHit = body.lastHit;
                    var rank = body.rank;
                    var damage = body.damage;
                    var arenaId = body.arenaId;
                    if (bossType == BossEnum.Rank || BossModel.challType == BossEnum.World) { //不是单人副本，显示新的结算界面
                        if (isWin) {
                            SceneManager.openView("com_main.BossSuccessResultView", { rewards: rewards, battleType: battleType, bossType: bossType, lastHit: lastHit, rank: rank, damage: damage }, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                        }
                        else {
                            SceneManager.openView("com_main.BossLoseResultView", { rewards: rewards, battleType: battleType, bossType: bossType, lastHit: lastHit, rank: rank, damage: damage }, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                        }
                        return;
                    }
                    //要等方阵死亡动画结束
                    var view = void 0;
                    if (isWin) {
                        SceneManager.openView("com_main.ArenaSuccessResultView", { rewards: rewards, battleType: battleType, arenaId: arenaId }, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    else {
                        SceneManager.openView("com_main.BattleResultFaliView", battleType, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    break;
                }
                case TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW: { //关卡行营系统
                    var body = notification.getBody();
                    var isWin = body.result;
                    var rewards = body.valuesMessage;
                    var star = body.star;
                    var gkId = body.id;
                    var condition = body.condition;
                    //FIX ME
                    //要等方阵死亡动画结束
                    var view = void 0;
                    if (isWin) {
                        SceneManager.openView("com_main.RampartSuccessResultView", { rewards: rewards, star: star, condition: condition, gkId: gkId }, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    else {
                        SceneManager.openView("com_main.BattleResultFaliView", CheckPointType.CHECKPOINT, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    break;
                }
                case TASK_UI.POP_RESULT_HISTORY_BATTLE_VIEW: { //历史战役
                    var body = notification.getBody();
                    var isWin = body.result;
                    var rewards = body.valuesMessage;
                    // let gkId = body.battleId;
                    // let condition = body.condition;
                    //FIX ME
                    //要等方阵死亡动画结束
                    var view = void 0;
                    if (isWin) {
                        var star = body.levelInfo.star;
                        var gkId = body.levelInfo.id;
                        SceneManager.openView("com_main.HistorySuccessResultView", { rewards: rewards, star: star, gkId: gkId }, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    else {
                        SceneManager.openView("com_main.BattleResultFaliView", CheckPointType.HISTORY_WAR, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    }
                    break;
                }
                default:
                    break;
            }
        };
        return ResultCtrl;
    }(AGame.Controller));
    com_main.ResultCtrl = ResultCtrl;
})(com_main || (com_main = {}));
