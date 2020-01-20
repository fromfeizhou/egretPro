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
var Ease = egret.Ease;
/**
 * View 基础元素（自带皮肤） 每个继承这个类的类，都要用单例
 * 所有的view 都要继承这个类
 *
 * 初始化重写initialized()
 *
 * 打开界面调用show()
 * 关闭界面调用hide()
 *
 * 添加监听重写addEvent()
 * 移除监听重写removeEvent()
 *
 * 每次打开界面都会调用，onShow() 在里面添加打开界面后需要初始化的数据
 * 每次打开界面都会调用，onHide() 在里面添加关闭界面后清除的数据
 */
var UIElement = /** @class */ (function (_super_1) {
    __extends(UIElement, _super_1);
    /**
     * @param parent 此对象的显示列表父对象
     * @param skinName 对应wnd目录下的文件名
     * @param alignStyle 对齐样式
     * @param showStyle 打开方式
     * @param isMask 是否使用遮罩 默认不使用
     */
    function UIElement(parent, skinName, alignStyle, showStyle, isMask, isTouch) {
        if (skinName === void 0) { skinName = ""; }
        if (alignStyle === void 0) { alignStyle = UIAlignStyle.Normal; }
        if (showStyle === void 0) { showStyle = UIShowStyle.Normal; }
        if (isMask === void 0) { isMask = false; }
        if (isTouch === void 0) { isTouch = true; }
        var _this = _super_1.call(this, skinName) || this;
        _this._mShowParent = null;
        /**是否遮罩*/
        _this._mIsMark = false;
        _this._mUiMask = null;
        /**遮罩透明度*/
        _this._mMaskAlpha = 0.3;
        _this._mIsShow = false; //是否show了
        _this._mInit = false;
        _this._mLoadingGro = null;
        _this.touchClose = false;
        _this._tempN = 0;
        _this._mRecordX = 0;
        _this._mRecordY = 0;
        _this._mRecordScaleX = 1;
        _this._mRecordScaleY = 1;
        _this._mAnchorX = 0;
        _this._mAnchorY = 0;
        _this.name = "Exml_" + skinName;
        _this.osReSize(skinName);
        var self = _this;
        self._mShowParent = parent;
        self._mIsMark = isMask;
        self._mUIShowType = showStyle;
        self._mUIAlignType = alignStyle;
        if (isMask) { //显示遮罩
            self.initMask(isTouch);
        }
        if (skinName && skinName.length > 0) {
        }
        else {
            self.init();
        }
        return _this;
    }
    UIElement.prototype.childrenCreated = function () {
        _super_1.prototype.childrenCreated.call(this);
    };
    UIElement.prototype.osReSize = function (skinName) {
        // if( GameConst.OsType == "iPad" && this.g_main ){
        //     this.g_main.scaleX =  GameConst.VIEW_SCALE;
        //     this.g_main.scaleY=  GameConst.VIEW_SCALE;
        // }
    };
    /**皮肤加载完成*/
    UIElement.prototype.loaded = function () {
        _super_1.prototype.loaded.call(this);
        var self = this;
        self.init();
        self.cleanLoading();
    };
    /**初始化数据*/
    UIElement.prototype.init = function () {
        var self = this;
        // if (self._mIsMark) {
        //     self.addChildAt(self._mUiMask, 0)
        // }
        self.initialized();
        self._mInit = true;
        self.showIt();
    };
    UIElement.prototype.initMask = function (isTouch) {
        this._mIsMark = true;
        this._mUiMask = new egret.Sprite();
        this._mUiMask.graphics.beginFill(0x000000, 1);
        this._mUiMask.graphics.drawRect(-100, -100, AGame.R.app.stageWidth + 200, AGame.R.app.stageHeight + 200);
        this._mUiMask.graphics.endFill();
        this._mUiMask.touchEnabled = isTouch;
        this._mUiMask.touchChildren = false;
        this.setMaskAlpha(this._mMaskAlpha);
        this.addChildAt(this._mUiMask, 0);
    };
    /**
     * 设置遮罩透明度
     * @param val 0- 1
     */
    UIElement.prototype.setMaskAlpha = function (val) {
        var self = this;
        if (self._mUiMask == null)
            return;
        self._mMaskAlpha = val;
        self._mUiMask.alpha = self._mMaskAlpha;
    };
    /*显示界面用单例调用此方法, 请忽重写此方法， 如需打开界面时做点事情，重写onShow*/
    UIElement.prototype.show = function () {
        var self = this;
        if (self._mIsShow)
            return;
        self._tempN = 0;
        self._mIsShow = true;
        self.showIt();
        if (self._mShowParent != null)
            self._mShowParent.addChild(self);
    };
    UIElement.prototype.showIt = function () {
        var self = this;
        if (self._mIsShow == false || !self._mInit)
            return;
        self.onShow();
        self.alignRealize();
        self.showRealize();
        self.restPosition();
        self.addEvent();
        // mLog.log(this.name + " show times", ++self._tempN);
    };
    /*关闭界面用单例调用此方法, 请忽重写此方法， 如需打开界面时做点事情，重写onShow*/
    UIElement.prototype.hide = function () {
        this.doHide();
    };
    UIElement.prototype.slideHide = function () {
        this.tweenHide(this.doHide, this);
    };
    UIElement.prototype.doHide = function () {
        var self = this;
        if (!self._mIsShow)
            return;
        egret.Tween.removeTweens(self);
        self.removeEvent();
        self.onHide();
        if (self.parent != null)
            self.parent.removeChild(self);
        self._mIsShow = false;
        self.restProperty();
    };
    UIElement.prototype.cleanUiMask = function () {
        var self = this;
        if (self._mUiMask) {
            if (self._mUiMask.parent)
                self._mUiMask.parent.removeChild(self._mUiMask);
            self._mUiMask.graphics.clear();
            self._mUiMask = null;
            self._mIsMark = false;
        }
    };
    UIElement.prototype.cleanLoading = function () {
        var self = this;
        if (self._mLoadingGro) {
            var juHua = self._mLoadingGro.getChildByName("juHua");
            egret.Tween.removeTweens(juHua);
            self.removeChild(self._mLoadingGro);
            self._mLoadingGro = null;
        }
    };
    UIElement.prototype.alignRealize = function () {
        var self = this;
        switch (self._mUIAlignType) {
            case UIAlignStyle.MiddleCenter:
                self.x = (AGame.R.app.stageWidth - self.width) / 2;
                self.y = (AGame.R.app.stageHeight - self.height) / 2;
                break;
            case UIAlignStyle.BottomLeft:
                self.y = AGame.R.app.stageHeight - self.height;
                break;
        }
        this.fixMaskPos();
    };
    UIElement.prototype.fixMaskPos = function () {
        if (this._mIsMark) {
            this._mUiMask.x = -this.x;
            this._mUiMask.y = -this.y;
        }
    };
    UIElement.prototype.resetMaskPos = function () {
        if (this._mIsMark) {
            // this._mUiMask.scaleX = AGame.R.app.stageWidth;
            // this._mUiMask.scaleY = AGame.R.app.stageHeight;
            // this._mUiMask.width = GameConst.GameWidth*10;//AGame.R.app.stageWidth;
            // this._mUiMask.height = GameConst.GameHeight*10;//AGame.R.app.stageHeight;
            // this.fixMaskPos();
            this._mUiMask.graphics.clear();
            this._mUiMask.graphics.beginFill(0x000000, 1);
            this._mUiMask.graphics.drawRect(-100, -100, AGame.R.app.stageWidth + 200, AGame.R.app.stageHeight + 200);
            this._mUiMask.graphics.endFill();
        }
    };
    UIElement.prototype.showRealize = function () {
        var self = this;
        switch (self._mUIShowType) {
            case UIShowStyle.ScaleStyle:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self._mRecordScaleX = self.scaleX;
                self._mRecordScaleY = self.scaleY;
                self._mAnchorX = self.anchorOffsetX;
                self._mAnchorY = self.anchorOffsetY;
                self.anchorOffsetX = self.width / 2;
                self.anchorOffsetY = self.height / 2;
                self.x = self.x + (self.anchorOffsetX - self._mAnchorX);
                self.y = self.y + (self.anchorOffsetY - self._mAnchorY);
                var sx = (self._mRecordScaleX / 10);
                var sy = (self._mRecordScaleY / 10);
                egret.Tween.get(self)
                    .to({ scaleX: (self._mRecordScaleX + sx), scaleY: (self._mRecordScaleY + sy) }, 100)
                    .to({ scaleX: (self._mRecordScaleX - sx), scaleY: (self._mRecordScaleY - sy) }, 100)
                    .to({ scaleX: (self._mRecordScaleX), scaleY: (self._mRecordScaleY) }, 120)
                    .call(function A() {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
            case UIShowStyle.SlideLeftRight:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self.x = -self.width;
                egret.Tween.get(self).to({ x: self._mRecordX }, 200, Ease.quadOut)
                    .call(function A() {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
            case UIShowStyle.SlideRightLeft:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self.x = AGame.R.app.stageWidth + self.width;
                egret.Tween.get(self).to({ x: self._mRecordX }, 650, UIElement.elasticOut)
                    .call(function A() {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
            case UIShowStyle.SlideTopDown:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self.y = -self.height;
                egret.Tween.get(self).to({ y: self._mRecordY - self.height * 3 / 4 }, 300, Ease.circOut)
                    .to({ y: self._mRecordY }, 250)
                    .call(function A() {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
            case UIShowStyle.SlideBottomUp:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self.y = self.height + AGame.R.app.stageHeight;
                egret.Tween.get(self).to({ y: self._mRecordY + self.height * 1 / 4 }, 300, Ease.circOut)
                    .to({ y: self._mRecordY }, 250)
                    .call(function A() {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
            case UIShowStyle.PopPanel:
                self._mRecordX = self.x;
                self._mRecordY = self.y;
                self.y = self.y + 50;
                self.alpha = 0;
                egret.Tween.get(self)
                    .to({ y: self._mRecordY + 20, alpha: 0.5 }, 50)
                    .to({ y: self._mRecordY + 5, alpha: 0.8 }, 20, Ease.quadOut)
                    .to({ y: self._mRecordY, alpha: 1 }, 50)
                    .call(function () {
                    self.restProperty();
                    self.alignRealize();
                });
                break;
        }
    };
    UIElement.prototype.restProperty = function () {
        var self = this;
        self.x = self._mRecordX;
        self.y = self._mRecordY;
        self.anchorOffsetX = self._mAnchorX;
        self.anchorOffsetY = self._mAnchorY;
        self.scaleX = self._mRecordScaleX;
        self.scaleY = self._mRecordScaleY;
        self._mRecordX = 0;
        self._mRecordY = 0;
        self._mAnchorX = 0;
        self._mAnchorY = 0;
        self._mRecordScaleX = 1;
        self._mRecordScaleY = 1;
    };
    UIElement.prototype.removeChildrens = function (container) {
        var tc = null;
        for (var i = container.numChildren - 1; i >= 0; i--) {
            tc = container.getChildAt(i);
            if (tc instanceof egret.DisplayObjectContainer) {
                this.removeChildrens(tc);
            }
            if (tc instanceof egret.DisplayObject && tc.parent) {
                tc.parent.removeChild(tc);
            }
        }
    };
    /**
     * 界面销毁, 不需要使用hide()
     * 重写此方法后直接调用，并把单例设成null
     * @see：LoginView.getInstance().destroy();
     */
    UIElement.prototype.destroy = function () {
        var self = this;
        if (!self._mInit)
            return;
        self._mInit = false;
        self.hide();
        this.removeChildrens(this);
        self.cleanLoading();
        self.cleanUiMask();
        self.setSkin(null);
        self.onDestroy();
    };
    UIElement.prototype.touchUiMask = function () {
        this.slideHide();
    };
    UIElement.prototype.restPosition = function () { };
    ;
    /*在这里初始化，游戏界面相关信息*/
    UIElement.prototype.initialized = function () { };
    /*这里添加所需要的游戏事件，监听*/
    UIElement.prototype.addEvent = function () {
        EventCustomMgr.addEventListener(UIEvenType.SCREEN_RESIZE, this.onReSize, this);
        EventCustomMgr.addEventListener(UIEvenType.EXIT_2LOGINVIEW, this.onExit2LoginView, this);
        if (this._mUiMask && this.touchClose) {
            this._mUiMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchUiMask, this);
        }
    };
    /*界面里添加里的监听一定要移除，addEvent()有的监听，这里一定有对应的移除*/
    UIElement.prototype.removeEvent = function () {
        EventCustomMgr.removeEventListener(UIEvenType.SCREEN_RESIZE, this.onReSize, this);
        EventCustomMgr.removeEventListener(UIEvenType.EXIT_2LOGINVIEW, this.onExit2LoginView, this);
        if (this._mUiMask && this.touchClose) {
            this._mUiMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchUiMask, this);
        }
    };
    /*每次打开界面都会调用，初始化之后， 完全show 之前做点事情*/
    UIElement.prototype.onShow = function () {
        this.onReSize();
    };
    UIElement.prototype.tweenHide = function (callback, tagret) {
        var self = this;
        self._mRecordX = self.x;
        self._mRecordY = self.y;
        egret.Tween.get(self)
            .to({ y: self._mRecordY + 50, alpha: 0 }, 150, Ease.quadIn)
            .call(function () {
            callback.call(tagret);
        });
    };
    /*每次关闭界面都会调用，完全 hide之前做点事情*/
    UIElement.prototype.onHide = function () { };
    UIElement.prototype.onExit2LoginView = function () { };
    UIElement.prototype.onDestroy = function () { };
    UIElement.prototype.onReSize = function () {
        this.width = AGame.R.app.stageWidth;
        this.height = AGame.R.app.stageHeight;
        this.resetMaskPos();
    };
    UIElement._mInstance = null;
    UIElement.elasticOut = Ease.getElasticOut(1, 1);
    return UIElement;
}(UIBaseElement));
