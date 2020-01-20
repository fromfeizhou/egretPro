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
var AGame;
(function (AGame) {
    var App = /** @class */ (function (_super_1) {
        __extends(App, _super_1);
        function App() {
            return _super_1.call(this) || this;
        }
        App.prototype.registerView = function (root) {
            if (this.m_pRoot) {
                this.m_pRoot.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.m_pRoot.removeChildren();
            }
            this.m_pRoot = root;
            //挡住index的那张默认图片
            var rectMask = new eui.Rect(this.m_pRoot.width, this.m_pRoot.height, 0x000000);
            this.m_pRoot.addChild(rectMask);
            this.m_pMapLevel = new egret.DisplayObjectContainer();
            this.m_pMapLevel.name = "map";
            this.m_pRoot.addChild(this.m_pMapLevel);
            this.m_pMenuLevel = new egret.DisplayObjectContainer();
            this.m_pMenuLevel.name = "menu";
            this.m_pMenuLevel.height = this.stageHeight;
            this.m_pRoot.addChild(this.m_pMenuLevel);
            this.m_pPopupLevel = new egret.DisplayObjectContainer();
            this.m_pPopupLevel.name = "popUp";
            this.m_pRoot.addChild(this.m_pPopupLevel);
            this.m_pTopLevel = new egret.DisplayObjectContainer();
            this.m_pTopLevel.name = "top";
            this.m_pRoot.addChild(this.m_pTopLevel);
            this.m_pGuideLevel = new egret.DisplayObjectContainer();
            this.m_pGuideLevel.name = "guide";
            this.m_pRoot.addChild(this.m_pGuideLevel);
            this.m_pNetLevel = new egret.DisplayObjectContainer();
            this.m_pNetLevel.name = "net";
            this.m_pRoot.addChild(this.m_pNetLevel);
            this.m_pRoot.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.m_tEffectPools = [];
        };
        Object.defineProperty(App.prototype, "stageWidth", {
            get: function () {
                return this.m_pRoot.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "stageHeight", {
            get: function () {
                return this.m_pRoot.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "screenWidth", {
            get: function () {
                if (App.isNative) {
                    return egret.MainContext.instance.stage.stageWidth;
                }
                return this.m_pRoot.stage.$screen['canvas']['clientWidth'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "screenHeight", {
            get: function () {
                if (App.isNative) {
                    return egret.MainContext.instance.stage.stageHeight;
                }
                return this.m_pRoot.stage.$screen['canvas']['clientHeight'];
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.removeAll = function () {
            this.m_pMapLevel.removeChildren();
            this.m_pMenuLevel.removeChildren();
            this.m_pPopupLevel.removeChildren();
            this.m_pTopLevel.removeChildren();
            this.m_pGuideLevel.removeChildren();
        };
        App.prototype.onTouchEnd = function (e) {
            var _this = this;
            var effect;
            if (this.m_tEffectPools.length > 0) {
                effect = this.m_tEffectPools.shift();
            }
            else {
                effect = new MCDragonBones();
                effect.setCallback(function () {
                    effect.stop();
                    _this.m_tEffectPools.push(effect);
                    Utils.removeFromParent(effect);
                }, this);
                effect.initAsync(IETypes.EUI_PointEffect);
            }
            effect.x = e.stageX;
            effect.y = e.stageY;
            Utils.addChildAt(this.m_pRoot, effect, 999);
            effect.play(IETypes.EUI_PointEffect, 0);
            com_main.EventMgr.dispatchEvent(TASK_EVT.GLOBAL_TOUCH_END, null);
        };
        App.prototype.screenScale = function (height, width) {
            var screenScale = this.screenHeight / this.screenWidth;
            var standardScale = height / width;
            var scale = screenScale / standardScale + 0.1; //浏览器占用差值
            var tmpScale = screenScale / 1.5;
            if (scale > TOUCH_SCALE_XY && scale < 1) {
                scale = tmpScale < 1 ? (scale - 0.1) : TOUCH_SCALE_XY;
            }
            else if (scale < TOUCH_SCALE_XY) {
                //                scale -= 0.1;
            }
            return scale > 1 ? 1 : scale;
        };
        Object.defineProperty(App.prototype, "mapLevel", {
            get: function () {
                return this.m_pMapLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "menuLevel", {
            get: function () {
                return this.m_pMenuLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "popUpLevel", {
            get: function () {
                return this.m_pPopupLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "topLevel", {
            get: function () {
                return this.m_pTopLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "guideLevel", {
            get: function () {
                return this.m_pGuideLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "netLevel", {
            get: function () {
                return this.m_pNetLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "root", {
            get: function () {
                return this.m_pRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "Instance", {
            get: function () {
                if (!App.instance)
                    App.instance = new App();
                return App.instance;
            },
            enumerable: true,
            configurable: true
        });
        App.isNative = egret.Capabilities.runtimeType != egret.RuntimeType.WEB;
        return App;
    }(egret.HashObject));
    AGame.App = App;
})(AGame || (AGame = {}));
