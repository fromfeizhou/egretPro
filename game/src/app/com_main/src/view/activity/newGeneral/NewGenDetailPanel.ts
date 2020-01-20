// TypeScript file

module com_main {
	export class NewGenDetailPanel extends DynamicComponent {

		public m_allGroup:eui.Group;
		public group_xiangxishuxing:eui.Group;
		public m_labPower:eui.Label;
		public m_labIntell:eui.Label;
		public m_labLeader:eui.Label;
		public m_labAtk:eui.Label;
		public m_labDef:eui.Label;
		public m_labHp:eui.Label;
		public m_skillIcon1:com_main.GeneralSkillIconView;
		public m_skillIcon2:com_main.GeneralSkillIconView;
		public m_skillIcon3:com_main.GeneralSkillIconView;
		public m_skillIcon4:com_main.GeneralSkillIconView;

		private m_generalVo: GeneralVo;
		private m_nGeneralId: number;

		public constructor() {
			super();
			this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenDetailSkin.exml");
		}

		public onShow(){
			let vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
			this.generalId = vo.getNewGenRewordCfg().generalId;
			this.initEvent();
		}

		public onDestory(){
			this.removeEvent();
		}

		protected get generalVo() {
            return this.m_generalVo;
        }

		public set generalId(id: number) {
            this.m_nGeneralId = id;
            this.m_generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            this.refreshView();
        }

		public refreshView() {
			let config = this.generalVo.config as GeneralConfig;
			let attriList = StringUtils.keyValsToNumber(config.attribute);
			this.m_labPower.text = attriList[AttriType.POWER] + "";
			this.m_labIntell.text = attriList[AttriType.INTELLIGENCE] + "";
			this.m_labLeader.text = attriList[AttriType.LEADERSHIP] + "";

			this.m_labAtk.text = attriList[AttriType.ATK] + "";
			this.m_labDef.text = attriList[AttriType.DEF] + "";
			this.m_labHp.text = attriList[AttriType.HP] + "";

			this.refreshSkill();
		}

		//刷新技能显示
        public refreshSkill() {
            let curLv = this.generalVo.level;
            let config = this.generalVo.config;

            for (let i = 1; i < 5; i++) {
                let iconView: GeneralSkillIconView = this[`m_skillIcon${i}`];
                let info = this.generalVo.getOwnerSkillInfoBySeque(i);
                iconView.skillInfo = { generalId: this.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level, isShow: true };
            }
        }

		/**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
			for (let i = 1; i < 5; i++) {
                this[`m_skillIcon${i}`].openTips();
            }
        }

        private removeEvent() {

        }
		/**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

        
	}
}