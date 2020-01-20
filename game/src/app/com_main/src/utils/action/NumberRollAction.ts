module com_main {
	/**
	 *
	 * @author 
	 *
	 */
    export class NumberRollAction extends Animate  {
        private m_pTarget: any;
        private m_pRollValue:number;
        private m_pSpeed:number;
        private m_pFunFlag: Function;
        private m_pAllTime:number;
        private m_pFrameTime:number;
        
		public constructor() {
            super();
            this.isLife = false;
		}

        public onDestroy(): void {
            this.m_pTarget = null;
            this.m_pFunFlag = null;
            
            super.onDestroy();
        }
		
        public roll(value: number,duration: number,listener: Function,thisObject: any):void{
            this.m_pFrameTime = 0;
            this.m_pTarget = thisObject;
            this.m_pRollValue = value;
            this.m_pSpeed = value / duration;
            this.m_pFunFlag = listener;
            this.isLife = true;
            this.m_pAllTime = duration;
        }

		
        public onEnterFrame(delta: number): void {
            this.m_pFrameTime += delta;
            var curVal: any = Utils.number2int(this.m_pSpeed * this.m_pFrameTime);
            if(this.m_pFrameTime >= this.m_pAllTime){
                curVal = this.m_pRollValue;
                this.isLife = false;
            }
            this.m_pFunFlag.call(this.m_pTarget,curVal,this.m_pTarget);
        }
	}
}
