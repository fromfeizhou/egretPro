module com_main {
	export class LegionSetWnd extends CComponent {
		public m_PopUp: com_main.APopUp;
		public InputLabel: eui.EditableText;
		public check_join: eui.Group;
		public m_checkbox0: eui.CheckBox;
		public check_examine: eui.Group;
		public m_checkbox1: eui.CheckBox;
		public m_BtnConfirm: com_main.ComButton;

		private m_checkTag = 0;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/legion/LegionSetWndSkin.exml");

		}
		protected listenerProtoNotifications(): any[] {
			return [
				//    ProtoDef.ACCEPT_APPLY_JOIN_GUILD
			];
		}
		public executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.GET_GUILD_INFO:
					{

					}
					break
			}
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.initScroller();
			this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
			// this.m_PopUp.setBottomBorder();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_JION_SET));

			EventManager.addEventListener(this.check_join, egret.TouchEvent.TOUCH_TAP, this, this.CheckJoin);
			EventManager.addEventListener(this.check_examine, egret.TouchEvent.TOUCH_TAP, this, this.CheckExamine);
			EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickConfirm);
			let [lv, state] = LegionModel.getbuildLevelAndFree();
			this.InputLabel.text = lv + "";
			this.m_checkbox0.selected = state == 0 ? true : false;
			this.m_checkbox1.selected = state == 0 ? false : true;
		}

		public onDestroy(): void {


			super.onDestroy();
			EventManager.removeEventListeners(this);

		}
		private initScroller() {

		}
		private CheckJoin() {
			this.m_checkbox0.selected = true;
			this.m_checkbox1.selected = false;
			this.m_checkTag = 0;
		}
		private CheckExamine() {
			this.m_checkbox0.selected = false;
			this.m_checkbox1.selected = true;
			this.m_checkTag = 1;
		}
		private onClickConfirm() {
			if (Utils.checkNumber(this.InputLabel.text) == false) {
				return EffectUtils.showTips(GCode(CLEnum.GUILD_JION_LIMIT), 1, true);;
			}
			if (Number(this.InputLabel.text) > 40) {
				return EffectUtils.showTips("不能超过大殿最高等级", 1, true);;
			}
			LegionProxy.send_JOIN_GUILD_STATUS(Number(this.InputLabel.text), this.m_checkTag);
			LegionModel.setbuildLevelAndFree(Number(this.InputLabel.text), this.m_checkTag);
			UpManager.history();
		}
	}

}