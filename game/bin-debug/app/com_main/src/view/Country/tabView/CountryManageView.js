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
    var CountryManageView = /** @class */ (function (_super_1) {
        __extends(CountryManageView, _super_1);
        function CountryManageView() {
            var _this = _super_1.call(this) || this;
            _this.sortCout = 0;
            _this.oldSelIndex = -1;
            _this.name = CountryManageView.NAME;
            _this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryManageViewSkin.exml");
            return _this;
        }
        CountryManageView.prototype.onShow = function () {
            this.initCityList();
            this.InitCityItem();
            this.Refresh();
            this.initEvent();
            this.m_comTabTopGroup.clearTabBtn();
            var tags = [GCode(CLEnum.STATE_CITY), GCode(CLEnum.STATE_SCALE), GCode(CLEnum.STATE_POWER), GCode(CLEnum.STATE_LION)];
            this.m_comTabTopGroup.initNorTabBtns(tags);
            this.m_comTabTopGroup.setChangeCallback(this.changeTopTag, this);
            this.refreshBox();
            this.m_helpDesc.textFlow = Utils.htmlParser(GCode(CLEnum.STATE_AWARD_TIPS));
            RedPointModel.AddInfoListener(this.m_taxBox, { x: 186, y: 165, scale: 0.75 }, [RedEvtType.TAX_COUNTRY], 2);
        };
        CountryManageView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CountryManageView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.initCityList();
        //     this.InitCityItem();
        //     this.Refresh();
        //     this.initEvent();
        //     this.m_comTabTopGroup.clearTabBtn();
        //     let tags = [GCode(CLEnum.STATE_CITY), GCode(CLEnum.STATE_SCALE), GCode(CLEnum.STATE_POWER), GCode(CLEnum.STATE_LION)];
        //     this.m_comTabTopGroup.initNorTabBtns(tags);
        //     this.m_comTabTopGroup.setChangeCallback(this.changeTopTag, this);
        //     this.refreshBox();
        //     this.m_helpDesc.textFlow = Utils.htmlParser(GCode(CLEnum.STATE_AWARD_TIPS));
        //     RedPointModel.AddInfoListener(this.m_taxBox, { x: 186, y: 165, scale: 0.75 }, [RedEvtType.TAX_COUNTRY], 2);
        // }
        CountryManageView.prototype.changeTopTag = function (selIndex) {
            if (this.oldSelIndex == selIndex)
                return;
            this.oldSelIndex = selIndex;
            this.onTouchTitle(selIndex);
        };
        /**刷新宝箱状态 */
        CountryManageView.prototype.refreshBox = function () {
            this.m_taxBox.visible = RoleData.hasCityRevenue;
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        CountryManageView.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_pTitle, this, this.onTouchTitle);
            com_main.EventManager.addTouchTapListener(this.m_box, this, this.onTouchBox);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_JOB_APPLY_UP, this.Refresh, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_APPLY_UP, this.updateCityData, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_INFO, this.updateCityData, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_REVENUE_STATUS, this.refreshBox, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_REVENUE, this.refreshBox, this);
        };
        CountryManageView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_JOB_APPLY_UP, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_APPLY_UP, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_INFO, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_REVENUE_STATUS, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_REVENUE, this);
        };
        /**领取税收奖励 */
        CountryManageView.prototype.onTouchBox = function () {
            CountryProxy.C2S_COUNTRY_CITY_REVENUE();
        };
        CountryManageView.prototype.onTouchTitle = function (selIndex) {
            switch (selIndex) {
                case 0:
                    this.sortByCity();
                    break;
                case 1:
                    this.sortByScale();
                    break;
                case 2:
                    this.sortByPower();
                    break;
                case 3:
                    this.sortByUion();
                    break;
            }
        };
        /**按城市等级排 */
        CountryManageView.prototype.sortByCity = function () {
            this.m_cityColls.source.sort(function (p1, p2) {
                var cityInfo1 = CountryModel.CityInfos[p1.cityId];
                var cityInfo2 = CountryModel.CityInfos[p2.cityId];
                return cityInfo1.CityCfg.level - cityInfo2.CityCfg.level;
            });
            this.m_cityColls.refresh();
        };
        /**
         * 城池规模【排
         */
        CountryManageView.prototype.sortByScale = function () {
            this.m_cityColls.source.sort(function (p1, p2) {
                return p1.cityType - p2.cityType;
            });
            this.m_cityColls.refresh();
        };
        /**
        * 城池规模【排
        */
        CountryManageView.prototype.sortByPower = function () {
            this.m_cityColls.source.sort(function (p1, p2) {
                var s1 = p1.playerName == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                var s2 = p2.playerName == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                return s2 - s1;
            });
            this.m_cityColls.refresh();
        };
        /**
        * 城池规模【排
        */
        CountryManageView.prototype.sortByUion = function () {
            this.m_cityColls.source.sort(function (p1, p2) {
                var s1 = p1.legion == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                var s2 = p2.legion == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                return s2 - s1;
            });
            this.m_cityColls.refresh();
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**初始话城池列表 */
        CountryManageView.prototype.initCityList = function () {
            this.m_cityColls = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_cityColls;
            this.m_ItemList.itemRenderer = com_main.CountryManageItem;
        };
        CountryManageView.prototype.InitCityItem = function () {
            this.m_CityItems = {};
            for (var i = 0; i < 3; i++) {
                var cityItem = this["m_CityItem" + i];
                //2-都城；3-郡城；4-县城
                var cityType = i + 1;
                cityItem.InitCity(cityType);
                this.m_CityItems[cityType] = cityItem;
            }
        };
        CountryManageView.prototype.ResetCityItem = function () {
            for (var key in this.m_CityItems) {
                if (this.m_CityItems[key] != null && this.m_CityItems[key] != undefined)
                    this.m_CityItems[key].ResetNum();
            }
        };
        CountryManageView.prototype.updateCityData = function () {
            this.ResetCityItem();
            var res = [];
            for (var cityId in CountryModel.CityInfos) {
                var cityInfo = CountryModel.CityInfos[cityId];
                if (cityInfo && cityInfo.CityCfg.mapId == SceneEnums.WORLD_XIANGYANG_CITY)
                    continue;
                if (cityInfo != null && cityInfo != undefined) {
                    var cityItem = this.m_CityItems[cityInfo.CityCfg.level];
                    if (cityItem) {
                        cityItem.AddNum(1);
                    }
                }
                var cityName = GLan(cityInfo.CityCfg.name);
                var cityType = cityInfo.CityCfg.level;
                var playerName = cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.name;
                var legion = cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.legionName;
                var isSelf = cityInfo.PlayerInfo == null ? false : cityInfo.PlayerInfo.playerId == RoleData.playerId;
                res.push({ cityName: cityName, cityType: cityType, playerName: playerName, legion: legion, isSelf: isSelf, cityId: cityInfo.CityCfg.id });
                // this.m_cityColls.addItem(
                //     {
                //         name: GLan(cityInfo.CityCfg.name),	//城市名字
                //         cityConfig: cityInfo.CityCfg,
                //         scale: `${WorldModel.CITY_TYPE_NAME[cityInfo.CityCfg.type]}`,	//城市类型
                //         playerName: cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.name,
                //         legion: cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.legionName,
                //         isSelf: ,
                //     });
            }
            this.m_cityColls.replaceAll(res);
        };
        // private RefreshScroller() {
        //     for (let item of this.m_ItemList.$children) {
        //         let itemEx: CountryManageItem = item as CountryManageItem;
        //         itemEx.Refresh();
        //     }
        // }
        CountryManageView.prototype.Refresh = function () {
            this.updateCityData();
            this.Refresh_PlayerJob();
            this.Refresh_CountryFlag();
        };
        CountryManageView.prototype.Refresh_PlayerJob = function () {
            this.m_PlayerJob.SetHead(RoleData.headId);
            this.m_PlayerJob.SetPlayerName(RoleData.nickName);
            this.m_PlayerJob.SetJobName(CountryModel.Self_PlayerInfo.jobId);
        };
        CountryManageView.prototype.Refresh_CountryFlag = function () {
            this.m_CountryFlag.source = Utils.getCountyBigiFlagById(RoleData.countryId);
        };
        CountryManageView.NAME = 'CountryManageView';
        return CountryManageView;
    }(com_main.DynamicComponent));
    com_main.CountryManageView = CountryManageView;
})(com_main || (com_main = {}));
