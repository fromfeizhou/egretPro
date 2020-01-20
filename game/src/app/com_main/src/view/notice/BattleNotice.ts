// enum BattleNoticeType {
// 	LINEUP = 1,         // [国家]xx加入排队
// 	JOIN = 2,         	// [国家]xx集结成功
// 	USESPELL = 3,   	// [国家]xx使用（战法，酒，箭雨）
// 	DIE = 4,         	// [国家]xx全员阵亡
// 	TRIGGER = 5         // 守方触发xx
// }

// enum BattleNoticeTip {
// 	LINEUP = 2,         // 加入排队
// 	JOIN = 3,         	// 集结成功
// 	USESPELL = 1,   	// 使用
// 	DIE = 4,         	// 全员阵亡
// 	TRIGGER = 5         // 守方触发xx
// }

// module com_main {
// 	export class BattleNotice extends CView {
// 		public static NAME = 'BattleNotice';

// 		public array: any[] = [];
// 		public isInit: boolean = false;
// 		private instanceUi: BattleNoticeUi;
// 		private instance: BattleNotice;

//         public constructor(instance, ownInstance?: BattleNotice) {
// 			super();
// 			this.name = BattleNotice.NAME;
// 			this.instanceUi = instance;
// 			if (ownInstance) {
// 				this.instance = ownInstance;
// 			}
// 			this.initEvent();
//         }

// 		private initEvent() {
// 			EventMgr.addEvent(EventEnum.BATTLE_NOTICE_CLIENT, this.otherNotice, this);//其他外部的公告由此处接收
// 		}

// 		private otherNotice(notice) {
// 			this.sendNotice(null, notice.content);
// 		}

//         protected listenerProtoNotifications(): any[] {
//             return [
// 				[ProtoDef.BATTLE_NOTICE],           //无法控制的由服务端统一推送，在此包括战法、酒、箭雨
// 				[ProtoDef.BATTLE_LINEUP],           //玩家排队
// 				[ProtoDef.BATTLE_PLAYER_JOINED],    //其他玩家集结
//                 [ProtoDef.BATTLE_PLAYER_WITHDREW],  //玩家死亡
// 				// [ProtoDef.BATTLE_UNIT_ADD_BUFF],  	//使用酒
// 				// [ProtoDef.BATTLE_USE_SKILL],  		//使用箭雨
// 				// [ProtoDef.BATTLE_SPELL_EFFECT],  	//使用战法
//             ];
//         }

//         protected executes(notification: AGame.INotification) {
//             let body = notification.getBody();
//             let protocol: number = Number(notification.getName());
//             switch (protocol) {									//守方触发事件写在召唤事件和触发战法事件那里
// 				case ProtoDef.BATTLE_NOTICE: {
// 					// debug("使用法术：战法，酒，箭雨" + body);
// 					this.setNotice(BattleNoticeType.USESPELL, body);
// 					break;
// 				}
// 				case ProtoDef.BATTLE_LINEUP: {
// 					// debug("玩家排队", body);
// 					this.setNotice(BattleNoticeType.LINEUP, body);
// 					break;
// 				}
// 				case ProtoDef.BATTLE_PLAYER_JOINED: {
// 					// debug("玩家集结", body);
// 					this.setNotice(BattleNoticeType.JOIN, body);
//                     break;
//                 }
// 				case ProtoDef.BATTLE_PLAYER_WITHDREW: {
// 					// debug("玩家死亡", body);
// 					this.setNotice(BattleNoticeType.DIE, body);
//                     break;
//                 }
//                 default: {
//                     break;
//                 }
//             }
//         }

// 		public addNotice(msg) {
// 			this.array.push(msg);
// 			if (this.array.length == 1 && !this.isInit) {
// 				this.isInit = true;
// 				Utils.TimerManager.doFrame(2, 0, this.onEnterFrame, this);
// 			}
// 		}

// 		private onEnterFrame() {
// 			if (this.array.length != 0) {
// 				if (!this.instanceUi.getState()) {
// 					this.instanceUi.setData(this.array[0]);
// 					this.array.shift();
// 				}
// 			} else {
// 				this.isInit = false;
// 				Utils.TimerManager.remove(this.onEnterFrame, this);
// 			}
// 		}

// 		private setNotice(noticeType, body) {
// 			let a = C.BattleNoticeConfig;
// 			switch (noticeType) {
// 				case BattleNoticeType.LINEUP: { 		/** [国家]xx加入排队 */
// 					if (!C.BattleNoticeConfig) return;
// 					let tip = GLan(C.BattleNoticeConfig[BattleNoticeTip.LINEUP].msg);
// 					if (!tip) return;
// 					if (body.playerInfo) {
// 						this.sendNotice(body.playerInfo.id, tip);
// 					}
// 					break;
// 				}
// 				case BattleNoticeType.JOIN: {			/** [国家]xx集结成功 */
// 					if (!C.BattleNoticeConfig) return;
// 					let tip = GLan(C.BattleNoticeConfig[BattleNoticeTip.JOIN].msg);
// 					if (!tip) return;
// 					if (body.playerInfo) {
// 						this.sendNotice(body.playerInfo.id, tip);
// 					}
// 					break;
// 				}
// 				case BattleNoticeType.USESPELL: {			/** [国家]xx使用战法、酒、箭雨 */
// 					if (!C.BattleNoticeConfig) return;
// 					let tip = GLan(C.BattleNoticeConfig[body.id].msg);
// 					if (!tip) return;
// 					// tip = tip + GLan(C.SpellConfig[Number(body.param[0])].name);
// 					this.sendNotice(body.playerId, tip);
// 					break;
// 				}
// 				case BattleNoticeType.DIE: { 			/** [国家]xx全员阵亡 */
// 					if (body.reason == 0) {				//全部阵亡
// 						this.sendNotice(body.playerId, "全员阵亡");
// 					}
// 					break;
// 				}
// 				case BattleNoticeType.TRIGGER: { 		/** 守方触发xx *///写在别的地方了
// 					break;
// 				}
// 				default: {
// 					break;
// 				}
// 			}
// 		}

// 		private sendNotice(playerId, tip?: string) {
// 			if (playerId) {
// 				//zb
// 				// let player: BattlePlayerInfoVo = PlayerModel.getPlayer(Long.fromValue(playerId).toNumber());
// 				let player: BattlePlayerInfoVo = PlayerModel.getPlayer(playerId);
// 				if (player) {
// 					let headTexture = RES.getRes(Utils.getPlayerHeadImg(player.head));
// 					let headBgTexture = this.getOwnColor(player.id, player.faction).headBg;
// 					let nameColor = this.getOwnColor(player.id, player.faction).nameColor;
// 					let playerName = player.name;
// 					let countryName = "[ ]";
// 					if (C.CountryConfig[player.countryId] && BattleModel.getCheckPointType()) {
// 						countryName = "[" + GLan(C.CountryConfig[player.countryId].name) + "]";
// 					} else {
// 						countryName = "";
// 					}
// 					let txt: egret.ITextElement[] = [];
// 					txt.push({ text: countryName, style: { textColor: 0xffffff } });//国家颜色默认白色
// 					txt.push({ text: playerName, style: { textColor: nameColor } });
// 					txt.push({ text: tip, style: { textColor: 0xffffff } });
// 					this.addNotice({ msg: txt, bgTexture: headBgTexture, headTexture: headTexture });
// 				}
// 			} else {//针对战场倒计时公告和战场血量引发的超级援军公告
// 				let txt: egret.ITextElement[] = [];
// 				txt.push({ text: tip, style: { textColor: 0xffffff } });
// 				this.addNotice({ msg: txt, bgTexture: null, headTexture: null });
// 			}
// 		}

// 		/**背景颜色 */
// 		/**battle_res2_json.battle_head_bg_1：红
// 		 * battle_res2_json.battle_head_bg_2：绿
// 		 * battle_res2_json.battle_head_bg_3：蓝
// 		 */


// 		//zb
// 		// private getOwnColor(playerId, faction) {
// 		/**头像背景和名字是一样的颜色 */
// 		private getOwnColor(playerId:number, faction) {
// 			// if ((<Long>playerId).toNumber() == RoleData.playerId.toNumber()) {//我自己蓝色
// 			if (playerId == (RoleData.playerId)) {//我自己蓝色
// 				let res = RES.getRes("battle_res2_json.battle_head_bg_3");
// 				return { headBg: res, nameColor: 0x0000ff };
// 			} else {
// 				if (faction == BattleModel.getOwnFaction()) {			 //友军绿色
// 					let res = RES.getRes("battle_res2_json.battle_head_bg_2");
// 					return { headBg: res, nameColor: 0x00ff00 };
// 				} else {												 //敌人红色
// 					let res = RES.getRes("battle_res2_json.battle_head_bg_1");
// 					return { headBg: res, nameColor: 0xff0000 };
// 				}
// 			}
// 		}

// 		public onDestroy(): void {
//             super.onDestroy();
// 			Utils.TimerManager.remove(this.onEnterFrame, this);
// 			EventMgr.removeEventByObject(EventEnum.BATTLE_NOTICE_CLIENT, this);
//         }
// 	}
// }