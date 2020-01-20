module com_main {

    export class SandTableCityTipsWnd extends CView {
        public static NAME = 'SandTableCityTipsWnd';

        public m_apopUp: com_main.APopUp;
        public m_pItemsRoot0: eui.Group;
        public m_pItemsRoot1: eui.Group;
        public m_pItemsRoot2: eui.Group;
        public m_labEmperor: com_main.CLabel;
        public m_labAllServer: com_main.CLabel;
        public m_labDay: com_main.CLabel;
        public m_btnSure: com_main.ComButton;
        public m_labCityLv: com_main.CLabel;
        public m_labCityZone: com_main.CLabel;


        private m_data: ISandTableCity;

        public constructor(param: any) {
            super();
            this.name = SandTableCityTipsWnd.NAME;
            this.initApp("cross/sandTable/SandTableCityTipsSkin.exml");
            this.m_data = param;
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
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEvent();
            this.initView();
        }

        /**添加监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnSure, this, this.onclickSure);
        }

        /**移除监听事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        private onclickSure() {
            UpManager.history();
        }

        /**初始化界面 */
        private initView() {
            if (isNull(this.m_data)) return;

            let cCity = C.CrossServerCityConfig[this.m_data.id];
            let tName = CrossModel.getCrossCityTypeName(cCity.cityType);
            this.m_apopUp.setTitleLabel(`【${tName}】${cCity.cityName}`);
            this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_labCityLv.textFlow = Utils.htmlParser(`<font color=#abb7d1>${GCode(CLEnum.CROSS_CITY_LEVEL)}</font><font color=#ffffff>${GCodeFromat(CLEnum.CITY_BD_TITLE, cCity.cityType)}</font>`);
            this.m_labCityZone.textFlow = Utils.htmlParser(`<font color=#abb7d1>${GCode(CLEnum.CROSS_CAPTURE_ZONE)}</font><font color=#ffffff>${CrossModel.joinServerList(this.m_data.servers)}</font>`);
            this.addRewardHead(0, this.m_labEmperor);
            this.addRewardHead(1, this.m_labAllServer);
            this.addRewardHead(2, this.m_labDay);
            // 占领服皇帝奖励
            this.addRewardItem(0, CrossRewardType.EMPEROR);
            // 占领服全服奖励
            this.addRewardItem(1, CrossRewardType.WIN_SERVER);
            // 占领服每日奖励
            this.addRewardItem(2, CrossRewardType.DAILY);
        }

        /**添加奖励头 */
        private addRewardHead(type: number, lab: com_main.CLabel) {
            if (isNull(this.m_data) || isNull(lab)) return;

            let nNum = [CLEnum.EMPEROR_REWARD, CLEnum.ALL_SERVER_REWARD, CLEnum.DAY_REWARD];
            lab.textFlow = Utils.htmlParser(`<font color=#abb7d1>${GCode(CLEnum.CAPTURE_ZONE)}</font><font color=#e7c772>${GCode(nNum[type])}</font>`);
        }

        /**添加奖励展示项 */
        private addRewardItem(idx: number, type: CrossRewardType) {
            if (isNull(this.m_data)) return;

            let cCity = C.CrossServerCityConfig[this.m_data.id];
            let rewardCfg = CrossModel.getCrossServerRewardConfig(type, cCity.cityType);
            let rewardList0 = rewardCfg.reward as IItemInfo[];
            if (isNull(rewardList0) || rewardList0.length == 0) return;
            for (let i = 0; i < rewardList0.length; i++) {
                let item = rewardList0[i];
                let itemView = ComItemNew.create("count");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(item.itemId, item.count);
                this["m_pItemsRoot" + idx].addChild(itemView);
            }
        }
    }
}