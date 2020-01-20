// module com_main {
//     export class WallListScrollerList extends eui.ItemRenderer {
//         public WallListId: eui.Label;
//         public PlayerName: eui.Label;
//         public WallListGrade: eui.Label;
//         public constructor() {
//             super();
//             // this.initApp("battle/top/walllistscroller/battle_top_walllistscroller_List.exml");
//             // this.skinName = "battle/top/walllistscroller/battle_top_walllistscroller_List.exml"; 
//             this.skinName = "WallListScrollerListExml";
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.PlayerName.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
//         }
//         private onClick(event: egret.TouchEvent): void {
//             if (this.data) {
//                 debug("我点击了", this.data.PlayerName);
//             }
//         }
//         protected dataChanged(): void {
//         }
//     }
// }
