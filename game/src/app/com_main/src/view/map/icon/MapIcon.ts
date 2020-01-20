
// module com_main {

// 	/**
// 	 * 世界地图事件图标
// 	 */
//     export class MapIcon extends CComponent {

//         public m_pName: eui.Label;
//         public m_pIcon: CImage;
//         public m_pG: CImage;
//         public m_pD: CImage;
//         public m_pH: CImage;
//         public m_pTitle: CImage;
//         public m_pTitleGroup: eui.Group;

//         public m_pType: WorldEvent;

//         public m_pData: any;

//         public m_pIsSuccess: boolean = false;

//         private m_pIsCanTouch = true;

//         private m_pWorldEventType: WorldEventType = WorldEventType.NONE;

//         public m_pIsGray: boolean = false;

//         public constructor(type: WorldEvent, worldEventType: WorldEventType) {
//             super();
//             this.m_pType = type;
//             this.m_pWorldEventType = worldEventType;
//             this.skinName = Utils.getAppSkin("map/map_icon.exml");
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.setType(this.m_pType);
//             this.m_pTitle.visible = false;
//             this.m_pG.visible = false;
//             this.m_pTitleGroup.scaleX = 1.5;
//             this.m_pTitleGroup.scaleY = 1.5;
//         }

//         public set isCanTouch(flag: boolean) {
//             this.m_pIsCanTouch = flag;
//         }

//         public get type(): WorldEvent {
//             return this.m_pType;
//         }

//         public get data(): any {
//             return this.m_pData;
//         }

//         public set data(_data: any) {
//             this.m_pData = _data;
//         }

//         public get isSuccess(): boolean {
//             return this.m_pIsSuccess;
//         }

//         public set gray(flag: boolean) {
//             this.m_pIsGray = flag;
//             Utils.isGray(flag, this.m_pIcon);
//         }

//         public get gray(): boolean {
//             return this.m_pIsGray;
//         }

//         /**完成 */
//         public success() {
//             this.m_pTitle.visible = true;
//             this.m_pG.visible = true;
//             this.m_pD.visible = true;
//             this.m_pH.visible = false;
//             this.m_pIsSuccess = true;
//             this.m_pIsCanTouch = true;

//             // if (this.m_pWorldEventType == WorldEventType.FIGHT) {
//             //     EffectData.removeEffect(EffectData.WORLD_MAP, IETypes.EBuild_Event_H, this.m_pH);
//             // }

//             // EffectData.addEffect(EffectData.WORLD_MAP, IETypes.EBuild_Event_Q, this.m_pG);
//             // EffectData.addEffect(EffectData.WORLD_MAP, IETypes.EBuild_Event_D, this.m_pD);

//             // egret.Tween.get(this.m_pG, { loop: true })
//             // 	.to({ alpha: 0 }, 400)
//             // 	.to({ alpha: 1 }, 400);

//             WorldMapModel.addEventGuideIcon(this.m_pData.id, this.m_pData.index, this.m_pType);
//         }

//         /**
//          * 销毁方法
//          */
//         public onDestroy() {
//             super.onDestroy();
//             if (this.m_pData)
//                 WorldMapModel.removeEventGuideIcon(this.m_pData.id, this.m_pData.index);

//             // egret.Tween.removeTweens(this.m_pG);

//             // EffectData.removeEffect(EffectData.WORLD_MAP, IETypes.EBuild_Event_Q, this.m_pG);
//             // EffectData.removeEffect(EffectData.WORLD_MAP, IETypes.EBuild_Event_D, this.m_pD);

//             this.m_pType = null;
//             this.m_pData = null;

//         }

//         /**检测是否点中图标 */
//         public check_is_touch(x: number, y: number): boolean {
//             if (this.m_pIsCanTouch)
//                 return this.m_pIcon.hitTestPoint(x, y, true);
//             else
//                 return false;
//         }

//         private getName(type: WorldEvent): string {
//             var name = '';
//             switch (type) {
//                 case WorldEvent.YYSR: {
//                     name = GCode(CLEnum.SHOP);
//                     break;
//                 }
//                 case WorldEvent.ZBSR: {
//                     name = GCode(CLEnum.SHOP);
//                     break;
//                 }
//             }

//             return name;
//         }

//         public setType(type: WorldEvent) {
//             var icon_name = '';
//             var lan = '';
//             switch (type) {
//                 case WorldEvent.YYSR://云游商人
//                 case WorldEvent.ZBSR://珍宝商人
//                     {
//                         icon_name = 'map_main_build' + type + '_png';
//                         lan = this.getName(type);
//                         break;
//                     }
//                 case WorldEvent.ARENA://过关斩将
//                     {
//                         icon_name = 'map_main_build' + type + '_png';
//                         lan = this.getName(type);
//                         break;
//                     }

//                 default: {
//                     debug('MapIcon.setType找不到该类型：' + type + '！！！');
//                     break;
//                 }
//             }

//             if (icon_name) {
//                 let res: egret.Texture = RES.getRes(icon_name);
//                 if (res) {
//                     this.m_pIcon.texture = res;
//                     this.m_pIcon.visible = true;
//                 } else {
//                     error('缺少图片：', icon_name);
//                 }
//                 this.m_pName.text = lan;
//             } else {
//                 this.m_pName.text = '';
//                 this.m_pIcon.visible = false;
//             }
//         }

//         public updateName(type: WorldEvent) {
//             let lan = this.getName(type);
//             this.m_pName.text = lan;
//         }
//     }
// }