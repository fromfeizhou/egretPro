module com_main {
    export class CountryManageView extends DynamicComponent {
        public static NAME = 'CountryManageView';

        public m_CityItem0: com_main.CountryManageCity;
        public m_CityItem1: com_main.CountryManageCity;
        public m_CityItem2: com_main.CountryManageCity;
        public m_pTitle: eui.Group;
        public m_city: com_main.CLabel;
        public m_scale: com_main.CLabel;
        public m_power: com_main.CLabel;
        public m_union: com_main.CLabel;
        public m_comTabTopGroup: com_main.ComTabTopGroup;
        public m_ItemList: eui.List;
        public m_PlayerJob: com_main.CountryPlayerJob;
        public m_CountryFlag: com_main.CImage;
        public m_taxBox: eui.Group;
        public m_box: com_main.CImage;
        public m_helpDesc: com_main.CLabel;





        private m_CityItems: any;
        private m_cityColls: eui.ArrayCollection;
        private sortCout: number = 0;
        private oldSelIndex: number = -1;
        public constructor() {
            super();
            this.name = CountryManageView.NAME;
            this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryManageViewSkin.exml");
        }

        protected onShow(){
            this.initCityList();
            this.InitCityItem();
            this.Refresh();
            this.initEvent();
            this.m_comTabTopGroup.clearTabBtn();
            let tags = [GCode(CLEnum.STATE_CITY), GCode(CLEnum.STATE_SCALE), GCode(CLEnum.STATE_POWER), GCode(CLEnum.STATE_LION)];
            this.m_comTabTopGroup.initNorTabBtns(tags);
            this.m_comTabTopGroup.setChangeCallback(this.changeTopTag, this);
            this.refreshBox();
            this.m_helpDesc.textFlow = Utils.htmlParser(GCode(CLEnum.STATE_AWARD_TIPS));
            RedPointModel.AddInfoListener(this.m_taxBox, { x: 186, y: 165, scale: 0.75 }, [RedEvtType.TAX_COUNTRY], 2);
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

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
        private changeTopTag(selIndex: number) {
            if (this.oldSelIndex == selIndex) return;
            this.oldSelIndex = selIndex;
            this.onTouchTitle(selIndex)
        }
        /**刷新宝箱状态 */
        public refreshBox() {
            this.m_taxBox.visible = RoleData.hasCityRevenue;
        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventManager.addTouchTapListener(this.m_pTitle, this, this.onTouchTitle);
            EventManager.addTouchTapListener(this.m_box, this, this.onTouchBox);

            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_JOB_APPLY_UP,this.Refresh,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_APPLY_UP,this.updateCityData,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_INFO,this.updateCityData,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_REVENUE_STATUS,this.refreshBox,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_CITY_REVENUE,this.refreshBox,this);

        }

        private removeEvent() {
            EventManager.removeEventListeners(this);

            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_JOB_APPLY_UP,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_APPLY_UP,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_INFO,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_REVENUE_STATUS,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_CITY_REVENUE,this);
        }
        /**领取税收奖励 */
        public onTouchBox() {
            CountryProxy.C2S_COUNTRY_CITY_REVENUE();
        }
        public onTouchTitle(selIndex: number) {
            switch (selIndex) {
                case 0:
                    this.sortByCity();
                    break;
                case 1:
                    this.sortByScale();
                    break;
                case 2:
                    this.sortByPower()
                    break;
                case 3:
                    this.sortByUion();
                    break;
            }
        }
        /**按城市等级排 */
        public sortByCity() {
            this.m_cityColls.source.sort((p1: ICountryManageItemRD, p2: ICountryManageItemRD) => {
                let cityInfo1 = CountryModel.CityInfos[p1.cityId]
                let cityInfo2 = CountryModel.CityInfos[p2.cityId]
                return cityInfo1.CityCfg.level - cityInfo2.CityCfg.level;
            })
            this.m_cityColls.refresh();
        }
        /**
         * 城池规模【排
         */
        public sortByScale() {
            this.m_cityColls.source.sort((p1: ICountryManageItemRD, p2: ICountryManageItemRD) => {
                return p1.cityType - p2.cityType;
            })
            this.m_cityColls.refresh();
        }
        /**
        * 城池规模【排
        */
        public sortByPower() {
            this.m_cityColls.source.sort((p1: ICountryManageItemRD, p2: ICountryManageItemRD) => {
                let s1 = p1.playerName == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                let s2 = p2.playerName == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                return s2 - s1;
            })
            this.m_cityColls.refresh();
        }
        /**
        * 城池规模【排
        */
        public sortByUion() {
            this.m_cityColls.source.sort((p1: ICountryManageItemRD, p2: ICountryManageItemRD) => {
                let s1 = p1.legion == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                let s2 = p2.legion == GCode(CLEnum.STATE_GZ_EMPTY) ? 0 : 1;
                return s2 - s1;
            })
            this.m_cityColls.refresh();
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

        /**初始话城池列表 */
        public initCityList() {
            this.m_cityColls = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_cityColls;
            this.m_ItemList.itemRenderer = CountryManageItem;
        }
        private InitCityItem() {
            this.m_CityItems = {};
            for (let i = 0; i < 3; i++) {
                let cityItem: CountryManageCity = this["m_CityItem" + i] as CountryManageCity;
                //2-都城；3-郡城；4-县城
                let cityType = i + 1;
                cityItem.InitCity(cityType);
                this.m_CityItems[cityType] = cityItem;
            }
        }

        private ResetCityItem() {
            for (let key in this.m_CityItems) {
                if (this.m_CityItems[key] != null && this.m_CityItems[key] != undefined)
                    this.m_CityItems[key].ResetNum();
            }
        }

        private updateCityData() {
            this.ResetCityItem();

            let res: ICountryManageItemRD[] = [];
            for (let cityId in CountryModel.CityInfos) {
                let cityInfo = CountryModel.CityInfos[cityId]
                if (cityInfo && cityInfo.CityCfg.mapId == SceneEnums.WORLD_XIANGYANG_CITY) continue;
                if (cityInfo != null && cityInfo != undefined) {
                    let cityItem = this.m_CityItems[cityInfo.CityCfg.level];
                    if (cityItem) {
                        cityItem.AddNum(1);
                    }
                }

                let cityName: string = GLan(cityInfo.CityCfg.name);
                let cityType: number = cityInfo.CityCfg.level;
                let playerName: string = cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.name;
                let legion: string = cityInfo.PlayerInfo == null ? GCode(CLEnum.STATE_GZ_EMPTY) : cityInfo.PlayerInfo.legionName
                let isSelf: boolean = cityInfo.PlayerInfo == null ? false : cityInfo.PlayerInfo.playerId == RoleData.playerId
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
            this.m_cityColls.replaceAll(res)

        }

        // private RefreshScroller() {
        //     for (let item of this.m_ItemList.$children) {
        //         let itemEx: CountryManageItem = item as CountryManageItem;
        //         itemEx.Refresh();
        //     }
        // }

        public Refresh() {
            this.updateCityData();
            this.Refresh_PlayerJob();
            this.Refresh_CountryFlag();
        }

        private Refresh_PlayerJob(): void {
            this.m_PlayerJob.SetHead(RoleData.headId);
            this.m_PlayerJob.SetPlayerName(RoleData.nickName);
            this.m_PlayerJob.SetJobName(CountryModel.Self_PlayerInfo.jobId);
        }

        private Refresh_CountryFlag(): void {
            this.m_CountryFlag.source = Utils.getCountyBigiFlagById(RoleData.countryId);
        }

    }
}