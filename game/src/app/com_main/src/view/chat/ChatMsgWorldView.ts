module com_main {
    export class ChatMsgWorldView extends ChatMsgView {

        /**发送消息(子类重写) */
        public sendChannelMsg(msg: string):boolean {
            //国家频道 道具消耗判断
            if (!PropModel.isItemEnough(PropEnum.CHAT_ITEM, 1)) {
                QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.CHAT_ITEM);
                return;
            }
            return super.sendChannelMsg(msg);
        }

        /**聊天间隔 */
        protected get coldTime(): number {
            return 1000;
        }
    }

    export class ChatMsgSysyemView extends ChatMsgView {

        /**发送消息(子类重写) */
        public sendChannelMsg(msg: string):boolean {
            //国家频道 道具消耗判断
            if (!PropModel.isItemEnough(PropEnum.CHAT_ITEM, 1)) {
                QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.CHAT_ITEM);
                return;
            }
            return super.sendChannelMsg(msg);
        }

         /**显示当前切卡行为 */
        public onShow() {
            super.onShow();
            Utils.open_view(TASK_UI.POP_CHAT_MAIN_TIPS, { isShow: true, tips:'' })
        }
    }
}