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
/**
 * 限时活动解锁弹框
 */
var com_main;
(function (com_main) {
    var GiftBagTisPop = /** @class */ (function (_super_1) {
        __extends(GiftBagTisPop, _super_1);
        function GiftBagTisPop(param) {
            var _this = _super_1.call(this) || this;
            _this.m_type = param.type ? param.type : 1;
            _this.m_currId = param.giftId > 0 ? param.giftId : 0;
            _this.name = GiftBagTisPop.NAME;
            _this.initApp("activity/giftBag/GiftBagTipPopSkin.exml");
            return _this;
        }
        ; //进场动画
        GiftBagTisPop.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        };
        GiftBagTisPop.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
            this.actionGroup.play(0);
            this.initView();
            this.addEvent();
            GiftBagModel.isPopItem = false;
            GiftBagModel.isPopShop = false;
        };
        /**初始化界面 */
        GiftBagTisPop.prototype.initView = function () {
            var str;
            if (this.m_type == 1) {
                str = GCode(CLEnum.XSLB_TIP);
            }
            else {
                str = '您已经解锁了限时商城，有大量珍宝道具等着您！';
            }
            this.m_labTips.text = str;
            this.m_btnGoto.setTitleLabel(GCode(CLEnum.GO_TO));
        };
        /**关闭界面 */
        GiftBagTisPop.prototype.hidePanel = function () {
            com_main.UpManager.history();
        };
        /**前往限时活动界面 */
        GiftBagTisPop.prototype.onGotoGiftBag = function () {
            this.hidePanel();
            if (this.m_type == 1) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTBAG, this.m_currId);
            }
            else {
                Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP);
            }
        };
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        GiftBagTisPop.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnHide, this, this.hidePanel);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoGiftBag);
        };
        /**移除事件 */
        GiftBagTisPop.prototype.removeEvent = function () {
        };
        GiftBagTisPop.NAME = 'GiftBagTisPop';
        return GiftBagTisPop;
    }(com_main.CView));
    com_main.GiftBagTisPop = GiftBagTisPop;
})(com_main || (com_main = {}));
