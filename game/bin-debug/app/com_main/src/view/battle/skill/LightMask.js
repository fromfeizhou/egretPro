// TypeScript file
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
var com_main;
(function (com_main) {
    var LightMask = /** @class */ (function (_super_1) {
        __extends(LightMask, _super_1);
        function LightMask() {
            var _this = _super_1.call(this) || this;
            _this.width = egret.MainContext.instance.stage.stageWidth;
            _this.height = egret.MainContext.instance.stage.stageHeight;
            _this.blendMode = egret.BlendMode.ERASE;
            // this.graphics.beginFill(0x000000,0.7);
            // this.graphics.drawRect(0, 0, this.width, this.height);
            // this.graphics.endFill();
            _this.lightMatrix = new egret.Matrix();
            _this.cirleLight = new egret.Shape();
            _this.cirleLight.blendMode = egret.BlendMode.ERASE;
            _this.addChild(_this.cirleLight);
            return _this;
        }
        //设置光圈的位置
        LightMask.prototype.setLightPos = function (posx, posy) {
            this.cirleLight.x = posx;
            this.cirleLight.y = posy;
        };
        //设置背景框的大小
        LightMask.prototype.setMaskSize = function (maskW, maskH) {
            this.graphics.clear();
            this.graphics.beginFill(0x000000, 0.6);
            this.graphics.drawRect(0, 0, maskW, maskH);
            this.graphics.endFill();
        };
        //设置光圈的大小
        LightMask.prototype.setLightValue = function (light) {
            this.lightMatrix.createGradientBox(light * 2, light * 2, 0, -light, -light);
            this.cirleLight.graphics.clear();
            this.cirleLight.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xffffff, 0xd3d3d3, 0x888888, 0x000000], [1, 0.95, 0.2, 0], [0, 50, 180, 255], this.lightMatrix); //这个渐变的参数是自己调的，可能不太理想，谁有好的参数可以留言，谢谢啦。
            this.cirleLight.graphics.drawCircle(0, 0, light);
            this.cirleLight.graphics.endFill();
        };
        return LightMask;
    }(egret.Sprite));
    com_main.LightMask = LightMask;
})(com_main || (com_main = {}));
