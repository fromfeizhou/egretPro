module com_main {
	export class GeneralGetInfoWnd extends CView {
		public static NAME = "GeneralGetInfoWnd";

		public m_groupInfo: eui.Group;
		public group: eui.Group;
		public m_imgCardBg: com_main.CImage;
		public m_imgCard: eui.Image;
		public m_imgCardMask: com_main.CImage;
		public m_labGroupNum: eui.Label;
		public m_labName: eui.Label;
		public m_imgCardMk: com_main.CImage;
		public m_conEffect: eui.Group;
		public m_gStar: eui.Group;
		public m_star1: eui.Group;
		public m_star2: eui.Group;
		public m_star3: eui.Group;
		public m_star4: eui.Group;
		public m_star5: eui.Group;
		public m_labExtend: com_main.CLabel;
		public image: eui.Image;
		public m_btnSure: com_main.ComButton;
		public m_leftInfo: eui.Group;
		public m_labType: eui.Label;
		public m_labTypeDis: eui.Label;
		public m_leftInfoMask: eui.Group;
		public m_rightInfo: eui.Group;
		public m_labRightDis: eui.Label;
		public m_imgSoldierType: eui.Image;
		public m_labSoldierType: eui.Label;
		public m_rightInfoMask: eui.Group;
		public m_labOwner: com_main.CLabel;
		public m_conEffEnter: eui.Group;
		public m_getCardEffect: eui.Group;

		protected m_generalId = 0;
		protected infoAction: egret.tween.TweenGroup;
		protected infoAction1: egret.tween.TweenGroup;
		private m_effect: MCDragonBones;	//卡牌动画
		private m_nExValue: number;		//额外获得碎片数量
		private m_generalGetEffect: MCDragonBones;	//抽卡动画

		public constructor(param?) {
			super();
			this.name = GeneralGetInfoWnd.NAME;
			this.initApp("general/GeneralGetInfoWndSkin.exml");
			this.currentState = param.curState ? param.curState : "base";

			this.m_generalId = param.generalId;
			this.m_nExValue = param.value || 0;
		}

		public onDestroy(): void {
			if (this.m_effect) {
				NormalMcMgr.removeMc(this.m_effect);
				this.m_effect = null;
			}

			if (this.m_generalGetEffect) {
				this.m_generalGetEffect.destroy();
				this.m_generalGetEffect = null;
			}
			EventManager.removeEventListener(this.m_btnSure);
			EventManager.removeEventListener(this.m_conEffEnter);
			for (let i = 1; i < 5; i++) {
				if (this[`m_skillIcon${i}`]) {
					egret.Tween.removeTweens(this[`m_skillIcon${i}`]);
				}
			}
			for (let i = 0; i < 3; i++) {
				if (this[`group${i}`]) {
					egret.Tween.removeTweens(this[`group${i}`]);
				}
			}
			EventMgr.dispatchEvent(GeneralEvent.GENERAL_GET_WND_CLOSE, null);
			super.onDestroy();

			if (GiftBagModel.isPopItem) {
				Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP,{type:1,giftId:GiftBagModel.jumpId});
			}
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));

			this.m_imgCard.mask = this.m_imgCardMask;

			EventManager.addTouchScaleListener(this.m_btnSure, this, this.onclickButtonSure);
			EventManager.addTouchScaleListener(this.m_conEffEnter, this, this.onclickConEffEnter);


			let info: GeneralVo = GeneralModel.getOwnGeneral(this.m_generalId);
			if (!info) {
				return;
			}

			this.m_rightInfo.mask = this.m_rightInfoMask;
			this.m_leftInfo.mask = this.m_leftInfoMask;

			let starBgSrc = GeneralModel.getStarBgRes(info.qualityLevel);
			let starSrc = GeneralModel.getStarRes(info.qualityLevel);
			for (let i = 1; i <= info.getStarNum(); i++) {
				this['m_star' + i].getChildAt(1).visible = true;
			}
			let warPos = info.config.warPosition;
			let array = warPos.split(",");
			let str = '';
			for (let i in array) {
				if (i == '0') {
					str += GeneralModel.getWarPositionStr(array[i]);
				} else {
					str += '/'
					str += GeneralModel.getWarPositionStr(array[i]);
				}
			}
			this.m_labType.text = str;
			this.m_labType.textColor = GeneralModel.getGeneralQualityColor(info.qualityLevel);
			this.m_labTypeDis.text = GLan(info.config.warPositionDes);

			this.m_imgSoldierType.source = info.getGeneralOccupationIcon(2);
			this.m_labSoldierType.text = info.getGeneralArmyTypeName();
			this.m_labRightDis.text = GLan(info.config.generalOccupationDes);

			this.m_labName.text = GeneralModel.getGeneralName(this.m_generalId);
			this.m_labName.textColor = GeneralModel.getGeneralQualityColor(info.qualityLevel);
			this.m_imgCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(info.qualityLevel);
			this.m_imgCard.source = GeneralModel.getSoldierBigLogo(info.config.role)
			this.m_imgCardMk.source = GeneralModel.getSoldierQualityBigLogo(info.qualityLevel);
			// this.m_imgGeneraTypeIcon.source = info.getGeneralOccupationIcon(2);
			this.m_labGroupNum.text = info.config.fight + "";
			let attriList = StringUtils.keyValsToNumber(info.config.attribute);

			let effectType = IETypes.EUI_GeneralGet1;
			switch (info.qualityLevel) {
				case 2: {
					effectType = IETypes.EUI_GeneralGet2;
					break;
				}
				case 3: {
					effectType = IETypes.EUI_GeneralGet3;
					break;
				}
				case 4: {
					effectType = IETypes.EUI_GeneralGet4;
					break;
				}
				case 5: {
					effectType = IETypes.EUI_GeneralGet5;
					break;
				}
			}
			this.m_effect = NormalMcMgr.createMc(effectType);
			this.m_conEffect.addChild(this.m_effect);

			this.playCardAction();

			if (this.currentState == 'tavern') {
				this.refreshExtendView();
			}

			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}

		private onclickConEffEnter() {
			this.showUIAction(0);
			if (this.m_generalGetEffect) {
				this.m_generalGetEffect.destroy();
				this.m_generalGetEffect = null;
			}
		}

		/**播放卡牌动画 */
		protected playCardAction() {
			this.m_conEffEnter.visible = true;

			this.m_groupInfo.alpha = 0;
			Utils.TimerManager.doTimer(1000, 1, () => {
				Sound.playID(236);
			}, this);

			// this.validateNow();

			let effect = new MCDragonBones();
			this.m_generalGetEffect = effect;
			effect.initAsync(IETypes.EUI_GeneralGetCard);
			effect.playOnceDone(IETypes.EUI_GeneralGetCard, () => {
				this.showUIAction(0);
			}, this);
			this.m_getCardEffect.addChild(effect);
		}


		public refreshExtendView(): void {
			let cfg = C.GeneralConfig[this.m_generalId];
			let itemCfg = C.ItemConfig[cfg.itemId];
			let ext = GCodeFromat(CLEnum.GEN_GET_EWHD, GLan(itemCfg.name), this.m_nExValue);
			Utils.setRichLabel(this.m_labExtend, ext);
			this.m_labOwner.text = GCodeFromat(CLEnum.GEN_GET_YYSL, PropModel.getPropNum(itemCfg.id));
		}

		/**显示ui */
		public showUIAction(type) {
			if(!this.m_conEffEnter) return;
			this.m_conEffEnter.visible = false;
			let action;
			if (type == 0) {
				action = this.infoAction;
				this.group.alpha = 1;
				this.image.alpha = 1;
			} else {
				action = this.infoAction1;
			}
			if (this.m_groupInfo) {
				let twg = egret.Tween.get(this.m_groupInfo, null, null, true);
				twg.to({ alpha: 1 }, 300);
				twg.call(function () {
					if (action) {
						action.play(0);
						Sound.playGeneralSoundByID(GeneralModel.getGeneralSoundByGeneralID(this.m_generalId));
					}
				}, this);
			}
		}

		public onclickButtonSure() {
			UpManager.history();
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_GET_WND);
		}
	}
}