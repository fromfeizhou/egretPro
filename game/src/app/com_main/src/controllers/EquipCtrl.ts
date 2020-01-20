module com_main {
    export class EquipCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.POP_EQUIP_MAIN_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_SEL_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_ADD_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_WEAR_INFO_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_RECYCLE, EquipCtrl],
            ];
        }
        public execute(notification: AGame.INotification) {
            let name = notification.getName();
            let param = notification.getBody();
            switch (name) {
                case TASK_UI.POP_EQUIP_MAIN_WND: {
                    SceneManager.openView("com_main.EquipMainWnd", param, null, UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.POP_EQUIP_SEL_WND: {
                    SceneManager.openView("com_main.EquipSelectedWnd", param, null, UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_ADD_WND: {
                    SceneManager.openView("com_main.TipsEquipAddWnd", param, null, UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_WEAR_INFO_WND: {
                    SceneManager.openView("com_main.EquipWearInfoWnd", param, null, UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_RECYCLE: {
                    SceneManager.openView("com_main.EquipRecycle", param, null, UpManager.STYLE_UP);
                    break;
                }
            }
        }
    }
}