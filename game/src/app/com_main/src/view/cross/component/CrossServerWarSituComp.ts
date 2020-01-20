module com_main {

    export class CrossServerWarSituComp extends CComponent {
        public m_flag: eui.Image;
        public m_lbFlag: com_main.CLabel;
        public m_areaCout: com_main.CLabel;
        public m_arrowCout: com_main.CLabel;
        public m_curTeamCout: com_main.CLabel;
        public m_surTeamCout: com_main.CLabel;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("cross/component/CrossServerWarSituCompSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        /**更新资源显示 */
        public updateUI(crossSituData: com_main.ICrossWarSitu) {
            let cityNum : number = crossSituData.isOwn ? CrossModel.getOwnCityNum() : CrossModel.getEnenyCityNum();
            this.m_areaCout.text = GCodeFromat(CLEnum.CROSS_SITU_OCCU, cityNum+1);
            let towerNum: number = crossSituData.isOwn ? CrossModel.getOwnTowerNum() : CrossModel.getEnenyTowerNum();
            this.m_arrowCout.text = GCodeFromat(CLEnum.CROSS_SITU_TOWER, towerNum);
            this.m_curTeamCout.text = GCodeFromat(CLEnum.CROSS_SITU_TEAM, crossSituData.teamNum)
            this.m_surTeamCout.visible = crossSituData.isOwn;
            if (crossSituData.isOwn) {
                this.m_surTeamCout.text = GCodeFromat(CLEnum.CROSS_SITU_SUR, CrossModel.curTroop);
                this.m_flag.source = 'zyt_vs_blue_png'
                this.m_lbFlag.strokeColor = 0x173e96;
                this.m_lbFlag.text = '我'
            } else {
                this.m_flag.source = 'zyt_vs_red_png'
                this.m_lbFlag.strokeColor = 0x961717;
                this.m_lbFlag.text = '敌'
            }
        }
    }

}