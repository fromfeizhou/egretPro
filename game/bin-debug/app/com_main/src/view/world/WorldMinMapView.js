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
     * 首占奖励面板
     */
    var WorldMinMapView = /** @class */ (function (_super_1) {
        __extends(WorldMinMapView, _super_1);
        function WorldMinMapView() {
            var _this = _super_1.call(this) || this;
            _this.name = WorldMinMapView.NAME;
            _this.skinName = Utils.getAppSkin("world/WorldMinMapViewSkin.exml");
            _this.m_pCity.cacheAsBitmap = true;
            return _this;
        }
        WorldMinMapView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldMinMapView.prototype.onDestroy = function () {
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldMinMapView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.createCityPoint();
            this.initEvent();
        };
        WorldMinMapView.prototype.createCityPoint = function () {
            this.m_pCity.removeChildren();
            var config = C.WorldMapConfig;
            var index = 0;
            for (var id in config) {
                var info = config[id];
                if (info.mapId == SceneEnums.WORLD_XIANGYANG_CITY)
                    continue;
                var cPoint = new eui.Image();
                cPoint.name = "name_" + info.id;
                if (Number(id) !== 32) {
                    var cityInfo = WorldModel.getCityBuildInfo(Number(id));
                    var country = cityInfo ? cityInfo.country : info.countryId;
                    cPoint.source = Utils.getCountyPSourceById(country, info.level);
                }
                else {
                    cPoint.source = "dt_ta_png";
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
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldMinMapView.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_UPDATE, this.onUpdateCity, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_MOVE, this.onUpdatePos, this);
            com_main.EventManager.addTouchTapListener(this.m_pCity, this, this.onclickMinMap);
        };
        WorldMinMapView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_MOVE, this);
            com_main.EventManager.removeEventListener(this.m_pCity);
        };
        WorldMinMapView.prototype.onUpdatePos = function (point) {
            if (this.m_frame) {
                this.m_frame.x = -point.x / 24 + 30;
                this.m_frame.y = -point.y / 24 + 12;
            }
        };
        WorldMinMapView.prototype.onclickMinMap = function () {
            FunctionModel.openFunctionByType(FunctionType.MINIMAP);
        };
        /**更新城池 */
        WorldMinMapView.prototype.onUpdateCity = function (cityInfoList) {
            if (!cityInfoList)
                return;
            if (!this || !this.m_pCity)
                return;
            if (this.m_pCity)
                for (var index = 0; index < cityInfoList.length; index++) {
                    var cityInfo = cityInfoList[index];
                    var cityCfg = C.WorldMapConfig[cityInfo.id];
                    if (!cityCfg)
                        continue;
                    if (cityCfg.mapId == SceneEnums.WORLD_XIANGYANG_CITY)
                        continue;
                    var cPoint = this.m_pCity.getChildByName("name_" + cityInfo.id);
                    if (!cPoint)
                        continue;
                    cPoint.source = Utils.getCountyPSourceById(cityInfo.country, cityCfg.type);
                }
        };
        WorldMinMapView.NAME = 'WorldMinMapView';
        return WorldMinMapView;
    }(com_main.CComponent));
    com_main.WorldMinMapView = WorldMinMapView;
})(com_main || (com_main = {}));
