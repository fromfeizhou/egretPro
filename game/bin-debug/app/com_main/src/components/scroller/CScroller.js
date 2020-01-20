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
var Tween = egret.Tween;
var com_main;
(function (com_main) {
    var CScroller = /** @class */ (function (_super_1) {
        __extends(CScroller, _super_1);
        function CScroller() {
            var _this = _super_1.call(this) || this;
            _this.bBottom = false;
            _this.m_obj = null;
            _this.m_func = null;
            _this._arrowAlign = 1;
            _this._enabedArrow = true;
            /*移动的次数*/
            _this.moveCount = 0;
            _this.skinName = "resource/skins/components/CScroller.exml";
            return _this;
        }
        Object.defineProperty(CScroller.prototype, "arrowAlign", {
            get: function () {
                return this._arrowAlign;
            },
            /**
             * 箭头对齐方式
             * 0-突出模式 1-内嵌模式
             */
            set: function (value) {
                this._arrowAlign = value;
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        ///---让列表滚动到底，用tween方式
        CScroller.prototype.setObjFuc = function (obj, fuc) {
            this.m_obj = obj;
            this.m_func = fuc;
        };
        ///---让列表滚动到底，用tween方式
        CScroller.prototype.scrollTween = function (list) {
            egret.Tween.get(list).to({ scrollV: 0, ease: egret.Ease.quadOut }, 1000);
        };
        /**
         * 滚动到item index
         * @param list
         * @param index
         * @param tween
         * @param tweenTime
         */
        CScroller.prototype.scrollTo = function (list, index, tween, tweenTime) {
            if (tween === void 0) { tween = false; }
            if (tweenTime === void 0) { tweenTime = 200; }
            list.validateNow();
            if (index < 0 || index >= list.numElements) {
                return;
            }
            var pos = 0;
            var element = list.getElementAt(index);
            var itemHeight = 0;
            if (element == null) {
                itemHeight = (list.contentHeight / list.numElements);
                pos = index * itemHeight;
            }
            else {
                pos = element.y;
            }
            pos -= (this.height - itemHeight) * 0.5;
            if (pos + this.height > list.contentHeight) {
                pos = list.contentHeight - this.height;
            }
            if (pos < 0) {
                pos = 0;
            }
            if (tween == true) {
                if (this.tweener != null) {
                    egret.Tween.removeTweens(list);
                }
                this.tweener = egret.Tween.get(list).to({ scrollV: pos }, tweenTime);
            }
            else {
                list.scrollV = pos;
            }
        };
        CScroller.prototype.commitProperties = function () {
            _super_1.prototype.commitProperties.call(this);
            if (this._enabedArrow == true) {
                if (this._arrowAlign != 0) {
                    if (this.up_btn) {
                        this.up_btn.top = 0;
                        this.down_btn.bottom = 0;
                    }
                }
                else {
                    this.up_btn.top = -12;
                    this.down_btn.bottom = -12;
                }
            }
        };
        CScroller.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_ContentTip.text = GLan("noContent");
            this.scrollPolicyV = eui.ScrollPolicy.AUTO;
            this.bounces = true;
            if (this.verticalScrollBar) {
                this.verticalScrollBar.autoVisibility = false;
                this.verticalScrollBar.visible = true;
            }
            this.scrollPolicyH = eui.ScrollPolicy.OFF;
            eui.Scroller.scrollThreshold = 20;
            if (this._enabedArrow == true) {
                this.enableArrow();
            }
            else {
                this.disableArrow();
            }
            eui.Binding.bindHandler(this.viewport, ["dataProvider"], this.displayEmptyContent, this);
        };
        CScroller.prototype.displayEmptyContent = function (dataProvider) {
            if (dataProvider) {
                if (dataProvider.length <= 0) {
                    // this.emptyContent.visible = true;
                }
                else {
                    // this.emptyContent.visible = false;
                }
            }
        };
        /**
         * 允许显示滚动箭头
         */
        CScroller.prototype.enableArrow = function () {
            this._enabedArrow = true;
            if (this.up_btn) {
                if (this.viewport) {
                    Utils.TimerManager.doTimer(100, 1, this.updateBtn, this);
                }
                else {
                    this.up_btn.visible = false;
                    // this.up_btn2.visible = false;
                    this.down_btn.visible = true;
                    // this.down_btn2.visible = false;
                }
                if (this.hasEventListener(eui.UIEvent.CHANGE_END) == false) {
                    this.addEventListener(eui.UIEvent.CHANGE_END, this.onArrowChangeEnd, this);
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
                }
            }
        };
        /*移动事件*/
        CScroller.prototype.moveScroller = function (event) {
            this.moveCount++;
        };
        /**
         * 禁止显示滚动箭头
         */
        CScroller.prototype.disableArrow = function () {
            this._enabedArrow = false;
            if (this.up_btn) {
                this.up_btn.visible = false;
                // this.up_btn2.visible = false;
                this.down_btn.visible = false;
                // this.down_btn2.visible = false;
                this.removeEventListener(eui.UIEvent.CHANGE_END, this.onArrowChangeEnd, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
            }
        };
        CScroller.prototype.onArrowChangeEnd = function (event) {
            if (this.viewport.scrollV == 0) {
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_START));
            }
            else if ((this.viewport.scrollV + this.height) >= this.viewport.contentHeight && this.moveCount > 0) {
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_END));
            }
            else {
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_RANGE));
            }
            this.updateBtn();
            this.moveCount = 0;
        };
        CScroller.prototype.updateBtn = function () {
            this.validateNow();
            if (this._enabedArrow == false) {
                return;
            }
            if (this.viewport == null) {
                return;
            }
            if (this.up_btn == null) {
                return;
            }
            if (this.down_btn == null) {
                return;
            }
            if (this.viewport.scrollV == 0) {
                this.up_btn.visible = false;
            }
            else {
                this.up_btn.visible = true;
            }
            if ((this.viewport.scrollV + this.height) >= this.viewport.contentHeight) {
                this.down_btn.visible = false;
                if (this.viewport.scrollV) {
                    this.bBottom = true;
                    if (this.m_obj && this.m_func)
                        this.m_func.call(this.m_obj, this.bBottom);
                }
            }
            else {
                this.down_btn.visible = true;
            }
        };
        return CScroller;
    }(eui.Scroller));
    com_main.CScroller = CScroller;
})(com_main || (com_main = {}));
