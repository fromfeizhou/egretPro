// module com_main {
//     export class WorldMapThum extends CComponent {
//         public static NAME = 'WorldMapThum';
//         public m_pBg: eui.Group;
//         public m_pSelect: CImage;
//         public m_pCountry: eui.Label;
//         private m_pBuilds: any = {};
//         private m_pWorldMap: WorldMap = null;
//         public static SX: number = 0.1193;
//         public static SY: number = 0.11925;
//         public constructor(type: WorldEvent, worldEventType: WorldEventType) {
//             super();
//             this.name = WorldMapThum.NAME;
//             this.skinName = Utils.getAppSkin("map/map_world_thum.exml");
//         }
//         public static getClass(): WorldMapThum {
//             let obj = SceneManager.getClass(LayerEnums.POPUP, WorldMapThum.NAME);
//             return obj;
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.addBuilds();
//             this.initEvent();
//             this.m_pWorldMap = WorldMap.getClass();
//             if (this.m_pWorldMap) {
//                 let bg = this.m_pBg;
//                 let select = this.m_pSelect;
//                 let max_x = bg.width - select.width;
//                 let max_y = bg.height - select.height;
//                 let point = egret.Point.create(0, 0);
//                 this.m_pWorldMap.m_pBg.globalToLocal(0, 0, point);
//                 point.x = point.x * WorldMapThum.SX;
//                 point.y = point.y * WorldMapThum.SY;
//                 point.x = point.x > 0 ? point.x : 0;
//                 point.x = point.x < max_x ? point.x : max_x;
//                 point.y = point.y > 0 ? point.y : 0;
//                 point.y = point.y < max_y ? point.y : max_y;
//                 this.m_pSelect.x = point.x;
//                 this.m_pSelect.y = point.y;
//             }
//             this.updateCountryCount();
//         }
//         public updateCountryCount() {
//             this.m_pCountry.text = '魏国：' + WorldMapModel.getCountryCount(CountryType.WEI) + '  蜀国：' + WorldMapModel.getCountryCount(CountryType.SHU) + '  吴国：' + WorldMapModel.getCountryCount(CountryType.WU);
//         }
//         public static update(info: any) {
//             let obj = this.getClass();
//             if (obj) {
//                 obj.update(info);
//             }
//         }
//         public update(info: any) {
//             this.updateCountryCount();
//             let build_id = info.id;
//             let cfg = C.WorldMapConfig[build_id];
//             let build: eui.Image = this.m_pBuilds[build_id];
//             if (build && cfg) {
//                 let type = cfg.type;
//                 let status = info.type;
//                 let country = info.country;
//                 let url = 'map_build_2-' + country + '_png';
//                 if (type == 1)
//                     url = 'map_build_1-' + country + '_png';
//                 switch (status) {
//                     case BuildEffectType.ATTACK: {
//                         url = 'map_build_a_png';
//                         break;
//                     }
//                     case BuildEffectType.DEFEND: {
//                         url = 'map_build_d_png';
//                         break;
//                     }
//                     case BuildEffectType.Raid: {
//                         url = 'map_build_q_png';
//                         break;
//                     }
//                 }
//                 let textrue = RES.getRes(url);
//                 build.texture = textrue;
//             }
//         }
//         public initEvent() {
//             this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
//             this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
//             this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
//             this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
//             this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
//         }
//         public removeEvent() {
//             this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
//             this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
//             this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
//             this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
//             this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
//         }
//         /**
//          * 添加建筑
//          */
//         public addBuilds() {
//             let data = WorldMapModel.getCityBuildInfos();
//             let config = C.WorldMapConfig;
//             for (let id in data) {
//                 let info = data[id];
//                 let cfg = config[id];
//                 if (cfg && info) {
//                     let type = cfg.type;
//                     let status = info.type;
//                     let country = info.country;
//                     let url = 'map_build_2-' + country + '_png';
//                     if (type == 1)
//                         url = 'map_build_1-' + country + '_png';
//                     switch (status) {
//                         case BuildEffectType.ATTACK: {
//                             url = 'map_build_a_png';
//                             break;
//                         }
//                         case BuildEffectType.DEFEND: {
//                             url = 'map_build_d_png';
//                             break;
//                         }
//                         case BuildEffectType.Raid: {
//                             url = 'map_build_q_png';
//                             break;
//                         }
//                     }
//                     let textrue = RES.getRes(url);
//                     let build = new eui.Image(textrue);
//                     build.x = cfg.posX * WorldMapThum.SX + 3;
//                     build.y = cfg.posY * WorldMapThum.SY;
//                     this.m_pBuilds[+id] = build;
//                     Utils.addChild(this.m_pBg, build);
//                 }
//             }
//         }
//         /**
//          * 销毁方法
//          */
//         public onDestroy() {
//             super.onDestroy();
//             this.m_pWorldMap = null;
//         }
//         public onTouchBegan(e: egret.TouchEvent): void {
//             this.move(e);
//         }
//         public onTouchMoved(e: egret.TouchEvent): void {
//             this.move(e);
//         }
//         public onTouchEnd(e: egret.TouchEvent): void {
//         }
//         public onTouchReleaseOutside(e: egret.TouchEvent): void {
//         }
//         public onTouchCancel(e: egret.TouchEvent): void {
//         }
//         /**移动地图*/
//         public move(e: egret.TouchEvent) {
//             let bg = this.m_pBg;
//             if (bg) {
//                 let select = this.m_pSelect;
//                 let max_x = bg.width - select.width;
//                 let max_y = bg.height - select.height;
//                 let point = egret.Point.create(0, 0);
//                 bg.globalToLocal(e.stageX - select.width / 2, e.stageY - select.height / 2, point);
//                 point.x = point.x > 0 ? point.x : 0;
//                 point.x = point.x < max_x ? point.x : max_x;
//                 point.y = point.y > 0 ? point.y : 0;
//                 point.y = point.y < max_y ? point.y : max_y;
//                 select.x = point.x;
//                 select.y = point.y;
//                 this.m_pWorldMap.moveTo((select.x + select.width / 2) / WorldMapThum.SX, (select.y + select.height / 2) / WorldMapThum.SY, false);
//             }
//         }
//     }
// }
