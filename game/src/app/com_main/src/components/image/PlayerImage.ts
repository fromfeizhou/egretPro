// TypeScript file
module com_main {
    export class PlayerImage extends eui.Component{
        private _mask:egret.Shape;
        private _imgSource:string;
        private _image:eui.Image;
        private _runImage:eui.Image;
        private runImage=null;
        private runEffect:egret.Tween;
        
        public constructor() {
            super();
        }
        protected childrenCreated():void{
            super.childrenCreated();
            this._image = new eui.Image;
            this._image.width = this.width;
            this._image.height = this.height;
            this.addChild( this._image );

            this._runImage = new eui.Image;
            this._runImage.width = 48;
            this._runImage.height = 48;
            this._runImage.anchorOffsetX = 0.5*48;
            this._runImage.anchorOffsetY = 0.5*48;
            this._runImage.x = 0.5*this.width;
            this._runImage.y = 0.5*this.height;
            this._runImage.source = "tongyong_loading_02_png";
            this.addChild( this._runImage ); 
            // this.runEffect =egret.Tween.get(this._runImage, { loop: true }).to({ rotation: 360 }, 1000);
            // var w =egret.setTimeout(function () {
            //         this._runImage.visible = false;  
            //     }, this, 1000);
            this._runImage.visible = false; 
        }
        public set source( value:string ){
            this._imgSource = value;
            this.invalidateProperties();
        }
        public get source(){
            return this._imgSource;
        }

        protected commitProperties():void {
            super.commitProperties();
            if( this.source ){
                // let  circle:egret.Shape = new egret.Shape();
                // circle.graphics.beginFill( 0x0000ff );
                // let radius = this.width > this.height? this.height/2:this.width/2;
                // circle.graphics.drawCircle( this.width/2,this.height/2,radius);
                // circle.graphics.endFill();
                // this._mask = circle;
                // this.addChild( circle );
                // this._image.mask = this._mask;
                
                //  ImageQLoader.source(this._image,this.source); 
                // this._runImage.visible = false;  

        var circle:egret.Shape = new egret.Shape();
        var w:number = this.width;
        var h:number = this.height;
        /*** 本示例关键代码段开始 ***/
        circle.graphics.beginFill(0x0000ff);
        circle.graphics.lineStyle(2, 0x0000ff);
        circle.graphics.drawRect( w / 2, h / 2, w, h);
        circle.graphics.endFill();
        this._mask = circle;
        this.addChild( circle );
        this._image.mask = this._mask;
        
        ImageQLoader.source(this._image,this.source); 
        this._runImage.visible = false;
        /*** 本示例关键代码段结束 ***/

            }else{
                this._image.source = "role_b_1_1_png";
            }
        }

    }
}