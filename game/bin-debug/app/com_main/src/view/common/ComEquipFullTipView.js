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
    var ComEquipFullTipView = /** @class */ (function (_super_1) {
        __extends(ComEquipFullTipView, _super_1);
        /**奖励通用界面 */
        function ComEquipFullTipView(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ComEquipFullTipView.NAME;
            _this.m_type = param.type;
            _this.initApp("common/ComEquipFullTipViewSkin.exml");
            return _this;
        }
        ComEquipFullTipView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ComEquipFullTipView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initView();
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.ClickGoto);
        };
        ComEquipFullTipView.prototype.initView = function () {
            this.m_imgTitle.source = this.m_type == 1 ? 'lb_zbym_png' : 'lb_zbspym_png';
            this.m_labDec.text = this.m_type == 1 ? GCode(CLEnum.EQUIP_FULL) : GCode(CLEnum.EQUIP_SOUL_FULL);
            this.m_labTip.text = this.m_type == 1 ? GCode(CLEnum.EQUIP_RECOVER_TIPS) : '';
            var str = this.m_type == 1 ? GCode(CLEnum.EQUIP_TO_RECOVER) : GCode(CLEnum.EQUIP_TO_COMPOSE);
            this.m_btnGoto.setTitleLabel(str);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.ClickGoto);
        };
        ComEquipFullTipView.prototype.ClickGoto = function () {
            com_main.UpManager.close();
            var gotoId = this.m_type == 1 ? 100017 : 100016;
            FunctionModel.funcToPanel(gotoId);
        };
        ComEquipFullTipView.NAME = "ComEquipFullTipView";
        return ComEquipFullTipView;
    }(com_main.CView));
    com_main.ComEquipFullTipView = ComEquipFullTipView;
})(com_main || (com_main = {}));
