// module com_main {
//     export class Message extends CView {

//         public message_Group: eui.Group;

//         public constructor() {
//             super();
//             this.initApp("battle_/top/battle_top_Message.exml");
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.y = 30;
//             this.x = 525;

//             this.initAll();
//         }

//         private initAll() {
//             this.initEvent();
//         }

//         private initEvent() {
//             EventManager.addTouchScaleListener(this.message_Group, this, this.MessageClick);
//         }

//         //消息点击
//         private MessageClick(evt: egret.Event) {
//             let arr: any[] = "2017-03-23 10:30:00".split(/[-:]/);
//             let date = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
//             debug("1:" + date);
//             debug("2:" + new Date("2017/01/20 10:37:00").getTime());
//             let currentTime = egret.getTimer();//当前系统时间
//             let date1 = new Date();
//             debug("3:" + date1.getTime());
//             let hour = date1.getHours(); //获得当前设备事件
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             this.destroyEvent();
//         }

//         private destroyEvent() {
//             Utils.removeFromParent(this);
//             EventManager.removeEventListeners(this);
//         }
//     }
// }