module com_main {
    export interface IGiftbagWnd {
        giftId: number;
        bInit: boolean;
        setViewSize(width: number, height: number): void;
        initView(): void;
        refreshView(): void;
    }
	/**
	 * 限时活动
	 */
    export class GiftBagWnd extends CView {
        public static NAME = 'GiftBagWnd';
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_tabViewStack: eui.ViewStack;  //主切卡

        private m_nWidth: number;    //切卡宽度
        private m_nHeight: number;   //切卡高度
        public m_giftId: number;
        private m_bInitTick: boolean;
        public constructor(gid: number) {
            super();
            this.name = GiftBagWnd.NAME;
            this.m_giftId = gid;
            this.initApp("activity/giftBag/GiftBagWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.delTimeHandler();
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName('限时活动');
            this.m_MainTopNew.setResources([PropEnum.YU]);
            this.validateNow();
            this.addGiftBagTab();
            this.addEvent();

            //强制渲染一次 获取宽高
            // this.validateNow();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();

            let currIndex = this.getGiftIndex(this.m_giftId);
            this.m_comTabGroup.selectedIndex = currIndex;
            this.changeTag(currIndex);
            this.m_comTabGroup.setScorllorV(currIndex);

        }
        /**根据id 获得切卡 */
        private getGiftIndex(id: number) {
            for (let i = 0; i < this.m_tabViewStack.numChildren; i++) {
                let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
                if (view.giftId == id) return i;
            }
            return 0;
        }
        /**添加礼包标签 */
        private addGiftBagTab() {
            for (let key in GiftBagModel.giftItems) {
                let data = GiftBagModel.giftItems[key];
                if (data.getCountDown() > 0) {
                    this.m_comTabGroup.addTabBtnData({ name: '', endTime: '' });
                    let giftItem = new GiftBagItem(data);
                    this.m_tabViewStack.addChild(giftItem);
                    let width = this.m_tabViewStack.width;
                    let height = this.m_tabViewStack.height;
                    giftItem.setViewSize(width, height);
                }
            }
        }

        /**领奖完成刷新 */
        private onGenGiftComplete(id: number) {
            let index = -1;
            for (let i = 0; i < this.m_tabViewStack.numChildren; i++) {
                let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
                if (view.giftId == id) {
                    index = i;
                    break;
                }
            }
            if (index == -1) return;
            this.m_comTabGroup.delTabBtnData(index);
            this.m_tabViewStack.removeChildAt(index);
            if (this.m_tabViewStack.numChildren == 0) {
                // UpManager.history();
                return;
            }
            this.changeTag(0);
        }
        /**购买完成刷新 */
        private refreshView(id: number) {
            for (let i = 0; i < this.m_tabViewStack.numChildren; i++) {
                let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
                if (view.giftId == id) {
                    view.refreshView();
                    break;
                }
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
            EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, this.refreshView, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, this.onGenGiftComplete, this);
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, this);
            EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        }

        /**切换当前卡 */
        private changeTag(index: number) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            let view = this.m_tabViewStack.getChildAt(index) as GiftBagItem;
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
            for (let i = this.m_tabViewStack.numChildren - 1; i >= 0; i--) {
                let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
                view.timeCall()
                if (view.getLeftTime() <= 0) {
                    /**移除过期礼包 */
                    this.onGenGiftComplete(view.giftId);
                } else {
                    this.refreshTime(i, view.getCountDown(), view.getTitle());
                }
            }
        }

    }
}