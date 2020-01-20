module com_main {
	/**武将展示卡 */
	export class GeneralSliderRende extends CComponent {
		public m_genCard: com_main.ComGenCard;
		public image_country: com_main.CImage;
		public image_fate: eui.Group;
		public image_general_type: com_main.CImage;
		public m_labName: com_main.CLabel;
		public m_pIcon: eui.Group;
		public m_imgIcon0: eui.Image;
		public m_imgXian: eui.Image;
		public m_imgIcon1: eui.Image;
		public m_conEffCard: eui.Group;
		public m_comFightItem: com_main.ComFightItem;
		public m_labAddFight: eui.Label;
		public m_conEffNum: eui.Group;
		public m_conEffLab: eui.Group;
		public m_imgSorceEff: com_main.CImage;
		public group_starBg: eui.Group;
		public group_star: eui.Group;
		public m_pStar: eui.Group;
		public m_upAc: eui.Group;
		public m_pLvRoot: eui.Group;
		public m_labPlayerVip: eui.BitmapLabel;
		public m_imgLvPic: eui.Image;



		private m_generalId: number;
		private m_generalVo: GeneralVo;

		public m_nStarType: number;		//星星类型
		public image_general_star: eui.Image;//第一个星 
		private m_nOldLv: number;	//旧等级
		private m_nOldStar: number;
		private m_nChangeFight: number;
		private m_nOldupLevel: number;	//旧突破等级
		private upAction: egret.tween.TweenGroup;
		private upLevelMc: MCDragonBones;
		private m_bIsMc: boolean = true;
		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("general/tabView/General_slider_render.exml");
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			super.onDestroy();
			if (this.upLevelMc) {
				this.upLevelMc.destroy();
				this.upLevelMc = null;
			}
			this.removeEvent();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initEvent();
		}

		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		private initEvent() {
			this.upAction.addEventListener("complete", this.onPlayComplete, this);
			EventManager.addTouchTapListener(this.image_fate, this, this.onClickFate);

		}

		private removeEvent() {
			this.upAction.removeEventListener("complete", this.onPlayComplete, this);
			EventManager.removeEventListeners(this);
		}

		public onPlayComplete() {
			this.m_upAc.visible = false;
		}
		/**点击缘分按钮 */
		public onClickFate() {
			if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_FATE)) {
				Utils.open_view(TASK_UI.FATE_GENERAL_VIEW, this.m_generalId);
			}

		}
		/**=====================================================================================
	   * 事件监听 end
	   * =====================================================================================
	   */
		/**宝物动画 */
		public refreshTreasureAction() {
			let list = this.m_generalVo.getAttributeChangeValues();
			let fight = list.pop();
			this.showFightUpEffect(list);
			this.m_nChangeFight = Number(fight);
		}

		/**升星动画 */
		public refreshUpStarAction() {
			let list = this.m_generalVo.getAttributeChangeValues();
			this.m_nOldStar = this.m_generalVo.star;

			let fight = list.pop();
			this.showFightUpEffect(list);
			this.refreshStarView();
			this.m_nChangeFight = Number(fight);
			this.playUpLvEffect();
		}

		/**升级动画 */
		public refreshUpLevelAction() {
			if (this.m_generalVo.level - this.m_nOldLv > 0) {
				let list = this.m_generalVo.getLevelGrowViewValues(this.m_generalVo.level - this.m_nOldLv);
				this.m_nOldLv = this.m_generalVo.level;
				let fight = list.pop();
				this.showFightUpEffect(list);
				this.m_nChangeFight = Number(fight);
				// this.playUpLvEffect();
				this.playStarAni();
				this.m_upAc.visible = true;
				this.upAction.play(0)
			}
		}
		public playStarAni() {
			this.upLevelMc = new MCDragonBones();
			this.upLevelMc.initAsync(IETypes.EUI_UNLOCK);
			this.upLevelMc.play(IETypes.EUI_UNLOCK,1,true)
			this.upLevelMc.scaleX = 4;
			this.upLevelMc.scaleY = 4;
			this.upLevelMc.x = 10;
			this.upLevelMc.y = -100;
			this.m_pStar.addChild(this.upLevelMc);

		}
		/**突破动画 */
		public refreshTuPoAction() {
			this.playUpLvEffect();
		}

		public refreshInfo(isAction: boolean = false) {
			this.clearFightAddEffect();
			this.refreshFightView(isAction);
			this.refreshStarView();
		}

		/**刷新星星 */
		private refreshStarView(isEffect: boolean = false) {
			if (this.m_generalVo) {
				let startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
				let starNum = startCfg.starlevel;
				let res = GeneralModel.getStarRes(startCfg.starType);
				this.refreshStarBg(startCfg.starType);
				this.group_star.removeChildren();
				for (let i = 0; i < starNum; i++) {
					let contain = new eui.Group();
					contain.width = 55;
					contain.height = 55;
					let star = new eui.Image(res);
					star.width = 55;
					star.height = 55;
					contain.addChild(star);
					this.group_star.addChild(contain);
					if (i == (starNum - 1) && isEffect) {
						this.playStarEffect(contain);
					}
				}
			}
		}

		/**刷新星星背景 */
		public refreshStarBg(type: number) {
			if (this.m_nStarType == type) {
				return;
			}
			this.m_nStarType = type;
			Utils.removeAllChild(this.group_starBg);
			let res = GeneralModel.getStarBgRes(this.m_nStarType);
			for (let i = 0; i < 5; i++) {
				let star = new eui.Image(res);
				star.width = 55;
				star.height = 55;
				this.group_starBg.addChild(star);
			}
		}
		private refreshFate() {
			this.image_fate.visible = FateModel.getGeneralFateViewDataByGenId(this.m_generalId).length > 0;
		}
		/**星星特效 */
		private playStarEffect(contain: eui.Group) {
			let effect = NormalMcMgr.createMc(IETypes.EUI_GenUpStar, false);
			effect.x = 27.5;
			effect.y = 27.5;
			contain.addChild(effect);
			effect.playNorOnce(IETypes.EUI_GenUpStar, () => {
				NormalMcMgr.removeMc(effect);
			}, this);
		}

		/**刷新战力 */
		private refreshFightView(isAction: boolean) {
			let fight = 0;
			if (this.m_generalVo.own) {
				fight = this.m_generalVo.fight;
			} else {
				fight = this.m_generalVo.config.fight
			}
			if (this.m_nChangeFight && this.m_nChangeFight != 0) {
				if (this.m_nChangeFight > 0) {
					this.m_labAddFight.textColor = GameConfig.TextColors.green;
					this.m_labAddFight.text = "+" + this.m_nChangeFight;
				} else {
					this.m_labAddFight.textColor = GameConfig.TextColors.red;
					this.m_labAddFight.text = this.m_nChangeFight + "";
				}
				egret.Tween.removeTweens(this.m_labAddFight);
				this.m_labAddFight.alpha = 1;
				// this.m_labAddFight.scaleY = 0.5;
				let tw = egret.Tween.get(this.m_labAddFight);
				for (let i = 0; i < 5; i++) {
					tw.to({ alpha: 0 }, 100);
					tw.to({ alpha: 1 }, 100);
				}
				tw.to({ alpha: 0 }, 500, egret.Ease.sineIn);
				tw.call(() => {
					if (this.m_comFightItem) {
						this.playFightEffect();
						this.m_comFightItem.setFight(fight, true);
					}
				}, this);

				this.m_nChangeFight = 0;

			} else {
				this.m_comFightItem.setFight(fight, isAction);
				this.m_labAddFight.alpha = 0;
			}
		}
		/**清理战力动画 */
		private clearFightAddEffect() {
			this.m_nChangeFight = 0;
			this.m_labAddFight.alpha = 0;
			egret.Tween.removeTweens(this.m_labAddFight);
		}

		/**战斗力特效 */
		private playFightEffect() {
			let effect = NormalMcMgr.createMc(IETypes.EUI_GenUpFightNum, false);
			effect.playNorOnce(IETypes.EUI_GenUpFightNum, () => {
				NormalMcMgr.removeMc(effect);
			}, this);
			this.m_conEffNum.addChild(effect);
		}

		/**升级特效 */
		private playUpLvEffect() {
			let effect = NormalMcMgr.createMc(IETypes.EUI_GenUpFightCard, false);
			effect.playNorOnce(IETypes.EUI_GenUpFightCard, () => {
				NormalMcMgr.removeMc(effect);
			}, this);
			this.m_conEffCard.addChild(effect);
		}


		public get generalId() {
			return this.m_generalId;
		}

		public set generalId(id: number) {
			if (this.m_generalId == id) return;
			this.m_generalId = id;
			if (this.m_generalId) this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			if (!this.m_generalVo) return;
			this.refreshFate();
			let warPos = this.m_generalVo.config.warPosition;
			let array = warPos.split(",");
			this.refreshInfo();
			this.m_imgIcon0.source = '';
			this.m_imgIcon1.source = '';
			this.m_imgXian.source = '';
			for (let k = 0; k < array.length; k++) {
				this['m_imgIcon' + k].source = 'lb_pos_' + array[k] + '_png';
			}
			this.m_imgXian.source = array.length >= 2 ? 'lb_xiegang_png' : '';
			this.m_labName.text = GeneralModel.getGeneralName(this.m_generalId);
			this.m_labName.textColor = Utils.getColorOfQuality(this.m_generalVo.qualityLevel);
			this.m_pIcon.y = this.m_labName.height + this.m_labName.y + 20;
			this.image_general_type.source = this.m_generalVo.getGeneralOccupationIcon(2);
			this.image_country.source = GeneralModel.getSoldierNationLogo(this.m_generalVo.config.nationType);

			this.m_nOldStar = this.m_generalVo.star;
			this.m_nOldLv = this.m_generalVo.level;
			this.m_nOldupLevel = this.m_generalVo.upgradeLevel;
			// this.m_generalVo.recordAttribute();

			this.refreshCardView();
		}

		/**关闭动画 */
		public closeMc() {
			this.m_bIsMc = false;
		}
		/**刷新卡牌 */
		private refreshCardView() {
			this.m_genCard.setInfo(this.m_generalId, this.m_bIsMc);
		}

		/**战力提升动画 */
		private showFightUpEffect(effectList: Array<string>) {
			TipsUtils.showTipsFightUpList(effectList, new egret.Point(0, 0), this.m_conEffLab);
		}
		/**查看武将详情专用==================================================================================================== */
		/**单独设置战力*/
		public setFight(fight: number) {
			this.m_comFightItem.setFight(fight);
		}
		/**单独设置星级*/
		public setStarNum(star: number) {
			if (this.m_generalVo) {
				let startCfg = GeneralModel.getStarCfg(star);
				let starNum = startCfg.starlevel;
				let res = GeneralModel.getStarRes(startCfg.starType);
				this.refreshStarBg(startCfg.starType);

				this.group_star.removeChildren();
				for (let i = 0; i < starNum; i++) {
					let contain = new eui.Group();
					contain.width = 55;
					contain.height = 55;
					let star = new eui.Image(res);
					star.width = 55;
					star.height = 55;
					contain.addChild(star);
					this.group_star.addChild(contain);
				}
			}
		}
		/**设置武将等级 */
		public setGenlv(level: number) {
			this.m_pLvRoot.visible = true;
			this.m_labPlayerVip.text = level + '';
			this.m_imgLvPic.x = this.m_labPlayerVip.x + this.m_labPlayerVip.width;
		}
		/**================================================================================================================== */
	}
}