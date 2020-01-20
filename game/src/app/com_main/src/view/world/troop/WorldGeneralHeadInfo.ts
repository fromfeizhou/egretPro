module com_main {
    export class WorldGeneralHeadInfo extends CComponent {

        public hpBg_image: eui.Image;
        public HP_image: eui.Image;
        public m_lbName: eui.Label;


        private m_curSoldierNum: number;
        private m_targerNum: number;
        private config: GeneralConfig
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("battle_new/components/general_head_info.exml");
        }

        public onDestroy() {
            super.onDestroy();
            this.removeFromParent();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
        }

        public setData(generalId: number) {
            this.config = C.GeneralConfig[generalId];
            let genVo = GeneralModel.getOwnGeneral(generalId) as GeneralVo;
            let armyType = genVo.getGeneralArmyType();
            this.initTypeIcon(armyType);
            this.setPlayerName(GLan(this.config.name))
        }

        public setPlayerName(name: string) {
            this.m_lbName.text = name;
            this.m_lbName.textColor = 0x00C6FF;
        }

        public initTypeIcon(armyType: number) {

        }

        public updateHP(hp: number) {
            let genVo = GeneralModel.getOwnGeneral(this.config.id) as GeneralVo;
            let maxHp = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
            let pecent: number = Math.min(hp / maxHp, 1);
            this.HP_image.width = Math.floor(pecent * 70)
        }

        public updateSoldierHpBar() {

        }







    }
}