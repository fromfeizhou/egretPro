module com_main {

    /**
     * 国战信息排行
     */
    export class WorldSiegeRankView extends CView {

        public static readonly NAME = "WorldSiegeRankView";

        protected m_pBtnClose: eui.Group;
        protected m_pPlayer: com_main.WorldSiegeRankBox;
        protected m_pAlly: com_main.WorldSiegeRankBox;

        protected m_nCityId: number = 0;

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CITY_WAR_DMG_RANK,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_WAR_DMG_RANK:  {
                    this.m_pPlayer.initList();
                    this.m_pAlly.initList();
                    break;
                }
            }
        }

        public constructor(data: any) {
            super();
            this.name = WorldSiegeRankView.NAME;
            this.m_nCityId = data.cid;
            this.initApp("world/world_siege_rank_view.exml");

            WorldProxy.send_C2S_CITY_WAR_DMG_RANK(this.m_nCityId);

            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => { //关闭
                UpManager.history();
            })
        }

    }

    export class WorldSiegeRankBox extends CComponent {

        protected m_pTitle: eui.Image;
        protected m_pScroller: eui.Scroller;
        protected m_pList: eui.List;
        protected m_pCollection: eui.ArrayCollection;
        protected m_pType: EumSiegeKillType = 0;

        public set siegeType(type: EumSiegeKillType) {
            this.m_pType = type;
        }

        public set title(txt: string) {
            let t = txt.split(","), i = 1;
            for (let o of t) {
                this[`m_pLbTxt${i}`].text = o;
                i++;
            }
        }

        public set titleSource(source: string) {
            this.m_pTitle.source = source;
        }

        public constructor() {
            super();

            this.skinName = Utils.getSkinName("app/world/world_siege_rank_box.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldSiegeRankItem;
            this.m_pList.useVirtualLayout = true;

        }

        public initList() {
            let data = WorldModel.sortSiegeKill(this.m_pType)
                , arr = []
                , type = this.m_pType
                , index = 1;
            for (let id of data) {
                arr.push({ id, type, index })
                index++;
            }
            this.m_pCollection.replaceAll(arr);
        }

    }

    class WorldSiegeRankItem extends eui.ItemRenderer {
        public m_pNum: eui.Image;
        public m_comState: com_main.ComState;
        public m_pLbName: eui.Label;
        public m_pLbAttack: eui.Label;
        public m_pLbNum: eui.Label;


        protected m_nIid: number = 0;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_siege_rank_item.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        protected dataChanged() {
            if (this.m_nIid == this.data.id && !this.data.update) return;
            this.m_nIid = this.data.id;
            const data = WorldModel.getSiegeKill(this.data.type, this.m_nIid);
            if (!data) return;
            const index = this.data.index;
           
            RankModel.refreshRankIcon(this.m_pNum,this.m_pLbNum,index);

            this.m_pLbName.text = data.playerName;
            this.m_pLbAttack.text = CommonUtils.numOutLenght(data.num) //'' + data.num;

            this.m_comState.stateId = data.countryId;
        }

    }
}