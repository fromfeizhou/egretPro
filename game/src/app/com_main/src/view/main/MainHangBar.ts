module com_main {
	export class MainHangBar extends CView {
		public static NAME = 'MainHangBar';
		public static PRO_HEIGHT_MAX: number = 86;

		public m_pTest: eui.Group;
		public m_pNewFunc: eui.Group;
		public m_pIco: com_main.CImage;
		public m_pNewFuncImg: com_main.CImage;
		public m_pOpenLev: eui.Label;
		public m_pBossBtn: eui.Group;
		public m_pBossView: com_main.PatrolBossView;
		public m_leftGroup: eui.Group;
		public m_labCopper: eui.Label;
		public m_labExp: eui.Label;
		public m_btnSpeed: com_main.ComButton;
		public m_infoView: com_main.PatrolInfoView;
		public m_boxView: com_main.PatrolBoxView;
		public m_pHangAct: eui.Group;
		public bitmapLabel: eui.BitmapLabel;
		public bitmapLabel0: eui.BitmapLabel;
		public bitmapLabel1: eui.BitmapLabel;
		public bitmapLabel2: eui.BitmapLabel;
		public bitmapLabel3: eui.BitmapLabel;
		public bitmapLabel4: eui.BitmapLabel;
		public m_imgMask: com_main.CImage;
		public m_pVipService: eui.Group;

		private m_btnBossEff: MCDragonBones;  //boss 按钮特效

		private m_bossAttack: MCDragonBones;//boss来袭特效


		private m_tCfgFunc: FunctionConfig;
		private m_State: number//当前的状态
		private m_hangAct: egret.tween.TweenGroup;
		private m_tFlyItems: { item: PImage, lerp: number, index: number }[];
		private isOneFlyEnd: boolean = false;
		public m_imgAwardDes: eui.Image;
		public flyItemArr: eui.Image[] = [];
		public m_curIndex: number = 0;
		public constructor() {
			super();
			this.name = MainHangBar.NAME;
			this.initApp("top_new/MainHangBarSkin.exml");
		}
		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_FUNCTION_PREVIEW,
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_FUNCTION_PREVIEW: {
					this.updateFuncPreView();
					break;
				}
			}
		}
		public onDestroy(): void {
			this.removeEvent();

			super.onDestroy();
			this.clearBtnBossEffect();
			this.clearBossAttackEffc();
			PatrolModel.stopTick();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.width = AGame.R.app.stageWidth;
			// this.height = AGame.R.app.stageHeight;
			Utils.toStageBestScaleHeigt(this);
			this.touchEnabled = false;
			this.m_tFlyItems = [];

			this.m_btnSpeed.setTitleLabel(GCode(CLEnum.SPEED_AD));
			this.m_btnSpeed.visible = !platform.isHidePayFunc();
			//boss
			// RedPointModel.AddInfoListener(this.m_pBossBtn, { x: 57, y: 0, scale: 0.78 }, [RedEvtType.BOSS_SINGLE, RedEvtType.BOSS_RANK, RedEvtType.BOSS_WORLD], 2);


			//更新功能预览显示
			this.updateFuncPreView();

			//装备已满提示
			if (EquipModel.equipDic.count >= 450) {
				EquipModel.isEquipfull(1);

			} else if (PropModel.getPropItemListByType(PropMainType.EQUIP_SOUL).length >= 450) {
				EquipModel.isEquipfull(2);
			}
			//挂机动画
			this.m_hangAct.play(0);

			this.refreshHangAwardTips();

			this.initEvent();

			this.onNewFunctionOpen(FunctionType.BOSS)
			/**检查新手引导面板条件 */
			this.onGuideCondition();

			if (GameConfig.getIsNotchScreen()) {
				this.m_leftGroup.left += GameConfig.notchPixel;
			}

			PatrolModel.startTick();
		}

		/**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			this.m_hangAct.play(0);
		}

		/**刷新挂机奖励显示 */
		private refreshHangAwardTips() {
			let [silverSpeed, expSpeed] = PatrolModel.calculateRewardSpeed();

			this.m_labCopper.text = '+' + GCodeFromat(CLEnum.HOUR1, silverSpeed);
			this.m_labExp.text = '+' + GCodeFromat(CLEnum.HOUR1, expSpeed);
		}


		/**更新功能预览显示 */
		public updateFuncPreView() {
			this.clearFuncLabEffect();
			let preFuncList = FunctionModel.getPreFuncList();
			let index = FunctionModel.getPreViewIndex();
			if (!preFuncList || preFuncList.length == 0 || index == -1) {
				//已经没有预览了
				this.m_pNewFunc.visible = false;
				this.m_pOpenLev.visible = false;
				this.m_pNewFuncImg.visible = false;
				return;
			}
			this.m_pNewFunc.visible = false;
			let cfg = preFuncList[index];
			let state = FunctionModel.isFunctionOpen(cfg.id) ? 1 : 0;
			this.m_tCfgFunc = cfg;
			this.m_State = state;
			this.m_pIco.source = FunctionModel.getBtnSource(cfg.id);
			this.m_pOpenLev.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.m_tCfgFunc.openLevel);
			this.m_pOpenLev.visible = this.m_State == 0;
			this.m_pNewFuncImg.visible = this.m_State == 1;
			if (this.m_State == 1) {
				this.createFuncLabEffect();
			}
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private initEvent() {
			//boss
			EventManager.addTouchScaleListener(this.m_pBossBtn, this, () => {
				FunctionModel.openFunctionByType(FunctionType.BOSS);
			});

			this.m_pTest.visible = DEBUG;
			//测试工具界面
			EventManager.addTouchScaleListener(this.m_pTest, this, () => {
				Utils.open_view(TestNav.TEST_SETTING);
				// SceneManager.enterScene(SceneEnums.CROSS_WALL_WAR_MAP);

				// Utils.open_view(TASK_UI.CROSS_RESULT_VIEW, {isWin: true,duanWei:1,bestList:['1','2','3']});
			});


			// 变强
			EventManager.addTouchScaleListener(this.m_pNewFunc, this, () => {
				// Utils.open_view(TASK_UI.GET_REWARD_VIEW, Utils.parseCommonItemJson('1_100,2_2000,3_1000,4_300,5_100,6_100,7_100,8_100,9_100'));
				Utils.open_view(TASK_UI.POP_FUNCITON_PREVIEW_VIEW);

			});

			//挂机加速
			EventManager.addTouchScaleListener(this.m_btnSpeed, this, () => {
				Utils.open_view(TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW);
				// ScenePopQueWnd.addNewFuctionAnim([3, 4, 601, 701, 801, 1101, 1301, 1401, 1801, 1901, 2001, 2202, 2203, 2401, 2501, 2502, 2503, 2504, 2601]);
			});

			this.m_pVipService.visible = (PlatConst.isPlatJZ() && RoleData.vipIntegral >= 10000);
			// this.m_pVipService.visible = (RoleData.vipIntegral >= 10000);
			//VIP客服
			EventManager.addTouchScaleListener(this.m_pVipService, this, () => {
				Utils.open_view(TASK_UI.SERVICE_VIP);
			});


			// EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
			EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.onPatrolInfo, this);

			EventMgr.addEvent(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, this.createBossAttackEffect, this);

			EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_OPEN, this.onNewFunctionOpen, this);
			EventMgr.addEvent(RoleEvent.ROLE_VIP_EXP, this.refreshVipExp, this);

			this.m_hangAct.addEventListener("complete", this.onTweenComplete, this);
			EventMgr.addEvent(PatrolEvent.PATROL_KILL_MONSTER, this.onPatrolKillMonster, this);

		}

		private removeEvent() {
			EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
			EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_OPEN, this);
			EventMgr.removeEventByObject(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, this);
			EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
			EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_EXP, this);
			//皮肤动画移除
			if (this.m_pHangAct) {
				egret.Tween.removeTweens(this.m_pHangAct);
				this.m_hangAct.removeEventListener("complete", this.onTweenComplete, this);
			}

			EventMgr.removeEventByObject(PatrolEvent.PATROL_KILL_MONSTER, this);
			if (this.m_tFlyItems) {
				for (let i = 0; i < this.m_tFlyItems.length; i++) {
					egret.Tween.removeTweens(this.m_tFlyItems[i]);
				}
				this.m_tFlyItems = null;
			}
		}
		/**vip客服图标刷新 */
		private refreshVipExp() {
			this.m_pVipService.visible =PlatConst.isPlatJZ() && RoleData.vipIntegral >= 10000;
		}

		/**杀怪回调 */
		private static textrueList = ["baoshi_png", "exp_png", "exp_png", "exp_png", "exp_png", "exp_png", "juanzhou_png", "juanzhou_png"];
		private onPatrolKillMonster(starPos: egret.Point) {
			this.globalToLocal(starPos.x, starPos.y, starPos);
			let endPos = egret.Point.create(this.m_boxView.x + 60 + this.m_boxView.parent.x, this.m_boxView.y + this.m_boxView.parent.y);
			this.isOneFlyEnd = true;
			this.flyItemArr = [];
			this.m_curIndex = 0;
			for (let i = 0; i < MainHangBar.textrueList.length; i++) {
				let item = PImage.create(MainHangBar.textrueList[i]);
				item.x = starPos.x + Utils.random(-50, 50);
				item.y = starPos.y + Utils.random(-50, 50);
				// NodeUtils.setScale(item, 0.8);
				this.addChild(item);
				// let ctrlPos = new Point((item.x + endPos.x) * 0.5, item.y - Utils.random(150, 250));
				let ctrlPos = egret.Point.create(item.x - 60, item.y + (60 * (i % 2 == 1 ? -1 : 1)));
				let tmpPos = egret.Point.create(item.x, item.y);
				let itemObj = { item: item, lerp: 0, index: i };
				this.m_tFlyItems.push(itemObj);
				this.flyItemArr.push(item);
				var funcChange = function (): void {
					let curPos = Utils.BezierCurve(tmpPos, endPos, ctrlPos, itemObj.lerp);
					itemObj.item.x = curPos.x;
					itemObj.item.y = curPos.y;
					egret.Point.release(curPos);
				}
				item.visible = false;

				let tw = egret.Tween.get(itemObj, { onChange: funcChange }, Ease.cubicOut);
				tw.wait(i * 50);
				tw.call(() => { item.visible = true }, this);
				tw.to({ lerp: 1 }, 700);
				//对象回收
				tw.call(() => {
					egret.Point.release(ctrlPos);
					egret.Point.release(tmpPos)
				}, this);
				tw.call(this.flyEnd, this, [itemObj]);
			}
		}

		/**道具飞行回调 */
		private flyEnd(itemObj: { item: PImage, lerp: number, index: number }) {
			this.m_curIndex++;
			if (PatrolModel.isInitFlyEnd) {
				PatrolModel.isInitFlyEnd = false;
				// com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_FLY_END, null);
			}
			if (this.m_curIndex == 3) {
				this.m_boxView.playBoxGetAwardEffect();
				this.hideFlyItem();
				Sound.playID(135);
			}
			itemObj.item.onDestroy();
			for (let i = 0; i < this.m_tFlyItems.length; i++) {
				if (this.m_tFlyItems[i].index == itemObj.index) {
					this.m_tFlyItems.splice(i, 1);
					return;
				}
			}

		}
		public hideFlyItem() {
			for (let index = 0; index < this.flyItemArr.length; index++) {
				if (this.flyItemArr[index]) {
					this.flyItemArr[index].visible = false;
				}
			}
		}
		/**信息刷新 */
		private onPatrolInfo() {
			this.refreshHangAwardTips();
		}

		/**
		 * 新功能开启(按钮加入列表 通过FunctionManager 调用onFunctionPanelClose加入) 
		 * 预告按钮清理
		 * */
		private onNewFunctionOpen(ft: number) {
			if (ft == FunctionType.BOSS) {
				let redState = BossModel.GetSingeBtnState() || BossModel.GetRankBtnState() || BossModel.GetWorldBtnState();
				if (redState) {
					this.createBtnBossEffect();
				} else {
					this.clearBtnBossEffect();
				}
				this.m_pBossBtn.visible = FunctionModel.isFunctionOpen(FunctionType.BOSS);
			}
		}


		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		//=============================================================================================================================================
		//特效 begin
		//============================================================================================================================================= 

		/**设置boss按钮特效 */
		private createBtnBossEffect() {
			if (this.m_btnBossEff) return;
			this.m_btnBossEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
			this.m_btnBossEff.x = 45;
			this.m_btnBossEff.y = 45;
			this.m_btnBossEff.scaleY = 0.9;
			this.m_pBossBtn.addChild(this.m_btnBossEff);
		}

		/**boss来袭特效 */
		private createBossAttackEffect() {
			this.m_imgMask.visible = true;
			this.m_bossAttack = new MCDragonBones();
			this.m_bossAttack.initAsync(IETypes.EUI_BOSS_Attact);
			this.m_bossAttack.playOnceDone(IETypes.EUI_BOSS_Attact, () => {
				if (this.m_imgMask) {
					this.m_imgMask.visible = false;
					this.m_bossAttack.destroy();
				}
			}, this);
			this.m_bossAttack.x = 667;
			this.m_bossAttack.y = 400;
			this.m_bossAttack.scaleX = 1 / 0.64;
			this.m_bossAttack.scaleY = 1 / 0.64;
			this.addChild(this.m_bossAttack);

		}
		/**设置文字特效 */
		public createFuncLabEffect() {
			egret.Tween.get(this.m_pNewFuncImg, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
		}
		/**清除文字特效 */
		public clearFuncLabEffect() {
			egret.Tween.removeTweens(this.m_pNewFuncImg);
		}
		private clearBtnBossEffect() {
			if (this.m_btnBossEff) {
				NormalMcMgr.removeMc(this.m_btnBossEff);
				this.m_btnBossEff = null;
			}
		}
		private clearBossAttackEffc() {
			if (this.m_bossAttack) {
				this.m_bossAttack.destroy();
				this.m_bossAttack = null;
			}
		}
		//=============================================================================================================================================
		//特效 end
		//============================================================================================================================================= 

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_HANG);
		}


	}
}
