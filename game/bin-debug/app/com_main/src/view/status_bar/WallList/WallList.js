// module com_main {
//     export class WallList extends CView {
//         public popUp: com_main.APopUp;
//         public toolTitle_1: eui.Label;
//         public toolTitle_2: eui.Label;
//         public toolTitle_3: eui.Label;
//         private myNickName: string = "";
//         private myInfo: BattlePlayerInfoVo;
//         private isUpdateOver: boolean = true;
//         private wallListScroller: WallListScroller;
//         private arrayCollection: eui.ArrayCollection;
//         private realWallListGrade: number = 0;//测试/////////////////////
//         public constructor(handle) {
//             super();
//             this.initApp("battle_/top/battle_top_WallList.exml");
//             debug("walllist的body：", handle);
//             this.myNickName = "[" + Utils.getCountyName(RoleData.countryId) + "]" + RoleData.nickName; 
//             this.toolTitle_2.text = this.myNickName;
//             if (handle) {
//                 this.arrayCollection = handle;
//                 for (let i = 0; i < this.arrayCollection.length; i++) {
//                     if (this.arrayCollection.getItemAt(i).PlayerName == this.myNickName) {
//                         this.toolTitle_1.text = this.arrayCollection.getItemAt(i).WallListRankId;
//                         break;
//                     }
//                 }
//             }
//             // debug("我的昵称:",RoleData.nickName);
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//         }
//         protected onCreate() {
//             Utils.TimerManager.doFrame(2, 0, this.updateMyState, this);
//             // Utils.TimerManager.doFrame(2, 0, this.onEnterFrame, this);
//             this.wallListScroller = new WallListScroller();
//             this.wallListScroller.width = this.width * 0.8;
//             this.wallListScroller.height = this.height * 0.66;
//             this.wallListScroller.anchorOffsetX = this.wallListScroller.width / 2;
//             this.wallListScroller.x = this.width * 0.5;
//             this.wallListScroller.y = this.height * 0.12;
//             this.addChild(this.wallListScroller);
//             this.wallListScroller.list.dataProvider = this.arrayCollection;
//             // let items = [];
//             // this.arrayCollection = new eui.ArrayCollection();
//             // this.arrayCollection.addItemAt({ WallListRankId: 1, PlayerName: "铁血傻大姐", WallListGrade: 99 }, 0);
//             // this.arrayCollection.addItemAt({ WallListRankId: 2, PlayerName: "o智商超级鸡o", WallListGrade: 88 }, 1);
//             // this.arrayCollection.addItemAt({ WallListRankId: 3, PlayerName: "房管局ID解封", WallListGrade: 77 }, 2);
//             // this.arrayCollection.addItemAt({ WallListRankId: 4, PlayerName: "的克冯巩", WallListGrade: 66 }, 3);
//             // this.wallListScroller.list.dataProvider = this.arrayCollection;
//         }
//         private updateMyState() {
//             if (this.isUpdateOver) {
//                 this.isUpdateOver = false;
//                 if (this.arrayCollection) {
//                     for (let i = 0; i < this.arrayCollection.length; i++) {
//                         if (this.arrayCollection.getItemAt(i).PlayerName == this.myNickName) {
//                             this.toolTitle_2.text = this.arrayCollection.getItemAt(i).PlayerName;
//                             this.toolTitle_3.text = this.arrayCollection.getItemAt(i).WallListGrade;
//                             if (this.arrayCollection.getItemAt(i).WallListRankId < 25) {
//                                 this.toolTitle_1.text = this.arrayCollection.getItemAt(i).WallListRankId;
//                                 // this.toolTitle_2.text = this.arrayCollection.getItemAt(i).PlayerName;
//                                 // this.toolTitle_3.text = this.arrayCollection.getItemAt(i).WallListGrade;
//                                 this.isUpdateOver = true;
//                                 return;
//                             } else {
//                                 this.toolTitle_1.text = "未上榜";
//                                 this.isUpdateOver = true;
//                                 return;
//                             }
//                         }
//                     }
//                 }
//                 this.isUpdateOver = true;
//             }
//         }
//         // private onEnterFrame() {
//         //     this.realWallListGrade = this.realWallListGrade + 1;
//         //     this.toolTitle_3.text = "" + this.realWallListGrade;
//         //     debug("计数", this.realWallListGrade);
//         //     this.setArrayCollection(123, "正统血孤", this.realWallListGrade);
//         //     if (this.realWallListGrade >= 180) {
//         //         Utils.TimerManager.remove(this.onEnterFrame, this);
//         //     }
//         // }
//         // private setArrayCollection(wallListRankId?: number, playerName?: string, wallListGrade?: number) {
//         //     for (let i = 0; i < this.arrayCollection.length; i++) {
//         //         if (wallListGrade >= this.arrayCollection.getItemAt(i).WallListGrade) {
//         //             this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: playerName, WallListGrade: wallListGrade }, i);
//         //             for (let j = i; j < this.arrayCollection.length; j++) {
//         //                 this.arrayCollection.getItemAt(j).WallListRankId = j + 1;
//         //             }
//         //             if (this.arrayCollection.length > 25) {
//         //                 this.arrayCollection.removeItemAt(this.arrayCollection.length - 1);
//         //                 this.wallListScroller.list.dataProvider = this.arrayCollection;
//         //                 let rank = i + 1;
//         //                 this.toolTitle_1.text = "排名第" + rank;
//         //                 return;
//         //             } else {
//         //                 this.wallListScroller.list.dataProvider = this.arrayCollection;
//         //                 return;
//         //             }
//         //         }
//         //     }
//         // }
//         public onDestroy(): void {
//             super.onDestroy();
//             Utils.TimerManager.remove(this.updateMyState, this);
//         }
//     }
// }
