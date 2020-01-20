class viewUtils {
	public static setPos(Obj: egret.DisplayObject, x: number, y: number): void {
		Obj.x = x;
		Obj.y = y;
	}

	public static setAnchorCenter(Obj:egret.DisplayObject):void{
        Obj.anchorOffsetX=Obj.width/2;
		Obj.anchorOffsetY=Obj.height/2;
	}
}