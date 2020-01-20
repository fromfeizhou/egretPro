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
    /**收集菜单 */
    var WorldMenuGatherWidget = /** @class */ (function (_super_1) {
        __extends(WorldMenuGatherWidget, _super_1);
        function WorldMenuGatherWidget(id) {
            var _this = _super_1.call(this) || this;
            _this.name = "WorldMenu";
            _this.initApp("world/WorldMenuGatherSkin.exml");
            _this.cacheAsBitmap = true;
            _this.m_nId = id;
            return _this;
        }
        WorldMenuGatherWidget.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            com_main.EventManager.removeEventListener(this.m_pBtnGather);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldMenuGatherWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            var conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                error("WorldMenuGatherWidget:childrenCreated=====id:" + this.m_nId + " is Empty=====");
                return;
            }
            var arrPoint = [], arr = [this.m_pBtnGather];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var o = arr_1[_i];
                arrPoint.push([o.x, o.y]);
            }
            this.showBtnTween(arr, arrPoint);
            this.m_pLbTitle.text = GLan(conf.name).replace(/[\d]/g, '');
            this.m_lblpCity.text = GLan(eventVo.coordCfg.name);
            var data = NormalModel.getFunCountById(IFunCountEnum.GATHER_COUNT);
            this.m_colCout.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_CO_COU, data.useCount, data.maxCount));
            this.m_refTime.text = GCodeFromat(CLEnum.WOR_CO_REF, Math.ceil(eventVo.coordCfg.frequency / 60));
            var award = Utils.parseCommonItemJson(conf.reward);
            var item = award[0];
            this.m_pLbAwardNum.text = "" + item.count;
            this.m_pItem.setItemInfo(item.itemId, item.count);
            // EventManager.addTouchScaleListener(this.m_pBtnGather, this, this.onGatherClick);
        };
        WorldMenuGatherWidget.prototype.onGatherClick = function () {
            var data = NormalModel.getFunCountById(IFunCountEnum.GATHER_COUNT);
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数
            if (data.reCount == 0) {
                if (data.buyAmountCount >= buyMax) {
                    Utils.showVipUpConfim();
                    com_main.WorldView.callFunc(6 /* HIDE_MENU */);
                    return;
                }
                if (platform.isHidePayFunc())
                    return;
                var needGold = NormalModel.getFunCostByData(data);
                if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                    var content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                    Utils.showConfirmPop(content, this.onConfirmBuy, this);
                    // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount)))
                }
                com_main.WorldView.callFunc(6 /* HIDE_MENU */);
                return;
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.m_nId, cityId: -1 });
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        //确认购买
        WorldMenuGatherWidget.prototype.onConfirmBuy = function () {
            WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_GATHER);
        };
        /**前往充值界面 */
        WorldMenuGatherWidget.prototype.onConFirmCharge = function () {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        WorldMenuGatherWidget.prototype.hitPoint = function (x, y) {
            if (this.m_pBtnGather.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onGatherClick();
            }
            return this.m_pBtnGather.hitTestPoint(x, y) || this.m_pMenu.hitTestPoint(x, y);
        };
        WorldMenuGatherWidget.prototype.removeFromParent = function () {
            _super_1.prototype.removeFromParent.call(this, [this.m_pBtnGather]);
        };
        /**检查新手引导面板条件 */
        WorldMenuGatherWidget.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_COLLECT);
        };
        return WorldMenuGatherWidget;
    }(com_main.WorldMenuComponent));
    com_main.WorldMenuGatherWidget = WorldMenuGatherWidget;
})(com_main || (com_main = {}));
