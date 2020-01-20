module com_main {

    /**
     * 搜索列表信息
     * @export
     * @class WorldSearchView
     * @extends CView
     */
    export class WorldSearchView extends CView {

        public static readonly NAME = "WorldSearchView";
        public static MENUS = [
            [WorldEventType.FIGHT, 2],  //强盗
            [WorldEventType.FIGHT, 1],
            [WorldEventType.FIGHT, 3],
            [WorldEventType.RES_GATHER, 0],  //收集
            [WorldEventType.VISIT, 1],   //探访
            [WorldEventType.RES_COLLECT, 1],
            [WorldEventType.RES_COLLECT, 2],
            [WorldEventType.RES_COLLECT, 3],
            [WorldEventType.RES_COLLECT, 4],
            [WorldEventType.RES_COLLECT, 5],
            [WorldEventType.RES_COLLECT, 6],
        ]


        public m_pCSroller: eui.Scroller;



        protected m_pBtnClose: eui.Group;
        protected m_pTabList: eui.List;
        protected m_pContentList: eui.List;


        protected m_pTabCollection: eui.ArrayCollection;
        protected m_pCollection: eui.ArrayCollection;
        protected m_nIndex: number = 0;
        protected isRefresh: boolean = false;
        public constructor(body: any) { // {cid:number}
            super();
            this.name = WorldSearchView.NAME;

            this.initApp("world/world_search_view.exml");
        }

        public onDestroy(): void {
            this.$removeEvent();
            super.onDestroy();
            WorldModel.isInSearchPanel = false;
        }


        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_VISIT_EVENT_UPDATE,
                ProtoDef.S2C_WORLDMAP_EVENT_ACT,
                ProtoDef.S2C_WORLDMAP_EVENT_OVER,
                ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_EVENT_UPDATE: {
                    let index = 0;
                    let itemData: WorldSearchTabRD = this.m_pTabList.selectedItem as WorldSearchTabRD;
                    index = itemData ? itemData.index : (this.m_pTabCollection.getItemAt(0) as WorldSearchTabRD).index;
                    let selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(4, itemData.index != 4, selectedIndex);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_ACT: {
                    this.$initMain();
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: {
                    let index = 0;
                    let itemData: WorldSearchTabRD = this.m_pTabList.selectedItem as WorldSearchTabRD;
                    index = itemData ? itemData.index : (this.m_pTabCollection.getItemAt(0) as WorldSearchTabRD).index;
                    let selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(index, false, selectedIndex);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                    let index = 0;
                    let itemData: WorldSearchTabRD = this.m_pTabList.selectedItem as WorldSearchTabRD;
                    index = itemData ? itemData.index : (this.m_pTabCollection.getItemAt(0) as WorldSearchTabRD).index;
                    let selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                    this.$initMain(index, false, selectedIndex);
                    break;
                }
            }
        }

        protected $addEvent() {
            EventMgr.addEvent(TaskWorldEvent.SEARCH_TAB, (index: number) => {
                if (this.m_nIndex == index) return;
                if (this.$initMain(index, true)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FAL));
                    return;
                }
                this.$initMain(index);
                let data = this.m_pTabCollection.getItemAt(this.m_nIndex) as WorldSearchTabRD;
                data.sel = false;
                this.m_pTabCollection.replaceItemAt(data, this.m_nIndex);

                let curData = this.m_pTabCollection.getItemAt(index) as WorldSearchTabRD;
                curData.sel = true;
                this.m_pTabCollection.replaceItemAt(curData, index);

                this.m_nIndex = index;
                this.m_pCSroller.viewport.scrollV = 0;
            }, this);



            this.m_pTabList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);


            EventMgr.addEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, () => {
                let index = 0;
                let itemData: WorldSearchTabRD = this.m_pTabList.selectedItem as WorldSearchTabRD;
                index = itemData ? itemData.index : (this.m_pTabCollection.getItemAt(0) as WorldSearchTabRD).index;
                let selectedIndex = this.m_pTabList.selectedIndex ? this.m_pTabList.selectedIndex : 0;
                this.$initMain(index, false, selectedIndex);
            }, this);

        }

        public onItemTap(pvt: eui.ItemTapEvent) {
            let item = pvt.item;
            let index = this.m_pTabList.selectedIndex;
            let dataIndex: number = pvt.item.index;
            if (this.m_nIndex == index) return;
            if (this.$initMain(dataIndex, true, pvt.itemIndex)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FAL));
                return;
            }
            this.$initMain(dataIndex, false, pvt.itemIndex);
            let data = this.m_pTabCollection.getItemAt(this.m_nIndex) as WorldSearchTabRD;
            data.sel = false;
            this.m_pTabCollection.replaceItemAt(data, this.m_nIndex);

            let curData = this.m_pTabCollection.getItemAt(index) as WorldSearchTabRD;
            curData.sel = true;
            this.m_pTabCollection.replaceItemAt(curData, index);

            this.m_nIndex = index;
            this.m_pCSroller.viewport.scrollV = 0;
        }
        protected $removeEvent() {
            EventMgr.removeEventByObject(TaskWorldEvent.SEARCH_TAB, this);
            EventMgr.removeEventByObject(TaskWorldEvent.CLIENT_MOVE_UPDATE, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.$addEvent();

            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => {
                UpManager.history();
            })



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
        }

        protected $initFirst() {
            this.m_nIndex = -1;

            let tabs: WorldSearchTabRD[] = [];
            for (let i = 0; i < WorldSearchView.MENUS.length; i++) {
                let isEmpty = this.$initMain(i, true);
                let sel = false;
                // if (!isEmpty && this.m_nIndex == -1) {
                //     this.m_nIndex = i;
                //     sel = true;
                // }
                tabs.push({ index: i, evtType: WorldSearchView.MENUS[i][0], evtSubType: WorldSearchView.MENUS[i][1], sel: sel, isEmpty: isEmpty });
            }
            tabs.sort((p1, p2) => {
                if (p1.isEmpty != p2.isEmpty) {
                    if (p2.isEmpty) return -1;
                    return 1;
                }
            })
            for (let i = 0; i < tabs.length; i++) {
                // let isEmpty = this.$initMain(i, true);
                let sel = false;
                let tab: WorldSearchTabRD = tabs[i];
                if (this.m_nIndex == -1) {
                    this.m_nIndex = i;
                    sel = true;
                }
                tabs[i].sel = sel;
            }

            this.m_pTabCollection.replaceAll(tabs);
            if (this.m_nIndex >= 0) {
                this.$initMain()
            }
        }
        /**
         * tab排序计算
         */
        public tabSort() {

        }
        protected $initMain(index?: number, check?: boolean, itemIndex: number = 0) {
            if (index < 0 || index == undefined) index = (this.m_pTabCollection.getItemAt(this.m_nIndex) as WorldSearchTabRD).index;
            let res = [];
            let menu = WorldSearchView.MENUS[index];
            switch (menu[0]) {
                case WorldEventType.RES_GATHER:
                case WorldEventType.RES_COLLECT:
                case WorldEventType.FIGHT: {
                    let evt = WorldModel.getEventVosByType(menu[0], menu[1]);
                    for (let i = 0; i < evt.length; i++) {
                        res.push({ id: evt[i].eventCoordinatesId, type: menu[0] });
                    }
                    break;
                }
                case WorldEventType.VISIT: {   //探访事件
                    let visits = WorldModel.getCanVisitEventList();
                    for (let i = 0; i < visits.length; i++) {
                        res.push({ id: visits[i].cityId, type: menu[0] })
                    }
                    break;
                }
            }
            if (!check) {
                this.m_pCollection.replaceAll(res);
            }
            //非初始化刷新
            if (this.m_pTabCollection.length > 0) {
                let data = this.m_pTabCollection.getItemAt(itemIndex) as WorldSearchTabRD;
                let isEmpty = res.length == 0;
                if (data && data.isEmpty != isEmpty) {
                    data.isEmpty = isEmpty;
                    this.m_pTabCollection.replaceItemAt(data, itemIndex);
                }
            }
            if (res.length == 0) {
                return true;
            }
            return false;
        }

        protected $checkEvent(body: any) {
            if (this.m_nIndex == 4) return;
            let eid = body.id;
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
        }
    }

    export interface WorldSearchTabRD {
        index: number;
        evtType: number;    //事件主类型 4位探访事件
        evtSubType: number;  //事件子类型
        sel: boolean;    //选中
        isEmpty: boolean;    //空子集
    }
    export class WorldSearchTab extends eui.ItemRenderer {
        //对应事件类型 1  子类型 1- 4 [注意0 位为占位]
        private static ICON_CJ = ['', 'map_build_icon6_png', 'map_build_icon7_png', 'map_build_icon8_png', 'map_build_icon5_png', 'map_build_icon22_png', 'map_build_icon23_png',];
        private NAME_CJ = ['', GCode(CLEnum.WOR_EVT_NT), GCode(CLEnum.WOR_EVT_TK), GCode(CLEnum.WOR_EVT_YK), GCode(CLEnum.WOR_EVT_MC), GCode(CLEnum.WOR_EVT_MESUME), GCode(CLEnum.WOR_EVT_HERMIT)];
        //对应事件类型 3  子类型 1- 3 [注意0 位为占位]
        private static ICON_MONSTER = ['', 'EWORLD_Monster_2003', 'EWORLD_Monster_2002', 'EWORLD_Monster_2001'];
        private NAME_MONSTER = ['', GCode(CLEnum.WOR_EVT_MZ), GCode(CLEnum.WOR_EVT_QD), GCode(CLEnum.WOR_EVT_PJ)]

        public m_imgIcon: eui.Image;
        public m_labName: eui.Label;
        public m_imgLight: com_main.CImage;

        protected m_pRes: MCDragonBones;
        private m_tData: WorldSearchTabRD;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_search_tab.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        protected onDestroy(): void {
            EventManager.removeEventListeners(this);
            if (this.m_pRes) {
                this.m_pRes.destroy();
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            // EventManager.addTouchTapListener(this, this, () => {
            //     EventMgr.dispatchEvent(TaskWorldEvent.SEARCH_TAB, this.m_tData.index);
            // })

        }

        protected dataChanged() {
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
                    let name = WorldSearchTab.ICON_MONSTER[this.m_tData.evtSubType];
                    this.m_pRes = new MCDragonBones();
                    this.m_pRes.initAsync(name);
                    NodeUtils.addPosAndScale(this, this.m_pRes, -75 + 104 * 1.5, -75 + 104 * 1.5, 1.5);
                    this.m_pRes.play(name, 0);
                    this.m_labName.text = this.NAME_MONSTER[this.m_tData.evtSubType];
                    break;
                }
                case WorldEventType.VISIT: {   //探访事件
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

        }

    }

    /**
     * 搜索信息列表Item
     * @export
     * @class WorldSearchItem
     * @extends eui.ItemRenderer
     */
    export class WorldSearchItem extends eui.ItemRenderer {

        public m_pBtnPoint: eui.Image;
        public m_labTitleName: eui.Label;
        public m_labCityName: eui.Label;
        public m_labLevel: eui.Label;
        public m_pBtnGroup: eui.Group;
        public m_pbtn: eui.Image;
        public m_labBtnTitle: eui.Label;
        public m_labTips: eui.Label;
        public m_pGAward: eui.Group;
        public m_itemAward: com_main.ComItemNew;
        public m_genHead: com_main.GeneralHeadRender;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_search_item.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.cacheAsBitmap = true;

        }

        protected onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchScaleListener(this.m_pBtnGroup, this, this.__go_event);
            EventManager.addTouchScaleListener(this.m_pBtnPoint, this, e => {
                if (this.data.type == WorldEventType.VISIT) {
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.data.id);
                } else
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.RES, this.data.id);
                UpManager.history();
            });

        }

        protected dataChanged() {
            if (this.data.type == WorldEventType.VISIT) { //拜访
                this.currentState = 'visit';
                let event = WorldModel.getVisitEventById(this.data.id);
                let visCfg = C.VisitConfig[event.visitId];
                if (event.generalId > 0) {
                    this.$setTipsState(false, GCode(CLEnum.GO_TO1));
                } else {
                    this.$setTipsState(true, GCode(CLEnum.GO_TO));
                }
                this.m_labCityName.text = WorldModel.getCityName(this.data.id);
                this.m_genHead.setGenViewInfo(visCfg.heroId);
                this.m_labTitleName.text = GeneralModel.getGeneralName(visCfg.heroId);
                let generalConfig: GeneralConfig = C.GeneralConfig[visCfg.heroId];
                if (isNull(generalConfig))
                    return;
                this.m_labTitleName.textColor = Utils.getColorOfQuality(generalConfig.qualityLevel);
                return;
            }
            let evtVo = WorldModel.getEventVoByPosId(this.data.id);
            this.m_labTitleName.text = evtVo.getEventName();
            this.m_labTitleName.textColor = Utils.getColorOfQuality(evtVo.dataCfg.colour);
            this.m_labLevel.text = `Lv${evtVo.getEventLv()}`;
            this.m_labCityName.text = WorldModel.getCityName(evtVo.cityId);
            //资源点 是否存在移动队伍
            let isMove = WorldModel.isInTeamMoveRes(evtVo.eventCoordinatesId);
            switch (this.data.type) {
                case WorldEventType.RES_COLLECT: {
                    this.currentState = 'resource';
                    this.$setResReward(evtVo);
                    if (isMove) {
                        this.$setTipsState(false, GCode(CLEnum.WOR_EVT_GO));
                    } else {
                        if (evtVo.getTeamId() == 0) {
                            this.$setTipsState(true, GCode(CLEnum.WOR_EVT_CJ));
                        } else {
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
                    } else {
                        this.$setTipsState(true, GCode(CLEnum.WOR_EVT_SJ));
                    }
                    break;
                }
                case WorldEventType.FIGHT: {
                    this.currentState = 'fight';
                    if (isMove) {
                        this.$setTipsState(false, GCode(CLEnum.WOR_EVT_GO));
                    } else {
                        if (evtVo.getTeamId() == 0) {
                            this.$setTipsState(true, GCode(CLEnum.CAMP_FIGHT));
                        } else {
                            this.$setTipsState(false, GCode(CLEnum.CAMP_FIGHT1));
                        }
                    }
                    CTipsManager.addTips(this.m_pGAward, { type: TipsEnum.WorldSearchTips, param: this.data.id });
                    break;
                }
            }
        }

        /**刷新物品显示 */
        protected $setResReward(vo: WorldEventVo) {
            let award = Utils.parseCommonItemJson(vo.getReward());
            this.m_itemAward.setItemInfo(award[0].itemId, 0);
        }

        /**
         * @param val 按钮是否显示
         * @param title 按钮内容 / 提示内容
         */
        protected $setTipsState(val: boolean, title: string = GCode(CLEnum.GO_TO)) {
            if (val) {
                this.m_pBtnGroup.visible = true;
                this.m_labBtnTitle.text = title;
                this.m_labTips.visible = false;
            } else {
                this.m_pBtnGroup.visible = false;
                this.m_labTips.visible = true;
                this.m_labTips.text = title;
            }
            this.m_pbtn.source = "btn_006_up_png"
            this.m_labBtnTitle.stroke = 2;
            if (title == GCode(CLEnum.SPEED_AD)) {
                this.m_pbtn.source = "btn_001_up_png"
                this.m_labBtnTitle.stroke = 0;
            }
        }

        private __go_event() {
            switch (this.data.type) {
                case WorldEventType.RES_COLLECT: {
                    if (this.m_labBtnTitle.text == GCode(CLEnum.SPEED_AD)) {
                        //采集中
                        let eventVo = WorldModel.getEventVoByPosId(this.data.id);
                        if (eventVo.getTeamId() > 0) {
                            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                                propSpeedType: PropSpeedType.WorldGather, targetId: this.data.id,
                                startTime: eventVo.userMapEventData.startTime,
                                endTime: eventVo.userMapEventData.endTime,
                                speedUpTime: eventVo.userMapEventData.speedTime
                            });
                        }
                        return;
                    } else {
                        //非采集
                        let data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
                        let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_COLLECT];
                        let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
                        if (data.reCount == 0) {
                            EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true);

                            if (platform.isHidePayFunc()) return;

                            let needGold: number = NormalModel.getFunCostByData(data)
                            if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                                let content: string = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                                Utils.showConfirmPop(content, () => {
                                    WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_COLLECT);
                                }, this);
                            }
                            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                            return;
                        }

                        Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.data.id, cityId: -1 });
                        WorldModel.isFromSearchPanel = true;
                    }
                    break;
                }
                case WorldEventType.RES_GATHER: {
                    let data = NormalModel.getFunCountById(IFunCountEnum.GATHER_COUNT);
                    let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_GATHER];
                    let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
                    if (data.reCount == 0) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true)

                        if (platform.isHidePayFunc()) return;

                        let needGold: number = NormalModel.getFunCostByData(data)
                        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                            let content: string = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                            Utils.showConfirmPop(content, () => {
                                WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_GATHER);
                            }, this);
                        }
                        WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                        return;
                    }
                    Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.data.id, cityId: -1 });
                    WorldModel.isFromSearchPanel = true;
                    break;
                }
                case WorldEventType.FIGHT: {
                    let data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
                    let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
                    let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
                    if (data.reCount == 0) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_DONATE_NONE), 1, true)
                        let needGold: number = NormalModel.getFunCostByData(data)

                        if (platform.isHidePayFunc()) return;

                        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                            let content: string = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                            Utils.showConfirmPop(content, () => {
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
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.data.id);
                    WorldModel.isVisvitFromSerarch = true;
                    UpManager.history();
                    break;
                }
            }
            if (this.data.type == 4) {
                // Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.data.id });
                WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.data.id);
                WorldModel.isVisvitFromSerarch = true;
                UpManager.history();
                return;
            }
        }
    }

}