module com_main {
    export interface IChatWndParm {
        type: ChatType;
        id?: number;
        name?: string;
    }

    export interface IChatTabView extends CComponent {
        m_nType: ChatType;
        chatType: ChatType;
        onShow(): void;
        onHide(): void;
        sendChannelMsg(msg: string, playerId?: number): boolean
    }

    export class ChatMainWnd extends CView {
        public static NAME = 'ChatMainWnd';

        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_tabViewStack: eui.ViewStack;
        public m_pWordRoot: eui.Group;
        public m_labInput: eui.Label;
        public m_btnFace: com_main.CImage;
        public m_btnSend: com_main.ComButton;
        public m_pFaceRoot: eui.Group;
        public m_pFaces: eui.Group;
        public m_pTipsRoot: eui.Group;
        public m_labTips: eui.Label;

        private m_nChatType: ChatType;   //聊天类型
        private m_bDefMsg: boolean;  //聊天栏输入内容
        private m_tags = [ChatType.SYSTEM,ChatType.WORLD, ChatType.COUNTRY, ChatType.LEGION, ChatType.PRIVATE, ChatType.BLCAK];   //下标栏
        private m_tViews: IChatTabView[]; //显示列表

        private m_tParam: IChatWndParm;

        public constructor(param?: IChatWndParm) {
            super();
            this.name = ChatMainWnd.NAME;
            this.m_tParam = param;
            this.initApp("ChatSkin/ChatMainWndSkin.exml"); //FIX
        }

        public onDestroy(): void {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_pFaceRoot);
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.CHAT]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CHAT_TITLE));
            this.m_MainTopNew.setResources([PropEnum.CHAT_ITEM]);
            this.m_btnSend.setTitleLabel(GCode(CLEnum.CHAT_SEND));

            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.CHAT_SYSTEM),
                GCode(CLEnum.CHAT_TAB_SJ),
                GCode(CLEnum.CHAT_TAB_GJ),
                GCode(CLEnum.CHAT_TAB_LM),
                GCode(CLEnum.CHAT_TAB_SL),
                GCode(CLEnum.CHAT_TAB_HMD)]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            this.m_tViews = [
                new ChatMsgSysyemView(ChatType.SYSTEM, width, height),
                new ChatMsgWorldView(ChatType.WORLD, width, height),
                new ChatMsgStateView(ChatType.COUNTRY, width, height),
                new ChatMsgLegView(ChatType.LEGION, width, height),
                new ChatMsgPriView(ChatType.PRIVATE, width, height),
                new ChatMsgBlackView(ChatType.PRIVATE, width, height)
            ];

            for (let i = 0; i < this.m_tViews.length; i++) {
                this.m_tabViewStack.addChild(this.m_tViews[i]);
            }
            this.changeParam(this.m_tParam);

            this.addEvent();
            this.m_bDefMsg = true;

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.CHAT_TAB_SL)), { x: 132, y: -5 }, [RedEvtType.CHAT], 2, { playerId: 0 });
        }

        /**根据外部传递参数切卡 */
        public changeParam(param?: IChatWndParm) {
            this.m_nChatType = param ? param.type : ChatType.WORLD;
            // //系统消息塞入世界频道
            // if (this.m_nChatType == ChatType.SYSTEM) this.m_nChatType = ChatType.WORLD;

            this.m_tParam = param;
            for (let i = 0; i < this.m_tViews.length; i++) {
                if (this.m_tViews[i].chatType == this.m_nChatType) {
                    this.changeTag(i);
                    break;
                }
            }
        }

        private changeTag(selIndex: number) {
            this.initView(selIndex);
        }

        private initView(index: number) {
            for (let i = 0; i < this.m_tViews.length; i++) {
                if (i != index) this.m_tViews[i].onHide();
            }
            this.m_nChatType = this.m_tags[index];
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            let view = this.m_tViews[index];
            if (this.m_nChatType == ChatType.PRIVATE) {
                (<ChatMsgPriView>this.m_tViews[index]).setTargetInfo(this.m_tParam);
                this.m_tParam = null;
            }
            if (view) view.onShow();
        }

        /**改变tips显示 */
        public changeTipsView(param: { isShow: boolean, tips?: string }) {
            if (param.isShow) {
                this.m_pWordRoot.visible = false;
                this.m_pTipsRoot.visible = true;
                this.m_labTips.text = param.tips;
            } else {
                this.m_pWordRoot.visible = true;
                this.m_pTipsRoot.visible = false;
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            //发送消息
            EventManager.addTouchScaleListener(this.m_btnSend, this, this.onBtnSendClick);
            //表情开关
            EventManager.addTouchScaleListener(this.m_btnFace, this, this.onBtnFaceClick);

            EventManager.addEventListener(this.m_labInput, egret.TouchEvent.TOUCH_TAP, this, this.onInputTouch);

            for (let i: number = 0; i < this.m_pFaces.numChildren; i++) {
                let object: any = this.m_pFaces.getChildAt(i);
                EventManager.addTouchScaleListener(object, this, this.OnFacesBtnSelect);
            }

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);

        }

        private removeEvent() {
            EventManager.removeEventListener(this.m_labInput);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
        }

        /**表情选中 */
        private OnFacesBtnSelect(e: egret.Event): void {
            this.onInputTouch();
            this.m_labInput.text = this.m_labInput.text + '#' + e.target.name;
            this.m_pFaceRoot.visible = false;
        }

        /**面板点击 */
        private onPanelClick(e: egret.TouchEvent) {
            if (!this.m_pFaceRoot.visible) return;
            var point: egret.Point = this.m_pFaceRoot.parent.globalToLocal(e.stageX, e.stageY);
            var rect: egret.Rectangle;
            rect = new egret.Rectangle(this.m_pFaceRoot.x, this.m_pFaceRoot.y, this.m_pFaceRoot.width, this.m_pFaceRoot.height);
            if (!rect.containsPoint(point)) {
                this.m_pFaceRoot.visible = false;
            }
            egret.Rectangle.release(rect);
            e.stopImmediatePropagation();
        }

        /**表情开关 */
        private onBtnFaceClick(e: egret.TouchEvent) {
            e.stopImmediatePropagation();

            egret.Tween.removeTweens(this.m_pFaceRoot);
            if (!this.m_pFaceRoot.visible) {
                this.m_pFaceRoot.visible = true;
                this.m_pFaceRoot.alpha = 0;
                egret.Tween.get(this.m_pFaceRoot).to({ alpha: 1 }, 200)
            } else {
                this.m_pFaceRoot.alpha = 1;
                egret.Tween.get(this.m_pFaceRoot).to({ alpha: 0 }, 200).call(function () {
                    this.m_pFaceRoot.visible = false;
                }, this);
            }
        }

        /**发送内容 */
        private onBtnSendClick() {
            if (this.m_bDefMsg) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_INPUT_TIPS), 1, true);
                return;
            }

            let view = this.m_tViews[this.m_comTabGroup.selectedIndex];
            if (view) {
                let res = view.sendChannelMsg(this.m_labInput.text);
                if (res) this.m_labInput.text = "";
            }
        }

        /**文本点击 */
        private onInputTouch(): void {
            if (!this.m_bDefMsg) return;
            this.m_bDefMsg = false;

            this.m_labInput.text = "";
            this.m_labInput.textColor = 0xfffddd;
            this.m_labInput.bold = false;
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}