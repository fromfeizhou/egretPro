module com {
	export module steer {
		export class SteeredActor extends com.steer.Actor {
			private _maxForce:number = 12;
			private _steeringForce:com.steer.Vector2D;
			private _arrivalThreshold:number = 10;
			private _minDis:number = 20;

			public constructor(size:number)
			{
				super(size);
				size = flash.checkInt(size);
				this._steeringForce = new com.steer.Vector2D();
			}

			public set maxForce(value:number)
			{
				this._maxForce = value;
			}

			public get maxForce():number
			{
				return this._maxForce;
			}

			public set arriveThreshold(value:number)
			{
				this._arrivalThreshold = value;
			}

			public get arriveThreshold():number
			{
				return this._arrivalThreshold;
			}

			public update()
			{
				this._steeringForce.truncate(this._maxForce);
				this._steeringForce = this._steeringForce.divide(this._mass);
				this._velocity = this._velocity.add(this._steeringForce);
				this._steeringForce = new com.steer.Vector2D();
				super.update();
			}

			public arrive(target:com.steer.Vector2D):boolean
			{
				var desiredVelocity:com.steer.Vector2D = target.subtract(this.position2D);
				desiredVelocity.normalize();
				var dist:number = this.position2D.dist(target);
				if(dist > this._arrivalThreshold)
				{
					desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
				}
				else
				{
					desiredVelocity = desiredVelocity.multiply(this._maxSpeed * dist / this._arrivalThreshold);
				}
				var force:com.steer.Vector2D = desiredVelocity.subtract(this._velocity);
				this._steeringForce = this._steeringForce.add(force);
				if(dist < this._minDis)
				{
					return true;
				}
				else
				{
					return false;
				}
			}

		}
	}
}

// flash.extendsClass("com.steer.SteeredActor","com.steer.Actor")
