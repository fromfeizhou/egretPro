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
// TypeScript file
var com_main;
(function (com_main) {
    var BaseMap = /** @class */ (function (_super_1) {
        __extends(BaseMap, _super_1);
        // private
        function BaseMap() {
            var _this = _super_1.call(this) || this;
            _this.m_pTouchBeginPos = new egret.Point();
            _this.m_pPreTouchPos = new egret.Point();
            _this.m_pLastMovePos = new egret.Point();
            _this.m_pPreMovePos = new egret.Point();
            _this.m_pLastMoveTime = 0;
            _this.m_pIsMove = false; //是否正在移动当中
            _this.m_pIsBegin = false;
            _this.SCALE_DEF = 1; //默认大小
            _this.SCALE_MAX = 1.3; //最大缩放值
            _this.SCALE_MIN = 0.7; //最小缩放值
            _this.m_pIsAutoMove = false; //是否开启惯性滑动
            _this.m_pIsForcedMove = false; //是否强制移动
            _this.m_pForceMoveX = 0;
            _this.m_pForceMoveY = 0;
            _this.m_pForcePro = 0;
            _this.FORCE_PRO_NUM = 10;
            _this.DEFINE_FORCE_PRO_NUM = 10; //默认
            /**
             * 地图显示区域偏移量
             * 上，下
             * */
            _this.m_pMapOffset = [0, 0];
            /**
             * 多点触碰控制地图缩放
             */
            _this.m_pTouchPoints = { touchIds: [] }; //储存touchid
            _this.m_pTouchCon = 0;
            _this.m_p2pDistance = 0; //初始2点距离
            /**是否可以移动地图 默认true */
            _this.m_pIsCanMove = true;
            /**是否可以缩放地图 默认true */
            _this.m_pIsCanScale = true;
            _this.m_pTileConfig = {};
            /**处理分块加载代码 */
            _this.m_pPosData = {}; //所有图块坐标点和纹理 pos = [x,y,texture]
            _this.m_pCenterPos = [0, 0, 0]; //中心点坐标 pos x,y
            _this.m_pTiles = []; //[bitmap,pos]
            _this.m_pTileNumX = 3; //横向格子数
            _this.m_pTileNumY = 2; //竖向格子数
            _this.m_pNowPosData = {}; //当前显示的图块坐标集合
            _this.m_pTileObjects = {}; //分块加载的时候，，需要控制上面显示隐藏的的东西 pos = []
            _this.m_pMapBgUrlMapping = [];
            _this.m_pSoldierList = {};
            _this.m_pIsFollow = false;
            _this.m_nMoveRate = 1;
            /**
             * 检查是否越界
             */
            _this.stageWidth = egret.MainContext.instance.stage.stageWidth;
            _this.stageHeight = egret.MainContext.instance.stage.stageHeight;
            _this.init();
            _this.name = BaseMap.NAME;
            _this.touchEnabled = true;
            // this.touchChildren = false;
            _this.m_pBg = new egret.DisplayObjectContainer();
            _this.m_pTileMap = new egret.DisplayObjectContainer();
            _this.m_labelLayer = new egret.DisplayObjectContainer();
            _this.m_pPaopaoLayer = new egret.DisplayObjectContainer();
            // this.m_pBg.touchEnabled = true;
            // this.m_pBg.touchChildren = true;
            _this.m_pBg["$hitTest"] = function () { return null; };
            _this.m_pTileMap["$hitTest"] = function () { return null; };
            _this.m_labelLayer["$hitTest"] = function () { return null; };
            _this.m_pPaopaoLayer["$hitTest"] = function () { return null; };
            var touchLayer = new egret.Bitmap();
            touchLayer.width = egret.MainContext.instance.stage.stageWidth;
            touchLayer.height = egret.MainContext.instance.stage.stageHeight;
            _this.addChild(touchLayer);
            _this.once(egret.Event.ADDED_TO_STAGE, _this.onEnter, _this);
            _this.registerEvents();
            _this.registerProxys();
            return _this;
        }
        BaseMap.prototype.init = function () {
        };
        /**
         * 销毁方法
         */
        BaseMap.prototype.onDestroy = function () {
            var soldiers = this.m_pSoldierList;
            for (var key in soldiers) {
                if (soldiers.hasOwnProperty(key)) {
                    var soldier = soldiers[key];
                    egret.Tween.removeTweens(soldier);
                    Utils.removeFromParent(soldier);
                }
            }
            this.onExit();
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
            com_main.EventManager.removeEventListeners(this);
            this.removeEvents();
            this.removeProxys();
            this.stopEnterFrame();
            this.m_pTouchBeginPos = null;
            this.m_pPreTouchPos = null;
            this.m_pLastMovePos = null;
            this.m_pPreMovePos = null;
            this.m_pTouchPoints = null;
            this.m_pTiles = null;
            this.m_pTileConfig = null;
            // /**移除地图纹理 */
            // let pd = this.m_pPosData;
            // for (var key in pd) {
            //     if (pd.hasOwnProperty(key)) {
            //         var element = pd[key];
            //         let name = element[3];
            //         RES.destroyRes(name);
            //     }
            // }
            delete this.m_pMapBgUrlMapping;
            delete this.m_pPosData;
            this.m_pMapBgUrlMapping = null;
            this.m_pPosData = null;
            this.m_pCenterPos = null;
            this.m_pNowPosData = null;
            this.m_pTileObjects = null;
            Utils.removeAllChild(this.m_pBg);
            this.m_pBg = null;
            Utils.removeAllChild(this.m_pTileMap);
            this.m_pTileMap = null;
            Utils.ShockUtils.destroy();
            Utils.removeAllChild(this);
        };
        BaseMap.prototype.onEnter = function () {
            // this.once(egret.Event.REMOVED_FROM_STAGE, this.onExit, this)
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
            this.addMapBitmap(); //添加背景
            this.startEnterFrame();
            debug("BaseMap:onEnter--->>");
        };
        /**在onDestroy之前调用 */
        BaseMap.prototype.onExit = function () {
            debug("BaseMap:onExit--->>");
        };
        BaseMap.prototype.getMapContent = function () {
            return this.m_pBg;
        };
        BaseMap.prototype.addMapBitmap = function () {
            var self = this;
            var config = self.m_pTileConfig;
            if (!config || !config.map_name) {
                error('请初始化地图配置', self.m_pTileConfig);
                return;
            }
            /**
             * _row         横向
             * _col         竖向
             * _map_name    图片前缀
             */
            var _row = config.row;
            var _col = config.col;
            var _all = _row * _col;
            var _map_name = config.map_name;
            var _suffix = config.suffix;
            var _tile_w = config.w;
            var _tile_h = config.h;
            var _width = _tile_w * _col;
            var _height = _tile_h * _row;
            this.m_pBg.width = _width;
            this.m_pBg.height = _height;
            this.m_pBg.anchorOffsetX = _width / 2;
            this.m_pBg.anchorOffsetY = _height / 2;
            this.m_pTileMap.width = _width;
            this.m_pTileMap.height = _height;
            this.m_pTileMap.anchorOffsetX = _width / 2;
            this.m_pTileMap.anchorOffsetY = _height / 2;
            this.m_labelLayer.width = _width;
            this.m_labelLayer.height = _height;
            this.m_labelLayer.anchorOffsetX = _width / 2;
            this.m_labelLayer.anchorOffsetY = _height / 2;
            this.m_pPaopaoLayer.width = _width;
            this.m_pPaopaoLayer.height = _height;
            this.m_pPaopaoLayer.anchorOffsetX = _width / 2;
            this.m_pPaopaoLayer.anchorOffsetY = _height / 2;
            var x = 0;
            var y = 0;
            var max = config.num;
            var pos_data = this.m_pPosData;
            var mapping = this.m_pMapBgUrlMapping;
            var haveMapping = mapping.length > 0 ? true : false;
            for (var i = 0; i < _all; i++) {
                var _i = haveMapping ? mapping[i] : i;
                var mapname = _map_name + self.pad(_i, max) + _suffix;
                var mapname_thum = _map_name + self.pad(_i, max) + '_thum_png';
                // let _texture = RES.getRes(mapname);
                // if (_texture == null) {
                //     error('找不到图片：', mapname);
                //     continue;
                // }
                pos_data[i + 1] = [x, y, null, mapname, mapname_thum];
                if (i % _col == (_col - 1)) {
                    x = 0;
                    y += _tile_h;
                }
                else {
                    x += _tile_w;
                }
            }
            //根据场景分辨率 设置显示图块总量
            // let stage = egret.MainContext.instance.stage;
            this.m_pTileNumX = Math.max(1, Math.ceil(AGame.R.app.stageWidth / _tile_w) + 1);
            this.m_pTileNumY = Math.max(1, Math.ceil(AGame.R.app.stageHeight / _tile_h) + 1);
            var all = this.m_pTileNumX * this.m_pTileNumY;
            var tiles = this.m_pTiles;
            for (var i = 0; i < all; i++) {
                var tile = new com_main.MapTile();
                tile.width = _tile_w;
                tile.height = _tile_h;
                Utils.addChild(this.m_pTileMap, tile);
                tiles.push([tile, 0]);
            }
            Utils.addChild(this, this.m_pTileMap);
            Utils.addChild(this, this.m_pBg);
            Utils.addChild(this, this.m_labelLayer);
            Utils.addChild(this, this.m_pPaopaoLayer);
            // debug(this.m_pPosData);
            this.set_scale(this.SCALE_DEF);
            var textrue1 = RES.getRes(_map_name + 'thum_png');
            var textrue2 = RES.getRes(_map_name + 'thum_jpg');
            var bg2 = new egret.Bitmap();
            if (textrue1)
                bg2.texture = textrue1;
            else if (textrue2)
                bg2.texture = textrue2;
            bg2.width = this.m_pBg.width;
            bg2.height = this.m_pBg.height;
            this.m_pTileMap.addChildAt(bg2, 0);
        };
        BaseMap.prototype.pad = function (num, n) {
            return Array(n > ('' + num).length ? (n - ('' + num).length + 1) : 0).join('0') + num;
        };
        BaseMap.prototype.onTouchBegan = function (e) {
            Utils.closeHitTestFunc(AGame.App.Instance.menuLevel);
            if (this.m_pIsForcedMove) {
                e.stopPropagation();
                return;
            }
            if (this.m_pTouchCon >= 2)
                return;
            var isTouch = this.onTouch(e);
            if (isTouch)
                return;
            if (this.m_pTouchPoints[e.touchPointID] == null) {
                this.m_pTouchCon += 1;
                this.m_pTouchPoints[e.touchPointID] = new egret.Point(e.stageX, e.stageY);
                this.m_pTouchPoints["touchIds"].push(e.touchPointID);
            }
            this.m_pIsAutoMove = false;
            this.m_pIsMove = false;
            if (this.m_pTouchCon == 2)
                this.m_p2pDistance = this.getTouchDistance();
            else {
                this.m_pLoopTime = BaseMap.LOOP_TIME;
                this.m_pIsBegin = true;
                this.m_pTouchBeginPos.x = e.stageX;
                this.m_pTouchBeginPos.y = e.stageY;
                this.m_pPreTouchPos.x = e.stageX;
                this.m_pPreTouchPos.y = e.stageY;
                this.m_pLastMovePos.x = this.m_pBg.x;
                this.m_pLastMovePos.y = this.m_pBg.y;
            }
        };
        BaseMap.prototype.onTouchMoved = function (e) {
            if (SceneManager.hasChildGuideView()) {
                //存在引导界面
                return;
            }
            if (this.m_pIsForcedMove) {
                this.m_pIsBegin = false;
                this.m_pIsMove = false;
                e.stopPropagation();
                return;
            }
            if (!this.m_pTouchPoints[e.touchPointID]) {
                return;
            }
            if (this.check_move_out(e)) {
                this.onTouchEnd(e);
                return;
            }
            // debug("onTouchMoved:",e.stageX,",",e.stageY);         
            this.m_pTouchPoints[e.touchPointID].x = e.stageX;
            this.m_pTouchPoints[e.touchPointID].y = e.stageY;
            if (this.m_pTouchCon == 2 && this.m_pIsCanScale) {
                this.m_pIsMove = false;
                var scaleX = this.m_pBg.scaleX;
                var newdistance = this.getTouchDistance();
                var scale = newdistance / this.m_p2pDistance * scaleX;
                scale = scale > this.SCALE_MAX ? this.SCALE_MAX : scale;
                scale = scale < this.SCALE_MIN ? this.SCALE_MIN : scale;
                this.set_scale(scale);
            }
            else if (this.m_pTouchPoints[e.touchPointID] != null && this.m_pTouchCon == 1 && this.m_pIsCanMove) {
                var dis = Utils.MathUtils.getPosDis({ x: this.m_pPreTouchPos.x, y: this.m_pPreTouchPos.y }, { x: e.stageX, y: e.stageY });
                if (dis < 10)
                    return;
                this.m_pIsMove = true;
                var pos = egret.Point.create(this.m_pBg.x, this.m_pBg.y);
                pos.x += e.stageX - this.m_pPreTouchPos.x;
                pos.y += e.stageY - this.m_pPreTouchPos.y;
                //移动地图
                this.mapMovePosition(pos);
                this.m_pPreTouchPos.x = e.stageX;
                this.m_pPreTouchPos.y = e.stageY;
                this.m_pPreMovePos.x = this.m_pLastMovePos.x;
                this.m_pPreMovePos.y = this.m_pLastMovePos.y;
                this.m_pLastMovePos.x = this.m_pBg.x;
                this.m_pLastMovePos.y = this.m_pBg.y;
                this.m_pLastMoveTime = egret.getTimer();
            }
        };
        BaseMap.prototype.onTouchEnd = function (e) {
            Utils.recoverHitTestFunc(AGame.App.Instance.menuLevel);
            if (!this.m_pTouchPoints || !this.m_pTouchPoints[e.touchPointID]) {
                return;
            }
            delete this.m_pTouchPoints[e.touchPointID];
            var index = this.m_pTouchPoints["touchIds"].indexOf(e.touchPointID);
            if (index >= 0)
                this.m_pTouchPoints["touchIds"].splice(index, 1);
            this.m_pTouchCon--;
            if (this.m_pTouchCon < 0)
                this.m_pTouchCon = 0;
            if (this.m_pIsForcedMove) {
                this.m_pIsBegin = false;
                this.m_pIsMove = false;
                e.stopPropagation();
                return;
            }
            if (!this.m_pIsBegin)
                return;
            var is_click = !this.m_pIsMove;
            var is_auto_move = this.m_pIsMove;
            // var moveDistance = egret.Point.distance(new egret.Point(e.stageX,e.stageY),this.m_pTouchBeginPos);
            if (this.m_pIsCanMove && is_auto_move && (egret.getTimer() - this.m_pLastMoveTime) < 250) {
                var subPoint = new egret.Point();
                subPoint.x = this.m_pLastMovePos.x - this.m_pPreMovePos.x;
                subPoint.y = this.m_pLastMovePos.y - this.m_pPreMovePos.y;
                var distance = subPoint.length;
                var radian = Math.atan2(subPoint.y, subPoint.x);
                if (distance > 0) {
                    this.m_pMoveSpeed = distance / BaseMap.LOOP_TIME;
                    this.m_pStartMoveTime = 0;
                    this.m_pCosMove = Math.cos(radian);
                    this.m_pSinMove = Math.sin(radian);
                    this.m_pMoveSpeed = this.m_pMoveSpeed > BaseMap.MAX_SPEED ? BaseMap.MAX_SPEED : this.m_pMoveSpeed;
                    this.m_pAcceleration = -(this.m_pMoveSpeed * 2);
                    this.m_pIsAutoMove = true;
                }
            }
            else {
                // this.onTouch(e);
            }
            this.m_pIsBegin = false;
            this.m_pIsMove = false;
        };
        /**
         * 用户点击界面
         */
        BaseMap.prototype.onTouch = function (e) {
            return false;
        };
        BaseMap.prototype.onTouchReleaseOutside = function (e) {
            Utils.recoverHitTestFunc(AGame.App.Instance.menuLevel);
            this.onTouchEnd(e);
        };
        BaseMap.prototype.onTouchCancel = function (e) {
            Utils.recoverHitTestFunc(AGame.App.Instance.menuLevel);
            this.m_pIsBegin = false;
            this.m_pIsMove = false;
        };
        BaseMap.prototype.startEnterFrame = function () {
            Utils.TimerManager.doFrame(2, 0, this.onEnterFrame, this);
        };
        BaseMap.prototype.stopEnterFrame = function () {
            Utils.TimerManager.remove(this.onEnterFrame, this);
        };
        BaseMap.prototype.onEnterFrame = function (delta) {
            // if (this.m_pIsFollow && this.m_pFollowTarget) {
            //     let target = this.m_pSoldierList[this.m_pFollowTarget];
            //     if (target) {
            //         this.moveTo(target.x, target.y, false);
            //         return;
            //     }
            // }
            this.autoMoveSchedule(delta);
        };
        /**
         * 惯性滑动
         */
        BaseMap.prototype.autoMoveSchedule = function (delta) {
            // debug('m_pIsAutoMove:', this.m_pIsAutoMove);
            if (BattleModel.getIsStopPlay())
                return;
            var self = this;
            if (!self.m_pIsBegin && self.m_pIsAutoMove) {
                self.m_pStartMoveTime += delta / 1000; //BaseMap.LOOP_TIME;
                var speed = self.m_pMoveSpeed + self.m_pAcceleration * self.m_pStartMoveTime;
                if (speed <= 0) {
                    self.m_pIsAutoMove = false;
                    this.moveEnd();
                    // GuideUI.onMove();
                    return;
                }
                var sx = self.m_pMoveSpeed * self.m_pStartMoveTime + self.m_pAcceleration * self.m_pStartMoveTime * self.m_pStartMoveTime / 2;
                var x = sx * self.m_pCosMove;
                var y = sx * self.m_pSinMove;
                self.mapMovePosition(egret.Point.create(self.m_pLastMovePos.x + x, self.m_pLastMovePos.y + y));
            }
            else if (self.m_pIsForcedMove) { //强制移动地图到某点
                this.m_pForcePro += 1;
                self.mapMovePosition(egret.Point.create(self.m_pBg.x + self.m_pForceMoveX, self.m_pBg.y + self.m_pForceMoveY));
                if (this.m_pForcePro == this.FORCE_PRO_NUM) {
                    this.m_pIsForcedMove = false;
                    // GuideUI.onMove();
                    this.forcedMoveEnd();
                }
            }
        };
        BaseMap.prototype.moveEnd = function () {
        };
        BaseMap.prototype.setForceCall = function (callBack, target, arg) {
            this.forcedCallBack = callBack;
            this.forcedTarget = target;
            this.forcedArg = arg;
        };
        //强制移动到某点后回调
        BaseMap.prototype.forcedMoveEnd = function () {
            if (this.forcedCallBack) {
                this.forcedCallBack.call(this.forcedTarget, this.forcedArg);
            }
            this.forcedCallBack = null;
            this.forcedTarget = null;
            this.forcedArg = null;
        };
        /**
         * 滑动到中心点为
         * x,y 的坐标
         * isAnim 是否播放滑动动画
         * frame 多少帧移过去 帧数越大,速度越慢
         *  */
        BaseMap.prototype.moveTo = function (x, y, isAnim, frame) {
            if (isAnim === void 0) { isAnim = true; }
            if (frame) {
                frame = frame * this.m_nMoveRate;
            }
            var self = this;
            if (self.m_pIsForcedMove)
                return;
            this.m_pIsAutoMove = false;
            var pos = self.m_pBg.localToGlobal(x, y);
            var _x = (self.stage.stageWidth / 2 - pos.x);
            var _y = (self.stage.stageHeight / 2 - pos.y);
            if (isAnim) {
                self.m_pLastMovePos.x = self.m_pBg.x;
                self.m_pLastMovePos.y = self.m_pBg.y;
                if (frame && frame > 0) {
                    this.FORCE_PRO_NUM = frame;
                }
                else {
                    this.FORCE_PRO_NUM = this.DEFINE_FORCE_PRO_NUM;
                }
                this.m_pForceMoveX = _x / this.FORCE_PRO_NUM;
                this.m_pForceMoveY = _y / this.FORCE_PRO_NUM;
                this.m_pForcePro = 0;
                self.m_pIsForcedMove = true;
            }
            else {
                this.mapMovePosition(egret.Point.create(self.m_pBg.x + _x, self.m_pBg.y + _y));
            }
            if (WorldModel.m_pInitMoveId != 0)
                WorldModel.m_pInitMoveId = 0;
        };
        /**
         * 获取地图允许移动坐标
         */
        BaseMap.prototype.getMapMovePosition = function (pos) {
            var scale = this.m_pBg.scaleX;
            var w = this.m_pBg.width * scale / 2;
            var h = this.m_pBg.height * scale / 2;
            var xPoint = pos.x > w ? w : pos.x;
            var yPoint = pos.y > h + this.m_pMapOffset[0] ? h + this.m_pMapOffset[0] : pos.y;
            var diffX = this.stage.stageWidth - w;
            var diffY = this.stage.stageHeight - h - this.m_pMapOffset[1];
            xPoint = xPoint < diffX ? diffX : xPoint;
            yPoint = yPoint < diffY ? diffY : yPoint;
            var point = egret.Point.create(xPoint, yPoint);
            return point;
        };
        /**
         * 移动地图
         */
        BaseMap.prototype.mapMovePosition = function (pos) {
            var point = this.getMapMovePosition(pos);
            this.m_pBg.x = point.x;
            this.m_pBg.y = point.y;
            this.m_pTileMap.x = point.x;
            this.m_pTileMap.y = point.y;
            this.m_labelLayer.x = point.x;
            this.m_labelLayer.y = point.y;
            this.m_pPaopaoLayer.x = point.x;
            this.m_pPaopaoLayer.y = point.y;
            egret.Point.release(pos);
            egret.Point.release(point);
            this.checkCenterPos();
        };
        /**
         * 获取当前2个手指距离
         */
        BaseMap.prototype.getTouchDistance = function () {
            var tps = this.m_pTouchPoints;
            var _distance = 0;
            var names = tps["touchIds"];
            _distance = egret.Point.distance(tps[names[names.length - 1]], tps[names[names.length - 2]]);
            return _distance;
        };
        /**
         * 设置地图缩放和位置
         */
        BaseMap.prototype.set_scale = function (scale) {
            this.m_pBg.scaleX = scale;
            this.m_pBg.scaleY = scale;
            this.m_pTileMap.scaleX = scale;
            this.m_pTileMap.scaleY = scale;
            this.m_labelLayer.scaleX = scale;
            this.m_labelLayer.scaleY = scale;
            this.m_pPaopaoLayer.scaleX = scale;
            this.m_pPaopaoLayer.scaleY = scale;
            this.mapMovePosition(egret.Point.create(this.m_pBg.x, this.m_pBg.y));
        };
        /////////////////////////////////////////////////////////////////自定义事件
        BaseMap.prototype.listNotificationInterests = function () {
            return [];
        };
        BaseMap.prototype.handleNotification = function (notification) {
            var body = notification.getBody();
            var name = notification.getName();
            debug("BaseMap:handleNotification--->>", name, body);
            switch (name) {
                case "value":
                    break;
                default:
                    break;
            }
        };
        BaseMap.prototype.registerEvents = function () {
            var interests = this.listNotificationInterests();
            var len = interests.length;
            if (!AGame.R.router)
                return;
            var router = AGame.R.router.getObserver();
            if (len > 0) {
                var observer = new AGame.Observer(this.handleNotification, this);
                for (var i = 0; i < len; i++) {
                    router.registerObserver(interests[i], observer);
                }
            }
        };
        BaseMap.prototype.removeEvents = function () {
            var interests = this.listNotificationInterests();
            var i = interests.length;
            var router = AGame.R.router.getObserver();
            if (!AGame.R.router)
                return;
            while (i--)
                router.removeObserver(interests[i], this);
        };
        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        BaseMap.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        BaseMap.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.BATTLE_LEAVE: {
                //     break;
                // }
                default:
                    break;
            }
        };
        /**
         * 监听协议号事件
         */
        BaseMap.prototype.registerProxys = function () {
            var interests = this.listenerProtoNotifications();
            var len = interests.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    AGame.ServiceBuilder.Instance.registerProxy(interests[i], this.executes, this);
                }
            }
        };
        /**
         * 移除协议号监听
         */
        BaseMap.prototype.removeProxys = function () {
            AGame.ServiceBuilder.Instance.removeProxy(this);
        };
        BaseMap.prototype.check_move_out = function (e) {
            var x = e.stageX;
            var y = e.stageY;
            // let stage = this.stage;
            if (x < 0 || x > this.stageWidth || y < 0 || y > this.stageHeight)
                return true;
            else
                return false;
        };
        /**是否可以移动 */
        BaseMap.prototype.setIsCanMove = function (flag) {
            this.m_pIsCanMove = flag;
        };
        /**是否可以缩放 */
        BaseMap.prototype.setIsCanScale = function (flag) {
            this.m_pIsCanScale = flag;
        };
        /**检测当前起点地图编号 */
        BaseMap.prototype.checkCenterPos = function () {
            // if(1)return;
            var map = this.m_pBg;
            var po = map.globalToLocal(0, 0);
            var pos_data = this.getPosData(po.x, po.y);
            // console.log("po.x = "+ po.x + " po.y" + po.y);
            var _x = pos_data[1];
            var _y = pos_data[2];
            var index = pos_data[0];
            if (index != this.m_pCenterPos[0]) {
                this.m_pCenterPos[0] = index;
                this.m_pCenterPos[1] = _x;
                this.m_pCenterPos[2] = _y;
                this.resetTile([index, _x, _y]);
                // debug('当前中心点图块是：' + _x + ' ,' + _y + '  第：' + index + '张');
            }
        };
        /**重置图块位置和纹理 */
        BaseMap.prototype.resetTile = function (center_pos) {
            var _this = this;
            var self = this;
            var nowPos = this.m_pNowPosData;
            var newPos = {};
            var needPos = []; //需要加载的图块pos
            var w = self.m_pTileNumX;
            var h = self.m_pTileNumY;
            //起点 tile格子的 x ,y
            var x = center_pos[1];
            var y = center_pos[2];
            var colMax = self.m_pTileConfig.col;
            for (var row = 0; row < h; row++) {
                var _y = y + row;
                if (_y > 0) {
                    for (var col = 0; col < w; col++) {
                        var _x = x + col;
                        if (_x > 0 && _x <= colMax) {
                            //格子下标 index 公式 
                            var gridId = this.getGridIndex(_x, _y);
                            newPos[gridId] = 1;
                            if (!nowPos[gridId]) {
                                needPos.push(gridId);
                            }
                        }
                    }
                }
            }
            this.m_pNowPosData = null;
            this.m_pNowPosData = {};
            var tiles = self.m_pTiles;
            var pos_data = self.m_pPosData;
            for (var key in tiles) {
                if (tiles.hasOwnProperty(key)) {
                    var element = tiles[key];
                    var pos = element[1];
                    if (!newPos[pos]) {
                        this.onRemoveTile(pos);
                        var tile = element[0];
                        if (needPos.length > 0) {
                            var need_pos = needPos.pop();
                            var pdt = pos_data[need_pos];
                            if (pdt && pdt.length == 5) {
                                var texture = pdt[2];
                                var texture_name = pdt[3];
                                tile.name = texture_name;
                                tile.index = need_pos;
                                if (texture == null) {
                                    /**异步加载需要的图块 */
                                    // let thum = RES.getRes(pdt[4]);
                                    // if (thum) {
                                    //     tile.texture = thum;
                                    // } else {
                                    //     tile.texture = null;
                                    // }
                                    RES.getResAsync(texture_name, function (data, key) {
                                        if (_this.m_pTileMap) {
                                            var _tile = _this.m_pTileMap.getChildByName(key);
                                            if (_tile) {
                                                _tile.texture = data;
                                                var index = _tile.index;
                                                var pd = _this.m_pPosData[index];
                                                if (pd) {
                                                    pd[2] = data;
                                                }
                                            }
                                        }
                                    }, this);
                                }
                                else {
                                    tile.texture = texture;
                                }
                                tile.x = pdt[0];
                                tile.y = pdt[1];
                            }
                            tile.visible = true;
                            this.m_pNowPosData[need_pos] = 1;
                            this.onAddTile(need_pos);
                            tiles[key][1] = need_pos;
                        }
                        else {
                            self.m_pTiles[key][1] = 0;
                            tile.texture = null;
                            tile.visible = false;
                        }
                    }
                    else {
                        this.m_pNowPosData[pos] = 1;
                    }
                }
            }
        };
        /**滚动tile 隐藏显示管理 */
        BaseMap.prototype.addTileObject = function (obj) {
            var pos_data = this.getPosData(obj.x, obj.y);
            var index = pos_data[0];
            if (!this.m_pTileObjects[index])
                this.m_pTileObjects[index] = [];
            this.m_pTileObjects[index].push(obj);
            obj.visible = this.m_pNowPosData[index] ? true : false;
        };
        /**
         * 分块加载，移除某块图块的时候调用
         * pos为第几个图块
         * x 图块坐标
         * y 图块坐标
         * */
        BaseMap.prototype.onRemoveTile = function (pos) {
            var objects = this.m_pTileObjects[pos];
            if (objects) {
                for (var key in objects) {
                    if (objects.hasOwnProperty(key)) {
                        var element = objects[key];
                        element.visible = false;
                    }
                }
            }
        };
        /**
         * 分块加载，添加某块图块的时候调用
         * pos为第几个图块
         * x 图块坐标
         * y 图块坐标
         * */
        BaseMap.prototype.onAddTile = function (pos) {
            var objects = this.m_pTileObjects[pos];
            if (objects) {
                for (var key in objects) {
                    if (objects.hasOwnProperty(key)) {
                        var element = objects[key];
                        element.visible = true;
                    }
                }
            }
        };
        /**返回坐标
         *  [pos,x,y]
         *  pos 第几张图，1开始
         *  x 坐标
         *  y 坐标
         * */
        BaseMap.prototype.getPosData = function (x, y) {
            var _x = Math.ceil(x / this.m_pTileConfig.w) || 1;
            var _y = Math.ceil(y / this.m_pTileConfig.h) || 1;
            var index = this.getGridIndex(_x, _y);
            return [index, _x, _y];
        };
        /**通过格子 x,y 获得index */
        BaseMap.prototype.getGridIndex = function (x, y) {
            return (y - 1) * this.m_pTileConfig.col + x;
        };
        BaseMap.prototype.sortBuilds = function () {
            function sortY(d1, d2) {
                // let name1 = CBuild.NAME;
                // let name2 = NBuild.NAME;
                var name3 = com_main.MBuild.NAME;
                var bery = com_main.MapBery.NAME;
                // if ( d1.name != name2 && d1.name != name3)
                //     return -1;
                // else if ( d2.name != name2 && d2.name != name3)
                //     return 1;
                if (d1.name == bery)
                    return -1;
                else if (d2.name == bery)
                    return 1;
                if (d1.y > d2.y) {
                    return 1;
                }
                else if (d1.y < d2.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            this.m_pBg.$children.sort(sortY);
        };
        BaseMap.prototype.createSoldier = function (id, direction, x, y) {
            var soldier = com_main.CSquare.createId(id, true, true);
            soldier.x = x;
            soldier.y = y;
            soldier.changeDirection(direction);
            soldier.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_pBg.addChild(soldier);
            this.sortBuilds();
            this.m_pSoldierList[id] = soldier;
        };
        BaseMap.prototype.moveSoldier = function (id, direction, x, y, isFollow) {
            var _this = this;
            if (isFollow === void 0) { isFollow = false; }
            var soldier = this.m_pSoldierList[id];
            if (soldier) {
                soldier.changeDirection(direction);
                soldier.changeStatus(CSquare_Status.STATUS_WALK);
                var pos1 = egret.Point.create(soldier.x, soldier.y);
                var pos2 = egret.Point.create(x, y);
                var distance = com_main.Point.distance(pos1, pos2);
                egret.Tween.get(soldier).to({ x: x, y: y }, distance * 7).call(function () {
                    _this.sortBuilds();
                    soldier.changeStatus(CSquare_Status.STATUS_STAND);
                }, this);
                if (isFollow) {
                    this.m_pIsFollow = true;
                    this.m_pFollowTarget = id;
                }
            }
        };
        BaseMap.prototype.talkSoldier = function (id, content, name, head_id) {
            // let soldier = <CSquare>this.m_pSoldierList[id];
            // if (soldier) {
            //     soldier.talk(GLan(content),soldier,1500,"drama", {head:head_id, name:GLan(name)});
            // }
        };
        BaseMap.prototype.removeSoldier = function (id) {
            var soldier = this.m_pSoldierList[id];
            if (soldier) {
                egret.Tween.removeTweens(soldier);
                Utils.removeFromParent(soldier);
                delete this.m_pSoldierList[id];
                if (this.m_pIsFollow && this.m_pFollowTarget == id) {
                    this.m_pIsFollow = false;
                    this.m_pFollowTarget = 0;
                }
            }
            var haveSoldier = false;
            for (var key in this.m_pSoldierList) {
                if (this.m_pSoldierList.hasOwnProperty(key)) {
                    var element = this.m_pSoldierList[key];
                    haveSoldier = true;
                    break;
                }
            }
        };
        /**是否移动中 */
        BaseMap.prototype.isMove = function () {
            return this.m_pIsMove || this.m_pIsAutoMove || this.m_pIsForcedMove;
        };
        /**创建空图层 */
        BaseMap.prototype.createEmptyLayer = function (name) {
            if (name === void 0) { name = ''; }
            var container = new egret.DisplayObjectContainer();
            container.name = name;
            container.width = this.m_pBg.width;
            container.height = this.m_pBg.height;
            container.anchorOffsetX = container.width / 2;
            container.anchorOffsetY = container.height / 2;
            container["$hitTest"] = function () { return null; };
            return container;
        };
        /**获得文字层*/
        BaseMap.prototype.getLabelLayer = function () {
            return this.m_labelLayer;
        };
        BaseMap.NAME = "BaseMap";
        BaseMap.LOOP_TIME = 0.01666;
        BaseMap.MAX_SPEED = 1000; //最大移动速度
        return BaseMap;
    }(egret.DisplayObjectContainer));
    com_main.BaseMap = BaseMap;
})(com_main || (com_main = {}));
