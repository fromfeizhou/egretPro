module com_main {
	export class CCProgress extends CComponent {

		private speed: number;
		private m_pPro: CImage;
		private m_pPro1: CImage;
		private m_pIcon: CImage;

		private m_pType: string;
		private m_pConfig: any;

		private m_pValue: number;//0~100/百分比

		private m_pLabel: eui.Label;

		/**
		 * type: ProgressTypes
		 */
		public constructor(type: string) {
			super();

			this.skinName = Utils.getComSkin("progress/" + type + ".exml");

			this.m_pType = type;
			this.m_pConfig = ProgressData.loadConfig(type);
		}

		protected childrenCreated() {
			super.childrenCreated();

			// this.m_pPro.width = this.m_pConfig.min;
		}

		public onDestroy() {
			super.onDestroy();
			egret.Tween.removeTweens(this);
			if (this.m_pPro) {
				egret.Tween.removeTweens(this.m_pPro);
				this.m_pPro = null;
			}
			if (this.m_pPro1) {
				egret.Tween.removeTweens(this.m_pPro1);
				this.m_pPro1 = null;
			}
		}

		/**设置百分比 0~100 % */
		public set value(value: number) {
			let cfg = this.m_pConfig;

			value = value > 100 ? 100 : value;
			value = value < 0 ? 0 : value;

			this.m_pValue = value;

			let w = cfg.max * value / 100;

			this.m_pPro.width = w;

			if (this.m_pPro1) {
				this.m_pPro1.x = this.m_pPro.x + this.m_pPro.width;
				this.m_pPro1.visible = w > 0;
			}
		}

		public get value(): number {
			return this.m_pValue;
		}

		public set text(str: string) {
			if (this.m_pLabel)
				this.m_pLabel.text = str;
		}

		public setIconVisible(visible) {
			this.m_pIcon.visible = visible;
		}

		public playTextAnim(callback, thisArg) {
			CEffectFunc.textBounceAction(this.m_pLabel, callback, thisArg);
		}


		/**
		 * 缓动设值
		 */
		public setValueWithTween(value: number, callback?: Function, thisArg?: any) {
			let cfg = this.m_pConfig;

			value = value > 100 ? 100 : value;
			value = value < 0 ? 0 : value;

			this.m_pValue = value;

			let w = cfg.max * value / 100;

			let tweenSpeed = 1200;

			let preEffectTime = 200;

			let startWait = 300;

			let tw = egret.Tween.get(this.m_pPro);
			tw.wait(startWait);
			tw.to({ scaleY: 1.5 }, preEffectTime);
			tw.to({ scaleY: 1 }, preEffectTime);
			tw.to({ width: w }, tweenSpeed);
			tw.call(() => {
				if (callback && thisArg)
					callback.call(thisArg);
			}, this);

			if (this.m_pPro1) {
				let targetX = this.m_pPro.x + w;
				egret.Tween.get(this.m_pPro1)
					.wait(startWait)
					.wait(preEffectTime * 2)
					.to({ x: targetX }, tweenSpeed);
				this.m_pPro1.visible = w > 0;
			}
		}



		public setValueWithTween2(value: number, count: number, callback?: Function, thisArg?: any) {
			let cfg = this.m_pConfig;

			value = value > 100 ? 100 : value;
			value = value < 0 ? 0 : value;

			this.m_pValue = value;

			let w = cfg.max * value / 100;

			let tweenSpeed = 1500;

			let tw = egret.Tween.get(this.m_pPro);
			tw.to({ width: w }, tweenSpeed);
			tw.call(() => {
				if (callback && thisArg)
					callback.call(thisArg);
			}, this);

			if (this.m_pPro1) {
				let targetX = this.m_pPro.x + w;
				egret.Tween.get(this.m_pPro1).to({ x: targetX }, tweenSpeed);
				this.m_pPro1.visible = w > 0;
			}
		}

	}
}