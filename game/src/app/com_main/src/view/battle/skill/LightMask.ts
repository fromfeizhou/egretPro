// TypeScript file

module com_main {
	export class LightMask extends egret.Sprite{
		
		private cirleLight:egret.Shape;
		private lightMatrix:egret.Matrix;
 
		public constructor() {
			super();

            this.width = egret.MainContext.instance.stage.stageWidth;
			this.height = egret.MainContext.instance.stage.stageHeight;

			this.blendMode = egret.BlendMode.ERASE;
			// this.graphics.beginFill(0x000000,0.7);
			// this.graphics.drawRect(0, 0, this.width, this.height);
			// this.graphics.endFill();
 
			this.lightMatrix = new egret.Matrix();
 
			this.cirleLight = new egret.Shape();
			this.cirleLight.blendMode = egret.BlendMode.ERASE;
			this.addChild(this.cirleLight);
		}
 
		//设置光圈的位置
		public setLightPos(posx:number, posy:number)
		{
			this.cirleLight.x = posx;
			this.cirleLight.y = posy;
		}
		//设置背景框的大小
		public setMaskSize(maskW:number, maskH:number)
		{
			this.graphics.clear();
			this.graphics.beginFill(0x000000,0.6);
			this.graphics.drawRect(0, 0, maskW, maskH);
			this.graphics.endFill();
		}
		//设置光圈的大小
		public setLightValue(light:number)
		{
			this.lightMatrix.createGradientBox(light*2, light*2, 0, -light, -light);
			this.cirleLight.graphics.clear();
			this.cirleLight.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xffffff, 0xd3d3d3,0x888888, 0x000000], [1,0.95, 0.2,0],[0, 50, 180, 255], this.lightMatrix);//这个渐变的参数是自己调的，可能不太理想，谁有好的参数可以留言，谢谢啦。
			this.cirleLight.graphics.drawCircle(0, 0, light);
			this.cirleLight.graphics.endFill();
		}
 
	}
}