module com_main {

    export class CrossServerWarNameComp extends CComponent {
        public m_title: eui.Group;
        public m_flagImg: eui.Image;
        public m_faction: eui.Label;
        public m_cityName: eui.Label;

        private m_buildId: number = 0;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("cross/component/CrossServerWarNameCompSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        public set bId(id: number) {
            this.m_buildId = id;
            this.refreshCityName();
            this.refreshCityState();
        }
        public refreshCityName() {
            this.m_cityName.text = GLan(C.CrossServerAreaConfig[this.m_buildId].name);
        }

        public refreshCityState() {
            let data = CrossModel.getCityInfoById(this.m_buildId);
            if (data) {
                let faction = data.getFaction();
                if (faction == CSBFaction.EMENY) {
                    this.m_flagImg.source = 'zyt_vs_red_png'
                    this.m_faction.strokeColor = 0x961717;
                    this.m_faction.text = '敌'
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                } else if (faction == CSBFaction.OUR) {
                    this.m_flagImg.source = 'zyt_vs_blue_png'
                    this.m_faction.strokeColor = 0x173e96;
                    this.m_faction.text = '我'
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                } else if (faction == CSBFaction.NONE){
                    this.m_flagImg.visible = false;
                    this.m_faction.visible = false;
                }
            }
        }

    }

}