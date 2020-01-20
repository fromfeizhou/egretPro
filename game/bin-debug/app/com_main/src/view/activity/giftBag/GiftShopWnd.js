var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * 限时活动
     */
    var GiftShopWnd = /** @class */ (function (_super_1) {
        __extends(GiftShopWnd, _super_1);
        function GiftShopWnd(gid) {
            var _this = _super_1.call(this) || this;
            _this.name = GiftShopWnd.NAME;
            _this.m_giftId = gid;
            _this.initApp("activity/giftBag/GiftShopWndSkin.exml");
            return _this;
        }
        GiftShopWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.delTimeHandler();
            this.removeEvent();
        };
        GiftShopWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
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
        };
        /**根据id 获得切卡 */
        // private getGiftIndex(id:number){
        //     for(let i =0 ;i < this.m_tabViewStack.numChildren;i++){
        //         let view = this.m_tabViewStack.getChildAt(i) as GiftBagItem;
        //         if(view.giftId == id) return i;
        //     }
        //     return 0;
        // }
        /**添加礼包标签 */
        GiftShopWnd.prototype.addGiftBagTab = function () {
            for (var key in GiftBagModel.giftShopItems) {
                var data = GiftBagModel.giftShopItems[key];
                this.m_comTabGroup.addTabBtnData({ name: '', endTime: '' });
                var giftShop = new com_main.GiftShopView(data);
                this.m_tabViewStack.addChild(giftShop);
                var width = this.m_tabViewStack.width;
                var height = this.m_tabViewStack.height;
                giftShop.setViewSize(width, height);
            }
        };
        /**关闭界面 */
        GiftShopWnd.prototype.hidePanel = function () {
            if (this.m_tabViewStack.numChildren == 0) {
                com_main.UpManager.history();
            }
        };
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        GiftShopWnd.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        };
        /**移除事件 */
        GiftShopWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        };
        /**切换当前卡 */
        GiftShopWnd.prototype.changeTag = function (index) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            var view = this.m_tabViewStack.getChildAt(index);
            view.initView();
            this.addTimeHandler();
        };
        /**刷新倒计时 */
        GiftShopWnd.prototype.refreshTime = function (index, time, name) {
            var newInfo = { name: '', endTime: '' };
            newInfo.endTime = time;
            newInfo.name = name;
            this.m_comTabGroup.resetTabBtnData(newInfo, index);
        };
        /**添加倒计时 */
        GiftShopWnd.prototype.addTimeHandler = function () {
            if (this.m_bInitTick)
                return;
            this.m_bInitTick = true;
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        };
        /**移除倒计时 */
        GiftShopWnd.prototype.delTimeHandler = function () {
            // if (this.m_nTimeIndex >= 0) this.refreshTime(this.m_nTimeIndex, '');
            Utils.TimerManager.remove(this.timeCall, this);
            // this.m_tTimeData = null;
        };
        /**倒计时回调 */
        GiftShopWnd.prototype.timeCall = function () {
            if (this.m_tabViewStack.numChildren == 0) {
                this.delTimeHandler();
                return;
            }
            for (var i = 0; i < this.m_tabViewStack.numChildren; i++) {
                var view = this.m_tabViewStack.getChildAt(i);
                view.timeCall();
                var timeStr = view.getCountDown();
                this.refreshTime(i, timeStr, view.getTitle());
            }
        };
        GiftShopWnd.NAME = 'GiftShopWnd';
        return GiftShopWnd;
    }(com_main.CView));
    com_main.GiftShopWnd = GiftShopWnd;
})(com_main || (com_main = {}));
