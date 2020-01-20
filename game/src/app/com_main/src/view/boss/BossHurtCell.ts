module com_main {
    export class BossHurtCell extends CComponent {

        public m_hurtNoun: eui.Image;
        public m_rankingNum: eui.Label;
        public m_comState: com_main.ComState;
        public m_roleName: com_main.CLabel;
        public m_hurtCount: com_main.CLabel;
        public m_hurtPower: com_main.CLabel;

        /**伤害榜单item */
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/boss/BossHurtCellSkin.exml");
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        protected createChildren(): void {
            super.createChildren();
        }

        /**设置伤害榜单信息 */
        public setItemInfo(ranking: number, name: string, fight: number, hurt: number, playerId: number, countryId: number) {
           
            RankModel.refreshRankIcon(this.m_hurtNoun,this.m_rankingNum,ranking);
            this.m_roleName.text = name;
            this.m_hurtPower.text = fight + '';
            this.m_hurtCount.text = hurt + '';
            this.setCountry(countryId);
        }
        /**设置国家 */
        public setCountry(countryId: number) {
            this.m_comState.stateId = countryId;
        }
    }
}