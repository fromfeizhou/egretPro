module com_main {
    export class WorldSearchAwardWnd extends CView {
        public static NAME = 'TipsNorWnd';

        public m_pAwardRoot: eui.Group;

        protected m_nEvtId: number = 0;

        public constructor(id: number) {
            super();
            this.m_nEvtId = id;
            this.name = WorldSearchAwardWnd.NAME;
            this.initApp("world/world_search_award.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let vo = WorldModel.getEventVoByPosId(this.m_nEvtId);
            let award = Utils.parseCommonItemJson(vo.getReward());
            for (let i = 0; i < award.length; i++) {
                let item = ComItemNew.create("name");
                NodeUtils.setScale(item, 0.8);
                item.setItemInfo(award[i].itemId, award[i].count);
                this.m_pAwardRoot.addChild(item);
            }
        }
    }
}