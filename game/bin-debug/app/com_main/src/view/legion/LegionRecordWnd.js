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
    var LegionRecordWnd = /** @class */ (function (_super_1) {
        __extends(LegionRecordWnd, _super_1);
        function LegionRecordWnd(mata) {
            var _this = _super_1.call(this) || this;
            _this.m_num = [0, 0, 0, 0, 0];
            _this.m_numMax = [1, 2, 4, 5, 50];
            _this.m_data = null;
            _this.m_max = 35;
            _this.m_curPag = 0;
            _this.m_totalPage = 2;
            _this.name = LegionRecordWnd.NAME;
            _this.initApp("legion/LegionRecordWndSkin.exml");
            // this.skinName = Utils.getSkinName("app/legion/LegionRecordWndSkin.exml");
            _this.m_data = mata;
            return _this;
        }
        LegionRecordWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GUILD_INFORMATION
            ];
        };
        LegionRecordWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GUILD_INFORMATION: { //联盟标志设置5008
                    if (body) {
                        var info = body.information;
                        this.m_curPag = body.page; //分页
                        this.m_totalPage = body.totalPage; //总页数
                        this.initScroller(info);
                    }
                    break;
                }
            }
        };
        LegionRecordWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.initScroller();
            this.m_PopUp.setBottomBorder();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_MSG));
            this.m_Scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onScrollEnd, this);
            this.requestPage();
        };
        LegionRecordWnd.prototype.onScrollEnd = function () {
            // this.m_scrollV = this.m_Scroller.viewport.scrollV;
            // console.log('scrollv = ',this.m_scrollV);
            if (this.m_Scroller && (this.m_Scroller.viewport.scrollV + this.m_Scroller.height) >= this.m_Scroller.viewport.contentHeight) {
                this.requestPage();
            }
        };
        LegionRecordWnd.prototype.onclose = function () {
            com_main.UpManager.history();
        };
        LegionRecordWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.m_Scroller.removeEventListener(eui.UIEvent.CHANGE_END, this.onScrollEnd, this);
        };
        LegionRecordWnd.prototype.requestPage = function () {
            if (this.m_curPag == 0 || this.m_curPag < this.m_totalPage) {
                LegionProxy.send_GUILD_INFORMATION(LegionModel.getGuildId(), this.m_curPag + 1);
            }
        };
        LegionRecordWnd.prototype.initScroller = function (body) {
            var list = [];
            for (var i = 0; i < body.length; i++) {
                var info = body[i];
                var type = info.type;
                var str = this.getTextByType(info);
                list.push({ str: str, msgTime: info.msgTime });
            }
            list.sort(this.sortMsgTime);
            if (this.m_DataArray == null) {
                this.m_DataArray = new eui.ArrayCollection(list);
            }
            else {
                // this.m_DataArray.replaceAll(list);
                for (var i = 0; i < list.length; i++) {
                    this.m_DataArray.addItem(list);
                }
            }
            this.m_ItemList.dataProvider = this.m_DataArray;
            this.m_ItemList.itemRenderer = LegionRecordCell;
        };
        //da ->xiao 
        LegionRecordWnd.prototype.sortMsgTime = function (a, b) {
            return Utils.SortByProps(a, b, { "msgTime": "down" });
        };
        LegionRecordWnd.prototype.getTextByType = function (info) {
            var type = info.type;
            var time = TimerUtils.dateFormat("yyyy-MM-dd hh:mm:ss ", info.msgTime / 1000);
            switch (type) {
                case GuildInformationType.CREATE_GUILD:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_CREATE, time, info.guildName));
                case GuildInformationType.JOIN_GUILD:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_JION, time, info.playerName));
                case GuildInformationType.LEAVE_GUILD:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_LEAVE, time, info.playerName));
                case GuildInformationType.KICK_OUT_FROM_GUILD:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_KICK, time, info.playerName, info.positionName, info.positionPlayerName));
                case GuildInformationType.APPOINT_POSITION:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_RM, time, info.playerName, info.positionName));
                case GuildInformationType.CHANGE_GUILD_LEADER:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_NEW, time, info.playerName, info.positionName));
                case GuildInformationType.CHANGE_NAME:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_CHANGE, time, info.playerName, info.guildName));
                case GuildInformationType.APPLY_GUILD_LEADER:
                    return Utils.htmlParser(GCodeFromat(CLEnum.GUILD_MSG_APPLY, time, info.playerName, info.guildName));
            }
            return [];
        };
        LegionRecordWnd.NAME = 'LegionRecordWnd';
        return LegionRecordWnd;
    }(com_main.CView));
    com_main.LegionRecordWnd = LegionRecordWnd;
    var LegionRecordCell = /** @class */ (function (_super_1) {
        __extends(LegionRecordCell, _super_1);
        function LegionRecordCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            return _this;
        }
        LegionRecordCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        LegionRecordCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionRecordCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                this.m_Name.textFlow = this.data.str;
            }
        };
        return LegionRecordCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
