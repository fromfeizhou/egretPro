module com_main {

    export class CoverLayer extends egret.DisplayObjectContainer {

        public static readonly NAME: string = "CoverLayer";

        private m_pContainer: egret.DisplayObjectContainer;
        private m_sRangeRecord: string;  //字符串记录
        private m_tPoints: number[];     //亮起城池记录
        // private m_nColor:number[] = [0x005BD8, 0x00D848, 0xFF1111]

        public constructor(w: number, h: number) {
            super();
            this.name = CoverLayer.NAME;
            this.touchEnabled = false;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        }

        public onAddedToStage() {

            // for (let j = 0; j < 2; j++) {
            //     for (let i = 0; i < 3; i++) {
            //         let sky: egret.Bitmap = new egret.Bitmap(RES.getRes('border_005_jpg'));
            //         this.addChild(sky);
            //         sky.alpha = .5;
            //         sky.width = 2000;
            //         sky.height = 2000;
            //         sky.x = i * 2000
            //         sky.y = j * 2000
            //         egret.Tween.get(sky).to({alpha: 0}, 1200).call((child)=>{
            //             Utils.removeFromParent(child);
            //         }, this, [sky])
            //     }
            // }

        }

        public async initRange() {
            if (SceneManager.getCurrScene() != SceneEnums.WORLD_CITY) return;
            let allpoint = WorldModel.getCountryRange();
            if (allpoint.toString() == this.m_sRangeRecord) return;
            this.m_tPoints = allpoint;
            this.m_sRangeRecord = allpoint.toString();


            RES.getResAsync('border_005_jpg', (texture, v) => {
                if (!this.m_pContainer) {
                    this.m_pContainer = new egret.Sprite();
                    this.m_pContainer.touchChildren = false;
                    this.m_pContainer.touchEnabled = false;
                    for (let j = 0; j < 4; j++) {
                        for (let i = 0; i < 6; i++) {
                            let sky: egret.Bitmap = new egret.Bitmap(texture);
                            this.m_pContainer.addChild(sky);
                            sky.alpha = .5;
                            sky.width = 100;
                            sky.height = 100;
                            sky.x = i * 100
                            sky.y = j * 100
                        }
                    }
                }

                Utils.TimerManager.doTimer(100, 1, this._init_range, this)
            }, this)
        }

        public _init_range() {
            RES.getResAsync('m_cloud_png', (texture, v) => {
                if (!this.m_pContainer) return;
                let allpoint = this.m_tPoints;
                for (let gid of allpoint) {
                    const [x, y] = WorldTmxData.getPointByGid(gid)
                    let spr: egret.Bitmap = new egret.Bitmap(texture);
                    spr.width = 8.5;
                    spr.height = 8.5;
                    spr.x = x * 0.1 - 4.25;
                    spr.y = y * 0.1 - 4.25;
                    spr.alpha = .9;
                    spr.blendMode = egret.BlendMode.ERASE;
                    this.m_pContainer.addChild(spr);
                }
                // this.cacheAsBitmap = true;
                // for (let i = 1; i < 4; i++) {


                // let color = this.m_nColor[i - 1]
                // for (let edge of allpoint) {

                //     if (i == RoleData.countryId) {
                //         let mask = this.createMask(edge)
                //         this.m_pContainer.addChild(mask)
                //         mask.blendMode = egret.BlendMode.ERASE;

                //         let fit = new egret.GlowFilter(0xFFFFFF, 0.2, 30, 30, 50, egret.BitmapFilterQuality.LOW, false, false)
                //         mask.filters = [fit];
                //     }
                //     // if (i == RoleData.countryId) {
                //     // this.setEdge(edge, color)
                //     // }
                // }

                // }.

                // this.m_pContainer.cacheAsBitmap = true;
                let chidrens = [...this.$children];
                let l = chidrens.length;
                if (l > 0) {
                    this.removeChildren();
                }

                // let o = 1000;
                // for (let j = 0; j < 4; j++) {
                //     for (let i = 0; i < 6; i++) {
                //         let renderTexture: egret.RenderTexture = new egret.RenderTexture();
                //         renderTexture.drawToTexture(this.m_pContainer, new egret.Rectangle(i * o, j * o, o, o));

                //         let bitmap: egret.Bitmap = new egret.Bitmap();
                //         bitmap.texture = renderTexture;
                //         bitmap.x = i * o
                //         bitmap.y = j * o

                //         this.addChild(bitmap);
                //         if (l == 0) {
                //             bitmap.alpha = 0;
                //             egret.Tween.get(bitmap).to({ alpha: 1 }, 700)
                //         }

                //     }
                // }
                let renderTexture: egret.RenderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(this.m_pContainer);
                let bitmap: egret.Bitmap = new egret.Bitmap();
                bitmap.texture = renderTexture;
                NodeUtils.setScale(bitmap, 10);
                this.addChild(bitmap);

                this.m_pContainer = null;
            }, this)


            // this.cacheAsBitmap = true;
            return true;
        }


        public createMask(edge: number[][]) {
            let mask = new egret.Shape();
            mask.graphics.clear();
            mask.graphics.beginFill(0x000000);
            for (let [x, y] of edge) {
                mask.graphics.lineTo(x, y);
            }
            mask.graphics.endFill();
            mask.cacheAsBitmap = true;
            return mask
        }


        public setEdge(edge: number[][], color: number) {
            let cirleLight = this.createMask(edge)
            this.m_pContainer.addChild(cirleLight);

            let fit = new egret.GlowFilter(color, 0.2, 50, 50, 7, egret.BitmapFilterQuality.LOW, true, true)
            cirleLight.filters = [fit];

            cirleLight = this.createMask(edge)
            this.m_pContainer.addChild(cirleLight);

            fit = new egret.GlowFilter(color, .8, 25, 25, 5, egret.BitmapFilterQuality.LOW, false, true)
            cirleLight.filters = [fit];
        }


        public onDestroy(): void {
            for (let o of this.$children) {
                egret.Tween.removeTweens(o);
            }
            Utils.TimerManager.removeAll(this);
        }


		/**
		 * 点击事件
		 * @param  {egret.TouchEvent} e
		 * @returns boolean
		 */
        public onTouch(e: egret.TouchEvent, b: boolean): boolean {


            return true;
        }

    }
}