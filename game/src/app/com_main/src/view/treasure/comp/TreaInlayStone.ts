module com_main {
	/**
	 * 道具
	 */
    export class TreaInlayStone extends CComponent {
        public m_groupBase: eui.Group;
        public m_imgBg: com_main.CImage;
        public m_labPos: eui.Label;
        public m_imgIcon: com_main.CImage;

        private m_pItemId;  //宝石id;
        public holeId: number;   //孔位 镶嵌使用
        private m_bIsLocked;    //是否上锁

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("treasure/comp/TreaInlayStoneSkin.exml");
            this.m_bIsLocked = false;
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        /**设置镶嵌孔信息uuId */
        public setStoneInfo(itemId: number, holeId: number) {
            this.itemId = itemId;
            this.holeId = holeId;
            this.m_labPos.text = (holeId + 1).toString()
        }

        /**设置宝物id */
        public set itemId(val: number) {
            if (this.m_pItemId == val) return;
            this.m_pItemId = val;
            if (!this.m_bIsLocked) this.refreshView();
        }
        public get itemId(): number {
            return this.m_pItemId;
        }


        /**设置孔位状态 */
        public setLockedState(locked: boolean) {
            if (this.m_bIsLocked == locked) return;
            this.m_bIsLocked = locked;
            if (locked) {
                this.currentState = "lock";
                this.m_imgBg.source = "Qualitykuang2_png";
                this.commitProperties();
            } else {
                this.refreshView();
            }
        }

        /**是否上锁 */
        public isInLocked() {
            return this.m_bIsLocked;
        }

        /**刷新显示 */
        private refreshView(): void {
            if (this.m_pItemId && this.m_pItemId > 0) {
                this.currentState = "common";
                this.commitProperties();
                this.refreshIcon()
                this.refreshQualityBg();
            } else {
                this.currentState = "empty";
                this.commitProperties();
                this.m_imgBg.source = "Qualitykuang2_png";

            }
        }

        /**刷新图标 */
        private refreshIcon() {
            let image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        }

        /**刷新品质框 */
        private refreshQualityBg() {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        }


    }
}