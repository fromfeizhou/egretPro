module com_main {

	export class ResType {
		public static readonly CITY: string = "city";
		public static readonly MONSTER: string = "monster";
		public static readonly HERO: string = "hero";
		public static readonly FOOD: string = "food";
		public static readonly RES: string = "res";
	}

	/**
	 * 注：name 必须有 resType + id 构成 ，ResLayer onTouch点击选中判断使用
	 */
	export class ResSprite extends eui.Component {
		/**资源主id [建筑id,资源id（事件id）] */
		protected m_nIid: number = 0;
		protected m_nType: string = "";
		protected m_bInit: boolean = false;

		public get iid(): number {
			return this.m_nIid;
		}
		public constructor(ty: string) {
			super();
			this.m_nType = ty;

			let visivleFunc = this.$setVisible.bind(this);
			this.$setVisible = function (value: boolean) {
				if (value) {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.onCreateView();
					}
				} else {
					if (this.m_bInit) {
						this.m_bInit = false;
						this.onClearView();
					}
				}
				visivleFunc(value);
			}
		}

		public checkTouchEvent(x: number, y: number): boolean { return false; };
		public isGlow(flag: boolean) { };

		public onCreateView(): void { };
		public onClearView(): void { };

		protected onDestroy(): void {
			WorldView.delTileObject(this);
		};
		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}
	}


	// /**
	//  * 资源点战斗效果
	//  * @export
	//  * @class WorldResFire
	//  * @extends egret.DisplayObjectContainer
	//  */
	// export class WorldResFire extends egret.DisplayObjectContainer {

	// 	private m_nDirect: CSquare_Direction = CSquare_Direction.LEFT_UP;
	// 	private m_nTime: number = 0;

	// 	public constructor(dir: CSquare_Direction) {
	// 		super();
	// 		this.width = 200;
	// 		this.height = 200;
	// 		this.anchorOffsetX = this.width / 2;
	// 		this.anchorOffsetY = this.height / 2;

	// 		this.m_nDirect = dir;

	// 		this.once(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
	// 		this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
	// 	}

	// 	protected onEnter() {
	// 		this._fire_status(this.m_nDirect);
	// 	}

	// 	protected _fire_status(ty = 7) {

	// 		let fn = (t) => {
	// 			this.__create_fire(t, () => {
	// 				this.__create_fire();
	// 				this.__create_fire(t, () => {
	// 					this.__create_fire();
	// 					this.__create_fire(t, () => {
	// 						this.__create_fire();
	// 					})
	// 				})
	// 			})
	// 		}
	// 		let tf = (t1, t2) => {
	// 			fn(t1);
	// 			this.m_nTime = egret.setTimeout(() => {
	// 				fn(t2);
	// 				this.m_nTime = 0;
	// 			}, this, 500);
	// 			// this.__create_fire(t1)
	// 			// this.__create_fire(t2)
	// 		}

	// 		switch (ty) {
	// 			case CSquare_Direction.UP: {
	// 				tf(2, 3);
	// 				break;
	// 			}
	// 			case CSquare_Direction.RIGHT_UP: {
	// 				tf(6, 11);
	// 				break;
	// 			}
	// 			case CSquare_Direction.RIGHT: {
	// 				tf(5, 15);
	// 				break;
	// 			}
	// 			case CSquare_Direction.RIGHT_DOWN: {
	// 				tf(9, 19);
	// 				break;
	// 			}
	// 			case CSquare_Direction.LEFT_DOWN: {
	// 				tf(8, 18);
	// 				break;
	// 			}
	// 			case CSquare_Direction.LEFT_UP: {
	// 				tf(0, 10);
	// 				break;
	// 			}
	// 			case CSquare_Direction.DOWN: {
	// 				tf(16, 17);
	// 				break;
	// 			}
	// 			case CSquare_Direction.LEFT: {
	// 				tf(4, 14);
	// 				break;
	// 			}

	// 		}
	// 	}

	// 	private __create_fire(ty?: number, cb?: () => void, reset?: boolean) {
	// 		switch (ty) {
	// 			case 0: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_B, -185, -80, 1, 1, cb);
	// 				break;
	// 			}
	// 			case 1: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_B, -275, -95, -1, 1, cb);
	// 				break;
	// 			}
	// 			case 2: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_C, -240, -90, 1, 1, cb);
	// 				break;
	// 			}
	// 			case 3: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_C, -240, -90, -1, 1, cb);
	// 				break;
	// 			}
	// 			case 4: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_D, -205, -100, 1, 1, cb);
	// 				break;
	// 			}
	// 			case 5: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_D, -235, -80, -1, 1, cb);
	// 				break;
	// 			}
	// 			case 6: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_E, -210, -115, 1, 1, cb);
	// 				break;
	// 			}
	// 			case 7: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_E, -240, -115, -1, 1, cb);
	// 				break;
	// 			}
	// 			case 8: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_F, -190, -100, 1, 1, cb);
	// 				break;
	// 			}
	// 			case 9: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_F, -270, -100, -1, 1, cb);
	// 				break;
	// 			}
	// 			case 10: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_F, -190, -340, 1, -1, cb);
	// 				break;
	// 			}
	// 			case 11: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_F, -270, -355, -1, -1, cb);
	// 				break;
	// 			}
	// 			case 12: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_E, -210, -355, 1, -1, cb);
	// 				break;
	// 			}
	// 			case 13: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_E, -240, -355, -1, -1, cb);
	// 				break;
	// 			}
	// 			case 14: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_D, -205, -340, 1, -1, cb);
	// 				break;
	// 			}
	// 			case 15: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_D, -235, -320, -1, -1, cb);
	// 				break;
	// 			}
	// 			case 16: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_C, -230, -330, 1, -1, cb);
	// 				break;
	// 			}
	// 			case 17: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_C, -230, -330, -1, -1, cb);
	// 				break;
	// 			}
	// 			case 18: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_B, -185, -320, 1, -1, cb);
	// 				break;
	// 			}
	// 			case 19: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_B, -275, -320, -1, -1, cb);
	// 				break;
	// 			}
	// 			default: {
	// 				this.__create_effect(IETypes.EWORLD_MFire_A, 0, -50, 1, 1, cb);
	// 			}
	// 		}
	// 	}

	// 	private __create_effect(eff: string, x: number, y: number, sx: number, sy: number, cb: () => void) {
	// 		let fire = new MCDragonBones();
	// 		fire.initAsync(eff);
	// 		this.addChild(fire)
	// 		fire.x = x + 400;
	// 		fire.y = y + 400;
	// 		fire.scaleX = sx;
	// 		fire.scaleY = sy;
	// 		fire.playOnceDone(eff, () => {
	// 			if (cb)
	// 				cb.call(this)
	// 		}, this)
	// 	}

	// 	protected onDestroy() {
	// 		if (this.m_nTime > 0) {
	// 			egret.clearTimeout(this.m_nTime);
	// 			this.m_nTime = 0;
	// 		}
	// 		this.removeChildren();
	// 	}

	// }

	export class WorldNumWidget extends egret.DisplayObjectContainer {

		private m_pLbNum: eui.Label;

		public constructor(num: number) {
			super();

			this.width = 58;
			this.height = 58;

			let bg1 = new egret.Bitmap();
			Utils.addChild(this, bg1)
			RES.getResAsync("border_016_png", (k, v) => {
				bg1.texture = k;
				bg1.x = 0;
				bg1.y = 0;
			}, this);
			this.m_pLbNum = new eui.Label();
			this.m_pLbNum.text = `${num}`;
			this.m_pLbNum.textColor = 0xe7d7a7;
			this.m_pLbNum.stroke = 2;
			this.m_pLbNum.strokeColor = 0x332857;
			this.m_pLbNum.x = 22.5;
			this.m_pLbNum.y = 15;
			Utils.addChild(this, this.m_pLbNum)
		}

		public update(num: number) {
			this.m_pLbNum.text = `${num}`;
		}


	}



}