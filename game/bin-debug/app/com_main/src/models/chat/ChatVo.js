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
/**聊天数据结构 */
var ChatVo = /** @class */ (function (_super_1) {
    __extends(ChatVo, _super_1);
    function ChatVo(type, body) {
        var _this = _super_1.call(this) || this;
        _this.init(type, body);
        return _this;
    }
    ChatVo.create = function (type, body) {
        var obj = ObjectPool.pop(ChatVo, 'ChatVo', type, body);
        return obj;
    };
    ChatVo.prototype.init = function (type, body) {
        this.type = type;
        this.m_bIsRead = false;
        this.parseKeys(body);
        this.setOwnerMsgState();
    };
    ChatVo.prototype.onDestroy = function () {
        ObjectPool.push(this);
    };
    /**更新数据 */
    ChatVo.prototype.update = function (body) {
        this.parseKeys(body);
        this.msg = this.msg.replace(/(\\)/g, '');
    };
    /**解析服务器协议 */
    ChatVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, ChatVo.AttriKey);
        if (this.msgType == ChatMsgType.INVITE) {
            this.msg = ChatModel.parseInviteMsg(this.msg, this.headPortrait);
        }
    };
    Object.defineProperty(ChatVo.prototype, "isRead", {
        /**消息发送者id */
        get: function () {
            return this.m_bIsRead;
        },
        /**消息发送者id */
        set: function (val) {
            if (this.m_bIsRead == val)
                return;
            this.m_bIsRead = val;
            com_main.EventMgr.dispatchEvent(ChatEvent.MSG_STATE_UPDATE, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatVo.prototype, "playerId", {
        /**消息发送者id */
        get: function () {
            return this.headPortrait ? this.headPortrait.playerId : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatVo.prototype, "playerName", {
        /**消息发送者id */
        get: function () {
            return this.headPortrait.playerName;
        },
        enumerable: true,
        configurable: true
    });
    /**消息发送者标题 */
    ChatVo.prototype.getTitle = function (type) {
        if (type == ChatType.WORLD) {
            return this.headPortrait.playerName;
        }
        if (type == ChatType.LEGION) {
            return "\u3010" + LegionModel.getPosNameById(this.headPortrait.playerId) + "\u3011" + this.headPortrait.playerName;
        }
        if (this.hasLegion())
            return "\u3010" + this.headPortrait.labourUnionName + "\u3011" + this.headPortrait.playerName;
        return this.headPortrait.playerName;
    };
    Object.defineProperty(ChatVo.prototype, "stateId", {
        /**消息发送者国家 */
        get: function () {
            return this.headPortrait.countryId;
        },
        enumerable: true,
        configurable: true
    });
    /**消息发送者时间描述 */
    ChatVo.prototype.getTimeFormat = function () {
        return ChatModel.timeFormat(this.time);
    };
    /**是否是自己发送消息 */
    ChatVo.prototype.setOwnerMsgState = function () {
        if (!this.headPortrait)
            return;
        this.isOwnerMsg = this.headPortrait.playerId == RoleData.playerId;
    };
    /**是否有工会 */
    ChatVo.prototype.hasLegion = function () {
        return this.headPortrait.labourUnionId > 0;
    };
    /**属性值 */
    ChatVo.AttriKey = ["headPortrait", "msg", "time", "msgType"];
    return ChatVo;
}(egret.HashObject));
