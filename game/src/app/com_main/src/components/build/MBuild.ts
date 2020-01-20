
module com_main {
    export interface IBuildPos {
        /**建筑位置 */
        buildPos: Array<number>;
        /**升级特效偏移 原点偏移*/
        upLvOffset: Array<number>;
        /**名字偏移 顶中心偏移*/
        nameOffset: Array<number>;
        /**图标中心偏移 中心偏移*/
        iconOffset: Array<number>;
    }
	/**
	 * 主城地图建筑
     * 
	 */
    export class MBuild extends egret.DisplayObjectContainer {
        public static NAME = 'MBuild';

        private m_pBaseLayer: egret.DisplayObjectContainer;  //建筑基本容器
        private m_pCacheLayer: egret.DisplayObjectContainer;  //建筑基本容器（静态）
        private m_pNormalLayer: egret.DisplayObjectContainer;  //建筑基本容器(动态)
        public m_pBuild: egret.Bitmap = null;//建筑
        private m_pBuildOpenMenu: BuildOpenMenuView = null;//建造图标
        // private m_pMBuildPP: MBuildPP = null;//冒泡

        private m_pRepair: egret.Bitmap = null;//城池修理

        private m_pId = -1;
        private m_pBuildType: BuildingType = 0;
        private m_nPosId: number = 0;   //建筑对应类型顺序

        private m_pPrpgress: CCProgress = null;
        // private m_pTainPrpgress: CCProgress = null; //训练进度条
        //建筑产出
        private m_pIsHaveCD: boolean = false;
        private m_pIsHaveOutput: boolean = false;
        private m_pIsAddCall: boolean = false;

        // //建筑产出兵
        // private m_pIsHaveTrainCD: boolean = false;
        // private m_pIsHaveTrainOutput: boolean = false;
        // private m_pIsTrainAddCall: boolean = false;

        private m_pTouchType: number = MBuildTouchType.None;
        private m_pIconStatus: number = MBuildIconStatus.None;
        private m_pIsSendZS: boolean = false;

        private m_pName: egret.Bitmap = null;
        private m_pNameBG: egret.Bitmap = null;
        private m_pLevel: eui.Label = null;

        private m_pRK: any[] = [];
        private m_pPKNum: number = 0;

        private m_rkBg: eui.Image;

        private m_buildTitle: BuildTitle;
        private m_pIsSelect: boolean = false;//建筑是否被选中

        private m_speedBtn: BuildFunctionMenuCell; //建筑顶部加速按钮
        public m_Efftype: MBuildEffType; //建筑升级类型（升级，解锁）

		/**
         * 销毁方法
         */
        public onDestroy() {
            egret.Tween.removeTweens(this);
            this.showRepair(false, false);

            this.removeTimeCall();
            var self = this;

            Utils.removeFromParent(self.m_pBuild);
            self.m_pBuild = null;

            if (self.m_pBuildOpenMenu) {
                self.m_pBuildOpenMenu.onDestroy();
                Utils.removeFromParent(self.m_pBuildOpenMenu);
                self.m_pBuildOpenMenu = null;
            }

            delete this.m_pRepair;
            this.m_pRepair = null;
        }

        public static create(type: BuildingType, pos: number, id: number): MBuild {
            var obj = new MBuild(type, pos, id);
            return obj;
        }

        /**添加红点事件监听 */
        public addRedPointEvent(): void {
            if (!this.m_buildTitle) return;
            let buildVo = MainMapModel.getBuildInfo(this.m_pId);
            if (!buildVo.isActivation()) return;
            let res = null;
            switch (this.m_pId) {
                case MBuildId.XY: {
                    res = [RedEvtType.HEAD_QUATER];
                    break;
                }
            }
            if (res) {
                RedPointModel.AddInfoListener(this.m_buildTitle, { x: this.m_buildTitle.getTitleWidth() + 5, y: 5,scale:0.78}, res, 3);
            }
        }

        public constructor(type: BuildingType, pos: number, id: number) {
            super();

            this.name = MBuild.NAME;
            this.m_pBuildType = type;
            this.m_nPosId = pos;
            this.m_pId = id;

            this.touchEnabled = true;
            this.touchChildren = true;
            this.m_pBaseLayer = new egret.DisplayObjectContainer();
            this.addChild(this.m_pBaseLayer);

            this.m_pCacheLayer = new egret.DisplayObjectContainer();
            this.m_pBaseLayer.addChild(this.m_pCacheLayer);
            // this.m_pCacheLayer.cacheAsBitmap = true;

            this.m_pNormalLayer = new egret.DisplayObjectContainer();
            this.m_pBaseLayer.addChild(this.m_pNormalLayer);
            this.init();
        }

        /**初始化建筑 */
        private init() {
            this.add_build();
            this.checkActivation();
            this.checkCD(false);
            // this.checkTrainCD();
            this.checkBuildItem();
            this.initName();

        }

        public get factor(): number {
            this.filters = [];
            return 0;
        }

        public set factor(value: number) {
            Utils.isGlow(true, this.m_pBuild, 0xFFD000, value)
        }

        private initName() {
            this.m_buildTitle = new BuildTitle();
            this.SetLevelText();
            Utils.addChildAt(this.m_pCacheLayer, this.m_buildTitle, 1);

            let info = this.getPosInfo();
            if (info) {
                this.m_buildTitle.x = this.width * 0.5 + info.nameOffset[0];
                this.m_buildTitle.y = info.nameOffset[1];

            }
            else {
                this.m_buildTitle.x = this.width / 2;
                this.m_buildTitle.y = -this.m_buildTitle.height * 0.5;
            }
            this.addRedPointEvent();
        }

        private SetLevelText() {
            if (this.m_buildTitle) {
                let buildVo = MainMapModel.getBuildInfo(this.m_pId);
                let cfgData = C.BuildingConfig[this.m_pId];
                if (cfgData) {
                    let titleText = GLan(cfgData.name);

                    if (buildVo.isActivation() && buildVo.getIsCanLvUp()) {
                        titleText += GCodeFromat(CLEnum.LEVEL1, MainMapModel.getLevel(this.m_pId));
                    }

                    this.m_buildTitle.setTitleName(titleText);
                }
                //位置调整
                let info = this.getPosInfo();
                if (info) {
                    this.m_buildTitle.x = this.width * 0.5 + info.nameOffset[0];
                    this.m_buildTitle.y = info.nameOffset[1];
                }
            }
        }

        public refreshLevel() {
            this.SetLevelText();
        }

        public showName(flag: boolean) {
            this.m_pIsSelect = !flag;
            this.checkOutput();
        }

        private showRepair(flag: boolean = true, bPlaySound: boolean = true) {
            if (this.m_pRepair) {
                this.m_pRepair.visible = flag;
                if (flag) {
                    this.m_pNormalLayer.setChildIndex(this.m_pRepair, 99);
                    EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EBuild_Repair, this.m_pRepair);
                    if (bPlaySound) {
                        Sound.playBuildCreate();
                    }
                } else {
                    this.showLevelUpEffect(bPlaySound);
                    EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EBuild_Repair, this.m_pRepair);

                }
            }
        }
        /**升级，解锁特效 */
        public showLevelUpEffect(bPlaySound: boolean = true) {
            if (bPlaySound) {
                let effSource = this.m_Efftype == MBuildEffType.unlock ? 'lb_zc_jscg_png' : 'lb_zc_sjcg_png';
                this.showUpGradeEffect(effSource);
                Sound.playBuildFinish();
            }
        }

        /**检测是否有产出 */
        public checkOutput() {
            if ((this.m_pRepair && this.m_pRepair.visible)) return;
            let buildVo = MainMapModel.getBuildInfo(this.m_pId);
            //未激活
            if (!buildVo.isActivation()) return;

            //建造中 隐藏 而且没有产出
            if (!buildVo.isInBuilding() && buildVo.hasOutInfo()) {
                let outInfo = buildVo.getSingleOutInfo();
                EventMgr.dispatchEvent(BuildEvent.BUILD_PAOPAO_UPDATE, { id: this.m_pId, state: 0, type: MBuildIconStatus.ZS, value: outInfo.outVal, isMax: outInfo.outVal >= outInfo.max } as IBuildPP);
            } else {
                EventMgr.dispatchEvent(BuildEvent.BUILD_PAOPAO_UPDATE, { id: this.m_pId, state: 1 } as IBuildPP);
            }
        }

        public getTouchType(): number {

            return this.m_pTouchType;
        }

        public getBuildType(): BuildingType {
            return this.m_pBuildType;
        }

        public checkBuildItem() {
            let isActivation = MainMapModel.isActivation(this.m_pId);
            if (!isActivation) return;
            this.checkOutput();
            // let type = MainMapModel.getBuildItem(this.m_pId);
            // if (type && !this.m_pMBuildPP) {
            //     this.m_pMBuildPP = MBuildPP.create(type, MBuildIconStatus.BuildItem);

            //     Utils.addChild(this.m_pCacheLayer, this.m_pMBuildPP);

            //     let build = this.m_pBuild;

            //     this.m_pMBuildPP.x = build.x + build.width / 2 - this.m_pMBuildPP.width / 2;
            //     this.m_pMBuildPP.y = build.y + build.height / 2 - this.m_pMBuildPP.height - 10;

            // } else if (!type && this.m_pMBuildPP && this.m_pMBuildPP.type == MBuildIconStatus.BuildItem) {
            //     if (this.m_pMBuildPP) {
            //         Utils.removeFromParent(this.m_pMBuildPP);
            //         this.m_pMBuildPP = null;
            //     }
            // }
        }

        /**检测是否有cd */
        public checkCD(bPlaySound: boolean = false) {
            if (MainMapModel.isInBuilding(this.m_pId)) {
                if (!this.m_pIsHaveCD) {
                    if (!this.m_pIsAddCall) {
                        MainMapModel.addCall(this.time_call, this, this.m_pId);
                        this.m_pIsAddCall = true;
                    }

                    this.m_pIsHaveCD = true;
                    this.showRepair(true, bPlaySound);

                    let build = this.m_pBuild;

                    //Utils.isGray(true, build);

                    // this.m_pPrpgress = new CCProgress(ProgressTypes.PT_BUILD);
                    // let pro = this.m_pPrpgress;
                    // pro.anchorOffsetX = pro.width / 2;
                    // pro.anchorOffsetY = pro.height;

                    // pro.x = build.x + build.width / 2;
                    // pro.y = build.y - 20;

                    // Utils.addChild(this.m_pNormalLayer, pro);
                    this.createCCProgress(true);
                }

                let ti = MainMapModel.getCountDownValues(this.m_pId);
                if (ti && this.m_pPrpgress) {
                    this.m_pPrpgress.value = ti[0];
                    this.m_pPrpgress.text = ti[1];
                }
            } else {
                if (this.m_pIsHaveCD) {
                    if (this.m_pPrpgress) {
                        Utils.removeFromParent(this.m_pPrpgress);
                        this.m_pPrpgress = null;
                    }

                    if (this.m_speedBtn) {
                        Utils.removeFromParent(this.m_speedBtn);
                        this.m_speedBtn = null;
                    }

                    this.m_pIsHaveCD = false;
                    this.m_Efftype = MBuildEffType.UpLevel;
                    this.showRepair(false);

                    Utils.isGray(false, this.m_pBuild);

                    if (!this.m_pIsHaveOutput)
                        this.removeTimeCall();
                }
            }

            this.checkOutput();
        }

        /**训练、升级进度条 */
        private createCCProgress(isLvUp: boolean) {
            let pro = new CCProgress(ProgressTypes.PT_BUILD);
            let isFirst = true;
            if (this.m_pPrpgress != null)
                isFirst = false;

            let build = this.m_pBuild;
            let info = this.getPosInfo();
            let offset = info != null ? info.nameOffset : [0, 0];

            let x = build.x + build.width / 2 + offset[0];
            let y = build.y + build.height / 2;

            y = isFirst ? y : y - 15;
            pro.anchorOffsetX = pro.width / 2;
            pro.anchorOffsetY = pro.height / 2;
            pro.x = x;
            pro.y = y;

            Utils.addChild(this.m_pNormalLayer, pro);
            pro.scaleX = 1.5;
            pro.scaleY = 1.5;
            this.m_pPrpgress = pro;

        }

        private removeTimeCall() {
            MainMapModel.removeCall(this, this.m_pId);
            this.m_pIsAddCall = false;
            // this.m_pIsTrainAddCall = false;
        }

        public time_call() {
            if (this.m_pIsHaveCD)
                this.checkCD();
        }

        /**添加建筑图片 */
        private add_build() {

            this.m_pBuild = new egret.Bitmap(Utils.getMainBuildTexture(this.m_pBuildType));

            this.width = this.m_pBuild.width;
            this.height = this.m_pBuild.height;

            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;

            let arr = this.getPos();
            if (arr != null) {
                this.x = arr[0];
                this.y = arr[1];
            }

            Utils.addChildAt(this.m_pCacheLayer, this.m_pBuild, 0);

            let build = this.m_pBuild;
            this.m_pRepair = new egret.Bitmap();
            this.m_pRepair.width = build.width * 0.8;
            this.m_pRepair.height = build.height * 0.8;
            this.m_pRepair.x = build.width * 0.1;
            this.m_pRepair.y = build.height * 0.1;
            this.m_pRepair.visible = false;

            Utils.addChild(this.m_pNormalLayer, this.m_pRepair);

        }

        /**刷新建筑图标（丢弃 建筑资源不变） */
        private refreshBuildIcon() {
            if (this.m_pBuild) {
                this.m_pBuild.texture = Utils.getMainBuildTexture(this.m_pBuildType);
                this.width = this.m_pBuild.width;
                this.height = this.m_pBuild.height;

                this.anchorOffsetX = this.width / 2;
                this.anchorOffsetY = this.height / 2;
            }
        }

        /**激活状态
         * flag 是否激活：1已激活，改变回建筑形态    0：未激活
         */
        public checkActivation() {
            let buildVo = MainMapModel.getBuildInfo(this.m_pId);
            let isActivation = buildVo.isActivation();
            let build = this.m_pBuild;
            if (isActivation) {
                if (this.m_pBuildOpenMenu != null) {
                    this.showRepair(true);

                    this.m_pBuildOpenMenu.onDestroy();
                    Utils.removeFromParent(this.m_pBuildOpenMenu);
                    this.m_pBuildOpenMenu = null;

                    egret.Tween.get(this).wait(1000).call(() => {
                        this.m_Efftype = MBuildEffType.unlock;
                        this.showRepair(false);
                        this.checkBuildItem();
                        // Guide.touchCall(GuideTargetType.MainBuild);
                        this.showName(true);
                    }, this);

                } else {
                    this.checkBuildItem();
                }

                this.addRedPointEvent();
            } else {
                if (!this.m_pBuildOpenMenu) {
                    // let texture = RES.getRes('map_main_build_png');
                    this.m_pBuildOpenMenu = new BuildOpenMenuView();
                    let info = this.getPosInfo();
                    let offset = info != null ? info.iconOffset : [0, 0];

                    let x = build.x + build.width / 2 + offset[0];
                    let y = build.y + build.height / 2 + offset[1];

                    this.m_pBuildOpenMenu.x = x;
                    this.m_pBuildOpenMenu.y = y;

                    Utils.addChild(this.m_pCacheLayer, this.m_pBuildOpenMenu);

                }
                if (buildVo.canActivation()) {
                    this.m_pBuildOpenMenu.resreshTips(GCode(CLEnum.CITY_BD_KJS), true);
                } else {
                    let openLv = buildVo.getActivationLevel();
                    this.m_pBuildOpenMenu.resreshTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES, openLv), false);
                }
            }
        }

        /**
		 * 检测是否点中建筑
		 * 如果没点中，返回0
		 * 点中则返回建筑id
		 */
        public check_is_touch(x: number, y: number): number {
            if (!this.getBaseLayerVisible()) return;
            var build_id = 0;
            var self = this;

            // if (self.m_pMBuildPP && self.m_pMBuildPP.visible) {
            //     if (self.m_pMBuildPP.hitTestPoint(x, y)) {
            //         this.m_pTouchType = MBuildTouchType.ICON;
            //         return this.m_pId;
            //     }
            // }

            if (self.m_pBuild.hitTestPoint(x, y)) {
                if (self.m_pBuildOpenMenu) {
                    this.m_pTouchType = MBuildTouchType.JZ;
                    return this.m_pId;
                }

                this.m_pTouchType = MBuildTouchType.BUILD;
                return this.m_pId;
            }

            return build_id;
        }

        public onTouch() {
            if (!this.getBaseLayerVisible()) return;
            switch (this.m_pTouchType) {
                case MBuildTouchType.JZ: {
                    let buildVo = MainMapModel.getBuildInfo(this.m_pId);
                    if (!buildVo.isActivation()) {
                        if (buildVo.canActivation()) {
                            MainMapProxy.send_BUILDING_ACTIVATED(this.m_pId);
                        } else {
                            let openLv = buildVo.getActivationLevel();
                            EffectUtils.showTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES1, openLv), 1, true);
                        }
                    }
                    break;
                }

                case MBuildTouchType.RK1:
                case MBuildTouchType.RK2:
                case MBuildTouchType.RK3: {
                    this.isGlow(true);
                    MainMap.moveToBuildUI(this.m_pId);
                    MainMap.m_pLastSelectBuild = this.m_pId;
                    break;
                }
            }

        }

        /**是否显示选中效果 */
        public isGlow(flag: boolean) {
            Utils.isGlow(flag, this.m_pBuild);
        }

        /**获取建筑坐标 */
        public getPos() {
            let info = this.getPosInfo();
            if (info) {
                return info.buildPos;
            } else {
                error('缺少坐标配置：type:', this.m_pBuildType);
                error('m_nPosId:', this.m_nPosId);
            }

            return null;
        }

        /**获取升级特效坐标 */
        public getGradeUpPos() {
            let info = this.getPosInfo();
            if (info) {
                return info.upLvOffset;
            } else {
                error('缺少升级特效坐标配置：type:', this.m_pBuildType);
                error('m_nPosId:', this.m_nPosId);
            }

            return null;
        }

        public getPosInfo(): IBuildPos {
            let data = C.BuildingCoordinateConfig["build" + this.m_pBuildType + "_" + this.m_nPosId];
            if (C.BuildingCoordinateConfig["build" + this.m_pBuildType + "_" + this.m_nPosId]) {
                return <IBuildPos>{
                    buildPos: JSON.parse(data.buildPos),
                    upLvOffset: JSON.parse(data.upLvOffset),
                    nameOffset: JSON.parse(data.nameOffset),
                    iconOffset: JSON.parse(data.iconOffset),
                };
            }
            return null;
        }

        /**征收回调 */
        public zsCall() {
            this.m_pIsSendZS = false;
            this.checkOutput();
        }
        /**回调返回,可以选择 */
        public ReSetSendZS() {
            this.m_pIsSendZS = false;
        }


        public getBuild(): any {
            return this.m_pBuildOpenMenu != null ? this.m_pBuildOpenMenu : this.m_pBuild;
        }


        /**建造升级完成 */
        public showUpGradeEffect(imgName: string = 'lb_zc_sjcg_png') {
            // this.refreshBuildIcon();
            //let EBuild_UpGrade:EImageSprite = null;
            let EBuild_UpGrade: MCDragonBones = null;
            let tempName: string = "";
            tempName = IETypes.EBuild_UpGrade;
            EBuild_UpGrade = new MCDragonBones();
            EBuild_UpGrade.initAsync(tempName);
            EBuild_UpGrade.play(tempName, 1, true);
            let tscale = this.getGradeUpScale();
            EBuild_UpGrade.scaleX = tscale;
            EBuild_UpGrade.scaleY = tscale;
            let arr = this.getGradeUpPos();
            if (arr != null) {
                EBuild_UpGrade.x = arr[0];
                EBuild_UpGrade.y = arr[1];
            }
            this.m_pNormalLayer.addChild(EBuild_UpGrade);
            this.refreshLevel();
            if (this.m_pBuildType == BuildingType.AUDIENCE_HALL) {
                Utils.open_view(TASK_UI.POP_BUILD_LEVEL_UP_VIEW, { id: this.m_pId, type: LevelUpConditionType.BUILDING_LEVEL });
            }

            this.showLabEffect(imgName);
        }

        /**显示文本特效 */
        public showLabEffect(imgName: string) {
            let tscale = this.getGradeUpScale();
            let tx = 0;
            let ty = 0;
            let arr = this.getGradeUpPos();
            if (arr) {
                tx = arr[0];
                ty = arr[1];
            }

            let img = new eui.Image(imgName);
            img.width = 362;
            img.height = 96;
            AnchorUtil.setAnchor(img, 0.5);

            img.x = tx;
            img.y = ty;
            this.m_pNormalLayer.addChild(img);
            let actionY = img.y - img.height * tscale;

            let line = new eui.Image('line_1009_png');
            line.scale9Grid = new egret.Rectangle(247, 7, 71, 46);
            line.width = 700;
            AnchorUtil.setAnchor(line, 0.5);
            this.m_pNormalLayer.addChildAt(line, 0);
            line.x = img.x;
            line.y = actionY;

            //动画1
            let tw = egret.Tween.get(img);
            img.scaleX = 0.1;
            img.scaleY = 0.1;
            img.alpha = 0;

            tw.to({ scaleX: tscale, scaleY: tscale, alpha: 1, y: actionY }, 400, Ease.backOut);
            tw.wait(100);
            tw.to({ alpha: 0 }, 1000, Ease.cubicOut);
            tw.call(() => {
                if (img) {
                    Utils.removeFromParent(img);
                }
            }, this);

            //动画2
            let twLine = egret.Tween.get(line);
            line.scaleX = 0.1;
            line.scaleY = 0.1;
            line.alpha = 0;
            twLine.wait(200);
            twLine.to({ alpha: 1, scaleX: tscale, scaleY: tscale }, 200, Ease.backOut);
            twLine.wait(100);
            twLine.to({ alpha: 0 }, 1000, Ease.cubicOut);
            twLine.call(() => {
                if (line) {
                    Utils.removeFromParent(line);
                }
            }, this);
        }
        //根据类型获取缩放
        private getGradeUpScale(): number {
            switch (this.m_pBuildType) {
                case BuildingType.FUDING:
                // case MBuildType.WALL:
                case BuildingType.FARMLAND:
                case BuildingType.LOGGING_CAMP:
                case BuildingType.IRON_WORKS: {
                    return 0.65;
                } default: {
                    return 1;
                }
            }
        }

        public setClickType(type: number) {
            this.m_pTouchType = type;//MBuildTouchType.BUILD;
        }

        public getBuildId() {
            return this.m_pId;
        }

        /**获得建筑数据结构 */
        public getBuildVo(): MainMapBuildVo {
            return MainMapModel.getBuildInfo(this.m_pId);
        }
        /**是否可见 */
        public setBaseLayerVisible(value) {
            this.m_pBaseLayer.visible = value;
            this.m_buildTitle.visible = value;
        }

        public getBaseLayerVisible(): boolean {
            return this.m_pBaseLayer.visible;
        }

        public setLvTipsState(isTips: boolean) {
            this.m_buildTitle.setTipsIcon(isTips);
        }

        /**建筑是否最高级 */
        public isMaxLevel() {
            let NextLvCfg = this.getBuildingCfg(this.m_pBuildType, MainMapModel.getLevel(this.m_pId) + 1);
            if (!NextLvCfg) {
                return true;
            } else {
                return false;
            }
        }

        private getBuildingCfg(bType: number, level: number) {
            for (let key in C.BuildingLevelConfig) {
                let cfg = C.BuildingLevelConfig[key];
                if (cfg.buildingType == bType && cfg.level == level) {
                    return cfg;
                }
            }
            return null;
        }

        /**添加标题到地图层 */
        public addLabelToObj(obj: egret.DisplayObjectContainer) {
            if (this.m_buildTitle) {
                this.m_buildTitle.addLabelToObj(obj);
            }
        }
    }
}