

module com_main {
	export class MissionViewItemBox extends CComponent {

		private m_pCfg: LivesRewardConfig;
		private m_index: number;
		private m_ActiveRoot: eui.Group;
		private m_pLbValue: CLabel;
		public m_groupBase: eui.Group;	//宝箱容器

		private m_pEffect: BoxEffect;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/mission/MissionViewItemBoxSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_groupBase, this, this.onClickItem);
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			if (this.m_pEffect) {
				this.m_pEffect.onDestroy();
				this.m_pEffect = null;
			}
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}


		//活跃度领取
		private onClickItem(e: egret.Event) {
			let info = MissionModel.getActiveInfoById(this.m_index);
			switch (info.state) {
				case 0: {
					Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: this.m_pCfg.Reward });
					break;
				}
				case 1: {
					MissionProxy.send_MISSION_ACTIVE_REWAED(this.m_index);
					break;
				}
				case 2: {
					EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
					break;
				}
			}
		}

		public init(id: number) {
			this.m_index = id;
			this.m_pCfg = C.LivesRewardConfig[id];
			this.m_pLbValue.text = this.m_pCfg.liveness + "";
		}
		/**激活状态 0-不能领取 1-可领取 2-已领取 */
		public updateCell() {
			let info = MissionModel.getActiveInfoById(this.m_index);

			if (info.state == 2) {
				this.m_ActiveRoot.visible = true;
				if (this.m_pEffect) {
					this.m_pEffect.onDestroy();
					Utils.removeFromParent(this.m_pEffect);
					this.m_pEffect = null;
				}
			} else {
				this.m_ActiveRoot.visible = false;
				this.showEffect(info.state);
			}
		}

		private showEffect(state) {
			let tempType = 1;
			if (this.m_index <= 2)
				tempType = 1;
			else if (this.m_index <= 4) {
				tempType = 2;
			} else {
				tempType = 3;
			}

			let isShowEffect = false;
			if (state == 1) {
				isShowEffect = true;
			}
			if (!this.m_pEffect) {
				this.m_pEffect = new BoxEffect(tempType, isShowEffect);
				this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
				this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
				this.m_pEffect.x = 60;
				this.m_pEffect.y = 74;
				this.m_groupBase.addChild(this.m_pEffect);
			}
			this.m_pEffect.setEffectEnable(isShowEffect);
		}
	}

	export class BoxEffect extends CComponent {

		private m_pIcon: CImage;
		private m_pEffectRoot: eui.Group;
		private m_pBoxEffect: egret.tween.TweenGroup;

		private m_pMC0: MCDragonBones;
		private m_pMC1: MCDragonBones;
		private m_pMCList: MCDragonBones[];

		private iconPath: string;
		private m_pCurloadCount = 0;

		/**箱子类型 1 木箱，2蓝色箱子，3金箱子 */
		private m_pBoxType: number;
		private m_pIsShowEffect: boolean = false;


		public constructor(boxType?: number, isShowEffect?: boolean) {
			super();
			this.skinName = Utils.getSkinName("app/mission/BoxEffectSkin.exml");
			if (isShowEffect) {
				this.m_pIsShowEffect = isShowEffect;
			}
			if (boxType) {
				this.m_pBoxType = boxType;
			}
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_pMCList = [];
			this.m_pBoxEffect.addEventListener("complete", this.actionComplete, this);
			this.setEffectEnable(this.m_pIsShowEffect);

		}

		public setEffectEnable(isShowEffect: boolean = false) {
			if (isShowEffect)
				this.m_pBoxEffect.play(0);
			else
				this.m_pBoxEffect.stop();

			this.m_pIsShowEffect = isShowEffect;
			let iconPath = "bx-bu_png";
			switch (this.m_pBoxType) {
				case 1: {
					iconPath = !isShowEffect ? "bx-bu_png" : "bx-bul_png";
					break;
				}
				case 2: {
					iconPath = !isShowEffect ? "bx-lan_png" : "bx-lanl_png";
					break;
				}
				case 3: {
					iconPath = !isShowEffect ? "bx-jin_png" : "bx-jinl_png";
					break;
				}
			}
			this.m_pIcon.source = iconPath;
			if (isShowEffect && this.m_pMCList.length == 0) {
				this.initAnimation();
			}
			for (let index = 0; index < this.m_pMCList.length; index++) {
				this.m_pMCList[index].visible = this.m_pIsShowEffect;
			}
		}

		private initAnimation() {
			this.m_pCurloadCount = 0;
			// this.m_pMC0 = new MCDragonBones();
			// this.m_pMC0.initAsync(IETypes.EUI_BoxEffect01);
			// this.m_pMC0.addLoadCompleteEvent(()=>{
			// 	this.m_pCurloadCount++;
			// 	if(this.m_pCurloadCount==2){
			// 		this.onShowEffect();
			// 	}
			// },this);
			// this.m_pMC0.play(IETypes.EUI_BoxEffect01,0);
			// this.m_pEffectRoot.addChildAt(this.m_pMC0,0);
			this.createMc(IETypes.EUI_BoxEffect01, 0);
			this.createMc(IETypes.EUI_BoxEffect02, 2);

		}

		private createMc(mcName: string, layerIndex: number, ) {
			let tempMc = new MCDragonBones();
			tempMc.initAsync(mcName);
			tempMc.addLoadCompleteEvent(() => {
				this.m_pCurloadCount++;
				if (this.m_pCurloadCount == 2) {
					this.onShowEffect();
				}
			}, this);
			tempMc.x = this.m_pEffectRoot.width * 0.5;
			tempMc.y = this.m_pEffectRoot.height * 0.5;
			tempMc.play(mcName, 0);
			this.m_pEffectRoot.addChildAt(tempMc, layerIndex);

			this.m_pMCList.push(tempMc);
		}

		//动画加载完成
		private onShowEffect() {
			this.m_pBoxEffect.play(0);
		}

		//tween完成
		private actionComplete() {
			if (this.m_pBoxEffect)
				this.m_pBoxEffect.play(0);
			else {
				error("动画回调没用清除--------------------------");
			}
		}

		public onDestroy(): void {
			if (this.m_pEffectRoot) {
				egret.Tween.removeTweens(this.m_pEffectRoot);
				this.m_pBoxEffect.removeEventListener("complete", this.actionComplete, this);
				this.m_pBoxEffect = null;
			}

			if (this.m_pMCList) {
				for (let index = 0; index < this.m_pMCList.length; index++) {
					let mc = this.m_pMCList[index];
					mc.destroy();
				}
				this.m_pMCList = null;
			}
			super.onDestroy();
		}
	}
}