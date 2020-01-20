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
    /**属性 */
    var ComAttriRender = /** @class */ (function (_super_1) {
        __extends(ComAttriRender, _super_1);
        function ComAttriRender() {
            return _super_1.call(this) || this;
        }
        ComAttriRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ComAttriRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        ComAttriRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.currentState = this.m_tData.state;
                this.commitProperties();
            }
            this.refresh();
            var isGay = this.m_tData.isGay;
            if (isGay == null)
                return;
            Utils.isGray(isGay, this);
        };
        ComAttriRender.prototype.refresh = function () {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.text = this.m_tData.value;
        };
        return ComAttriRender;
    }(eui.ItemRenderer));
    com_main.ComAttriRender = ComAttriRender;
    /**属性 */
    var ComAttriRenderII = /** @class */ (function (_super_1) {
        __extends(ComAttriRenderII, _super_1);
        function ComAttriRenderII() {
            return _super_1.call(this) || this;
        }
        ComAttriRenderII.prototype.refresh = function () {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.textFlow = Utils.htmlParser(this.m_tData.value);
        };
        return ComAttriRenderII;
    }(ComAttriRender));
    com_main.ComAttriRenderII = ComAttriRenderII;
})(com_main || (com_main = {}));
