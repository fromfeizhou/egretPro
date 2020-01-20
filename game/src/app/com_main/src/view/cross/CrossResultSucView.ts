/**
 * 跨服战总兵库
 */
module com_main {
    export class CrossResultSucView extends CView {
        public static NAME = 'CrossResultSucView';

        public rect: eui.Rect;
        public shake_group: eui.Group;
        public border_0: eui.Image;
        public border_1: eui.Image;
        public m_best0: eui.Group;
        public playerName0: eui.Label;
        public m_best1: eui.Group;
        public playerName1: eui.Label;
        public m_best2: eui.Group;
        public playerName2: eui.Label;
        public m_rewardList: eui.Group;
        public m_ComItem: com_main.ComItemNew;
        public image_result_1: eui.Image;
        public image_result_2: eui.Image;



        private m_data: gameProto.IS2C_CROSS_SERVER_SETTLEMENT_DATA;
        public constructor(data: gameProto.IS2C_CROSS_SERVER_SETTLEMENT_DATA) {
            super();
            this.name = CrossResultSucView.NAME;
            this.m_data = data;
            this.initApp("cross/result/CrossResultSucSkin.exml");
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();

            this.addEvent();

            let itemList:IItemInfo[];

            if (this.m_data.isWin) {
                this.currentState = 'success';
                itemList = CrossModel.getCrossServerRewardConfig(CrossRewardType.WIN_SERVER, this.m_data.duanWei).reward;
            } else {
                this.currentState = 'fail';
                itemList = CrossModel.getCrossServerRewardConfig(CrossRewardType.FAIL_SERVER, this.m_data.duanWei).reward;
            }

            this.commitProperties();
            if (this.m_data.isWin) {
                for (let i in this.m_data.bestList) {
                    let name = this.m_data.bestList[i];
                    this['m_best'+i].visible = true;
                    this['playerName'+i].text = name;
                }
            }

            for(let i of itemList){
                let item = ComItemNew.create('count',true,true);
                item.setItemInfo(i.itemId,i.count);
                this.m_rewardList.addChild(item)
            }

        }

        protected addEvent() {
            EventManager.addTouchTapListener(this.shake_group, this, this.onclick);
        }

        private onclick(e: egret.TouchEvent) {
            UpManager.history();
            SceneManager.crossResultRunScene();
        }
    }
}