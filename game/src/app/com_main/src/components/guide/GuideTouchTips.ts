module com_main {
	/**
	 * 点击提示
	 */
    export class GuideTouchTips extends CView {
        public static NAME = 'GuideTouchTips';

        public m_pTargetBroderRoot: eui.Group;
        public m_pTouchEffect1: com_main.CImage;

        private m_pMC: MCDragonBones;   //点击特效
        private m_pTarget: egret.DisplayObject;
        private uiRoot: { layer: number, name: string };      //指定ui名字
        private uiPath: Array<any>;
        private m_nDelayTime: number;    //计时

        public constructor(param: { uiRoot?: { layer: number, name: string }, uiPath?: Array<any>, target?: egret.DisplayObject }) {
            super();
            this.name = GuideTouchTips.NAME;
            this.uiRoot = param.uiRoot;
            this.uiPath = param.uiPath;
            this.m_pTarget = param.target;
            this.touchEnabled = false;
            this.skinName = Utils.getComSkin("guide/GuideTouchTipsSkin.exml");
        }


        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }


        public onDestroy(): void {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeing, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchBeing, this);
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Tween.removeTweens(this.m_pTouchEffect1);
            if (this.m_pMC) {
                NormalMcMgr.removeMc(this.m_pMC);
                this.m_pMC = null;
            }
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pTouchEffect1.visible = false;
            this.m_nDelayTime = 300;
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);
        }

        private onTimeHandler() {
            this.m_nDelayTime -= 30;
            if (this.m_nDelayTime < 0) {
                if (WorldView.isMove() || MainMap.isMove()) return;
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.showView();
            }
        }

        private showView() {
            if (!this.m_pTarget) this.m_pTarget = GuideModel.getTargetUI(this.uiRoot, this.uiPath);
            if (!this.m_pTarget) {
                this.closeView();
                return
            }

            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeing, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchBeing, this);

            let globalPoint = this.m_pTarget.localToGlobal(this.m_pTarget.anchorOffsetX, this.m_pTarget.anchorOffsetY);
            let tempW = this.m_pTarget.width * this.m_pTarget.scaleX;
            let tempH = this.m_pTarget.height * this.m_pTarget.scaleY;
            let tempX = globalPoint.x - this.m_pTarget.anchorOffsetX;
            let tempY = globalPoint.y - this.m_pTarget.anchorOffsetY;

            this.setTargetBorder(tempX, tempY, tempW, tempH);
        }

        /**点击任意地方 */
        private onTouchBeing() {
            this.closeView();
        }

        //设置锁定框
        private setTargetBorder(tempX: number, tempY: number, tempW: number, tempH: number) {
            this.m_pTargetBroderRoot.width = tempW + 20;
            this.m_pTargetBroderRoot.height = tempH + 20;
            this.m_pTargetBroderRoot.anchorOffsetX = this.m_pTargetBroderRoot.width * 0.5;
            this.m_pTargetBroderRoot.anchorOffsetY = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pTargetBroderRoot.x = tempX + this.m_pTargetBroderRoot.anchorOffsetX - 10;
            this.m_pTargetBroderRoot.y = tempY + this.m_pTargetBroderRoot.anchorOffsetY - 10;

            let broderW = this.m_pTargetBroderRoot.width;
            let broderH = this.m_pTargetBroderRoot.height;
            let borderWMax = broderW + 20;
            let borderHMax = broderH + 20;


            //设置扇子方向
            let sceneW = egret.MainContext.instance.stage.stageWidth;
            let sceneH = egret.MainContext.instance.stage.stageHeight;
            let iconScaleX = (sceneW - tempX < 128) ? -1 : 1;
            let iconScaleY = tempY < 80 ? -1 : 1;
            this.m_pTouchEffect1.scaleX = iconScaleX;
            this.m_pTouchEffect1.scaleY = iconScaleY;

            this.createEffect();
            this.showEffect(iconScaleX, iconScaleY);
        }

        /**添加提示特效 */
        private createEffect() {
            let mc = NormalMcMgr.createMc(IETypes.EUI_GuideTouch);
            this.m_pTargetBroderRoot.addChildAt(mc, 0);

            mc.x = this.m_pTargetBroderRoot.width * 0.5;;
            mc.y = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pMC = mc;
        }
        /**添加 图片动画 */
        private showEffect(dirX: number, dirY: number) {
            this.m_pTouchEffect1.visible = true;
            Tween.removeTweens(this.m_pTouchEffect1);
            let tempx = this.m_pTouchEffect1.x = this.m_pTargetBroderRoot.anchorOffsetX + 25 * dirX;
            let tempy = this.m_pTouchEffect1.y = this.m_pTargetBroderRoot.anchorOffsetY - 36 * dirY;
            Tween.get(this.m_pTouchEffect1, { loop: true })
                .to({ x: this.m_pTargetBroderRoot.anchorOffsetX, y: this.m_pTargetBroderRoot.anchorOffsetY }, 400, egret.Ease.quadIn)
                .to({ x: tempx, y: tempy }, 600, egret.Ease.quadOut);
        }


        /**界面关闭 */
        public closeView() {
            Utils.removeFromParent(this);
        }
    }
}