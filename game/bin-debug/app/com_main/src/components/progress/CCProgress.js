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
    var CCProgress = /** @class */ (function (_super_1) {
        __extends(CCProgress, _super_1);
        /**
         * type: ProgressTypes
         */
        function CCProgress(type) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getComSkin("progress/" + type + ".exml");
            _this.m_pType = type;
            _this.m_pConfig = ProgressData.loadConfig(type);
            return _this;
        }
        CCProgress.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.m_pPro.width = this.m_pConfig.min;
        };
        CCProgress.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            egret.Tween.removeTweens(this);
            if (this.m_pPro) {
                egret.Tween.removeTweens(this.m_pPro);
                this.m_pPro = null;
            }
            if (this.m_pPro1) {
                egret.Tween.removeTweens(this.m_pPro1);
                this.m_pPro1 = null;
            }
        };
        Object.defineProperty(CCProgress.prototype, "value", {
            get: function () {
                return this.m_pValue;
            },
            /**设置百分比 0~100 % */
            set: function (value) {
                var cfg = this.m_pConfig;
                value = value > 100 ? 100 : value;
                value = value < 0 ? 0 : value;
                this.m_pValue = value;
                var w = cfg.max * value / 100;
                this.m_pPro.width = w;
                if (this.m_pPro1) {
                    this.m_pPro1.x = this.m_pPro.x + this.m_pPro.width;
                    this.m_pPro1.visible = w > 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCProgress.prototype, "text", {
            set: function (str) {
                if (this.m_pLabel)
                    this.m_pLabel.text = str;
            },
            enumerable: true,
            configurable: true
        });
        CCProgress.prototype.setIconVisible = function (visible) {
            this.m_pIcon.visible = visible;
        };
        CCProgress.prototype.playTextAnim = function (callback, thisArg) {
            com_main.CEffectFunc.textBounceAction(this.m_pLabel, callback, thisArg);
        };
        /**
         * 缓动设值
         */
        CCProgress.prototype.setValueWithTween = function (value, callback, thisArg) {
            var cfg = this.m_pConfig;
            value = value > 100 ? 100 : value;
            value = value < 0 ? 0 : value;
            this.m_pValue = value;
            var w = cfg.max * value / 100;
            var tweenSpeed = 1200;
            var preEffectTime = 200;
            var startWait = 300;
            var tw = egret.Tween.get(this.m_pPro);
            tw.wait(startWait);
            tw.to({ scaleY: 1.5 }, preEffectTime);
            tw.to({ scaleY: 1 }, preEffectTime);
            tw.to({ width: w }, tweenSpeed);
            tw.call(function () {
                if (callback && thisArg)
                    callback.call(thisArg);
            }, this);
            if (this.m_pPro1) {
                var targetX = this.m_pPro.x + w;
                egret.Tween.get(this.m_pPro1)
                    .wait(startWait)
                    .wait(preEffectTime * 2)
                    .to({ x: targetX }, tweenSpeed);
                this.m_pPro1.visible = w > 0;
            }
        };
        CCProgress.prototype.setValueWithTween2 = function (value, count, callback, thisArg) {
            var cfg = this.m_pConfig;
            value = value > 100 ? 100 : value;
            value = value < 0 ? 0 : value;
            this.m_pValue = value;
            var w = cfg.max * value / 100;
            var tweenSpeed = 1500;
            var tw = egret.Tween.get(this.m_pPro);
            tw.to({ width: w }, tweenSpeed);
            tw.call(function () {
                if (callback && thisArg)
                    callback.call(thisArg);
            }, this);
            if (this.m_pPro1) {
                var targetX = this.m_pPro.x + w;
                egret.Tween.get(this.m_pPro1).to({ x: targetX }, tweenSpeed);
                this.m_pPro1.visible = w > 0;
            }
        };
        return CCProgress;
    }(com_main.CComponent));
    com_main.CCProgress = CCProgress;
})(com_main || (com_main = {}));
