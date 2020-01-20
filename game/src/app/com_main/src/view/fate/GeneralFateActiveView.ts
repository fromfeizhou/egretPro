module com_main {


	/**
	 * 武将缘分弹出框
	 */
    export class GeneralFateActiveView extends CView {
        public static NAME = 'GeneralFateActiveView';
        public m_BackGround: com_main.CImage;
        public group: eui.Group;
        public group1: eui.Group;
        public m_pFate: eui.Group;
        public m_pro: eui.Group;
        public m_phead: eui.Group;
        public m_lbName: com_main.CLabel;
        public m_lbContent: eui.Label;
        public group0: eui.Group;
        public image: eui.Image;
        public m_labTips: eui.Group;


        private actionGroup: egret.tween.TweenGroup;;   //进场动画
        private m_fateId: number;
        private m_fateData: RelationConfig;
        public constructor(id: number) {
            super();
            this.name = GeneralFateActiveView.NAME;
            this.m_fateId = id;
            this.initApp("fate/GeneralFateActiveViewSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
            this.removeEvent();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_labTips.visible = false;
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play(0);
            this.initEvent()
            this.refreshView();
        }
        public refreshView() {
            let fateCfg: RelationConfig = C.RelationConfig[this.m_fateId];
            this.m_fateData = fateCfg;
            this.m_lbName.text = fateCfg.name;
            this.m_lbContent.textFlow = Utils.htmlParser(fateCfg.Desc);
            this.m_pro.removeChildren();
            this.m_phead.removeChildren();
            let triggerParameter: string[] = fateCfg.triggerParameter.split(",")
            let activiState: string = "unlock";
            for (let index = 0; index < triggerParameter.length; index++) {
                let triggerArr: string[] = triggerParameter[index].split("_");
                if (index != triggerParameter.length - 1) {
                    let pro: FateProComp = FateProComp.create(activiState);
                    pro.x = 96 * (index + 1);
                    pro.y = 44;
                    this.m_pro.addChild(pro)
                }

            }
            for (let index = 0; index < triggerParameter.length; index++) {
                let genHead: GeneralHeadRender = GeneralHeadRender.create("fate");
                let triggerArr: string[] = triggerParameter[index].split("_");
                genHead.setGenViewInfo(Number(triggerArr[0]), 1, Number(triggerArr[1]))
                genHead.x = 170 * index;
                genHead.scaleX = 0.8;
                genHead.scaleY = 0.8;
                this.m_phead.addChild(genHead);
            }

        }
        /**
       * 动画组播放完成
       */
        private onTweenComplete(): void {
            this.m_labTips.visible = true;
        }

        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */

        private initEvent() {
            EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
        }

        private removeEvent() {

        }
        public onTouchBackGround(): void {
            if (!this.m_labTips.visible) return;
            UpManager.history();
        }
        /**=====================================================================================
      * 事件监听 end
      * =====================================================================================
      */
    }

}