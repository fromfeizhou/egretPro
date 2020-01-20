module com_main {

	/**
	 * 联盟成员
	 */
    export class LegionRankView extends CView {
        public static NAME = 'LegionRankView';

        public m_pViewRoot: eui.Group;
        public m_pRankList: eui.List;
        public m_labPos: eui.Label;
        public m_labOnline: eui.Label;
        public m_imgRankNum: com_main.CImage;
        public m_labRankNum: com_main.CLabel;
        public m_labName: eui.Label;
        public m_imgHead: com_main.PlayerImage;
        public m_labRankState: com_main.CLabel;
        public m_comTabTopGroup: com_main.ComTabTopGroup;

        public constructor(size: ISize) {
            super();
            NodeUtils.setSize(this, size);
            this.name = LegionRankView.NAME;
            this.initApp('legion/tabView/LegionRankViewSkin.exml')
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_comTabTopGroup.initNorTabBtns([GCode(CLEnum.GUILD_TAB_ZX),GCode(CLEnum.GUILD_TAB_SJ),GCode(CLEnum.GUILD_TAB_GX),
            GCode(CLEnum.GUILD_TAB_ZL)]);
            this.m_comTabTopGroup.setChangeCallback(this.changeTag, this);


            Utils.toStageBestScale(this.m_pViewRoot);

        }

        /**刷新成员列表 */
        private initMemberList() {

        }

        /**切换项目卡 */
        private changeTag(index: number) {
        }



        /**=====================================================================================
        * 协议处理 begin
        * =====================================================================================
        */
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_GUILD_INFO
            ];
        }

        /**处理协议号事件 */
        public executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_INFO: {
                    break;
                }
            }
        }
        /**=====================================================================================
        * 协议处理 end
        * =====================================================================================
        */

    }
    export class LegionRankCell extends eui.ItemRenderer {
        public m_labPos: eui.Label;
        public m_labOnline: eui.Label;
        public m_imgRankNum: com_main.CImage;
        public m_labRankNum: com_main.CLabel;
        public m_labName: eui.Label;
        public m_imgHead: com_main.PlayerImage;

        public constructor() {
            super();
            this.touchChildren = false;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected dataChanged(): void {
            super.dataChanged();
        }


    }
}