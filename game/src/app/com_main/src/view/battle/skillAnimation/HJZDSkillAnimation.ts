
//吼叫震动
module com_main {
	export class HJZDSkillAnimation extends BaseSkillAnimation{

		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
            let targetObj:CSquare = battleSceneMgr.getDynamicObj(avo.attackData.id);
			let [x,y] = targetObj.getMapXY();
			let pos = new egret.Point(x,y);

			super(avo,battleSceneMgr,mapView,pos,true);
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
        }

	}
}