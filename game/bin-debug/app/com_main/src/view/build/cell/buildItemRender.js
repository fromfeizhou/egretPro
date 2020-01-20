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
    var buildItemRender = /** @class */ (function (_super_1) {
        __extends(buildItemRender, _super_1);
        function buildItemRender() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("map/build/build_info_effect_item_Skin.exml");
            return _this;
        }
        buildItemRender.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        buildItemRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        buildItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置显示信息 */
        buildItemRender.prototype.setInfo = function (dec, currValue, nextValue) {
            this.m_pLbCurLvValue.text = currValue;
            this.m_pLbLvUpDesc.text = dec;
            this.m_pLbNextLvValue.text = nextValue;
        };
        return buildItemRender;
    }(com_main.CComponent));
    com_main.buildItemRender = buildItemRender;
})(com_main || (com_main = {}));
