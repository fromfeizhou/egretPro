module com_main {
    export class buildCanAtionItem extends CComponent {

        public m_pBuildGroup: eui.Group;
        public m_pBuildIcon: com_main.CImage;
        public m_pLbBuildName: com_main.CLabel;

         /**
          * 主城升级可解锁建筑
          * @item
          */
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/map/build/build_can_action_item_Skin.exml");

        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
        }
        /**设置显示信息 */
        public setInfo(type: number, name: string) {
            this.m_pBuildIcon.source = Utils.getMainBuildTexture(type);
            this.m_pLbBuildName.text = GLanFormat(name);
            this.setInfoPoint(type);
        }
        /**设置显示大小位置 */
        public setInfoPoint(type: number) {
            this.m_pBuildIcon.scaleX = 1;
            this.m_pBuildIcon.scaleY = 1;
            this.m_pBuildIcon.horizontalCenter = 0;
            this.m_pBuildIcon.verticalCenter = 0;
            if (type == 6 || type == 8 || type == 10 || type == 12||type == 14 || type == 22) {
                this.m_pBuildIcon.scaleX = 0.7;
                this.m_pBuildIcon.scaleY = 0.7;
            }
            if (type == 10 || type == 14) {  
                this.m_pBuildIcon.horizontalCenter = 15;
                this.m_pBuildIcon.verticalCenter = -5;
            }
            if (type == 22 || type == 10 || type == 14) {   //藏书阁,军机处,过关斩将 中心位置微调
                this.m_pBuildIcon.verticalCenter = -15;
            }


        }



    }
}