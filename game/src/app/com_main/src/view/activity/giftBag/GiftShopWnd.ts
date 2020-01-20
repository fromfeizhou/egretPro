module com_main {
    export interface IGiftShopWnd {
        giftId: number;
        bInit: boolean;
        setViewSize(width: number, height: number): void;
        initView(): void;
        refreshView(): void;
    }
	/**
	 * 限时活动
	 */
    export class GiftShopWnd extends CView {
        public static NAME = 'GiftShopWnd';
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_tabViewStack: eui.ViewStack;  //主切卡

        private m_nWidth: number;    //切卡宽度
        private m_nHeight: number;   //切卡高度
        public m_giftId: number;
        private m_bInitTick: boolean;
        public constructor(gid: number) {
            super();
            this.name = GiftShopWnd.NAME;
            this.m_giftId = gid;
            this.initApp("activity/giftBag/GiftShopWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.delTimeHandler();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName('限时商城');
             this.m_MainTopNew.setResources([PropEnum.GOLD]);
            this.validateNow();
            this.addGiftBagTab();
            this.addEvent();

            //强制渲染一次 获取宽高
            // this.validateNow();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(0);

        }
        /**根据id 获得切卡 */
        // private getGiftIndex(id:number){
        //     for(let i =0 ;i < this.m_tabViewStack.numChildren;i++){
        //         let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
        //         if(view.giftId == id) return i;
        //     }
        //     return 0;
        // }
        /**添加礼包标签 */
        private addGiftBagTab() {
            for (let key in GiftBagModel.giftShopItems) {
                let data = GiftBagModel.giftShopItems[key];
                this.m_comTabGroup.addTabBtnData({ name: '', endTime: '' });
                let giftShop = new GiftShopView(data);
                this.m_tabViewStack.addChild(giftShop);
                let width = this.m_tabViewStack.width;
                let height = this.m_tabViewStack.height;
                giftShop.setViewSize(width, height);
            }
        }
        /**关闭界面 */
        private hidePanel() {
            if (this.m_tabViewStack.numChildren == 0) {
                UpManager.history();
            }
        }
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        }
        /**移除事件 */
        private removeEvent() {
           
            EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        }

        /**切换当前卡 */
        private changeTag(index: number) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            let view = this.m_tabViewStack.getChildAt(index) as GiftShopView;
            view.initView();
            this.addTimeHandler();
        }
        /**刷新倒计时 */
        private refreshTime(index: number, time: string, name: string) {
            let newInfo: ITabBtnData = { name: '', endTime: '' };
            newInfo.endTime = time;
            newInfo.name = name;
            this.m_comTabGroup.resetTabBtnData(newInfo, index);
        }

        /**添加倒计时 */
        private addTimeHandler() {
            if (this.m_bInitTick) return;
            this.m_bInitTick = true;
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        }
        /**移除倒计时 */
        private delTimeHandler() {
            // if (this.m_nTimeIndex >= 0) this.refreshTime(this.m_nTimeIndex, '');
            Utils.TimerManager.remove(this.timeCall, this);
            // this.m_tTimeData = null;
        }
        /**倒计时回调 */
        private timeCall() {
            if (this.m_tabViewStack.numChildren == 0) {
                this.delTimeHandler();
                return;
            }
            for (let i = 0; i < this.m_tabViewStack.numChildren; i++) {
                let view = this.m_tabViewStack.getChildAt(i) as GiftShopView;
                view.timeCall();
                let timeStr = view.getCountDown();
                this.refreshTime(i, timeStr, view.getTitle())
            }

        }

    }
}