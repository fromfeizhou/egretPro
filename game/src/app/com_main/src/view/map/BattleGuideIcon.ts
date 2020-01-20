
module com_main {
	/**战斗指引图标 */
	export class BattleGuideIcon extends egret.DisplayObjectContainer {

        public static NAME = 'BattleGuideIcon';

		public m_pIcon: PImage;
		private m_pTarPos: egret.Point;

		public static create() {
			return new BattleGuideIcon();
		}

		public constructor() {
			super();
			this.touchEnabled = true;
			this.name = BattleGuideIcon.NAME;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapFunc, this);
			this.initView();
		}

		public onDestroy() {
			this.m_pTarPos = null;
			Utils.removeFromParent(this);
		}

		private initView() {
			this.m_pIcon = PImage.create();

			let texture = RES.getRes('battle_guide_png');
			if (texture) {
				this.m_pIcon.texture = texture;
				this.m_pIcon.validateNow();
			} else {
				debug("指引图标资源没找到！！");
				this.m_pIcon.texture = null;
			}

			Utils.addChild(this, this.m_pIcon);
		}

		public setTargetLocalPos(pos: egret.Point) {
			this.m_pTarPos = pos;
		}

		public setTargetGlobalPos(pos: egret.Point) {
			let radian: number = Utils.MathUtils.getRadian2(this.x, this.y, pos.x, pos.y);
			let angle: number = Utils.MathUtils.getAngle(radian);
			this.rotation = angle;
		}

		private onTapFunc(evt: egret.TouchEvent) {
			let map: BaseMap = BattleSceneMgr.getInstance().getMapView();
			if (map && this.m_pTarPos) {
				map.moveTo(this.m_pTarPos.x, this.m_pTarPos.y);
			}
		}
	}
}