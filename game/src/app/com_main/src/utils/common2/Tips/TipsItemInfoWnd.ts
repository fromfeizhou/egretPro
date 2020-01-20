/**
  * tips类
  * All Rights Reserved. 
  * 提示相关信息
  */
module com_main {

    export enum TipsItemEnum {
        /**通用tips */
        Normal = 0,
        /**宝物 */
        trea = 5,
        /**装备套装tips */
        Equip = 15,
    }
    export class TipsItemInfoWnd extends CView {
        public static NAME = 'TipsItemInfoWnd';

        public m_pEquipInfo: eui.Group;
        public m_labEquipName: eui.Label;
        public m_labFight: eui.Label;
        public m_imgAttriIcon: eui.Image;
        public m_labAttri: eui.Label;
        public m_labSuitName: eui.Label;
        public m_imgAttriIcon0: eui.Image;
        public m_labAttri0: eui.Label;
        public m_labLevel: eui.Label;
        public m_euipItem: com_main.ComItemNew;
        public m_suitItem0: com_main.EquipItem;
        public m_suitItem1: com_main.EquipItem;
        public m_suitItem2: com_main.EquipItem;
        public m_suitItem3: com_main.EquipItem;
        public m_pAttriCon: eui.Group;
        public m_labNum: eui.Label;
        public m_labDes: com_main.CLabel;

        public m_listSkill: eui.List;//宝物次属性
        private m_tSkillColl: eui.ArrayCollection;   //技能描述
        private m_tGenColl: eui.ArrayCollection;     //专属武将属性
        public m_pGenRoot: eui.Group;
        public m_generalHead: com_main.GeneralHeadRender;
        public m_labGenName: eui.Label;
        public m_listAttriGen: eui.List;

        private mainType: number;  //点击的物品类型
        private itemId: number;     //点击的物品id
        private isShowLv: boolean;   //是否显示等级
        public constructor(param: any) {
            super();

            this.name = TipsItemInfoWnd.NAME;
            this.mainType = param.type ? param.type : 0;
            this.itemId = param.itemId;
            this.setCurrStage(this.mainType);
            this.initApp("common/tips/TipItemInfoWndSkin.exml");
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            let title = GCode(CLEnum.EQUIP_QHJC);
            this.setItemInfo();
            this.getCfgInfoAttri();
        }
        /**设置物品信息*/
        private setItemInfo() {
            let itemCfg = C.ItemConfig[this.itemId];
            Utils.setPropLabName(itemCfg.id, this.m_labEquipName);
            this.m_euipItem.setItemInfo(this.itemId);
            let color = Utils.getColorOfQuality(itemCfg.quality);
            this.m_labLevel.textFlow = Utils.htmlParser(`${GCode(CLEnum.LEVEL2)}<font color=${color}>${itemCfg.level}</font>`);
            this.m_labLevel.visible = this.isShowLv;

        }
        /**设置战力，属性 */
        private getCfgInfoAttri() {
            if (this.mainType == TipsItemEnum.Equip) {//装备
                let cfgAttri = C.EquipmentConfig[this.itemId];
                if (!cfgAttri) return;
                let attri1: IKeyVal = StringUtils.keyValsToNumberArray(cfgAttri.attribute)[0];
                let fight1 = Utils.calculateNorFight({ [attri1.key]: attri1.value });
                this.m_imgAttriIcon.source = Utils.getAttriIcon(attri1.key);
                this.m_labAttri.text = Utils.getAttriFormat(attri1, false, '%s：%s');
                this.m_labFight.text = GCode(CLEnum.FIGHT1) + fight1;
                this.refreshSuitItem(cfgAttri.setId);

            } else if (this.mainType == TipsItemEnum.trea) {//宝物
                let cfgAttri1 = C.TreasureConfig[this.itemId];
                if (!cfgAttri1) return;
                let attri1: IKeyVal = StringUtils.keyValsToNumberArray(cfgAttri1.mainAttribute)[0];
                let attri2: IKeyVal = StringUtils.keyValsToNumberArray(cfgAttri1.mainAttribute)[1];
                let fight1 = Utils.calculateNorFight({ [attri1.key]: attri1.value });
                let fight2 = Utils.calculateNorFight({ [attri2.key]: attri2.value });
                let allFight = fight1 + fight2;
                this.m_imgAttriIcon.source = Utils.getAttriIcon(attri1.key);
                this.m_imgAttriIcon0.source = Utils.getAttriIcon(attri2.key);
                this.m_labAttri.text = Utils.getAttriFormat(attri1, false, '%s：%s');
                this.m_labAttri0.text = Utils.getAttriFormat(attri2, false, '%s：%s');
                this.m_labFight.text = GCode(CLEnum.FIGHT1) + allFight;
                this.setTreaSkill(cfgAttri1.quality, cfgAttri1.secondaryAttributeGroup);
                this.setGeneral(cfgAttri1.exclusiveId, cfgAttri1.exclusiveAdd);

            } else { //普通
                this.m_labNum.text = PropModel.getPropNum(this.itemId).toString();
                let Itemcfg = C.ItemConfig[this.itemId];
                if (!Itemcfg) return;
                this.m_labDes.textFlow = Utils.htmlParser(Itemcfg.description);
                var width = this.m_labDes.width;
                if (width > 400) {
                    this.m_labDes.width = 400;
                }
            }
        }
        /**刷新套装 */
        private refreshSuitItem(setId: number) {
            let suitCfg = C.EquipmentSetConfig[setId];
            if (!suitCfg) return;

            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            let suits = suitCfg.suit.split(',');
            for (let i = 0; i < 4; i++) {
                let item = this[`m_suitItem${i}`] as EquipItem;
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";
            }
            Utils.removeAllChild(this.m_pAttriCon);

            for (let i = 0; i < 3; i++) {
                let labTile = new eui.Label();
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                // let level = this.isGraylabTitle(i) ? i : -1;
                let color = GameConfig.TextColors.quality2;
                let des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(setId, i));
                labTile.textColor = EquipModel.getSuitColor(0);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        }
        /**宝物技能 */
        private setTreaSkill(quality: number, secondAttris: string) {
            this.m_tSkillColl = new eui.ArrayCollection();
            this.m_listSkill.dataProvider = this.m_tSkillColl;
            this.m_listSkill.itemRenderer = ComAttriRender;

            let skills = secondAttris.split(',');
            let cfgs: SecondAttributeConfig[] = [];
            for (let j = 0; j < skills.length; j++) {
                let cfg = TreasureModel.getSecondAttr(Number(skills[j]), quality);
                cfgs.push(cfg);
            }
            if (cfgs.length > 0) {
                let res: ComAttriRD[] = [];
                for (let i = 0; i < cfgs.length; i++) {
                    res.push({ state: 'style20b', name: cfgs[i].name + '：', value: cfgs[i].desc });
                }
                this.m_tSkillColl.replaceAll(res);
            }
        }
        /**专属武将 */
        private setGeneral(exclusiveId: number, exclusiveAdds: string) {

            this.m_tGenColl = new eui.ArrayCollection();
            this.m_listAttriGen.dataProvider = this.m_tGenColl;
            this.m_listAttriGen.itemRenderer = ComAttriRender;

            let genskills = StringUtils.keyValsToNumberArray(exclusiveAdds);
            let genAttrs: IKeyVal[] = [];
            for (let j = 0; j < genskills.length; j++) {
                genAttrs.push({ key: genskills[j].key, value: genskills[j].value })
            }
            if (exclusiveId > 0) {
                this.m_pGenRoot.visible = true;
                this.m_generalHead.setGenViewInfo(exclusiveId)
                GeneralModel.setLabGaneralName(exclusiveId, this.m_labGenName);
                let res: ComAttriRD[] = [];
                for (let i = 0; i < genAttrs.length; i++) {
                    let data = genAttrs[i];
                    res.push({ state: 'style20c', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
                }
                this.m_tGenColl.replaceAll(res);
            }
            else {
                this.m_pGenRoot.visible = false;
                this.height = 365;
            }
        }
        private setCurrStage(type: number) {
            switch (type) {
                case TipsItemEnum.Equip: {
                    this.currentState = 'equip';
                    this.isShowLv = true;
                    this.height = 525;
                    break;
                }
                case TipsItemEnum.trea: {
                    this.currentState = 'trea';
                    this.isShowLv = true;
                    this.height = 525;
                    break;
                }
                default: {
                    this.currentState = 'public';
                    this.isShowLv = false;
                    this.height = 282;
                    break;
                }
            }
        }
    }
}


