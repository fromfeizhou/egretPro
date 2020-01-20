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
     * 主城地图建筑
     *
     */
    var MBuild = /** @class */ (function (_super_1) {
        __extends(MBuild, _super_1);
        function MBuild(type, pos, id) {
            var _this = _super_1.call(this) || this;
            _this.m_pBuild = null; //建筑
            _this.m_pBuildOpenMenu = null; //建造图标
            // private m_pMBuildPP: MBuildPP = null;//冒泡
            _this.m_pRepair = null; //城池修理
            _this.m_pId = -1;
            _this.m_pBuildType = 0;
            _this.m_nPosId = 0; //建筑对应类型顺序
            _this.m_pPrpgress = null;
            // private m_pTainPrpgress: CCProgress = null; //训练进度条
            //建筑产出
            _this.m_pIsHaveCD = false;
            _this.m_pIsHaveOutput = false;
            _this.m_pIsAddCall = false;
            // //建筑产出兵
            // private m_pIsHaveTrainCD: boolean = false;
            // private m_pIsHaveTrainOutput: boolean = false;
            // private m_pIsTrainAddCall: boolean = false;
            _this.m_pTouchType = MBuildTouchType.None;
            _this.m_pIconStatus = MBuildIconStatus.None;
            _this.m_pIsSendZS = false;
            _this.m_pName = null;
            _this.m_pNameBG = null;
            _this.m_pLevel = null;
            _this.m_pRK = [];
            _this.m_pPKNum = 0;
            _this.m_pIsSelect = false; //建筑是否被选中
            _this.name = MBuild.NAME;
            _this.m_pBuildType = type;
            _this.m_nPosId = pos;
            _this.m_pId = id;
            _this.touchEnabled = true;
            _this.touchChildren = true;
            _this.m_pBaseLayer = new egret.DisplayObjectContainer();
            _this.addChild(_this.m_pBaseLayer);
            _this.m_pCacheLayer = new egret.DisplayObjectContainer();
            _this.m_pBaseLayer.addChild(_this.m_pCacheLayer);
            // this.m_pCacheLayer.cacheAsBitmap = true;
            _this.m_pNormalLayer = new egret.DisplayObjectContainer();
            _this.m_pBaseLayer.addChild(_this.m_pNormalLayer);
            _this.init();
            return _this;
        }
        /**
         * 销毁方法
         */
        MBuild.prototype.onDestroy = function () {
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
        };
        MBuild.create = function (type, pos, id) {
            var obj = new MBuild(type, pos, id);
            return obj;
        };
        /**添加红点事件监听 */
        MBuild.prototype.addRedPointEvent = function () {
            if (!this.m_buildTitle)
                return;
            var buildVo = MainMapModel.getBuildInfo(this.m_pId);
            if (!buildVo.isActivation())
                return;
            var res = null;
            switch (this.m_pId) {
                case MBuildId.XY: {
                    res = [RedEvtType.HEAD_QUATER];
                    break;
                }
            }
            if (res) {
                RedPointModel.AddInfoListener(this.m_buildTitle, { x: this.m_buildTitle.getTitleWidth() + 5, y: 5, scale: 0.78 }, res, 3);
            }
        };
        /**初始化建筑 */
        MBuild.prototype.init = function () {
            this.add_build();
            this.checkActivation();
            this.checkCD(false);
            // this.checkTrainCD();
            this.checkBuildItem();
            this.initName();
        };
        Object.defineProperty(MBuild.prototype, "factor", {
            get: function () {
                this.filters = [];
                return 0;
            },
            set: function (value) {
                Utils.isGlow(true, this.m_pBuild, 0xFFD000, value);
            },
            enumerable: true,
            configurable: true
        });
        MBuild.prototype.initName = function () {
            this.m_buildTitle = new com_main.BuildTitle();
            this.SetLevelText();
            Utils.addChildAt(this.m_pCacheLayer, this.m_buildTitle, 1);
            var info = this.getPosInfo();
            if (info) {
                this.m_buildTitle.x = this.width * 0.5 + info.nameOffset[0];
                this.m_buildTitle.y = info.nameOffset[1];
            }
            else {
                this.m_buildTitle.x = this.width / 2;
                this.m_buildTitle.y = -this.m_buildTitle.height * 0.5;
            }
            this.addRedPointEvent();
        };
        MBuild.prototype.SetLevelText = function () {
            if (this.m_buildTitle) {
                var buildVo = MainMapModel.getBuildInfo(this.m_pId);
                var cfgData = C.BuildingConfig[this.m_pId];
                if (cfgData) {
                    var titleText = GLan(cfgData.name);
                    if (buildVo.isActivation() && buildVo.getIsCanLvUp()) {
                        titleText += GCodeFromat(CLEnum.LEVEL1, MainMapModel.getLevel(this.m_pId));
                    }
                    this.m_buildTitle.setTitleName(titleText);
                }
                //位置调整
                var info = this.getPosInfo();
                if (info) {
                    this.m_buildTitle.x = this.width * 0.5 + info.nameOffset[0];
                    this.m_buildTitle.y = info.nameOffset[1];
                }
            }
        };
        MBuild.prototype.refreshLevel = function () {
            this.SetLevelText();
        };
        MBuild.prototype.showName = function (flag) {
            this.m_pIsSelect = !flag;
            this.checkOutput();
        };
        MBuild.prototype.showRepair = function (flag, bPlaySound) {
            if (flag === void 0) { flag = true; }
            if (bPlaySound === void 0) { bPlaySound = true; }
            if (this.m_pRepair) {
                this.m_pRepair.visible = flag;
                if (flag) {
                    this.m_pNormalLayer.setChildIndex(this.m_pRepair, 99);
                    EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EBuild_Repair, this.m_pRepair);
                    if (bPlaySound) {
                        Sound.playBuildCreate();
                    }
                }
                else {
                    this.showLevelUpEffect(bPlaySound);
                    EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EBuild_Repair, this.m_pRepair);
                }
            }
        };
        /**升级，解锁特效 */
        MBuild.prototype.showLevelUpEffect = function (bPlaySound) {
            if (bPlaySound === void 0) { bPlaySound = true; }
            if (bPlaySound) {
                var effSource = this.m_Efftype == MBuildEffType.unlock ? 'lb_zc_jscg_png' : 'lb_zc_sjcg_png';
                this.showUpGradeEffect(effSource);
                Sound.playBuildFinish();
            }
        };
        /**检测是否有产出 */
        MBuild.prototype.checkOutput = function () {
            if ((this.m_pRepair && this.m_pRepair.visible))
                return;
            var buildVo = MainMapModel.getBuildInfo(this.m_pId);
            //未激活
            if (!buildVo.isActivation())
                return;
            //建造中 隐藏 而且没有产出
            if (!buildVo.isInBuilding() && buildVo.hasOutInfo()) {
                var outInfo = buildVo.getSingleOutInfo();
                com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_PAOPAO_UPDATE, { id: this.m_pId, state: 0, type: MBuildIconStatus.ZS, value: outInfo.outVal, isMax: outInfo.outVal >= outInfo.max });
            }
            else {
                com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_PAOPAO_UPDATE, { id: this.m_pId, state: 1 });
            }
        };
        MBuild.prototype.getTouchType = function () {
            return this.m_pTouchType;
        };
        MBuild.prototype.getBuildType = function () {
            return this.m_pBuildType;
        };
        MBuild.prototype.checkBuildItem = function () {
            var isActivation = MainMapModel.isActivation(this.m_pId);
            if (!isActivation)
                return;
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
        };
        /**检测是否有cd */
        MBuild.prototype.checkCD = function (bPlaySound) {
            if (bPlaySound === void 0) { bPlaySound = false; }
            if (MainMapModel.isInBuilding(this.m_pId)) {
                if (!this.m_pIsHaveCD) {
                    if (!this.m_pIsAddCall) {
                        MainMapModel.addCall(this.time_call, this, this.m_pId);
                        this.m_pIsAddCall = true;
                    }
                    this.m_pIsHaveCD = true;
                    this.showRepair(true, bPlaySound);
                    var build = this.m_pBuild;
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
                var ti = MainMapModel.getCountDownValues(this.m_pId);
                if (ti && this.m_pPrpgress) {
                    this.m_pPrpgress.value = ti[0];
                    this.m_pPrpgress.text = ti[1];
                }
            }
            else {
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
        };
        /**训练、升级进度条 */
        MBuild.prototype.createCCProgress = function (isLvUp) {
            var pro = new com_main.CCProgress(ProgressTypes.PT_BUILD);
            var isFirst = true;
            if (this.m_pPrpgress != null)
                isFirst = false;
            var build = this.m_pBuild;
            var info = this.getPosInfo();
            var offset = info != null ? info.nameOffset : [0, 0];
            var x = build.x + build.width / 2 + offset[0];
            var y = build.y + build.height / 2;
            y = isFirst ? y : y - 15;
            pro.anchorOffsetX = pro.width / 2;
            pro.anchorOffsetY = pro.height / 2;
            pro.x = x;
            pro.y = y;
            Utils.addChild(this.m_pNormalLayer, pro);
            pro.scaleX = 1.5;
            pro.scaleY = 1.5;
            this.m_pPrpgress = pro;
        };
        MBuild.prototype.removeTimeCall = function () {
            MainMapModel.removeCall(this, this.m_pId);
            this.m_pIsAddCall = false;
            // this.m_pIsTrainAddCall = false;
        };
        MBuild.prototype.time_call = function () {
            if (this.m_pIsHaveCD)
                this.checkCD();
        };
        /**添加建筑图片 */
        MBuild.prototype.add_build = function () {
            this.m_pBuild = new egret.Bitmap(Utils.getMainBuildTexture(this.m_pBuildType));
            this.width = this.m_pBuild.width;
            this.height = this.m_pBuild.height;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            var arr = this.getPos();
            if (arr != null) {
                this.x = arr[0];
                this.y = arr[1];
            }
            Utils.addChildAt(this.m_pCacheLayer, this.m_pBuild, 0);
            var build = this.m_pBuild;
            this.m_pRepair = new egret.Bitmap();
            this.m_pRepair.width = build.width * 0.8;
            this.m_pRepair.height = build.height * 0.8;
            this.m_pRepair.x = build.width * 0.1;
            this.m_pRepair.y = build.height * 0.1;
            this.m_pRepair.visible = false;
            Utils.addChild(this.m_pNormalLayer, this.m_pRepair);
        };
        /**刷新建筑图标（丢弃 建筑资源不变） */
        MBuild.prototype.refreshBuildIcon = function () {
            if (this.m_pBuild) {
                this.m_pBuild.texture = Utils.getMainBuildTexture(this.m_pBuildType);
                this.width = this.m_pBuild.width;
                this.height = this.m_pBuild.height;
                this.anchorOffsetX = this.width / 2;
                this.anchorOffsetY = this.height / 2;
            }
        };
        /**激活状态
         * flag 是否激活：1已激活，改变回建筑形态    0：未激活
         */
        MBuild.prototype.checkActivation = function () {
            var _this = this;
            var buildVo = MainMapModel.getBuildInfo(this.m_pId);
            var isActivation = buildVo.isActivation();
            var build = this.m_pBuild;
            if (isActivation) {
                if (this.m_pBuildOpenMenu != null) {
                    this.showRepair(true);
                    this.m_pBuildOpenMenu.onDestroy();
                    Utils.removeFromParent(this.m_pBuildOpenMenu);
                    this.m_pBuildOpenMenu = null;
                    egret.Tween.get(this).wait(1000).call(function () {
                        _this.m_Efftype = MBuildEffType.unlock;
                        _this.showRepair(false);
                        _this.checkBuildItem();
                        // Guide.touchCall(GuideTargetType.MainBuild);
                        _this.showName(true);
                    }, this);
                }
                else {
                    this.checkBuildItem();
                }
                this.addRedPointEvent();
            }
            else {
                if (!this.m_pBuildOpenMenu) {
                    // let texture = RES.getRes('map_main_build_png');
                    this.m_pBuildOpenMenu = new com_main.BuildOpenMenuView();
                    var info = this.getPosInfo();
                    var offset = info != null ? info.iconOffset : [0, 0];
                    var x = build.x + build.width / 2 + offset[0];
                    var y = build.y + build.height / 2 + offset[1];
                    this.m_pBuildOpenMenu.x = x;
                    this.m_pBuildOpenMenu.y = y;
                    Utils.addChild(this.m_pCacheLayer, this.m_pBuildOpenMenu);
                }
                if (buildVo.canActivation()) {
                    this.m_pBuildOpenMenu.resreshTips(GCode(CLEnum.CITY_BD_KJS), true);
                }
                else {
                    var openLv = buildVo.getActivationLevel();
                    this.m_pBuildOpenMenu.resreshTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES, openLv), false);
                }
            }
        };
        /**
         * 检测是否点中建筑
         * 如果没点中，返回0
         * 点中则返回建筑id
         */
        MBuild.prototype.check_is_touch = function (x, y) {
            if (!this.getBaseLayerVisible())
                return;
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
        };
        MBuild.prototype.onTouch = function () {
            if (!this.getBaseLayerVisible())
                return;
            switch (this.m_pTouchType) {
                case MBuildTouchType.JZ: {
                    var buildVo = MainMapModel.getBuildInfo(this.m_pId);
                    if (!buildVo.isActivation()) {
                        if (buildVo.canActivation()) {
                            MainMapProxy.send_BUILDING_ACTIVATED(this.m_pId);
                        }
                        else {
                            var openLv = buildVo.getActivationLevel();
                            EffectUtils.showTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES1, openLv), 1, true);
                        }
                    }
                    break;
                }
                case MBuildTouchType.RK1:
                case MBuildTouchType.RK2:
                case MBuildTouchType.RK3: {
                    this.isGlow(true);
                    com_main.MainMap.moveToBuildUI(this.m_pId);
                    com_main.MainMap.m_pLastSelectBuild = this.m_pId;
                    break;
                }
            }
        };
        /**是否显示选中效果 */
        MBuild.prototype.isGlow = function (flag) {
            Utils.isGlow(flag, this.m_pBuild);
        };
        /**获取建筑坐标 */
        MBuild.prototype.getPos = function () {
            var info = this.getPosInfo();
            if (info) {
                return info.buildPos;
            }
            else {
                error('缺少坐标配置：type:', this.m_pBuildType);
                error('m_nPosId:', this.m_nPosId);
            }
            return null;
        };
        /**获取升级特效坐标 */
        MBuild.prototype.getGradeUpPos = function () {
            var info = this.getPosInfo();
            if (info) {
                return info.upLvOffset;
            }
            else {
                error('缺少升级特效坐标配置：type:', this.m_pBuildType);
                error('m_nPosId:', this.m_nPosId);
            }
            return null;
        };
        MBuild.prototype.getPosInfo = function () {
            var data = C.BuildingCoordinateConfig["build" + this.m_pBuildType + "_" + this.m_nPosId];
            if (C.BuildingCoordinateConfig["build" + this.m_pBuildType + "_" + this.m_nPosId]) {
                return {
                    buildPos: JSON.parse(data.buildPos),
                    upLvOffset: JSON.parse(data.upLvOffset),
                    nameOffset: JSON.parse(data.nameOffset),
                    iconOffset: JSON.parse(data.iconOffset),
                };
            }
            return null;
        };
        /**征收回调 */
        MBuild.prototype.zsCall = function () {
            this.m_pIsSendZS = false;
            this.checkOutput();
        };
        /**回调返回,可以选择 */
        MBuild.prototype.ReSetSendZS = function () {
            this.m_pIsSendZS = false;
        };
        MBuild.prototype.getBuild = function () {
            return this.m_pBuildOpenMenu != null ? this.m_pBuildOpenMenu : this.m_pBuild;
        };
        /**建造升级完成 */
        MBuild.prototype.showUpGradeEffect = function (imgName) {
            if (imgName === void 0) { imgName = 'lb_zc_sjcg_png'; }
            // this.refreshBuildIcon();
            //let EBuild_UpGrade:EImageSprite = null;
            var EBuild_UpGrade = null;
            var tempName = "";
            tempName = IETypes.EBuild_UpGrade;
            EBuild_UpGrade = new MCDragonBones();
            EBuild_UpGrade.initAsync(tempName);
            EBuild_UpGrade.play(tempName, 1, true);
            var tscale = this.getGradeUpScale();
            EBuild_UpGrade.scaleX = tscale;
            EBuild_UpGrade.scaleY = tscale;
            var arr = this.getGradeUpPos();
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
        };
        /**显示文本特效 */
        MBuild.prototype.showLabEffect = function (imgName) {
            var tscale = this.getGradeUpScale();
            var tx = 0;
            var ty = 0;
            var arr = this.getGradeUpPos();
            if (arr) {
                tx = arr[0];
                ty = arr[1];
            }
            var img = new eui.Image(imgName);
            img.width = 362;
            img.height = 96;
            AnchorUtil.setAnchor(img, 0.5);
            img.x = tx;
            img.y = ty;
            this.m_pNormalLayer.addChild(img);
            var actionY = img.y - img.height * tscale;
            var line = new eui.Image('line_1009_png');
            line.scale9Grid = new egret.Rectangle(247, 7, 71, 46);
            line.width = 700;
            AnchorUtil.setAnchor(line, 0.5);
            this.m_pNormalLayer.addChildAt(line, 0);
            line.x = img.x;
            line.y = actionY;
            //动画1
            var tw = egret.Tween.get(img);
            img.scaleX = 0.1;
            img.scaleY = 0.1;
            img.alpha = 0;
            tw.to({ scaleX: tscale, scaleY: tscale, alpha: 1, y: actionY }, 400, Ease.backOut);
            tw.wait(100);
            tw.to({ alpha: 0 }, 1000, Ease.cubicOut);
            tw.call(function () {
                if (img) {
                    Utils.removeFromParent(img);
                }
            }, this);
            //动画2
            var twLine = egret.Tween.get(line);
            line.scaleX = 0.1;
            line.scaleY = 0.1;
            line.alpha = 0;
            twLine.wait(200);
            twLine.to({ alpha: 1, scaleX: tscale, scaleY: tscale }, 200, Ease.backOut);
            twLine.wait(100);
            twLine.to({ alpha: 0 }, 1000, Ease.cubicOut);
            twLine.call(function () {
                if (line) {
                    Utils.removeFromParent(line);
                }
            }, this);
        };
        //根据类型获取缩放
        MBuild.prototype.getGradeUpScale = function () {
            switch (this.m_pBuildType) {
                case BuildingType.FUDING:
                // case MBuildType.WALL:
                case BuildingType.FARMLAND:
                case BuildingType.LOGGING_CAMP:
                case BuildingType.IRON_WORKS: {
                    return 0.65;
                }
                default: {
                    return 1;
                }
            }
        };
        MBuild.prototype.setClickType = function (type) {
            this.m_pTouchType = type; //MBuildTouchType.BUILD;
        };
        MBuild.prototype.getBuildId = function () {
            return this.m_pId;
        };
        /**获得建筑数据结构 */
        MBuild.prototype.getBuildVo = function () {
            return MainMapModel.getBuildInfo(this.m_pId);
        };
        /**是否可见 */
        MBuild.prototype.setBaseLayerVisible = function (value) {
            this.m_pBaseLayer.visible = value;
            this.m_buildTitle.visible = value;
        };
        MBuild.prototype.getBaseLayerVisible = function () {
            return this.m_pBaseLayer.visible;
        };
        MBuild.prototype.setLvTipsState = function (isTips) {
            this.m_buildTitle.setTipsIcon(isTips);
        };
        /**建筑是否最高级 */
        MBuild.prototype.isMaxLevel = function () {
            var NextLvCfg = this.getBuildingCfg(this.m_pBuildType, MainMapModel.getLevel(this.m_pId) + 1);
            if (!NextLvCfg) {
                return true;
            }
            else {
                return false;
            }
        };
        MBuild.prototype.getBuildingCfg = function (bType, level) {
            for (var key in C.BuildingLevelConfig) {
                var cfg = C.BuildingLevelConfig[key];
                if (cfg.buildingType == bType && cfg.level == level) {
                    return cfg;
                }
            }
            return null;
        };
        /**添加标题到地图层 */
        MBuild.prototype.addLabelToObj = function (obj) {
            if (this.m_buildTitle) {
                this.m_buildTitle.addLabelToObj(obj);
            }
        };
        MBuild.NAME = 'MBuild';
        return MBuild;
    }(egret.DisplayObjectContainer));
    com_main.MBuild = MBuild;
})(com_main || (com_main = {}));
