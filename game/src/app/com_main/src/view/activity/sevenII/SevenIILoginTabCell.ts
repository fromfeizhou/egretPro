module com_main {
    export class SevenIILoginTabCell extends CComponent {

        public m_labNum: eui.Label;
        public m_ComItem: com_main.ComItemNew;
        public m_imgSelect: eui.Image;
        public m_days: number;//天数
        public m_reward: IItemInfo[];//奖励串
        public constructor(param: ActivityLoginDaysRewardConfig) {
            super();
            this.m_days = param.loginDays;
            this.m_reward = param.reward;
            this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIILoginTabCellSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.setBtnInfo();
        }
        /**选中状态 */
        public setSelect(state: boolean) {
            this.m_imgSelect.visible = state;
        }
        /**设置按钮信息 */
        public setBtnInfo() {
            let numStr = Global.getChineseNum(this.m_days);
            this.m_labNum.text = numStr;
            this.m_ComItem.setItemInfo(this.m_reward[0].itemId, this.m_reward[0].count);
            this.m_ComItem.openTips=false;
        }
    }
}