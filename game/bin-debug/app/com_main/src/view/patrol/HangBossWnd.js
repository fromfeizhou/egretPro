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
     * 离线收益
     */
    var HangBossWnd = /** @class */ (function (_super_1) {
        __extends(HangBossWnd, _super_1);
        function HangBossWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.name = HangBossWnd.NAME;
            _this.initApp("patrol/HangBossWndSkin.exml");
            return _this;
        }
        HangBossWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        HangBossWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initView();
            this.initEvent();
        };
        HangBossWnd.prototype.initView = function () {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_BOS_TILE));
            this.m_btnBuy.setCostImg('icon_source_gold_png');
            this.m_labDes.textFlow = Utils.htmlParser(GCode(CLEnum.HAN_BOS_DES));
            this.initData();
            this.refreshView();
            if (!PatrolModel.getBossInfo())
                return;
            this.refreshGeneral();
            this.m_listAward.itemRenderer = PropRender;
            var res = [];
            var itemIdStr = "";
            var awardStr = PatrolModel.getBossInfo().bossReward;
            var awardArr = awardStr.split('#');
            var len = awardArr.length;
            for (var i = 0; i < len; i++) {
                var tmpStr = awardArr[i].split('*')[1];
                itemIdStr = i == len - 1 ? itemIdStr + tmpStr : itemIdStr + tmpStr + ',';
            }
            res = Utils.parseCommonItemJson(itemIdStr);
            while (res.length > 5) {
                res.pop();
            }
            var collection = new eui.ArrayCollection(res);
            this.m_listAward.dataProvider = collection;
        };
        /**boss形象 */
        HangBossWnd.prototype.refreshGeneral = function () {
            this.m_genCard.setInfo(PatrolModel.getBossInfo().generalId, true);
        };
        /**初始化数据 */
        HangBossWnd.prototype.initData = function () {
            this.m_nBossTime = PatrolModel.getBossTimeMax();
        };
        /**刷新显示 */
        HangBossWnd.prototype.refreshView = function () {
            var data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
            if (data.reCount > 0) {
                if (PatrolModel.getBossTime() >= this.m_nBossTime) {
                    this.m_labFightDes.visible = true;
                    this.m_pFight.visible = true;
                    this.m_btnBuy.visible = false;
                    this.m_pProcess.visible = false;
                    this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
                }
                else {
                    this.m_pFight.visible = false;
                    this.m_btnBuy.visible = false;
                    this.m_pProcess.visible = true;
                    this.refreshPro();
                }
            }
            else {
                this.m_pFight.visible = false;
                this.m_btnBuy.visible = true;
                this.m_pProcess.visible = false;
                this.m_labFightDes.visible = false;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.HAN_BOS_BUY));
                this.m_btnBuy.setTitleLabel(GCode(CLEnum.HAN_BOS_BUY));
                var needGold = NormalModel.getFunCostByData(data);
                this.m_btnBuy.setCostLabel("" + needGold);
            }
            this.m_labAwardNum.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_BOS_TIPS, data.useCount, data.maxCount));
        };
        /**boss进度刷新 */
        HangBossWnd.prototype.isBossIn = function () {
            if (NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount > 0)
                return true;
            return false;
        };
        /**刷新进度 */
        HangBossWnd.prototype.refreshPro = function () {
            if (!this.isBossIn())
                return;
            if (PatrolModel.getBossTime() >= this.m_nBossTime) {
                this.refreshView();
                return;
            }
            var rate = PatrolModel.getBossTime() / this.m_nBossTime;
            this.m_imgPro.width = rate * HangBossWnd.PRO_MAX;
            var score = PatrolModel.info.score | 100;
            this.m_labPro.text = Math.floor(PatrolModel.getBossTime() * score) + "/" + Math.floor(this.m_nBossTime * score);
            this.m_labProDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_BOS_POR, this.m_nBossTime * score));
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        HangBossWnd.prototype.initEvent = function () {
            /**挂机boss */
            com_main.EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            com_main.EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnFight);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_BOSS_RESET, this.onBossReset, this);
        };
        HangBossWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_BOSS_RESET, this);
        };
        /**boss重置 */
        HangBossWnd.prototype.onBossReset = function (id) {
            this.refreshView();
        };
        /**定时刷新改变 */
        HangBossWnd.prototype.onPatrolTick = function () {
            this.refreshPro();
        };
        /**按钮回调 */
        HangBossWnd.prototype.onBtnFight = function () {
            var data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
            if (data.reCount > 0) {
                PatrolProxy.C2S_PATROL_CHALLENGE_BOSS();
                return;
            }
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.PATROL_BOSS_BUY];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
            if (data.buyAmountCount >= buyMax) {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips("次数不足");
                    return;
                }
                Utils.showVipUpConfim();
                return;
            }
            var needGold = NormalModel.getFunCostByData(data);
            if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                var content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                if (platform.isHidePayFunc())
                    content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold);
                Utils.showConfirmPop(content, function () {
                    PatrolProxy.C2S_PATROL_BUY_BOSS_COUNT();
                }, this);
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GOLD_LESS));
            }
            // if (data.reBuyAmountCount > 0) {
            // let content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, PatrolModel.bossGoldConsume);
            //     Utils.showConfirmPop(content, () => {
            //         if (PropModel.isItemEnough(PropEnum.GOLD, PatrolModel.bossGoldConsume, 1)) {
            //         }
            //     }, this);
            //     return;
            // }
            // EffectUtils.showTips(GCode(CLEnum.QUA_FI_BUY_MAX), 1, true);
        };
        HangBossWnd.NAME = 'HangBossWnd';
        HangBossWnd.PRO_MAX = 520;
        return HangBossWnd;
    }(com_main.CView));
    com_main.HangBossWnd = HangBossWnd;
    var PropRender = /** @class */ (function (_super_1) {
        __extends(PropRender, _super_1);
        function PropRender() {
            return _super_1.call(this) || this;
        }
        PropRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PropRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('count');
            this.addChild(this.m_item);
        };
        PropRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        };
        return PropRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
