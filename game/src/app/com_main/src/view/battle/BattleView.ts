
module com_main {
    export class BattleView extends CView {
        public static NAME = 'BattleView';

        //单例
        private static _instance: BattleView;

        public topBlood: com_main.BattleTopBlood;
        public btn_back: com_main.CImage;
        public tiaoshi: eui.Button;
        public generalList: com_main.BattleGeneralList;
        public btn_jump: eui.Image;
        public btn_rank: eui.Group;
        public btn_battleInfo: eui.Group;
        public gaunzhan: eui.Group;
        public daojishi: eui.Group;
        public lb_daojishi: eui.Label;
        // public battletips:com_main.BattleTips;
        public armyList: com_main.ArmyHeadList;
        public btn_auto_battle: eui.Group;
        public img_auto: eui.Image;
        public lb_auto: eui.Label;
        public leftGengeralDieHead: com_main.BattleGeneralDieHead;
        public rightGengeralDieHead: com_main.BattleGeneralDieHead;

        private isInit: boolean;
        private shape: egret.Shape;
        private isStart: boolean;
        public cityId: number;
        private isSiegeQueue: boolean = false;  //攻城战等待地图


        private kaizhanEffect: MCDragonBones;

        public static getInstance() {
            if (!BattleView._instance) {
                BattleView._instance = new BattleView();
            }
            return BattleView._instance;
        }

        public setData(isSiegeQueue?: boolean) {
            this.isSiegeQueue = isSiegeQueue;
            this.visible = true;
            if (this.isInit) {
                this.onCreate();
                this.armyList.initData();
            }
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        public constructor() {
            super();
            this.name = "BattleView";
            this.initApp("battle_new/top_new/battle_view.exml");
        }

        protected onCreate(): void {
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
            } else {
                this.btn_back.visible = false;
                this.lb_auto.visible = true;
                this.img_auto.visible = true;
            }

            if (BattleModel.m_isGuideBattle) {
                this.visible = false;
            }

            this.topBlood.init();
        }

        public changeBattleMap() {
            this.generalList.refreshGeneralList();
            this.topBlood.refreshPlayerName();
            this.topBlood.refreshBloodPro();
        }


        private initEvent() {
            EventMgr.addEvent(BattleEvent.BATTLE_ENTER, this.battleEnter, this);
            EventManager.addTouchScaleListener(this.btn_battleInfo, this, this.onClickBattleInfo);
            EventManager.addTouchScaleListener(this.btn_rank, this, this.onClickRankBtn);
            EventManager.addTouchScaleListener(this.btn_back, this, this.onClickBackBtn);

            Utils.TimerManager.doFrame(30, 0, this.countdownFlame, this);
            Utils.TimerManager.doFrame(15, 0, this.onEnterFrame, this);

            EventManager.addTouchScaleListener(this.btn_auto_battle, this, this.onClickAuto); //自动战斗
            EventManager.addTouchScaleListener(this.btn_jump, this, this.onClickJump); //跳过
            EventManager.addTouchScaleListener(this.tiaoshi, this, this.onClickTiaoshi); //调试

            // EventManager.addTouchTapListener(this, this, this.onClick); //调试

            EventMgr.addEvent(BattleEvent.BATTLE_BLOOD_CHANGE, this.changeTopBlood, this);
            EventMgr.addEvent(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, this.changePlayerStatus, this);
            EventMgr.addEvent(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, this.playGeneralDie, this);
            EventMgr.addEvent(BattleEvent.BATTLE_CHANGE_MAP, this.changeBattleMap, this);

            EventMgr.addEvent(BattleEvent.CITY_ITEM_COUNT_UPDATE, this.cityItemCountUpdate, this);

        }

        private removeEvent() {
            // Utils.removeFromParent(this);
            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.onEnterFrame, this);
            Utils.TimerManager.remove(this.countdownFlame, this);

            EventMgr.removeEventByObject(BattleEvent.BATTLE_ENTER, this);
            // EventMgr.removeEventByObject(BattleEvent.BATTLE_UNIT_ATTR_CHANGE, this.attrChange);
            EventMgr.removeEventByObject(BattleEvent.BATTLE_BLOOD_CHANGE, this);
            EventMgr.removeEventByObject(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, this);
            // EventMgr.removeEventByObject(BattleEvent.BATTLE_GENERAL_USE_SKILL, this);

            // EventMgr.removeEventByObject(GuideEvent.GUIDE_START_BATTLE, this);//新手战斗开始
            EventMgr.removeEventByObject(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, this);
            EventMgr.removeEventByObject(BattleEvent.BATTLE_CHANGE_MAP, this);

            EventMgr.removeEventByObject(BattleEvent.CITY_ITEM_COUNT_UPDATE, this);

        }

        private onEnterFrame(delta: number) {
            this.topBlood.refreshBattleTime(delta);
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            this.generalList.onDestroy();
            this.armyList.onDestory();
        }

        public clearRes() {
            if (this.kaizhanEffect) {
                this.kaizhanEffect.destroy();
                this.kaizhanEffect = null;
            }
            BattleView._instance = null;
            ObjectPool.clearClass("BattleHeadRender");

        }

        // //-----------------------------------------------------
        // public onClick(){
        //     this.topBlood.hideDebuffInfo();
        // }

        public onClickAuto() {
            BattleProxy.send_C2S_WAR_AUTO(!BattleModel.getAutoState());
        }

        public onClickJump() {
            let battleType = BattleModel.getCheckPointType();
            if (!C.WarTypeConfig[battleType] || !C.WarTypeConfig[battleType].quickBattle) {
                EffectUtils.showTips(GCode(CLEnum.WAR_STEP_FAL), 1, true)
                return;
            }
            let vip = false;
            let level = false;

            if (VipModel.hasPrivillege(VipPrivillType.CAN_SKIP_BATTLE)) {
                vip = true;
            }


            if (C.WarTypeConfig[battleType] && C.WarTypeConfig[battleType].quickBattle) {
                let arg = C.WarTypeConfig[battleType].quickBattle.split('_');
                if (arg[0] == "lv" && Number(arg[1]) <= RoleData.level) {
                    level = true;
                }
            }

            if (vip || level) {
                BattleProxy.send_C2S_WAR_QUICK_BATTLE();
            } else {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips('君主20级可以跳过战斗', 1, true)
                } else {
                    EffectUtils.showTips(GCode(CLEnum.WAR_STEP_TIPS), 1, true)
                }
            }
        }

        //进入战场刷新数据
        public battleEnter() {
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
            } else {
                // EventMgr.addEvent(GuideEvent.GUIDE_START_BATTLE, this.createStartEffect, this);
            }
            // this.generalList.refreshGeneralList();
            if (BattleModel.isCityWar() || this.isSiegeQueue) {
                this.initGongchengzhan();
            } else {
                this.btn_jump.visible = true; //跳过按钮隐藏
                this.btn_battleInfo.visible = false; //战况         
                this.btn_rank.visible = false;
                this.gaunzhan.visible = false;
            }

            // //gm战斗特殊处理
            // if(BattleModel.getCheckPointType() == CheckPointType.GM){
            //     BattleProxy.send_C2S_WAR_START();
            // }
        }

        //更新头像血条
        public attrChange(attrvo) {
            this.generalList.attrChange(attrvo);
        }

        public changeTopBlood(arg) {
            this.generalList.attrChange(arg);
        }

        public createStartEffect() {

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
            } else {
                this.shape.alpha = 1;
                this.shape.visible = true;
            }

            if (!this.kaizhanEffect) {
                let effectMC = new MCDragonBones();
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
        }

        private frame_event(evt: dragonBones.FrameEvent) {
            if (evt.frameLabel == "end") {
                egret.Tween.get(this.shape).to({ alpha: 0 }, 200).call(() => { this.shape.visible = false; });
                BattleProxy.send_C2S_WAR_START();
                BattleSceneMgr.getInstance().playRunSound();
                BattleSceneMgr.getInstance().createKezhiTips();
                this.kaizhanEffect.visible = false;
            }
        }

        private changePlayerStatus() {
            let isAuto = BattleModel.getAutoState();
            if (isAuto) {
                this.lb_auto.text = GCode(CLEnum.WAR_ON_AUTO);
                this.img_auto.source = "btn_107_png"
            } else {
                this.lb_auto.text = GCode(CLEnum.WAR_ON_HANG);
                this.img_auto.source = "btn_106_png"
            }
        }

        public onClickTiaoshi() {

            let list = BattleSceneMgr.getInstance().getDynamicObjs();
            for (let i in list) {
                let obj: CSquare = list[i];
                if (obj.drawCenter) {
                    obj.drawCenter();
                }
            }

            Utils.DebugUtils.setdebugSkill(true);

            let unitList = [];
            let battlemodelList = BattleModel.getUnits();
            for (let i in battlemodelList) {
                unitList.push(battlemodelList[i].elementId);
            }
            BattleProxy.send_C2S_WAR_QUERY_HERO_DATA(1, unitList);
        }

        public initGongchengzhan() {
            let cityWarInfo = WorldModel.getCityWarInfo();

            if (!cityWarInfo) return;

            this.cityId = cityWarInfo.cityId;

            this.btn_jump.visible = false; //跳过按钮隐藏
            this.btn_battleInfo.visible = true; //战况         
            this.btn_rank.visible = true;

            if (BattleModel.isCityWar() || this.isSiegeQueue) {
                let countdownTime = WorldModel.checkSiegeTime();
                if (this.isSiegeQueue && countdownTime > 0.5) {
                    this.daojishi.visible = true;
                    this.siegeCountdown();
                }else{
                    this.daojishi.visible = false;
                }
            }
            if (BattleModel.getIsObserve()) {
                this.gaunzhan.visible = true;
            } else {
                this.gaunzhan.visible = false;
            }
        }

        public onClickBattleInfo() {
            Utils.open_view(TASK_UI.POP_WORLD_SIEGE_VIEW, { cid: this.cityId });
        }

        public changeQueue(arg) {
            // this.lb_paidui.text =arg; 
        }

        public siegeCountdown() {
            let countdownTime = WorldModel.checkSiegeTime();
            if (countdownTime > 0) {
                this.lb_daojishi.text = Utils.DateUtils.getFormatBySecond(countdownTime, 1)
            } else {
                this.daojishi.visible = false;
                Utils.TimerManager.remove(this.countdownFlame, this);
            }
        }

        public countdownFlame() {
            if (BattleModel.isCityWar() || this.isSiegeQueue /*|| BattleModel.getCheckPointType() == CheckPointType.SIEGE_PVP */) {
                this.siegeCountdown();
            }
        }

        public onClickRankBtn() {
            Utils.open_view(TASK_UI.POP_WORLD_SIEGE_KILL, { cid: this.cityId });
        }

        /**退出按钮 */
        public onClickBackBtn() {
            BattleModel.exitWatchBattle(this.cityId);
        }

        public playGeneralDie(args) {
            if (args.faction == FactionType.ATK) {
                this.leftGengeralDieHead.setInfo(args.faction, args.roleId);
            } else {
                this.rightGengeralDieHead.setInfo(args.faction, args.roleId);
            }
        }

        public cityItemCountUpdate() {
            this.topBlood.refreshCityItemCount();
        }
    }
}