module com_main {
	/**
	 * 邮件采集战报主面板
	 */

	export class CollectionReport extends CComponent implements IMailTabView {
		public static NAME = 'CollectionReport';

		public m_imgIcon: eui.Image;
		public m_labLevel: eui.Label;
		public m_groupReward: eui.Group;
		public m_groupArms: eui.Group;

		public m_nType: MailType;
		public constructor(type: MailType) {
			super();
			this.name = CollectionReport.NAME;
			this.m_nType = type;
			this.skinName = Utils.getAppSkin('mail/CollectionReportSkin.exml');
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			this.clearHeadItem();
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public refresh(info: gameProto.S2C_MAILBOX_INFO): void {
			let data = JSON.parse(info.text) as ICollectionMailInfo;
			let cfg = C.EventDataConfig[data.eventDataId];
			if (cfg) {
				this.m_imgIcon.source = `map_build_icon${cfg.image}_png`;
				this.m_labLevel.text = cfg.lv.toString();
			}

			let reward = Utils.parseCommonItemJson(data.reward);
			this.m_groupReward.removeChildren();
			for (let i = 0; i < reward.length; i++) {
				let item = ComItemNew.create('count');
				NodeUtils.setScale(item, 0.9);
				item.setItemInfo(reward[i].itemId, reward[i].count);
				this.m_groupReward.addChild(item);
			}
			this.clearHeadItem();
			for (let i = 0; i < data.generalList.length; i++) {
				let info = data.generalList[i];
				let genItem = GeneralHeadRender.create('base_info');
				NodeUtils.setScale(genItem, 0.8);
				genItem.setGenViewInfo(info.generalId, info.level, info.star, info.quality, info.generalName);
				this.m_groupArms.addChild(genItem);
			}
		}

		/**回收头像 */
		private clearHeadItem() {
			if (!this.m_groupArms) return;
			while (this.m_groupArms.numChildren > 0) {
				let item = this.m_groupArms.getChildAt(0) as GeneralHeadRender;
				Utils.isGray(false, item);
				item.onDestroy();
			}
		}

	}

}