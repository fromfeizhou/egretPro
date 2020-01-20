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
var ChatProxy = /** @class */ (function (_super_1) {
    __extends(ChatProxy, _super_1);
    function ChatProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    ChatProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_CHAT_RECORD_LIST, this, 'C2S_CHAT_RECORD_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_RECORD_LIST, this, 'S2C_CHAT_RECORD_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_PUSH, this, 'C2S_CHAT_PUSH', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_PUSH, this, 'S2C_CHAT_PUSH', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_PRIVATE_LIST, this, 'C2S_CHAT_PRIVATE_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_PRIVATE_LIST, this, 'S2C_CHAT_PRIVATE_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_PRIVATE_RECORD_LIST, this, 'C2S_CHAT_PRIVATE_RECORD_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_PRIVATE_RECORD_LIST, this, 'S2C_CHAT_PRIVATE_RECORD_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_PRIVATE_CLEAN, this, 'C2S_CHAT_PRIVATE_CLEAN', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_PRIVATE_CLEAN, this, 'S2C_CHAT_PRIVATE_CLEAN', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CHAT_PRIVATE_HEAD, this, 'S2C_CHAT_PRIVATE_HEAD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_BLACKLIST, this, 'C2S_CHAT_BLACKLIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_BLACKLIST, this, 'S2C_CHAT_BLACKLIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_ADD_BLACKLIST, this, 'C2S_CHAT_ADD_BLACKLIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_ADD_BLACKLIST, this, 'S2C_CHAT_ADD_BLACKLIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_DEL_BLACKLIST, this, 'C2S_CHAT_DEL_BLACKLIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_DEL_BLACKLIST, this, 'S2C_CHAT_DEL_BLACKLIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHAT_REPORT, this, 'C2S_CHAT_REPORT', ProxyEnum.SEND],
            [ProtoDef.S2C_CHAT_REPORT, this, 'S2C_CHAT_REPORT', ProxyEnum.RECEIVE],
        ];
    };
    ChatProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_CHAT_RECORD_LIST: { // 获取聊天记录
                ChatModel.pushChatRecordMsg(body);
                break;
            }
            case ProtoDef.S2C_CHAT_PUSH: { // 聊天推送
                ChatModel.pushChatMsg(body);
                break;
            }
            case ProtoDef.S2C_CHAT_PRIVATE_LIST: { // 私聊列表
                var data = body;
                ChatModel.parseHeadList(data.playerHeadPortrait);
                break;
            }
            case ProtoDef.S2C_CHAT_PRIVATE_HEAD: { // 私聊列表添加头像
                var data = body;
                ChatModel.parseHeadList([data.playerHeadPortraitAdd]);
                break;
            }
            case ProtoDef.S2C_CHAT_PRIVATE_RECORD_LIST: { //获取私聊记录
                var data = body;
                ChatModel.clearPriMsgById(data.playerId);
                ChatModel.pushPriMsg(data.playerId, data.data, true);
                break;
            }
            case ProtoDef.S2C_CHAT_PRIVATE_CLEAN: { //清除私聊列表成员
                if (body.state == 0) {
                    ChatModel.delHead(body.playerId);
                }
                break;
            }
            case ProtoDef.S2C_CHAT_BLACKLIST: { //获取黑名单
                var data = body;
                ChatModel.pushBlackList(data.headPortrait);
                break;
            }
            case ProtoDef.S2C_CHAT_ADD_BLACKLIST: { //添加黑名单
                var data = body;
                if (data.state == 0) {
                    EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_BLACK_SUC, data.headPortrait.playerName));
                    ChatModel.pushBlackList([data.headPortrait]);
                }
                break;
            }
            case ProtoDef.S2C_CHAT_DEL_BLACKLIST: { //解除黑名单
                var data = body;
                if (data.state == 0) {
                    EffectUtils.showTips(GCode(CLEnum.CHAT_BLACK_DEL));
                    ChatModel.delBlackList(data.playerId);
                }
                break;
            }
            case ProtoDef.S2C_CHAT_REPORT: { //举报
                var data = body;
                if (data.state == 0) {
                    EffectUtils.showTips(GCode(CLEnum.CHAT_REPORT_TIPS));
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.CHAT_REPORT_FAL));
                }
                break;
            }
        }
    };
    /**获取聊天记录 */
    ChatProxy.C2S_CHAT_RECORD_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_RECORD_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送消息 */
    ChatProxy.C2S_CHAT_PUSH = function (type, msg, playerId, msgType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PUSH);
        data.msg = msg;
        data.type = type;
        data.targetPlayerId = playerId;
        data.msgType = unNull(msgType) ? msgType : ChatMsgType.NORMAL;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**私聊列表 */
    ChatProxy.C2S_CHAT_PRIVATE_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取私聊记录 */
    ChatProxy.C2S_CHAT_PRIVATE_RECORD_LIST = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_RECORD_LIST);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**清除私聊列表成员 */
    ChatProxy.C2S_CHAT_PRIVATE_CLEAN = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_CLEAN);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取黑名单 */
    ChatProxy.C2S_CHAT_BLACKLIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_BLACKLIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**添加黑名单 */
    ChatProxy.C2S_CHAT_ADD_BLACKLIST = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_ADD_BLACKLIST);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**删除黑名单 */
    ChatProxy.C2S_CHAT_DEL_BLACKLIST = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_DEL_BLACKLIST);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**举报 */
    ChatProxy.C2S_CHAT_REPORT = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_REPORT);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return ChatProxy;
}(BaseProxy));
