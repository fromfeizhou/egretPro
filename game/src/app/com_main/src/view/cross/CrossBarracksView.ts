/**
 * 跨服战总兵库
 */
module com_main {
    export class CrossBarracksView extends CView {
        public static NAME = 'CrossBarracksView';

        public m_apopUp: com_main.APopUp;
        public m_content: eui.Label;
        public m_autoAdd: eui.Label;
        public m_hpImg: eui.Image;
        public m_hpLb: eui.Label;
        public m_lbAddHelp: eui.Label;
        public m_pAddBtn: com_main.ComCostTextButton;

        private m_bId: number;
        public constructor(bId: number) {
            super();
            this.name = CrossBarracksView.NAME;
            this.m_bId = bId;
            this.initApp("cross/CrossBarracksSkin.exml");
        }

        public onDestroy() {
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();

            this.m_apopUp.setTitleLabel('跨服战总兵库');

            let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.TROOPS_RECOVER];
            let recover = crossServerConst.value.split(',');

            let comtent = `跨服战中部队补充兵力从总兵库扣除，不消耗个人兵力。\n可使用元宝为总兵库补兵。\n兵库每<font color=#ffffff>${recover[0]}</font>秒会自动恢复<font color=#ffffff>${recover[1]}</font>兵力。`
            // this.m_content.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BD_LIMIT1,1));
            this.m_content.textFlow = Utils.htmlParser(comtent);

            // let str1 = '剩余总兵力：%d'
            // this.m_hpLb.text = '剩余总兵力：'+ 1000000000; 

            // let str = '每次补充兵力1000万总兵力，获得1000荣誉'
            // this.m_lbAddHelp.text = str;

            let crossServerConst1: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
		    let maxTroop = unNull(crossServerConst1) ? Number(crossServerConst1.value) : 0;
            this.m_hpLb.text = '剩余总兵力：' + CrossModel.curTroop;
            this.m_hpImg.width = 466 * (CrossModel.curTroop / maxTroop)

            this.addEvent();
        }

        protected addEvent() {
            EventManager.addTouchTapListener(this.m_pAddBtn, this, this.onclickAddBtn);
        }

        protected removeEvent() {
            EventManager.removeEventListeners(this);
        }

        private onclickAddBtn(e: egret.TouchEvent) {
            
        }


    }
}