/**部队进攻路线 */

module com_main {

    export class AttackWay extends CComponent {

        private line: eui.Image;
        private lineNun: number = 1;


        public constructor(startPoint:Point,endPoint:Point) {
            super();
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);

            let spr = new eui.Image("ImgArrow_1_png");
            this.line = spr;
            spr.name = "line"
            spr.height = egret.Point.distance(endPoint, startPoint);
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            let angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
            spr.rotation = angle + 90;
            
            this.addChild(spr);

            this.x = endPoint.x;
            this.y = endPoint.y;

            let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.TEAM_MOVE_TIME];
            let time = Number(crossServerConst.value) * 1000;
            Tween.get(spr).wait(time).call(()=>{
                Utils.removeFromParent(this);
                this.line = null;
            });
        }

        $onRemoveFromStage(isclear = true): void {
            super.$onRemoveFromStage(false);
            this.onDestroy();
        }

        protected childrenCreated(): void {
			super.childrenCreated();

            Utils.TimerManager.doFrame(5, 0, this.runLine, this);
		}

        public onDestroy() {
            super.onDestroy();

            Tween.removeTweens(this.line);
            Utils.TimerManager.remove(this.runLine, this);
        }

        private runLine(){
            if(this.line){
                this.line.source = `ImgArrow_${this.lineNun}_png`;

                this.lineNun += 1;
                if(this.lineNun > 3){
                    this.lineNun = 1;
                }
            }
        }


    }

}