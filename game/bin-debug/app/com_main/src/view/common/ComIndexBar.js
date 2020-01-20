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
     * 自定义滑动条
     */
    var ComIndexBar = /** @class */ (function (_super_1) {
        __extends(ComIndexBar, _super_1);
        function ComIndexBar() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/ComIndexBarSkin.exml");
            return _this;
        }
        ComIndexBar.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComIndexBar.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            this.clearImgAction();
            this.m_changeFunc = null;
            this.m_changeObj = null;
            _super_1.prototype.onDestroy.call(this);
        };
        ComIndexBar.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_nIndex = 0;
            com_main.EventManager.addTouchScaleListener(this.m_pLeftBtn, this, function () {
                var val = _this.m_nIndex - 1;
                val = Math.max(val, 0);
                _this.changeIndex(val);
            });
            com_main.EventManager.addTouchScaleListener(this.m_pRightBtn, this, function () {
                var val = _this.m_nIndex + 1;
                val = Math.min(val, _this.m_nMax - 1);
                _this.changeIndex(val);
            });
        };
        /**初始化 */
        ComIndexBar.prototype.initBar = function (cur, max, changeFunc, changeObj) {
            this.m_nIndex = cur;
            this.m_nMax = max;
            this.m_changeFunc = changeFunc;
            this.m_changeObj = changeObj;
            this.createPoint();
        };
        Object.defineProperty(ComIndexBar.prototype, "index", {
            /**获得当前下标 */
            get: function () {
                return this.m_nIndex;
            },
            /**设置当前下标 */
            set: function (curIndex) {
                this.m_nIndex = curIndex;
            },
            enumerable: true,
            configurable: true
        });
        /**切换按钮回调 */
        ComIndexBar.prototype.changeIndex = function (val) {
            if (this.m_nIndex == val)
                return;
            if (this.m_nIndex > val) {
                //右
                this.m_tImgs.unshift(this.m_tImgs.pop());
            }
            else {
                //左
                this.m_tImgs.push(this.m_tImgs.shift());
            }
            this.m_nIndex = val;
            this.refreshPos(true);
            if (this.m_changeFunc && this.m_changeObj) {
                this.m_changeFunc.call(this.m_changeObj);
            }
        };
        /**创建节点 */
        ComIndexBar.prototype.createPoint = function () {
            Utils.removeAllChild(this.m_pPoints);
            this.m_tImgs = [];
            for (var i = 0; i < ComIndexBar.UI_INFOS.length; i++) {
                var img = new eui.Image('border_1017_png');
                AnchorUtil.setAnchorCenter(img);
                img.y = 15;
                this.m_pPoints.addChild(img);
                this.m_tImgs.push(img);
            }
            this.refreshPos();
        };
        /**刷新位置 */
        ComIndexBar.prototype.refreshPos = function (isAction) {
            if (isAction === void 0) { isAction = false; }
            this.clearImgAction();
            var _a = [this.m_nIndex - 3, this.m_nIndex + 4], begin = _a[0], end = _a[1]; //取值范围为7
            var imgIndex = 0;
            for (var i = begin; i < end; i++) {
                var img = this.m_tImgs[imgIndex];
                if (i < 0 || i >= this.m_nMax) {
                    img.visible = false;
                }
                else {
                    img.visible = true;
                    var info = ComIndexBar.UI_INFOS[imgIndex];
                    if (isAction) {
                        var tw = egret.Tween.get(img);
                        tw.to({ x: info.x, alpha: info.alpha, scaleX: info.scale, scaleY: info.scale }, 200, Ease.cubicOut);
                    }
                    else {
                        img.x = info.x;
                        img.alpha = info.alpha;
                        NodeUtils.setScale(img, info.scale);
                    }
                }
                imgIndex++;
            }
        };
        /**清理动画 */
        ComIndexBar.prototype.clearImgAction = function () {
            for (var i = 0; i < this.m_tImgs.length; i++) {
                egret.Tween.removeTweens(this.m_tImgs[i]);
            }
        };
        /**ui显示位置 */
        ComIndexBar.UI_INFOS = [
            { x: 30, alpha: 0, scale: 0 },
            { x: 55, alpha: 0.5, scale: 0.5 },
            { x: 77, alpha: 0.75, scale: 0.75 },
            { x: 100, alpha: 1, scale: 1 },
            { x: 123, alpha: 0.75, scale: 0.75 },
            { x: 145, alpha: 0.5, scale: 0.5 },
            { x: 170, alpha: 0, scale: 0 },
        ];
        return ComIndexBar;
    }(com_main.CComponent));
    com_main.ComIndexBar = ComIndexBar;
})(com_main || (com_main = {}));
