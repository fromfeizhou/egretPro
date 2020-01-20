module com_main {

    export class ChatMsgView extends CComponent implements IChatTabView {
        public static NAME = 'ChatMsgView';
        public m_scroll: com_main.CScroller;
        public m_listItem: eui.List;

        protected m_tCollection: eui.ArrayCollection;
        private m_nItemWidth: number;
        public m_nType: ChatType;

        protected m_bSendCd: boolean;  //聊天发送冷却
        protected m_nTimeOutId: number;  //延迟函数id（回收用）

        protected m_bIsShow: boolean;
        protected m_bInit: boolean;
        protected m_bScrollEnd: boolean;  //滚动计数 
        public constructor(type: ChatType, width: number, height: number, skinName: string = '') {
            super();
            this.name = ChatMsgView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            this.skinName = skinName == '' ? Utils.getAppSkin("ChatSkin/ChatMsgViewSkin.exml") : skinName;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            if (this.m_nTimeOutId) {
                egret.clearTimeout(this.m_nTimeOutId);
                this.m_nTimeOutId = null;
            }
            super.onDestroy();
        }

        /**显示当前切卡行为 */
        public onShow() {
            this.m_bIsShow = true;
            if (this.m_bInit) {
                this.initItemData(false);
            } else {
                this.m_bInit = true;
                this.initItemData(true);
            }
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: false })
        }

        /**隐藏 */
        public onHide() {
            this.m_bIsShow = false;
        }

        /**获得聊天频道 */
        public set chatType(val: ChatType) {
            this.m_nType = val;
        }
        public get chatType() {
            return this.m_nType;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";
            this.initItemList();
            this.addEvent();
            this.m_bIsShow = false;
        }

        private initItemList() {
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.itemRenderer = ChatMsgItem;
            this.m_listItem.dataProvider = this.m_tCollection;
            this.validateNow();
            this.m_nItemWidth = this.m_listItem.width;
        }

        /**初始化列表 */
        protected initItemData(isReset: boolean) {
            let list = this.getItemList();
            list.sort((a, b) => {
                return a.time - b.time;
            });
            if (isReset) {
                this.m_tCollection.removeAll();
                let res = [];
                for (let i = 0; i < list.length; i++) {
                    let vo = list[i];
                    let data = this.createItemRD(vo);
                    res.push(data);
                }
                this.m_tCollection.replaceAll(res);
            } else {
                for (let i = 0; i < list.length; i++) {
                    let vo = list[i];
                    let isNew = true;
                    //过滤已有对象
                    for (let i = 0; i < this.m_tCollection.source.length; i++) {
                        let item = this.m_tCollection.getItemAt(i) as IChatMsgItemRD;
                        if (item.data.hashCode == vo.hashCode) {
                            isNew = false;
                            break;
                        }
                    }

                    if (isNew) {
                        this.m_tCollection.addItem(this.createItemRD(vo));
                    }
                }
            }

            this.validateNow();
            this.m_bScrollEnd = true;
            this.refreshScrollV();
        }

        /**对象创建渲染data */
        protected createItemRD(vo: ChatVo) {
            let item: IChatMsgItemRD = {
                type: this.m_nType,
                data: vo,
                width: this.m_nItemWidth,
            };
            vo.isRead = true;
            return item;
        }

        /**滚动到最大位置 */
        protected refreshScrollV() {
            egret.callLater(() => {
                if (this.m_scroll) {
                    let scrollV = this.m_scroll.viewport.contentHeight - this.m_scroll.viewport.height;
                    scrollV = Math.max(scrollV, 0);
                    this.m_scroll.viewport.scrollV = scrollV;
                }
            }, this);
        }

        private onContentChange(evt: any) {
            if (this.m_bScrollEnd && evt.property == 'contentHeight') {
                this.refreshScrollV();
            }
        }

        /**发送消息(子类继承重写) */
        public sendChannelMsg(msg: string, playerId?: number): boolean {
            if (!PlatConst.isDebugPlat() && !FunctionModel.isFunctionOpen(FunctionType.CHAT)) {
                let level = FunctionModel.getFunctionOpenLevel(FunctionType.CHAT);
                EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_LIMI_LEVEL, level), 1, true);
                return false;
            }

            // 判断是否都是空格
            var left_str: string = msg.replace("%s", "");
            if (left_str == "") {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND), 1, true);
                return false;
            }

            if (msg.length > ChatModel.MSG_CHAT_MAX) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND2), 1, true);
                return false;
            }
            if (playerId && ChatModel.inBlackList(playerId)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND3), 1, true);
                return false;
            }

            //私聊过滤
            if (playerId && playerId == (RoleData.playerId)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LIMI_SEND4), 1, true);
                return false;
            }

            if (this.m_bSendCd) {
                let name = ChatModel.getChannelName(this.m_nType);
                let time = Math.floor(this.coldTime / 1000);
                EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_LIMI_SEND5, name, time), 1, true);
                return false;
            }

            msg = StringUtils.searchDwordsAndReplace(msg);
            ChatProxy.C2S_CHAT_PUSH(this.m_nType, msg, playerId);
            this.m_bSendCd = true;
            this.m_nTimeOutId = egret.setTimeout(() => {
                this.m_bSendCd = false;
                this.m_nTimeOutId = null;
            }, this, this.coldTime);

            return true;
        }

        /**聊天间隔 */
        protected get coldTime(): number {
            return ConstUtil.getValue(IConstEnum.CHAT_INTERVAL);
        }

        /** 频道消息过滤 */
        protected isChannelMsg(channel: ChatType, targetId?: number): boolean {
            return channel == this.m_nType;
        }

        /**聊天数据 */
        protected getItemList() {
            return ChatModel.getMsgByType(this.m_nType);
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        protected addEvent() {
            com_main.EventMgr.addEvent(ChatEvent.MSG_UPDATE, this.onMsgUpdate, this);
            this.m_listItem.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onContentChange, this);
            this.m_scroll.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
        }

        protected removeEvent() {
            this.m_listItem.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onContentChange, this);
            this.m_scroll.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
            com_main.EventMgr.removeEventByObject(ChatEvent.MSG_UPDATE, this);
            EventManager.removeEventListeners(this);
        }

        private moveScroller() {
            this.m_bScrollEnd = false;
        }

        /**消息增加 */
        private onMsgUpdate(data: { channel: ChatType, vo: ChatVo, targetId?: number }) {
            if (!this.m_bIsShow) return;

            if (!this.isChannelMsg(data.channel, data.targetId)) return;

            let scrollV = this.m_listItem.contentHeight - this.m_listItem.height;
            scrollV = Math.max(scrollV, 0);

            let rdata = this.createItemRD(data.vo);
            this.m_tCollection.addItem(rdata);
            this.validateNow();

            if (this.m_listItem.scrollV >= scrollV) {
                this.m_bScrollEnd = true;
                this.refreshScrollV();
            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}