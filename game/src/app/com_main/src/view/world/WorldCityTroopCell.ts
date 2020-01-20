module com_main {

    /**
     * 城池驻军
     * @export
     * @class WorldBattleItem
     * @extends eui.ItemRenderer
     */
    export class WorldCityTroopCell extends eui.ItemRenderer {

        public m_pTroopName: com_main.CLabel;
        public m_pTroopCount: com_main.CLabel;
        public m_pTroop: com_main.CLabel;
        public m_pKillValue: com_main.CLabel;



        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/WorldCityTroopCellSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            // this.cacheAsBitmap = true;
        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }



        protected dataChanged() {
            let data: ITroopData = this.data;
            this.m_pTroopName.text = data.name;
            this.m_pTroop.text = `${data.count}`;
            this.m_pTroopCount.text = `${CommonUtils.numOutLenght(data.troop)}`


        }
    }

}