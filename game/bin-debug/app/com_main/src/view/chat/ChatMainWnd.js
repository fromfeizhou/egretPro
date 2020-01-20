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
    var ChatMainWnd = /** @class */ (function (_super_1) {
        __extends(ChatMainWnd, _super_1);
        function ChatMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tags = [ChatType.SYSTEM, ChatType.WORLD, ChatType.COUNTRY, ChatType.LEGION, ChatType.PRIVATE, ChatType.BLCAK]; //下标栏
            _this.name = ChatMainWnd.NAME;
            _this.m_tParam = param;
            _this.initApp("ChatSkin/ChatMainWndSkin.exml"); //FIX
            return _this;
        }
        ChatMainWnd.prototype.onDestroy = function () {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_pFaceRoot);
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.CHAT]);
        };
        ChatMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CHAT_TITLE));
            this.m_MainTopNew.setResources([PropEnum.CHAT_ITEM]);
            this.m_btnSend.setTitleLabel(GCode(CLEnum.CHAT_SEND));
            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.CHAT_SYSTEM),
                GCode(CLEnum.CHAT_TAB_SJ),
                GCode(CLEnum.CHAT_TAB_GJ),
                GCode(CLEnum.CHAT_TAB_LM),
                GCode(CLEnum.CHAT_TAB_SL),
                GCode(CLEnum.CHAT_TAB_HMD)
            ]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            this.m_tViews = [
                new com_main.ChatMsgSysyemView(ChatType.SYSTEM, width, height),
                new com_main.ChatMsgWorldView(ChatType.WORLD, width, height),
                new com_main.ChatMsgStateView(ChatType.COUNTRY, width, height),
                new com_main.ChatMsgLegView(ChatType.LEGION, width, height),
                new com_main.ChatMsgPriView(ChatType.PRIVATE, width, height),
                new com_main.ChatMsgBlackView(ChatType.PRIVATE, width, height)
            ];
            for (var i = 0; i < this.m_tViews.length; i++) {
                this.m_tabViewStack.addChild(this.m_tViews[i]);
            }
            this.changeParam(this.m_tParam);
            this.addEvent();
            this.m_bDefMsg = true;
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.CHAT_TAB_SL)), { x: 132, y: -5 }, [RedEvtType.CHAT], 2, { playerId: 0 });
        };
        /**根据外部传递参数切卡 */
        ChatMainWnd.prototype.changeParam = function (param) {
            this.m_nChatType = param ? param.type : ChatType.WORLD;
            // //系统消息塞入世界频道
            // if (this.m_nChatType == ChatType.SYSTEM) this.m_nChatType = ChatType.WORLD;
            this.m_tParam = param;
            for (var i = 0; i < this.m_tViews.length; i++) {
                if (this.m_tViews[i].chatType == this.m_nChatType) {
                    this.changeTag(i);
                    break;
                }
            }
        };
        ChatMainWnd.prototype.changeTag = function (selIndex) {
            this.initView(selIndex);
        };
        ChatMainWnd.prototype.initView = function (index) {
            for (var i = 0; i < this.m_tViews.length; i++) {
                if (i != index)
                    this.m_tViews[i].onHide();
            }
            this.m_nChatType = this.m_tags[index];
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            var view = this.m_tViews[index];
            if (this.m_nChatType == ChatType.PRIVATE) {
                this.m_tViews[index].setTargetInfo(this.m_tParam);
                this.m_tParam = null;
            }
            if (view)
                view.onShow();
        };
        /**改变tips显示 */
        ChatMainWnd.prototype.changeTipsView = function (param) {
            if (param.isShow) {
                this.m_pWordRoot.visible = false;
                this.m_pTipsRoot.visible = true;
                this.m_labTips.text = param.tips;
            }
            else {
                this.m_pWordRoot.visible = true;
                this.m_pTipsRoot.visible = false;
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ChatMainWnd.prototype.addEvent = function () {
            //发送消息
            com_main.EventManager.addTouchScaleListener(this.m_btnSend, this, this.onBtnSendClick);
            //表情开关
            com_main.EventManager.addTouchScaleListener(this.m_btnFace, this, this.onBtnFaceClick);
            com_main.EventManager.addEventListener(this.m_labInput, egret.TouchEvent.TOUCH_TAP, this, this.onInputTouch);
            for (var i = 0; i < this.m_pFaces.numChildren; i++) {
                var object = this.m_pFaces.getChildAt(i);
                com_main.EventManager.addTouchScaleListener(object, this, this.OnFacesBtnSelect);
            }
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
        };
        ChatMainWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListener(this.m_labInput);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
        };
        /**表情选中 */
        ChatMainWnd.prototype.OnFacesBtnSelect = function (e) {
            this.onInputTouch();
            this.m_labInput.text = this.m_labInput.text + '#' + e.target.name;
            this.m_pFaceRoot.visible = false;
        };
        /**面板点击 */
        ChatMainWnd.prototype.onPanelClick = function (e) {
            if (!this.m_pFaceRoot.visible)
                return;
            var point = this.m_pFaceRoot.parent.globalToLocal(e.stageX, e.stageY);
            var rect;
            rect = new egret.Rectangle(this.m_pFaceRoot.x, this.m_pFaceRoot.y, this.m_pFaceRoot.width, this.m_pFaceRoot.height);
            if (!rect.containsPoint(point)) {
                this.m_pFaceRoot.visible = false;
            }
            egret.Rectangle.release(rect);
            e.stopImmediatePropagation();
        };
        /**表情开关 */
        ChatMainWnd.prototype.onBtnFaceClick = function (e) {
            e.stopImmediatePropagation();
            egret.Tween.removeTweens(this.m_pFaceRoot);
            if (!this.m_pFaceRoot.visible) {
                this.m_pFaceRoot.visible = true;
                this.m_pFaceRoot.alpha = 0;
                egret.Tween.get(this.m_pFaceRoot).to({ alpha: 1 }, 200);
            }
            else {
                this.m_pFaceRoot.alpha = 1;
                egret.Tween.get(this.m_pFaceRoot).to({ alpha: 0 }, 200).call(function () {
                    this.m_pFaceRoot.visible = false;
                }, this);
            }
        };
        /**发送内容 */
        ChatMainWnd.prototype.onBtnSendClick = function () {
            if (this.m_bDefMsg) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_INPUT_TIPS), 1, true);
                return;
            }
            var view = this.m_tViews[this.m_comTabGroup.selectedIndex];
            if (view) {
                var res = view.sendChannelMsg(this.m_labInput.text);
                if (res)
                    this.m_labInput.text = "";
            }
        };
        /**文本点击 */
        ChatMainWnd.prototype.onInputTouch = function () {
            if (!this.m_bDefMsg)
                return;
            this.m_bDefMsg = false;
            this.m_labInput.text = "";
            this.m_labInput.textColor = 0xfffddd;
            this.m_labInput.bold = false;
        };
        ChatMainWnd.NAME = 'ChatMainWnd';
        return ChatMainWnd;
    }(com_main.CView));
    com_main.ChatMainWnd = ChatMainWnd;
})(com_main || (com_main = {}));
