module com_main {
    export class PatrolBoxView extends CComponent {
        public static NAME: string = "PatrolBoxView";

        public m_pRoot: eui.Group;
        public m_imgAwardBg: eui.Image;
        public m_imgAwardFull: eui.Image;
        public m_imgAward: eui.Image;
        public m_imgAwardDes: eui.Image;
        public m_pEffectRoot: eui.Group;
        public m_pBoxEffect: egret.tween.TweenGroup;



        private m_nBoxState: number;	//宝箱状态
        private m_boxEff: MCDragonBones;
        public m_boxStarEff: MCDragonBones;
        private m_getAwardEff: MCDragonBones;//获取物品特效
        private patrolAwardTime: number[] = [];
        private isTweenPlay: boolean = false;
        private isTweenStop: boolean = false;
        public constructor(id?: number) {
            super();
            this.name = PatrolBoxView.NAME;
            this.skinName = Utils.getAppSkin("top_new/item/PatrolBoxViewSkin.exml");
            this.touchEnabled = false;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            this.clearBoxEffect();
            this.clearBoxStarEffect()
            this.clearBoxGetAwardEffect();
            egret.Tween.removeTweens(this);
            EventManager.removeEventListeners(this);
            if (this.m_pEffectRoot) {
                egret.Tween.removeTweens(this.m_pEffectRoot);
                this.m_pBoxEffect.removeEventListener("complete", this.actionComplete, this);
                this.m_pBoxEffect = null;
            }

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.patrolAwardTime = ConstUtil.getNumArray(IConstEnum.PATROL_AWARD_STATE_TIME);
            this.createBoxEffect();
            this.createBoxStarEffect();
            this.refrehBoxView();
            this.initEvent();
            this.m_pBoxEffect.addEventListener("complete", this.actionComplete, this);
        }

        /**刷新宝箱奖励 */
        private refrehBoxView() {
            let time = TimerUtils.getServerTime() - PatrolModel.info.boxGetTime;
            let state = 0;
            if (time > this.patrolAwardTime[2]) {
                state = 3;
            } else if (time > this.patrolAwardTime[1]) {
                state = 2;
            } else if (time > this.patrolAwardTime[0]) {
                state = 1;
            }

            this.setBoxAward(time > this.patrolAwardTime[0])
            if (this.m_nBoxState == state) return;
            this.m_nBoxState = state;

            if (state == 3) {
                this.m_imgAwardDes.source = 'lb_gj_zlpym_png';
            } else {
                this.m_imgAwardDes.source = 'lb_gj_zlp_png';
            }

            if (state == 2 || state == 3) {
                this.m_imgAwardFull.visible = true;
                if (!this.isTweenPlay) {
                    this.isTweenPlay = true;
                    this.m_pBoxEffect.play(0);
                }
                this.isTweenStop = false;
            } else {
                this.isTweenPlay = false;
                this.m_imgAwardFull.visible = false;
                egret.Tween.removeTweens(this);
                // this.m_pBoxEffect.stop();
                this.isTweenStop = true;
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            /**挂机奖励 */
            EventManager.addTouchScaleListener(this.m_pRoot, this, this.onBoxHandler);

            EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            EventMgr.addEvent(PatrolEvent.PATROL_AWARD_UPDATE, this.onPatrolAwardUpdate, this);
            // EventMgr.addEvent(PatrolEvent.PATROL_FLY_END, this.onPatrolFlyEnd, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_AWARD_UPDATE, this);
            // EventMgr.removeEventByObject(PatrolEvent.PATROL_FLY_END, this);

            EventManager.removeEventListeners(this);
        }

        /**宝箱点击回调 */
        private onBoxHandler() {
            let time = TimerUtils.getServerTime() - PatrolModel.info.boxGetTime;
            if (time > this.patrolAwardTime[0]) {
                PatrolProxy.C2S_RECEIVE_PATROL_REWARD();
                this.setBoxAward(false);
            } else {
                EffectUtils.showTips(GCodeFromat(CLEnum.HAN_AWARD_TIPS, this.patrolAwardTime[0]), 1, true);
            }
            // PatrolProxy.C2S_GET_PATROL_REWARD();
        }

        /**信息刷新 */
        private onPatrolInfo() {
            this.refrehBoxView();
        }
        /**创建宝箱特效 */
        private createBoxEffect() {
            if (this.m_boxEff) return;
            this.m_boxEff = NormalMcMgr.createMc(IETypes.EUI_HANG_BOX, true);
            this.m_boxEff.x = 112 / 2;
            this.m_boxEff.y = 105 / 2;
            this.m_pEffectRoot.addChildAt(this.m_boxEff, 0);
        }
        /**设置星光特效 */
        private createBoxStarEffect() {
            if (this.m_boxStarEff) return;
            this.m_boxStarEff = NormalMcMgr.createMc(IETypes.EUI_BoxEffect02, true);
            this.m_boxStarEff.scaleX = 1.3;
            this.m_boxStarEff.scaleY = 1.3;
            this.m_boxStarEff.x = 114 / 2;
            this.m_boxStarEff.y = 114 / 2;
            this.m_boxStarEff.visible = false;
            this.m_pEffectRoot.addChildAt(this.m_boxStarEff, 1);
        }
        /**设置获取特效 */
        public playBoxGetAwardEffect() {
            if (!this.m_getAwardEff) {
                this.m_getAwardEff = NormalMcMgr.createMc(IETypes.EUI_HangLight, false);
                this.m_getAwardEff.x = 250 / 4 + 5;
                this.m_getAwardEff.y = 250 / 4 - 20;
                this.m_pEffectRoot.addChildAt(this.m_getAwardEff, 2);
            }
            this.m_getAwardEff.visible = true;
            this.m_getAwardEff.playNorOnce(IETypes.EUI_HangLight, () => {
                this.m_getAwardEff.visible = false;
                this.m_getAwardEff.stop();
            }, this);

        }
        //tween完成
        private actionComplete() {
            if (this.m_pBoxEffect&&!this.isTweenStop)
                this.m_pBoxEffect.play(0);
            else {
                error("动画回调没用清除--------------------------");
            }
        }
        private clearBoxEffect() {
            if (this.m_boxEff) {
                NormalMcMgr.removeMc(this.m_boxEff);
                this.m_boxEff = null;
            }
        }
        private clearBoxStarEffect() {
            if (this.m_boxStarEff) {
                NormalMcMgr.removeMc(this.m_boxStarEff);
                this.m_boxStarEff = null;
            }
        }
        private clearBoxGetAwardEffect() {
            if (this.m_getAwardEff) {
                NormalMcMgr.removeMc(this.m_getAwardEff);
                this.m_getAwardEff = null;
            }
        }
        /**领奖时间刷新 */
        private onPatrolAwardUpdate() {
            this.refrehBoxView();
        }

        /**定时刷新改变 */
        private onPatrolTick() {
            this.refrehBoxView();
        }
        /**第一次奖励飞行结束 */
        private onPatrolFlyEnd() {
            this.setBoxAward(true)
        }
        /**重置特效和元宝图片 */
        public setBoxAward(visible: boolean) {
            this.m_imgAward.visible = visible;
            this.m_boxStarEff.visible = visible;
            PatrolModel.isInitFlyEnd = !visible;
        }
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */


    }
}