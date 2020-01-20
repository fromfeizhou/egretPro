module com_main {
	export class BattleDebuffInfo extends CComponent {

		public bg: eui.Image;
		public aktArr: eui.Group;
		public m_lbNum: eui.Label;
		public m_lbName: eui.Label;
		public m_lbEff: eui.Label;
		public m_lbContent: eui.Label;


		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("battle_new/top_new/battle_debuff_info.exml");
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
			this.removeEvent();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			let rates = ConstUtil.getNumArray(IConstEnum.ARROGANCE_PARAM);
			let val = (rates[0] / 100 ).toFixed(1)
			this.m_lbContent.text = `每次攻城战对战胜利后获得1层傲气，每叠加一层导致部队伤害下降${val}%，受到伤害上升${val}%，最多叠加100层`
			
		}

		protected addEvent() {
			EventManager.addTouchTapListener(this, this, this.onClick);
		}

		protected removeEvent() {
			EventManager.removeEventListeners(this);
		}

		public refreshView(buffLv: number) {
			this.addEvent();

			this.m_lbNum.text = buffLv.toString();
			let rates = ConstUtil.getNumArray(IConstEnum.ARROGANCE_PARAM);

			let rate = (rates[0] / 100 * buffLv).toFixed(1);
			this.m_lbEff.text = `伤害下降：${rate}% 受伤上升:${rate}%`;
		}

		private onClick() {
			this.visible = false;
		}

		public onDestroy() {

		}
	}


}