module com_main {
    export class ComFightChange extends CComponent {
        public static NAME = 'ComFightChange';
        public m_labfightNum: eui.BitmapLabel;
        public m_labNextFight: eui.BitmapLabel;
        public m_pEffRoot: eui.Group;

        private m_nFightVal: number; //当前战力
        private m_changeNum: number;//改变的战斗力
        private actionGroup: egret.tween.TweenGroup;
        public constructor(fight: any) {
            super();
            this.name = ComFightChange.NAME;
            this.m_nFightVal = fight;
            this.skinName = Utils.getAppSkin("common/ComFightChangeSkin.exml")
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            // SceneManager.onSceneWndEnter();
            Utils.TimerManager.remove(this.onLaterHandler, this);
            EventManager.removeEventListeners(this);
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            super.onDestroy();
            this.actionGroup.removeEventListener("complete", this.onPlayComplete, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            NodeUtils.setSize(this, { width: AGame.R.app.stageWidth, height: AGame.R.app.stageHeight });
            this.m_labfightNum.text = GeneralModel.FIGHT_RECORD.toString();
            this.m_changeNum = GeneralModel.FIGHT_RECORD;
            GeneralModel.FIGHT_RECORD = this.m_nFightVal;
            this.actionGroup.play();
            this.actionGroup.addEventListener("complete", this.onPlayComplete, this);

        }
        /**动画播完之后回调 */
        public onPlayComplete() {
            this.doAction();
        }
        /**设置战斗力 */
        public doAction() {
            CommonUtils.NumberActionTo(this.m_labfightNum, Number(this.m_labfightNum.text), this.m_nFightVal, 1000, false, false);
            let fightStr: string;
            if (this.m_nFightVal - this.m_changeNum > 0) {
                this.m_labNextFight.font = 'addHPNumber_fnt';
                fightStr = '+' + (this.m_nFightVal - this.m_changeNum);
            } else {
                this.m_labNextFight.font = 'hurtNumber_fnt';
                fightStr = (this.m_nFightVal - this.m_changeNum).toString();
            }
            this.m_labNextFight.text = fightStr;
            Utils.TimerManager.doTimer(1500, 1, this.onLaterHandler, this);
        }

        private onLaterHandler() {
            Utils.removeFromParent(this);
        }

    }
}