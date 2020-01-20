module com_main {
    export class GeneralSkillView extends GeneralBaseView {
        public static NAME: string = 'GeneralSkillView';


        public m_skillRender1: com_main.GeneralInfoSkillRender;
        public m_skillRender2: com_main.GeneralInfoSkillRender;
        public m_skillRender3: com_main.GeneralInfoSkillRender;
        public m_skillRender4: com_main.GeneralInfoSkillRender;


        public constructor(width: number, height: number) {
            super(width, height);
            this.skinName = Utils.getAppSkin("general/tabView/GeneralSkillViewSkin.exml");
            this.name = GeneralSkillView.NAME;
        }

        protected childrenCreated() {
            super.childrenCreated();
            for (let i = 1; i < 5; i++) {
                let item = this[`m_skillRender${i}`] as GeneralInfoSkillRender;
                EventManager.addTouchTapListener(item, this, this.onClickSkillRender);
            }
        }

        /**技能点击回调 */
        private onClickSkillRender(e: egret.Event) {
            let skillItem = e.currentTarget as GeneralInfoSkillRender;
            if (skillItem && skillItem.isOpen()) {
                let skill = C.SkillConfig[skillItem.skillInfo.skillId];
                if (skill && skill.skillType == 3) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_SKILL_FAL1), 1, true);
                    return;
                }
                let cfg = C.SkillLvConfigDic[skillItem.skillInfo.skillId][skillItem.skillInfo.level];
                if (!cfg || !cfg.upConsume) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_SKILL_FAL2), 1, true); return;
                }
                let data = { generalId: this.generalId, data: skillItem.skillInfo }
                Utils.open_view(TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW, data);
            } else {
                let strTip = GeneralModel.getSkillOpenDes(skillItem.skillInfo.skillId, true);
                EffectUtils.showTips(strTip, 1, true);
            }
        }

        public refreshView() {
            super.refreshView();

            if (this.generalVo) {
                for (let i = 1; i < 5; i++) {
                    let item: GeneralInfoSkillRender = this["m_skillRender" + i];
                    let info = this.generalVo.getOwnerSkillInfoBySeque(i);
                    if (info && info.skillId > 0) {
                        item.skillInfo = { generalId: this.generalId, skillId: info.skillId, level: info.level, sequence: info.sequence };
                        let skill = C.SkillConfig[info.skillId];
                        if (skill && skill.skillType != 3) {//过滤被动技能红点
                            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this["m_skillRender" + i], { x: 92, y: 23, scale: 0.78 }, [RedEvtType.GEN_SKILL], 2, { generalId: this.generalId, skillId: info.skillId });
                        }
                    }
                }
            }
        }

    }
}