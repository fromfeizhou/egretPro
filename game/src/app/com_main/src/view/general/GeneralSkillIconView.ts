module com_main {
    export class GeneralSkillIconView extends CComponent {
        private m_data: { generalId: number, skillId: number, level: number, sequence: number, isShow?: boolean };
        private m_labName: eui.Label;    //技能名字
        private m_labLevel: CLabel;  //技能等级
        private m_stateName: string;
        private m_groupLv: eui.Group;
        private m_imgSkillIcon: eui.Image;
        private m_bTipsOpen: boolean = false;
        public constructor(param?) {
            super();
            this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_stateName = this.currentState;
            this.refresh();
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        public set skillInfo(val: { generalId: number, skillId: number, level: number, sequence: number, isShow?: boolean }) {
            this.m_data = val;
            this.refresh();
        }

        public get skillInfo(): { generalId: number, skillId: number, level: number, sequence: number, isShow?: boolean } {
            return this.m_data;
        }

        /**隐藏等级 */
        public setLvView(val: boolean) {
            this.m_groupLv.visible = val;
        }

        /**开启tips */
        public openTips() {
            if (this.m_bTipsOpen) return;
            this.m_bTipsOpen = true;
            this.setTipsInfo();
        }

        /**设置tips */
        private setTipsInfo() {
            if (!this.m_bTipsOpen || !this.m_data || !(this.m_data.skillId > 0)) return;
            let data: ITipsSkill = { skillId: this.m_data.skillId, level: this.m_data.level };
            CTipsManager.addTips(this, { type: TipsEnum.Skill, param: data });
        }

        /**刷新显示 */
        private refresh() {
            if (this.m_data && this.m_data.skillId > 0) {
                this.visible = true;
                if (this.m_data.isShow) {
                    this.setLvView(false);
                    this.setSkillIon();
                } else {
                    //皮肤设置 等级小于0 未开放
                    if (this.m_data.level > 0) {
                        this.setSkillIon();
                    } else {
                        this.currentState = this.m_stateName + "lock";
                        this.refreshName(false);
                        Utils.isGray(true, this.m_imgSkillIcon);
                    }
                }
                this.m_imgSkillIcon.source = GeneralModel.getSkillIcon(this.m_data.skillId);
                this.refreshLevel();
                this.setTipsInfo();
            } else {
                this.visible = false;
            }
        }
        private setSkillIon() {
            this.currentState = this.m_stateName
            this.refreshName(true);
            Utils.isGray(false, this.m_imgSkillIcon);
        }

        /**刷新等级 */
        private refreshLevel() {
            if (this.m_labLevel) this.m_labLevel.text = this.m_data.level + '';
        }

        /**刷新名字 */
        private refreshName(isOpen: boolean) {
            if (this.m_labName) {
                let skillInfo = C.SkillConfig[this.m_data.skillId];
                if (skillInfo) {
                    if (isOpen) {
                        this.m_labName.text = skillInfo.name;
                    } else {
                        this.m_labName.text = GeneralModel.getSkillOpenDes(this.m_data.skillId);
                    }
                }
            }
        }
    }
}