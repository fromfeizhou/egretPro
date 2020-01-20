module com_main {
	/**
	 * 指引点击面板相关
	 */
    export class GuideTouchView extends CView {
        public static NAME = 'GuideTouchView';

        public m_pTargetBroderRoot: eui.Group;
        public m_pTouchEffect1: com_main.CImage;

        private m_pMC: MCDragonBones;   //点击特效
        private m_tData: GuideStepData;
        private m_pTarget: egret.DisplayObject;

        public constructor(data: GuideStepData) {
            super();
            this.name = GuideTouchView.NAME;
            this.m_tData = data;
            this.skinName = Utils.getComSkin("guide/guide_touch_view_skin.exml");
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Tween.removeTweens(this.m_pTouchEffect1);
            EventMgr.removeEventByObject(GuideEvent.GUIDE_TOUCH_FINISH, this);

            EventManager.removeEventListeners(this);

            if (this.m_pMC) {
                NormalMcMgr.removeMc(this.m_pMC);
                this.m_pMC = null;
            }
            if (this.m_pTarget) {
                this.m_pTarget.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
                this.m_pTarget = null;
            }
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            let stage = egret.MainContext.instance.stage;
            NodeUtils.setSize(this, { width: stage.stageWidth, height: stage.stageHeight });
            this.touchEnabled = true;

            this.m_pTouchEffect1.visible = false;
            EventMgr.addEvent(GuideEvent.GUIDE_TOUCH_FINISH, this.closeView, this);

            //延迟显示
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);
        }

        private onTimeHandler() {
            if (WorldView.isMove() || MainMap.isMove()) return;
            if (UpManager.CurrentPanel && UpManager.CurrentPanel['$popShowAction']) return;
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.showView();
        }


        public onTouchMoved(e: egret.TouchEvent): void {
            e.stopPropagation();
        }

        private showView() {
            this.touchEnabled = false;

            this.m_pTarget = GuideModel.getTargetUI(this.m_tData.uiRoot, this.m_tData.uiPath);
            if (!this.m_pTarget) {
                this.closeView();
                return
            }
            this.checkSpecItem();
            this.m_pTarget.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);

            let globalPoint = this.m_pTarget.localToGlobal(this.m_pTarget.anchorOffsetX, this.m_pTarget.anchorOffsetY);
            let tempW = this.m_pTarget.width * this.m_pTarget.scaleX;
            let tempH = this.m_pTarget.height * this.m_pTarget.scaleY;
            let tempX = globalPoint.x - this.m_pTarget.anchorOffsetX;
            let tempY = globalPoint.y - this.m_pTarget.anchorOffsetY;
            this.drawMask(tempX, tempY, tempW, tempH);
            this.setTargetBorder(tempX, tempY, tempW, tempH);
            this.showTouchEffect(tempX, tempY, tempW, tempH);
        }

        /**特殊ui逻辑 */
        private checkSpecItem() {
            if (this.m_tData.uiPath && this.m_tData.uiPath.length > 0) {
                if (this.m_tData.uiPath[0] == 'm_CurChapter' && String(this.m_tData.uiPath[1]).match(/Item/i) + '' == 'Item') {
                    this.m_pTarget.parent.setChildIndex(this.m_pTarget, 999);
                    return;
                }
            }
        }

        //画反向遮罩
        private drawMask(tempX: number, tempY: number, tempW: number, tempH: number) {
            let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            let bg: egret.Bitmap = new egret.Bitmap(RES.getRes("border_006_png"));
            bg.alpha = 0.6;
            let stage = egret.MainContext.instance.stage;
            NodeUtils.setSize(bg, { width: stage.stageWidth, height: stage.stageHeight });

            //挖空的大小图片
            let texture = RES.getRes("border_006_png");
            let sp = new egret.Bitmap(texture);
            NodeUtils.setSize(sp, { width: tempW, height: tempH });
            NodeUtils.setPosition(sp, tempX, tempY);

            container.addChild(bg);
            container.addChild(sp);
            sp.blendMode = egret.BlendMode.ERASE;

            let renderTexture: egret.RenderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(container);

            let bitmap: egret.Bitmap = new egret.Bitmap(renderTexture);
            this.addChildAt(bitmap, 0);
            bitmap.touchEnabled = true;  // 允许点击
            bitmap.pixelHitTest = true;  // 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。

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
        }

        /**指示特效 */
        private showTouchEffect(tempX: number, tempY: number, tempW: number, tempH: number) {
            //设置扇子方向
            let sceneW = egret.MainContext.instance.stage.stageWidth;
            let sceneH = egret.MainContext.instance.stage.stageHeight;
            let iconScaleX = (sceneW - tempX < 128) ? -1 : 1;
            let iconScaleY = tempY < 80 ? -1 : 1;
            this.m_pTouchEffect1.scaleX = iconScaleX;
            this.m_pTouchEffect1.scaleY = iconScaleY;

            this.createEffect();
            this.ShowEffect(iconScaleX, iconScaleY);
        }


        private createEffect() {
            let mc = NormalMcMgr.createMc(IETypes.EUI_GuideTouch);
            this.m_pTargetBroderRoot.addChildAt(mc, 0);

            mc.x = this.m_pTargetBroderRoot.width * 0.5;;
            mc.y = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pMC = mc;
        }

        private ShowEffect(dirX: number, dirY: number) {
            this.m_pTouchEffect1.visible = true;
            Tween.removeTweens(this.m_pTouchEffect1);
            let tempx = this.m_pTouchEffect1.x = this.m_pTargetBroderRoot.anchorOffsetX + 25 * dirX;
            let tempy = this.m_pTouchEffect1.y = this.m_pTargetBroderRoot.anchorOffsetY - 36 * dirY;
            Tween.get(this.m_pTouchEffect1, { loop: true })
                .to({ x: this.m_pTargetBroderRoot.anchorOffsetX, y: this.m_pTargetBroderRoot.anchorOffsetY }, 400, egret.Ease.quadIn)
                .to({ x: tempx, y: tempy }, 600, egret.Ease.quadOut);
        }

        /**跳过 */
        private skipGuide() {
            this.closeView();
        }

        private closeView() {
            // if (!AGame.CSocket.getInstance().isConnected()) return;
            SceneManager.closeGuidePanelByName(GuideTouchView.NAME);
        }
    }
}