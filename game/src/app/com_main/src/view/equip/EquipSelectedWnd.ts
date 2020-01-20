module com_main {


	/**
	 * 装备主界面
	 */
    export class EquipSelectedWnd extends CView {
        public static NAME = 'EquipSelectedWnd';

        public m_apopUp: com_main.APopUp;
        public m_labEquipName: eui.Label;
        public m_labFight: eui.Label;
        public m_imgAttriIcon: eui.Image;
        public m_labAttri: eui.Label;
        public m_euipItem: com_main.EquipItem;
        public m_suitItem0: com_main.EquipItem;
        public m_suitItem1: com_main.EquipItem;
        public m_suitItem2: com_main.EquipItem;
        public m_suitItem3: com_main.EquipItem;
        public m_pAttriCon: eui.Group;
        public m_btnEquip: com_main.ComButton;
        public m_listEquip: eui.List;
        public m_pEquipInfo: eui.Group;
        public m_labSuitName: eui.Label;
        public m_labLevel: eui.Label;

        private m_nGeneralId: number;        //当前武将id
        private m_nPos: IEquipPos;   //当前孔位
        private m_nCurIndex: number;        //当前选中id
        private m_curEquipVo: EquipVo;   //当前选中装备

        private m_tEquipVos: EquipVo[];   //可选装备列表

        private m_tEquipArr: any[];   //当前武将穿戴装备列表
        private m_pCollection: eui.ArrayCollection;   //装备列表数据


        public constructor(param?: any) {
            super();
            this.name = EquipSelectedWnd.NAME;
            this.m_nGeneralId = param.generalId;
            this.m_nPos = param.pos;

            this.initApp("equip/EquipSelectedWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_tEquipArr = [];
            this.m_apopUp.setTitleLabel(GCode(CLEnum.EQUIP_TITLE_CD));
            this.m_apopUp.setBottomBorder(false);
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_TAB_ZB));
            EventManager.addTouchTapListener(this.m_btnEquip, this, this.onBtnEquip);

            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            let equip = genVo.getEquipByPos(this.m_nPos);
            this.m_tEquipVos = EquipModel.getGenCanEquips(equip.equipmentUuid, this.m_nPos, false);
            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId);  //取武将当前穿戴装备
            this.initEquipItems();
            this.setSelectedIndex(0);
        }

        /**装备穿戴 */
        private onBtnEquip() {
            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEqItemRD;
            if (data) {
                EquipProxy.C2S_GENERAL_EQUIP(this.m_nGeneralId, this.m_nPos, data.uid);
            }
            UpManager.history(true);
        }

        /**初始化装备列表 */
        private initEquipItems() {
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipItemRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            let res = [];
            for (let i = 0; i < this.m_tEquipVos.length; i++) {
                let vo = this.m_tEquipVos[i];
                let fstate = 0
                let data: IEqItemRD = { uid: vo.uuid, sel: false, fstate: 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
        }

        /**点击回调 */
        private onClickEquip(e: any) {
            this.setSelectedIndex(e.itemIndex);
        }

        /**设置当前选中 */
        private setSelectedIndex(index: number) {
            if (this.m_nCurIndex == index) return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            //没有装备 不显示信息
            if (this.m_nCurIndex >= this.m_tEquipVos.length) {
                this.m_pEquipInfo.visible = false;
                return;
            }
            this.m_pEquipInfo.visible = true;
            this.m_curEquipVo = this.m_tEquipVos[index];
            this.refreshEquipInfo();
        }

        /**刷新选中装备 */
        private refrestSelItem(index: number, val: boolean) {
            let data = this.m_pCollection.getItemAt(index) as IEqItemRD;
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        }

        /**刷新装备信息 */
        private refreshEquipInfo() {
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
                if (info.key == this.m_curEquipVo.suitId) {//判断穿戴套装是否有选中的套装部件
                    //选中的装备的如果已穿戴不模拟激活状态
                    let valueNum = this.isGrayItem(this.m_curEquipVo.equipmentId) ? info.value + 1 : info.value;
                    if (valueNum <= level) return false;
                }
            }
            return true;
        }
        /* * 穿戴的套装是否有选中装备对应的套装*/
        private isSuit() {
            let suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (let i = 0; i < suitDatas.length; i++) {
                let info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) {//判断穿戴套装是否有选中的套装部件
                    return true;
                }
            }
            return false;
        }
        /* * 判断套装是否激活*/
        private isSuitActivate(num: number) {
            let state: number;
            let suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (let i = 0; i < suitDatas.length; i++) {
                let info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) {
                    if (info.value > num) {
                        state = 1;
                        break;
                    }
                    let valueNum = this.isGrayItem(this.m_curEquipVo.equipmentId) ? info.value + 1 : info.value;
                    if (valueNum > num) {
                        state = 2;
                        break;
                    } else {
                        state = 0;
                        break;
                    }
                }
            }
            return state;
        }

        /**刷新套装 */
        private refreshSuitItem() {
            let suitCfg = C.EquipmentSetConfig[this.m_curEquipVo.suitId];
            if (!suitCfg) return;

            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);

            let suits = suitCfg.suit.split(',');
            for (let i = 0; i < 4; i++) {
                let item = this[`m_suitItem${i}`] as EquipItem;
                let wearState = this.isGrayItem(Number(suits[i]));//穿戴状态
                item.setItemInfo(Number(suits[i]));
                item.setWearState(wearState);
                item.currentState = "equip";
                Utils.isGray(this.m_curEquipVo.equipmentId != Number(suits[i]) && wearState, item);

            }

            Utils.removeAllChild(this.m_pAttriCon);
            for (let i = 0; i < 3; i++) {
                let labTile = new eui.Label();
                let level = this.isSuit() && this.isGraylabTitle(i) ? i : -1;
                let activte :string;
                if (this.isSuitActivate(i) == 1) {
                    activte = GCode(CLEnum.EQUIP_TITLE_YJH);
                } else if (this.isSuitActivate(i) == 2) {
                    activte = GCode(CLEnum.EQUIP_TITLE_CDJH);
                }else{
                    activte='';
                }
                let color = level >= 0 ? GameConfig.TextColors.quality2 : GameConfig.TextColors.gray;
                let des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(this.m_curEquipVo.suitId, i) +'  '+ activte);
                labTile.size = 20;
                labTile.width = 450;
                labTile.height = 30;
                labTile.textColor = EquipModel.getSuitColor(level);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        }
    }
    /**render 结构 */
    interface IEqItemRD {
        uid: number,
        sel: boolean,
        /**战力标志 */
        fstate: number,
    }
    /**装备cell */
    class EquipItemRender extends eui.ItemRenderer {
        protected m_equipItem: EquipItem;
        protected m_imgSelected: eui.Image;

        private m_tData: IEqItemRD;

        public constructor() {
            super();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_equipItem = new EquipItem('equip');
            this.addChild(this.m_equipItem);

            this.m_imgSelected = new eui.Image('SelectKuang_png')
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            this.m_equipItem.setFightState(this.m_tData.fstate);

            let vo = EquipModel.getEquipVoByUId(this.m_tData.uid);
            if (vo) {
                this.m_equipItem.setItemInfo(vo.equipmentId);
                this.m_equipItem.setGeneral(vo.generalId);
            }
        }
    }

}