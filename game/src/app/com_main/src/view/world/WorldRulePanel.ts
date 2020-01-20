module com_main {

    /**
     * 世界规则面板
     */
    export class WorldRulePanel extends CView {

        public static readonly NAME = "WorldRulePanel";

        private m_pBtnClose:eui.Group;


        public constructor(iid?: number) {
            super();
            this.name = WorldRulePanel.NAME;
            this.initApp("world/world_rule_panel.exml");
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
            super.onDestroy();
            EventManager.removeEventListener(this.m_pBtnClose);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchScaleListener(this.m_pBtnClose, this, ()=>{
                UpManager.history();
            })
        }




    }

}