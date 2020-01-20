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
     * 襄阳战（帝位争夺）
     * 当前战局
     */
    var CurrentDetailsView = /** @class */ (function (_super_1) {
        __extends(CurrentDetailsView, _super_1);
        function CurrentDetailsView(nType) {
            var _this = _super_1.call(this) || this;
            _this.nType = nType;
            _this.initApp("activity/emperorBattle/CurrentDetailsSkin.exml");
            return _this;
        }
        CurrentDetailsView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_XIANGYANG_INFO,
            ];
        };
        /**处理协议号事件 */
        CurrentDetailsView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_INFO: {
                    this.refreshDataRank([]);
                    break;
                }
            }
        };
        CurrentDetailsView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CurrentDetailsView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        };
        CurrentDetailsView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // 暂时隐藏的空间
            this.m_gWei1.visible = false;
            this.m_gWei2.visible = false;
            this.m_gWei3.visible = false;
            // 城池发光
            Utils.isGlow(true, this.m_xyCity, 0XEECE79, 0.8);
            this.m_pListDoorDP = new eui.ArrayCollection([
                { cityID: 104, countryId: 1 },
                { cityID: 105, countryId: 2 },
                { cityID: 106, countryId: 3 },
                { cityID: 107, countryId: 0 }
            ]);
            this.m_listDoor.dataProvider = this.m_pListDoorDP;
            this.m_listDoor.itemRenderer = EmperorCountryCell;
            this.m_listDoor.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            this.m_pListRankDP = new eui.ArrayCollection([]);
            this.m_listRank.dataProvider = this.m_pListRankDP;
            this.m_listRank.itemRenderer = EmperorRankCell;
            this.m_labFighting.text = GCode(CLEnum.XIANGYANG_FIGHTING);
            this.m_labSeeDetails.text = GCode(CLEnum.XIANGYANG_SEE_DETAILS);
            this.m_acEmpVo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            this.refreshTime();
        };
        CurrentDetailsView.prototype.refreshTime = function () {
            this.m_tAcVo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            if (!this.m_tAcVo || TimerUtils.getServerTimeMill() > this.m_tAcVo.closeDate) {
                // 襄阳城已经被占领
                this.m_labTime.text = "襄阳城已经被占领";
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        };
        /**刷新倒计时 */
        CurrentDetailsView.prototype.updateTime = function () {
            if (TimerUtils.getServerTimeMill() > this.m_tAcVo.closeDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                this.m_labTime.text = "襄阳城已经被占领";
                return;
            }
            this.m_gFighting.visible = !this.m_acEmpVo.isInAttReady();
            var time = Math.floor((this.m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                var stopTime = Math.floor((this.m_tAcVo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatBySecond(stopTime, 1)));
                return;
            }
            this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_BATTLE_LEFT, Utils.DateUtils.getFormatBySecond(time, 1)));
        };
        /**初始化界面 */
        CurrentDetailsView.prototype.initView = function () {
            if (this.bInit)
                return;
            this.bInit = true;
            this.addEvent();
            this.refreshView();
        };
        /**设置宽高 */
        CurrentDetailsView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
        };
        /**刷新显示 */
        CurrentDetailsView.prototype.refreshView = function () {
            this.refreshData([]);
            this.refreshDataRank([]);
        };
        CurrentDetailsView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnAll, this, this.onclickAll);
            com_main.EventManager.addTouchScaleListener(this.m_xyCity, this, this.onclickCity);
        };
        CurrentDetailsView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CurrentDetailsView.prototype.onclickAll = function (e) {
            AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW(2);
            // Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_RANK);
        };
        CurrentDetailsView.prototype.onclickCity = function (e) {
            com_main.UpManager.history();
            // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
            var item = { cityID: 108 };
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, item.cityID);
        };
        /**城门归属刷新 */
        CurrentDetailsView.prototype.refreshData = function (data) {
            // this.m_pListDoorDP.replaceAll([
            //     { cityID: 104, countryId: 1 },
            //     { cityID: 105, countryId: 2 },
            //     { cityID: 106, countryId: 3 },
            //     { cityID: 107, countryId: 0 }
            // ]);
            var dp = this.m_pListDoorDP;
            for (var i = 0; i < dp.length; i++) {
                if (!dp.getItemAt(i))
                    continue;
                var item = dp.getItemAt(i);
                item.countryId = WorldModel.getCityBuildInfo(item.cityID).country;
            }
            dp.refresh();
            var countryId = WorldModel.getCityBuildInfo(108).country;
            this.m_imgCountry.source = "common_country5_" + countryId + "_png";
        };
        /**国家杀敌榜刷新 */
        CurrentDetailsView.prototype.refreshDataRank = function (data) {
            var list = this.m_acEmpVo.getSingleRankData(RoleData.countryId);
            if (!list)
                return;
            var awardList = [];
            for (var i = 0; i < list.length; i++) {
                if (i > 2)
                    break;
                awardList.push(list[i]);
            }
            this.m_pListRankDP.replaceAll(awardList);
        };
        CurrentDetailsView.prototype.onTouchTab = function (e) {
            var item = e.item;
            com_main.UpManager.history();
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, item.cityID);
        };
        return CurrentDetailsView;
    }(com_main.CView));
    com_main.CurrentDetailsView = CurrentDetailsView;
    /**城门占领 */
    var EmperorCountryCell = /** @class */ (function (_super_1) {
        __extends(EmperorCountryCell, _super_1);
        function EmperorCountryCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/emperorBattle/EmperorCountryCellSkin.exml");
            return _this;
        }
        EmperorCountryCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgBgF.touchEnabled = false;
        };
        EmperorCountryCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EmperorCountryCell.prototype.onDestroy = function () {
            // EventManager.removeEventListener(this.m_pBtn);
        };
        EmperorCountryCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (!this.data)
                return;
            var countryId = this.data.countryId;
            countryId = countryId == 4 ? 0 : countryId;
            var cityID = this.data.cityID;
            this.m_imgBgF.source = this.getBgSource(countryId);
            Utils.isGlow(true, this.m_imgBg, this.getBgGlowColor(countryId));
            this.m_imgCountry.source = "common_country1_" + countryId + "_png";
            this.m_imgDoor.source = this.getDoorSource(cityID) + "_png";
        };
        EmperorCountryCell.prototype.getBgSource = function (countryId) {
            switch (countryId) {
                case CountryType.SHU:
                    return 'zyt_gj_sg_png';
                case CountryType.WU:
                    return 'zyt_gj_wug_png';
                case CountryType.NONE:
                    return 'zyt_gj_zl_png';
            }
            return 'zyt_gj_wg_png';
        };
        EmperorCountryCell.prototype.getDoorSource = function (cityID) {
            switch (cityID) {
                case 104:
                    return 'lb_dong';
                case 105:
                    return 'lb_xi';
                case 106:
                    return 'lb_nan';
            }
            return 'lb_bei';
        };
        EmperorCountryCell.prototype.getBgGlowColor = function (countryId) {
            switch (countryId) {
                case CountryType.WEI:
                    return 0x2a7d9f;
                case CountryType.SHU:
                    return 0x2a9f35;
                case CountryType.WU:
                    return 0x9f2a2a;
            }
            return 0x7c695f;
        };
        return EmperorCountryCell;
    }(eui.ItemRenderer));
    com_main.EmperorCountryCell = EmperorCountryCell;
    /**国家杀敌榜 */
    var EmperorRankCell = /** @class */ (function (_super_1) {
        __extends(EmperorRankCell, _super_1);
        function EmperorRankCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/emperorBattle/EmperorRankCellSkin.exml");
            return _this;
        }
        EmperorRankCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        EmperorRankCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EmperorRankCell.prototype.onDestroy = function () {
        };
        EmperorRankCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.refresh();
        };
        EmperorRankCell.prototype.refresh = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            RankModel.refreshRankIcon(this.m_imgRank, this.m_labRank, this.m_tData.rank);
            this.m_labame.text = this.m_tData.playerHead.playerName;
            this.m_labKill.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_KILL, this.m_tData.value));
        };
        return EmperorRankCell;
    }(eui.ItemRenderer));
    com_main.EmperorRankCell = EmperorRankCell;
})(com_main || (com_main = {}));
