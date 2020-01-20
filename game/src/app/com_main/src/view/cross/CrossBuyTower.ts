
/**
 * 建造箭塔
 */
module com_main {
    export class CrossBuyTowerView extends CView {
        public static NAME = 'CrossBuyTowerView';

        public m_apopUp: com_main.APopUp;
        public m_lbMain: eui.Label;
        public m_buildName: eui.Label;
        public m_tower0: eui.Group;
        public m_modelGroup0: eui.Group;
        public m_btnbuy0: com_main.ComCostButton;
        public m_lbBuilded0: eui.Image;
        public m_tower1: eui.Group;
        public m_modelGroup1: eui.Group;
        public m_btnbuy1: com_main.ComCostButton;
        public m_lbBuilded1: eui.Image;


        private m_bId: number;
        public constructor(bId: number) {
            super();
            this.name = CrossBuyTowerView.NAME;
            this.m_bId = bId;
            this.initApp("cross/CrossBuyTowerSkin.exml");
        }

        public onDestroy() {

        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.addEvent();

            this.m_apopUp.setTitleLabel('建筑箭塔');

            let cityInfo = CrossModel.getCityInfoById(this.m_bId);
            if(cityInfo){
                this.initInfo(0,cityInfo.towerNum[0]);
                this.initInfo(1,cityInfo.towerNum[1]);
            }

            this.addTowerAni();
        }

        protected addEvent() {

            EventManager.addTouchTapListener(this.m_btnbuy0, this, this.onclickBuy0);
            EventManager.addTouchTapListener(this.m_btnbuy1, this, this.onclickBuy1);

        }

        private addTowerAni(){
            for(let i = 0; i<= 1; i++){
                let square = CSquare.createId(3008, false, true);
                square.test = true;
                this['m_modelGroup'+i].addChild(square);
                square.changeStatus(CSquare_Status.STATUS_STAND);
                square.x= 75;
                square.y= 145;
            }
        }

        private initInfo(index: number, boo: boolean){
            this['m_btnbuy'+index].visible = !boo;
            this['m_lbBuilded'+index].visible = boo;
        }

        private onclickBuy0(e: egret.TouchEvent) {
            CrossProxy.send_C2S_CROSS_SERVER_BUY_TOWER(this.m_bId, 0);
        }

        private onclickBuy1(e: egret.TouchEvent) {
            CrossProxy.send_C2S_CROSS_SERVER_BUY_TOWER(this.m_bId, 1);
        }


    }
}