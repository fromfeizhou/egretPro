module com_main {
    export class GuideSelectItem extends CComponent {

        public m_imgCountry: eui.Image;
        public m_pTjBox: eui.Group;
        public m_LbGold: eui.Label;
        public m_labTile: com_main.CLabel;
        public m_TuijianBg: eui.Image;
        public m_pEffRoot: eui.Group;

        private m_nType: SoldierNationType;
        private m_bSelected: boolean;
        private m_effBg: MCDragonBones;	//选择国家特效

        public constructor() {
            super();
            this.m_bSelected = true;
            this.skinName = Utils.getAppSkin("world/world_select_Item.exml");
        }

        public get type(): SoldierNationType {
            return this.m_nType;
        }

        public set type(type: SoldierNationType) {
            switch (type) {
                case 1: {
                    this.m_imgCountry.source = `common_country5_1_png`;
                    this.m_TuijianBg.source = 'zyt_xj_wg_png';
                    break;
                }
                case 2: {
                    this.m_imgCountry.source = `common_country5_2_png`;
                    this.m_TuijianBg.source = 'zyt_xj_sg_png';
                    break;
                }
                case 3: {
                    this.m_imgCountry.source = `common_country5_3_png`;
                    this.m_TuijianBg.source = 'zyt_xj_wug_png';
                    break;
                }

            }
            this.m_nType = type;
        }


        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }


        public onDestroy(): void {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgCountry);
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }



        protected childrenCreated() {
            super.childrenCreated();
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }

        public setSelect(selected: boolean, price: number): void {
            if (this.m_bSelected == selected) return;
            // this.m_imgSelect.visible = selected;
            this.m_bSelected = selected;
            this.m_pTjBox.visible = selected;
            this.m_LbGold.text = price + '';
        }
        public setSelectEff(currState: boolean): void {
            if (currState) {
                this.createEffect();
            } else {
                this.clearEffect();
            }
        }


        /**位移缓动 */
        public doAction(ty: number, tScale: number, alpha: number, isAction: boolean) {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgCountry);
            // this.m_imgSelect.visible = false;

            if (isAction) {
                let tw = egret.Tween.get(this);
                tw.wait(30)
                tw.to({ y: ty, scaleX: tScale, scaleY: tScale, alpha: alpha }, 300, egret.Ease.cubicOut)
                tw.call(() => {
                    this.setEndState(ty, tScale, alpha);
                }, this);
            } else {
                this.setEndState(ty, tScale, alpha);
            }
        }

        /**结束状态 */
        private setEndState(ty: number, tScale: number, alpha: number) {
            this.y = ty;
            this.alpha = alpha;
            NodeUtils.setScale(this, tScale);
            // this.m_imgSelect.visible = tScale == 1;
            this.visible = tScale != 0.5;
        }
        /**添加背景特效 */
        public createEffect() {
            if (!this.m_effBg) {
                this.m_effBg = new MCDragonBones();
                this.m_effBg.initAsync(IETypes.EUI_TreaBg);
                this.m_effBg.play(IETypes.EUI_TreaBg);
                this.m_effBg.scaleX=0.7;
                this.m_effBg.scaleY=0.7;
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        }
        /**移除背景特效 */
        public clearEffect() {
            if (this.m_effBg) {
                this.m_effBg.destroy();
                this.m_effBg = null;
            }
        }
    }
}