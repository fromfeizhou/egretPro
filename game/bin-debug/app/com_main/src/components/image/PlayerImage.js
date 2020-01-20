var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// TypeScript file
var com_main;
(function (com_main) {
    var PlayerImage = /** @class */ (function (_super_1) {
        __extends(PlayerImage, _super_1);
        function PlayerImage() {
            var _this = _super_1.call(this) || this;
            _this.runImage = null;
            return _this;
        }
        PlayerImage.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this._image = new eui.Image;
            this._image.width = this.width;
            this._image.height = this.height;
            this.addChild(this._image);
            this._runImage = new eui.Image;
            this._runImage.width = 48;
            this._runImage.height = 48;
            this._runImage.anchorOffsetX = 0.5 * 48;
            this._runImage.anchorOffsetY = 0.5 * 48;
            this._runImage.x = 0.5 * this.width;
            this._runImage.y = 0.5 * this.height;
            this._runImage.source = "tongyong_loading_02_png";
            this.addChild(this._runImage);
            // this.runEffect =egret.Tween.get(this._runImage, { loop: true }).to({ rotation: 360 }, 1000);
            // var w =egret.setTimeout(function () {
            //         this._runImage.visible = false;  
            //     }, this, 1000);
            this._runImage.visible = false;
        };
        Object.defineProperty(PlayerImage.prototype, "source", {
            get: function () {
                return this._imgSource;
            },
            set: function (value) {
                this._imgSource = value;
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        PlayerImage.prototype.commitProperties = function () {
            _super_1.prototype.commitProperties.call(this);
            if (this.source) {
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
                var circle = new egret.Shape();
                var w = this.width;
                var h = this.height;
                /*** 本示例关键代码段开始 ***/
                circle.graphics.beginFill(0x0000ff);
                circle.graphics.lineStyle(2, 0x0000ff);
                circle.graphics.drawRect(w / 2, h / 2, w, h);
                circle.graphics.endFill();
                this._mask = circle;
                this.addChild(circle);
                this._image.mask = this._mask;
                com_main.ImageQLoader.source(this._image, this.source);
                this._runImage.visible = false;
                /*** 本示例关键代码段结束 ***/
            }
            else {
                this._image.source = "role_b_1_1_png";
            }
        };
        return PlayerImage;
    }(eui.Component));
    com_main.PlayerImage = PlayerImage;
})(com_main || (com_main = {}));
