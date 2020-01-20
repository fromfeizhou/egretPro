module com_main {
	/**宝石套装预览cell */
	export class ComStoneSuitCell extends CComponent {
		public m_imgIcon: com_main.CImage;  //图标
        private m_labName:eui.Label;    //名称
        
        private m_nType:PropStoneType;
        private m_bIsActivated:boolean = true;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("common/ComStoneSuitCellSkin.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

        /**设置石头类型 */
		public setPropStoneType(type:PropStoneType) {
            if(this.m_nType == type) return;
            this.m_nType = type;

            this.m_imgIcon.source = TreasureModel.getPropStoneTypeIcon(type);
            this.m_labName.text = TreasureModel.getPropStoneTypeName(type);
		}


        /**是否激活 */
        public setActivate(val:boolean){
            if(this.m_bIsActivated == val) return;
            this.m_bIsActivated = val;
            Utils.isGray(!val,this.m_imgIcon);
            if(val){
                this.m_labName.textColor = GameConfig.TextColors.fontWhite;
            }else{
                this.m_labName.textColor = GameConfig.TextColors.grayWhite;
            }
        }

	}
}