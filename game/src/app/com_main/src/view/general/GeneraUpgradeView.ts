// TypeScript file


module com_main {
	/**
	 * 离线收益
	 */
    export class GeneraUpgradeView extends CView {
        public static NAME = 'GeneraUpgradeView';

        public m_pRoot: eui.Group;
        public m_apopUp: com_main.APopUp;
        public m_curLev: eui.Label;
        public m_nextLev: eui.Label;
        public m_listAttri: eui.List;
        public m_comResCost: com_main.ComResCost;
        public m_upgreBtn: com_main.ComButton;


        private m_Lev: number//突破的等级
        private m_generalId: number//武将id；
        private m_tCollection: eui.ArrayCollection;
        private m_generalVo: GeneralVo;
        public constructor(generalId: number) {
            super();
            this.name = GeneraUpgradeView.NAME;
            this.m_generalId = generalId;

            if (this.m_generalId) {
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            }
            this.m_Lev = this.m_generalVo.level;
            this.initApp("general/GeneraUpgradeViewSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.titleShow = false;
            this.m_apopUp.setTitleLabelVisible(false);
            EventManager.addTouchScaleListener(this.m_upgreBtn, this, this.onClickBtn);
            this.initView();
        }
        private initView() {
            this.m_upgreBtn.setTitleLabel(GCode(CLEnum.GEN_TUPO))
            // let itemNum = PropModel.getPropNum(PropEnum.TUPODAN);
            this.m_comResCost.setInfo(PropEnum.TUPODAN, this.m_generalVo.upgrageItem.count);
            this.m_curLev.text = `${this.m_Lev}`
            this.m_nextLev.text = `${GeneralModel.getMaxLevel(this.m_Lev) != undefined ? GeneralModel.getMaxLevel(this.m_Lev) : 200}`
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralUpgradeItemRender;
            this.m_listAttri.dataProvider = this.m_tCollection;

            /**基础属性 */
            let basisProp: IKeyVal[] = [];
            let cfg = this.m_generalVo.GetGeneralCfg();
            let attriList1 = StringUtils.keyValsToNumber(cfg.attribute);
            for (let j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
            this.commitProperties();
        }

        /**获得渲染结构 */
        public getGeneralAttriRD(currList: IKeyVal[], nxetList: IKeyVal[]) {
            let res: GeneralUpStarAttriRD[] = [];
            for (let i = 0; i < nxetList.length; i++) {
                let data = nxetList[i];
                let currdata = currList[i];
                let name = Utils.getAttriNameByType(data.key) + '：';
                let nextValue = Utils.getAttriFormatVal(data);
                let currValue = Utils.getAttriFormatVal(currdata);
                let nextAll = Number(nextValue) + Number(currValue);
                res.push({ name: name, currAttri: currValue, nextAttri: nextAll.toString() });
            }
            return res;
        }
        public refreshItem(datas: GeneralUpStarAttriRD[]) {
            this.m_tCollection.replaceAll(datas);
        }
        private onClickBtn(e: egret.Event) {
            if (!PropModel.isItemEnough(this.m_generalVo.upgrageItem.itemId, this.m_generalVo.upgrageItem.count)) {
                EffectUtils.showTips(GCode(CLEnum.GEN_TUPO_NOENOUGH), 1, true);
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_generalVo.upgrageItem.itemId);
                return;
            }
            GeneralProxy.send_GENERAL_UPGRADE(this.m_generalId);
            UpManager.history();
        }
        public onDestroy(): void {
            super.onDestroy();
        }
    }

    /**属性 */
    export class GeneralUpgradeItemRender extends eui.ItemRenderer {
        public m_AttName: eui.Label;
        public m_curVal: eui.Label;
        public m_nextVal: eui.Label;


        protected m_tData: GeneralUpStarAttriRD;

        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {

            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.refresh();
            this.commitProperties();
        }

        protected refresh() {
            this.m_AttName.text = this.m_tData.name;
            this.m_curVal.text = this.m_tData.currAttri;
            this.m_nextVal.text = this.m_tData.nextAttri;
        }

    }
}

