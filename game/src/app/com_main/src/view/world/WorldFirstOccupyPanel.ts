module com_main {
	/**
	 * 首占奖励面板
	 */
    export class WorldFirstOccupyPanel extends CView {
        public static NAME = 'WorldFirstOccupyPanel';
        public m_genCard: com_main.ComGenCard;
        public m_gold: com_main.CImage;
        public m_name: eui.Label;


        private m_cityId: number;
        public constructor(cityId: number) {
            super();
            this.m_cityId = cityId;
            this.name = WorldFirstOccupyPanel.NAME;
            this.initApp("world/WorldFirstOccupyPanelSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

            }
        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            if (this.m_genCard)
                egret.Tween.removeTweens(this.m_genCard);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.initEvent();
            this.updateUI();
        }
        public updateUI() {
            let worldCityMapCfg: WorldMapConfig = C.WorldMapConfig[this.m_cityId];
            let genId: number = WorldModel.getGenIdByWorldCfg(worldCityMapCfg);
            let cfg = C.GeneralConfig[genId];
            if (!cfg) return;
            let name = GLan(cfg.name);
            this.m_name.text = name;
            this.m_name.textColor = GeneralModel.getGeneralQualityColor(cfg.qualityLevel);
            let gold: number = Number(worldCityMapCfg.firstreward.split("_")[1])
            this.m_gold.source = `world_${gold}_png`
            this.createAni(genId);
        }
        public createAni(genId: number) {
            this.m_genCard.setInfo(genId, true);
        }
        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPanel, this);
        }
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }
        /**点击界面的时候关闭 */
        public onTouchPanel(pvt: egret.TouchEvent) {
            UpManager.history();
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }

}