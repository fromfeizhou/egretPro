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
     * 世界地图菜单基类
     * @export
     * @class WorldMenuComponent
     * @extends CComponent
     */
    var WorldMenuComponent = /** @class */ (function (_super_1) {
        __extends(WorldMenuComponent, _super_1);
        function WorldMenuComponent() {
            var _this = _super_1.call(this) || this;
            _this.m_nOrginY = 0;
            return _this;
        }
        WorldMenuComponent.prototype.hitPoint = function (x, y) { return false; };
        WorldMenuComponent.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.setBgTween(true);
            AnchorUtil.setAnchorCenter(this);
        };
        WorldMenuComponent.prototype.setBgTween = function (isShow) {
            var _this = this;
            if (!this.m_pBg)
                return;
            egret.Tween.removeTweens(this.m_pBg);
            if (isShow) {
                this.m_pBg.alpha = 0;
                this.m_pGInfo.visible = false;
                egret.Tween.get(this.m_pBg).to({ alpha: 1 }, 300).call(function () {
                    if (_this.m_pGInfo)
                        _this.m_pGInfo.visible = true;
                });
            }
            else {
                egret.Tween.get(this.m_pBg).to({ alpha: 0 }, 500);
                this.m_pGInfo.visible = false;
            }
        };
        WorldMenuComponent.prototype.removeFromParent = function (btn) {
            this.name = '';
            this.setBgTween(false);
            this.hideBtnTween(btn);
            Utils.TimerManager.doTimer(300, 1, _super_1.prototype.removeFromParent, this);
        };
        WorldMenuComponent.prototype.showBtnTween = function (btn, point) {
            for (var i in btn) {
                var o = btn[i];
                if (o) {
                    NodeUtils.setPosAndScale(o, 202, this.m_nOrginY, 0);
                    var _a = point[i], x = _a[0], y = _a[1];
                    var scaleX = 1, scaleY = 1;
                    egret.Tween.get(o).to({ x: x, y: y, scaleX: scaleX, scaleY: scaleY }, 300);
                }
            }
        };
        WorldMenuComponent.prototype.hideBtnTween = function (btn) {
            if (btn === void 0) { btn = []; }
            for (var i in btn) {
                var o = btn[i];
                var x = 202, y = this.m_nOrginY, scaleX = 0, scaleY = 0;
                egret.Tween.get(o).to({ x: x, y: y, scaleX: scaleX, scaleY: scaleY }, 300);
            }
        };
        WorldMenuComponent.prototype.initBtn = function (btn) {
            for (var i in btn) {
                var o = btn[i];
                NodeUtils.setPosAndScale(o, 202, 0, 0);
            }
        };
        return WorldMenuComponent;
    }(com_main.CView));
    com_main.WorldMenuComponent = WorldMenuComponent;
    /**
     * 城市菜单
     * @export
     * @class WorldMenuWidget
     * @extends WorldMenuComponent
     */
    var WorldMenuWidget = /** @class */ (function (_super_1) {
        __extends(WorldMenuWidget, _super_1);
        function WorldMenuWidget(conf) {
            var _this = _super_1.call(this) || this;
            _this.teamVoList = [];
            _this.name = "WorldMenu";
            _this.m_pConfig = conf;
            _this.reduceTimePercent = 0;
            _this.defaultTime = 0;
            _this.initApp("world/world_menu_widget.exml");
            _this.cacheAsBitmap = true;
            return _this;
        }
        Object.defineProperty(WorldMenuWidget.prototype, "config", {
            get: function () {
                return this.m_pConfig;
            },
            enumerable: true,
            configurable: true
        });
        WorldMenuWidget.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CITY_MADE_INFO,
            ];
        };
        WorldMenuWidget.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_MADE_INFO: {
                    this.addCityBuff();
                    break;
                }
            }
        };
        WorldMenuWidget.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            com_main.WorldView.callFunc(9 /* SET_CITYNAME_STATUS */, this.m_pConfig.id);
            com_main.EventManager.removeEventListener(this.m_pBtnGo);
            com_main.EventManager.removeEventListener(this.m_pBtnVisit);
            com_main.EventManager.removeEventListener(this.m_pBtnInfo);
            com_main.EventManager.removeEventListener(this.m_pBtnAttack);
            com_main.EventManager.removeEventListener(this.m_pBtnTruce);
            com_main.EventManager.removeEventListener(this.m_pBtnBuild);
            this.m_pConfig = null;
            this.reduceTimePercent = 0;
            this.defaultTime = 0;
            _super_1.prototype.$onRemoveFromStage.call(this);
            // SceneResGroupCfg.clearModelRes([ModuleEnums.CITY_BUILD_BUFF]);
        };
        WorldMenuWidget.prototype.childrenCreated = function () {
            var _this = this;
            // this.m_pBtnTroop.x = 255;
            this.setStatus();
            _super_1.prototype.childrenCreated.call(this);
            this.m_comState.setDefautName(GCode(CLEnum.STATE_ZL), 18);
            // this.updateVisitBtnShow();
            // EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onInfoClick);
            // EventManager.addTouchScaleListener(this.m_pBtnVisit, this, this.onVisitClick);
            // EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.onGoClick);
            // EventManager.addTouchScaleListener(this.m_pBtnAttack, this, this.onAttackClick);
            // EventManager.addTouchScaleListener(this.m_pBtnTruce, this, this.onTruceClick);
            this.m_labName.text = GLan(this.m_pConfig.name);
            this.m_labType.text = GCodeFromat(CLEnum.LEVEL1, this.m_pConfig.initCityLv) + " " + WorldModel.getCityTypeName(this.m_pConfig.level);
            this.m_pTitle.text = this.m_pConfig.mapId == SceneEnums.WORLD_XIANGYANG_CITY && this.m_pConfig.type !== CityType.XIANG_BIRTH ? "怪物部队" : "税收奖励";
            if (this.m_pConfig.reward || this.m_pConfig.type == CityType.XIANG_BIRTH) {
                var awardStr = this.m_pConfig.reward;
                if (this.m_pConfig.reward == "") {
                    awardStr = C.WorldMapConfig[this.m_pConfig.mapCity].reward;
                }
                var award = Utils.parseCommonItemJson(awardStr);
                for (var _i = 0, award_1 = award; _i < award_1.length; _i++) {
                    var info = award_1[_i];
                    var item = com_main.ComItemNew.create('count');
                    this.m_pGScroller.addChild(item);
                    item.scaleX = 0.75;
                    item.scaleY = 0.75;
                    item.setItemInfo(info.itemId, info.count);
                }
            }
            if (this.m_pConfig.type !== CityType.XIANG_BIRTH && SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                this.m_pGScroller.removeChildren();
                var awardStr = ConstUtil.getString(IConstEnum.XIANGYANG_MONSTER);
                var heroInfos = JSON.parse(awardStr);
                for (var i = 0; i < heroInfos.length; i++) {
                    var item = com_main.GeneralHeadRender.create("arena");
                    var info = heroInfos[i];
                    var id = parseInt(info[0]);
                    var starNum = info[1];
                    var level = info[2];
                    item.scaleX = 0.6;
                    item.scaleY = 0.6;
                    item.setGenViewInfo(id, level, starNum);
                    this.m_pGScroller.addChild(item);
                }
            }
            var config = WorldModel.getCityBuildInfo(this.m_pConfig.id);
            if (config.prefect != '') {
                this.m_labLeader.text = GCodeFromat(CLEnum.WOR_PRE_NAME, config.prefect);
            }
            else {
                this.m_labLeader.text = GCode(CLEnum.WOR_PRE_NONE);
            }
            this.m_comState.stateId = config.country;
            this.m_labNpcLv.text = "" + this.m_pConfig.initCityLv;
            this.m_labNpcNum.text = "" + config.npcGarrisonCount;
            this.m_labPlayreNum.text = "" + config.playerGarrisonCount;
            // this.teamVoList = TeamModel.getTeamVoListByCityId(config.id);
            // let len: number = this.teamVoList.length;
            // this.m_pBtnTroop.visible = len > 0;
            // this.m_pBtnVisit.x = this.m_pBtnTroop.visible ? 155 : 202;
            // 每分钟恢复时间 180,60,100
            var nValue = ConstUtil.getNumArray(IConstEnum.CITY_RECOVERY_FORCE);
            this.defaultTime = nValue[0] ? nValue[0] : 180;
            var nMinute2 = (this.defaultTime / 60).toFixed(1); //分
            this.m_desc.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TROOP_TIPS, nMinute2, 1));
            egret.callLater(function () {
                if (_this.m_pConfig) {
                    _this.validateNow();
                    var arrPoint = [], arr = [_this.m_pBtnInfo, _this.m_pBtnVisit, _this.m_pBtnGo, _this.m_pBtnAttack, _this.m_pBtnTruce, _this.m_pBtnTroop, _this.m_pBtnBuild];
                    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                        var o = arr_1[_i];
                        if (o) {
                            arrPoint.push([o.x, o.y]);
                        }
                    }
                    _this.showBtnTween(arr, arrPoint);
                }
            }, this);
            RedPointModel.AddInfoListener(this.m_pBtnBuild, { x: 50, y: -5 }, [RedEvtType.WORLD_CITY_BUILD], 2, { cityId: this.m_pConfig.id });
            // this.addCityBuff();
            CityBuildProxy.C2S_CITY_MADE_INFO(this.m_pConfig.id);
        };
        /**是否显示拜访图标 */
        WorldMenuWidget.prototype.updateVisitBtnShow = function () {
            var pInfo = WorldModel.getCityBuildInfo(this.config.id);
            return !WorldModel.checkIsHasLock(this.config.id) && !WorldModel.checkIsHasFirstAward(this.config.id) && pInfo.status != 1;
        };
        WorldMenuWidget.prototype.setStatus = function () {
            var conf = WorldModel.getCityBuildInfo(this.m_pConfig.id), event = WorldModel.getVisitEventById(this.m_pConfig.id), bEmptyEvt = !event, bEnemy = !conf || conf.country != RoleData.countryId;
            this.teamVoList = TeamModel.getTeamVoListByCityId(conf.id);
            var len = this.teamVoList.length;
            var ids = [101, 102, 103, 104, 105, 106, 107, 108];
            var notXY = ids.indexOf(this.m_pConfig.id) == -1;
            // 建设按钮显示
            this.m_pBtnBuild.visible = WorldModel.isOwnerCity(conf.id) && notXY;
            var isVisit = this.updateVisitBtnShow();
            this.m_pBtnVisit.visible = !bEmptyEvt && isVisit;
            this.m_pBtnTroop.visible = len > 0;
            if (bEnemy && bEmptyEvt) {
                var s = 'info';
                // if (this.m_pConfig.forbidattack) {
                //     let [d1, d2] = JSON.parse(this.m_pConfig.forbidattack);
                //     let [s1, e1]:[string, string] = d1.split('~'), [s2, e2]:[string, string] = d2.split('~')
                //     let now = TimerUtils.dateFormat("hh:mm:ss", TimerUtils.getServerTime());
                //     let b = ( now >= s1 && now <= e1 ) ||  ( now >= s2 && now <= e2 );
                //     if (b)
                //         s = 'truce'
                // }
                this.currentState = s;
            }
            else if (bEnemy && !bEmptyEvt) {
                this.currentState = 'info-visit';
            }
            else if (!bEnemy && bEmptyEvt && len > 0) {
                this.currentState = 'info-go';
                this.m_pBtnTroop.x = this.m_pBtnBuild.visible ? 255 : 202;
            }
            else {
                if (this.m_pBtnTroop.visible && this.m_pBtnVisit.visible) {
                    this.currentState = 'base';
                }
                else if (this.m_pBtnTroop.visible && !this.m_pBtnVisit.visible) {
                    this.currentState = 'info-go';
                    this.m_pBtnTroop.x = this.m_pBtnBuild.visible ? 255 : 202;
                }
                else if (!this.m_pBtnTroop.visible && this.m_pBtnVisit.visible) {
                    this.currentState = 'city-visit';
                }
                else {
                    this.currentState = 'info-city';
                }
            }
        };
        WorldMenuWidget.prototype.onInfoClick = function () {
            // Utils.open_view(TASK_UI.POP_WORLD_CITY_INFO_PANEL, { conf: this.m_pConfig });
            var conf = C.WorldMapConfig[this.m_pConfig.id];
            var cityId = conf.type == CityType.XIANG_BIRTH ? conf.mapCity : this.m_pConfig.id;
            WorldProxy.C2S_CITY_ITEM_INFO(cityId);
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onVisitClick = function () {
            Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.m_pConfig.id });
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onGoClick = function () {
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                var curTime = TimerUtils.getServerTimeMill();
                if (curTime <= vo.openDate) {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_FIGHT_TIPS), 1, true);
                    return;
                }
                var stopTime = ConstUtil.getValue(IConstEnum.XIANGYANG_STOP_TIME);
                var subTime = Math.floor((vo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                if (subTime <= stopTime) {
                    EffectUtils.showTips("战斗即将结束不能派军", 1, true);
                    return;
                }
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_PANEL, this.m_pConfig.id);
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onAttackClick = function () {
            if (this.m_pConfig.type == CityType.BIRTH) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL5));
                return;
            }
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                var curTime = TimerUtils.getServerTimeMill();
                if (curTime <= vo.openDate) {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_FIGHT_TIPS), 1, true);
                    return;
                }
            }
            if (RoleData.level < this.config.AtackCityLv) {
                EffectUtils.showTips('您当前攻打的为高级城池，守军强大！');
            }
            if (this.config.citySkill != '') {
                var citySkillArr = this.m_pConfig.citySkill.split("_");
                var countryId = Number(citySkillArr[0]);
                var name_1 = Utils.getCountryName(countryId);
                EffectUtils.showTips(name_1 + "\u56FD\u6838\u5FC3\u57CE\u6C60\uFF0C" + name_1 + "\u56FD\u73A9\u5BB6\u5BF9\u6297\u6709\u5927\u5E45\u52A0\u6210\uFF01");
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_PANEL, this.m_pConfig.id);
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onTroopClick = function () {
            if (this.teamVoList.length == 0)
                return;
            Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.teamVoList[0].order });
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onBuildClick = function () {
            // CityBuildProxy.C2S_CITY_MADE_INFO(this.m_pConfig.id);
            Utils.open_view(TASK_UI.POP_WORLD_CITY_BUILDING, this.m_pConfig.id);
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
        };
        WorldMenuWidget.prototype.onLeftClick = function () {
            var gpWidth = this.m_pCityBuff.contentWidth;
            var scWidth = this.m_scCityBuff.width;
            var scH = this.m_pCityBuff.scrollH;
            if (scH >= scWidth) {
                this.m_pCityBuff.scrollH = scH - scWidth;
                this.resetArrowState();
            }
        };
        WorldMenuWidget.prototype.onRightClick = function () {
            var gpWidth = this.m_pCityBuff.contentWidth;
            var scWidth = this.m_scCityBuff.width;
            var scH = this.m_pCityBuff.scrollH;
            if (gpWidth > scH + scWidth) {
                this.m_pCityBuff.scrollH = scH + scWidth;
                this.resetArrowState();
            }
        };
        WorldMenuWidget.prototype.resetArrowState = function () {
            this.m_scCityBuff.validateNow();
            var gpWidth = this.m_pCityBuff.contentWidth;
            var scWidth = this.m_scCityBuff.width;
            var scH = this.m_pCityBuff.scrollH;
            this.m_btnLeft.visible = scH <= 0 ? false : true;
            this.m_btnRight.visible = scH + scWidth > gpWidth ? false : true;
        };
        WorldMenuWidget.prototype.onTruceClick = function () {
            EffectUtils.showTips(GCode(CLEnum.WOR_BD_BHTS));
        };
        WorldMenuWidget.prototype.hitPoint = function (x, y) {
            if (this.m_pBtnInfo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onInfoClick();
            }
            if (this.m_pBtnVisit.hitTestPoint(x, y) && this.m_pBtnVisit.visible) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onVisitClick();
            }
            if (this.m_pBtnGo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onGoClick();
            }
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onAttackClick();
            }
            if (this.m_pBtnTruce.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onTruceClick();
            }
            if (this.m_pBtnTroop.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onTroopClick();
            }
            if (this.m_pBtnBuild.hitTestPoint(x, y) && this.m_pBtnBuild.visible) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onBuildClick();
            }
            if (this.m_btnLeft.hitTestPoint(x, y) && this.m_btnLeft.visible) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onLeftClick();
            }
            if (this.m_btnRight.hitTestPoint(x, y) && this.m_btnRight.visible) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onRightClick();
            }
            return this.m_pBtnGo.hitTestPoint(x, y) || this.m_pMenu.hitTestPoint(x, y) || this.m_pBtnAttack.hitTestPoint(x, y)
                || this.m_pBtnInfo.hitTestPoint(x, y)
                || this.m_pBtnVisit.hitTestPoint(x, y) || this.m_imgBg.hitTestPoint(x, y) /*|| this.m_pGInfo.hitTestPoint(x, y)*/
                || this.m_pBtnTruce.hitTestPoint(x, y) || this.m_pBtnTroop.hitTestPoint(x, y)
                || this.m_pBtnBuild.hitTestPoint(x, y) || this.m_btnLeft.hitTestPoint(x, y) || this.m_btnRight.hitTestPoint(x, y);
        };
        WorldMenuWidget.prototype.removeFromParent = function () {
            _super_1.prototype.removeFromParent.call(this, [this.m_pBtnInfo, this.m_pBtnVisit, this.m_pBtnGo, this.m_pBtnAttack, this.m_pBtnTruce, this.m_pBtnTroop, this.m_pBtnBuild]);
        };
        WorldMenuWidget.prototype.addCityBuff = function () {
            this.m_pCityBuff.removeChildren();
            var strList = CityBuildModel.getCityPrivilege(this.m_pConfig.id);
            var cvo = CityBuildModel.getCityInfo(this.m_pConfig.id);
            if (strList.length == 0)
                error("CityMadeConfig cityId not exist!");
            for (var i in strList) {
                var str = strList[i];
                var strC = str.tc;
                var comp_1 = new com_main.CityBuffCell();
                comp_1.setIcon(strC.icon + "_png", !str.isActive);
                comp_1.setName(strC.nameBuff);
                comp_1.scaleX = comp_1.scaleY = 0.7;
                this.m_pCityBuff.addChild(comp_1);
            }
            // NPC驻军恢复时间
            this.reduceTimePercent = CityBuildModel.getCityPrivilegeValues(this.m_pConfig.id, CityRewardType.NPC_REGAIN);
            this.defaultTime = this.defaultTime * (1 - this.reduceTimePercent / 10000);
            var nMinute2 = (this.defaultTime / 60).toFixed(1);
            this.m_desc.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TROOP_TIPS, nMinute2, 1));
            // 驻军等级
            this.m_labNpcLv.text = CityBuildModel.npcLevel + "";
            this.resetArrowState();
            //城池buff
            if (isNull(this.m_pConfig.citySkill) || this.m_pConfig.citySkill == "")
                return;
            var citySkillArr = this.m_pConfig.citySkill.split("_");
            if (citySkillArr.length == 0)
                return;
            // let countryId = Number(citySkillArr[0]);
            // if(countryId != WorldModel.getCityBuildInfo(this.m_pConfig.id).country) return;
            var comp = new com_main.CityBuffCell();
            comp.setIcon(GeneralModel.getSkillIcon(Number(citySkillArr[1])), false);
            var skill = C.SkillConfig[Number(citySkillArr[1])];
            comp.setName(skill.name);
            comp.scaleX = comp.scaleY = 0.7;
            this.m_pCityBuff.addChildAt(comp, 0);
        };
        return WorldMenuWidget;
    }(WorldMenuComponent));
    com_main.WorldMenuWidget = WorldMenuWidget;
})(com_main || (com_main = {}));
