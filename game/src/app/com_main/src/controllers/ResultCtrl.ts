module com_main {
	export class ResultCtrl extends AGame.Controller {

		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_RESULT_BATTLE_VIEW, ResultCtrl],
				[TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, ResultCtrl],   //没有星星的结算界面
				[TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW, ResultCtrl], //有星的结算界面
				[TASK_UI.POP_RESULT_HISTORY_BATTLE_VIEW, ResultCtrl], //有星的结算界面s
			];
		}

		public execute(notification: AGame.INotification) {
			debug("ResultCtrl:execute------>>", notification);
			var name = notification.getName();
			switch (name) {
				case TASK_UI.POP_RESULT_BATTLE_VIEW: {
					let body: any = notification.getBody();
					let isWin: boolean = body.isWin;
					let rewards = body.rewards;
					let battleType = body.battleType;
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
					let body: any = notification.getBody();
					let isWin: boolean = body.result;
					let rewards = body.rewards;
					let battleType = body.battleType;
					let bossType = body.bossType;
					let lastHit = body.lastHit;
					let rank = body.rank;
					let damage = body.damage;
					let arenaId = body.arenaId;

					if (bossType == BossEnum.Rank || BossModel.challType == BossEnum.World) {  //不是单人副本，显示新的结算界面
						if (isWin) {
							SceneManager.openView("com_main.BossSuccessResultView", { rewards: rewards, battleType: battleType, bossType: bossType, lastHit: lastHit, rank: rank, damage: damage }, null, UpManager.STYLE_FULL, true, false, 0, false);
						} else {
							SceneManager.openView("com_main.BossLoseResultView", { rewards: rewards, battleType: battleType, bossType: bossType, lastHit: lastHit, rank: rank, damage: damage }, null, UpManager.STYLE_FULL, true, false, 0, false);
						}
						return;
					}
					//要等方阵死亡动画结束
					let view;
					if (isWin) {
						SceneManager.openView("com_main.ArenaSuccessResultView", { rewards: rewards, battleType: battleType ,arenaId: arenaId}, null, UpManager.STYLE_FULL, true, false, 0, false)
					}
					else {
						SceneManager.openView("com_main.BattleResultFaliView", battleType, null, UpManager.STYLE_FULL, true, false, 0, false);
					}
					break;
				}
				case TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW: {  //关卡行营系统
					let body: any = notification.getBody();
					let isWin: boolean = body.result;
					let rewards = body.valuesMessage;
					let star = body.star;
					let gkId = body.id;
					let condition = body.condition;

					//FIX ME
					//要等方阵死亡动画结束
					let view;
					if (isWin) {
						SceneManager.openView("com_main.RampartSuccessResultView", { rewards: rewards, star: star, condition: condition, gkId: gkId }, null, UpManager.STYLE_FULL, true, false, 0, false)
					}
					else {
						SceneManager.openView("com_main.BattleResultFaliView", CheckPointType.CHECKPOINT, null, UpManager.STYLE_FULL, true, false, 0, false)
					}
					break;
				}
				case TASK_UI.POP_RESULT_HISTORY_BATTLE_VIEW: {  //历史战役
					let body: any = notification.getBody();
					let isWin: boolean = body.result;
					let rewards = body.valuesMessage;
					// let gkId = body.battleId;
					// let condition = body.condition;
					//FIX ME
					//要等方阵死亡动画结束
					let view;
					if (isWin) {
						let star = body.levelInfo.star;
						let gkId = body.levelInfo.id;
						SceneManager.openView("com_main.HistorySuccessResultView", { rewards: rewards, star: star, gkId: gkId }, null, UpManager.STYLE_FULL, true, false, 0, false)
					}
					else {
						SceneManager.openView("com_main.BattleResultFaliView", CheckPointType.HISTORY_WAR, null, UpManager.STYLE_FULL, true, false, 0, false)
					}
					break;
				}
				default:
					break;
			}
		}

	}
}