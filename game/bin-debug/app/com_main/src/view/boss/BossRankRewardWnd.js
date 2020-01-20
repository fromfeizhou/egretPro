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
    var BossRankRewardWnd = /** @class */ (function (_super_1) {
        __extends(BossRankRewardWnd, _super_1);
        /**boss排名奖励界面 */
        function BossRankRewardWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = BossRankRewardWnd.NAME;
            _this.rawardList = param.awards;
            _this.currType = param.bossType;
            _this.initApp("boss/BossRankRewardWndSkin.exml");
            return _this;
        }
        BossRankRewardWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        BossRankRewardWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.EXPLOIT_TAB_PM));
            this.m_APopUp.setBottomBorder(false);
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_rankRewardCellList.dataProvider = this.m_pCollection;
            this.m_rankRewardCellList.itemRenderer = RankRewardRender;
            this.m_rankRewardCellList.useVirtualLayout = true;
            this.initPanel();
        };
        /**初始化排名奖励列表 */
        BossRankRewardWnd.prototype.initPanel = function () {
            var rankRewardArr = [];
            for (var i = 0; i < 11; i++) {
                var info = this.rawardList[i];
                var data = { rank: info.rank, reward: info.reward, bossType: this.currType };
                rankRewardArr.push(data);
            }
            this.m_pCollection.replaceAll(rankRewardArr);
        };
        BossRankRewardWnd.NAME = "BossRankRewardWnd";
        return BossRankRewardWnd;
    }(com_main.CView));
    com_main.BossRankRewardWnd = BossRankRewardWnd;
    /**
 * bossItem
 * @class
 * @extends eui.ItemRenderer
 */
    var RankRewardRender = /** @class */ (function (_super_1) {
        __extends(RankRewardRender, _super_1);
        function RankRewardRender() {
            return _super_1.call(this) || this;
        }
        RankRewardRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RankRewardRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.bossRankRewardCell = new com_main.BossRankRewardCell();
            this.addChild(this.bossRankRewardCell);
        };
        RankRewardRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.bossRankRewardCell.setItemInfo(this.m_tData.rank, this.m_tData.reward, this.m_tData.bossType);
        };
        return RankRewardRender;
    }(eui.ItemRenderer));
    com_main.RankRewardRender = RankRewardRender;
})(com_main || (com_main = {}));
