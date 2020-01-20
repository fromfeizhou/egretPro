module com_main {
    /**
    * 缘分栏组件
    */
    export class TeamFateItem extends CComponent {

        public m_imgBtnMask: eui.Image;
        public m_pPropRoot: eui.Group;
        public m_labFateName:eui.Label;

        private m_nFateId: number;   //缘分id
        private m_bIsShow:boolean;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/team/TeamFateItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_bIsShow = false;
            this.setPropHight(0);

            EventManager.addTouchTapListener(this.m_imgBtnMask, this, () => {
                this.m_bIsShow  =!this.m_bIsShow;
                if(this.m_bIsShow){
                    this.setPropHight(20);
                    this.currentState = 'show';
                }else{
                    this.setPropHight(0);
                    this.currentState = 'hide';
                }
            });
        }



        public set fateId(val: number) {
            if (this.m_nFateId == val) return;
            this.m_nFateId = val;
            this.m_labFateName.text = GCode(CLEnum.CAMP_NAME_QY);
            this.refrehPropView();
        }

        public get fateId() {
            return this.m_nFateId;
        }

        /**刷新属性显示 */
        private refrehPropView() {
            Utils.removeAllChild(this.m_pPropRoot);
            for (let i = 0; i < 2; i++) {
                let prop = new TeamFateProp({ key: AttriType.ATK, value: 100 });
                this.m_pPropRoot.addChild(prop);
            }
        }

        /**设置高度 */
        private setPropHight(size:number){
            for(let i = 0;i < this.m_pPropRoot.numChildren;i++){
                this.m_pPropRoot.getChildAt(i).height = size;
            }
        }
    }

    /**
     * 缘分属性
     */
    export class TeamFateProp extends CComponent {
        public m_imgIcon: eui.Image;
        public m_labProp: eui.Label;

        private m_sIconName: string;
        private m_sDes: string;
        private m_prop: IKeyVal;
        public constructor(prop: IKeyVal) {
            super();
            this.m_prop = prop;
            this.skinName = Utils.getSkinName("app/team/TeamFatePropSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy() {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_imgIcon.source = Utils.getAttriIcon(this.m_prop.key);
            this.m_labProp.textFlow =Utils.htmlParser(Utils.getAttriFormat(this.m_prop, false, '<font color=#878785>%s：</font>%s'));
        }


    }
}