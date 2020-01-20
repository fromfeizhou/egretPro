module com_main {
	export class GeneralInfoSkillRender extends CComponent {
		private m_skillIcon: GeneralSkillIconView;

		private m_labSkillName: CLabel;
		private m_labSkillDes: CLabel;
		private m_data: {generalId:number,skillId:number,level:number,sequence:number};

		public constructor(param?) {
			super();
			this.skinName = Utils.getAppSkin("general/tabView/General_info_skill_render.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public set skillInfo(val: {generalId:number,skillId:number,level:number,sequence:number}) {
			this.m_data = val;
			this.refresh();
		}

		public get skillInfo(): {generalId:number,skillId:number,level:number,sequence:number} {
			return this.m_data;
		}

		/**技能是否激活 */
		public isOpen():boolean{
			if(this.m_data && this.m_data.level > 0) return true;
			return false;
		}

		public refresh(): void {
			if (this.m_data && this.m_data.skillId > 0) {
				this.visible = true;
				this.m_skillIcon.skillInfo = this.m_data;
				let skill = C.SkillConfig[this.m_data.skillId];
				if (skill) {
					this.m_labSkillName.text = skill.name;
					let level = this.m_data.level > 0 ? this.m_data.level : 1;
					this.m_labSkillDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, level));
				}
			} else {
				this.resetView();
			}
		}

		private resetView(): void {
			this.visible = false;
		}

	}
}