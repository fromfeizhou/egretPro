module com_main {
    export class ChatMsgPriView extends ChatMsgView {
        public static NAME = 'ChatMsgPriView';

        public m_labPlayerNum: eui.Label;
        public m_btnClear: eui.Group;
        public m_listPlayer: eui.List;
        public m_labTarget: eui.Label;

        private m_tHeadCollection: eui.ArrayCollection;
        private m_nTargetId: number;
        private m_sTargetName: string;
        private m_nCurIndex: number;

        public constructor(type: ChatType, width: number, height: number) {
            super(type, width, height, Utils.getAppSkin("ChatSkin/ChatMsgPriViewSkin.exml"));
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_tHeadCollection = new eui.ArrayCollection();
            this.m_listPlayer.itemRenderer = ChatPrivateCell;
            this.m_listPlayer.dataProvider = this.m_tHeadCollection;
            this.refreshHeads();

            this.m_nTargetId = null;
            this.m_sTargetName = '';
            this.m_nCurIndex = -1;
        }

        /**刷新聊天对象数组 */
        private refreshHeads() {
            let list = ChatModel.getPriHeads();
            let res: ChatCellRD[] = [];
            for (let i = 0; i < list.length; i++) {
                let info = list[i];
                res.push({ selected: false, vo: info });
            }
            res.sort((a, b) => {
                return b.vo.lastTime - a.vo.lastTime;
            });
            this.m_tHeadCollection.replaceAll(res);
            this.refreshPlayerNum();
        }

        /**发送消息(子类重写) */
        public sendChannelMsg(msg: string) {
            if (!this.m_nTargetId) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_PRI_FAL), 1, true);
                return;
            }
            return super.sendChannelMsg(msg, this.m_nTargetId);
        }

        /**聊天间隔 */
        protected get coldTime(): number {
            return 1000;
        }

        /** 频道消息过滤 */
        protected isChannelMsg(channel: ChatType, targetId?: number): boolean {
            if (channel == this.m_nType) {
                if (this.m_nTargetId && this.m_nTargetId == (targetId)) return true;
            }
            return false;
        }

        /**聊天数据 */
        protected getItemList() {
            if (this.m_nTargetId) {
                return ChatModel.getPriMsgById(this.m_nTargetId);
            }
            return [];
        }

        /**=====================================================================================
		 * 分割线 
		 * =====================================================================================
		 */
        /**设置当前聊天对象 */
        public setTargetInfo(param?: IChatWndParm) {
            if (param) {
                this.m_nTargetId = param.id;
                this.m_sTargetName = param.name;
            }

            let index = this.getStartIndex();
            this.changeSelIndex(index);
        }

        /**根据id获得下标 */
        private getStartIndex() {
            if (this.m_nTargetId) {
                for (let i = 0; i < this.m_tHeadCollection.source.length; i++) {
                    let item: ChatCellRD = this.m_tHeadCollection.getItemAt(i);
                    if (item && item.vo.headPortrait.playerId == (this.m_nTargetId)) return i;
                }
                return -1;
            }

            return this.m_tHeadCollection.source.length > 0 ? 0 : -1;
        }

        /**刷新聊天人数 */
        private refreshPlayerNum() {
            this.m_labPlayerNum.text = this.m_tHeadCollection.source.length.toString();
        }

        /**刷新标题目标 */
        private refrehTargetTips() {
            this.m_labTarget.textFlow = this.m_sTargetName == '' ? [] : Utils.htmlParser(GCodeFromat(CLEnum.CHAT_PRI_TO, this.m_sTargetName));
        }

        /**刷新当前聊天目标 */
        private changeSelIndex(index: number) {
            //没有私聊头像 目标 显示对白名字
            if (index >= this.m_tHeadCollection.length || index == -1) {
                this.m_nCurIndex = -1;
                this.refrehTargetTips();
                return;
            }
            if (this.m_nCurIndex == index) return;
            let preIndex = this.m_nCurIndex;
            let data: ChatCellRD = this.m_tHeadCollection.getItemAt(preIndex);
            if (data) {
                data.selected = false;
                this.m_tHeadCollection.replaceItemAt(data, preIndex);
            }
            this.m_nCurIndex = index;
            data = this.m_tHeadCollection.getItemAt(index);
            data.selected = true;
            this.m_tHeadCollection.replaceItemAt(data, index);
            this.m_nTargetId = data.vo.headPortrait.playerId;
            this.m_sTargetName = data.vo.headPortrait.playerName;

            this.initItemData(true);

            if (this.m_nTargetId) {
                ChatModel.requestPriMsg(this.m_nTargetId);
            }
            this.refrehTargetTips()
        }



        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        protected addEvent() {
            super.addEvent()
            EventManager.addTouchScaleListener(this.m_btnClear, this, this.onBtnClear);

            EventMgr.addEvent(ChatEvent.CHAT_HEAD_ADD, this.onHeadUpdateAdd, this);
            EventMgr.addEvent(ChatEvent.CHAT_HEAD_DEL, this.onHeadUpdateDel, this);
            EventMgr.addEvent(ChatEvent.CHAT_HEAD_UPDATE, this.onHeadUpdate, this);
            EventMgr.addEvent(ChatEvent.CHAT_MSG_PRI_CLEAR, this.onChatMsgClear, this);
            this.m_listPlayer.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onPlayerHandler, this);
        }

        protected removeEvent() {
            super.removeEvent();
            EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_ADD, this);
            EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_DEL, this);
            EventMgr.removeEventByObject(ChatEvent.CHAT_HEAD_UPDATE, this);
            EventMgr.removeEventByObject(ChatEvent.CHAT_MSG_PRI_CLEAR, this);
            this.m_listPlayer.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onPlayerHandler, this);
        }

        /**私聊对象消息清理*/
        private onChatMsgClear(playerId: number) {
            if (this.m_nTargetId && playerId == (this.m_nTargetId)) {
                this.m_tCollection.removeAll();
            }
        }

        /**清理全部消息 */
        private onBtnClear() {
            if (this.m_tHeadCollection.source.length > 0) {
                ChatProxy.C2S_CHAT_PRIVATE_CLEAN(0);
            }
        }


        /**头像增加 */
        private onHeadUpdateAdd(playerId: number) {
            let vo = ChatModel.getPriHeadById(playerId);
            if (!vo) return;
            let item: ChatCellRD = { selected: false, vo: vo };
            this.m_tHeadCollection.addItem(item);
            this.setTargetInfo({id:vo.headPortrait.playerId,name:vo.headPortrait.playerName,type:ChatType.PRIVATE});
            this.refreshPlayerNum();
            this.onHeadUpdate();


            if (!this.onShow) return;
            //增加第一个头像  而且没有指定聊天对象
            if (this.m_tHeadCollection.length == 1 && !this.m_nTargetId) {
                this.changeSelIndex(0)
            }
        }

        /**头像减少 */
        private onHeadUpdateDel(playerId: number) {
            if (playerId && !(this.m_tHeadCollection.source.length == 1)) {
                let delIndex = this.m_tHeadCollection.source.length;
                for (let i = 0; i < this.m_tHeadCollection.source.length; i++) {
                    let item: ChatCellRD = this.m_tHeadCollection.getItemAt(i);
                    if (playerId == (item.vo.headPortrait.playerId)) {
                        this.m_tHeadCollection.removeItemAt(i);
                        delIndex = i;
                        break;
                    }
                }

                //移除位置 比选中位置小 选中位置减1
                if (this.m_nCurIndex >= delIndex) this.m_nCurIndex--;

                if (this.m_nTargetId == (playerId)) {
                    this.changeSelIndex(0);
                }
            } else {
                this.clearAllHead();
            }
            this.refreshPlayerNum();
        }

        /**清理所有头像消息 */
        private clearAllHead() {
            this.m_nTargetId = null;
            this.m_sTargetName = '';
            this.m_tHeadCollection.removeAll();
            this.m_tCollection.removeAll();
            this.changeSelIndex(-1);
        }


        /**头像选中 */
        private onPlayerHandler(e: eui.ItemTapEvent) {
            let info: ChatCellRD = this.m_tHeadCollection.getItemAt(e.itemIndex);
            if (info) {
                this.changeSelIndex(e.itemIndex);
            }
        }

        /*头像排序 */
        private onHeadUpdate() {
            this.m_tHeadCollection.source.sort((a: ChatCellRD, b: ChatCellRD) => {
                return b.vo.lastTime - a.vo.lastTime;
            })
            if (this.m_nCurIndex < 0) return;
            //排序后调整当前下标
            let data: ChatCellRD = this.m_tHeadCollection.getItemAt(this.m_nCurIndex);
            if (data) data.selected = false;
            this.m_nCurIndex = this.getStartIndex();
            data = this.m_tHeadCollection.getItemAt(this.m_nCurIndex);
            if (data) data.selected = true;
            //全部刷新
            this.m_tHeadCollection.refresh();
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }

    interface ChatCellRD {
        selected: boolean,
        vo: ChatHeadVo
    }

    class ChatPrivateCell extends eui.ItemRenderer {
        public m_comHead: com_main.ComHeadItem;
        public m_comState: com_main.ComState;
        public m_labName: eui.Label;
        public m_labTime: eui.Label;
        public m_btnDel: eui.Group;
        public m_imgSelected: eui.Image;

        public m_tData: ChatCellRD;
        public constructor() {
            super();
            this.touchChildren = true;
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_btnDel, this, this.onBtnDel);
        }

        /**清理聊天记录 */
        private onBtnDel() {
            if (!this.m_tData) return;
            ChatProxy.C2S_CHAT_PRIVATE_CLEAN(this.m_tData.vo.headPortrait.playerId);
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }
        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;

            let headInfo = this.m_tData.vo.headPortrait;
            this.m_comHead.info = headInfo;
            this.m_labName.text = headInfo.playerName;
            this.m_labTime.text = ChatModel.timeFormat(this.m_tData.vo.lastTime);
            this.m_imgSelected.visible = this.m_tData.selected;
            this.m_comState.stateId = headInfo.countryId;

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this, { x: 12, y: 5 }, [RedEvtType.CHAT], 2, { playerId: this.m_tData.vo.headPortrait.playerId });
        }

    }
}