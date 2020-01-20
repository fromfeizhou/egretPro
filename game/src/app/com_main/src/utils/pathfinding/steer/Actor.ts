module com {
	export module steer {
		export class Actor extends com.isometric.IsoObject {
			protected _edgeBehavior:string = com.steer.Actor.BOUNCE;
			protected _mass:number = 1.0;
			protected _maxSpeed:number = 120;
			protected _velocity:com.steer.Vector2D;
			public static WRAP:string;
			public static BOUNCE:string;

			public constructor(size:number)
			{
				super(size);
				size = flash.checkInt(size);
				this._velocity = new com.steer.Vector2D();
				this.draw();
			}

			protected draw()
			{
				this.graphics.clear();
				this.graphics.beginFill(0xFF0000);
				this.graphics.lineStyle(0);
				this.graphics.moveTo(10,0);
				this.graphics.lineTo(-10,5);
				this.graphics.lineTo(-10,-5);
				this.graphics.lineTo(10,0);
				this.graphics.endFill();
			}

			public update()
			{
				this._velocity.truncate(this._maxSpeed);
				this.position2D = this.position2D.add(this._velocity);
				this.x = this.position.x;
				this.y = this.position.y;
				if(this._velocity.x == 0 && this._velocity.y == 0)
					return ;
				var isoP:egret.Point = com.isometric.IsoUtils.isoToScreen(new com.isometric.Point3D(this._velocity.x,0,this._velocity.y));
				this.rotation = Math.atan2(isoP.y,isoP.x) * 180 / Math.PI;
			}

			private bounce()
			{
				if(this.stage != null)
				{
					if(this.position.x > this.stage.stageWidth)
					{
						this.position.x = this.stage.stageWidth;
						this.velocity.x *= -1;
					}
					else if(this.position.x < 0)
					{
						this.position.x = 0;
						this.velocity.x *= -1;
					}
					if(this.position.y > this.stage.stageHeight)
					{
						this.position.y = this.stage.stageHeight;
						this.velocity.y *= -1;
					}
					else if(this.position.y < 0)
					{
						this.position.y = 0;
						this.velocity.y *= -1;
					}
				}
			}

			private wrap()
			{
				if(this.stage != null)
				{
					if(this.position.x > this.stage.stageWidth)
						this.position.x = 0;
					if(this.position.x < 0)
						this.position.x = this.stage.stageWidth;
					if(this.position.y > this.stage.stageHeight)
						this.position.y = 0;
					if(this.position.y < 0)
						this.position.y = this.stage.stageHeight;
				}
			}

			public set edgeBehavior(value:string)
			{
				this._edgeBehavior = value;
			}

			public get edgeBehavior():string
			{
				return this._edgeBehavior;
			}

			public set mass(value:number)
			{
				this._mass = value;
			}

			public get mass():number
			{
				return this._mass;
			}

			public set maxSpeed(value:number)
			{
				this._maxSpeed = value;
			}

			public get maxSpeed():number
			{
				return this._maxSpeed;
			}

			public set velocity(value:com.steer.Vector2D)
			{
				this._velocity = value;
			}

			public get velocity():com.steer.Vector2D
			{
				return this._velocity;
			}

			public set x(value:number)
			{
				egret.superSetter(com.steer.Actor,this,"x",value);
				this._position.x = this.x;
			}

			public get x():number{
			return egret.superGetter(com.steer.Actor,this, "x");
		}
	
 			public set y(value:number)
			{
				egret.superSetter(com.steer.Actor,this,"y",value);
				this._position.y = this.y;
			}

			public get y():number{
			return egret.superGetter(com.steer.Actor,this, "y");
		}
	
 		}
	}
}

com.steer.Actor.WRAP = "wrap";
com.steer.Actor.BOUNCE = "bounce";
// flash.extendsClass("com.steer.Actor","com.isometric.IsoObject")
