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
    var CView = /** @class */ (function (_super_1) {
        __extends(CView, _super_1);
        function CView() {
            var _this = _super_1.call(this) || this;
            _this.popType = com_main.UpManager.STYLE_UP;
            _this.lan = L.getInstance().getObject();
            return _this;
        }
        CView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.lan = null;
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        CView.prototype.resize = function () {
        };
        CView.prototype.onMaskClick = function () {
        };
        CView.prototype.onRefresh = function (body) {
            //Guide.uiCall(this.name);
        };
        /**检查新手引导面板条件 */
        CView.prototype.onGuideCondition = function () {
            // EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION,IGUIDECD.SCENE);
        };
        return CView;
    }(AGame.View));
    com_main.CView = CView;
})(com_main || (com_main = {}));
