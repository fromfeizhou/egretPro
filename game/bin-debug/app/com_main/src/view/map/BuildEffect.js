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
    /**建筑燃烧的特效 */
    var BuildEffect = /** @class */ (function (_super_1) {
        __extends(BuildEffect, _super_1);
        function BuildEffect(mapobj) {
            var _this = _super_1.call(this) || this;
            _this.init(mapobj);
            return _this;
        }
        BuildEffect.create = function (mapobj) {
            return new BuildEffect(mapobj);
        };
        BuildEffect.prototype.init = function (mapobj) {
            this.setMapObject(mapobj);
        };
        BuildEffect.prototype.onDestroy = function () {
        };
        BuildEffect.prototype.setMapObject = function (vale) {
            this.m_pMapObj = vale;
            this.initView();
        };
        BuildEffect.prototype.setBuildUnit = function (vo) {
            this.m_pBuildUnit = vo;
        };
        BuildEffect.prototype.initView = function () {
            this.width = this.m_pMapObj.getWidth();
            this.height = this.m_pMapObj.getHeight();
            AnchorUtil.setAnchor(this, 0.5);
            var cell = this.m_pMapObj.tilePixelToTile();
            var attr = this.m_pMapObj.getProperties();
            var effect = attr.getSource();
            debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "w h", "_", this.m_pMapObj.getWidth(), this.m_pMapObj.getHeight());
            debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "cell", "_", cell.x, cell.y);
            debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "effect", "_", effect);
            this.m_pBuildEffect = com_main.MapEffect.create(this.m_pMapObj);
            this.m_pBuildEffect.x = this.width / 2;
            this.m_pBuildEffect.y = this.height / 2;
            Utils.addChild(this, this.m_pBuildEffect);
        };
        BuildEffect.prototype.doLayout = function () {
            var pos = this.m_pMapObj.tilePixelToPixel();
            this.x = pos.x;
            this.y = pos.y;
            debug("MapEffect:initView--->>", this.m_pMapObj.getName(), this.m_pMapObj.getX(), this.m_pMapObj.getY(), "_", pos.x, pos.y);
        };
        return BuildEffect;
    }(egret.DisplayObjectContainer));
    com_main.BuildEffect = BuildEffect;
})(com_main || (com_main = {}));
