/**
 * Created by yaowan on 2017/1/4.
 */
module com_main {
    export class CLabel extends eui.Label {

        private _text:string="";
        private _label:string="";
        private _color;

        public constructor() {
            super();
            //this.fontFamily = FontConst.defaultFontFamil;
            this.size = 22;
        }

        public set skinText(vis:boolean){
            if(vis){
                this.text = "";
            }
        }

        public set alan(lan:string){
            this._text = GLan(lan);
            this.invalidateProperties();
        }
       
        public set label(str:string){
            this._label = str;
            if(this._text != str){
                this._text = str;
            }
            this.invalidateProperties();
        }
        
        public set fontColor( color:string ){
            this._color =  egret.getDefinitionByName( "FontColorConst." + color );
            this.invalidateProperties();
        }

        public get label(){
            return this._label;
        }
      
        protected childrenCreated(): void {
            super.childrenCreated();

        }

        protected commitProperties():void {
            super.commitProperties();
            if( this._text ){
                this.text =  this._text;
            }
            if( this._color ){
                this.textColor =  this._color;
            }
        }
    }
}