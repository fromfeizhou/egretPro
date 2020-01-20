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
/**
 * Created by yaowan on 2017/1/4.
 */
var com_main;
(function (com_main) {
    var CLabel = /** @class */ (function (_super_1) {
        __extends(CLabel, _super_1);
        function CLabel() {
            var _this = _super_1.call(this) || this;
            _this._text = "";
            _this._label = "";
            //this.fontFamily = FontConst.defaultFontFamil;
            _this.size = 22;
            return _this;
        }
        Object.defineProperty(CLabel.prototype, "skinText", {
            set: function (vis) {
                if (vis) {
                    this.text = "";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CLabel.prototype, "alan", {
            set: function (lan) {
                this._text = GLan(lan);
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CLabel.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (str) {
                this._label = str;
                if (this._text != str) {
                    this._text = str;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CLabel.prototype, "fontColor", {
            set: function (color) {
                this._color = egret.getDefinitionByName("FontColorConst." + color);
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        CLabel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CLabel.prototype.commitProperties = function () {
            _super_1.prototype.commitProperties.call(this);
            if (this._text) {
                this.text = this._text;
            }
            if (this._color) {
                this.textColor = this._color;
            }
        };
        return CLabel;
    }(eui.Label));
    com_main.CLabel = CLabel;
})(com_main || (com_main = {}));
