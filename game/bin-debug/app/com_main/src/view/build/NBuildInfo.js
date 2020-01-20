// module com_main {
// 	// 城池面板
// 	export class NBuildInfo extends CView {
// 		public static NAME:string = 'NBuildInfo';
// 		/// 数据
// 		private m_pInfo: any;
// 		/// 组件成员
// 		// 面板按钮
// 		public m_pBtn: com_main.ComButton;
// 		// 城池图片
// 		public m_pBuildImg: com_main.CImage;
// 		// 城池背景图片
// 		public m_pBuildTerrain: com_main.CImage;
// 		public constructor(info: any) {
// 			super();
// 			this.name = NBuildInfo.NAME;
// 			this.m_pInfo = info;
// 			this.initApp("map/build/novice_build_info.exml");
// 		}
// 		public onDestroy(): void {
// 			super.onDestroy();
//             delete this.m_pInfo;
// 			// 需要解除引用的数据
// 			this.m_pInfo = null;
// 			EventManager.removeEventListeners(this);
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			// 初始化城池信息
// 			this.initBuilInfo();
// 		}
// 		/**
//          * 初始化城池信息
//          */
// 		private initBuilInfo() {
// 			// 初始化通用信息
// 			this.initCommonBuildInfo();
//             EventManager.addTouchScaleListener(this.m_pBtn, this, this.on_click);
// 		}
// 		/**
//          * 初始化通用城池信息
//          */
// 		private initCommonBuildInfo() {
// 			let cfg = this.m_pInfo;
// 			// 设置地形图片
// 			Utils.setImageFromSource(this.m_pBuildTerrain, Utils.getBuildTerrainSource(cfg.terrain.valueOf()));
// 			// 设置城池图片
// 			this.setBuildImg(cfg.type.valueOf());
// 		}
// 		// 设置城池图片
// 		private setBuildImg(type: number) {
// 			// 设置缩放比例
// 			let scale = 1;
// 			if (type == 1) {
// 				scale = 0.6;
// 			} else if (type == 2) {
// 				scale = 0.75;
// 			} else if (type == 3) {
// 				scale = 0.9
// 			}
//             let url = Utils.getBuildTypeSource(type);
//             if(type >= 4)
//                 url = 'map_build_icon13_png';
// 			Utils.setImageFromSource(this.m_pBuildImg, url);
// 			this.m_pBuildImg.scaleX = this.m_pBuildImg.scaleY = scale;
// 			this.m_pBuildImg.anchorOffsetX = this.m_pBuildImg.width / 2;
// 			this.m_pBuildImg.anchorOffsetY = this.m_pBuildImg.height / 2;
// 			this.m_pBuildImg.x = this.m_pBuildImg.parent.width / 2 - 5;
// 			this.m_pBuildImg.y = this.m_pBuildImg.parent.height / 2;
// 		}
// 		public on_click() {
// 			//Guide.touchCall(GuideTargetType.NBuildInfoBtn);
//            // GuideProxy.send_NOVICE_BATTLE();
// 			UpManager.history(true);
// 		}
// 		public static getClass(): NBuildInfo {
// 			let obj = SceneManager.getClass(LayerEnums.POPUP, NBuildInfo.NAME);
// 			return obj;
// 		}
// 		/**获取目标 */
// 		public static getTarget(type: GuideTargetType): any {
// 			// let obj = this.getClass();
// 			// if (obj) {
// 			// 	switch (type) {
// 			// 		case GuideTargetType.NBuildInfoBtn: {//获取酒馆按钮对象
// 			// 			return obj.m_pBtn;
// 			// 		}
// 			// 	}
// 			// }
// 			return null;
// 		}
// 	}
// }
