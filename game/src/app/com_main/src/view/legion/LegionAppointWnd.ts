module com_main {
	/**任命界面 */
	export class LegionAppointWnd extends CComponent {
		private m_MemberIdx: number;
		private m_ItemList: eui.List;
		private m_Scroller: eui.Scroller;
		private m_PopUp: APopUp;
		/** 当前擂台列表数据 */
		private m_DataArray: eui.ArrayCollection;
		private m_data: ILegionCellData = null;
		public constructor(mata: any) {
			super();
			this.skinName = Utils.getSkinName("app/legion/LegionAppointWndSkin.exml");
			this.m_data = mata;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.initScroller();
			this.m_PopUp.setBottomBorder();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
		}

		private initScroller() {
			let info = LegionModel.getGuildInfo();
			let members: { [key: number]: { cur: number, max: number } } = {};
			let maxs = [0, 1, 2, 4, 5, 50];
			for (let i = 1; i < maxs.length; i++) {
				members[i] = { cur: 0, max: maxs[i] };
			}
			for (let i = 0; i < info.guildMemberInfo.length; i++) {
				let data = info.guildMemberInfo[i];
				members[data.position].cur++;
			}

			let list = [];
			let memberArr = LegionModel.getGuildInfo().guildMemberInfo[this.m_MemberIdx];
			for (let i = 1; i < 6; i++) {
				let curNum = members[i].cur;
				let max = members[i].max;
				list.push({ playerPos: this.m_data.position, playerId: this.m_data.playerId, position: i, titleName: LegionModel.getPosTitle(i), curNum: curNum, totalNum: max, btnHandle: (index) => this.onClickHandle(index) });
			}
			this.m_DataArray = new eui.ArrayCollection(list);
			this.m_ItemList.dataProvider = this.m_DataArray;
			this.m_ItemList.itemRenderer = LegionAppointmentCell;
		}

		private onClickHandle(index: number) {
			console.log('m_playerId,index', this.m_data.playerId, index);
			LegionProxy.send_APPOINT_POSITION(this.m_data.playerId, index);
			UpManager.history();
		}

		private RefreshScroller() {
			for (let item of this.m_ItemList.$children) {
				let itemE: LegionAppointmentCell = item as LegionAppointmentCell;
				itemE.Refresh();
			}
		}
	}

	class LegionAppointmentCell extends eui.ItemRenderer {
		private m_Name: CLabel;
		private m_NumInfo: CLabel;
		private m_BtnConfirm: ComButton;

		public constructor() {
			super();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
			EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickBtn);
		}
		protected dataChanged() {
			super.dataChanged();
			if (this.data) {
				this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
				this.Refresh()

				this.m_BtnConfirm.disabled = this.data.curNum >= this.data.totalNum;
				this.m_BtnConfirm.visible = this.data.playerPos != this.data.position;
			}

		}
		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
			EventManager.removeEventListeners(this);
		}
		public Refresh() {
			this.RefreshTitle();
			this.RefreshNumInfo();
		}

		private onClickBtn() {
			if (this.data.btnHandle)
				this.data.btnHandle(this.data.position);

		}


		public RefreshTitle() {
			this.m_Name.text = this.data.titleName;
		}

		public RefreshNumInfo() {
			this.m_NumInfo.text = format("{1}/{2}", this.data.curNum, this.data.totalNum);
		}

	}
}