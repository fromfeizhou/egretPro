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
    var buildCanAtionItem = /** @class */ (function (_super_1) {
        __extends(buildCanAtionItem, _super_1);
        /**
         * 主城升级可解锁建筑
         * @item
         */
        function buildCanAtionItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/map/build/build_can_action_item_Skin.exml");
            return _this;
        }
        buildCanAtionItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        buildCanAtionItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        buildCanAtionItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置显示信息 */
        buildCanAtionItem.prototype.setInfo = function (type, name) {
            this.m_pBuildIcon.source = Utils.getMainBuildTexture(type);
            this.m_pLbBuildName.text = GLanFormat(name);
            this.setInfoPoint(type);
        };
        /**设置显示大小位置 */
        buildCanAtionItem.prototype.setInfoPoint = function (type) {
            this.m_pBuildIcon.scaleX = 1;
            this.m_pBuildIcon.scaleY = 1;
            this.m_pBuildIcon.horizontalCenter = 0;
            this.m_pBuildIcon.verticalCenter = 0;
            if (type == 6 || type == 8 || type == 10 || type == 12 || type == 14 || type == 22) {
                this.m_pBuildIcon.scaleX = 0.7;
                this.m_pBuildIcon.scaleY = 0.7;
            }
            if (type == 10 || type == 14) {
                this.m_pBuildIcon.horizontalCenter = 15;
                this.m_pBuildIcon.verticalCenter = -5;
            }
            if (type == 22 || type == 10 || type == 14) { //藏书阁,军机处,过关斩将 中心位置微调
                this.m_pBuildIcon.verticalCenter = -15;
            }
        };
        return buildCanAtionItem;
    }(com_main.CComponent));
    com_main.buildCanAtionItem = buildCanAtionItem;
})(com_main || (com_main = {}));
