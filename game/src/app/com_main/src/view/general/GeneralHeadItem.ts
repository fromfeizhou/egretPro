module com_main {
	export class GeneralHeadItem extends eui.Component {
		public m_generalId: number;      //武将id
		private m_generalVo: GeneralVo;   //武将信息

		public Image_back_di: eui.Image;
		private Image_head: eui.Image;
		private Image_mask: eui.Image;

		private m_group_start: eui.Group;	//星星
		private m_group_startbg: eui.Group;	//星星
		private m_nStarType: number;		//星星品质
		private lb_level_before: eui.Label;  //等级
		private lb_name_before: eui.Label;   //英雄名字
		// private Image_shangzhen:eui.Image;  //上阵图片
		private Image_pro_yellow: eui.Image; //碎片进度条
		private m_nProMaxWidth;
		private lb_suipian_num: eui.Label;   //碎片数字

		private m_groupCollectFlag: eui.Group;	//可招募标记

		private renderType = 0; // 0是武将系统的  1是擂台系统的

		public suipianNum = 0;
		public needSuipian = 0;

		private m_bRedEvt: boolean = false;

		public constructor(param?) {
			super();
			this.m_generalId = param;
			if (this.m_generalId) {
				this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
				let soulId = this.m_generalVo.config.itemId;
				this.suipianNum = PropModel.getPropNum(this.m_generalVo.config.itemId);
				this.needSuipian = this.m_generalVo.config.soul;
			}
			this.skinName = Utils.getAppSkin("general/GeneralHeadItemRender.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.Image_head.mask = this.Image_mask;
			this.m_nProMaxWidth = this.Image_pro_yellow.width;
			this.refresh(this.m_generalId);
			if (this.m_generalVo && !this.m_generalVo.isOwn) {
				EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
			}
		}

		/**红点监听 已拥有对象才创建 减低计算*/
		public addRedPoint() {
			if (this.m_bRedEvt) return;
			this.m_bRedEvt = true;
			RedPointModel.AddInfoListener(this, { x: 102, y: -2 },
				[RedEvtType.GEN_STAR, RedEvtType.GEN_SKILL, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN, RedEvtType.GEN_TREA_EQ, RedEvtType.GEN_FATE],
				2, { generalId: this.generalId }, false);
		}

		/**移除红点 */
		public removeRedPoint() {
			this.m_bRedEvt = false;
			RedPointModel.RemoveInfoListenerByCode(this.hashCode);
		}

		/**物品数量变化 */
		private onPropItemChange(itemId: number) {
			if (this.m_generalVo && !this.m_generalVo.own && itemId == this.m_generalVo.config.itemId) {
				// debug(GeneralModel.getGeneralName(this.m_generalId),this.m_generalVo.config.itemId,itemId)
				this.refreshSoulItemNum();
			}
		}

		public onDestroy(): void {
			this.setSkin(null);
			this.removeRedPoint();
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);

		}


		public set generalId(id) {
			this.m_generalId = id;
			if (this.m_generalId) this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			this.refresh(this.m_generalId);
		}

		public get generalId() {
			return this.m_generalId;
		}

		// public setBattleVisible(bool:boolean)
		// {
		// 	// this.Image_shangzhen.visible = bool;
		// }

		public setType(type) {
			this.renderType = type;
		}

		public refresh(generalId?: number, isLevelupStar?: boolean) {

			if (isLevelupStar) {
				this.m_generalId = generalId;
				this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			}

			if (!this.m_generalVo) {
				return;
			}

			let qualityLevel = this.m_generalVo.qualityLevel;
			if (qualityLevel > 5) {
				qualityLevel = 5;
			} else if (qualityLevel < 1) {
				qualityLevel = 1
			}
			if (!this.m_generalVo.isOwn) {
				// qualityLevel = 0;
				Utils.isGray(true, this.Image_head);
			} else {
				Utils.isGray(false, this.Image_head);
			}

			this.Image_head.source = GeneralModel.getSoldierLogo(this.m_generalVo.config.role);
			this.Image_back_di.source = GeneralModel.getHeadItemBgByQuality(qualityLevel);

			this.lb_name_before.text = GeneralModel.getGeneralName(this.m_generalId);
			this.lb_name_before.textColor = Utils.getColorOfQuality(qualityLevel);


			if (this.m_generalId && this.m_generalVo) {

				//已经拥有的武将
				if (this.m_generalVo.own) {
					this.currentState = "owner"
					this.refreshLevelNum();
					// if(this.renderType == 0)  //擂台的不处理
					// {	
					// 	this.Image_shangzhen.visible = this.m_generalVo.isOnBattle();
					// }
					this.refreshStar();
					// if(isLevelupStar){
					// 	this.Image_shangzhen.visible = false;
					// }
					this.addRedPoint();
				} else {
					this.currentState = "collect"
					this.refreshSoulItemNum();
				}
			}
		}

		/**刷新等级 */
		public refreshLevelNum() {
			if (this.m_generalVo) {
				this.lb_level_before.text = GCodeFromat(CLEnum.LEVEL1, this.m_generalVo.level);
			}
		}

		/**刷新进度 */
		private refreshSoulItemNum() {
			if (!this.m_generalVo) return;
			this.suipianNum = PropModel.getPropNum(this.m_generalVo.config.itemId);
			this.lb_suipian_num.text = this.suipianNum + "/" + this.needSuipian;
			let pro = Math.min(this.suipianNum / this.needSuipian, 1);
			this.Image_pro_yellow.width = this.m_nProMaxWidth * pro;
			if (this.suipianNum >= this.needSuipian) {
				this.m_groupCollectFlag.visible = true;
			} else {
				this.m_groupCollectFlag.visible = false;
			}
		}
		/**刷新星星 */
		public refreshStar() {
			if (!this.m_generalVo) return;

			let startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
			let starNum = startCfg.starlevel;
			let res = GeneralModel.getStarRes(startCfg.starType);
			this.refreshStarBg(startCfg.starType);
			while (this.m_group_start.numChildren > starNum) {
				this.m_group_start.removeChildAt(0);
			}
			for (let i = this.m_group_start.numChildren; i < starNum; i++) {
				let star = new eui.Image(res);
				star.width = 23;
				star.height = 23;
				this.m_group_start.addChild(star);
			}

		}

		/**刷新星星背景 */
		public refreshStarBg(type: number) {
			if (this.m_nStarType == type) {
				return;
			}
			this.m_nStarType = type;
			Utils.removeAllChild(this.m_group_startbg);
			Utils.removeAllChild(this.m_group_start);
			let res = GeneralModel.getStarBgRes(this.m_nStarType);
			for (let i = 0; i < 5; i++) {
				let star = new eui.Image(res);
				star.width = 23;
				star.height = 23;
				this.m_group_startbg.addChild(star);
			}
		}
	}
}