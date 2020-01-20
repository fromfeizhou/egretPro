module com_main {
    export class ChatMsgLegView extends ChatMsgView {
        public static NAME = 'ChatMsgLegView';

        public m_pMsgRoot: eui.Group;
        public m_pLegionRoot: eui.Group;
        public m_btnLegion: com_main.ComButton;

        public constructor(type: ChatType, width: number, height: number) {
            super(type, width, height, Utils.getAppSkin("ChatSkin/ChatMsgLegViewSkin.exml"));
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
            this.m_btnLegion.setTitleLabel(GCode(CLEnum.CHAT_LEGION_GO));
            this.refreshLegionView();
        }

        /**显示当前切卡行为 */
        public onShow() {
            if (LegionModel.getGuildId() == (0)) {
                Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips: GCode(CLEnum.CHAT_LEGION_FAIL) })
            } else {
                Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: false })
            }
            super.onShow();
        }

        /**刷新联盟显示 */
        private refreshLegionView() {
            if (LegionModel.getGuildId() == (0)) {
                this.m_pMsgRoot.visible = false;
                this.m_pLegionRoot.visible = true;
            } else {
                this.m_pMsgRoot.visible = true;
                this.m_pLegionRoot.visible = false;
            }
        }

        /**发送消息(子类重写) */
        public sendChannelMsg(msg: string) {
            if (LegionModel.getGuildId() == (0)) {
                EffectUtils.showTips(GCode(CLEnum.CHAT_LEGION_FAIL2), 1, true);
                return;
            }
            return super.sendChannelMsg(msg);
        }


        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        protected addEvent() {
            super.addEvent()
            EventMgr.addEvent(LegionEvent.LEGION_INFO_CHANGE, this.changeLegion, this);
            EventManager.addTouchScaleListener(this.m_btnLegion, this, this.onBtnLegion);
        }

        protected removeEvent() {
            super.removeEvent();
            EventMgr.removeEventByObject(LegionEvent.LEGION_INFO_CHANGE, this);
        }

        /**联盟变更回调 */
        private changeLegion() {
            this.refreshLegionView();
        }

        /**按钮点击 */
        private onBtnLegion() {
            FunctionModel.openFunctionByType(FunctionType.GUILD);
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }
}