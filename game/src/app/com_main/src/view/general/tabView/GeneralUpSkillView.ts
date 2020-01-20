module com_main {
	export class GeneralUpSkillWnd extends CView {
		public static NAME = "GeneralUpSkillWnd";

		public m_apopup: com_main.APopUp;
		public m_labNextName: com_main.CLabel;
		public m_labNextLv: com_main.CLabel;
		public m_labNextDes: com_main.CLabel;
		public m_nextSkillIcon: com_main.GeneralSkillIconView;
		public m_conEffectNext: eui.Group;
		public m_labCurName: com_main.CLabel;
		public m_labCurLv: com_main.CLabel;
		public m_labCurDes: com_main.CLabel;
		public m_curSkillIcon: com_main.GeneralSkillIconView;
		public m_conEffect: eui.Group;
		public m_costItemName: com_main.CLabel;
		public m_labCost: com_main.CLabel;
		public m_comItem: com_main.ComItemNew;
		public m_gItemConsume: eui.Group;
		public m_gpItem0: eui.Group;
		public m_comItem0: com_main.ComItemNew;
		public m_labCost0: com_main.CLabel;
		public m_gpItem1: eui.Group;
		public m_comItem1: com_main.ComItemNew;
		public m_labCost1: com_main.CLabel;
		public m_gpItem2: eui.Group;
		public m_comItem2: com_main.ComItemNew;
		public m_labCost2: com_main.CLabel;
		public m_gpItem3: eui.Group;
		public m_comItem3: com_main.ComItemNew;
		public m_labCost3: com_main.CLabel;
		public m_gConsume: eui.Group;
		public m_costItem0: com_main.ComResCost;
		public m_costItem1: com_main.ComResCost;
		public m_costItem2: com_main.ComResCost;
		public m_costItem3: com_main.ComResCost;
		public m_btnUpLv: com_main.ComButton;
		public m_pFightNumRoot: eui.Group;


		public m_nGeneralId: number;	//武将id

		private m_data: { generalId: number, skillId: number, level: number, sequence: number };
		private m_bAction: boolean;		//技能等待
		private consumePos: number[] = [150, 110, 65, 30];// [127, 100];

		public constructor(param?: any) {
			super();
			this.name = GeneralUpSkillWnd.NAME;
			/**初始化 */
			this.m_nGeneralId = param.generalId;
			this.m_data = param.data;

			this.initApp("general/GeneralUpSkillWnd.exml");
		}

		protected listenerProtoNotifications(): any[] {
			return [ProtoDef.OPEN_SKILL];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());

			switch (protocol) {
				case ProtoDef.OPEN_SKILL: {
					if (body.generalId == this.m_nGeneralId && body.sequence == this.m_data.sequence) {
						this.m_data = body;
						this.playUpLvEffect();
					}
					Loading.hide();
					break;
				}
			}
		}


		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_apopup.setTitleLabel(GCode(CLEnum.GEN_TITLE_SKILL));
			this.m_btnUpLv.setTitleLabel(GCode(CLEnum.LEVEL_UP));
			// let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			// if (!cfg) return;
			// let info = Utils.parseCommonItemJson(cfg.upConsume)[0];
			// this.m_comItem.itemId = info.itemId;
			// Utils.setPropLabName(info.itemId, this.m_costItemName);

			EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
			EventManager.addTouchScaleListener(this.m_btnUpLv, this, this.onClickBtnUpLv);

			this.m_curSkillIcon.setLvView(false);
			this.m_nextSkillIcon.setLvView(false);

			this.m_bAction = false;
			this.refresh();

			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}

		/**升级特效 */
		private playUpLvEffect() {
			if (this.m_bAction) return;
			let preCfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level - 1];
			let curCfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			TipsUtils.showTipsFightUp(GCodeFromat(CLEnum.FIGHT_ADD, curCfg.force - preCfg.force), new egret.Point(0, 0), this.m_pFightNumRoot);

			this.m_bAction = true;
			let effect = new MCDragonBones();
			effect.initAsync(IETypes.EUI_GenUpSkill2);
			effect.play(IETypes.EUI_GenUpSkill2, 1, true);
			this.m_conEffect.addChild(effect);

			//第二段特效
			effect.setCallback(() => {
				if (this.m_conEffectNext) {
					this.refresh();

					let effect = new MCDragonBones();
					effect.initAsync(IETypes.EUI_GenUpSkill);
					effect.play(IETypes.EUI_GenUpSkill, 1, true);
					this.m_conEffectNext.addChild(effect);
					this.m_bAction = false;
				}
			}, this);
		}

		/**升级按钮点击回调 */
		private onClickBtnUpLv() {
			if (this.currentState == "full") {
				UpManager.history();
				return;
			}
			if (!this.m_data) return;
			let limit = GeneralModel.getUpSkillLimit(this.m_data.skillId, this.m_data.level);
			let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId) as GeneralVo;
			if (genVo.level < limit.level) {
				EffectUtils.showTips(GCodeFromat(CLEnum.GEN_SKILL_LIMIT, limit.level), 1, true);
				return;
			}
			if (genVo.star < limit.star) {
				EffectUtils.showTips(GCodeFromat(CLEnum.GEN_SKILL_LIMIT1, limit.star), 1, true);
				return;
			}
			// let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			// if (!cfg) return;
			// let info = Utils.parseCommonItemJson(cfg.upConsume)[0];

			// let des = GCodeFromat(CLEnum.GEN_SKILL_FAL, Utils.getPropName(info.itemId));
			// if (PropModel.isItemEnough(info.itemId, info.count, 3, des)) {
			// 	GeneralProxy.send_OPEN_SKILL(this.m_nGeneralId, this.m_data.sequence, this.m_data.skillId);
			// 	Loading.show();
			// }

			// 材料检测1.0.2
			let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			if (!cfg) return;
			let itemCosts = Utils.parseCommonItemJson(cfg.upConsume);
			if (PropModel.isItemListEnough(itemCosts, 3)) {
				GeneralProxy.send_OPEN_SKILL(this.m_nGeneralId, this.m_data.sequence, this.m_data.skillId);
				Loading.show();
			}
		}

		/**物品数量变化 */
		private onPropItemChange(itemId: number) {
			// this.refreshCost();
			this.refreshCost102();
		}

		public refresh() {
			if (this.m_data && this.m_data.skillId > 0) {
				this.refreshLv();
				// this.refreshCost();
				this.refreshCost102();
			}
		}

		private refreshLv() {
			if (GeneralModel.isMaxSkill(this.m_data.skillId, this.m_data.level)) {
				this.currentState = "full";
				this.refreshCurView();
				// this.refreshCost();
				this.refreshCost102();
				this.m_btnUpLv.setTitleLabel(GCode(CLEnum.CLOSE));
			} else {
				this.currentState = "normal";
				this.refreshCurView();
				this.refreshNextView();
				// this.refreshCost();
				this.refreshCost102();
			}
		}

		/**刷新当前等级显示 */
		private refreshCurView() {
			this.m_curSkillIcon.skillInfo = this.m_data;
			this.m_labCurDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, this.m_data.level));
			let skillCfg = C.SkillConfig[this.m_data.skillId]
			this.m_labCurName.text = skillCfg.name;
			this.m_labCurLv.text = GCodeFromat(CLEnum.LEVEL1, this.m_data.level);

		}

		/**刷新下一等级显示 */
		private refreshNextView() {
			this.m_nextSkillIcon.skillInfo = { generalId: this.m_nGeneralId, skillId: this.m_data.skillId, sequence: this.m_data.sequence, level: this.m_data.level + 1 };
			this.m_labNextDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, this.m_data.level + 1));
			let skillCfg = C.SkillConfig[this.m_data.skillId]
			this.m_labNextName.text = skillCfg.name;
			this.m_labNextLv.text = GCodeFromat(CLEnum.LEVEL1, this.m_data.level + 1);
		}

		/**刷新碎片显示 */
		private refreshCost() {
			let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			if (!cfg) return;
			let info = Utils.parseCommonItemJson(cfg.upConsume)[0];
			let curNum = PropModel.getPropNum(info.itemId);
			Utils.setRedProcessText(this.m_labCost, curNum, info.count);

			let info0 = Utils.parseCommonItemJson(cfg.upConsume)[1];
		}

		/**刷新资源显示1.0.2 */
		private refreshCost102() {
			// let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			// if (!cfg) return;
			// let items = Utils.parseCommonItemJson(cfg.upConsume);
			// let count = 0;
			// for (let i = 0; i < 4; i++) {
			// 	let data: IItemInfo = items[i];
			// 	let item: ComResCost = this[`m_costItem${i}`];
			// 	if (data) {
			// 		item.visible = true;
			// 		item.setInfo(data.itemId, data.count);
			// 		count++;
			// 	} else {
			// 		item.visible = false;
			// 	}
			// }
			// this.m_gConsume.bottom = count > 2 ? this.consumePos[0] : this.consumePos[1];

			let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
			if (!cfg) return;
			let items = Utils.parseCommonItemJson(cfg.upConsume);
			let count = 0;
			for (let i = 0; i < 4; i++) {
				let data: IItemInfo = items[i];
				let gp = this[`m_gpItem${i}`];
				let item: ComItemNew = this[`m_comItem${i}`];
				let label = this[`m_labCost${i}`] as com_main.CLabel;
				if (data) {
					gp.visible = true;
					item.setItemInfo(data.itemId, data.count);
					let curNum = PropModel.getPropNum(data.itemId);
					Utils.setRedProcessText(label, curNum, data.count);
					count++;
				} else {
					gp.visible = false;
				}
			}
			this.m_gItemConsume.horizontalCenter = this.consumePos[count - 1];
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_SKILL_WND);
		}

	}
}