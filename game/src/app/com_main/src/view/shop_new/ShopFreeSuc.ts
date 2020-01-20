module com_main {


	/**
	 * 免单商城
	 */
    export class ShopFreeSuc extends CView {
        public static NAME = 'ShopFreeSuc';

        public m_item:com_main.ComItemNew;
        private m_data:any;

        public constructor(param?:any) {
            super();
            this.m_data = param;
            this.name = ShopFreeRecord.NAME;
            this.initApp("shop/ShopFreeSucSkin.exml");
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
            if(!this.m_data) return;
            this.m_item.setItemInfo(this.m_data.itemId,this.m_data.count);
        }

       

    }
}