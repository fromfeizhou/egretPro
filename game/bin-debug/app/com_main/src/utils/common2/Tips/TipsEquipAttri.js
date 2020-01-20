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
    var TipsEquipAttri = /** @class */ (function (_super_1) {
        __extends(TipsEquipAttri, _super_1);
        function TipsEquipAttri() {
            return _super_1.call(this) || this;
        }
        TipsEquipAttri.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TipsEquipAttri.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TipsEquipAttri.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.refresh();
        };
        TipsEquipAttri.prototype.refresh = function () {
            this.m_labCurLv.text = this.m_tData.currName;
            this.m_labCurLv0.text = this.m_tData.currValue;
            this.m_labCurLv1.text = this.m_tData.nextName;
            this.m_labCurLv2.text = '+' + this.m_tData.nextValue;
        };
        return TipsEquipAttri;
    }(eui.ItemRenderer));
    com_main.TipsEquipAttri = TipsEquipAttri;
})(com_main || (com_main = {}));
