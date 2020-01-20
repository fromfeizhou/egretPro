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
    var ChatMsgWorldView = /** @class */ (function (_super_1) {
        __extends(ChatMsgWorldView, _super_1);
        function ChatMsgWorldView() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        /**发送消息(子类重写) */
        ChatMsgWorldView.prototype.sendChannelMsg = function (msg) {
            //国家频道 道具消耗判断
            if (!PropModel.isItemEnough(PropEnum.CHAT_ITEM, 1)) {
                QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.CHAT_ITEM);
                return;
            }
            return _super_1.prototype.sendChannelMsg.call(this, msg);
        };
        Object.defineProperty(ChatMsgWorldView.prototype, "coldTime", {
            /**聊天间隔 */
            get: function () {
                return 1000;
            },
            enumerable: true,
            configurable: true
        });
        return ChatMsgWorldView;
    }(com_main.ChatMsgView));
    com_main.ChatMsgWorldView = ChatMsgWorldView;
    var ChatMsgSysyemView = /** @class */ (function (_super_1) {
        __extends(ChatMsgSysyemView, _super_1);
        function ChatMsgSysyemView() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        /**发送消息(子类重写) */
        ChatMsgSysyemView.prototype.sendChannelMsg = function (msg) {
            //国家频道 道具消耗判断
            if (!PropModel.isItemEnough(PropEnum.CHAT_ITEM, 1)) {
                QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.CHAT_ITEM);
                return;
            }
            return _super_1.prototype.sendChannelMsg.call(this, msg);
        };
        /**显示当前切卡行为 */
        ChatMsgSysyemView.prototype.onShow = function () {
            _super_1.prototype.onShow.call(this);
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips: '' });
        };
        return ChatMsgSysyemView;
    }(com_main.ChatMsgView));
    com_main.ChatMsgSysyemView = ChatMsgSysyemView;
})(com_main || (com_main = {}));
