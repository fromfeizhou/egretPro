module com_main {
	/**
	 * 战斗次数奖励
	 */
    export class KillCountAwardView extends CView {
        public static NAME = 'KillCountAwardView';
        public m_pViewRoot: eui.Group;
        public m_pDesc: eui.Group;
        public m_pTitle: eui.Label;
        public m_imgVipPro: com_main.CImage;
        public m_lbExp: eui.Label;
        public m_lbFSum: eui.Label;
        public m_iconLeftRoot: eui.Group;
        public m_iconRoot: eui.Group;
        public m_pBox: com_main.CImage;
        public m_pEffRoot: eui.Group;
        public m_btnLeft: eui.Image;
        public m_starRoot: eui.Group;
        public m_btnRight: eui.Image;
        public m_pOpenBox: com_main.ComButton;
        public m_pBoxState: eui.Group;
        public m_LboxState: eui.Label;
        public m_itemList: eui.List;
        public m_imgBox: eui.Image;

        public static PRO_MAX: number = 480;

        private m_bIsAction: boolean;    //图标动画
        private m_bIsRotateAction: boolean = true;
        private m_effBg: MCDragonBones;
        private m_nLocalY: number;   //动画起始位置
        private m_boxLoclX: number;

        private m_tCollections: eui.ArrayCollection;
        /**当前的奖励阶段 */
        private m_nCurAwardPro: number = 0;
        private isLeft: boolean = false;
        private timeKey: number;

        private m_acEmpVo: AcEmperorBattleVO;

        public constructor(width: number, height: number) {
            super();
            this.name = KillCountAwardView.NAME;
            this.initApp("world/ExploitAwardViewSkin.exml");
            this.width = width;
            this.height = height;
            this.validateNow();
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
            this.stopAction();
            this.clearEffect();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_acEmpVo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
            this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX));

            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_itemList.dataProvider = this.m_tCollections;
            this.m_itemList.itemRenderer = ExploitAwardRender;
            let militoryList: number[] = this.m_acEmpVo.getDoneKillAwardList();
            /**已经到了哪个阶段 */
            this.m_bIsAction = false;
            this.m_nLocalY = this.m_iconRoot.bottom;

            this.m_nCurAwardPro = militoryList && militoryList.length > 0 ? militoryList[militoryList.length - 1] + 1 : 1;
            this.m_nCurAwardPro = this.m_nCurAwardPro > AcEmperorBattleVO.MAX_KILL_AWARD ? AcEmperorBattleVO.MAX_KILL_AWARD : this.m_nCurAwardPro;
            this.refreshView();
            this.changeIndex(this.m_nCurAwardPro);
            this.initEvent();
            this.createEffect();
            this.updateBtn();
            // this.createBoxRotate();

            this.handlerOtherComponent();
        }
        public createBoxRotate(isLeft: number = 1) {
            this.m_iconRoot.horizontalCenter = 400 * isLeft;
            this.m_iconRoot.alpha = 0;
            let tw = egret.Tween.get(this.m_iconRoot, { loop: true });
            tw.to({ alpha: 1, horizontalCenter: 0 }, 250).call(() => {
                Tween.removeTweens(this.m_iconRoot);
                this.m_bIsRotateAction = true;
                this.refreshView();
            });
            this.m_iconLeftRoot.visible = true;
            this.m_iconLeftRoot.alpha = 1;
            this.m_iconLeftRoot.horizontalCenter = 0;
            let tw1 = egret.Tween.get(this.m_iconLeftRoot, { loop: true });
            tw1.to({ alpha: 0, horizontalCenter: -400 * isLeft }, 250).call(() => {
                Tween.removeTweens(this.m_iconLeftRoot);
                this.m_iconLeftRoot.visible = false;
                this.m_iconLeftRoot.horizontalCenter = 0;
            });
        }
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_XIANGYANG_RECEIVE,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_RECEIVE: {
                    let data = body as gameProto.IS2C_XIANGYANG_RECEIVE;
                    this.updateBoxState();
                    this.updateBoxBtnState();
                    this.showUpGradeEffect();
                    // /**领完奖之后跳到下一个 */
                    this.onRightHandler();
                    this.timeKey = egret.setTimeout(() => {
                        this.m_acEmpVo.receiveKillReward(data);
                        egret.clearTimeout(this.timeKey);
                    }, this, 200);
                    break;
                }
            }
        }

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
            EventManager.addTouchScaleListener(this.m_pOpenBox, this, this.onAward);
            // EventManager.addTouchTapListener(this.m_pDesc, this, this.onDesc);
        }

        /**建造升级完成 */
        public showUpGradeEffect() {
            let EBuild_UpGrade = new MCDragonBones();
            EBuild_UpGrade.initAsync(IETypes.EBuild_UpGrade);
            EBuild_UpGrade.play(IETypes.EBuild_UpGrade, 1,true);
            // EBuild_UpGrade.play(IETypes.EBuild_UpGrade)
            EBuild_UpGrade.scaleX = 1.1;
            EBuild_UpGrade.scaleY = 1.1;
            EBuild_UpGrade.x = 0;
            EBuild_UpGrade.y = 0;
            this.m_starRoot.addChild(EBuild_UpGrade);
        }


        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        /**向左点击 */
        private onLeftHandler() {
            let index = this.m_nCurAwardPro - 1;
            this.isLeft = true;
            if (index >= 1) this.changeIndex(index);
        }

        private onRightHandler() {
            let index = this.m_nCurAwardPro + 1;
            this.isLeft = false;
            if (index <= AcEmperorBattleVO.MAX_KILL_AWARD) this.changeIndex(index);
        }

        /**选中改变 */
        private changeIndex(index: number) {
            if (this.m_nCurAwardPro == index) return;
            this.m_nCurAwardPro = index;
            this.createBoxRotate(this.isLeft ? -1 : 1);
            this.updateBtn();
            // this.refreshView();
        }

        /**切换的时候刷新页面 */
        private refreshView() {
            this.m_pTitle.text = GCodeFromat(CLEnum.EXPLOIT_AWARD_LV, this.m_nCurAwardPro);
            this.refreshBoxAward();
            this.refreshProgress();
            this.updateBoxBtnState();
            this.updateBoxState();
        }

        /**刷新进度条 */
        private refreshProgress() {
            let cfg = C.XiangyangPlayerBattleRewardConfig[this.m_nCurAwardPro];
            if (cfg) {
                let progressValue: number = this.m_acEmpVo.warCount;
                progressValue = Math.min(progressValue, cfg.count)
                this.m_lbExp.text = `${progressValue}/${cfg.count}`;
                let pro = Math.min(progressValue / cfg.count, 1);
                this.m_imgVipPro.width = ExploitAwardView.PRO_MAX * pro;
            } else {
                this.m_imgVipPro.width = 0;
            }
        }

        /**刷新阶段奖励 */
        private refreshBoxAward() {
            let cfg = C.XiangyangPlayerBattleRewardConfig[this.m_nCurAwardPro];
            if (cfg) {
                let items = Utils.parseCommonItemJson(cfg.reward);
                this.m_tCollections.replaceAll(items);
            }
        }

        /**更新按钮状态 */
        public updateBoxBtnState() {
            this.stopAction();
            if (this.m_acEmpVo.checkKillAward(this.m_nCurAwardPro)) {
                this.m_pOpenBox.enabled = true;
                Utils.isGray(false, this.m_pOpenBox)
                this.m_pEffRoot.visible = true;
                this.doAction();
            } else {
                this.m_pOpenBox.enabled = false;
                Utils.isGray(true, this.m_pOpenBox);
                this.m_pEffRoot.visible = false;
            }
            if (this.m_acEmpVo.checkKillAwardBoxState(this.m_nCurAwardPro)) {
                this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_YJLQ))
                this.m_pBoxState.visible = true;
                this.m_pOpenBox.visible = false;
            } else {
                this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX))
                this.m_pBoxState.visible = false;
                this.m_pOpenBox.visible = true;
            }
        }

        /**宝物动画 */
        public doAction() {
            if (!this.m_bIsAction && this.m_bIsRotateAction) {
                this.m_bIsAction = true;
                this.m_bIsRotateAction = false;
                let ty = this.m_nLocalY;
                let gap = 20;
                let tw = egret.Tween.get(this.m_iconRoot, { loop: true });
                tw.to({ bottom: ty + gap }, 1500, Ease.sineInOut);
                tw.to({ bottom: ty }, 1500, Ease.sineInOut);
            }
        }

        /**宝物动画 */
        public stopAction() {
            if (this.m_bIsAction) {
                egret.Tween.removeTweens(this.m_iconRoot);
                this.m_iconRoot.bottom = this.m_nLocalY;
                this.m_bIsAction = false;
            }
        }

        /**添加背景特效 */
        public createEffect() {
            if (!this.m_effBg) {
                this.m_effBg = new MCDragonBones();
                this.m_effBg.initAsync(IETypes.EUI_TreaBg);
                this.m_effBg.play(IETypes.EUI_TreaBg);
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        }

        /**移除背景特效 */
        public clearEffect() {
            if (this.m_effBg) {
                this.m_effBg.destroy();
                this.m_effBg = null;
                this.m_pBox.visible = true;
            }
        }

        /**
         * 更新宝箱显示
         */
        public updateBoxState() {
            this.m_pBox.source = this.m_acEmpVo.checkKillAwardBoxState(this.m_nCurAwardPro) ? "world_icon_bx02_png" : "world_icon_bx01_png";
        }

        public updateBtn() {
            this.m_btnLeft.visible = this.m_nCurAwardPro > 1;
            this.m_btnRight.visible = this.m_nCurAwardPro < AcEmperorBattleVO.MAX_KILL_AWARD;
        }

        /**
         * 点击领奖
         */
        private onAward(pvt: egret.TouchEvent) {
            if (this.m_nCurAwardPro > AcEmperorBattleVO.MAX_KILL_AWARD)
                return;
            AcBattleProxy.C2S_XIANGYANG_RECEIVE(this.m_nCurAwardPro);
        }

        /**
         * 帮助说明
         */
        private onDesc() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.EXPLOIT_HELP_DESC), title: GCode(CLEnum.EXPLOIT_TITLE) });
        }

        /**部分空间处理 */
        private handlerOtherComponent() {
            this.m_pDesc.visible = false;
            this.m_lbFSum.visible = true;
            this.m_lbFSum.text = GCode(CLEnum.FIGHT_COUNT);
            this.m_imgBox.source = "lb_xyzbx_png";
        }
    }
}