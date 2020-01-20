module com_main {
	/**
	 * 系统邮件
	 */
	export class SystemReport extends CComponent implements IMailTabView {
		public static NAME = 'SystemReport';

		public m_labTile: com_main.CLabel;
		public m_lbContent: eui.Label;
		public m_pRewardList: eui.List;


		public m_nType: MailType;
		private m_tCollision: eui.ArrayCollection;

		public constructor(type: MailType) {
			super();
			this.name = SystemReport.NAME;
			this.m_nType = type;
			this.skinName = Utils.getAppSkin('mail/SystemReportSkin.exml');
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_tCollision = new eui.ArrayCollection();
			this.m_pRewardList.itemRenderer = RewardRender;
			this.m_pRewardList.dataProvider = this.m_tCollision;
		}

		public refresh(info: gameProto.S2C_MAILBOX_INFO): void {
			let title = MailModel.getMailTitleById(info.id);
			this.m_labTile.text = title.title;
			this.m_lbContent.text = `       ${info.text}`;
			let attaches = Utils.parseCommonItemJson(info.attachment);
			if (attaches.length > 0) {
				this.currentState = 'base';
			} else {
				this.currentState = 'empty';
			}
			this.commitProperties();
			this.m_tCollision.removeAll();
			this.m_tCollision.replaceAll(attaches);
		}

	}


	class RewardRender extends eui.ItemRenderer {
		protected m_item: ComItemNew;

		private m_tData: IItemInfo;

		public constructor() {
			super();
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_item = ComItemNew.create('count');
			this.addChild(this.m_item);
		}

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
		}
	}
}
