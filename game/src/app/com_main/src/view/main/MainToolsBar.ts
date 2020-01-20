module com_main {
	export class MainToolsBar extends CComponent {

		public static NAME = 'MainToolsBar';

		public m_rootGroup: eui.Group;
		public m_pChat: eui.Group;
		public m_imgMask: com_main.CImage;
		public m_listChat: eui.List;


		private m_tCollection: eui.ArrayCollection;
		// private m_bTickInit: boolean;

		public constructor() {
			super();
			this.name = MainToolsBar.NAME;
			this.skinName = Utils.getAppSkin('top_new/new_tool_main.exml');
			this.touchEnabled = false;
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			this.removeEvent();
			// if (this.m_bTickInit) {
			// 	Utils.TimerManager.remove(this.onMsgTick, this);
			// 	this.m_bTickInit = false;
			// }
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.width = AGame.R.app.stageWidth;
			this.x = 0;
			this.y = this.stage.stageHeight - this.height;

			this.m_listChat.mask = this.m_imgMask;
			let source = [];
			for(let i= 1; i >= 0;i--){
				source.push(ChatModel.lastMsgCache[i]);
			}
			this.m_tCollection = new eui.ArrayCollection(source);
			this.m_listChat.itemRenderer = ChatMsgRender;
			this.m_listChat.dataProvider = this.m_tCollection;
			
			this.addEvent();

			if (GameConfig.getIsNotchScreen()) {
				this.m_rootGroup.left += GameConfig.notchPixel;
			}
		}

		protected addEvent() {
			com_main.EventMgr.addEvent(ChatEvent.MSG_UPDATE, this.onMsgUpdate, this);
			com_main.EventManager.addTouchTapListener(this.m_pChat, this, this.onItemClick);
		}
		/**点击回调 */
		private onItemClick() {
			Utils.open_view(TASK_UI.POP_CHAT_MAIN);
		}
		protected removeEvent() {
			EventManager.removeEventListeners(this);
			com_main.EventMgr.removeEventByObject(ChatEvent.MSG_UPDATE, this);
		}

		/**消息增加 */
		private onMsgUpdate(data: { channel: ChatType, vo: ChatVo }) {
			//过滤自己的私聊
			if (data.channel == ChatType.PRIVATE && data.vo.playerId == RoleData.playerId) {
				return;
			}

			// if (!this.m_bTickInit) {
			// 	this.m_bTickInit = true;
			// 	Utils.TimerManager.doTimer(5000, 0, this.onMsgTick, this);
			// }


			for (let i = 0; i < this.m_tCollection.source.length; i++) {
				let item = this.m_tCollection.getItemAt(i);
				if (!item) {
					this.m_tCollection.replaceItemAt(data.vo, i);
					return;
				}
			}

			let info = this.m_tCollection.getItemAt(1);
			this.m_tCollection.replaceItemAt(info, 0);
			this.m_tCollection.replaceItemAt(data.vo, 1);
		}

		/**定时器 */
		// private onMsgTick() {
		// 	let data = this.m_tCollection.getItemAt(1);
		// 	if (data) {
		// 		this.m_tCollection.replaceItemAt(data, 0);
		// 		this.m_tCollection.replaceItemAt(null, 1);
		// 	} else {
		// 		this.m_tCollection.replaceItemAt(null, 0);
		// 		Utils.TimerManager.remove(this.onMsgTick, this);
		// 		this.m_bTickInit = false;
		// 	}
		// }

	}

	class ChatMsgRender extends eui.ItemRenderer {
		public m_labMsg: eui.Label;

		private m_labRich: CCRichText;
		private m_tData: ChatVo;
		public constructor() {
			super();
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
			Utils.removeFromParent(this.m_labRich);
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_labRich = new CCRichText(this.m_labMsg);
			this.m_labRich.limitHeight(1);
			this.addChild(this.m_labRich);
			this.m_labRich.imageScale = 0.6;  //TODO

			// EventManager.addTouchTapListener(this, this, this.onItemClick);
		}

		/**点击回调 */
		// private onItemClick() {
		// 	if (!this.m_tData) {
		// 		Utils.open_view(TASK_UI.POP_CHAT_MAIN);
		// 	} else {
		// 		if (this.m_tData.type == ChatType.PRIVATE) {
		// 			let param: IChatWndParm = { type: ChatType.PRIVATE, id: this.m_tData.playerId, name: this.m_tData.playerName };
		// 			Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
		// 		} else {
		// 			let param: IChatWndParm = { type: this.m_tData.type };
		// 			Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
		// 		}
		// 	}
		// }

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			if (!this.m_tData) {
				this.m_labRich.text = '';
				return;
			}
			let msg = ChatUtils.ConvertFaceStr(this.m_tData.msg);
			if (this.m_tData.msgType == ChatMsgType.SYSTEM) {
				this.m_labRich.text = `<font color = 0xffff00>【${GCode(CLEnum.CHAT_SYSTEM)}】</font>${msg}`;
				return;
			}
			switch (this.m_tData.type) {
				case ChatType.WORLD: {
					let color = Utils.getCountryColor(this.m_tData.headPortrait.countryId);
					let cName = Utils.getCountryName(this.m_tData.headPortrait.countryId);
					let name = this.m_tData.headPortrait.playerName;
					this.m_labRich.text = `<font color = ${color}>【${cName}】</color><font color = 0x00ff00>【${name}】</font>${msg}`;
					break;
				}
				case ChatType.COUNTRY: {
					let name = this.m_tData.headPortrait.playerName;
					this.m_labRich.text = `<font color = 0xffff00>【${GCode(CLEnum.CHAT_MSTATE)}】</color><font color = 0x00ff00>【${name}】</font>${msg}`;
					break;
				}
				case ChatType.LEGION: {
					let name = this.m_tData.headPortrait.playerName;
					this.m_labRich.text = `<font color = 0xffff00>【${GCode(CLEnum.CHAT_MLEGION)}】</color><font color = 0x00ff00>【${name}】</font>${msg}`;
					break;
				}
				case ChatType.PRIVATE: {
					let name = this.m_tData.headPortrait.playerName;
					this.m_labRich.text = `<font color = 0xffff00>【${GCode(CLEnum.CHAT_MPRI)}】</color><font color = 0x00ff00>【${name}】</font>${msg}`;
					break;
				}
			}
		}
	}
}