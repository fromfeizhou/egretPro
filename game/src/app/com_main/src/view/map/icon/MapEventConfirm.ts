// module com_main {
// 	export class MapEventConfirm extends CComponent {

// 		public m_pLbDesc: eui.Label;
// 		public m_pBtn: ComButton;
//         // public m_pType: CImage;
//         // public m_pIcon: CImage;

//         public m_pGroup1: eui.Group;
//         public m_pGroup2: eui.Group;
//         public m_pGroup3: eui.Group;

// 		private m_pData: any = {};

// 		private m_pCfg: any = {};

// 		private m_pNowShowCount: number = 0;

// 		public static NAME = 'MapEventConfirm';

// 		public static m_pLastSelectEventIcon: MapIcon;

// 		/**
// 		 * type: ProgressTypes
// 		 */
// 		public constructor(data: any) {
// 			super();
// 			this.name = MapEventConfirm.NAME;
// 			this.m_pData = data;
//  			this.skinName = Utils.getAppSkin("map/map_event_confirm_new.exml");
//             //this.initApp("map/map_event_confirm_new.exml");
// 		}

// 		protected childrenCreated() {
// 			super.childrenCreated();

// 			this.m_pGroup1.visible = false;
// 			this.m_pGroup2.visible = false;
// 			this.m_pGroup3.visible = false;

// 			let cfg = C.AffairsConfig[this.m_pData.affairId];
// 			if (cfg) {
// 				this.m_pCfg = cfg;
// 				this.analysisCfg();
// 			} else {
// 				error('读不到配置！！！MapEventConfirm：', this.m_pData.affairId);
// 			}

//             this.m_pBtn.setTitleImg('font_event_cl_png');

// 			// let texture1 = RES.getRes('map_build_icon' + this.m_pData.type + '_png');
// 			// let texture2 = RES.getRes(this.m_pData.worldEventType == WorldEventType.MILITARY_AFFAIRS ? 'font_event_jun_png' : 'font_event_zheng_png');

// 			// if (texture1)
// 			// 	this.m_pIcon.texture = texture1;

// 			// if (texture2)
// 			// 	this.m_pType.texture = texture2;
			
// 			// 设置描述
// 			Utils.setTextByLanguageKey(cfg.eventDesc, this.m_pLbDesc);

// 			this.initEvent();
// 		}

// 		private analysisCfg() {

// 			let expenses = this.m_pCfg.expenses;//消耗
// 			let reward = this.m_pCfg.reward;//奖励

// 			let number = 0;


// 			let isSpecial = false;


// 			if (expenses && expenses != "") {
// 				let list1 = JSON.parse(expenses);

// 				for (var key in list1) {
// 					if (list1.hasOwnProperty(key)) {
// 						var element = list1[key];
// 						this.setGroupData(element, true);
// 					}
// 				}
// 			}

// 			switch (this.m_pData.type) {
// 				case WorldEvent.CONSCRIPTION://,募兵_5
// 				case WorldEvent.AFFAIRS: {//,新军务_6
// 					isSpecial = true;
// 					this.setGroupData(reward, false);
// 					return;
// 				}
// 			}

// 			if (reward && reward != "" && !isSpecial) {
// 				let list2 = JSON.parse(reward);

// 				for (var key in list2) {
// 					if (list2.hasOwnProperty(key)) {
// 						var element = list2[key];
// 						this.setGroupData(element, false);
// 					}
// 				}
// 			}

// 		}

// 		/**
// 		 * 设置支出奖励组
// 		 * isSub：是否支出
// 		 */
// 		private setGroupData(data: any, isSub: boolean) {
// 			this.m_pNowShowCount += 1;

// 			let count = this.m_pNowShowCount;

// 			if (count <= 3) {
// 				let group: eui.Group = <eui.Group>this.getChildByName('group' + count);
// 				let content: eui.Label = <eui.Label>group.getChildByName('content');
// 				let icon: CImage = <CImage>group.getChildByName('icon');

// 				let c = isSub ? '-' : '+';
// 				let url = '';

// 				switch (this.m_pData.type) {
// 					case WorldEvent.CONSCRIPTION:{ //,募兵_5
// 						if (!isSub) {
// 							if (content) {
// 								content.text = c + (parseInt(data) / 1000) + '秒';
// 							}

// 							if (icon) {
// 								url = this.m_pData.type == WorldEvent.CONSCRIPTION ? 'common_icon_mb_png' : 'common_icon_jw_png';

// 								let texture = RES.getRes(url);
// 								if (texture)
// 									icon.texture = texture;
// 							}
// 							break;
// 						}
// 					}
// 					case WorldEvent.AFFAIRS: {//,新军务_6
// 						if (!isSub) {
// 							if (content) {
// 								content.text = c + data;
// 							}

// 							if (icon) {
// 								url = this.m_pData.type == WorldEvent.CONSCRIPTION ? 'common_icon_mb_png' : 'common_icon_jw_png';

// 								let texture = RES.getRes(url);
// 								if (texture)
// 									icon.texture = texture;
// 							}
// 							break;
// 						}
// 					}
// 					default: {
// 						let num = data[2];

// 						if (data.length > 3) {
// 							let type = data[3];
// 							switch (type) {
// 								case RewardType.GRANARY_PER: {//粮仓总量百分比
// 									// let max = RoleData.getFoodMaxLimit();
// 									// num = Math.floor(max * num / 100);
// 									// num = num + '%';
// 									break;
// 								}
// 							}
// 						}

// 						if (content) {
// 							content.text = c + num;
// 						}

// 						if (icon) {
// 							let type = data[0];
// 							let itemtId = data[1];

// 							if (type == PropType.RESOURCE) {
// 								// url = Utils.getResourceIcon(itemtId);
// 							}else{
// 								url = PropModel.getPropIcon(itemtId);
// 							}

// 							let texture = RES.getRes(url);
// 							if (texture)
// 								icon.texture = texture;
// 						}
// 					}
// 				}

// 				group.visible = true;

// 			} else {
// 				error('数量超出限制');
// 			}

// 		}

//         public onDestroy(): void {
// 			super.onDestroy();

// 			this.removeEvent();

// 			delete this.m_pData;
// 		}

// 		/**
//          * 获取实例
//          */
//         public static getClass(): MapEventConfirm {
//             let obj = SceneManager.getClass(LayerEnums.MENU, MapEventConfirm.NAME);
//             return obj;
//         }

// 		public static remove(){
// 			let obj = this.getClass();
// 			if(obj){
// 				this.m_pLastSelectEventIcon = null;
// 				obj.onDestroy();
// 				Utils.removeFromParent(obj);
// 				obj = null;
// 			}
// 		}

// 		public onClick() {
// 			WorldMapModel.m_pLastSelectId = 0;
// 			let isNovice = SceneManager.getCurrScene() == SceneEnums.NOVICE_MAP;

// 			let time = this.m_pCfg.time;
// 			if (time && time > 0 || this.m_pCfg.type == WorldEventType.MILITARY_AFFAIRS) {
// 				if(isNovice){
// 					NoviceMapProxy.send_CITY_BATTLE_TRIGGER_NOVICE_AFFAIR(this.m_pData.index);
// 				}else{
// 					WorldMapProxy.send_CITY_BATTLE_TRIGGER_WORLD_AFFAIR(this.m_pData.index);
// 				}
				
// 			} else {
// 				if(isNovice){
// 					NoviceMapProxy.send_CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD(this.m_pData.index);
// 				}else{
// 					WorldMapProxy.send_CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD(this.m_pData.index);
// 				}
				
// 			}

// 			MapEventConfirm.remove();

// 		}

// 		private initEvent() {
// 			EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClick);
// 		}

// 		private removeEvent() {
// 			EventManager.removeEventListener(this.m_pBtn);
// 		}

// 		public static addEventPanel(panel: any) {
//             let icon = this.m_pLastSelectEventIcon;
//             if (icon) {
//                 (<any>icon.parent).m_pEventPanel = panel;
//                 SceneManager.addChild(LayerEnums.MENU,panel);
//                 // icon.parent.addChild(panel);
//                 let pos = egret.Point.create(0,0);
//                 icon.parent.localToGlobal(icon.x - icon.anchorOffsetX, icon.y - icon.anchorOffsetY, pos);
//                 panel.x = pos.x + icon.width * 0.4;
//                 panel.y = pos.y - panel.height + 70;
//             }
//         }

// 	}
// }