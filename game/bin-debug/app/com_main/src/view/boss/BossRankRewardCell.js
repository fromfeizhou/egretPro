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
    var BossRankRewardCell = /** @class */ (function (_super_1) {
        __extends(BossRankRewardCell, _super_1);
        function BossRankRewardCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/boss/BossRankRewardCellSkin.exml");
            return _this;
        }
        BossRankRewardCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BossRankRewardCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        BossRankRewardCell.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
        };
        /**设置排名奖励信息 */
        BossRankRewardCell.prototype.setItemInfo = function (rank, reward, type) {
            this.m_rankingCoin.source = "";
            // let bossRank = JSON.parse(rank);
            RankModel.refreshBossRankIcon(this.m_rankingCoin, this.m_rankingNum, rank, type);
            this.setitemlist(reward);
        };
        BossRankRewardCell.prototype.setitemlist = function (reward) {
            Utils.removeAllChild(this.m_rItemsRoot);
            var tmpList = Utils.parseCommonItemJson(reward);
            for (var i = 0; i < tmpList.length; i++) {
                var info = tmpList[i];
                var itemView = com_main.ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                itemView.scaleX = 0.75;
                itemView.scaleY = 0.75;
                this.m_rItemsRoot.addChild(itemView);
            }
        };
        return BossRankRewardCell;
    }(com_main.CComponent));
    com_main.BossRankRewardCell = BossRankRewardCell;
})(com_main || (com_main = {}));
