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
     * 出征部队选择
     */
    var WorldHeroPanel = /** @class */ (function (_super_1) {
        __extends(WorldHeroPanel, _super_1);
        function WorldHeroPanel(cityId) {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.m_nCurOrder = -1; //当前选中部队下标
            _this.m_nMoveDt = 0;
            _this.name = WorldHeroPanel.NAME;
            _this.m_nCityId = cityId;
            _this.initApp("world/world_hero_panel.exml");
            return _this;
        }
        WorldHeroPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        WorldHeroPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_aPopUp.setTitleLabel('出征部队选择');
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = com_main.WorldHeroItem;
            this.m_pList.useVirtualLayout = true;
            var list = [];
            for (var i = 0; i < TeamModel.getTeamMax(1 /* WORLD */); i++) {
                var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, i);
                if (this.checkTeamCity(teamVo.cityId)) {
                    list.push({ order: i, cityId: this.m_nCityId, selected: false });
                }
            }
            //排序
            list.sort(this.sortFunc);
            this.m_pCollection.replaceAll(list);
            this.changeTeamSelected(this.m_nCurOrder);
            this.initEvent();
        };
        WorldHeroPanel.prototype.sortFunc = function (p1, p2) {
            var teamVo1 = TeamModel.getTeamVoByType(1 /* WORLD */, p1.order);
            var state1 = teamVo1.state;
            if (teamVo1.isEmptyTeam())
                state1 = 200;
            var teamVo2 = TeamModel.getTeamVoByType(1 /* WORLD */, p2.order);
            var state2 = teamVo2.state;
            if (teamVo2.isEmptyTeam())
                state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            }
            else {
                return p1.order - p2.order;
            }
        };
        /**校验队伍是否符合当前城池列表 */
        WorldHeroPanel.prototype.checkTeamCity = function (cityId) {
            if (cityId == this.m_nCityId)
                return false;
            //队伍在出生城
            var teamCfg = C.WorldMapConfig[cityId];
            if (teamCfg && teamCfg.type == CityType.XIANG_BIRTH && teamCfg.mapCity == this.m_nCityId)
                return false;
            return true;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldHeroPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.onBtnGoHandler);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.refreshItem, this);
            this.m_pList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        };
        WorldHeroPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnGo);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            this.m_pList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        };
        /**刷新组件 */
        WorldHeroPanel.prototype.refreshItem = function (vo) {
            //只刷新世界地图队伍
            if (vo && vo.teamType == 1 /* WORLD */) {
                for (var i = 0; i < this.m_pCollection.source.length; i++) {
                    var data = this.m_pCollection.getItemAt(i);
                    if (data.order == vo.order) {
                        //到达同一个城池 移除
                        if (vo.cityId == this.m_nCityId) {
                            this.m_pCollection.removeItemAt(i);
                            return;
                        }
                        this.m_pCollection.itemUpdated(data);
                        return;
                    }
                }
                if (this.checkTeamCity(vo.cityId)) {
                    this.m_pCollection.addItem({ order: vo.order, cityId: this.m_nCityId, selected: false });
                }
            }
        };
        /**选中队伍 */
        WorldHeroPanel.prototype.onListHandler = function (e) {
            var data = e.item;
            if (data) {
                var order = data.order;
                //队伍未解锁
                if (order > TeamModel.getTeamMax(1 /* WORLD */)) {
                    return;
                }
                var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, order);
                if (!teamVo)
                    return;
                //空队伍
                if (teamVo.isEmptyTeam()) {
                    com_main.UpManager.history();
                    Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: order });
                    return;
                }
                this.changeTeamSelected(order);
            }
        };
        /**选中队伍切换 */
        WorldHeroPanel.prototype.changeTeamSelected = function (order) {
            if (this.m_nCurOrder == order) {
                this.m_nCurOrder = -1;
                this.resetItemSelView(order);
                this.__set_time(0);
                return;
            }
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, order);
            if (!teamVo)
                return;
            if (teamVo.state != 0 /* IDLE */) {
                var tips = TeamModel.getStateDes(teamVo.state);
                EffectUtils.showTips(tips, 1, true);
                return;
            }
            if (teamVo.cityId == this.m_nCityId) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL2), 1, true);
                return;
            }
            var _a = com_main.DjikstraGraph.Instance.GetWayTime(teamVo.cityId, this.m_nCityId), dt = _a[0], speed = _a[1], _ = _a[2];
            if (dt == 0 && speed == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL4));
                return;
            }
            var mapCfg = C.WorldMapConfig[this.m_nCityId];
            if (mapCfg.type == CityType.BIRTH && !WorldModel.isOwnerCity(this.m_nCityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL5));
                return;
            }
            this.resetItemSelView(this.m_nCurOrder);
            this.resetItemSelView(order);
            this.m_nCurOrder = order;
            this.__set_time(dt);
            this.__set_move_cost();
        };
        /**前往按钮点击 */
        WorldHeroPanel.prototype.onBtnGoHandler = function (e) {
            if (this.m_nCurOrder == -1) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL), 1, true);
                return;
            }
            var pack = [];
            var through = null;
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nCurOrder);
            /**判断血量是否低于30% */
            var teamUIInfo = teamVo.getTeamUiInfo();
            if (teamUIInfo.hp < Math.floor(teamUIInfo.maxHp * 0.3) && !WorldModel.isOwnerCity(this.m_nCityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL1));
                return;
            }
            //同一个城市间不能移动
            if (this.m_nCityId == teamVo.cityId) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL2), 1, true);
                return;
            }
            if (teamVo.state != 0 /* IDLE */) {
                var tips = TeamModel.getStateDes(teamVo.state);
                EffectUtils.showTips(tips, 1, true);
                return;
            }
            //获得城市顶点
            if (!through) {
                com_main.DjikstraGraph.Instance.execute(teamVo.cityId);
                var vert = com_main.DjikstraGraph.Instance.walkIds(this.m_nCityId);
                if (vert.length <= 1) {
                    error("=========>寻找的路线为空");
                    return;
                }
                through = vert;
            }
            //把襄阳战出生点转成世界地图出生点
            if (through.indexOf(WorldModel.xBirthCity) != -1)
                through[through.indexOf(WorldModel.xBirthCity)] = C.WorldMapConfig[WorldModel.xBirthCity].mapCity;
            pack.push({ teamId: teamVo.id, cityPath: through });
            if (pack.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL3), 1, true);
                return;
            }
            var cost = Number(this.m_pLbFood.text);
            if (PropModel.isItemEnough(PropEnum.FOOD, cost, 1)) {
                WorldProxy.C2S_TEAMMOVE_TO(pack, teamVo.cityId);
            }
            com_main.UpManager.history();
        };
        /**
        * 设置最大的出征时间
        * @private
        * @return void
        * @memberof WorldHeroPanel
        */
        WorldHeroPanel.prototype.__set_time = function (dt) {
            if (dt == 0) {
                this.m_pGSatus.visible = false;
                this.m_pLbTime.visible = false;
            }
            else {
                this.m_pGSatus.visible = true;
                this.m_pLbTime.visible = true;
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(dt, 1);
                this.m_nMoveDt = dt;
            }
        };
        /**刷新移动消耗 */
        WorldHeroPanel.prototype.__set_move_cost = function () {
            if (this.m_nCurOrder == -1)
                return;
            var cost = 0;
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nCurOrder);
            cost += teamVo.getMoveCost();
            this.m_pLbFood.text = Math.floor(this.m_nMoveDt / 30 * cost) + '';
        };
        /**重置显示 */
        WorldHeroPanel.prototype.resetItemSelView = function (order) {
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.order == order) {
                    data.selected = !data.selected;
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
        };
        WorldHeroPanel.NAME = "WorldHeroPanel";
        return WorldHeroPanel;
    }(com_main.CView));
    com_main.WorldHeroPanel = WorldHeroPanel;
})(com_main || (com_main = {}));
