
module com_main {
	export class MissionViewCell extends eui.ItemRenderer {

		public m_pImgSelectbg0: com_main.CImage;
		public m_pImgSelectbg: com_main.CImage;
		public m_pTitleText: com_main.CLabel;
		public m_pIsGet: eui.Group;
		public m_pLbDesc: com_main.CLabel;
		public m_pProgressBg: com_main.CImage;
		public m_pImageProgress: com_main.CImage;
		public m_progressText: com_main.CLabel;
		public m_RewardRoot: eui.Group;
		public m_pLbActiveNum: com_main.CLabel;
		public m_pBtn: com_main.ComButton;
		private m_btnMissionEff: MCDragonBones;  //任务按钮特效

		private m_pItemId;
		private m_pIndex;
		private m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/mission/MissionViewCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickTask);
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy() {
			EventManager.removeEventListener(this.m_pBtn);
			this.clearBtnMissionEffect();
		}

		//btn
		private onClickTask(e) {
			let data = this.data as IMissionEvt;
			if (data) {
				let cdInfo = MissionModel.getConditoinInfoById(data.taskId, data.conditionId);

				if (cdInfo.state == TaskStatus.FINISH)
					MissionProxy.send_MISSION_REWARD(data.taskId, data.conditionId);
				else if (cdInfo.state <= TaskStatus.PROCESSING) {
					UpManager.history();
					MissionModel.onClickMissionCell(data.taskId, data.conditionId);
				} else {
					EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
				}
			} else {
				error("MissionView: data is null!")
			}
		}

		/**设置任务领取按钮特效 */
		private createBtnMissionEffect() {
			if (this.m_btnMissionEff) return;
			this.m_btnMissionEff = new MCDragonBones();
			this.m_btnMissionEff.initAsync(IETypes.EUI_MissionEff);
			this.m_btnMissionEff.play(IETypes.EUI_MissionEff);
			this.m_btnMissionEff.x = 72.5;
			this.m_btnMissionEff.y = 30;
			this.m_pBtn.addChild(this.m_btnMissionEff);
		}
		private clearBtnMissionEffect() {
			if (this.m_btnMissionEff) {
				this.m_btnMissionEff.destroy();
				this.m_btnMissionEff = null;
			}
		}

		//MissionInfoVo
		public dataChanged(): void {
			super.dataChanged();
			let tempData: IMissionEvt = this.data;
			let conditionCfg = C.TaskConditionConfig[tempData.conditionId];
			let taskCfg = C.TaskConfig[tempData.taskId]
			let cdInfo = MissionModel.getConditoinInfoById(tempData.taskId, tempData.conditionId);
			this.m_pTitleText.text = taskCfg.title;
			this.m_pLbActiveNum.text = GCodeFromat(CLEnum.TASK_ACTIVITY_NUM1,conditionCfg.rewardActivity);
			this.m_pLbDesc.textFlow = Utils.htmlParser(conditionCfg.title);
			if (Number(conditionCfg.rewardActivity) == 0)
				this.m_pLbActiveNum.text = "";
			let mProgressValue = cdInfo.count > cdInfo.maxCount ? cdInfo.maxCount : cdInfo.count
			this.m_progressText.text = mProgressValue + "/" + cdInfo.maxCount;
			let pro = Math.min(cdInfo.count / cdInfo.maxCount, 1);
			this.m_pImageProgress.width = (this.m_pProgressBg.width - 2) * pro;
			this.m_pIsGet.visible = cdInfo.state == TaskStatus.REWARD;
			this.m_pBtn.visible = cdInfo.state != TaskStatus.REWARD;
			let title = cdInfo.state == 0 ? GCode(CLEnum.GO_TO) : GCode(CLEnum.TAKE_OUT);
			this.m_pBtn.setTitleLabel(title);
			if (cdInfo.state == TaskStatus.FINISH) {
				this.m_pBtn.currentState = "style1";
				this.createBtnMissionEffect();
			} else {
				this.m_pBtn.currentState = "style6";
				this.clearBtnMissionEffect();
			}

			let arwardList = conditionCfg.rewardItem;
			let i = 0;
			for (i = 0; i < arwardList.length; i++) {
				if (this.m_RewardRoot.numChildren > i) {
					(this.m_RewardRoot.getChildAt(i) as ComItemNew).setItemInfo(arwardList[i].itemId, arwardList[i].count);
				} else {
					let itemView = ComItemNew.create("count");
					itemView.scaleX = 0.8;
					itemView.scaleY = 0.8;
					itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
					this.m_RewardRoot.addChild(itemView);
				}
			}
			for (; i < this.m_RewardRoot.numChildren; i++) {
				this.m_RewardRoot.removeChildAt(i);
			}

		}


	}
}