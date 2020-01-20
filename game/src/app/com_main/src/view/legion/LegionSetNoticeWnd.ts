module com_main {
	/**联盟公告修改 */
	export class LegionSetNoticeWnd extends CView {
		public static NAME = 'LegionSetNoticeWnd';
		private m_PopUp: com_main.APopUp;
		private m_BtnConfirm: com_main.ComButton;
		private InputLabel1: eui.EditableText;
		private m_data = null;
		public constructor(mata: any) {
			super();
			// this.skinName = Utils.getSkinName("app/legion/LegionSetNoticeWndSkin.exml");
			this.name = LegionSetNoticeWnd.NAME;
			this.initApp("legion/LegionSetNoticeWndSkin.exml");
			this.m_data = mata;
		}
		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.CHECK_APPLY_JOIN_GUILD,
			];
		}
		public executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.CHECK_APPLY_JOIN_GUILD:
					{

					}
					break;

			}
		}
		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_NOTICE));
			this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
			EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickChange);
		}

		private getBLen(str) {
			if (str == null) return 0;
			if (typeof str != "string") {
				str += "";
			}
			let labtxt = Utils.filterStr(str);//过滤特殊字符
			return Utils.trim(labtxt);
		}
		private onClickChange() {
			if (this.InputLabel1.text != "") {

				this.InputLabel1.validateNow();
				let labInput = this.getBLen(this.InputLabel1.text).toString();
				let boo = Utils.isEmojiCharacter(this.InputLabel1.text);
				if (labInput.length > 100 || boo) {
					EffectUtils.showTips(GCode(CLEnum.GUI_NOTICE_LIMIT), 1, true);
				} else
					LegionProxy.send_CHANGE_DECLARATION(this.InputLabel1.text);
				UpManager.history();
			}
		}

	}

}