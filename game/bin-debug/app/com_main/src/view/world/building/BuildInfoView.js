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
     * 城池建设情报
     */
    var BuildInfoView = /** @class */ (function (_super_1) {
        __extends(BuildInfoView, _super_1);
        function BuildInfoView(cityId) {
            var _this = _super_1.call(this) || this;
            _this.name = BuildInfoView.NAME;
            _this.initApp("world/building/BuildInfoViewSkin.exml");
            return _this;
        }
        BuildInfoView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        BuildInfoView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                default:
                    break;
            }
        };
        BuildInfoView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BuildInfoView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        BuildInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.BUILD_INFO));
            this.m_pListGeneralDP = new eui.ArrayCollection([]);
            this.m_listGeneral.itemRenderer = com_main.BuildInfoCell;
            this.m_listGeneral.dataProvider = this.m_pListGeneralDP;
            this.addEvent();
            this.refreshListGeneral();
        };
        BuildInfoView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.onWorldBuildUpdate, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this.onBuildHeroDel, this);
        };
        BuildInfoView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_HERO_DEL, this);
        };
        /**更新城池建设状态 */
        BuildInfoView.prototype.onWorldBuildUpdate = function (cityId) {
            // if (isNull(this.m_pListGeneralDP)) return;
            // for (let i = 0, len = this.m_pListGeneralDP.length; i<len; i++) {
            // 	if (isNull(this.m_pListGeneralDP.getItemAt(i))) continue;
            // 	let vo = this.m_pListGeneralDP.getItemAt(i) as CityBuildVo;
            // 	if (vo.cityId == cityId) {}
            // }
            this.refreshListGeneral();
        };
        BuildInfoView.prototype.onBuildHeroDel = function (cityId) {
            if (CityBuildModel.unOwnerCity(cityId)) {
                com_main.UpManager.history();
                return;
            }
            this.refreshListGeneral();
        };
        BuildInfoView.prototype.refreshListGeneral = function () {
            var allBuildGeneral = []; // 所有武将在建设和建设完成的列表
            var list = CityBuildModel.getRecruitedGeneral();
            list.forEach(function (v, i, a) {
                var cityId = CityBuildModel.getBuildGenCityId(v.generalId);
                if (cityId > 0) {
                    var info = CityBuildModel.getCityInfo(cityId);
                    v.cityBuildState = info.cityBuildState;
                    if (v.cityBuildState != CityBuildEnum.FREE)
                        allBuildGeneral.push(v);
                }
            });
            SortTools.MoreKeysSorter(allBuildGeneral, ["cityBuildState", "level", "quality"], [ArraySort.UPPER, ArraySort.LOWER, ArraySort.LOWER]);
            this.m_pListGeneralDP.replaceAll(allBuildGeneral);
        };
        BuildInfoView.NAME = "BuildInfoView";
        return BuildInfoView;
    }(com_main.CView));
    com_main.BuildInfoView = BuildInfoView;
})(com_main || (com_main = {}));
