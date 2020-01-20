
//普通技能动画
//包括 雷电
module com_main {
	export class NormalSkillAnimation extends BaseSkillAnimation{

		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo,battleSceneMgr,mapView,position,true);
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
        }

	}
}