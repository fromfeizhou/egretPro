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
    var WorldVisitAttack = /** @class */ (function (_super_1) {
        __extends(WorldVisitAttack, _super_1);
        function WorldVisitAttack(cid) {
            var _this = _super_1.call(this) || this;
            _this.m_RefGoldList = [];
            _this.m_nCid = 0;
            _this.m_nDt = 0;
            _this.name = WorldVisitAttack.NAME;
            _this.m_nCid = cid;
            _this.m_RefGoldList = [];
            _this.initApp("world/world_visit_attack.exml");
            return _this;
        }
        WorldVisitAttack.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_VISIT_DATA_REFRESH,
                ProtoDef.S2C_VISIT_CD_SPEED,
            ];
        };
        /**处理协议号事件 */
        WorldVisitAttack.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_DATA_REFRESH: {
                    var data = body;
                    if (this.m_nCid != data.visitEventData.cityId)
                        return;
                    this.updateRefeshHero();
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: {
                    var data = body;
                    if (this.m_nCid != data.visitEventData.cityId)
                        return;
                    this.updateDownTime();
                    break;
                }
            }
        };
        WorldVisitAttack.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            Utils.TimerManager.remove(this.update, this);
        };
        WorldVisitAttack.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_RefGoldList = ConstUtil.getNumArray(IConstEnum.VISIT_REFRESH_PRICE);
            this.updateRefeshHero();
            this.updateDownTime();
            this.update();
            Utils.TimerManager.remove(this.update, this);
            Utils.TimerManager.doTimer(1000, 0, this.update, this);
            this.m_pLbNum.text = PropModel.getPropNum(PropEnum.WORLD_VISIT_ITEM) + "/1";
            this.initEvent();
            this.onGuideCondition();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldVisitAttack.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.go);
            com_main.EventManager.addTouchScaleListener(this.m_refreshBtn, this, this.refreshHero);
            // EventManager.addTouchScaleListener(this.m_pRef, this, this.refreshHero);
            com_main.EventManager.addTouchScaleListener(this.m_accBtn, this, this.accTime);
        };
        /**
         * 加速时间
         */
        WorldVisitAttack.prototype.accTime = function () {
            var curEndTime = this.m_tData.refreshStamp + this.m_tCfg.cooling;
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.WorldVisit, targetId: this.m_nCid,
                startTime: this.m_tData.refreshStamp,
                endTime: curEndTime,
                speedUpTime: this.m_tData.speed
            });
        };
        /**刷新武将 */
        WorldVisitAttack.prototype.refreshHero = function () {
            var count = this.m_tData.refreshCount > (this.m_RefGoldList.length - 1) ? this.m_RefGoldList.length - 1 : this.m_tData.refreshCount;
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_RefGoldList[count], 1)) {
                WorldProxy.C2S_VISIT_DATA_REFRESH(this.m_nCid);
            }
        };
        /**关闭界面 */
        WorldVisitAttack.prototype.closeView = function () {
            com_main.UpManager.history();
        };
        /**前往 */
        WorldVisitAttack.prototype.go = function () {
            var event = WorldModel.getVisitEventById(this.m_nCid);
            if (!event) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL), 1, true);
                return;
            }
            else if (event.generalId > 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL1), 1, true);
                return;
            }
            if (!WorldModel.isOwnerCity(event.cityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL2), 1, true);
                return;
            }
            if (PropModel.getPropNum(PropEnum.WORLD_VISIT_ITEM) == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL3), 1, true);
                return;
            }
            com_main.UpManager.history();
            Utils.open_view(TASK_UI.POP_WORLD_VIEW_PANEL, { id: this.m_nCid });
        };
        WorldVisitAttack.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
            com_main.EventManager.removeEventListener(this.m_pBtnGo);
            com_main.EventManager.removeEventListener(this.m_accBtn);
            com_main.EventManager.removeEventListener(this.m_refreshBtn);
        };
        /**
         * 计算元宝显示
         */
        WorldVisitAttack.prototype.updateRefeshHero = function () {
            this.m_tData = WorldModel.getVisitEventById(this.m_nCid);
            this.m_tCfg = C.VisitConfig[this.m_tData.visitId];
            this.m_pLbContent.text = GLan(this.m_tCfg.starttext);
            var count = this.m_tData.refreshCount > (this.m_RefGoldList.length - 1) ? this.m_RefGoldList.length - 1 : this.m_tData.refreshCount;
            this.m_reCout.text = "" + this.m_RefGoldList[count];
            this.m_pItem.setGenId(this.m_tCfg.icon);
            this.m_pItem.scaleX = 0.7;
            this.m_pItem.scaleY = 0.7;
            var config = C.GeneralConfig[this.m_tCfg.heroId];
            this.m_pHeroName.text = GLan(config.name);
            this.m_genCard.setInfo(this.m_tCfg.heroId, true);
        };
        /**
         * 更新倒计时
         */
        WorldVisitAttack.prototype.updateDownTime = function () {
            var _this = this;
            this.m_tData = WorldModel.getVisitEventById(this.m_nCid);
            var endTime = this.m_tData.refreshStamp == 0 ? this.m_tData.refreshStamp : (this.m_tData.refreshStamp + this.m_tCfg.cooling);
            var curtime = Math.floor(TimerUtils.getServerTime());
            this.m_nDt = endTime - curtime - this.m_tData.speed;
            if (this.m_nDt <= 0) {
                this.m_pBtnGo.visible = true;
                this.m_pGTime.visible = false;
            }
            else {
                this.m_pBtnGo.visible = false;
                this.m_pGTime.visible = true;
                Utils.TimerManager.remove(this.update, this);
                Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, function () {
                    _this.m_pBtnGo.visible = true;
                    _this.m_pGTime.visible = false;
                });
            }
        };
        WorldVisitAttack.prototype.update = function () {
            this.m_nDt--;
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pBtnGo.visible = true;
                this.m_pGTime.visible = false;
                return;
            }
            this.m_downTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
        };
        /**检查新手引导面板条件 */
        WorldVisitAttack.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_VISIT_WND);
        };
        WorldVisitAttack.NAME = "WorldVisitAttack";
        return WorldVisitAttack;
    }(com_main.CView));
    com_main.WorldVisitAttack = WorldVisitAttack;
    /**
     * 出征拜访选择
     */
    var WorldVisitPanel = /** @class */ (function (_super_1) {
        __extends(WorldVisitPanel, _super_1);
        function WorldVisitPanel(cid) {
            var _this = _super_1.call(this) || this;
            _this.m_nCid = 0;
            _this.name = WorldVisitPanel.NAME;
            _this.currentState = "visit";
            _this.initApp("world/world_hero_panel.exml");
            _this.m_nCid = cid;
            return _this;
        }
        WorldVisitPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldVisitPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.__init_hero();
            this.m_aPopUp.setTitleLabel('选择挑战武将');
            this.onGuideCondition();
        };
        WorldVisitPanel.prototype.__init_hero = function () {
            var _this = this;
            var data = GeneralModel.getOwnGeneralWithSort();
            var fn = (function (e) {
                WorldProxy.C2S_GENERAL_VISIT(e, _this.m_nCid);
                com_main.UpManager.history();
            }).bind(this);
            var genVos = GeneralModel.getOwnGeneralWithSortFight();
            var event = WorldModel.getVisitEventById(this.m_nCid);
            var a = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var v = data_1[_i];
                a.push({ gid: v.generalId, fight: v.fight, cb: fn, visit: WorldModel.isInVisitbyGenId(v.generalId) });
            }
            this.m_pCollection = new eui.ArrayCollection(a);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldViewItem;
            this.m_pList.useVirtualLayout = true;
        };
        /**检查新手引导面板条件 */
        WorldVisitPanel.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_FIGHT_SEL_WND);
        };
        WorldVisitPanel.NAME = "WorldVisitPanel";
        return WorldVisitPanel;
    }(com_main.CView));
    com_main.WorldVisitPanel = WorldVisitPanel;
    var WorldViewItem = /** @class */ (function (_super_1) {
        __extends(WorldViewItem, _super_1);
        function WorldViewItem(data, cb) {
            var _this = _super_1.call(this) || this;
            _this.m_nHeroId = 0;
            _this.m_bVisit = false;
            _this.currentState = "visit";
            _this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
            return _this;
            // this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            // this.cacheAsBitmap = true;
        }
        WorldViewItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldViewItem.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchTapListener(this, this, function () {
                if (_this.m_pCallBack) {
                    if (_this.m_bVisit) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL4), 1, true);
                        return;
                    }
                    _this.m_pCallBack(_this.m_nHeroId);
                }
            });
        };
        WorldViewItem.prototype.dataChanged = function () {
            this.m_nHeroId = this.data.gid;
            this.m_pCallBack = this.data.cb;
            this.m_bVisit = this.data.visit;
            this.m_pLbName.text = GeneralModel.getGeneralName(this.m_nHeroId);
            // this.m_labelFight.text = `${this.data.fight}`;
            this.m_comFightItem.setFight(this.data.fight);
            this.m_pHeroHead.setGenId(this.m_nHeroId);
            Utils.isGray(this.m_bVisit, this);
        };
        return WorldViewItem;
    }(eui.ItemRenderer));
    com_main.WorldViewItem = WorldViewItem;
})(com_main || (com_main = {}));
