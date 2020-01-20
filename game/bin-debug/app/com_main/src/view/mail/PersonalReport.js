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
     * 邮件个人战报主面板
     */
    var PersonalReport = /** @class */ (function (_super_1) {
        __extends(PersonalReport, _super_1);
        function PersonalReport(type) {
            var _this = _super_1.call(this) || this;
            _this.name = PersonalReport.NAME;
            _this.m_nType = type;
            _this.skinName = Utils.getAppSkin('mail/PersonalReportSkin.exml');
            return _this;
        }
        PersonalReport.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PersonalReport.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PersonalReport.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listWarResult.itemRenderer = PersonWarItem;
            this.m_listWarResult.dataProvider = this.m_tCollection;
        };
        PersonalReport.prototype.refresh = function (info) {
            var data = JSON.parse(info.text);
            this.m_lbArmNum.text = data.teamCount + "";
            this.m_lbDeathNum.text = data.lossSoldiersCount + "";
            this.m_lbKillArmsNum.text = data.killTeamCount + "";
            this.m_lbKillNum.text = data.killSoldiersCount + "";
            // this.m_imgResult.source = data.victory == 1 ? "zb_sl_jpg" : "zb_zb_jpg";
            //军功奖励
            this.m_itemAward.setItemInfo(PropEnum.MILITARY_EXPLOIT, data.militaryMerits);
            var res = [];
            for (var i = 0; i < data.warReportDataList.length; i++) {
                var tmp = data.warReportDataList[i];
                res.push(tmp);
            }
            this.m_tCollection.removeAll();
            this.m_tCollection.replaceAll(res);
        };
        PersonalReport.NAME = 'PersonalReport';
        return PersonalReport;
    }(com_main.CComponent));
    com_main.PersonalReport = PersonalReport;
    /**
     * 对抗战报
     */
    var PersonWarItem = /** @class */ (function (_super_1) {
        __extends(PersonWarItem, _super_1);
        function PersonWarItem() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        PersonWarItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PersonWarItem.prototype.onDestroy = function () {
            // this.clearHeadItem(this.m_groupGenerals0);
            // this.clearHeadItem(this.m_groupGenerals1);
            egret.Tween.removeTweens(this);
            com_main.EventManager.removeEventListeners(this);
        };
        PersonWarItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        PersonWarItem.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_lbIndex.text = GCodeFromat(CLEnum.MAIL_TITLE_FIGHT, this.itemIndex + 1);
                var lData = void 0;
                var rData = void 0;
                var bWin = false;
                if (this.m_tData.warReportTeamDataAtk.countryId == RoleData.countryId) {
                    lData = this.m_tData.warReportTeamDataAtk;
                    rData = this.m_tData.warReportTeamDataDef;
                    bWin = this.m_tData.isAtkVictory == 1;
                }
                else {
                    lData = this.m_tData.warReportTeamDataDef;
                    rData = this.m_tData.warReportTeamDataAtk;
                    bWin = this.m_tData.isAtkVictory == 0;
                }
                this.setItemView(lData, 0, bWin);
                this.setItemView(rData, 1, !bWin);
                this.m_imgResult.source = bWin ? 'lb_ty1_s_png' : 'lb_ty4_b_png';
            }
        };
        /**设置单个item显示 */
        PersonWarItem.prototype.setItemView = function (data, fix, isWin) {
            var comState = this["m_comState" + fix];
            comState.stateId = data.countryId;
            var labName = this["m_playerName" + fix];
            labName.text = data.playerName;
            var labTeamName = this["m_armsName" + fix];
            labTeamName.text = data.isNpc == 1 ? GCode(CLEnum.WOR_CFJ) : GCode(CLEnum.CAMP_ARMY) + Global.getNumber(data.teamId);
            var labPower = this["m_power" + fix];
            labPower.text = data.teamForce.toString();
            var labPro = this["m_lbArmsCount" + fix];
            labPro.text = data.surplusSoldiersCount + "/" + data.maxSoldiersCount;
            var imgPro = this["m_imgPro" + fix];
            imgPro.width = PersonWarItem.PRO_WID * (data.surplusSoldiersCount / data.maxSoldiersCount);
            // let group: eui.Group = this[`m_groupGenerals${fix}`];
            // this.clearHeadItem(group);
            // for (let i = 0; i < data.generalList.length; i++) {
            // 	let info = data.generalList[i];
            // 	let item = GeneralHeadRender.create('arena');
            // 	NodeUtils.setScale(item, 0.8);
            // 	item.setGenViewInfo(info.generalId, info.level, info.star, info.quality, info.generalName)
            // 	// item.enabled = !isWin;
            // 	Utils.isGray(!isWin, item);
            // 	group.addChild(item);
            // }
        };
        /**回收头像 */
        PersonWarItem.prototype.clearHeadItem = function (group) {
            if (!group)
                return;
            while (group.numChildren > 0) {
                var item = group.getChildAt(0);
                Utils.isGray(false, item);
                item.onDestroy();
            }
        };
        PersonWarItem.PRO_WID = 223;
        return PersonWarItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
