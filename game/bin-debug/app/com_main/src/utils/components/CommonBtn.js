// // enum BtnState { Blue,BlueSmall,Green,GreenSmall,RedSmall,Yellow,YellowSmall };
// module com_main{
//  export class CommonBtn extends CComponent{
// 	    public static ST_SRED = 1;
//         public static ST_BLUE = 2;
// 		public comBtn_Bg:eui.Image;
//         public comBtn_text:eui.Label;
//         public sdata:Object;
//         private Old_text_style:any;
//         public gray_tip:string;
//         private effectArray:Array<any> = [];
//         private m_bIsGary:boolean = false;  //灰色
//         public isClear:boolean = true;
//         // private eff_ButtonBlock:EImageSprite;
//         // private eff_LightSweep:EImageSprite;
//         public constructor() {
//             super();
//         }
//         private m_iLanIndex:number = 0;
//         public set alan(lan:number){
//             this.m_iLanIndex = lan;
//         }
//         protected createChildren(): void {
//             super.createChildren();
//             this.commitProperties();
//             EventManager.addScaleListener(this, TOUCH_SCALE_XY, this);
//             this.Old_text_style = {};
//             this.updateStyleValue();
//             // if (this.m_iLanIndex > 0){
//             //     this.ylb_text.text = dfh3.Language.getLanguageNum(this.m_iLanIndex);
//             // }
//         }
//         private updateStyleValue():void
//         {
//             if (!this.m_bIsGary && this.comBtn_text){
//                 this.Old_text_style.textColor = this.comBtn_text.textColor;
//                 this.Old_text_style.strokeColor = this.comBtn_text.strokeColor;
//                 this.Old_text_style.stroke = this.comBtn_text.stroke;
//                 this.Old_text_style.source = this.comBtn_Bg.source;
//             }
//         }
//         $onRemoveFromStage(): void {
//             // debug("ComButton $onRemoveFromStage");
//             EventManager.removeEventListener(this);
//             if(this.effectArray.length > 0){
//                 // ImageEffect.removeActionList(this.effectArray);
//                 this.effectArray = [];
//             }
//             this.Old_text_style = null;
//             this.sdata = null;
//             egret.Tween.removeTweens(this);
//             super.$onRemoveFromStage(this.isClear);
//         }
//         // public static getButton(width: number,text: string = "",state: BtnState = BtnState.Blue):CommonBtn{
//         //     var btn:CommonBtn = new CommonBtn();
//         //     btn.initView(state,width); 
//         //     btn.setText(text);
//         //     return btn;
//         // }
//         public set text(str:string){
//             if(this.comBtn_text)
//             this.comBtn_text.text = str;
//         }
//         public get text(): string{
//             if(this.comBtn_text)
//                 return this.comBtn_text.text;
//         }
//         public setText(str: string) {
//             this.comBtn_text.text = str;
//         }
//         public setFontSize(size:number){
//            this.comBtn_text.size = size;
//         }
//         public setColor(color:number):void{
//            this.comBtn_text.textColor = color;
//         }
//     //     public initView(state:BtnState,width: number) {
//     //         this.width = width;
//     //         var exml = this.getSkinContent(state);
//     //         this.skinName = exml;
//     //         this.verticalCenter = 0;
//     //         this.horizontalCenter = 0;
//     //     }
//     //     private getSkinContent(state:BtnState): string {      
//     //         var strState = state;
//     //         var exml = `<?xml version='1.0' encoding='utf-8'?>
//     // <e:Skin class="CommonBtn" width="210" height="87" currentState="${strState}" xmlns:com_main="com_main.*" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" states="Blue,BlueBig,BlueMid,BlueSmall,Green,GreenMid,GreenSmall,Yellow,YellowMid"  height.BlueBig="114" height.BlueMid="73" height.BlueSmall="63" height.GreenMid="73" height.GreenSmall="73" height.YellowMid="73">
// 	// <com_main:CImage id="comBtn_Bg" scale9Grid="23,23,8,32" width="100%" height="100%" scale9Grid.BlueBig="24,40,8,22" scale9Grid.BlueMid="23,22,8,20" scale9Grid.BlueSmall="23,23,8,11" scale9Grid.GreenMid="24,24,6,15" scale9Grid.GreenSmall="25,23,6,10" scale9Grid.Green="23,23,8,32" scale9Grid.YellowMid="25,24,4,18" verticalCenter="0" horizontalCenter="0"  source="FCommon_ButtonBlue_png" source.BlueBig="FCommon_ButtonBlue_png" source.BlueMid="FCommon_ButtonBlue_png" source.BlueSmall="FCommon_ButtonBlue_png" source.Green="FCommon_ButtonSGreen_png" source.GreenMid="FCommon_ButtonSGreen_png" source.GreenSmall="FCommon_ButtonSGreen_png" source.Yellow="FCommon_ButtonYellow_png" source.YellowMid="FCommon_ButtonYellow_png"/>
// 	// <e:Label id="comBtn_text" width="90%" textAlign="center" bold="true" size.Yellow="38" size.Green="38" horizontalCenter="0.5" verticalCenter="-3.5" text="确定" textColor="0xD6F7FD" height="60%" verticalAlign="middle" size.BlueBig="42" size.BlueSmall="32" size.GreenSmall="32" size.BlueMid="36" size.GreenMid="36" size.YellowMid="36" size.Blue="38" size="38"/>
//     // </e:Skin> `;     
//     //         return exml;
//     //     }
//         public set disabled(isGray:boolean){
//             this.enabled = !isGray;
//             this.gray = isGray;
//         }
//         public set gray(isGray:boolean){
//             if(this.m_bIsGary == isGray) return;
//             var btnBg =this.Old_text_style.source;
//             this.m_bIsGary = isGray;
//             if(isGray){                
//                 btnBg = "Gray_FCommon_Button_png";
//                 this.comBtn_text.strokeColor = 0x505050;
//             }else{
//                 this.comBtn_text.strokeColor = this.Old_text_style.strokeColor;
//                 this.comBtn_text.stroke = this.Old_text_style.stroke;
//                 this.comBtn_text.textColor = this.Old_text_style.textColor;
//             }
//             this.comBtn_Bg.source = btnBg;            
//             this.commitProperties();
//             this.validateNow();
//         }
//         public get gray(){
//             return this.m_bIsGary;
//         }
//         public get disabled(){
//             return !this.enabled;
//         }
//         public setImages(image:string){
//             this.comBtn_Bg.source = image;
//         }
//         // public playFlash(wait = 0) {
//         //     var action = TweenAction.create(this, wait);
//         //     action.next(3).alphaTo(0.92, 0).scaleTo(0.94, 1)
//         //             .next(2).alphaTo(1).scaleTo(1)
//         //             .play();
//         // }
//         // public playEffect(){
//         //     var eff = this.eff_ButtonBlock;
//         //     if(eff){
//         //         ImageEffect.runAction(eff);
//         //     }else{
//         //         eff = this.eff_ButtonBlock = ImageEffect.loadSpriteAnimation(ImageEffectType.Eff_ButtonBlock,function(){
//         //             ImageEffect.runAction(eff);
//         //         });
//         //     }
//         //     eff.x = -20;
//         //     eff.y = -62;
//         //     this.addChild(eff);
//         //     this.effectArray.push(eff);
//         //     var eff1 = this.eff_LightSweep;
//         //     if(eff1){
//         //         ImageEffect.runAction(eff1);
//         //     }else{
//         //         eff1 = this.eff_LightSweep = ImageEffect.loadSpriteAnimation(ImageEffectType.Eff_LightSweep,function(){
//         //             ImageEffect.runAction(eff1);
//         //         });
//         //     }   
//         //     eff1.scaleX = 0.75;
//         //     eff1.scaleY = 0.75;
//         //     eff1.x = 0;
//         //     eff1.y = -35;
//         //     this.addChild(eff1);
//         //     this.effectArray.push(eff1);
//         // }
//         // public removeEffect(){
//         //     for(var i = 0; i < this.effectArray.length; i++){
//         //         var sprite = this.effectArray[i];
//         //         ImageEffect.stopAction(sprite);
//         //         sprite.visible = false;
//         //     }
//         //     this.effectArray = [];
//         // }
//         public changeCurrentState(state: string): void{
//             if(this.currentState == state) return;
//             this.commitProperties();
//             // todo 检查 state 的正确性
//             this.gray = false;
//             this.currentState = state;
//             this.validateNow();
//             this.updateStyleValue(); 
//         }
// 	}
// }
