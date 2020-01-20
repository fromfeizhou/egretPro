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
    var BattleTopBlood = /** @class */ (function (_super_1) {
        __extends(BattleTopBlood, _super_1);
        function BattleTopBlood() {
            var _this = _super_1.call(this) || this;
            _this.surplusTime = 0;
            _this.skinName = Utils.getAppSkin("battle_new/top_new/battle_top_all_blood.exml");
            return _this;
        }
        BattleTopBlood.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
            this.removeEvent();
        };
        BattleTopBlood.prototype.init = function () {
            this.refreshPlayerName();
            this.refreshDebuff();
            this.refreshBloodPro();
            this.surplusTime = 120 * 1000;
            this.lb_time.text = '02:00';
            this.lb_act_blood.visible = true;
            this.lb_def_blood.visible = true;
            if (BattleModel.isCityWar()) {
                this.lb_att_team.visible = true;
                this.lb_def_team.visible = true;
            }
            else {
                this.lb_att_team.visible = false;
                this.lb_def_team.visible = false;
            }
            this.refreshCityItemCount();
            this.addEvent();
        };
        BattleTopBlood.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        BattleTopBlood.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.defGroup, this, this.showDebuffDef);
            com_main.EventManager.addTouchTapListener(this.atkGroup, this, this.showDebuffAtk);
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_OVER, this.refreshBloodPro, this);
            this.defGroup.touchThrough = false;
            this.atkGroup.touchThrough = false;
        };
        BattleTopBlood.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_OVER, this);
        };
        BattleTopBlood.prototype.refreshPlayerName = function () {
            this.lb_act_name.text = BattleModel.getPlayerName(FactionType.ATK);
            this.lb_def_name.text = BattleModel.getPlayerName(FactionType.DEF);
        };
        BattleTopBlood.prototype.refreshBloodPro = function () {
            if (!BattleModel.getJoinedBattleId()) {
                this.lb_act_blood.visible = false;
                this.boold_1.width = 313;
                this.lb_def_blood.visible = false;
                this.boold_2.width = 0;
                return;
            }
            var atkAllMaxBlood = BattleModel.getAtkAllMaxBlood();
            var atkAllBlood = BattleModel.getAtkAllBlood();
            var defAllMaxBlood = BattleModel.getDefAllMaxBlood();
            var defAllBlood = BattleModel.getDefAllBloodd();
            // console.log('获取到的血量 攻防',atkAllBlood,defAllBlood);
            this.lb_act_blood.text = CommonUtils.numOutLenght2(atkAllBlood) + "/" + CommonUtils.numOutLenght2(atkAllMaxBlood); //左边血量
            this.lb_def_blood.text = CommonUtils.numOutLenght2(defAllBlood) + "/" + CommonUtils.numOutLenght2(defAllMaxBlood); //右边血量
            this.boold_1.width = 313 * (Math.min(1, atkAllBlood / atkAllMaxBlood));
            this.boold_2.width = 313 * (Math.min(1, defAllBlood / defAllMaxBlood));
        };
        BattleTopBlood.prototype.refreshBattleTime = function (delta) {
            this.refreshBloodPro();
            var battleInfo = BattleModel.getJoinedBattleInfo();
            if (!battleInfo || !battleInfo.warContinueTime && !BattleModel.isCityWar()) {
                return;
            }
            var endTime = battleInfo.endTime;
            var mill = endTime - TimerUtils.getServerTimeMill();
            if (mill < 0) {
                mill = 0;
            }
            var time = Utils.changeSecondToDay(Math.floor(mill / 1000));
            this.lb_time.text = time;
        };
        BattleTopBlood.prototype.refreshCityItemCount = function () {
            var data = WorldModel.getCityWarInfo();
            if (data) {
                this.lb_att_team.text = data.atkTeamCount + '队';
                this.lb_def_team.text = data.defTeamCount + '队';
            }
        };
        BattleTopBlood.prototype.refreshDebuff = function () {
            this.m_debuffInfo.visible = false;
            var battleInfo = BattleModel.getJoinedBattleInfo();
            if (battleInfo.atkArrogance && battleInfo.atkArrogance.arrogance) {
                this.atkGroup.visible = true;
                this.atk_lbArrogance.text = battleInfo.atkArrogance.arrogance.toString();
            }
            else {
                this.atkGroup.visible = false;
            }
            if (battleInfo.defArrogance && battleInfo.defArrogance.arrogance) {
                this.defGroup.visible = true;
                this.def_lbArrogance.text = battleInfo.defArrogance.arrogance.toString();
            }
            else {
                this.defGroup.visible = false;
            }
        };
        BattleTopBlood.prototype.showDebuffDef = function () {
            this.m_debuffInfo.visible = true;
            this.m_debuffInfo.x = 373;
            this.m_debuffInfo.y = 99;
            var battleInfo = BattleModel.getJoinedBattleInfo();
            if (battleInfo.defArrogance && battleInfo.defArrogance.arrogance) {
                this.m_debuffInfo.refreshView(battleInfo.defArrogance.arrogance);
            }
        };
        BattleTopBlood.prototype.showDebuffAtk = function () {
            this.m_debuffInfo.visible = true;
            this.m_debuffInfo.x = 165;
            this.m_debuffInfo.y = 99;
            var battleInfo = BattleModel.getJoinedBattleInfo();
            if (battleInfo.atkArrogance && battleInfo.atkArrogance.arrogance) {
                this.m_debuffInfo.refreshView(battleInfo.atkArrogance.arrogance);
            }
        };
        BattleTopBlood.prototype.hideDebuffInfo = function () {
            this.m_debuffInfo.visible = false;
        };
        return BattleTopBlood;
    }(com_main.CComponent));
    com_main.BattleTopBlood = BattleTopBlood;
})(com_main || (com_main = {}));
