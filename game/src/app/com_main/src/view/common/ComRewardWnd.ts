module com_main {
    export class ComRewardWnd extends CView {
        public static NAME = "ComRewardWnd";
        public m_LabTitle: eui.Label;
        public m_pItemsRoot: eui.Group;
        
        private m_titleStr: string;
        private m_sAwards: any;   //奖励串
        /**奖励通用界面 */
        public constructor(param: any) {
            super();
            this.name = ComRewardWnd.NAME;
            this.m_sAwards = param.awards;
            this.m_titleStr = param.titleStr;
            this.initApp("common/ComRewardWndSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.m_LabTitle.text = this.m_titleStr?this.m_titleStr:GCode(CLEnum.BOSS_BOX_AWARD);
            this.reFreshItems();
        }
        /**刷新奖励 */
        private reFreshItems() {
            let awardInfos:IItemInfo[];
            if (typeof (this.m_sAwards) == "string") {
                awardInfos = Utils.parseCommonItemJson(this.m_sAwards);
            }else{
                awardInfos = this.m_sAwards;
            }
            for (let i = 0; i < awardInfos.length; i++) {
                let info = awardInfos[i];
                let itemView = ComItemNew.create('name_num');
                itemView.setItemInfo(info.itemId, info.count);
                this.m_pItemsRoot.addChild(itemView);
            }
        }
    }
}