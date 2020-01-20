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
    /**采集菜单 */
    var WorldMenuCollectWidget = /** @class */ (function (_super_1) {
        __extends(WorldMenuCollectWidget, _super_1);
        function WorldMenuCollectWidget(id) {
            var _this = _super_1.call(this) || this;
            _this.isAcc = false;
            _this.name = "WorldMenu";
            _this.initApp("world/WorldMenuCollectSkin.exml");
            _this.cacheAsBitmap = true;
            _this.m_nId = id;
            return _this;
        }
        WorldMenuCollectWidget.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            com_main.EventManager.removeEventListener(this.m_pBtnGather);
            Utils.TimerManager.remove(this.onTickHandler, this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldMenuCollectWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var arrPoint = [], arr = [this.m_pBtnGather];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var o = arr_1[_i];
                arrPoint.push([o.x, o.y]);
            }
            this.showBtnTween(arr, arrPoint);
            var eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            var conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                error("WorldMenuGatherWidget:childrenCreated=====id:" + this.m_nId + " is Empty=====");
                return;
            }
            this.m_pLbTitle.text = GLan(conf.name);
            this.m_lblpCity.text = GLan(eventVo.coordCfg.name);
            var award = Utils.parseCommonItemJson(conf.reward);
            var item = award[0];
            this.m_pLbAwardNum.text = "" + item.count;
            this.m_refTime.text = GCodeFromat(CLEnum.WOR_GA_REF, Math.ceil(eventVo.coordCfg.frequency / 60));
            this.m_pItem.setItemInfo(item.itemId, item.count);
            var vipPri = VipModel.getPlayerPrivillByType(VipPrivillType.MAP_COLLECTION_PROFIT) * 100;
            var cityBuff = CityBuildModel.getCityPrivilegeValues(eventVo.cityId, CityRewardType.GATHER) / 100;
            this.m_pLbAdd.text = (vipPri + cityBuff) + "%";
            // if (conf.time <= 0) {
            //     RES.getResAsync("btn_018_up_png", (k, v)=>{
            //         this.m_pImgGather.texture = k;
            //     }, this);
            // } 
            if (eventVo.getTeamId() > 0) {
                this.m_nTimeCount = eventVo.userMapEventData.endTime - TimerUtils.getServerTime() - eventVo.userMapEventData.speedTime;
                this.m_nTimeCount = Math.max(0, this.m_nTimeCount);
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nTimeCount, 1);
                if (this.m_nTimeCount > 0) {
                    Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
                }
                this.isAcc = true;
                this.m_pImgGather.source = 'btn_034_up_png';
                this.m_pImgGatherLab.source = 'lb_js_png';
            }
            else {
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(eventVo.dataCfg.collectionTime / 1000, 1);
                this.m_pImgGather.source = 'btn_027_up_png';
                this.m_pImgGatherLab.source = 'lb_cj_png';
            }
            var data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
            this.m_gaCout.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_CO_COU, data.useCount, data.maxCount));
            // EventManager.addTouchScaleListener(this.m_pBtnGather, this, this.onGatherClick);
        };
        WorldMenuCollectWidget.prototype.onGatherClick = function () {
            var data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
            var eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            if (eventVo.getTeamId() > 0) {
                //收集中
                Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                    propSpeedType: PropSpeedType.WorldGather, targetId: this.m_nId, cityId: eventVo.cityId,
                    startTime: eventVo.userMapEventData.startTime,
                    endTime: eventVo.userMapEventData.endTime,
                    speedUpTime: eventVo.userMapEventData.speedTime
                });
            }
            else {
                //非收集中
                if (data.reCount == 0 && !this.isAcc) {
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
            }
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        //确认购买
        WorldMenuCollectWidget.prototype.onConfirmBuy = function () {
            WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_COLLECT);
        };
        /**前往充值界面 */
        WorldMenuCollectWidget.prototype.onConFirmCharge = function () {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        WorldMenuCollectWidget.prototype.hitPoint = function (x, y) {
            if (this.m_pBtnGather.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onGatherClick();
            }
            return this.m_pBtnGather.hitTestPoint(x, y) || this.m_pMenu.hitTestPoint(x, y);
        };
        WorldMenuCollectWidget.prototype.onTickHandler = function () {
            if (this.m_nTimeCount <= 0) {
                Utils.TimerManager.remove(this.onTickHandler, this);
            }
            this.m_nTimeCount--;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nTimeCount, 1);
        };
        WorldMenuCollectWidget.prototype.removeFromParent = function () {
            _super_1.prototype.removeFromParent.call(this, [this.m_pBtnGather]);
        };
        return WorldMenuCollectWidget;
    }(com_main.WorldMenuComponent));
    com_main.WorldMenuCollectWidget = WorldMenuCollectWidget;
})(com_main || (com_main = {}));
