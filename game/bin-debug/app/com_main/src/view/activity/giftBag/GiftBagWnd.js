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
    var GiftBagWnd = /** @class */ (function (_super_1) {
        __extends(GiftBagWnd, _super_1);
        function GiftBagWnd(gid) {
            var _this = _super_1.call(this) || this;
            _this.name = GiftBagWnd.NAME;
            _this.m_giftId = gid;
            _this.initApp("activity/giftBag/GiftBagWndSkin.exml");
            return _this;
        }
        GiftBagWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.delTimeHandler();
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        };
        GiftBagWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName('限时活动');
            this.m_MainTopNew.setResources([PropEnum.YU]);
            this.validateNow();
            this.addGiftBagTab();
            this.addEvent();
            //强制渲染一次 获取宽高
            // this.validateNow();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            var currIndex = this.getGiftIndex(this.m_giftId);
            this.m_comTabGroup.selectedIndex = currIndex;
            this.changeTag(currIndex);
            this.m_comTabGroup.setScorllorV(currIndex);
        };
        /**根据id 获得切卡 */
        GiftBagWnd.prototype.getGiftIndex = function (id) {
            for (var i = 0; i < this.m_tabViewStack.numChildren; i++) {
                var view = this.m_tabViewStack.getChildAt(i);
                if (view.giftId == id)
                    return i;
            }
            return 0;
        };
        /**添加礼包标签 */
        GiftBagWnd.prototype.addGiftBagTab = function () {
            for (var key in GiftBagModel.giftItems) {
                var data = GiftBagModel.giftItems[key];
                if (data.getCountDown() > 0) {
                    this.m_comTabGroup.addTabBtnData({ name: '', endTime: '' });
                    var giftItem = new com_main.GiftBagItem(data);
                    this.m_tabViewStack.addChild(giftItem);
                    var width = this.m_tabViewStack.width;
                    var height = this.m_tabViewStack.height;
                    giftItem.setViewSize(width, height);
                }
            }
        };
        /**领奖完成刷新 */
        GiftBagWnd.prototype.onGenGiftComplete = function (id) {
            var index = -1;
            for (var i = 0; i < this.m_tabViewStack.numChildren; i++) {
                var view = this.m_tabViewStack.getChildAt(i);
                if (view.giftId == id) {
                    index = i;
                    break;
                }
            }
            if (index == -1)
                return;
            this.m_comTabGroup.delTabBtnData(index);
            this.m_tabViewStack.removeChildAt(index);
            if (this.m_tabViewStack.numChildren == 0) {
                // UpManager.history();
                return;
            }
            this.changeTag(0);
        };
        /**购买完成刷新 */
        GiftBagWnd.prototype.refreshView = function (id) {
            for (var i = 0; i < this.m_tabViewStack.numChildren; i++) {
                var view = this.m_tabViewStack.getChildAt(i);
                if (view.giftId == id) {
                    view.refreshView();
                    break;
                }
            }
        };
        /**关闭界面 */
        GiftBagWnd.prototype.hidePanel = function () {
            if (this.m_tabViewStack.numChildren == 0) {
                com_main.UpManager.history();
            }
        };
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        GiftBagWnd.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, this.refreshView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, this.onGenGiftComplete, this);
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        };
        /**移除事件 */
        GiftBagWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        };
        /**切换当前卡 */
        GiftBagWnd.prototype.changeTag = function (index) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            var view = this.m_tabViewStack.getChildAt(index);
            view.initView();
            this.addTimeHandler();
        };
        /**刷新倒计时 */
        GiftBagWnd.prototype.refreshTime = function (index, time, name) {
            var newInfo = { name: '', endTime: '' };
            newInfo.endTime = time;
            newInfo.name = name;
            this.m_comTabGroup.resetTabBtnData(newInfo, index);
        };
        /**添加倒计时 */
        GiftBagWnd.prototype.addTimeHandler = function () {
            if (this.m_bInitTick)
                return;
            this.m_bInitTick = true;
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        };
        /**移除倒计时 */
        GiftBagWnd.prototype.delTimeHandler = function () {
            // if (this.m_nTimeIndex >= 0) this.refreshTime(this.m_nTimeIndex, '');
            Utils.TimerManager.remove(this.timeCall, this);
            // this.m_tTimeData = null;
        };
        /**倒计时回调 */
        GiftBagWnd.prototype.timeCall = function () {
            if (this.m_tabViewStack.numChildren == 0) {
                this.delTimeHandler();
                return;
            }
            for (var i = this.m_tabViewStack.numChildren - 1; i >= 0; i--) {
                var view = this.m_tabViewStack.getChildAt(i);
                view.timeCall();
                if (view.getLeftTime() <= 0) {
                    /**移除过期礼包 */
                    this.onGenGiftComplete(view.giftId);
                }
                else {
                    this.refreshTime(i, view.getCountDown(), view.getTitle());
                }
            }
        };
        GiftBagWnd.NAME = 'GiftBagWnd';
        return GiftBagWnd;
    }(com_main.CView));
    com_main.GiftBagWnd = GiftBagWnd;
})(com_main || (com_main = {}));
