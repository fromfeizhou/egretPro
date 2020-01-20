module com_main {
	export class GeneralCheckInfoWnd extends CView {
		public static NAME = 'GeneralCheckInfoWnd';
		public m_PopUp: com_main.APopUp;
		public m_imgGeneralCardBg: eui.Image;
		public m_genCard: com_main.GeneralSliderRende;
		public m_listAttri: eui.List;
		public comTreaItem: com_main.ComTreaItem;
		public m_labTreaTip: eui.Label;

		private m_tCollection: eui.ArrayCollection;
		private m_tData: gameProto.IGeneralInfo;
		public constructor(data: gameProto.IGeneralInfo) {
			super();
			this.name = GeneralCheckInfoWnd.NAME;
			this.initApp("common/general/GeneralCheckWndSkin.exml");
			this.m_tData = data;
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.GENERAL_CHECK_INFO));
			this.m_tCollection = new eui.ArrayCollection();
			this.m_listAttri.itemRenderer = GeneralAttriRender;
			this.m_listAttri.dataProvider = this.m_tCollection;
			this.m_genCard.closeMc();
			this.initview();

		}

		private initview() {
			if (!this.m_tData) return;
			this.setGeneralInfo();
			this.reShowAttri();  //属性
			this.refreshSkill();//技能
			this.refreshTrea();//宝物

		}
		/**设置查看的武将信息 */
		private setGeneralInfo() {
			let genInfo = GeneralModel.currGenInfo;
			//刷新英雄图片
			this.m_imgGeneralCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(genInfo.heroQuality);
			this.m_genCard.generalId = genInfo.heroId;
			this.m_genCard.setFight(this.m_tData.fight);//单独设置战力
			this.m_genCard.setStarNum(this.m_tData.star);//单独设置星级
			this.m_genCard.setGenlv(this.m_tData.level);//单独设置等级
			this.m_genCard.image_fate.visible=false;  //屏蔽缘分按钮
		}
		//刷新拥有显示
		private reShowAttri() {
			/**刷新基础属性 */
			let basisProp: IKeyVal[] = [];
			/**武将属性队列 */
			let attriList: { [key: number]: number } = {};//基础属性
			let list = this.m_tData.attributeList;
			//属性转换
			for (let i = 0; i < list.length; i++) {
				let data = list[i];
				attriList[data.key] = data.value;
			}

			for (let j in attriList) {
				if (Number(j) == AttriType.POWER || Number(j) == AttriType.INTELLIGENCE || Number(j) == AttriType.LEADERSHIP || Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER || Number(j) == AttriType.DODGE || Number(j) == AttriType.CRIT) {
					basisProp.push({ key: Number(j), value: Number(attriList[j]) });
				}
			}
			basisProp.sort(GeneralModel.sortBystate);

			this.refreshItem(this.getGeneralAttriRD(basisProp));
		}
		/**获得渲染结构 */
		private getGeneralAttriRD(list: IKeyVal[]) {
			let res: GeneralAttriRD[] = [];
			for (let i = 0; i < list.length; i++) {
				let data = list[i];
				let name = Utils.getAttriNameByType(data.key) + '：';
				let value = Utils.getAttriFormatVal(data);
				if (data.key == AttriType.POWER || data.key == AttriType.INTELLIGENCE || data.key == AttriType.LEADERSHIP) {
					res.push({ state: 'Icon22', name: name, value: value, icon: data.key });
				} else {
					res.push({ state: 'style22', name: name, value: value, icon: data.key });
				}
			}
			return res;
		}
		public refreshItem(datas: ComAttriRD[]) {
			this.m_tCollection.replaceAll(datas);
		}
		//刷新技能显示
		public refreshSkill() {
			let curLv = this.m_tData.level;
			let skillLsit = this.m_tData.skills;

			for (let i = 0; i < skillLsit.length; i++) {
				let iconView: GeneralSkillIconView = this[`m_skillIcon${i}`];
				let info = skillLsit[i];
				iconView.skillInfo = { generalId: this.m_tData.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level };
			}
		}
		//刷新宝物显示
		public refreshTrea() {
			if (this.m_tData.treasureId <= 0) {
				this.comTreaItem.visible = false;
				this.m_labTreaTip.visible = true;
				return;
			}
			this.comTreaItem.setItemInfo(this.m_tData.treasureId, 0, this.m_tData.treasureStar, '');
		}
	}
}