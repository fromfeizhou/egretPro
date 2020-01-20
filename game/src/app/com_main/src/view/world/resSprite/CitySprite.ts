module com_main {
    /**
	 * 世界地图城池
	 * @export
	 * @class CitySprite
	 * @extends ResSprite
	 */
    export class CitySprite extends ResSprite {
        /**建筑 */
        private m_pBuild: PImage;
        /**名字 */
        private m_pBuild_name: WorldCityNameWidget = null;
        /**建筑配置 */
        private m_pBuildConfig: WorldMapConfig = null;
        /**城池配置 */
        private m_pInfo: any = null;
        private m_pFlag: PImage;//旗帜
        private m_pFlagType: string = '';
        private m_pBattle: WorldSiegeTime;


        private m_pBattleEffect: MCDragonBones;
        /**首战奖励图标 */
        private m_pFirstAward: WorldCityFirstAwardComp;

        /**襄阳城图标 */
        private m_xiangYangComp: WorldXiangYangComp;
        /**城池解锁图标 */
        private m_pCityLock: WorldCityLockComp;
        private m_pSjfhzEffect: MCDragonBones;
        /**拜访头像 */
        private visitItem: GeneralHeadRender;
        public get config(): WorldMapConfig {
            return this.m_pBuildConfig;
        }

        public static create(config: WorldMapConfig): CitySprite {
            var obj = new CitySprite(config);
            AnchorUtil.setAnchorCenter(obj);
            return obj;
        }

        public constructor(config: WorldMapConfig) {
            super(ResType.CITY);
            // if (config.type == CityType.XIANG_BIRTH) {
            //     config=C.WorldMapConfig[config.mapCity]
            // }
            this.m_nIid = config.id;
            this.name = `${ResType.CITY}_${config.id}`;
            this.touchEnabled = false;
            this.m_pBuildConfig = config;
            this.x = config.posX;
            this.y = config.posY;
        }

        protected onDestroy(): void {
            this.m_pBuildConfig = null;
            this.m_pInfo = null;
            this.removeEvent();
            this.onClearView();
            super.onDestroy();
        }

        public onClearView(): void {
            if (this.m_pBuild) {
                Utils.isGlow(false, this.m_pBuild);
                this.m_pBuild.onDestroy();
                this.m_pBuild = null;
            }
            if (this.m_pBuild_name) {
                this.m_pBuild_name.onDestroy();
                this.m_pBuild_name = null;
            }
            this.__remove_visit();
            this.__remove_first_award();
            this.__remove_city_locked();
            this.__remove_attack_event();
            this.__remove_battle_eff();
            this.removeSjfhzEffect();
            this.removeBarAtkItem();
            EventManager.removeEventListeners(this);
        }

        public onCreateView(): void {
            Promise.all([
                this.__add_build()
                , this.__add_build_name()
                , this.updateVisitEvent()
                , this.setBattleEffect()
                , this.updateFirstWard()
                , this.updateXyComp()
                , this.updateCityLock()
                , this.addSjfhzEffect()
                , this.updateBarAtkState()
            ])

            this.initEvent();
        }

        /**添加事件 */
        public initEvent() {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this.onUpdateCityTeam, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.onWorldBuildUpdate, this);
        }
        /**移除事件 */
        public removeEvent() {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_UPDATE, this);
        }
        /**更新城池队伍图标 */
        public onUpdateCityTeam(cityId: number) {
            let config = this.m_pBuildConfig;
            let pConf: WorldMapConfig = C.WorldMapConfig[cityId];
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY && pConf && pConf.mapId == SceneEnums.WORLD_CITY) cityId = pConf.mapCity
            if (config.id != cityId)
                return;
            if (isNull(this.m_pBuild_name))
                return;
            this.m_pBuild_name.updateCityTeam(cityId);
        }
        /**更新城池建设状态 */
        public onWorldBuildUpdate(cityId: number) {
            let config = this.m_pBuildConfig;
            let pConf: WorldMapConfig = C.WorldMapConfig[cityId];
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY && pConf && pConf.mapId == SceneEnums.WORLD_CITY) cityId = pConf.mapCity
            if (config.id != cityId)
                return;
            if (isNull(this.m_pBuild_name))
                return;
            this.m_pBuild_name.updateCityBuild(cityId);
        }
        /**添加建筑图片 */
        private async __add_build() {
            let config = this.m_pBuildConfig;
            let texture: egret.Texture = RES.getRes(`${this.m_pBuildConfig.icon}_png`);
            this.m_pBuild = PImage.create(texture);
            this.width = texture.textureWidth;
            this.height = texture.textureHeight;
            this.m_pBuild.width = texture.textureWidth;
            this.m_pBuild.height = texture.textureHeight;
            egret.callLater(() => {
                if(this.m_pBuild)NodeUtils.addOtherParent(this.m_pBuild, this, WorldView.getCityLayer());
            }, this);
        }
        /**添加建筑名字 */
        private async __add_build_name() {
            let pInfo;
            if (this.m_pBuildConfig.type !== CityType.EMPEROR_BATTLE) {
                pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            } else {
                pInfo = WorldModel.getCityBuildInfo(this.m_pBuildConfig.mapCity);
            }

            if (!pInfo) {
                error(`CitySprite:_refresh_flag=========城池[${this.m_nIid}]信息为空`);
                return;
            }
            let country = pInfo.country;


            this.m_pBuild_name = WorldCityNameWidget.create();
            Utils.addChild(this, this.m_pBuild_name);
            this.m_pBuild_name.x = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY || this.m_pBuildConfig.type == CityType.XIANG_BIRTH ? (this.width - this.m_pBuild_name.width * 1) / 2 : -40;
            this.m_pBuild_name.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY || this.m_pBuildConfig.type == CityType.XIANG_BIRTH ? this.height - this.m_pBuild_name.height * 1 / 2 : 40;

            this.m_pBuild_name.initData(this.m_pBuildConfig, country, GLan(this.m_pBuildConfig.name));
        }

        public async updateVisitEvent() {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            let event = WorldModel.getVisitEventById(this.m_nIid);
            if (!event) {
                this.__remove_visit();
                return;
            }
            if (WorldModel.checkIsHasFirstAward(this.m_nIid) || WorldModel.checkIsHasLock(this.m_nIid))
                return;
            this.__add_visit_event(event);
        }

        private __add_visit_event(event: gameProto.IVisitEventData) {
            this.__remove_visit();

            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            let cfg = C.VisitConfig[event.visitId];
            if (isNull(cfg)) return;
            this.visitItem = GeneralHeadRender.create('none');
            Utils.addChild(this, this.visitItem);

            this.visitItem.setGenId(cfg.icon);
            // item.name = "VisitItem";
            this.visitItem.x = (this.width - this.visitItem.width * .55) / 2;
            this.visitItem.y = -50;
            this.visitItem.scaleX = .55;
            this.visitItem.scaleY = .55;
            this.visitItem.visible = !WorldModel.checkIsHasFirstAward(this.m_nIid) && !WorldModel.checkIsHasLock(this.m_nIid) && pInfo.status !== 1
        }

        private __remove_visit() {
            if (this.visitItem) {
                this.visitItem.onDestroy();
                this.visitItem = null;
            }
        }

        /**添加首战奖励图标 */
        public async updateFirstWard() {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            this.__remove_first_award();
            let conf = WorldModel.getCityConfig(this.m_nIid);
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (!conf) {
                error(`CityConfig城池[${this.m_nIid}]信息为空`);
                return;
            }
            if (pInfo.status == 1)
                return;
            if (WorldModel.checkIsHasLock(this.m_nIid))
                return;
            if (WorldModel.checkIsHasFirstAward(this.m_nIid)) {
                this.m_pFirstAward = WorldCityFirstAwardComp.create();
                Utils.addChild(this, this.m_pFirstAward);
                this.m_pFirstAward.visible = true;
                this.m_pFirstAward.x = (this.width - this.m_pFirstAward.width * .55) / 2 - 5;
                this.m_pFirstAward.y = -60;
                let genId: number = WorldModel.getGenIdByWorldCfg(this.m_pBuildConfig);
                this.m_pFirstAward.setHero(genId)
            }

        }
        /**襄阳城图标 */
        public async updateXyComp() {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            this.__remove_xy_comp();

            let conf = WorldModel.getCityConfig(this.m_nIid);
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (!conf) {
                error(`CityConfig城池[${this.m_nIid}]信息为空`);
                return;
            }
            if (conf.type == CityType.EMPEROR_BATTLE) {
                this.m_xiangYangComp = WorldXiangYangComp.create();
                Utils.addChild(this, this.m_xiangYangComp);
                this.m_xiangYangComp.x = (this.width - this.m_xiangYangComp.width * .55) / 2 - 10;
                this.m_xiangYangComp.y = -40;
            }
        }
        private __remove_first_award() {
            if (this.m_pFirstAward) {
                this.m_pFirstAward.onDestroy();
                this.m_pFirstAward = null;
            }
        }

        private __remove_xy_comp() {
            if (this.m_xiangYangComp) {
                this.m_xiangYangComp.onDestroy();
                this.m_xiangYangComp = null;
            }
        }
        /**更新城池解锁图标 */
        public async updateCityLock() {
            /**组件未初始化 */
            if (!this.m_bInit) return;
            this.__remove_city_locked();

            if (!WorldModel.checkIsHasLock(this.m_nIid))
                return
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            let conf = WorldModel.getCityConfig(this.m_nIid);
            if (!conf) {
                error(`CityConfig城池[${this.m_nIid}]信息为空`);
                return;
            }
            if (pInfo.status == 1)
                return;
            this.m_pCityLock = WorldCityLockComp.create();
            Utils.addChild(this, this.m_pCityLock);
            this.m_pCityLock.visible = true;
            this.m_pCityLock.x = (this.width - this.m_pCityLock.width * .55) / 2 - 5;
            this.m_pCityLock.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? -60 : -120;

        }

        private __remove_city_locked() {
            if (this.m_pCityLock) {
                this.m_pCityLock.onDestroy();
                this.m_pCityLock = null;
            }
        }

        private __add_battle_event() {
            this.m_pBattle = WorldSiegeTime.create(this.m_nIid);
            this.addChildAt(this.m_pBattle, 4);
            let x = -30
            if (this.config.icon == "map_build_4") {
                x = -10;
            } else if (this.config.icon == "map_build_1") {
                x = 20;
            } else if (this.config.icon == "map_build_2") {
                x = 0;
            } else if (this.config.icon == "map_build_icon21") {
                x = -80;
            } else if (this.config.type == CityType.XIANG_GATE) {
                x = -80;
            } else if (this.config.type == CityType.XIANG_HALL) {
                x = -80;
            }
            this.m_pBattle.x = x;
            this.m_pBattle.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? -140 : -20;
        }

        private __add_battle_effect() {


            if (this.m_pBattleEffect) return;
            this.m_pBattleEffect = NormalMcMgr.createMc(IETypes.EWORLD_City_Fire, false);
            if (this.config.icon == "map_build_2" || this.config.icon == "map_build_1") {
                this.m_pBattleEffect.play(`zhanhuo${1}`)
            } else if (this.config.icon == "map_build_4") {
                this.m_pBattleEffect.play(`zhanhuo${3}`)
            } else if (this.config.icon == "map_build_icon21") {
                this.m_pBattleEffect.play(`zhanhuo${2}`)
            } else if (this.config.type == CityType.XIANG_GATE) {
                this.m_pBattleEffect.play(`zhanhuo${2}`)
            } else if (this.config.type == CityType.XIANG_HALL) {
                this.m_pBattleEffect.play(`zhanhuo${2}`)
            }
            let index = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? 3 : 0;
            this.addChildAt(this.m_pBattleEffect, index)
            NodeUtils.setPosition(this.m_pBattleEffect, this.width / 2, this.height / 2);



        }

        public async setBattleEffect() {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (!pInfo) {
                error(`CitySprite:__add_battle_effect=========城池[${this.m_nIid}]信息为空`);
                return;
            }

            // if (pInfo.atkCountry > 0) {
            if (pInfo.status == 1) {
                if (!this.m_pBattleEffect)
                    this.__add_battle_effect()
            } else {
                this.__remove_battle_eff();
            }
            this.setAttackEvent();
        }

        public checkTouchEvent(x: number, y: number): boolean {
            if (this.m_pBattle && this.m_pBattle.checkTouchEvent(x, y))
                return true;

            //选中襄阳城
            if (this.hitTestPoint(x, y)) {
                let id = this.m_pBuildConfig.id;

                //皇城攻击判断
                if (id == 5 || id == 42 || id == 16) {
                    if (TimerUtils.ServerTime - TimerUtils.OpenServerTime < ConstUtil.getValue(IConstEnum.KING_CITY_PROTECT_TIME)) {
                        let m_tAcVo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.THRONE);
                        if (unNull(m_tAcVo)) {
                            let time = Math.floor((m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
                            if (time >= 0) {
                                EffectUtils.showTips(GCodeFromat(CLEnum.WOR_KING_TIPS, Utils.DateUtils.getFormatBySecond(time, 1)), 1, true);
                                return false;
                            }
                        }

                    }
                }

            }


            //黄巾入侵ui
            if (this.m_barAtkAni && this.m_barAtkAni.hitTestPoint(x, y)) {
                let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
                //活动期间内处理
                let pos = this.localToGlobal(this.m_barAtkAni.x, this.m_barAtkAni.y)
                WorldView.callFunc(WORLD_FUNC.CREAT_NOR_MENU, 0, this.m_nIid, pos);
                return true;
            }

            if (this.m_pFirstAward && this.m_pFirstAward.visible && this.m_pFirstAward.hitTestPoint(x, y)) {
                Utils.open_view(TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL, this.m_nIid);
                return true;
            }
            if (this.m_xiangYangComp && this.m_xiangYangComp.visible && this.m_xiangYangComp.hitTestPoint(x, y)) {
                //判断是否是襄阳
                if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                    this.onTouchXiangyang();
                }
                return true;
            }

            let iconHit = this.visible && this.m_pBuild && this.m_pBuild.hitTestPoint(x, y);
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (pInfo.status != 1 && WorldModel.checkIsHasLock(this.m_nIid)&&this.m_pCityLock && this.m_pCityLock.visible) {
                if (iconHit || this.m_pCityLock.hitTestPoint(x, y)) {
                    Utils.open_view(TASK_UI.POP_WORLD_DIALOG_VIEW, { id: pInfo.unlockTaskId, cityId: this.m_nIid, step: WorldLockTaskStep.STATR });
                    /**新手引导点击 */
                    EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                    return true;
                }
            }

            // let item = this.getChildByName("VisitItem")
            if (this.visitItem && this.visitItem.visible && this.visitItem.hitTestPoint(x, y)) {
                Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.m_nIid });

                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                return true;
            }

            if (iconHit) {
                //判断是否是襄阳
                if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                    return this.onTouchXiangyang();
                }
                this.onTouchXiangyang();
                this.isGlow(true);
                WorldView.callFunc(WORLD_FUNC.CREAT_MENU, this.m_pBuildConfig);
                this.isShowName(false);

                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                return true;
            }
            return false;
        }
        /**检查是否是襄阳 */
        public onTouchXiangyang(): boolean {
            if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                let vo: AcEmperorBattleVO = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                if (vo) {
                    let curTime: number = TimerUtils.getServerTimeMill();
                    if (curTime < vo.preViewDate) {
                        AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW();
                    } else if (curTime < vo.closeDate) {
                        WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
                    } else {
                        Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE);
                    }
                } else {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_TITLE) + GCode(CLEnum.FUNC_UNOPEN));
                }
                return false;
            }
            return false;
        }
        /**
         * 打开菜单界面
         */
        public openMenuPanel() {
            this.isGlow(true);
            WorldView.callFunc(WORLD_FUNC.CREAT_MENU, this.m_pBuildConfig);
            this.isShowName(false);
        }
        /**是否显示选中效果 */
        public isGlow(flag: boolean) {
            Utils.isGlow(flag, this.m_pBuild);
        }

        public isShowName(val: boolean) {
            if (!this.m_pBuild_name) return;
            this.m_pBuild_name.visible = val;
        }

        public setAttackEvent() {
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (pInfo && pInfo.status == 1) {
                if (!this.m_pBattle)
                    this.__add_battle_event();

            } else {
                this.__remove_attack_event();
            }

        }

        private __remove_attack_event() {
            if (this.m_pBattle) {
                this.m_pBattle.onDestroy();
                this.m_pBattle = null;
            }
        }

        private __remove_battle_eff() {
            // if (this.m_pBattleEffect) {
            //     Utils.removeFromParent(this.m_pBattleEffect);
            //     this.m_pBattleEffect = null;
            // }


            if (this.m_pBattleEffect) {
                NormalMcMgr.removeMc(this.m_pBattleEffect);
                this.m_pBattleEffect = null;
            }
        }

        public updateCity() {
            let pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (!pInfo) {
                error(`CitySprite:_refresh_flag=========城池[${this.m_nIid}]信息为空`);
                return;
            }
            let country = pInfo.country;
            if (this.m_pBuild_name)
                this.m_pBuild_name.initData(this.m_pBuildConfig, country, GLan(this.m_pBuildConfig.name));
        }


        /** 添加光圈 */
        public addSjfhzEffect(): void {
            /**组件未初始化 */
            if (!this.m_bInit) return;

            if (this.m_pSjfhzEffect) {
                return;
            }

            if (this.m_pBuildConfig.id == 32 || this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE || this.m_pBuildConfig.type == CityType.KIING_BATTLE) {
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                if (vo && vo.isOpenIcon() && vo.activited) return;
                this.m_pSjfhzEffect = NormalMcMgr.createMc(IETypes.EUI_Sjfhz);
                // this.m_pSjfhzEffect.initAsync(IETypes.EUI_Sjfhz);
                this.m_pSjfhzEffect.x = this.width / 2;
                this.m_pSjfhzEffect.y = this.height / 2 - 50;
                this.addChild(this.m_pSjfhzEffect);
            }
        }

        /** 移除光圈特效 */
        public removeSjfhzEffect(): void {
            if (!this.m_pSjfhzEffect) return;
            NormalMcMgr.removeMc(this.m_pSjfhzEffect);
            this.m_pSjfhzEffect = null;
        }


        /**更新黄巾入侵状态 */
        private m_barAtkAni: MCDragonBones;
        private m_barTips: eui.Label;
        public async updateBarAtkState() {
            /**组件未初始化 */
            if (!this.m_bInit) return;
            // this.createBarAtkItem();

            let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
            //活动期间内处理
            if (vo && vo.isInAttReady()) {
                if (vo.cityDatas[this.m_nIid]) {
                    this.createBarAtkItem(vo.openDate);
                    return;
                }
            }
            this.removeBarAtkItem();
        }

        /**创建黄巾部队 */
        private createBarAtkItem(time: number) {
            if (this.m_barAtkAni) return;
            let name = `EWORLD_Monster_3001`
            this.m_barAtkAni = NormalMcMgr.createMc(name);
            this.m_barAtkAni.x = 0;//this.width *0.15;
            this.m_barAtkAni.y = this.height * 0.5;
            this.addChildAt(this.m_barAtkAni, 0);

            this.m_barTips = new eui.Label();
            this.m_barTips.touchEnabled = false;
            this.m_barTips.text = TimerUtils.dateFormat("hh:mm", time / 1000) + '开始攻城';
            this.m_barTips.textColor = GameConfig.TextColors.fontWhite
            this.m_barTips.size = 22;
            this.m_barTips.stroke = 2;
            this.m_barTips.x = -this.m_barTips.width * 0.5;
            this.m_barTips.y = this.height * 0.5 - 80;
            this.addChild(this.m_barTips);
            egret.callLater(() => {
                if(this.m_barTips)NodeUtils.addOtherParent(this.m_barTips, this, WorldView.getLaberLayer());
            }, this);
        }

        /**移除黄巾部队*/
        private removeBarAtkItem() {
            if (!this.m_barAtkAni) return;
            NormalMcMgr.removeMc(this.m_barAtkAni);
            this.m_barAtkAni = null;
            Utils.removeFromParent(this.m_barTips);
            this.m_barTips = null;
        }

    }
}