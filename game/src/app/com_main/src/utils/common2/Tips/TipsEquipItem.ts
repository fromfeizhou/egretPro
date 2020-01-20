module com_main {
    /**装备加成格子 */
    export class TipsEquipItem extends CComponent {
        public static NAME: string = 'TipsEquipItem';
       

        public m_imgBg: com_main.CImage;
        public m_imgIcon: com_main.CImage;
        public m_labName: eui.Label;
        public m_imgPro: eui.Image;
        public m_labProNum: eui.Label;

        private m_width: number=97;        //进度条宽度
        private m_nItemId: number;        //格子物品id
        private m_nPos: IEquipPos;      //格子位置
        private m_nState: number;    //提升状态
        private m_eqLvEff: MCDragonBones;

        public constructor(state?: string) {
            super();
            this.name = TipsEquipItem.NAME;
            this.skinName = Utils.getAppSkin("common/tips/TipsEquipAddItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.touchChildren = false;
            this.m_nItemId = 0;
        }

        /**位置 */
        public get pos(): IEquipPos {
            return this.m_nPos
        }

        public set pos(val: IEquipPos) {
            this.m_nPos = val;
        }

        /**设置装备信息 */
        public setItemInfo(itemId: number, level: number = 0, title: string = '', tagIndex: number = 0, color: number = GameConfig.TextColors.white) {
            this.refreshItemView(itemId);
        }

        /**刷新图标 */
        private refreshItemView(itemId: number) {
            if (this.m_nItemId == itemId) return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                let itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            } else {
                this.m_imgIcon.source = EquipModel.getEquipIconByPos(this.m_nPos);
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
        }
        /**刷装备名字 */
        private refreshEquipName() {
            if (!this.m_labName) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labName);
            } else {
                this.m_labName.text = '';
            }
        }
        /**显示进度 */
        public reStreng(level: number,maxlevel:number) {
            this.m_labProNum.text = level+'/'+maxlevel;
            let curpro=(level/maxlevel)>1?1:(level/maxlevel);
            this.m_imgPro.width=curpro*this.m_width;
        }
    }

}