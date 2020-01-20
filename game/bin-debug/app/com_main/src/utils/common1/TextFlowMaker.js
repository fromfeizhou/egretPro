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
 * Created by Saco on 2015/10/26.
 */
var TextFlowMaker = /** @class */ (function (_super_1) {
    __extends(TextFlowMaker, _super_1);
    function TextFlowMaker() {
        var _this = _super_1.call(this) || this;
        _this.STYLE_COLOR = "C";
        _this.STYLE_SIZE = "S";
        _this.PROP_TEXT = "T";
        return _this;
    }
    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    TextFlowMaker.prototype.generateTextFlow = function (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    TextFlowMaker.prototype.getSingleTextFlow = function (text) {
        var textArr = text.split("&");
        var tempArr;
        var textFlow = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                textFlow.text = tempArr[1];
            }
            else if (tempArr[0] == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(tempArr[1]);
            }
            else if (tempArr[0] == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(tempArr[1]);
            }
            else {
                textFlow.text = tempArr[0];
            }
        }
        return textFlow;
    };
    return TextFlowMaker;
}(BaseClass));
