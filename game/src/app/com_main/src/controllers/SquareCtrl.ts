module com_main {
	/**
	 * 方阵状态控制器
	 */
	export class SquareCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public register() {
			super.register();
			EventMgr.addEvent(UnitNav.ACTION_FINISH, this.execute, this);
		}

		public execute(notification: AGame.INotification) {
			// debug("SquareCtrl:execute------>>", notification);
			let name = notification.getName();
			let body = notification.getBody();
			switch (name) {
				case UnitNav.ACTION_FINISH:
					this.onActionFinish(body);
					break;
				default:
					break;
			}
		}

		public onActionFinish(body: any) {
			let status: CSquare_Status = body["status"];
			if (status == CSquare_Status.STATUS_DEAD) {
				this.onDeadFinish(body);
			} else if (status == CSquare_Status.STATUS_ATTACK) {
				this.onAttackFinish(body);
			} else if (status == CSquare_Status.STATUS_FLY) {
				this.onAttackFinish(body);
			}
		}

		private onDeadFinish(body: any) {
			let data: UnitInfoVo = body["data"];
			if (!data) {
				debug("动画播放完，但是没找到数据删除！！");
				return;
			}
			let uid = data.elementId;
			let square: CSquare = BattleSceneMgr.getInstance().getDynamicObj(uid, CSquare);
			if (square) {
				let tw = egret.Tween.get(square);
				tw.to({ "alpha": 0 }, Soldier_GoneTime);
				tw.call(() => {
					//不移除，收到 BATTLE_UNIT_DISAPPEAR 再移除
					BattleModel.removeUnit(uid);
					if(BattleMap.getClass()){
						BattleSceneMgr.getInstance().removeUnitObj(uid);
					}
				});
			}
		}

		private onAttackFinish(body: any) {
			let uid = body["uid"];
			if (uid) {
				let square: CSquare = BattleSceneMgr.getInstance().getDynamicObj(uid, CSquare);
				if (square) {
					square.changeStatus(CSquare_Status.STATUS_STAND);
				}
			}
		}

		private onHitFlyFinish(body: any){
			let uid = body["uid"];
			if (uid) {
				let square: CSquare = BattleSceneMgr.getInstance().getDynamicObj(uid, CSquare);
				if (square) {
					square.changeStatus(CSquare_Status.STATUS_STAND);
				}
			}
		}
	}
}