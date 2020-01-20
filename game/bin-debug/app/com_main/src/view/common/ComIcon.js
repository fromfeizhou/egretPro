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
    var ComIcon = /** @class */ (function (_super_1) {
        __extends(ComIcon, _super_1);
        function ComIcon() {
            var _this = _super_1.call(this) || this;
            _this.name = ComIcon.NAME;
            _this.skinName = Utils.getAppSkin("common/ComIconSkin.exml");
            return _this;
        }
        ComIcon.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        ComIcon.prototype.setInfo = function (iconUrl, labUrl) {
            this.m_imgBg.source = iconUrl;
            this.m_imgLab.source = labUrl;
        };
        Object.defineProperty(ComIcon.prototype, "root", {
            /**监听事件用 */
            get: function () {
                return this.m_pRoot;
            },
            enumerable: true,
            configurable: true
        });
        ComIcon.NAME = 'ComIcon';
        return ComIcon;
    }(com_main.CComponent));
    com_main.ComIcon = ComIcon;
})(com_main || (com_main = {}));
