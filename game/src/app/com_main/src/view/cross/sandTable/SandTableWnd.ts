module com_main {
    export interface ISandTableCity {
        id: number;
        cityName: string;
        servers: gameProto.IWarsandServerVo[];
        isCapture?: boolean;
        atWar?: boolean;
    }

    export class SandTableWnd extends CView {
        public static NAME = 'SandTableWnd';

        public m_MainTopNew: com_main.MainTopNew;
        public m_pCell: eui.Group;
        public m_imgRule: com_main.CImage;
        public m_labRule: eui.Label;
        public m_imgRecord: com_main.CImage;
        public m_labRecord: eui.Label;
        // public m_btnWelfare: eui.Group;


        public constructor(param: any) {
            super();
            this.name = SandTableWnd.NAME;
            this.initApp("cross/sandTable/SandTableWndSkin.exml");
        }

        // protected listenerProtoNotifications(): any[] {
        //     return [
        //         ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD
        //     ];
        // }

        // protected executes(notification: AGame.INotification) {
        //     let body = notification.getBody();
        //     let protocol: number = Number(notification.getName());
        //     switch (protocol) {
        //         case ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD: {
        //             this.updateWelfare();
        //             break;
        //         }
        //     }
        // }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.SAND_TABLE_VIEW]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEvent();
            this.initView();
        }

        /**添加监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_imgRule, this, this.onclickRule);
            EventManager.addTouchScaleListener(this.m_imgRecord, this, this.onclickRecord);
         
        }

        /**移除监听事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        private onclickRule() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.CROSS_SAND_TABLE_RULE), title: GCode(CLEnum.CROSS_SAND_TABLE) });
        }

        private onclickRecord() {
            debug("点击交战记录 onclickRecord");
        }

   

        /**初始化界面 */
        private initView() {
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CROSS_SAND_TABLE));

            // 城市列表
            let cityList = CrossModel.getCrossCityList();
            for (let i = 0; i < cityList.length; i++) {
                let iData = cityList[i];
                if (isNull(iData)) continue;
                let cCity = C.CrossServerCityConfig[iData.id];
                let isWar = CrossModel.crossStatus == CrossServerState.MATCH_SUC || 
                            CrossModel.crossStatus == CrossServerState.WALL_WAR || 
                            CrossModel.crossStatus == CrossServerState.CITY_WAR;
                iData.atWar = isWar && iData.id == CrossModel.warCityId;
                let item = this.m_pCell.getElementAt(i) as SandTableCityCell;
                if (item) {
                    item.currentState = "city_" + cCity.cityType;
                    item.initData(iData);
                }
            }
            this.m_pCell.validateNow();

         
        }

      
    }
}