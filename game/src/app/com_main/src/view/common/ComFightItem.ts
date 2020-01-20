module com_main {
	/**
	 * 道具
	 */
    export class ComFightItem extends CComponent {
        public m_pEffRoot: eui.Group;
        public m_labfightNum: eui.BitmapLabel;
        private m_effect: MCDragonBones;	//升级战力特效
        private m_nFightVal: number; //当前战力

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/ComFightItemSkin.exml");
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            egret.Tween.removeTweens(this.m_labfightNum);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        /**设置战斗力 */
        public setFight(fight: number, isAction: boolean = false) {
            if (this.m_nFightVal == fight) return;
            if (isAction) {
                 
                let oldFight = this.m_nFightVal;
                let change = fight - oldFight;
                if (change == 0) return;
                this.setEff();
                CommonUtils.NumberActionTo(this.m_labfightNum, Number(this.m_labfightNum.text), fight);
            }
            else {
                this.m_labfightNum.scaleX = 1;
                this.m_labfightNum.scaleY = 1;
                Tween.removeTweens(this.m_labfightNum);
                this.m_labfightNum.text = fight + '';
            }
            this.m_nFightVal = fight;
        }

        /**获得文本战力 */
        public getFight() {
            return this.m_nFightVal;
        }
        /**战力提升特效 */
        private setEff() {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_GenUpFightNum);
            this.m_effect.play(IETypes.EUI_GenUpFightNum, 1, true)
            this.m_effect.x = 120;
            this.m_effect.y = 18;
            this.m_pEffRoot.addChild(this.m_effect);
        }
    }
}