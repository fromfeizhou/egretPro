module com_main {
    export class GeneralUnLockSkill extends CView {
        public static NAME = "GeneralUnLockSkill";
        public m_BackGround: com_main.CImage;
        public group: eui.Group;
        public group1: eui.Group;
        public m_labSkillName: com_main.CLabel;
        public m_labSkillDes: com_main.CLabel;
        public m_skillIcon: com_main.GeneralSkillIconView;
        public group0: eui.Group;
        public m_labTips: com_main.CLabel;

        public m_generalId: number;      //武将id
        public m_skillId: number;      //解锁的技能id
        public m_sequence: number;      //解锁的技能id
        private m_generalVo: GeneralVo;   //武将信息
        private actionGroup: egret.tween.TweenGroup;;   //进场动画

        public constructor(param?: any) {
            super();
            this.name = GeneralUnLockSkill.NAME;
            this.m_generalId = param.generalId;
            this.m_skillId = param.skillId;

            if (this.m_generalId) {
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
                this.m_sequence = this.m_generalVo.getOwnerSkillInfoById(this.m_skillId).sequence;
            }
            /**初始化 */
            this.initApp("general/tabView/GeneralUnLockSkillSkin.exml");
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);

            EventManager.removeEventListeners(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_labTips.visible = false;

            this.commitProperties();
            this.refreshSkill();
            EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play(0);
        }
        private refreshSkill() {
            let skill = C.SkillConfig[this.m_skillId];
            if (skill) {
                this.m_labSkillName.text = skill.name;
                this.m_labSkillDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_skillId, 1));
            }
            this.m_skillIcon.skillInfo = { generalId: this.m_generalId, skillId: this.m_skillId, sequence: this.m_sequence, level: 1 };
        }

        /**
         * 动画组播放完成
         */
        private onTweenComplete(): void {
            this.m_labTips.visible = true;
        }
        public onTouchBackGround(): void {
            if (!this.m_labTips.visible) return;
            UpManager.history();
        }

    }
}