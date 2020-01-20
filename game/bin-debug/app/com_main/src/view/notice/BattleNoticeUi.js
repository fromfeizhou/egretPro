// module com_main {
//     export class BattleNoticeUi extends CView {
//         public static instance: BattleNoticeUi;
//         public static NAME = 'BattleNoticeUi';
//         private groupTempNotice: eui.Group;
//         private rectangle: egret.Rectangle;
//         private row: number = 3;  //显示3行
//         private gap: number = 3;  //行距
//         private lineW: number = 0;
//         private lineH: number = 0;
//         private firstId: number = 0;
//         private isMove: boolean = false;
//         private showTime: number = 3000;     //显示时间：3s
//         private panelTempNotice: any[] = [];
//         private defaultBgTexture;
//         private defaultHeadTexture;
//         public constructor(w: number = 350, h: number = 159) {
//             super();
//             this.name = BattleNoticeUi.NAME;
//             this.touchEnabled = false;
//             this.touchChildren = false;
//             this.x = 5;
//             this.y = GameConfig.curHeight() - h - 180;
//             this.lineW = w;
//             this.lineH = h / this.row - this.gap;
//             this.initGroup();
//         }
//         private initGroup() {
//             // this.panelBgTexture = RES.getRes("fight_component_BattleBar_json.fight_component_window-sb-BJ");
//             this.defaultBgTexture = RES.getRes("battle_res2_json.battle_head_bg_1");
//             this.defaultHeadTexture = RES.getRes("battle_res2_json.battle_head");
//             this.groupTempNotice = new eui.Group;
//             this.groupTempNotice.touchEnabled = false;
//             this.groupTempNotice.touchChildren = false;
//             this.groupTempNotice.width = this.lineW;
//             this.groupTempNotice.height = this.lineH * this.row + this.gap * this.row;
//             // this.groupTempNotice.anchorOffsetX = this.groupTempNotice.width / 2;
//             this.groupTempNotice.anchorOffsetY = this.groupTempNotice.height / 2;
//             this.rectangle = new egret.Rectangle(0, 0, this.lineW, this.lineH * this.row + this.gap * (this.row - 1));
//             this.groupTempNotice.mask = this.rectangle;
//             this.addChild(this.groupTempNotice);
//         }
//         public setData(msg) {
//             this.start(msg);
//         }
//         public getState() {
//             return this.isMove;
//         }
//         private start(msg) {
//             if (!this.isMove) {
//                 this.isMove = true;
//                 this.startInit(msg);
//                 this.startMove();
//             }
//         }
//         private startInit(msg) {
//             let panel = this.initComponent(msg);
//             let id = egret.setTimeout(function (arg) {
//                 if (panel) {                            //防止销毁后为null
//                     panel.x = panel.x - panel.width;
//                     panel.y = this.groupTempNotice.height + this.gap;
//                     this.panelTempNotice.splice(0, 1);
//                     this.groupTempNotice.removeChild(arg);
//                     arg = null;
//                 }
//             }, this, this.showTime, panel);
//             this.panelTempNotice.push({ panel: panel });
//         }
//         private initComponent(msg) {
//             let headImg;
//             let bgImg;
//             if (msg.headTexture && msg.bgTexture) {          //有数据使用
//                 headImg = new egret.Bitmap(msg.headTexture);
//                 bgImg = new egret.Bitmap(msg.bgTexture);
//             } else {                                          //无数据使用默认背景和头像
//                 headImg = new egret.Bitmap(this.defaultHeadTexture);
//                 bgImg = new egret.Bitmap(this.defaultBgTexture);
//             }
//             let label: eui.Label = new eui.Label;
//             let panel: eui.Panel = new eui.Panel;
//             panel.addChild(bgImg);
//             panel.addChild(headImg);
//             panel.addChild(label);
//             this.groupTempNotice.addChild(panel);
//             label.textFlow = msg.msg;
//             label.fontFamily = "SimHei";
//             label.size = 20;
//             label.textColor = 0xFFFDDD;
//             label.anchorOffsetY = label.height / 2;
//             label.x = this.lineH + 10;
//             label.y = this.lineH / 2;
//             panel.width = this.lineW;
//             panel.height = this.lineH;
//             panel.x = 0;
//             panel.y = this.groupTempNotice.height;
//             bgImg.width = 175;
//             bgImg.height = this.lineH;
//             headImg.width = this.lineH;
//             headImg.height = this.lineH;
//             return panel;
//         }
//         private startMove() {
//             if (this.panelTempNotice.length != 0) {
//                 let moveTo = this.lineH + this.gap;
//                 if (this.getFirstY() == 0) {
//                     egret.Tween.get(this.panelTempNotice[this.firstId].panel).to({ x: this.panelTempNotice[this.firstId].panel.x - this.panelTempNotice[this.firstId].panel.width }, 350).call(() => {
//                         if (this.panelTempNotice[this.firstId]) {
//                             this.panelTempNotice[this.firstId].panel.visible = false;
//                             this.panelTempNotice[this.firstId].panel.y = this.groupTempNotice.height + this.gap;
//                         }
//                         this.moveAll(moveTo);
//                         return;
//                     });
//                 } else {
//                     this.moveAll(moveTo);
//                 }
//             }
//         }
//         private moveAll(moveTo: number) {
//             for (let i = 0; i < this.panelTempNotice.length; i++) {
//                 if (this.panelTempNotice[i].panel.x == 0) {
//                     egret.Tween.get(this.panelTempNotice[i].panel).to({ y: this.panelTempNotice[i].panel.y - moveTo }, 350).call(() => {
//                         this.isMove = false;
//                     });
//                 }
//             }
//         }
//         private getFirstY(): number {
//             let min: number = 99999;
//             for (let i = 0; i < this.panelTempNotice.length; i++) {
//                 let tempY = this.panelTempNotice[i].panel.y;
//                 // debug("fgbn:"+tempY);
//                 if (tempY < min) {
//                     min = tempY;
//                     this.firstId = i;
//                 }
//             }
//             return min;
//         }
//         public onDestroy(): void {
//             Utils.removeFromParent(this);
//         }
//     }
// }
