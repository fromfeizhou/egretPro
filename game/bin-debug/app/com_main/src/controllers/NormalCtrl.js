var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var NormalCtrl = /** @class */ (function (_super_1) {
        __extends(NormalCtrl, _super_1);
        function NormalCtrl() {
            return _super_1.call(this) || this;
        }
        NormalCtrl.prototype.listenerRouterNotifications = function () {
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
        };
        NormalCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.NOR_SOURCE_VIEW_PANEL: {
                    //道具来源
                    SceneManager.openView("com_main.ItemSourceView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_BOX_INFO_PANEL: {
                    //宝箱详细
                    SceneManager.openView("com_main.ComBoxInfoView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_REWARD__PANEL: {
                    //奖励界面
                    SceneManager.openView("com_main.ComRewardWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.PLAYER_INFO_PANEL: {
                    //玩家信息
                    SceneManager.openView("com_main.PlayerInfoWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_COM_SPEED_UP_VIEW: {
                    //加速面板
                    SceneManager.openView("com_main.SpeedUpView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.PLAYER_LEVEL_UP_VIEW: {
                    //玩家升级
                    SceneManager.openView("com_main.BuildLevelUpView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.Cornucopai_PANEL: {
                    //打开聚宝盆面板
                    SceneManager.openView("com_main.Cornucopia", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.PLAYER_SPEEDY_BUY_PANEL: {
                    //打开物品便捷界面
                    SceneManager.openView("com_main.ComSpeedyBuyView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.NOR_EQUIP_FULL_VIEW: {
                    //打开装备上限提示界面
                    SceneManager.openView("com_main.ComEquipFullTipView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.COM_HELP_DOC: {
                    //通用帮助文档
                    SceneManager.openView("com_main.ComHelpDocView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.COM_ACT_NOTICE: {
                    //活动公告
                    SceneManager.openView("com_main.ComNoticeView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                //战力变化提示
                case TASK_UI.NOR_FIGHT_VIEW: {
                    var view = SceneManager.getView("com_main.ComFightChange", body);
                    SceneManager.addChild(LayerEnums.TOP, view);
                    break;
                }
                case TASK_UI.LEGION_INFO_CHECK_VIEW: {
                    //联盟信息
                    SceneManager.openView("com_main.LegionCheckInfoWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.GENERAL_INFO_CHECK_VIEW: {
                    //武将信息
                    SceneManager.openView("com_main.GeneralCheckInfoWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.COM_BUY_ITEM_WND: {
                    //购买道具并使用
                    SceneManager.openView("com_main.ComBuyWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.TIP_CHECK_ITEM_INFO: {
                    //查看道具，装备，宝物信息通用界面
                    SceneManager.openView("com_main.TipsItemInfoWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.SERVICE_VIP: {
                    //Vip客服
                    SceneManager.openView("com_main.ServiceWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        };
        return NormalCtrl;
    }(AGame.Controller));
    com_main.NormalCtrl = NormalCtrl;
})(com_main || (com_main = {}));
