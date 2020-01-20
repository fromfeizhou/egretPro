module com_main {
	export class MainSceneBar extends CView {

		public static NAME = 'MainSceneBar';
		public m_group: eui.Group;
		public m_buildQueue_0: com_main.BuildQueueCell;
		public m_buildQueue_1: com_main.BuildQueueCell;
		public m_btnBuildAll: com_main.ComButton;
		public m_btnLevyAll: com_main.ComButton;

		private m_nTouchDt: number = 0;	//点击计时

		public constructor() {
			super();
			this.name = MainSceneBar.NAME;
			this.initApp("top_new/MainSceneBarSkin.exml");
		}

		public onDestroy(): void {
			this.destroyBuildQueue();
			this.removeEvent();

			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.width = AGame.R.app.stageWidth;
			// this.height = AGame.R.app.stageHeight;
			Utils.toStageBestScaleHeigt(this);
			this.touchEnabled = false;

			this.initBulidQueueCell();

			this.m_btnBuildAll.setTitleLabel(GCode(CLEnum.CITY_BD_ALL));
			this.m_btnLevyAll.setTitleLabel(GCode(CLEnum.CITY_BD_REC_ALL));

			this.initEvent();

			if (GameConfig.getIsNotchScreen()) {
				this.m_group.left += GameConfig.notchPixel;
			}

			/**检查新手引导面板条件 */
			this.onGuideCondition();

			this.m_btnBuildAll.visible = !platform.isHidePayFunc();
		}



		/**初始化建造队列 */
		public initBulidQueueCell() {
			for (let i = 0; i < 2; i++) {
				(this["m_buildQueue_" + i] as BuildQueueCell).index = i;
			}
		}

		private destroyBuildQueue() {
			for (let i = 0; i < 2; i++) {
				(this["m_buildQueue_" + i] as BuildQueueCell).onDestroy();
			}
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private speedToBuild(id: number) {
			let buildVo: MainMapBuildVo = MainMapModel.getBuildInfo(id);
			let time = buildVo.getBuildLeftTime();
			if (time > 0) {
				if (PropModel.isItemEnough(PropEnum.GOLD, Utils.TimeGold(time), 1)) {
					MainMapProxy.send_BUILDING_SPEED(id, 0, 0);
				}
			}
		}

		private initEvent() {
			EventManager.addTouchScaleListener(this.m_btnLevyAll, this, () => {
				MainMap.autoLevy();
			});

			EventManager.addTouchScaleListener(this.m_btnBuildAll, this, this.onClickBuildAll);

			EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, this.onGlobalTouchEnd, this);
			Utils.TimerManager.doTimer(10000, 0, this.onTimeTick, this);
		}

		public onClickBuildAll() {
			if (!VipModel.hasPrivillege(VipPrivillType.BUILDING_FAST)) {
				EffectUtils.showTips(GCode(CLEnum.CITY_BD_ALL_FAL))
				return;
			}
			if (MainMapModel.isMaxQueue()) {
				let speedBuildid = 0;
				this.m_buildQueue_0.getBuildLevel() < this.m_buildQueue_1.getBuildLevel() ? speedBuildid = this.m_buildQueue_0.getBuildId() : speedBuildid = this.m_buildQueue_1.getBuildId();

				if (MainMapModel.getBuildingFinishGlod(speedBuildid) == 0) {
					return;
				}

				let content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(speedBuildid));
				Utils.showConfirmPop(content,()=>{
					this.speedToBuild(speedBuildid);
				},this,"style4", LocalModel.DAY_NOTICE_AUTO_BUILD)
				return;
			}

			let id = 0;
			let cellIndex = 0;
			for (let i = 0; i < 2; i++) {
				let cell = this["m_buildQueue_" + i] as BuildQueueCell;
				if (cell.getBuildId() == -1) {
					id = cell.autoLevelUp();
					cellIndex = i;
					break;
				}
			}

			//主城升级中，其他不能升级，加速主城升级
			if (!id) {
				let index = Number(!cellIndex);
				let cell = this["m_buildQueue_" + index] as BuildQueueCell;
				if (cell.getBuildId() > 0) {
					let content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(cell.getBuildId()));
					Utils.showConfirmPop(content,()=>{
						this.speedToBuild(cell.getBuildId());
					},this,"style4", LocalModel.DAY_NOTICE_AUTO_BUILD)

					// this.speedToBuild(cell.getBuildId());
				} else {   //没有满足升级条件的
					let bid = MainMapModel.getBuildIdByCondition();
					com_main.MainMap.moveToBuildAndOpen(bid);
				}
			}
		}

		private removeEvent() {
			EventMgr.removeEventByObject(TASK_EVT.GLOBAL_TOUCH_END, this);
			Utils.TimerManager.remove(this.onTimeTick, this)
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

			// this.onClickBuildAll();
		}
		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_CITY);
		}
	}
}