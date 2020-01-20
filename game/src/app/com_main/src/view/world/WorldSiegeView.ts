module com_main {

    /**
     * 攻城战列表信息
     * @export
     * @class WorldSiegeView
     * @extends CView
     */
    export class WorldSiegeView extends CView {

        public static readonly NAME = "WorldSiegeView";

        protected m_pBtnClose: eui.Group;
        protected m_pDefeCountry: eui.Image;
        protected m_pAttkCountry: eui.Image;
        protected m_pLbAttkLess: eui.Label;
        protected m_pLbAttkDead: eui.Label;
        protected m_pLbDefeLess: eui.Label;
        protected m_pLbDefeDead: eui.Label;
        protected m_pAttkScroller: eui.Scroller;
        protected m_pAttkList: eui.List;
        protected m_pDefeScroller: eui.Scroller;
        protected m_pDefeList: eui.List;
        protected m_pGQueue: eui.Group;
        protected m_pLbQueue: eui.Label;
        protected m_pLbCity: eui.Label;
        protected m_pLbDefeCountryName: eui.Label;

        protected m_pAttkCollection: eui.ArrayCollection;
        protected m_pDefeCollection: eui.ArrayCollection;

        protected m_nCityId: number = 0;

        public constructor(body: any) { // {cid:number}
            super();
            this.name = WorldSiegeView.NAME;
            this.m_nCityId = body.cid;
            // WorldModel.initSiegeData(null);
            this.initApp("world/world_siege_view.exml");
            WorldProxy.send_C2S_CITY_WAR_CONFRONTATION_LIST(WorldModel.getCityWarInfo().cityId);
        }

        public onDestroy(): void {

            super.onDestroy();
        }


        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST,
                // ProtoDef.WORLD_SIEGE_UPDATE,
                // ProtoDef.WORLD_SIEGE_RESULT,
                // ProtoDef.WORLD_SIEGE_UPDATE_BATTLE,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST: {
                    this.__init_battle();
                }

                // case ProtoDef.CITY_BATTLE_UPDATE_CITY: {
                //     const config = WorldModel.getCityBuildInfo(this.m_nCityId);
                //     if (config.atkCountry == 0)
                //         UpManager.close();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_UPDATE: {
                //     this.__init_battle();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_RESULT: {
                //     this.__init_battle();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_UPDATE_BATTLE: {
                //     error("==========WORLD_SIEGE_RESULT=======", body);
                //     this.__init_battle();
                //     break;
                // }
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            const config = C.WorldMapConfig[this.m_nCityId];
            if(config){
                this.m_pLbCity.text = GLan(config.name);
            }else{
                let cId = CrossModel.getCIdByWarAreaId(this.m_nCityId);
                if(cId){
                    this.m_pLbCity.text = GLan(C.CrossServerAreaConfig[cId].name);
                }
            }
            

            this.m_pAttkCollection = new eui.ArrayCollection();
            this.m_pAttkList.dataProvider = this.m_pAttkCollection;
            this.m_pAttkList.itemRenderer = WorldSiegeItem;
            this.m_pAttkList.useVirtualLayout = true;

            this.m_pDefeCollection = new eui.ArrayCollection();
            this.m_pDefeList.dataProvider = this.m_pDefeCollection;
            this.m_pDefeList.itemRenderer = WorldSiegeItem;
            this.m_pDefeList.useVirtualLayout = true;

            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => {
                UpManager.history();
                this.onDestroy();
            })

            Promise.all([
                this.__init_country(),
                this.__init_battle()
            ]);
        }

        private async __init_country() {
            let v = false;
            const city = WorldModel.getCityBuildInfo(this.m_nCityId);
            if(city){  
                if (city.country > 0 && city.country <= 4) {
                    this.m_pDefeCountry.source = Utils.getCountyBigiFlagById(city.country);
                    // if (city.country == 4) {
                    //     let conf = WorldModel.getCityConfig(city.id);
                    //     this.m_pLbDefeCountryName.text = GLan(conf.banner);
                    //     v = true;
                    // }
                }
                if (city.atkCountry > 0) {
                    this.m_pAttkCountry.source = Utils.getCountyBigiFlagById(city.atkCountry);
                }
                this.m_pLbDefeCountryName.visible = v;
            }else{
                this.m_pDefeCountry.visible = false;
                this.m_pAttkCountry.visible = false;
            }
        }

        private async __init_battle() {
            // const city = WorldModel.getSiegeCity(this.m_nCityId);

            let siegeList = WorldModel.getSiegeList();

            if (!siegeList) return;
            this.m_pLbAttkLess.text = `${siegeList.attData.surplusSoldiersCount}`;   //攻方剩余部队
            this.m_pLbAttkDead.text = `${siegeList.attData.lossSoldiersCount}`;          //攻方死亡数量
            this.m_pLbDefeLess.text = `${siegeList.defData.surplusSoldiersCount}`;   //防守方剩余部队
            this.m_pLbDefeDead.text = `${siegeList.defData.lossSoldiersCount}`;          //防守方死亡数量


            let atkList = [], defList = [], index = 1, type = 0;
            for (let id of siegeList.attPlayerWarData) {
                atkList.push({ index, id });
                index++;
            }
            index = 1, type = 1;
            for (let id of siegeList.defPlayerWarData) {
                defList.push({ index, id })
                index++;
            }

            this.m_pAttkCollection.replaceAll(atkList);
            this.m_pDefeCollection.replaceAll(defList);

            // let [gids, indx] = WorldModel.getSiegeSelf(this.m_nCityId);
            let order = siegeList.order;
            if (!order) {
                this.m_pGQueue.visible = false;
            } else {
                this.m_pGQueue.visible = true;
                this.m_pLbQueue.text = "" + order;
            }

        }

    }

    /**
     * 攻城信息列表Item
     * @export
     * @class WorldSiegeItem
     * @extends eui.ItemRenderer
     */
    export class WorldSiegeItem extends eui.ItemRenderer {

        public m_pPanel: com_main.CImage;
        public m_pLbOrder: eui.Label;
        public m_comState: com_main.ComState;
        public m_pLbNum: eui.Label;
        public m_pHeroHead: com_main.GeneralHeadRender;
        public m_pLbName: eui.Label;
        public m_pLbStatus: eui.Label;
        public m_labelFight: eui.BitmapLabel;
        public m_pBthSee: eui.Group;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_siege_item.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.cacheAsBitmap = true;

        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pBthSee.visible = true;
            this.m_comState.setDefautName(GCode(CLEnum.STATE_QUN));

        }

        protected dataChanged() {
            EventManager.removeEventListener(this.m_pBthSee)
            const data = this.data;
            this.m_pLbOrder.text = `${data.index}`;
            // const event = WorldModel.getSiegeEvent(data.id, data.type);
            // if (!event) return;
            let playerWarData: gameProto.IPlayerWarData = data.id;

            this.m_pLbNum.text = `${playerWarData.teamGeneral}`;
            this.m_comState.stateId = playerWarData.countryId;

            this.m_pHeroHead.setGenId(playerWarData.generalId);
            const bBattle = playerWarData.battleId > 0;
            Utils.isGray(!bBattle, this.m_pBthSee)

            if (bBattle) {
                this.m_pLbStatus.text = GCode(CLEnum.WOR_GZ_JZZ);
                this.m_pLbStatus.textColor = 0xFF0000;
                EventManager.addTouchScaleListener(this.m_pBthSee, this, () => {
                    // SceneManager.enterScene(SceneEnums.BATTLE_MAP, event.battleId,true);
                    BattleProxy.send_C2S_WAR_REENTRY_BATTLE(playerWarData.battleId);
                    WorldModel.setCurWatchTeamId(playerWarData.playerId, playerWarData.teamId);

                    UpManager.history();
                });
            } else {
                this.m_pLbStatus.text = GCode(CLEnum.WOR_GZ_LDZ);
                this.m_pLbStatus.textColor = 0x8a8a9e;
            }
            this.m_labelFight.text = `${playerWarData.teamForce}`;

            // if (event.cpId > 0) {
            //     const pConfig = C.CheckPointConfig[event.cpId]
            //     this.m_pLbName.text = `${GLan(pConfig.name)}`;
            //     // this.m_pLbName.text = `${event.id}`;
            // } else {
            this.m_pLbName.text = `${playerWarData.userName}`;
            // }

        }

    }

    export class WorldSiegeTime extends CComponent {

        protected m_pBtnAttack: eui.Group;
        protected m_pLbTime: eui.Label;
        protected m_nCityId: number = 0;

        protected m_nDt: number = 0;

        public static create(cid: number) {
            let obj = ObjectPool.pop(WorldSiegeTime, "WorldSiegeTime", cid);
            return obj;
        }

        /**对象池回收 */
        public onPoolClear() {
            this.setSkin(null)
        }

        public onDestroy() {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            super.onDestroy();
        }

        $onRemoveFromStage(): void {
            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.$update, this)
            super.$onRemoveFromStage(false);
        }

        public constructor(cid: number) {
            super();
            this.skinName = Utils.getSkinName("app/world/world_siege_time.exml");
            this.init(cid)
        }

        public init(cid: number) {
            NodeUtils.reset(this);
            this.m_nCityId = cid;

            const dt = WorldModel.checkSiegeTimeByCityid(this.m_nCityId);
            if (dt <= 0) {
                this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "base" : "xBase"
            } else {
                this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "time" : "xTime"
                this.m_nDt = dt;
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(dt, 1);
                Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.$update, this, () => {
                    this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "base" : "xBase"
                });
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        public checkTouchEvent(x: number, y: number): boolean {
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                // const data = WorldModel.getSiegeAll(this.m_nCityId);
                // if (data) {
                //     const [hero, dt] = data;
                //     if (hero)  {
                //         if (hero.battleId == 0)
                //             SceneManager.enterScene(SceneEnums.WAIT_BATTLE_MAP,{generalList: (<ItfSiegeBase>hero).gids, cityId: this.m_nCityId});
                //         else
                //             SceneManager.enterScene(SceneEnums.BATTLE_MAP, hero);
                //     }
                //     return true;
                // }
                // Utils.open_view(TASK_UI.POP_WORLD_SIEGE_VIEW, {cid: this.m_nCityId})


                WorldProxy.send_C2S_CITY_WAR_GO(this.m_nCityId);

                return true;
            }
            return false;
        }

        protected $update() {

            --this.m_nDt;
            if (this.m_nDt <= 0) {

                return;
            }
            if (!this.m_pLbTime) return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);;
        }
    }
}