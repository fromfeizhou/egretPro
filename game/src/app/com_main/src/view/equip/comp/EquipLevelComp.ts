module com_main {
    /**
     * 升阶
     */
    export class EquipLevelComp extends EquipBaseComp {
        public static NAME: string = 'EquipLevelComp';

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
            this.name = EquipLevelComp.NAME;
            this.m_nEquipPos = 0;
            this.skinName = Utils.getAppSkin("equip/comp/EquipLevelCompSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_btnUp.setTitleLabel(GCode(CLEnum.STRENG));

            EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnUp);
        }

        private onBtnUp() {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 0)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                return;
            }
            let level = equip.strengthen;
            let lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level + 1);
            if (!lvCfg) {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
                return;
            }
            lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);
            let costs = Utils.parseCommonItemJson(lvCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Level);
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
            let level = equip.strengthen;
            let lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);

            //标题            
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${level}/${genVo.getMaxStrengByType(0)})`;

            this.refreshCost();

            //当前属性
            this.m_labCurNum.text = level + '';
            let attri = StringUtils.keyValsToNumberArray(lvCfg.addAttribute)[0];
            this.m_labCurAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri, true, '%s：<font color=#e9e9e6>%s</font>'));

            //下一级属性
            lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level + 1);
            if (lvCfg) {
                this.m_labNextNum.text = (level + 1) + '';
                attri = StringUtils.keyValsToNumberArray(lvCfg.addAttribute)[0];
                this.m_labNextAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri, true, '%s：<font color=#00ff00>%s</font>'));
            } else {
                this.m_labNextNum.text = GCode(CLEnum.LEVEL_MAX2);
                this.m_labNextAttri.textFlow = [];
            }

            this.refreshStateView(genVo);
        }

        /**刷新状态显示 */
        private refreshStateView(genVo: GeneralVo) {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let nextcfg = EquipModel.getLevelCfg(this.m_nEquipPos, equip.strengthen + 1);
            if (genVo.isMaxByStrengByType(equip, 0)) {
                if (nextcfg) {
                    this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_QH_TIPS1, genVo.level + 1));
                } else {
                    this.m_nextLvTips.text = GCode(CLEnum.EQUIP_LEVEL_FULL);

                }
                this.currentState = 'max';
                this.commitProperties();
            } else {
                this.currentState = 'base';
                this.commitProperties();
            }
        }

        /**刷新消耗 */
        private refreshCost() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let level = equip.strengthen;
            let lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);
            //消耗
            let costs = Utils.parseCommonItemJson(lvCfg.consume);
            for (let i = 0; i < 2; i++) {
                let data = costs[i];
                this[`m_comResCost${i}`].setInfo(data.itemId, data.count);
            }
        }

    }

}