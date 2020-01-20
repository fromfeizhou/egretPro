module com_main {
    /**
     * 升阶
     */
    export class EquipWroughtComp extends EquipBaseComp {
        public static NAME: string = 'EquipWroughtComp';

        public m_labEquipName: eui.Label;
        public m_pAttriCon: eui.Group;
        public m_nextLvTips: eui.Label;
        public m_comResCost: com_main.ComResCost;
        public m_btnWrought: com_main.ComButton;

        public constructor() {
            super();
            this.name = EquipWroughtComp.NAME;
            this.m_nEquipPos = 0;
            this.skinName = Utils.getAppSkin("equip/comp/EquipWroughtCompSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_btnWrought.setTitleLabel(GCode(CLEnum.WROUGH));
            EventManager.addTouchScaleListener(this.m_btnWrought, this, this.onBtnWrought);

        }

        private onBtnWrought() {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 2)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                return;
            }
            let level = equip.wrought;
            let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level + 1);
            if (!wroughtCfg) {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
                return;
            }
            wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);

            let costs = Utils.parseCommonItemJson(wroughtCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Wrought);
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
            Utils.removeAllChild(this.m_pAttriCon);

            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let level = equip.wrought;
            let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);
            let wroughtCfgNew = EquipModel.getWroughtCfg(this.m_nEquipPos, level + 1);
            //标题
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${level}/${genVo.getMaxStrengByType(2)})`;


            this.refreshCost();
            this.setCurAttriGroup(wroughtCfg, wroughtCfgNew);

            let tips = this.getOpenDes(level);
            for (let i = 0; i < tips.length; i++) {
                let label = this.getLabel(GameConfig.TextColors.gray);
                label.text = tips[i];
                this.m_pAttriCon.addChild(label);
            }

            this.refreshStateView(genVo);
        }

        /**刷新状态显示 */
        private refreshStateView(genVo: GeneralVo) {
            if (!genVo) return;
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
             let nextcfg = EquipModel.getWroughtCfg(this.m_nEquipPos, equip.wrought + 1);
            if (genVo.isMaxByStrengByType(equip, 2)) {
                if (nextcfg) {
                     this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_JL_TIPS1, genVo.level + 1));
                } else {
                    this.m_nextLvTips.text = GCode(CLEnum.EQUIP_WROUGH_FULL);

                }
              
                this.currentState = 'max';
            } else {
                this.currentState = 'base';
            }
        }

        private getLabel(color: number = GameConfig.TextColors.grayWhite) {
            let label = new eui.Label();
            label.size = 20;
            label.textColor = color;
            label.x = 0;
            label.y = 16;
            return label
        }

        /**精炼解锁描述 */
        private getOpenDes(level: number) {
            let res = [];

            if (level < 100) {
                let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 100);
                let att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                let str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 100) + " " + Utils.getAttriFormat(att[1], false, '%s：%s');
                res.push(str);
            }
            if (level < 300) {
                let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 300);
                let att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                let str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 300) + " " + Utils.getAttriFormat(att[2], false, '%s：%s');
                res.push(str);
            }
            if (level < 600) {
                let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 600);
                let att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                let str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 600) + " " + Utils.getAttriFormat(att[3], false, '%s：%s');
                res.push(str);
            }
            return res;

        }

        /**获得当前属性 */
        private setCurAttriGroup(cfg: EquipmentSlotWroughtConfig, newCfg: EquipmentSlotWroughtConfig) {
            let attris = StringUtils.keyValsToNumberArray(cfg.addAttribute);
            let attrisNew;
            if (newCfg) {
                attrisNew = StringUtils.keyValsToNumberArray(newCfg.addAttribute);
            } else {
                attrisNew = {};
            }
            for (let i = 0; i < attris.length; i++) {
                let group = new eui.Group();
                var layout = new eui.HorizontalLayout();
                layout.verticalAlign = egret.VerticalAlign.MIDDLE;
                layout.gap = 20;
                group.layout = layout;
                let info = attris[i];
                let nextInfo = attrisNew[i];
                let label = this.getLabel();
                let str = Utils.getAttriFormat(info, true, '%s：<font color=#e9e9e6>%s</font>');
                label.textFlow = Utils.htmlParser(str);
                group.addChild(label);
                if (unNull(nextInfo)) {
                    let flag = new eui.Image('common_jt_png');
                    Utils.setScaleXY(flag, 0.8);
                    group.addChild(flag);
                    let addLabel = this.getLabel(GameConfig.TextColors.green);
                    addLabel.text = Utils.getAttriFormatVal({ key: info.key, value: nextInfo.value }) + '';
                    group.addChild(addLabel);
                }
                this.m_pAttriCon.addChild(group);
            }
        }

        /**刷新消耗 */
        private refreshCost() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            let equip = genVo.getEquipByPos(this.m_nEquipPos);
            let level = equip.wrought;
            let wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);
            //消耗
            let costItem = Utils.parseCommonItemJson(wroughtCfg.consume)[0];
            this.m_comResCost.setInfo(costItem.itemId, costItem.count);
        }

    }

}