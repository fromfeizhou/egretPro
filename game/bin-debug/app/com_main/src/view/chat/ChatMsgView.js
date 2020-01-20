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
    var ChatMsgView = /** @class */ (function (_super_1) {
        __extends(ChatMsgView, _super_1);
        function ChatMsgView(type, width, height, skinName) {
            if (skinName === void 0) { skinName = ''; }
            var _this = _super_1.call(this) || this;
            _this.name = ChatMsgView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            _this.skinName = skinName == '' ? Utils.getAppSkin("ChatSkin/ChatMsgViewSkin.exml") : skinName;
            return _this;
        }
        ChatMsgView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ChatMsgView.prototype.onDestroy = function () {
            this.removeEvent();
            if (this.m_nTimeOutId) {
                egret.clearTimeout(this.m_nTimeOutId);
                this.m_nTimeOutId = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        /**显示当前切卡行为 */
        ChatMsgView.prototype.onShow = function () {
            this.m_bIsShow = true;
            if (this.m_bInit) {
                this.initItemData(false);
            }
            else {
                this.m_bInit = true;
                this.initItemData(true);
            }
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: false });
        };
        /**隐藏 */
        ChatMsgView.prototype.onHide = function () {
            this.m_bIsShow = false;
        };
        Object.defineProperty(ChatMsgView.prototype, "chatType", {
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
        ChatMsgView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";
            this.initItemList();
            this.addEvent();
            this.m_bIsShow = false;
        };
        ChatMsgView.prototype.initItemList = function () {
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.itemRenderer = com_main.ChatMsgItem;
            this.m_listItem.dataProvider = this.m_tCollection;
            this.validateNow();
            this.m_nItemWidth = this.m_listItem.width;
        };
        /**初始化列表 */
        ChatMsgView.prototype.initItemData = function (isReset) {
            var list = this.getItemList();
            list.sort(function (a, b) {
                return a.time - b.time;
            });
            if (isReset) {
                this.m_tCollection.removeAll();
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    var vo = list[i];
                    var data = this.createItemRD(vo);
                    res.push(data);
                }
                this.m_tCollection.replaceAll(res);
            }
            else {
                for (var i = 0; i < list.length; i++) {
                    var vo = list[i];
                    var isNew = true;
                    //过滤已有对象
                    for (var i_1 = 0; i_1 < this.m_tCollection.source.length; i_1++) {
                        var item = this.m_tCollection.getItemAt(i_1);
                        if (item.data.hashCode == vo.hashCode) {
                            isNew = false;
                            break;
                        }
                    }
                    if (isNew) {
                        this.m_tCollection.addItem(this.createItemRD(vo));
                    }
                }
            }
            this.validateNow();
            this.m_bScrollEnd = true;
            this.refreshScrollV();
        };
        /**对象创建渲染data */
        ChatMsgView.prototype.createItemRD = function (vo) {
            var item = {
                type: this.m_nType,
                data: vo,
                width: this.m_nItemWidth,
            };
            vo.isRead = true;
            return item;
        };
        /**滚动到最大位置 */
        ChatMsgView.prototype.refreshScrollV = function () {
            var _this = this;
            egret.callLater(function () {
                if (_this.m_scroll) {
                    var scrollV = _this.m_scroll.viewport.contentHeight - _this.m_scroll.viewport.height;
                    scrollV = Math.max(scrollV, 0);
                    _this.m_scroll.viewport.scrollV = scrollV;
                }
            }, this);
        };
        ChatMsgView.prototype.onContentChange = function (evt) {
            if (this.m_bScrollEnd && evt.property == 'contentHeight') {
                this.refreshScrollV();
            }
        };
        /**发送消息(子类继承重写) */
        ChatMsgView.prototype.sendChannelMsg = function (msg, playerId) {
            var _this = this;
            if (!PlatConst.isDebugPlat() && !FunctionModel.isFunctionOpen(FunctionType.CHAT)) {
                var level = FunctionModel.getFunctionOpenLevel(FunctionType.CHAT);
                EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_LIMI_LEVEL, level), 1, true);
                return false;
            }
            // 判断是否都是空格
            var left_str = msg.replace("%s", "");
            if (left_str == "") {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND), 1, true);
                return false;
            }
            if (msg.length > ChatModel.MSG_CHAT_MAX) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND2), 1, true);
                return false;
            }
            if (playerId && ChatModel.inBlackList(playerId)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND3), 1, true);
                return false;
            }
            //私聊过滤
            if (playerId && playerId == (RoleData.playerId)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND4), 1, true);
                return false;
            }
            if (this.m_bSendCd) {
                var name_1 = ChatModel.getChannelName(this.m_nType);
                var time = Math.floor(this.coldTime / 1000);
                EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_LIMI_SEND5, name_1, time), 1, true);
                return false;
            }
            msg = StringUtils.searchDwordsAndReplace(msg);
            ChatProxy.C2S_CHAT_PUSH(this.m_nType, msg, playerId);
            this.m_bSendCd = true;
            this.m_nTimeOutId = egret.setTimeout(function () {
                _this.m_bSendCd = false;
                _this.m_nTimeOutId = null;
            }, this, this.coldTime);
            return true;
        };
        Object.defineProperty(ChatMsgView.prototype, "coldTime", {
            /**聊天间隔 */
            get: function () {
                return ConstUtil.getValue(IConstEnum.CHAT_INTERVAL);
            },
            enumerable: true,
            configurable: true
        });
        /** 频道消息过滤 */
        ChatMsgView.prototype.isChannelMsg = function (channel, targetId) {
            return channel == this.m_nType;
        };
        /**聊天数据 */
        ChatMsgView.prototype.getItemList = function () {
            return ChatModel.getMsgByType(this.m_nType);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMsgView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ChatEvent.MSG_UPDATE, this.onMsgUpdate, this);
            this.m_listItem.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onContentChange, this);
            this.m_scroll.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
        };
        ChatMsgView.prototype.removeEvent = function () {
            this.m_listItem.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onContentChange, this);
            this.m_scroll.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.MSG_UPDATE, this);
            com_main.EventManager.removeEventListeners(this);
        };
        ChatMsgView.prototype.moveScroller = function () {
            this.m_bScrollEnd = false;
        };
        /**消息增加 */
        ChatMsgView.prototype.onMsgUpdate = function (data) {
            if (!this.m_bIsShow)
                return;
            if (!this.isChannelMsg(data.channel, data.targetId))
                return;
            var scrollV = this.m_listItem.contentHeight - this.m_listItem.height;
            scrollV = Math.max(scrollV, 0);
            var rdata = this.createItemRD(data.vo);
            this.m_tCollection.addItem(rdata);
            this.validateNow();
            if (this.m_listItem.scrollV >= scrollV) {
                this.m_bScrollEnd = true;
                this.refreshScrollV();
            }
        };
        ChatMsgView.NAME = 'ChatMsgView';
        return ChatMsgView;
    }(com_main.CComponent));
    com_main.ChatMsgView = ChatMsgView;
})(com_main || (com_main = {}));
