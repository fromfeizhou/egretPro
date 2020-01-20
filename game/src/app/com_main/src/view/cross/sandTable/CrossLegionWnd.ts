module com_main {

    export class CrossLegionWnd extends CView {
        public static NAME = 'CrossLegionWnd';
        public m_apopUp: com_main.APopUp;
        public m_labLegionState: eui.Label;
        public m_ItemList: eui.List;

        private m_tCollection: eui.ArrayCollection;
        public constructor(param: any) {
            super();
            this.name = CrossLegionWnd.NAME;
            this.initApp("cross/sandTable/CrossLegionWndSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel('军团');
            this.m_tCollection = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_tCollection;
            this.m_ItemList.itemRenderer = CrossLegionCell;
            this.initView();
            this.setCrossLegionInfo();
            this.addEvent();
        }

        /**添加监听事件 */
        private addEvent() {
        }

        /**移除监听事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }
        /** */
        private initView() {
            this.m_labLegionState.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CROSS_LEGION_ARMY, this.setArmyType(), RoleData.nickName, this.setArmyState()));
        }
        /**设置军团当前状态 */
        private setArmyState() {
            let stateStr: string;
            switch (CrossModel.armyStatus) {
                case 0: {
                    stateStr = '';
                    break;
                }
                case 1: {
                    stateStr = '全军覆没';
                    break;
                }
                case 2: {
                    stateStr = '驻守城门';
                    break;
                }
                case 3: {
                    stateStr = '战斗中';
                    break;
                }
            }
            return stateStr;
        }
        /**设置军团当前状态 */
        private setArmyType() {
            switch (CrossModel.armyType) {
                case 0: {
                    return GCode(CLEnum.CROSS_JOB_KING);
                }
                case 1: {
                    return GCode(CLEnum.CROSS_JOB_L);
                }
                case 2: {
                    return GCode(CLEnum.CROSS_JOB_M);
                }
                case 3: {
                    return GCode(CLEnum.CROSS_JOB_R);
                }
            }
            return '';
        }
        /**设置军团成员信息 */
        private setCrossLegionInfo() {
            let list = CrossModel.armpGroup;
            if (list && list.length > 0) {
                let res: CrossItemRD[] = [];
                let len = list.length >= 50 ? 50 : list.length;
                for (let i = 0; i < len; i++) {
                    res.push({ rank: (i + 1), head: list[i].head, guildName: list[i].guildName, fight: list[i].fight, troopsRate: list[i].troopsRate });
                }
                this.m_tCollection.replaceAll(res);
            }
        }
    }
    export interface CrossItemRD {
        rank: number;//序号
        head: gameProto.IHeadPortrait;	//头像
        guildName: string;//帮会
        fight: number;//战力
        troopsRate: number;//兵力百分比，需要除以1万
    }
    class CrossLegionCell extends eui.ItemRenderer {
        public m_RankLab: com_main.CLabel;
        public m_pLegionName: com_main.CLabel;
        public m_pPower: com_main.CLabel;
        public m_pTroops: com_main.CLabel;
        public m_PlayerName: com_main.CLabel;
        public m_PlayerHead: com_main.ComHeadItem;

        private m_tData: com_main.CrossItemRD;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/cross/sandTable/CrossLegionCellSkin.exml");
        }
        protected childrenCreated(): void {
            super.childrenCreated();
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        public onDestroy() {
        }

        public dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;
            this.m_RankLab.text = this.m_tData.rank.toString();
            this.m_PlayerHead.info = this.m_tData.head;
            this.m_PlayerName.text = this.m_tData.head.playerName;
            this.m_pLegionName.text = this.m_tData.guildName == '' ? '无' : this.m_tData.guildName;
            this.m_pPower.text = this.m_tData.fight.toString();
            this.m_pTroops.text = Math.ceil(this.m_tData.troopsRate / 100) + '%';
        }
    }
}