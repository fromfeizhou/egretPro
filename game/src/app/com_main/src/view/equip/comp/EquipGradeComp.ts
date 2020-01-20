module com_main {
    /**
     * 升阶
     */
    export class EquipGradeComp extends EquipBaseComp {
        public static NAME: string = 'EquipGradeComp';

        public m_pRoot: eui.Group;
        public m_labEquipName: eui.Label;
        public m_labCurNum: eui.Label;
        public m_labNextNum: eui.Label;
        public m_labCurAttri: eui.Label;
        public m_labNextAttri: eui.Label;
        public m_nextLvTips: eui.Label;
        public m_comResCost0: com_main.ComResCost;
        public m_comResCost1: com_main.ComResCost;
        public m_btnUp: com_main.ComButton;

        public constructor() {
            super();
            this.name = EquipGradeComp.NAME;
            this.m_nEquipPos = 0;
            this.skinName = Utils.getAppSkin("equip/comp/EquipLevelCompSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_btnUp.setTitleLabel(GCode(CLEnum.GRADE_UP));
            EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnUp);
        }

        private onBtnUp() {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 1)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                return;
            }
            let level = equip.grade;
            let gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, level + 1);
            if (!gradeCfg) {
                EffectUtils.showTips(GCode(CLEnum.GRADE_UP_MAX), 1, true);
                return;
            }
            gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, level);
            let costs = Utils.parseCommonItemJson(gradeCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Grade);
            }

        }


        /**初始化显示 */
        public initView() {
            this.refreshView();
        }


        /**刷新显示 */
        public refreshView() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);

            let gradeLv = equip.grade;
            let gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);

            //标题
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${gradeLv}/${genVo.getMaxStrengByType(1)})`;
            this.refreshCost();

            this.refreshGradAddLab(equip.equipmentUuid, this.m_labCurNum, this.m_labCurAttri, gradeLv, '#e9e9e6');
            this.refreshGradAddLab(equip.equipmentUuid, this.m_labNextNum, this.m_labNextAttri, gradeLv + 1, '#00ff00');

            this.refreshStateView(genVo);
        }

        /**刷新状态显示 */
        private refreshStateView(genVo: GeneralVo) {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let nextcfg = EquipModel.getGradeCfg(this.m_nEquipPos, equip.grade + 1);
            if (nextcfg) {
                if (genVo.isMaxByStrengByType(equip, 1)) {
                    this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_SJ_TIPS1, genVo.level + 1));
                    this.currentState = 'max';
                } else {
                    this.currentState = 'base';
                }
            } else {
                this.currentState = 'max';
                this.m_nextLvTips.text = GCode(CLEnum.EQUIP_GRADE_FULL);

            }
        }

        /**设置进阶加成文本显示 */
        private refreshGradAddLab(uuid: number, lvLabel: eui.Label, label: eui.Label, gradeLv: number, colors: string) {
            let gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);
            let gradeAdd = EquipModel.getGradeAddRate(gradeLv);
            gradeAdd = Math.ceil(gradeAdd * 10000 * 0.01);
            if (gradeCfg) {
                lvLabel.text = gradeLv.toString();
                if (uuid == 0) {
                    let str = gradeLv == 0 ? GCodeFromat(CLEnum.EQUIP_SX_AD, colors) : GCodeFromat(CLEnum.EQUIP_SX_AD1, colors, gradeAdd);
                    label.textFlow = Utils.htmlParser(str);
                } else {
                    let equipVo = EquipModel.getEquipVoByUId(uuid);
                    let attri = equipVo.getGradeAdd(gradeLv);
                    let str = gradeLv == 0 ? GCodeFromat(CLEnum.EQUIP_SX_AD2, Utils.getAttriNameByType(attri.key), colors) : GCodeFromat(CLEnum.EQUIP_SX_AD3, Utils.getAttriNameByType(attri.key), colors, attri.value, gradeAdd);
                    label.textFlow = Utils.htmlParser(str);
                }
            } else {
                lvLabel.text = GCode(CLEnum.GRADE_UP_MAX1);
                label.textFlow = [];
            }
        }

        /**刷新消耗 */
        private refreshCost() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let gradeLv = equip.grade;
            let gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);
            //消耗
            let costs = Utils.parseCommonItemJson(gradeCfg.consume);
            for (let i = 0; i < 2; i++) {
                let data = costs[i];
                this[`m_comResCost${i}`].setInfo(data.itemId, data.count);
            }
        }
    }

}