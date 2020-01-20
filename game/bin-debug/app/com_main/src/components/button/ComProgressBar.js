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
     *
     * @author
     *
     */
    var ComProgressBar = /** @class */ (function (_super_1) {
        __extends(ComProgressBar, _super_1);
        function ComProgressBar() {
            return _super_1.call(this) || this;
        }
        Object.defineProperty(ComProgressBar.prototype, "Progress", {
            get: function () {
                return this._progress;
            },
            set: function (progress) {
                if (progress > 1)
                    this._progress = 1;
                else if (progress < 0)
                    this._progress = 0;
                else
                    this._progress = progress;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });
        ComProgressBar.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
        };
        ComProgressBar.prototype.refresh = function () {
            var _this = this;
            egret.callLater(function () {
                if (_this.m_Bar) {
                    _this.m_Bar.width = _this._progress * _this.width;
                }
            }, this);
        };
        ComProgressBar.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        return ComProgressBar;
    }(com_main.CComponent));
    com_main.ComProgressBar = ComProgressBar;
})(com_main || (com_main = {}));
