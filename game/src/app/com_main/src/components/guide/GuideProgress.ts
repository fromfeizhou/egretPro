
// module com_main {
//     export class GuideProgress extends CComponent {

//         public static NAME = 'GuideProgress';

//         public m_pContent: eui.Label;

//         public m_pContentStr: string;
//         public m_pProgressStr: string;

//         public static create(content: string, progress: string) {
//             let obj = this.getClass();
//             if (!obj) {
//                 let sc = SceneManager.getCurrScene();
//                 if (sc == SceneEnums.MAIN_CITY || (RoleData.countryId > 0 && sc == SceneEnums.NOVICE_MAP)) {
//                     let ui = new GuideProgress(content, progress);
//                     SceneManager.addChild(LayerEnums.MENU, ui);
//                 }
//             }else{
//                 obj.m_pContentStr = content;
//                 obj.m_pProgressStr = progress;
//                 obj.setContent();
//             }

//         }

//         public constructor(content: string, progress: string) {
//             super();
//             this.name = GuideProgress.NAME;
//             this.skinName = Utils.getComSkin("guide/guide_progress.exml");

//             this.m_pContentStr = content;
//             this.m_pProgressStr = progress;

//             this.touchChildren = false;
//             this.touchEnabled = false;
//         }

//         public onDestroy() {
//             super.onDestroy();

//         }

//         protected childrenCreated() {
//             super.childrenCreated();

//             Utils.setAnchorCenter(this);
//             this.x = this.stage.stageWidth / 2;
//             this.y = this.stage.stageHeight / 4;

//             this.setContent();
//         }

//         public setContent() {
//             this.m_pContent.text = this.m_pContentStr + '   ' + this.m_pProgressStr;
//         }

//         public setProgress(text: string) {
//             this.m_pProgressStr = text;
//             this.setContent();
//         }

//         public static setProgress(text: string) {
//             let obj = this.getClass();
//             if (obj) {
//                 obj.setProgress(text);
//             }
//         }

//         public static getClass(): GuideProgress {
//             let obj = SceneManager.getClass(LayerEnums.MENU, GuideProgress.NAME);
//             return obj;
//         }

//         public static remove() {
//             let obj = this.getClass();
//             if (obj) {
//                 Utils.removeFromParent(obj);
//                 obj.onDestroy();
//             }
//         }

//     }
// }