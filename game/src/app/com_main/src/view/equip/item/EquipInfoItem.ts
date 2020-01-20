module com_main {
    /**装备格子 */
    export class EquipInfoItem extends CComponent {
        public static NAME: string = 'EquipInfoItem';

        public m_labEquipName: eui.Label;
        public m_labFight: eui.Label;
        public m_imgAttriIcon: eui.Image;
        public m_labAttri: eui.Label;
        public m_labSuitName: eui.Label;
        public m_euipItem: com_main.EquipItem;
        public m_suitItem1: com_main.EquipItem;
        public m_suitItem2: com_main.EquipItem;
        public m_suitItem3: com_main.EquipItem;
        public m_suitItem4: com_main.EquipItem;
        public m_pAttriCon: eui.Group;
        public m_labLevel: eui.Label;

        private m_nItemId: number;        //格子物品id

        public constructor(state?: string) {
            super();
            this.name = EquipInfoItem.NAME;
            this.skinName = Utils.getAppSkin("equip/EquipInfoItemSkin.exml");
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.touchChildren = false;
            // this.cacheAsBitmap = true;
            this.m_nItemId = 0;
            this.visible = false;
        }

        /**设置装备信息 */
        public set itemId(itemId: number) {
            if (this.m_nItemId == itemId) return;
            this.m_nItemId = itemId;
            this.refreshEquipInfo(itemId);
        }

        public get itemId(): number {
            return this.m_nItemId;
        }

        /**刷新装备信息 */
        private refreshEquipInfo(equipId: number) {
            let eqCfg = C.EquipmentConfig[equipId];
            if (!eqCfg) {
                this.visible = false;
                return;
            }

            this.visible = true;
            let attri: IKeyVal = StringUtils.keyValsToNumberArray(eqCfg.attribute)[0];
            let fight = Utils.calculateNorFight({ [attri.key]: attri.value });
            this.m_imgAttriIcon.source = Utils.getAttriIcon(attri.key);
            this.m_labAttri.text = Utils.getAttriFormat(attri, false, '%s：%s');
            this.m_labFight.text = GCode(CLEnum.FIGHT1) + fight;
            Utils.setPropLabName(equipId, this.m_labEquipName);
            let cfg = PropModel.getCfg(equipId);
            if (cfg) {
                let color = Utils.getColorOfQuality(cfg.quality);
                this.m_labLevel.textFlow = Utils.htmlParser(`${GCode(CLEnum.LEVEL2)}<font color=${color}>${cfg.level}</font>`);
            }
            this.m_euipItem.setItemInfo(equipId);
            this.refreshSuitItem(eqCfg, equipId);
        }

        /**刷新套装 */
        private refreshSuitItem(eqCfg: EquipmentConfig, equipId: number) {

            let suitCfg = C.EquipmentSetConfig[eqCfg.setId];
            if (!suitCfg) return;

            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);

            let suits = suitCfg.suit.split(',');
            for (let i = 0; i < 4; i++) {
                let item = this[`m_suitItem${i}`] as EquipItem;
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";
                Utils.isGray(equipId != Number(suits[i]), item);
            }

            Utils.removeAllChild(this.m_pAttriCon);

            let des = [GCode(CLEnum.EQUIP_TITLE_TZ2), GCode(CLEnum.EQUIP_TITLE_TZ3), GCode(CLEnum.EQUIP_TITLE_TZ4)]
            for (let i = 0; i < 3; i++) {
                let labTile = new eui.Label();
                labTile.text = des[i] + EquipModel.getSuitAttriDes(eqCfg.setId, i);
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                labTile.textColor = EquipModel.getSuitColor(-1);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        }


    }
}