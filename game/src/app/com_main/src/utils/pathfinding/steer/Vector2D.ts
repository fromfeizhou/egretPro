module com {
	export module steer {
		export class Vector2D extends egret.HashObject {
			private _x:number = NaN;
			private _y:number = NaN;

			public constructor(x:number = 0,y:number = 0)
			{
				super();
				this._x = x;
				this._y = y;
			}

			public draw(graphics:egret.Graphics,color:number = 0)
			{
				graphics.lineStyle(0,color);
				graphics.moveTo(0,0);
				graphics.lineTo(this._x,this._y);
			}

			public clone():com.steer.Vector2D
			{
				return new com.steer.Vector2D(this.x,this.y);
			}

			public zero():com.steer.Vector2D
			{
				this._x = 0;
				this._y = 0;
				return this;
			}

			public isZero():boolean
			{
				return this._x == 0 && this._y == 0;
			}

			public set length(value:number)
			{
				var a:number = this.angle;
				this._x = Math.cos(a) * value;
				this._y = Math.sin(a) * value;
			}

			public get length():number
			{
				return Math.sqrt(this.lengthSQ);
			}

			public get lengthSQ():number
			{
				return this._x * this._x + this._y * this._y;
			}

			public set angle(value:number)
			{
				var len:number = this.length;
				this._x = Math.cos(value) * len;
				this._y = Math.sin(value) * len;
			}

			public get angle():number
			{
				return Math.atan2(this._y,this._x);
			}

			public normalize():com.steer.Vector2D
			{
				if(this.length == 0)
				{
					this._x = 1;
					return this;
				}
				var len:number = this.length;
				this._x /= len;
				this._y /= len;
				return this;
			}

			public truncate(max:number):com.steer.Vector2D
			{
				this.length = Math.min(max,this.length);
				return this;
			}

			public reverse():com.steer.Vector2D
			{
				this._x = -this._x;
				this._y = -this._y;
				return this;
			}

			public isNormalized():boolean
			{
				return this.length == 1.0;
			}

			public dotProd(v2:com.steer.Vector2D):number
			{
				return this._x * v2.x + this._y * v2.y;
			}

			public crossProd(v2:com.steer.Vector2D):number
			{
				return this._x * v2.y - this._y * v2.x;
			}

			public static angleBetween(v1:com.steer.Vector2D,v2:com.steer.Vector2D):number
			{
				if(<any>!v1.isNormalized())
					v1 = v1.clone().normalize();
				if(<any>!v2.isNormalized())
					v2 = v2.clone().normalize();
				return Math.acos(v1.dotProd(v2));
			}

			public sign(v2:com.steer.Vector2D):number
			{
				return this.perp.dotProd(v2) < 0?-1:1;
			}

			public get perp():com.steer.Vector2D
			{
				return new com.steer.Vector2D(-this.y,this.x);
			}

			public dist(v2:com.steer.Vector2D):number
			{
				return Math.sqrt(this.distSQ(v2));
			}

			public distSQ(v2:com.steer.Vector2D):number
			{
				var dx:number = v2.x - this.x;
				var dy:number = v2.y - this.y;
				return dx * dx + dy * dy;
			}

			public add(v2:com.steer.Vector2D):com.steer.Vector2D
			{
				return new com.steer.Vector2D(this._x + v2.x,this._y + v2.y);
			}

			public subtract(v2:com.steer.Vector2D):com.steer.Vector2D
			{
				return new com.steer.Vector2D(this._x - v2.x,this._y - v2.y);
			}

			public multiply(value:number):com.steer.Vector2D
			{
				return new com.steer.Vector2D(this._x * value,this._y * value);
			}

			public divide(value:number):com.steer.Vector2D
			{
				return new com.steer.Vector2D(this._x / value,this._y / value);
			}

			public equals(v2:com.steer.Vector2D):boolean
			{
				return this._x == v2.x && this._y == v2.y;
			}

			public set x(value:number)
			{
				this._x = value;
			}

			public get x():number
			{
				return this._x;
			}

			public set y(value:number)
			{
				this._y = value;
			}

			public get y():number
			{
				return this._y;
			}

			public toString():string
			{
				return "[Vector2D (x:" + this._x + ", y:" + this._y + ")]";
			}

		}
	}
}

