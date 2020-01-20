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
    var TeamFateCell = /** @class */ (function (_super_1) {
        __extends(TeamFateCell, _super_1);
        function TeamFateCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/fate/TeamFateCellSkin.exml");
            return _this;
        }
        TeamFateCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TeamFateCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TeamFateCell.prototype.onDestroy = function () {
        };
        TeamFateCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            var generalId = this.data;
            var genVo = GeneralModel.getOwnGeneral(generalId);
            var generalConfig = C.GeneralConfig[generalId];
            this.m_lbName.text = "" + GLan(generalConfig.name);
            if (generalConfig)
                this.m_lbName.textColor = Utils.getColorOfQuality(generalConfig.qualityLevel);
            this.m_pContent.removeChildren();
            var fateVoList = FateModel.getGeneralFateViewDataByGenId(generalId);
            for (var index = 0; index < fateVoList.length; index++) {
                var fateVo = fateVoList[index];
                var lab = new eui.Label();
                lab.size = 24;
                lab.textColor = 0xaac7ff;
                lab.maxWidth = 1000;
                lab.lineSpacing = 8;
                var curActiveMaxCfg = FateModel.getCurFinshActiveFateCfg(fateVo.id);
                var content = GCodeFromat(CLEnum.FATE_TEAM_TIPS1, curActiveMaxCfg.name, curActiveMaxCfg.Desc);
                if (fateVo.level == 1 && fateVo.status !== FateStatus.FINISH_ACTIVE)
                    content = GCodeFromat(CLEnum.FATE_TEAM_TIPS2, curActiveMaxCfg.name, curActiveMaxCfg.Desc);
                lab.textFlow = Utils.htmlParser(content);
                this.m_pContent.addChild(lab);
            }
        };
        return TeamFateCell;
    }(eui.ItemRenderer));
    com_main.TeamFateCell = TeamFateCell;
})(com_main || (com_main = {}));
