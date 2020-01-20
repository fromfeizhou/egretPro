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
    var TechnoInfoWnd = /** @class */ (function (_super_1) {
        __extends(TechnoInfoWnd, _super_1);
        function TechnoInfoWnd(id) {
            var _this = _super_1.call(this) || this;
            _this.name = TechnoInfoWnd.NAME;
            _this.m_nId = id;
            _this.m_tTechVo = TechnoModel.getTechVoById(_this.m_nId);
            _this.initApp("technology/TechnoInfoWndSkin.exml");
            return _this;
        }
        TechnoInfoWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_TECHNOLOGY_UPGRADE,
                ProtoDef.S2C_TECHNOLOGY_INFO,
                ProtoDef.S2C_BUILDING_SPEED,
                ProtoDef.S2C_BUILDING_UPLEVEL,
            ];
        };
        /**处理协议号事件 */
        TechnoInfoWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_SPEED: //建筑加速
                case ProtoDef.S2C_BUILDING_UPLEVEL: //建筑升级
                case ProtoDef.S2C_TECHNOLOGY_INFO:
                case ProtoDef.S2C_TECHNOLOGY_UPGRADE: {
                    this.refreshView();
                    break;
                }
            }
        };
        TechnoInfoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeTimer();
            com_main.EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this);
            com_main.EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventManager.removeEventListeners(this);
        };
        TechnoInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnStudyNow, this, this.onClickStudyNow);
            com_main.EventManager.addTouchScaleListener(this.m_btnStudy, this, this.onClickStudy);
            com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this.onInfoWndSwitch, this);
            com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);
            /**资源更新 */
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            this.m_tcollection = new eui.ArrayCollection([]);
            this.m_pList.itemRenderer = com_main.com_levelup_conditions_cell;
            this.m_pList.dataProvider = this.m_tcollection;
            this.refreshView();
        };
        /**资源更新 */
        TechnoInfoWnd.prototype.onRoleResource = function () {
            var lvCfg = TechnoModel.getTechnoLvCfg(this.m_nId, this.m_tTechVo.level);
            if (!lvCfg)
                return;
            this.refreshCostView(lvCfg);
        };
        /**切换 */
        TechnoInfoWnd.prototype.onInfoWndSwitch = function (id) {
            if (this.m_nId == id)
                return;
            this.m_nId = id;
            this.m_tTechVo = TechnoModel.getTechVoById(this.m_nId);
            this.refreshView();
        };
        /**升级 */
        TechnoInfoWnd.prototype.onTechnoTimeUp = function (id) {
            if (this.m_nId == id) {
                this.refreshView();
            }
        };
        /**刷新显示 */
        TechnoInfoWnd.prototype.refreshView = function () {
            if (!this.m_tTechVo)
                return;
            this.m_tTechVo = TechnoModel.getTechVoById(this.m_nId);
            this.m_tTechVo.init();
            this.removeTimer();
            if (TechnoModel.isInUpLv(this.m_nId)) {
                this.currentState = 'inSpeed';
                this.m_btnStudy.setTitleLabel(GCode(CLEnum.SPEED_AD));
                this.startTimer();
            }
            else {
                if (this.m_tTechVo.level >= this.m_tTechVo.maxLevel) {
                    this.currentState = 'max';
                }
                else {
                    this.currentState = 'base';
                }
                this.m_btnStudy.setTitleLabel(GCode(CLEnum.TEC_UP_START));
            }
            var cfg = this.m_tTechVo.techCfg;
            this.m_technoCell.technoId = this.m_nId;
            this.m_technoCell.removeRed();
            this.m_pPopUp.setTitleLabel(GLan(cfg.name));
            // this.m_labCurLv.text = this.m_tTechVo.level + '';
            // this.m_labNextLv.text = (this.m_tTechVo.level + 1) + '';
            //上一等级增强效果
            this.m_labCurDesc.text = this.m_tTechVo.techLvlCfg.Desc + "";
            var strs = this.m_tTechVo.techLvlCfg.effect.split("_");
            // if (strs.length <= 1) {
            //     this.m_labCurLv.text = ``;
            // } else {
            //     let val = strs[1];
            //     this.m_labCurLv.text = ``;
            //     // this.m_labCurLv.text = this.m_tTechVo.techEffCfg.valType ? `${parseInt(val) / 100}%` : `${val}`;
            // }
            // this.m_labCurLv.x = this.m_labCurDesc.x + this.m_labCurDesc.width + 10;
            //下一等级增强效果
            // this.m_labNextDesc.x = this.m_labCurLv.x + this.m_labCurLv.width + 50;
            var nextTechCfg = C.TechnologyConfig[this.m_tTechVo.techCfg.id];
            var nextTechLvlCfg = TechnoModel.getTechnoLvCfg(this.m_tTechVo.id, this.m_tTechVo.level + 1);
            var nextTechEffCfg = C.TechnologyEffectConfig[this.m_tTechVo.techCfg.id];
            if (isNull(nextTechLvlCfg) || isNull(nextTechEffCfg) || !nextTechLvlCfg.level || nextTechLvlCfg.level == 0 || this.m_tTechVo.level == this.m_tTechVo.maxLevel) {
                this.m_labNextDesc.text = GCode(CLEnum.TEC_LEVEL_MAX);
                // this.m_labNextLv.text = ``;
            }
            else {
                this.m_labNextDesc.text = nextTechLvlCfg.Desc + "";
                var strs2 = nextTechLvlCfg.effect.split("_");
                // if (strs2.length <= 1) {
                //     this.m_labNextLv.text = ``;
                // } else {
                //     let val2 = strs2[1];
                //     this.m_labNextLv.text = ``;
                //     // this.m_labNextLv.text = nextTechEffCfg.valType ? `${parseInt(val2) / 100}%` : `${val2}`;
                // }
                // this.m_labNextLv.x = this.m_labNextDesc.x + this.m_labNextDesc.width + 10;
            }
            var lvCfg = TechnoModel.getTechnoLvCfg(this.m_nId, this.m_tTechVo.level);
            if (!lvCfg)
                return;
            this.m_labPower.text = lvCfg.power + '';
            // this.m_labDec.text = TechnoModel.getTechnoEffDesc(lvCfg.effect);
            this.m_labDec.text = this.m_tTechVo.techEffCfg.effectDesc;
            var vipLineCfg = C.VipPrivillegesConfig[VipPrivillType.TECHNOLOGY_TIME_REDUCTION];
            var offLine = Number(vipLineCfg['vip' + RoleData.vipLevel]);
            var technoTime = lvCfg.duration - offLine * 60;
            this.m_btnStudyNow.setCostLabel(Utils.TimeGold(technoTime) != 0 ? Utils.TimeGold(technoTime).toString() : GCode(CLEnum.AC_FREE));
            this.m_btnStudyNow.setTitleLabel(GCode(CLEnum.TEC_UP_NOW));
            this.m_btnStudyNow.setCostImg('icon_source_gold_png');
            this.m_btnStudy.setCostLabel(Utils.DateUtils.getFormatBySecond(technoTime, 1));
            this.m_btnStudy.setCostImg('icon_time_png');
            this.refreshCostView(lvCfg);
        };
        // /**重新刷新 */
        // public onRefresh(body?): void {
        //     this.refreshView();
        // }
        /**刷新材料显示 */
        TechnoInfoWnd.prototype.refreshCostView = function (lvCfg) {
            if (this.m_tTechVo.isMaxLevel()) {
                this.m_tcollection.replaceAll([]);
            }
            else {
                var datas = [];
                //等级限制
                if (lvCfg.limitLv > 0)
                    datas.push(new com_main.LvUpConditionsBuildInfo(BuildingType.MINISTRY_DEFENCE, lvCfg.limitLv));
                //前置条件 
                var limits = StringUtils.keyValsToNumberArray(lvCfg.limitTechs);
                for (var i = 0; i < limits.length; i++) {
                    datas.push(new com_main.LvUpConditionsTechnologyInfo(limits[i].key, limits[i].value));
                }
                //材料
                var itemCosts = Utils.parseCommonItemJson(lvCfg.consume);
                if (itemCosts) {
                    for (var i = 0; i < itemCosts.length; i++) {
                        datas.push(new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count));
                    }
                }
                this.m_tcollection.replaceAll(datas);
            }
        };
        TechnoInfoWnd.prototype.startTimer = function () {
            this.removeTimer();
            this.m_tTimeData = TechnoModel.getTimeData();
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
            this.timeCallback();
        };
        TechnoInfoWnd.prototype.removeTimer = function () {
            Utils.TimerManager.remove(this.timeCallback, this);
        };
        TechnoInfoWnd.prototype.timeCallback = function () {
            var time = (this.m_tTimeData.end - this.m_tTimeData.speed) - TimerUtils.getServerTime();
            if (time > 0) {
                this.m_btnStudyNow.setCostLabel(Utils.TimeGold(time) + '');
                this.m_btnStudy.setCostLabel(Utils.DateUtils.getFormatBySecond(time, 1));
            }
            else {
                this.removeTimer();
            }
        };
        TechnoInfoWnd.prototype.onClickClosebtn = function () {
            com_main.UpManager.history();
        };
        TechnoInfoWnd.prototype.onClickStudyNow = function () {
            if (!this.commonUpLvCheck())
                return;
            var goldCost = Number(this.m_btnStudyNow.getCostLabel());
            if (PropModel.isItemEnough(PropEnum.GOLD, goldCost, 1)) {
                TechnologyProxy.C2S_TECHNOLOGY_UPGRADE(this.m_nId, true);
            }
        };
        TechnoInfoWnd.prototype.onClickStudy = function () {
            //当前科技升级
            if (TechnoModel.isInUpLv(this.m_nId)) {
                Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                    propSpeedType: PropSpeedType.Technology, targetId: this.m_nId,
                    startTime: this.m_tTimeData.start,
                    endTime: this.m_tTimeData.end,
                    speedUpTime: this.m_tTimeData.speed
                });
                return;
            }
            if (!this.commonUpLvCheck())
                return;
            TechnologyProxy.C2S_TECHNOLOGY_UPGRADE(this.m_nId, false);
        };
        /**通用检查 */
        TechnoInfoWnd.prototype.commonUpLvCheck = function () {
            if (TechnoModel.isInLevelCd()) {
                EffectUtils.showTips(GCode(CLEnum.TEC_UP_FAL), 1, true);
                return false;
            }
            for (var i = 0; i < this.m_tcollection.length; i++) {
                var data = this.m_tcollection.getItemAt(i);
                if (!data.IsMatch)
                    return false;
            }
            return true;
        };
        TechnoInfoWnd.NAME = 'TechnoInfoWnd';
        return TechnoInfoWnd;
    }(com_main.CView));
    com_main.TechnoInfoWnd = TechnoInfoWnd;
})(com_main || (com_main = {}));
