module com_main {
	export class ArmsTypeItem extends CComponent {

		private m_imgBg: eui.Image;
		private m_imgSelect: eui.Image;
		private m_imgArms: eui.Image;
		private m_imgName: eui.Image;

		private m_nType: SoldierMainType;
		private m_bSelected: boolean;

		public constructor() {
			super();
			this.m_bSelected = true;
			this.skinName = Utils.getAppSkin("arms/ArmsTypeItem.exml");
		}

		public get type(): SoldierMainType {
			return this.m_nType;
		}

		public set type(type: SoldierMainType) {
			switch (type) {
				case SoldierMainType.FOOTSOLDIER: {
					this.m_imgArms.source = `junbei_daobing_png`;
					this.m_imgName.source = `lb_daobing_png`;
					break;
				}
				case SoldierMainType.ARROWSOLDIER: {
					this.m_imgArms.source = `junbei_gongbing_png`;
					this.m_imgName.source = `lb_gongbing_png`;
					break;
				}
				case SoldierMainType.RIDESOLDIER: {
					this.m_imgArms.source = `junbei_qibing_png`;
					this.m_imgName.source = `lb_qibing_png`;
					break;
				}
				case SoldierMainType.PIKEMAN: {
					this.m_imgArms.source = `junbei_qiangbing_png`;
					this.m_imgName.source = `lb_qiangbing_png`;
					break;
				}
			}
			this.m_nType = type;
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}


		public onDestroy(): void {
			egret.Tween.removeTweens(this);
			egret.Tween.removeTweens(this.m_imgArms);
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}



		protected childrenCreated() {
			super.childrenCreated();
			this.anchorOffsetX = this.width / 2;
			this.anchorOffsetY = this.height / 2;
		}

		public setSelect(selected: boolean): void {
			if (this.m_bSelected == selected) return;
			this.m_imgSelect.visible = selected;
			this.m_bSelected = selected;
		}


		/**位移缓动 */
		public doAction(tx: number, tScale: number, alpha: number, isAction: boolean) {
			egret.Tween.removeTweens(this);
			egret.Tween.removeTweens(this.m_imgArms);
			this.m_imgSelect.visible = false;

			if (isAction) {
				let tw = egret.Tween.get(this);
				tw.wait(30)
				tw.to({ x: tx, scaleX: tScale, scaleY: tScale, alpha: alpha }, 300, egret.Ease.cubicOut)
				tw.call(() => {
					this.setEndState(tx, tScale, alpha);
				}, this);
			} else {
				this.setEndState(tx, tScale, alpha);
			}
		}

		/**结束状态 */
		private setEndState(tx: number, tScale: number, alpha: number) {
			this.x = tx;
			this.alpha = alpha;
			NodeUtils.setScale(this, tScale);
			this.m_imgSelect.visible = tScale == 1;
			this.visible = tScale != 0.5;

			//新手引导条件触发
			let typeIds = {
				[SoldierMainType.ARROWSOLDIER]: IGUIDECD.ARMY_TAB_BB,
				[SoldierMainType.FOOTSOLDIER]: IGUIDECD.ARMY_TAB_GB,
				[SoldierMainType.RIDESOLDIER]: IGUIDECD.ARMY_TAB_QB,
				[SoldierMainType.PIKEMAN]: IGUIDECD.ARMY_TAB_QIANB,
			}
			this.onGuideConditionTab(typeIds[this.m_nType]);
		}

		/**红点添加 */
		public addRedEvent(type: RedEvtType): void {
			// RedPointModel.RemoveInfoListenerByCode(this.hashCode);
			RedPointModel.AddInfoListener(this, { x: 105, y: 24 }, [type], 3, { armsType: this.type });

		}

		/**检查新手引导面板条件 */
		public onGuideConditionTab(id: IGUIDECD) {
			if (id <= 0) return;
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
		}


	}
}