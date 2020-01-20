module com_main {
	/**
	 * 首占奖励面板
	 */
    export class WorldMinMapView extends CComponent {
        public static NAME = 'WorldMinMapView';
        public m_pCity: eui.Group;
        public m_frame: com_main.CImage;

        public constructor() {
            super();
            this.name = WorldMinMapView.NAME;
            this.skinName = Utils.getAppSkin("world/WorldMinMapViewSkin.exml");
            this.m_pCity.cacheAsBitmap = true;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.removeEvent();
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.createCityPoint();
            this.initEvent();
        }
        public createCityPoint() {
            this.m_pCity.removeChildren();
            let config = C.WorldMapConfig;
            let index = 0;
            for (let id in config) {
                let info = config[id];
                if (info.mapId == SceneEnums.WORLD_XIANGYANG_CITY) continue;
                let cPoint: eui.Image = new eui.Image();
                cPoint.name = `name_${info.id}`;
                if (Number(id) !== 32) {
                    let cityInfo = WorldModel.getCityBuildInfo(Number(id));
                    let country: number = cityInfo ? cityInfo.country : info.countryId;
                    cPoint.source = Utils.getCountyPSourceById(country, info.level)
                } else {
                    cPoint.source = "dt_ta_png"
                }
                cPoint.anchorOffsetX = cPoint.width / 2;
                cPoint.anchorOffsetY = cPoint.height / 2;
                cPoint.x = info.mapX;
                cPoint.y = info.mapY;
                index++;
                if (Number(id) == WorldModel.capitalId) {
                    this.m_frame.x = cPoint.x + 12;
                    this.m_frame.y = cPoint.y + 8;
                }
                this.m_pCity.addChild(cPoint);
            }

        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_UPDATE, this.onUpdateCity, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_MOVE, this.onUpdatePos, this);
            EventManager.addTouchTapListener(this.m_pCity, this, this.onclickMinMap);
        }
        private removeEvent() {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_MOVE, this);
            EventManager.removeEventListener(this.m_pCity);
        }
        public onUpdatePos(point: egret.Point) {
            if (this.m_frame) {
                this.m_frame.x = -point.x / 24 + 30;
                this.m_frame.y = -point.y / 24 + 12;
            }

        }

        private onclickMinMap() {
            FunctionModel.openFunctionByType(FunctionType.MINIMAP);
        }

        /**更新城池 */
        public onUpdateCity(cityInfoList: gameProto.ICityInfo[]) {
            if (!cityInfoList)
                return;
            if (!this || !this.m_pCity)
                return;
            if (this.m_pCity)
                for (let index = 0; index < cityInfoList.length; index++) {
                    let cityInfo: gameProto.ICityInfo = cityInfoList[index];
                    let cityCfg = C.WorldMapConfig[cityInfo.id];
                    if (!cityCfg)
                        continue;
                    if (cityCfg.mapId == SceneEnums.WORLD_XIANGYANG_CITY) continue;
                    let cPoint: eui.Image = <eui.Image>this.m_pCity.getChildByName(`name_${cityInfo.id}`);
                    if (!cPoint)
                        continue;
                    cPoint.source = Utils.getCountyPSourceById(cityInfo.country, cityCfg.type)
                }
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }

}