module com_main {


	/**
	 * 免单商城
	 */
    export class ShopFreeRecord extends CView {
        public static NAME = 'ShopFreeRecord';

        public m_APopUp:com_main.APopUp;
        public m_groupRecord:eui.Group;
        private m_recordInfo:any;

        public constructor(param?:any) {
            super();
            this.m_recordInfo = param;
            this.name = ShopFreeRecord.NAME;
            this.initApp("shop/ShopFreeRecordSkin.exml");
        }
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

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.SHOP_FREE_REC));
            if(!this.m_recordInfo) return;
            let datas = this.m_recordInfo.datas;
            for(let i = 0;i < datas.length; i++){
                let data = datas[i];
                let timeStr = TimerUtils.dateFormat("yyyy.MM.dd hh:mm:ss", data.time);
                let cfg = PropModel.getCfg(data.itemId);
                let color = Utils.getColorOfQuality(cfg.quality);
                let itemName = GLan(cfg.name) + '*' + data.count;
                let label = new eui.Label();
                label.size = 22;
                let relust = GCodeFromat(CLEnum.SHOP_FREE_MSG,timeStr,color,itemName);
                label.textFlow =Utils.htmlParser(relust);
                this.m_groupRecord.addChild(label);
	
            }

        }

       

    }
}