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
    var ChatMsgPriView = /** @class */ (function (_super_1) {
        __extends(ChatMsgPriView, _super_1);
        function ChatMsgPriView(type, width, height) {
            return _super_1.call(this, type, width, height, Utils.getAppSkin("ChatSkin/ChatMsgPriViewSkin.exml")) || this;
        }
        ChatMsgPriView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ChatMsgPriView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ChatMsgPriView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tHeadCollection = new eui.ArrayCollection();
            this.m_listPlayer.itemRenderer = ChatPrivateCell;
            this.m_listPlayer.dataProvider = this.m_tHeadCollection;
            this.refreshHeads();
            this.m_nTargetId = null;
            this.m_sTargetName = '';
            this.m_nCurIndex = -1;
        };
        /**刷新聊天对象数组 */
        ChatMsgPriView.prototype.refreshHeads = function () {
            var list = ChatModel.getPriHeads();
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var info = list[i];
                res.push({ selected: false, vo: info });
            }
            res.sort(function (a, b) {
                return b.vo.lastTime - a.vo.lastTime;
            });
            this.m_tHeadCollection.replaceAll(res);
            this.refreshPlayerNum();
        };
        /**发送消息(子类重写) */
        ChatMsgPriView.prototype.sendChannelMsg = function (msg) {
            if (!this.m_nTargetId) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_PRI_FAL), 1, true);
                return;
            }
            return _super_1.prototype.sendChannelMsg.call(this, msg, this.m_nTargetId);
        };
        Object.defineProperty(ChatMsgPriView.prototype, "coldTime", {
            /**聊天间隔 */
            get: function () {
                return 1000;
            },
            enumerable: true,
            configurable: true
        });
        /** 频道消息过滤 */
        ChatMsgPriView.prototype.isChannelMsg = function (channel, targetId) {
            if (channel == this.m_nType) {
                if (this.m_nTargetId && this.m_nTargetId == (targetId))
                    return true;
            }
            return false;
        };
        /**聊天数据 */
        ChatMsgPriView.prototype.getItemList = function () {
            if (this.m_nTargetId) {
                return ChatModel.getPriMsgById(this.m_nTargetId);
            }
            return [];
        };
        /**=====================================================================================
         * 分割线
         * =====================================================================================
         */
        /**设置当前聊天对象 */
        ChatMsgPriView.prototype.setTargetInfo = function (param) {
            if (param) {
                this.m_nTargetId = param.id;
                this.m_sTargetName = param.name;
            }
            var index = this.getStartIndex();
            this.changeSelIndex(index);
        };
        /**根据id获得下标 */
        ChatMsgPriView.prototype.getStartIndex = function () {
            if (this.m_nTargetId) {
                for (var i = 0; i < this.m_tHeadCollection.source.length; i++) {
                    var item = this.m_tHeadCollection.getItemAt(i);
                    if (item && item.vo.headPortrait.playerId == (this.m_nTargetId))
                        return i;
                }
                return -1;
            }
            return this.m_tHeadCollection.source.length > 0 ? 0 : -1;
        };
        /**刷新聊天人数 */
        ChatMsgPriView.prototype.refreshPlayerNum = function () {
            this.m_labPlayerNum.text = this.m_tHeadCollection.source.length.toString();
        };
        /**刷新标题目标 */
        ChatMsgPriView.prototype.refrehTargetTips = function () {
            this.m_labTarget.textFlow = this.m_sTargetName == '' ? [] : Utils.htmlParser(GCodeFromat(CLEnum.CHAT_PRI_TO, this.m_sTargetName));
        };
        /**刷新当前聊天目标 */
        ChatMsgPriView.prototype.changeSelIndex = function (index) {
            //没有私聊头像 目标 显示对白名字
            if (index >= this.m_tHeadCollection.length || index == -1) {
                this.m_nCurIndex = -1;
                this.refrehTargetTips();
                return;
            }
            if (this.m_nCurIndex == index)
                return;
            var preIndex = this.m_nCurIndex;
            var data = this.m_tHeadCollection.getItemAt(preIndex);
            if (data) {
                data.selected = false;
                this.m_tHeadCollection.replaceItemAt(data, preIndex);
            }
            this.m_nCurIndex = index;
            data = this.m_tHeadCollection.getItemAt(index);
            data.selected = true;
            this.m_tHeadCollection.replaceItemAt(data, index);
            this.m_nTargetId = data.vo.headPortrait.playerId;
            this.m_sTargetName = data.vo.headPortrait.playerName;
            this.initItemData(true);
            if (this.m_nTargetId) {
                ChatModel.requestPriMsg(this.m_nTargetId);
            }
            this.refrehTargetTips();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMsgPriView.prototype.addEvent = function () {
            _super_1.prototype.addEvent.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnClear, this, this.onBtnClear);
            com_main.EventMgr.addEvent(ChatEvent.CHAT_HEAD_ADD, this.onHeadUpdateAdd, this);
            com_main.EventMgr.addEvent(ChatEvent.CHAT_HEAD_DEL, this.onHeadUpdateDel, this);
            com_main.EventMgr.addEvent(ChatEvent.CHAT_HEAD_UPDATE, this.onHeadUpdate, this);
            com_main.EventMgr.addEvent(ChatEvent.CHAT_MSG_PRI_CLEAR, this.onChatMsgClear, this);
            this.m_listPlayer.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onPlayerHandler, this);
        };
        ChatMsgPriView.prototype.removeEvent = function () {
            _super_1.prototype.removeEvent.call(this);
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_ADD, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_DEL, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_UPDATE, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.CHAT_MSG_PRI_CLEAR, this);
            this.m_listPlayer.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onPlayerHandler, this);
        };
        /**私聊对象消息清理*/
        ChatMsgPriView.prototype.onChatMsgClear = function (playerId) {
            if (this.m_nTargetId && playerId == (this.m_nTargetId)) {
                this.m_tCollection.removeAll();
            }
        };
        /**清理全部消息 */
        ChatMsgPriView.prototype.onBtnClear = function () {
            if (this.m_tHeadCollection.source.length > 0) {
                ChatProxy.C2S_CHAT_PRIVATE_CLEAN(0);
            }
        };
        /**头像增加 */
        ChatMsgPriView.prototype.onHeadUpdateAdd = function (playerId) {
            var vo = ChatModel.getPriHeadById(playerId);
            if (!vo)
                return;
            var item = { selected: false, vo: vo };
            this.m_tHeadCollection.addItem(item);
            this.setTargetInfo({ id: vo.headPortrait.playerId, name: vo.headPortrait.playerName, type: ChatType.PRIVATE });
            this.refreshPlayerNum();
            this.onHeadUpdate();
            if (!this.onShow)
                return;
            //增加第一个头像  而且没有指定聊天对象
            if (this.m_tHeadCollection.length == 1 && !this.m_nTargetId) {
                this.changeSelIndex(0);
            }
        };
        /**头像减少 */
        ChatMsgPriView.prototype.onHeadUpdateDel = function (playerId) {
            if (playerId && !(this.m_tHeadCollection.source.length == 1)) {
                var delIndex = this.m_tHeadCollection.source.length;
                for (var i = 0; i < this.m_tHeadCollection.source.length; i++) {
                    var item = this.m_tHeadCollection.getItemAt(i);
                    if (playerId == (item.vo.headPortrait.playerId)) {
                        this.m_tHeadCollection.removeItemAt(i);
                        delIndex = i;
                        break;
                    }
                }
                //移除位置 比选中位置小 选中位置减1
                if (this.m_nCurIndex >= delIndex)
                    this.m_nCurIndex--;
                if (this.m_nTargetId == (playerId)) {
                    this.changeSelIndex(0);
                }
            }
            else {
                this.clearAllHead();
            }
            this.refreshPlayerNum();
        };
        /**清理所有头像消息 */
        ChatMsgPriView.prototype.clearAllHead = function () {
            this.m_nTargetId = null;
            this.m_sTargetName = '';
            this.m_tHeadCollection.removeAll();
            this.m_tCollection.removeAll();
            this.changeSelIndex(-1);
        };
        /**头像选中 */
        ChatMsgPriView.prototype.onPlayerHandler = function (e) {
            var info = this.m_tHeadCollection.getItemAt(e.itemIndex);
            if (info) {
                this.changeSelIndex(e.itemIndex);
            }
        };
        /*头像排序 */
        ChatMsgPriView.prototype.onHeadUpdate = function () {
            this.m_tHeadCollection.source.sort(function (a, b) {
                return b.vo.lastTime - a.vo.lastTime;
            });
            if (this.m_nCurIndex < 0)
                return;
            //排序后调整当前下标
            var data = this.m_tHeadCollection.getItemAt(this.m_nCurIndex);
            if (data)
                data.selected = false;
            this.m_nCurIndex = this.getStartIndex();
            data = this.m_tHeadCollection.getItemAt(this.m_nCurIndex);
            if (data)
                data.selected = true;
            //全部刷新
            this.m_tHeadCollection.refresh();
        };
        ChatMsgPriView.NAME = 'ChatMsgPriView';
        return ChatMsgPriView;
    }(com_main.ChatMsgView));
    com_main.ChatMsgPriView = ChatMsgPriView;
    var ChatPrivateCell = /** @class */ (function (_super_1) {
        __extends(ChatPrivateCell, _super_1);
        function ChatPrivateCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            return _this;
        }
        ChatPrivateCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnDel, this, this.onBtnDel);
        };
        /**清理聊天记录 */
        ChatPrivateCell.prototype.onBtnDel = function () {
            if (!this.m_tData)
                return;
            ChatProxy.C2S_CHAT_PRIVATE_CLEAN(this.m_tData.vo.headPortrait.playerId);
        };
        ChatPrivateCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ChatPrivateCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            var headInfo = this.m_tData.vo.headPortrait;
            this.m_comHead.info = headInfo;
            this.m_labName.text = headInfo.playerName;
            this.m_labTime.text = ChatModel.timeFormat(this.m_tData.vo.lastTime);
            this.m_imgSelected.visible = this.m_tData.selected;
            this.m_comState.stateId = headInfo.countryId;
            RedPointModel.AddInfoListener(this, { x: 12, y: 5 }, [RedEvtType.CHAT], 2, { playerId: this.m_tData.vo.headPortrait.playerId });
        };
        return ChatPrivateCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
