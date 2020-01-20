module com_main {
    /**有生命的基类 */
    export class Animal extends egret.DisplayObjectContainer implements IFObject {
        /**自增ID */
        protected id: number;
        /**自身宽 */
        protected m_pWidth: number;
        /**自身高 */
        protected m_pHeight: number;
        /**当前位置 */
        protected m_pPosition: egret.Point;

        /**信息显示容器*/
        // protected m_pContainerTitle: egret.DisplayObjectContainer;
        // /**血条 */
        // protected m_pBarBlood: BarBlood;
        /**标题 */
        protected m_pLblTitle: eui.Label;
        /**菱形底座 */
        protected m_pShapDiamond: egret.Shape;
        /**单例矩形 */
        protected m_pShapRect: egret.Shape;

        public constructor() {
            super();
        }

        public init() {
            this.touchEnabled = false;
            this.touchChildren = false;
            this.width = this.m_pWidth;
            this.height = this.m_pHeight;
            AnchorUtil.setAnchor(this, 0.5);
            this.initContainer();

            /**因为addChild时候不派发事件，所以要在外部调用 */
            // this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        public onDestroy() {
            this.id = 0;
            this.m_pWidth = 32;
            this.m_pHeight = 32;

            Utils.removeAllChild(this);
            Utils.removeFromParent(this);
            egret.Tween.removeTweens(this);
            // if (this.m_pBarBlood) {
            //     this.m_pBarBlood.reSet();
            //     this.m_pBarBlood.onDestroy();
            // }
            // this.m_pBarBlood = null;
            // this.m_pContainerTitle = null;
            this.m_pLblTitle = null;
            this.m_pShapDiamond = null;
            this.m_pShapRect = null;

            // ObjectPool.push(this);
        }

        /**因为addChild时候不派发事件，所以要在外部调用 */
        protected onAddToStage() {
            // debug("Animal:onAddToStage--->>", this.id);
        }

        /**
         * 绘制底座菱形
         */
        public drawDiamond(color?, linecolor?, width?: number, height?: number) {
            if (!this.m_pShapDiamond) {
                this.m_pShapDiamond = new egret.Shape();
            }
            this.m_pShapDiamond.width = width || this.width;
            this.m_pShapDiamond.height = height || this.height;
            AnchorUtil.setAnchor(this.m_pShapDiamond, 0.5);
            this.m_pShapDiamond.x = this.width / 2;
            this.m_pShapDiamond.y = this.height / 2;
            Utils.DisplayUtils.drawDiamond(this.m_pShapDiamond, color, 0x00ff00);
            Utils.addChild(this, this.m_pShapDiamond)
        }

        public drawRect(color?, width?: number, height?: number) {
            if (!this.m_pShapRect) {
                this.m_pShapRect = new egret.Shape();
            }
            this.m_pShapRect.width = width || this.width;
            this.m_pShapRect.height = height || this.height;
            AnchorUtil.setAnchor(this.m_pShapRect, 0.5);
            this.m_pShapRect.x = this.width / 2;
            this.m_pShapRect.y = this.height / 2;
            Utils.DisplayUtils.drawRect(this.m_pShapRect, color);
            Utils.addChild(this, this.m_pShapRect)
        }

        public loseHp(): void {
            let txt: egret.Bitmap = ObjectPool.pop(egret.Bitmap,"egret.Bitmap");
            txt.alpha = 1;
            txt.x = this.width / 2;
            txt.y = this.height / 2;
            AnchorUtil.setAnchor(txt, 0.5);

            let isBao: boolean = Math.random() >= 0.5;
            txt.texture = isBao ? RES.getRes("baoji_png") : RES.getRes("-10_png");

            egret.Tween.get(txt)
                .to({ y: this.height - 300 }, 1000, egret.Ease.backOut)
                .to({
                    alpha: 0,
                    y: this.height - 400
                }, 300)
                .call(function (): void {
                    Utils.DisplayUtils.removeFromParent(txt);
                    ObjectPool.push(txt);
                }, this);

            this.addChild(txt);
        }

       /**初始化各个显示层 */
        protected initContainer() {
            // if (!this.m_pContainerTitle) {
            //     this.m_pContainerTitle = new egret.DisplayObjectContainer();
            //     this.m_pContainerTitle.width = this.width;
            //     this.m_pContainerTitle.height = this.height;
            //     Utils.addChild(this, this.m_pContainerTitle);
            // }
        }

        /**血条 */
        public addBarBlood() {
            // if (!this.m_pBarBlood) {
            //     this.m_pBarBlood = new BarBlood(64);
            //     this.m_pContainerTitle.addChild(this.m_pBarBlood);
            //     AnchorUtil.setAnchorX(this.m_pBarBlood, 0.5);
            //     AnchorUtil.setAnchorY(this.m_pBarBlood, 1);
            //     this.m_pBarBlood.x = this.m_pContainerTitle.width * 0.5
            //     this.m_pBarBlood.y = -10;
            // }
        }

        public addTitle() {
            // if (!this.m_pLblTitle) {
            //     this.m_pLblTitle = new eui.Label();
            //     this.m_pLblTitle.textAlign = egret.HorizontalAlign.CENTER;
            //     this.m_pLblTitle.verticalAlign = egret.VerticalAlign.MIDDLE;
            //     this.m_pContainerTitle.addChild(this.m_pLblTitle);
            // }
            // AnchorUtil.setAnchorX(this.m_pLblTitle, 0.5);
            // AnchorUtil.setAnchorY(this.m_pLblTitle, 1);
            // this.m_pLblTitle.x = this.m_pContainerTitle.width / 2;
            // this.m_pLblTitle.y = 0;

            // let isopen = LocalData.getData('open_map_grid', "0");
            // if (DEBUG && parseInt(isopen)) {
            //     this.m_pLblTitle.text = this.id.toString();
            // }
        }

        /**获取当前坐标 */
        public get position() {
            if (!this.m_pPosition) {
                this.m_pPosition = egret.Point.create(this.x, this.y);
            } else {
                this.m_pPosition.x = this.x;
                this.m_pPosition.y = this.y;
            }
            return this.m_pPosition;
        }

        public setXY(x: number, y: number) {
            if (x && this.x != x) this.x = x;
            if (y && this.y != y) this.y = y;
        }

        public $setX(value: number): boolean {
            this.position.x = value;
            return super.$setX(value);
        }

        public $setY(value: number): boolean {
            this.position.y = value;
            return super.$setY(value);
        }

        public onEnterFrame(advancedTime: number): void {
        }
    }
}