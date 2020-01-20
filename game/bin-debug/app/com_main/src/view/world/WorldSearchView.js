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
     * 搜索列表信息
     * @export
     * @class WorldSearchView
     * @extends CView
     */
    var WorldSearchView = /** @class */ (function (_super_1) {
        __extends(WorldSearchView, _super_1);
        function WorldSearchView(body) {
            var _this = _super_1.call(this) || this;
            _this.m_nIndex = 0;
            _this.isRefresh = false;
            _this.name = WorldSearchView.NAME;
            _this.initApp("world/world_search_view.exml");
            return _this;
        }
        WorldSearchView.prototype.onDestroy = function () {
            this.$removeEvent();
            _super_1.prototype.onDestroy.call(this);
            WorldModel.isInSearchPanel = false;
        };
        WorldSearchView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_VISIT_EVENT_UPDATE,
                ProtoDef.S2C_WORLDMAP_EVENT_ACT,
                ProtoDef.S2C_WORLDMAP_EVENT_OVER,
                ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER,
            ];
        };
        WorldSearchView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_EVENT_UPDATE: {
                    var index = 0;
                    var itemData = this.m_pTabList.selectedItem;
                    index = itemData ? itemData.index : this.m_pTabCollection.getItemAt(0).index;
                    var selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(4, itemData.index != 4, selectedIndex);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_ACT: {
                    this.$initMain();
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: {
                    var index = 0;
                    var itemData = this.m_pTabList.selectedItem;
                    index = itemData ? itemData.index : this.m_pTabCollection.getItemAt(0).index;
                    var selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(index, false, selectedIndex);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                    var index = 0;
                    var itemData = this.m_pTabList.selectedItem;
                    index = itemData ? itemData.index : this.m_pTabCollection.getItemAt(0).index;
                    var selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(index, false, selectedIndex);
                    break;
                }
            }
        };
        WorldSearchView.prototype.$addEvent = function () {
            var _this = this;
            com_main.EventMgr.addEvent(TaskWorldEvent.SEARCH_TAB, function (index) {
                if (_this.m_nIndex == index)
                    return;
                if (_this.$initMain(index, true)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FAL));
                    return;
                }
                _this.$initMain(index);
                var data = _this.m_pTabCollection.getItemAt(_this.m_nIndex);
                data.sel = false;
                _this.m_pTabCollection.replaceItemAt(data, _this.m_nIndex);
                var curData = _this.m_pTabCollection.getItemAt(index);
                curData.sel = true;
                _this.m_pTabCollection.replaceItemAt(curData, index);
                _this.m_nIndex = index;
                _this.m_pCSroller.viewport.scrollV = 0;
            }, this);
            this.m_pTabList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, function () {
                var index = 0;
                var itemData = _this.m_pTabList.selectedItem;
                index = itemData ? itemData.index : _this.m_pTabCollection.getItemAt(0).index;
                var selectedIndex = _this.m_pTabList.selectedIndex ? _this.m_pTabList.selectedIndex : 0;
                _this.$initMain(index, false, selectedIndex);
            }, this);
        };
        WorldSearchView.prototype.onItemTap = function (pvt) {
            var item = pvt.item;
            var index = this.m_pTabList.selectedIndex;
            var dataIndex = pvt.item.index;
            if (this.m_nIndex == index)
                return;
            if (this.$initMain(dataIndex, true, pvt.itemIndex)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FAL));
                return;
            }
            this.$initMain(dataIndex, false, pvt.itemIndex);
            var data = this.m_pTabCollection.getItemAt(this.m_nIndex);
            data.sel = false;
            this.m_pTabCollection.replaceItemAt(data, this.m_nIndex);
            var curData = this.m_pTabCollection.getItemAt(index);
            curData.sel = true;
            this.m_pTabCollection.replaceItemAt(curData, index);
            this.m_nIndex = index;
            this.m_pCSroller.viewport.scrollV = 0;
        };
        WorldSearchView.prototype.$removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.SEARCH_TAB, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.CLIENT_MOVE_UPDATE, this);
        };
        WorldSearchView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.$addEvent();
            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
            this.m_pTabCollection = new eui.ArrayCollection();
            this.m_pTabList.dataProvider = this.m_pTabCollection;
            this.m_pTabList.itemRenderer = WorldSearchTab;
            this.m_pTabList.useVirtualLayout = true;
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pContentList.dataProvider = this.m_pCollection;
            this.m_pContentList.itemRenderer = WorldSearchItem;
            this.m_pContentList.useVirtualLayout = true;
            this.$initFirst();
            WorldModel.isInSearchPanel = true;
        };
        WorldSearchView.prototype.$initFirst = function () {
            this.m_nIndex = -1;
            var tabs = [];
            for (var i = 0; i < WorldSearchView.MENUS.length; i++) {
                var isEmpty = this.$initMain(i, true);
                var sel = false;
                // if (!isEmpty && this.m_nIndex == -1) {
                //     this.m_nIndex = i;
                //     sel = true;
                // }
                tabs.push({ index: i, evtType: WorldSearchView.MENUS[i][0], evtSubType: WorldSearchView.MENUS[i][1], sel: sel, isEmpty: isEmpty });
            }
            tabs.sort(function (p1, p2) {
                if (p1.isEmpty != p2.isEmpty) {
                    if (p2.isEmpty)
                        return -1;
                    return 1;
                }
            });
            for (var i = 0; i < tabs.length; i++) {
                // let isEmpty = this.$initMain(i, true);
                var sel = false;
                var tab = tabs[i];
                if (this.m_nIndex == -1) {
                    this.m_nIndex = i;
                    sel = true;
                }
                tabs[i].sel = sel;
            }
            this.m_pTabCollection.replaceAll(tabs);
            if (this.m_nIndex >= 0) {
                this.$initMain();
            }
        };
        /**
         * tab排序计算
         */
        WorldSearchView.prototype.tabSort = function () {
        };
        WorldSearchView.prototype.$initMain = function (index, check, itemIndex) {
            if (itemIndex === void 0) { itemIndex = 0; }
            if (index < 0 || index == undefined)
                index = this.m_pTabCollection.getItemAt(this.m_nIndex).index;
            var res = [];
            var menu = WorldSearchView.MENUS[index];
            switch (menu[0]) {
                case WorldEventType.RES_GATHER:
                case WorldEventType.RES_COLLECT:
                case WorldEventType.FIGHT: {
                    var evt = WorldModel.getEventVosByType(menu[0], menu[1]);
                    for (var i = 0; i < evt.length; i++) {
                        res.push({ id: evt[i].eventCoordinatesId, type: menu[0] });
                    }
                    break;
                }
                case WorldEventType.VISIT: { //探访事件
                    var visits = WorldModel.getCanVisitEventList();
                    for (var i = 0; i < visits.length; i++) {
                        res.push({ id: visits[i].cityId, type: menu[0] });
                    }
                    break;
                }
            }
            if (!check) {
                this.m_pCollection.replaceAll(res);
            }
            //非初始化刷新
            if (this.m_pTabCollection.length > 0) {
                var data = this.m_pTabCollection.getItemAt(itemIndex);
                var isEmpty = res.length == 0;
                if (data && data.isEmpty != isEmpty) {
                    data.isEmpty = isEmpty;
                    this.m_pTabCollection.replaceItemAt(data, itemIndex);
                }
            }
            if (res.length == 0) {
                return true;
            }
            return false;
        };
        WorldSearchView.prototype.$checkEvent = function (body) {
            if (this.m_nIndex == 4)
                return;
            var eid = body.id;
            // if (body.aid > 0) {
            //     eid = WorldModel.getArmyEvent(body.aid);
            // }
            // const event = WorldModel.getEventVoByPosId(eid);
            // if (!event) return;
            // if (event.trpsType != 0 || event.type != 0) return;
            // const target = event.mt == EumWorldEventMoveType.GO ? event.to : event.from
            //     , conf = WorldModel.getResEvent(target)
            // if (!conf) { //删除
            //     for (let i = 0; i < this.m_pCollection.length; i ++) {
            //         let data = this.m_pCollection.getItemAt(i);
            //         if (data.id == target) {
            //             this.m_pCollection.removeItemAt(i);
            //         }
            //     }
            //     return;
            // };
            // //更新
            // for (let i = 0; i < this.m_pCollection.length; i ++) {
            //     let data = this.m_pCollection.getItemAt(i);
            //     if (data.id == target) {
            //         data.eid = eid;
            //         this.m_pCollection.replaceItemAt(data, i);
            //     }
            // }
        };
        WorldSearchView.NAME = "WorldSearchView";
        WorldSearchView.MENUS = [
            [WorldEventType.FIGHT, 2],
            [WorldEventType.FIGHT, 1],
            [WorldEventType.FIGHT, 3],
            [WorldEventType.RES_GATHER, 0],
            [WorldEventType.VISIT, 1],
            [WorldEventType.RES_COLLECT, 1],
            [WorldEventType.RES_COLLECT, 2],
            [WorldEventType.RES_COLLECT, 3],
            [WorldEventType.RES_COLLECT, 4],
            [WorldEventType.RES_COLLECT, 5],
            [WorldEventType.RES_COLLECT, 6],
        ];
        return WorldSearchView;
    }(com_main.CView));
    com_main.WorldSearchView = WorldSearchView;
    var WorldSearchTab = /** @class */ (function (_super_1) {
        __extends(WorldSearchTab, _super_1);
        function WorldSearchTab() {
            var _this = _super_1.call(this) || this;
            _this.NAME_CJ = ['', GCode(CLEnum.WOR_EVT_NT), GCode(CLEnum.WOR_EVT_TK), GCode(CLEnum.WOR_EVT_YK), GCode(CLEnum.WOR_EVT_MC), GCode(CLEnum.WOR_EVT_MESUME), GCode(CLEnum.WOR_EVT_HERMIT)];
            _this.NAME_MONSTER = ['', GCode(CLEnum.WOR_EVT_MZ), GCode(CLEnum.WOR_EVT_QD), GCode(CLEnum.WOR_EVT_PJ)];
            _this.skinName = Utils.getSkinName("app/world/world_search_tab.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldSearchTab.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            if (this.m_pRes) {
                this.m_pRes.destroy();
            }
        };
        WorldSearchTab.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // EventManager.addTouchTapListener(this, this, () => {
            //     EventMgr.dispatchEvent(TaskWorldEvent.SEARCH_TAB, this.m_tData.index);
            // })
        };
        WorldSearchTab.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_pRes) {
                this.m_pRes.destroy();
                this.m_pRes = null;
            }
            switch (this.m_tData.evtType) {
                case WorldEventType.RES_COLLECT: {
                    this.currentState = 'icon';
                    this.m_imgIcon.source = WorldSearchTab.ICON_CJ[this.m_tData.evtSubType];
                    this.m_labName.text = this.NAME_CJ[this.m_tData.evtSubType];
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    this.currentState = 'icon';
                    this.m_imgIcon.source = 'map_zycl_png';
                    this.m_labName.text = GCode(CLEnum.WOR_EVT_SJ);
                    break;
                }
                case WorldEventType.FIGHT: {
                    this.currentState = 'sprite';
                    var name_1 = WorldSearchTab.ICON_MONSTER[this.m_tData.evtSubType];
                    this.m_pRes = new MCDragonBones();
                    this.m_pRes.initAsync(name_1);
                    NodeUtils.addPosAndScale(this, this.m_pRes, -75 + 104 * 1.5, -75 + 104 * 1.5, 1.5);
                    this.m_pRes.play(name_1, 0);
                    this.m_labName.text = this.NAME_MONSTER[this.m_tData.evtSubType];
                    break;
                }
                case WorldEventType.VISIT: { //探访事件
                    this.currentState = 'icon';
                    this.m_imgIcon.source = 'icon_zy_bf_png';
                    this.m_labName.text = GCode(CLEnum.WOR_EVT_BF);
                    break;
                }
            }
            this.m_imgLight.visible = this.m_tData.sel;
            if (this.m_imgIcon)
                Utils.isGray(this.m_tData.isEmpty, this.m_imgIcon);
            if (this.m_pRes)
                Utils.isGray(this.m_tData.isEmpty, this.m_pRes);
        };
        //对应事件类型 1  子类型 1- 4 [注意0 位为占位]
        WorldSearchTab.ICON_CJ = ['', 'map_build_icon6_png', 'map_build_icon7_png', 'map_build_icon8_png', 'map_build_icon5_png', 'map_build_icon22_png', 'map_build_icon23_png',];
        //对应事件类型 3  子类型 1- 3 [注意0 位为占位]
        WorldSearchTab.ICON_MONSTER = ['', 'EWORLD_Monster_2003', 'EWORLD_Monster_2002', 'EWORLD_Monster_2001'];
        return WorldSearchTab;
    }(eui.ItemRenderer));
    com_main.WorldSearchTab = WorldSearchTab;
    /**
     * 搜索信息列表Item
     * @export
     * @class WorldSearchItem
     * @extends eui.ItemRenderer
     */
    var WorldSearchItem = /** @class */ (function (_super_1) {
        __extends(WorldSearchItem, _super_1);
        function WorldSearchItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/world_search_item.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            _this.cacheAsBitmap = true;
            return _this;
        }
        WorldSearchItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldSearchItem.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGroup, this, this.__go_event);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnPoint, this, function (e) {
                if (_this.data.type == WorldEventType.VISIT) {
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, _this.data.id);
                }
                else
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.RES, _this.data.id);
                com_main.UpManager.history();
            });
        };
        WorldSearchItem.prototype.dataChanged = function () {
            if (this.data.type == WorldEventType.VISIT) { //拜访
                this.currentState = 'visit';
                var event_1 = WorldModel.getVisitEventById(this.data.id);
                var visCfg = C.VisitConfig[event_1.visitId];
                if (event_1.generalId > 0) {
                    this.$setTipsState(false, GCode(CLEnum.GO_TO1));
                }
                else {
                    this.$setTipsState(true, GCode(CLEnum.GO_TO));
                }
                this.m_labCityName.text = WorldModel.getCityName(this.data.id);
                this.m_genHead.setGenViewInfo(visCfg.heroId);
                this.m_labTitleName.text = GeneralModel.getGeneralName(visCfg.heroId);
                var generalConfig = C.GeneralConfig[visCfg.heroId];
                if (isNull(generalConfig))
                    return;
                this.m_labTitleName.textColor = Utils.getColorOfQuality(generalConfig.qualityLevel);
                return;
            }
            var evtVo = WorldModel.getEventVoByPosId(this.data.id);
            this.m_labTitleName.text = evtVo.getEventName();
            this.m_labTitleName.textColor = Utils.getColorOfQuality(evtVo.dataCfg.colour);
            this.m_labLevel.text = "Lv" + evtVo.getEventLv();
            this.m_labCityName.text = WorldModel.getCityName(evtVo.cityId);
            //资源点 是否存在移动队伍
            var isMove = WorldModel.isInTeamMoveRes(evtVo.eventCoordinatesId);
            switch (this.data.type) {
                case WorldEventType.RES_COLLECT: {
                    this.currentState = 'resource';
                    this.$setResReward(evtVo);
                    if (isMove) {
                        this.$setTipsState(false, GCode(CLEnum.WOR_EVT_GO));
                    }
                    else {
                        if (evtVo.getTeamId() == 0) {
                            this.$setTipsState(true, GCode(CLEnum.WOR_EVT_CJ));
                        }
                        else {
                            this.$setTipsState(true, GCode(CLEnum.SPEED_AD));
                        }
                    }
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    this.currentState = 'resource';
                    this.$setResReward(evtVo);
                    if (isMove) {
                        this.$setTipsState(false, GCode(CLEnum.WOR_EVT_GO));
                    }
                    else {
                        this.$setTipsState(true, GCode(CLEnum.WOR_EVT_SJ));
                    }
                    break;
                }
                case WorldEventType.FIGHT: {
                    this.currentState = 'fight';
                    if (isMove) {
                        this.$setTipsState(false, GCode(CLEnum.WOR_EVT_GO));
                    }
                    else {
                        if (evtVo.getTeamId() == 0) {
                            this.$setTipsState(true, GCode(CLEnum.CAMP_FIGHT));
                        }
                        else {
                            this.$setTipsState(false, GCode(CLEnum.CAMP_FIGHT1));
                        }
                    }
                    com_main.CTipsManager.addTips(this.m_pGAward, { type: com_main.TipsEnum.WorldSearchTips, param: this.data.id });
                    break;
                }
            }
        };
        /**刷新物品显示 */
        WorldSearchItem.prototype.$setResReward = function (vo) {
            var award = Utils.parseCommonItemJson(vo.getReward());
            this.m_itemAward.setItemInfo(award[0].itemId, 0);
        };
        /**
         * @param val 按钮是否显示
         * @param title 按钮内容 / 提示内容
         */
        WorldSearchItem.prototype.$setTipsState = function (val, title) {
            if (title === void 0) { title = GCode(CLEnum.GO_TO); }
            if (val) {
                this.m_pBtnGroup.visible = true;
                this.m_labBtnTitle.text = title;
                this.m_labTips.visible = false;
            }
            else {
                this.m_pBtnGroup.visible = false;
                this.m_labTips.visible = true;
                this.m_labTips.text = title;
            }
            this.m_pbtn.source = "btn_006_up_png";
            this.m_labBtnTitle.stroke = 2;
            if (title == GCode(CLEnum.SPEED_AD)) {
                this.m_pbtn.source = "btn_001_up_png";
                this.m_labBtnTitle.stroke = 0;
            }
        };
        WorldSearchItem.prototype.__go_event = function () {
            switch (this.data.type) {
                case WorldEventType.RES_COLLECT: {
                    if (this.m_labBtnTitle.text == GCode(CLEnum.SPEED_AD)) {
                        //采集中
                        var eventVo = WorldModel.getEventVoByPosId(this.data.id);
                        if (eventVo.getTeamId() > 0) {
                            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                                propSpeedType: PropSpeedType.WorldGather, targetId: this.data.id,
                                startTime: eventVo.userMapEventData.startTime,
                                endTime: eventVo.userMapEventData.endTime,
                                speedUpTime: eventVo.userMapEventData.speedTime
                            });
                        }
                        return;
                    }
                    else {
                        //非采集
                        var data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
                        var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_COLLECT];
                        var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
                        if (data.reCount == 0) {
                            EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true);
                            if (platform.isHidePayFunc())
                                return;
                            var needGold = NormalModel.getFunCostByData(data);
                            if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                                var content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                                Utils.showConfirmPop(content, function () {
                                    WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_COLLECT);
                                }, this);
                            }
                            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
                            return;
                        }
                        Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.data.id, cityId: -1 });
                        WorldModel.isFromSearchPanel = true;
                    }
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    var data = NormalModel.getFunCountById(IFunCountEnum.GATHER_COUNT);
                    var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_GATHER];
                    var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
                    if (data.reCount == 0) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true);
                        if (platform.isHidePayFunc())
                            return;
                        var needGold = NormalModel.getFunCostByData(data);
                        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                            var content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                            Utils.showConfirmPop(content, function () {
                                WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_GATHER);
                            }, this);
                        }
                        com_main.WorldView.callFunc(6 /* HIDE_MENU */);
                        return;
                    }
                    Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.data.id, cityId: -1 });
                    WorldModel.isFromSearchPanel = true;
                    break;
                }
                case WorldEventType.FIGHT: {
                    var data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
                    var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
                    var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
                    if (data.reCount == 0) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true);
                        var needGold = NormalModel.getFunCostByData(data);
                        if (platform.isHidePayFunc())
                            return;
                        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                            var content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                            Utils.showConfirmPop(content, function () {
                                WorldProxy.C2S_MAP_EVENT_BUY(3);
                            }, this);
                        }
                        return;
                    }
                    Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.data.id, cityId: -1 });
                    WorldModel.isFromSearchPanel = true;
                    break;
                }
                case WorldEventType.VISIT: {
                    // Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.data.id });
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, this.data.id);
                    WorldModel.isVisvitFromSerarch = true;
                    com_main.UpManager.history();
                    break;
                }
            }
            if (this.data.type == 4) {
                // Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.data.id });
                com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, this.data.id);
                WorldModel.isVisvitFromSerarch = true;
                com_main.UpManager.history();
                return;
            }
        };
        return WorldSearchItem;
    }(eui.ItemRenderer));
    com_main.WorldSearchItem = WorldSearchItem;
})(com_main || (com_main = {}));
