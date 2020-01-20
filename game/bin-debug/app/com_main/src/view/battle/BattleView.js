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
    var BattleView = /** @class */ (function (_super_1) {
        __extends(BattleView, _super_1);
        function BattleView() {
            var _this = _super_1.call(this) || this;
            _this.isSiegeQueue = false; //攻城战等待地图
            _this.name = "BattleView";
            _this.initApp("battle_new/top_new/battle_view.exml");
            return _this;
        }
        BattleView.getInstance = function () {
            if (!BattleView._instance) {
                BattleView._instance = new BattleView();
            }
            return BattleView._instance;
        };
        BattleView.prototype.setData = function (isSiegeQueue) {
            this.isSiegeQueue = isSiegeQueue;
            this.visible = true;
            if (this.isInit) {
                this.onCreate();
                this.armyList.initData();
            }
        };
        BattleView.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        BattleView.prototype.onCreate = function () {
            this.isInit = true; //初始化完成
            this.initEvent();
            //攻城战不需要注册事件
            if (this.isSiegeQueue) {
                return;
            }
            this.width = AGame.R.app.stageWidth;
            this.generalList.refreshGeneralList();
            this.changePlayerStatus();
            this.isStart = false;
            if (!DEBUG) {
                this.tiaoshi.visible = false;
            }
            if ((BattleModel.isCityWar() || BattleModel.getCheckPointType() == CheckPointType.FIGHT_WILD) || this.isSiegeQueue) {
                this.btn_back.visible = true;
                this.lb_auto.visible = false;
                this.img_auto.visible = false;
            }
            else {
                this.btn_back.visible = false;
                this.lb_auto.visible = true;
                this.img_auto.visible = true;
            }
            if (BattleModel.m_isGuideBattle) {
                this.visible = false;
            }
            this.topBlood.init();
        };
        BattleView.prototype.changeBattleMap = function () {
            this.generalList.refreshGeneralList();
            this.topBlood.refreshPlayerName();
            this.topBlood.refreshBloodPro();
        };
        BattleView.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_ENTER, this.battleEnter, this);
            com_main.EventManager.addTouchScaleListener(this.btn_battleInfo, this, this.onClickBattleInfo);
            com_main.EventManager.addTouchScaleListener(this.btn_rank, this, this.onClickRankBtn);
            com_main.EventManager.addTouchScaleListener(this.btn_back, this, this.onClickBackBtn);
            Utils.TimerManager.doFrame(30, 0, this.countdownFlame, this);
            Utils.TimerManager.doFrame(15, 0, this.onEnterFrame, this);
            com_main.EventManager.addTouchScaleListener(this.btn_auto_battle, this, this.onClickAuto); //自动战斗
            com_main.EventManager.addTouchScaleListener(this.btn_jump, this, this.onClickJump); //跳过
            com_main.EventManager.addTouchScaleListener(this.tiaoshi, this, this.onClickTiaoshi); //调试
            // EventManager.addTouchTapListener(this, this, this.onClick); //调试
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_BLOOD_CHANGE, this.changeTopBlood, this);
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, this.changePlayerStatus, this);
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, this.playGeneralDie, this);
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_CHANGE_MAP, this.changeBattleMap, this);
            com_main.EventMgr.addEvent(BattleEvent.CITY_ITEM_COUNT_UPDATE, this.cityItemCountUpdate, this);
        };
        BattleView.prototype.removeEvent = function () {
            // Utils.removeFromParent(this);
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.onEnterFrame, this);
            Utils.TimerManager.remove(this.countdownFlame, this);
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_ENTER, this);
            // EventMgr.removeEventByObject(BattleEvent.BATTLE_UNIT_ATTR_CHANGE, this.attrChange);
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_BLOOD_CHANGE, this);
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, this);
            // EventMgr.removeEventByObject(BattleEvent.BATTLE_GENERAL_USE_SKILL, this);
            // EventMgr.removeEventByObject(GuideEvent.GUIDE_START_BATTLE, this);//新手战斗开始
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, this);
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_CHANGE_MAP, this);
            com_main.EventMgr.removeEventByObject(BattleEvent.CITY_ITEM_COUNT_UPDATE, this);
        };
        BattleView.prototype.onEnterFrame = function (delta) {
            this.topBlood.refreshBattleTime(delta);
        };
        BattleView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.generalList.onDestroy();
            this.armyList.onDestory();
        };
        BattleView.prototype.clearRes = function () {
            if (this.kaizhanEffect) {
                this.kaizhanEffect.destroy();
                this.kaizhanEffect = null;
            }
            BattleView._instance = null;
            ObjectPool.clearClass("BattleHeadRender");
        };
        // //-----------------------------------------------------
        // public onClick(){
        //     this.topBlood.hideDebuffInfo();
        // }
        BattleView.prototype.onClickAuto = function () {
            BattleProxy.send_C2S_WAR_AUTO(!BattleModel.getAutoState());
        };
        BattleView.prototype.onClickJump = function () {
            var battleType = BattleModel.getCheckPointType();
            if (!C.WarTypeConfig[battleType] || !C.WarTypeConfig[battleType].quickBattle) {
                EffectUtils.showTips(GCode(CLEnum.WAR_STEP_FAL), 1, true);
                return;
            }
            var vip = false;
            var level = false;
            if (VipModel.hasPrivillege(VipPrivillType.CAN_SKIP_BATTLE)) {
                vip = true;
            }
            if (C.WarTypeConfig[battleType] && C.WarTypeConfig[battleType].quickBattle) {
                var arg = C.WarTypeConfig[battleType].quickBattle.split('_');
                if (arg[0] == "lv" && Number(arg[1]) <= RoleData.level) {
                    level = true;
                }
            }
            if (vip || level) {
                BattleProxy.send_C2S_WAR_QUICK_BATTLE();
            }
            else {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips('君主20级可以跳过战斗', 1, true);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.WAR_STEP_TIPS), 1, true);
                }
            }
        };
        //进入战场刷新数据
        BattleView.prototype.battleEnter = function () {
            //没有进场新手引导
            if (GuideModel.doWarEnterStep()) {
                return;
            }
            if (!BattleModel.getIsAleardyCurBattle()
                && BattleModel.getCheckPointType() != CheckPointType.NEW_CITY_WAR
                && BattleModel.getCheckPointType() != CheckPointType.CROSS_SERVER
                && BattleModel.getCheckPointType() != CheckPointType.FIGHT_WILD
                && !BattleModel.m_isGuideBattle) {
                // && BattleModel.getCheckPointType() != CheckPointType.GM ){
                this.createStartEffect();
            }
            else {
                // EventMgr.addEvent(GuideEvent.GUIDE_START_BATTLE, this.createStartEffect, this);
            }
            // this.generalList.refreshGeneralList();
            if (BattleModel.isCityWar() || this.isSiegeQueue) {
                this.initGongchengzhan();
            }
            else {
                this.btn_jump.visible = true; //跳过按钮隐藏
                this.btn_battleInfo.visible = false; //战况         
                this.btn_rank.visible = false;
                this.gaunzhan.visible = false;
            }
            // //gm战斗特殊处理
            // if(BattleModel.getCheckPointType() == CheckPointType.GM){
            //     BattleProxy.send_C2S_WAR_START();
            // }
        };
        //更新头像血条
        BattleView.prototype.attrChange = function (attrvo) {
            this.generalList.attrChange(attrvo);
        };
        BattleView.prototype.changeTopBlood = function (arg) {
            this.generalList.attrChange(arg);
        };
        BattleView.prototype.createStartEffect = function () {
            // if(BattleModel.getCheckPointType() == CheckPointType.GM){
            if (BattleModel.m_isGuideBattle) {
                return;
            }
            if (!this.shape) {
                this.shape = new egret.Shape();
                this.shape.graphics.beginFill(0x000000, 0.6);
                this.shape.graphics.drawRect(0, 0, this.width, this.height);
                this.shape.graphics.endFill();
                this.addChild(this.shape);
            }
            else {
                this.shape.alpha = 1;
                this.shape.visible = true;
            }
            if (!this.kaizhanEffect) {
                var effectMC = new MCDragonBones();
                this.kaizhanEffect = effectMC;
                effectMC.initAsync("EBattle_kaizhan");
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
                effectMC.x = this.width / 2;
                effectMC.y = this.height / 2;
                // this.addChild(effectMC);
                this.addChild(effectMC);
            }
            this.kaizhanEffect.visible = true;
            this.kaizhanEffect.play("EBattle_kaizhan", 1);
            Sound.playStartFight();
        };
        BattleView.prototype.frame_event = function (evt) {
            var _this = this;
            if (evt.frameLabel == "end") {
                egret.Tween.get(this.shape).to({ alpha: 0 }, 200).call(function () { _this.shape.visible = false; });
                BattleProxy.send_C2S_WAR_START();
                com_main.BattleSceneMgr.getInstance().playRunSound();
                com_main.BattleSceneMgr.getInstance().createKezhiTips();
                this.kaizhanEffect.visible = false;
            }
        };
        BattleView.prototype.changePlayerStatus = function () {
            var isAuto = BattleModel.getAutoState();
            if (isAuto) {
                this.lb_auto.text = GCode(CLEnum.WAR_ON_AUTO);
                this.img_auto.source = "btn_107_png";
            }
            else {
                this.lb_auto.text = GCode(CLEnum.WAR_ON_HANG);
                this.img_auto.source = "btn_106_png";
            }
        };
        BattleView.prototype.onClickTiaoshi = function () {
            var list = com_main.BattleSceneMgr.getInstance().getDynamicObjs();
            for (var i in list) {
                var obj = list[i];
                if (obj.drawCenter) {
                    obj.drawCenter();
                }
            }
            Utils.DebugUtils.setdebugSkill(true);
            var unitList = [];
            var battlemodelList = BattleModel.getUnits();
            for (var i in battlemodelList) {
                unitList.push(battlemodelList[i].elementId);
            }
            BattleProxy.send_C2S_WAR_QUERY_HERO_DATA(1, unitList);
        };
        BattleView.prototype.initGongchengzhan = function () {
            var cityWarInfo = WorldModel.getCityWarInfo();
            if (!cityWarInfo)
                return;
            this.cityId = cityWarInfo.cityId;
            this.btn_jump.visible = false; //跳过按钮隐藏
            this.btn_battleInfo.visible = true; //战况         
            this.btn_rank.visible = true;
            if (BattleModel.isCityWar() || this.isSiegeQueue) {
                var countdownTime = WorldModel.checkSiegeTime();
                if (this.isSiegeQueue && countdownTime > 0.5) {
                    this.daojishi.visible = true;
                    this.siegeCountdown();
                }
                else {
                    this.daojishi.visible = false;
                }
            }
            if (BattleModel.getIsObserve()) {
                this.gaunzhan.visible = true;
            }
            else {
                this.gaunzhan.visible = false;
            }
        };
        BattleView.prototype.onClickBattleInfo = function () {
            Utils.open_view(TASK_UI.POP_WORLD_SIEGE_VIEW, { cid: this.cityId });
        };
        BattleView.prototype.changeQueue = function (arg) {
            // this.lb_paidui.text =arg; 
        };
        BattleView.prototype.siegeCountdown = function () {
            var countdownTime = WorldModel.checkSiegeTime();
            if (countdownTime > 0) {
                this.lb_daojishi.text = Utils.DateUtils.getFormatBySecond(countdownTime, 1);
            }
            else {
                this.daojishi.visible = false;
                Utils.TimerManager.remove(this.countdownFlame, this);
            }
        };
        BattleView.prototype.countdownFlame = function () {
            if (BattleModel.isCityWar() || this.isSiegeQueue /*|| BattleModel.getCheckPointType() == CheckPointType.SIEGE_PVP */) {
                this.siegeCountdown();
            }
        };
        BattleView.prototype.onClickRankBtn = function () {
            Utils.open_view(TASK_UI.POP_WORLD_SIEGE_KILL, { cid: this.cityId });
        };
        /**退出按钮 */
        BattleView.prototype.onClickBackBtn = function () {
            BattleModel.exitWatchBattle(this.cityId);
        };
        BattleView.prototype.playGeneralDie = function (args) {
            if (args.faction == FactionType.ATK) {
                this.leftGengeralDieHead.setInfo(args.faction, args.roleId);
            }
            else {
                this.rightGengeralDieHead.setInfo(args.faction, args.roleId);
            }
        };
        BattleView.prototype.cityItemCountUpdate = function () {
            this.topBlood.refreshCityItemCount();
        };
        BattleView.NAME = 'BattleView';
        return BattleView;
    }(com_main.CView));
    com_main.BattleView = BattleView;
})(com_main || (com_main = {}));
