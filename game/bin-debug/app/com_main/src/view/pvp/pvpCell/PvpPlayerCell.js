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
    var PvpPlayerCell = /** @class */ (function (_super_1) {
        __extends(PvpPlayerCell, _super_1);
        function PvpPlayerCell(data) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("pvp_arena/PvpPlayerCellSkin.exml");
            if (data)
                _this.setRankVo(data);
            return _this;
        }
        PvpPlayerCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PvpPlayerCell.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            this.m_pBtnChallenge["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.m_pBtnChallenge, this, this.onChallenge); //發送信息
        };
        PvpPlayerCell.prototype.setRankVo = function (data) {
            if (data) {
                this.apkRankVo = data;
                this.updateCell();
                this.visible = true;
            }
            else {
                this.apkRankVo = ApkRankVo.create();
                this.visible = false;
            }
        };
        PvpPlayerCell.prototype.updateCell = function () {
            this.m_pLbPlayerName.text = this.apkRankVo.playerName;
            this.m_pLbRank.text = this.apkRankVo.rank + "";
            this.m_pLbPower.text = this.apkRankVo.force + "";
            this.m_pHead.info = { type: 1, url: this.apkRankVo.head.toString(), official: 0, vip: 0 };
            if (this.apkRankVo.rank > PvpArenaModel.Rank) {
                this.m_pBtnChallenge.currentState = "style6";
                this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            }
            else {
                this.m_pBtnChallenge.currentState = "style1";
                this.m_pBtnChallenge.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            }
        };
        //点击挑战
        PvpPlayerCell.prototype.onChallenge = function () {
            if (this.onClickCell) {
                this.onClickCell(this.apkRankVo.playerId, this.apkRankVo.rank, this.apkRankVo.rank > PvpArenaModel.Rank);
            }
        };
        return PvpPlayerCell;
    }(com_main.CComponent));
    com_main.PvpPlayerCell = PvpPlayerCell;
})(com_main || (com_main = {}));
