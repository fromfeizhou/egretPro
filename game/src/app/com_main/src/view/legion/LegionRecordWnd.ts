module com_main {
	export class LegionRecordWnd extends CView {
		public static NAME = 'LegionRecordWnd';
		private m_ItemList: eui.List;
		private m_Scroller: eui.Scroller;
		private m_PopUp: com_main.APopUp;
		/** 当前擂台列表数据 */
		private m_DataArray: eui.ArrayCollection;
		private m_num = [0, 0, 0, 0, 0];
		private m_numMax = [1, 2, 4, 5, 50];
		private m_data = null;
		private m_max = 35;
		private m_curPag = 0;
		private m_totalPage = 2;
		public constructor(mata: any) {
			super();
			this.name = LegionRecordWnd.NAME;
			this.initApp("legion/LegionRecordWndSkin.exml");

			// this.skinName = Utils.getSkinName("app/legion/LegionRecordWndSkin.exml");
			this.m_data = mata;
		}
		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.GUILD_INFORMATION
			];
		}
		public executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.GUILD_INFORMATION: {//联盟标志设置5008
					if (body) {
						let info = body.information;
						this.m_curPag = body.page; //分页
						this.m_totalPage = body.totalPage; //总页数
						this.initScroller(info);
					}
					break;
				}
			}
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			// this.initScroller();
			this.m_PopUp.setBottomBorder();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_MSG));
			this.m_Scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onScrollEnd, this);
			this.requestPage();
		}

		private onScrollEnd() {
			// this.m_scrollV = this.m_Scroller.viewport.scrollV;
			// console.log('scrollv = ',this.m_scrollV);

			if (this.m_Scroller && (this.m_Scroller.viewport.scrollV + this.m_Scroller.height) >= this.m_Scroller.viewport.contentHeight) {
				this.requestPage();
			}
		}
		private onclose() {
			UpManager.history();
		}
		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
			this.m_Scroller.removeEventListener(eui.UIEvent.CHANGE_END, this.onScrollEnd, this);
		}
		private requestPage() {
			if (this.m_curPag == 0 || this.m_curPag < this.m_totalPage) {
				LegionProxy.send_GUILD_INFORMATION(LegionModel.getGuildId(), this.m_curPag + 1);
			}
		}
		private initScroller(body) {
			let list = [];
			for (let i = 0; i < body.length; i++) {
				var info = body[i];
				let type = info.type;
				let str = this.getTextByType(info);
				list.push({ str: str, msgTime: info.msgTime });
			}
			list.sort(this.sortMsgTime);

			if (this.m_DataArray == null) {
				this.m_DataArray = new eui.ArrayCollection(list);
			} else {
				// this.m_DataArray.replaceAll(list);
				for (let i = 0; i < list.length; i++) {
					this.m_DataArray.addItem(list);
				}
			}
			this.m_ItemList.dataProvider = this.m_DataArray;
			this.m_ItemList.itemRenderer = LegionRecordCell;
		}
		//da ->xiao 
		private sortMsgTime(a: any, b: any): number {
			return Utils.SortByProps(a, b, { "msgTime": "down" });
		}
		private getTextByType(info) {
			var type = info.type;
			let time = TimerUtils.dateFormat("yyyy-MM-dd hh:mm:ss ", info.msgTime / 1000);
			switch (type) {
				case GuildInformationType.CREATE_GUILD:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_CREATE, time, info.guildName));
				case GuildInformationType.JOIN_GUILD:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_JION, time, info.playerName));
				case GuildInformationType.LEAVE_GUILD:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_LEAVE, time, info.playerName));
				case GuildInformationType.KICK_OUT_FROM_GUILD:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_KICK, time, info.playerName, info.positionName, info.positionPlayerName));
				case GuildInformationType.APPOINT_POSITION:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_RM, time, info.playerName, info.positionName));
				case GuildInformationType.CHANGE_GUILD_LEADER:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_NEW, time, info.playerName, info.positionName));
				case GuildInformationType.CHANGE_NAME:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_CHANGE, time, info.playerName, info.guildName));
				case GuildInformationType.APPLY_GUILD_LEADER:
					return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_APPLY, time, info.playerName, info.guildName));
			}

			return [];
		}
	}

	class LegionRecordCell extends eui.ItemRenderer {
		private m_Name: com_main.CLabel;
		public constructor() {
			super();
			this.touchChildren = true;
		}
		protected childrenCreated(): void {
			super.childrenCreated();
		}
		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
			EventManager.removeEventListeners(this);
		}
		protected dataChanged(): void {
			super.dataChanged();
			if (this.data) {
				this.m_Name.textFlow = this.data.str;
			}

		}


	}
}