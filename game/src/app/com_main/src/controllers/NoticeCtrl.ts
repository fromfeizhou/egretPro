module com_main {
    export class NoticeCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.MENU_NOTICE, NoticeCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            let protocol: number = Number(notification.getName());
            let body = notification.getBody();
            switch (protocol) {
                case TASK_UI.MENU_NOTICE: {//跑马灯
                    let data = body as gameProto.IHorseLampInfo[];
                    let msgs: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                        let tmpData = data[i];
                        let msg = NoticeModel.getMsg(tmpData.id,tmpData.params);
                        if (msg) {
                            //滚动次数
                            for(let k = 0; k < tmpData.times;k++){
                                msgs.push(msg);
                            }
                            ChatModel.sendSystemMsg(msg, ChatType.SYSTEM );
                        }
                    }
                    SystemNotice.show(msgs);
                    break;
                }
                default:
                    break;
            }
        }
    }
}