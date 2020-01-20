// module com_main {
// 	export class SkillCtrl extends AGame.Controller {
// 		private m_pSkillMgr: BattleSkillMgr;
// 		public constructor() {
// 			super();
// 			this.m_pSkillMgr = BattleSkillMgr.getInstance();
// 		}
// 		public register() {
// 			super.register();
// 			EventMgr.addEvent(UnitNav.KEY_FRAME, this.execute, this);
// 			EventMgr.addEvent(SkillNav.FIGHT_SKILL, this.execute, this);
// 		}
// 		public execute(notification: AGame.INotification) {
// 			// debug("SkillCtrl:execute------>>", notification);
// 			// let name = notification.getName();
// 			// let body = notification.getBody();
// 			// switch (name) {
// 			// 	case UnitNav.KEY_FRAME:
// 			// 		if (Utils.isGeneralObj(body.data)) {
// 			// 			let square: CSquare = body.data;
// 			// 			let status: CSquare_Status = body.status;
// 			// 			if (status != CSquare_Status.STATUS_ATTACK) {
// 			// 				break;
// 			// 			}
// 			// 			let avo: SkillAtkVo = square.getSkillAtk();
// 			// 			this.m_pSkillMgr.skillFight(avo);
// 			// 		} else {
// 			// 			debug("SkillCtrl:execute--->>不知道什么鬼的关键帧！！");
// 			// 		}
// 			// 		break;
// 			// 	case SkillNav.FIGHT_SKILL:
// 			// 		let avo: SkillAtkVo = body;
// 			// 		this.m_pSkillMgr.skillFight(avo);
// 			// 		break;
// 			// 	default:
// 			// 		break;
// 			// }
// 		}
// 	}
// }
