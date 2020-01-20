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
    /**剿匪菜单 */
    var WorldMenuAttackWidget = /** @class */ (function (_super_1) {
        __extends(WorldMenuAttackWidget, _super_1);
        function WorldMenuAttackWidget(id) {
            var _this = _super_1.call(this) || this;
            _this.name = "WorldMenu";
            _this.initApp("world/world_menu_attack_widget.exml");
            _this.cacheAsBitmap = true;
            _this.m_nOrginY = 0;
            _this.m_nId = id;
            return _this;
        }
        WorldMenuAttackWidget.prototype.$onRemoveFromStage = function () {
            this.clearHeadItem();
            this.onDestroy();
            com_main.EventManager.removeEventListener(this.m_pBtnAttack);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        WorldMenuAttackWidget.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_SYS_GENERAL_WIN_INFO,
            ];
        };
        /**处理协议号事件 */
        WorldMenuAttackWidget.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                    this.refreshGeneralView(body);
                    break;
                }
                default:
                    break;
            }
        };
        WorldMenuAttackWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            var conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                error("WorldMenuAttackWidget:childrenCreated=====id:" + this.m_nId + " is Empty=====");
                return;
            }
            var arrPoint = [], arr = [this.m_pBtnAttack];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var o = arr_1[_i];
                arrPoint.push([o.x, o.y]);
            }
            this.showBtnTween(arr, arrPoint);
            var award = Utils.parseCommonItemJson(conf.reward);
            this.m_lblpCity.text = GLan(eventVo.coordCfg.name);
            for (var i = 0; i < award.length; i++) {
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(award[i].itemId, award[i].count);
                this.m_pAward.addChild(item);
            }
            this.m_pLbPower.text = "" + conf.recommendForce;
            var data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
            this.m_attCout.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_ATT_COU, data.useCount, data.maxCount));
            // EventManager.addTouchScaleListener(this.m_pBtnAttack, this, this.onAttackClick);
        };
        /**获得怪物内容 */
        WorldMenuAttackWidget.prototype.onCreate = function () {
            //发送协议获得
            var eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            var conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                return;
            }
            this.m_pLbTitle.text = GLan(conf.name);
            NormalProxy.C2S_SYS_GENERAL_WIN_INFO(eventVo.dataCfg.npcId);
        };
        WorldMenuAttackWidget.prototype.onAttackClick = function () {
            var data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
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
        WorldMenuAttackWidget.prototype.onConfirmBuy = function () {
            WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.FIGHT);
        };
        /**前往充值界面 */
        WorldMenuAttackWidget.prototype.onConFirmCharge = function () {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        WorldMenuAttackWidget.prototype.hitPoint = function (x, y) {
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onAttackClick();
            }
            return this.m_pBtnAttack.hitTestPoint(x, y);
        };
        WorldMenuAttackWidget.prototype.removeFromParent = function () {
            _super_1.prototype.removeFromParent.call(this, [this.m_pBtnAttack]);
        };
        /**刷新武将显示 */
        WorldMenuAttackWidget.prototype.refreshGeneralView = function (data) {
            if (data) {
                for (var i = 0; i < data.generalWinInfo.length; i++) {
                    var tempData = data.generalWinInfo[i];
                    var item = com_main.GeneralHeadRender.create("arena_name");
                    item.setGenViewInfo(tempData.generalId, tempData.level, tempData.star, tempData.quality);
                    Utils.addChild(this.m_pGHead, item);
                }
            }
        };
        /**回收头像 */
        WorldMenuAttackWidget.prototype.clearHeadItem = function () {
            if (!this.m_pGHead)
                return;
            while (this.m_pGHead.numChildren > 0) {
                var item = this.m_pGHead.getChildAt(0);
                item.onDestroy();
            }
        };
        return WorldMenuAttackWidget;
    }(com_main.WorldMenuComponent));
    com_main.WorldMenuAttackWidget = WorldMenuAttackWidget;
})(com_main || (com_main = {}));
