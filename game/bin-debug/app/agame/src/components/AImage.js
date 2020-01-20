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
 * Created by yaowan on 2016/11/28.
 */
var AGame;
(function (AGame) {
    var AImage = /** @class */ (function (_super_1) {
        __extends(AImage, _super_1);
        function AImage() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        AImage.prototype.$hitTest = function (stageX, stageY) {
            if (this.touchEnabled) {
                return _super_1.prototype.$hitTest.call(this, stageX, stageY);
            }
            else {
                return null;
            }
        };
        return AImage;
    }(eui.Image));
    AGame.AImage = AImage;
})(AGame || (AGame = {}));
