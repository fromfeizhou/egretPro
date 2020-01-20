// TypeScript file


module com_main {
	/**
	 * 战利品
	 */
    export class PatrolAwardView extends CView {
        public static NAME = 'PatrolAwardView';

        public m_apopUp: com_main.APopUp;
        public m_labCopper: eui.Label;
        public m_labExp: eui.Label;
        public m_listItem: eui.List;
        public m_labTips: eui.Image;
        public m_btnGet: com_main.ComButton;

        private m_tAwards: gameProto.ValuesMessage[];
        public constructor(data?: gameProto.ValuesMessage[]) {
            super();
            this.name = PatrolAwardView.NAME;
            this.m_tAwards = data;
            this.initApp("patrol/PatrolAwardViewSkin.exml");

        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_WAR_AWARD));
            this.m_btnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            
            if (!this.m_tAwards) return;
            this.m_listItem.itemRenderer = PropRender;

            let exp = 0;
            let copper = 0;
            let res = [];
            for (let i = 0; i < this.m_tAwards.length; i++) {
                let data = this.m_tAwards[i];
                if (data.itemId == PropEnum.EXP) {
                    exp += data.count;
                } else if (data.itemId == PropEnum.SILVER) {
                    copper += data.count;
                } else {
                    res.push(data);
                }
            }
            if (res.length > 0) {
                let collection = new eui.ArrayCollection(res);
                this.m_listItem.dataProvider = collection;

                this.m_labTips.visible = false;
            } else {
                this.m_labTips.visible = true;
            }

            this.m_labExp.text = `+${exp}`;
            this.m_labCopper.text = `+${copper}`;

            EventManager.addTouchScaleListener(this.m_btnGet,this,this.onBtnGet);
        }

        /**领取挂机 */
        private onBtnGet(){
            UpManager.history();
            if(this.m_tAwards && this.m_tAwards.length){
                PatrolProxy.C2S_RECEIVE_PATROL_REWARD();
            }
        }

        /**=====================================================================================
		 * 协议回调 begin
		 * =====================================================================================
		 */
        protected listenerProtoNotifications(): any[] {
            return [
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

            }
        }
        /**=====================================================================================
		 * 协议回调 end
		 * =====================================================================================
		 */

    }

    class PropRender extends eui.ItemRenderer {
        protected m_item: ComItemNew;
        private m_tData: gameProto.ValuesMessage;

        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = ComItemNew.create('count');
            this.addChild(this.m_item);
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;

            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        }
    }
}

