module com_main {

    export interface SoldierMoveConf {
        teamKey: string;
        /**移动开始坐标 */
        startPoint: egret.Point;
        /**移动结束坐标 */
        endPoint: egret.Point;
        /**移动偏移 */
        aoffset: number;
        /**路径偏移 */
        boffset: number;
        /**x方向 */
        dirX: number;
        /**y方向 */
        dirY: number;
        /**移动倍数 */
        odd: number;
        /**移动速度 */
        speed: number;
    }

    export class SoldierAmin extends CComponent {

        /**人物形象id */
        private m_nType: number = 1000;
        /**人物形象方向 */
        private m_nDirection: CSquare_Direction = CSquare_Direction.RIGHT_DOWN;
        private m_nBaseDirection: CSquare_Direction = CSquare_Direction.RIGHT_DOWN;
        /**人物形象动作 */
        private m_nAction: string = 'w';
        /**人物动作id */
        private m_nIndx: number = 0;
        /**人物动作时间 */
        private m_nDt: number = 0;
        /**人物动作播放速度 */
        private m_nSpeed: number = 150;
        /**人物texture列表 */
        private m_pTextureSheet: { [k: string]: egret.Texture } = {};
        /**人物主体 */
        private m_pSoldier: egret.Bitmap = null;
        /**人物位置偏移x */
        private m_nOffsetX: number = 0;
        /**人物位置偏移y */
        private m_nOffsetY: number = 0;
        private m_bInit: boolean = false;

        public get offsetX() {
            return this.m_nOffsetX;
        }

        public get offsetY() {
            return this.m_nOffsetY;
        }

        public get direction(): CSquare_Direction {
            return this.m_nBaseDirection;
        }

        public constructor(ty?: number) {
            super();
            this.name = "SoldierAmin";
            // this.width = 50;
            // this.height = 80;
            this.m_nType = ty || this.m_nType;
            this.m_bInit = true;
            this.initTexture();
        }


        public onDestroy(): void {
            this.m_pTextureSheet = null;
            this.m_bInit = false;
            egret.Tween.removeTweens(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.initSoldier();
        }

        private initTexture(): void {
            let path = `soldier_${this.m_nType}_json`;
            RES.getResAsync(path, (sheets: egret.SpriteSheet) => {
                if (!this.m_bInit) return;
                
                let texture: any = sheets._textureMap;
                this.m_pTextureSheet = {};
                for (let name in texture) {
                    this.m_pTextureSheet[name] = texture[name];
                }
                this.initSoldier();
            }, this);
        }

        private __reset_size(): void {
            let w = this.m_pSoldier.width, h = this.m_pSoldier.height;
            this.m_pSoldier.anchorOffsetX = w / 2;
            this.m_pSoldier.anchorOffsetY = h / 2;
            this.m_pSoldier.x = w / 2;
            this.m_pSoldier.y = h / 2;

            this.width = w;
            this.height = h;
            this.anchorOffsetX = w / 2;
            this.anchorOffsetY = h / 2;
        }

        private initSoldier(): void {
            let animRes = this.getTexture()
            if (this.m_pSoldier) {
                this.m_pSoldier.texture = animRes[this.getActionName() + "_0"];
                this.startAction();
                this.__reset_size();
                return;
            }
            let w = 0, h = 0;
            if (!animRes) {
                this.m_pSoldier = Utils.DisplayUtils.createBitmap();
                this.addChild(this.m_pSoldier);
            } else {
                let animTexture: egret.Texture = animRes[this.getActionName() + "_0"]
                this.m_pSoldier = Utils.DisplayUtils.createBitmap(animTexture);
                this.addChild(this.m_pSoldier);
                this.startAction();
                this.__reset_size();
            }
        }

        private getTexture(): { [k: string]: egret.Texture } {
            if (!this.m_pTextureSheet) this.m_pTextureSheet = {};
            return this.m_pTextureSheet;
        }

        private getActionName(d?: number, a?: string): string {
            return `${this.m_nType}_${d || this.m_nDirection}_${a || this.m_nAction}`;
        }

        private startAction(): void {
            this.m_nDt = TimerUtils.getServerTimeMill();
        }

        public onAnimEvent(): void {
            if (!this.m_pSoldier || !this.m_pTextureSheet || TimerUtils.getServerTimeMill() - this.m_nDt < this.m_nSpeed)
                return;
            this.m_nDt = TimerUtils.getServerTimeMill();
            this.m_nIndx++;
            if (this.m_nIndx > 4)
                this.m_nIndx = 0
            let animRes = this.getTexture()
                , animTexture: egret.Texture = animRes[`${this.getActionName()}_${this.m_nIndx}`]
            this.m_pSoldier.texture = animTexture;
        }

        private flipByDirection(direction: CSquare_Direction): void {

        }


        public async setDirection(direct: CSquare_Direction) {
            if (this.m_nBaseDirection == direct) return;
            this.m_nBaseDirection = direct;
            let odd = 1;
            this.rotation = 0;


            if (direct == CSquare_Direction.LEFT_DOWN) {
                this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
                odd = -1;
            } else if (direct == CSquare_Direction.LEFT) {
                if (this.m_nType == 1009) {
                    this.m_nDirection = CSquare_Direction.LEFT;
                    odd = -1;
                } else {
                    this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
                    odd = -1;
                }
            } else if (direct == CSquare_Direction.LEFT_UP) {
                this.m_nDirection = CSquare_Direction.RIGHT_UP;
                odd = -1;
            } else if (direct == CSquare_Direction.RIGHT) {
                if (this.m_nType == 1009) {
                    this.m_nDirection = CSquare_Direction.LEFT;
                } else
                    this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
            } else {
                this.m_nDirection = direct;
            }


            if (this.m_pSoldier.scaleX != odd) {
                // this.x = 140-this.x;
                this.m_pSoldier.scaleX = odd;
            }
        }

        public updateOffset(x: number, y: number) {
            this.m_nOffsetX = x;
            this.m_nOffsetY = y;
        }

        public onMoveEvent(x: number, y: number, dt: number) {
            let px = x - this.m_nOffsetX
                , py = y - this.m_nOffsetY
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ x: x, y: y }, dt);
        }

        public setActionStatus(stat: string) {
            this.m_nAction = stat;
        }

    }

    export class SoldierSprite extends egret.DisplayObjectContainer {

        protected static m_nId: number = 0;
        private m_nIid: number;
        /**人物位置偏移x */
        private m_nOffsetX: number = 0;
        /**人物位置偏移y */
        private m_nOffsetY: number = 0;

        public get iid(): number {
            return this.m_nIid;
        }

        public constructor(x: number, y: number, offsetX?: number, offsetY?: number) {
            super();
            SoldierSprite.m_nId++;
            this.m_nIid = SoldierSprite.m_nId;
            this.name = `soldier_${this.m_nIid}`;


            let spr = new SoldierAmin();
            spr.x = spr.width / 2;
            spr.y = spr.height / 2;
            spr.scaleX = .7;
            spr.scaleY = .7;
            Utils.addChild(this, spr);

            this.width = spr.width;
            this.height = spr.height;
            this.anchorOffsetX = spr.width / 2;
            this.anchorOffsetY = spr.height / 2;

            this.m_nOffsetX = offsetX;
            this.m_nOffsetY = offsetY;
            this.x = x + offsetX;
            this.y = y + offsetY;


        }

        public async tickEvent(): Promise<boolean> {
            this._on_anim_event();
            return false;
        }


        /**
         * 动画事件
         * @returns void
         */
        protected _on_anim_event(): void {
            for (let o of this.$children) {
                if (o.name != 'SoldierAmin') continue
                let army = <SoldierAmin>o;
                army.onAnimEvent();
            }
        }


        private setSoilderAngle(angle: number): void {
            let [direct, rotation] = ArmySprite.getDirectionAngle(angle);
            for (let o of this.$children) {
                if (o.name != 'SoldierAmin') continue
                let army = <SoldierAmin>o;
                army.setDirection(direct);
            }
        }

        public onMoveEvent(ax: number, ay: number, dt: number, angle: number) {
            this.setSoilderAngle(angle);
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ x: ax + this.m_nOffsetX, y: ay + this.m_nOffsetY }, dt);
        }

        public resetPoint(x: number, y: number, offsetX: number, offsetY: number) {
            egret.Tween.removeTweens(this);
            this.m_nOffsetX = offsetX;
            this.m_nOffsetY = offsetY;
            this.x = x + offsetX;
            this.y = y + offsetY;
        }

    }


    /**
     * 士兵动画 
     */
    export class ArmySprite extends CComponent {

        private m_teamKey: string;
        private m_nArmyId: number = 0;
        /**人物位置偏移x */
        private m_nOffsetX: number = 0;
        /**人物位置偏移y */
        private m_nOffsetY: number = 0;
        /**移动时间 */
        private m_nMoveDt: number = 0;
        /**移动速度(ms) */
        private m_nMoveSpeed: number = 0;
        /**是否正在移动 */
        private m_bMove: boolean = false;
        /**移动城池路线 */
        private m_aCityVert: number[] = [];
        /**移动坐标列表 */
        private m_aMovePoint: number[][] = [];
        /**移动开始坐标 */
        private m_pStartPoint: egret.Point = null;
        /**移动结束坐标 */
        private m_pEndPoint: egret.Point = null;
        /**移动路线类型 */
        private m_nPathType: number = 1;
        /**移动偏移 */
        private m_nAoffset: number = 1;
        /**路径偏移 */
        private m_nBoffset: number = 0;
        /**x方向 */
        private m_nDirX: number = 1;
        /**y方向 */
        private m_nDirY: number = 1;
        /**移动倍数 */
        private m_nOdd: number = 1;
        /**上一个位置点 */
        private m_nLastPoint: number[] = [];
        /**总时间(正常速度) */
        private m_nTotalDt: number = 10;
        /**实际总时间 */
        private m_nAllDt: number = 0;
        /**X移动偏量 */
        private m_nMoveX: number = 0;
        /**Y移动偏量 */
        private m_nMoveY: number = 0;
        /**开始时间 */
        private m_nStartDt: number = 0;
        /**结束时间 */
        private m_nEndDt: number = 0;
        /**返回状态 */
        private m_bBack: boolean = false;
        private m_pMain: SoldierAmin;
        private m_aChildren: number[] = [];
        private m_aCityWay: number[] = [];

        private m_pLbTime: WorldSoilderTime;
        private m_pEffectSmoke: egret.Bitmap;

        /** 客户端移动数据 */
        private m_clientMoveEt: IClientMoveEt;

        public get teamKey(): string {
            return this.m_teamKey;
        }

        public set teamKey(id: string) {
            this.m_teamKey = id;
            this.name = `hero_${this.m_teamKey}`;
            this.__create_time();
        }

        public get totalDt(): number {
            return this.m_nTotalDt;
        }

        public get allDt(): number {
            return this.m_nAllDt;
        }
        public get realTotalDt(): number {
            return this.m_nEndDt == 0 ? this.m_nTotalDt : (this.m_nEndDt - TimerUtils.getServerTime() > 0 ? this.m_nEndDt - TimerUtils.getServerTime() : 0);
        }
        /**可移除时间 添加1秒 */
        public get canRemoveDt(): boolean {
            /**客户端移动 不等待 */
            if (this.m_nPathType == 2) {
                return (this.m_nEndDt - TimerUtils.getServerTime()) <= 0;
            }
            return ((this.m_nEndDt + 0.2) - TimerUtils.getServerTime() <= 0);
        }

        public get realDtStr(): string {
            return Utils.DateUtils.getFormatBySecond(this.realTotalDt, 1);
        }

        public get soldierChildren(): number[] {
            return this.m_aChildren;
        }

        public get direction(): CSquare_Direction {
            return this.m_pMain.direction;
        }

        public static getAngle(x1: number | egret.Point | number[], x2: number | egret.Point | number[], y1?: number, y2?: number): number {
            if (x1 instanceof egret.Point && x2 instanceof egret.Point) {
                y1 = x1.y;
                x1 = x1.x;
                y2 = x2.y;
                x2 = x2.x;
            } else if (x1 instanceof Array && x2 instanceof Array) {
                [x1, y1] = [...x1];
                [x2, y2] = [...x2];
            }
            let angle = Math.atan2(y1 - y2, <number>x1 - <number>x2) * 180 / Math.PI;
            return angle + 90;
        }

        public static getDirectionAngle(angle: number): [CSquare_Direction, number] {
            let direction = CSquare_Direction.UP, rotation = 0;
            if ((337.5 < angle && angle < 360) || (angle < 22.5 && angle >= -22.5)) {
                direction = CSquare_Direction.UP;
                rotation = -90;
            } else if (22.5 <= angle && angle < 67.5) {
                direction = CSquare_Direction.RIGHT_UP;
                rotation = -45;
            } else if (67.5 <= angle && angle < 112.5) {
                direction = CSquare_Direction.RIGHT;
            } else if (112.5 <= angle && angle < 157.5) {
                direction = CSquare_Direction.RIGHT_DOWN;
                rotation = 45;
            } else if (157.5 <= angle && angle < 202.5) {
                direction = CSquare_Direction.DOWN;
                rotation = 90;
            } else if ((202.5 <= angle && angle < 247.5) || (angle < -112.5 && angle >= -157.5)) {
                direction = CSquare_Direction.LEFT_DOWN;
                rotation = 135;
            } else if ((247.5 <= angle && angle < 292.5) || (angle < -67.5 && angle >= -112.5)) {
                direction = CSquare_Direction.LEFT;
                rotation = 180;
            } else if ((292.5 <= angle && angle < 337.5) || (angle < -22.5 && angle >= -67.5)) {
                direction = CSquare_Direction.LEFT_UP;
                rotation = -135;
            }
            return [direction, rotation];
        }

        public get conf(): SoldierMoveConf {
            return <SoldierMoveConf>{
                teamKey: this.m_teamKey,
                startPoint: this.m_pStartPoint,
                endPoint: this.m_pEndPoint,
                aoffset: this.m_nAoffset,
                boffset: this.m_nBoffset,
                dirX: this.m_nDirX,
                dirY: this.m_nDirY,
                odd: this.m_nOdd,
                speed: this.m_nMoveSpeed,
            }
        }

        public constructor(offsetX: number = 0, offsetY: number = 0) {
            super();
            this.name = `hero_`;
            this.width = 140;
            this.height = 90;
            this.anchorOffsetX = 70;
            this.anchorOffsetY = 45;

            this.m_nOffsetX = offsetX;
            this.m_nOffsetY = offsetY;
        }


        public onDestroy(): void {
            this.m_aMovePoint = [];
            this.m_aCityVert = [];
            this.m_aChildren = [];
            this.m_pStartPoint = null;
            this.m_pEndPoint = null;
            this.m_clientMoveEt = null;
            let menu = this.getChildByName('WorldMenuArmy');
            if (menu)
                (<WorldMenuArmyWidget>menu).removeFromParent();

            egret.Tween.removeTweens(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();



        }

        protected _local_to_main(x: number, y: number): [number, number] {
            let p = this.parent.localToGlobal(x, y)
                , pos = this.m_pMain.globalToLocal(p.x, p.y)
            return [pos.x, pos.y];
        }

        private __get_children_point(direction?: CSquare_Direction) {
            direction = direction != undefined ? direction : this.direction;
            if (direction == CSquare_Direction.RIGHT) {
                return [[-85, -50], [-115, -30], [-85, -20], [-55, -30], [-115, 0], [-85, 10], [-55, -0]]
            } else if (direction == CSquare_Direction.RIGHT_DOWN) {
                return [[-75, -60], [-105, -40], [-75, -30], [-45, -40], [-105, -10], [-75, 0], [-45, -10]]
            } else if (direction == CSquare_Direction.RIGHT_UP) {
                return [[-80, 10], [-40, 10], [-100, 40], [-60, 40], [-20, 40], [-80, 70], [-40, 70]];
            } else if (direction == CSquare_Direction.UP) {
                return [[-50, 30], [-10, 30], [-70, 60], [-30, 60], [10, 60], [-50, 90], [-10, 90]];
            } else if (direction == CSquare_Direction.DOWN) {
                return [[-10, -110], [20, -110], [-30, -80], [10, -80], [50, -80], [-10, -50], [20, -50]];
            } else if (direction == CSquare_Direction.LEFT_DOWN) {
                return [[35, -90], [75, -90], [15, -60], [55, -60], [95, -60], [35, -30], [75, -30]];
            } else if (direction == CSquare_Direction.LEFT) {
                return [[60, -20], [100, -20], [40, 10], [80, 10], [120, 10], [60, 40], [100, 40]];
            }
            return [[40, -10], [80, -10], [20, 20], [60, 20], [100, 20], [40, 50], [80, 50]];
        }

        // private __create_smoke_effect(x: number, y: number) {
        //     this.m_pEffectSmoke = new egret.Bitmap();
        //     this.m_pEffectSmoke.width = 171;
        //     this.m_pEffectSmoke.height = 174;
        //     EffectData.addEffect(EffectData.WORLD, IETypes.EWorld_Smoke, this.m_pEffectSmoke);
        //     this.addChildAt(this.m_pEffectSmoke, 0)
        //     this.m_pEffectSmoke.anchorOffsetX = this.m_pEffectSmoke.width / 2;
        //     this.m_pEffectSmoke.anchorOffsetY = this.m_pEffectSmoke.height / 2;
        //     this.m_pEffectSmoke.x = this.width / 2 + x + 10;
        //     this.m_pEffectSmoke.y = this.height / 2 + y - 10;
        // }

        private __create_time() {
            this.m_pLbTime = new WorldSoilderTime(this.m_teamKey);
            this.addChild(this.m_pLbTime)
            this.m_pLbTime.x = 0;
            this.m_pLbTime.y = -75;
        }

        private initSoldier(direct?: CSquare_Direction): void {
            // if (this.m_nPathType != 1) {
            //     let pos = this.__get_children_point(direct);
            //     for (let [x, y] of pos) {
            //         let spr = new SoldierAmin();
            //         spr.x = x + this.width / 2;
            //         spr.y = y + this.height / 2;
            //         spr.scaleX = .7;
            //         spr.scaleY = .7;
            //         Utils.addChild(this, spr);
            //         spr.setDirection(direct);
            //     }
            // }

            this.m_pMain = new SoldierAmin(1009);
            this.m_pMain.x = this.width / 2;
            this.m_pMain.y = this.height / 2;
            this.m_pMain.scaleX = .9;
            this.m_pMain.scaleY = .9;
            Utils.addChild(this, this.m_pMain);
            if (direct != undefined)
                this.m_pMain.setDirection(direct);


        }

        public async tickEvent(): Promise<boolean> {
            Promise.all([
                this.m_pLbTime.tickEvent(this.realDtStr),
                this._on_anim_event(),
                this._on_move_event()
            ])
            return false;
        }

        /**
         * 动画事件
         * @returns void
         */
        protected _on_anim_event(): void {
            for (let o of this.$children) {
                if (o.name != 'SoldierAmin') continue
                let army = <SoldierAmin>o;
                army.onAnimEvent();
            }
        }

        protected _set_anim_action(stat: string): void {
            for (let o of this.$children) {
                if (o.name != 'SoldierAmin') continue
                let army = <SoldierAmin>o;
                army.setActionStatus(stat);
            }
        }

        private setSoilderAngle(angle: number): void {
            let [direct, rotation] = ArmySprite.getDirectionAngle(angle);
            this.__set_soilder_direct(direct);
        }

        private __set_soilder_direct(direct: CSquare_Direction): void {
            for (let o of this.$children) {
                if (o.name != 'SoldierAmin') continue
                let army = <SoldierAmin>o;
                army.setDirection(direct);
            }
        }


        private __reset_amry_point(): void {
            let i = 0, direct = this.getChildrenPoint();
            (<HeroLayer>this.parent).getAmryChildren(this.m_aChildren, (o) => {

                let [x, y] = direct[i];
                o.resetPoint(this.x, this.y, x, y);
                i++;
            }, this);
        }

        /**
         * 检查是否可以移除
         * @returns boolean
         */
        private __check_remove(): boolean {
            if (this.canRemoveDt) {
                WorldView.callFunc(WORLD_FUNC.END_HERO_MOVE, this.m_teamKey);
                return true;
            }
            return false;
        }

        /**
         * 移动事件
         * @returns void
         */
        protected _on_move_event(): void {
            if (this.__check_remove()) return;
            if (!this.m_bMove) {
                return;
            }
            if (TimerUtils.getServerTimeMill() - this.m_nMoveDt <= this.m_nMoveSpeed) return;
            this.m_nMoveDt = this.m_nMoveDt + this.m_nMoveSpeed;

            if (this.m_nPathType == 2) { //直线移动
                let x = this.x + this.m_nMoveX * this.m_nDirX
                    , y = this.y + this.m_nMoveY * this.m_nDirY;

                this.x = x;
                this.y = y;
                return;
            }

            //点移动
            if (!this.m_aMovePoint || this.m_aMovePoint.length == 0) return;
            //清除线路
            let indx = this.m_aMovePoint.length;
            if (indx >= 0 && this.m_aCityWay.length > 0) {
                WorldView.callFunc(WORLD_FUNC.REMOVE_CITY_WAY, this.m_aCityWay[Math.floor(indx / 2)])
            }

            let point = this.m_aMovePoint.pop()
                , [x, y] = point
                , angle = ArmySprite.getAngle(point, this.m_nLastPoint);

            this.setSoilderAngle(angle);

            this.__reset_amry_point();

            this.m_nLastPoint = point;
            egret.Tween.removeTweens(this);
            let ax = this.m_nOffsetX * this.m_nDirX + x, ay = this.m_nOffsetY * this.m_nDirY + y;
            egret.Tween.get(this).to({ x: ax, y: ay }, this.m_nMoveSpeed);
            WorldView.callFunc(WORLD_FUNC.UPDATE_HERO_LINE_WAY, new egret.Point(ax, ay), this.m_teamKey)
            let i = 0, direct = this.getChildrenPoint();
            (<HeroLayer>this.parent).getAmryChildren(this.m_aChildren, (o) => {
                let [x, y] = direct[i];
                o.resetPoint(this.x, this.y, x, y);
                i++;
                o.onMoveEvent(ax, ay, this.m_nMoveSpeed, angle);
            }, this);

        }


        /**
         * 由结束时间更新位置
         * @returns void
         */
        private __update_dt_move(): void {
            if (this.m_nEndDt <= 0) {
                this.m_nEndDt = TimerUtils.getServerTime() + this.totalDt;
                return;
            }
            /**经过多次加速以后 换算标准速度 */
            this.m_nMoveSpeed = Number(this.m_nAllDt / (this.m_aMovePoint.length) * 1000);

            let n = Math.floor(this.realTotalDt * 1000 / this.m_nMoveSpeed)//剩余点数
                , num = this.m_aMovePoint.length
            if (this.realTotalDt >= 0) {
                /**最少保留两个点 */
                let leftNum = n;
                leftNum = Math.max(2, leftNum);
                leftNum = Math.min(num, leftNum);
                this.m_aMovePoint = this.m_aMovePoint.slice(0, leftNum);
            }
            //按剩余时间 剩余点数 重新换算速度 [由于时间段 和点数相等 最后一个时间段的点没有执行移动 故人为添加一个点长度]
            this.m_nMoveSpeed = Number(this.realTotalDt / (this.m_aMovePoint.length + 1) * 1000);
        }

        /**
         * 点移动
         * @private
         * @param  {number[]} cityVert 顶点集合
         * @param  {number} dt 时间(结束时间)
         * @return void
         * @memberof ArmySprite
         */
        private __init_point_move(cityVert: number[], sdt: number, edt: number, trpsType: number): void {
            if (cityVert && cityVert.length > 1) {
                this.m_aCityVert = cityVert;
                // this.__update_move_point();
                let way: number[][];
                [this.m_nTotalDt, this.m_nMoveSpeed, way] = DjikstraGraph.Instance.GetEdgeTime(cityVert);


                this.m_nStartDt = sdt;
                this.m_nEndDt = edt;
                this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
                this.m_aMovePoint = way;
                this.m_aMovePoint.reverse();

                this.__update_dt_move();

                this.initSoldier();
                let [x, y] = this.m_aMovePoint.pop();
                this.setPosition(x, y);
                
                if(this.m_aMovePoint.length>0){
                     let angle = ArmySprite.getAngle(this.m_aMovePoint[0], [x, y]);
                    this.setSoilderAngle(angle);
                    //线路
                    this.__create_city_way(x, y, this.m_aMovePoint, trpsType);
                }
               
                this.startMove();
                // this.__create_hero_line_way(this);
            }
        }

        /**
         * 线移动
         * @private
         * @param  {egret.Point} startPoint 
         * @param  {egret.Point} endPoint 
         * @param  {number} [dt] 
         * @return void
         * @memberof ArmySprite
         */
        private __init_line_move(startPoint: egret.Point, endPoint: egret.Point): void {
            if (startPoint && endPoint) { //直线移动
                this.m_nMoveSpeed = 50;
                this.m_pStartPoint = startPoint;
                this.m_pEndPoint = endPoint;
                let len = egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint);
                this.m_nOdd = len / (this.m_nAllDt * 1000) * this.m_nMoveSpeed;   //每帧移动速度

                //偏移
                let x = this.m_pEndPoint.x - this.m_pStartPoint.x
                    , y = this.m_pEndPoint.y - this.m_pStartPoint.y;
                this.m_nAoffset = y / x;
                this.m_nDirX = x >= 0 ? 1 : -1;
                this.m_nDirY = y >= 0 ? 1 : -1;
                this.m_nMoveX = Math.sqrt(Math.pow(this.m_nOdd, 2) / (1 + Math.pow(Math.abs(this.m_nAoffset), 2)));
                this.m_nMoveY = Math.abs(this.m_nAoffset) * this.m_nMoveX;

                //角度
                let angle = ArmySprite.getAngle(endPoint, startPoint);
                let [direct, _] = ArmySprite.getDirectionAngle(angle);
                this.initSoldier(direct);
                //矫正起始位置(计算已走帧数)
                let d = Math.floor((TimerUtils.getServerTime() - this.m_nStartDt) * 1000 / this.m_nMoveSpeed);
                d = d < 0 ? 0 : d
                this.setPosition(startPoint.x + d * this.m_nMoveX * this.m_nDirX, startPoint.y + d * this.m_nMoveY * this.m_nDirY)


                this.startMove();
            }
        }

        /**
         * 初始化移动信息
         * @param  {number} ty 类型(1:点移动，2:资源，3:拜访)
         * @param  {number[]} [cityVert] 顶点列表
         * @param  {number} [sdt=0] 时间
         * @param  {number} [edt=0] 时间
         * @param  {number} [mt=1] 前往类型(1:前往，2:返回)
         * @param {number} trpsType 路线类型 （0：黄色 1：红色）
         * @return void 
         * @memberof ArmySprite
         */
        public initMoveInfo(cityVert?: number[], sdt: number = 0, edt: number = 0, mt: number = 1, trpsType: number = 0): void {
            this.m_nPathType = 1;
            this.m_bBack = mt == EumWorldEventMoveType.BACK;
            this.__init_point_move(cityVert, sdt, edt, trpsType);
        }
        /**
         * 直线移动
         * @param edt 结束事件
         *  */
        public initLineMoveInfo(data: IClientMoveEt): void {
            this.m_nPathType = 2;
            this.m_clientMoveEt = data;
            this.m_bBack = false;
            this.m_nStartDt = data.startTime;
            this.m_nEndDt = data.endTime;

            let teamVo: TeamVo = TeamModel.getTeamVoByTypeId(TeamType.WORLD, data.teamId);
            let cityId: number = teamVo.cityId;
            if (teamVo.cityId == -1) {
                let moveData = WorldModel.getTeamMoveData(`${RoleData.playerId}_${data.teamId}`);
                cityId = moveData.cityPath[0];
            }
            let evtVo = WorldModel.getEventVoByPosId(data.evtPosId);

            //改成从部队所在的城池出发
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) return;
            let [x1, y1] = DjikstraGraph.Instance.GetVertex(cityId).cityPos;
            let sPos = data.isBack ? new egret.Point(evtVo.pos.x, evtVo.pos.y) : new egret.Point(x1, y1);
            let ePos = data.isBack ? new egret.Point(x1, y1) : new egret.Point(evtVo.pos.x, evtVo.pos.y);
            this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
            this.m_nTotalDt = this.m_nEndDt - TimerUtils.getServerTime();
            this.__init_line_move(sPos, ePos);
        }

        public startMove(): void {
            if (this.m_bMove) return;
            this.m_nMoveDt = TimerUtils.getServerTimeMill();
            this.m_bMove = true;
        }

        public endMove(): void {
            if (!this.m_bMove) return;
            this.m_bMove = false;
            egret.Tween.removeTweens(this);
        }

        public setPosition(x: number, y: number): void {
            this.x = this.m_nOffsetX + x;
            this.y = this.m_nOffsetY + y;
            this.m_nLastPoint = [x, y];
        }

        /**
         * 点击事件
         * @param  {number} x
         * @param  {number} y
         * @returns boolean
         */
        public checkTouchEvent(x: number, y: number): boolean {
            /**部队镜像移动 过滤 */
            //部队del信息没有收到
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (!data) return;
            if (this.m_nPathType != 1) return;
            if (data.playerId != RoleData.playerId) return;
            let menu = this.getChildByName('WorldMenuArmy');
            if (menu && (<WorldMenuArmyWidget>menu).hitPoint(x, y)) {
                return true;
            }

            if (this.hitTestPoint(x, y)) {
                if (!menu) {
                    let data = WorldModel.getTeamMoveData(this.m_teamKey);
                    WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.HERO, this.m_teamKey);
                    this.isShowTime(false);
                    this._create_menu();
                }
                return true;
            }
            if (menu)
                (<WorldMenuArmyWidget>menu).removeFromParent();
            return false;
        }
        /**
         * 创建行军菜单
         * @returns WorldMenuArmyWidget
         */
        protected _create_menu(): WorldMenuArmyWidget {
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
            let menu = new WorldMenuArmyWidget(this.m_teamKey);
            Utils.addChild(this, menu);
            menu.x = -135;
            menu.y = -100;
            return menu;
        }

        /**
         * 半路返回
         * @returns void
         */
        public onHalfWayBack(data: gameProto.ITeamMoveDataResp): void {
            this.m_bBack = true;
            this.endMove();
            this.initMoveInfo(data.cityPath, data.startTime, data.endTime, data.moveType);
        }

        /**
         * 创建城池间线路
         * @private
         * @param  {number} x 
         * @param  {number} y 
         * @param  {number[][]} allway 
         * @return void
         * @memberof ArmySprite
         */
        private __create_city_way(x: number, y: number, allway: number[][], trpsType: number): void {
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            //友方阵营不创建线路
            if (data && data.countryId == RoleData.countryId && data.playerId != data.playerId) {
                return;
            }
            if (allway.length == 0) return;
            //消除
            if (this.m_aCityWay.length > 0)
                WorldView.callFunc(WORLD_FUNC.REMOVE_CITY_WAY, this.m_aCityWay);

            //到达位置
            let indx = -1, w = allway[0], po = [x, y].toString()
            if (w.toString() != po) {
                let index = 0;
                while (w) {
                    if (w.toString() == po) {
                        indx = index;
                        break;
                    }
                    ++index;
                    w = allway[index];
                }
            } else {
                indx = 0;
            }

            allway.splice(0, indx + 1);
            this.m_aCityWay = WorldView.callFunc(WORLD_FUNC.CREATE_CITY_WAY, allway, trpsType);

        }
        /**
         * 模型到目标城市的直线
         */
        public __create_hero_line_way(army: ArmySprite): void {
            WorldView.callFunc(WORLD_FUNC.CREATE_HERO_LINE_WAY, army);
        }

        /**
        * 更新模型直线
        */
        public __update_hero_line_way(movePoint: egret.Point): void {
            WorldView.callFunc(WORLD_FUNC.UPDATE_HERO_LINE_WAY, movePoint);
        }
        /**
         * 加速
         * @param  {number} dt 结束时间
         * @return void
         * @memberof ArmySprite
         */
        public onAccelerate(): void {
            this.endMove();
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data) {
                this.m_nStartDt = data.startTime;
                this.m_nEndDt = data.endTime;
                this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
                //[由于时间段 和点数相等 最后一个时间段的点没有执行移动 故人为添加一个点长度]
                this.m_nMoveSpeed = Number(this.realTotalDt / (this.m_aMovePoint.length + 1) * 1000);
                this.m_nMoveDt = TimerUtils.getServerTimeMill();
            } else {
                WorldView.callFunc(WORLD_FUNC.END_HERO_MOVE, this.m_teamKey);
            }

            this.startMove();
        }


        public setChildrenId(iid: number[]) {
            this.m_aChildren = iid;
        }

        /**
         * 
         * @param direction 
         */
        public getChildrenPoint(direction?: CSquare_Direction): number[][] {
            direction = direction != undefined ? direction : this.direction;
            if (direction == CSquare_Direction.RIGHT || direction == CSquare_Direction.RIGHT_DOWN) {
                return [[-75, -60], [-105, -40], [-75, -30], [-45, -40], [-105, -10], [-75, 0], [-45, -10]]
            } else if (direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.UP) {
                return [[-50, 30], [-10, 30], [-70, 60], [-30, 60], [10, 60], [-50, 90], [-10, 90]];
            } else if (direction == CSquare_Direction.DOWN) {
                return [[10, -90], [40, -90], [-10, -60], [30, -60], [70, -60], [10, -30], [40, -30]];
            } else if (direction == CSquare_Direction.LEFT_DOWN) {
                return [[35, -90], [75, -90], [15, -60], [55, -60], [95, -60], [35, -30], [75, -30]];
            } else if (direction == CSquare_Direction.LEFT) {
                return [[45, -70], [85, -70], [25, -40], [65, -40], [105, -40], [45, -10], [85, -10]];
            }
            return [[-10, 30], [30, 30], [-30, 60], [10, 60], [50, 60], [-10, 90], [30, 90]];
        }

        public removeFromParent() {
            if (this.m_aCityWay.length > 0)
                WorldView.callFunc(WORLD_FUNC.REMOVE_CITY_WAY, this.m_aCityWay);
            super.removeFromParent();
        }

        public isShowTime(val: boolean) {
            this.m_pLbTime.visible = val;
        }

    }



    /**
     * 行军时间
     * @class WorldSoilderTime
     * @extends egret.DisplayObjectContainer
     */
    class WorldSoilderTime extends CComponent {
        public m_pPross: eui.Image;
        public m_comState: com_main.ComState;
        public m_pLbNum: eui.Label;
        public m_pLbTime: eui.Label;


        protected m_nEid: string;

        public constructor(eid: string) {
            super();
            this.m_nEid = eid;
            this.touchEnabled = false;
            this.touchChildren = false;
            this.skinName = Utils.getSkinName("app/world/world_army_time.exml");
        }

        public $onRemoveFromStage() {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            const data = WorldModel.getTeamMoveData(this.m_nEid);
            this.m_pLbNum.text = `${RoleData.nickName}`
            let countryId = RoleData.countryId;
            if (isNull(data)) {
                this.m_comState.stateId = countryId;
                return;
            }
            countryId = data.countryId;
            this.m_pLbNum.text = `${isNull(data.playerName) ? RoleData.nickName : data.playerName}`
            this.m_comState.stateId = countryId;
            // this.m_pLbNum.visible = unNull(data.playerName);
            // if ( data.moveType != 0)
            //     this.currentState = "none";
            // else
            // this.m_pLbNum.text = `${event.gid.length}`



        }

        public async tickEvent(dt: string) {
            if (dt == '00:00:00' && this.visible)
                this.visible = false;
            this.m_pLbTime.text = dt;
        }


    }

}
