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
     * 场景中所有可行走对象的基类
     * @author
     */
    var Actor = /** @class */ (function (_super_1) {
        __extends(Actor, _super_1);
        function Actor() {
            var _this = _super_1.call(this) || this;
            /**移动时间(毫秒) */
            _this.m_pMoveTime = 0;
            /**到达阈值*/
            _this.m_pArrivalThreshold = 2;
            /**路径阈值(m_pPathThreshold)相当于航点间距 别和 m_pArrivalThreshold 值一样 容易造成到达冲突*/
            _this.m_pPathThreshold = 5;
            return _this;
        }
        /**创建*/
        Actor.prototype.init = function () {
            _super_1.prototype.init.call(this);
            this.m_pPath = [];
            this.m_pIndex = 0;
            this.m_pSpeedType = SpeedType.NONE;
            this.m_pMoveSpeed = [];
            this.m_pMoveSpeed[SpeedType.NONE] = 1;
            this.m_pMoveSpeed[SpeedType.ACTIVE] = 1;
            this.m_pMoveSpeed[SpeedType.PASSIVE] = 1;
        };
        /**销毁*/
        Actor.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_pStarPoint = null;
            this.m_pEndPoint = null;
            this.m_pPath = null;
            this.m_pIndex = null;
            this.m_pSpeedType = null;
            this.m_pMoveSpeed = null;
            this.m_pCallFind = null;
            this.m_pMoveTime = null;
            this.m_pArrivalThreshold = null;
            this.m_pPathThreshold = null;
        };
        /**路径转像素 */
        Actor.prototype.pathToPixel = function (ind) {
            var path = this.m_pPath[ind];
            return path;
        };
        /**添加路径 */
        Actor.prototype.addPaht = function () {
            var path = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                path[_i] = arguments[_i];
            }
            this.m_pPath = this.m_pPath.concat(path);
        };
        /**设置方阵路径(像素) */
        Actor.prototype.setPaht = function (path) {
            this.m_pPath = path;
            this.m_pIndex = 0;
            // debug("Actor:setPaht-------->>设置方阵路径:uid, movespeed, path", this.id, this.getMoveSpeed(), this.m_pPath);
            if (path.length > 0) {
                // test 加缓动效果延迟500毫秒
                var end = path[path.length - 1];
                var len = 500 / (1000 / 30);
                for (var index = 0; index < len; index++) {
                    this.m_pPath.push(egret.Point.create(end.x, end.y));
                }
            }
        };
        /**获取单位路程 */
        Actor.prototype.getSpeed = function () {
            // let speed = this.getMoveSpeed() * this.m_pMoveTime;
            // debug(format("Actor:getSpeed-------->>获取速度:uid:{1} movespeed{2} movetime{3} speed:{4}", this.id, this.moveSpeed, this.moveTime, speed));
            return this.getMoveSpeed();
        };
        Actor.prototype.getMoveSpeed = function (speedtype) {
            if (speedtype == undefined)
                speedtype = this.m_pSpeedType;
            return this.m_pMoveSpeed[speedtype];
        };
        Actor.prototype.setMoveSpeed = function (speedtype, speed) {
            if (speedtype == undefined)
                speedtype = this.m_pSpeedType;
            if (speed == 0) {
                return;
            }
            this.m_pMoveSpeed[speedtype] = speed;
            // debug("Actor:setMoveSpeed--->>", speedtype, speed);
        };
        /**setSpeedType */
        Actor.prototype.setSpeedType = function (st) {
            this.m_pSpeedType = st;
            if (st == SpeedType.ACTIVE) {
                debug("Actor:setSpeedType--->>冲锋啦！！！");
            }
            else if (st == SpeedType.PASSIVE) {
                debug("Actor:setSpeedType--->>被晕啦！！！");
            }
        };
        Actor.prototype.getSpeedType = function () {
            return this.m_pSpeedType;
        };
        /**帧事件*/
        Actor.prototype.onEnterFrame = function (advancedTime) {
            if (this.followPath()) {
                this.findEnd();
                debug("Actor:onEnterFrame--->>到达目的地！！");
            }
        };
        /**寻找行为*/
        Actor.prototype.seek = function (target) {
            var cpos = egret.Point.create(this.x, this.y); //当前位置
            var radian = Utils.MathUtils.getRadian2(cpos.x, cpos.y, target.x, target.y);
            var speedX = this.getMoveSpeed() * Math.cos(radian);
            var speedY = this.getMoveSpeed() * Math.sin(radian);
            var angle = Math.atan2(speedY, speedX) * 180 / Math.PI;
            // let angle: number = Utils.MathUtils.getAngle(radian);
            this.setDirectionOnAngle(angle);
            var x = this.x;
            var y = this.y;
            this.setXY(x += speedX, y += speedY);
            com_main.EventMgr.dispatchEvent(UnitNav.SQUARE_MOVE, this);
        };
        /**到达行为*/
        Actor.prototype.arrive = function (target) {
            var cpos = egret.Point.create(this.x, this.y); //当前位置
            var dist = egret.Point.distance(cpos, target);
            if (dist > this.m_pArrivalThreshold || dist > this.getMoveSpeed()) {
                this.seek(target);
            }
            else {
                this.changeStatus(CSquare_Status.STATUS_STAND);
                this.setXY(target.x, target.y);
                this.m_pPath = [];
                this.m_pIndex = 0;
                return true;
            }
            return false;
        };
        /**跟随路径点*/
        Actor.prototype.followPath = function (loop) {
            if (loop === void 0) { loop = false; }
            var wayPoint = this.pathToPixel(this.m_pIndex); //目标位置
            if (wayPoint == null)
                return true;
            var cpos = new egret.Point(this.x, this.y); //当前位置
            var dist = egret.Point.distance(cpos, wayPoint);
            if (dist < this.m_pPathThreshold) {
                if (this.m_pIndex >= this.m_pPath.length - 1) {
                    if (loop) {
                        this.m_pIndex = 0;
                    }
                }
                else {
                    this.m_pIndex++;
                }
            }
            if (this.m_pIndex >= this.m_pPath.length - 1 && !loop) {
                return this.arrive(wayPoint);
            }
            else {
                this.seek(wayPoint);
            }
            return false;
        };
        /**更新方阵坐标 */
        Actor.prototype.updatePos = function (spos, epos) {
            // 更新方阵当前点和目标点
            this.m_pStarPoint = spos;
            this.m_pEndPoint = epos;
        };
        Actor.prototype.setDirectionOnAngle = function (angle) {
        };
        Actor.prototype.changeStatus = function (status, index) {
        };
        Actor.prototype.bindFind = function (func) {
            this.m_pCallFind = func;
        };
        Actor.prototype.findEnd = function () {
            this.m_pPath = [];
            this.m_pIndex = this.m_pPath.length;
            if (this.m_pCallFind) {
                debug("Actor:callFind--->>结束路程，回调！！", format("uid:{1}", this.id));
                // this.m_pCallFind();
                var tempCallback = this.m_pCallFind;
                this.m_pCallFind = null;
                tempCallback();
            }
        };
        return Actor;
    }(com_main.Animal));
    com_main.Actor = Actor;
})(com_main || (com_main = {}));
