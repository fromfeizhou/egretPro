module com_main {
	/**
	 *
	 * @author 
	 *
	 */
	export class UIMsg extends CComponent {
    	private static tweenDist:number = 40;
        private static tweenDuration:number = 1200;
        
        public isActive:boolean = true;
        public lblMessage:eui.Label;
        private m_pAction:egret.Tween;
        private m_pYMultiple:number;
        
		public constructor() {
    		super();
            this.skinName = this.getSkinStr();
		}
		
		public setData(msg, color):void{
		    this.lblMessage.textColor = color;
            Utils.setRichLabel(this.lblMessage, msg);
		}
		
		public startTween(yPos:number):void{
		    this.x = AGame.R.app.stageWidth / 2;
            this.y = yPos + this.height / 2;
		    this.alpha = 0;
		    this.verticalCenter = 0;
		    this.horizontalCenter = 0;
		    this.anchorOffsetX = this.width / 2;
		    this.anchorOffsetY = this.height / 2;
            
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ alpha: 1 },300,egret.Ease.backInOut)
                .wait(100)
                .to({ y: this.y - UIMsg.tweenDist },UIMsg.tweenDuration)
                .wait(100)
                .to({ scaleY: 0.5,alpha: 0 },400,egret.Ease.backOut).call(this.tweenComplete,this);
    
		}
		
        private tweenComplete():void{
            if(this.parent)this.parent.removeChild(this);
            this.isActive = false;
            this.m_pAction = null;
            
            MessageTip.clearQueue();
        }
		
		public resetTween(y:number, prop:number = 1):void{
    		egret.Tween.removeTweens(this);
            this.m_pAction = egret.Tween.get(this);
    		
            this.y = y;
            this.alpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            
            var dist:number = UIMsg.tweenDist * prop;
            var duration: number = UIMsg.tweenDuration * prop;

            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ y: this.y - dist },duration)
                .wait(100)
                .to({ scaleY: 0.4,alpha: 0 },400).call(this.tweenComplete,this);
    		
		}
		
        public stopTween():void{
            egret.Tween.removeTweens(this);
        }
		
        private getSkinStr(): string { 
            return `<?xml version='1.0' encoding='utf-8'?>
<e:Skin class="messageTipSkin" width="688" height="62" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
	<e:Image source="FCommon_BoardcastBg_png" verticalCenter="0" horizontalCenter="0" width="100%"/>
	<e:Label id="lblMessage" text="标签" horizontalCenter="0" verticalCenter="0" size="32"  stroke="1" strokeColor="0x000000"/>
</e:Skin>`;
        }
        
	}
	
	export class MessageTip{
        private static INFO_COLOR: string = '0xEBFFFF';
        private static ERR_COLOR: string = '0xFF9B9B';
        private static MAX_COUNT: number = 4;
        private static MSG_START_Y:number = 320;
        private static m_pQueue:UIMsg[] = [];
        
        
        public static clearQueue():void{
            var label: UIMsg;
            var list: UIMsg[] = MessageTip.m_pQueue;
            for(var i: number = list.length - 1;i >= 0;i--) {
                label = list[i];
                if(!label.isActive) list.splice(i,1);
            }
        }
        
        private static needsLayout():void{
            this.clearQueue();
            
            var label: UIMsg;
            var list: UIMsg[] = MessageTip.m_pQueue;
            if(list.length > MessageTip.MAX_COUNT){
                for(var i: number = 0;i < list.length - MessageTip.MAX_COUNT; i++){
                    label = list[i];
                    label.stopTween();
                    label.parent.removeChild(label);
                    list.splice(0,1);
                }
            }
            if(list.length > 0){
                var yPos: number;
                for(var i: number = 0;i < list.length - 1;i++) {
                    var prop:number = (i + 1) / list.length;
                    label = list[i];
                    yPos = MessageTip.MSG_START_Y - (list.length - 1 - i) * label.height + label.height - 10;
                    label.resetTween(yPos,prop);
                }
            }
        }
        
        private static message(message:string, error?:boolean):void{
            var label:UIMsg = new UIMsg();
            label.touchEnabled = false;
            var color = error ? MessageTip.ERR_COLOR : MessageTip.INFO_COLOR;
            label.setData(message, color);
            MessageTip.m_pQueue.push(label);
            AGame.R.app.topLevel.addChild(label);
            MessageTip.needsLayout();
            label.startTween(MessageTip.MSG_START_Y);
        }
        
        public static AddMessageInfo(message: string): void {
            MessageTip.message(message, false);
        }
        
        public static AddMessageError(message:string):void{
            MessageTip.message(message,true);
        }
        
        public static AddMessageError2Tag(key: any): void {
            var message = GLan(key);
            MessageTip.AddMessageError(message);
        }
        
        public static AddMessageInfo2Tag(key: any): void {
            var message = GLan(key);
            MessageTip.AddMessageInfo(message);
        }
	}
}
