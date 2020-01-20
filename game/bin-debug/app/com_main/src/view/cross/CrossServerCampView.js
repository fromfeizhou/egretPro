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
     * 军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    var CrossServerCampView = /** @class */ (function (_super_1) {
        __extends(CrossServerCampView, _super_1);
        function CrossServerCampView(data) {
            var _this = _super_1.call(this) || this;
            _this.isSave = false;
            _this.m_maxHp = 0;
            _this.name = CrossServerCampView.NAME;
            _this.m_nIndex = data.id;
            _this.initApp("cross/CrossServerCampViewSkin.exml");
            return _this;
        }
        CrossServerCampView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CrossServerCampView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comIndexBar.index = this.m_nIndex;
            this.m_pAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP));
            this.m_teamPanel.currentState = 'embattle';
            this.addEvent();
            var max = TeamModel.getTeamMax(5 /* CROSS_SERVER */);
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                item.setInfo(5 /* CROSS_SERVER */, i);
                item.open = (i < max);
                if (i == this.m_nIndex)
                    item.selected = true;
            }
            this.m_teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nIndex);
            // let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
            // this.m_maxHp = unNull(crossServerConst) ? Number(crossServerConst.value) : 0;
            this.changeTeamHandler(this.m_nIndex);
            this.onGuideCondition();
            this.setBtnShow(!this.m_teamVo.isSoldierFull());
            this.updateTroopHp();
        };
        /**===========================================================================================================
         * event begin
         * ===========================================================================================================
         */
        CrossServerCampView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBack, this, function () {
                com_main.UpManager.history();
            });
            this.m_comIndexBar.initBar(this.m_nIndex, TeamModel.getTeamMax(5 /* CROSS_SERVER */), this.changeTeamHandler, this);
            com_main.EventManager.addTouchScaleListener(this.m_pAddBtn, this, this.onAddBtn);
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                com_main.EventManager.addTouchTapListener(item, this, this.onChangeSel);
            }
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this.onAutoUpdateTroop, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this.onUpdateBtn, this);
            com_main.EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.refreshTeamArmy, this);
        };
        CrossServerCampView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this);
            com_main.EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
        };
        /**改变选中 */
        /**改变选中 */
        CrossServerCampView.prototype.onChangeSel = function (evt) {
            var item = evt.currentTarget;
            if (item.order >= TeamModel.getTeamMax(5 /* CROSS_SERVER */)) {
                EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                return;
            }
            if (this.m_nIndex == item.order) {
                return;
            }
            if (!item.open) {
                EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                return;
            }
            if (this.m_nIndex >= 0) {
                this.setQueItemSel(this.m_nIndex, false);
            }
            this.m_nIndex = item.order;
            this.setQueItemSel(this.m_nIndex, true);
        };
        /**队列选中刷新 */
        CrossServerCampView.prototype.setQueItemSel = function (index, val) {
            var item = this["queItem" + index];
            if (item)
                item.selected = val;
            if (val)
                this.changeTeamHandler(index);
        };
        CrossServerCampView.prototype.onUpdateBtn = function (visible) {
            this.m_pAddBtn.visible = visible && !this.m_teamVo.isSoldierFull();
        };
        CrossServerCampView.prototype.setBtnShow = function (visible) {
            this.m_pAddBtn.visible = visible;
        };
        CrossServerCampView.prototype.onAutoUpdateTroop = function () {
            this.isSave = true;
        };
        /**补兵按钮 */
        CrossServerCampView.prototype.onAddBtn = function (pvt) {
            if (CrossModel.checkCanTroop(this.m_nIndex)) {
                CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex);
            }
            else {
                EffectUtils.showTips("兵库兵力不够");
            }
        };
        /**===========================================================================================================
         * event end
         * ===========================================================================================================
         */
        CrossServerCampView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS,
                ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO,
                ProtoDef.S2C_TEAM_LIST
            ];
        };
        CrossServerCampView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAM_LIST: {
                    this.refreshTeamState();
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS: {
                    this.refreshTeamArmy();
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                    this.updateTroopHp();
                    break;
                }
            }
        };
        /**
         * 切换部队
         * @protected
         * @return void
         */
        CrossServerCampView.prototype.changeTeamHandler = function (order) {
            if (order === void 0) { order = 0; }
            this.m_nIndex = order;
            this.m_teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nIndex);
            this.m_teamPanel.setTeamData(5 /* CROSS_SERVER */, this.m_nIndex, false);
            this.refreshTileView();
            this.refreshTeamArmy();
            this.refreshTeamState();
        };
        CrossServerCampView.prototype.onGoArmy = function (pvt) {
            Utils.open_view(TASK_UI.ARMS_PANEL);
        };
        /**刷新通用显示 */
        CrossServerCampView.prototype.refreshTileView = function () {
            this.m_teamPanel.setTeamTileName("" + GCode(CLEnum.CROSS_TEAM_KFBD) + (this.m_nIndex + 1));
        };
        /**更新血量显示 */
        CrossServerCampView.prototype.updateTroopHp = function () {
            this.m_troop.refresh(CrossModel.curTroop, CrossModel.maxTroop, GCode(CLEnum.CROSS_TEAM_TIPS1));
        };
        /**
         * 更新兵种兵力信息
         * @private
         * @return void
         */
        CrossServerCampView.prototype.refreshTeamArmy = function () {
            this.refreshsoliderNum();
            this.updateAddBtn();
            this.m_pAddBtn.visible = !this.m_teamVo.isSoldierFull();
        };
        /**计算最大库存 */
        CrossServerCampView.prototype.calcuMaxStorge = function (type) {
            var id = MainMapModel.getBuildInfoBySolider(type).id;
            var cfg = MainMapModel.getBuildingTrainCfgbyBuildId(id);
            if (isNull(cfg))
                return 0;
            return cfg.storagelimit;
        };
        CrossServerCampView.prototype.calcuTotalStorge = function () {
            var sum = 0;
            for (var i = 1; i <= 4; i++) {
                sum += TeamModel.getTroopsInfo(i).num;
            }
            return sum;
        };
        CrossServerCampView.prototype.calcuStorageByType = function (type) {
            return TeamModel.getTroopsInfo(type).num;
        };
        CrossServerCampView.prototype.updateAddBtn = function () {
            var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nIndex);
            this.m_pAddBtn.visible = !teamVo.isSoldierFull();
        };
        /**刷新兵力显示 */
        CrossServerCampView.prototype.refreshsoliderNum = function () {
            this.m_pLbBBNum.text = TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num + '';
            this.m_pLbQBNum.text = TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num + '';
            this.m_pLbGBNum.text = TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num + '';
        };
        /**
         * 军队的行军状态
         * @protected
         * @return
         */
        CrossServerCampView.prototype.refreshTeamState = function () {
            var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nIndex);
            this.m_pback.visible = false;
            if (teamVo.state !== 0 /* IDLE */) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = TeamModel.getStateDes(teamVo.state);
                return;
            }
            this.m_pArmyStatus.visible = false;
            if (CrossModel.crossStatus == 5 /* CITY_WAR */) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = CrossModel.getTeamCityName(teamVo);
            }
        };
        CrossServerCampView.NAME = "CrossServerCampView";
        return CrossServerCampView;
    }(com_main.CView));
    com_main.CrossServerCampView = CrossServerCampView;
})(com_main || (com_main = {}));
