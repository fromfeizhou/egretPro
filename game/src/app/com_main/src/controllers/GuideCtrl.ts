module com_main {
	export class GuideCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_GUIDE_SELECT_COUNTRY, GuideCtrl],
				[TASK_UI.GUIDE_DES_VIEW, GuideCtrl],
				[TASK_UI.GUIDE_DIALOG_VIEW, GuideCtrl],
				[TASK_UI.GUIDE_TOUCH_VIEW, GuideCtrl],
				[TASK_UI.GUIDE_DELAY_MASK_VIEW, GuideCtrl],
				[TASK_UI.GUIDE_INTRODUCTION_VIEW, GuideCtrl],
				[TASK_UI.GUIDE_TOUCH_TIPS, GuideCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("GuideCtrl:execute------>>", notification);
			var name = notification.getName();
			switch (name) {
				case TASK_UI.POP_GUIDE_SELECT_COUNTRY: {
					SceneManager.openView("com_main.GuideSelectCountry", notification.getBody(), null, UpManager.STYLE_MAIN_FULL, false, false, 0, true, LayerEnums.POPUP);
					break;
				}

				case TASK_UI.GUIDE_DES_VIEW: {
					//新手描述
					SceneManager.openView("com_main.GuideDesView", notification.getBody(), null, UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
					break;
				}
				case TASK_UI.GUIDE_DIALOG_VIEW: {
					//新手对白
					SceneManager.openView("com_main.GuideDialogView", notification.getBody(), null, UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
					break;
				}
				case TASK_UI.GUIDE_TOUCH_VIEW: {
					//点击引导
					SceneManager.openView("com_main.GuideTouchView", notification.getBody(), null, UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
					break;
				}
				case TASK_UI.GUIDE_DELAY_MASK_VIEW: {
					//延迟关闭
					SceneManager.openView("com_main.GuideDelayMaskView", notification.getBody(), null, UpManager.STYLE_FULL, true, false, 0, false, LayerEnums.GUIDE);
					break;
				}

				case TASK_UI.GUIDE_TOUCH_TIPS: {	//任务跳转提示特效
					let view = SceneManager.getView("com_main.GuideTouchTips", notification.getBody());
					NodeUtils.setSize(view, { width: AGame.R.app.stageWidth, height: AGame.R.app.stageHeight });
					SceneManager.addChild(LayerEnums.TOP, view);
					break;
				}


				case TASK_UI.GUIDE_INTRODUCTION_VIEW: {
					SceneManager.openView("com_main.GuideIntroductionView", notification.getBody(), ModuleEnums.GUIDE_INDRO, UpManager.STYLE_FULL, true, false, 0, false);
					break;
				}

				default:
					break;
			}
		}
	}
}