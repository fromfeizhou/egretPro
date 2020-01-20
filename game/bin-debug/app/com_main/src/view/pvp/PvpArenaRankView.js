var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * pvp排行面板相关
     */
    var PvpArenaRankView = /** @class */ (function (_super_1) {
        __extends(PvpArenaRankView, _super_1);
        function PvpArenaRankView() {
            var _this = _super_1.call(this) || this;
            _this.REQUEST_COUNT = 50;
            _this.name = PvpArenaRankView.NAME;
            _this.initApp("pvp_arena/PvpArenaRankViewSkin.exml");
            return _this;
        }
        PvpArenaRankView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.APK_GET_RANK_LIST,
            ];
        };
        /**处理协议号事件 */
        PvpArenaRankView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_RANK_LIST: {
                    this.initRankList(body);
                    break;
                }
                default: {
                }
            }
        };
        PvpArenaRankView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PvpArenaRankView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            PvpArenaProxy.send_APK_RANK_LIST(this.REQUEST_COUNT);
            this.initView();
        };
        PvpArenaRankView.prototype.initView = function () {
            this.m_pApopUp.setTitleLabel(GCode(CLEnum.ARENA_RANK));
            this.m_pApopUp.setPvpBgEnabel(true);
            this.m_pList.itemRenderer = com_main.PvpArenaRankCell;
            var tempData = [];
        };
        PvpArenaRankView.prototype.initRankList = function (data) {
            var ApkRankVoList = [];
            var hasMainPlayer = false;
            if (data) {
                for (var key in data.apkRankVoList) {
                    var vo = ApkRankVo.create(data.apkRankVoList[key]);
                    vo.setReward();
                    ApkRankVoList.push(vo);
                }
            }
            var temp;
            this.m_pList.dataProvider = new eui.ArrayCollection(ApkRankVoList);
            var mainPlayerRankVo = null;
            if (data.apkRankVo)
                mainPlayerRankVo = ApkRankVo.create(data.apkRankVo);
            if (!mainPlayerRankVo) {
                // let campVo =  CampModel.getCamp(BGBType.DEF_APK);
                var heroIdList = [];
                var generalWinInfo = [];
                var fight = 0;
                var teamVo = TeamModel.getTeamVoByType(3 /* DEF_APK */);
                for (var i = 0; i < teamVo.teamGeneralData.length; i++) {
                    var data_1 = teamVo.teamGeneralData[i];
                    if (data_1.generalId > 0) {
                        heroIdList.push(data_1.generalId);
                    }
                }
                // if(campVo) 
                // heroIdList = <number[]>campVo.getCamp(1);
                for (var index = 0; index < heroIdList.length; index++) {
                    //GeneralVo
                    var vo = GeneralModel.getOwnGeneral(heroIdList[index]);
                    var temp_1 = {
                        generalId: vo.generalId,
                        level: vo.level,
                        star: vo.star,
                        quality: vo.quality,
                        fight: vo.fight
                    };
                    fight += vo.fight ? vo.fight : 0;
                    generalWinInfo.push(temp_1);
                }
                mainPlayerRankVo = ApkRankVo.create({
                    playerId: RoleData.playerId,
                    playerName: RoleData.nickName,
                    head: RoleData.headId,
                    rank: PvpArenaModel.Rank,
                    force: fight,
                    generalWinInfo: generalWinInfo,
                    countryId: RoleData.countryId,
                });
            }
            mainPlayerRankVo.setReward();
            this.m_pCurRankCell.updateView(mainPlayerRankVo);
        };
        PvpArenaRankView.prototype.updateView = function () {
        };
        PvpArenaRankView.NAME = 'PvpArenaRankView';
        return PvpArenaRankView;
    }(com_main.CView));
    com_main.PvpArenaRankView = PvpArenaRankView;
})(com_main || (com_main = {}));
