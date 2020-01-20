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
    var ChatMsgItem = /** @class */ (function (_super_1) {
        __extends(ChatMsgItem, _super_1);
        function ChatMsgItem() {
            var _this = _super_1.call(this) || this;
            _this.m_labRichMsg = null; //聊天内容
            _this.name = ChatMsgItem.NAME;
            _this.skinName = Utils.getAppSkin("ChatSkin/ChatMsgItemSkin.exml");
            return _this;
        }
        ChatMsgItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ChatMsgItem.prototype.onDestroy = function () {
            Utils.removeFromParent(this.m_labRichMsg);
            this.removeEvent();
        };
        ChatMsgItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (this.m_labRichMsg == null) {
                this.m_labRichMsg = new com_main.CCRichText(this.m_labMsg);
                this.m_pMsgRoot.addChild(this.m_labRichMsg);
                this.m_labRichMsg.imageScale = 0.7; //TODO
            }
            this.addEvent();
        };
        /**设置info */
        ChatMsgItem.prototype.dataChanged = function () {
            var _this = this;
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            var chatMsg = this.m_tData.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.m_labRichMsg.setLabelLineWidth(this.m_tData.width - 230);
                this.width = this.m_tData.width;
            }
            if (!this.m_tData)
                return;
            if (chatMsg.msgType == ChatMsgType.SYSTEM) {
                this.changeState(2);
                this.commitProperties();
                this.m_labRichMsg.text = "<font color = 0xffff00>\u3010" + GCode(CLEnum.CHAT_SYSTEM) + "\u3011</font>" + chatMsg.msg;
            }
            else {
                var state = chatMsg.isOwnerMsg ? 1 : 0;
                this.changeState(state);
                var headInfo = chatMsg.headPortrait;
                this.m_comHead.info = headInfo;
                //标题
                this.m_comState.stateId = chatMsg.stateId;
                this.m_labTitle.text = chatMsg.getTitle(this.m_tData.type);
                this.m_labTime.text = chatMsg.getTimeFormat();
                if (chatMsg.msgType == ChatMsgType.INVITE && headInfo.playerId != RoleData.playerId) {
                    var evt = MsgRule.EVT_INVITE + "," + headInfo.labourUnionId + "," + headInfo.labourUnionName;
                    this.m_labRichMsg.text = chatMsg.msg + ("<imgLink=" + evt + ">FChat_ghyq_png</imgLink>");
                }
                else {
                    this.m_labRichMsg.text = com_main.ChatUtils.ConvertFaceStr(chatMsg.msg);
                }
            }
            egret.callLater(function () {
                if (_this.m_imgMsgBg && _this.m_labRichMsg && _this.m_labRichMsg.isInit) {
                    _this.m_imgMsgBg.width = _this.m_labRichMsg.textWidth + 30;
                    _this.m_imgMsgBg.height = _this.m_labRichMsg.textHeight + 20;
                }
            }, this);
        };
        /**更改皮肤 */
        ChatMsgItem.prototype.changeState = function (val) {
            if (this.m_nState == val)
                return;
            this.m_nState = val;
            switch (this.m_nState) {
                case 0: {
                    this.currentState = 'left';
                    this.m_labRichMsg.left = 0;
                    this.m_labRichMsg.right = NaN;
                    this.changeTitleObjects();
                    break;
                }
                case 1: {
                    this.currentState = 'right';
                    this.m_labRichMsg.right = 0;
                    this.m_labRichMsg.left = NaN;
                    this.changeTitleObjects();
                    break;
                }
                case 2: {
                    this.currentState = 'system';
                    this.m_labRichMsg.left = 0;
                    this.m_labRichMsg.right = NaN;
                    break;
                }
            }
            this.commitProperties();
        };
        /**改变标题顺序 */
        ChatMsgItem.prototype.changeTitleObjects = function () {
            var list = ['m_comState', 'm_labTitle', 'm_labSpace', 'm_labTime'];
            if (this.m_nState == 1)
                list.reverse();
            for (var i = 0; i < list.length; i++) {
                var item = this[list[i]];
                this.m_pTitleRoot.setChildIndex(item, i);
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMsgItem.prototype.addEvent = function () {
            this.m_labRichMsg.addEventListener(com_main.RichTextEvent.Link, this.onRichTextEvent, this);
            com_main.EventManager.addTouchTapListener(this.m_comHead, this, this.onClickHead);
        };
        ChatMsgItem.prototype.removeEvent = function () {
            if (this.m_labRichMsg != null) {
                this.m_labRichMsg.removeEventListener(com_main.RichTextEvent.Link, this.onRichTextEvent, this);
            }
            com_main.EventManager.removeEventListener(this.m_comHead);
        };
        /**头像点击 */
        ChatMsgItem.prototype.onClickHead = function () {
            if (!this.m_tData || this.m_tData.data.headPortrait.playerId == RoleData.playerId)
                return;
            NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(this.m_tData.data.headPortrait.playerId);
        };
        /**富文本事件 */
        ChatMsgItem.prototype.onRichTextEvent = function (evt) {
            com_main.ChatUtils.HandleItemClick(evt.text);
        };
        ChatMsgItem.NAME = 'ChatMsgRoleItem';
        return ChatMsgItem;
    }(eui.ItemRenderer));
    com_main.ChatMsgItem = ChatMsgItem;
})(com_main || (com_main = {}));
