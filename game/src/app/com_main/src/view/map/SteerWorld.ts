/**
 * Created by leowang on 2016/12/20
 */
module com {
	export module view {
		export class SteerWorld extends com.isometric.IsoWorld {
			protected _mass: number = 1.0;
			protected _maxSpeed: number = 30;
			protected _position: com.steer.Vector2D;
			protected _velocity: com.steer.Vector2D;
			private _maxForce: number = 4;
			private _steeringForce: com.steer.Vector2D;
			private _arrivalThreshold: number = 50;

			public static create() {
				return new SteerWorld();
			}

			public constructor() {
				super();
			}

			public init() {
				super.init();
				this.touchEnabled = true;
				this._position = new com.steer.Vector2D();
				this._velocity = new com.steer.Vector2D();
				this._steeringForce = new com.steer.Vector2D();
			}


			public onDestroy() {
				super.onDestroy();
				this._position = null;
				this._velocity = null;
				this._steeringForce = null;
			}

			public update() {
				this._steeringForce.truncate(this._maxForce);
				this._steeringForce = this._steeringForce.divide(this._mass);
				this._velocity = this._velocity.add(this._steeringForce);
				this._steeringForce = new com.steer.Vector2D();
				this._velocity.truncate(this._maxSpeed);
				this._position = this._position.add(this._velocity);
				this.updateX();
				this.updateY();
			}

			private updateX() {
				this.x = this.position.x;
			}

			private updateY() {
				this.y = this.position.y;
			}

			public camaraFocu(actor: egret.Sprite) {
				var acVec: com.steer.Vector2D = new com.steer.Vector2D(actor.x, actor.y);
				// var camPos: egret.Point = flash.globalToLocal(this, new egret.Point(400 - 200, 300 - 200));
				let pos = new egret.Point(this.stage.stageWidth / 2, this.stage.stageHeight / 2);
				var camPos: egret.Point = this.globalToLocal(pos.x, pos.y, pos);
				var camaraVec: com.steer.Vector2D = new com.steer.Vector2D(camPos.x, camPos.y);
				var desiredVelocity: com.steer.Vector2D = camaraVec.subtract(acVec);
				desiredVelocity.normalize();
				var dist: number = acVec.dist(camaraVec);
				if (dist > this._arrivalThreshold) {
					desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
				}
				else {
					desiredVelocity = desiredVelocity.multiply(this._maxSpeed * dist / this._arrivalThreshold);
				}
				var forse: com.steer.Vector2D = desiredVelocity.subtract(this._velocity);
				this._steeringForce = this._steeringForce.add(forse);
			}

			public set mass(value: number) {
				this._mass = value;
			}

			public get mass(): number {
				return this._mass;
			}

			public set maxSpeed(value: number) {
				this._maxSpeed = value;
			}

			public get maxSpeed(): number {
				return this._maxSpeed;
			}

			public set position(value: com.steer.Vector2D) {
				this._position = value;
				this.x = this._position.x;
				this.y = this._position.y;
			}

			public get position(): com.steer.Vector2D {
				return this._position;
			}

			public set velocity(value: com.steer.Vector2D) {
				this._velocity = value;
			}

			public get velocity(): com.steer.Vector2D {
				return this._velocity;
			}

			public set x(value: number) {
				egret.superSetter(com.view.SteerWorld, this, "x", value);
				this._position.x = this.x;
			}

			public get x(): number {
				return egret.superGetter(com.view.SteerWorld, this, "x");
			}

			public set y(value: number) {
				egret.superSetter(com.view.SteerWorld, this, "y", value);
				this._position.y = this.y;
			}

			public get y(): number {
				return egret.superGetter(com.view.SteerWorld, this, "y");
			}

			public set maxForce(value: number) {
				this._maxForce = value;
			}

			public get maxForce(): number {
				return this._maxForce;
			}

			public set arriveThreshold(value: number) {
				this._arrivalThreshold = value;
			}

			public get arriveThreshold(): number {
				return this._arrivalThreshold;
			}

			public setColor(filter: egret.ColorMatrixFilter){
				this.m_pWorld.filters = [filter];
				this.m_pBuild.filters = [filter];
			}

		}
	}
}

// flash.extendsClass("com.view.SteerWorld", "com.isometric.IsoWorld")
