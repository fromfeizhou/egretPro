module com_main {
	export class MBuildRK extends CComponent {

		public static NAME = 'MBuildRK';
		public m_pIcon: CImage;
        public m_pName:eui.Label;//名字

        private m_pPos:PropEnum = 0;
        private m_pType:number = 0;

		/**
         * 销毁方法
         */
        public onDestroy() {
            super.onDestroy();

        }

		public static create(type: number,pos:number): MBuildRK {
			var obj = new MBuildRK(type,pos);
			return obj;
		}

        public get pos():number{
            return this.m_pPos;
        }

        public get type():number{
            return this.m_pType;
        }

        public set pos(pos:number){
            this.m_pPos = pos;
        }

        public set type(type:number){
            this.m_pType = type;
        }

        public constructor(type: number,pos:number) {
            super();

			this.name = MBuildRK.NAME;

            this.m_pType = type;
            this.m_pPos = pos;

            this.skinName = Utils.getAppSkin("map/map_build_rk.exml");
            
            this.touchEnabled = false;
            this.touchChildren = false;
        }

        protected childrenCreated() {
			super.childrenCreated();
            
            this.init();
		}

		/**初始化 */
		private init() {
            this.setIcon();
            this.setName();
		}

        private setIcon(){
            this.m_pIcon.texture = Utils.getPopTitleIcon(this.m_pType);
        }

        private setName(){
            let name = '';
            switch(this.m_pType){
                case PopTitleIconType.UPGRADE:{
                    break;
                }
                case PopTitleIconType.GENERAL_INFO:{
                    break;
                }
                case PopTitleIconType.TAVERN:{
                    break;
                }
                case PopTitleIconType.BF:{
                    break;
                }
                case PopTitleIconType.SM:{
                    break;
                }
                case PopTitleIconType.LTG:{
                    break;
                }
                case PopTitleIconType.GEM:{
                    break;
                }
                case PopTitleIconType.KJ:{
                    break;
                }
                case PopTitleIconType.ZC:{
                    break;
                }
                case PopTitleIconType.RANK:{
                    break;
                }
                case PopTitleIconType.TREASRE_COM:{
                    break;
                }
                case PopTitleIconType.TREASRE_UP:{
                    break;
                }
                case PopTitleIconType.MILITARY_TASK:{
                    break;
                }
                case PopTitleIconType.BUBINGYING:{
                    break;
                }
                case PopTitleIconType.QIBINGYING:{
                    break;
                }
                case PopTitleIconType.GONGBINGYING:{
                    break;
                }
                
            }
            this.m_pName.text = name;
        }
	}
}