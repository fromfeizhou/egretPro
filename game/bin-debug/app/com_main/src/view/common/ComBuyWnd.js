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
     * 购买面板
     */
    var ComBuyWnd = /** @class */ (function (_super_1) {
        __extends(ComBuyWnd, _super_1);
        function ComBuyWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.m_nBuyNum = 0; //需要数量
            _this.name = ComBuyWnd.NAME;
            _this.m_buyType = data.buyType;
            _this.m_itemId = data.itemId;
            _this.m_nBuyNum = data.count ? data.count : 0;
            _this.m_actitivtyId = data.turnTableVoId ? data.turnTableVoId : 0;
            _this.initApp("tavern/TavernBuyDlgSkin.exml");
            return _this;
        }
        ComBuyWnd.prototype.listenerProtoNotifications = function () {
            return [
            // ProtoDef.TAVERN_ATTRACT,
            ];
        };
        /**处理协议号事件 */
        ComBuyWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.TAVERN_ATTRACT: {
                //     this.refreshItemNum();
                //     this.refreshBuyNum();
                //     break;
                // }
            }
        };
        ComBuyWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ComBuyWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.refreshItemView();
            this.refreshItemNum();
            this.refreshBuyNum();
            if (this.m_itemId == PropEnum.XW) {
                this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.YU));
                this.m_btnCost.setTitleLabel('购买');
            }
            else {
                this.m_btnCost.setTitleLabel(GCode(CLEnum.BUY_AND_USE));
                this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));
            }
            com_main.EventManager.addTouchScaleListener(this.m_btnCost, this, this.onClickBuy);
        };
        /**确认购买 */
        ComBuyWnd.prototype.onClickBuy = function () {
            switch (this.m_itemId) {
                case PropEnum.ZML: {
                    var cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
                    if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                        TavernProxy.send_TAVERN_ATTRACT(this.m_buyType);
                        com_main.UpManager.history();
                    }
                    break;
                }
                case PropEnum.TURNTABLE: {
                    var itemInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_CONSUME)[0];
                    var cost = itemInfo.count * this.m_nBuyNum;
                    if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                        TurnTableProxy.C2S_ACTIVITY_PRIZE_PLAY(this.m_actitivtyId, this.m_buyType);
                        com_main.UpManager.history();
                    }
                    break;
                }
                case PropEnum.XW: {
                    var yuNum = PropModel.getPropNum(PropEnum.YU); //玉石
                    var date = NormalModel.setQuickBuyCfg(PropEnum.XW);
                    var oneXwCost = date[0][3];
                    if (yuNum >= oneXwCost * this.m_nBuyNum) {
                        QuickBuyProxy.C2S_QUCKLY_SHOP_BUY_GOODS(PropEnum.XW, this.m_nBuyNum);
                        com_main.UpManager.history();
                    }
                    else {
                        Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
                    }
                }
            }
        };
        /**设置购买数量 */
        ComBuyWnd.prototype.resetBuyNum = function () {
            switch (this.m_itemId) {
                case PropEnum.ZML: { //招募令
                    if (this.m_buyType == 0) {
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
                    break;
                }
            }
        };
        /**初始化购买次数 */
        ComBuyWnd.prototype.refreshItemNum = function () {
            var countStr;
            if (this.m_itemId == PropEnum.ZML) {
                countStr = RoleData.recruit.toString();
            }
            else {
                var prizeNum = PropModel.getPropNum(this.m_itemId); //幸运转盘数量
                countStr = prizeNum.toString();
            }
            this.m_labNum.text = countStr;
        };
        /**刷新物品 */
        ComBuyWnd.prototype.refreshItemView = function () {
            var cfg = PropModel.getCfg(this.m_itemId);
            Utils.setPropLabName(cfg.id, this.m_labName);
            this.m_labDes.text = cfg.description;
            // this.m_labNum.text = RoleData.recruit.toString();
            this.m_comItem.setItemInfo(this.m_itemId);
        };
        /**刷新购买数量 */
        ComBuyWnd.prototype.refreshBuyNum = function () {
            this.resetBuyNum();
            this.m_labSelNum.text = this.m_nBuyNum + "";
            var Count = 0;
            if (this.m_itemId == PropEnum.TURNTABLE) {
                var itemInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_CONSUME)[0];
                Count = itemInfo.count;
            }
            else if (this.m_itemId == PropEnum.XW) {
                var date = NormalModel.setQuickBuyCfg(PropEnum.XW);
                Count = date[0][3];
            }
            else {
                Count = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME);
            }
            var cost = Count * this.m_nBuyNum;
            this.m_btnCost.setCostLabel("" + cost);
        };
        ComBuyWnd.NAME = 'ComBuyWnd';
        return ComBuyWnd;
    }(com_main.CView));
    com_main.ComBuyWnd = ComBuyWnd;
})(com_main || (com_main = {}));
