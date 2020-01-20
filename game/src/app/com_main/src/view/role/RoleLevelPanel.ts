module com_main {
	export class RoleLevelPanel extends CView {
		public static NAME = 'RoleLevelPanel';

		public m_pGobal: eui.Group;
		public m_pBg: eui.Image;
		public border_1001: eui.Rect;
		public m_rLev: eui.BitmapLabel;
		public m_Bar: com_main.CImage;
		public m_LightBar: com_main.CImage;
		public m_genLevel: eui.Label;
		public m_genCard: com_main.ComGenCard;
		public group: eui.Group;
		public m_tName: eui.Image;
		public m_pFunc: eui.Group;
		public m_pFuncIcon: com_main.CImage;
		public m_pFuncName: com_main.CLabel;
		public m_pFuncLev: com_main.CLabel;
		public m_pFuncDesc: com_main.CLabel;

		private m_remind: number;
		private unlockMc: MCDragonBones;
		private m_level: number = 0;
		private roleTween: egret.Tween;
		private actionGroup: egret.tween.TweenGroup;
		private timeKey: number;
		public constructor() {
			super();
			this.initApp("role/RoleLevelPanelSkin.exml");
		}

		public onDestroy() {
			EventManager.removeEventListeners(this);
			Utils.TimerManager.remove(this.handlerTween, this);
			egret.clearTimeout(this.timeKey)
			if (this.unlockMc) {
				this.unlockMc.destroy();
			}
			if (this.m_Bar)
				egret.Tween.removeTweens(this.m_Bar);
			if (this.m_LightBar)
				egret.Tween.removeTweens(this.m_LightBar);
			this.unlockMc = null;
			if (this.m_pGobal)
				egret.Tween.removeTweens(this.m_pGobal);
			if (this.m_pFunc)
				egret.Tween.removeTweens(this.m_pFunc);
			if (this.m_genCard)
				egret.Tween.removeTweens(this.m_genCard);
			super.onDestroy();
			if (GiftBagModel.isPopItem) {
				Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP,{type:1,giftId:GiftBagModel.jumpId});
			}

			SceneResGroupCfg.clearModelRes([ModuleEnums.LEVELUP_VIEW]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_level = RoleData.lastLevel;
			this.initEvent();
			this.updateUI();

			platform.reportData(ReportType.levelup);
		}
		public updateUI() {
			this.m_pFunc.visible = false;
			this.createAni();
			this.updateLevel()
			Utils.TimerManager.doTimer(50, 1, this.handlerTween, this);
			// egret.callLater(() => {

			// }, this);


		}
		public handlerTween() {
			this.playTween();
			this.actionGroup.play();
			this.playLastExpTween();
		}
		public playStarAni() {
			this.unlockMc = new MCDragonBones();
			this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
			this.unlockMc.play(IETypes.EUI_UNLOCK, 1, true)
			this.unlockMc.scaleX = 4;
			this.unlockMc.scaleY = 4;
			this.unlockMc.x = 1550 / 2
			this.unlockMc.y = 300;
			this.addChild(this.unlockMc);

		}
		public playLastExpTween() {
			if (isNull(this.m_Bar)) return;
			this.timeKey = egret.setTimeout(() => {
				let curW: number = Math.min(Math.floor((RoleData.lastExp / RoleData.getPlayerLevelUpExp(RoleData.lastLevel)) * 400), 400);
				curW = curW ? curW : 0;
				Tween.get(this.m_Bar).to({ width: curW }, 10).to({ width: 400 }, 350).call(() => {
					this.m_level = RoleData.level;
					this.refreshLevel();
					this.playStarAni();
					egret.clearTimeout(this.timeKey)
					this.playCurExpTween();
					this.playLightExpTween();
					this.playFuncOpenTween();
					egret.Tween.removeTweens(this.m_Bar);
				});
			}, this, 167)
		}
		public playLightExpTween() {
			if (isNull(this.m_LightBar)) return;
			this.m_LightBar.visible = true;
			Tween.get(this.m_LightBar).wait(167).call(() => {
				egret.Tween.removeTweens(this.m_LightBar);
				this.m_LightBar.visible = false;
			});

		}
		public playCurExpTween() {
			if (isNull(this.m_Bar)) return;
			this.m_Bar.width = 0;
			let curW: number = Math.min(Math.floor((RoleData.exp / RoleData.getPlayerLevelUpExp(RoleData.level)) * 400), 400);
			curW = curW ? curW : 0;
			Tween.get(this.m_Bar).to({ width: curW }, 200).call(() => {
				egret.Tween.removeTweens(this.m_Bar);
			});
		}
		/**功能开放展开动画 */
		public playFuncOpenTween() {
			let lastFuncCfg: FunctionConfig = FunctionModel.getLastFuncCfg();
			if (isNull(lastFuncCfg))
				return;
			this.m_pFunc.visible = true;
			Tween.get(this.m_pFunc).to({ alpha: 1, y: 243 }, 400).call(() => {
				egret.Tween.removeTweens(this.m_pFunc);
			});
		}
		private onAllComplete() {
			// EventMgr.dispatchEvent(GuideEvent.GUIDE_BATTLE_WIN_COMPOUND_ANI, null);
		}

		public updateLevel() {
			this.m_pGobal.mask = this.border_1001;
			// this.m_pFunc.mask = this.border_func;
			this.refreshLevel();
			let lastFuncCfg: FunctionConfig = FunctionModel.getLastFuncCfg();
			this.m_Bar.width = Math.min((RoleData.lastExp / RoleData.getPlayerLevelUpExp(RoleData.lastLevel)) * 400, 400);
			this.m_pFunc.visible = lastFuncCfg != null;
			if (isNull(lastFuncCfg))
				return;
			this.m_pFuncIcon.source = FunctionModel.getBtnSource(lastFuncCfg.id);
			this.m_pFuncName.text = lastFuncCfg.name;
			this.m_pFuncDesc.textFlow = Utils.htmlParser(GLan(lastFuncCfg.text));
			this.m_pFuncLev.text = GCodeFromat(CLEnum.FUNC_LEVEL, lastFuncCfg.openLevel)

		}
		public refreshLevel() {
			this.m_rLev.text = `${this.m_level}`;
			this.m_genLevel.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.GEN_LEVEL, this.m_level));
		}
		public createAni() {
			this.m_genCard.setInfo(1021, true);
		}

		public playTween() {
			this.m_genCard.alpha = 0.3;
			this.m_genCard.y = 460;
			Tween.get(this.m_genCard).to({ y: 441, scaleY: 1.1, alpha: 1 }, 167).to({ scaleY: 0.85 }, 125).call(() => {
				egret.Tween.removeTweens(this.m_genCard);
			});
			// this.m_pHeroRoot.alpha = 0.3;
			// this.m_pHeroRoot.y = 600;
			// Tween.get(this.m_pHeroRoot).to({ y: 446, scaleY: 1.1, alpha: 1 }, 167).to({ scaleY: 1 }, 125).call(() => {
			// 	egret.Tween.removeTweens(this.m_pHeroRoot);
			// });
			// Tween.get(this.m_pGobal).to({ scaleY: 0.1 }, 10).to({ scaleY: 1 }, 500).call(() => {
			// 	egret.Tween.removeTweens(this.m_pGobal);
			// });
		}
		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		private initEvent() {
			EventManager.addTouchTapListener(this, this, this.onClickTurn);
		}
		/**跳转前往 */
		public onClickTurn() {
			UpManager.history();
		}

	}
}