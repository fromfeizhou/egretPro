module com_main {
	/**
	 *
	 * @author 
	 *
	 */
	export class ActionManager {
        protected static m_qActions: Animate[] = [];
        protected static m_qAttrs: any[] = [];
        
		public constructor() {
		}
		
        protected static create(handle_text: egret.DisplayObject,classFactory: any, attr:any):boolean{
            var hashCode: number = handle_text.hashCode;
            var ret:boolean = true;
            if(!this.m_qActions[hashCode]) {
                this.m_qActions[hashCode] = new classFactory();
            } else if(this.m_qActions[hashCode] && this.m_qActions[hashCode].isLife) {
                this.m_qActions[hashCode].isLife = false;
                ret = false;
            }
            this.m_qAttrs[hashCode] = attr;
            return ret;
        }
        
        public static removeAction(handle: egret.DisplayObject): void {
            var hashCode: number = handle.hashCode;
            if(this.m_qActions[hashCode]) {
                this.m_qActions[hashCode].onDestroy();
                this.m_qActions[hashCode] = null;
                this.m_qAttrs[hashCode] = null;
                delete this.m_qActions[hashCode];
                delete this.m_qAttrs[hashCode];
            }
        }

        public static removeActions(): void {
            var actions: any = this.m_qActions;
            for(var hasCode in actions) {
                this.removeAction(actions[hasCode]);
            }
            
            this.m_qActions = [];
            this.m_qAttrs = [];
        }
	}
}
