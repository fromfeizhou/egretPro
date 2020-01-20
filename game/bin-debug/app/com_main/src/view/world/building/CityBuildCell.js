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
     * 英雄头像
     */
    var GeneralCell = /** @class */ (function (_super_1) {
        __extends(GeneralCell, _super_1);
        function GeneralCell() {
            var _this = _super_1.call(this) || this;
            _this.curEndTime = 0;
            _this.curSpeedUpTime = 0;
            _this.skinName = Utils.getSkinName("app/world/building/buildingCell/GeneralCellSkin.exml");
            return _this;
        }
        GeneralCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GeneralCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralCell.prototype.onDestroy = function () {
            this.m_tData = null;
            this.m_tCityInfo = null;
            this.curEndTime = 0;
            this.curSpeedUpTime = 0;
            Utils.TimerManager.remove(this.timeCallback, this);
        };
        GeneralCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.m_gBuilding.visible = false;
            this.m_gDone.visible = false;
            this.refresh();
        };
        GeneralCell.prototype.refresh = function () {
            var info = this.m_tData;
            // 武将id
            var headId = info.generalId;
            this.m_pHero.setGenId(headId);
            this.m_labName.text = GeneralModel.getGeneralName(headId);
            this.m_labName.textColor = Utils.getColorOfQuality(info.qualityLevel);
            this.m_labSkill.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BUILD_SKILL, "无"));
            this.m_labExp.text = GCode(CLEnum.CITY_BUILD_SEXP);
            this.m_labLevel.text = info.level + GCode(CLEnum.LEVEL);
            this.refreshExpView();
            this.refreshGeneralBuildState();
        };
        /**刷新经验 */
        GeneralCell.prototype.refreshExpView = function () {
            var info = this.m_tData;
            this.m_labExpPro.text = Math.floor(info.curExp / info.GetMaxExp() * 100) + "%";
            var pro = (info.curExp / info.GetMaxExp()) > 1 ? 1 : (info.curExp / info.GetMaxExp());
            this.m_imgExpPro.width = pro * 152;
        };
        /**刷新建造状态 */
        GeneralCell.prototype.refreshGeneralBuildState = function () {
            var info = this.m_tData;
            var pInfo = CityBuildModel.getCityInfoByGeneralId(info.generalId);
            if (isNull(pInfo))
                return;
            this.m_tCityInfo = pInfo;
            if (info.cityBuildState == CityBuildEnum.DONE) {
                this.m_gBuilding.visible = false;
                this.m_gDone.visible = true;
                Utils.TimerManager.remove(this.timeCallback, this);
            }
            else if (info.cityBuildState == CityBuildEnum.BUILDING) {
                this.m_gBuilding.visible = true;
                this.m_gDone.visible = false;
                this.initTime();
            }
            else {
                this.m_gBuilding.visible = false;
                this.m_gDone.visible = false;
            }
        };
        GeneralCell.prototype.initTime = function () {
            this.timeCallback();
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        //时间回调
        GeneralCell.prototype.timeCallback = function () {
            this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
            this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;
            var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            var lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
            var cityConfig = WorldModel.getCityConfig(this.m_tCityInfo.cityId);
            this.m_labBB.text = WorldModel.getCityName(cityConfig.id) + GCode(CLEnum.CITY_BUILD_ING);
            this.m_labBT.text = lvUpTimeTxt;
            if (this.curEndTime > 0 && lefttime <= 0) {
                Utils.TimerManager.remove(this.timeCallback, this);
                // CityBuildProxy.C2S_CITY_MADE_INFO(this.m_tCityInfo.cityId);
                this.refresh();
            }
        };
        return GeneralCell;
    }(eui.ItemRenderer));
    com_main.GeneralCell = GeneralCell;
    /**
     * 奖励
     */
    var RewardCell = /** @class */ (function (_super_1) {
        __extends(RewardCell, _super_1);
        function RewardCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/building/buildingCell/RewardCellSkin.exml");
            return _this;
        }
        RewardCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        RewardCell.prototype.setIconView = function (source, des) {
            this.m_imgIcon.source = source;
            this.m_labDes.textFlow = Utils.htmlParser(des);
        };
        return RewardCell;
    }(com_main.CComponent));
    com_main.RewardCell = RewardCell;
    /**
     * 奖励类型
     */
    var RewardTypeCell = /** @class */ (function (_super_1) {
        __extends(RewardTypeCell, _super_1);
        function RewardTypeCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/building/buildingCell/RewardTypeCellSkin.exml");
            return _this;
        }
        RewardTypeCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        RewardTypeCell.prototype.setView = function (des) {
            this.m_labDes.textFlow = Utils.htmlParser(des);
        };
        return RewardTypeCell;
    }(com_main.CComponent));
    com_main.RewardTypeCell = RewardTypeCell;
    /**城池buff图标 */
    var CityBuffCell = /** @class */ (function (_super_1) {
        __extends(CityBuffCell, _super_1);
        function CityBuffCell(param) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
            return _this;
        }
        CityBuffCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = "basebuff";
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        };
        CityBuffCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        /**设置icon */
        CityBuffCell.prototype.setIcon = function (icon, isGray) {
            if (isGray === void 0) { isGray = true; }
            this.m_imgSkillIcon.source = icon;
            Utils.isGray(isGray, this.m_imgSkillIcon);
        };
        /**设置名字 */
        CityBuffCell.prototype.setName = function (name) {
            if (name === void 0) { name = ""; }
            this.m_labName.text = name;
        };
        return CityBuffCell;
    }(com_main.CComponent));
    com_main.CityBuffCell = CityBuffCell;
    /**建设情报 */
    var BuildInfoCell = /** @class */ (function (_super_1) {
        __extends(BuildInfoCell, _super_1);
        function BuildInfoCell() {
            var _this = _super_1.call(this) || this;
            _this.curEndTime = 0;
            _this.curSpeedUpTime = 0;
            _this.skinName = Utils.getSkinName("app/world/building/buildingCell/BuildInfoCellSkin.exml");
            return _this;
        }
        BuildInfoCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.m_cbtnDone.setTitleLabel(GCode(CLEnum.FINISH));
            this.m_cbtnBuilding.setTitleLabel(GCode(CLEnum.SPEED_AD));
        };
        BuildInfoCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BuildInfoCell.prototype.onDestroy = function () {
            this.m_tData = null;
            this.m_tCityInfo = null;
            this.curEndTime = 0;
            this.curSpeedUpTime = 0;
            this.removeEvent();
            Utils.TimerManager.remove(this.timeCallback, this);
        };
        BuildInfoCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.refresh();
        };
        BuildInfoCell.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnLocation, this, this.onclickLocation);
            com_main.EventManager.addTouchScaleListener(this.m_cbtnBuilding, this, this.onclickBuilding);
            com_main.EventManager.addTouchScaleListener(this.m_cbtnDone, this, this.onclickDone);
        };
        BuildInfoCell.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        BuildInfoCell.prototype.onclickLocation = function () {
            if (isNull(this.m_tCityInfo))
                return;
            if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
                com_main.UpManager.history();
                return;
            }
            var vo = this.m_tCityInfo;
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, vo.cityId);
            com_main.UpManager.history();
        };
        BuildInfoCell.prototype.onclickBuilding = function () {
            if (isNull(this.m_tCityInfo))
                return;
            if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
                com_main.UpManager.history();
                return;
            }
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.CityBuild,
                targetId: this.m_tCityInfo.cityId,
                startTime: this.m_tCityInfo.startDate,
                endTime: this.m_tCityInfo.endDate,
                speedUpTime: this.m_tCityInfo.speedTime,
            });
        };
        BuildInfoCell.prototype.onclickDone = function () {
            if (isNull(this.m_tCityInfo))
                return;
            if (CityBuildModel.unOwnerCity(this.m_tCityInfo.cityId)) {
                com_main.UpManager.history();
                return;
            }
            var vo = this.m_tCityInfo;
            CityBuildModel.curCityId = vo.cityId;
            CityBuildProxy.C2S_CITY_MADE_REWARD(vo.cityId, vo.generalId);
        };
        BuildInfoCell.prototype.initTime = function () {
            this.timeCallback();
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        //时间回调
        BuildInfoCell.prototype.timeCallback = function () {
            this.curEndTime = this.m_tCityInfo ? this.m_tCityInfo.endDate : 0;
            this.curSpeedUpTime = this.m_tCityInfo ? this.m_tCityInfo.speedTime : 0;
            var lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            var lvUpTimeTxt = Utils.DateUtils.getCountDownStrBySecond(lefttime);
            this.m_labBT.text = lvUpTimeTxt;
            if (this.curEndTime > 0 && lefttime <= 0) {
                Utils.TimerManager.remove(this.timeCallback, this);
                if (this.m_tCityInfo)
                    this.m_tCityInfo.updateTime();
            }
        };
        BuildInfoCell.prototype.refresh = function () {
            var info = this.m_tData;
            // 武将id
            var headId = info.generalId;
            this.m_pHero.setGenId(headId);
            this.m_labName.text = GeneralModel.getGeneralName(headId);
            this.m_labName.textColor = Utils.getColorOfQuality(info.qualityLevel);
            this.refreshGeneralBuildState();
            this.refreshCityInfo();
        };
        /**刷新建造状态 */
        BuildInfoCell.prototype.refreshGeneralBuildState = function () {
            var info = this.m_tData;
            var pInfo = CityBuildModel.getCityInfoByGeneralId(info.generalId);
            if (isNull(pInfo))
                return;
            this.m_tCityInfo = pInfo;
            if (info.cityBuildState == CityBuildEnum.DONE) {
                this.currentState = "done";
                this.m_labBC.text = GCode(CLEnum.CITY_BUILD_DONE2); // "建造已完成";
                Utils.TimerManager.remove(this.timeCallback, this);
            }
            else if (info.cityBuildState == CityBuildEnum.BUILDING) {
                this.currentState = "building";
                this.m_labBC.text = GCode(CLEnum.CITY_BUILD_ING2); //"后完成建造";
                this.initTime();
            }
        };
        /**刷新城市信息 */
        BuildInfoCell.prototype.refreshCityInfo = function () {
            if (isNull(this.m_tCityInfo))
                return;
            var cityConfig = WorldModel.getCityConfig(this.m_tCityInfo.cityId);
            this.m_labBB.text = WorldModel.getCityName(cityConfig.id);
        };
        return BuildInfoCell;
    }(eui.ItemRenderer));
    com_main.BuildInfoCell = BuildInfoCell;
})(com_main || (com_main = {}));
