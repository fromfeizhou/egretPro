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
var com;
(function (com) {
    var isometric;
    (function (isometric) {
        var IsoWorld = /** @class */ (function (_super_1) {
            __extends(IsoWorld, _super_1);
            // private _objects: Array<any>;
            function IsoWorld() {
                var _this = _super_1.call(this) || this;
                _this.init();
                return _this;
            }
            IsoWorld.prototype.init = function () {
                var _self__ = this;
                // this._objects = new Array();
                this.m_pReference = new egret.DisplayObjectContainer();
                this.m_pReference.cacheAsBitmap = true;
                Utils.addChild(_self__, this.m_pReference);
                this.m_pBuild = new egret.DisplayObjectContainer();
                Utils.addChild(_self__, this.m_pBuild);
                this.m_pEffect = new egret.DisplayObjectContainer();
                Utils.addChild(_self__, this.m_pEffect);
                this.m_pWorld = new egret.DisplayObjectContainer();
                Utils.addChild(_self__, this.m_pWorld);
                this.m_pSuspension = new egret.DisplayObjectContainer();
                Utils.addChild(_self__, this.m_pSuspension);
                this.m_p_blood = new egret.DisplayObjectContainer();
                Utils.addChild(_self__, this.m_p_blood);
            };
            IsoWorld.prototype.onDestroy = function () {
                Utils.removeAllChild(this.m_pReference);
                Utils.removeAllChild(this.m_pBuild);
                Utils.removeAllChild(this.m_pEffect);
                Utils.removeAllChild(this.m_pWorld);
                Utils.removeAllChild(this.m_pSuspension);
                Utils.removeAllChild(this.m_p_blood);
                this.m_pReference = null;
                this.m_pBuild = null;
                this.m_pEffect = null;
                this.m_pWorld = null;
                this.m_pSuspension = null;
                this.m_p_blood = null;
                Utils.removeAllChild(this);
                Utils.removeFromParent(this);
            };
            IsoWorld.prototype.getWorld = function () {
                return this.m_pWorld;
            };
            IsoWorld.prototype.addChildToBlood = function (child, index) {
                Utils.addChildAt(this.m_p_blood, child, index);
            };
            IsoWorld.prototype.addChildToSuspension = function (child, index) {
                Utils.addChildAt(this.m_pSuspension, child, index);
            };
            IsoWorld.prototype.removeAllChildToSuspension = function () {
                Utils.removeAllChild(this.m_pSuspension);
            };
            IsoWorld.prototype.addChildToWorld = function (child, index) {
                Utils.addChildAt(this.m_pWorld, child, index);
                // this._world.addChildAt(child, index);//需要派发事件
                // this._objects.push(child);
                this.sortUnit();
            };
            IsoWorld.prototype.removeAllChildToWorld = function () {
                Utils.removeAllChild(this.m_pWorld);
            };
            IsoWorld.prototype.addChildToEffect = function (child, index) {
                Utils.addChildAt(this.m_pEffect, child, index);
            };
            IsoWorld.prototype.removeAllChildToEffect = function () {
                Utils.removeAllChild(this.m_pEffect);
            };
            IsoWorld.prototype.addChildToBuild = function (child, index) {
                Utils.addChildAt(this.m_pBuild, child, index);
            };
            IsoWorld.prototype.removeAllChildToBuild = function () {
                Utils.removeAllChild(this.m_pBuild);
            };
            IsoWorld.prototype.addChildToReference = function (child, index) {
                Utils.addChildAt(this.m_pReference, child, index);
            };
            IsoWorld.prototype.removeAllChildToReference = function () {
                Utils.removeAllChild(this.m_pReference);
            };
            IsoWorld.prototype.setReferenceScale = function (x, y) {
                this.m_pReference.scaleX = x;
                this.m_pReference.scaleY = y;
            };
            IsoWorld.prototype.drawRect = function () {
                Utils.DisplayUtils.drawRect(this);
            };
            IsoWorld.prototype.sortUnit = function () {
                Utils.sortChildrens(this.m_pWorld);
            };
            return IsoWorld;
        }(egret.Sprite));
        isometric.IsoWorld = IsoWorld;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
// flash.extendsClass("com.isometric.IsoWorld", "egret.Sprite")
