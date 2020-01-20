module com_main {
	export class LegionCheckInfoWnd extends CView {
		public static NAME = 'LegionCheckInfoWnd';
		public m_PopUp: com_main.APopUp;
		public m_pImgIcon: com_main.CImage;
		public m_labName: eui.Label;
		public m_labAllPower: eui.Label;
		public m_labRank: eui.Label;
		public m_labGuideName: eui.Label;
		public m_comFightItem: com_main.ComFightItem;
		public m_comHead: com_main.ComHeadItem;
		public m_ItemList: eui.List;

		private m_tData: gameProto.IS2C_RANK_GUILD;
		private m_tCollects: eui.ArrayCollection = new eui.ArrayCollection();

		public constructor(data: any) {
			super();
			this.name = LegionCheckInfoWnd.NAME;
			this.initApp("common/legion/LegionCheckWndSkin.exml");
			this.m_tData = data;
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.LEGION_CHECK_INFO));
			this.initview();

		}
		private initview() {
			if (!this.m_tData) return;
			let rankGuildInfo = this.m_tData.rankGuildInfo;//查看的排行榜联盟信息
			let leaderInfo = rankGuildInfo.leaderInfo;   //，盟主信息
			let memberInfo = rankGuildInfo.guildMemberInfo;   //，最强战力列表
			this.m_labAllPower.text = rankGuildInfo.guildPower + '';
			let headInfo: IHeadInfo = { type: 1, url: rankGuildInfo.leaderInfo.head.toString(), official: rankGuildInfo.leaderInfo.position, vip: rankGuildInfo.leaderInfo.vip }
			this.m_comHead.info = headInfo;
			this.m_labGuideName.text = leaderInfo.name;
			this.m_comFightItem.setFight(leaderInfo.power);
			this.LegionInfo();
			this.initGeneralItems(memberInfo);
		}
		/**设置查看的联盟信息 */
		private LegionInfo() {
			let checkInfo = LegionModel.currGuideInfo;
			if (!checkInfo) return;
			this.m_labName.text = checkInfo.legionName;
			this.m_pImgIcon.source = LegionModel.getLegionCountryImage(checkInfo.countryId);
			this.m_labRank.text = checkInfo.rank + '';
		}
		/**设置联盟最强战力 */
		private initGeneralItems(list: gameProto.IGuildMemberInfo[]) {
			this.m_tCollects = new eui.ArrayCollection();
			this.m_ItemList.dataProvider = this.m_tCollects;
			this.m_ItemList.itemRenderer = GuideMemberCell;
			let res: IGuideMemberData[] = [];
			for (let i = 0; i < list.length; i++) {
				let data = list[i];
				let headInfo: IHeadInfo = { type: 1, url: data.head.toString(), official: data.position, vip: data.vip };
				let guideData: IGuideMemberData = { headInfo: headInfo, power: data.power,name:data.name };
				res.push(guideData);
			}
			this.m_tCollects.replaceAll(res);

		}
	}
	interface IGuideMemberData {
		headInfo: IHeadInfo,
		power: number,
		name: string
	};
	class GuideMemberCell extends eui.ItemRenderer {
		public m_comHead: LegionCheckCell;
		public m_comFightItem: com_main.ComFightItem;
		private m_tData: IGuideMemberData;

		public constructor() {
			super();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_comHead=LegionCheckCell.create();
			this.addChild(this.m_comHead);
		}


		$onRemoveFromStage(): void {
			this.m_comHead.onDestroy();
			super.$onRemoveFromStage();
		}
		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			this.m_comHead.setInfo(this.m_tData.headInfo,this.m_tData.power,this.m_tData.name);
		}


	}
}