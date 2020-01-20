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
    var WorldRankView = /** @class */ (function (_super_1) {
        __extends(WorldRankView, _super_1);
        function WorldRankView(data) {
            var _this = _super_1.call(this) || this;
            _this.isSave = false;
            _this.soldiderTypeArray = [SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.ARROWSOLDIER, SoldierMainType.PIKEMAN];
            _this.name = WorldRankView.NAME;
            _this.m_nIndex = data.id;
            _this.initApp("team/WorldRankViewSkin.exml");
            return _this;
        }
        WorldRankView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldRankView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comIndexBar.index = this.m_nIndex;
            this.m_pQuickAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP_ALL));
            this.m_pAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP));
            this.m_teamPanel.currentState = 'embattle';
            this.addEvent();
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                item.setInfo(1 /* WORLD */, i);
                item.open = (i < TeamModel.getTeamMax(1 /* WORLD */));
                if (i == this.m_nIndex)
                    item.selected = true;
            }
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            this.m_checkBox.selected = teamVo.autoFill;
            this.changeTeamHandler(this.m_nIndex);
            this.onGuideCondition();
            this.setBtnShow(!this.isTeamFull());
        };
        /**补兵按钮刷新 */
        WorldRankView.prototype.setBtnShow = function (visible) {
            this.m_pAddBtn.visible = visible;
            this.m_pQuickAddBtn.visible = visible;
        };
        /**===========================================================================================================
         * event begin
         * ===========================================================================================================
         */
        WorldRankView.prototype.addEvent = function () {
            var _this = this;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBack, this, function () {
                com_main.UpManager.history();
            });
            this.m_comIndexBar.initBar(this.m_nIndex, TeamModel.getTeamMax(1 /* WORLD */), this.changeTeamHandler, this);
            com_main.EventManager.addTouchScaleListener(this.m_pQuickAddBtn, this, function () {
                var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, _this.m_nIndex);
                if (TeamModel.isWar(teamVo.state)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                    return;
                }
                if (PropModel.isItemEnough(PropEnum.GOLD, _this.m_gold, 1)) {
                    TeamModel.isNeedTroopTips = true;
                    TeamProxy.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS(_this.m_nIndex);
                }
            });
            com_main.EventManager.addTouchScaleListener(this.m_pAddBtn, this, this.onAddBtn);
            com_main.EventManager.addTouchScaleListener(this.m_pback, this, this.onBackBirthCity);
            com_main.EventManager.addTouchTapListener(this.m_pArmy, this, this.onGoArmy);
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                com_main.EventManager.addTouchTapListener(item, this, this.onChangeSel);
            }
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this.onAutoUpdateTroop, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this.onUpdateBtn, this);
            com_main.EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.refreshTeamArmy, this);
            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, this.onCheck, this);
        };
        WorldRankView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this);
            com_main.EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
            this.m_checkBox.removeEventListener(eui.UIEvent.CHANGE, this.onCheck, this);
        };
        /**改变选中 */
        WorldRankView.prototype.onChangeSel = function (evt) {
            var item = evt.currentTarget;
            if (this.m_nIndex == item.order) {
                return;
            }
            if (!item.open) {
                EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
                return;
            }
            if (this.m_nIndex >= 0) {
                this.setQueItemSel(this.m_nIndex, false);
            }
            this.m_nIndex = item.order;
            this.setQueItemSel(this.m_nIndex, true);
        };
        /**队列选中刷新 */
        WorldRankView.prototype.setQueItemSel = function (index, val) {
            var item = this["queItem" + index];
            if (item)
                item.selected = val;
            if (val)
                this.changeTeamHandler(index);
        };
        /**武将拖动 */
        WorldRankView.prototype.onUpdateBtn = function (visible) {
            this.m_pCheckBox.visible = visible;
            this.m_pAddBtn.visible = visible && !this.isTeamFull();
            this.m_pQuickAddBtn.visible = visible && !this.isTeamFull();
        };
        /**保存补兵 */
        WorldRankView.prototype.onAutoUpdateTroop = function () {
            this.isSave = true;
        };
        /**单选框操作 */
        WorldRankView.prototype.onCheck = function (evt) {
            //自动补满
            TeamModel.isNeedTroopTips = true;
            TeamProxy.C2S_TEAM_SET_AUTOFILL(this.m_nIndex, this.m_checkBox.selected);
        };
        /**补兵按钮 */
        WorldRankView.prototype.onAddBtn = function (pvt) {
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            if (TeamModel.isWar(teamVo.state)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                return;
            }
            if (this.isTeamFull())
                return;
            var isOpen = true;
            for (var _i = 0, _a = this.soldiderTypeArray; _i < _a.length; _i++) {
                var key = _a[_i];
                var type = Number(key);
                if (teamVo.isSoliderNeedFillByType(type)) {
                    if (TeamModel.getTroopsInfo(type).num > 0) {
                        isOpen = false;
                    }
                }
            }
            if (isOpen) {
                Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nIndex });
            }
            else {
                this.addHandler(true);
            }
        };
        /**自动补兵 */
        WorldRankView.prototype.addHandler = function (isTip) {
            if (isTip === void 0) { isTip = false; }
            //根据哪种类型缺补哪种
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            var canFillCity = CityBuildModel.hasCityPrivilege(teamVo.cityId, CityRewardType.REPAIR);
            if (canFillCity) {
                for (var _i = 0, _a = this.soldiderTypeArray; _i < _a.length; _i++) {
                    var type = _a[_i];
                    if (TeamModel.getTroopsInfo(type).num > 0 && teamVo.isSoliderNeedFillByType(type)) {
                        TeamProxy.C2S_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex, Number(type));
                    }
                }
            }
            else {
                if (isTip)
                    EffectUtils.showTips(GCode(CLEnum.CITY_BUILD_TIPS1), 1, true);
            }
        };
        /**
         * 切换部队
         * @protected
         * @return void
         */
        WorldRankView.prototype.changeTeamHandler = function (order) {
            if (order === void 0) { order = 0; }
            this.m_nIndex = order;
            this.m_teamPanel.setTeamData(1 /* WORLD */, this.m_nIndex, true);
            this.refreshTileView();
            this.refreshTeamArmy();
            this.refreshTeamState();
        };
        /**刷新通用显示 */
        WorldRankView.prototype.refreshTileView = function () {
            this.m_teamPanel.setTeamTileName("" + GCode(CLEnum.WOR_TEAM_GZBD) + (this.m_nIndex + 1));
        };
        /**
         * 军队的行军状态
         * @protected
         * @return
         */
        WorldRankView.prototype.refreshTeamState = function () {
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            this.m_pback.visible = false;
            if (teamVo.state !== 0 /* IDLE */) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = TeamModel.getStateDes(teamVo.state);
                return;
            }
            this.m_pArmyStatus.visible = false;
            if (teamVo.cityId != WorldModel.birthCity) {
                this.m_pArmyStatus.visible = true;
                this.m_pback.visible = true;
                var city = WorldModel.getCityConfig(teamVo.cityId);
                this.m_pLbArmyStatus.text = GLan(city.name);
            }
        };
        WorldRankView.prototype.onGoArmy = function (pvt) {
            Utils.open_view(TASK_UI.ARMS_PANEL);
        };
        WorldRankView.prototype.onBackBirthCity = function (pvt) {
            var _this = this;
            var tip = GCode(CLEnum.CAMP_BIRTH_TIPS);
            Utils.showConfirmPop(tip, function () {
                com_main.UpManager.history();
                _this.backToBirthCity();
            }, this);
        };
        WorldRankView.prototype.backToBirthCity = function () {
            var pack = [];
            var through = null;
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            //获得城市顶点
            if (!through) {
                com_main.DjikstraGraph.Instance.execute(teamVo.cityId);
                var vert = com_main.DjikstraGraph.Instance.walkIds(WorldModel.birthCity);
                if (vert.length <= 1) {
                    error("=========>寻找的路线为空");
                    return;
                }
                through = vert;
            }
            pack.push({ teamId: teamVo.id, cityPath: through });
            WorldProxy.C2S_TEAMMOVE_TO(pack, teamVo.cityId);
        };
        /**===========================================================================================================
         * event end
         * ===========================================================================================================
         */
        WorldRankView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_ARMY,
                ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS,
                ProtoDef.C2S_TEAMMOVE_LIST,
                ProtoDef.S2C_TEAM_LIST,
                ProtoDef.S2C_TEAM_SET_AUTOFILL,
                ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS
            ];
        };
        WorldRankView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS:
                case ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS: {
                    if (TeamModel.isNeedTroopTips) {
                        TeamModel.isNeedTroopTips = false;
                    }
                    this.refreshTeamArmy();
                    break;
                }
                case ProtoDef.C2S_TEAMMOVE_LIST:
                case ProtoDef.GET_ARMY: {
                    break;
                }
                case ProtoDef.S2C_TEAM_LIST: {
                    this.refreshTeamArmy();
                    var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
                    if (this.isSave && teamVo.autoFill) {
                        this.addHandler();
                        this.isSave = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TEAM_SET_AUTOFILL: {
                    var data = body;
                    if (data.order == this.m_nIndex) {
                        this.m_checkBox.selected = data.flag;
                        this.updateAddBtn();
                        if (data.flag)
                            this.addHandler();
                    }
                    break;
                }
            }
        };
        /**
         * 更新兵种兵力信息
         * @private
         * @return void
         */
        WorldRankView.prototype.refreshTeamArmy = function () {
            this.refreshsoliderNum();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            // this.soliderNum = teamVo.getSoliderTypeMap();
            for (var i = 1, j = 0; i <= 4; i++, j++) {
                var item = this.m_pGTroops.getChildByName("WorldRankTroops_" + i);
                if (!item) {
                    item = new WorldRankTroops(this.m_nIndex, i);
                    this.m_pGTroops.addChild(item);
                }
                // item.refresh(this.soliderNum[i][0], this.soliderNum[i][1]);
                item.refresh(TeamModel.getTroopsInfo(i).num, this.calcuMaxStorge(i));
            }
            this.m_checkBox.selected = teamVo.autoFill;
            this.calcuOneKeyGold();
            this.updateAddBtn();
            this.m_pQuickAddBtn.visible = !this.isTeamFull();
            this.m_pAddBtn.visible = !this.isTeamFull();
        };
        /**计算最大库存 */
        WorldRankView.prototype.calcuMaxStorge = function (type) {
            var id = MainMapModel.getBuildInfoBySolider(type).id;
            var cfg = MainMapModel.getBuildingTrainCfgbyBuildId(id);
            if (isNull(cfg))
                return 0;
            return cfg.storagelimit;
        };
        WorldRankView.prototype.calcuTotalStorge = function () {
            var sum = 0;
            for (var i = 1; i <= 4; i++) {
                sum += TeamModel.getTroopsInfo(i).num;
            }
            return sum;
        };
        WorldRankView.prototype.calcuStorageByType = function (type) {
            return TeamModel.getTroopsInfo(type).num;
        };
        /**判断兵力是否已经满 */
        WorldRankView.prototype.isTeamFull = function () {
            return this.m_bIsFull;
        };
        WorldRankView.prototype.updateAddBtn = function () {
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            this.m_pAddBtn.visible = !teamVo.autoFill && !this.isTeamFull();
        };
        WorldRankView.prototype.calcuOneKeyGold = function () {
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nIndex);
            this.m_gold = Math.ceil(teamVo.getFillHpCostGold());
            this.m_pQuickAddBtn.setCostLabel("" + this.m_gold);
            this.m_bIsFull = teamVo.isSoldierFull();
        };
        /**刷新兵力显示 */
        WorldRankView.prototype.refreshsoliderNum = function () {
            this.m_pLbBBNum.text = TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num + '';
            this.m_pLbQBNum.text = TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num + '';
            this.m_pLbGBNum.text = TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num + '';
        };
        /**检查新手引导面板条件 */
        WorldRankView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_CAMP_WND);
        };
        WorldRankView.NAME = "WorldRankView";
        return WorldRankView;
    }(com_main.CView));
    com_main.WorldRankView = WorldRankView;
    /**
     * 兵种兵力显示
     * @class WorldRankTroops
     * @extends CComponent
     */
    var WorldRankTroops = /** @class */ (function (_super_1) {
        __extends(WorldRankTroops, _super_1);
        // public m_pImgEffect: eui.Image;
        // public m_pArmyAddBtn: eui.Group;
        function WorldRankTroops(index, ty) {
            var _this = _super_1.call(this) || this;
            _this.m_nIndex = index;
            _this.m_nType = ty;
            _this.name = "WorldRankTroops_" + ty;
            _this.currentState = "solider" + ty;
            _this.skinName = Utils.getSkinName("app/world/world_rank_army.exml");
            return _this;
        }
        WorldRankTroops.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldRankTroops.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // let tw = egret.Tween.get(this.m_pImgEffect, { loop: true });
            // tw.to({ rotation: 360 }, 1000);
            // EventManager.addTouchScaleListener(this.m_pArmyAddBtn, this, () => {
            //     if (TeamModel.getTroopsInfo(this.m_nType).num == 0) {
            //         let cfg = MainMapModel.getSoldierLvCfg(this.m_nType);
            //         EffectUtils.showTips(GCodeFromat(CLEnum.WOR_SUPP_FAL2, cfg.name), 1, true);
            //         return;
            //     }
            //     TeamProxy.C2S_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex, this.m_nType);
            // });
        };
        /**刷新显示 */
        WorldRankTroops.prototype.refresh = function (curNum, maxNum, preDesc) {
            if (preDesc === void 0) { preDesc = ""; }
            if (maxNum == 0) {
                this.m_pLbPower.text = "";
                this.m_pTroops.scaleX = 1;
                // this.m_pArmyAddBtn.visible = false;
            }
            else {
                this.m_pLbPower.text = preDesc + ("" + curNum);
                var per = curNum / maxNum;
                this.m_pTroops.scaleX = per > 1 ? 1 : per;
                // this.m_pArmyAddBtn.visible = curNum < maxNum;
            }
        };
        return WorldRankTroops;
    }(com_main.CComponent));
    com_main.WorldRankTroops = WorldRankTroops;
})(com_main || (com_main = {}));
