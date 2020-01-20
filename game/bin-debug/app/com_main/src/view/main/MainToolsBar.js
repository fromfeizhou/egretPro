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
    var MainToolsBar = /** @class */ (function (_super_1) {
        __extends(MainToolsBar, _super_1);
        // private m_bTickInit: boolean;
        function MainToolsBar() {
            var _this = _super_1.call(this) || this;
            _this.name = MainToolsBar.NAME;
            _this.skinName = Utils.getAppSkin('top_new/new_tool_main.exml');
            _this.touchEnabled = false;
            return _this;
        }
        MainToolsBar.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MainToolsBar.prototype.onDestroy = function () {
            this.removeEvent();
            // if (this.m_bTickInit) {
            // 	Utils.TimerManager.remove(this.onMsgTick, this);
            // 	this.m_bTickInit = false;
            // }
            _super_1.prototype.onDestroy.call(this);
        };
        MainToolsBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = AGame.R.app.stageWidth;
            this.x = 0;
            this.y = this.stage.stageHeight - this.height;
            this.m_listChat.mask = this.m_imgMask;
            var source = [];
            for (var i = 1; i >= 0; i--) {
                source.push(ChatModel.lastMsgCache[i]);
            }
            this.m_tCollection = new eui.ArrayCollection(source);
            this.m_listChat.itemRenderer = ChatMsgRender;
            this.m_listChat.dataProvider = this.m_tCollection;
            this.addEvent();
            if (GameConfig.getIsNotchScreen()) {
                this.m_rootGroup.left += GameConfig.notchPixel;
            }
        };
        MainToolsBar.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ChatEvent.MSG_UPDATE, this.onMsgUpdate, this);
            com_main.EventManager.addTouchTapListener(this.m_pChat, this, this.onItemClick);
        };
        /**点击回调 */
        MainToolsBar.prototype.onItemClick = function () {
            Utils.open_view(TASK_UI.POP_CHAT_MAIN);
        };
        MainToolsBar.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(ChatEvent.MSG_UPDATE, this);
        };
        /**消息增加 */
        MainToolsBar.prototype.onMsgUpdate = function (data) {
            //过滤自己的私聊
            if (data.channel == ChatType.PRIVATE && data.vo.playerId == RoleData.playerId) {
                return;
            }
            // if (!this.m_bTickInit) {
            // 	this.m_bTickInit = true;
            // 	Utils.TimerManager.doTimer(5000, 0, this.onMsgTick, this);
            // }
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var item = this.m_tCollection.getItemAt(i);
                if (!item) {
                    this.m_tCollection.replaceItemAt(data.vo, i);
                    return;
                }
            }
            var info = this.m_tCollection.getItemAt(1);
            this.m_tCollection.replaceItemAt(info, 0);
            this.m_tCollection.replaceItemAt(data.vo, 1);
        };
        MainToolsBar.NAME = 'MainToolsBar';
        return MainToolsBar;
    }(com_main.CComponent));
    com_main.MainToolsBar = MainToolsBar;
    var ChatMsgRender = /** @class */ (function (_super_1) {
        __extends(ChatMsgRender, _super_1);
        function ChatMsgRender() {
            return _super_1.call(this) || this;
        }
        ChatMsgRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            Utils.removeFromParent(this.m_labRich);
            com_main.EventManager.removeEventListeners(this);
        };
        ChatMsgRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labRich = new com_main.CCRichText(this.m_labMsg);
            this.m_labRich.limitHeight(1);
            this.addChild(this.m_labRich);
            this.m_labRich.imageScale = 0.6; //TODO
            // EventManager.addTouchTapListener(this, this, this.onItemClick);
        };
        /**点击回调 */
        // private onItemClick() {
        // 	if (!this.m_tData) {
        // 		Utils.open_view(TASK_UI.POP_CHAT_MAIN);
        // 	} else {
        // 		if (this.m_tData.type == ChatType.PRIVATE) {
        // 			let param: IChatWndParm = { type: ChatType.PRIVATE, id: this.m_tData.playerId, name: this.m_tData.playerName };
        // 			Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
        // 		} else {
        // 			let param: IChatWndParm = { type: this.m_tData.type };
        // 			Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
        // 		}
        // 	}
        // }
        ChatMsgRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData) {
                this.m_labRich.text = '';
                return;
            }
            var msg = com_main.ChatUtils.ConvertFaceStr(this.m_tData.msg);
            if (this.m_tData.msgType == ChatMsgType.SYSTEM) {
                this.m_labRich.text = "<font color = 0xffff00>\u3010" + GCode(CLEnum.CHAT_SYSTEM) + "\u3011</font>" + msg;
                return;
            }
            switch (this.m_tData.type) {
                case ChatType.WORLD: {
                    var color = Utils.getCountryColor(this.m_tData.headPortrait.countryId);
                    var cName = Utils.getCountryName(this.m_tData.headPortrait.countryId);
                    var name_1 = this.m_tData.headPortrait.playerName;
                    this.m_labRich.text = "<font color = " + color + ">\u3010" + cName + "\u3011</color><font color = 0x00ff00>\u3010" + name_1 + "\u3011</font>" + msg;
                    break;
                }
                case ChatType.COUNTRY: {
                    var name_2 = this.m_tData.headPortrait.playerName;
                    this.m_labRich.text = "<font color = 0xffff00>\u3010" + GCode(CLEnum.CHAT_MSTATE) + "\u3011</color><font color = 0x00ff00>\u3010" + name_2 + "\u3011</font>" + msg;
                    break;
                }
                case ChatType.LEGION: {
                    var name_3 = this.m_tData.headPortrait.playerName;
                    this.m_labRich.text = "<font color = 0xffff00>\u3010" + GCode(CLEnum.CHAT_MLEGION) + "\u3011</color><font color = 0x00ff00>\u3010" + name_3 + "\u3011</font>" + msg;
                    break;
                }
                case ChatType.PRIVATE: {
                    var name_4 = this.m_tData.headPortrait.playerName;
                    this.m_labRich.text = "<font color = 0xffff00>\u3010" + GCode(CLEnum.CHAT_MPRI) + "\u3011</color><font color = 0x00ff00>\u3010" + name_4 + "\u3011</font>" + msg;
                    break;
                }
            }
        };
        return ChatMsgRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
