var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * 指引点击面板相关
     */
    var GuideTouchView = /** @class */ (function (_super_1) {
        __extends(GuideTouchView, _super_1);
        function GuideTouchView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = GuideTouchView.NAME;
            _this.m_tData = data;
            _this.skinName = Utils.getComSkin("guide/guide_touch_view_skin.exml");
            return _this;
        }
        GuideTouchView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Tween.removeTweens(this.m_pTouchEffect1);
            com_main.EventMgr.removeEventByObject(GuideEvent.GUIDE_TOUCH_FINISH, this);
            com_main.EventManager.removeEventListeners(this);
            if (this.m_pMC) {
                NormalMcMgr.removeMc(this.m_pMC);
                this.m_pMC = null;
            }
            if (this.m_pTarget) {
                this.m_pTarget.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
                this.m_pTarget = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        GuideTouchView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var stage = egret.MainContext.instance.stage;
            NodeUtils.setSize(this, { width: stage.stageWidth, height: stage.stageHeight });
            this.touchEnabled = true;
            this.m_pTouchEffect1.visible = false;
            com_main.EventMgr.addEvent(GuideEvent.GUIDE_TOUCH_FINISH, this.closeView, this);
            //延迟显示
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);
        };
        GuideTouchView.prototype.onTimeHandler = function () {
            if (com_main.WorldView.isMove() || com_main.MainMap.isMove())
                return;
            if (com_main.UpManager.CurrentPanel && com_main.UpManager.CurrentPanel['$popShowAction'])
                return;
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.showView();
        };
        GuideTouchView.prototype.onTouchMoved = function (e) {
            e.stopPropagation();
        };
        GuideTouchView.prototype.showView = function () {
            this.touchEnabled = false;
            this.m_pTarget = GuideModel.getTargetUI(this.m_tData.uiRoot, this.m_tData.uiPath);
            if (!this.m_pTarget) {
                this.closeView();
                return;
            }
            this.checkSpecItem();
            this.m_pTarget.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
            var globalPoint = this.m_pTarget.localToGlobal(this.m_pTarget.anchorOffsetX, this.m_pTarget.anchorOffsetY);
            var tempW = this.m_pTarget.width * this.m_pTarget.scaleX;
            var tempH = this.m_pTarget.height * this.m_pTarget.scaleY;
            var tempX = globalPoint.x - this.m_pTarget.anchorOffsetX;
            var tempY = globalPoint.y - this.m_pTarget.anchorOffsetY;
            this.drawMask(tempX, tempY, tempW, tempH);
            this.setTargetBorder(tempX, tempY, tempW, tempH);
            this.showTouchEffect(tempX, tempY, tempW, tempH);
        };
        /**特殊ui逻辑 */
        GuideTouchView.prototype.checkSpecItem = function () {
            if (this.m_tData.uiPath && this.m_tData.uiPath.length > 0) {
                if (this.m_tData.uiPath[0] == 'm_CurChapter' && String(this.m_tData.uiPath[1]).match(/Item/i) + '' == 'Item') {
                    this.m_pTarget.parent.setChildIndex(this.m_pTarget, 999);
                    return;
                }
            }
        };
        //画反向遮罩
        GuideTouchView.prototype.drawMask = function (tempX, tempY, tempW, tempH) {
            var container = new egret.DisplayObjectContainer();
            var bg = new egret.Bitmap(RES.getRes("border_006_png"));
            bg.alpha = 0.6;
            var stage = egret.MainContext.instance.stage;
            NodeUtils.setSize(bg, { width: stage.stageWidth, height: stage.stageHeight });
            //挖空的大小图片
            var texture = RES.getRes("border_006_png");
            var sp = new egret.Bitmap(texture);
            NodeUtils.setSize(sp, { width: tempW, height: tempH });
            NodeUtils.setPosition(sp, tempX, tempY);
            container.addChild(bg);
            container.addChild(sp);
            sp.blendMode = egret.BlendMode.ERASE;
            var renderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(container);
            var bitmap = new egret.Bitmap(renderTexture);
            this.addChildAt(bitmap, 0);
            bitmap.touchEnabled = true; // 允许点击
            bitmap.pixelHitTest = true; // 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。
        };
        //设置锁定框
        GuideTouchView.prototype.setTargetBorder = function (tempX, tempY, tempW, tempH) {
            this.m_pTargetBroderRoot.width = tempW + 20;
            this.m_pTargetBroderRoot.height = tempH + 20;
            this.m_pTargetBroderRoot.anchorOffsetX = this.m_pTargetBroderRoot.width * 0.5;
            this.m_pTargetBroderRoot.anchorOffsetY = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pTargetBroderRoot.x = tempX + this.m_pTargetBroderRoot.anchorOffsetX - 10;
            this.m_pTargetBroderRoot.y = tempY + this.m_pTargetBroderRoot.anchorOffsetY - 10;
            var broderW = this.m_pTargetBroderRoot.width;
            var broderH = this.m_pTargetBroderRoot.height;
            var borderWMax = broderW + 20;
            var borderHMax = broderH + 20;
        };
        /**指示特效 */
        GuideTouchView.prototype.showTouchEffect = function (tempX, tempY, tempW, tempH) {
            //设置扇子方向
            var sceneW = egret.MainContext.instance.stage.stageWidth;
            var sceneH = egret.MainContext.instance.stage.stageHeight;
            var iconScaleX = (sceneW - tempX < 128) ? -1 : 1;
            var iconScaleY = tempY < 80 ? -1 : 1;
            this.m_pTouchEffect1.scaleX = iconScaleX;
            this.m_pTouchEffect1.scaleY = iconScaleY;
            this.createEffect();
            this.ShowEffect(iconScaleX, iconScaleY);
        };
        GuideTouchView.prototype.createEffect = function () {
            var mc = NormalMcMgr.createMc(IETypes.EUI_GuideTouch);
            this.m_pTargetBroderRoot.addChildAt(mc, 0);
            mc.x = this.m_pTargetBroderRoot.width * 0.5;
            ;
            mc.y = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pMC = mc;
        };
        GuideTouchView.prototype.ShowEffect = function (dirX, dirY) {
            this.m_pTouchEffect1.visible = true;
            Tween.removeTweens(this.m_pTouchEffect1);
            var tempx = this.m_pTouchEffect1.x = this.m_pTargetBroderRoot.anchorOffsetX + 25 * dirX;
            var tempy = this.m_pTouchEffect1.y = this.m_pTargetBroderRoot.anchorOffsetY - 36 * dirY;
            Tween.get(this.m_pTouchEffect1, { loop: true })
                .to({ x: this.m_pTargetBroderRoot.anchorOffsetX, y: this.m_pTargetBroderRoot.anchorOffsetY }, 400, egret.Ease.quadIn)
                .to({ x: tempx, y: tempy }, 600, egret.Ease.quadOut);
        };
        /**跳过 */
        GuideTouchView.prototype.skipGuide = function () {
            this.closeView();
        };
        GuideTouchView.prototype.closeView = function () {
            // if (!AGame.CSocket.getInstance().isConnected()) return;
            SceneManager.closeGuidePanelByName(GuideTouchView.NAME);
        };
        GuideTouchView.NAME = 'GuideTouchView';
        return GuideTouchView;
    }(com_main.CView));
    com_main.GuideTouchView = GuideTouchView;
})(com_main || (com_main = {}));
