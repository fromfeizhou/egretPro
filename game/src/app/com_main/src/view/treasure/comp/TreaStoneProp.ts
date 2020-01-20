module com_main {
    /** 道具 */
    export class TreaStoneProp extends CComponent {
        public m_pTitleRoot: eui.Group;
        public m_labTile: eui.Label;
        public m_labName: eui.Label;
        public m_labAttri: eui.Label;

        public constructor() {
            super();
        }

        public setInfo(vo: TreasureVo, data: gameProto.ITreasureHoleInfo) {
            this.m_labTile.text = GCodeFromat(CLEnum.TREA_STONE_BSK2, data.pos + 1);
            if (data.gemstoneId > 0) {
                this.currentState = 'inlay';
                this.commitProperties();
                Utils.isGray(false, this.m_pTitleRoot);
                let itemCfg = C.ItemConfig[data.gemstoneId];
                let stoneCfg = C.GemstoneConfig[data.gemstoneId];
                Utils.setPropLabName(data.gemstoneId, this.m_labName);
                let datas = StringUtils.keyValsToNumberArray(stoneCfg.attri);
                this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(datas[0], true, '%s<font color=#00ff00>%s</font>'));
            } else {
                this.currentState = 'unInlay';
                this.commitProperties();
                Utils.isGray(true, this.m_pTitleRoot);
                let openNum = vo.getStarCfg().unlockHole;
                if (data.pos >= openNum) {
                    this.m_labName.text = GCodeFromat(CLEnum.TREA_STONE_JS, vo.getStoneOpenStar(data.pos));
                } else {
                    this.m_labName.text = GCode(CLEnum.TREA_STONE_WXQ);
                }
            }
        }

    }

    export class TreaStoneExProp extends CComponent {
        public m_labTile: eui.Label;
        public m_labAttri: eui.Label;

        private m_bActivited: boolean;
        public constructor() {
            super();
            this.m_bActivited = true;
        }

        public setInfo(data: { type: number, exAttr: IKeyVal }) {
            this.m_labTile.text = TreasureModel.getPropStoneTypeName(data.type);
            this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(data.exAttr, true, '%s<font color = 0x00ff00>%s</font>'));
        }

        public set activited(val: boolean) {
            if (this.m_bActivited == val) return;
            this.m_bActivited = val;
            Utils.isGray(!val, this);
        }

    }

}