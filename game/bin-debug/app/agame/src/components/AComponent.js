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
var AGame;
(function (AGame) {
    var AComponent = /** @class */ (function (_super_1) {
        __extends(AComponent, _super_1);
        function AComponent() {
            return _super_1.call(this) || this;
        }
        Object.defineProperty(AComponent.prototype, "param", {
            set: function (param) {
                this.m_pParam = param;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.onDestroy = function () {
        };
        AComponent.prototype.removeFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        AComponent.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            if (isclear) {
                this.m_pParam = null;
                this.setSkin(null);
            }
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        Object.defineProperty(AComponent.prototype, "skinName", {
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        return AComponent;
    }(eui.Component));
    AGame.AComponent = AComponent;
    var AButton = /** @class */ (function (_super_1) {
        __extends(AButton, _super_1);
        function AButton() {
            return _super_1.call(this) || this;
        }
        AButton.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            if (isclear) {
                this.setSkin(null);
            }
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        AButton.prototype.removeFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        Object.defineProperty(AButton.prototype, "skinName", {
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        return AButton;
    }(eui.Button));
    AGame.AButton = AButton;
    var ARadioButton = /** @class */ (function (_super_1) {
        __extends(ARadioButton, _super_1);
        function ARadioButton() {
            return _super_1.call(this) || this;
        }
        Object.defineProperty(ARadioButton.prototype, "skinName", {
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        ARadioButton.prototype.$onRemoveFromStage = function () {
            this.setSkin(null);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        return ARadioButton;
    }(eui.RadioButton));
    AGame.ARadioButton = ARadioButton;
    var AHSlider = /** @class */ (function (_super_1) {
        __extends(AHSlider, _super_1);
        function AHSlider() {
            var _this = _super_1.call(this) || this;
            _this.liveDragging = true;
            return _this;
        }
        Object.defineProperty(AHSlider.prototype, "skinName", {
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        AHSlider.prototype.onTrackTouchBegin = function (event) {
            _super_1.prototype.onTrackTouchBegin.call(this, event);
            this.thumb.once(egret.TouchEvent.TOUCH_MOVE, this.onThumbTouchBegin, this);
        };
        AHSlider.prototype.$onRemoveFromStage = function () {
            this.setSkin(null);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        return AHSlider;
    }(eui.HSlider));
    AGame.AHSlider = AHSlider;
})(AGame || (AGame = {}));
