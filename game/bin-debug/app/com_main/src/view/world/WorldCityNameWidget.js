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
     * 城池名字
     * @export
     * @class WorldCityNameWidget
     * @extends CComponent
     */
    var WorldCityNameWidget = /** @class */ (function (_super_1) {
        __extends(WorldCityNameWidget, _super_1);
        function WorldCityNameWidget() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/world_cityname_widget.exml");
            _this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY ? "xiangyang" : "world";
            _this.cacheAsBitmap = true;
            return _this;
        }
        WorldCityNameWidget.create = function () {
            var obj = ObjectPool.pop(WorldCityNameWidget, "WorldCityNameWidget");
            return obj;
        };
        /**对象池回收 */
        WorldCityNameWidget.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        WorldCityNameWidget.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldCityNameWidget.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        WorldCityNameWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            this.touchEnabled = false;
        };
        WorldCityNameWidget.prototype.initData = function (conf, country, name, satrap) {
            var _this = this;
            if (country <= 0 || country > 6) {
                error("服务器城池数据错误 id", conf.id, country);
                return;
            }
            var data = [['1', GCode(CLEnum.STATE_WEI)], ['2', GCode(CLEnum.STATE_SHU)], ['3', GCode(CLEnum.STATE_WU)], ['0', GCode(CLEnum.STATE_ZL)], ['0', GCode(CLEnum.STATE_YE)], ['4', GCode(CLEnum.STATE_HUANG)]], _a = data[country - 1], pic = _a[0], n = _a[1];
            RES.getResAsync("common_country1_" + pic + "_png", function (v, k) {
                if (!_this.m_pCountry)
                    return;
                _this.m_pCountry.texture = v;
            }, this);
            var playInfo = CountryModel.getCityPlayerInfoByCityId(conf.id);
            var plaerName = playInfo ? playInfo.name : GCode(CLEnum.WOR_BD_TS) + GCode(CLEnum.NONE);
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
            this.m_pLbName.text = PlatConst.isDebugPlat() ? "" + conf.id + name + " " + conf.initCityLv + GCode(CLEnum.LEVEL) : name + " " + conf.initCityLv + GCode(CLEnum.LEVEL);
            this.m_pKing.visible = conf.type == CityType.KIING_BATTLE;
            // if (satrap) {
            //     this.n_pLbSatrap.text = satrap;
            //     this.n_pLbSatrap.textColor = 0xe9e9e6;
            // } else {
            //     this.n_pLbSatrap.textColor = 0x8a8a9e;
            // }
            this.updateCityTeam(conf.id);
            this.updateCityBuild(conf.id);
            RedPointModel.AddInfoListener(this.m_pBuild, { x: 30, y: -8, scale: 0.78 }, [RedEvtType.WORLD_CITY_BUILD], 7, { cityId: conf.id });
        };
        WorldCityNameWidget.prototype.updateCityTeam = function (cityId) {
            var teamVoList = TeamModel.getTeamVoListByCityId(cityId);
            var len = teamVoList.length;
            this.m_pTeam.visible = len > 0;
        };
        WorldCityNameWidget.prototype.updateCityBuild = function (cityId) {
            var info = CityBuildModel.getCityInfo(cityId);
            if (isNull(info)) {
                this.m_pBuild.visible = false;
                return;
            }
            var isCountry = WorldModel.isOwnerCity(info.cityId);
            if (!isCountry) {
                this.m_pBuild.visible = false;
                return;
            }
            this.m_pBuild.visible = info.cityBuildState != CityBuildEnum.FREE;
            this.m_pTeam.validateNow();
            this.m_pBuild.validateNow();
            this.m_pBuild.right = this.m_pTeam.visible ? this.m_pTeam.right - this.m_pBuild.measuredWidth : this.m_pTeam.right;
        };
        return WorldCityNameWidget;
    }(com_main.CComponent));
    com_main.WorldCityNameWidget = WorldCityNameWidget;
})(com_main || (com_main = {}));
