
module com_main {
	// 城内建筑信息面板
	export class BuildingInfoView extends CView {

		public static NAME = "BuildingInfoView";
		private static NORMAL_BTN_ENTER_X = 186;
		private static NORMAL_BTN_LEVELUP_X = 556;

		// 每次使用加速锤的数量
		private static CONSUME_HAMMER_COUNT = 1;

		public m_pViewRoot: eui.Group;
		public m_pGoFunc: eui.Group;
		public m_pGoFuncImg: com_main.CImage;
		public m_buildGroup: eui.Group;
		public m_pBuildIcon: com_main.CImage;
		public m_pLbBuildName: com_main.CLabel;
		public m_pLbCurLv: com_main.CLabel;
		public m_pLbNextLv: com_main.CLabel;
		public m_BottomBorder0: com_main.CImage;
		public m_Scroller: com_main.CScroller;
		public m_materialList: eui.List;
		public m_pBtnLvUp: com_main.ComCostTextButton;
		public m_pBtnFastFinis: com_main.ComCostTextButton;
		public m_upGroup: eui.Group;
		public m_pLbLvUpDesc: com_main.CLabel;
		public m_effectValueRoot: eui.Group;
		public m_pLbCurLvValue: com_main.CLabel;
		public m_pLbNextLvValue: com_main.CLabel;
		public m_pEffectScroller: com_main.CScroller;
		public m_pEffectList: eui.List;
		public m_pTitle: com_main.MainTopNew;


		//new
		private conditionList: LvUpConditionsBuildQueueInfo[];

		// 当前打开的建筑id
		public m_pBuildingId: number = -1;
		private m_pBuildData: any = null;
		private m_pIsAddCallBack: boolean = false;

		private m_pCurLvCfg: BuildingLevelConfig = null;
		private m_pNextLvCfg: BuildingLevelConfig = null;
		private m_pInit: boolean = false;

		private m_pCollection: eui.ArrayCollection;   //数据
		private m_pbuidltion: eui.ArrayCollection;   //升级条件数据
		private m_tTurnCfg: TurnPanelConfig;
		public constructor(bId: number) {
			super();
			this.name = BuildingInfoView.NAME;
			//this.initApp("map/build/building_info_view.exml");
			this.initApp("map/build/building_info_newview.exml");
			this.m_pBuildingId = Number(bId);
		}

		public onDestroy(): void {
			this.m_pCurLvCfg = null;
			this.m_pNextLvCfg = null;
			this.m_pBuildData = null;

			EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
			EventMgr.removeEventByObject(BuildEvent.BUILD_FAST_UP_LEVEL, this);
			EventMgr.removeEventByObject(BuildEvent.BUILD_REFRESH, this);

			EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_BUILDPANELID, -1);
			this.removeFromCallBack();
			super.onDestroy();
		}

		public onExitPanel() {
			let id = MainMapModel.popViewId();
			if (id)
				this.changeView(id);
			else
				UpManager.history();

		}

		public LeveUpFinished() {
			this.updateView();
		}
		/**完成快速升级 */
		private onFastLvUpFinish(bId: number) {
			if (bId == this.m_pBuildingId) {
				com_main.UpManager.history();
			}
		}

		protected childrenCreated(): void {

			super.childrenCreated();
			this.updateView();
			this.setBuildIcon();
			this.updateTrun();
			this.InitEvent();
			this.m_pInit = true;

			this.m_pTitle.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]); this.m_pTitle.setExitCallBack(this.onExitPanel, this);
			EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_BUILDPANELID, this.m_pBuildingId);

			Utils.toStageBestScale(this.m_pViewRoot);

			this.onGuideCondition();
		}

		public onRefresh(body?): void {
			this.updateView();
		}

		private setBuildIcon() {

			let tempType = C.BuildingConfig[this.m_pBuildingId].type;
			this.m_pBuildIcon.source = Utils.getMainBuildName(tempType);
			this.m_pBtnLvUp.setCostImg('icon_time_png');
			//this.m_pBuildIcon.source =Utils.getMainBuildName(C.BuildingConfig[this.m_pBuildingId].type);
			// this.m_pBuildIcon.anchorOffsetX = this.m_pBuildIcon.width * 0.5;
			// this.m_pBuildIcon.anchorOffsetY = this.m_pBuildIcon.height * 0.5;
			Utils.isGlow(true, this.m_pBuildIcon, 274571);//
			//this.m_pBuildIcon_1.x = this.p_mBuildIconRoot.x;
			//this.m_pBuildIcon_1.y = this.p_mBuildIconRoot.y;
		}

		private InitEvent() {
			this.m_pBtnLvUp["sound_queren"] = SoundData.getSureSound();
			EventManager.addTouchScaleListener(this.m_pBtnLvUp, this, this.onClickLevelup);
			EventManager.addTouchScaleListener(this.m_pBtnFastFinis, this, this.onClickFastBtn);
			EventManager.addTouchScaleListener(this.m_pGoFunc, this, this.onClickFuncBtn);
			EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.onBuildLevelUp, this);
			EventMgr.addEvent(BuildEvent.BUILD_FAST_UP_LEVEL, this.onFastLvUpFinish, this);
			EventMgr.addEvent(BuildEvent.BUILD_REFRESH, this.reFlashitem, this);

		}
		/**改变升级id */
		public changeBuildingInfo(id: number) {
			if (this.m_pBuildingId == id) return;
			if (id == -1)
				id = this.m_pBuildingId;
			else
				MainMapModel.pushViewId(this.m_pBuildingId);
			this.changeView(id);
		}

		public changeView(id: number) {
			MainMap.moveToBuild(id);
			this.m_pBuildingId = id;
			this.updateView();
			this.setBuildIcon();
		}

		private onBuildLevelUp() {
			this.updateView();
			this.setBuildIcon();
		}
		private updateTrun() {
			let trunId: number = C.BuildingConfig[this.m_pBuildingId].TurnPanel;
			this.m_pGoFunc.visible = trunId !== 0;
			if (isNull(trunId) || trunId == 0)
				return;
			this.m_tTurnCfg = C.TurnPanelConfig[trunId];
			this.m_pGoFunc.visible = this.m_tTurnCfg !== null;
			if (isNull(this.m_tTurnCfg))
				return;
			this.m_pGoFuncImg.source = `${this.m_tTurnCfg.image}_png`
		}
		private updateView() {
			this.m_pBuildData = MainMapModel.getBuildInfo(this.m_pBuildingId);
			if (this.m_pBuildData != null) {
				this.m_pCurLvCfg = this.getBuildingCfg(this.m_pBuildData.type, this.m_pBuildData.level);
				this.m_pNextLvCfg = this.getBuildingCfg(this.m_pBuildData.type, this.m_pBuildData.level + 1);
				this.setBtnContent();
				this.updateViewInfo();
			}
		}

		private setBtnContent() {
			let font: string = GCode(CLEnum.LEVEL_UP);
			if (this.m_pCurLvCfg.level == 0) {
				font = GCode(CLEnum.CITY_BD_BUILD);
			}
			this.m_pBtnLvUp.setTitleLabel(font);
		}

		private updateViewInfo() {
			if (this.m_pCurLvCfg) {
				this.validateNow();

				this.SetTitle();
				this.SetLevelText();
				this.SetLevelUpConditions();
				this.SetLevelUpEffect();
				this.SetButton();
			}
		}

		private SetTitle() {

			//MainMap.moveToBuildByOffest(this.m_pBuildingId);
			let titleStr = GLan(C.BuildingConfig[this.m_pBuildingId].name);
			this.m_pTitle.setTitleName(titleStr + GCode(CLEnum.LEVEL_UP));
			this.m_pLbBuildName.text = titleStr;
			this.m_pLbCurLv.text = `${GCode(CLEnum.LEVEL2)} ${this.m_pBuildData.level}`;

		}

		//new 
		//设置等级文本
		private SetLevelText() {
			this.m_pLbNextLv.text = GCode(CLEnum.CITY_BD_LV_NEXT) + this.m_pNextLvCfg.level;
		}
		//设置升级条件
		private SetLevelUpConditions() {
			let dataArr = [];
			if (MainMapModel.isFullQueue) {
				let ids = MainMapModel.getBuildIdQueue();
				if (ids) {
					for (let index = 0; index < ids.length; index++) {
						dataArr.push(new LvUpConditionsBuildQueueInfo(ids[index]));
						if (ids[index] == this.m_pBuildingId) {
							dataArr = [];
							break;
						}
					}
				}
			}

			//条件 
			//解析配置表
			let datas = StringUtils.keyValsToNumberArray(this.m_pCurLvCfg.conditions);
			if (datas) {
				for (let key in datas) {
					let data = datas[key];
					if (data.key == 0) {
						dataArr.push(new LvUpConditionsMonarchInfo(data.value));
					} else {
						dataArr.push(new LvUpConditionsBuildInfo(data.key, data.value));
					}
				}
			}


			//材料
			let consumes = Utils.parseCommonItemJson(this.m_pCurLvCfg.consumes);
			if (consumes) {
				for (let i = 0; i < consumes.length; i++) {
					dataArr.push(new LvUpConditionsBaseInfo(consumes[i].itemId, consumes[i].count));
				}
			}
			this.conditionList = dataArr;
			this.m_pbuidltion = new eui.ArrayCollection(dataArr);
			this.m_materialList.itemRenderer = com_levelup_conditions_cell;//building_conditions_cell;
			this.m_materialList.dataProvider = this.m_pbuidltion;
		}

		/**刷新列表数据 */
		private reFlashitem(info: gameProto.IS2C_CLEAR_BOSS) {
			for (let i = 0; i < this.m_pbuidltion.source.length; i++) {
				this.m_pbuidltion.replaceItemAt(this.m_pbuidltion.source[i], i);
			}
		}
		//设置升级效果
		private SetLevelUpEffect() {
			this.m_pLbLvUpDesc.text = '';
			this.m_pCollection = new eui.ArrayCollection([]);
			this.m_pEffectList.dataProvider = this.m_pCollection;
			this.m_pEffectList.itemRenderer = BuildEffItemRender;

			let sourceList = [];
			let data: IBuildItemRD;
			let currValue: string;
			let nextValue: string;
			let dec: string;

			if (this.m_pCurLvCfg.buildingType == BuildingType.FUDING) {//聚宝盆
				let arr = [GCode(CLEnum.CITY_BD_JBP_EF1), GCode(CLEnum.CITY_BD_JBP_EF2), GCode(CLEnum.CITY_BD_JBP_EF3)];
				for (let i = 0; i < arr.length; i++) {
					dec = arr[i];
					if (i == 0) {
						currValue = C.ExtraCoinLevelConfig[this.m_pCurLvCfg.level].bonusMoney + '%';
						nextValue = C.ExtraCoinLevelConfig[this.m_pNextLvCfg.level].bonusMoney + '%';
					} else if (i == 1) {
						currValue = C.ExtraCoinLevelConfig[this.m_pCurLvCfg.level].bonusGoldMax + '';
						nextValue = C.ExtraCoinLevelConfig[this.m_pNextLvCfg.level].bonusGoldMax + '';
					} else {
						currValue = Utils.DateUtils.getFormatTime(CornucopiaModel.getCoolTime(), 1);
						let nextTime = CornucopiaModel.getNextCoolTime(this.m_pNextLvCfg.level);
						nextValue = Utils.DateUtils.getFormatTime(nextTime, 1);
					}

					data = { dec: dec, currValue: currValue, nextValue: nextValue };
					sourceList.push(data);
				}

			} else if (this.m_pCurLvCfg.buildingType == BuildingType.TAVERN) {  //酒馆
				dec = GCode(CLEnum.CITY_BD_JG_EF);
				let currCfg: BuildingResourcesLvConfig = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level);
				let nextCfg: BuildingResourcesLvConfig = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level + 1);
				let arr = [GCode(CLEnum.CITY_BD_JG_EF), GCode(CLEnum.CITY_BD_JG_CCSX)];
				let currValue: string;
				let nextValue: string;
				for (let i = 0; i < arr.length; i++) {
					dec = arr[i];
					if (i == 0) {
						currValue = Math.floor(currCfg.time / 60) + GCode(CLEnum.MIN);
						nextValue = Math.floor(nextCfg.time / 60) + GCode(CLEnum.MIN);
					}
					else if (i == 1) {
						currValue = currCfg.maxRes + '';
						nextValue = nextCfg.maxRes + '';
					}
					data = { dec: dec, currValue: currValue, nextValue: nextValue };
					sourceList.push(data);
				}

			} else if (MainMapModel.isSoldierBuilding(this.m_pCurLvCfg.buildingType)) {  //步兵营，工兵营，骑兵营,枪兵营
				let arr = [GCode(CLEnum.CITY_BD_BY_EF1), GCode(CLEnum.CITY_BD_BY_EF2), GCode(CLEnum.CITY_BD_BY_EF3),
				GCode(CLEnum.CITY_BD_BY_EF4), GCode(CLEnum.CITY_BD_BY_EF5)];
				for (let i = 0; i < arr.length; i++) {
					dec = arr[i];
					data = this.setSoldiersInfo(this.m_pCurLvCfg, this.m_pNextLvCfg, arr[i], i);
					sourceList.push(data);
				}
			} else if (this.m_pCurLvCfg.buildingType == BuildingType.CORNUCOPIA
				|| this.m_pCurLvCfg.buildingType == BuildingType.LUNG_TO_COURT
				|| this.m_pCurLvCfg.buildingType == BuildingType.AUDIENCE_HALL
				|| this.m_pCurLvCfg.buildingType == BuildingType.MINISTRY_DEFENCE) {
				this.m_pLbLvUpDesc.text = this.m_pCurLvCfg.effectDesc;
			}
			else {
				let currCfg: BuildingResourcesLvConfig = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level);
				let nextCfg: BuildingResourcesLvConfig = MainMapModel.getBuildOutCfg(this.m_pCurLvCfg.buildingType, this.m_pCurLvCfg.level + 1);
				let arr = [GLanFormat(this.m_pCurLvCfg.effectDesc), GCode(CLEnum.CITY_INVENTORY)];
				let currValue: string;
				let nextValue: string;
				for (let i = 0; i < arr.length; i++) {
					dec = arr[i];
					if (i == 0) {
						currValue = currCfg.value + '';
						nextValue = nextCfg.value + '';
					}
					else if (i == 1) {
						currValue = currCfg.maxRes + '';
						nextValue = nextCfg.maxRes + '';
					}
					data = { dec: dec, currValue: currValue, nextValue: nextValue };
					sourceList.push(data);
				}
			}
			this.m_pCollection.replaceAll(sourceList);

		}
		/**设置兵种升级效果显示 */
		private setSoldiersInfo(currCfg: BuildingLevelConfig, nextCfg: BuildingLevelConfig, decStr: string, index: number) {

			let data: IBuildItemRD;
			let trainLvCfg = MainMapModel.getBuildingTrainCfg(currCfg.buildingType, currCfg.level);
			let trainLvCfgNext = MainMapModel.getBuildingTrainCfg(nextCfg.buildingType, nextCfg.level);

			// let baseAttri = StringUtils.keyValsToNumberSer(TeamModel.getTroopsInfo(trainLvCfg.soldiersType).soldierAttribute);

			let currGenCfg = MainMapModel.getSoldierLvCfg(trainLvCfg.soldiersType, currCfg.level);
			let nextGenCfg = MainMapModel.getSoldierLvCfg(trainLvCfgNext.soldiersType, trainLvCfgNext.level);
			let curAttris = StringUtils.keyValsToNumber(currGenCfg.attribute);   //当前等级的士兵属性
			let nextAttris = StringUtils.keyValsToNumber(nextGenCfg.attribute);

			if (index == 0) {  //兵种
				data = { dec: decStr, currValue: currGenCfg.name, nextValue: nextGenCfg.name };
			} else if (index == 1) {//库存上限
				data = { dec: decStr, currValue: (trainLvCfg.storagelimit).toString(), nextValue: (trainLvCfgNext.storagelimit).toString() };
			} else if (index == 2) {//攻击力
				data = {
					dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.ATK),
					nextValue: Utils.getAttriValByType(nextAttris, AttriType.ATK)
				};
			} else if (index == 3) {//防御力
				data = {
					dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.DEF),
					nextValue: Utils.getAttriValByType(nextAttris, AttriType.DEF)
				};
			} else if (index == 4) {   //生命
				data = {
					dec: decStr, currValue: Utils.getAttriValByType(curAttris, AttriType.HP),
					nextValue: Utils.getAttriValByType(nextAttris, AttriType.HP)
				};
			}
			return data;
		}


		private SetButton() {
			if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
				this.m_pBtnLvUp.visible = false;
				this.m_pBtnFastFinis.x = 273;
			} else {
				this.m_pBtnLvUp.visible = true;
				this.m_pBtnFastFinis.x = 161;
			}
			let levelTime = 0;
			let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;
			let endTime = this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond <= 0 ? 0 : this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond;
			let lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(endTime);//Utils.changeSecondToDay(this.m_pCurLvCfg.upLevelTime*0.001);
			this.m_pBtnLvUp.setCostLabel(lvUpTimeTxt);
			let fastCost = Utils.TimeGold(this.m_pCurLvCfg.upLevelTime - vipSpeedMillSecond)

			this.m_pBtnFastFinis.setCostLabel(fastCost !== 0 ? fastCost.toString() : GCode(CLEnum.AC_FREE));
			this.m_pBtnFastFinis.setTitleLabel(GCode(CLEnum.FINISH_SOON));
		}

		private SetBuildTime() {
			this.addToCallBack();
		}

		private addToCallBack() {
			if (!this.m_pIsAddCallBack) {
				MainMapModel.addCall(this.updateTimer, this, this.m_pBuildingId);
				this.m_pIsAddCallBack = true;
			}
		}

		private updateTimer() {
			if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
				let values: any[] = MainMapModel.getCountDownValues(this.m_pBuildingId);
				if (values && values.length > 2) {
					this.m_pBtnFastFinis.setCostLabel(values[1]);
				}
			} else {
				this.updateView();
				this.removeFromCallBack();
			}
		}

		private removeFromCallBack() {
			if (this.m_pIsAddCallBack) {
				MainMapModel.removeCall(this, this.m_pBuildingId);
				this.m_pIsAddCallBack = false;
			}
		}
		private onClickFuncBtn() {
			// let tempType: number = C.BuildingConfig[this.m_pBuildingId].type;
			// this.setCurSoliderType(tempType);
			UpManager.history();
			let turnPanel = C.BuildingConfig[this.m_pBuildingId].TurnPanel;
			if (isNull(turnPanel)) return;
			FunctionModel.funcToPanel(turnPanel);

		}
		// public setCurSoliderType(type: number) {
		// 	switch (type) {
		// 		case MBuildType.BBY:
		// 			TeamModel.curSoliderType = SoldierMainType.FOOTSOLDIER;
		// 			break;
		// 		case BuildingType.RIDER_TRAINING_CAMP:
		// 			TeamModel.curSoliderType = SoldierMainType.RIDESOLDIER;
		// 			break;
		// 		case BuildingType.ARCHER_TRAINING_CAMP:
		// 			TeamModel.curSoliderType = SoldierMainType.ARROWSOLDIER;
		// 			break;
		// 	}
		// }
		//元宝升级
		private onClickFastBtn() {
			for (let index = 0; index < this.conditionList.length; index++) {
				if (!this.conditionList[index].IsMatch)
					return;
			}

			let content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(this.m_pBuildingId));
			Utils.showConfirmPop(content, () => {
				this.onClickSure();
			}, this, "style2", LocalModel.DAY_NOTICE_BUILD);
		}

		/**确认元宝升级 */
		private onClickSure() {
			let totalPrice = MainMapModel.getBuildingFinishGlod(this.m_pBuildingId);

			let values = MainMapModel.getCountDownValues(this.m_pBuildingId);
			if (values && values.length > 2) {
				// let remainTime = values[2];
				// let totalPrice = this.getSpeedGoldCount();
				if (totalPrice > 0) {
					if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) {
						MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
						MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
						MainMapProxy.send_BUILDING_SPEED(this.m_pBuildingId, 0, 0, true);
					}
				} else {
					MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
					MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
				}

			}
		}

		/** 升级按钮 */
		private onClickLevelup() {

			if (MainMapModel.isMaxQueue()) {
				EffectUtils.showTips(GCode(CLEnum.CITY_BD_QUE_MAX), 1, true);
				return;
			}

			// CD中
			if (MainMapModel.isInBuilding(this.m_pBuildingId)) {
				EffectUtils.showTips(GCode(CLEnum.CITY_BD_IN), 1, true);
				return;
			} else {
				if (this.m_pCurLvCfg && this.m_pCurLvCfg.level == 0) {
					MainMapProxy.send_BUILDING_ACTIVATED(this.m_pBuildingId);
					UpManager.history();
				} else if (this.m_pNextLvCfg) {
					//材料检测
					for (let index = 0; index < this.conditionList.length; index++) {
						if (!this.conditionList[index].IsMatch)
							return;
					}
					MainMapProxy.send_BUILDING_LEVY(this.m_pBuildData.type);
					MainMapProxy.send_BUILDING_UP_LEVEL(this.m_pBuildingId);
				}
			}
		}



		private getSpeedGoldCount() {
			let totalPrice = 0;
			let values = MainMapModel.getCountDownValues(this.m_pBuildingId);
			if (values && values.length > 2) {
				let remainTime = values[2];
				// 获取的配置已经排序
				let cfgs: any[] = MainMapModel.getBuildingCdConfig();
				if (cfgs.length > 0) {
					let baseValue = 0;
					let len = cfgs.length;
					for (let i = 0; i < len; i++) {
						let cfg = cfgs[i];
						if (remainTime > cfg.max) {
							baseValue = cfg.max - baseValue;
							totalPrice = totalPrice + baseValue * cfg.gold;
							baseValue = cfg.max;
						}

						if (cfg.min <= remainTime && remainTime <= cfg.max) {
							totalPrice = Math.ceil(totalPrice + (remainTime - baseValue) * cfg.gold);
							break;
						}
					}
				}
			}
			return totalPrice;
		}

		private getBuildingCfg(buildingType: number, level: number) {
			for (let key in C.BuildingLevelConfig) {
				let cfg = C.BuildingLevelConfig[key];
				if (cfg.buildingType == buildingType && cfg.level == level) {
					return cfg;
				}
			}
			return null;
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_BUILDING_ACTIVATED,
				ProtoDef.S2C_BUILDING_UPLEVEL,
				ProtoDef.S2C_BUILDING_SPEED,
				ProtoDef.BUILDING_CLEAN_COOLING,
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_BUILDING_ACTIVATED: {// 请求建筑激活
					this.updateView();
					break;
				}
				case ProtoDef.S2C_BUILDING_UPLEVEL: {// 请求建筑升级
					this.m_pBuildData = MainMapModel.getBuildInfo(this.m_pBuildingId);
					//this.updateBottom();
					//this.updateButton();
					com_main.UpManager.history();
					break;
				}
				case ProtoDef.S2C_BUILDING_SPEED: {// 请求建筑加速
					if (body.bId == this.m_pBuildingId) {
						com_main.UpManager.history();
					}
					//this.updateView();
					break;
				}
				case ProtoDef.BUILDING_CLEAN_COOLING: {// 请求金币清除冷却
					com_main.UpManager.history();
					break;
				}
			}
		}


		public static getClass(): BuildingInfoView {
			let obj = SceneManager.getClass(LayerEnums.POPUP, BuildingInfoView.NAME);
			return obj;
		}



		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.BUILD_LEVEL_WND);
		}
	}
	export interface IBuildItemRD {
		dec: string,
		currValue: string | number,
		nextValue: string | number,
	}
	/**
   * @extends eui.ItemRenderer
   */
	export class BuildEffItemRender extends eui.ItemRenderer {
		protected m_buildItem: buildItemRender;
		protected m_imgSelected: eui.Image;

		protected m_tData: IBuildItemRD;
		public constructor() {
			super();
		}
		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
		}
		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_buildItem = new buildItemRender();
			this.addChild(this.m_buildItem);
		}
		protected dataChanged() {
			this.m_tData = this.data;
			this.m_buildItem.setInfo(this.m_tData.dec, String(this.m_tData.currValue), String(this.m_tData.nextValue));
		}
	}
}