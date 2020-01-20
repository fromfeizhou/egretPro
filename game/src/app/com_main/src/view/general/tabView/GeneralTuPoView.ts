module com_main {
    export class GeneralTuPoView extends CView {
        public static NAME = "GeneralTuPoView";

        public m_BackGround: com_main.CImage;
        public group: eui.Group;
        public group1: eui.Group;
        public m_listAttri: eui.List;
        public group0: eui.Group;
        public image: eui.Image;
        public m_labTips: com_main.CLabel;

        public m_generalId: number;      //武将id
        private m_generalVo: GeneralVo;   //武将信息
        private actionGroup: egret.tween.TweenGroup;;   //进场动画
        private m_tCollection: eui.ArrayCollection;
        private unlockMc: MCDragonBones;

        public constructor(generalId?: any) {
            super();
            this.name = GeneralTuPoView.NAME;
            this.m_generalId = generalId;
            if (this.m_generalId) {
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            }
            /**初始化 */
            this.initApp("general/tabView/GeneralToPuViewSkin.exml");
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);

            EventManager.removeEventListeners(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            if (this.unlockMc) {
                this.unlockMc.destroy();
            }
            this.unlockMc = null;
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_labTips.visible = false;

            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralTuPoAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;

            /**基础属性 */
            let basisProp: IKeyVal[] = [];
            let cfg = this.m_generalVo.GetGeneralTuPoCfg();
            let attriList1 = StringUtils.keyValsToNumber(cfg.attribute);
            for (let j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
            this.commitProperties();
            EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.playStarAni();
            this.actionGroup.play(0);
        }

        /**
         * 动画组播放完成
         */
        private onTweenComplete(): void {
            for (let i = 0; i < this.m_listAttri.numChildren; i++) {
                let item = this.m_listAttri.getChildAt(i) as GeneralTuPoAttriRender;
                item.doAction();
            }
            this.m_labTips.visible = true;
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
        /**特效闪烁 */
        public playStarAni() {
            this.unlockMc = new MCDragonBones();
            this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
            this.unlockMc.play(IETypes.EUI_UNLOCK,1,true);
            this.unlockMc.scaleX = 3;
            this.unlockMc.scaleY = 3;
            this.unlockMc.x = this.width / 2
            this.unlockMc.y = 200;
            this.addChild(this.unlockMc);

        }
        public onTouchBackGround(): void {
            if (!this.m_labTips.visible) return;
            UpManager.history();
        }
        public refreshItem(datas: GeneralUpStarAttriRD[]) {
            this.m_tCollection.replaceAll(datas);
        }
    }
    /**属性 */
    export class GeneralTuPoAttriRender extends eui.ItemRenderer {
        public m_labAttriName: com_main.CLabel;
        public m_labCur: com_main.CLabel;
        public image: eui.Image;
        public m_labNext: com_main.CLabel;
        public m_imgMask: eui.Image;

        protected m_tData: GeneralUpStarAttriRD;
        private action: egret.tween.TweenGroup;

        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            egret.Tween.removeTweens(this.m_imgMask);
            egret.Tween.removeTweens(this.image);
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_labNext.mask = this.m_imgMask;
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.refresh();
            this.commitProperties();
        }

        protected refresh() {
            this.m_labAttriName.text = this.m_tData.name;
            this.m_labCur.text = this.m_tData.currAttri;
            this.m_labNext.text = this.m_tData.nextAttri;
        }
        /**播放动画 */
        public doAction() {
            this.action.play(0);
        }
    }
}