/**聊天频道 */
var ChatType;
(function (ChatType) {
    /**国家 */
    ChatType[ChatType["COUNTRY"] = 1] = "COUNTRY";
    /**联盟 */
    ChatType[ChatType["LEGION"] = 2] = "LEGION";
    /**世界 */
    ChatType[ChatType["WORLD"] = 3] = "WORLD";
    /**私人 */
    ChatType[ChatType["PRIVATE"] = 4] = "PRIVATE";
    /**系统 */
    ChatType[ChatType["SYSTEM"] = 100] = "SYSTEM";
    /**黑名单 */
    ChatType[ChatType["BLCAK"] = 201] = "BLCAK";
})(ChatType || (ChatType = {}));
var ChatMsgType;
(function (ChatMsgType) {
    /**常规信息 */
    ChatMsgType[ChatMsgType["NORMAL"] = 0] = "NORMAL";
    /**邀请工会 */
    ChatMsgType[ChatMsgType["INVITE"] = 1] = "INVITE";
    /**系统 */
    ChatMsgType[ChatMsgType["SYSTEM"] = 2] = "SYSTEM";
})(ChatMsgType || (ChatMsgType = {}));
var ChatModel = /** @class */ (function () {
    function ChatModel() {
    }
    ChatModel.clear = function () {
        this.chatTypeList = null;
        this.chatPriList = null;
        this.chatHeadList = null;
        this.blackList = null;
        this.lastMsgCache = null;
    };
    ChatModel.init = function () {
        var _a;
        //聊天数据
        this.chatTypeList = (_a = {},
            _a[ChatType.LEGION] = [],
            _a[ChatType.COUNTRY] = [],
            _a[ChatType.WORLD] = [],
            _a[ChatType.SYSTEM] = [],
            _a);
        this.lastMsgCache = [null, null];
        //玩家私聊信息
        this.chatPriList = Dictionary.create();
        //玩家私聊头像列表
        this.chatHeadList = Dictionary.create();
        //黑名单列表
        this.blackList = Dictionary.create();
    };
    /**解析聊天数据 */
    ChatModel.pushChatMsg = function (body) {
        this.pushMsg(body.type, body.data, body.targetPlayerId);
    };
    /**解析聊天记录数据 */
    ChatModel.pushChatRecordMsg = function (body) {
        var list = [];
        for (var i = 0; i < body.countryData.length; i++) {
            list.push({ type: ChatType.COUNTRY, data: body.countryData[i] });
        }
        for (var i = 0; i < body.labourUnionData.length; i++) {
            list.push({ type: ChatType.LEGION, data: body.labourUnionData[i] });
        }
        list.sort(function (a, b) {
            return a.data.time - b.data.time;
        });
        for (var i = 0; i < list.length; i++) {
            this.pushMsg(list[i].type, list[i].data);
        }
    };
    /**塞入聊天数据 */
    ChatModel.pushMsg = function (type, data, targetId, msgType) {
        //黑名单过滤
        if (data.headPortrait && this.inBlackList(data.headPortrait.playerId))
            return;
        //私聊信息  链表独立处理 添加消息由私聊队列控制
        if (type == ChatType.PRIVATE) {
            // 第一次收到私聊消息 申请聊天记录
            this.pushPriMsg(targetId, [data]);
        }
        else {
            var list = this.chatTypeList[type];
            var vo = ChatVo.create(type, data);
            list.push(vo);
            while (list.length > ChatModel.MSG_MAX) {
                var tmpVo = list.shift();
                tmpVo.onDestroy();
            }
            this.lastMsgCache.push(vo);
            if (this.lastMsgCache.length > 2)
                this.lastMsgCache.shift();
            com_main.EventMgr.dispatchEvent(ChatEvent.MSG_UPDATE, { channel: type, vo: vo, targetId: targetId });
        }
    };
    /**获得对应频道聊天 */
    ChatModel.getMsgByType = function (type) {
        return this.chatTypeList[type];
    };
    /**请求私聊记录*/
    ChatModel.requestPriMsg = function (playerId) {
        var request = false;
        if (!this.chatPriList.has(playerId)) {
            request = true;
        }
        else {
            var data = this.chatPriList.get(playerId);
            if (!data.record)
                request = true;
        }
        if (request) {
            ChatProxy.C2S_CHAT_PRIVATE_RECORD_LIST(playerId);
        }
    };
    /**塞入个人私聊对象信息 */
    ChatModel.pushPriMsg = function (targetId, datas, record) {
        if (record === void 0) { record = false; }
        for (var i = 0; i < datas.length; i++) {
            var vo = ChatVo.create(ChatType.PRIVATE, datas[i]);
            vo.isRead = record;
            this.addPriInfo(targetId, vo, record);
            //更新私聊头像列表记录时间 和头像信息(排除接收自己发送消息)
            if (vo.headPortrait.playerId != RoleData.playerId) {
                var data = {
                    lastTime: vo.time,
                    headPortrait: vo.headPortrait
                };
                this.updateHead(data);
            }
            //通知消息增加
            com_main.EventMgr.dispatchEvent(ChatEvent.MSG_UPDATE, { channel: ChatType.PRIVATE, vo: vo, targetId: targetId });
        }
    };
    /**添加个人聊天记录 */
    ChatModel.addPriInfo = function (targetId, vo, record) {
        if (!this.chatPriList.has(targetId)) {
            var data_1 = { record: record, datas: [] };
            this.chatPriList.add(targetId, data_1);
        }
        var data = this.chatPriList.get(targetId);
        var list = data.datas;
        list.push(vo);
        while (list.length > ChatModel.MSG_PRI_MAX) {
            var tmpVo = list.shift();
            tmpVo.onDestroy();
        }
    };
    /**获得对应频道聊天 */
    ChatModel.getPriMsgById = function (playerId) {
        if (this.chatPriList.has(playerId)) {
            var data = this.chatPriList.get(playerId);
            return data.datas;
        }
        return [];
    };
    /**清理私聊对象消息 */
    ChatModel.clearPriMsgById = function (playerId) {
        if (this.chatPriList.has(playerId)) {
            var data = this.chatPriList.get(playerId);
            var list = data.datas;
            while (list.length > 0) {
                var vo = list.shift();
                vo.onDestroy();
            }
            this.chatPriList.del(playerId);
            com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_MSG_PRI_CLEAR, playerId);
        }
    };
    /**=====================================================================================
     * 头像列表 begin
     * =====================================================================================
     */
    /**解析私聊头像列表 */
    ChatModel.parseHeadList = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.updateHead(list[i]);
        }
    };
    /**更新私聊头像信息 */
    ChatModel.updateHead = function (body) {
        var playerId = body.headPortrait.playerId;
        if (!this.chatHeadList.has(playerId)) {
            this.chatHeadList.add(playerId, ChatHeadVo.create(body));
            //头像增加刷新
            com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_ADD, playerId);
            //移除超时限定数量头像
            if (this.chatHeadList.count > ChatModel.HEAD_MAX) {
                var tmpId_1;
                var timeMin_1 = 0;
                this.chatHeadList.forEach(function (key, data) {
                    if (data.lastTime > timeMin_1) {
                        tmpId_1 = data.headPortrait.playerId;
                        timeMin_1 = data.lastTime;
                    }
                }, this);
                this.delHead(tmpId_1);
            }
        }
        else {
            var info = this.chatHeadList.get(playerId);
            info.update(body);
            com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_UPDATE, playerId);
        }
    };
    /**删除头像和私聊记录 */
    ChatModel.delHead = function (playerId) {
        var _this = this;
        if (playerId == 0) {
            this.chatHeadList.forEach(function (key, data) {
                data.onDestroy();
                _this.clearPriMsgById(data.headPortrait.playerId);
            }, this);
            this.chatHeadList.clear();
            com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_DEL, null);
        }
        else {
            var data = this.chatHeadList.get(playerId);
            if (data) {
                data.onDestroy();
                this.chatHeadList.del(playerId);
                this.clearPriMsgById(playerId);
                com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_DEL, playerId);
            }
        }
    };
    /**获得私聊头像队列 */
    ChatModel.getPriHeads = function () {
        var res = [];
        this.chatHeadList.forEach(function (key, data) {
            res.push(data);
        }, this);
        return res;
    };
    /**获得私聊头像 */
    ChatModel.getPriHeadById = function (id) {
        return this.chatHeadList.get(id);
    };
    /**=====================================================================================
     * 头像列表 end
     * =====================================================================================
     */
    /**=====================================================================================
     * 黑名单 begin
     * =====================================================================================
     */
    /**塞入黑名单列表 */
    ChatModel.pushBlackList = function (list) {
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            if (!this.blackList.has(data.playerId)) {
                this.blackList.add(data.playerId, data);
                //移除聊天记录
                this.delHead(data.playerId);
                com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_BLACK_LIST_ADD, data.playerId);
            }
        }
    };
    /**获得黑名单数据 */
    ChatModel.getBlackInfo = function (id) {
        return this.blackList.get(id);
    };
    /**获得黑名单数据 */
    ChatModel.inBlackList = function (id) {
        return this.blackList.has(id);
    };
    /**获得黑名单列表数组 */
    ChatModel.delBlackList = function (id) {
        if (this.blackList.has(id)) {
            this.blackList.del(id);
            com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_BLACK_LIST_DEL, id);
        }
    };
    /**获得黑名单列表数组 */
    ChatModel.getBlackList = function () {
        var res = [];
        this.blackList.forEach(function (key, data) {
            res.push(data);
        }, this);
        return res;
    };
    /**黑名单上限 */
    ChatModel.isBlackListMax = function () {
        return this.blackList.count >= ChatModel.BLACK_MAX;
    };
    /**=====================================================================================
     * 黑名单 begin
     * =====================================================================================
     */
    /**=====================================================================================
     * 配置 begin
     * =====================================================================================
     */
    /**频道名称 */
    ChatModel.getChannelName = function (type) {
        switch (type) {
            case ChatType.PRIVATE:
                return GCode(CLEnum.CHAT_PRIVATE);
            case ChatType.LEGION:
                return GCode(CLEnum.CHAT_LEGION);
            case ChatType.COUNTRY:
                return GCode(CLEnum.CHAT_COUNTRY);
            case ChatType.WORLD:
                return GCode(CLEnum.CHAT_WORLD);
            case ChatType.SYSTEM:
                return GCode(CLEnum.CHAT_SYSTEM);
        }
        return '';
    };
    /**时间描述 */
    ChatModel.timeFormat = function (time) {
        if (time == 0)
            return '';
        var dt = TimerUtils.getServerTime() - time;
        var secDay = 24 * 60 * 60;
        if (dt > secDay) {
            var day = Math.floor(dt / secDay);
            return GCodeFromat(CLEnum.ARENA_TIME, day);
        }
        var secHour = 60 * 60;
        if (dt > secHour) {
            var hour = Math.floor(dt / secHour);
            return GCodeFromat(CLEnum.ARENA_TIME1, hour);
        }
        if (dt > 60) {
            var min = Math.floor(dt / 60);
            return GCodeFromat(CLEnum.ARENA_TIME2, min);
        }
        return GCode(CLEnum.CHAT_MSG_TIME);
    };
    /**=====================================================================================
     * 配置 end
     * =====================================================================================
     */
    /**获得私聊红点 */
    ChatModel.getRedState = function (playerId) {
        var _this = this;
        if (!playerId) {
            var res_1 = 0;
            this.chatPriList.forEach(function (key, data) {
                if (_this.getRedStateById(key) > 0) {
                    res_1 = 1;
                    return 'break';
                }
            });
            return res_1;
        }
        else {
            return this.getRedStateById(playerId);
        }
    };
    /**获得私聊红点 */
    ChatModel.getRedStateById = function (playerId) {
        if (this.chatPriList.has(playerId)) {
            var list = this.getPriMsgById(playerId);
            for (var i = 0; i < list.length; i++) {
                if (!list[i].isRead)
                    return 1;
            }
        }
        return 0;
    };
    /**获得邀请工会消息结构 */
    ChatModel.parseInviteMsg = function (msg, info) {
        if (info.playerId == RoleData.playerId) {
            return GCodeFromat(CLEnum.CHAT_MSG_INVATE, msg, info.labourUnionName);
        }
        else {
            return GCodeFromat(CLEnum.CHAT_MSG_INVATE2, info.playerName, info.labourUnionName);
        }
    };
    /**获得系统消息结构 */
    ChatModel.sendSystemMsg = function (msg, chatType) {
        var data = {
            headPortrait: null,
            msgType: ChatMsgType.SYSTEM,
            time: TimerUtils.getServerTime(),
            msg: msg
        };
        this.pushMsg(chatType, data);
    };
    ChatModel.MSG_MAX = 50; /**频道消息上限 */
    ChatModel.MSG_PRI_MAX = 30; /**私聊信息上限 */
    ChatModel.HEAD_MAX = 20; /**私聊列表上限 */
    ChatModel.BLACK_MAX = 30; /**黑名单上限 */
    ChatModel.MSG_CHAT_MAX = 50; /**聊天内容长度限制 */
    return ChatModel;
}());
