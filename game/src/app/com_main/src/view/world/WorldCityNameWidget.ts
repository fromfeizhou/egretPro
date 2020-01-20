module com_main {

    /**
     * 城池名字
     * @export
     * @class WorldCityNameWidget
     * @extends CComponent
     */
    export class WorldCityNameWidget extends CComponent {

        public bg: eui.Image;
        public m_pCountry: com_main.CImage;
        public m_pLbName: eui.Label;
        public m_pTeam: com_main.CImage;
        public m_pBuild: eui.Group;
        public m_pKing: com_main.CImage;




        public static create() {
            let obj = ObjectPool.pop(WorldCityNameWidget, "WorldCityNameWidget");
            return obj;
        }

        /**对象池回收 */
        public onPoolClear() {
            this.setSkin(null)
        }

        public onDestroy(): void {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            super.onDestroy();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_cityname_widget.exml");
            this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY ? "xiangyang" : "world"
            this.cacheAsBitmap = true;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.touchChildren = false;
            this.touchEnabled = false;
        }

        public initData(conf: WorldMapConfig, country: number, name: string, satrap?: string) {
            if (country <= 0 || country > 6) {
                error("服务器城池数据错误 id", conf.id, country);
                return;
            }
            const data = [['1', GCode(CLEnum.STATE_WEI)], ['2', GCode(CLEnum.STATE_SHU)], ['3', GCode(CLEnum.STATE_WU)], ['0', GCode(CLEnum.STATE_ZL)], ['0', GCode(CLEnum.STATE_YE)], ['4', GCode(CLEnum.STATE_HUANG)]]
                , [pic, n] = data[country - 1];

            RES.getResAsync(`common_country1_${pic}_png`, (v, k) => {
                if (!this.m_pCountry) return;
                this.m_pCountry.texture = v;
            }, this);
            let playInfo: gameProto.ICountryPlayerInfo = CountryModel.getCityPlayerInfoByCityId(conf.id);
            let plaerName: string = playInfo ? playInfo.name : GCode(CLEnum.WOR_BD_TS) + GCode(CLEnum.NONE);
            // this.n_pLbSatrap.text =  plaerName;
            // if (country == 4) {
            //     this.m_pLbCountry.size = 22;
            //     this.m_pLbCountry.textColor = 0xe9e9e6;
            //     Utils.isGray(true, this.m_pCountry);
            //     this.m_pLbCountry.text = GLan(conf.banner);
            // } else {
            //     this.m_pLbCountry.text = n;
            //     this.m_pLbCountry.size = 28;
            //     this.m_pLbCountry.textColor = 0xFFFF99;
            //     Utils.isGray(false, this.m_pCountry);
            // }
            this.m_pLbName.text = PlatConst.isDebugPlat()? `${conf.id}${name} ${conf.initCityLv}${GCode(CLEnum.LEVEL)}` : `${name} ${conf.initCityLv}${GCode(CLEnum.LEVEL)}`
            this.m_pKing.visible = conf.type == CityType.KIING_BATTLE;
            // if (satrap) {
            //     this.n_pLbSatrap.text = satrap;
            //     this.n_pLbSatrap.textColor = 0xe9e9e6;
            // } else {
            //     this.n_pLbSatrap.textColor = 0x8a8a9e;
            // }
            this.updateCityTeam(conf.id);
            this.updateCityBuild(conf.id);

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_pBuild, { x: 30, y: -8, scale: 0.78 }, [RedEvtType.WORLD_CITY_BUILD], 7,{cityId:conf.id});
        }

        public updateCityTeam(cityId: number) {
            let teamVoList: TeamVo[] = TeamModel.getTeamVoListByCityId(cityId);
            let len: number = teamVoList.length;
            this.m_pTeam.visible = len > 0;
        }

        public updateCityBuild(cityId: number) {
            let info = CityBuildModel.getCityInfo(cityId);
            if (isNull(info)) {
                this.m_pBuild.visible = false;
                return;
            }
            let isCountry = WorldModel.isOwnerCity(info.cityId);
            if (!isCountry) {
                this.m_pBuild.visible = false;
                return;
            }
            this.m_pBuild.visible = info.cityBuildState != CityBuildEnum.FREE;
            this.m_pTeam.validateNow();
            this.m_pBuild.validateNow();
            this.m_pBuild.right = this.m_pTeam.visible ? this.m_pTeam.right - this.m_pBuild.measuredWidth : this.m_pTeam.right;
        }
    }
}
