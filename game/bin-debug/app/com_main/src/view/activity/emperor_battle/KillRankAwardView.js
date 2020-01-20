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
     * 个人战功排行奖励
     */
    var KillRankAwardView = /** @class */ (function (_super_1) {
        __extends(KillRankAwardView, _super_1);
        function KillRankAwardView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = KillRankAwardView.NAME;
            // this.width = width;
            // this.height = height;
            _this.initApp("activity/emperorBattle/rankReward/KillRankAwardRankViewSkin.exml");
            return _this;
        }
        KillRankAwardView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        KillRankAwardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        KillRankAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pRankList.itemRenderer = KillRankAwardCell;
            this.m_pRankList.dataProvider = this.m_tCollections;
            this.Refresh();
        };
        /**刷新页面 */
        KillRankAwardView.prototype.Refresh = function () {
            this.Refresh_SelfItem();
            this.Refresh_ItemDatas();
        };
        /**刷新自己的排名数据 */
        KillRankAwardView.prototype.Refresh_SelfItem = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            var ownerPlayer = vo.getPlayerRankData();
            this.m_SelfItem.visible = ownerPlayer != null;
            // this.m_pRScroller.bottom = 132;
            if (this.m_SelfItem.visible) {
                this.m_SelfItem.data = ownerPlayer;
            }
        };
        /**刷新排行榜列表数据 */
        KillRankAwardView.prototype.Refresh_ItemDatas = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            var list = vo.getRankData();
            if (isNull(list))
                return;
            var awardRankList = [];
            for (var i = 0; i < list.length; i++) {
                awardRankList.push(list[i]);
            }
            this.m_tCollections.replaceAll(awardRankList);
        };
        KillRankAwardView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        KillRankAwardView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        KillRankAwardView.NAME = 'KillRankAwardView';
        return KillRankAwardView;
    }(com_main.CView));
    com_main.KillRankAwardView = KillRankAwardView;
    /**
     * 个人排行奖励
     */
    var KillRankAwardCell = /** @class */ (function (_super_1) {
        __extends(KillRankAwardCell, _super_1);
        function KillRankAwardCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/emperorBattle/rankReward/KillRankAwardCellSkin.exml");
            return _this;
        }
        KillRankAwardCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        KillRankAwardCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        KillRankAwardCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        KillRankAwardCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.Refresh();
        };
        KillRankAwardCell.prototype.Refresh = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.Refresh_Rank();
            this.Refresh_Player();
            this.Refresh_Country();
            this.Refresh_Award();
            this.Refresh_Militory();
            // this.refreshLegion();
        };
        /**刷新排行 */
        KillRankAwardCell.prototype.Refresh_Rank = function () {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, this.m_tData.rank);
        };
        /**刷新玩家信息 */
        KillRankAwardCell.prototype.Refresh_Player = function () {
            var headInfo = this.m_tData.playerHead;
            this.m_PlayerName.text = headInfo.playerName;
            this.m_PlayerHead.info = headInfo;
        };
        /**刷新国家信息 */
        KillRankAwardCell.prototype.Refresh_Country = function () {
            this.m_comState.stateId = this.m_tData.playerHead.countryId;
        };
        /**
        * 刷新战功有关的
        */
        KillRankAwardCell.prototype.Refresh_Militory = function () {
            if (this.m_pMilitoryValue && this.m_tData.value >= 0) {
                this.m_pMilitoryValue.text = this.m_tData.value.toString(10);
            }
        };
        /**刷新奖励 */
        KillRankAwardCell.prototype.Refresh_Award = function () {
            this.m_plbNoAward.visible = (this.m_tData.playerHead.playerId == RoleData.playerId) && (this.m_tData.rank == 0 || this.m_tData.rank == -1);
            var militoryAwardCfg = C.XiangyangPlayerRankRewardConfig[this.m_tData.rank];
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_RewardRoot.dataProvider = this.m_tCollections;
            this.m_RewardRoot.itemRenderer = com_main.MilitoryAwardRender;
            if (!militoryAwardCfg)
                return;
            var items = Utils.parseCommonItemJson(militoryAwardCfg.reward);
            this.m_tCollections.replaceAll(items);
        };
        return KillRankAwardCell;
    }(eui.ItemRenderer));
    com_main.KillRankAwardCell = KillRankAwardCell;
})(com_main || (com_main = {}));
