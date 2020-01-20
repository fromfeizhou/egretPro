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
    /**宝石套装预览cell */
    var ComStoneSuitCell = /** @class */ (function (_super_1) {
        __extends(ComStoneSuitCell, _super_1);
        function ComStoneSuitCell() {
            var _this = _super_1.call(this) || this;
            _this.m_bIsActivated = true;
            _this.skinName = Utils.getAppSkin("common/ComStoneSuitCellSkin.exml");
            return _this;
        }
        ComStoneSuitCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置石头类型 */
        ComStoneSuitCell.prototype.setPropStoneType = function (type) {
            if (this.m_nType == type)
                return;
            this.m_nType = type;
            this.m_imgIcon.source = TreasureModel.getPropStoneTypeIcon(type);
            this.m_labName.text = TreasureModel.getPropStoneTypeName(type);
        };
        /**是否激活 */
        ComStoneSuitCell.prototype.setActivate = function (val) {
            if (this.m_bIsActivated == val)
                return;
            this.m_bIsActivated = val;
            Utils.isGray(!val, this.m_imgIcon);
            if (val) {
                this.m_labName.textColor = GameConfig.TextColors.fontWhite;
            }
            else {
                this.m_labName.textColor = GameConfig.TextColors.grayWhite;
            }
        };
        return ComStoneSuitCell;
    }(com_main.CComponent));
    com_main.ComStoneSuitCell = ComStoneSuitCell;
})(com_main || (com_main = {}));
