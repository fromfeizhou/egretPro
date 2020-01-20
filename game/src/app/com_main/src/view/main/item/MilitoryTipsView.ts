module com_main {
    export class MilitoryTipsView extends CComponent {
        public static NAME: string = "MilitoryTipsView";

        public m_imgPro: eui.Image;
        public m_lbExp: eui.Label;
        public m_labTitle: eui.Label;
        public m_labDes: eui.Label;
        public m_labCoin: eui.Label;

        public static PRO_WITH: number = 220;

        public constructor() {
            super();
            this.name = MilitoryTipsView.NAME;
            this.skinName = Utils.getAppSkin("top_new/item/MilitoryTipsViewSkin.exml");
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

            this.updateData();
        }
        public updateData() {
            // let militoryLimit: number = ConstUtil.getValue(IConstEnum.MILITARYMERITS_DAY_LIMIT);
            let militoryLimit = C.MilitaryMeritsDayLimitConfig[RoleData.level] ? C.MilitaryMeritsDayLimitConfig[RoleData.level].dayLimit : C.MilitaryMeritsDayLimitConfig[200].dayLimit;

            this.m_imgPro.width = Math.min(Math.floor((RoleData.militaryDayExp / militoryLimit) * MilitoryTipsView.PRO_WITH), MilitoryTipsView.PRO_WITH)
            this.m_lbExp.text = `${RoleData.militaryDayExp}/${militoryLimit}`

            let nextLimitLev: number = WorldModel.getNextMilitaryMeritsDayLimitLev(militoryLimit);
            this.m_labDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TIPS_MILITORY, 0, nextLimitLev));
            this.m_labCoin.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_MILITORY_COIN, RoleData.militaryCoin))
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