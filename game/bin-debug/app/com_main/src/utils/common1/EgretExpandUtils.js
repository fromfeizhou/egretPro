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
 * Created by yangsong on 15-1-23.
 * 引擎扩展类
 */
var EgretExpandUtils = /** @class */ (function (_super_1) {
    __extends(EgretExpandUtils, _super_1);
    /**
     * 构造函数
     */
    function EgretExpandUtils() {
        return _super_1.call(this) || this;
    }
    /**
     * 初始化函数
     */
    EgretExpandUtils.prototype.init = function () {
        AnchorUtil.init();
    };
    return EgretExpandUtils;
}(BaseClass));
