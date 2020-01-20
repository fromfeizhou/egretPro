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
    var ItemSourceViewRender = /** @class */ (function (_super_1) {
        __extends(ItemSourceViewRender, _super_1);
        function ItemSourceViewRender() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/item_source_view_render.exml");
            return _this;
        }
        ItemSourceViewRender.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ItemSourceViewRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ItemSourceViewRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnGoto.setTitleLabel(GCode(CLEnum.GO_TO));
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onBtnGoClick);
        };
        ItemSourceViewRender.prototype.setItemId = function (id) {
            this.m_nCfgId = id;
            this.reSoureInfo();
        };
        /**设置来源显示信息 */
        ItemSourceViewRender.prototype.reSoureInfo = function () {
            var cfg = C.TurnPanelConfig[this.m_nCfgId];
            if (!cfg || cfg.image == '')
                return;
            this.m_imgIcon.source = cfg.image + "_png";
            this.m_labName.text = cfg.description;
        };
        /**点击前往回调 */
        ItemSourceViewRender.prototype.onBtnGoClick = function () {
            com_main.UpManager.history();
            FunctionModel.funcToPanel(this.m_nCfgId);
            //let cfg = C.TurnPanelConfig[this.m_nCfgId];
            //if(!cfg) return;
            //Utils.open_view(cfg.page);
        };
        return ItemSourceViewRender;
    }(com_main.CComponent));
    com_main.ItemSourceViewRender = ItemSourceViewRender;
})(com_main || (com_main = {}));
