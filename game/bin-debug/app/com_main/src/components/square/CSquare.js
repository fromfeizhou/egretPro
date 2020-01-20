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
     * 方阵管理
     */
    var CSquare = /** @class */ (function (_super_1) {
        __extends(CSquare, _super_1);
        /**
         * data.num = 方正类型
         */
        function CSquare(vo) {
            var _this = _super_1.call(this) || this;
            /**
             * 方阵配置ID
             */
            _this.m_pCID = 0;
            /**
             * 方阵类型
             */
            _this.m_pType = CSquare_Type.TYPE_1;
            /**
             * 旗帜
             * 1 : 红,敌方
             * 2 : 绿,友方
             * 3 : 蓝,己方
             */
            _this.m_flagEffectId = 1;
            /**
             * 兵种编号
             */
            _this.m_pSoldiersCode = 0;
            /**
             * 临时兵种信息
             */
            _this.m_pTempSoldiers = { code: 0, x: 0, y: 0 };
            /**
             * 士兵图片列表
             */
            _this.m_pSoldiersList = [];
            // /**
            //  * 已阵亡士兵列表
            //  */
            // private m_pSoldiersDeadList: Array<egret.Bitmap> = [];
            /**
             * 图片帧处理类
             */
            _this.m_pSpriteAnimates = null;
            /**
             * 士兵层
             */
            _this.m_pSoliderNode = null;
            /**
             * 身体中点特效层
             */
            _this.m_pEffectNode = null;
            /**
             * 头顶特效层
             */
            _this.m_pEffectTopNode = null;
            /**
             * 脚底特效层
             */
            _this.m_pEffectFootNode = null;
            /**
             * 其它信息层
             */
            _this.m_pOtherInfoNode = null;
            /**
             * 特效列表
             */
            _this.m_pEffectList = {};
            /**
             * 头像
             */
            _this.m_pHeadInfo = null;
            /**
             * 小兵血条
             */
            _this.m_pSoliderHpBar = null;
            /**
             * 当前状态
             */
            _this.m_pStatus = CSquare_Status.STATUS_STAND;
            /**
             * 方向
             *
             * 	5  6  7
             * 	4     8
             * 	3  2  1
             *  8个方向
             */
            _this.m_pDirection = CSquare_Direction.RIGHT;
            /**
             * 是否反面
             */
            _this.m_pIsReverse = false;
            /**
             * 状态动作播放完后的回调
             */
            _this.m_pActionFinishCallback = null;
            /**
             * 回调对象
             */
            _this.m_pActionFinishObject = null;
            /**
             * 士兵数量
             */
            _this.m_soldieNum = 0;
            /**
             * 总士兵数量
             */
            _this.m_totalSoldierNum = 0;
            /**
             * 最大高度
             */
            _this.m_maxHeight = 0;
            /**
             * 最大宽度
             */
            _this.m_maxWidth = 0;
            /**
             * 帧频类型
             */
            _this.m_fpsType = 0;
            /**
             * 士兵纹理集
             */
            _this.m_textureSheet = {};
            /**
             * 仅动画
             */
            _this.m_justAnim = false;
            /**是否完成资源加载 */
            _this.m_isResLoadComplete = false;
            /**待添加的特效 */
            _this.m_toAddEffect = {};
            /**
             * 展示用
             */
            _this.isManual = false;
            /**
             * buff 列表
             * 有三个bug列表
             */
            // private buffList: any[][];
            // private buffImageList: any[];
            _this.isHitEffect = false;
            /**是否逃跑中 */
            _this.isRunAway = false;
            _this.isStartSkill = false;
            /**
             * 测试用
             */
            _this.isTest = false;
            _this.init(vo);
            return _this;
        }
        Object.defineProperty(CSquare.prototype, "manual", {
            get: function () {
                return this.isManual;
            },
            set: function (v) {
                this.isManual = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "test", {
            set: function (v) {
                this.isTest = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "maxWidth", {
            get: function () {
                return this.m_maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "maxHeight", {
            get: function () {
                return this.m_maxHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "justAnim", {
            set: function (v) {
                this.m_justAnim = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "isLive", {
            get: function () {
                return this.m_isLife;
            },
            set: function (is) {
                this.m_isLife = is;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "isRun", {
            /**是否逃跑 */
            get: function () {
                return this.isRunAway;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "CID", {
            get: function () {
                return this.m_pCID;
            },
            enumerable: true,
            configurable: true
        });
        CSquare.create = function (vo) {
            var obj = new com_main.CSquare(vo);
            return obj;
        };
        CSquare.createId = function (cid, anim, manual) {
            if (anim === void 0) { anim = true; }
            if (manual === void 0) { manual = false; }
            // let obj: CSquare = ObjectPool.pop("com_main.CSquare");
            var obj = new com_main.CSquare();
            obj.justAnim = anim;
            obj.manual = manual;
            obj.initId(cid);
            // obj.init();
            return obj;
        };
        CSquare.prototype.init = function (vo) {
            this.m_pWidth = Square_Width;
            this.m_pHeight = Square_Height;
            this.width = Square_Width;
            this.height = Square_Height;
            this.m_pFrameEffect = FrameExecutor.create();
            _super_1.prototype.init.call(this);
            this.alpha = 1;
            //添加了屏幕外隐藏功能需要这句
            this.visible = true;
            if (vo) {
                this.m_unitType = vo.type;
            }
            this.setUnitInfo(vo);
            if (this.getUnitInfo()) {
                // this.addTitle();   //显示血条
                // this.addBarBlood();
                this.initConfig();
            }
            // this.soldierPositionList = [];
            // if (this.getUnitInfo()) {
            // 	this.initConfig();
            // 	// this.drawDiamond();
            // 	// this.drawRect();
            // }
            // this.drawRect();
            // this.buffList = [];
            // this.buffList[BuffType.HEAD_ONEC_BUFF] = [];
            // this.buffList[BuffType.HEAD_CONTINUE_BUFF] = [];
            // this.buffList[BuffType.BODY_CONTINUE_BUFF] = [];
            // this.buffImageList = [];
            this.isHitEffect = false;
            if (this.m_unitType == UnitType.GENERAL || this.justAnim || this.manual) {
                this.showHeadInfo();
            }
            if (this.m_unitType == UnitType.GENERAL) {
                this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
            }
            else if (this.m_unitType == UnitType.SOLDIER) {
                this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_SOLIDER_SCALE);
            }
            this.isStartSkill = false;
            this.isLive = true;
            this.isRunAway = false;
            this.isRestrain = false;
        };
        CSquare.prototype.initId = function (cid) {
            this.m_pCID = cid;
            this.width = Square_Width;
            this.height = Square_Height;
            if (this.m_pCID > 0) {
                this.initConfig();
                // this.drawDiamond();
            }
        };
        CSquare.prototype.initContainer = function () {
            if (!this.m_pContainerLevel1) {
                this.m_pContainerLevel1 = new egret.DisplayObjectContainer();
                Utils.addChild(this, this.m_pContainerLevel1);
            }
            if (!this.m_pContainerLevel2) {
                this.m_pContainerLevel2 = new egret.DisplayObjectContainer();
                Utils.addChild(this, this.m_pContainerLevel2);
            }
            if (!this.m_pContainerLevel3) {
                this.m_pContainerLevel3 = new egret.DisplayObjectContainer();
                Utils.addChild(this, this.m_pContainerLevel3);
            }
            //身体中点特效
            if (this.m_pEffectNode == null) {
                this.m_pEffectNode = new egret.DisplayObjectContainer();
                Utils.addChild(this.m_pContainerLevel2, this.m_pEffectNode);
            }
            //头顶特效节点
            if (this.m_pEffectTopNode == null) {
                this.m_pEffectTopNode = new egret.DisplayObjectContainer();
                Utils.addChild(this.m_pContainerLevel2, this.m_pEffectTopNode);
            }
            //脚底特效节点
            if (this.m_pEffectFootNode == null) {
                this.m_pEffectFootNode = new egret.DisplayObjectContainer();
                Utils.addChild(this.m_pContainerLevel1, this.m_pEffectFootNode);
            }
            //其它信息层
            if (this.m_pOtherInfoNode == null) {
                this.m_pOtherInfoNode = new egret.DisplayObjectContainer();
                // this.addChild(this.m_pOtherInfoNode);
                Utils.addChild(this.m_pContainerLevel3, this.m_pOtherInfoNode);
            }
            //显示在最上面
            // super.initContainer();
        };
        CSquare.prototype.reset = function (vo) {
            egret.Tween.removeTweens(this);
            // this.onCleanup();
            this.init(vo);
            var effect = com_main.CEffectFunc.addEffect(9);
            effect.x = this.x;
            effect.y = this.y;
            effect.play();
        };
        CSquare.prototype.getId = function () {
            return this.id;
        };
        /**因为addChild时候不派发事件，所以要在外部调用 */
        CSquare.prototype.onAddToStage = function () {
            _super_1.prototype.onAddToStage.call(this);
        };
        /**
         * 销毁方法
         */
        CSquare.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.onCleanup();
        };
        CSquare.prototype.onCleanup = function () {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.removeAction();
                this.m_pSpriteAnimates = null;
            }
            if (this.m_pSoliderNode) {
                Utils.removeFromParent(this.m_pSoliderNode);
                this.m_pSoliderNode = null;
            }
            if (this.m_pEffectNode) {
                Utils.removeFromParent(this.m_pEffectNode);
                this.m_pEffectNode = null;
            }
            if (this.m_pEffectTopNode) {
                Utils.removeFromParent(this.m_pEffectTopNode);
                this.m_pEffectTopNode = null;
            }
            if (this.m_pEffectFootNode) {
                Utils.removeFromParent(this.m_pEffectFootNode);
                this.m_pEffectFootNode = null;
            }
            if (this.m_pOtherInfoNode) {
                Utils.removeFromParent(this.m_pOtherInfoNode);
                this.m_pOtherInfoNode = null;
            }
            if (this.m_pHeadInfo) {
                Utils.removeFromParent(this.m_pHeadInfo);
                this.m_pHeadInfo = null;
            }
            if (this.m_pSoliderHpBar) {
                this.m_pSoliderHpBar.onDestroy();
                this.m_pSoliderHpBar = null;
            }
            if (this.m_pContainerLevel1) {
                Utils.removeFromParent(this.m_pContainerLevel1);
                this.m_pContainerLevel1 = null;
            }
            if (this.m_pContainerLevel2) {
                Utils.removeFromParent(this.m_pContainerLevel2);
                this.m_pContainerLevel2 = null;
            }
            if (this.m_pContainerLevel3) {
                Utils.removeFromParent(this.m_pContainerLevel3);
                this.m_pContainerLevel3 = null;
            }
            if (this.m_pFrameEffect) {
                this.m_pFrameEffect.onDestroy();
                this.m_pFrameEffect = null;
            }
            this.m_textureSheet = null;
            this.m_toPerformDirection = null;
            this.m_toPerformStatus = null;
            this.m_isResLoadComplete = false;
            this.cleanAllEffect();
            this.cleanSoldier();
            Utils.TimerManager.removeAll(this);
            egret.Tween.removeTweens(this);
            Utils.removeFromParent(this);
            this.modelConfig = null;
            // this.soldierPositionList = [];
            // this.soldierTweenTarget = [];
            // this.soldierTweenStep = [];
            // this.tweenTime = 0;
            // this.maxTime = 0;
            // this.buffList[BuffType.HEAD_ONEC_BUFF] = [];
            // this.buffList[BuffType.HEAD_CONTINUE_BUFF] = [];
            // this.buffList[BuffType.BODY_CONTINUE_BUFF] = [];
            // this.buffImageList = [];
            this.m_soldieNum = 0;
            this.m_totalSoldierNum = 0;
            this.m_maxHeight = 0;
            this.m_maxWidth = 0;
            this.m_unitType == null;
            this.isLive = false;
            this.isRunAway = false;
            this.isRestrain = false;
            if (this.m_lRun) {
                this.m_lRun.text = "";
                this.m_lRun.letterSpacing = 0;
                AnchorUtil.setAnchor(this.m_lRun, 0);
                Utils.removeFromParent(this.m_lRun);
                ObjectPool.push(this.m_lRun);
                this.m_lRun = null;
            }
        };
        /**
         * 方阵信息
         */
        CSquare.prototype.setUnitInfo = function (vo) {
            _super_1.prototype.setUnitInfo.call(this, vo);
            if (vo) {
                this.resetSpeed();
                this.m_pCID = vo.generalModelId;
            }
        };
        /**
         * 获取配置
         */
        CSquare.prototype.initConfig = function () {
            var _this = this;
            this.m_isResLoadComplete = false;
            this.m_toPerformDirection = null;
            this.m_toPerformStatus = null;
            this.modelConfig = com_main.CSquareMgr.getIns().modelConfig[this.m_pCID];
            var config = this.modelConfig;
            var code = config["code"];
            var path = "soldier_" + code + "_json"; //Soldier_ResPath + "soldier_" + code + ".json";
            RES.getResAsync(path, function (sheets) {
                if (!_this.parent)
                    return;
                try {
                    var texture = sheets._textureMap;
                    _this.m_textureSheet = {};
                    for (var name in texture) {
                        _this.m_textureSheet[name] = texture[name];
                    }
                    _this.m_isResLoadComplete = true;
                    if (config)
                        _this.initSquare(config["code"], config["grid"]);
                    else
                        error("兵种id : " + _this.m_pCID + " 兵种模型配置表中没有该项数据！");
                    if (_this.m_toPerformDirection)
                        _this.changeDirection(_this.m_toPerformDirection);
                    if (_this.m_toPerformStatus)
                        _this.changeStatus(_this.m_toPerformStatus);
                    // if (this.m_pSpriteAnimates)
                    // 	this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture());
                    // this.refreshAction();
                    // this.updateSquareSize();
                }
                catch (e) {
                    error(e);
                }
            }, this);
        };
        /**
         * 初始化方阵
         */
        CSquare.prototype.initSquare = function (code, type) {
            // this.m_pType = type;
            this.m_pType = CSquare_Type.TYPE_1;
            this.m_pSoldiersCode = code;
            this.m_pStatus = CSquare_Status.STATUS_STAND;
            this.m_pDirection = CSquare_Direction.RIGHT;
            if (this.m_pSoliderNode == null) {
                this.m_pSoliderNode = new egret.DisplayObjectContainer();
                Utils.addChild(this.m_pContainerLevel1, this.m_pSoliderNode);
            }
            var actionName = this.packageActionName(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
            this.createSoldiers(this.m_pSoldiersCode, this.m_pType, actionName);
            if (this.m_pSpriteAnimates == null) {
                this.m_pSpriteAnimates = com_main.CSquareAnimation.create(this.m_pSoldiersList, actionName, 5);
                this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture() /*CSquareMgr.getIns().animTexture*/);
            }
            else {
                this.m_pSpriteAnimates.cleanFrameAnimList();
                this.m_pSpriteAnimates.spriteList = this.m_pSoldiersList;
                this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture());
                // this.refreshAction(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
            }
        };
        CSquare.prototype.getSoldierTexture = function () {
            if (!this.m_textureSheet)
                this.m_textureSheet = {};
            return this.m_textureSheet;
            // return CSquareMgr.getIns().animTexture;
        };
        /**
         * 创建士兵
         */
        CSquare.prototype.createSoldiers = function (code, type, actionName) {
            var typeInfo = com_main.CSquareFunc.getSquareGrid(type);
            var grid = typeInfo["grid"];
            var row = typeInfo["row"];
            var len = grid.length;
            var animRes = this.getSoldierTexture();
            // this.cleanSoldier();
            var offset = this.getActionAnchor(actionName);
            var midWidth = this.width * 0.5;
            var midHeight = this.height * 0.5;
            this.m_soldieNum = 0;
            this.m_totalSoldierNum = 0;
            var comfig = com_main.CSquareFunc.getPositionListConfig(this.m_pStatus, this.m_pCID, this.m_pDirection);
            if (!comfig && type != CSquare_Type.TYPE_1) {
                error("创建方阵配置表出错");
                return;
            }
            for (var i = 0; i < len; i++) {
                var pos = grid[i];
                if (pos != 0) {
                    var animTexture = animRes[actionName + "_0"];
                    var soldier = this.m_pSoldiersList[pos - 1];
                    if (!soldier) {
                        soldier = Utils.DisplayUtils.createBitmap(animTexture);
                        this.m_pSoldiersList[pos - 1] = soldier;
                    }
                    else {
                        soldier.texture = animTexture;
                    }
                    this.m_totalSoldierNum++;
                    Utils.addChild(this.m_pSoliderNode, soldier);
                    soldier.anchorOffsetX = offset["anchorOffsetX"];
                    soldier.anchorOffsetY = offset["anchorOffsetY"];
                    if (type != CSquare_Type.TYPE_1) {
                        var positionList = comfig["soldier_" + pos].split("|");
                        var posx = Number(positionList[0]);
                        var posy = Number(positionList[1]);
                        soldier.x = posx;
                        soldier.y = posy;
                        // console.log("posx",posx,"posy",posy);
                    }
                    else {
                        soldier.x = midWidth;
                        soldier.y = midHeight;
                    }
                }
            }
            this.m_soldieNum = this.m_totalSoldierNum;
            //头顶特效节点
            this.m_pEffectNode.y = -this.modelConfig.bodyHeight / 2 + this.height / 2;
            this.m_pEffectNode.x = this.width / 2;
            this.m_pEffectTopNode.y = -this.modelConfig.bodyHeight + this.height / 2;
            this.m_pEffectTopNode.x = this.width / 2;
            this.m_pEffectFootNode.y = 0 + this.height / 2;
            this.m_pEffectFootNode.x = this.width / 2;
        };
        /**
         * 清除
         */
        CSquare.prototype.cleanSoldier = function () {
            // this.m_pSoldiersDeadList = [];
            var len = this.m_pSoldiersList.length;
            for (var i = 0; i < len; i++) {
                var soldier = this.m_pSoldiersList[i];
                if (soldier.parent) {
                    Utils.removeFromParent(soldier);
                }
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        CSquare.prototype.changeHp = function (hp, attackHurt, isShowHP, isBuff, attackStatus, isSkill) {
            if (isShowHP === void 0) { isShowHP = false; }
            if (isBuff === void 0) { isBuff = false; }
            var unitvo = this.getUnitInfo();
            //逃跑不处理
            if (!this.parent || !unitvo || this.isRunAway) {
                return;
            }
            //刷新血条
            if (this.m_pHeadInfo) {
                this.m_pHeadInfo.setHP(hp);
            }
            if (GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT) {
                if (unitvo.type == UnitType.SOLDIER) {
                    this.showSoldierHpBar(hp, isShowHP);
                }
                if (isShowHP) {
                    if (isBuff) {
                        attackHurt = unitvo.troops - hp;
                    }
                    if (!attackStatus || (this.isRestrain && attackStatus == AttackResult.RESTRAIN)) {
                        this.showHpChange(-attackHurt);
                    }
                    else {
                        if (!this.isRestrain && attackStatus == AttackResult.RESTRAIN) {
                            this.isRestrain = true;
                        }
                        this.showAttackStatus(attackStatus, attackHurt);
                    }
                }
            }
            //血量小于0 跳过
            if (unitvo.getHp() > 0) {
                unitvo.setHp(hp);
            }
            if (hp <= 0) {
                this.isLive = false; //死亡
                if (this.m_pHeadInfo)
                    this.m_pHeadInfo.clearSoldierHp();
                //死亡马上清除身上所有特效
                this.cleanAllEffect();
                if (this.m_pStatus == CSquare_Status.STATUS_DEAD) {
                    return;
                }
                if (this.m_pStatus == CSquare_Status.STATUS_FLY) {
                    return;
                }
                if (isSkill && this.getUnitInfo().type == UnitType.SOLDIER) {
                    this.changeStatus(CSquare_Status.STATUS_FLY);
                    com_main.BattleSceneMgr.getInstance().addChildToBlood(this, 100);
                }
                else {
                    this.changeStatus(CSquare_Status.STATUS_DEAD);
                }
                this.killingLastOne();
            }
        };
        /**
         * 显示暴击
         */
        CSquare.prototype.showAttackStatus = function (attackStatus, attackHurt) {
            if (attackStatus == AttackResult.ABSORB) {
                this.showBuffText("green", "吸收");
                return;
            }
            var _a = this.getMapXY(), x = _a[0], y = _a[1];
            var belong = this.getUnitInfo().belongType;
            var component = new com_main.AttackStatusComponent(attackStatus, attackHurt, belong);
            AnchorUtil.setAnchor(component, 0.5);
            component.x = x;
            if (this.m_unitType == UnitType.GENERAL) {
                component.y = y - 80;
            }
            else {
                component.y = y - 35;
            }
            com_main.CEffectFunc.floatCritAction(component, function () {
                Utils.removeFromParent(component);
                component.onDestroy();
            }, this);
            com_main.BattleSceneMgr.getInstance().addChildToBlood(component, 100);
        };
        /**
         * 血量
         */
        CSquare.prototype.showHpChange = function (hp) {
            if (hp == 0)
                return;
            var txt = ObjectPool.pop(egret.BitmapText, "egret.BitmapText");
            txt.letterSpacing = -5;
            if (hp >= 0) {
                hp = "+" + hp + "";
                txt.font = RES.getRes("addHPNumber_fnt"); //CResMgr.getIns().fontList[0];
            }
            else if (hp < 0) {
                if (this.getUnitInfo().belongType == BelongType.OWN) {
                    txt.font = RES.getRes("hurtNumber_fnt"); //CResMgr.getIns().fontList[1];
                }
                else {
                    txt.font = RES.getRes("hurtNumber1_fnt"); //CResMgr.getIns().fontList[1];
                }
            }
            var _a = this.getMapXY(), x = _a[0], y = _a[1];
            txt.text = hp + "";
            txt.x = x;
            var scale = 1.3;
            if (this.m_unitType == UnitType.GENERAL) {
                txt.y = y - 35 - 140; // - this.height * 0.3;
            }
            else {
                txt.y = y - 35 - 40;
                scale = 1;
            }
            AnchorUtil.setAnchor(txt, 0.5);
            com_main.CEffectFunc.floatAction(txt, function () {
                Utils.removeFromParent(txt);
                txt.text = "";
                txt.alpha = 1;
                txt.scaleX = txt.scaleY = 1;
                ObjectPool.push(txt);
            }, this, scale);
            com_main.BattleSceneMgr.getInstance().addChildToBlood(txt, 100);
        };
        /**
         * 消灭一个士兵
         */
        CSquare.prototype.killingLastOne = function () {
            if (this.m_pHeadInfo)
                this.m_pHeadInfo.visible = false;
            if (this.m_pSoliderHpBar)
                this.m_pSoliderHpBar.visible = false;
            var point = com_main.CSquareFunc.getDiePosition(this.m_pDirection, this.m_oldDirection);
            point.x = point.x + this.x;
            point.y = point.y + this.y;
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this);
            if (this.m_pStatus == CSquare_Status.STATUS_FLY) {
                tw.wait(100).to({ x: point.x, y: point.y }, ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_FLY_TIME));
            }
            else {
                tw.to({ x: point.x, y: point.y }, ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_SLIP_TIME), egret.Ease.cubicOut);
            }
        };
        /**
         * 士兵逃跑动画
         */
        CSquare.prototype.runAnimation = function () {
            var _this = this;
            this.isRunAway = true;
            this.isLive = false;
            BattleModel.removeUnit(this.getId());
            this.startAction();
            if (GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT) {
                var txt = ObjectPool.pop(egret.BitmapText, "egret.BitmapText"); //new egret.BitmapText();
                txt.letterSpacing = -6;
                txt.font = RES.getRes("effectGreyNum_fnt");
                txt.text = "溃败";
                txt.y = -15;
                txt.x = 0;
                AnchorUtil.setAnchor(txt, 0.5);
                this.m_pEffectTopNode.addChild(txt);
                this.m_lRun = txt;
            }
            egret.Tween.get(this).wait(666).to({ alpha: 0 }, 666).call(function () {
                com_main.BattleSceneMgr.getInstance().removeUnitObj(_this.getId());
            });
            if (this.m_pSoliderHpBar) {
                this.m_pSoliderHpBar.visible = false;
            }
        };
        /**
         * 获取当前方阵剩余士兵数量
         */
        CSquare.prototype.getSoldierNum = function () {
            return this.m_soldieNum;
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 刷新当前动作
         */
        CSquare.prototype.refreshAction = function (index, direction, status) {
            var _this = this;
            if (!this.m_isResLoadComplete)
                return;
            var actionName = this.packageActionName(null, direction, status);
            status = status || this.m_pStatus;
            var actionData = { "direction": direction, "status": status, "uid": this.getId(), "data": this.getUnitInfo() };
            this.resetSoldiesAnchor(actionName, index);
            this.changeFps(this.getActionFps(actionName));
            // debug("test---> " + this.m_pUnitInfo.name + " : action die " + " index : " + index + "   status :" + status);
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.runActionByName(actionName, index, this.isOneShootByStatus(status), function () {
                    if (index != null && index != undefined) {
                        //单个士兵动画处理
                        _this.oneSoldierActionDone(index, status);
                    }
                    else {
                        if (_this.isManual) {
                            _this.changeStatus(CSquare_Status.STATUS_STAND);
                        }
                        else {
                            var data = new AGame.Notification(UnitNav.ACTION_FINISH, actionData);
                            com_main.EventMgr.dispatchEvent(UnitNav.ACTION_FINISH, data);
                        }
                    }
                }, this, this.getKeyFrame(actionName), this.onKeyFrameCallback, this, actionData, status);
            }
            else {
                error("this.m_pSpriteAnimates is null");
            }
            this.flipByDirection(index, direction);
        };
        /**
         * 根据方向决定士兵的翻转
         */
        CSquare.prototype.flipByDirection = function (index, direction) {
            direction = direction || this.m_pDirection;
            var len = this.m_pSoldiersList.length;
            if (CSquare_Direction.LEFT_UP == direction ||
                CSquare_Direction.LEFT == direction ||
                CSquare_Direction.LEFT_DOWN == direction ||
                CSquare_Direction.DOWN == direction) {
                if (index != null && index != undefined) {
                    this.m_pSoldiersList[index].scaleX = -Soldier_Scale;
                }
                else {
                    for (var i = 0; i < len; i++) {
                        this.m_pSoldiersList[i].scaleX = -Soldier_Scale;
                    }
                }
            }
            else {
                if (index != null && index != undefined) {
                    this.m_pSoldiersList[index].scaleX = Soldier_Scale;
                }
                else {
                    for (var i = 0; i < len; i++) {
                        this.m_pSoldiersList[i].scaleX = Soldier_Scale;
                    }
                }
            }
        };
        /**
         * 单个士兵动画完成处理
         */
        CSquare.prototype.oneSoldierActionDone = function (index, status) {
            var _this = this;
            var soldier = this.m_pSoldiersList[index];
            if (soldier) {
                if (status == CSquare_Status.STATUS_DEAD) {
                    // let point = CSquareFunc.getDiePosition(this.m_pDirection)
                    // point.x = point.x + soldier.x;
                    // point.y = point.y + soldier.y;
                    var tw = egret.Tween.get(soldier);
                    // tw.to({x:point.x, y:point.y}, 150 )
                    tw.to({ "alpha": 0 }, Soldier_GoneTime);
                    tw.call(function () {
                        // this.m_pSpriteAnimates.removeAction(index);
                        Utils.removeFromParent(soldier);
                        soldier.alpha = 1;
                        if (index == 0) {
                            if (_this.m_pUnitInfo) {
                                _this.m_pSoldiersList.slice(index, 1);
                                com_main.BattleSceneMgr.getInstance().removeUnitObj(_this.m_pUnitInfo.elementId);
                            }
                        }
                    });
                }
            }
        };
        /**
         * 根据动作名获取要派发事件的关键帧
         */
        CSquare.prototype.getKeyFrame = function (actionName) {
            var config = this.getActionAnchor(actionName);
            return config["keyFrame"];
        };
        CSquare.prototype.onKeyFrameCallback = function (actionName, data) {
            //击飞死亡动画回调
            if ((this.m_pStatus == CSquare_Status.STATUS_FLY || this.m_pStatus == CSquare_Status.STATUS_STAND) && this.getUnitInfo() && this.getUnitInfo().getHp() == 0) {
                if (this.m_pSpriteAnimates) {
                    this.m_pSpriteAnimates.stopAction();
                    var actionData = { "direction": this.m_pDirection, "status": CSquare_Status.STATUS_DEAD, "uid": this.getId(), "data": this.getUnitInfo() };
                    var data_1 = new AGame.Notification(UnitNav.ACTION_FINISH, actionData);
                    com_main.EventMgr.dispatchEvent(UnitNav.ACTION_FINISH, data_1);
                }
            }
            //技能发动时，不要播放砍杀特效
            if (this.isStartSkill) {
                this.isStartSkill = false;
                return;
            }
            if (this.m_pStatus == CSquare_Status.STATUS_ATTACK && this.modelConfig.attackEffect) {
                // let config = CSquareFunc.getAttackEffectId(this.m_pDirection, this.isPlayer());
                var config = com_main.CSquareFunc.getAttackEffectId(this.m_pDirection, true);
                this.addEffect(config.effectId);
                if (config.isReversal && this.attackEffect) {
                    this.attackEffect.setScale(-1, 1);
                }
            }
        };
        /**
         * 根据当前状态获取当前动作完成后的后续状态
         * 可做配置表
         */
        CSquare.prototype.getFollowActionByStatus = function (status) {
            var followStatus = status;
            if (status == CSquare_Status.STATUS_ATTACK) {
                followStatus = CSquare_Status.STATUS_STAND;
            }
            return followStatus;
        };
        /**
         * 根据状态判断是否one shoot动作
         * 可做配置表
         */
        CSquare.prototype.isOneShootByStatus = function (status) {
            var result = false;
            if ((status == CSquare_Status.STATUS_ATTACK || status == CSquare_Status.STATUS_DEAD || status == CSquare_Status.STATUS_FLY)) {
                result = true;
            }
            return result;
        };
        /**
         * 获取动作的配置锚点
         */
        CSquare.prototype.getActionAnchor = function (actionName) {
            return com_main.CSquareMgr.getIns().animAnchor[actionName] || { "anchorOffsetX": 0, "anchorOffsetY": 0 };
        };
        /**
         * 获取发射点偏移值
         */
        CSquare.prototype.getLaunchPos = function () {
            var actionName = this.packageActionName();
            var pos = { "launchX": 0, "launchY": 0, "launchDeleyTime": 0 };
            var lp = com_main.CSquareMgr.getIns().animAnchor[actionName] || pos;
            pos.launchX = lp.launchX;
            pos.launchY = lp.launchY;
            pos.launchDeleyTime = lp.launchDeleyTime;
            if (this.m_pDirection == CSquare_Direction.LEFT ||
                this.m_pDirection == CSquare_Direction.LEFT_DOWN ||
                this.m_pDirection == CSquare_Direction.LEFT_UP) {
                pos.launchX = pos.launchX * -1;
            }
            return pos;
        };
        /**
         * 重设锚点
         */
        CSquare.prototype.resetSoldiesAnchor = function (actionName, index) {
            var offset = this.getActionAnchor(actionName);
            var offsetX = offset["anchorOffsetX"];
            var offsetY = offset["anchorOffsetY"];
            if (index != null && index != undefined) {
                var soldier = this.m_pSoldiersList[index];
                soldier.anchorOffsetX = offsetX;
                soldier.anchorOffsetY = offsetY;
            }
            else {
                var len = this.m_pSoldiersList.length;
                for (var i = 0; i < len; i++) {
                    var soldier = this.m_pSoldiersList[i];
                    soldier.anchorOffsetX = offsetX;
                    soldier.anchorOffsetY = offsetY;
                }
            }
        };
        /**
         * 获取动作的播放帧速
         */
        CSquare.prototype.getActionFps = function (actionName) {
            var fps = null;
            var data = com_main.CSquareMgr.getIns().getAnimAnchor(actionName);
            if (data) {
                fps = data.fps;
                if (this.m_fpsType == 1) {
                    fps = data.fps2;
                }
            }
            if (!fps)
                fps = 8;
            return fps;
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 添加特效
         */
        CSquare.prototype.addEffect = function (effectid, offsetX, offsetY, finishCallback, finishThisArgs, buffType) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (!this.m_pFrameEffect) {
                return;
            }
            this.m_pFrameEffect.regist(this.onAddEffect, this, { effectid: effectid, offsetX: offsetX, offsetY: offsetY, finishCallback: finishCallback, finishThisArgs: finishThisArgs });
            if (!this.m_pFrameEffect.isExecute()) {
                this.m_pFrameEffect.execute();
            }
        };
        CSquare.prototype.onAddEffect = function (arg) {
            var _this = this;
            if (!this.m_isResLoadComplete)
                return;
            if (arg.effectid == 0) {
                debug("test---> BUFF没有配置特效");
                return;
            }
            if (this.m_pEffectList[arg.effectid]) {
                // this.m_pEffectList[effectID].onDestroy();
                return;
            }
            var config = com_main.CEffectMgr.getIns().effectConfig[arg.effectid];
            if (!config || this.visible == false) {
                error("CSquare:onAddEffect--->>特效为空 effectid:", arg.effectid);
                return;
            }
            var effect = com_main.CEffectMgr.getIns().getEffect(arg.effectid);
            if (isNull(effect)) {
                error("CSquare:onAddEffect--->>创建不了 effectid:", arg.effectid);
                return;
            }
            // debug("创建特效id == ",arg.effectid);
            effect.x = arg.offsetX + config["offsetX"] || 0;
            effect.y = arg.offsetY + config["offsetY"] || 0;
            var callbackArgs = null;
            if (effect.spMark == 2) //身体位置buff
                this.m_pEffectNode.addChild(effect);
            else if (effect.spMark == 4) {
                effect.x = this.x;
                effect.y = this.y;
                if (effect.tweenId == 3) {
                    effect.y = effect.y - this.m_maxHeight;
                }
                com_main.BattleSceneMgr.getInstance().addChildToSuspension(effect);
            }
            else if (effect.spMark == 5) { //头顶位置buff
                this.m_pEffectTopNode.addChild(effect);
            }
            else if (effect.spMark == 6) { //脚底位置buff
                this.m_pEffectFootNode.addChild(effect);
            }
            else {
                this.m_pEffectNode.addChild(effect);
            }
            effect.setScale(this.modelConfig.buffScale, this.modelConfig.buffScale);
            // 循环时间
            if (config.playTime) {
                var tw = egret.Tween.get(effect);
                tw.wait(config.playTime).call(function () { _this.removeEffect(arg.effectid); });
            }
            effect.play(null, arg.finishCallback, arg.finishThisArgs, callbackArgs, config.keyFrame);
            if (effect.repeat == true)
                this.m_pEffectList[arg.effectid] = effect;
            this.attackEffect = effect;
        };
        /**
         * 移除特效
         */
        CSquare.prototype.removeEffect = function (effectID) {
            if (this.m_pEffectList[effectID]) {
                this.m_pEffectList[effectID].onCleanup();
                delete this.m_pEffectList[effectID];
            }
        };
        /**
         * 清除所有特效
         */
        CSquare.prototype.cleanAllEffect = function () {
            for (var key in this.m_pEffectList) {
                var id = Number(key);
                var effect = this.m_pEffectList[id];
                if (effect) {
                    effect.onCleanup();
                    // Utils.removeFromParent(effect);
                    delete this.m_pEffectList[id];
                }
            }
            this.m_pEffectList = {};
        };
        /**
         * 旋转特效
         */
        CSquare.prototype.rotateEffect = function (direction) {
            var rotate = com_main.CSquareFunc.getEffectRotationByDirection(direction);
            var len = this.m_pEffectList.length;
            for (var i = 0; i < len; i++) {
                var effect = this.m_pEffectList[i];
                if (effect.spMark == 3)
                    effect.rotation = rotate;
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 组装动作名
         */
        CSquare.prototype.packageActionName = function (code, direction, status) {
            var actionName = "";
            actionName += code || this.m_pSoldiersCode;
            actionName += "_";
            actionName += com_main.CSquareFunc.getActionCharByDirection(direction || this.m_pDirection, this.m_oldDirection);
            actionName += "_";
            actionName += com_main.CSquareFunc.getActionCharByStatus(status || this.m_pStatus);
            return actionName;
        };
        Object.defineProperty(CSquare.prototype, "fpsType", {
            /**
             * 设置帧频
             */
            set: function (v) {
                if (!this.m_isResLoadComplete)
                    return;
                this.m_fpsType = v;
                var actionName = this.packageActionName();
                var fps = this.getActionFps(actionName);
                this.changeFps(fps);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "fps", {
            /**
             * 获取帧频
             */
            get: function () {
                if (this.m_pSpriteAnimates) {
                    return this.m_pSpriteAnimates.getFps();
                }
                debug("CSquare:fps------>>: this.m_pSpriteAnimates is " + this.m_pSpriteAnimates);
                return 0;
            },
            /**
             * 设置帧频
             */
            set: function (v) {
                if (this.m_pSpriteAnimates) {
                    this.m_pSpriteAnimates.setFps(v);
                }
                else {
                    debug("CSquare:fps------>>: this.m_pSpriteAnimates is " + this.m_pSpriteAnimates);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquare.prototype, "mapPos", {
            get: function () {
                return this.m_mapPos;
            },
            /**地图坐标 */
            set: function (point) {
                this.m_mapPos = point;
            },
            enumerable: true,
            configurable: true
        });
        CSquare.prototype.getMapXY = function () {
            if (this.m_mapPos) {
                return [this.m_mapPos.x, this.m_mapPos.y];
            }
            else {
                return [this.x, this.y];
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         *  显示喊话
         */
        CSquare.prototype.talk = function (content, timeout) {
            content = content || ""; //ConstUtil.getString(IConstEnum.GENERAT_TALK);
            //纹理加载完毕才创建容器(需要读取纹理宽高对齐位置)
            if (this.m_pOtherInfoNode) {
                // let talkFrame = new TalkFrame(content, timeout);
                // Utils.addChild(this.m_pOtherInfoNode, talkFrame);
                // egret.callLater(() => {
                // 	let x = 0;
                // 	let y = - 50 - talkFrame.height;
                // 	talkFrame.x = x;
                // 	talkFrame.y = y;
                // }, this);
                var talkFrame = new com_main.EnterSkillName(content);
                talkFrame.y = -115;
                Utils.addChild(this.m_pOtherInfoNode, talkFrame);
            }
        };
        CSquare.prototype.flyWordNum = function (font, content) {
            var talkFrame = new com_main.FlyWordNum(content, font);
            talkFrame.setData(content, font);
            talkFrame.y = -80 - 35;
            Utils.addChild(this.m_pOtherInfoNode, talkFrame);
        };
        /**
         * 显示头像信息
         */
        CSquare.prototype.showHeadInfo = function (duration) {
            if (isNull(this.m_pHeadInfo)) {
                var unitinfo = this.getUnitInfo();
                this.m_pHeadInfo = new com_main.BattleGeneralHeadInfo(unitinfo);
            }
            if (!hasParent(this.m_pHeadInfo)) {
                this.m_pHeadInfo.x = -4;
                this.m_pHeadInfo.y = -this.m_maxHeight * 0.5 - 90;
                Utils.addChild(this.m_pContainerLevel3, this.m_pHeadInfo);
            }
        };
        /**
         * 创建小兵血条
         */
        CSquare.prototype.createSoldierHpBar = function () {
            if (!this.m_pCID)
                return;
            if (isNull(this.m_pSoliderHpBar)) {
                this.m_pSoliderHpBar = new com_main.BattleSoldierHpBar();
            }
            var unitinfo = this.getUnitInfo();
            this.m_pSoliderHpBar.setData(unitinfo);
            if (!hasParent(this.m_pSoliderHpBar)) {
                this.m_pSoliderHpBar.x = 48;
                if (!this.modelConfig) {
                    this.modelConfig = com_main.CSquareMgr.getIns().modelConfig[this.m_pCID];
                }
                this.m_pSoliderHpBar.y = -(this.modelConfig.bodyHeight / 2 + 5);
                Utils.addChild(this.m_pContainerLevel3, this.m_pSoliderHpBar);
            }
        };
        /**
         * 显示小兵血量
         */
        CSquare.prototype.showSoldierHpBar = function (hp, isShowHP) {
            if (!this.m_pSoliderHpBar && isShowHP) {
                this.createSoldierHpBar();
            }
            if (isShowHP) {
                this.m_pSoliderHpBar.setHP(hp);
            }
            else if (this.m_pSoliderHpBar) {
                this.m_pSoliderHpBar.setHpNoTween(hp);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 获取方向
         */
        CSquare.prototype.getDirection = function () {
            return this.m_pDirection;
        };
        /**
         * 改变播放帧速
         */
        CSquare.prototype.changeFps = function (fps) {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.setFps(fps);
            }
        };
        /**
         * 改变士兵类型
         */
        CSquare.prototype.changeSoldierCode = function (code, index) {
            if (this.m_pSoldiersCode != code) {
                this.m_pSoldiersCode = code;
                this.refreshAction(index);
            }
        };
        /**
         * 改变方向
         */
        CSquare.prototype.changeDirection = function (direction, index) {
            if (!this.m_isResLoadComplete)
                this.m_toPerformDirection = direction;
            if (this.m_pDirection != direction &&
                (this.m_pStatus != CSquare_Status.STATUS_DEAD || this.isTest == true) || (index != null && index != undefined)) {
                var status_1 = null;
                // if (index != null && index != undefined) {
                // 	if (this.soliderStatusList[index] && this.soliderStatusList[index] == direction) {
                // 		return;
                // 	}
                // 	this.soliderStatusList[index] = direction;
                // 	status = CSquare_Status.STATUS_WALK;
                // } else {
                this.m_pDirection = direction; //整体朝向才赋值
                if (direction == CSquare_Direction.UP || direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.LEFT_UP) {
                    this.m_oldDirection = CSquare_Direction.UP;
                }
                else if (direction == CSquare_Direction.DOWN || direction == CSquare_Direction.RIGHT_DOWN || direction == CSquare_Direction.LEFT_DOWN) {
                    this.m_oldDirection = CSquare_Direction.DOWN;
                }
                // }
                this.refreshAction(index, direction, status_1);
                this.rotateEffect(direction);
                // this.resetSpeed();
            }
        };
        /**改变状态 */
        CSquare.prototype.changeStatus = function (status, index, targetNumber) {
            if (this.m_unitType == UnitType.GENERAL && status == CSquare_Status.STATUS_FLY)
                return; //英雄击飞跳过
            if (!this.m_isResLoadComplete) {
                this.m_toPerformStatus = status;
            }
            if ((this.m_pStatus != status || status == CSquare_Status.STATUS_ATTACK)) {
                if (index == null || index == undefined)
                    this.m_pStatus = status;
                this.refreshAction(index, null, status);
            }
            if (this.getUnitInfo()) {
                //音效
                Sound.playSoldierStatus(this.getUnitInfo().getMainType(), status);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        CSquare.prototype.getFourDirection = function () {
            return com_main.CSquareFunc.getFourDirection(this.m_pDirection, this.m_oldDirection);
        };
        /**根据阵营设置转向 */
        CSquare.prototype.setDirectionOnFaction = function (faction) {
            if (faction == FactionType.ATK) {
                this.changeDirection(CSquare_Direction.RIGHT_UP);
            }
            else {
                this.changeDirection(CSquare_Direction.LEFT_DOWN);
            }
            this.changeStatus(CSquare_Status.STATUS_STAND);
        };
        /**根据两点设置转向 */
        CSquare.prototype.setDirectionOnPos = function (cpos, tpos) {
            if (cpos.x == tpos.x && cpos.y == tpos.y) {
                //两个点一样不转向
                return;
            }
            var radian = Utils.MathUtils.getRadian2(cpos.x, cpos.y, tpos.x, tpos.y);
            var angle = Utils.MathUtils.getAngle(radian);
            this.setDirectionOnAngle(angle);
        };
        /**根据角度设置转向 */
        CSquare.prototype.setDirectionOnAngle = function (angle, index) {
            if (this.m_pSpeedType == SpeedType.PASSIVE) {
                debug("CSquare:setDirectionOnAngle--->>被冲锋推动不转向", format("uid:{1}", this.getId()));
                return;
            }
            if ((angle <= 0 && angle >= (ActorDirAngle.Right - AngleDirection / 2))
                || (angle >= 0 && angle <= (ActorDirAngle.Right + AngleDirection / 2))) {
                // debug("---------->>玩家转向角度：", "右", angle);
                this.changeDirection(CSquare_Direction.RIGHT, index);
            }
            else if (angle >= (ActorDirAngle.RightUp - AngleDirection / 2)
                && angle <= (ActorDirAngle.RightUp + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "右上", angle);
                this.changeDirection(CSquare_Direction.RIGHT_UP, index);
            }
            else if (angle >= (ActorDirAngle.Up - AngleDirection / 2)
                && angle <= (ActorDirAngle.Up + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "上", angle);
                this.changeDirection(CSquare_Direction.UP, index);
            }
            else if (angle >= (ActorDirAngle.LeftUp - AngleDirection / 2)
                && angle <= (ActorDirAngle.LeftUp + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "左上", angle);
                this.changeDirection(CSquare_Direction.LEFT_UP, index);
            }
            else if (angle >= (ActorDirAngle.Left - AngleDirection / 2)
                || angle <= (AngleDirection / 2 - ActorDirAngle.Left)) {
                // debug("---------->>玩家转向角度：", "左", angle);
                this.changeDirection(CSquare_Direction.LEFT, index);
            }
            else if (angle >= (ActorDirAngle.LeftDown - AngleDirection / 2)
                && angle <= (ActorDirAngle.LeftDown + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "左下", angle);
                this.changeDirection(CSquare_Direction.LEFT_DOWN, index);
            }
            else if (angle >= (ActorDirAngle.Down - AngleDirection / 2)
                && angle <= (ActorDirAngle.Down + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "下", angle);
                this.changeDirection(CSquare_Direction.DOWN, index);
            }
            else if (angle >= (ActorDirAngle.RightDown - AngleDirection / 2)
                && angle <= (ActorDirAngle.RightDown + AngleDirection / 2)) {
                // debug("---------->>玩家转向角度：", "右下", angle);
                this.changeDirection(CSquare_Direction.RIGHT_DOWN, index);
            }
            else {
                // debug("玩家转向角度：", angle);
            }
            // this.rotation = angle;
        };
        Object.defineProperty(CSquare.prototype, "soldierCode", {
            // /**
            //  * 震开效果
            //  */
            // public squareFlick(gzX: number = 0, gzY: number = 0, dis: number = 10) {
            // 	let len = this.m_pSoldiersList.length;
            // 	for (let i: number = 0; i < len; i++) {
            // 		let soldier = this.m_pSoldiersList[i];
            // 		if (soldier.parent) {
            // 			CSquareFunc.flick(soldier, gzX, gzY, dis);
            // 		}
            // 	}
            // }
            // public toNameString() {
            // 	return this.m_pType + "_" + this.m_pSoldiersCode + "_" + this.hashCode;
            // }
            get: function () {
                return this.m_pSoldiersCode;
            },
            enumerable: true,
            configurable: true
        });
        CSquare.prototype.resetSpeed = function (speed) {
            if (this.justAnim || this.manual) {
                return;
            }
            var tempSpeed;
            if (speed) {
                tempSpeed = speed;
                this.getUnitInfo().moveSpeed = speed;
            }
            else {
                tempSpeed = this.getUnitInfo().moveSpeed;
            }
            this.setMoveSpeed(null, tempSpeed);
            // if(this.m_pDirection == 8 || this.m_pDirection == 4){ //横走
            // 	this.setMoveSpeed(null, 32 / tempSpeed);
            // }else if(this.m_pDirection == 2 || this.m_pDirection == 6){
            // 	this.setMoveSpeed(null, 16 / tempSpeed);
            // }else{
            // 	this.setMoveSpeed(null, 27.5 / tempSpeed);
            // }
        };
        //发动技能
        CSquare.prototype.startSkill = function (skillEffectId) {
            this.changeStatus(CSquare_Status.STATUS_ATTACK);
            //没有蓄力动作,直接播放特效
            var skilleffectData = C.ShowSkillEffectConfig[skillEffectId];
            var arr = skilleffectData.startAnimation.split("|");
            // this.addEffect(skilleffectData.startAnimation);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    this.addEffect(Number(arr[i]));
                }
            }
            this.isStartSkill = true;
            if (skillEffectId == 130) {
                var map = com_main.BattleSceneMgr.getInstance().getMapView();
                EffectUtils.shakeScreen(map, 4);
            }
            else if (skillEffectId == 134) { //飞鸾翔凤
                var list = [6, 7, 8, 1]; //右上方向
                if (list.indexOf(this.m_pDirection) != -1) {
                    this.addEffect(123);
                }
                else {
                    this.addEffect(124);
                }
            }
            // egret.Tween.get(this).to({scaleX:2,scaleY:2},800).wait(1000).to({scaleX:1,scaleY:1},800);
        };
        //发动入场技能
        CSquare.prototype.startEnterSkill = function (avo) {
            this.changeStatus(CSquare_Status.STATUS_ATTACK);
            var skilldata = avo.getSkillConfig();
            //没有蓄力动作,直接播放特效
            if (skilldata.talk) {
                this.talk(GLan(skilldata.talk));
            }
            this.isStartSkill = true;
        };
        // private startImage: egret.Bitmap[];
        // private startImageIndex: number;
        CSquare.prototype.startSkillEffect = function (skillEffectId, isLight) {
            if (isLight === void 0) { isLight = true; }
            // 放技能过程 变大 闪光 放技能 缩小
            // if(isLight) this.addEffect(49);
            var tTween = null;
            var tSX = 0;
            var tSY = 0;
            if (skillEffectId == 130) {
                tTween = egret.Tween.get(this.m_pSoldiersList[0]);
                tSX = tSY = 1;
            }
            else {
                tTween = egret.Tween.get(this);
                tSX = tSY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
            }
            tTween.to({ scaleX: ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SKILL_START_SCALE), scaleY: ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SKILL_START_SCALE) }, ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_1))
                .wait(ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_2))
                .call(this.startSkill, this, [skillEffectId])
                .wait(ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_3))
                .to({ scaleX: tSX, scaleY: tSY }, ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_4));
        };
        /**
         * 受击飞效果
         */
        CSquare.prototype.hitFlyToPos = function (x, y) {
            if (this.isRunAway)
                return;
            this.changeStatus(CSquare_Status.STATUS_FLY);
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this);
            tw.wait(100)
                .to({ x: x, y: y }, ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_FLY_TIME));
        };
        /**
         * 受击退效果
         */
        CSquare.prototype.hitBackToPos = function (x, y) {
            if (this.isRunAway)
                return;
            this.removeTween();
            var tw = egret.Tween.get(this);
            tw.to({ x: x, y: y }, 200, egret.Ease.circInOut);
        };
        CSquare.prototype.getListLastElement = function (list) {
            if (list.length > 0) {
                return list[list.length - 1];
            }
            return null;
        };
        CSquare.prototype.showBuffText = function (color, text) {
            var txt = ObjectPool.pop(egret.BitmapText, "egret.BitmapText");
            txt.letterSpacing = -6;
            if (color == "green") {
                txt.font = RES.getRes("effectGreenNum_fnt");
            }
            else if (color == "red") {
                txt.font = RES.getRes("effectRedNum_fnt");
            }
            else if (color == "orange") {
                txt.font = RES.getRes("effectOrangeNum_fnt");
            }
            else if (color == "purple") {
                txt.font = RES.getRes("effectPurpleNum_fnt");
            }
            var _a = this.getMapXY(), x = _a[0], y = _a[1];
            txt.scaleX = txt.scaleY = 1.5;
            txt.text = text;
            txt.alpha = 1;
            txt.x = x;
            txt.y = y - 35; // - this.height * 0.3;
            AnchorUtil.setAnchor(txt, 0.5);
            com_main.CEffectFunc.buffWorldAction(txt, function () {
                txt.text = "";
                Utils.removeFromParent(txt);
                ObjectPool.push(txt);
            }, this);
            com_main.BattleSceneMgr.getInstance().addChildToBlood(txt);
        };
        /**
         * 添加buff
         */
        CSquare.prototype.addBuff = function (buffID) {
            if (GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT) {
                debugBatt("添加特效 ", buffID);
                var buff = BuffData.getBuffConfig(buffID);
                if (buff.describe) {
                    var strArr = L.getInstance().getLanguage(buff.describe).split("|");
                    if (strArr[0] == "green" || strArr[0] == "red" || strArr[0] == "orange" || strArr[0] == "purple") {
                        if (strArr[2] == "enterskill") {
                            // let talkFrame = new FlyWordNum(strArr[1],strArr[0]);//ObjectPool.pop("com_main.FlyWordNum");
                            // talkFrame.setData(strArr[1],strArr[0]);
                            // talkFrame.y = -80 - 35;
                            // Utils.addChild(this.m_pOtherInfoNode, talkFrame);
                            this.flyWordNum(strArr[0], strArr[1]);
                        }
                        else {
                            this.showBuffText(strArr[0], strArr[1]);
                        }
                    }
                }
                if (buff.texiao) {
                    var effectConfig = C.EffectConfig[buff.texiao];
                    this.addEffect(buff.texiao);
                }
                else {
                    debugBatt("buff 特效为空", buff.id);
                    return;
                }
            }
            // if (effectConfig) {
            // 	switch (effectConfig.spMark) {
            // 		case BuffType.HEAD_ONEC_BUFF:
            // 			this.buffList[BuffType.HEAD_ONEC_BUFF].push(buffID);
            // 			this.addEffect(buff.texiao);
            // 			break;
            // 		case BuffType.HEAD_CONTINUE_BUFF:
            // 			let currentEffect = this.getListLastElement(this.buffList[BuffType.HEAD_CONTINUE_BUFF]);
            // 			let curBuff = BuffData.getBuffConfig(currentEffect);
            // 			if (curBuff) {
            // 				this.removeEffect(curBuff.texiao);
            // 			}
            // 			this.buffList[BuffType.HEAD_CONTINUE_BUFF].push(buffID);
            // 			this.addEffect(buff.texiao);
            // 			break;
            // 		case BuffType.BODY_CONTINUE_BUFF:
            // 			let bodyEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
            // 			let budyBuff = BuffData.getBuffConfig(bodyEffect);
            // 			if (budyBuff) {
            // 				this.removeEffect(budyBuff.texiao);
            // 			}
            // 			this.buffList[BuffType.BODY_CONTINUE_BUFF].push(buffID);
            // 			this.addEffect(buff.texiao);
            // 			break;
            // 		default:
            // 			break;
            // 	}
            // }
        };
        /**
         * 删除buff
         */
        CSquare.prototype.removeBuff = function (buffID) {
            debug("移除buff ", buffID);
            var buff = BuffData.getBuffConfig(buffID);
            if (!buff.texiao) {
                debugBatt("buff 特效为空", buff.id);
                return;
            }
            var effectConfig = C.EffectConfig[buff.texiao];
            this.removeEffect(buff.texiao);
            // if (effectConfig) {
            // 	switch (effectConfig.spMark) {
            // 		case BuffType.HEAD_ONEC_BUFF:
            // 			for (let i in this.buffList[BuffType.HEAD_ONEC_BUFF]) {
            // 				this.buffList[BuffType.HEAD_ONEC_BUFF].splice(Number(i));
            // 			}
            // 			break;
            // 		case BuffType.HEAD_CONTINUE_BUFF:
            // 			for (let i in this.buffList[BuffType.HEAD_CONTINUE_BUFF]) {
            // 				this.buffList[BuffType.HEAD_CONTINUE_BUFF].splice(Number(i));
            // 			}
            // 			let headEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
            // 			let headBuff = BuffData.getBuffConfig(headEffect);
            // 			if (!this.buffImageList[headBuff.texiao]) {
            // 				this.addBuffImage(headBuff.texiao);
            // 			}
            // 			break;
            // 		case BuffType.BODY_CONTINUE_BUFF:
            // 			for (let i in this.buffList[BuffType.BODY_CONTINUE_BUFF]) {
            // 				this.buffList[BuffType.BODY_CONTINUE_BUFF].splice(Number(i));
            // 			}
            // 			let bodyEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
            // 			let bodyBuff = BuffData.getBuffConfig(bodyEffect);
            // 			if (bodyBuff) {
            // 				this.addEffect(bodyBuff.texiao);
            // 			}
            // 			break;
            // 		default:
            // 			break;
            // 	}
            // }
        };
        //技能 动画暂停
        CSquare.prototype.stopAction = function () {
            /**士兵逃跑不暂停 */
            if (this.isRunAway) {
                return;
            }
            if (this.m_pStatus == CSquare_Status.STATUS_DEAD || this.m_pStatus == CSquare_Status.STATUS_FLY) {
                return;
            }
            this.isStop = true;
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.stopAction();
            }
            for (var i in this.m_pEffectList) {
                var effect = this.m_pEffectList[i];
                effect.pause();
            }
        };
        //技能 动画开始
        CSquare.prototype.startAction = function () {
            if (!this.m_pSpriteAnimates || this.m_pStatus == CSquare_Status.STATUS_DEAD || this.m_pStatus == CSquare_Status.STATUS_FLY) {
                return;
            }
            this.isStop = false;
            this.m_pSpriteAnimates.startAction();
            for (var i in this.m_pEffectList) {
                var effect = this.m_pEffectList[i];
                effect.play();
            }
        };
        CSquare.prototype.drawCenter = function () {
            var lab = new eui.Label();
            // lab.text = "x = " + this.x + " ; y= " + this.y;
            lab.text = "" + this.m_pUnitInfo.elementId;
            lab.size = 20;
            lab.textColor = 0xff0000;
            lab.stroke = 1;
            lab.x = 60;
            this.addChild(lab);
        };
        CSquare.prototype.removeTween = function () {
            egret.Tween.removeTweens(this);
            if (this.m_unitType == UnitType.GENERAL) {
                this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
            }
        };
        return CSquare;
    }(com_main.UnitActor));
    com_main.CSquare = CSquare;
})(com_main || (com_main = {}));
