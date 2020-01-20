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
    /**地图的一些固定显示的特效 */
    var MapEffect = /** @class */ (function (_super_1) {
        __extends(MapEffect, _super_1);
        function MapEffect(mapobj) {
            var _this = _super_1.call(this) || this;
            _this.init(mapobj);
            return _this;
        }
        MapEffect.create = function (mapobj) {
            return new MapEffect(mapobj);
        };
        MapEffect.prototype.init = function (mapobj) {
            this.setMapObject(mapobj);
        };
        MapEffect.prototype.onDestroy = function () {
            // EffectData.removeEffect(EffectData.BATTLE_MAP, this.m_pEffect, this.m_pImgEffect);
            Utils.removeFromParent(this.m_pImgEffect);
            this.m_pImgEffect = null;
        };
        MapEffect.prototype.setMapObject = function (vale) {
            this.m_pMapObj = vale;
            this.initView();
        };
        MapEffect.prototype.initView = function () {
            this.width = this.m_pMapObj.getWidth();
            this.height = this.m_pMapObj.getHeight();
            AnchorUtil.setAnchor(this, 0.5);
            var cell = this.m_pMapObj.tilePixelToTile();
            var attr = this.m_pMapObj.getProperties();
            this.m_pEffect = attr.getSource();
            debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "w h", "_", this.m_pMapObj.getWidth(), this.m_pMapObj.getHeight());
            debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "cell", "_", cell.x, cell.y);
            debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "effect", "_", this.m_pEffect);
            this.m_pImgEffect = Utils.DisplayUtils.createBitmap();
            AnchorUtil.setAnchor(this.m_pImgEffect, 0.5);
            this.m_pImgEffect.height = this.height;
            this.m_pImgEffect.width = this.width;
            this.m_pImgEffect.y = this.height / 2;
            this.m_pImgEffect.x = this.width / 2;
            // EffectData.addEffect(EffectData.BATTLE_MAP, this.m_pEffect, this.m_pImgEffect);
            Utils.addChild(this, this.m_pImgEffect);
        };
        MapEffect.prototype.doLayout = function () {
            var pos = this.m_pMapObj.tilePixelToPixel();
            this.x = pos.x;
            this.y = pos.y;
            debug("MapEffect:initView--->>", this.m_pMapObj.getName(), this.m_pMapObj.getX(), this.m_pMapObj.getY(), "_", pos.x, pos.y);
        };
        return MapEffect;
    }(egret.Sprite));
    com_main.MapEffect = MapEffect;
})(com_main || (com_main = {}));
