module com_main {
    export class RoleReplaceItem extends CComponent {

        public Image_back_di: eui.Image;
        public Image_head: eui.Image;
        public Image_mask: eui.Image;
        public m_pSelected: eui.Group;
        public m_imgWear: eui.Image;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("role/role_replace_Item.exml");
        }
        public onDestroy(): void {
            EventManager.removeEventListener(this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.Image_head.mask = this.Image_mask;
        }
        public setItemInfo(id: number, ishave: boolean) {
            let cfg = C.GeneralConfig[id];
            this.Image_head.source = GeneralModel.getSoldierLogo(cfg.role);
            this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(cfg.qualityLevel);

            this.m_imgWear.visible = RoleData.headId == id ? true : false;
            Utils.isGray(!ishave, this);
        }
    }
}