module com_main {
	/**
	 *
	 * @author 
	 *
	 */
	export class UIAnimUtil extends ActionManager{
		public constructor() {
    		super();
		}
		
        public static DoMoneyValue(handle_text: egret.DisplayObject,start_value: number, to_value:number, duration: number, handle_func:Function):void{
            var attr: any = {
                target: handle_text,
                start_value: start_value,
                to_value: to_value,
                handle_func: handle_func
            };
            var isNew: boolean = this.create(handle_text,NumberRollAction, attr);
            var hashCode: number = handle_text.hashCode;
            var action: NumberRollAction = <NumberRollAction>UIAnimUtil.m_qActions[hashCode];
            
            if(!isNew){
                UIAnimUtil.m_qActions[hashCode].isLife = false;
                UIAnimUtil.moneyRoll(0,handle_text);
            }
            action.roll(to_value - start_value,duration,UIAnimUtil.moneyRoll,handle_text);
        }
        
        private static moneyRoll(money:number, target:egret.DisplayObject):void{
            var hashCode: number = target.hashCode;
            var action: NumberRollAction = <NumberRollAction>UIAnimUtil.m_qActions[hashCode];
            var attr: any = UIAnimUtil.m_qAttrs[hashCode];
           
            if(action.isLife){
                target['text'] = attr.handle_func ? attr.handle_func(attr.start_value + money) : attr.start_value + money;
            }else{
                target['text'] = attr.handle_func ? attr.handle_func(attr.to_value) : attr.to_value;
            }
        }
        
        public static removeAction(handle: egret.DisplayObject):void{
            var hashCode: number = handle.hashCode;
            this.moneyRoll(0,UIAnimUtil.m_qAttrs[hashCode].target);
            ActionManager.removeAction(handle);
        }
	}
}
