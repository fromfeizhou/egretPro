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
     * 提示弹框
     */
    var PromptTextWnd = /** @class */ (function (_super_1) {
        __extends(PromptTextWnd, _super_1);
        function PromptTextWnd(str, isWarning, defaultSize) {
            if (str === void 0) { str = ""; }
            if (isWarning === void 0) { isWarning = false; }
            if (defaultSize === void 0) { defaultSize = 50; }
            var _this = _super_1.call(this) || this;
            _this.name = PromptTextWnd.NAME;
            _this.skinName = Utils.getAppSkin('common/PromptTextSkin.exml');
            _this.touchEnabled = false;
            _this.cacheAsBitmap = true;
            _this.init(str, isWarning, defaultSize);
            return _this;
        }
        PromptTextWnd.create = function (str, isWarning, defaultSize) {
            if (str === void 0) { str = ""; }
            if (isWarning === void 0) { isWarning = false; }
            if (defaultSize === void 0) { defaultSize = 50; }
            var obj = ObjectPool.pop(com_main.PromptTextWnd, "PromptTextWnd", str, isWarning, defaultSize);
            return obj;
        };
        PromptTextWnd.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
        };
        PromptTextWnd.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        PromptTextWnd.prototype.init = function (str, isWarning, defaultSize) {
            if (str === void 0) { str = ""; }
            if (isWarning === void 0) { isWarning = false; }
            if (defaultSize === void 0) { defaultSize = 50; }
            NodeUtils.reset(this);
            this.m_pTextLabel.textFlow = Utils.htmlParser(str);
            this.m_pTextLabel.stroke = 1;
            this.m_pTextLabel.strokeColor = 0x000000;
            // this.m_pTextLabel.textColor = isWarning ? GameConfig.TextColors.red : GameConfig.TextColors.fontWhite;
            if (this.m_pTextLabel.width + PromptTextWnd.LabelOffset >= defaultSize) {
                this.setWidth(this.m_pTextLabel.width + PromptTextWnd.LabelOffset);
            }
            else {
                this.setWidth(defaultSize);
            }
        };
        PromptTextWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        PromptTextWnd.prototype.setWidth = function (w) {
            this.width = w;
        };
        PromptTextWnd.NAME = 'PromptTextWnd';
        PromptTextWnd.LabelOffset = 42;
        return PromptTextWnd;
    }(com_main.CComponent));
    com_main.PromptTextWnd = PromptTextWnd;
})(com_main || (com_main = {}));
