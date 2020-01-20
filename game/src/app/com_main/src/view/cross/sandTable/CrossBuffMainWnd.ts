module com_main {

    export class CrossBuffMainWnd extends CView {
        public static NAME = 'CrossBuffMainWnd';

        public m_apopUp: com_main.APopUp;
        public m_pPerson: com_main.CrossBuffCell;
        public m_pServer: com_main.CrossBuffCell;
        public m_labDesc: eui.Label;


        public constructor(param: any) {
            super();
            this.name = CrossBuffMainWnd.NAME;
            this.initApp("cross/sandTable/CrossBuffViewSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO: {
                    let nType = body as number;
                    if (nType == 1) {
                        this.m_pPerson.refreshView();
                    } else if (nType == 2) {
                        this.m_pServer.refreshView();
                    }
                    break;
                }
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

        }

        /**移除监听事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        /**初始化界面 */
        private initView() {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.CROSS_BUFF_TITLE));
            this.m_labDesc.textFlow = Utils.htmlParser(GCode(CLEnum.CROSS_BUFF_DESC));

            type PropType = { type: number, level: number, icon: string, name: string, cost: number, desc: string };
            //let p_prop1 = {} as PropType;
            let p_prop1: PropType = {
                type: 1, level: 1, icon: "cityBuff_11", name: "个人BUFF", cost: 100,
                desc: GCodeFromat(CLEnum.CROSS_BUFF_EFFECT1, "攻击", "20%")
            };
            let p_prop2: PropType = {
                type: 2, level: 12, icon: "cityBuff_12", name: "全服BUFF", cost: 200,
                desc: GCodeFromat(CLEnum.CROSS_BUFF_EFFECT2, "攻击", "30%")
            };
            this.m_pPerson.initViewData(p_prop1);
            this.m_pServer.initViewData(p_prop2);
        }
    }
}