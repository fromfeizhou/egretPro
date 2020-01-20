module com_main {
    export class WorldTipsView extends CComponent {
        public static NAME: string = "WorldTipsView";

        public m_labTitle: eui.Label;
        public m_labDes: eui.Label;
        public constructor() {
            super();
            this.name = WorldTipsView.NAME;
            this.skinName = Utils.getAppSkin("top_new/item/WorldTipsViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_labDes.text = GCodeFromat(CLEnum.WOR_LEVEL_TIPS,WorldModel.worldLevel);
        }

        public doAction(isShow: boolean) {
            egret.Tween.removeTweens(this);
            let tw = egret.Tween.get(this);

            if (isShow) {
                this.scaleY = 0;
                this.alpha = 0.5;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.cubicOut);
            } else {
                let tw = egret.Tween.get(this);
                tw.to({ alpha: 0 }, 300, Ease.cubicOut);
            }
        }


    }
}