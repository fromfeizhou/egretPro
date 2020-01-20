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
     * 世界地图资源点
     * @export
     * @class WorldResSprite
     * @extends ResSprite
     */
    var WorldResSprite = /** @class */ (function (_super_1) {
        __extends(WorldResSprite, _super_1);
        function WorldResSprite(vo) {
            var _this = _super_1.call(this, com_main.ResType.RES) || this;
            _this.m_nTotalDt = 0;
            _this.m_nDt = 0;
            _this.m_nIid = vo.eventCoordinatesId;
            _this.evtVo = vo;
            _this.name = com_main.ResType.RES + "_" + _this.m_nIid;
            _this.x = vo.pos.x;
            _this.y = vo.pos.y;
            var cityInfo = WorldModel.getCityBuildInfo(_this.evtVo.cityId);
            _this.m_cityInfo = cityInfo;
            return _this;
        }
        WorldResSprite.create = function (vo) {
            var obj = new WorldResSprite(vo);
            return obj;
        };
        Object.defineProperty(WorldResSprite.prototype, "type", {
            get: function () {
                return this.evtVo.type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldResSprite.prototype, "subType", {
            /**获得子类型 */
            get: function () {
                return this.evtVo.subType;
            },
            enumerable: true,
            configurable: true
        });
        WorldResSprite.prototype.onDestroy = function () {
            this.onClearView();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldResSprite.prototype.onClearView = function () {
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
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, this);
        };
        WorldResSprite.prototype.onCreateView = function () {
            if (isNull(this) || isNull(this.evtVo))
                return;
            switch (this.evtVo.type) {
                case WorldEventType.FIGHT: {
                    var images = ("" + this.evtVo.image).split(",");
                    this.m_pRes = new MonsterSequece(images);
                    AnchorUtil.setAnchorCenter(this.m_pRes);
                    Utils.addChild(this, this.m_pRes);
                    break;
                }
                default: {
                    var texture = RES.getRes("map_build_icon" + this.evtVo.image + "_png");
                    this.m_pRes = PImage.create(texture);
                    this.m_pRes.width = texture.textureWidth;
                    this.m_pRes.height = texture.textureHeight;
                    AnchorUtil.setAnchorCenter(this.m_pRes);
                    NodeUtils.addOtherParent(this.m_pRes, this, com_main.WorldView.getCityLayer());
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
        };
        /**添加战斗类型事件 */
        WorldResSprite.prototype.initBattleEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBattle, this, this.onBattleClick);
        };
        // /**添加采集事件 */
        // public initCollectionEvent() {
        //     com_main.EventMgr.addEvent(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, this.onCollectTimerComplete, null);
        // }
        // /**采集定时器结束的时候销毁资源 */
        // public onCollectTimerComplete() {
        //     this.onDestroy();
        // }
        WorldResSprite.prototype.onBattleClick = function (pvt) {
            this.onResSecectedHandler();
        };
        WorldResSprite.prototype.updateShow = function () {
            /**组件未初始化 */
            if (!this.m_bInit)
                return;
            var cityInfo = WorldModel.getCityBuildInfo(this.evtVo.cityId);
            if (!cityInfo)
                return;
            this.m_pRes.visible = WorldModel.checkCityLocked(cityInfo.id);
            this.m_pLabNameLvl.visible = WorldModel.checkCityLocked(cityInfo.id) && !WorldModel.isFromUnLockFight;
        };
        WorldResSprite.prototype.createNameLevel = function () {
            this.m_pLabNameLvl = new eui.Label();
            this.m_pLabNameLvl.text = GCodeFromat(CLEnum.LEVEL1, this.evtVo.dataCfg.lv) + GLan(this.evtVo.dataCfg.name);
            this.m_pLabNameLvl.textColor = Utils.getColorOfQuality(this.evtVo.dataCfg.colour);
            this.m_pLabNameLvl.size = 20;
            this.m_pLabNameLvl.stroke = 2;
            this.m_pLabNameLvl.strokeColor = 0x000000;
            NodeUtils.setPosition(this.m_pLabNameLvl, 0, -this.height / 2 - 45);
            AnchorUtil.setAnchorCenter(this.m_pLabNameLvl);
            NodeUtils.addOtherParent(this.m_pLabNameLvl, this, com_main.WorldView.getLaberLayer());
            // egret.callLater(() => {
            //     NodeUtils.changeParentLater(this.m_pLabNameLvl, WorldView.getLaberLayer());
            // }, this);
        };
        WorldResSprite.prototype.playeffect = function (resShow) {
            if (resShow === void 0) { resShow = false; }
            /**组件未初始化 */
            if (!this.m_bInit)
                return;
            var finshEffect = new MCDragonBones();
            finshEffect.initAsync(IETypes.EBuild_UpGrade);
            finshEffect.play(IETypes.EBuild_UpGrade, 1, true);
            Utils.addChild(this, finshEffect);
            NodeUtils.setPosition(finshEffect, 20, -50);
            finshEffect.scaleX = finshEffect.scaleY = 0.8;
            if (resShow)
                this.updateShow();
        };
        /**事件移除的时候 增加飘字和特效 移除资源 */
        WorldResSprite.prototype.onEventFinish = function (evtPosIs, isVictory) {
            var _this = this;
            if (isVictory === void 0) { isVictory = true; }
            /**组件未初始化 */
            if (!this.m_bInit) {
                Utils.removeFromParent(this);
                return;
            }
            if (isVictory) {
                this.onDestroy();
                switch (this.evtVo.type) {
                    case WorldEventType.FIGHT:
                    case WorldEventType.RES_GATHER:
                    case WorldEventType.RES_COLLECT: {
                        egret.setTimeout(function () {
                            _this.playeffect();
                        }, this, 1000);
                        break;
                    }
                }
            }
            else {
                this.removeBattleEvent();
            }
            this.m_pResFinsh = new com_main.WorldResEventFinishComp();
            switch (this.type) {
                case WorldEventType.RES_GATHER: {
                    this.m_pResFinsh.updateResShow("lb_zc_cjwc_png");
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    this.m_pResFinsh.updateResShow("lb_zc_sjwc_png");
                    break;
                }
                case WorldEventType.FIGHT: {
                    if (isVictory) {
                        this.m_pResFinsh.updateResShow("lb_zc_jfcg_png");
                    }
                    else {
                        this.m_pResFinsh.updateResShow("lb_zc_sjsb_png");
                    }
                    break;
                }
            }
            NodeUtils.setScale(this.m_pResFinsh, 1);
            Utils.addChild(this, this.m_pResFinsh);
            NodeUtils.setPosition(this.m_pResFinsh, -275, -40);
            this.m_pResFinsh.m_pRes.scaleX = 0.1;
            this.m_pResFinsh.m_pRes.scaleY = 0.1;
            this.m_pResFinsh.m_pRes.alpha = 0;
            egret.Tween.get(this.m_pResFinsh.m_pRes).wait(1000).to({ scaleX: 1, scaleY: 1, alpha: 1, y: -70 }, 350, Ease.backOut).wait(500).call(function () {
                egret.Tween.removeTweens(_this.m_pResFinsh);
                Utils.removeFromParent(_this.m_pResFinsh);
                if (isVictory) {
                    Utils.removeFromParent(_this);
                }
                else {
                    _this.m_pBattle = null;
                    _this.m_pStateEff = null;
                }
            });
        };
        WorldResSprite.prototype.checkTouchEvent = function (x, y) {
            if (this.m_pBattle && this.m_pBattle.visible && this.m_pBattle.hitTestPoint(x, y)) {
                this.onResSecectedHandler();
                return true;
            }
            if (!this.m_pRes || !this.m_pRes.visible)
                return false;
            if (this.m_pRes.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.isGlow(true);
                this.onResSecectedHandler();
                this.updateLevelShow(false);
                return true;
            }
            this.updateLevelShow(this.m_pRes.visible);
            return false;
        };
        WorldResSprite.prototype.updateLevelShow = function (visible) {
            this.m_pLabNameLvl.visible = visible;
        };
        /**播放特效的时候隐藏人物资源，调整batte incon坐标*/
        WorldResSprite.prototype.updateResShow = function (visible) {
            if (visible === void 0) { visible = false; }
            this.m_pRes.visible = visible;
            this.m_pBattle.y = visible ? -85 : -125;
        };
        /**选中回调 */
        WorldResSprite.prototype.onResSecectedHandler = function () {
            var evtVo = this.evtVo;
            if (!evtVo)
                return;
            /**空的采集点 */
            if (evtVo.getTeamId() == 0) {
                if (WorldModel.isInTeamMoveRes(this.m_nIid)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_ACT_TIPS), 1, true);
                    return;
                }
                com_main.WorldView.callFunc(4 /* CREAT_RES_MENU */, this.m_nIid);
                return;
            }
            if (evtVo.type == WorldEventType.FIGHT) { //观看战斗
                BattleProxy.send_C2S_WAR_REENTRY_BATTLE(evtVo.userMapEventData.battleId);
            }
            else {
                com_main.WorldView.callFunc(4 /* CREAT_RES_MENU */, this.m_nIid);
            }
        };
        /**是否显示选中效果 */
        WorldResSprite.prototype.isGlow = function (flag) {
            Utils.isGlow(flag, this.m_pRes);
        };
        WorldResSprite.prototype.onEvent = function () {
            this.checkStatus();
        };
        /**
         * 资源的状态切换
         * @param  {number} [dt]
         * @return void
         * @memberof WorldResSprite
         */
        WorldResSprite.prototype.checkStatus = function () {
            /**组件未初始化 */
            if (!this.m_bInit)
                return;
            var evtVo = this.evtVo;
            if (!evtVo)
                return;
            if (evtVo.getTeamId() == 0)
                return;
            switch (this.type) {
                case WorldEventType.FIGHT: {
                    if (evtVo.getBattleId() !== 0) {
                        this.__add_battle_event();
                    }
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    var total = evtVo.getWorkingTime();
                    var dt = evtVo.userMapEventData.endTime - TimerUtils.getServerTime() - evtVo.userMapEventData.speedTime;
                    this.m_pProgress = WorldProgress.create(total, dt);
                    AnchorUtil.setAnchorCenter(this.m_pProgress);
                    NodeUtils.setPosition(this.m_pProgress, 0, -this.height / 2 - this.m_pProgress.height / 2 - 20);
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
        };
        WorldResSprite.prototype.__add_battle_event = function () {
            /**组件未初始化 */
            if (!this.m_bInit)
                return;
            if (this.m_pStateEff)
                return;
            var name = IETypes.EWORLD_Fire;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Fire);
            Utils.addChild(this, this.m_pStateEff);
            NodeUtils.setPosition(this.m_pStateEff, 20, -30);
            NodeUtils.setScale(this.m_pStateEff, 0.7);
            if (this.m_pBattle)
                return;
            this.m_pBattle = new com_main.WorldBattleNotify();
            this.addChild(this.m_pBattle);
            this.m_pBattle.x = -30;
            this.m_pBattle.y = -85;
            // this.m_pBattle.scaleX = .6;
            // this.m_pBattle.scaleY = .6;
            this.updateResShow(false);
            this.updateLevelShow(false);
            this.initBattleEvent();
        };
        WorldResSprite.prototype.removeBattleEvent = function () {
            Utils.removeFromParent(this.m_pBattle);
            if (this.m_pStateEff) {
                NormalMcMgr.removeMc(this.m_pStateEff);
                this.m_pStateEff = null;
            }
            this.updateResShow(true);
            this.updateLevelShow(true);
            this.isGlow(false);
        };
        WorldResSprite.prototype.__add_collect_effect = function () {
            if (this.m_pStateEff)
                return;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Collect);
            Utils.addChild(this, this.m_pStateEff);
            NodeUtils.setPosition(this.m_pStateEff, 10, -30);
            // AnchorUtil.setAnchorCenter(this.m_pStateEff)
        };
        WorldResSprite.prototype.__add_arts_effect = function () {
            if (this.m_pStateEff)
                return;
            this.m_pStateEff = NormalMcMgr.createMc(IETypes.EWORLD_Arts);
            Utils.addChild(this, this.m_pStateEff);
            NodeUtils.setPosition(this.m_pStateEff, 10, -30);
            // AnchorUtil.setAnchorCenter(this.m_pStateEff)
        };
        WorldResSprite.m_nNum = 0;
        return WorldResSprite;
    }(com_main.ResSprite));
    com_main.WorldResSprite = WorldResSprite;
    /**
     * 采集时间进度条
     * @export
     * @class WorldProgress
     * @extends egret.DisplayObjectContainer
     */
    var WorldProgress = /** @class */ (function (_super_1) {
        __extends(WorldProgress, _super_1);
        function WorldProgress(total, dt) {
            var _this = _super_1.call(this) || this;
            _this.m_nTotalDt = 0;
            _this.m_nDt = 0;
            _this.m_nTotalDt = total;
            _this.m_nDt = dt;
            _this.once(egret.Event.ADDED_TO_STAGE, _this.onEnter, _this);
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldProgress.create = function (total, dt) {
            return new WorldProgress(total, dt);
        };
        Object.defineProperty(WorldProgress.prototype, "dt", {
            get: function () {
                return this.m_nDt;
            },
            enumerable: true,
            configurable: true
        });
        WorldProgress.prototype.onEnter = function () {
            var _this = this;
            var bg = new egret.Bitmap(RES.getRes("map_build_icon-JDT-1_png"));
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
            if (this.m_nDt == 0)
                return;
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
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, function () {
                _this.m_pLbTime.visible = false;
            });
        };
        WorldProgress.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.update, this);
        };
        WorldProgress.prototype.update = function () {
            this.m_nDt--;
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(0, 1);
                com_main.EventMgr.dispatchEvent(MapNav.WORLD_COLLECT_RES_TIMER_FININSH, null);
                return;
            }
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            this.m_pMain.scaleX = 1 - (this.m_nDt / this.m_nTotalDt);
        };
        WorldProgress.prototype.$onRemoveFromStage = function () {
            Utils.TimerManager.remove(this.update, this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        return WorldProgress;
    }(egret.DisplayObjectContainer));
    com_main.WorldProgress = WorldProgress;
    var MonsterSequece = /** @class */ (function (_super_1) {
        __extends(MonsterSequece, _super_1);
        function MonsterSequece(data) {
            var _this = _super_1.call(this) || this;
            _this.m_aData = [];
            _this.width = 80;
            _this.height = 80;
            _this.$setInfo(data);
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        MonsterSequece.prototype.$setInfo = function (data) {
            this.m_aData = data;
            var len = data.length;
            this.__create_monster(data[0]);
        };
        MonsterSequece.prototype.__create_monster = function (id) {
            var name = "EWORLD_Monster_" + id;
            var res = NormalMcMgr.createMc(name);
            res.x = 40;
            res.y = 40;
            Utils.addChild(this, res);
            res.play(name, 0);
        };
        MonsterSequece.prototype.onDestroy = function () {
            var i = 0;
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var res = _a[_i];
                NormalMcMgr.removeMc(res);
                i++;
            }
            this.removeChildren();
            this.m_aData = [];
            Utils.removeFromParent(this);
        };
        return MonsterSequece;
    }(egret.DisplayObjectContainer));
    com_main.MonsterSequece = MonsterSequece;
})(com_main || (com_main = {}));
