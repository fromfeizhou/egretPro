module com_main {

    /**
     * 城池详细信息
     */
    export class WorldCityInfoPanel extends CView {

        public static readonly NAME = "WorldCityInfoPanel";

        public m_pBtnClose: eui.Group;
        public m_pBtnInfo: eui.Group;
        public m_pLbType: eui.Label;
        public m_pLbName: eui.Label;
        public m_comState: com_main.ComState;
        public comHead: com_main.ComHeadItem;
        public m_pLbPlayerName: eui.Label;
        public m_pGScroller: eui.Group;
        public m_pLbContent: eui.Label;
        public m_pLbLevel: eui.Label;
        public m_pLbNum: eui.Label;


        private m_nCityId: number = 0;

        private m_pConfig: WorldMapConfig;

        public get config(): WorldMapConfig {
            return WorldModel.getCityConfig(this.m_nCityId);
        }


        public constructor(conf: WorldMapConfig) {
            super();
            this.name = WorldCityInfoPanel.NAME;
            this.m_pConfig = conf;
            this.m_nCityId = conf.id;
            this.initApp("world/world_city_info_panel.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

            }
        }

        public onDestroy(): void {
            EventManager.removeEventListener(this.m_pBtnClose);
            EventManager.removeEventListener(this.m_pBtnInfo);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            const conf = this.config, config = WorldModel.getCityBuildInfo(this.m_nCityId);
            this.m_pLbName.text = GLan(conf.name);

            // let emeny = JSON.parse(conf.combat)
            this.m_pLbNum.text = `${config.playerGarrisonCount}`
            let playInfo: gameProto.ICountryPlayerInfo = CountryModel.getCityPlayerInfoByCityId(this.m_nCityId);
            let playerHead: number = playInfo ? playInfo.roleHead : null;
            // this.m_pLbPlayerName.visible = playInfo != null
            let name: string = playInfo ? playInfo.name : GCode(CLEnum.NONE);
            this.m_pLbPlayerName.text = GCode(CLEnum.WOR_BD_TS) + name;
            // { type: info.type, url: info.url, vip: info.vip, official: info.official };
            let headInfo = playerHead ? { type: 0, url: playerHead.toString(), official: 0, vip: 0 } : null;
            this.comHead.info = headInfo;

            this.m_pLbLevel.text = `${this.m_pConfig.initCityLv = this.m_pConfig ? this.m_pConfig.initCityLv : 0}`
            this.m_pLbContent.text = GLan(conf.description);
            this.m_comState.stateId = config.country;
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => {
                UpManager.history();
            })
            EventManager.addTouchScaleListener(this.m_pBtnInfo, this, () => {
                // UpManager.history();
                // Utils.open_view(TASK_UI.POP_WORLD_RULE_PANEL);
                // WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                let conf: WorldMapConfig = C.WorldMapConfig[this.m_nCityId];
                let cityId: number = conf.type == CityType.XIANG_BIRTH ? conf.mapCity : this.m_nCityId
                WorldProxy.C2S_CITY_ITEM_INFO(cityId);
            })
            this.__init_list();
        }

        private __init_list(): void {
            if (this.config.reward) {
                let award = Utils.parseCommonItemJson(this.config.reward);
                for (let itemInfo of award) {
                    let item = ComItemNew.create('count');
                    item.scaleX = 0.8;
                    item.scaleY = 0.8;
                    this.m_pGScroller.addChild(item);
                    item.setItemInfo(itemInfo.itemId, itemInfo.count);
                }
            }
        }


    }

    export class WorldCityInfoItem extends eui.ItemRenderer {
        private m_pLbName: eui.Label;
        private m_pLbNum: eui.Label;
        private m_pItem: com_main.ComItemNew;



        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_city_info_item.exml");

        }

        public onDestroy(): void {

        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        protected dataChanged(): void {
            if (!this.data) return;
            let [_, id, num] = this.data;
            let conf = C.ItemConfig[id];
            if (!conf) return;
            this.m_pLbName.text = GLan(conf.name);
            this.m_pLbNum.text = `X ${num}`;
            this.m_pItem.setItemInfo(id);
        }
    }

}