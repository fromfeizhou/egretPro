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
     * 行军加速面板
     */
    var WorldAcceleratePanel = /** @class */ (function (_super_1) {
        __extends(WorldAcceleratePanel, _super_1);
        function WorldAcceleratePanel(data) {
            var _this = _super_1.call(this) || this;
            _this.m_bTouch = false;
            _this.m_nDt = 0;
            _this.m_nAllDt = 0;
            _this.m_gold_accel1 = 0; //加速25需要的元宝
            _this.m_gold_accel2 = 0; //加速50需要的元宝
            _this.name = WorldAcceleratePanel.NAME;
            _this.m_teamKey = data.teamKey;
            _this.initApp("world/world_accelerate_panel.exml");
            return _this;
        }
        WorldAcceleratePanel.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_TEAMMOVE_QUICKEN,
            ];
        };
        WorldAcceleratePanel.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAMMOVE_QUICKEN: {
                    this.m_bTouch = false;
                    EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_SPEED), 1);
                    this.__reset();
                    break;
                }
            }
        };
        WorldAcceleratePanel.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.update, this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldAcceleratePanel.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.freshItem, this);
            this.__resetTime();
            this.m_btnOk1.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_btnOk2.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_gold_accel1 = Number(ConstUtil.getStringArray(IConstEnum.TEAM_GOLD_COIN_ACCELERATION)[0].split("_")[1]);
            this.m_gold_accel2 = Number(ConstUtil.getStringArray(IConstEnum.TEAM_GOLD_COIN_ACCELERATION)[1].split("_")[1]);
            this.m_btnGoldOK1.setCostLabel("" + this.m_gold_accel1);
            this.m_btnGoldOK2.setCostLabel("" + this.m_gold_accel2);
            this.m_btnGoldOK1.setTitleLabel(GCode(CLEnum.BUY_AND_USE));
            this.m_btnGoldOK2.setTitleLabel(GCode(CLEnum.BUY_AND_USE));
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            var scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            this.m_pPrTime.scaleX = scale > 1 ? 1 : scale;
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, function () {
                Utils.TimerManager.remove(_this.update, _this);
                com_main.UpManager.history();
            });
            this.freshItem();
            this.initEvent();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldAcceleratePanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventManager.addTouchScaleListener(this.m_btnOk1, this, this.__on_click);
            com_main.EventManager.addTouchScaleListener(this.m_btnOk2, this, this.__on_click_all);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoldOK1, this, this.__on_click_gold);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoldOK2, this, this.__on_click_gold_all);
        };
        WorldAcceleratePanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
     * 事件监听 end
     * =====================================================================================
     */
        WorldAcceleratePanel.prototype.freshItem = function () {
            this.m_pItem1.setItemInfo(PropEnum.MarchSpeedItem1, PropModel.getPropNum(PropEnum.MarchSpeedItem1));
            this.m_pItem2.setItemInfo(PropEnum.MarchSpeedItem2, PropModel.getPropNum(PropEnum.MarchSpeedItem2));
            if (PropModel.getPropNum(PropEnum.MarchSpeedItem1) == 0)
                this.m_pItem1.m_labCount.text = "0";
            if (PropModel.getPropNum(PropEnum.MarchSpeedItem2) == 0)
                this.m_pItem2.m_labCount.text = "0";
            this.m_pBtnOk1.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem1) > 0;
            this.m_pBtnOk2.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem2) > 0;
            this.m_btnGoldOK1.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem1) == 0;
            this.m_btnGoldOK2.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem2) == 0;
        };
        WorldAcceleratePanel.prototype.__on_click = function (e) {
            if (this.m_bTouch)
                return;
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data && this.__checkCanUseItem(PropEnum.MarchSpeedItem1)) {
                this.m_bTouch = true;
                WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem1, 1);
            }
        };
        WorldAcceleratePanel.prototype.__on_click_gold = function (e) {
            if (this.m_bTouch)
                return;
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold_accel1, 2)) {
                var data = WorldModel.getTeamMoveData(this.m_teamKey);
                if (data) {
                    this.m_bTouch = true;
                    WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem1, 2);
                }
            }
        };
        WorldAcceleratePanel.prototype.__on_click_all = function (e) {
            if (this.m_bTouch)
                return;
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data && this.__checkCanUseItem(PropEnum.MarchSpeedItem2)) {
                this.m_bTouch = true;
                WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem2, 1);
            }
        };
        WorldAcceleratePanel.prototype.__on_click_gold_all = function (e) {
            if (this.m_bTouch)
                return;
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold_accel2, 2)) {
                var data = WorldModel.getTeamMoveData(this.m_teamKey);
                if (data) {
                    this.m_bTouch = true;
                    WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem2, 2);
                }
            }
        };
        WorldAcceleratePanel.prototype.update = function () {
            this.m_nDt--;
            if (this.m_nDt < 0)
                return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            var scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            egret.Tween.get(this.m_pPrTime).to({ scaleX: scale > 1 ? 1 : scale }, 1000);
            if (this.m_nDt < 0) {
                Utils.TimerManager.remove(this.update, this);
                com_main.UpManager.history();
            }
        };
        WorldAcceleratePanel.prototype.__reset = function () {
            var _this = this;
            Utils.TimerManager.remove(this.update, this);
            this.__resetTime();
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            var scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            this.m_pPrTime.scaleX = scale > 1 ? 1 : scale;
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, function () {
                Utils.TimerManager.remove(_this.update, _this);
                com_main.UpManager.history();
            });
        };
        /**重置队伍时间 */
        WorldAcceleratePanel.prototype.__resetTime = function () {
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data) {
                this.m_nAllDt = data.endTime - data.startTime;
                this.m_nDt = data.endTime - TimerUtils.getServerTime();
                this.m_nDt = this.m_nDt <= 0 ? 0 : this.m_nDt;
            }
        };
        /**判断能否使用加速道具 */
        WorldAcceleratePanel.prototype.__checkCanUseItem = function (itemId) {
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (this.m_nDt < 10) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_SP_FAL), 1, true);
                return false;
            }
            if (!PropModel.isItemEnough(itemId, 1, 1)) {
                return false;
            }
            return true;
        };
        WorldAcceleratePanel.NAME = "WorldAcceleratePanel";
        return WorldAcceleratePanel;
    }(com_main.CView));
    com_main.WorldAcceleratePanel = WorldAcceleratePanel;
})(com_main || (com_main = {}));
