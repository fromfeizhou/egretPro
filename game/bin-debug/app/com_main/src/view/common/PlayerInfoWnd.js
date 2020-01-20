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
    var PlayerInfoWnd = /** @class */ (function (_super_1) {
        __extends(PlayerInfoWnd, _super_1);
        function PlayerInfoWnd(data) {
            var _this = _super_1.call(this) || this;
            /** 当前擂台列表数据 */
            _this.m_tCollects = new eui.ArrayCollection();
            _this.name = PlayerInfoWnd.NAME;
            _this.initApp("common/player/PlayerInfoWndSkin.exml");
            _this.m_tData = data;
            return _this;
        }
        PlayerInfoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.m_nTimeOutId) {
                egret.clearTimeout(this.m_nTimeOutId);
                this.m_nTimeOutId = null;
            }
            com_main.EventManager.removeEventListeners(this);
        };
        PlayerInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.PLATER_INFO));
            this.m_iconReport.setInfo('btn_122_png', 'lb_lt_jb_png');
            this.m_iconHide.setInfo('btn_123_png', 'lb_lt_pb_png');
            this.m_iconChat.setInfo('btn_124_png', 'lb_lt_sl_png');
            var headInfo = this.m_tData.headPortrait;
            if (headInfo.countryId == RoleData.countryId) {
                if (headInfo.labourUnionId == (0)) {
                    if (LegionModel.getGuildId() > (0)) {
                        var icon = new com_main.ComIcon();
                        icon.setInfo('btn_125_png', 'lb_lt_lmyq_png');
                        this.m_pIconRoot.addChild(icon);
                        com_main.EventManager.addTouchScaleListener(icon.root, this, this.onIconInvite);
                    }
                }
                else {
                    if (LegionModel.getGuildId() == (0)) {
                        var icon = new com_main.ComIcon();
                        icon.setInfo('btn_125_png', 'lb_lt_lmsq_png');
                        this.m_pIconRoot.addChild(icon);
                        com_main.EventManager.addTouchScaleListener(icon.root, this, this.onIconApply);
                    }
                }
            }
            com_main.EventManager.addTouchScaleListener(this.m_iconReport.root, this, this.onIconReport);
            com_main.EventManager.addTouchScaleListener(this.m_iconHide.root, this, this.onIconHide);
            com_main.EventManager.addTouchScaleListener(this.m_iconChat.root, this, this.onIconChat);
            this.initview();
        };
        /**联盟邀请 */
        PlayerInfoWnd.prototype.onIconInvite = function () {
            var _this = this;
            if (this.m_bSendCd) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_INVATE_FAL), 1, true);
            }
            if (LegionModel.getGuildId() > 0) {
                ChatProxy.C2S_CHAT_PUSH(ChatType.PRIVATE, this.m_tData.headPortrait.playerName, this.m_tData.headPortrait.playerId, ChatMsgType.INVITE);
                this.m_bSendCd = true;
                this.m_nTimeOutId = egret.setTimeout(function () {
                    _this.m_bSendCd = false;
                    _this.m_nTimeOutId = null;
                }, this, 5000);
            }
        };
        /**联盟申请 */
        PlayerInfoWnd.prototype.onIconApply = function () {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GUILD)) {
                LegionProxy.send_APPLY_JOIN_GUILD(this.m_tData.headPortrait.labourUnionId);
            }
        };
        /**屏蔽 */
        PlayerInfoWnd.prototype.onIconHide = function () {
            if (ChatModel.inBlackList(this.m_tData.headPortrait.playerId)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND3), 1, true);
                return;
            }
            if (ChatModel.isBlackListMax()) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_BLACK_FUL), 1, true);
                return;
            }
            ChatProxy.C2S_CHAT_ADD_BLACKLIST(this.m_tData.headPortrait.playerId);
        };
        /**私聊 */
        PlayerInfoWnd.prototype.onIconChat = function () {
            com_main.UpManager.history();
            var param = { type: ChatType.PRIVATE, id: this.m_tData.headPortrait.playerId, name: this.m_tData.headPortrait.playerName };
            Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
        };
        /**举报 */
        PlayerInfoWnd.prototype.onIconReport = function () {
            ChatProxy.C2S_CHAT_REPORT(this.m_tData.headPortrait.playerId);
        };
        PlayerInfoWnd.prototype.initview = function () {
            if (!this.m_tData)
                return;
            var info = this.m_tData.headPortrait;
            this.m_labName.text = info.playerName;
            this.m_labLevel.text = this.m_tData.level.toString();
            this.m_labFight.text = '' + this.m_tData.fight;
            if (info.labourUnionId > (0)) {
                this.m_labGuildName.text = info.labourUnionName;
                this.m_labGuildPos.text = LegionModel.getPosName(this.m_tData.labourUnionOfficial);
            }
            else {
                this.m_labGuildName.text = GCode(CLEnum.NONE);
                this.m_labGuildPos.text = GCode(CLEnum.NONE);
            }
            this.m_comState.stateId = info.countryId;
            this.m_comHead.info = info;
            var otherTeamData = TeamModel.getOtherTeamData();
            this.m_tCollects = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_tCollects;
            this.m_ItemList.itemRenderer = PlayerInfoWndCell;
            if (otherTeamData.length > 0) {
                this.initTeamGenalItems(otherTeamData);
                this.m_title.text = "部队阵容";
            }
            else {
                this.m_title.text = "最强阵容";
                this.initGeneralItems();
            }
        };
        /**如果是世界里面查看是显示部队列表 */
        PlayerInfoWnd.prototype.initTeamGenalItems = function (otherTeamData) {
            var teamArr = otherTeamData.slice(0); //备份
            this.m_tCollects.replaceAll(teamArr);
            //重置列表
            TeamModel.resetOtherTeamData();
        };
        /**武将列表 */
        PlayerInfoWnd.prototype.initGeneralItems = function () {
            var res = [];
            for (var i = 0; i < this.m_tData.generalWinInfo.length; i++) {
                var data = this.m_tData.generalWinInfo[i];
                var info = { generalId: data.generalId, level: data.level, star: data.star };
                res.push(info);
            }
            this.m_tCollects.replaceAll(res);
        };
        PlayerInfoWnd.NAME = 'PlayerInfoWnd';
        return PlayerInfoWnd;
    }(com_main.CView));
    com_main.PlayerInfoWnd = PlayerInfoWnd;
    ;
    var PlayerInfoWndCell = /** @class */ (function (_super_1) {
        __extends(PlayerInfoWndCell, _super_1);
        function PlayerInfoWndCell() {
            return _super_1.call(this) || this;
        }
        PlayerInfoWndCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_genHead = com_main.GeneralHeadRender.create('arena_name');
            this.addChild(this.m_genHead);
        };
        PlayerInfoWndCell.prototype.$onRemoveFromStage = function () {
            this.m_genHead.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PlayerInfoWndCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            this.m_genHead.setGenViewInfo(this.m_tData.generalId, this.m_tData.level, this.m_tData.star);
        };
        return PlayerInfoWndCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
