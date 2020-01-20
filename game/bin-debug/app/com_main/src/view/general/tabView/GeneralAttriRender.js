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
    /**属性 */
    var GeneralAttriRender = /** @class */ (function (_super_1) {
        __extends(GeneralAttriRender, _super_1);
        function GeneralAttriRender() {
            return _super_1.call(this) || this;
        }
        GeneralAttriRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            if (this.m_attriTip) {
                Utils.removeFromParent(this.m_attriTip);
            }
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnVipShopHandler, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.hideTips, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_END, this.hideTips, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.hideTips, this);
        };
        GeneralAttriRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.list = {};
            this.list[AttriType.POWER] = 'common_pow';
            this.list[AttriType.INTELLIGENCE] = 'common_intell';
            this.list[AttriType.LEADERSHIP] = 'common_leader';
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnVipShopHandler, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.hideTips, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_END, this.hideTips, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.hideTips, this);
            // EventManager.addTouchScaleListener(this.m_imgIcon, this, this.onBtnVipShopHandler);
        };
        GeneralAttriRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.currentState = this.m_tData.state;
                this.commitProperties();
            }
            this.refresh();
            var isGay = this.m_tData.isGay;
            if (isGay == null)
                return;
            Utils.isGray(isGay, this);
        };
        GeneralAttriRender.prototype.refresh = function () {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.text = this.m_tData.value;
            this.m_imgIcon.source = this.list[this.m_tData.icon] + '_png';
        };
        /**属性提示 */
        GeneralAttriRender.prototype.onBtnVipShopHandler = function (e) {
            var target = e.currentTarget;
            var point = target.parent.localToGlobal(target.x, target.y);
            if (this.m_attriTip) {
                this.m_attriTip.visible = true;
                this.m_attriTip.doAction(true);
            }
            else {
                this.m_attriTip = new com_main.GeneralAttriTip(this.m_tData.icon);
                this.m_attriTip.y = 200;
                point.x = point.x + target.width - 180;
                this.m_attriTip.x = point.x;
                this.m_attriTip.doAction(true);
                AGame.R.app.topLevel.addChild(this.m_attriTip);
            }
            e.stopPropagation();
        };
        /**隐藏提示 */
        GeneralAttriRender.prototype.hideTips = function () {
            if (this.m_attriTip && this.m_attriTip.visible) {
                this.m_attriTip.visible = false;
            }
            if (this.m_attriTip && this.m_attriTip.visible) {
                this.m_attriTip.visible = false;
            }
        };
        return GeneralAttriRender;
    }(eui.ItemRenderer));
    com_main.GeneralAttriRender = GeneralAttriRender;
    /**属性 */
    var GeneralAttriRenderII = /** @class */ (function (_super_1) {
        __extends(GeneralAttriRenderII, _super_1);
        function GeneralAttriRenderII() {
            return _super_1.call(this) || this;
        }
        GeneralAttriRenderII.prototype.refresh = function () {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.textFlow = Utils.htmlParser(this.m_tData.value);
        };
        return GeneralAttriRenderII;
    }(GeneralAttriRender));
    com_main.GeneralAttriRenderII = GeneralAttriRenderII;
})(com_main || (com_main = {}));
