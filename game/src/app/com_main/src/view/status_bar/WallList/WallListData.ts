// module com_main {
//     export class WallListData {

//         private arrayCollection: eui.ArrayCollection;
//         private realWallListGrade: number = 0;//测试/////////////////////

//         public constructor() {
//             let items = [];
//             this.arrayCollection = new eui.ArrayCollection();
//             // this.arrayCollection.addItemAt({ WallListRankId: 1, PlayerName: "铁血傻大姐", WallListGrade: 10000 }, 0);
//             // this.arrayCollection.addItemAt({ WallListRankId: 2, PlayerName: "o智商超级鸡o", WallListGrade: 1000 }, 1);
//             // this.arrayCollection.addItemAt({ WallListRankId: 3, PlayerName: "房管局ID解封", WallListGrade: 100 }, 2);
//             // this.arrayCollection.addItemAt({ WallListRankId: 4, PlayerName: "的克冯巩", WallListGrade: 10 }, 3);
//         }

//         public getInitHitWall() {
//             let data: any = BattleModel.getCityBattleHitWallDataInfo();
//             let wallData = data.data;
//             debug("撞墙榜初始玩家数据：", wallData);
//             if (data && wallData) {
//                 for (let i = 0; i < wallData.length; i++) {
//                     if (wallData[i].hasOwnProperty('playerId')) {
//                         if (wallData[i].country != 0) {     //玩家
//                             let name = "[" + Utils.getCountyName(wallData[i].country) + "]" + wallData[i].name;
//                             //zb
//                             // this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId.toNumber() }, i);
//                             this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId }, i);
//                         } else {                            //NPC
//                             let name = GLan(wallData[i].name);
//                             //zb
//                             // this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId.toNumber() }, i);
//                             this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId }, i);
//                         }
//                         // if (name) {
//                         //     this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId.toNumber() }, i);
//                         // } else {
//                         //     this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: wallData[i].name, WallListGrade: wallData[i].damage, NpcId: wallData[i].playerId.toNumber() }, i);
//                         // }
//                     }
//                     // debug(GLan(wallData[i].name), "," + wallData[i].playerId.toNumber());
//                 }
//             }
//         }

//         public setArray(player: BattlePlayerInfoVo, damage) {
//             // this.realWallListGrade = this.realWallListGrade + 1;
//             debug("计数", this.realWallListGrade);
//             let playerName = "[" + Utils.getCountyName(player.countryId) + "]" + player.name;
//             if (this.arrayCollection.length == 0) {
//                 // this.setArrayCollection(123, player.name, damage);
//             } else if (this.arrayCollection.length > 0) {
//                 for (let i = 0; i < this.arrayCollection.length; i++) {
//                     if (this.arrayCollection.getItemAt(i).PlayerName == playerName) {
//                         damage = this.arrayCollection.getItemAt(i).WallListGrade + damage;
//                         this.arrayCollection.removeItemAt(i);
//                         for (let j = i; j < this.arrayCollection.length; j++) {
//                             this.arrayCollection.getItemAt(j).WallListRankId = j + 1;
//                         }
//                         this.setArrayCollection(0, playerName, damage);
//                         return;
//                     }
//                     if (i == this.arrayCollection.length - 1) {
//                         this.setArrayCollection(0, playerName, damage);
//                         return;
//                     }
//                 }
//             }
//         }

//         // public get getTest() {
//         //     return this.setArray("段天涯", 666);
//         // }

//         public get getMyTotalDamage() {
//             let myName = "[" + Utils.getCountyName(RoleData.countryId) + "]" + RoleData.nickName;
//             for (let i = 0; i < this.arrayCollection.length; i++) {
//                 if (this.arrayCollection.getItemAt(i).PlayerName == myName) {
//                     let damage = this.arrayCollection.getItemAt(i).WallListGrade;
//                     return damage;
//                 }
//             }
//         }

//         public get getArrayCollection() {
//             if (this.arrayCollection.length != 0) {
//                 return this.arrayCollection;
//             } else {
//                 return null;
//             }
//         }

//         private setArrayCollection(wallListRankId?: number, playerName?: string, wallListGrade?: number) {
//             // debug("调用一次");
//             if (this.arrayCollection.length == 0) {
//                 this.arrayCollection.addItemAt({ WallListRankId: 1, PlayerName: playerName, WallListGrade: wallListGrade }, 0);
//                 return;
//             }
//             for (let i = 0; i < this.arrayCollection.length; i++) {
//                 debug("调用一次");
//                 if (wallListGrade >= this.arrayCollection.getItemAt(i).WallListGrade) {
//                     this.arrayCollection.addItemAt({ WallListRankId: i + 1, PlayerName: playerName, WallListGrade: wallListGrade }, i);

//                     for (let j = i; j < this.arrayCollection.length; j++) {
//                         this.arrayCollection.getItemAt(j).WallListRankId = j + 1;
//                     }

//                     if (this.arrayCollection.length > 25) {
//                         this.arrayCollection.removeItemAt(this.arrayCollection.length - 1);
//                         BattleModel.setCityBattleHitWallData(this.arrayCollection);
//                         return;
//                     } else {
//                         BattleModel.setCityBattleHitWallData(this.arrayCollection);
//                         return;
//                     }
//                 } else if (i == this.arrayCollection.length - 1) {
//                     this.arrayCollection.addItemAt({ WallListRankId: this.arrayCollection.length + 1, PlayerName: playerName, WallListGrade: wallListGrade }, this.arrayCollection.length);
//                     BattleModel.setCityBattleHitWallData(this.arrayCollection);
//                     return;
//                 }
//             }
//         }

//         public onDestroy(): void {
//         }
//     }
// }