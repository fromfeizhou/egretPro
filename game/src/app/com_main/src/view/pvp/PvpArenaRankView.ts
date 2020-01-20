module com_main {
	/**
	 * pvp排行面板相关
	 */
    export class PvpArenaRankView extends CView {
        public static NAME = 'PvpArenaRankView';
        public readonly REQUEST_COUNT: number = 50;

        private m_pList: eui.List;
        private m_pCurRankCell: PvpArenaRankCell;
        private m_pApopUp: APopUp;

        public constructor() {
            super();
            this.name = PvpArenaRankView.NAME;
            this.initApp("pvp_arena/PvpArenaRankViewSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.APK_GET_RANK_LIST,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_RANK_LIST: {
                    this.initRankList(body)
                    break;
                }
                default: {

                }
            }
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            PvpArenaProxy.send_APK_RANK_LIST(this.REQUEST_COUNT);
            this.initView();
        }

        private initView() {
            this.m_pApopUp.setTitleLabel(GCode(CLEnum.ARENA_RANK));
            this.m_pApopUp.setPvpBgEnabel(true);
            this.m_pList.itemRenderer = PvpArenaRankCell;
            let tempData = [];



        }

        private initRankList(data: any) {
            let ApkRankVoList: ApkRankVo[] = [];
            let hasMainPlayer: boolean = false;
            if (data) {
                for (let key in data.apkRankVoList) {
                    let vo = ApkRankVo.create(data.apkRankVoList[key]);
                    vo.setReward();
                    ApkRankVoList.push(vo);
                }
            }
            let temp: ApkRankVo;
            this.m_pList.dataProvider = new eui.ArrayCollection(ApkRankVoList);


            let mainPlayerRankVo: ApkRankVo = null;
            if (data.apkRankVo)
                mainPlayerRankVo = ApkRankVo.create(data.apkRankVo);

            if (!mainPlayerRankVo) {
                // let campVo =  CampModel.getCamp(BGBType.DEF_APK);
                let heroIdList = [];
                let generalWinInfo: gameProto.IGeneralWinInfo[] = [];
                let fight = 0;
                let teamVo = TeamModel.getTeamVoByType(TeamType.DEF_APK);
                for (let i = 0; i < teamVo.teamGeneralData.length; i++) {
                    let data = teamVo.teamGeneralData[i];
                    if (data.generalId > 0) {
                        heroIdList.push(data.generalId);
                    }
                }
                // if(campVo) 
                // heroIdList = <number[]>campVo.getCamp(1);
                for (let index = 0; index < heroIdList.length; index++) {
                    //GeneralVo
                    let vo: GeneralVo = GeneralModel.getOwnGeneral(heroIdList[index]);
                    let temp = {
                        generalId: vo.generalId,
                        level: vo.level,
                        star: vo.star,
                        quality: vo.quality,
                        fight:vo.fight
                    }
                    fight += vo.fight ? vo.fight : 0;
                    generalWinInfo.push(temp);
                }

                mainPlayerRankVo = ApkRankVo.create(
                    {
                        playerId: RoleData.playerId,
                        playerName: RoleData.nickName,
                        head: RoleData.headId,
                        rank: PvpArenaModel.Rank,
                        force: fight,
                        generalWinInfo: generalWinInfo,
                        countryId: RoleData.countryId,
                    }
                );
            }
            mainPlayerRankVo.setReward();
            this.m_pCurRankCell.updateView(mainPlayerRankVo);
        }

        private updateView() {

        }
    }
}