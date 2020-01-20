module com_main {
    /**
	 * 世界地图资源点
	 * @export
	 * @class WorldResSprite
	 * @extends ResSprite
	 */
    export class WorldResSprite extends ResSprite {

        public static m_nNum: number = 0;
        private m_pRes: PImage | MonsterSequece;
        private m_nTotalDt: number = 0;
        private m_nDt: number = 0;
        private m_pProgress: WorldProgress;
        private m_pBattle: WorldBattleNotify;
        private m_pStateEff: MCDragonBones;

        private m_pLabNameLvl: eui.Label//显示等级加名字
        /**事件完成显示 */
        private m_pResFinsh: WorldResEventFinishComp;
        private evtVo: WorldEventVo;
        private m_cityInfo: gameProto.ICityInfo;

        public static create(vo: WorldEventVo): WorldResSprite {
            var obj = new WorldResSprite(vo);
            return obj;
        }

        public get type(): WorldEventType {
            return this.evtVo.type;
        }

        /**获得子类型 */
        public get subType(): number {
            return this.evtVo.subType;
        }



        public constructor(vo: WorldEventVo) {
            super(ResType.RES);
            this.m_nIid = vo.eventCoordinatesId;
            this.evtVo = vo;
            this.name = `${ResType.RES}_${this.m_nIid}`;
            this.x = vo.pos.x;
            this.y = vo.pos.y;
            let cityInfo: gameProto.ICityInfo = WorldModel.getCityBuildInfo(this.evtVo.cityId);
            this.m_cityInfo = cityInfo;
        }

        protected onDestroy(): void {
            this.onClearView();
            super.onDestroy();
        }

        public onClearView(): void {
            if (this.m_pProgress) {
                Utils.removeFromParent(this.m_pProgress);
            }
            if (this.m_pStateEff) {
                NormalMcMgr.removeMc(this.m_pStateEff);
                this.m_pStateEff = null;
            }
            if (this.m_pBattle) {
                this.m_pBattle.visible = false;
                Utils.removeFromParent(this.m_pBattle);
                this.m_pBattle = null;
            }
            if (this.m_pRes) {
                this.m_pRes.onDestroy();
                this.m_pRes = null;
            }

            if (this.m_pLabNameLvl) {
                Utils.removeFromParent(this.m_pLabNameLvl);
                this.m_pLabNameLvl = null;
            }

            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, this);
        }

        public onCreateView(): void {
            if (isNull(this) || isNull(this.evtVo)) return;
            switch (this.evtVo.type) {
                case WorldEventType.FIGHT: {
                    const images = ("" + this.evtVo.image).split(",");
                    this.m_pRes = new MonsterSequece(images)
                    AnchorUtil.setAnchorCenter(this.m_pRes);
                    Utils.addChild(this, this.m_pRes);
                    break;
                }
                default: {
                    let texture: egret.Texture = RES.getRes(`map_build_icon${this.evtVo.image}_png`);
                    this.m_pRes = PImage.create(texture);
                    this.m_pRes.width = texture.textureWidth;
                    this.m_pRes.height = texture.textureHeight;
                    AnchorUtil.setAnchorCenter(this.m_pRes);
                    NodeUtils.addOtherParent(this.m_pRes, this, WorldView.getCityLayer());
                    // NodeUtils.changeParentLater(this.m_pRes, WorldView.getCityLayer());
                    // 武馆 隐士 特效
                    if (WorldModel.checkCityLocked(this.m_cityInfo.id) && this.type == WorldEventType.RES_COLLECT) {
                        if (this.subType == WorldEventResType.WUGUAN || this.subType == WorldEventResType.YINSHI) {
                            this.__add_arts_effect();
                        }
                    }
                    break;
                }
            }
            this.m_pRes.visible = false;
            this.createNameLevel();
            this.checkStatus();
            this.updateShow();
        }

        /**添加战斗类型事件 */
        public initBattleEvent() {
            EventManager.addTouchScaleListener(this.m_pBattle, this, this.onBattleClick);
        }
        // /**添加采集事件 */
        // public initCollectionEvent() {
        //     com_main.EventMgr.addEvent(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, this.onCollectTimerComplete, null);
        // }
        // /**采集定时器结束的时候销毁资源 */
        // public onCollectTimerComplete() {
        //     this.onDestroy();
        // }
        public onBattleClick(pvt: egret.TouchEvent) {
            this.onResSecectedHandler();
        }


        public updateShow() {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            let cityInfo: gameProto.ICityInfo = WorldModel.getCityBuildInfo(this.evtVo.cityId);
            if (!cityInfo) return;
            this.m_pRes.visible = WorldModel.checkCityLocked(cityInfo.id);
            this.m_pLabNameLvl.visible = WorldModel.checkCityLocked(cityInfo.id) && !WorldModel.isFromUnLockFight;
        }

        public createNameLevel() {
            this.m_pLabNameLvl = new eui.Label();
            this.m_pLabNameLvl.text = GCodeFromat(CLEnum.LEVEL1, this.evtVo.dataCfg.lv) + GLan(this.evtVo.dataCfg.name);
            this.m_pLabNameLvl.textColor = Utils.getColorOfQuality(this.evtVo.dataCfg.colour);
            this.m_pLabNameLvl.size = 20;
            this.m_pLabNameLvl.stroke = 2;
            this.m_pLabNameLvl.strokeColor = 0x000000;
            NodeUtils.setPosition(this.m_pLabNameLvl, 0, -this.height / 2 - 45);
            AnchorUtil.setAnchorCenter(this.m_pLabNameLvl);
            NodeUtils.addOtherParent(this.m_pLabNameLvl, this, WorldView.getLaberLayer());

            // egret.callLater(() => {
            //     NodeUtils.changeParentLater(this.m_pLabNameLvl, WorldView.getLaberLayer());
            // }, this);

        }



        public playeffect(resShow: boolean = false) {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            let finshEffect: MCDragonBones = new MCDragonBones();
            finshEffect.initAsync(IETypes.EBuild_UpGrade);
            finshEffect.play(IETypes.EBuild_UpGrade, 1, true);
            Utils.addChild(this, finshEffect);
            NodeUtils.setPosition(finshEffect, 20, -50);
            finshEffect.scaleX = finshEffect.scaleY = 0.8;
            if (resShow) this.updateShow()
        }
        /**事件移除的时候 增加飘字和特效 移除资源 */
        public onEventFinish(evtPosIs: number, isVictory: boolean = true) {
            /**组件未初始化 */
            if (!this.m_bInit) {
                Utils.removeFromParent(this)
                return;
            }
            if (isVictory) {
                this.onDestroy();
                switch (this.evtVo.type) {
                    case WorldEventType.FIGHT:
                    case WorldEventType.RES_GATHER:
                    case WorldEventType.RES_COLLECT: {
                        egret.setTimeout(() => {
                            this.playeffect();
                        }, this, 1000);
                        break;
                    }
                }
            } else {
                this.removeBattleEvent();
            }

            this.m_pResFinsh = new WorldResEventFinishComp();
            switch (this.type) {
                case WorldEventType.RES_GATHER: {
                    this.m_pResFinsh.updateResShow("lb_zc_cjwc_png")
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    this.m_pResFinsh.updateResShow("lb_zc_sjwc_png")
                    break;
                }
                case WorldEventType.FIGHT: {
                    if (isVictory) {
                        this.m_pResFinsh.updateResShow("lb_zc_jfcg_png")
                    } else {
                        this.m_pResFinsh.updateResShow("lb_zc_sjsb_png")
                    }
                    break;
                }
            }
            NodeUtils.setScale(this.m_pResFinsh, 1)
            Utils.addChild(this, this.m_pResFinsh);
            NodeUtils.setPosition(this.m_pResFinsh, -275, -40)
            this.m_pResFinsh.m_pRes.scaleX = 0.1;
            this.m_pResFinsh.m_pRes.scaleY = 0.1;

            this.m_pResFinsh.m_pRes.alpha = 0;
            egret.Tween.get(this.m_pResFinsh.m_pRes).wait(1000).to({ scaleX: 1, scaleY: 1, alpha: 1, y: -70 }, 350, Ease.backOut).wait(500).call(() => {
                egret.Tween.removeTweens(this.m_pResFinsh);
                Utils.removeFromParent(this.m_pResFinsh)
                if (isVictory) {
                    Utils.removeFromParent(this)
                } else {
                    this.m_pBattle = null;
                    this.m_pStateEff = null;
                }
            })
        }

        public checkTouchEvent(x: number, y: number): boolean {
            if (this.m_pBattle && this.m_pBattle.visible && this.m_pBattle.hitTestPoint(x, y)) {
                this.onResSecectedHandler();
                return true;
            }
            if (!this.m_pRes || !this.m_pRes.visible)
                return false;
            if (this.m_pRes.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);

                this.isGlow(true);
                this.onResSecectedHandler();
                this.updateLevelShow(false);
                return true;
            }


            this.updateLevelShow(this.m_pRes.visible)
            return false;
        }
        public updateLevelShow(visible: boolean) {
            this.m_pLabNameLvl.visible = visible;
        }
        /**播放特效的时候隐藏人物资源，调整batte incon坐标*/
        public updateResShow(visible: boolean = false) {
            this.m_pRes.visible = visible;
            this.m_pBattle.y = visible ? -85 : -125;
        }
        /**选中回调 */
        public onResSecectedHandler() {
            let evtVo = this.evtVo;
            if (!evtVo) return;
            /**空的采集点 */
            if (evtVo.getTeamId() == 0) {
                if (WorldModel.isInTeamMoveRes(this.m_nIid)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_ACT_TIPS), 1, true);
                    return;
                }
                WorldView.callFunc(WORLD_FUNC.CREAT_RES_MENU, this.m_nIid);
                return;
            }

            if (evtVo.type == WorldEventType.FIGHT) { //观看战斗
                BattleProxy.send_C2S_WAR_REENTRY_BATTLE(evtVo.userMapEventData.battleId);
            } else {
                WorldView.callFunc(WORLD_FUNC.CREAT_RES_MENU, this.m_nIid);
            }
        }

        /**是否显示选中效果 */
        public isGlow(flag: boolean) {
            Utils.isGlow(flag, this.m_pRes);
        }

        public onEvent(): void {
            this.checkStatus();
        }

		/**
		 * 资源的状态切换
		 * @param  {number} [dt] 
		 * @return void 
		 * @memberof WorldResSprite
		 */
        public checkStatus(): void {
            /**组件未初始化 */
            if (!this.m_bInit) return;
            let evtVo = this.evtVo;
            if (!evtVo) return;
            if (evtVo.getTeamId() == 0) return;
            switch (this.type) {
                case WorldEventType.FIGHT: {
                    if (evtVo.getBattleId() !== 0) {
                        this.__add_battle_event();
                    }
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    let total = evtVo.getWorkingTime();
                    let dt = evtVo.userMapEventData.endTime - TimerUtils.getServerTime() - evtVo.userMapEventData.speedTime;
                    this.m_pProgress = WorldProgress.create(total, dt);
                    AnchorUtil.setAnchorCenter(this.m_pProgress);
                    NodeUtils.setPosition(this.m_pProgress, 0, -this.height / 2 - this.m_pProgress.height / 2 - 20)
                    this.addChild(this.m_pProgress);
                    if (this.subType == WorldEventResType.FOOD ||
                        this.subType == WorldEventResType.IRON ||
                        this.subType == WorldEventResType.SLIVER ||
                        this.subType == WorldEventResType.WOOD) {
                        this.__add_collect_effect();
                    }
                    break;
                }
            }

        }

        private __add_battle_event() {
            /**组件未初始化 */
            if (!this.m_bInit) return;
            if (this.m_pStateEff) return;
            let name = IETypes.EWORLD_Fire;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Fire);
            Utils.addChild(this, this.m_pStateEff)
            NodeUtils.setPosition(this.m_pStateEff, 20, -30);
            NodeUtils.setScale(this.m_pStateEff, 0.7)

            if (this.m_pBattle) return;
            this.m_pBattle = new WorldBattleNotify();
            this.addChild(this.m_pBattle);
            this.m_pBattle.x = -30;
            this.m_pBattle.y = -85;
            // this.m_pBattle.scaleX = .6;
            // this.m_pBattle.scaleY = .6;
            this.updateResShow(false);
            this.updateLevelShow(false);
            this.initBattleEvent();
        }
        private removeBattleEvent() {
            Utils.removeFromParent(this.m_pBattle);

            if (this.m_pStateEff) {
                NormalMcMgr.removeMc(this.m_pStateEff);
                this.m_pStateEff = null;
            }

            this.updateResShow(true);
            this.updateLevelShow(true);
            this.isGlow(false);
        }

        private __add_collect_effect() {
            if (this.m_pStateEff) return;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Collect);
            Utils.addChild(this, this.m_pStateEff)
            NodeUtils.setPosition(this.m_pStateEff, 10, -30);
            // AnchorUtil.setAnchorCenter(this.m_pStateEff)
        }

        private __add_arts_effect() {
            if (this.m_pStateEff) return;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Arts);
            Utils.addChild(this, this.m_pStateEff)
            NodeUtils.setPosition(this.m_pStateEff, 10, -30);
            // AnchorUtil.setAnchorCenter(this.m_pStateEff)
        }
    }

	/**
	 * 采集时间进度条
	 * @export
	 * @class WorldProgress
	 * @extends egret.DisplayObjectContainer
	 */
    export class WorldProgress extends egret.DisplayObjectContainer {

        private m_pMain: egret.Bitmap;
        private m_pLbTime: eui.Label;
        private m_nTotalDt: number = 0;
        private m_nDt: number = 0;

        public static create(total: number, dt: number): WorldProgress {

            return new WorldProgress(total, dt);
        }

        public get dt(): number {
            return this.m_nDt;
        }

        public constructor(total: number, dt: number) {
            super();
            this.m_nTotalDt = total;
            this.m_nDt = dt;
            this.once(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }


        protected onEnter() {
            let bg = new egret.Bitmap(RES.getRes("map_build_icon-JDT-1_png"));
            Utils.addChild(this, bg);
            bg.width = 77;
            bg.height = 11;
            this.width = bg.width;
            this.height = bg.height;
            this.m_pMain = new egret.Bitmap(RES.getRes("map_build_icon-JDT-2_png"));
            Utils.addChild(this, this.m_pMain);
            this.m_pMain.width = 75;
            this.m_pMain.height = 11;
            this.m_pMain.scale9Grid = new egret.Rectangle(4, 4, 6, 5);
            this.m_pMain.x = 1;

            if (this.m_nDt == 0) return;
            this.m_pLbTime = new eui.Label();
            Utils.addChild(this, this.m_pLbTime);
            this.m_pLbTime.size = 12;
            this.m_pLbTime.textColor = 0xFFFDDD;
            this.m_pLbTime.stroke = 1;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            this.m_pLbTime.y = this.height / 2 - 8;
            this.m_pLbTime.x = (this.width - this.m_pLbTime.width) / 2;

            this.m_pMain.scaleX = 1 - (this.m_nDt / this.m_nTotalDt);

            Utils.TimerManager.remove(this.update, this);
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
                this.m_pLbTime.visible = false;
            });
        }

        protected onDestroy() {
            Utils.TimerManager.remove(this.update, this);
        }

        protected update() {
            this.m_nDt--;
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(0, 1);
                com_main.EventMgr.dispatchEvent(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, null);
                return;
            }
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            this.m_pMain.scaleX = 1 - (this.m_nDt / this.m_nTotalDt);
        }

        public $onRemoveFromStage() {
            Utils.TimerManager.remove(this.update, this);
            super.$onRemoveFromStage();
        }
    }

    export class MonsterSequece extends egret.DisplayObjectContainer {

        private m_aData: string[] = [];

        public constructor(data: string[]) {
            super();

            this.width = 80;
            this.height = 80;
            this.$setInfo(data)
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        protected $setInfo(data: string[]) {
            this.m_aData = data;
            let len = data.length;
            this.__create_monster(data[0]);
        }

        protected __create_monster(id: string) {
            let name = `EWORLD_Monster_${id}`
            let res = NormalMcMgr.createMc(name);
            res.x = 40;
            res.y = 40;
            Utils.addChild(this, res);
            res.play(name, 0);
        }

        public onDestroy() {
            let i = 0;
            for (let res of this.$children) {
                NormalMcMgr.removeMc(<MCDragonBones>res);
                i++;
            }
            this.removeChildren();
            this.m_aData = [];
            Utils.removeFromParent(this);
        }

    }

}