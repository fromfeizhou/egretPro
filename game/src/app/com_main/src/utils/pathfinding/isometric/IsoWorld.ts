module com {
	export module isometric {
		export class IsoWorld extends egret.Sprite implements IFObject {
			/**参照层 */
			private m_pReference: egret.DisplayObjectContainer;
			/**建筑层 */
			protected m_pBuild: egret.DisplayObjectContainer;
			/**特效层 */
			private m_pEffect: egret.DisplayObjectContainer;
			/**行走层 */
			protected m_pWorld: egret.DisplayObjectContainer;
			/**悬浮层 */
			private m_pSuspension: egret.DisplayObjectContainer;
			/**飘血 */
			private m_p_blood: egret.DisplayObjectContainer;

			// private _objects: Array<any>;

			public constructor() {
				super();
				this.init();
			}

			public init() {
				var _self__: any = this;
				// this._objects = new Array();

				this.m_pReference = new egret.DisplayObjectContainer();
				this.m_pReference.cacheAsBitmap = true;
				Utils.addChild(_self__, this.m_pReference);
				this.m_pBuild = new egret.DisplayObjectContainer();
				Utils.addChild(_self__, this.m_pBuild);
				this.m_pEffect = new egret.DisplayObjectContainer();
				Utils.addChild(_self__, this.m_pEffect);
				this.m_pWorld = new egret.DisplayObjectContainer();
				Utils.addChild(_self__, this.m_pWorld);
				this.m_pSuspension = new egret.DisplayObjectContainer();
				Utils.addChild(_self__, this.m_pSuspension);
				this.m_p_blood = new egret.DisplayObjectContainer();
				Utils.addChild(_self__, this.m_p_blood);
			}

			public onDestroy() {
				Utils.removeAllChild(this.m_pReference);
				Utils.removeAllChild(this.m_pBuild);
				Utils.removeAllChild(this.m_pEffect);
				Utils.removeAllChild(this.m_pWorld);
				Utils.removeAllChild(this.m_pSuspension);
				Utils.removeAllChild(this.m_p_blood);

				this.m_pReference = null;
				this.m_pBuild = null;
				this.m_pEffect = null;
				this.m_pWorld = null;
				this.m_pSuspension = null;
				this.m_p_blood = null;

				Utils.removeAllChild(this);
				Utils.removeFromParent(this);
			}

			public getWorld() {
				return this.m_pWorld;
			}

			public addChildToBlood(child: egret.DisplayObject, index?: number){
				Utils.addChildAt(this.m_p_blood, child, index);
			}

			public addChildToSuspension(child: egret.DisplayObject, index?: number) {
				Utils.addChildAt(this.m_pSuspension, child, index);
			}

			public removeAllChildToSuspension() {
				Utils.removeAllChild(this.m_pSuspension);
			}

			public addChildToWorld(child: egret.DisplayObject, index?: number) {
				Utils.addChildAt(this.m_pWorld, child, index);
				// this._world.addChildAt(child, index);//需要派发事件
				// this._objects.push(child);
				this.sortUnit();
			}

			public removeAllChildToWorld() {
				Utils.removeAllChild(this.m_pWorld);
			}

			public addChildToEffect(child: egret.DisplayObject, index?: number) {
				Utils.addChildAt(this.m_pEffect, child, index);
			}

			public removeAllChildToEffect() {
				Utils.removeAllChild(this.m_pEffect);
			}

			public addChildToBuild(child: egret.DisplayObject, index?: number) {
				Utils.addChildAt(this.m_pBuild, child, index);
			}

			public removeAllChildToBuild() {
				Utils.removeAllChild(this.m_pBuild);
			}

			public addChildToReference(child: egret.DisplayObject, index?: number) {
				Utils.addChildAt(this.m_pReference, child, index);
			}

			public removeAllChildToReference() {
				Utils.removeAllChild(this.m_pReference);
			}

			public setReferenceScale(x: number, y: number) {
				this.m_pReference.scaleX = x;
				this.m_pReference.scaleY = y;
			}

			public drawRect() {
				Utils.DisplayUtils.drawRect(this);
			}

			public sortUnit() {
				Utils.sortChildrens(this.m_pWorld);
			}

			// public canMove(obj: com.isometric.IsoObject): boolean {
			// 	var rect: egret.Rectangle = <any>obj.rect;
			// 	rect.offset(obj.vx, obj.vz);
			// 	for (var i: number = flash.checkInt(0); i < this._objects.length; i++) {
			// 		var objB: com.isometric.IsoObject = flash.As3As(this._objects[i], com.isometric.IsoObject);
			// 		if (obj != objB && <any>!objB.walkable && rect.intersects(objB.rect)) {
			// 			return false;
			// 		}
			// 	}
			// 	return true;
			// }
		}
	}
}

// flash.extendsClass("com.isometric.IsoWorld", "egret.Sprite")
