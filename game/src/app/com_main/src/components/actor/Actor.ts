module com_main {
    /**
     * 场景中所有可行走对象的基类
     * @author 
     */
    export class Actor extends Animal implements IFActor {
        /**寻路开始点 */
        public m_pStarPoint: egret.Point;
        /**寻路结束点 */
        public m_pEndPoint: egret.Point;
        /**移动速度(像素/毫秒) */
        private m_pMoveSpeed: SpeedType[];
        /**移动类型 */
        public m_pSpeedType: SpeedType;
        /**路径(像素) */
        public m_pPath: egret.Point[];
        /**走到了第几步 */
        public m_pIndex: number;
        /**移动时间(毫秒) */
        public m_pMoveTime: number = 0;
        /**到达阈值*/
        public m_pArrivalThreshold: number = 2;
        /**路径阈值(m_pPathThreshold)相当于航点间距 别和 m_pArrivalThreshold 值一样 容易造成到达冲突*/
        public m_pPathThreshold: number = 5;

        /**寻路回调 */
        private m_pCallFind: Function;

        public constructor() {
            super();
        }

        /**创建*/
        public init(): void {
            super.init();
            this.m_pPath = [];
            this.m_pIndex = 0;
            this.m_pSpeedType = SpeedType.NONE;
            this.m_pMoveSpeed = [];
            this.m_pMoveSpeed[SpeedType.NONE] = 1;
            this.m_pMoveSpeed[SpeedType.ACTIVE] = 1;
            this.m_pMoveSpeed[SpeedType.PASSIVE] = 1;
        }

        /**销毁*/
        public onDestroy(): void {
            super.onDestroy();
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
        }

        /**路径转像素 */
        public pathToPixel(ind: number) {
            let path: egret.Point = this.m_pPath[ind];
            return path;
        }

        /**添加路径 */
        public addPaht(...path: egret.Point[]) {
            this.m_pPath = this.m_pPath.concat(path)
        }

        /**设置方阵路径(像素) */
        public setPaht(path: egret.Point[]) {
            this.m_pPath = path;
            this.m_pIndex = 0;
            // debug("Actor:setPaht-------->>设置方阵路径:uid, movespeed, path", this.id, this.getMoveSpeed(), this.m_pPath);
            if (path.length > 0) {
                // test 加缓动效果延迟500毫秒
                let end = path[path.length - 1];
                let len = 500 / (1000 / 30)
                for (let index = 0; index < len; index++) {
                    this.m_pPath.push(egret.Point.create(end.x, end.y));
                }
            }
        }

        /**获取单位路程 */
        public getSpeed() {
            // let speed = this.getMoveSpeed() * this.m_pMoveTime;
            // debug(format("Actor:getSpeed-------->>获取速度:uid:{1} movespeed{2} movetime{3} speed:{4}", this.id, this.moveSpeed, this.moveTime, speed));
            return this.getMoveSpeed();
        }

        public getMoveSpeed(speedtype?: SpeedType) {
            if (speedtype == undefined) speedtype = this.m_pSpeedType;
            return this.m_pMoveSpeed[speedtype];
        }

        public setMoveSpeed(speedtype: SpeedType, speed: number) {
            if (speedtype == undefined) speedtype = this.m_pSpeedType;

            if(speed == 0)
            {
                return;
            }
            this.m_pMoveSpeed[speedtype] = speed;
            // debug("Actor:setMoveSpeed--->>", speedtype, speed);
        }

        /**setSpeedType */
        public setSpeedType(st: SpeedType) {
            this.m_pSpeedType = st;
            if (st == SpeedType.ACTIVE) {
                debug("Actor:setSpeedType--->>冲锋啦！！！");
            } else if (st == SpeedType.PASSIVE) {
                debug("Actor:setSpeedType--->>被晕啦！！！");
            }
        }

        public getSpeedType() {
            return this.m_pSpeedType;
        }

        /**帧事件*/
        public onEnterFrame(advancedTime: number): void {
            if (this.followPath()) {
                this.findEnd();
                debug("Actor:onEnterFrame--->>到达目的地！！");
            }
        }

        /**寻找行为*/
        public seek(target: egret.Point): void {
            let cpos = egret.Point.create(this.x, this.y);//当前位置
            let radian: number = Utils.MathUtils.getRadian2(cpos.x, cpos.y, target.x, target.y);
            let speedX: number = this.getMoveSpeed() * Math.cos(radian);
            let speedY: number = this.getMoveSpeed() * Math.sin(radian);
            let angle: number = Math.atan2(speedY, speedX) * 180 / Math.PI;
            // let angle: number = Utils.MathUtils.getAngle(radian);
            this.setDirectionOnAngle(angle);
            let x = this.x;
            let y = this.y;
            this.setXY(x += speedX, y += speedY);
            EventMgr.dispatchEvent(UnitNav.SQUARE_MOVE, this);
        }

        /**到达行为*/
        public arrive(target: egret.Point): boolean {
            let cpos = egret.Point.create(this.x, this.y);//当前位置
            let dist: number = egret.Point.distance(cpos, target);
            if (dist > this.m_pArrivalThreshold || dist > this.getMoveSpeed()) {
                this.seek(target);
            } else {
                this.changeStatus(CSquare_Status.STATUS_STAND)
                this.setXY(target.x, target.y);
                this.m_pPath = [];
                this.m_pIndex = 0;
                return true;
            }
            return false;
        }

        /**跟随路径点*/
        public followPath(loop: boolean = false): boolean {
            let wayPoint: egret.Point = this.pathToPixel(this.m_pIndex);//目标位置
            if (wayPoint == null) return true;
            let cpos = new egret.Point(this.x, this.y);//当前位置
            let dist: number = egret.Point.distance(cpos, wayPoint);
            if (dist < this.m_pPathThreshold) {
                if (this.m_pIndex >= this.m_pPath.length - 1) {
                    if (loop) {
                        this.m_pIndex = 0;
                    }
                } else {
                    this.m_pIndex++;
                }
            }

            if (this.m_pIndex >= this.m_pPath.length - 1 && !loop) {
                return this.arrive(wayPoint);
            } else {
                this.seek(wayPoint);
            }
            return false;
        }

        /**更新方阵坐标 */
        public updatePos(spos: egret.Point, epos: egret.Point) {
            // 更新方阵当前点和目标点
            this.m_pStarPoint = spos;
            this.m_pEndPoint = epos;
        }

        public setDirectionOnAngle(angle: number) {

        }
        public changeStatus(status: CSquare_Status, index?: number): void {

        }

        public bindFind(func: Function) {
            this.m_pCallFind = func;
        }

        public findEnd() {
            this.m_pPath = [];
            this.m_pIndex = this.m_pPath.length;

            if (this.m_pCallFind) {
                debug("Actor:callFind--->>结束路程，回调！！", format("uid:{1}", this.id));
               // this.m_pCallFind();
                let tempCallback =this.m_pCallFind; 
                this.m_pCallFind = null;
                tempCallback();
            }
        }
    }
}