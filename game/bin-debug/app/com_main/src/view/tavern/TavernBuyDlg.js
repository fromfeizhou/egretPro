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
     * 招募购买面板
     */
    var TavernBuyDlg = /** @class */ (function (_super_1) {
        __extends(TavernBuyDlg, _super_1);
        function TavernBuyDlg(data) {
            var _this = _super_1.call(this) || this;
            _this.m_nBuyNum = 0; //需要数量
            _this.m_nType = 0; //招募类型（0为一次，1为10次）
            _this.name = TavernBuyDlg.NAME;
            _this.m_nType = data.type;
            _this.initApp("tavern/TavernBuyDlgSkin.exml");
            return _this;
        }
        TavernBuyDlg.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.TAVERN_ATTRACT,
            ];
        };
        /**处理协议号事件 */
        TavernBuyDlg.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TAVERN_ATTRACT: {
                    this.refreshItemNum();
                    this.refreshBuyNum();
                    break;
                }
            }
        };
        TavernBuyDlg.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        TavernBuyDlg.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_btnCost.setTitleLabel(GCode(CLEnum.BUY_AND_USE));
            this.refreshItemView();
            this.refreshItemNum();
            this.refreshBuyNum();
            this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));
            com_main.EventManager.addTouchScaleListener(this.m_btnCost, this, this.onClickBuy);
        };
        /**确认购买 */
        TavernBuyDlg.prototype.onClickBuy = function () {
            var cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
            if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                TavernProxy.send_TAVERN_ATTRACT(this.m_nType);
                com_main.UpManager.history();
            }
        };
        /**设置购买数量 */
        TavernBuyDlg.prototype.resetBuyNum = function () {
            if (this.m_nType == 0) { //单次招募
                this.m_nBuyNum = 1;
            }
            else {
                //多次招募
                var num = RoleData.recruit;
                //数量为0 打折9张
                if (num == 0) {
                    this.m_nBuyNum = 9;
                }
                else {
                    this.m_nBuyNum = 9 - num;
                }
            }
        };
        /**初始化购买次数 */
        TavernBuyDlg.prototype.refreshItemNum = function () {
            this.m_labNum.text = RoleData.recruit.toString();
        };
        /**刷新物品 */
        TavernBuyDlg.prototype.refreshItemView = function () {
            var cfg = PropModel.getCfg(PropEnum.ZML);
            Utils.setPropLabName(PropEnum.ZML, this.m_labName);
            this.m_labDes.text = cfg.description;
            this.m_labNum.text = RoleData.recruit.toString();
            this.m_comItem.setItemInfo(PropEnum.ZML);
        };
        /**刷新购买数量 */
        TavernBuyDlg.prototype.refreshBuyNum = function () {
            this.resetBuyNum();
            this.m_labSelNum.text = this.m_nBuyNum + "";
            var cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
            this.m_btnCost.setCostLabel("" + cost);
        };
        TavernBuyDlg.NAME = 'TavernBuyDlg';
        return TavernBuyDlg;
    }(com_main.CView));
    com_main.TavernBuyDlg = TavernBuyDlg;
})(com_main || (com_main = {}));
