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
    var SevenIILoginTabCell = /** @class */ (function (_super_1) {
        __extends(SevenIILoginTabCell, _super_1);
        function SevenIILoginTabCell(param) {
            var _this = _super_1.call(this) || this;
            _this.m_days = param.loginDays;
            _this.m_reward = param.reward;
            _this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIILoginTabCellSkin.exml");
            return _this;
        }
        SevenIILoginTabCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        SevenIILoginTabCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        SevenIILoginTabCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.setBtnInfo();
        };
        /**选中状态 */
        SevenIILoginTabCell.prototype.setSelect = function (state) {
            this.m_imgSelect.visible = state;
        };
        /**设置按钮信息 */
        SevenIILoginTabCell.prototype.setBtnInfo = function () {
            var numStr = Global.getChineseNum(this.m_days);
            this.m_labNum.text = numStr;
            this.m_ComItem.setItemInfo(this.m_reward[0].itemId, this.m_reward[0].count);
            this.m_ComItem.openTips = false;
        };
        return SevenIILoginTabCell;
    }(com_main.CComponent));
    com_main.SevenIILoginTabCell = SevenIILoginTabCell;
})(com_main || (com_main = {}));
