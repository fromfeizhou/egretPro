module com_main {
    /** 道具 */
    export class TreaIconView extends CComponent {
        public m_pEffRoot: eui.Group;
        public m_iconRoot: eui.Group;
        public m_imgIcon: eui.Image;
        public m_pMcRoot: eui.Group;

        private m_nItemId: number;
        private m_bIsAction: boolean;    //图标动画

        private m_effBg: MCDragonBones;
        private m_mcIcon:MCDragonBones; //动画
        private m_nLocalY: number;   //动画起始位置

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("treasure/TreaIconViewSkin.exml");
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            this.clearMc();
            this.stopAction();
            this.clearEffect();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_nLocalY = this.m_iconRoot.y;
        }


        /**物品id */
        public setItemId(id: number,isMc:boolean = false) {
            if (this.m_nItemId == id) return;
            this.m_nItemId = id;
            this.refreshView(isMc);
        }
        // public get itemId() {
        //     return this.m_nItemId;
        // }

        /**刷新显示 */
        private refreshView(isMc:boolean): void {
            let res = TreasureModel.getTreaBigIcon(this.m_nItemId);
            if (res == 'icon_trea_b_1055_png') {
                this.currentState = 'bagua';
            } else {
                this.currentState = 'normal';
            }
            this.commitProperties();
            this.clearMc();
            this.stopAction();
            if(isMc && TreasureModel.hasMcRes(this.m_nItemId)){
                this.m_mcIcon = NormalMcMgr.createMc(TreasureModel.getMcName(this.m_nItemId));
                this.m_pMcRoot.addChild(this.m_mcIcon);
                this.m_imgIcon.visible = false;
            }else{
                this.m_imgIcon.visible = true;
                this.m_imgIcon.source = TreasureModel.getTreaBigIcon(this.m_nItemId);
                if(isMc)this.doAction();
            }
        }

        private clearMc(){
            if(this.m_mcIcon){
                NormalMcMgr.removeMc(this.m_mcIcon);
                this.m_mcIcon = null;
            }
        }

        /**宝物动画 */
        private doAction() {
            if (!this.m_bIsAction) {
                this.m_bIsAction = true;
                let ty = this.m_nLocalY;
                let gap = 20;
                let tw = egret.Tween.get(this.m_iconRoot, { loop: true });
                tw.to({ y: ty - gap }, 1500, Ease.sineInOut);
                tw.to({ y: ty }, 1500, Ease.sineInOut);
            }
        }

        /**宝物动画 */
        private stopAction() {
            if (this.m_bIsAction) {
                egret.Tween.removeTweens(this.m_iconRoot);
                this.m_iconRoot.y = this.m_nLocalY;
                this.m_bIsAction = false;
            }
        }
        /**添加背景特效 */
        public createEffect() {
            if (!this.m_effBg) {
                this.m_effBg = NormalMcMgr.createMc(IETypes.EUI_TreaBg);
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        }
        /**移除背景特效 */
        public clearEffect() {
            if (this.m_effBg) {
                NormalMcMgr.removeMc(this.m_effBg);
                this.m_effBg = null;
            }
        }

    }
}