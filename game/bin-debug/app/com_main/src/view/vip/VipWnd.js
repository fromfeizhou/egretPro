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
     * 任务面板相关
     */
    var VipWnd = /** @class */ (function (_super_1) {
        __extends(VipWnd, _super_1);
        function VipWnd() {
            var _this = _super_1.call(this) || this;
            _this.name = VipWnd.NAME;
            _this.initApp("vip/VipWndSkin.exml");
            return _this;
        }
        VipWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_VIP_DAILY_REWARD,
                ProtoDef.S2C_VIP_LEVEL_REWARD,
                ProtoDef.S2C_RECHARGE_INFO,
                ProtoDef.S2C_RECHARGE
            ];
        };
        /**处理协议号事件 */
        VipWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VIP_DAILY_REWARD: {
                    this.updateDailyAwardState();
                    break;
                }
                case ProtoDef.S2C_VIP_LEVEL_REWARD: {
                    this.updateLevelAwardLab();
                    break;
                }
                case ProtoDef.S2C_RECHARGE_INFO: {
                    break;
                }
                case ProtoDef.S2C_RECHARGE: {
                    this.refreshVipExp();
                    // this.refreshVipLv();
                    this.updateDailyAwardState();
                    break;
                }
            }
        };
        VipWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            this.clearBtnMissionEffect();
            SceneResGroupCfg.clearModelRes([ModuleEnums.VIP]);
        };
        VipWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnRecharge.setTitleLabel(GCode(CLEnum.VIP_CHARGE_NOW));
            this.m_btnBuy.setTitleLabel(GCode(CLEnum.BUY));
            this.m_MainTopNew.setTitleName(GCode(CLEnum.VIP_PRIVIGE));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pDesList.dataProvider = this.m_tCollections;
            this.m_pDesList.itemRenderer = com_main.VipPrivilegeCell;
            this.m_tAwardColls = new eui.ArrayCollection([]);
            this.m_pAwardList.dataProvider = this.m_tAwardColls;
            this.m_pAwardList.itemRenderer = VipLvAwardRender;
            this.refreshVipLv();
            this.refreshVipExp();
            var curIndex = RoleData.vipLevel > 0 ? RoleData.vipLevel : 0;
            this.changeIndex(curIndex);
            this.updateDailyAwardState();
            this.initEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        VipWnd.prototype.onRefresh = function (body) {
            if (VipModel.isReChargeBtnClick) {
                VipModel.isReChargeBtnClick = false;
                var curIndex = RoleData.vipLevel > 0 ? RoleData.vipLevel : 0;
                this.changeIndex(curIndex);
            }
        };
        /**选中改变 */
        VipWnd.prototype.changeIndex = function (index) {
            if (this.m_nCurVipLv == index)
                return;
            this.m_nCurVipLv = index;
            this.m_btnLeft.visible = this.m_nCurVipLv > 0;
            this.m_btnRight.visible = this.m_nCurVipLv < VipModel.MAX_VIP;
            // this.m_pLRed.visible = VipModel.isHasLevAwardByLev(this.m_nCurVipLv - 1)
            // this.m_pRRed.visible = VipModel.isHasLevAwardByLev(this.m_nCurVipLv + 1)
            this.refreshView();
        };
        /**刷新界面 */
        VipWnd.prototype.refreshView = function () {
            this.refreshPrivillView();
            this.refreshVipLvGiftView();
            this.refreshVipPrivigeLab();
            this.refreshVipPrice();
            this.updateLevelAwardLab();
            this.updateChargeLab();
        };
        /**刷新充值金额信息 */
        VipWnd.prototype.updateChargeLab = function () {
            this.m_labMoneyTaget.visible = this.m_nCurVipLv > RoleData.vipLevel;
            var cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv - 1);
            var money = Math.floor((cfg.exp - RoleData.vipIntegral) / 10);
            money = Math.max(0, money);
            this.m_labMoneyTaget.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.VIP_NEXT_TIPS1, money, this.m_nCurVipLv));
        };
        /**刷新每日奖励状态 */
        VipWnd.prototype.updateDailyAwardState = function () {
            this.m_labBoxTip.text = VipModel.vipVo.vipDailyReward ? GCode(CLEnum.TAKE_OUT_IN) : GCode(CLEnum.TAKE_OUT_END);
            this.m_pBoxBtn.source = VipModel.vipVo.vipDailyReward ? "vip_baoxiang_png" : "vip_baoxiang_open_png";
            this.m_pDailyRed.visible = VipModel.vipVo.vipDailyReward;
        };
        /**刷新价格 */
        VipWnd.prototype.refreshVipPrice = function () {
            var cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (cfg) {
                this.m_labOri.text = "" + cfg.discount;
                this.m_labPrice.text = "" + cfg.price;
            }
        };
        /**刷新vip等级 */
        VipWnd.prototype.refreshVipLv = function () {
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
        };
        /**
         * 贵族等级文本
         */
        VipWnd.prototype.refreshVipPrivigeLab = function () {
            this.m_labPrivigeLeft.text = GCodeFromat(CLEnum.VIP_PRIVIGE_LV, this.m_nCurVipLv);
            this.m_labPrivigeRight.text = GCodeFromat(CLEnum.VIP_PRIVIGE_GIFT, this.m_nCurVipLv);
        };
        /**设置任务领取按钮特效 */
        VipWnd.prototype.createBtnMissionEffect = function () {
            if (this.m_btnMissionEff)
                return;
            this.m_btnMissionEff = new MCDragonBones();
            this.m_btnMissionEff.initAsync(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.play(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.x = 72.5;
            this.m_btnMissionEff.y = 30;
            this.m_btnBuy.addChild(this.m_btnMissionEff);
        };
        VipWnd.prototype.clearBtnMissionEffect = function () {
            if (this.m_btnMissionEff) {
                this.m_btnMissionEff.destroy();
                this.m_btnMissionEff = null;
            }
        };
        /**刷新vip经验 */
        VipWnd.prototype.refreshVipExp = function () {
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
            this.m_imgVipPro.width = VipWnd.PRO_MAX * pro;
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
        /**刷新特权列表 */
        VipWnd.prototype.refreshPrivillView = function () {
            var list = VipModel.getVipPrivilByVip(this.m_nCurVipLv);
            var res = [];
            for (var i = 0; i < list.length; i++) {
                res.push({ level: this.m_nCurVipLv, data: list[i] });
            }
            res.sort(this.sortByPrivile);
            this.m_tCollections.replaceAll(res);
            this.m_pDesScoller.viewport.scrollV = 0;
        };
        /**特权列表排序 */
        VipWnd.prototype.sortByPrivile = function (p1, p2) {
            function calcuState(m_tData) {
                var cfg = C.VipPrivillegesConfig[m_tData.data.key];
                var oldVal = cfg["vip" + (m_tData.level - 1)];
                var state = (oldVal == 0) ? 1 : 3;
                if (state == 3) {
                    state = VipModel.checkVipPrivileUp(m_tData.level, m_tData.data.key) ? 2 : 3;
                }
                return state;
            }
            var state1 = calcuState(p1);
            var state2 = calcuState(p2);
            return state1 - state2;
        };
        /**刷新礼包奖励 */
        VipWnd.prototype.refreshVipLvGiftView = function () {
            var cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (cfg) {
                var items = Utils.parseCommonItemJson(cfg.levelReward);
                this.m_tAwardColls.replaceAll(items);
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        VipWnd.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnVipShop, this, this.onBtnVipShopHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onBtnRechargeHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pBoxBtn, this, this.onBtnDailyHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnLevelHandler);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshVipLv, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_EXP, this.refreshVipExp, this);
        };
        VipWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_EXP, this);
        };
        VipWnd.prototype.onLeftHandler = function () {
            var index = this.m_nCurVipLv - 1;
            if (index >= 0)
                this.changeIndex(index);
        };
        VipWnd.prototype.updateLevelAwardLab = function () {
            this.clearBtnMissionEffect();
            if (VipModel.vipVo.receivedVipLevelReward.indexOf(this.m_nCurVipLv) != -1) {
                this.m_btnBuy.visible = false;
                this.m_lbLevelState.text = GCode(CLEnum.BUY_ALR);
                this.m_lbLevelState.visible = true;
                return;
            }
            if (RoleData.vipLevel >= this.m_nCurVipLv) {
                this.m_btnBuy.visible = true;
                this.createBtnMissionEffect();
                this.m_lbLevelState.visible = false;
                return;
            }
            this.m_btnBuy.visible = false;
            this.m_lbLevelState.visible = true;
            this.m_lbLevelState.text = GCodeFromat(CLEnum.VIP_BUY_LIMIT, this.m_nCurVipLv);
        };
        VipWnd.prototype.onRightHandler = function () {
            var index = this.m_nCurVipLv + 1;
            if (index <= VipModel.MAX_VIP)
                this.changeIndex(index);
        };
        /**充值 */
        VipWnd.prototype.onBtnRechargeHandler = function (pvt) {
            VipModel.isReChargeBtnClick = true;
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        /**没日奖励 */
        VipWnd.prototype.onBtnDailyHandler = function (pvt) {
            if (!VipModel.vipVo.vipDailyReward) {
                EffectUtils.showTips(GCode(CLEnum.VIP_GET_TIPS));
                return;
            }
            VipProxy.C2S_VIP_DAILY_REWARD();
        };
        /**等级购买 */
        VipWnd.prototype.onBtnLevelHandler = function (pvt) {
            var cfg = VipModel.getVipCfgByLv(this.m_nCurVipLv);
            if (!cfg) {
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, cfg.price, 1)) {
                VipModel.currenReceiveLevel = this.m_nCurVipLv;
                VipProxy.C2S_VIP_LEVEL_REWARD(this.m_nCurVipLv);
            }
        };
        /**vip商城*/
        VipWnd.prototype.onBtnVipShopHandler = function (pvt) {
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.NOBLE);
        };
        VipWnd.NAME = 'VipWnd';
        VipWnd.PRO_MAX = 436;
        return VipWnd;
    }(com_main.CView));
    com_main.VipWnd = VipWnd;
    /**等级礼包奖励 */
    var VipLvAwardRender = /** @class */ (function (_super_1) {
        __extends(VipLvAwardRender, _super_1);
        function VipLvAwardRender() {
            return _super_1.call(this) || this;
        }
        VipLvAwardRender.prototype.$onRemoveFromStage = function () {
            Utils.removeFromParent(this.m_item);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        VipLvAwardRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.removeChildren();
            this.m_item = com_main.ComItemNew.create('count');
            this.addChild(this.m_item);
        };
        VipLvAwardRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
        };
        return VipLvAwardRender;
    }(eui.ItemRenderer));
    com_main.VipLvAwardRender = VipLvAwardRender;
})(com_main || (com_main = {}));
