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
     * 战斗的城池，资源上的通知图标
     * @export
     * @class WorldBattleNotify
     */
    var WorldBattleNotify = /** @class */ (function (_super_1) {
        __extends(WorldBattleNotify, _super_1);
        function WorldBattleNotify() {
            var _this = _super_1.call(this) || this;
            _this.__create_res_effect();
            return _this;
        }
        WorldBattleNotify.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldBattleNotify.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldBattleNotify.prototype.onEnter = function () {
        };
        WorldBattleNotify.prototype.__create_res_effect = function () {
            var _this = this;
            this.width = 100;
            this.height = 100;
            this.m_pIcoAttack = new egret.Bitmap();
            Utils.addChild(this, this.m_pIcoAttack);
            RES.getResAsync("btn_039_up_png", function (k, v) {
                if (!_this.m_pIcoAttack)
                    return;
                _this.m_pIcoAttack.texture = k;
                _this.m_pIcoAttack.x = 60;
                _this.m_pIcoAttack.y = 40;
                _this.m_pIcoAttack.anchorOffsetX = _this.m_pIcoAttack.width / 2;
                _this.m_pIcoAttack.anchorOffsetY = _this.m_pIcoAttack.height / 2;
                _this.m_pIcoAttack.touchEnabled = true;
            }, this);
            this.m_pIconLab = new egret.Bitmap();
            Utils.addChild(this, this.m_pIconLab);
            RES.getResAsync("lb_zc_png", function (k, v) {
                if (!_this.m_pIconLab)
                    return;
                _this.m_pIconLab.texture = k;
                _this.m_pIconLab.x = 60;
                _this.m_pIconLab.y = 70;
                _this.m_pIconLab.anchorOffsetX = _this.m_pIconLab.width / 2;
                _this.m_pIconLab.anchorOffsetY = _this.m_pIconLab.height / 2;
                _this.m_pIconLab.touchEnabled = true;
            }, this);
        };
        return WorldBattleNotify;
    }(com_main.CComponent));
    com_main.WorldBattleNotify = WorldBattleNotify;
    /**
     * 战斗右侧通知图标
     * @export
     * @class WorldBattleIco
     * @extends egret.DisplayObjectContainer
     */
    // export class WorldBattleIco extends egret.DisplayObjectContainer {
    //     private m_pIcoAttack: egret.Bitmap;
    //     private m_pLbNum: eui.Label;
    //     public constructor() {
    //         super();
    //         this.once(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
    //         this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
    //     }
    //     protected onEnter() {
    //         this.width = 100;
    //         this.height = 100;
    //         this.m_pIcoAttack = new egret.Bitmap();
    //         Utils.addChild(this, this.m_pIcoAttack)
    //         RES.getResAsync("btn_039_up_png", (k, v) => {
    //             this.m_pIcoAttack.texture = k;
    //             this.m_pIcoAttack.x = 60;
    //             this.m_pIcoAttack.y = 40;
    //             this.m_pIcoAttack.anchorOffsetX = this.m_pIcoAttack.width/2;
    //             this.m_pIcoAttack.anchorOffsetY = this.m_pIcoAttack.height/2;
    //             this.m_pIcoAttack.touchEnabled = true;
    //         }, this);
    //         let bg1 = new egret.Bitmap();
    //         Utils.addChild(this, bg1)
    //         RES.getResAsync("border_016_png", (k, v) => {
    //             bg1.texture = k;
    //             bg1.x = 30;
    //             bg1.y = 60;
    //         }, this);
    //         this.m_pLbNum = new eui.Label();
    //         this.m_pLbNum.text = '0';
    //         this.m_pLbNum.textColor = 0xe7d7a7;
    //         this.m_pLbNum.stroke = 2;
    //         this.m_pLbNum.strokeColor = 0x332857;
    //         this.m_pLbNum.x = 52;
    //         this.m_pLbNum.y = 75;
    //         Utils.addChild(this, this.m_pLbNum)
    //         EventManager.addTouchScaleListener(this.m_pIcoAttack, this, ()=>{
    //             Utils.open_view(TASK_UI.POP_WORLD_BATTLE_PANEL, { id: 0, ty: 0 });
    //         })
    //     }
    //     protected onDestroy() {
    //         EventManager.removeEventListeners(this);
    //     }
    //     public update(num: number) {
    //         let event =  WorldModel.getAllAttackEvent();
    //         num = !event || event.length == 0 ? 0 : event.length;
    //         this.m_pLbNum.text = `${num}`;
    //         this.visible = num > 0;
    //     }
    // }
    /**
     * 世界地图通知图标
     * @export
     * @class WorldNotifyIco
     * @extends egret.DisplayObjectContainer
     */
    // export class WorldNotifyIco extends egret.DisplayObjectContainer {
    //     private m_pIcoAttack: egret.Bitmap;
    //     public static create(): WorldNotifyIco {
    //         let pos = com_main.FunctionOpenPanel.getCenterIconGlobalPos();
    //         let ico = new WorldNotifyIco();
    //         SceneManager.addChild(LayerEnums.MENU, ico);
    //         let layer = SceneManager.getLayer(LayerEnums.MENU);
    //         let fPos = new egret.Point();
    //         layer.globalToLocal(AGame.R.app.stageWidth / 2, AGame.R.app.stageHeight / 2, fPos);
    //         ico.x = fPos.x;
    //         ico.y = fPos.y;
    //         ico.goAction();
    //         return ico;
    //     }
    //     public constructor() {
    //         super();
    //         this.width = 100;
    //         this.height = 100;
    //         this.m_pIcoAttack = new egret.Bitmap();
    //         RES.getResAsync("btn_039_up_png", (k, v) => {
    //             this.m_pIcoAttack.texture = k;
    //             this.m_pIcoAttack.x = 0;
    //             this.m_pIcoAttack.y = 0;
    //             this.m_pIcoAttack.anchorOffsetX = this.m_pIcoAttack.width / 2;
    //             this.m_pIcoAttack.anchorOffsetY = this.m_pIcoAttack.height / 2;
    //         }, this);
    //         this.addChild(this.m_pIcoAttack);
    //     }
    //     public goAction() {
    //         egret.Tween.get(this).wait(300).to({ x: 1150, y: 250, alpha: 0 }, 600).call(()=> {
    //             Utils.removeFromParent(this);
    //         }, this);
    //     }
    // }
    // /**
    //  * 城池战斗火特效
    //  * @class WorldCityFire
    //  * @extends egret.DisplayObjectContainer
    //  */
    // export class WorldCityFire extends CComponent {
    //     public constructor() {
    //         super();
    //         this.once(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
    //     }
    //     $onRemoveFromStage(isclear = true): void {
    //         this.onDestroy();
    //         super.$onRemoveFromStage(isclear);
    //     }
    //     protected onEnter() {
    //         this.$createFire(IETypes.EWORLD_Fire_A, 140, 15)
    //         this.$createFire(IETypes.EWORLD_Fire_B, 120, 115)
    //         this.$createFire(IETypes.EWORLD_Fire_C, 80, 60)
    //         this.$createFire(IETypes.EWORLD_Fire_D, 210, 90)
    //     }
    //     public onDestroy() {
    //         for (let o of this.$children) {
    //             NormalMcMgr.removeMc(<MCDragonBones>o);
    //         }
    //         super.onDestroy();
    //     }
    //     protected $createFire(name: string, x: number, y: number) {
    //         let res = NormalMcMgr.createMc(name);
    //         NodeUtils.addPosAndScale(this, res, x, y, 0.7);
    //         res.play(name, 0);
    //     }
    // }
})(com_main || (com_main = {}));
