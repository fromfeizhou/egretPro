// module com_main {
//     /**
//      * 上阵位置
//      * @export
//      * @class BaseCampPosition
//      * @extends CComponent
//      */
//     export class BaseCampPosition extends CComponent {
//         protected m_nIid: number = 1;
//         protected m_nIndex: number = 1;
//         protected m_pHero: BaseManualSquare;
//         public get gid() {
//             return this.m_pHero ? this.m_pHero.generalId : 0;
//         }
//         public get iid(): number {
//             return this.m_nIid;
//         }
//         public set iid(id: number) {
//             this.m_nIid = id;
//         }
//         public set index(id: number) {
//             this.m_nIndex = id;
//         }
//         public get index() {
//             return this.m_nIndex;
//         }
//         public constructor() {
//             super();
//             this.skinName = Utils.getSkinName("app/world/world_rank_hero.exml");
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//        }
//         public checkTouched(point: egret.Point) {
//             const pos = this.localToGlobal()
//                 , dis = egret.Point.distance(pos, point);
//             return dis;
//         }
//         public setTouch(touch: boolean, id: number) {
//             // this.m_pLight.visible = touch || this.m_pHero != null;
//         }
//         public setHero(id: number, update: boolean = true): number {
//             return 0;
//         }
//         public removeHero(update: boolean = true) {
//             Utils.removeFromParent(this.m_pHero)
//             this.m_pHero = null;
//         }
//     }
//     /**
//      * 上阵英雄方阵
//      * @export
//      * @class BaseManualSquare
//      * @extends ManualSquare
//      */
//     export class BaseManualSquare extends ManualSquare {
//         protected m_nLastX: number = 0;
//         protected m_nLastY: number = 0;
//         protected m_pCallback: (id: number) => number;
//         protected m_nIndex: number = 0;
//         protected m_nCIndex: number = 0;
//         protected m_pLbName: eui.Label;
//         protected m_nArmyId: number = 1;
//         protected m_nPos: number = 0;
//         public get cIndex() {
//             return this.m_nCIndex;
//         }
//         public constructor(id: number, indx: number = 0, cindx: number = 0) {
//             super(id);
//             this.name = "BaseManualSquare";
//             this.width = 150;
//             this.height = 150;
//             this.touchChildren = true;
//             this.touchEnabled = true;
//             this.m_pHero.x += 60;
//             this.m_pHero.y -= 10;
//             this.m_pSoldier.x += 60;
//             this.m_pSoldier.y -= 10;
//             this.m_nIndex = indx;
//             this.m_nCIndex = cindx;
//             RES.getResAsync("border_1001_png", (k, v) => {
//                 const group = new eui.Group();
//                 group.width = 125;
//                 group.height = 32;
//                 group.x = 145;
//                 group.y = -25;
//                 this.addChild(group)
//                 const bg = new egret.Bitmap();
//                 group.addChild(bg);
//                 bg.texture = k;
//                 bg.width = 125;
//                 bg.height = 32;
//                 const config: GeneralConfig = C.GeneralConfig[this.generalId];
//                 this.m_pLbName = new eui.Label();
//                 this.m_pLbName.text = GLan(config.name);
//                 this.m_pLbName.size = 22;
//                 this.m_pLbName.horizontalCenter = 0;
//                 this.m_pLbName.y = 2
//                 group.addChild(this.m_pLbName);
//             }, this);
//             this.addEventListener("touchBegin", this.onTouchBegin, this);
//             if (this.m_nIndex == 0) {
//                 this.addEventListener("touchMove", this.onTouchMoved, this)
//                 this.addEventListener("touchEnd", this.onTouchEnd, this)
//                 this.addEventListener("touchCancel", this.onTouchEnd, this)
//                 this.addEventListener("touchReleaseOutside", this.onTouchEnd, this)
//             }
//             this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
//         }
//         protected onTouchBegin(e: egret.TouchEvent) {
//         }
//         protected onTouchMoved(e: egret.TouchEvent) {
//         }
//         protected onTouchEnd(e: egret.TouchEvent) {
//         }
//         /**
//          * 设置回调事件
//          * @param  {(id: number) => number} cb 
//          * @param  {number} aid 
//          * @param  {number} pos 
//          * @return void
//          * @memberof CampManualSquare
//          */
//         public setCallBack(cb: (id: number) => number, aid: number, pos: number) {
//             this.m_pCallback = cb;
//             this.m_nArmyId = aid;
//             this.m_nPos = pos;
//         }
//         protected onDestroy() {
//             super.onDestroy();
//             this.removeEventListener("touchBegin", this.onTouchBegin, this);
//             if (this.m_nIndex == 0) {
//                 this.removeEventListener("touchMove", this.onTouchMoved, this)
//                 this.removeEventListener("touchEnd", this.onTouchEnd, this)
//                 this.removeEventListener("touchCancel", this.onTouchEnd, this)
//                 this.removeEventListener("touchReleaseOutside", this.onTouchEnd, this)
//             }
//             this.m_pCallback = null;
//         }
//     }
// }
