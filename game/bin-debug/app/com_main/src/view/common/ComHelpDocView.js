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
    var ComHelpDocView = /** @class */ (function (_super_1) {
        __extends(ComHelpDocView, _super_1);
        function ComHelpDocView(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ComHelpDocView.NAME;
            _this.initApp("common/ComHelpDocSkin.exml");
            _this.m_content = param.content;
            _this.m_title = param.title;
            return _this;
        }
        ComHelpDocView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ComHelpDocView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.WOR_HELP_TITLE));
            this.refresh();
        };
        /**刷新面板 */
        ComHelpDocView.prototype.refresh = function () {
            this.m_lbContent.textFlow = Utils.htmlParser(this.m_content);
            if (isNull(this.m_title))
                return;
            this.m_apopUp.setTitleLabel(this.m_title);
        };
        ComHelpDocView.NAME = "ComHelpDocView";
        return ComHelpDocView;
    }(com_main.CView));
    com_main.ComHelpDocView = ComHelpDocView;
})(com_main || (com_main = {}));
