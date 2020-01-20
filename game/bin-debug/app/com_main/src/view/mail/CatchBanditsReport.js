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
     * 邮件剿匪战报主面板
     */
    var CatchBanditsReport = /** @class */ (function (_super_1) {
        __extends(CatchBanditsReport, _super_1);
        function CatchBanditsReport(type) {
            var _this = _super_1.call(this) || this;
            _this.name = CatchBanditsReport.NAME;
            _this.m_nType = type;
            _this.skinName = Utils.getAppSkin('mail/CatchBanditsReportSkin.exml');
            return _this;
        }
        CatchBanditsReport.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CatchBanditsReport.prototype.onDestroy = function () {
            this.clearHeadItem(this.m_groupGenerals0);
            this.clearHeadItem(this.m_groupGenerals1);
            _super_1.prototype.onDestroy.call(this);
        };
        CatchBanditsReport.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CatchBanditsReport.prototype.refresh = function (info) {
            var data = JSON.parse(info.text);
            this.m_imgTitle.source = data.victory == 1 ? 'zb_sl_jpg' : 'zb_zb_jpg';
            this.m_imgResult.source = data.victory == 1 ? "lb_ty1_s_png" : "lb_ty4_b_png";
            var rewards = Utils.parseCommonItemJson(data.reward);
            this.m_groupReward.removeChildren();
            for (var i = 0; i < rewards.length; i++) {
                var item = com_main.ComItemNew.create('count');
                NodeUtils.setScale(item, 0.9);
                item.setItemInfo(rewards[i].itemId, rewards[i].count);
                this.m_groupReward.addChild(item);
            }
            if (rewards.length == 0) {
                this.currentState = 'empty';
            }
            else {
                this.currentState = 'base';
            }
            this.m_labCity.text = WorldModel.getCityName(data.cityId);
            this.setItemView(data.atkWildMonsterReportTeamData, 0, data.victory == 1);
            this.setItemView(data.defWildMonsterReportTeamData, 1, data.victory == 0);
        };
        /**设置单个item显示 */
        CatchBanditsReport.prototype.setItemView = function (data, fix, isWin) {
            var countryId = data.isNpc == 1 ? 4 : RoleData.countryId;
            var comState = this["m_comState" + fix];
            comState.stateId = countryId;
            var labName = this["m_playerName" + fix];
            labName.text = data.playerName;
            var labTeamName = this["m_armsName" + fix];
            labTeamName.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(data.teamId);
            var labPower = this["m_power" + fix];
            labPower.text = data.teamForce.toString();
            var labPro = this["m_lbArmsCount" + fix];
            labPro.text = data.surplusSoldiersCount + "/" + data.maxSoldiersCount;
            var imgPro = this["m_imgPro" + fix];
            imgPro.width = CatchBanditsReport.PRO_WID * (data.surplusSoldiersCount / data.maxSoldiersCount);
            var group = this["m_groupGenerals" + fix];
            this.clearHeadItem(group);
            for (var i = 0; i < data.generalList.length; i++) {
                var info = data.generalList[i];
                var item = com_main.GeneralHeadRender.create('arena');
                NodeUtils.setScale(item, 0.8);
                item.setGenViewInfo(info.generalId, info.level, info.star, info.quality, info.generalName);
                // item.enabled = !isWin;
                Utils.isGray(!isWin, item);
                group.addChild(item);
            }
        };
        /**回收头像 */
        CatchBanditsReport.prototype.clearHeadItem = function (group) {
            if (!group)
                return;
            while (group.numChildren > 0) {
                var item = group.getChildAt(0);
                Utils.isGray(false, item);
                item.onDestroy();
            }
        };
        CatchBanditsReport.NAME = 'CatchBanditsReport';
        CatchBanditsReport.PRO_WID = 223;
        return CatchBanditsReport;
    }(com_main.CComponent));
    com_main.CatchBanditsReport = CatchBanditsReport;
})(com_main || (com_main = {}));
