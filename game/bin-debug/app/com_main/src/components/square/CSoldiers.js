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
    var CSoldiers = /** @class */ (function (_super_1) {
        __extends(CSoldiers, _super_1);
        /**
         * data.num = 方正类型
         */
        function CSoldiers() {
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
            /**
             * 已阵亡士兵列表
             */
            _this.m_pSoldiersDeadList = [];
            /**
             * 图片帧处理类
             */
            _this.m_pSpriteAnimates = null;
            /**
             * 士兵层
             */
            _this.m_pSoliderNode = null;
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
             * 状态动作播放完后的回调
             */
            _this.m_pActionFinishCallback = null;
            /**
             * 回调对象
             */
            _this.m_pActionFinishObject = null;
            /**
             * 帧频类型
             */
            _this.m_fpsType = 0;
            /**
             * 士兵纹理集
             */
            _this.m_textureSheet = {};
            /**是否完成资源加载 */
            _this.m_isResLoadComplete = false;
            /**士兵位置列表*/
            _this.soldierPositionList = [];
            _this.init();
            return _this;
        }
        CSoldiers.prototype.getFourDirection = function () {
            return com_main.CSquareFunc.getFourDirection(this.m_pDirection, this.m_oldDirection);
        };
        CSoldiers.createId = function (cid) {
            var obj = new com_main.CSoldiers();
            obj.initId(cid);
            return obj;
        };
        CSoldiers.prototype.init = function () {
            this.m_pWidth = Square_Width;
            this.m_pHeight = Square_Height;
            this.width = Square_Width;
            this.height = Square_Height;
            _super_1.prototype.init.call(this);
            this.alpha = 1;
            //添加了屏幕外隐藏功能需要这句
            this.visible = true;
            this.soldierPositionList = [];
        };
        CSoldiers.prototype.initId = function (cid) {
            this.m_pCID = cid;
            this.width = Square_Width;
            this.height = Square_Height;
            if (this.m_pCID > 0) {
                this.initConfig();
                // this.drawDiamond();
            }
        };
        CSoldiers.prototype.initContainer = function () {
            if (!this.m_pContainerLevel1) {
                this.m_pContainerLevel1 = new egret.DisplayObjectContainer();
                // this.m_pContainerLevel1.width = this.width;
                // this.m_pContainerLevel1.height = this.height;
                Utils.addChild(this, this.m_pContainerLevel1);
            }
            //显示在最上面
            _super_1.prototype.initContainer.call(this);
        };
        CSoldiers.prototype.getId = function () {
            return this.id;
        };
        /**
         * 销毁方法
         */
        CSoldiers.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.onCleanup();
        };
        CSoldiers.prototype.onCleanup = function () {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.removeAction();
                this.m_pSpriteAnimates = null;
            }
            if (this.m_pSoliderNode) {
                Utils.removeFromParent(this.m_pSoliderNode);
                this.m_pSoliderNode = null;
            }
            if (this.m_pContainerLevel1) {
                Utils.removeFromParent(this.m_pContainerLevel1);
                this.m_pContainerLevel1 = null;
            }
            this.m_textureSheet = null;
            this.m_isResLoadComplete = false;
            Utils.TimerManager.removeAll(this);
            egret.Tween.removeTweens(this);
            Utils.removeFromParent(this);
            this.modelConfig = null;
            this.soldierPositionList = [];
        };
        /**
         * 获取配置
         */
        CSoldiers.prototype.initConfig = function () {
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
                }
                catch (e) {
                    error(e);
                }
            }, this);
        };
        /**
         * 初始化方阵
         */
        CSoldiers.prototype.initSquare = function (code, type) {
            this.m_pType = type;
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
            }
        };
        CSoldiers.prototype.changeHp = function (teamVo) {
        };
        CSoldiers.prototype.getSoldierTexture = function () {
            if (!this.m_textureSheet)
                this.m_textureSheet = {};
            return this.m_textureSheet;
        };
        /**
         * 创建士兵
         */
        CSoldiers.prototype.createSoldiers = function (code, type, actionName) {
            var typeInfo = com_main.CSquareFunc.getSquareGrid(type);
            var grid = typeInfo["grid"];
            var row = typeInfo["row"];
            var len = grid.length;
            var animRes = this.getSoldierTexture();
            var offset = this.getActionAnchor(actionName);
            var midWidth = this.width * 0.5;
            var midHeight = this.height * 0.5;
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
                    Utils.addChild(this.m_pSoliderNode, soldier);
                    soldier.anchorOffsetX = offset["anchorOffsetX"];
                    soldier.anchorOffsetY = offset["anchorOffsetY"];
                    if (type != CSquare_Type.TYPE_1) {
                        var positionList = comfig["soldier_" + pos].split(",");
                        var posx = Number(positionList[0]);
                        var posy = Number(positionList[1]);
                        soldier.x = posx;
                        soldier.y = posy;
                    }
                    else {
                        soldier.x = midWidth;
                        soldier.y = midHeight;
                    }
                    this.soldierPositionList[pos - 1] = new egret.Point(soldier.x, soldier.y);
                }
            }
        };
        /**
         * 刷新当前动作
         */
        CSoldiers.prototype.refreshAction = function (index, direction, status) {
            if (!this.m_isResLoadComplete)
                return;
            var actionName = this.packageActionName(null, direction, status);
            status = status || this.m_pStatus;
            var actionData = { "direction": direction, "status": status, "uid": this.getId(), "data": this.getUnitInfo() };
            this.resetSoldiesAnchor(actionName, index);
            this.changeFps(this.getActionFps(actionName));
            // debug("test---> " + this.m_pUnitInfo.name + " : action die " + " index : " + index + "   status :" + status);
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.runActionByName(actionName, index, false, null, null, this.getKeyFrame(actionName), this.onKeyFrameCallback, this, actionData, status);
            }
            else {
                error("this.m_pSpriteAnimates is null");
            }
            this.flipByDirection(index, direction);
        };
        /**
         * 根据方向决定士兵的翻转
         */
        CSoldiers.prototype.flipByDirection = function (index, direction) {
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
         * 根据动作名获取要派发事件的关键帧
         */
        CSoldiers.prototype.getKeyFrame = function (actionName) {
            var config = this.getActionAnchor(actionName);
            return config["keyFrame"];
        };
        CSoldiers.prototype.onKeyFrameCallback = function (actionName, data) {
        };
        /**
         * 获取动作的配置锚点
         */
        CSoldiers.prototype.getActionAnchor = function (actionName) {
            return com_main.CSquareMgr.getIns().animAnchor[actionName] || { "anchorOffsetX": 0, "anchorOffsetY": 0 };
        };
        /**
         * 重设锚点
         */
        CSoldiers.prototype.resetSoldiesAnchor = function (actionName, index) {
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
                    if (!this.m_pSoldiersDeadList[i]) {
                        var soldier = this.m_pSoldiersList[i];
                        soldier.anchorOffsetX = offsetX;
                        soldier.anchorOffsetY = offsetY;
                    }
                }
            }
        };
        /**
         * 获取动作的播放帧速
         */
        CSoldiers.prototype.getActionFps = function (actionName) {
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
        /**
         * 组装动作名
         */
        CSoldiers.prototype.packageActionName = function (code, direction, status) {
            var actionName = "";
            actionName += code || this.m_pSoldiersCode;
            actionName += "_";
            actionName += com_main.CSquareFunc.getActionCharByDirection(direction || this.m_pDirection, this.m_oldDirection);
            actionName += "_";
            actionName += com_main.CSquareFunc.getActionCharByStatus(status || this.m_pStatus);
            return actionName;
        };
        Object.defineProperty(CSoldiers.prototype, "fpsType", {
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
        Object.defineProperty(CSoldiers.prototype, "fps", {
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
        /**
         * 改变播放帧速
         */
        CSoldiers.prototype.changeFps = function (fps) {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.setFps(fps);
            }
        };
        /**
         * 改变方向
         */
        CSoldiers.prototype.changeDirection = function (direction) {
            if (!this.m_isResLoadComplete)
                this.m_toPerformDirection = direction;
            if (this.m_pDirection != direction) {
                var status_1 = null;
                this.m_pDirection = direction; //整体朝向才赋值
                if (direction == CSquare_Direction.UP || direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.LEFT_UP) {
                    this.m_oldDirection = CSquare_Direction.UP;
                }
                else if (direction == CSquare_Direction.DOWN || direction == CSquare_Direction.RIGHT_DOWN || direction == CSquare_Direction.LEFT_DOWN) {
                    this.m_oldDirection = CSquare_Direction.DOWN;
                }
                this.refreshAction(null, direction, status_1);
            }
        };
        /**改变状态 */
        CSoldiers.prototype.changeStatus = function (status, index, targetNumber) {
            if (!this.m_isResLoadComplete) {
                this.m_toPerformStatus = status;
            }
            if ((this.m_pStatus != status || status == CSquare_Status.STATUS_ATTACK) &&
                (this.m_pStatus != CSquare_Status.STATUS_DEAD)) {
                if (index == null || index == undefined)
                    this.m_pStatus = status;
                this.refreshAction(index, null, status);
            }
        };
        return CSoldiers;
    }(com_main.UnitActor));
    com_main.CSoldiers = CSoldiers;
})(com_main || (com_main = {}));
