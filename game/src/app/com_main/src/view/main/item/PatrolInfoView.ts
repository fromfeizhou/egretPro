module com_main {
    export class PatrolInfoView extends CComponent {
        public static NAME: string = "PatrolInfoView";
        public static PRO_MAX: number = 115;

        public m_pEffRoot: eui.Group;
        public m_pTips: eui.Group;
        public m_labTips: eui.Label;
        public m_labAwardTips: eui.Label;
        public m_pFightRoot: eui.Group;
        public m_imgPro: eui.Image;
        public m_labPro: eui.Label;
        public m_btnMask: eui.Group;
        public m_btnAuto: AGame.AComponent;

        private m_hangGen: MCDragonBones;
        private m_nGeneralId: number;

        public constructor(id?: number) {
            super();
            this.name = PatrolInfoView.NAME;
            this.skinName = Utils.getAppSkin("top_new/item/PatrolInfoViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            egret.Tween.removeTweens(this.m_pTips);
            this.clearHangGen();
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            /**挂机武将 */
            PatrolProxy.send_C2S_PATROL_GET_RANDOM_PLAYERS();

            this.refreshHangGen();
            this.refreshAwardState();
            this.refreshHangPro();
            this.refreshAutoChallenge();

            this.initEvent();
        }

        /**刷新自动挂机按钮 */
        private refreshAutoChallenge() {
            if (PatrolModel.isAutoChallenge) {
                this.m_btnAuto.currentState = 'auto';
            } else {
                this.m_btnAuto.currentState = 'nor';
            }
            this.commitProperties();
        }

        /**刷新领奖状态 */
        private refreshAwardState() {
            if (PatrolModel.info.genInfo.rewardState == 2) {
                this.currentState = 'max';
            } else {
                if (PatrolModel.isHasGenAward()) {
                    this.currentState = 'award';
                } else {
                    this.currentState = 'nor';
                }
            }
            this.commitProperties();
        }


        /**武将形象 */
        private refreshHangGen() {
            let generaId = PatrolModel.info.genInfo.rewardGenId;
            if (this.m_nGeneralId == generaId) return;
            this.m_nGeneralId = generaId;
            this.clearHangGen();
            //没有可领武将 使用默认形象
            if (this.m_nGeneralId == 0) {
                this.createMc('HangGen5');
                return;
            }
            let cfg = C.GeneralConfig[this.m_nGeneralId];
            let effName = `HangGen${cfg.role}`;
            this.createMc(effName);
        }

        private createMc(name: string) {
            if (RES.hasRes(name + "_ske_dbbin")) {
                this.m_hangGen = new MCDragonBones();
                this.m_hangGen.initAsync(name);
                this.m_hangGen.play(name);
                this.m_pEffRoot.addChild(this.m_hangGen);
            }
        }

        private clearHangGen() {
            if (this.m_hangGen) {
                this.m_hangGen.destroy();
                this.m_hangGen = null;
            }
        }

        /**刷新进度 */
        private refreshHangPro() {
            if (!PatrolModel.isHasGenAward()) {
                let cur = PatrolModel.info.patrolId - 1;
                let max = PatrolModel.info.genInfo.rewardLevelNum - 1;
                this.m_imgPro.width = (cur / max) * PatrolInfoView.PRO_MAX;
                this.m_labPro.text = `${cur}/${max}`;
                let cfg = C.GeneralConfig[PatrolModel.info.genInfo.rewardGenId];
                this.m_labAwardTips.text = GCodeFromat(CLEnum.HAN_PASS_TIPS, max, GLan(cfg.name));
            }
        }

        /**显示提示 */
        private showTips() {
            if (PatrolModel.isHasGenAward()) {
                this.m_labTips.text = GCode(CLEnum.HAN_GET_GEN);
            } else {
                if (RoleData.level < PatrolModel.info.levelLimit) {
                    this.m_labTips.text = GCodeFromat(CLEnum.HAN_FIGHT_LIMIT, PatrolModel.info.levelLimit);
                } else {
                    this.m_labTips.text = GCode(CLEnum.HAN_FIGHT_TIPS1);

                }
            }
            this.m_pTips.visible = true;
            let tw = egret.Tween.get(this.m_pTips);
            tw.to({ alpha: 1 }, 300);
            tw.wait(3000)
            tw.call(() => {
                this.m_pTips.visible = false;
            }, this)
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            //自动挂机
            EventManager.addTouchScaleListener(this.m_btnAuto, this, () => {
                PatrolModel.isAutoChallenge = !PatrolModel.isAutoChallenge;
                this.refreshAutoChallenge();
                if (PatrolModel.isAutoChallenge) {
                    EffectUtils.showTips(GCode(CLEnum.HAN_AUTO_ALR), 1, false);
                }
            });

            //关卡头像点击
            EventManager.addTouchScaleListener(this.m_btnMask, this, this.onBtnMask);

            EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            EventMgr.removeEventByObject(EventEnum.LOGIN_SUCCESS, this);

            EventManager.removeEventListeners(this);
        }

        /**信息刷新 */
        private onPatrolInfo() {
            this.refreshAwardState();
            this.refreshHangGen();
            this.refreshHangPro();
        }

        /**定时刷新改变 */
        private onPatrolTick() {
            this.showTips();

            if (TeamModel.isEmptyTeamPVE()) return;
            if (PatrolModel.isHasGenAward()) return;

            if (PatrolModel.isAutoChallenge) {
                if (PatrolModel.canFightBoss()) {
                    PatrolProxy.send_C2S_PATROL_CHALLENGE();
                }
            }
        }

        /**关卡头像点击 */
        private onBtnMask() {
            if (PatrolModel.isHasGenAward() > 0) {
                PatrolProxy.C2S_PATROL_REWARD_GENERAL(PatrolModel.info.genInfo.rewardLevelNum);
                return;
            }
            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_PARTRO_VIEW);
                return;
            }
            if (PatrolModel.canFightBoss(true)) {
                PatrolProxy.send_C2S_PATROL_CHALLENGE();
            }
        }


        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


    }
}