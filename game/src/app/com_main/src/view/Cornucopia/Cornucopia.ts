module com_main {

	export class Cornucopia extends CView {

		private m_show = false;
		public static NAME = 'Cornucopia';

		private m_MainTopNew: MainTopNew;
		private m_cornucopiaBtn: ComButton;
		private m_effect: MCDragonBones;	//按钮特效

		private m_getBtn: ComButton;
		private m_pRemainTime = 0;
		private m_refreshTime: eui.Label;
		private m_SilverValue: eui.Label;	//获得银子数量

		private m_consume: eui.Label;	//消耗元宝 / 剩余免费次数
		private m_coinGroup: eui.Group;
		private m_freeGroup: eui.Group;
		private m_addLabel: eui.Label;		//获得元宝数量
		private m_labLeftBuy: eui.Label;		//剩余购买次数

		private m_groupAction: eui.Group;	//抖动组
		private m_conEffBox: eui.Group;	//盆特效容器
		private m_conEffSliver: eui.Group;	//钱特效
		private m_conEffGold: eui.Group;	//钱特效
		private m_effectType: number = 0;

		public constructor() {
			super();
			this.name = Cornucopia.NAME;
			this.initApp("Cornucopia/CornucopiaSkin.exml");
		}

		public onDestroy(): void {
			super.onDestroy();

			egret.Tween.removeTweens(this.m_conEffBox);
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
			this.removeBtnEffect();
			Utils.TimerManager.remove(this.updateRemainTime, this);
			this.m_show = false;

			SceneResGroupCfg.clearModelRes([ModuleEnums.CORNUCOPIA_UI]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_MainTopNew.setTitleName(GCode(CLEnum.CORN));
			this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
			this.m_cornucopiaBtn.setTitleLabel(GCode(CLEnum.CORN_JB));
			this.addBtnEffect();
			this.m_getBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));

			this.m_show = true;

			EventManager.addTouchScaleListener(this.m_cornucopiaBtn, this, this.onClickCornucopai);
			this.m_getBtn["sound_queren"] = SoundData.getSureSound();
			EventManager.addTouchScaleListener(this.m_getBtn, this, this.onClickget);
			EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.OnBuildUpLevel, this);
			this.initView();

			/**领取红点监听 */
			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_cornucopiaBtn, { x: 232, y: -5 }, [RedEvtType.CORN], 2);
			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_getBtn, { x: 115, y: -2, scale: 0.78 }, [RedEvtType.CORN_AWARD], 2)

			this.onGuideCondition();
		}

		/**按钮特效 */
		private addBtnEffect() {
			this.m_effect = new MCDragonBones();
			this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
			this.m_effect.play(IETypes.EUI_BtnEffect02);
			this.m_effect.x = 135;
			this.m_effect.y = 47.5;
			this.m_cornucopiaBtn.addChild(this.m_effect);
		}
		/**按钮特效 */
		private removeBtnEffect() {
			if (this.m_effect) {
				this.m_effect.destroy();
				this.m_effect = null;
			}
		}

		/**建筑升级 */
		private OnBuildUpLevel(id: number) {
			let info = MainMapModel.getBuildInfo(id);
			if (info && info.type == BuildingType.FUDING) {
				this.initView();
			}
		}

		private playEffect(type: number = 0) {
			this.m_effectType = type;
			let boxEff = new MCDragonBones();
			boxEff.initAsync(IETypes.EUI_CornucopiaBox);
			boxEff.play(IETypes.EUI_CornucopiaBox, 1, true);
			this.m_conEffBox.addChild(boxEff);

			let ox = 87.99;
			let oy = 0;
			let tw = egret.Tween.get(this.m_groupAction, null, null, true);

			let shakeInterval = 50;
			let shakeRange = 20;

			for (let i: number = 0; i < 4; i++) {
				tw.to({ x: ox + shakeRange }, shakeInterval);
				tw.to({ x: ox }, shakeInterval);
				tw.to({ x: ox - shakeRange }, shakeInterval);
			}
			tw.to({ x: ox, y: oy }, shakeInterval);
			tw.call(() => {
				if (this.m_conEffSliver && this.m_conEffGold) {
					if (this.m_effectType == 0) {
						let sliverEff = new MCDragonBones();
						sliverEff.initAsync(IETypes.EUI_CornSilver);
						sliverEff.play(IETypes.EUI_CornSilver, 1, true);
						this.m_conEffSliver.addChild(sliverEff);
					} else {
						let goldEff = new MCDragonBones();
						goldEff.initAsync(IETypes.EUI_CornGold);
						goldEff.play(IETypes.EUI_CornGold, 1, true);
						this.m_conEffGold.addChild(goldEff);
					}
				}
			}, this);
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_TREASURE_WASHBOWL_USE,
				ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_TREASURE_WASHBOWL_USE: {
					this.initView();
					this.playEffect(0);
					break;
				}
				case ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD: {
					this.playEffect(1);
					this.refreshGoldView();
					break;
				}
			}
		}
		private initView() {
			this.refreshGoldView();

			let info = CornucopiaModel.getCornucopiaInfo();
			this.m_coinGroup.visible = false;
			this.m_freeGroup.visible = false;
			let cfg = C.GenerateCoinConfig;
			let maxCost = ConstUtil.getValue(IConstEnum.JACKPOT_ALL_COUNT_LIMIT);

			let data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
			if (CornucopiaModel.isMaxGetToday()) {
				//今天聚宝次数已经达到上限
				this.m_freeGroup.visible = false;
				this.m_coinGroup.visible = true;
				this.m_consume.text = "0";
				this.m_SilverValue.text = "0";
				this.m_labLeftBuy.text = "0";
				return;
			}
			let freeCost = ConstUtil.getValue(IConstEnum.CORNUCOPIA_FREE);
			let consumeGold = CornucopiaModel.getCornucopiaCost();
			if (data.buyAmountCount <  freeCost) {
				this.m_consume.text = (freeCost - data.buyAmountCount) + "";
				this.m_freeGroup.visible = true;
			} else {
				this.m_coinGroup.visible = true;
				this.m_consume.text = "" + consumeGold;
			}
			this.m_SilverValue.text = CornucopiaModel.getCornucopiaSliverbyCount(data.buyAmountCount + 1) + "";
			this.m_labLeftBuy.text = CornucopiaModel.GetLeftBuyNum() + "";
		}

		/**刷新元宝领取显示 */
		private refreshGoldView() {
			Utils.TimerManager.remove(this.updateRemainTime, this);
			this.m_pRemainTime = CornucopiaModel.getGoldRushTime();
			if (this.m_pRemainTime <= 0) {
				this.m_pRemainTime = 0;
				this.m_getBtn.disabled = false;
			} else {
				this.m_getBtn.disabled = true;
				Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
			}

			this.m_addLabel.text = CornucopiaModel.getGoldNum() + "";

			this.m_refreshTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
		}


		private updateRemainTime() {
			if (--this.m_pRemainTime > -1) {
				this.m_refreshTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
			} else {

				this.m_refreshTime.text = "00:00:00";
				Utils.TimerManager.remove(this.updateRemainTime, this);
				CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO();
			}
		}

		//点击聚宝盆
		private onClickCornucopai() {
			if (CornucopiaModel.isMaxGetToday()) {
				EffectUtils.showTips(GCode(CLEnum.CORN_GET_FAL), 1, true);
				return;
			}
			let cost = CornucopiaModel.getCornucopiaCost();
			if (PropModel.isItemEnough(PropEnum.GOLD, cost,1)) {
				CornucopiaProxy.C2S_TREASURE_WASHBOWL_USE();
			}
		}
		//点击获取
		private onClickget() {
			CornucopiaProxy.C2S_TREASURE_WASHBOWL_EXTRAGOLD();
		}
		//关闭页面
		private onClickBack() {
			com_main.UpManager.history();
		}

		public static getClass(): Cornucopia {
			let obj = SceneManager.getClass(LayerEnums.POPUP, Cornucopia.NAME);
			return obj;
		}

		/**检查新手引导面板条件 */
		public onGuideCondition(){
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION,IGUIDECD.CORNUCOPIA_WND);
		}


	}
}