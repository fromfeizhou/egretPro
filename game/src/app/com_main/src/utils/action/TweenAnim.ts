module com_main {
	/**
	 *
	 * @author 
	 *
	 */
    export class TweenAnim extends egret.Tween {
        private static TWEENANIM_FRAME_TIME:number = 16;
        private updateTime: number = 0;
        
        public static get(target: any,props: any = null,pluginData: any = null,override: boolean = false): TweenAnim {
            if(override) {
                TweenAnim.removeTweens(target);
            }
            return new TweenAnim(target,props,pluginData);
        }

        public constructor(target: any,props: any,pluginData: any) {
            super(target,props,pluginData);
        }
        
        public tick(delta: number): void {
            var frameTime: number = TweenAnim.TWEENANIM_FRAME_TIME;
            this.updateTime += delta;
            while(this.updateTime >= frameTime) {
                // super.tick(delta);
                //钟凯宇
                this.updateTime -= frameTime;
            }
        }
    }
}
