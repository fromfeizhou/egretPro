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
    /**
     * 充值面板
     */
    var PayShopView = /** @class */ (function (_super_1) {
        __extends(PayShopView, _super_1);
        function PayShopView(param) {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = PayShopView.NAME;
            _this.m_nCurSelect = param || 0;
            _this.initApp("pay/pay_shop_view.exml");
            return _this;
        }
        PayShopView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        PayShopView.prototype.executes = function (notification) {
        };
        PayShopView.prototype.onDestroy = function () {
            for (var key in this.m_pViews) {
                var view = this.m_pViews[key];
                if (view.onDestroy) {
                    view.onDestroy();
                }
            }
            this.m_pCellList = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.PAY_SHOP_VIEW_UI]);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
            _super_1.prototype.onDestroy.call(this);
        };
        PayShopView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_RE));
            this.m_btnRecharge.setTitleLabel(GCode(CLEnum.AC_SEE_VIP));
            this.refreshView();
            this.refreshVipLv();
            this.refreshVipExp();
            Utils.toStageBestScale(this.m_pRoot);
            com_main.EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onBtnVipShopHandler);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
        };
        /**刷新显示 */
        PayShopView.prototype.refreshView = function () {
            this.m_pCellList = [];
            var shopCfg = PayModel.rechargeCfgs;
            for (var id in shopCfg) {
                var info = shopCfg[id];
                if (info != null && info != undefined) {
                    if (info.shopType == RechargeType.RECHARGE) {
                        var item = new com_main.PayShopBuyItem(info.id);
                        this.m_pGSroller.addChild(item);
                        this.m_pCellList.push(item);
                    }
                }
            }
        };
        PayShopView.prototype.reshreshBuyItem = function () {
            for (var i = 0; i < this.m_pCellList.length; i++) {
                this.m_pCellList[i].refreshFirstFlag();
            }
        };
        /**充值完刷新*/
        PayShopView.prototype.refreshRechargeView = function () {
            this.refreshVipLv();
            this.refreshVipExp();
            this.reshreshBuyItem();
        };
        /**vip*/
        PayShopView.prototype.onBtnVipShopHandler = function (pvt) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        };
        /**刷新vip等级 */
        PayShopView.prototype.refreshVipLv = function () {
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
        };
        /**刷新vip经验 */
        PayShopView.prototype.refreshVipExp = function () {
            var cfg = VipModel.getVipCfgByLv(RoleData.vipLevel);
            var pro = 0;
            var preCfg = VipModel.getVipCfgByLv(RoleData.vipLevel - 1);
            this.m_lbExp.visible = RoleData.vipLevel !== VipModel.MAX_VIP;
            if (RoleData.vipLevel > 0) {
                this.m_lbExp.text = cfg.exp - preCfg.exp >= 0 ? RoleData.vipIntegral - preCfg.exp + "/" + (cfg.exp - preCfg.exp) : "" + (RoleData.vipIntegral - preCfg.exp);
                pro = Math.min((RoleData.vipIntegral - preCfg.exp) / (cfg.exp - preCfg.exp), 1);
                // if ( RoleData.vipLevel == VipModel.MAX_VIP) {
                //     this.m_lbExp.text = `${ RoleData.vipIntegral}`
                // }
            }
            else {
                this.m_lbExp.text = RoleData.vipIntegral + "/" + cfg.exp;
                pro = Math.min(RoleData.vipIntegral / cfg.exp, 1);
            }
            this.m_imgVipPro.width = com_main.VipWnd.PRO_MAX * pro;
            if (RoleData.vipLevel < VipModel.MAX_VIP) {
                var cfg_1 = VipModel.getVipCfgByLv(RoleData.vipLevel);
                var exp = cfg_1.exp - RoleData.vipIntegral;
                exp = Math.max(0, exp);
                this.m_labTaget.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.VIP_NEXT_TIPS, exp, RoleData.vipLevel + 1));
            }
            else {
                this.m_labTaget.text = '';
            }
        };
        PayShopView.NAME = "PayShopView";
        return PayShopView;
    }(com_main.CView));
    com_main.PayShopView = PayShopView;
})(com_main || (com_main = {}));
