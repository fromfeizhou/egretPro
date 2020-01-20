// TypeScript file			this.m_imgCard.source = GeneralModel.getSoldierBigLogo(info.config.role)
module com_main {
	/**
	 * 剧情对话面板相关
	 */
    export class GuideDialogView extends CView {
        public static NAME = 'GuideDialogView';

        public m_pMask: eui.Group;
        public m_pRoot: eui.Group;
        public m_pRoleRoot: eui.Group;
        public m_pIconRoot0: eui.Group;
        public m_genCard0: com_main.ComGenCard;
        public m_pIconRoot1: eui.Group;
        public m_genCard1: com_main.ComGenCard;
        public m_labName0: com_main.CLabel;
        public m_labName1: com_main.CLabel;
        public m_pLbDec: com_main.CLabel;
        public m_pSkipRoot: eui.Group;
        public m_pBtnMask: eui.Group;

        protected m_nId: number;   //配置表id;
        protected m_tDesList: [number, string][];
        protected m_nDesId: number;//对白下标
        protected m_bAction: boolean;  //出现动画
        protected m_mcList: MCDragonBones[];   //形象列表;

        private m_nDesDt: number; //定时器

        private m_soundList: string[]; //音效

        public constructor(id: number) {
            super();
            this.name = GuideDialogView.NAME;
            this.m_nId = id;
            this.skinName = Utils.getComSkin("guide/guide_dialog_view_skin.exml");

        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            if (this.m_mcList) {
                for (let i = 0; i < this.m_mcList.length; i++) {
                    this.m_mcList[i].destroy();
                }
                this.m_mcList = null;
            }

            egret.Tween.removeTweens(this.m_pRoot);
            egret.Tween.removeTweens(this.m_pIconRoot0);
            egret.Tween.removeTweens(this.m_pIconRoot1);
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Sound.playGialogById(0, null, null);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_pRoleRoot.mask = this.m_pMask;
            this.initCfgIcon()
        }

        /**初始化配置 和头像 */
        protected initCfgIcon() {
            let id = this.m_nId;
            //第一条特殊处理
            if (id == 1) {
                id = RoleData.countryId;
            }
            let cfg = C.GuideDialogConfig[id];
            if (!cfg) {
                this.closeDialog();
                return;
            }

            this.m_tDesList = JSON.parse(GLan(cfg.dialog));

            this.m_mcList = [];
            let icons: number[] = JSON.parse(cfg.generalId);
            let names = JSON.parse(GLan(cfg.name));
            for (let i = 0; i < icons.length; i++) {
                this.createIcon(cfg.type, icons[i], names[i], i);
            }
            this.m_soundList = cfg.sound.split('_');

            this.initView()
        }

        protected initView() {
            EventManager.addTouchTapListener(this.m_pBtnMask, this, this.onShowNext);
            //跳过处理
            EventManager.addTouchScaleListener(this.m_pSkipRoot, this, this.skipGuide);

            Utils.toStageBestScale(this.m_pRoot);

            this.m_nDesId = 0;
            this.onShowNext();

            //显示动画
            this.m_bAction = true;
            let tw = egret.Tween.get(this.m_pRoot);
            this.m_pRoot.alpha = 0;
            tw.to({ alpha: 1 }, 500, Ease.backOut);
            tw.call(() => {
                this.m_bAction = false;
            }, this);

        }

        /**定时器 */
        private onTimeHandler() {
            this.m_nDesDt--;
            if (this.m_nDesDt <= 0) {
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.onShowNext();
            }
        }

        /**创建形象 */
        protected createIcon(type: number, generalId: number, name: string, fix: number) {
            let root: eui.Group = this[`m_pIconRoot${fix}`];
            let genCard: ComGenCard = this[`m_genCard${fix}`];
            let labName: CLabel = this[`m_labName${fix}`];
            labName.text = name;
            if (generalId == 0) {
                root.visible = false;
                return;
            }

            genCard.setInfo(generalId, type == 1, false);
        }

        //显示下一句
        protected onShowNext() {
            if (this.m_bAction) return;
            if (this.m_nDesId >= this.m_tDesList.length) {
                this.closeDialog();
                return;
            }
            if (!this.m_pLbDec) return;
            let info = this.m_tDesList[this.m_nDesId];
            this.m_pLbDec.textFlow = Utils.htmlParser(info[1]);
            if (this.m_soundList && this.m_soundList[this.m_nDesId]) {
                let soundId = Number(this.m_soundList[this.m_nDesId]);
                Sound.playGialogById(soundId, this.soundComplete, this);
            }
            if (info[0] == 0) {
                this.currentState = 'left';
                this.toLowLight(true);
                this.doIconAction(this.m_pIconRoot0, true);
                this.doIconAction(this.m_pIconRoot1, false);
            } else {
                this.currentState = 'right';
                this.toLowLight(false);
                this.doIconAction(this.m_pIconRoot0, false);
                this.doIconAction(this.m_pIconRoot1, true);
            }
            this.m_nDesId++;
            //有音效的等音效播完再进入下个对话
            if (this.m_soundList && this.m_soundList[this.m_nDesId - 1]) {

            } else {
                this.autoClose(5);
            }


        }

        public soundComplete() {
            this.autoClose(1);
        }

        public autoClose(sec: number) {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.m_nDesDt = sec;
            Utils.TimerManager.doTimer(1000, 0, this.onTimeHandler, this);
        }

        /**缩放 */
        private doIconAction(root: eui.Group, isShow: boolean) {
            egret.Tween.removeTweens(root);
            let tw = egret.Tween.get(root);
            if (isShow) {
                tw.to({ scaleX: 1, scaleY: 1 }, 300, Ease.cubicOut);
            } else {
                tw.to({ scaleX: 0.9, scaleY: 0.9 }, 300, Ease.cubicOut);
            }
        }

        /**低亮 */
        private toLowLight(isLeft: boolean) {
            if (isLeft) {
                this.m_genCard0.play();
                this.m_genCard1.stop();
            } else {
                this.m_genCard0.stop();
                this.m_genCard1.play();
            }
            Utils.isLowlight(!isLeft, this.m_genCard0);
            Utils.isLowlight(isLeft, this.m_genCard1);
        }


        /**跳过 */
        private skipGuide() {
            this.closeDialog();
        }

        protected closeDialog() {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.m_nDesId = 0;
            SceneManager.closeGuidePanelByName(GuideDialogView.NAME);
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_DIALOGUE_END, null);
        }
    }
}