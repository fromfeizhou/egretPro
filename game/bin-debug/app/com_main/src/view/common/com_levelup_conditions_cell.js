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
var LvUpConditionsType;
(function (LvUpConditionsType) {
    LvUpConditionsType[LvUpConditionsType["Item"] = 1] = "Item";
    LvUpConditionsType[LvUpConditionsType["Build"] = 2] = "Build";
    LvUpConditionsType[LvUpConditionsType["Technology"] = 3] = "Technology";
})(LvUpConditionsType || (LvUpConditionsType = {}));
var com_main;
(function (com_main) {
    /**
     * 升级条件cell  后续删除building_conditions_cell
     */
    var com_levelup_conditions_cell = /** @class */ (function (_super_1) {
        __extends(com_levelup_conditions_cell, _super_1);
        function com_levelup_conditions_cell(conditionInfo) {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            _this.skinName = Utils.getAppSkin("common/com_levelup_conditions_skin.exml");
            _this.conditionInfo = conditionInfo;
            return _this;
        }
        com_levelup_conditions_cell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGoto, this, this.onClickHundler);
            if (!this.data && this.conditionInfo) {
                this.data = this.conditionInfo;
                this.dataChanged();
            }
        };
        com_levelup_conditions_cell.prototype.onClickHundler = function (e) {
            if (this.data) {
                this.data.onClickGotoBtn();
            }
        };
        com_levelup_conditions_cell.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //外部设置数据
        com_levelup_conditions_cell.prototype.setConditionInfo = function (info) {
            this.conditionInfo = info;
            if (this.conditionInfo != this.data) {
                this.data = this.conditionInfo;
                this.dataChanged();
                this.visible = true;
            }
        };
        com_levelup_conditions_cell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                //this.data.update(this.m_icon,this.m_pLbDesc,this.m_imageIsCan,this.m_pBtnGoto);
                this.m_pBtnGotoName.setTitleLabel(this.data.getTip());
                this.m_icon.source = this.data.getIconPath();
                this.m_pLbDesc.textFlow = Utils.htmlParser(this.data.getDescStr());
                var tempIsCan = this.data.getIsCan();
                // this.m_pLbDesc.textColor = tempIsCan ? GameConfig.TextColors.white : GameConfig.TextColors.red;
                this.m_pBtnGoto.visible = !tempIsCan;
                if (this.data.width)
                    this.width = this.data.width;
            }
        };
        com_levelup_conditions_cell.prototype.isMatch = function () {
            if (this.data) {
                return this.data.IsMatch;
            }
            return false;
        };
        return com_levelup_conditions_cell;
    }(eui.ItemRenderer));
    com_main.com_levelup_conditions_cell = com_levelup_conditions_cell;
    //基本材料类型限制
    var LvUpConditionsBaseInfo = /** @class */ (function () {
        function LvUpConditionsBaseInfo(id, needNum, desc, width) {
            if (width === void 0) { width = 500; }
            this.descStr = desc;
            this.needNum = Math.ceil(needNum);
            this.itemId = id;
            this.width = width;
            this.btnTip = GCode(CLEnum.GO_GET);
        }
        LvUpConditionsBaseInfo.prototype.getTip = function () {
            return this.btnTip;
        };
        LvUpConditionsBaseInfo.prototype.getDescStr = function () {
            var count = RoleData.GetMaterialNumById(this.itemId);
            if (count >= this.needNum) {
                return "" + this.needNum;
            }
            else {
                return "<font color = #ff0000>" + this.needNum + "</font>";
            }
        };
        LvUpConditionsBaseInfo.prototype.getIsCan = function () {
            return RoleData.GetMaterialNumById(this.itemId) >= this.needNum;
        };
        LvUpConditionsBaseInfo.prototype.getIconPath = function () {
            return RoleData.GetMaterialIconPathById(this.itemId);
        };
        LvUpConditionsBaseInfo.prototype.getWidth = function () {
            return this.width;
        };
        LvUpConditionsBaseInfo.prototype.setWidth = function (w) {
            this.width = w;
        };
        Object.defineProperty(LvUpConditionsBaseInfo.prototype, "IsMatch", {
            get: function () {
                if (this.getIsCan()) {
                    return true;
                }
                else {
                    this.onUnMatch();
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        LvUpConditionsBaseInfo.prototype.onUnMatch = function () {
            var desc = "";
            switch (this.itemId) {
                case PropEnum.GOLD: { //金币
                    desc = GCode(CLEnum.GOLD_LESS);
                    break;
                }
                case PropEnum.FOOD: { //粮食
                    desc = GCode(CLEnum.FOOD_LESS);
                    break;
                }
                case PropEnum.SILVER: { //银两
                    desc = GCode(CLEnum.SILVER_LESS);
                    break;
                }
                case PropEnum.WOOD: { //木材
                    desc = GCode(CLEnum.WOOD_LESS);
                    break;
                }
                case PropEnum.IRON: { //铁
                    desc = GCode(CLEnum.IRON_LESS);
                    break;
                }
            }
            EffectUtils.showTips(desc, 1, true);
        };
        LvUpConditionsBaseInfo.prototype.onClickGotoBtn = function () {
            var panelId = 0;
            switch (this.itemId) {
                case PropEnum.GOLD: { //金币
                    break;
                }
                case PropEnum.FOOD: { //粮食
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.FOOD);
                    break;
                }
                case PropEnum.SILVER: { //银两
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.SILVER);
                    //Utils.open_view(panelId);
                    break;
                }
                case PropEnum.WOOD: { //木材
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.WOOD);
                    break;
                }
                case PropEnum.IRON: { //铁
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.IRON);
                    break;
                }
            }
        };
        return LvUpConditionsBaseInfo;
    }());
    com_main.LvUpConditionsBaseInfo = LvUpConditionsBaseInfo;
    //建筑等级类型限制//(id是建筑类型)
    var LvUpConditionsBuildInfo = /** @class */ (function (_super_1) {
        __extends(LvUpConditionsBuildInfo, _super_1);
        function LvUpConditionsBuildInfo(id, needLv, buildNum) {
            if (buildNum === void 0) { buildNum = 1; }
            var _this = _super_1.call(this, id, needLv) || this;
            _this.typeId = 0; //建筑类型
            _this.buildNum = 1; //需要几个建筑满足条件
            _this.needLv = 0; //需要多少等级建筑满足条件
            _this.typeId = id;
            _this.buildNum = buildNum;
            _this.needLv = needLv;
            _this.descStr = _this.getDescStr();
            _this.btnTip = GCode(CLEnum.GO_TECHNO);
            return _this;
        }
        LvUpConditionsBuildInfo.prototype.getDescStr = function () {
            var desc = "";
            var tempName = GLan(MainMapModel.getBunildCfgByType(this.itemId).name);
            var finifhNum = MainMapModel.getBuildNumByLvAndType(this.itemId, this.needNum);
            if (this.buildNum <= 1) {
                if (this.typeId == BuildingType.AUDIENCE_HALL) {
                    if (MainMapModel.getHallLevel() < this.needLv) {
                        desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL, tempName, this.needNum);
                    }
                    else {
                        desc = GCodeFromat(CLEnum.CITY_BD_NEED, tempName, this.needNum);
                    }
                }
                else {
                    var build = MainMapModel.getBuildInfobyType(this.itemId);
                    var lv = MainMapModel.getBuildInfo(build) ? MainMapModel.getBuildInfo(build).level : 0;
                    if (lv < this.needLv) {
                        desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL, tempName, this.needNum);
                    }
                    else {
                        desc = GCodeFromat(CLEnum.CITY_BD_NEED, tempName, this.needNum);
                    }
                }
            }
            else
                desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL1, this.buildNum, tempName, this.needNum, finifhNum, this.buildNum);
            return desc;
        };
        LvUpConditionsBuildInfo.prototype.getIsCan = function () {
            return MainMapModel.getBuildNumByLvAndType(this.itemId, this.needNum) >= this.buildNum;
        };
        LvUpConditionsBuildInfo.prototype.getIconPath = function () {
            return "icon_build_png";
        };
        LvUpConditionsBuildInfo.prototype.onClickGotoBtn = function () {
            var buildId = MainMapModel.getMaxLimitLvBuildIdByType(this.itemId, this.needNum);
            if (buildId == -1) {
                buildId = MainMapModel.getNotActivaBuildId(this.itemId);
                if (MainMapModel.hasBuild(buildId)) {
                    MainMapModel.clearBuildViewIdStack();
                    //主城界面跳转建筑
                    if (SceneManager.isCityScene()) {
                        com_main.UpManager.close();
                        com_main.MainMap.moveToBuild(buildId);
                    }
                    else {
                        EffectUtils.showTips(GCode(CLEnum.CITY_BD_LOCK1), 1, true);
                    }
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.CITY_BD_NO), 1, true);
                }
                return;
            }
            //只要大殿限制应该用id稳妥
            if (MainMapModel.isInBuilding(buildId)) {
                FunctionModel.openFunctionByType(FunctionType.BUILDING_GRADE_SPEED, buildId);
            }
            else {
                Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, buildId);
            }
        };
        LvUpConditionsBuildInfo.prototype.onUnMatch = function () {
            var tempName = GLan(MainMapModel.getBunildCfgByType(this.itemId).name);
            var desc = tempName + GCode(CLEnum.LEVEL_LESS);
            EffectUtils.showTips(desc, 1, true);
        };
        return LvUpConditionsBuildInfo;
    }(LvUpConditionsBaseInfo));
    com_main.LvUpConditionsBuildInfo = LvUpConditionsBuildInfo;
    //建筑队列类型限制
    var LvUpConditionsBuildQueueInfo = /** @class */ (function (_super_1) {
        __extends(LvUpConditionsBuildQueueInfo, _super_1);
        function LvUpConditionsBuildQueueInfo(id) {
            var _this = _super_1.call(this, id, 0, "") || this;
            _this.btnTip = GCode(CLEnum.GO_SPEED);
            return _this;
        }
        LvUpConditionsBuildQueueInfo.prototype.getDescStr = function () {
            return GCodeFromat(CLEnum.CITY_BD_IN1, GLan(C.BuildingConfig[this.itemId].name));
        };
        LvUpConditionsBuildQueueInfo.prototype.getIsCan = function () {
            return false;
        };
        LvUpConditionsBuildQueueInfo.prototype.getIconPath = function () {
            return "icon_build_png";
        };
        LvUpConditionsBuildQueueInfo.prototype.onUnMatch = function () {
            var desc = GCode(CLEnum.CITY_BD_QUE_MAX);
            EffectUtils.showTips(desc, 1, true);
        };
        LvUpConditionsBuildQueueInfo.prototype.onClickGotoBtn = function () {
            if (!MainMapModel.isInBuilding(this.itemId)) {
                Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, this.itemId);
                return;
            }
            FunctionModel.openFunctionByType(FunctionType.BUILDING_GRADE_SPEED, this.itemId);
        };
        return LvUpConditionsBuildQueueInfo;
    }(LvUpConditionsBaseInfo));
    com_main.LvUpConditionsBuildQueueInfo = LvUpConditionsBuildQueueInfo;
    //君主升级类型限制
    var LvUpConditionsMonarchInfo = /** @class */ (function (_super_1) {
        __extends(LvUpConditionsMonarchInfo, _super_1);
        function LvUpConditionsMonarchInfo(leve) {
            var _this = _super_1.call(this, 0, leve, "") || this;
            _this.btnTip = GCode(CLEnum.GO_LEVEL);
            return _this;
        }
        LvUpConditionsMonarchInfo.prototype.getDescStr = function () {
            var name = GCode(CLEnum.MONACH);
            var desc = "";
            if (RoleData.level < this.needNum) {
                desc = GCodeFromat(CLEnum.LEVEL_NEED_FAL, name, this.needNum);
            }
            else {
                desc = GCodeFromat(CLEnum.LEVEL_NEED, name, this.needNum);
            }
            return desc;
        };
        LvUpConditionsMonarchInfo.prototype.getIsCan = function () {
            return RoleData.level >= this.needNum;
        };
        LvUpConditionsMonarchInfo.prototype.getIconPath = function () {
            return "icon_build_png";
        };
        LvUpConditionsMonarchInfo.prototype.onClickGotoBtn = function () {
            EffectUtils.showTips('通关挂机副本可获得大量君主经验！', 1, true);
        };
        LvUpConditionsMonarchInfo.prototype.onUnMatch = function () {
            EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LEVEL, this.needNum), 1, true);
        };
        return LvUpConditionsMonarchInfo;
    }(LvUpConditionsBaseInfo));
    com_main.LvUpConditionsMonarchInfo = LvUpConditionsMonarchInfo;
    //科技类型限制
    var LvUpConditionsTechnologyInfo = /** @class */ (function (_super_1) {
        __extends(LvUpConditionsTechnologyInfo, _super_1);
        function LvUpConditionsTechnologyInfo(id, needLv) {
            var _this = _super_1.call(this, id, needLv, "") || this;
            _this.btnTip = GCode(CLEnum.GO_LEVEL);
            return _this;
        }
        LvUpConditionsTechnologyInfo.prototype.getDescStr = function () {
            var name = GLan(C.TechnologyConfig[this.itemId].name);
            var techVO = TechnoModel.getTechVoById(this.itemId);
            var desc = "";
            if (techVO.level < this.needNum) {
                desc = GCodeFromat(CLEnum.LEVEL_NEED_FAL, name, this.needNum);
            }
            else {
                desc = GCodeFromat(CLEnum.LEVEL_NEED, name, this.needNum);
            }
            return desc;
        };
        LvUpConditionsTechnologyInfo.prototype.getIsCan = function () {
            var techVO = TechnoModel.getTechVoById(this.itemId);
            var isCan = !techVO || techVO.level >= this.needNum;
            return isCan;
        };
        LvUpConditionsTechnologyInfo.prototype.getIconPath = function () {
            return "Image_tavern_book_png";
        };
        LvUpConditionsTechnologyInfo.prototype.onClickGotoBtn = function () {
            com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this.itemId);
        };
        LvUpConditionsTechnologyInfo.prototype.onUnMatch = function () {
            var desc = GCode(CLEnum.TEC_BE_LESS);
            EffectUtils.showTips(desc, 1, true);
        };
        return LvUpConditionsTechnologyInfo;
    }(LvUpConditionsBaseInfo));
    com_main.LvUpConditionsTechnologyInfo = LvUpConditionsTechnologyInfo;
})(com_main || (com_main = {}));
