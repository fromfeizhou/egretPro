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
    var ComRankNumItem = /** @class */ (function (_super_1) {
        __extends(ComRankNumItem, _super_1);
        function ComRankNumItem(id) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("pvp_arena/ComRankNumItemSkin.exml");
            if (id) {
                _this.m_prank = id;
            }
            return _this;
        }
        ComRankNumItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.setRankNum(this.m_prank);
        };
        ComRankNumItem.prototype.setRankNum = function (rank) {
            RankModel.refreshRankIcon(this.m_pImageRank, this.m_pTextRank, rank);
        };
        ComRankNumItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        return ComRankNumItem;
    }(com_main.CComponent));
    com_main.ComRankNumItem = ComRankNumItem;
})(com_main || (com_main = {}));
