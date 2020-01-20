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
    var CImageFlow = /** @class */ (function (_super_1) {
        __extends(CImageFlow, _super_1);
        function CImageFlow(type) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("tavern/test.exml");
            return _this;
        }
        CImageFlow.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        return CImageFlow;
    }(com_main.CComponent));
    com_main.CImageFlow = CImageFlow;
})(com_main || (com_main = {}));
