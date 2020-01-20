module com_main {
    export class ComGenCard extends CComponent {
        public static NAME = 'ComGenCard';

        public m_imgMask: com_main.CImage;
        public m_imgIcon: com_main.CImage;
        public m_pMcRoot: eui.Group;

        private m_heroMc: MCDragonBones;
        private m_bIsMc: boolean;      //是否展示动画
        private m_nId: number;   //武将id

        public constructor() {
            super();
            this.name = ComGenCard.NAME;
            this.skinName = Utils.getAppSkin("common/ComGenCardSkin.exml")
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }

        public onDestroy(): void {
            this.clearHeroMc();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        /**设置动画 */
        public setInfo(id: number, isMc: boolean = false, isMask: boolean = true) {
            if (PlatConst.isLowMcMachine()) {
                //微信小游戏UI不显示武将动画
                isMc = false;
            }
            if (isMask) {
                this.mask = this.m_imgMask;
            } else {
                this.m_imgMask.visible = false;
            }

            if (this.m_nId == id && this.m_bIsMc == isMc) return;

            this.m_nId = id;
            this.m_bIsMc = isMc;
            this.refreshView();
        }

        /**动画播放 */
        public play() {
            if (this.m_heroMc) this.m_heroMc.play('animation');
        }
        /**动画停止 */
        public stop() {
            if (this.m_heroMc) this.m_heroMc.stop();
        }

        /**显示刷新 */
        private refreshView() {
            this.clearHeroMc();
            this.m_imgIcon.source = "";
            let cfg = C.GeneralConfig[this.m_nId];
            if (!cfg) return;
            if (this.m_bIsMc && GeneralModel.hasSoliderLogoAnima(cfg.role)) {
                this.m_heroMc = GeneralMCMgr.createMc("Gen_Anim_" + cfg.role);
                this.m_pMcRoot.addChild(this.m_heroMc);
            } else {
                this.m_imgIcon.source = GeneralModel.getSoldierBigLogo(cfg.role);
            }
        }
       
        /**清理动画 */
        private clearHeroMc() {
            if (this.m_heroMc) {
                GeneralMCMgr.removeMc(this.m_heroMc.dbName);
                this.m_heroMc = null;
            }
        }
        /**获得动画形象 */
        public get heroIcon(){
            if (this.m_heroMc)  return this.m_heroMc;
            return this.m_imgIcon;
        }

    }
}