// module com_main {
//     /**
//      * 公共的对话面板相关
//      * @export
//      * @class GeneralDialogView
//      * @extends CView
//      */
//     export class GeneralDialogView extends CView {
//         public static NAME = 'GeneralDialogView';
//         protected dialogStrs:string[];
//         protected curIndex:number =-1;
//         protected m_pLbHeroName:CLabel;
//         protected m_pLbDec:CLabel;
//         protected m_pHeroIcon:CImage;
//         protected m_pBtnMask:eui.Group;
//         protected m_pSkipRoot:eui.Group;
//         protected m_pSkip:CLabel;
//         protected m_pDargonRoot:eui.Group;
//         /**{gid:number, content: string, isBone?:boolean, isSkip?:boolean, target?: any, cb?:Function, skipCb?:Function, param?: any[]} */
//         protected m_mDialogData: any;
//         public constructor(data:any) {
//             super();
//             this.m_mDialogData = data;
//             this.dialogStrs = (<string>this.m_mDialogData.content).split("|");
//             this.name = GuideDialogView.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_dialog_view_skin.exml");
//         }
//         public onDestroy(): void {
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//             this.m_mDialogData = null;
//             this.dialogStrs = null;
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             EventManager.addTouchScaleListener(this.m_pBtnMask, this, this.ShowDialog);
//             let gid = this.m_mDialogData.gid
//                 , isSkip = this.m_mDialogData.isSkip
//                 , isBone = this.m_mDialogData.isBone
//                 , config = C.GeneralConfig[gid];
//             if(isBone){
//                 let tempMc = new MCDragonBones();
//                 tempMc.initAsync("Gen_Anim_"+config.role);
//                 tempMc.play("animation");
//                 tempMc.touchEnabled = false;
//                 tempMc.touchChildren = false;
//                 this.m_pDargonRoot.addChild(tempMc);
//             }else{
//                 this.m_pHeroIcon.source = GeneralModel.getSoldierBigLogo(config.role)
//             }
//             this.m_pLbHeroName.text =  GLan(config.name);
//             this.m_pSkipRoot.visible = isSkip;
//             EventManager.addTouchScaleListener(this.m_pSkipRoot, this, this.skipGuide);
//             this.ShowDialog();
//         }
//         protected ShowDialog(){
//             this.curIndex++;
//             if(this.curIndex>= this.dialogStrs.length){
//                 this.onHideDialogView();
//             }else{
//                 this.m_pLbDec.text = this.dialogStrs[this.curIndex];
//             }
//         }
//         private onHideDialogView(){
//             const target = this.m_mDialogData.target
//                 , cb = this.m_mDialogData.cb
//                 , param = this.m_mDialogData.param || []
//             UpManager.history();
//             if (!cb) return;
//             cb.call(target, ...param);
//         } 
//         private skipGuide(){
//             const target = this.m_mDialogData.target
//                 , cb = this.m_mDialogData.skipCb || this.m_mDialogData.cb
//                 , param = this.m_mDialogData.param || []
//             UpManager.history();
//             if (!cb) return;
//             cb.call(target, ...param);
//         }
//     }
// }
