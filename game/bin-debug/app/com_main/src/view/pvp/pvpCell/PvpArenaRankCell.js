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
    var PvpArenaRankCell = /** @class */ (function (_super_1) {
        __extends(PvpArenaRankCell, _super_1);
        function PvpArenaRankCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("pvp_arena/PvpArenaRankCellSkin.exml"); //Utils.getSkinName("app/pvp/pvpCell/PvpArenaRankCellSkin.exml");
            return _this;
        }
        PvpArenaRankCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.init();
            this.cacheAsBitmap = true;
        };
        PvpArenaRankCell.prototype.init = function () {
            this.generalList = [];
            for (var i = 0; i < 5; i++) {
                this.generalList.push(this["m_pGeneral" + i]);
            }
        };
        PvpArenaRankCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.updateView(this.data);
        };
        PvpArenaRankCell.prototype.updateView = function (data) {
            if (!data)
                return;
            var rankVo = data;
            var generalDatas = rankVo.generalWinInfo;
            for (var i = 0; i < this.generalList.length; i++) {
                if (generalDatas[i]) {
                    this.generalList[i].setGeneralArena(generalDatas[i]);
                    this.generalList[i].visible = true;
                }
                else
                    this.generalList[i].setGeneralArena(null);
                //this.generalList[i].visible = false;
            }
            this.m_pLbPlayerName.text = rankVo.playerName;
            this.m_pRankItem.setRankNum(rankVo.rank);
            this.m_comState.stateId = rankVo.countryId;
            this.m_pLPower.text = CommonUtils.numOutLenght(data.force);
            for (var index = 0; index < 2; index++) {
                var itemView = this["m_pReward_" + index];
                var rewardList = rankVo.rewardList;
                if (rewardList && rewardList[index]) {
                    itemView.setItemInfo(rewardList[index].itemId, rewardList[index].count);
                    if (!itemView.visible)
                        itemView.visible = true;
                }
                else {
                    itemView.visible = false;
                }
            }
        };
        return PvpArenaRankCell;
    }(eui.ItemRenderer));
    com_main.PvpArenaRankCell = PvpArenaRankCell;
})(com_main || (com_main = {}));
