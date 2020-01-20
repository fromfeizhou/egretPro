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
    var GeneralBaseView = /** @class */ (function (_super_1) {
        __extends(GeneralBaseView, _super_1);
        function GeneralBaseView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.width = width;
            _this.height = height;
            return _this;
        }
        GeneralBaseView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GeneralBaseView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralBaseView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        Object.defineProperty(GeneralBaseView.prototype, "generalId", {
            get: function () {
                return this.m_nGeneralId;
            },
            set: function (id) {
                this.m_nGeneralId = id;
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
                this.clearView();
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeneralBaseView.prototype, "generalVo", {
            get: function () {
                return this.m_generalVo;
            },
            enumerable: true,
            configurable: true
        });
        /**子类重写 */
        GeneralBaseView.prototype.refreshView = function () {
        };
        /**清理显示 */
        GeneralBaseView.prototype.clearView = function () {
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        GeneralBaseView.prototype.addEvent = function () {
        };
        GeneralBaseView.prototype.removeEvent = function () {
        };
        return GeneralBaseView;
    }(com_main.CComponent));
    com_main.GeneralBaseView = GeneralBaseView;
})(com_main || (com_main = {}));
