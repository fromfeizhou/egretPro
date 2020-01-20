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
    var BagInfoWidget = /** @class */ (function (_super_1) {
        __extends(BagInfoWidget, _super_1);
        function BagInfoWidget() {
            var _this = _super_1.call(this) || this;
            _this.m_pMaxLevel = 0;
            _this.m_selct = false;
            _this.skinName = Utils.getSkinName("app/bag/bag_info_widget.exml");
            return _this;
        }
        BagInfoWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        BagInfoWidget.prototype.init = function (id) {
            this.m_pItemId = id;
            var cfg = PropModel.getCfg(id);
            if (cfg) {
                this.m_pMaxLevel = cfg.upperLimit;
            }
            this.updateLevel();
            this.touchChildren = false;
        };
        BagInfoWidget.prototype.updateLevel = function () {
            // 判断科技是否已经开放
            // if (TechnologyModel.isOpen(this.m_pTechId)) {
            // 	Utils.isGray(false, this.m_pImgTechIcon);
            // } else {
            // 	Utils.isGray(true, this.m_pImgTechIcon);
            // }
            // this.m_pLevel = TechnologyModel.getTechnologyLevel(this.m_pTechId);
            // this.m_pLbLevel.text = this.m_pLevel + "/" + this.m_pMaxLevel;
            this.m_pLbLevel.text = PropModel.getPropNum(this.m_pItemId).toString();
        };
        BagInfoWidget.prototype.hideContent = function () {
            this.m_pLbLevel.visible = false;
        };
        BagInfoWidget.prototype.getItemId = function () {
            return this.m_pItemId;
        };
        BagInfoWidget.prototype.setSelectImg = function (bshow) {
            this.m_imgSelect.visible = bshow;
        };
        return BagInfoWidget;
    }(com_main.CComponent));
    com_main.BagInfoWidget = BagInfoWidget;
})(com_main || (com_main = {}));
