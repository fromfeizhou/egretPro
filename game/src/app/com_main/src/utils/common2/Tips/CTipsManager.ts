/**
  * tips弹出管理类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * tips弹出的管理类
  */
module com_main {
	export enum TipsEnum {
		/**通用tips */
		Normal = 0,
		/**物品tips */
		Item = 1,
		/**技能tips */
		Skill = 2,
		/**装备套装tips */
		// EquipAdd = 3,

		/**搜索栏宝箱tips */
		WorldSearchTips = 10001,
	}

	export interface ITipsData {
		type: TipsEnum,
		param: any,
		posType?: number,	//0默认 其他左右
		offset?: { x: number, y: number },
	}

	/**技能Tips参数 */
	export interface ITipsSkill {
		skillId: number;
		level: number;
	}

	export class CTipsManager {
		private static m_tListeners: { [key: number]: ITipsData } = {};	//监听对象计数
		private static m_tipsPanel: CView;	//当前tips
		private static m_pTouchBeginPos: egret.Point = new egret.Point();
		private static m_pPreTouchPos: egret.Point = new egret.Point();
		/**
		 * target       		绑定对象
		 * type        			tips类型
		 * param				额外参数
   		*/
		public static addTips(target: egret.DisplayObject, data: ITipsData) {
			if (!target) return;
			//过滤已经监听的对象
			if (!this.m_tListeners[target.hashCode]) {
				//移除函数 挂钩新内容
				let removeFunc = target.$onRemoveFromStage.bind(target);
				target.$onRemoveFromStage = function () {
					if (!target) return;
					CTipsManager.clearTips(target);
					removeFunc();
				}

				target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
				target.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchMove, this);
				target.addEventListener(egret.TouchEvent.TOUCH_END, this.removeTips, this);
				target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.removeTips, this);
			}

			this.m_tListeners[target.hashCode] = data;
		}

		/**
		 * 手动移除tips监听
		 * 
		 */
		public static clearTips(target) {
			if (!this.m_tListeners[target.hashCode]) return;
			target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			target.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchMove, this);
			target.removeEventListener(egret.TouchEvent.TOUCH_END, this.removeTips, this);
			target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.removeTips, this);
			delete this.m_tListeners[target.hashCode];
		}

		private static onTouchBegin(e: egret.TouchEvent) {
			this.m_pTouchBeginPos.x = e.stageX;
			this.m_pTouchBeginPos.y = e.stageY;
			this.showTips(e);
		}

		private static ontouchMove(e: egret.TouchEvent) {
			let dis = Utils.MathUtils.getPosDis({ x: this.m_pPreTouchPos.x, y: this.m_pPreTouchPos.y }, { x: e.stageX, y: e.stageY });
			if (dis < 30) return;
			this.removeTips(e);
		}

		public static showTips(e): void {
			var target = e.currentTarget as egret.DisplayObject;
			let data = this.m_tListeners[target.hashCode];
			if (!data) return;
			e.stopPropagation();

			if (this.m_tipsPanel) {
				Utils.removeFromParent(this.m_tipsPanel);
				this.m_tipsPanel = null;
			}
			this.m_tipsPanel = this.createTips(data);

			if (!this.m_tipsPanel) return;

			AGame.R.app.topLevel.addChild(this.m_tipsPanel);
			this.m_tipsPanel.alpha = 0;
			egret.Tween.get(this.m_tipsPanel).to({ alpha: 1 }, 300);

			egret.callLater(() => {
				if (this.m_tipsPanel) {
					this.setPanelPos(target, data);
				}
			}, CTipsManager);
		}

		/**设置tips位置 */
		private static setPanelPos(target: egret.DisplayObject, data: ITipsData) {
			var point: egret.Point = target.parent.localToGlobal(target.x, target.y);
			let gap = 30;
			if (data.posType && data.posType != gap) {
				//tips 左右偏移
				if (point.x - this.m_tipsPanel.width > 0) {
					point.x = point.x - this.m_tipsPanel.width - gap;
				} else {
					point.x = point.x + target.width + gap;
				}
			} else {
				//tips 往下偏移
				if (point.y - this.m_tipsPanel.height < 0) {
					point.y = point.y + target.height + gap;
				} else {
					point.y = point.y - this.m_tipsPanel.height - gap;
				}
				//tips 居中
				point.x = point.x - this.m_tipsPanel.width * 0.5 + target.width * 0.5;
			}

			//offset 
			if (data.offset) {
				point.x += data.offset.x;
				point.y += data.offset.y;
			}

			this.m_tipsPanel.x = point.x;
			this.m_tipsPanel.y = point.y;

			this.amendPos();
		}

		/**修正最终位置 防止越界 */
		private static amendPos(): void {
			//tips定位
			if (this.m_tipsPanel.x + this.m_tipsPanel.width > GameConfig.curWidth()) {
				this.m_tipsPanel.x = GameConfig.curWidth() - this.m_tipsPanel.width;
			} else if (this.m_tipsPanel.x < 0) {
				this.m_tipsPanel.x = 0;
			}

			if (this.m_tipsPanel.y + this.m_tipsPanel.height > GameConfig.curHeight()) {
				this.m_tipsPanel.y = GameConfig.curHeight() - this.m_tipsPanel.height;
			} else if (this.m_tipsPanel.y < 0) {
				this.m_tipsPanel.y = 0;
			}
		}

		/**创建tips */
		private static createTips(data: ITipsData) {
			switch (data.type) {
				case TipsEnum.Item: {
					let itemId: number = data.param;
					let itemCfg = C.ItemConfig[itemId];
					if (itemCfg) {
						return new TipsNorWnd({ title: GLan(itemCfg.name), des: itemCfg.description });
					}
					break;
				}
				case TipsEnum.Skill: {
					let info: ITipsSkill = data.param;
					let skillCfg = C.SkillConfig[info.skillId];
					if (skillCfg) {
						let title = C.SkillConfig[info.skillId].name;
						let des = GeneralModel.getSkillDesByLv(info.skillId, Math.max(1, info.level));
						return new TipsNorWnd({ title: title, des: des });
					}
					break;
				}
				// case TipsEnum.EquipAdd: {
				// 	return new TipsEquipAddWnd(data.param);
				// }
				case TipsEnum.Normal: {
					return new TipsNorWnd(data.param);
				}
				case TipsEnum.WorldSearchTips: {
					return new WorldSearchAwardWnd(data.param);
				}
			}
		}

		private static removeTips(e): void {
			if (!this.m_tipsPanel) return;
			let panel = this.m_tipsPanel;
			this.m_tipsPanel = null;
			egret.Tween.removeTweens(panel);
			let tw = egret.Tween.get(panel);
			tw.to({ alpha: 0 }, 300);
			tw.call(() => {
				Utils.removeFromParent(panel);
			}, CTipsManager);

			//阻塞事件
			if (e.type == egret.TouchEvent.TOUCH_END) {
				e.stopImmediatePropagation();
			}
		}


	}

}


