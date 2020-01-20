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
    var CrossServerJobCell = /** @class */ (function (_super_1) {
        __extends(CrossServerJobCell, _super_1);
        function CrossServerJobCell() {
            var _this = _super_1.call(this) || this;
            _this.name = CrossServerJobCell.NAME;
            _this.skinName = Utils.getSkinName("app/cross/component/CrosssServerJobCellSkin.exml");
            return _this;
        }
        CrossServerJobCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CrossServerJobCell.prototype.Init = function (data, jobName, serverId) {
            if (jobName === void 0) { jobName = ""; }
            if (serverId === void 0) { serverId = 0; }
            this.m_commanderDataVo = data;
            this.m_jName = jobName;
            this.m_server = serverId;
            this.Refresh();
        };
        CrossServerJobCell.prototype.Refresh = function () {
            this.Refresh_RoleHead();
            this.Refresh_JobName();
            this.Refresh_PlayerName();
            this.Refresh_Troop();
        };
        CrossServerJobCell.prototype.Refresh_RoleHead = function () {
            if (this.m_commanderDataVo != null) {
                this.m_RoleHead.info = { type: 1, url: this.m_commanderDataVo.head.toString(), official: 0, vip: this.m_commanderDataVo.vipLevel };
            }
            else {
                this.m_RoleHead.info = null;
            }
        };
        CrossServerJobCell.prototype.Refresh_JobName = function () {
            this.m_JobName.text = this.m_jName;
        };
        CrossServerJobCell.prototype.Refresh_Troop = function () {
            if (this.m_commanderDataVo == null || this.m_commanderDataVo.troopNum == 0) {
                this.m_troopCout.text = GCode(CLEnum.CROSS_TIPS1);
                return;
            }
            this.m_troopCout.text = this.m_server == 0 ? GCodeFromat(CLEnum.CROSS_GEN_TROOP, this.m_commanderDataVo.troopNum) : GCodeFromat(CLEnum.CROSS_KING_TROOP, this.m_server, this.m_commanderDataVo.troopNum);
        };
        CrossServerJobCell.prototype.Refresh_PlayerName = function () {
            if (this.m_commanderDataVo == null || Utils.isNullOrEmpty(this.m_commanderDataVo.nickName)) {
                this.m_PlayerName.text = GCode(CLEnum.CROSS_TIPS1);
            }
            else {
                this.m_PlayerName.text = this.m_commanderDataVo.nickName;
            }
        };
        CrossServerJobCell.NAME = 'CountryJobCell';
        return CrossServerJobCell;
    }(com_main.CComponent));
    com_main.CrossServerJobCell = CrossServerJobCell;
})(com_main || (com_main = {}));
