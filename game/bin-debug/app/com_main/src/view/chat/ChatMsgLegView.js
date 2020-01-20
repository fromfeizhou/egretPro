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
    var ChatMsgLegView = /** @class */ (function (_super_1) {
        __extends(ChatMsgLegView, _super_1);
        function ChatMsgLegView(type, width, height) {
            return _super_1.call(this, type, width, height, Utils.getAppSkin("ChatSkin/ChatMsgLegViewSkin.exml")) || this;
        }
        ChatMsgLegView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ChatMsgLegView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ChatMsgLegView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnLegion.setTitleLabel(GCode(CLEnum.CHAT_LEGION_GO));
            this.refreshLegionView();
        };
        /**显示当前切卡行为 */
        ChatMsgLegView.prototype.onShow = function () {
            if (LegionModel.getGuildId() == (0)) {
                Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips: GCode(CLEnum.CHAT_LEGION_FAIL) });
            }
            else {
                Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: false });
            }
            _super_1.prototype.onShow.call(this);
        };
        /**刷新联盟显示 */
        ChatMsgLegView.prototype.refreshLegionView = function () {
            if (LegionModel.getGuildId() == (0)) {
                this.m_pMsgRoot.visible = false;
                this.m_pLegionRoot.visible = true;
            }
            else {
                this.m_pMsgRoot.visible = true;
                this.m_pLegionRoot.visible = false;
            }
        };
        /**发送消息(子类重写) */
        ChatMsgLegView.prototype.sendChannelMsg = function (msg) {
            if (LegionModel.getGuildId() == (0)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LEGION_FAIL2), 1, true);
                return;
            }
            return _super_1.prototype.sendChannelMsg.call(this, msg);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMsgLegView.prototype.addEvent = function () {
            _super_1.prototype.addEvent.call(this);
            com_main.EventMgr.addEvent(LegionEvent.LEGION_INFO_CHANGE, this.changeLegion, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnLegion, this, this.onBtnLegion);
        };
        ChatMsgLegView.prototype.removeEvent = function () {
            _super_1.prototype.removeEvent.call(this);
            com_main.EventMgr.removeEventByObject(LegionEvent.LEGION_INFO_CHANGE, this);
        };
        /**联盟变更回调 */
        ChatMsgLegView.prototype.changeLegion = function () {
            this.refreshLegionView();
        };
        /**按钮点击 */
        ChatMsgLegView.prototype.onBtnLegion = function () {
            FunctionModel.openFunctionByType(FunctionType.GUILD);
        };
        ChatMsgLegView.NAME = 'ChatMsgLegView';
        return ChatMsgLegView;
    }(com_main.ChatMsgView));
    com_main.ChatMsgLegView = ChatMsgLegView;
})(com_main || (com_main = {}));
