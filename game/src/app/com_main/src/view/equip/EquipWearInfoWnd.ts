module com_main {


	/**
	 * 装备穿戴信息界面
	 */
    export class EquipWearInfoWnd extends CView {
        public static NAME = 'EquipWearInfoWnd';

        public m_pEquipInfo: eui.Group;
        public m_labEquipName: eui.Label;
        public m_labFight: eui.Label;
        public m_imgAttriIcon: eui.Image;
        public m_labAttri: eui.Label;
        public m_labSuitName: eui.Label;
        public m_labLevel: eui.Label;
        public m_euipItem: com_main.EquipItem;
        public m_suitItem0: com_main.EquipItem;
        public m_suitItem1: com_main.EquipItem;
        public m_suitItem2: com_main.EquipItem;
        public m_suitItem3: com_main.EquipItem;
        public m_pAttriCon: eui.Group;
        public m_btnReplace: com_main.ComButton;
        public m_btnUnload: com_main.ComButton;

        private m_nGeneralId: number;        //当前武将id
        private m_nPos: IEquipPos;           //当前孔位
        private m_nCurIndex: number;        //当前选中id
        private m_curEquipVo: EquipVo;   //当前选中装备
        private m_tEquipVos: EquipVo[];   //可选装备列表
        private m_tEquipArr: any[];   //当前穿戴装备列表
        public constructor(param?: any) {
            super();
            this.name = EquipSelectedWnd.NAME;
            this.m_nGeneralId = param.generalId;
            this.m_nPos = param.pos;
            this.initApp("equip/EquipWearInfoWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEvent();
            this.m_tEquipArr = [];
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            let equip = genVo.getEquipByPos(this.m_nPos);
            this.m_tEquipVos = EquipModel.getGenCanEquips(equip.equipmentUuid, this.m_nPos, false);

            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId);  //取武将当前穿戴装备
            this.refreshEquipInfo();
        }
        /**监听事件 */
        private addEvent() {
            this.m_btnReplace.setTitleLabel(GCode(CLEnum.EQUIP_ZB_GH));
            EventManager.addTouchTapListener(this.m_btnReplace, this, this.onBtnEquip);
            this.m_btnUnload.setTitleLabel(GCode(CLEnum.EQUIP_ZB_XX));
            EventManager.addTouchTapListener(this.m_btnUnload, this, this.onBtnUnload);
        }

        /**装备更换 */
        private onBtnEquip() {
            UpManager.history(true);
            Utils.open_view(TASK_UI.POP_EQUIP_SEL_WND, { generalId: this.m_nGeneralId, pos: this.m_nPos })
        }
        /**装备卸下 */
        private onBtnUnload() {
            EquipProxy.C2S_GENERAL_EQUIP(this.m_nGeneralId, this.m_nPos, 0);
            UpManager.history(true);
        }
        /**刷新装备信息 */
        private refreshEquipInfo() {
            if (this.m_tEquipVos && this.m_tEquipVos.length > 0) {
                for (let i = 0; i < this.m_tEquipVos.length; i++) {
                    let vo = this.m_tEquipVos[i];
                    if (vo.generalId == this.m_nGeneralId) {
                        this.m_curEquipVo = vo;
                        break;
                    }
                }
            }
            let attri: IKeyVal = this.m_curEquipVo.mainAttri;
            this.m_imgAttriIcon.source = Utils.getAttriIcon(attri.key);
            this.m_labAttri.text = Utils.getAttriFormat(attri, false, '%s：%s');
            this.m_labFight.text = GCode(CLEnum.FIGHT1) + this.m_curEquipVo.fight;
            Utils.setPropLabName(this.m_curEquipVo.equipmentId, this.m_labEquipName);
            let color = Utils.getColorOfQuality(this.m_curEquipVo.quality);
            this.m_labLevel.textFlow = Utils.htmlParser(`${GCode(CLEnum.LEVEL2)}<font color=${color}>${this.m_curEquipVo.itemCfg.level}</font>`);
            this.m_euipItem.setItemInfo(this.m_curEquipVo.equipmentId);
            this.refreshSuitItem();
        }

        /**点击当前武将穿戴的单件装备在套装中的激活状态 */
        private isGrayItem(genid: number) {
            for (let j = 0; j < this.m_tEquipArr.length; j++) {
                let equipVo = this.m_tEquipArr[j];
                if (equipVo) {
                    if (this.m_tEquipArr[j].equipmentId == genid) {
                        return false;
                    }
                }
            }
            return true;
        }

        /** 套装就激活件数 */
        private isGraylabTitle(level: number) {
            let suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (let i = 0; i < suitDatas.length; i++) {
                let info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) {
                    if (info.value <= level) return false;
                }
            }
            return true;
        }
        /**刷新套装 */
        private refreshSuitItem() {
            let suitCfg = C.EquipmentSetConfig[this.m_curEquipVo.suitId];
            let suitDatas = EquipModel.getGenSuits(this.m_nGeneralId);
            if (!suitCfg) return;

            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            let suits = suitCfg.suit.split(',');
            for (let i = 0; i < 4; i++) {
                let item = this[`m_suitItem${i}`] as EquipItem;
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";

                Utils.isGray(this.isGrayItem(Number(suits[i])), item);
            }


            Utils.removeAllChild(this.m_pAttriCon);

            for (let i = 0; i < 3; i++) {
                let labTile = new eui.Label();
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                let level = this.isGraylabTitle(i) ? i : -1;
                let color = level >= 0 ? GameConfig.TextColors.quality2 : GameConfig.TextColors.gray;
                let des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(this.m_curEquipVo.suitId, i));
                labTile.textColor = EquipModel.getSuitColor(level);
                labTile.x = 50;
                labTile.y = 16;


                this.m_pAttriCon.addChild(labTile);
            }
        }
    }

}