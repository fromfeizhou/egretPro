module com_main {
	export class PlayerInfoWnd extends CView {
		public static NAME = 'PlayerInfoWnd';

		public m_PopUp: com_main.APopUp;
		public m_comHead: com_main.ComHeadItem;
		public m_comState: com_main.ComState;
		public m_ItemList: eui.List;
		public m_labName: eui.Label;
		public m_labGuildName: eui.Label;
		public m_labGuildPos: eui.Label;
		public m_labLevel: eui.Label;
		public m_labFight: eui.BitmapLabel;
		public m_title: eui.Label;
		public m_pIconRoot: eui.Group;
		public m_iconReport: com_main.ComIcon;
		public m_iconHide: com_main.ComIcon;
		public m_iconChat: com_main.ComIcon;


		/** 当前擂台列表数据 */
		private m_tCollects: eui.ArrayCollection = new eui.ArrayCollection();
		private m_tData: gameProto.IS2C_PLAYER_INTEGRATED_INFORMATION;

		protected m_bSendCd: boolean;  //聊天发送冷却
		protected m_nTimeOutId: number;  //延迟函数id（回收用）

		public constructor(data: any) {
			super();
			this.name = PlayerInfoWnd.NAME;
			this.initApp("common/player/PlayerInfoWndSkin.exml");
			this.m_tData = data;
		}

		public onDestroy(): void {
			super.onDestroy();
			if (this.m_nTimeOutId) {
				egret.clearTimeout(this.m_nTimeOutId);
				this.m_nTimeOutId = null;
			}
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_PopUp.setTitleLabel(GCode(CLEnum.PLATER_INFO));

			this.m_iconReport.setInfo('btn_122_png', 'lb_lt_jb_png');
			this.m_iconHide.setInfo('btn_123_png', 'lb_lt_pb_png');
			this.m_iconChat.setInfo('btn_124_png', 'lb_lt_sl_png');

			let headInfo = this.m_tData.headPortrait;

			if (headInfo.countryId == RoleData.countryId) {
				if (headInfo.labourUnionId == (0)) {
					if (LegionModel.getGuildId() > (0)) {
						let icon = new ComIcon();
						icon.setInfo('btn_125_png', 'lb_lt_lmyq_png');
						this.m_pIconRoot.addChild(icon);
						EventManager.addTouchScaleListener(icon.root, this, this.onIconInvite);
					}
				} else {
					if (LegionModel.getGuildId() == (0)) {
						let icon = new ComIcon();
						icon.setInfo('btn_125_png', 'lb_lt_lmsq_png');
						this.m_pIconRoot.addChild(icon);
						EventManager.addTouchScaleListener(icon.root, this, this.onIconApply);
					}
				}
			}

			EventManager.addTouchScaleListener(this.m_iconReport.root, this, this.onIconReport);
			EventManager.addTouchScaleListener(this.m_iconHide.root, this, this.onIconHide);
			EventManager.addTouchScaleListener(this.m_iconChat.root, this, this.onIconChat);
			this.initview();
		}

		/**联盟邀请 */
		private onIconInvite() {
			if (this.m_bSendCd) {
				EffectUtils.showTips(GCode(CLEnum.CHAT_INVATE_FAL), 1, true);
			}
			if (LegionModel.getGuildId() > 0) {
				ChatProxy.C2S_CHAT_PUSH(ChatType.PRIVATE, this.m_tData.headPortrait.playerName, this.m_tData.headPortrait.playerId, ChatMsgType.INVITE);

				this.m_bSendCd = true;
				this.m_nTimeOutId = egret.setTimeout(() => {
					this.m_bSendCd = false;
					this.m_nTimeOutId = null;
				}, this, 5000);
			}
		}

		/**联盟申请 */
		private onIconApply() {
			if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GUILD)) {
				LegionProxy.send_APPLY_JOIN_GUILD(this.m_tData.headPortrait.labourUnionId);
			}
		}

		/**屏蔽 */
		private onIconHide() {
			if (ChatModel.inBlackList(this.m_tData.headPortrait.playerId)) {
				EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND3), 1, true);
				return;
			}
			if (ChatModel.isBlackListMax()) {
				EffectUtils.showTips(GCode(CLEnum.CHAT_BLACK_FUL), 1, true);
				return;
			}
			ChatProxy.C2S_CHAT_ADD_BLACKLIST(this.m_tData.headPortrait.playerId);
		}

		/**私聊 */
		private onIconChat() {
			UpManager.history();
			let param: IChatWndParm = { type: ChatType.PRIVATE, id: this.m_tData.headPortrait.playerId, name: this.m_tData.headPortrait.playerName }
			Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
		}

		/**举报 */
		private onIconReport() {
			ChatProxy.C2S_CHAT_REPORT(this.m_tData.headPortrait.playerId);
		}

		private initview() {
			if (!this.m_tData) return;
			let info = this.m_tData.headPortrait;

			this.m_labName.text = info.playerName;
			this.m_labLevel.text = this.m_tData.level.toString();
			this.m_labFight.text = '' + this.m_tData.fight;
			if (info.labourUnionId > (0)) {
				this.m_labGuildName.text = info.labourUnionName;
				this.m_labGuildPos.text = LegionModel.getPosName(this.m_tData.labourUnionOfficial);
			} else {
				this.m_labGuildName.text = GCode(CLEnum.NONE);
				this.m_labGuildPos.text = GCode(CLEnum.NONE);
			}
			this.m_comState.stateId = info.countryId;
			this.m_comHead.info = info;
			let otherTeamData: com_main.IGeneralData[] = TeamModel.getOtherTeamData();
			this.m_tCollects = new eui.ArrayCollection();
			this.m_ItemList.dataProvider = this.m_tCollects;
			this.m_ItemList.itemRenderer = PlayerInfoWndCell;
			if (otherTeamData.length > 0) {
				this.initTeamGenalItems(otherTeamData);
				this.m_title.text = "部队阵容"
			} else {
				this.m_title.text = "最强阵容"
				this.initGeneralItems();
			}

		}
		/**如果是世界里面查看是显示部队列表 */
		public initTeamGenalItems(otherTeamData: com_main.IGeneralData[]) {
			let teamArr: com_main.IGeneralData[] = otherTeamData.slice(0);//备份
			this.m_tCollects.replaceAll(teamArr);
			//重置列表
			TeamModel.resetOtherTeamData();
		}
		/**武将列表 */
		private initGeneralItems() {

			let res: IGeneralData[] = [];
			for (let i = 0; i < this.m_tData.generalWinInfo.length; i++) {
				let data = this.m_tData.generalWinInfo[i];
				let info: IGeneralData = { generalId: data.generalId, level: data.level, star: data.star }
				res.push(info);
			}
			this.m_tCollects.replaceAll(res);

		}

	}

	export interface IGeneralData {
		generalId: number,
		level: number,
		star: number
	};

	class PlayerInfoWndCell extends eui.ItemRenderer {
		private m_genHead: GeneralHeadRender;
		private m_tData: IGeneralData;

		public constructor() {
			super();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_genHead = GeneralHeadRender.create('arena_name');
			this.addChild(this.m_genHead);
		}


		$onRemoveFromStage(): void {
			this.m_genHead.onDestroy();
			super.$onRemoveFromStage();
		}
		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			this.m_genHead.setGenViewInfo(this.m_tData.generalId, this.m_tData.level, this.m_tData.star);
		}


	}
}