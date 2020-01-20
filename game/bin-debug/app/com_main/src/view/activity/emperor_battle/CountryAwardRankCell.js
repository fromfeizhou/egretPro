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
     * 国家战功排行奖励
     */
    var CountryAwardRankCell = /** @class */ (function (_super_1) {
        __extends(CountryAwardRankCell, _super_1);
        function CountryAwardRankCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/emperorBattle/rankReward/CountryAwardRankCellSkin.exml");
            return _this;
        }
        CountryAwardRankCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CountryAwardRankCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CountryAwardRankCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_plbNoAward.visible = false;
        };
        CountryAwardRankCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.Refresh();
        };
        CountryAwardRankCell.prototype.Refresh = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.Refresh_Rank();
            this.Refresh_Country();
            this.Refresh_Award();
            this.Refresh_Militory();
        };
        /**刷新排行 */
        CountryAwardRankCell.prototype.Refresh_Rank = function () {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, this.m_tData.rank);
        };
        /**刷新国家信息 */
        CountryAwardRankCell.prototype.Refresh_Country = function () {
            this.m_comState.stateId = this.m_tData.countryId;
        };
        /**
        * 刷新战功有关的
        */
        CountryAwardRankCell.prototype.Refresh_Militory = function () {
            if (this.m_pMilitoryValue && this.m_tData.value >= 0) {
                this.m_pMilitoryValue.text = this.m_tData.value.toString(10);
            }
        };
        /**刷新奖励 */
        CountryAwardRankCell.prototype.Refresh_Award = function () {
            var militoryAwardCfg = C.XiangyangCountryRankRewardConfig[this.m_tData.rank];
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_RewardRoot.dataProvider = this.m_tCollections;
            this.m_RewardRoot.itemRenderer = com_main.MilitoryAwardRender;
            if (!militoryAwardCfg)
                return;
            var items = Utils.parseCommonItemJson(militoryAwardCfg.reward);
            this.m_tCollections.replaceAll(items);
        };
        return CountryAwardRankCell;
    }(eui.ItemRenderer));
    com_main.CountryAwardRankCell = CountryAwardRankCell;
})(com_main || (com_main = {}));
