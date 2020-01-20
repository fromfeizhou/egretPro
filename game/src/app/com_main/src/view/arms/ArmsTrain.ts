module com_main {
	/**
	 * 军备招募面板
	 */
	export class ArmsTrain extends CComponent implements IArmsTabView {
		public static NAME = 'ArmsTrain';
		private static LIMIT_NUM = 10000;

		public m_pLbTitle: com_main.CLabel;
		public m_Scroller: com_main.CScroller;
		public m_materialList: eui.List;
		public m_trainGroup: eui.Group;
		public m_btnSub: eui.Image;
		public m_btnAdd: eui.Image;
		public m_slider: Hslider;
		public m_TrainingGroup: eui.Group;
		public m_trainLastTime: com_main.CLabel;
		public m_curgreesImg: eui.Image;
		public m_curSoldier: com_main.CLabel;
		public m_trainNum: com_main.CLabel;
		public m_btnOnce: com_main.ComButton;
		public m_btnGold: com_main.ComCostTextButton;
		public m_btnTrain: com_main.ComCostTextButton;

		private m_buildTrainCfg: BuildingTrainConfig;
		private conditionList: LvUpConditionsBaseInfo[];
		private m_nArmyType: SoldierMainType = SoldierMainType.FOOTSOLDIER;//兵种id
		private m_nTrainLimit = 0;  //练兵上限 
		private m_nCurTrainNum: number = 0;	//当前练兵数量
		private m_elapsedTime: number = 0;	//一万个士兵 耗时s
		private m_unitCosts: IItemInfo[];	//一万个士兵消耗
		private m_nBuildId: number;	//对应建筑id

		private m_pRemainMaxTime: number = 0;
		private m_pRemainTime: number = 0;

		public constructor() {
			super();
			this.name = ArmsWnd.NAME;
			this.skinName = Utils.getAppSkin('arms/ArmsTrainSkin.exml');
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
			this.removeEvent();
			Utils.TimerManager.remove(this.updateRemainTime, this);
		}

		// dsa:()=>{

		// }

		private m_pArrayCollection: eui.ArrayCollection;
		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_Scroller.disableArrow();

			this.m_pArrayCollection = new eui.ArrayCollection();
			this.m_materialList.itemRenderer = com_levelup_conditions_cell;
			this.m_materialList.dataProvider = this.m_pArrayCollection;

			this.m_btnOnce.setTitleLabel(GCode(CLEnum.SPEED_AD));
			this.m_btnGold.setTitleLabel(GCode(CLEnum.FINISH_SOON));
			this.m_btnTrain.setTitleLabel(GCode(CLEnum.ARMY_TAB_ZM));
			this.m_btnTrain.setCostImg('icon_time_png');

			this.m_slider.minimum = 0;
			this.conditionList = [];

			this.addEvent();
		}

		/**切换兵种 */
		public changeType(type: SoldierMainType) {
			this.m_nArmyType = type;
			this.refreshView();
		}

		/**刷新界面 */
		public refreshView(): void {
			this.m_nBuildId = MainMapModel.getBuildInfoBySolider(this.m_nArmyType).id;
			let cfg = MainMapModel.getBuildingTrainCfgbyBuildId(this.m_nBuildId);
			this.m_buildTrainCfg = cfg;
			this.m_elapsedTime = this.m_buildTrainCfg.elapsedTime;

			this.m_unitCosts = Utils.parseCommonItemJson(cfg.consumes);


			let armyCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
			this.m_pLbTitle.text = GLan(armyCfg.name);
			this.m_curSoldier.text = CommonUtils.numOutLenght(TeamModel.getTroopsInfo(this.m_nArmyType).num) + "/" + CommonUtils.numOutLenght(this.m_buildTrainCfg.storagelimit);

			this.initSliderNum();
			this.setTrainState();
		}

		/**初始化滑动条 */
		private initSliderNum() {
			//练兵上限
			this.m_nTrainLimit = this.m_buildTrainCfg.storagelimit - TeamModel.getTroopsInfo(this.m_nArmyType).num;
			//最小单次练兵 10000
			this.m_nTrainLimit = Math.max(ArmsTrain.LIMIT_NUM, this.m_nTrainLimit);
			if (this.m_nTrainLimit > this.m_buildTrainCfg.trainlimit) {
				this.m_nTrainLimit = this.m_buildTrainCfg.trainlimit;
			}
			
			let value = this.calcuInitSliderNum();
			value = Math.min(this.m_nTrainLimit, value);
			//滑动条 单位10000
			this.m_slider.maximum = Math.floor(this.m_nTrainLimit / ArmsTrain.LIMIT_NUM);
			this.m_slider.minimum = 1;
			this.m_slider.value = value / ArmsTrain.LIMIT_NUM;
			this.m_nCurTrainNum = value;
			this.updateValue();
		}
		/**计算恰好可以的最大暮兵数 */
		public calcuInitSliderNum(): number {
			let minimum: number = 100000;//单次训练量10w
			let max: number = Infinity;
			for (let i = 0; i < this.m_unitCosts.length; i++) {
				let info = this.m_unitCosts[i];
				let num = Math.floor(RoleData.GetMaterialNumById(info.itemId) / info.count) * 10000;
				max = Math.min(max, num);
				// if (minimum > num) minimum = num;
			}
			//最小募兵10000
			minimum = Math.max(ArmsTrain.LIMIT_NUM, max);
			return minimum;
		}

		/**刷新练兵量 材料显示 */
		private updateValue(): void {
			this.m_trainNum.text = CommonUtils.numOutLenght(this.m_nCurTrainNum) + "";

			//时间按钮数据设置 (this.m_elapsedTime 10000个耗时 )
			let time = Math.ceil(this.m_nCurTrainNum / 10000) * this.m_elapsedTime;
			this.m_btnTrain.setCostLabel(TimerUtils.diffTimeFormat("hh:mm:ss", time))

			//金币按钮数据设置
			let needglod = Utils.TimeGold(time);
			this.m_btnGold.setCostLabel(needglod + '');

			//所需材料设置
			let i = 0;
			this.conditionList.length = 0;
			for (i = 0; i < this.m_unitCosts.length; i++) {
				let itemInfo = this.m_unitCosts[i]
				let info = new LvUpConditionsBaseInfo(itemInfo.itemId, itemInfo.count * this.m_nCurTrainNum / 10000);
				info.setWidth(470);
				this.conditionList.push(info);
			}
			this.m_pArrayCollection.replaceAll(this.conditionList);
		}


		private setTrainState() {
			let army = MainMapModel.getTrainArmyVoById(this.m_nBuildId);
			if (army == null || army.startTime == 0) {
				this.isTraining(false);

			} else {
				this.m_pRemainMaxTime = (army.endTime - army.startTime);
				this.m_pRemainTime = army.endTime - TimerUtils.getServerTime() - army.speedTime;
				// this.m_pRemainTime = this.m_elapsedTime;
				TimerUtils.getServerTime() - army.startTime
				if (this.m_pRemainTime <= 0) {
					this.m_pRemainTime = 0;
					this.isTraining(false);
				}
				else {
					this.isTraining(true);
				}

				this.m_trainLastTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
				this.m_trainNum.text = CommonUtils.numOutLenght(army.num) + "";

				if (this.m_pRemainTime > 0) {
					if (this.m_pRemainMaxTime > 0)
						this.m_curgreesImg.width = 420 / this.m_pRemainMaxTime * (this.m_pRemainMaxTime - this.m_pRemainTime);
					Utils.TimerManager.remove(this.updateRemainTime, this);
					Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
				}
			}
			this.m_curSoldier.text = CommonUtils.numOutLenght(TeamModel.getTroopsInfo(this.m_nArmyType).num) + "/" + CommonUtils.numOutLenght(this.m_buildTrainCfg.storagelimit);
		}

		private updateRemainTime() {
			if (--this.m_pRemainTime > -1) {
				if (this.m_pRemainTime < 0) this.m_pRemainTime = 0;
				this.m_trainLastTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", Math.ceil(this.m_pRemainTime));
				if (this.m_pRemainMaxTime > 0)
					this.m_curgreesImg.width = 420 / this.m_pRemainMaxTime * (this.m_pRemainMaxTime - this.m_pRemainTime);
			} else {
				this.m_trainLastTime.text = "00:00:00";
				Utils.TimerManager.remove(this.updateRemainTime, this);
				this.m_curgreesImg.width = 0;
				this.isTraining(false);
				//主动征收
				SoldierProxy.send_C2S_TRAINING_GET(this.m_nBuildId);
			}
		}



		private isTraining(btrain: boolean) {
			this.m_trainGroup.visible = !btrain;
			this.m_btnGold.visible = !btrain;
			this.m_btnTrain.visible = !btrain;
			this.m_TrainingGroup.visible = btrain;
			this.m_btnOnce.visible = btrain;
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

		private addEvent() {
			this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);

			EventManager.addTouchScaleListener(this.m_btnGold, this, this.onTouchBtnGod);
			EventManager.addTouchScaleListener(this.m_btnTrain, this, this.onTouchBtnTrain);
			EventManager.addTouchScaleListener(this.m_btnSub, this, this.onTouchSub);
			EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onTouchAdd);
			EventManager.addTouchScaleListener(this.m_btnOnce, this, this.onOnce);

			EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.onFinishTrain, this);
			EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onResource, this);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);

			EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
			EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
		}

		/**资源变动 */
		private onResource() {
			this.updateValue();
		}

		/**训练完成 */
		private onFinishTrain(type: SoldierMainType): void {
			if (type != this.m_nArmyType) return;
			this.initSliderNum();
			this.setTrainState();
		}

		//加速完成
		private onOnce(e: TouchEvent): void {
			let army = MainMapModel.getTrainArmyVoById(this.m_nBuildId);
			Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
				propSpeedType: PropSpeedType.Soldier, targetId: this.m_nBuildId,
				startTime: army.startTime,
				endTime: army.endTime,
				speedUpTime: army.speedTime,
			});
		}



		//金币训练
		private onTouchBtnGod(e: TouchEvent): void {
			if (this.m_nTrainLimit <= 0) {
				EffectUtils.showTips('练兵营存量已满，请提升兵营等级！');
				return;
			}
			let vo = MainMapModel.getBuildInfo(this.m_nBuildId);
			if (!vo) return;
			if (!vo.isActivation()) {
				EffectUtils.showTips(GCodeFromat(CLEnum.ARMY_OPEN, GLan(vo.buildCfg.name)), 1, true);
				return
			}
			if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
				return;
			}
			if (this.m_nCurTrainNum <= 0) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL1), 1, true);
				return;
			}

			for (let index = 0; index < this.conditionList.length; index++) {
				if (!this.conditionList[index].IsMatch)
					return;
			}
			let time = Math.ceil(this.m_nCurTrainNum / 10000) * this.m_elapsedTime;
			let needglod = Utils.TimeGold(time);

			if (!MainMapModel.isInTrain(this.m_nBuildId) && PropModel.isItemEnough(PropEnum.GOLD, needglod, 1)) {
				let content = GCodeFromat(CLEnum.ARMY_ZM_TIPS, needglod);
				Utils.showConfirmPop(content, () => {
					this.onGoldSpeedUp();
				}, this, "style2", LocalModel.DAY_NOTICE_TRAIN);
			}
		}

		//花费时间训练
		private onTouchBtnTrain(e: TouchEvent): void {
			if (this.m_nTrainLimit <= 0) {
				EffectUtils.showTips('练兵营存量已满，请提升兵营等级！');
				return;
			}
			let vo = MainMapModel.getBuildInfo(this.m_nBuildId);
			if (!vo) return;
			if (!vo.isActivation()) {
				EffectUtils.showTips(GCodeFromat(CLEnum.ARMY_OPEN, GLan(vo.buildCfg.name)), 1, true);
				return
			}
			if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
				return;
			}
			if (this.m_nCurTrainNum <= 0) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL1), 1, true);
				return;
			}
			for (let index = 0; index < this.conditionList.length; index++) {
				if (!this.conditionList[index].IsMatch)
					return;
			}
			SoldierProxy.send_TRAINING_ARMY(this.m_nBuildId, this.m_nCurTrainNum);
		}

		/**确认元宝加速 */
		private onGoldSpeedUp() {
			SoldierProxy.send_TRAINING_ARMY(this.m_nBuildId, this.m_nCurTrainNum);
			SoldierProxy.send_C2S_TRAINING_SPEED(this.m_nBuildId, 0, 0);
		}


		private onchangSlider(event: eui.UIEvent): void {
			let values = event.currentTarget.value;
			this.m_nCurTrainNum = Math.floor(values) * ArmsTrain.LIMIT_NUM;
			this.updateValue();
		}

		private onTouchSub(e: TouchEvent): void {
			let val = this.m_nCurTrainNum - ArmsTrain.LIMIT_NUM;
			if (val < ArmsTrain.LIMIT_NUM) {
				return;
			}
			this.m_nCurTrainNum = val;
			this.updateValue();
			this.m_slider.value = this.m_nCurTrainNum / ArmsTrain.LIMIT_NUM;
		}

		private onTouchAdd(e: TouchEvent): void {
			if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
				return;
			}
			let val = this.m_nCurTrainNum + 10000;
			if (val > this.m_nTrainLimit) {
				val = this.m_nTrainLimit;
				return;
			}
			this.m_nCurTrainNum = val;
			this.updateValue();
			this.m_slider.value = this.m_nCurTrainNum / ArmsTrain.LIMIT_NUM;
		}

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


	}

}