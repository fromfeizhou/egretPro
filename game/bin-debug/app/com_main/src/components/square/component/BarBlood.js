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
    /**
     * 血条
     * @author
     */
    var BarBlood = /** @class */ (function (_super_1) {
        __extends(BarBlood, _super_1);
        function BarBlood(width, height) {
            var _this = _super_1.call(this) || this;
            _this.init(width, height);
            return _this;
        }
        BarBlood.prototype.init = function (width, height) {
            this.bg = Utils.DisplayUtils.createBitmap("battle_hp_bg");
            this.bg.fillMode = egret.BitmapFillMode.SCALE;
            this.bg.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
            this.addChild(this.bg);
            width = width || this.bg.width;
            height = height || this.bg.height;
            this.bg.width = width;
            this.bg.height = height;
            this.width = this.bg.width;
            this.height = this.bg.height;
            // AnchorUtil.setAnchorX(this.bg, 0.5);
            AnchorUtil.setAnchorY(this.bg, 0.5);
            // this.bg.x = this.width * 0.5
            this.bg.y = this.height * 0.5;
            this.bar = Utils.DisplayUtils.createBitmap("battle_hp_2");
            this.bar.fillMode = egret.BitmapFillMode.SCALE;
            this.bar.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
            this.addChild(this.bar);
            this.bar.width = width;
            this.bar.height = height;
            // AnchorUtil.setAnchorX(this.bar, 0.5);
            AnchorUtil.setAnchorY(this.bar, 0.5);
            // this.bar.x = this.width * 0.5
            this.bar.y = this.height * 0.5;
            this.originWidth = width; //this.bar.texture.textureWidth;
            this.num = new egret.TextField();
            // this.num.width = this.width;
            // this.num.anchorOffsetX = this.width * 0.5;
            // this.num.x = this.width * 0.5;
            this.num.textAlign = egret.HorizontalAlign.CENTER;
            this.num.stroke = 1;
            this.num.textColor = GameConfig.TextColors.fontWhite;
            this.num.size = 18;
            this.num.text = "0/0";
            // this.num.visible = CityBlood.m_pIsShowBlood;
            this.num.visible = false;
            Utils.addChild(this, this.num);
            // this.addChild(this.num);
            // this.cacheAsBitmap = true;
        };
        BarBlood.prototype.onDestroy = function () {
            Utils.removeAllChild(this);
            Utils.removeFromParent(this);
            this.bg = null;
            this.bar = null;
            this.num = null;
        };
        BarBlood.prototype.setHpBarTexture = function (textureName) {
            if (this.bar) {
                this.bar.texture = RES.getRes(textureName);
            }
        };
        BarBlood.prototype.setProgress = function (hp, life) {
            var num = hp / life;
            var per = num < 0 ? 0 : num;
            this.bar.width = per * this.originWidth;
            this.num.text = hp + "/" + life;
        };
        BarBlood.prototype.reSet = function () {
            this.bar.width = this.originWidth; //18;
            this.num.text = "0/0";
        };
        return BarBlood;
    }(egret.DisplayObjectContainer));
    com_main.BarBlood = BarBlood;
})(com_main || (com_main = {}));
