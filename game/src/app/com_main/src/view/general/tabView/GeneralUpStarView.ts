module com_main {
    export class GeneralUpStarView extends CView {
        public static NAME = "GeneralUpStarView";

        public m_BackGround: com_main.CImage;
        public group: eui.Group;
        public group1: eui.Group;
        public m_listAttri: eui.List;
        public group_starBg: eui.Group;
        public group_star: eui.Group;
        public group0: eui.Group;
        public image: eui.Image;
        public m_labTips: com_main.CLabel;

        public m_generalId: number;      //武将id
        private m_generalVo: GeneralVo;   //武将信息
        private m_nStarType: number;		//星星品质
        private actionGroup: egret.tween.TweenGroup;;   //进场动画
        private m_tCollection: eui.ArrayCollection;
        private unlockMc: MCDragonBones;
        public constructor(generalId?: any) {
            super();
            this.name = GeneralUpStarView.NAME;
            this.m_generalId = generalId;
            if (this.m_generalId) {
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            }
            /**初始化 */
            this.initApp("general/tabView/GeneralUpStarViewSkin.exml");
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);
            EventManager.removeEventListeners(this);

            if (this.unlockMc) {
                this.unlockMc.destroy();
            }
            this.unlockMc = null;
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_labTips.visible = false;

            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralUpStarAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;

            /**基础属性 */
            let basisProp: IKeyVal[] = [];
            let attriList1 = this.m_generalVo.attriList;
            for (let j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
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
                let item = this.m_listAttri.getChildAt(i) as GeneralUpStarAttriRender;
                item.doAction();
            }
            this.refreshStarView();
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
                res.push({ name: name, currAttri: currValue, nextAttri: nextValue });
            }
            return res;
        }
        public onTouchBackGround(): void {
            if (!this.m_labTips.visible) return;
            UpManager.history();
            GeneralModel.checkCanAtion(this.m_generalId);

        }
        public refreshItem(datas: GeneralUpStarAttriRD[]) {
            this.m_tCollection.replaceAll(datas);
        }

        public playStarAni() {
            this.unlockMc = new MCDragonBones();
            this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
            this.unlockMc.play(IETypes.EUI_UNLOCK, 1, true)
            this.unlockMc.scaleX = 3;
            this.unlockMc.scaleY = 3;
            this.unlockMc.x = this.width / 2
            this.unlockMc.y = 200;
            this.addChild(this.unlockMc);

        }
        /**刷新星星 */
        private refreshStarView() {
            if (this.m_generalVo) {
                let startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
                let starNum = startCfg.starlevel;
                let res = GeneralModel.getStarRes(startCfg.starType);
                this.refreshStarBg(startCfg.starType);
                this.group_star.removeChildren();
                for (let i = 0; i < starNum; i++) {
                    let contain = new eui.Group();
                    contain.width = 55;
                    contain.height = 55;
                    let star = new eui.Image(res);
                    star.width = 55;
                    star.height = 55;
                    contain.addChild(star);
                    this.group_star.addChild(contain);
                    if (i == (starNum - 1)) {
                        this.playStarEffect(contain);
                    }
                }
            }
        }

        /**刷新星星背景 */
        public refreshStarBg(type: number) {
            if (this.m_nStarType == type) {
                return;
            }
            this.m_nStarType = type;
            Utils.removeAllChild(this.group_starBg);
            let res = GeneralModel.getStarBgRes(this.m_nStarType);
            for (let i = 0; i < 5; i++) {
                let star = new eui.Image(res);
                star.width = 55;
                star.height = 55;
                this.group_starBg.addChild(star);
            }
        }

        /**星星特效 */
        private playStarEffect(contain: eui.Group) {
            let effect = new MCDragonBones();
            effect.initAsync(IETypes.EUI_GenUpStar);
            effect.playOnceDone(IETypes.EUI_GenUpStar, () => {
                if(this.m_labTips){
                    this.m_labTips.visible = true;
                }
            }, this);
            effect.x = 27.5;
            effect.y = 27.5;
            contain.addChild(effect);
        }
    }
    export interface GeneralUpStarAttriRD {
        name: string;
        currAttri: string;
        nextAttri: string;
    }
    /**属性 */
    export class GeneralUpStarAttriRender extends eui.ItemRenderer {
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
            this.m_labCur.x = this.m_labAttriName.x + this.m_labAttriName.width;
        }
        /**播放动画 */
        public doAction() {
            this.action.play(0);
        }
    }
}