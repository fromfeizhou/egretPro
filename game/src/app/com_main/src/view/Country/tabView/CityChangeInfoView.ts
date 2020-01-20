module com_main {
    export class CityChangeInfoView extends CView {
        public static NAME = 'CityChangeInfoView';

        public m_infoList: eui.List;
        public m_scroll: eui.Scroller;


        private m_tCollection: eui.ArrayCollection;

        public constructor() {
            super();
            this.name = CityChangeInfoView.NAME;
            // this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CityChangeInfoSkin.exml");
        }

        protected refreshAll(): void {
            // super.childrenCreated();
            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";

            this.m_tCollection = new eui.ArrayCollection();
            this.m_infoList.itemRenderer = CityChangeItemRender;
            this.m_infoList.dataProvider = this.m_tCollection;
            this.refreshView();
        }

        public set visible(boo: boolean) {
            if (boo && (this.skinName == '' || isNull(this.skinName))) {
                this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CityChangeInfoSkin.exml");
                this.refreshAll();
            }
            if (boo != this.visible) {
                this.$setVisible(boo);
            }
        }


        public onDestroy(): void {
            super.onDestroy();
        }

        public refreshView() {
            let res = CountryModel.getCityChangeInfo();
            this.m_tCollection.replaceAll(res);
            this.refreshScrollV();
        }

        /**滚动到最大位置 */
        protected refreshScrollV() {
            egret.callLater(() => {
                if (this.m_scroll) {
                    let scrollV = this.m_scroll.viewport.contentHeight - this.m_scroll.viewport.height;
                    scrollV = Math.max(scrollV, 0);
                    this.m_scroll.viewport.scrollV = scrollV;
                }
            }, this);
        }

    }
}