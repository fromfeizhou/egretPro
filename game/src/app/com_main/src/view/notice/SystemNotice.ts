module com_main {
    export class SystemNotice extends CComponent {
        public static NAME = 'SystemNotice';

        public m_imgMask: eui.Image;
        public m_pRoot: eui.Group;
        public m_imgBg: eui.Image;
        public m_labMsg: eui.Label;


        private m_msgList: string[];

        public constructor() {
            super();
            this.name = SystemNotice.NAME;
            this.m_msgList = [];
            this.skinName = Utils.getAppSkin("notice/SystemNoticeSkin.exml");
            this.touchEnabled = false;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            egret.Tween.removeTweens(this.m_pRoot);
            egret.Tween.removeTweens(this.m_labMsg);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pRoot.mask = this.m_imgMask;

            this.popMsg();
        }

        /**添加跑马灯消息 */
        public pushMsg(msg: string[]) {
            if (this.m_msgList) this.m_msgList = this.m_msgList.concat(msg);
        }

        /**弹出消息 */
        private popMsg() {
            if (this.m_msgList.length > 0) {
                this.m_labMsg.x = this.m_pRoot.width;

                let msg = this.m_msgList.shift();
                this.m_labMsg.textFlow =Utils.htmlParser(msg);
                this.m_pRoot.alpha = 0;
                this.doBgAction();
            } else {
                SystemNotice.hide();
            }
        }

        /**背景淡出 */
        private doBgAction() {
            egret.Tween.get(this.m_pRoot)
                .to({ alpha: 1 }, 400, egret.Ease.backOut)
                .call(() => {
                    this.doLabAction();
                }, this);
        }

        //**文本动画 */
        private doLabAction() {
            if (!this.m_labMsg) return;
            let dis = this.m_pRoot.width + this.m_labMsg.width
            egret.Tween.get(this.m_labMsg)
                .to({ x: -this.m_labMsg.width }, dis * 10)
                .call(() => {
                    this.popMsg()
                }, this);
        }

        /**=====================================================================================
		* 对外接口 begin
		* =====================================================================================
		*/
        public static getClass(): SystemNotice {
            let obj = SceneManager.getClass(LayerEnums.NET, SystemNotice.NAME);
            return obj;
        }

        public static show(msg: string[]) {
            let view = SystemNotice.getClass();
            if (!view) {
                view = new SystemNotice();
                view.pushMsg(msg);
                // AnchorUtil.setAnchorCenter(view);
                view.anchorOffsetX = 534 / 2;
                view.anchorOffsetY = 40 / 2;
                view.x = (AGame.R.app.stageWidth) / 2;
                view.y = 200;
                SceneManager.addChild(LayerEnums.NET, view,99);
                return;
            }
            view.pushMsg(msg);
        }

        public static hide() {
            let view = SystemNotice.getClass();
            if (view) Utils.removeFromParent(view);
        }
        /**=====================================================================================
        * 对外接口 end
        * =====================================================================================
        */
    }
}