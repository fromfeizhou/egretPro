
module com_main {
    /**
     * 角色面板信息
     */
	export class RolePowerTipView extends CComponent {

		public static NAME = "RolePowerTipView";
		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("role/role_power_tip.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}
		public doAction(isShow: boolean) {
			egret.Tween.removeTweens(this);
			let tw = egret.Tween.get(this);

			if (isShow) {
				this.scaleY = 0;
				this.alpha = 0.5;
				tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.cubicOut);
			} else {
				let tw = egret.Tween.get(this);
				tw.to({ alpha: 0 }, 300, Ease.cubicOut);
			}
		}
		public onDestroy(): void {
			egret.Tween.removeTweens(this);
			super.onDestroy();
		}


	}


}