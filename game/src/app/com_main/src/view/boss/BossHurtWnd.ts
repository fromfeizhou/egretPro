module com_main {
    export class BossHurtWnd extends CView {
        public static NAME = "BossHurtWnd";

        public m_APopUp: com_main.APopUp;
        public m_scroller: com_main.CScroller;
        public m_hurtList: eui.List;
        public m_hurtTip: com_main.CLabel;
        public m_myHurtCoin: eui.Image;
        public m_comState: com_main.ComState;
        public m_roleName: com_main.CLabel;
        public m_hurtCount: com_main.CLabel;
        public m_hurtPower: com_main.CLabel;
        public m_rankingNum: eui.Label;

        private m_pCollection: eui.ArrayCollection;   //boss伤害榜单数据
        private m_hurtNum: number;   //自己对boss的伤害
        private hurtInfo: gameProto.IBossRankingListInfo[] = null;   //boss伤害榜单数据
        /**boss伤害排名界面 */
        public constructor(param: any) {
            super();
            this.name = BossHurtWnd.NAME;
            this.hurtInfo = param.list.bossRankingListInfo
            this.m_hurtNum = param.list.hurt;
            this.initApp("boss/BossHurtWndSkin.exml");
        }
        public onDestroy(): void {
            this.hurtInfo = null;
            super.onDestroy();
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.BOSS_HURT_RANK));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_hurtList.dataProvider = this.m_pCollection;
            this.m_hurtList.itemRenderer = BossHurtRender;
            this.m_hurtList.useVirtualLayout = true;
            this.initPanel();
        }
        /**初始化排名奖励列表 */
        private initPanel() {
            let hurtArr = [];
            if (this.hurtInfo && this.hurtInfo.length > 0) {
                for (let i = 0; i < this.hurtInfo.length; i++) {
                    let info = this.hurtInfo[i];
                    let data: BossHurtRD = { ranking: info.ranking, name: info.name, fight: info.fight, hurt: info.hurt, playerId: info.playerId, countryId: info.countryId };
                    hurtArr.push(data);
                }
                this.m_pCollection.replaceAll(hurtArr);
            }
            this.m_hurtTip.visible = false;
            let roleId = RoleData.playerId;
            if (this.hurtInfo && this.hurtInfo.length > 0) {
                for (let j = 0; j < this.hurtInfo.length; j++) {
                    let myInfo = this.hurtInfo[j];
                    let myData: BossHurtRD = { ranking: myInfo.ranking, name: myInfo.name, fight: myInfo.fight, hurt: myInfo.hurt, playerId: myInfo.playerId, countryId: myInfo.countryId };
                    let newRoleId = myInfo.playerId;
                    if (newRoleId == roleId) {
                        this.setRoleHurt(myData);
                        return;
                    } else {
                        this.setRoleHurt(null);
                    }
                }
            } else {
                this.m_hurtTip.visible = true;
                this.setRoleHurt(null);
            }
        }
        /**初始化自己的伤害信息 */
        private setRoleHurt(hurtData: BossHurtRD) {
            this.m_roleName.text = RoleData.nickName;
            this.m_hurtPower.text = GeneralModel.getGeneralTotalFight() + "";
            this.m_comState.stateId = RoleData.countryId;
            this.m_hurtCount.text = this.m_hurtNum + '';
            this.m_rankingNum.text = GCode(CLEnum.ARENA_NONE);
            this.m_myHurtCoin.visible = false;

            if (hurtData) {
                this.m_hurtCount.text = hurtData.hurt + '';
               
                RankModel.refreshRankIcon(this.m_myHurtCoin,this.m_rankingNum,hurtData.ranking);
            }
        }
    }
    export interface BossHurtRD {
        ranking: number,
        name: string,
        fight: number,
        hurt: number,
        playerId: number,
        countryId: number,
    }
    /**
    * bossItem
    * @class 
    * @extends eui.ItemRenderer
    */
    export class BossHurtRender extends eui.ItemRenderer {
        protected bossHurtCell: BossHurtCell;
        protected m_imgSelected: eui.Image;

        protected m_tData: BossHurtRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.bossHurtCell = new BossHurtCell();
            this.addChild(this.bossHurtCell);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.bossHurtCell.setItemInfo(this.m_tData.ranking, this.m_tData.name, this.m_tData.fight, this.m_tData.hurt, this.m_tData.playerId, this.m_tData.countryId);
        }
    }
}