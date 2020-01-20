/**
 * 限时活动解锁弹框
 */
module com_main {
    export class GiftBagTisPop extends CView {
        public static NAME = 'GiftBagTisPop';

        public group2: eui.Group;
        public m_btnHide: eui.Image;
        public group3: eui.Group;
        public m_labTips: com_main.CLabel;
        public m_btnGoto: com_main.ComButton;
        public group1: eui.Group;
        private m_type: number;//类型
        private actionGroup: egret.tween.TweenGroup;;   //进场动画
        private m_currId: number;//当前打开的礼包id
        public constructor(param:any) {
            super();
            this.m_type=param.type?param.type:1;
            this.m_currId = param.giftId>0 ? param.giftId : 0;
            this.name = GiftBagTisPop.NAME;
            this.initApp("activity/giftBag/GiftBagTipPopSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.validateNow();
            this.actionGroup.play(0);
            this.initView();
            this.addEvent();

            GiftBagModel.isPopItem = false;
            GiftBagModel.isPopShop = false;
        }
        /**初始化界面 */
        private initView() {
            let str: string;
            if (this.m_type == 1) {
                str = GCode(CLEnum.XSLB_TIP);
            } else {
                str = '您已经解锁了限时商城，有大量珍宝道具等着您！';
            }
            this.m_labTips.text = str;
            this.m_btnGoto.setTitleLabel(GCode(CLEnum.GO_TO));
        }

        /**关闭界面 */
        private hidePanel() {
            UpManager.history();
        }
        /**前往限时活动界面 */
        private onGotoGiftBag() {
            this.hidePanel();
            if (this.m_type == 1) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTBAG,this.m_currId);
            } else {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP);
            }

        }
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnHide, this, this.hidePanel);
            EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoGiftBag);
        }
        /**移除事件 */
        private removeEvent() {
        }
    }

}