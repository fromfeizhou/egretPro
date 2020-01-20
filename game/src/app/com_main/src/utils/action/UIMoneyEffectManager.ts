module com_main {
	/**
	 *
	 * @author 
	 *
	 */
	export class UIMoneyEffectAnim extends Animate {
    	public handle_trans:any;
    	public start_pos:egret.Point;
    	public end_pos:egret.Point;
    	public callback:Function = null;
        
        private m_v_x:number;
        private m_v_y:number;
        private m_a_x:number;
        private m_a_y:number;
        private m_time:number;
        
        private m_total_time:number;
        private m_frameTime: number = 0;
        
        private ROTATION_SPEED:number = 360;
    	
		public constructor() {
    		super();
		}
		
        public Update():void{
            this.GetParam();
            this.isLife = true;
            this.m_total_time = this.m_time * 1.5;
		}
		
        private Range(min:number, max:number):number{
            return min + Math.random() * (max - min);
        }
		
        private GetParam():void{
            this.m_a_x = 1600;
            if(this.end_pos.x < this.start_pos.x) this.m_a_x = - this.m_a_x;
            
            this.m_a_y = 1600;
            if(this.end_pos.y < this.start_pos.y)this.m_a_y = -this.m_a_y;
            
            
            this.m_v_x = 900 * this.Range(3,7) / 10;
            if(Math.random() > 0.5) this.m_v_x = -this.m_v_x;

            this.m_v_y = 900 * this.Range(3,7) / 10;
            if(Math.random() > 0.5) this.m_v_y = -this.m_v_y;
            
            
            var time1: number = 0;
            var time2: number = 0;

            if(Math.abs(this.end_pos.y - this.start_pos.y) > Math.abs(this.end_pos.x - this.start_pos.x)) {
                time1 = (-this.m_v_y + Math.sqrt(Math.pow(this.m_v_y,2) +
                    2 * this.m_a_y * (this.end_pos.y - this.start_pos.y))) / this.m_a_y;
                time2 = (-this.m_v_y - Math.sqrt(Math.pow(this.m_v_y,2) + 
                    2 * this.m_a_y * (this.end_pos.y - this.start_pos.y))) / this.m_a_y;
                if(time1 > 0 && time2 > 0) {
                    this.m_time = time1 < time2 ? time1 : time2;
                } else {
                    this.m_time = time1 > time2 ? time1 : time2;
                }
                this.m_a_x = 2 * (this.end_pos.x - this.start_pos.x - this.m_v_x * this.m_time) / this.m_time / this.m_time;
            } else {
                time1 = (-this.m_v_x + Math.sqrt(Math.pow(this.m_v_x,2) + 
                    2 * this.m_a_x * (this.end_pos.x - this.start_pos.x))) / this.m_a_x;
                time2 = (-this.m_v_x - Math.sqrt(Math.pow(this.m_v_x,2) + 
                    2 * this.m_a_x * (this.end_pos.x - this.start_pos.x))) / this.m_a_x;
                if(time1 > 0 && time2 > 0) {
                    this.m_time = time1 < time2 ? time1 : time2;
                } else {
                    this.m_time = time1 > time2 ? time1 : time2;
                }
                this.m_a_y = 2 * (this.end_pos.y - this.start_pos.y - this.m_v_y * this.m_time) / this.m_time / this.m_time;
            }
        }
        
        public onEnterFrame(delta: number): void {
            if(!this.isLife)return;
            
            this.m_frameTime += delta;
            
            var pass_time: number = this.m_frameTime;
            
            if(pass_time > this.m_total_time) {
                this.isLife = false;
                
                this.handle_trans.x = this.end_pos.x;
                this.handle_trans.y = this.end_pos.y;
                this.handle_trans.skewY = 0;
                
                if(this.callback != null) {
                    this.callback(this.handle_trans);
                    this.callback = null;
                }
                return;
            }
            
            var act_pass_Time: number = pass_time < this.m_time ? pass_time / 2 * pass_time / this.m_time : pass_time - this.m_time / 2;

            var pos_x = this.m_v_x * act_pass_Time + this.m_a_x * act_pass_Time * act_pass_Time / 2;
            var pos_y = this.m_v_y * act_pass_Time + this.m_a_y * act_pass_Time * act_pass_Time / 2;

            this.handle_trans.x = this.start_pos.x + pos_x;
            this.handle_trans.y = this.start_pos.y + pos_y;
            this.handle_trans.skewY = this.ROTATION_SPEED * pass_time;
            
//            debug("onEnterFrame:",pass_time,pos_x,pos_y,this.handle_trans.x,this.handle_trans.y,this.start_pos.x,this.start_pos.y);
//            this.isLife = false;
            
        }
	}
	
    export class UIMoneyEffectManager extends ActionManager{
        public constructor() {
            super();
        }
        public static DoAnim(handle_text: egret.DisplayObject,start_pos: egret.Point,end_pos: egret.Point,handle_func: Function): void {
            var attr: any = {
                target: handle_text,
                handle_func: handle_func
            };
            
           this.create(handle_text,UIMoneyEffectAnim,attr);
           var action: UIMoneyEffectAnim = <UIMoneyEffectAnim>UIAnimUtil.m_qActions[handle_text.hashCode];
           action.handle_trans = handle_text;
           action.start_pos = start_pos;
           action.end_pos = end_pos;
           action.callback = UIMoneyEffectManager.Update;
           
           action.Update();
        }

        private static Update(target: egret.DisplayObject): void {
            var hashCode: number = target.hashCode;
            var action: UIMoneyEffectAnim = <UIMoneyEffectAnim>UIMoneyEffectManager.m_qActions[hashCode];
            var attr: any = UIMoneyEffectManager.m_qAttrs[hashCode];

            if(!action.isLife && attr.handle_func) {
                attr.handle_func(attr.target);
            }
            
            if(!action.isLife){
                UIMoneyEffectManager.removeAction(target);
            }
        }
    }
}
