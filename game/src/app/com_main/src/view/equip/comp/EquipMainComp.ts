module com_main {
    /**
     * 基础组件
     */
    export class EquipMainComp extends EquipBaseComp {
        public static NAME: string = 'EquipMainComp';
        public m_pEquipAttri: eui.Group;

        private m_mainPropComp: EquipNorPropComp;    //主属性

        private m_levelComp: EquipNorPropComp;  //等级属性
        private m_gradeComp: EquipNorPropComp;   //进阶属性
        private m_wroughtComp: EquipNorPropComp;   //精炼属性
        private m_levelMasterComp: EquipNorPropComp;   //强化大师
        private m_gradeMasterComp: EquipNorPropComp;   //进阶大师
        private m_wroughtMasterComp: EquipNorPropComp;   //精炼大师
        private m_bonusView: EquipBonusPropComp; //套装组件
        public constructor() {
            super();
            this.name = EquipMainComp.NAME;
            this.skinName = Utils.getAppSkin("equip/comp/EquipMainCompSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        /**清理显示 */
        public clearView() {
            Utils.removeAllChild(this.m_pEquipAttri);
            this.m_mainPropComp = null;
            this.m_bonusView = null;
            this.m_levelComp = null;
            this.m_gradeComp = null;
            this.m_wroughtComp = null;
            this.m_levelMasterComp = null;
            this.m_gradeMasterComp = null;
            this.m_wroughtMasterComp = null;
        }

        /**初始化显示 */
        public initView() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            this.m_mainPropComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_ZBSX));
            this.m_pEquipAttri.addChildAt(this.m_mainPropComp, 0);

            //等级属性
            this.m_levelComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_QHSX));
            this.m_pEquipAttri.addChild(this.m_levelComp);
            //升阶属性
            this.m_gradeComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_SJSX));
            this.m_pEquipAttri.addChild(this.m_gradeComp);

            //精炼属性
            this.m_wroughtComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_JLSX));
            this.m_pEquipAttri.addChild(this.m_wroughtComp);

            //强化大师
            this.m_levelMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_QHJC));
            this.m_pEquipAttri.addChild(this.m_levelMasterComp);
            //进阶大师
            this.m_gradeMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_SJJC));
            this.m_pEquipAttri.addChild(this.m_gradeMasterComp);
            //精炼大师
            this.m_wroughtMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_JLJC));
            this.m_pEquipAttri.addChild(this.m_wroughtMasterComp);

            this.refreshView();

            //套装属性
            this.refreshSuitComp();
        }

        public setAllAttri(arrriList: IKeyVal[]) {
            let list: IKeyVal[] = [];
            let keyList = [];
            let keyList1 = [];
            for (var i = 0; i < arrriList.length; i++) {
                keyList.push(arrriList[i].key);
            }
            for (var i = 0; i < arrriList.length; i++) {
                if (keyList1.indexOf(keyList[i]) == -1) {
                    keyList1.push(keyList[i]);
                    list.push(arrriList[i]);
                }
            }
            return list;
        }

        /**刷新显示 */
        public refreshView() {
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo) return;
            /**刷新主属性 */
            let attris = EquipModel.getGenEquipAttris(this.m_nGeneralId);
            this.m_mainPropComp.refreshItem(this.getAttriRD(attris));
            //刷新等级显示
            attris = EquipModel.getGenEquipLvAttris(this.m_nGeneralId);
            this.m_levelComp.refreshItem(this.getAttriRD(attris));
            //刷新进阶显示
            attris = EquipModel.getGenEquipGradeAttris(this.m_nGeneralId);
            this.m_gradeComp.refreshItem(this.getAttriRD(attris));

            //刷新精炼显示
            attris = EquipModel.getGenEquipWroughtAttris(this.m_nGeneralId);
            this.m_wroughtComp.refreshItem(this.getAttriRD(attris));

            //刷新强化大师显示
            attris = EquipModel.getLevelMaterAttris(0, this.m_nGeneralId);
            this.m_levelMasterComp.refreshItem(this.getAttriRD(attris));

            //刷新进阶大师显示
            attris = EquipModel.getLevelMaterAttris(1, this.m_nGeneralId);
            this.m_gradeMasterComp.refreshItem(this.getAttriRD(attris));

            //刷新精炼大师显示
            attris = EquipModel.getLevelMaterAttris(2, this.m_nGeneralId);
            this.m_wroughtMasterComp.refreshItem(this.getAttriRD(attris));

            /**刷新套装属性 */
            this.refreshSuitComp();
        }

        /**获得渲染结构 */
        private getAttriRD(list: IKeyVal[]) {
            let res: ComAttriRD[] = [];
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                let name = Utils.getAttriNameByType(data.key) + '：';
                let value = Utils.getAttriFormatVal(data);
                res.push({ state: 'style20', name: name, value: value });
            }
            return res;
        }


        /**刷新套装显示 */
        private refreshSuitComp() {
            let suitDatas = EquipModel.getGenSuits(this.m_nGeneralId);
            let listData: { suitId: number, value: number }[];
            if (suitDatas.length == 0) {
                if (this.m_bonusView) Utils.removeFromParent(this.m_bonusView);
                this.m_bonusView = null;
            } else {
                if (!this.m_bonusView) {
                    this.m_bonusView = new EquipBonusPropComp(this.m_nGeneralId);
                    this.m_pEquipAttri.addChildAt(this.m_bonusView, 1);
                }
                listData = [];
                for (let i = 0; i < suitDatas.length; i++) {
                    let vals = suitDatas[i];
                    listData.push({
                        suitId: Number(vals.key),
                        value: Number(vals.value)
                    });
                }
                this.m_bonusView.replaceData(listData);
            }
        }
    }

    /**
    * 套装列表界面
    */
    class EquipBonusPropComp extends CComponent {
        public m_listSuit: eui.List;
        private m_generalId: number;
        private m_tCollection: eui.ArrayCollection;
        public constructor(genId?: number) {
            super();
            this.m_generalId = genId;
            this.skinName = Utils.getAppSkin("equip/prop/EquipBonusPropCompSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listSuit.dataProvider = this.m_tCollection;
            this.m_listSuit.itemRenderer = BonusRender;
            this.m_listSuit.useVirtualLayout = true;
        }

        public replaceData(list: { suitId: number, value: number }[]) {
            let slist = [];
            for (let i = 0; i < list.length; i++) {
                let suit = list[i];
                let suitCfg = C.EquipmentSetConfig[suit.suitId];
                let suits = suitCfg.suit.split(',');
                let rdata: IBonusRender = { suitId: suit.suitId, name: suitCfg.name, value: suit.value, genId: this.m_generalId };
                slist.push(rdata);
            }

            this.m_tCollection.replaceAll(slist);
        }
    }
    export interface IBonusRender {
        suitId: number,
        name: string,
        value: number,
        genId: number,
    }

    class BonusRender extends eui.ItemRenderer {
        public m_labTitle: eui.Label;
        public m_imgLine: eui.Image;
        public m_listAttri: eui.List;

        private m_tData: IBonusRender;
        private m_tCollection: eui.ArrayCollection;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("equip/prop/EquipSuitDesSkin.exml");
        }
        public $onRemoveFromStage() {
            super.$onRemoveFromStage()
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tCollection;
            this.m_listAttri.itemRenderer = ComAttriRender;

            this.cacheAsBitmap = true;
        }

        protected dataChanged() {
            this.m_tData = this.data;
            let suitCfg = C.EquipmentSetConfig[this.m_tData.suitId];
            let suits = suitCfg.suit.split(',');

            let num = this.isGraylabTitle(this.m_tData.genId, suits);           //套装集齐数量
            let suitlv = GCodeFromat(CLEnum.LEVEL1, suitCfg.level);              //套装等级
            this.m_labTitle.text = suitlv + suitCfg.name + '(' + num + '/4)';
            this.m_labTitle.textColor = Utils.getColorOfQuality(suitCfg.quality);

            let des = [GCode(CLEnum.EQUIP_TITLE_TZ2), GCode(CLEnum.EQUIP_TITLE_TZ3), GCode(CLEnum.EQUIP_TITLE_TZ4)];
            let res: ComAttriRD[] = [];
            for (let level = 0; level < 3; level++) {
                let name = des[level];
                let val = EquipModel.getSuitAttriDes(this.m_tData.suitId, level);
                let isGay = this.m_tData.value <= level;
                res.push({ state: 'style20b', name: name, value: val, isGay: isGay })
            }
            this.m_tCollection.replaceAll(res);

        }
        /** 套装就激活件数 */
        public isGraylabTitle(genId: number, suits: string[]) {
            let genVo = GeneralModel.getOwnGeneral(genId);
            let tEquipArr = EquipModel.checkEquipNum(genVo, genId);  //取武将当前穿戴装备
            let num: number = 0;
            for (let i = 0; i < suits.length; i++) {
                let infoId = Number(suits[i]);
                for (let j = 0; j < tEquipArr.length; j++) {
                    if (tEquipArr[j]) {
                        if (infoId == tEquipArr[j].equipmentId) {
                            num += 1;
                        }
                    }
                }
            }
            return num;
        }
    }

    /**
    * 基础属性
    */
    export class EquipNorPropComp extends CComponent {
        public m_labTitle: eui.Label;
        public m_listAttri: eui.List;

        private m_sTitle: string;
        private m_tCollection: eui.ArrayCollection;
        public constructor(name: string) {
            super();
            this.m_sTitle = name;
            this.skinName = Utils.getAppSkin("equip/prop/EquipNorPropCompSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_labTitle.text = this.m_sTitle;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = ComAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
        }

        public refreshItem(datas: ComAttriRD[]) {
            this.m_tCollection.replaceAll(datas);
        }

    }

}