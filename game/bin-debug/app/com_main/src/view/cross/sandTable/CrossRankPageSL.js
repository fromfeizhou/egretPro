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
     * 个人排名奖 军团荣誉排名
     */
    var CrossRankPageSL = /** @class */ (function (_super_1) {
        __extends(CrossRankPageSL, _super_1);
        function CrossRankPageSL(type) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossRankPageSL.NAME;
            _this.initType(type);
            _this.initApp("cross/sandTable/CrossRankPageSLSkin.exml");
            return _this;
        }
        CrossRankPageSL.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CrossRankPageSL.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        CrossRankPageSL.prototype.initType = function (type) {
            this.m_nType = type;
            switch (this.m_nType) {
                case RankType.CROSS_SERVER_PLAYER_RANK: {
                    this.currentState = 'single';
                    break;
                }
                case RankType.CROSS_SERVER_UNION_RANK: {
                    this.currentState = 'legion';
                    break;
                }
            }
            this.validateNow();
        };
        CrossRankPageSL.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_itemList.itemRenderer = CrossRankCell;
            this.m_itemList.dataProvider = this.m_tCollections;
            this.Refresh();
        };
        /**刷新页面 */
        CrossRankPageSL.prototype.Refresh = function () {
            switch (this.m_nType) {
                case RankType.CROSS_SERVER_PLAYER_RANK: {
                    this.refreshPlayer();
                    break;
                }
                case RankType.CROSS_SERVER_UNION_RANK: {
                    this.refreshGuild();
                    break;
                }
            }
        };
        /**刷新个人 */
        CrossRankPageSL.prototype.refreshPlayer = function () {
            var _a = RankModel.getNormalData(RankType.CROSS_SERVER_PLAYER_RANK), list = _a[0], owner = _a[1];
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollections.replaceAll(res);
            }
        };
        /**刷新军团 */
        CrossRankPageSL.prototype.refreshGuild = function () {
            var _a = RankModel.getCrossLegionRankData(), list = _a[0], owner = _a[1];
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollections.replaceAll(res);
            }
        };
        CrossRankPageSL.NAME = 'CrossRankPageSL';
        return CrossRankPageSL;
    }(com_main.CView));
    com_main.CrossRankPageSL = CrossRankPageSL;
    /**
     * 个人排行奖 军团荣誉排名
     */
    var CrossRankCell = /** @class */ (function (_super_1) {
        __extends(CrossRankCell, _super_1);
        function CrossRankCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/cross/sandTable/CrossRankCellSkin.exml");
            return _this;
        }
        CrossRankCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CrossRankCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CrossRankCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (this.m_PlayerHead)
                com_main.EventManager.addTouchTapListener(this.m_PlayerHead, this, this.onShowPlayerIntroView);
        };
        CrossRankCell.prototype.onShowPlayerIntroView = function () {
            var data = this.m_tData.param;
            // if (data && data.playerHead && data.playerHead.playerId != RoleData.playerId) {
            if (data && data.playerHead) {
                NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(data.playerHead.playerId);
            }
        };
        CrossRankCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_RewardRoot.dataProvider = this.m_tCollections;
            this.m_RewardRoot.itemRenderer = com_main.MilitoryAwardRender;
            this.Refresh();
        };
        CrossRankCell.prototype.Refresh = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.refreshView();
            this.Refresh_Rank();
            this.Refresh_Award();
            this.Refresh_Militory();
        };
        CrossRankCell.prototype.refreshView = function () {
            switch (this.m_tData.type) {
                case RankType.CROSS_SERVER_PLAYER_RANK: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'single';
                        this.commitProperties();
                    }
                    this.Refresh_Player();
                    break;
                }
                case RankType.CROSS_SERVER_UNION_RANK: {
                    if (!this.m_bInit) {
                        this.m_bInit = true;
                        this.currentState = 'legion';
                        this.commitProperties();
                    }
                    this.Refresh_Legion();
                    break;
                }
            }
        };
        /**刷新排行 */
        CrossRankCell.prototype.Refresh_Rank = function () {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, this.m_tData.param.rank);
        };
        /**刷新玩家信息 */
        CrossRankCell.prototype.Refresh_Player = function () {
            var data = this.m_tData.param;
            var headInfo = data.playerHead;
            this.m_PlayerName.text = headInfo.playerName;
            this.m_PlayerHead.info = headInfo;
        };
        /**刷新联盟排行 */
        CrossRankCell.prototype.Refresh_Legion = function () {
            var data = this.m_tData.param;
            this.m_labName.text = data.legionName;
            this.m_imgLegion.source = LegionModel.getLegionCountryImage(data.countryId);
        };
        /**
        * 刷新战功有关的
        */
        CrossRankCell.prototype.Refresh_Militory = function () {
            if (this.m_pMilitoryValue && this.m_tData.param.value >= 0) {
                this.m_pMilitoryValue.text = this.m_tData.param.value.toString(10);
            }
        };
        /**刷新奖励 */
        CrossRankCell.prototype.Refresh_Award = function () {
            // this.m_plbNoAward.visible = (this.m_tData.param.playerHead.playerId == RoleData.playerId) && (this.m_tData.param.rank == 0 || this.m_tData.param.rank == -1);
            this.m_plbNoAward.visible = false;
            var realType = 1 /* SINGLE */;
            if (this.m_tData.type == RankType.CROSS_SERVER_PLAYER_RANK) {
                realType = 1 /* SINGLE */;
            }
            else if (this.m_tData.type == RankType.CROSS_SERVER_UNION_RANK) {
                realType = 2 /* LEGION */;
            }
            var militoryAwardCfg = CrossModel.getCrossServerRewardConfig(realType, this.m_tData.param.rank);
            if (!militoryAwardCfg)
                return;
            var items = militoryAwardCfg.reward;
            this.m_tCollections.replaceAll(items);
        };
        return CrossRankCell;
    }(eui.ItemRenderer));
    com_main.CrossRankCell = CrossRankCell;
})(com_main || (com_main = {}));
