
module AGame {
    export class App extends egret.HashObject {
        private m_pRoot: eui.UILayer;//根
        private m_pMapLevel: egret.DisplayObjectContainer;//地图层
        private m_pMenuLevel: egret.DisplayObjectContainer;//菜单层
        private m_pPopupLevel: egret.DisplayObjectContainer;//弹窗层
        private m_pTopLevel: egret.DisplayObjectContainer;//顶层
        private m_pGuideLevel: egret.DisplayObjectContainer;//任务指引层
        private m_pNetLevel: egret.DisplayObjectContainer;   //网络提示层

        public static isNative = egret.Capabilities.runtimeType != egret.RuntimeType.WEB;

        private m_tEffectPools: MCDragonBones[];      //缓存

        public constructor() {
            super();
        }

        public registerView(root: eui.UILayer) {
            if (this.m_pRoot) {
                this.m_pRoot.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.m_pRoot.removeChildren();
            }
            this.m_pRoot = root;

            //挡住index的那张默认图片
            let rectMask = new eui.Rect(this.m_pRoot.width, this.m_pRoot.height, 0x000000);
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
        }

        public get stageWidth(): number {
            return this.m_pRoot.stage.stageWidth;
        }

        public get stageHeight(): number {
            return this.m_pRoot.stage.stageHeight;
        }

        public get screenWidth(): number {
            if (App.isNative) {
                return egret.MainContext.instance.stage.stageWidth;
            }
            return this.m_pRoot.stage.$screen['canvas']['clientWidth'];
        }

        public get screenHeight(): number {
            if (App.isNative) {
                return egret.MainContext.instance.stage.stageHeight;
            }
            return this.m_pRoot.stage.$screen['canvas']['clientHeight'];
        }

        public removeAll() {
            this.m_pMapLevel.removeChildren();
            this.m_pMenuLevel.removeChildren();
            this.m_pPopupLevel.removeChildren();
            this.m_pTopLevel.removeChildren();
            this.m_pGuideLevel.removeChildren();
        }

        public onTouchEnd(e: egret.TouchEvent): void {
            let effect: MCDragonBones;
            if (this.m_tEffectPools.length > 0) {
                effect = this.m_tEffectPools.shift();
            } else {
                effect = new MCDragonBones();
                effect.setCallback(() => {
                    effect.stop();
                    this.m_tEffectPools.push(effect);
                    Utils.removeFromParent(effect);
                }, this);
                effect.initAsync(IETypes.EUI_PointEffect);
            }
            effect.x = e.stageX;
            effect.y = e.stageY;
            Utils.addChildAt(this.m_pRoot, effect, 999);

            effect.play(IETypes.EUI_PointEffect, 0);

            com_main.EventMgr.dispatchEvent(TASK_EVT.GLOBAL_TOUCH_END, null);
        }

        public screenScale(height, width): number {
            var screenScale: number = this.screenHeight / this.screenWidth;
            var standardScale: number = height / width;

            var scale: number = screenScale / standardScale + 0.1;//浏览器占用差值
            var tmpScale: number = screenScale / 1.5;


            if (scale > TOUCH_SCALE_XY && scale < 1) {
                scale = tmpScale < 1 ? (scale - 0.1) : TOUCH_SCALE_XY;
            } else if (scale < TOUCH_SCALE_XY) {
                //                scale -= 0.1;
            }

            return scale > 1 ? 1 : scale;
        }

        public get mapLevel(): egret.DisplayObjectContainer {
            return this.m_pMapLevel;
        }

        public get menuLevel(): egret.DisplayObjectContainer {
            return this.m_pMenuLevel;
        }

        public get popUpLevel(): egret.DisplayObjectContainer {
            return this.m_pPopupLevel;
        }

        public get topLevel(): egret.DisplayObjectContainer {
            return this.m_pTopLevel;
        }

        public get guideLevel(): egret.DisplayObjectContainer {
            return this.m_pGuideLevel;
        }

        public get netLevel(): egret.DisplayObjectContainer {
            return this.m_pNetLevel;
        }

        public get root() {
            return this.m_pRoot;
        }

        protected static instance: App;
        static get Instance(): App {
            if (!App.instance)
                App.instance = new App();
            return App.instance;
        }
    }
}