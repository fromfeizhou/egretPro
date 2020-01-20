module com_main {
    export class PatrolBossView extends CComponent {
        public static NAME: string = "PatrolBossView";

        public m_pBoss:eui.Group;
        public m_imgIcon:eui.Image;
        public m_imgHBTips:eui.Image;
        public m_proHB:com_main.ComProRdBar;



        private m_bTipsAct: boolean; //文本tips
        private m_bBossAct: boolean = false;
        private m_nBossTime: number;
        private m_btnBossAtackEff: MCDragonBones;//boss入侵按钮特效
        public constructor(id?: number) {
            super();
            this.name = PatrolBossView.NAME;
            this.skinName = Utils.getAppSkin("top_new/item/PatrolBossViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            this.removeBossTipsAct();
            this.clearBtnBossAttackEff()
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // this.m_imgIcon.mask = this.m_imgMask;
            this.initView();
            this.validateNow();
            this.refreshPro();
            this.initEvent();
        }

        /**初始化数据 */
        private initView() {
            if (!PatrolModel.getBossInfo()) {
                this.visible = false;
                return;
            }
            this.visible = true;
            let time = PatrolModel.getBossTime();
            this.m_nBossTime = PatrolModel.getBossTimeMax();

            let genCfg = C.GeneralConfig[1020] || C.GeneralConfig[1001];
            this.m_imgIcon.source = GeneralModel.getSoldierLogo(genCfg.role);

            this.validateNow();
            this.refreshPro();
        }

        /**刷新进度 */
        private refreshPro() {
            if (this.isBossIn()) {
                let time = PatrolModel.getBossTime();
                if (time >= this.m_nBossTime) {
                    this.addBossTipsAct();
                    this.createBtnBossAttackEffect();
                    this.noticeBossAttack();
                } else {
                    this.removeBossTipsAct();
                    this.clearBtnBossAttackEff();
                }
                this.m_proHB.progress = time / this.m_nBossTime;
            } else {
                this.m_proHB.progress = 0;
                // this.removeBossTipsAct();
                this.addBossTipsAct("lb_djzjcs_png");
            }

        }

        /**boss进度刷新 */
        private isBossIn() {
            if (!PatrolModel.info.bossInfo) return false;
            if (PatrolModel.info.bossInfo.bossId > 0 && NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount > 0) return true;
            return false;
        }
        /**设置boss按钮特效 */
        private createBtnBossAttackEffect() {
            if (this.m_btnBossAtackEff) return;
            this.m_btnBossAtackEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_btnBossAtackEff.x = 50;
            this.m_btnBossAtackEff.y = 49;
            this.m_pBoss.addChildAt(this.m_btnBossAtackEff, 4);
        }
        private clearBtnBossAttackEff() {
            if (this.m_btnBossAtackEff) {
                NormalMcMgr.removeMc(this.m_btnBossAtackEff);
                this.m_btnBossAtackEff = null;
            }
        }
        /**设置文字特效 */
        public addBossTipsAct(img: string = "lb_djrq_png") {
            this.m_imgHBTips.visible = true;
            this.m_imgHBTips.source = img;
            if (this.m_bTipsAct) return;
            this.m_bTipsAct = true;
            egret.Tween.get(this.m_imgHBTips, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
        }
        /**清除文字特效 */
        public removeBossTipsAct() {
            this.m_imgHBTips.visible = false;
            if (!this.m_bTipsAct) return;
            this.m_bTipsAct = false;
            egret.Tween.removeTweens(this.m_imgHBTips);
        }
        /**通知播放boss来袭特效 */
        public noticeBossAttack() {
            if (this.m_bBossAct) return;
            this.m_bBossAct = true;
            EventMgr.dispatchEvent(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, null);
        }
        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            /**挂机boss */
            EventManager.addTouchScaleListener(this, this, () => {
                Utils.open_view(TASK_UI.POS_PATROL_BOSS_VIEW);
            });
            EventMgr.addEvent(PatrolEvent.PATROL_BOSS_RESET, this.onBossReset, this);
            EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(PatrolEvent.PATROL_BOSS_RESET, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
            EventManager.removeEventListeners(this);
        }
        /**信息刷新 */
        private onPatrolInfo() {
            this.initView();
        }
        /**信息刷新 */
        private onBossReset() {
            this.refreshPro();
        }

        /**定时刷新改变 */
        private onPatrolTick() {
            this.refreshPro();
        }
        /**功能次数变动 */
        private onFunCount(id: IFunCountEnum) {
            if (id != IFunCountEnum.PATROL_BOSS)
                return;
            if (NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount == 0) {
                this.m_bTipsAct = false;
                this.addBossTipsAct("lb_djzjcs_png");
            }
        }

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


    }
}