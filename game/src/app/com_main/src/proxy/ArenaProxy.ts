class ArenaProxy extends BaseProxy {
	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.ARENA_ID, this, 'ArenaIdIdReq', 'ArenaIdResp'],   				        //获取玩家擂台id
			[ProtoDef.ENTER_ARENA_BATTLE, this, 'EnterArenaBattleReq', 'EnterArenaBattleResp'], //进入擂台战斗
			[ProtoDef.CLEAN_UP_ARENA_BATTLE, this, 'CleanUpArenaBattleReq', 'CleanUpArenaBattleResp'], //擂台扫荡
			[ProtoDef.ARENA_RESET, this, 'ArenaResetReq', 'ArenaResetResp'], //擂台重置
			[ProtoDef.ARENA_REWARD_LIST, this, 'ArenaRewardListReq', 'ArenaRewardListResp'], //擂台奖励列表
			[ProtoDef.ARENA_GET_REWARD, this, 'ArenaGetRewardReq', 'ArenaGetRewardResp'], //擂台领取奖励
		];
	}


	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.ARENA_ID: {
				ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
				ArenaModel.freeResetTimes = body.resetCount;
				ArenaModel.canMoppingUp = body.canCleanUp;
				break;
			}

			case ProtoDef.ENTER_ARENA_BATTLE: {
				let battleId = body.battleId;
				if (battleId > 0) {
					com_main.UpManager.history();
					// SceneManager.enterScene(SceneEnums.BATTLE_MAP, battleId, false);
				}
				break;
			}

			case ProtoDef.CLEAN_UP_ARENA_BATTLE: {
				ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
				ArenaModel.canMoppingUp = false;
				Utils.open_view(TASK_UI.POP_ARENA_CLEAR_UP_PANEL, body);
				break;
			}
			case ProtoDef.ARENA_RESET: {
				ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
				ArenaModel.canMoppingUp = true;
				ArenaModel.freeResetTimes--;
				if (ArenaModel.freeResetTimes < 0)
					ArenaModel.freeResetTimes = 0;
				break;
			}

			case ProtoDef.ARENA_REWARD_LIST: {
				ArenaModel.updateAwardList(body.arenaId);
				break;
			}

			case ProtoDef.ARENA_GET_REWARD: {
				if (body.result == true) {
					ArenaModel.setAwardById(body.arenaId);
				}
				break;
			}

			default:
				break;
		}


		AGame.ServiceBuilder.notifyView(notification);
	}

	/**发送进入擂台请求 */
	public static send_ENTER_ARENA_BATTLE(armyId: number) {
		debug("BattleProxy:send_ENTER_ARENA_BATTLE--->>");
		let data: gameProto.EnterArenaBattleReq = AGame.ServiceBuilder.newClazz(ProtoDef.ENTER_ARENA_BATTLE);
		data.armyId = armyId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**发送请求擂台ID */
	public static send_ArenaId() {
		debug("BattleProxy:send__ArenaId--->>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_ID);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**擂台扫荡 */
	public static send_CLEAN_UP_ARENA_BATTLE() {
		debug("BattleProxy:send_CLEAN_UP_ARENA_BATTLE--->>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CLEAN_UP_ARENA_BATTLE);
		AGame.ServiceBuilder.sendMessage(data);
	}


	/**擂台重置 */
	public static send_ARENA_RESET() {
		debug("BattleProxy:send_CLEAN_UP_ARENA_BATTLE--->>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_RESET);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**擂台奖励列表 */
	public static send_ARENA_REWARD_LIST() {
		let data: gameProto.ArenaRewardListReq = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_REWARD_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**擂台领取奖励 */
	public static send_ARENA_GET_REWARD(arenaId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_GET_REWARD);
		data.arenaId = arenaId;
		AGame.ServiceBuilder.sendMessage(data);
	}


}