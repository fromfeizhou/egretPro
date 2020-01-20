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
     * 排行榜单项
     */
    var RankItemRender = /** @class */ (function (_super_1) {
        __extends(RankItemRender, _super_1);
        function RankItemRender() {
            return _super_1.call(this) || this;
        }
        RankItemRender.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RankItemRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        RankItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBtnMb.setTitleLabel('膜拜');
            if (this.m_comHead)
                com_main.EventManager.addTouchTapListener(this.m_comHead, this, this.onShowPlayerIntroView);
            if (this.m_genHead)
                com_main.EventManager.addTouchTapListener(this.m_genHead, this, this.onShowPlayerIntroView2);
            if (this.m_imgLegion)
                com_main.EventManager.addTouchTapListener(this.m_imgLegion, this, this.onShowLegionIntroView);
            if (this.m_pBtnMb) //膜拜
                com_main.EventManager.addTouchTapListener(this.m_pBtnMb, this, this.onMoBaiHander);
        };
        RankItemRender.prototype.onShowPlayerIntroView = function () {
            var data = this.m_tData.param;
            if (data && data.playerHead && data.playerHead.playerId != RoleData.playerId) {
                NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(data.playerHead.playerId);
            }
        };
        RankItemRender.prototype.onShowPlayerIntroView2 = function () {
            var data = this.m_tData.param;
            if (data && data.playerId && data.playerId != RoleData.playerId) {
                GeneralModel.getClickGenInfo(data);
                GeneralProxy.send_GENERAL_DETAIL(data.playerId, data.heroId);
            }
        };
        RankItemRender.prototype.onShowLegionIntroView = function () {
            var data = this.m_tData.param;
            if (data && data.legionId && data.legionId != RoleData.alliance) {
                LegionModel.getClickGuildInfo(data);
                NormalProxy.C2S_RANK_GUILD(data.legionId);
            }
        };
        RankItemRender.prototype.onMoBaiHander = function () {
            var player = this.m_tData.param.playerHead;
            if (player && player.playerId && player.playerId != RoleData.playerId) {
                WorshipProxy.send_C2S_WORSHIP(WorshipType.FIGHT_RANK, this.m_tData.param.rank);
            }
            else {
                EffectUtils.showTips('不能膜拜自己', 1, true);
            }
        };
        RankItemRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (!this.data)
                return;
            this.m_tData = this.data;
            this.refreshView();
        };
        RankItemRender.prototype.refreshView = function () {
            switch (this.m_tData.type) {
                case RankType.PLAYER: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'power';
                        this.commitProperties();
                    }
                    this.refrehPower();
                    break;
                }
                case RankType.GENREAL:
                case RankType.ONEHERO: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'general';
                        this.commitProperties();
                    }
                    this.refrehGeneral();
                    break;
                }
                case RankType.LEGION: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'legion';
                        this.commitProperties();
                    }
                    this.refrehLegion();
                    break;
                }
                case RankType.COUNTRY: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'country';
                        this.commitProperties();
                    }
                    this.refreshCountry();
                    break;
                }
            }
        };
        /**刷新战力排行 */
        RankItemRender.prototype.refrehPower = function () {
            var data = this.m_tData.param;
            this.refreshRankIcon(data.rank);
            this.m_comHead.info = data.playerHead;
            this.m_labName.text = data.playerHead.playerName;
            this.m_comState.stateId = data.playerHead.countryId;
            this.m_labPower.text = data.value.toString(10);
            if (data.rank <= 3 && data.rank > -1) {
                var mobaiVo = WorshipModel.getStateByType(WorshipType.FIGHT_RANK); //排行榜id获取是否可以膜拜
                if (mobaiVo) {
                    RedPointModel.AddInfoListener(this.m_pBtnMb, { x: this.m_pBtnMb.width - 22, y: -3 }, [RedEvtType.FIGHT_RANK_WORSHIP], 3);
                    this.m_pBtnMb.visible = true;
                    this.m_labMobai.visible = false;
                }
                else {
                    this.m_pBtnMb.visible = false;
                    this.m_labMobai.visible = true;
                    var info = WorshipModel.getWorshipData(WorshipType.FIGHT_RANK, data.rank);
                    if (info) {
                        this.m_labMobai.text = info.beWorshipCount <= 0 ? '膜拜人数：1' : '膜拜人数：' + info.beWorshipCount;
                    }
                    else {
                        this.m_labMobai.text = '膜拜人数：1';
                    }
                }
            }
            else {
                this.m_pBtnMb.visible = false;
                this.m_labMobai.visible = false;
            }
        };
        RankItemRender.prototype.refreshMobi = function (visible) {
            if (visible === void 0) { visible = true; }
            this.m_pBtnMb.visible = visible;
            this.m_labMobai.visible = visible;
        };
        /**刷新武将排行 */
        RankItemRender.prototype.refrehGeneral = function () {
            var data = this.m_tData.param;
            this.refreshRankIcon(data.rank);
            this.m_genHead.setGenViewInfo(data.heroId);
            GeneralModel.setLabGaneralName(data.heroId, this.m_labName);
            this.m_labPower.text = data.value.toString(10);
            this.m_comState.stateId = data.countryId;
            this.m_labPlayerName.text = data.nickName;
        };
        /**刷新工会排行 */
        RankItemRender.prototype.refrehLegion = function () {
            var data = this.m_tData.param;
            this.refreshRankIcon(data.rank);
            this.m_labName.text = data.legionName;
            this.m_labPower.text = data.value.toString(10);
            this.m_comState.stateId = data.countryId;
            this.m_imgLegion.source = LegionModel.getLegionCountryImage(data.countryId);
        };
        /**国家排行 */
        RankItemRender.prototype.refreshCountry = function () {
            var data = this.m_tData.param;
            this.refreshRankIcon(this.m_tData.rank);
            this.m_labCapi.text = "" + data.citySize[CityLevel.CAPITAL - 1];
            this.m_labtown.text = "" + data.citySize[CityLevel.TOWN - 1];
            this.m_labCoun.text = "" + data.citySize[CityLevel.COUNTY - 1];
            this.m_labPlayerName.visible = data.kingHead != null;
            this.m_labPlayerName.text = data.kingHead ? "" + data.kingHead.playerName : '';
            this.m_comState.stateId = data.countryId;
            this.m_comHead.info = data.kingHead;
        };
        /**刷新排名图标 */
        RankItemRender.prototype.refreshRankIcon = function (rank) {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, rank);
        };
        return RankItemRender;
    }(eui.ItemRenderer));
    com_main.RankItemRender = RankItemRender;
})(com_main || (com_main = {}));
