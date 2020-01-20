// module com_main {
// 	export class ActivitySelectBtn extends CComponent {
// 		//背景图片
// 		private m_pImgBj: CImage;
// 		//文字描述    
// 		private m_pImgFont: CImage;
// 		// 活动ID
// 		private m_pActivityId = 0;
// 		// 活动类型
// 		private m_pActivityType = AcViewType.NONE;
// 		public constructor(activityId: number) {
// 			super();
// 			this.skinName = Utils.getSkinName("app/activity/activity_select_btn.exml");
// 			this.m_pActivityId = activityId;
// 			this.m_pActivityType = ActivityModel.getActivityType(this.m_pActivityId);
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.touchChildren = false;
// 			this.unSelect();
// 		}
// 		/**
// 		 * 设置选中状态
// 		 */
// 		public selected() {
// 			Utils.setImageFromSource(this.m_pImgFont, this.getSelectedImg(this.m_pActivityType));
// 			Utils.setImageFromSource(this.m_pImgBj, "activity_kuang_1_png");
// 		}
// 		/**
// 		 * 设置非选中状态
// 		 */
// 		public unSelect() {
// 			Utils.setImageFromSource(this.m_pImgFont, this.getUnselectImg(this.m_pActivityType));
// 			Utils.setImageFromSource(this.m_pImgBj, "activity_kuang_0_png");
// 		}
// 		/**
// 		 * 获取活动类型
// 		 */
// 		public get activityType() {
// 			return this.m_pActivityType;
// 		}
// 		/**
// 		 * 获取活动ID
// 		 */
// 		public get activityId() {
// 			return this.m_pActivityId;
// 		}
// 		private getSelectedImg(activityType: AcViewType): string {
// 			if (activityType == AcViewType.THREE_VISITS_GEMSTONE ||
// 				activityType == AcViewType.THREE_VISITS_BOOK) {
// 				return "font_activity" + AcViewType.THREE_VISITS_BOOK + "_1_png";
// 			} else {
// 				return "font_activity" + activityType + "_1_png";
// 			}
// 		}
// 		private getUnselectImg(activityType: AcViewType): string {
// 			if (activityType == AcViewType.THREE_VISITS_GEMSTONE ||
// 				activityType == AcViewType.THREE_VISITS_BOOK) {
// 				return "font_activity" + AcViewType.THREE_VISITS_BOOK + "_0_png";
// 			} else {
// 				return "font_activity" + activityType + "_0_png";
// 			}
// 		}
// 	}
// }
