// 冰雨渲染颜色技能

module com_main {
	export class BingyuColorSkillAnimation extends ShandianqiuSkillAnimation{
        public light: number = 0;
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo,battleSceneMgr,mapView,position);
            // if(this.effect){
                Tween.get(this)
                .to({lightNum: 1},100)
                .wait(this.targetObjList.length * 35 + 1000)
                .call(this.recoveryColor,this)
            // }
            
		}

        public recoveryColor(){
            Tween.removeTweens(this);
            Tween.get(this)
            .to({lightNum: 0},500)
        }

        
		public set lightNum(num: number){
            this.light = num;
            let r = -27 * num;
			let g = -27 * num;
			let b = 2 * num;
            var colorMatrix = [
                1,0,0,0,r,
                0,1,0,0,g,
                0,0,1,0,b,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            // this.mapView.filters = [fliter];

            // if(num == 0){
            //     this.mapView.filters = [];
            // }

            this.battleSceneMgr.setColor(fliter);
        }

        public get lightNum(){
            return this.light;
        }
        
		
	}
}