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
    var RankActView = /** @class */ (function (_super_1) {
        __extends(RankActView, _super_1);
        function RankActView(activiType) {
            var _this = _super_1.call(this) || this;
            _this.ApkRankVoList = []; //竞技场排行数据
            _this.activityType = activiType;
            _this.name = RankActView.NAME;
            _this.initType(activiType);
            _this.initApp("activity/ranking/RankActViewSkin.exml");
            return _this;
        }
        RankActView.prototype.initType = function (type) {
            this.m_nType = type;
            switch (this.m_nType) {
                case AcViewType.FIGHT_RANKING_AWARD:
                case AcViewType.FIGHT_RANKING_AWARD:
                case AcViewType.APK_RANKING: {
                    this.currentState = 'power';
                    break;
                }
                case AcViewType.GUILD_FORCE_RANKING: {
                    this.currentState = 'legion';
                    break;
                }
                case AcViewType.COUNTRY_CITYS_RANKING: {
                    this.currentState = 'country';
                    break;
                }
            }
        };
        RankActView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        RankActView.prototype.onDestroy = function () {
            this.removeEvent();
            Utils.TimerManager.remove(this.updateDownTime, this);
            RankModel.clear();
            _super_1.prototype.onDestroy.call(this);
        };
        RankActView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.dataProvider = this.m_tCollection;
            this.m_listItem.itemRenderer = RankPowerItem;
        };
        RankActView.prototype.updateDownTime = function () {
            var str = Utils.DateUtils.getCountdownStrByCfg(this.rankVo.closeDate - TimerUtils.getServerTimeMill(), 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(timeStr + "<font color=#00ff00>" + str + "</font>");
        };
        /**初始化界面 */
        RankActView.prototype.initView = function () {
            if (this.bInit)
                return;
            this.bInit = true;
            if (this.activityType == AcViewType.FIGHT_RANKING_AWARD) {
                this.rankVo = ActivityModel.getActivityVo(this.activityType);
                this.m_nType = RankType.PLAYER;
                this.m_labTitle.text = GCode(CLEnum.FIGHT);
            }
            else if (this.activityType == AcViewType.LEVEL_RANKING_AWARD) {
                this.rankVo = ActivityModel.getActivityVo(this.activityType);
                this.m_nType = RankType.LV_RANKS;
                this.m_labTitle.text = GCode(CLEnum.LEVEL2);
            }
            else if (this.activityType == AcViewType.COUNTRY_CITYS_RANKING) {
                this.rankVo = ActivityModel.getActivityVo(this.activityType);
                this.m_nType = RankType.COUNTRY;
            }
            else if (this.activityType == AcViewType.GUILD_FORCE_RANKING) {
                this.rankVo = ActivityModel.getActivityVo(this.activityType);
                this.m_nType = RankType.LEGION;
            }
            else {
                this.rankVo = ActivityModel.getActivityVo(this.activityType);
                this.m_nType = RankType.ARENA_POWER;
                PvpArenaProxy.send_APK_RANK_LIST(14);
            }
            if (this.activityType != AcViewType.APK_RANKING) {
                RankProxy.C2S_RANK_COMM(this.m_nType);
            }
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.rankVo.viewType + '_jpg');
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.rankVo.closeDate)
                return;
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
        };
        /**设置宽高 */
        RankActView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pViewRoot);
        };
        /**刷新显示 */
        RankActView.prototype.refreshView = function () {
        };
        /**刷新列表数据 */
        RankActView.prototype.refresh = function () {
            if (!this.m_nType)
                return;
            if (this.m_nType == RankType.COUNTRY) {
                var list = RankModel.getCountryRankData();
                this.setCountryInfo(list);
            }
            else if (this.m_nType == RankType.LEGION) {
                var _a = RankModel.getLegionRankData(), list = _a[0], owner = _a[1];
                this.setLegionInfo(list, owner);
            }
            else {
                var _b = RankModel.getNormalData(this.m_nType), list = _b[0], owner = _b[1];
                this.setPowerInfo(list, owner);
            }
        };
        /**战力，等级冲榜 */
        RankActView.prototype.setPowerInfo = function (list, owner) {
            if (list && list.length > 0) {
                var res = [];
                var len = list.length >= 50 ? 50 : list.length;
                for (var i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
            var strRank;
            if (owner) {
                if (owner.rank <= 50) {
                    strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.RANK_NUM, owner.rank);
                }
                else {
                    strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.AC_RANK_OUTSIDE, 50);
                }
            }
            else {
                strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.AC_RANK_OUTSIDE, 50);
            }
            this.m_labCurrRank.text = strRank;
        };
        /**国家冲榜 */
        RankActView.prototype.setCountryInfo = function (list) {
            var _this = this;
            if (list && list.length > 0) {
                var res = [];
                var len = list.length >= 50 ? 50 : list.length;
                list.sort(function (a, b) {
                    var acount = _this.getCityCount(a.citySize);
                    var bcount = _this.getCityCount(a.citySize);
                    return acount - bcount;
                });
                for (var i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: i + 1 });
                }
                this.m_tCollection.replaceAll(res);
            }
        };
        /** 获取城池数量*/
        RankActView.prototype.getCityCount = function (citySize) {
            var allNum = 0;
            for (var i = 0; i < citySize.length; i++) {
                allNum += citySize[i];
            }
            return allNum;
        };
        /**联盟战力冲榜 */
        RankActView.prototype.setLegionInfo = function (list, owner) {
            if (list && list.length > 0) {
                var res = [];
                var len = list.length >= 3 ? 3 : list.length;
                for (var i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
        };
        /**竞技场冲榜 */
        RankActView.prototype.setArenaInfo = function (list) {
            if (list && list.length > 0) {
                var res = [];
                for (var i = 0; i < 10; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_labCurrRank.text = PvpArenaModel.Rank == Number.MAX_VALUE ? GCode(CLEnum.AC_RANK_TIP) + GCode(CLEnum.ARENA_NONE) : GCode(CLEnum.AC_RANK_TIP) + PvpArenaModel.Rank;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        RankActView.prototype.addEvent = function () {
        };
        /**移除事件 */
        RankActView.prototype.removeEvent = function () {
        };
        RankActView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_RANK_COMM,
                ProtoDef.APK_GET_RANK_LIST,
            ];
        };
        RankActView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_RANK_COMM: {
                    var data = body;
                    if (data.rankId == this.m_nType)
                        this.refresh();
                    break;
                }
                case ProtoDef.APK_GET_RANK_LIST: { //竞技场排名数据
                    if (body) {
                        if (this.m_nType == RankType.ARENA_POWER) {
                            for (var key in body.apkRankVoList) {
                                var vo = ApkRankVo.create(body.apkRankVoList[key]);
                                vo.setReward();
                                this.ApkRankVoList.push(vo);
                            }
                            this.setArenaInfo(this.ApkRankVoList);
                        }
                    }
                    break;
                }
            }
        };
        RankActView.NAME = 'RankActView';
        return RankActView;
    }(com_main.CView));
    com_main.RankActView = RankActView;
    var RankPowerItem = /** @class */ (function (_super_1) {
        __extends(RankPowerItem, _super_1);
        function RankPowerItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/ranking/RankActItemSkin.exml");
            return _this;
        }
        RankPowerItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        RankPowerItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RankPowerItem.prototype.onDestroy = function () {
        };
        RankPowerItem.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.refreshRankIcon(this.m_tData.rank);
            switch (this.m_tData.type) {
                case RankType.PLAYER: {
                    this.currentState = 'power';
                    this.commitProperties();
                    var info = this.m_tData.param;
                    var powerVo = ActivityModel.getActivityVo(AcViewType.FIGHT_RANKING_AWARD);
                    var cfg = powerVo.getPowerRankCfg(info.rank);
                    this.refreshheadInfo(info);
                    if (!cfg)
                        return;
                    this.setitemlist(cfg.reward);
                    break;
                }
                case RankType.LV_RANKS: {
                    this.currentState = 'power';
                    this.commitProperties();
                    var info = this.m_tData.param;
                    var levelVo = ActivityModel.getActivityVo(AcViewType.LEVEL_RANKING_AWARD);
                    if (levelVo) {
                        var cfg = levelVo.getLevelRankCfg(info.rank);
                        this.refreshheadInfo(info);
                        if (!cfg)
                            return;
                        this.setitemlist(cfg.reward);
                    }
                    break;
                }
                case RankType.COUNTRY: {
                    this.currentState = 'country';
                    this.commitProperties();
                    var info = this.m_tData.param;
                    var currRank = this.m_tData.rank;
                    var countryVo = ActivityModel.getActivityVo(AcViewType.COUNTRY_CITYS_RANKING);
                    if (countryVo) {
                        var cfg = countryVo.getCountryRankCfg(currRank);
                        if (!cfg)
                            return;
                        this.setitemlist(cfg.reward);
                        this.refreshCityCount(info.citySize);
                        this.m_CountryIcon.stateId = info.countryId;
                    }
                    break;
                }
                case RankType.LEGION: {
                    this.currentState = 'legion';
                    this.commitProperties();
                    var info = this.m_tData.param;
                    var countryVo = ActivityModel.getActivityVo(AcViewType.GUILD_FORCE_RANKING);
                    if (countryVo) {
                        var cfg = countryVo.getLegionRankCfg(info.rank);
                        if (!cfg)
                            return;
                        this.setitemlist(cfg.reward);
                        this.m_labPower.text = info.value.toString();
                        this.m_labName.text = info.legionName;
                        this.m_imgLegion.source = LegionModel.getLegionCountryImage(info.countryId);
                    }
                    com_main.EventManager.addTouchTapListener(this.m_imgLegion, this, this.onShowLegionIntroView);
                    break;
                }
                case RankType.ARENA_POWER: {
                    this.currentState = 'power';
                    this.commitProperties();
                    var info = this.m_tData.param;
                    var countryVo = ActivityModel.getActivityVo(AcViewType.APK_RANKING);
                    if (countryVo) {
                        var cfg = countryVo.getArenaRankCfg(info.rank);
                        if (!cfg)
                            return;
                        this.m_comState.stateId = info.countryId;
                        this.m_comHead.info = { type: 1, url: info.head.toString(), official: 0, vip: 0 };
                        this.setitemlist(cfg.reward);
                        this.m_labPower.text = info.force.toString();
                        this.m_labName.text = info.playerName;
                        this.m_imgLegion.source = LegionModel.getLegionCountryImage(info.rank);
                    }
                    break;
                }
            }
        };
        /**查看联盟信息 */
        RankPowerItem.prototype.onShowLegionIntroView = function () {
            var data = this.m_tData.param;
            if (data && data.legionId && data.legionId != RoleData.alliance) {
                // LegionModel.getClickGuildInfo(data);
                NormalProxy.C2S_RANK_GUILD(data.legionId);
            }
        };
        /** 刷新城池数量*/
        RankPowerItem.prototype.refreshCityCount = function (citySize) {
            var allNum = 0;
            for (var i = 0; i < citySize.length; i++) {
                allNum += citySize[i];
            }
            this.m_labPower.text = allNum.toString(10);
        };
        /**刷新冲榜排名头像信息 */
        RankPowerItem.prototype.refreshheadInfo = function (info) {
            this.m_comHead.info = info.playerHead;
            this.m_comState.stateId = info.playerHead.countryId;
            this.m_labName.text = info.playerHead.playerName;
            this.m_labPower.text = info.value.toString(10);
        };
        /**刷新排名奖励 */
        RankPowerItem.prototype.setitemlist = function (reward) {
            Utils.removeAllChild(this.m_rItemsRoot);
            var tmpList = reward;
            for (var i = 0; i < tmpList.length; i++) {
                var info = tmpList[i];
                var itemView = com_main.ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                itemView.scaleX = 0.75;
                itemView.scaleY = 0.75;
                this.m_rItemsRoot.addChild(itemView);
            }
        };
        /**刷新排名图标 */
        RankPowerItem.prototype.refreshRankIcon = function (rank) {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, rank);
        };
        return RankPowerItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
