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
    var ChatMsgBlackView = /** @class */ (function (_super_1) {
        __extends(ChatMsgBlackView, _super_1);
        function ChatMsgBlackView(type, width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.ChatMsgView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            _this.skinName = Utils.getAppSkin("ChatSkin/ChatMsgBlackViewSkin.exml");
            return _this;
        }
        ChatMsgBlackView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ChatMsgBlackView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        ChatMsgBlackView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
            var width = this.m_listItem.width;
            this.m_nItemWidth = width;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.itemRenderer = ChatBlackRender;
            this.m_listItem.dataProvider = this.m_tCollection;
            var res = [];
            var list = ChatModel.getBlackList();
            for (var i = 0; i < list.length; i++) {
                res.push({ width: width, info: list[i] });
            }
            this.m_tCollection.replaceAll(res);
            this.refreshBlackNum();
            this.addEvent();
        };
        /**显示当前切卡行为 */
        ChatMsgBlackView.prototype.onShow = function () {
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips: GCode(CLEnum.CHAT_BLACK_TIPS) });
        };
        /**显示当前切卡行为 */
        ChatMsgBlackView.prototype.onHide = function () {
        };
        Object.defineProperty(ChatMsgBlackView.prototype, "chatType", {
            get: function () {
                return this.m_nType;
            },
            /**获得聊天频道 */
            set: function (val) {
                this.m_nType = val;
            },
            enumerable: true,
            configurable: true
        });
        ChatMsgBlackView.prototype.sendChannelMsg = function (msg, playerId) {
            return false;
        };
        /**刷新黑名单人数 */
        ChatMsgBlackView.prototype.refreshBlackNum = function () {
            this.m_labBlackNum.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CHAT_BLACK_NUM, this.m_tCollection.length, ChatModel.BLACK_MAX));
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMsgBlackView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ChatEvent.CHAT_BLACK_LIST_ADD, this.onBlackListAdd, this);
            com_main.EventMgr.addEvent(ChatEvent.CHAT_BLACK_LIST_DEL, this.onBlackListDel, this);
        };
        ChatMsgBlackView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_BLACK_LIST_ADD, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_BLACK_LIST_DEL, this);
        };
        /**添加对象 */
        ChatMsgBlackView.prototype.onBlackListAdd = function (id) {
            var data = ChatModel.getBlackInfo(id);
            if (data) {
                var item = { width: this.m_nItemWidth, info: data };
                this.m_tCollection.addItem(item);
            }
        };
        /**移除对象对象 */
        ChatMsgBlackView.prototype.onBlackListDel = function (id) {
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var data = this.m_tCollection.getItemAt(i);
                if (data.info.playerId == (id)) {
                    this.m_tCollection.removeItemAt(i);
                    return;
                }
            }
        };
        ChatMsgBlackView.NAME = 'ChatMsgBlackView';
        return ChatMsgBlackView;
    }(com_main.CComponent));
    com_main.ChatMsgBlackView = ChatMsgBlackView;
    /**渲染对象 */
    var ChatBlackRender = /** @class */ (function (_super_1) {
        __extends(ChatBlackRender, _super_1);
        function ChatBlackRender() {
            return _super_1.call(this) || this;
        }
        ChatBlackRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ChatBlackRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnOpen.setTitleLabel(GCode(CLEnum.CHAT_BLACK_CANCEL));
            com_main.EventManager.addTouchScaleListener(this.m_btnOpen, this, this.onBtnOpen);
        };
        /**解除黑名单 */
        ChatBlackRender.prototype.onBtnOpen = function () {
            if (!this.m_tData)
                return;
            ChatProxy.C2S_CHAT_DEL_BLACKLIST(this.m_tData.info.playerId);
        };
        ChatBlackRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.width = this.m_tData.width;
                this.commitProperties();
            }
            var info = this.m_tData.info;
            this.m_comHead.info = info;
            this.m_comState.stateId = info.countryId;
            this.m_labTitle.text = info.playerName;
            this.m_labLegion.text = info.labourUnionName;
        };
        return ChatBlackRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
