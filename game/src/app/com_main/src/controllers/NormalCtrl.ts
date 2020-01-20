module com_main {
    export class NormalCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.NOR_SOURCE_VIEW_PANEL, NormalCtrl],
                [TASK_UI.NOR_BOX_INFO_PANEL, NormalCtrl],
                [TASK_UI.NOR_REWARD__PANEL, NormalCtrl],
                [TASK_UI.PLAYER_INFO_PANEL, NormalCtrl],
                [TASK_UI.POP_COM_SPEED_UP_VIEW, NormalCtrl],
                [TASK_UI.PLAYER_LEVEL_UP_VIEW, NormalCtrl],

                [TASK_UI.Cornucopai_PANEL, NormalCtrl],
                [TASK_UI.PLAYER_SPEEDY_BUY_PANEL, NormalCtrl],
                [TASK_UI.NOR_EQUIP_FULL_VIEW, NormalCtrl],
                [TASK_UI.COM_HELP_DOC, NormalCtrl],
                [TASK_UI.COM_ACT_NOTICE, NormalCtrl],
                [TASK_UI.NOR_FIGHT_VIEW, NormalCtrl],
                [TASK_UI.LEGION_INFO_CHECK_VIEW, NormalCtrl],
                [TASK_UI.GENERAL_INFO_CHECK_VIEW, NormalCtrl],
                [TASK_UI.COM_BUY_ITEM_WND, NormalCtrl],
                [TASK_UI.TIP_CHECK_ITEM_INFO, NormalCtrl],
                [TASK_UI.SERVICE_VIP, NormalCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            let name = notification.getName();
            let body = notification.getBody();
            switch (name) {
                case TASK_UI.NOR_SOURCE_VIEW_PANEL: {
                    //道具来源
                    SceneManager.openView("com_main.ItemSourceView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_BOX_INFO_PANEL: {
                    //宝箱详细
                    SceneManager.openView("com_main.ComBoxInfoView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_REWARD__PANEL: {
                    //奖励界面
                    SceneManager.openView("com_main.ComRewardWnd", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.PLAYER_INFO_PANEL: {
                    //玩家信息
                    SceneManager.openView("com_main.PlayerInfoWnd", body, null, UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_COM_SPEED_UP_VIEW: {
                    //加速面板
                    SceneManager.openView("com_main.SpeedUpView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.PLAYER_LEVEL_UP_VIEW: {
                    //玩家升级
                    SceneManager.openView("com_main.BuildLevelUpView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.Cornucopai_PANEL: {
                    //打开聚宝盆面板
                    SceneManager.openView("com_main.Cornucopia", body, null, UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.PLAYER_SPEEDY_BUY_PANEL: {
                    //打开物品便捷界面
                    SceneManager.openView("com_main.ComSpeedyBuyView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_EQUIP_FULL_VIEW: {
                    //打开装备上限提示界面
                    SceneManager.openView("com_main.ComEquipFullTipView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.COM_HELP_DOC: {
                    //通用帮助文档
                    SceneManager.openView("com_main.ComHelpDocView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.COM_ACT_NOTICE: {
                    //活动公告
                    SceneManager.openView("com_main.ComNoticeView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                //战力变化提示
                case TASK_UI.NOR_FIGHT_VIEW: {
                    let view = SceneManager.getView("com_main.ComFightChange", body);
                    SceneManager.addChild(LayerEnums.TOP, view);
                    break;
                }
                case TASK_UI.LEGION_INFO_CHECK_VIEW: {
                    //联盟信息
                    SceneManager.openView("com_main.LegionCheckInfoWnd", body, null, UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.GENERAL_INFO_CHECK_VIEW: {
                    //武将信息
                    SceneManager.openView("com_main.GeneralCheckInfoWnd", body, null, UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.COM_BUY_ITEM_WND: {
                    //购买道具并使用
                    SceneManager.openView("com_main.ComBuyWnd", body, null, UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.TIP_CHECK_ITEM_INFO: {
                    //查看道具，装备，宝物信息通用界面
                    SceneManager.openView("com_main.TipsItemInfoWnd", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.SERVICE_VIP: {
                    //Vip客服
                    SceneManager.openView("com_main.ServiceWnd", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }

            }
        }
    }
}