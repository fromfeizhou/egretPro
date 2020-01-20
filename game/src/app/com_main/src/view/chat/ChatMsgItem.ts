module com_main {
    export interface IChatMsgItemRD {
        type: ChatType,
        width: number,
        data: ChatVo
    }
    export class ChatMsgItem extends eui.ItemRenderer {
        public static NAME = 'ChatMsgRoleItem';

        public m_comHead: com_main.ComHeadItem;
        public m_pMsgRoot: eui.Group;
        public m_imgMsgBg: eui.Image;
        public m_labMsg: eui.Label;
        public m_pTitleRoot: eui.Group;
        public m_comState: com_main.ComState;
        public m_labTitle: eui.Label;
        public m_labSpace: eui.Label;
        public m_labTime: eui.Label;

        private m_labRichMsg: CCRichText = null;  //聊天内容
        private m_nState: number;    //左右系统
        private m_tData: IChatMsgItemRD;
        private m_bInit: boolean;    //第一次初始化ui

        public constructor() {
            super();
            this.name = ChatMsgItem.NAME;
            this.skinName = Utils.getAppSkin("ChatSkin/ChatMsgItemSkin.exml");
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            Utils.removeFromParent(this.m_labRichMsg);
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            if (this.m_labRichMsg == null) {
                this.m_labRichMsg = new CCRichText(this.m_labMsg);

                this.m_pMsgRoot.addChild(this.m_labRichMsg);
                this.m_labRichMsg.imageScale = 0.7;  //TODO
            }
            this.addEvent();
        }

        /**设置info */
        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            let chatMsg = this.m_tData.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.m_labRichMsg.setLabelLineWidth(this.m_tData.width - 230);
                this.width = this.m_tData.width;
            }

            if (!this.m_tData) return;

            if (chatMsg.msgType == ChatMsgType.SYSTEM) {
                this.changeState(2);
                this.commitProperties();
                this.m_labRichMsg.text = `<font color = 0xffff00>【${GCode(CLEnum.CHAT_SYSTEM)}】</font>${chatMsg.msg}`;
            } else {
                let state = chatMsg.isOwnerMsg ? 1 : 0;
                this.changeState(state);
                let headInfo = chatMsg.headPortrait;
                this.m_comHead.info = headInfo;

                //标题
                this.m_comState.stateId = chatMsg.stateId;
                this.m_labTitle.text = chatMsg.getTitle(this.m_tData.type);
                this.m_labTime.text = chatMsg.getTimeFormat();
                if (chatMsg.msgType == ChatMsgType.INVITE && headInfo.playerId != RoleData.playerId) {
                    let evt = `${MsgRule.EVT_INVITE},${headInfo.labourUnionId},${headInfo.labourUnionName}`
                    this.m_labRichMsg.text = chatMsg.msg + `<imgLink=${evt}>FChat_ghyq_png</imgLink>`;
                } else {
                    this.m_labRichMsg.text = ChatUtils.ConvertFaceStr(chatMsg.msg);
                }
            }


            egret.callLater(() => {
                if (this.m_imgMsgBg && this.m_labRichMsg && this.m_labRichMsg.isInit) {
                    this.m_imgMsgBg.width = this.m_labRichMsg.textWidth + 30;
                    this.m_imgMsgBg.height = this.m_labRichMsg.textHeight + 20;
                }
            }, this);

        }

        /**更改皮肤 */
        private changeState(val: number) {
            if (this.m_nState == val) return;
            this.m_nState = val;
            switch (this.m_nState) {
                case 0: {
                    this.currentState = 'left';
                    this.m_labRichMsg.left = 0;
                    this.m_labRichMsg.right = NaN;
                    this.changeTitleObjects();
                    break;
                }
                case 1: {
                    this.currentState = 'right'
                    this.m_labRichMsg.right = 0;
                    this.m_labRichMsg.left = NaN;
                    this.changeTitleObjects();
                    break;
                }
                case 2: {
                    this.currentState = 'system'
                    this.m_labRichMsg.left = 0;
                    this.m_labRichMsg.right = NaN;
                    break;
                }
            }
            this.commitProperties();
        }

        /**改变标题顺序 */
        private changeTitleObjects() {
            let list = ['m_comState', 'm_labTitle', 'm_labSpace', 'm_labTime'];
            if (this.m_nState == 1) list.reverse();
            for (let i = 0; i < list.length; i++) {
                let item: egret.DisplayObject = this[list[i]];
                this.m_pTitleRoot.setChildIndex(item, i);
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private addEvent() {
            this.m_labRichMsg.addEventListener(RichTextEvent.Link, this.onRichTextEvent, this);
            EventManager.addTouchTapListener(this.m_comHead, this, this.onClickHead);
        }

        private removeEvent() {
            if (this.m_labRichMsg != null) {
                this.m_labRichMsg.removeEventListener(RichTextEvent.Link, this.onRichTextEvent, this);
            }
            EventManager.removeEventListener(this.m_comHead);
        }

        /**头像点击 */
        private onClickHead() {
            if (!this.m_tData || this.m_tData.data.headPortrait.playerId == RoleData.playerId) return;
            NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(this.m_tData.data.headPortrait.playerId);
        }

        /**富文本事件 */
        private onRichTextEvent(evt: RichTextEvent) {
            ChatUtils.HandleItemClick(evt.text)
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}