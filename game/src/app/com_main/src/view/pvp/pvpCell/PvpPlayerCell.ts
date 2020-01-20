module com_main {
    export class PvpPlayerCell extends CComponent {

        // private m_pPlayerIcon :CImage;

        public m_pLbPlayerName: com_main.CLabel;
        public m_pLbRank: com_main.CLabel;
        public m_pLbPower: com_main.CLabel;
        public m_pBtnChallenge: com_main.ComButton;
        public m_pHead: com_main.ComHeadItem;

        public onClickCell: (id: number, rank: number, isSweeping: boolean) => void;

        private apkRankVo: ApkRankVo;

        public constructor(data?: any) {
            super();
            this.skinName = Utils.getAppSkin("pvp_arena/PvpPlayerCellSkin.exml");
            if (data)
                this.setRankVo(data);
        }

        $onRemoveFromStage(isclear = true): void {
			EventManager.removeEventListeners(this);
            super.$onRemoveFromStage(isclear);
        }

        protected createChildren(): void {
            super.createChildren();
            this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            this.m_pBtnChallenge["sound_queren"] = SoundData.getSureSound();
            EventManager.addTouchScaleListener(this.m_pBtnChallenge, this, this.onChallenge); //發送信息
        }

        public setRankVo(data) {
            if (data) {
                this.apkRankVo = data;
                this.updateCell();
                this.visible = true;
            } else {
                this.apkRankVo = ApkRankVo.create();
                this.visible = false;
            }
        }

        private updateCell() {
            this.m_pLbPlayerName.text = this.apkRankVo.playerName;
            this.m_pLbRank.text = this.apkRankVo.rank + "";
            this.m_pLbPower.text = this.apkRankVo.force + "";
            this.m_pHead.info = { type: 1, url: this.apkRankVo.head.toString(), official: 0, vip: 0 };
            if (this.apkRankVo.rank > PvpArenaModel.Rank) {
                this.m_pBtnChallenge.currentState = "style6";
                this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));

            } else {
                this.m_pBtnChallenge.currentState = "style1";
                this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            }
        }

        //点击挑战
        private onChallenge() {

            if (this.onClickCell) {
                this.onClickCell(this.apkRankVo.playerId, this.apkRankVo.rank, this.apkRankVo.rank > PvpArenaModel.Rank);
            }
        }
    }
}