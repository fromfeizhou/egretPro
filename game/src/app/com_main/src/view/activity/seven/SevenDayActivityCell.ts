

module com_main {
	export interface ISevenDayAcCell {
		taskId: number;
		cId: number;
		title: string;
		rewardItem: IItemInfo[];
		subDay: number;
		rewardDay: number;
		condintion:gameProto.ITaskCondition;
	}
	export class SevenDayActivityCell extends eui.ItemRenderer {
		public m_labName: eui.Label;
		public m_labCount: eui.Label;
		public m_RewardRoot: eui.Group;
		public m_pBtn: com_main.ComButton;
		public m_pIsGet: eui.Group;
		public m_LboxState: eui.Label;
		public m_openDay: eui.Label;


		private m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/activity/seven/SevenDayActivityCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickAward);
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy() {
			EventManager.removeEventListener(this.m_pBtn);
		}

		private onClickAward(e) {
			let data: ISevenDayAcCell = this.data;
			if (data) {
				if (data.condintion.state == TaskStatus.FINISH)
					MissionProxy.send_MISSION_REWARD(data.taskId, data.cId);
			} else {
				error("MissionView: data is null!")
			}
		}



		public dataChanged(): void {
			super.dataChanged();
			let info: ISevenDayAcCell = this.data;

			let curDay: number = info.subDay;
			let subDay: number = curDay - info.rewardDay;
			let condintion = info.condintion;
			this.m_labName.textFlow = Utils.htmlParser(info.title);
			let mProgressValue = condintion.count > condintion.maxCount ? condintion.maxCount : condintion.count
			this.m_labCount.text = mProgressValue + "/" + condintion.maxCount;
			let arwardList = info.rewardItem;
			this.m_pIsGet.visible = condintion.state == TaskStatus.REWARD && subDay >= 0;
			this.m_pBtn.visible = condintion.state != TaskStatus.REWARD && subDay >= 0;
			this.m_pBtn.enabled = condintion.state == TaskStatus.FINISH
			this.m_openDay.visible = subDay < 0;
			this.m_openDay.text = GCodeFromat(CLEnum.AC_GET_DAY_AFTER, Math.abs(subDay));
			Utils.isGray(condintion.state == TaskStatus.PROCESSING, this.m_pBtn);
			this.m_pBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));
			let i = 0;
			this.m_RewardRoot.removeChildren();
			for (i = 0; i < arwardList.length; i++) {
				let itemView = ComItemNew.create("count");
				itemView.scaleX = 0.8;
				itemView.scaleY = 0.8;
				itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
				this.m_RewardRoot.addChild(itemView);
			}
		}


	}
}