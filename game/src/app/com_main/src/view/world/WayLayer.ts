module com_main {

    export class WayLayer extends egret.DisplayObjectContainer {

        public static readonly NAME: string = "WayLayer";
        public m_aWay: number[] = [];

        public constructor(w: number, h: number) {
            super();
            this.name = WayLayer.NAME;
            this.width = w;
            this.height = h;
            this.addEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
        }

        public onDestroy(): void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
            Utils.removeAllChild(this);
        }

		/**
		 * 创建行走路线
		 * @param  {ArmySprite} hero
		 * @returns void
		 */
        public createWay(hero: ArmySprite): void {
            let spr = new WaySpite(hero.conf, hero.realTotalDt);
            Utils.addChild(this, spr);
        }
        /**
         * 更新行走路线
         */
        public updateWay(movepoint: egret.Point, teamKey: string) {
            let way = <WaySpite>this.getChildByName(`way_${teamKey}`);
            if (!way) return;
            way._update_way(movepoint)
        }
        public getWay(id: number): WaySpite {
            let way = this.getChildByName(`way_${id}`);
            if (!way) return;
            return <WaySpite>way;
        }

        private tickEvent(): boolean {
            for (let o of this.$children) {
                let obj = <WaySpite>o
                    , status = obj.tickEvent();
            }
            return false;
        }

        public createCityWay(point: number[][], ty: number = 0): number[] {
            let i = 0;
            this.m_aWay = [];

            if (!point || point.length == 0) return this.m_aWay;
            point.reduce((prev, cur, index, arr) => {
                i++;
                if (i % 2 == 0) return cur;	//隔两个点 执行一次 划线
                if (!prev) return cur;
                let way = new CityWay(prev, cur, ty);
                this.addChild(way)
                let [x, y] = prev;
                way.x = x;
                way.y = y;
                this.m_aWay.push(way.iid);
                return cur;
            })
            return this.m_aWay;
        }

        public removeCityWay(iid: number) {
            let way = this.getChildByName(`city_way_${iid}`);
            if (!way) return;
            Utils.removeFromParent(way);
        }
    }

	/**
     * 直线线路
     * @export
     * @class WaySpite
     * @extends CComponent
     */
    export class WaySpite extends CComponent {

        private m_nTeamKey: string;
        /**人物位置偏移x */
        private m_nOffsetX: number = 90;
        /**人物位置偏移y */
        private m_nOffsetY: number = 0;
        /**移动开始坐标 */
        private m_pStartPoint: egret.Point = null;
        /**移动结束坐标 */
        private m_pEndPoint: egret.Point = null;
        /**透明路径线 */
        private m_pWayBg: egret.Bitmap = null;
        /**主路径线 */
        private m_pWayMain: egret.Bitmap = null;
        /**路径偏移 */
        private m_nBoffset: number = 0;
        /**移动时间 */
        private m_nMoveDt: number = 0;
        /**移动速度 */
        private m_nMoveSpeed: number = 3;
        /**移动倍数 */
        private m_nOdd: number = 1;
        private m_nDt: number = 0;

        public get teamKey(): string {
            return this.m_nTeamKey;
        }
        public set teamKey(id: string) {
            this.m_nTeamKey = id;
            this.name = `way_${id}`;
        }

        public constructor(conf: SoldierMoveConf, dt: number, offsetX: number = 0, offsetY = 0) {
            super();
            this.teamKey = conf.teamKey;

            const data = WorldModel.getTeamMoveData(this.m_nTeamKey);
            let startPoint = DjikstraGraph.Instance.GetVertex(data.cityPath[0]).cityPos
            let endPoint = DjikstraGraph.Instance.GetVertex(data.cityPath[data.cityPath.length - 1]).cityPos;
            let endPCopy = endPoint.slice(0, endPoint.length);
            this.m_pStartPoint = new egret.Point(endPCopy[0], endPCopy[1]);
            this.m_pEndPoint = new egret.Point(endPCopy[0], endPCopy[1]);
            this.m_nBoffset = conf.boffset;
            this.m_nMoveSpeed = conf.speed;
            this.m_nOdd = conf.odd;
            this.x = this.m_pStartPoint.x;
            this.y = this.m_pStartPoint.y;
            this.m_nDt = dt;
        }

        public onDestroy(): void {
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_pWayMain = this._create_way();


        }
        /**
         * 帧事件
         * @returns Promise
         */
        public async tickEvent(): Promise<boolean> {
            // if (TimerUtils.getServerTimeMill() - this.m_nMoveDt < this.m_nMoveSpeed) return false;
            // this.m_nMoveDt = this.m_nMoveDt + this.m_nMoveSpeed;
            // this.m_pWayMain.height -= this.m_nOdd;
            // if (this.m_pWayMain.height <= this.m_nOdd) {
            //     WorldView.callFunc(WORLD_FUNC.END_HERO_MOVE, this.m_nTeamKey);
            //     Utils.removeFromParent(this);
            //     return true;
            // }
            return false;
        }

        /**
         * 创建路线
         * @returns egret.Bitmap
         */
        private _create_way(): egret.Bitmap {
            let spr = new egret.Bitmap(RES.getRes("ImgArrow_1_png"));
            spr.name = "line"
            this.addChild(spr)
            spr.height = egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint);
            spr.anchorOffsetX = 0;
            spr.anchorOffsetY = spr.height;
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            spr.visible = false;
            // let angle = Math.atan2(this.m_pEndPoint.y - this.m_pStartPoint.y, this.m_pEndPoint.x - this.m_pStartPoint.x) * 180 / Math.PI;
            // spr.rotation = angle + 90;
            return spr;
        }
        /**更新线路 */
        public _update_way(movepoint: egret.Point): egret.Bitmap {
            let spr: egret.Bitmap = <egret.Bitmap>this.getChildByName("line");
            if (!spr) {
                return;
            }
            spr.visible = true;
            this.x = movepoint.x;
            this.y = movepoint.y;
            spr.height = egret.Point.distance(movepoint, this.m_pEndPoint);
            spr.anchorOffsetX = 0;
            spr.anchorOffsetY = spr.height;
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            let angle = Math.atan2(this.m_pEndPoint.y - movepoint.y, this.m_pEndPoint.x - movepoint.x) * 180 / Math.PI;
            spr.rotation = angle + 90;
            return spr;
        }
    }


    /**
     * 城池间线路
     * @export
     * @class CityWay
     * @extends egret.Sprite
     */
    export class CityWay extends egret.Sprite {

        private m_pStartPoint: egret.Point;
        private m_pEndPoint: egret.Point;
        private m_imgLine: eui.Image;
        public get iid(): number {
            return this.hashCode;
        }

        public constructor(start: number[], end: number[], type: number = 0) {
            super();
            this.name = `city_way_${this.hashCode}`

            // const color = type == 0 ? 0xe7d7a7 : 0xff2727;
            this.m_pStartPoint = egret.Point.create(start[0], start[1]);
            this.m_pEndPoint = egret.Point.create(end[0], end[1]);
            this.m_imgLine = new eui.Image('pro_020_png');
            this.m_imgLine.width = Point.distance(this.m_pStartPoint, this.m_pEndPoint);
            AnchorUtil.setAnchorCenter(this.m_imgLine);
            this.addChild(this.m_imgLine);
            // this.graphics.beginFill(color, 1);
            // this.graphics.drawRect(0, 0, 7, egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint));
            // this.graphics.endFill();

            let angle = Math.atan2(this.m_pEndPoint.y - this.m_pStartPoint.y, this.m_pEndPoint.x - this.m_pStartPoint.x) * 180 / Math.PI;
            this.rotation = angle;

            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }

        public tickEvent() {

        }
    }
}