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
    var GuideCtrl = /** @class */ (function (_super_1) {
        __extends(GuideCtrl, _super_1);
        function GuideCtrl() {
            return _super_1.call(this) || this;
        }
        GuideCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_GUIDE_SELECT_COUNTRY, GuideCtrl],
                [TASK_UI.GUIDE_DES_VIEW, GuideCtrl],
                [TASK_UI.GUIDE_DIALOG_VIEW, GuideCtrl],
                [TASK_UI.GUIDE_TOUCH_VIEW, GuideCtrl],
                [TASK_UI.GUIDE_DELAY_MASK_VIEW, GuideCtrl],
                [TASK_UI.GUIDE_INTRODUCTION_VIEW, GuideCtrl],
                [TASK_UI.GUIDE_TOUCH_TIPS, GuideCtrl],
            ];
        };
        GuideCtrl.prototype.execute = function (notification) {
            debug("GuideCtrl:execute------>>", notification);
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_GUIDE_SELECT_COUNTRY: {
                    SceneManager.openView("com_main.GuideSelectCountry", notification.getBody(), null, com_main.UpManager.STYLE_MAIN_FULL, false, false, 0, true, LayerEnums.POPUP);
                    break;
                }
                case TASK_UI.GUIDE_DES_VIEW: {
                    //新手描述
                    SceneManager.openView("com_main.GuideDesView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
                    break;
                }
                case TASK_UI.GUIDE_DIALOG_VIEW: {
                    //新手对白
                    SceneManager.openView("com_main.GuideDialogView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
                    break;
                }
                case TASK_UI.GUIDE_TOUCH_VIEW: {
                    //点击引导
                    SceneManager.openView("com_main.GuideTouchView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
                    break;
                }
                case TASK_UI.GUIDE_DELAY_MASK_VIEW: {
                    //延迟关闭
                    SceneManager.openView("com_main.GuideDelayMaskView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
                    break;
                }
                case TASK_UI.GUIDE_TOUCH_TIPS: { //任务跳转提示特效
                    var view = SceneManager.getView("com_main.GuideTouchTips", notification.getBody());
                    NodeUtils.setSize(view, { width: AGame.R.app.stageWidth, height: AGame.R.app.stageHeight });
                    SceneManager.addChild(LayerEnums.TOP, view);
                    break;
                }
                case TASK_UI.GUIDE_INTRODUCTION_VIEW: {
                    SceneManager.openView("com_main.GuideIntroductionView", notification.getBody(), ModuleEnums.GUIDE_INDRO, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    break;
                }
                default:
                    break;
            }
        };
        return GuideCtrl;
    }(AGame.Controller));
    com_main.GuideCtrl = GuideCtrl;
})(com_main || (com_main = {}));
