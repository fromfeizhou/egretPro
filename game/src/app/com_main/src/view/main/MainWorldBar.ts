module com_main {
	export class MainWorldBar extends CView {
		public static NAME = 'MainWorldBar';
		public m_BtnBack: com_main.CImage;
		public m_teamView: com_main.WorldQueView;
		public m_comStateWei: com_main.ComState;
		public m_labNumWei: eui.Label;
		public m_comStateShu: com_main.ComState;
		public m_labNumShu: eui.Label;
		public m_comStateWu: com_main.ComState;
		public m_labNumWu: eui.Label;
		public m_worldMinMap: com_main.WorldMinMapView;
		public m_menuGroup: eui.Group;
		public m_pArmyBtn: eui.Group;
		public m_pSearchBtn: eui.Image;
		public m_pWarmBtn: eui.Group;
		public m_pMiniBtn: eui.Group;
		public m_pBtnHelp: eui.Group;
		public btn_rank: eui.Group;
		public btn_battleInfo: eui.Group;
		public m_pLbTime: eui.Label;
		public m_pTaskRoot: eui.Group;
		public m_labTaskName: eui.Label;
		public m_labTaskPro: eui.Label;
		public m_pEffRoot: eui.Group;



		private m_nTouchDt: number = 0;	//点击计时
		private m_taskEff: MCDragonBones;
		protected m_bOnTick: boolean;
		protected m_nTimeOut: number;
		protected m_nStopOut: number;
		public constructor() {
			super();
			this.name = MainWorldBar.NAME;
			this.initApp("top_new/MainWorldBarSkin.exml");
		}

		public onDestroy(): void {
			this.removeEvent();
			this.clearBtnBossEffect();
			this.clearTimeOut();
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.width = AGame.R.app.stageWidth;
			// this.height = AGame.R.app.stageHeight;
			Utils.toStageBestScaleHeigt(this);
			this.touchEnabled = false;

			this.initEvent();
			/**添加情报红点 */
			RedPointModel.AddInfoListener(this.m_pWarmBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.WARN], 2);

			RedPointModel.AddInfoListener(this.m_pArmyBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.EXPLOIT], 2);

			RedPointModel.AddInfoListener(this.m_pMiniBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.WORLD_CITY_BUILD], 2);

			RedPointModel.AddInfoListener(this.btn_rank, { x: 60, y: 0, scale: 0.78 }, [RedEvtType.PLAYER_BATTLE_REWARD], 2);

			this.m_teamView.initData(TeamType.WORLD);
			
			if (GameConfig.getIsNotchScreen()) {
				this.m_teamView.left += GameConfig.notchPixel;
				
				this.m_menuGroup.right += GameConfig.notchPixel;
				this.m_worldMinMap.right += GameConfig.notchPixel;
			}

			/**检查新手引导面板条件 */
			this.onGuideCondition();

			this.refrehTask();
			this.initCity();

			this.createBtnBossEffect();
			this.refreshSceneView();


		}
		public startTick() {
			let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
			this.m_nTimeOut = vo.openDate - TimerUtils.getServerTimeMill();
			this.m_nStopOut = vo.closeDate - TimerUtils.getServerTimeMill()
			this.refreshTileLab();
			if (!this.m_bOnTick) {
				this.m_bOnTick = true;
				Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
			}
		}
		public refreshTileLab() {
			if (this.m_nTimeOut > 0) {
				this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_BATTLE_LEFT, Utils.DateUtils.getFormatTime(this.m_nTimeOut)));
			} else if (this.m_nStopOut > 0) {
				this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatTime(this.m_nStopOut)));
			} else {
				this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatTime(0)));
			}

		}
		private onTickHandler() {
			// let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
			this.m_nTimeOut -= 1000;
			this.m_nStopOut -= 1000;
			if (this.m_nStopOut <= 0) {
				this.clearTimeOut();
				SceneManager.runSceneBefore();
				return;
			}
			this.refreshTileLab();
		}
		public clearTimeOut() {
			this.m_bOnTick = false;
			Utils.TimerManager.remove(this.onTickHandler, this);
		}
		/**刷新任务进度 */
		private refrehTask() {
			let condition = MissionModel.getCountryTask();
			if (condition) {
				let cfg = C.TaskConditionConfig[condition.conditionBaseId];
				if (cfg) {
					this.m_labTaskName.text = cfg.title;
					if(condition.state == TaskStatus.REWARD){
						this.m_labTaskPro.text = '凌晨5点重置'
					}else if (condition.state == TaskStatus.FINISH) {
						// this.m_labTaskPro.visible = false;
						this.m_labTaskPro.text = "点击领奖";//读语言包==
					} else {
						// this.m_labTaskPro.visible = true;
						this.m_labTaskPro.text = `${condition.count}/${condition.maxCount}`;
					}
					return;
				}
			}
			this.m_pTaskRoot.visible = false;
		}

		/**初始化城池数 */
		private initCity() {
			this.m_comStateWei.stateId = CountryType.WEI;
			this.m_comStateShu.stateId = CountryType.SHU;
			this.m_comStateWu.stateId = CountryType.WU;
			this.refreshCity();
		}

		/**刷新城池数 */
		private refreshCity() {
			this.m_labNumWei.text = WorldModel.getCountryCount(CountryType.WEI) + '';
			this.m_labNumShu.text = WorldModel.getCountryCount(CountryType.SHU) + '';
			this.m_labNumWu.text = WorldModel.getCountryCount(CountryType.WU) + '';
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private initEvent() {
			//搜索
			EventManager.addTouchScaleListener(this.m_pSearchBtn, this, e => {
				Utils.open_view(TASK_UI.POP_WORLD_SEARCH_VIEW);
			});


			//小地图
			EventManager.addTouchScaleListener(this.m_pMiniBtn, this, e => {
				// FunctionModel.openFunctionByType(FunctionType.MINIMAP);
				Utils.open_view(TASK_UI.POP_WORLD_CITY_BUILD_INFO);
			});

			//调兵
			EventManager.addTouchScaleListener(this.m_pArmyBtn, this, e => {
				Utils.open_view(TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND);
			});

			/**情报 */
			EventManager.addTouchScaleListener(this.m_pWarmBtn, this, this.onWarnBtnClick);

			EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBack);


			/**任务点击 */
			EventManager.addTouchTapListener(this.m_pTaskRoot, this, this.awardCountryTask);

			EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onUpdateMissionInfo, this);
			EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);

			EventManager.addTouchScaleListener(this.btn_battleInfo, this, this.onClickBattleInfo);
			EventManager.addTouchScaleListener(this.btn_rank, this, this.onClickRankBtn);

			/**城池刷新 */
			EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_UPDATE, this.refreshCity, this);

			EventManager.addTouchScaleListener(this.m_pBtnHelp, this, this.onclickInfo);

			/**点击计时 */
			EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, this.onGlobalTouchEnd, this);
			Utils.TimerManager.doTimer(10000, 0, this.onTimeTick, this);
			EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
		}
		//点击规则说明
		private onclickInfo() {
			Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_DES), title: GCode(CLEnum.XIANGYANG_TITLE) });
		}

		public onClickRankBtn() {
			AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW(2);
			// Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_RANK);
		}

		public onClickBattleInfo() {
			Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS);
		}

		private removeEvent() {
			EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
			EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);

			EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_UPDATE, this);

			EventMgr.removeEventByObject(TASK_EVT.GLOBAL_TOUCH_END, this);

			EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);

			Utils.TimerManager.remove(this.onTimeTick, this)
		}
		/**场景状态改变 */
		public onChangeScene() {
			this.refreshSceneView();
		}

		/**场景状态改变 */
		private refreshSceneView() {
			this.visible = true;
			switch (SceneManager.getCurrScene()) {
				case SceneEnums.WORLD_XIANGYANG_CITY: {
					this.currentState = 'xiangyang';
					this.clearTimeOut();
					this.startTick();
					break;
				}
				case SceneEnums.WORLD_CITY: {
					this.currentState = 'normal';
					this.clearTimeOut();
					break;
				}
				default: {
					this.visible = false;
					this.clearTimeOut();
					break;
				}
			}
		}
		/**任务领奖 */
		private awardCountryTask() {
			let condition = MissionModel.getCountryTask();
			if (!condition) return;
			let cfg = C.TaskConditionConfig[condition.conditionBaseId];
			if (!cfg) return;
			if (condition.state == TaskStatus.FINISH) {
				MissionProxy.send_MISSION_REWARD(cfg.taskId, condition.conditionBaseId);
			} else {
				if (cfg.turnPanel > 0)
					FunctionModel.funcToPanel(cfg.turnPanel);
			}
		}

		/**任务更新 */
		private onUpdateMissionInfo(data: IMissionEvt) {
			if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat) return;
			this.refrehTask();
		}

		/**定时器 */
		private onTimeTick() {
			if (!FunctionModel.isFunctionOpen(FunctionType.PATROL_TURN)) return;
			this.m_nTouchDt += 10;
			if (this.m_nTouchDt >= NormalModel.HANG_SCENE_TIME) SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
		}

		/**点击回调 */
		private onGlobalTouchEnd() {
			this.m_nTouchDt = 0;
		}
		private onBack(pvt: egret.TouchEvent) {
			UpManager.history();
			SceneManager.runSceneBefore();
		}
		/**点击情报按钮*/
		public onWarnBtnClick(pvt: egret.TouchEvent) {
			Utils.open_view(TASK_UI.POP_WORLD_BATTLE_VIEW);
			WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId)
		}
		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		/**设置boss按钮特效 */
		private createBtnBossEffect() {
			if (this.m_taskEff) return;
			this.m_taskEff = new MCDragonBones();
			this.m_taskEff.initAsync(IETypes.EUI_TASK_EFF);
			this.m_taskEff.play(IETypes.EUI_TASK_EFF);
			this.m_pEffRoot.addChild(this.m_taskEff);
		}

		private clearBtnBossEffect() {
			if (this.m_taskEff) {
				this.m_taskEff.destroy();
				this.m_taskEff = null;
			}
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_WORD);
		}
	}
}