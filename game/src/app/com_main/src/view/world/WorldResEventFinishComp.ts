module com_main {

    export class WorldResEventFinishComp extends CComponent {
        public m_pRes: eui.Group;
        public m_pResBg: com_main.CImage;
        public m_pResName: com_main.CImage;


        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("world/WorldResEventFinishCompSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        /**更新资源显示 */
        public updateResShow(resName: string, isNeedBg: boolean = true) {
            this.m_pResBg.visible = isNeedBg;
            this.m_pResName.source = resName;
        }
    }

}