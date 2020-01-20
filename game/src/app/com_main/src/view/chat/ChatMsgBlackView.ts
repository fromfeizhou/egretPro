module com_main {
    export class ChatMsgBlackView extends CComponent implements IChatTabView {
        public static NAME = 'ChatMsgBlackView';

        public m_pMsgRoot: eui.Group;
        public m_scroll: eui.Scroller;
        public m_listItem: eui.List;
        public m_labBlackNum: eui.Label;

        public m_nType: ChatType;
        private m_tCollection: eui.ArrayCollection;
        private m_nItemWidth: number;

        public constructor(type: ChatType, width: number, height: number) {
            super();
            this.name = ChatMsgView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            this.skinName = Utils.getAppSkin("ChatSkin/ChatMsgBlackViewSkin.exml");
        }


        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }


        protected childrenCreated(): void {
            super.childrenCreated();

            this.validateNow();
            let width = this.m_listItem.width;
            this.m_nItemWidth = width;

            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.itemRenderer = ChatBlackRender;
            this.m_listItem.dataProvider = this.m_tCollection;

            let res: ChatBlackRD[] = []
            let list = ChatModel.getBlackList();
            for (let i = 0; i < list.length; i++) {
                res.push({ width: width, info: list[i] });
            }
            this.m_tCollection.replaceAll(res);

            this.refreshBlackNum();
            this.addEvent();
        }

        /**显示当前切卡行为 */
        public onShow() {
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips: GCode(CLEnum.CHAT_BLACK_TIPS) })
        }

        /**显示当前切卡行为 */
        public onHide() {
        }

        /**获得聊天频道 */
        public set chatType(val: ChatType) {
            this.m_nType = val;
        }
        public get chatType() {
            return this.m_nType;
        }

        public sendChannelMsg(msg: string, playerId?: number): boolean {
            return false;
        }

        /**刷新黑名单人数 */
        private refreshBlackNum() {
            this.m_labBlackNum.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CHAT_BLACK_NUM,this.m_tCollection.length,ChatModel.BLACK_MAX))
        }


        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        protected addEvent() {
            EventMgr.addEvent(ChatEvent.CHAT_BLACK_LIST_ADD, this.onBlackListAdd, this);
            EventMgr.addEvent(ChatEvent.CHAT_BLACK_LIST_DEL, this.onBlackListDel, this);
        }

        protected removeEvent() {
            EventMgr.removeEventByObject(ChatEvent.CHAT_BLACK_LIST_ADD, this);
            EventMgr.removeEventByObject(ChatEvent.CHAT_BLACK_LIST_DEL, this);
        }

        /**添加对象 */
        private onBlackListAdd(id: number) {
            let data = ChatModel.getBlackInfo(id);
            if (data) {
                let item: ChatBlackRD = { width: this.m_nItemWidth, info: data };
                this.m_tCollection.addItem(item);
            }
        }

        /**移除对象对象 */
        private onBlackListDel(id: number) {
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let data: ChatBlackRD = this.m_tCollection.getItemAt(i);
                if (data.info.playerId == (id)) {
                    this.m_tCollection.removeItemAt(i);
                    return;
                }

            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


    }

    interface ChatBlackRD {
        width: number;
        info: gameProto.IHeadPortrait;
    }
    /**渲染对象 */
    class ChatBlackRender extends eui.ItemRenderer {
        public m_imgLine: eui.Image;
        public m_labLegion: eui.Label;
        public m_comState: com_main.ComState;
        public m_labTitle: eui.Label;
        public m_labLevel: eui.Label;
        public m_labTime: eui.Label;
        public m_comHead: com_main.ComHeadItem;
        public m_btnOpen: com_main.ComButton;

        private m_tData: ChatBlackRD;
        private m_bInit: boolean;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_btnOpen.setTitleLabel(GCode(CLEnum.CHAT_BLACK_CANCEL));
            EventManager.addTouchScaleListener(this.m_btnOpen, this, this.onBtnOpen);
        }

        /**解除黑名单 */
        private onBtnOpen() {
            if (!this.m_tData) return;
            ChatProxy.C2S_CHAT_DEL_BLACKLIST(this.m_tData.info.playerId);
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;

            if (!this.m_bInit) {
                this.m_bInit = true;
                this.width = this.m_tData.width;
                this.commitProperties();
            }
            let info = this.m_tData.info;
            this.m_comHead.info = info;
            this.m_comState.stateId = info.countryId;
            this.m_labTitle.text = info.playerName;
            this.m_labLegion.text = info.labourUnionName;

        }
    }
}