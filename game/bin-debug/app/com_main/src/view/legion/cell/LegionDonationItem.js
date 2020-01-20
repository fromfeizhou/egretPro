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
    var LegionDonationItem = /** @class */ (function (_super_1) {
        __extends(LegionDonationItem, _super_1);
        function LegionDonationItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("legion/tabView/LegionDonationCellSkin.exml");
            return _this;
        }
        LegionDonationItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        LegionDonationItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        LegionDonationItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**显示信息 */
        LegionDonationItem.prototype.shoWInfo = function (name, level, des, source) {
            this.m_labName.text = name;
            this.m_labLevel.text = GCode(CLEnum.LEVEL2) + level.toString();
            this.m_labDes.text = des;
            this.m_imgIcon.source = source + '_png';
            Utils.isGray(level == 0, this.m_pIconRoot);
        };
        return LegionDonationItem;
    }(com_main.CComponent));
    com_main.LegionDonationItem = LegionDonationItem;
})(com_main || (com_main = {}));
