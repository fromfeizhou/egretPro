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
    /**职业小图标 */
    var ComProIcon = /** @class */ (function (_super_1) {
        __extends(ComProIcon, _super_1);
        function ComProIcon() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/com_icon_pro.exml");
            return _this;
        }
        ComProIcon.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        Object.defineProperty(ComProIcon.prototype, "iconBg", {
            set: function (source) {
                this.m_imgBg.source = source;
            },
            enumerable: true,
            configurable: true
        });
        return ComProIcon;
    }(com_main.CComponent));
    com_main.ComProIcon = ComProIcon;
})(com_main || (com_main = {}));
