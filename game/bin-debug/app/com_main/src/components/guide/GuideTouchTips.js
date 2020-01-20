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
     * 点击提示
     */
    var GuideTouchTips = /** @class */ (function (_super_1) {
        __extends(GuideTouchTips, _super_1);
        function GuideTouchTips(param) {
            var _this = _super_1.call(this) || this;
            _this.name = GuideTouchTips.NAME;
            _this.uiRoot = param.uiRoot;
            _this.uiPath = param.uiPath;
            _this.m_pTarget = param.target;
            _this.touchEnabled = false;
            _this.skinName = Utils.getComSkin("guide/GuideTouchTipsSkin.exml");
            return _this;
        }
        GuideTouchTips.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GuideTouchTips.prototype.onDestroy = function () {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeing, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchBeing, this);
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Tween.removeTweens(this.m_pTouchEffect1);
            if (this.m_pMC) {
                NormalMcMgr.removeMc(this.m_pMC);
                this.m_pMC = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        GuideTouchTips.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pTouchEffect1.visible = false;
            this.m_nDelayTime = 300;
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);
        };
        GuideTouchTips.prototype.onTimeHandler = function () {
            this.m_nDelayTime -= 30;
            if (this.m_nDelayTime < 0) {
                if (com_main.WorldView.isMove() || com_main.MainMap.isMove())
                    return;
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.showView();
            }
        };
        GuideTouchTips.prototype.showView = function () {
            if (!this.m_pTarget)
                this.m_pTarget = GuideModel.getTargetUI(this.uiRoot, this.uiPath);
            if (!this.m_pTarget) {
                this.closeView();
                return;
            }
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeing, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchBeing, this);
            var globalPoint = this.m_pTarget.localToGlobal(this.m_pTarget.anchorOffsetX, this.m_pTarget.anchorOffsetY);
            var tempW = this.m_pTarget.width * this.m_pTarget.scaleX;
            var tempH = this.m_pTarget.height * this.m_pTarget.scaleY;
            var tempX = globalPoint.x - this.m_pTarget.anchorOffsetX;
            var tempY = globalPoint.y - this.m_pTarget.anchorOffsetY;
            this.setTargetBorder(tempX, tempY, tempW, tempH);
        };
        /**点击任意地方 */
        GuideTouchTips.prototype.onTouchBeing = function () {
            this.closeView();
        };
        //设置锁定框
        GuideTouchTips.prototype.setTargetBorder = function (tempX, tempY, tempW, tempH) {
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
            //设置扇子方向
            var sceneW = egret.MainContext.instance.stage.stageWidth;
            var sceneH = egret.MainContext.instance.stage.stageHeight;
            var iconScaleX = (sceneW - tempX < 128) ? -1 : 1;
            var iconScaleY = tempY < 80 ? -1 : 1;
            this.m_pTouchEffect1.scaleX = iconScaleX;
            this.m_pTouchEffect1.scaleY = iconScaleY;
            this.createEffect();
            this.showEffect(iconScaleX, iconScaleY);
        };
        /**添加提示特效 */
        GuideTouchTips.prototype.createEffect = function () {
            var mc = NormalMcMgr.createMc(IETypes.EUI_GuideTouch);
            this.m_pTargetBroderRoot.addChildAt(mc, 0);
            mc.x = this.m_pTargetBroderRoot.width * 0.5;
            ;
            mc.y = this.m_pTargetBroderRoot.height * 0.5;
            this.m_pMC = mc;
        };
        /**添加 图片动画 */
        GuideTouchTips.prototype.showEffect = function (dirX, dirY) {
            this.m_pTouchEffect1.visible = true;
            Tween.removeTweens(this.m_pTouchEffect1);
            var tempx = this.m_pTouchEffect1.x = this.m_pTargetBroderRoot.anchorOffsetX + 25 * dirX;
            var tempy = this.m_pTouchEffect1.y = this.m_pTargetBroderRoot.anchorOffsetY - 36 * dirY;
            Tween.get(this.m_pTouchEffect1, { loop: true })
                .to({ x: this.m_pTargetBroderRoot.anchorOffsetX, y: this.m_pTargetBroderRoot.anchorOffsetY }, 400, egret.Ease.quadIn)
                .to({ x: tempx, y: tempy }, 600, egret.Ease.quadOut);
        };
        /**界面关闭 */
        GuideTouchTips.prototype.closeView = function () {
            Utils.removeFromParent(this);
        };
        GuideTouchTips.NAME = 'GuideTouchTips';
        return GuideTouchTips;
    }(com_main.CView));
    com_main.GuideTouchTips = GuideTouchTips;
})(com_main || (com_main = {}));
