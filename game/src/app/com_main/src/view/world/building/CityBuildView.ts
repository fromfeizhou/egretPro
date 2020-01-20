module com_main {
	/**
	 * 城池建设
	 */
	export class CityBuildView extends CView {
		public static NAME = "CityBuildView";

		public m_apopUp: com_main.APopUp;
		public m_listGeneral: eui.List;
		public m_gCityEffect: eui.Group;
		public m_imgCity: com_main.CImage;
		public m_labLv: com_main.CLabel;
		public m_imgExpPro: eui.Image;
		public m_labExpPro: eui.Label;
		public m_labTips: com_main.CLabel;
		public m_labGName: com_main.CLabel;
		public m_rcItem0: com_main.RewardCell;
		public m_rcItem1: com_main.RewardCell;
		public m_rcItem2: com_main.RewardCell;
		public m_gCityLv: eui.Group;
		public m_labCName: com_main.CLabel;
		public m_labCLv: com_main.CLabel;
		public m_gEffect: eui.Group;
		public m_gFree: eui.Group;
		public m_costItem0: com_main.ComResCost;
		public m_costItem1: com_main.ComResCost;
		public m_costItem2: com_main.ComResCost;
		public m_pBtnFastFinis: com_main.ComCostTextButton;
		public m_pBtnLvUp: com_main.ComCostTextButton;
		public m_gDone: eui.Group;
		public m_pBtnReward: com_main.ComButton;
		public m_labCTips: com_main.CLabel;
		public m_gBuilding: eui.Group;
		public m_pBtnFast: com_main.ComCostTextButton;



		// 数据
		private m_cityId: number = -1;
		private m_pListGeneralDP: eui.ArrayCollection;
		private m_preGeneralId: number;	// 上一个点击的武将
		private m_curGeneralVO: GeneralVo;
		private m_tCurCfg: CityMadeConfig = null;
		private m_tNextCfg: CityMadeConfig = null;
		private m_nLevel: number = 1;
		private m_tCityInfo: CityBuildVo;// gameProto.IPlayerMadeInfo;
		private curEndTime: number = 0;
		private curSpeedUpTime: number = 0;

		public constructor(cityId: number) {
			super();
			this.name = CityBuildView.NAME;
			this.initApp("world/building/CityBuildViewSkin.exml");
			this.m_cityId = Number(cityId);
			CityBuildModel.curCityId = cityId;
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_CITY_MADE_INFO,
				ProtoDef.S2C_CITY_MADE,
				ProtoDef.S2C_CITY_MADE_SPEED,
				ProtoDef.S2C_CITY_MADE_REWARD
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_CITY_MADE_INFO: {
					this.refreshListGeneral();
					// this.updateCitySvData();
					break;
				}
				case ProtoDef.S2C_CITY_MADE: {
					this.refreshListGeneral();
					break;
				}
				case ProtoDef.S2C_CITY_MADE_SPEED: {
					this.refreshListGeneral();
					// 特效
					this.showUpGradeEffect();
					break;
				}
				case ProtoDef.S2C_CITY_MADE_REWARD: {
					// this.updateGeneralExp();
					break;
				}
				default:
					break;
			}
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.m_cityId = -1;
			this.m_preGeneralId = null;
			this.m_curGeneralVO = null;
			this.curEndTime = 0;
			this.curSpeedUpTime = 0;
			this.m_tCurCfg = null;
			Utils.TimerManager.remove(this.timeCallback, this);
			this.removeEvent();

			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_apopUp.setTitleLabel(GCode(CLEnum.CITY_BUILD_TITLE));

			this.m_pListGeneralDP = new eui.ArrayCollection([]);
			this.m_listGeneral.itemRenderer = GeneralCell;
			this.m_listGeneral.dataProvider = this.m_pListGeneralDP;

			this.addEvent();

			// this.refreshView();
			this.refreshListGeneral();
		}

		private addEvent() {
			EventManager.addTouchScaleListener(this.m_pBtnFastFinis, this, this.onClickFastBtn);
			EventManager.addTouchScaleListener(this.m_pBtnLvUp, this, this.onClickLevelup);
			EventManager.addTouchScaleListener(this.m_pBtnReward, this, this.onClickReward);
			EventManager.addTouchScaleListener(this.m_pBtnFast, this, this.onClickFast);
			this.m_listGeneral.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
			EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this.onBuildHeroDel, this);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);
			this.m_listGeneral.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
			EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this);
		}

		private onBuildHeroDel(cityId: number) {
			if (cityId == this.m_cityId && !WorldModel.isOwnerCity(cityId)) {
				UpManager.close();
			}
		}
		/**更新已招募的武将 */
		private refreshListGeneral() {
			let curBuildGeneral: GeneralVo = null; // 当前在建设或者建设完成的武将
			let list = CityBuildModel.getRecruitedGeneral();
			list.forEach((v, i, a) => {
				let cityId = CityBuildModel.getBuildGenCityId(v.generalId);
				if (cityId > 0) {
					let info = CityBuildModel.getCityInfo(cityId);
					v.cityBuildState = info.cityBuildState;
					if (cityId == this.m_cityId) curBuildGeneral = v;
				} else {
					v.cityBuildState = CityBuildEnum.FREE;
				}
			});
			SortTools.MoreKeysSorter(list, ["cityBuildState", "level", "quality"], [ArraySort.UPPER, ArraySort.LOWER, ArraySort.LOWER]);
			this.m_pListGeneralDP.replaceAll(list);
			// 第二次排序 当前在建设状态的城池武将排在最前面
			let sIndex = this.m_pListGeneralDP.getItemIndex(curBuildGeneral);
			if (sIndex > 0 /*-1 && this.m_pListGeneralDP.length > 1*/) {
				this.m_pListGeneralDP.removeItemAt(sIndex);
				this.m_pListGeneralDP.addItemAt(curBuildGeneral, 0);
			}
			let index = this.m_curGeneralVO ? this.m_pListGeneralDP.getItemIndex(this.m_curGeneralVO) : 0;
			this.m_listGeneral.selectedIndex = index;
			if (unNull(list[index])) this.updateListItemView(list[index]);
		}

		/**更新界面 */
		private refreshView() {
			if (isNull(this.m_cityId) || this.m_cityId == -1) return;
			if (CityBuildModel.unOwnerCity(this.m_cityId)) {
				UpManager.history();
				return;
			}
			let cityConfig = WorldModel.getCityConfig(this.m_cityId);
			this.m_imgCity.source = cityConfig.icon + "_png";
			this.m_labCName.text = WorldModel.getCityName(cityConfig.id);
		}

		//元宝升级
		private onClickFastBtn() {
			if (CityBuildModel.unOwnerCity(this.m_cityId)) {
				UpManager.history();
				return;
			}
			let sumExp = this.m_tCityInfo ? this.m_tCityInfo.sumExp : CityBuildModel.sumExp;
			// 下一级检测
			if (sumExp >= this.m_tNextCfg.sumExp) {
				EffectUtils.showTips(GCode(CLEnum.TEC_LEVEL_MAX));
				return;
			}
			// 材料检测
			let itemCosts = this.m_tCurCfg.costs;
			for (let i = 0; i < itemCosts.length; i++) {
				let info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
				if (!info3.IsMatch) return;
			}

			let content = GCodeFromat(CLEnum.CITY_BD_SPEED, CityBuildModel.getCityBuildFinishGold(this.m_cityId));
			Utils.showConfirmPop(content, this.onClickSure, this, "style2", LocalModel.DAY_NOTICE_CITY_BUILD);

		}

		/**确认元宝升级 */
		private onClickSure() {
			let totalPrice = CityBuildModel.getCityBuildFinishGold(this.m_cityId);
			if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 2)) {
				CityBuildProxy.C2S_CITY_MADE(this.m_preGeneralId, this.m_cityId, true);
				// 特效
				this.showUpGradeEffect();
			}
		}
		/** 升级按钮 */
		private onClickLevelup() {
			if (CityBuildModel.unOwnerCity(this.m_cityId)) {
				UpManager.history();
				return;
			}
			let pInfo = CityBuildModel.getCityInfo(this.m_cityId);
			if (pInfo && pInfo.isBuilding()) {
				EffectUtils.showTips(GCode(CLEnum.CITY_BD_IN));
				return;
			}
			let sumExp = this.m_tCityInfo ? this.m_tCityInfo.sumExp : CityBuildModel.sumExp;
			// 下一级检测
			if (sumExp >= this.m_tNextCfg.sumExp) {
				EffectUtils.showTips(GCode(CLEnum.TEC_LEVEL_MAX));
				return;
			}
			// 材料检测
			let itemCosts = this.m_tCurCfg.costs;
			for (let i = 0; i < itemCosts.length; i++) {
				let info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
				if (!info3.IsMatch) return;
			}

			CityBuildProxy.C2S_CITY_MADE(this.m_preGeneralId, this.m_cityId, false);
		}

		/**领取奖励 */
		private onClickReward() {
			let vo = CityBuildModel.getCityInfo(this.m_cityId);
			CityBuildProxy.C2S_CITY_MADE_REWARD(this.m_cityId, vo.generalId);
		}

		/**加速进度 */
		private onClickFast() {
			if (CityBuildModel.unOwnerCity(this.m_cityId)) {
				UpManager.history();
				return;
			}
			Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
				propSpeedType: PropSpeedType.CityBuild,
				targetId: this.m_cityId,
				startTime: this.m_tCityInfo.startDate,
				endTime: this.m_tCityInfo.endDate,
				speedUpTime: this.m_tCityInfo.speedTime,
			});
		}

		private setButton(cityId?: number) {
			this.setButtonState(cityId);

			cityId = isNull(cityId) ? this.m_cityId : cityId;
			let cfg = CityBuildModel.getCityMadeConfig(cityId, this.m_nLevel);
			let levelTime = 0;
			// let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;
			let vipSpeedMillSecond = 0;
			let timeCount = cfg.time - vipSpeedMillSecond <= 0 ? 0 : cfg.time - vipSpeedMillSecond;	// 配置表总耗时
			let lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(timeCount * 60);

			this.m_pBtnLvUp.setCostLabel(lvUpTimeTxt);
			this.m_pBtnLvUp.setTitleLabel(GCode(CLEnum.CITY_BD_BUILD));
			this.m_pBtnLvUp.setCostImg('icon_time_png');

			let fastCost = Utils.TimeGold((cfg.time - vipSpeedMillSecond) * 60);
			this.m_pBtnFastFinis.setCostLabel(fastCost !== 0 ? fastCost.toString() : GCode(CLEnum.AC_FREE));
			this.m_pBtnFastFinis.setTitleLabel(GCode(CLEnum.FINISH_SOON));

			this.m_labCTips.text = GCode(CLEnum.CITY_BUILD_DONE);
			this.m_pBtnReward.setTitleLabel(GCode(CLEnum.TAKE_OUT) + GCode(CLEnum.REWARD));

			this.m_pBtnFast.setCostImg('icon_time_png');
			this.m_pBtnFast.setTitleLabel(GCode(CLEnum.SPEED_AD));
		}

		private setButtonState(cityId?: number) {
			cityId = isNull(cityId) ? this.m_cityId : cityId;
			if (CityBuildModel.hasCityBuildInfo(cityId)) {
				let cityInfo = CityBuildModel.getCityInfo(cityId);
				if (cityInfo.cityBuildState == CityBuildEnum.DONE) {
					this.m_gFree.visible = false;
					this.m_gDone.visible = true;
					this.m_gBuilding.visible = false;
					Utils.TimerManager.remove(this.timeCallback, this);
				} else if (cityInfo.cityBuildState == CityBuildEnum.BUILDING) {
					this.m_gFree.visible = false;
					this.m_gDone.visible = false;
					this.m_gBuilding.visible = true;
					this.initTime();
				} else if (cityInfo.cityBuildState == CityBuildEnum.FREE) {
					this.m_gFree.visible = true;
					this.m_gDone.visible = false;
					this.m_gBuilding.visible = false;
				}
			} else {
				this.m_gFree.visible = true;
				this.m_gDone.visible = false;
				this.m_gBuilding.visible = false;
			}
		}

		private initTime() {
			Utils.TimerManager.remove(this.timeCallback, this);
			this.timeCallback();
			Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
		}

		//时间回调
		private timeCallback() {
			this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
			this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;

			let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
			let lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
			this.m_pBtnFast.setCostLabel(lvUpTimeTxt);
			if (this.curEndTime > 0 && lefttime <= 0) {
				Utils.TimerManager.remove(this.timeCallback, this);
				// com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.m_cityId);
				// CityBuildProxy.C2S_CITY_MADE_INFO(this.m_cityId);

				//主动调用数据层计时器逻辑
				let vo = CityBuildModel.getCityInfo(this.m_cityId);
				if (vo) vo.updateTime();
				this.refreshListGeneral();
				// 特效
				this.showUpGradeEffect();
			}
		}

		private onTouchTab(e: eui.ItemTapEvent): void {
			let item = e.item as GeneralVo;
			if (isNull(item) || this.m_preGeneralId === item.generalId) return;
			// this.m_curGeneralVO = item;
			this.updateListItemView(item);
		}

		/**更新武将点击显示相关 */
		private updateListItemView(info: GeneralVo) {
			this.m_preGeneralId = info.generalId;
			this.m_curGeneralVO = info;
			this.m_labGName.text = GeneralModel.getGeneralName(info.generalId);
			this.m_labGName.textColor = Utils.getColorOfQuality(info.qualityLevel);

			this.refreshViewItem();
		}

		/**更新武将经验 */
		private updateGeneralExp() {
			if (isNull(this.m_pListGeneralDP)) return;
			let vo = CityBuildModel.getCityInfo(this.m_cityId);
			for (let i = 0; i < this.m_pListGeneralDP.length; i++) {
				if (!this.m_pListGeneralDP.getItemAt(i)) continue;
				let item = this.m_pListGeneralDP.getItemAt(i) as GeneralVo;
				// if (item.generalId == vo.generalId) item.curExp += this.m_tCurCfg.addGeneralExp;
				if (item.generalId == vo.generalId) item.curExp += this.m_tCurCfg.addGeneralExp.count * (C.ExpBookConfig[this.m_tCurCfg.addGeneralExp.itemId].exp);
			}
		}

		private refreshViewItem() {
			let cityInfo = CityBuildModel.getCityInfoByGeneralId(this.m_preGeneralId);
			if (cityInfo && cityInfo.cityBuildState != CityBuildEnum.FREE) {
				this.m_cityId = cityInfo.cityId;
			} else {
				this.m_cityId = CityBuildModel.curCityId;
			}
			this.refreshView();
			this.updateCitySvData();
		}


		/**更新奖励道具 */
		private refreshItems() {
			let str0 = GCodeFromat(CLEnum.CITY_BUILD_GEXP, CommonUtils.numOutLenght(this.m_tCurCfg.addGeneralExp.count * (C.ExpBookConfig[this.m_tCurCfg.addGeneralExp.itemId].exp)));
			let str1 = GCodeFromat(CLEnum.CITY_BUILD_MILL, CommonUtils.numOutLenght(this.m_tCurCfg.addMilltory.count));
			let str2 = GCodeFromat(CLEnum.CITY_BUILD_BEXP, CommonUtils.numOutLenght(this.m_tCurCfg.addExp));
			this.m_rcItem0.setIconView('common_prop_5_png', str0);
			this.m_rcItem1.setIconView('common_prop_106_png', str1);
			this.m_rcItem2.setIconView('common_prop_103_png', str2);
		}

		/**刷新消耗 */
		private refreshCost() {
			for (let i = 0; i < 3; i++) {
				let data: IItemInfo = this.m_tCurCfg.costs[i];
				let item: ComResCost = this[`m_costItem${i}`];
				if (data) {
					item.visible = true;
					item.setInfo(data.itemId, data.count);
				} else {
					item.visible = false;
				}
			}
		}

		/**刷新等级特权 */
		private refreshPrivilege() {
			// this.m_gEffect.removeChildren();
			let strList = CityBuildModel.getCityPrivilege(this.m_cityId);
			for (let i in strList) {
				let str = strList[i];
				let comp = this.m_gEffect.getElementAt(Number(i)) as com_main.RewardTypeCell;
				if (isNull(comp)) {
					comp = new com_main.RewardTypeCell();
					this.m_gEffect.addChild(comp);
				}
				comp.setView(str.str);
			}
		}

		/**建造完成 加速完成 */
		public showUpGradeEffect() {
			let tempName: string = IETypes.EBuild_UpGrade;
			let EBuild_UpGrade: MCDragonBones = new MCDragonBones();
			EBuild_UpGrade.initAsync(tempName);
			EBuild_UpGrade.play(tempName, 1,true);
			let tscale = 1.0;
			EBuild_UpGrade.scaleX = EBuild_UpGrade.scaleY = tscale;
			EBuild_UpGrade.x = 205;
			EBuild_UpGrade.y = 100;
			this.m_gCityEffect.addChild(EBuild_UpGrade);
		}

		//===================协议数据 开始==================
		private updateCitySvData() {
			this.m_labTips.text = GCode(CLEnum.CITY_BUILD_TIPS);
			// 当前城池建设信息
			[this.m_nLevel, this.m_tNextCfg] = CityBuildModel.getCityExpLevel2(this.m_cityId, CityBuildModel.sumExp);
			if (!this.m_tNextCfg) {
				error("CityMadeConfig cityId not exist!");
				return;
			}
			let cityLevel = this.m_nLevel;
			let cityInfo = CityBuildModel.getCityInfo(this.m_cityId);
			// if (unNull(cityInfo)) this.m_tCityInfo = cityInfo;
			this.m_tCityInfo = cityInfo;
			this.m_labLv.text = GCode(CLEnum.LEVEL2) + cityLevel;
			this.m_labCLv.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BUILD_LEVEL, cityLevel));
			// 进度条
			let curExp = isNull(cityInfo) ? CityBuildModel.sumExp : cityInfo.sumExp;
			let nextExp = this.m_tNextCfg.sumExp;
			let per = curExp / nextExp;
			this.m_imgExpPro.scaleX = per > 1 ? 1 : per;
			this.m_labExpPro.text = GCode(CLEnum.CITY_BUILD_EXP) + ":" + CommonUtils.numOutLenght(curExp) + "/" + CommonUtils.numOutLenght(nextExp);
			this.m_tCurCfg = CityBuildModel.getCityMadeConfig(this.m_cityId, this.m_nLevel);

			// this.refreshListGeneral();
			this.setButton();
			this.refreshItems();
			this.refreshCost();
			this.refreshPrivilege();
		}
		//===================协议数据 结束==================
	}
}